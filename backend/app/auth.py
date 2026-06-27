"""Firebase token verification and user resolution."""
import structlog
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth as firebase_auth, credentials, initialize_app, get_app
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.config import get_settings
from app.database import get_db
from app.models import User

log = structlog.get_logger(__name__)
settings = get_settings()

# Initialize Firebase Admin SDK once
try:
    get_app()
except ValueError:
    if settings.firebase_service_account_path:
        cred = credentials.Certificate(settings.firebase_service_account_path)
    else:
        # Use application default credentials (works in GCP / CI environments)
        cred = credentials.ApplicationDefault()
    initialize_app(cred, {"projectId": settings.firebase_project_id})

bearer_scheme = HTTPBearer(auto_error=False)


async def verify_firebase_token(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> dict:
    """Verify the Firebase ID token and return decoded claims."""
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    try:
        decoded = firebase_auth.verify_id_token(token, check_revoked=True)
        return decoded
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
        )
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except Exception as exc:
        log.warning("firebase_token_invalid", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )


async def get_current_user(
    decoded_token: dict = Depends(verify_firebase_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Resolve Firebase UID to a User DB record, creating one if not found."""
    firebase_uid = decoded_token["uid"]
    email = decoded_token.get("email", "")
    name = decoded_token.get("name")
    photo = decoded_token.get("picture")
    email_verified = decoded_token.get("email_verified", False)

    result = await db.execute(select(User).where(User.firebase_uid == firebase_uid))
    user = result.scalar_one_or_none()

    if user is None:
        user = User(
            firebase_uid=firebase_uid,
            email=email,
            display_name=name,
            photo_url=photo,
            email_verified=email_verified,
        )
        db.add(user)
        await db.flush()
        log.info("user_created", firebase_uid=firebase_uid, email=email)
    else:
        # Sync profile fields if changed
        if user.email != email or user.display_name != name or user.email_verified != email_verified:
            user.email = email
            user.display_name = name
            user.photo_url = photo
            user.email_verified = email_verified
            await db.flush()

    return user

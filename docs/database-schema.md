# Database Schema

PostgreSQL database: `glotsync`

All timestamps are stored in UTC with timezone.

---

## users

| Column | Type | Description |
|---|---|---|
| id | UUID PK | Auto-generated UUID |
| firebase_uid | VARCHAR(128) UNIQUE | Firebase Authentication UID |
| email | VARCHAR(320) | User email address |
| display_name | VARCHAR(100) | Display name |
| photo_url | VARCHAR(1024) | Profile picture URL |
| email_verified | BOOLEAN | Whether email is verified |
| plan | VARCHAR(20) | Plan tier: free / starter / pro / enterprise |
| storage_used_bytes | BIGINT | Running total of storage used |
| total_uploads | INTEGER | Total files uploaded |
| completed_jobs | INTEGER | Total transcriptions completed |
| is_active | BOOLEAN | Account active status |
| created_at | TIMESTAMPTZ | Account creation time |
| updated_at | TIMESTAMPTZ | Last update time |

---

## files

| Column | Type | Description |
|---|---|---|
| id | UUID PK | File UUID |
| user_id | UUID FK → users.id | Owner |
| original_name | VARCHAR(512) | Original filename from upload |
| filename | VARCHAR(512) | Sanitized filename |
| mime_type | VARCHAR(128) | Detected MIME type |
| size_bytes | BIGINT | File size in bytes |
| s3_key | VARCHAR(1024) UNIQUE | Full S3 object key |
| is_deleted | BOOLEAN | Soft delete flag |
| created_at | TIMESTAMPTZ | Upload time |
| updated_at | TIMESTAMPTZ | Last update time |

---

## jobs

| Column | Type | Description |
|---|---|---|
| id | UUID PK | Job UUID |
| file_id | UUID FK → files.id UNIQUE | Associated file (1:1) |
| status | ENUM | queued / uploading / processing / completed / failed |
| progress | INTEGER | 0–100 percentage |
| error_message | TEXT | Error details if failed |
| transcript_id | UUID | FK to transcripts.id once complete |
| duration_seconds | FLOAT | Audio/video duration |
| word_count | INTEGER | Words in transcript |
| language | VARCHAR(10) | Detected language code |
| created_at | TIMESTAMPTZ | Job creation time |
| updated_at | TIMESTAMPTZ | Last update time |
| completed_at | TIMESTAMPTZ | Completion time |

---

## transcripts

| Column | Type | Description |
|---|---|---|
| id | UUID PK | Transcript UUID |
| job_id | UUID FK → jobs.id UNIQUE | Associated job |
| file_id | UUID FK → files.id | Associated file |
| text | TEXT | Full transcript text |
| segments_json | TEXT | JSON array of segment objects |
| language | VARCHAR(10) | Language code |
| duration_seconds | FLOAT | Duration |
| word_count | INTEGER | Word count |
| s3_txt_key | VARCHAR(1024) | S3 key for .txt file |
| s3_srt_key | VARCHAR(1024) | S3 key for .srt file |
| s3_vtt_key | VARCHAR(1024) | S3 key for .vtt file |
| created_at | TIMESTAMPTZ | Creation time |

---

## sessions

| Column | Type | Description |
|---|---|---|
| id | UUID PK | Session UUID |
| user_id | UUID FK → users.id | User |
| firebase_id_token_jti | VARCHAR(256) | JWT ID for revocation |
| ip_address | VARCHAR(45) | Client IP (IPv4/IPv6) |
| user_agent | VARCHAR(512) | Browser user agent |
| created_at | TIMESTAMPTZ | Session start |
| last_seen_at | TIMESTAMPTZ | Last activity |
| revoked | BOOLEAN | Whether revoked |

---

## audit_logs

| Column | Type | Description |
|---|---|---|
| id | UUID PK | Log entry UUID |
| user_id | UUID FK → users.id | User (nullable) |
| action | VARCHAR(64) | Action name (e.g., file_upload) |
| resource_type | VARCHAR(32) | Resource type (e.g., file) |
| resource_id | VARCHAR(128) | Resource identifier |
| ip_address | VARCHAR(45) | Client IP |
| extra | TEXT | JSON blob for extra context |
| created_at | TIMESTAMPTZ | Log time (indexed) |

---

## Indexes

```sql
CREATE UNIQUE INDEX ix_users_firebase_uid ON users(firebase_uid);
CREATE INDEX ix_files_user_id ON files(user_id);
CREATE INDEX ix_sessions_user_id ON sessions(user_id);
CREATE INDEX ix_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX ix_audit_logs_created_at ON audit_logs(created_at);
```

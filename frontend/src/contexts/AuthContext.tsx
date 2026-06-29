import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import {
  type User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  updateProfile,
  updatePassword,
  deleteUser,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { queryClient } from '@/lib/queryClient'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string, remember: boolean) => Promise<void>
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
  logout: () => Promise<void>
  updateDisplayName: (name: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  // Track the previous user UID so we can flush the cache on user switch
  const prevUidRef = useRef<string | null>(null)

  useEffect(() => {
    // Handle the redirect result when the user returns from Google sign-in.
    // This fires when signInWithRedirect() was used as a popup fallback.
    getRedirectResult(auth).catch(() => {
      // Silently ignore — no redirect was in progress
    })

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const newUid = firebaseUser?.uid ?? null

      // If the user changed (logout or switch account), clear React Query cache
      // so stale data from the previous session never leaks to the next user.
      if (prevUidRef.current !== null && prevUidRef.current !== newUid) {
        queryClient.clear()
      }
      prevUidRef.current = newUid

      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = useCallback(async () => {
    await setPersistence(auth, browserLocalPersistence)

    try {
      // Try popup first (best UX)
      await signInWithPopup(auth, googleProvider)
    } catch (popupError) {
      const code = (popupError as { code?: string }).code ?? ''

      // These codes mean the popup was blocked or closed by the user/browser.
      // Fall back to redirect-based sign-in which works in all environments
      // including Cloudflare Pages where popups may be restricted.
      if (
        code === 'auth/popup-blocked' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, googleProvider)
        return
      }

      // Any other error (network, misconfiguration) — re-throw so the UI
      // can display a meaningful message
      throw popupError
    }
  }, [])

  const signInWithEmail = useCallback(
    async (email: string, password: string, remember: boolean) => {
      const persistence = remember
        ? browserLocalPersistence
        : browserSessionPersistence
      await setPersistence(auth, persistence)
      await signInWithEmailAndPassword(auth, email, password)
    },
    []
  )

  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName: string) => {
      await setPersistence(auth, browserLocalPersistence)
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(newUser, { displayName })
      await sendEmailVerification(newUser)
    },
    []
  )

  const resetPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  const sendVerificationEmail = useCallback(async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  }, [])

  const logout = useCallback(async () => {
    await signOut(auth)
  }, [])

  const updateDisplayName = useCallback(async (name: string) => {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name })
      setUser({ ...auth.currentUser })
    }
  }, [])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error('No authenticated user')
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
    },
    []
  )

  const deleteAccount = useCallback(async (password: string) => {
    const user = auth.currentUser
    if (!user || !user.email) throw new Error('No authenticated user')
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)
    await deleteUser(user)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        sendVerificationEmail,
        logout,
        updateDisplayName,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

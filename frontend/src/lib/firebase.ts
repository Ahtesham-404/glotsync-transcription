import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth'
import { getAnalytics, type Analytics } from 'firebase/analytics'

// All configuration is read from Vite environment variables.
// Never hardcode Firebase credentials in source code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Validate that all required environment variables are present
const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

for (const varName of requiredVars) {
  if (!import.meta.env[varName]) {
    throw new Error(
      `Missing required Firebase environment variable: ${varName}. ` +
      'Ensure your .env.local file is configured correctly.'
    )
  }
}

// Avoid re-initializing if hot-reloading in development
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp()

export const auth: Auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

googleProvider.setCustomParameters({
  prompt: 'select_account',
})

// Analytics only in browser (not SSR)
export let analytics: Analytics | null = null
if (typeof window !== 'undefined' && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  analytics = getAnalytics(app)
}

export { app }
export default app

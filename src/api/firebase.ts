import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const env = import.meta.env
const requiredFirebaseEnvKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

const normalizeEnvValue = (value: string | undefined) => {
  const trimmedValue = value?.trim() ?? ''

  if (
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) ||
    (trimmedValue.startsWith("'") && trimmedValue.endsWith("'"))
  ) {
    return trimmedValue.slice(1, -1).trim()
  }

  return trimmedValue
}

const firebaseEnv = {
  VITE_FIREBASE_API_KEY: normalizeEnvValue(env.VITE_FIREBASE_API_KEY),
  VITE_FIREBASE_AUTH_DOMAIN: normalizeEnvValue(env.VITE_FIREBASE_AUTH_DOMAIN),
  VITE_FIREBASE_PROJECT_ID: normalizeEnvValue(env.VITE_FIREBASE_PROJECT_ID),
  VITE_FIREBASE_STORAGE_BUCKET: normalizeEnvValue(env.VITE_FIREBASE_STORAGE_BUCKET),
  VITE_FIREBASE_MESSAGING_SENDER_ID: normalizeEnvValue(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  VITE_FIREBASE_APP_ID: normalizeEnvValue(env.VITE_FIREBASE_APP_ID),
  VITE_FIREBASE_MEASUREMENT_ID: normalizeEnvValue(env.VITE_FIREBASE_MEASUREMENT_ID),
}

const missingFirebaseEnvKeys = requiredFirebaseEnvKeys.filter(
  key => !firebaseEnv[key],
)

export const firebaseEnvErrorMessage =
  missingFirebaseEnvKeys.length > 0
    ? `Missing Firebase env: ${missingFirebaseEnvKeys.join(', ')}. In Netlify, add these as Site configuration > Environment variables.`
    : null

export const assertFirebaseConfigured = () => {
  if (firebaseEnvErrorMessage) {
    throw new Error(firebaseEnvErrorMessage)
  }
}

export const firebaseConfig = {
  apiKey: firebaseEnv.VITE_FIREBASE_API_KEY || 'missing-firebase-api-key',
  authDomain:
    firebaseEnv.VITE_FIREBASE_AUTH_DOMAIN || 'missing-firebase-auth-domain',
  projectId:
    firebaseEnv.VITE_FIREBASE_PROJECT_ID || 'missing-firebase-project-id',
  storageBucket:
    firebaseEnv.VITE_FIREBASE_STORAGE_BUCKET || 'missing-firebase-storage-bucket',
  messagingSenderId:
    firebaseEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || 'missing-firebase-sender-id',
  appId: firebaseEnv.VITE_FIREBASE_APP_ID || 'missing-firebase-app-id',
  measurementId: firebaseEnv.VITE_FIREBASE_MEASUREMENT_ID || undefined,
}

const normalizeStorageBucket = (bucket: string) => {
  const trimmedBucket = bucket.trim()

  if (!trimmedBucket) {
    return trimmedBucket
  }

  if (trimmedBucket.startsWith('gs://')) {
    return trimmedBucket.slice(5)
  }

  if (trimmedBucket.startsWith('https://')) {
    try {
      const url = new URL(trimmedBucket)
      return url.hostname
    } catch {
      return trimmedBucket
    }
  }

  return trimmedBucket
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(
  app,
  `gs://${normalizeStorageBucket(firebaseConfig.storageBucket)}`,
)

export const getFirebaseAnalytics = async () => {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) return null

  return getAnalytics(app)
}

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

const missingFirebaseEnvKeys = requiredFirebaseEnvKeys.filter(key => !env[key])

if (missingFirebaseEnvKeys.length > 0) {
  throw new Error(
    `Missing Firebase env: ${missingFirebaseEnvKeys.join(', ')}. Check your .env file.`,
  )
}

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
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

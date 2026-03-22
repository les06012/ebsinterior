import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { assertFirebaseConfigured, db } from './firebase'
import { QAPost, QAReply } from '../types'

const QA_COLLECTION = 'qa'
const QA_META_COLLECTION = 'app_meta'
const QA_COUNTER_DOC = 'qa_post_counter'

const toReadableFirebaseError = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error
      ? error
      : new Error('Firebase 요청 중 알 수 없는 오류가 발생했습니다.')
  }

  switch (error.code) {
    case 'permission-denied':
      return new Error(
        'Firestore 권한이 없습니다. 현재 앱은 Firebase 인증 없이 접근하므로 Firestore 보안 규칙에서 웹 클라이언트 접근을 허용해야 합니다.',
      )
    case 'unauthenticated':
      return new Error(
        'Firebase 인증 없이 접근 중입니다. Firestore 보안 규칙을 확인해 주세요.',
      )
    default:
      return new Error(error.message)
  }
}

const normalizeReply = (reply: Partial<QAReply>): QAReply => ({
  id: reply.id ?? `reply-${Date.now()}`,
  author: reply.author === 'admin' ? 'admin' : 'user',
  content: reply.content ?? '',
  date: reply.date ?? new Date().toISOString().split('T')[0],
})

const normalizeQAPost = (post: Partial<QAPost>): QAPost => ({
  id: typeof post.id === 'number' ? post.id : 0,
  title: post.title ?? '',
  author: post.author ?? '',
  date: post.date ?? '',
  status: post.status === '답변완료' ? '답변완료' : '검토중',
  isPrivate: Boolean(post.isPrivate),
  content: post.content ?? '',
  password: post.password ?? '',
  reply: post.reply ?? '',
  replies: Array.isArray(post.replies)
    ? post.replies.map(normalizeReply)
    : [],
})

const getNextQAPostId = async () => {
  assertFirebaseConfigured()
  const counterRef = doc(db, QA_META_COLLECTION, QA_COUNTER_DOC)

  return runTransaction(db, async transaction => {
    const counterSnapshot = await transaction.get(counterRef)
    const currentId =
      counterSnapshot.exists() &&
      typeof counterSnapshot.data().lastId === 'number'
        ? counterSnapshot.data().lastId
        : 0
    const nextId = currentId + 1

    transaction.set(
      counterRef,
      {
        lastId: nextId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )

    return nextId
  })
}

export const fetchQAPosts = async (): Promise<QAPost[]> => {
  try {
    assertFirebaseConfigured()
    const snapshot = await getDocs(collection(db, QA_COLLECTION))

    return snapshot.docs
      .map(postDoc => {
        const data = postDoc.data() as Partial<QAPost> & {
          createdAt?: string
          updatedAt?: string
        }

        return {
          post: normalizeQAPost({
            ...data,
            id: data.id ?? Number(postDoc.id),
          }),
          sortKey: data.updatedAt ?? data.createdAt ?? '',
        }
      })
      .sort((a, b) => {
        if (a.sortKey && b.sortKey) {
          return b.sortKey.localeCompare(a.sortKey)
        }
        return b.post.id - a.post.id
      })
      .map(item => item.post)
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

export const saveQAPost = async (post: QAPost): Promise<QAPost> => {
  try {
    assertFirebaseConfigured()
    const normalizedPost = normalizeQAPost(post)
    const postId =
      normalizedPost.id > 0 ? normalizedPost.id : await getNextQAPostId()
    const postToSave = {
      ...normalizedPost,
      id: postId,
    }
    const now = new Date().toISOString()
    const postRef = doc(db, QA_COLLECTION, String(postId))
    const existingSnapshot = await getDoc(postRef)
    const existingData = existingSnapshot.exists()
      ? (existingSnapshot.data() as { createdAt?: string })
      : null

    await setDoc(postRef, {
      ...postToSave,
      createdAt: existingData?.createdAt ?? now,
      updatedAt: now,
    })

    return postToSave
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

export const deleteQAPost = async (postId: number): Promise<void> => {
  try {
    assertFirebaseConfigured()
    await deleteDoc(doc(db, QA_COLLECTION, String(postId)))
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

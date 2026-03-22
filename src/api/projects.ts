import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { assertFirebaseConfigured, db, storage } from './firebase'
import { Project } from '../types'

const PROJECT_COLLECTION = 'project'

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
    case 'storage/unauthorized':
      return new Error(
        'Firebase Storage 권한이 없습니다. Storage 보안 규칙을 확인해 주세요.',
      )
    case 'storage/unauthenticated':
      return new Error(
        'Firebase Storage 접근에 인증이 필요합니다. Storage 보안 규칙을 확인해 주세요.',
      )
    case 'storage/unknown':
      return new Error(
        'Firebase Storage 업로드가 실패했습니다. 버킷 이름이 정확한지 확인하고, Storage Rules 및 버킷 CORS에 현재 origin(예: http://localhost:3000)을 추가해 주세요.',
      )
    default:
      return new Error(error.message)
  }
}

const isDataUrl = (value: string) => value.startsWith('data:')

const STORAGE_OBJECT_PATH_PREFIX = '/v0/b/'

type ParsedStorageLocation = {
  bucket: string | null
  objectPath: string
}

const sanitizePathSegment = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-_가-힣]/g, '')
    .slice(0, 50) || 'item'

const getFileExtensionFromDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:image\/([a-zA-Z0-9.+-]+);base64,/)
  const extension = match?.[1]?.toLowerCase() ?? 'jpeg'

  if (extension === 'svg+xml') return 'svg'
  if (extension === 'jpeg' || extension === 'jpg' || extension === 'png' || extension === 'webp' || extension === 'gif') {
    return extension
  }

  return 'jpg'
}

const extractStorageLocation = (
  value: string,
): ParsedStorageLocation | null => {
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return null
  }

  try {
    const url = new URL(value)

    if (
      url.hostname === 'firebasestorage.googleapis.com' &&
      url.pathname.startsWith(STORAGE_OBJECT_PATH_PREFIX)
    ) {
      const bucketMatch = url.pathname.match(/^\/v0\/b\/([^/]+)\/o/)
      const pathMatch = url.pathname.match(/\/o\/(.+)$/)
      const objectPath = pathMatch?.[1]
        ? decodeURIComponent(pathMatch[1])
        : url.searchParams.get('name') || url.searchParams.get('img')
          ? decodeURIComponent(
              (url.searchParams.get('name') || url.searchParams.get('img')) as string,
            )
          : null

      if (!objectPath) {
        return null
      }

      return {
        bucket: bucketMatch?.[1] ? decodeURIComponent(bucketMatch[1]) : null,
        objectPath,
      }
    }

    if (url.hostname === 'storage.googleapis.com') {
      const [bucket, ...objectParts] = url.pathname.split('/').filter(Boolean)
      if (!(bucket && objectParts.length > 0)) {
        return null
      }

      return {
        bucket: decodeURIComponent(bucket),
        objectPath: decodeURIComponent(objectParts.join('/')),
      }
    }

    return null
  } catch {
    return null
  }
}

const resolveStorageUrl = async (value: string) => {
  const storageLocation = extractStorageLocation(value)

  if (!storageLocation) {
    return value
  }

  try {
    const storageRef = storageLocation.bucket
      ? ref(storage, `gs://${storageLocation.bucket}/${storageLocation.objectPath}`)
      : ref(storage, storageLocation.objectPath)

    return await getDownloadURL(storageRef)
  } catch {
    return value
  }
}

const resolveProjectAssetUrls = async (project: Project): Promise<Project> => ({
  ...project,
  thumbnail: await resolveStorageUrl(project.thumbnail),
  heroImage: await resolveStorageUrl(project.heroImage),
  spaces: await Promise.all(
    project.spaces.map(async space => ({
      ...space,
      images: await Promise.all(space.images.map(resolveStorageUrl)),
    })),
  ),
  comparisons: await Promise.all(
    project.comparisons.map(async comparison => ({
      ...comparison,
      day: await resolveStorageUrl(comparison.day),
      night: await resolveStorageUrl(comparison.night),
    })),
  ),
})

const uploadImageIfNeeded = async (
  projectId: string,
  image: string,
  path: string,
) => {
  if (!image || !isDataUrl(image)) {
    return image
  }

  const extension = getFileExtensionFromDataUrl(image)
  const imageRef = ref(storage, `projects/${projectId}/${path}.${extension}`)
  await uploadString(imageRef, image, 'data_url')
  return getDownloadURL(imageRef)
}

const uploadProjectAssets = async (project: Project): Promise<Project> => {
  const thumbnail = await uploadImageIfNeeded(
    project.id,
    project.thumbnail,
    'thumbnail',
  )

  const heroImage = await uploadImageIfNeeded(
    project.id,
    project.heroImage,
    'hero-image',
  )

  const spaces = await Promise.all(
    project.spaces.map(async (space, spaceIndex) => ({
      ...space,
      images: await Promise.all(
        space.images.map((image, imageIndex) =>
          uploadImageIfNeeded(
            project.id,
            image,
            `spaces/${String(spaceIndex + 1).padStart(2, '0')}-${sanitizePathSegment(
              space.name,
            )}-${String(imageIndex + 1).padStart(2, '0')}`,
          ),
        ),
      ),
    })),
  )

  const comparisons = project.comparisons
    ? await Promise.all(
        project.comparisons.map(async (comparison, comparisonIndex) => ({
          ...comparison,
          day: await uploadImageIfNeeded(
            project.id,
            comparison.day,
            `comparisons/${String(comparisonIndex + 1).padStart(2, '0')}-day`,
          ),
          night: await uploadImageIfNeeded(
            project.id,
            comparison.night,
            `comparisons/${String(comparisonIndex + 1).padStart(2, '0')}-night`,
          ),
        })),
      )
    : []

  return {
    ...project,
    thumbnail,
    heroImage,
    spaces,
    comparisons,
  }
}

const normalizeProject = (project: Partial<Project>): Project => ({
  id: project.id ?? `project-${Date.now()}`,
  title: project.title ?? '',
  category: (project.category ?? '주거') as Project['category'],
  subCategory: project.subCategory ?? '',
  area: project.area ?? '',
  location: project.location ?? '',
  duration: project.duration ?? '',
  scope: project.scope ?? '',
  keywords: Array.isArray(project.keywords) ? project.keywords : [],
  thumbnail: project.thumbnail ?? '',
  heroImage: project.heroImage ?? '',
  spaces: Array.isArray(project.spaces) ? project.spaces : [],
  details: Array.isArray(project.details) ? project.details : [],
  comparisons: Array.isArray(project.comparisons) ? project.comparisons : [],
  description: project.description ?? '',
})

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    assertFirebaseConfigured()
    const snapshot = await getDocs(collection(db, PROJECT_COLLECTION))

    const projects = snapshot.docs
      .map(projectDoc => {
        const data = projectDoc.data() as Partial<Project> & {
          createdAt?: string
          updatedAt?: string
        }

        return {
          project: normalizeProject({
            ...data,
            id: data.id ?? projectDoc.id,
          }),
          sortKey: data.updatedAt ?? data.createdAt ?? '',
        }
      })
      .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
      .map(item => item.project)

    return Promise.all(projects.map(resolveProjectAssetUrls))
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

export const saveProject = async (project: Project): Promise<Project> => {
  try {
    assertFirebaseConfigured()
    const normalizedProject = normalizeProject(project)
    const projectWithUploadedAssets = await uploadProjectAssets(normalizedProject)
    const now = new Date().toISOString()
    const projectRef = doc(db, PROJECT_COLLECTION, normalizedProject.id)
    const existingSnapshot = await getDoc(projectRef)
    const existingData = existingSnapshot.exists()
      ? (existingSnapshot.data() as { createdAt?: string })
      : null

    await setDoc(projectRef, {
      ...projectWithUploadedAssets,
      createdAt: existingData?.createdAt ?? now,
      updatedAt: now,
    })

    return projectWithUploadedAssets
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

export const fetchProjectById = async (
  projectId: string,
): Promise<Project | null> => {
  try {
    assertFirebaseConfigured()
    const snapshot = await getDoc(doc(db, PROJECT_COLLECTION, projectId))

    if (!snapshot.exists()) {
      return null
    }

    return resolveProjectAssetUrls(
      normalizeProject({
      ...(snapshot.data() as Partial<Project>),
      id: snapshot.id,
      }),
    )
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

export const deleteProject = async (projectId: string): Promise<void> => {
  try {
    assertFirebaseConfigured()
    await deleteDoc(doc(db, PROJECT_COLLECTION, projectId))
  } catch (error) {
    throw toReadableFirebaseError(error)
  }
}

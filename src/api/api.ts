const POSTIMAGES_URL = 'https://postimages.org/json'
const POSTIMAGES_GALLERY = 'rKRg2mQ'

type PostimagesUploadResponse = {
  url?: string
  image?: {
    url?: string
    direct_url?: string
  }
  data?: {
    url?: string
    direct_url?: string
  }
}

const buildUploadSession = () => {
  const now = Date.now()
  const random = Math.floor(Math.random() * 1_000_000_000_000_000_000)
  return `${now}.${random}`
}

const extractPostimagesUrl = (
  result: PostimagesUploadResponse,
): string | null => {
  return (
    result.url ||
    result.image?.direct_url ||
    result.image?.url ||
    result.data?.direct_url ||
    result.data?.url ||
    null
  )
}

export const uploadImageToPostimages = async (file: File | Blob) => {
  const uploadFile =
    file instanceof File
      ? file
      : new File([file], `upload-${Date.now()}.jpg`, {
          type: file.type || 'image/jpeg',
        })
  const formData = new FormData()

  formData.append('gallery', POSTIMAGES_GALLERY)
  formData.append('optsize', '0')
  formData.append('expire', '0')
  formData.append('numfiles', '1')
  formData.append('upload_session', buildUploadSession())
  formData.append('file', uploadFile)

  const response = await fetch(POSTIMAGES_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`postimages upload failed: ${response.status}`)
  }

  const result: PostimagesUploadResponse = await response.json()
  const imageUrl = extractPostimagesUrl(result)

  if (!imageUrl) {
    throw new Error('postimages upload succeeded but image URL is missing')
  }

  return imageUrl
}

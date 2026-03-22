import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { QAPost } from '../../types'

type QAWriteInquiryModalProps = {
  isSubmitting: boolean
  onClose: () => void
  onSave: (post: QAPost) => Promise<void> | void
}

const maskAuthorName = (value: string) => {
  const trimmed = value.trim()

  if (trimmed.length <= 1) {
    return trimmed
  }

  if (trimmed.length === 2) {
    return `${trimmed[0]}*`
  }

  return `${trimmed[0]}*${trimmed.slice(2)}`
}

export const QAWriteInquiryModal = ({
  isSubmitting,
  onClose,
  onSave,
}: QAWriteInquiryModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    password: '',
    content: '',
    isPrivate: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const title = formData.title.trim()
    const author = formData.author.trim()
    const password = formData.password.trim()
    const content = formData.content.trim()

    if (!title || !author || !password || !content) {
      alert('제목, 작성자, 비밀번호, 내용을 모두 입력해 주세요.')
      return
    }

    const shouldSubmit = window.confirm('등록하시겠습니까?')
    if (!shouldSubmit) return

    const today = new Date().toISOString().split('T')[0]
    const newPost: QAPost = {
      id: 0,
      title,
      author: maskAuthorName(author),
      date: today,
      status: '검토중',
      isPrivate: formData.isPrivate,
      content,
      password,
      replies: [],
    }

    await onSave(newPost)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">문의하기</h2>
          <button onClick={onClose} disabled={isSubmitting}>
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">작성자</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">비밀번호</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea
              className="w-full p-2 border rounded-lg h-32"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={e =>
                setFormData({ ...formData, isPrivate: e.target.checked })
              }
            />
            <label htmlFor="isPrivate" className="text-sm">
              비밀글로 작성
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

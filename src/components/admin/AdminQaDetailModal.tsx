import React from 'react'
import { Lock, Trash2, X } from 'lucide-react'
import { motion } from 'motion/react'
import { QAPost } from '../../types'

type AdminQaDetailModalProps = {
  selectedPost: QAPost | null
  replyContent: string
  onClose: () => void
  onReplyContentChange: (value: string) => void
  onReply: (id: number, reply: string) => void
  onDeletePost: (id: number) => void
}

export const AdminQaDetailModal = ({
  selectedPost,
  replyContent,
  onClose,
  onReplyContentChange,
  onReply,
  onDeletePost,
}: AdminQaDetailModalProps) => {
  if (!selectedPost) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {selectedPost.isPrivate && (
              <Lock size={16} className="text-sage-400" />
            )}
            {selectedPost.title}
          </h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center text-sm text-sage-500 pb-4 border-b">
            <div className="flex gap-4">
              <span>작성자: {selectedPost.author}</span>
              <span>날짜: {selectedPost.date}</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-[10px] font-bold ${
                selectedPost.status === '답변완료'
                  ? 'bg-sage-100 text-sage-600'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {selectedPost.status}
            </span>
          </div>

          <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed text-sage-800">
            {selectedPost.content || '내용이 없습니다.'}
          </div>

          {selectedPost.replies && selectedPost.replies.length > 0 && (
            <div className="space-y-4 mt-8">
              {selectedPost.replies.map(reply => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-xl ${reply.author === 'admin' ? 'bg-sage-50 ml-4' : 'bg-gray-50 mr-4'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-sage-800">
                      {reply.author === 'admin' ? '관리자' : '작성자'}
                    </span>
                    <span className="text-xs text-sage-400">{reply.date}</span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm text-sage-700">
                    {reply.content}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-sage-50 rounded-xl p-6 mt-8">
            <h3 className="font-bold text-sage-800 mb-4 flex items-center gap-2">
              <span className="text-sage-500">A.</span>
              관리자 답변 추가
            </h3>

            <form
              onSubmit={e => {
                e.preventDefault()
                onReply(selectedPost.id, replyContent)
              }}
              className="mt-4"
            >
              <textarea
                className="w-full p-3 border border-sage-200 rounded-lg mb-3 h-32 focus:ring-2 focus:ring-sage-500 outline-none"
                placeholder="답변 내용을 입력하세요..."
                value={replyContent}
                onChange={e => onReplyContentChange(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-sage-800 text-white text-sm font-bold rounded-lg hover:bg-sage-900"
                >
                  답변 등록
                </button>
              </div>
            </form>
          </div>

          <div className="flex justify-end pt-4 border-t mt-8">
            <button
              onClick={() => onDeletePost(selectedPost.id)}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              <Trash2 size={16} /> 게시글 삭제
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

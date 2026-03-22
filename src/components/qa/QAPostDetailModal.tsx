import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { QAPost } from '../../types'

type QAPostDetailModalProps = {
  selectedPost: QAPost
  replyInput: string
  onReplyInputChange: (value: string) => void
  onReplySubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export const QAPostDetailModal = ({
  selectedPost,
  replyInput,
  onReplyInputChange,
  onReplySubmit,
  onClose,
}: QAPostDetailModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-sage-100 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold ${
                  selectedPost.status === '답변완료'
                    ? 'bg-sage-100 text-sage-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {selectedPost.status}
              </span>
              <span className="text-xs text-sage-400">{selectedPost.date}</span>
            </div>
            <h2 className="text-xl font-bold text-sage-900">{selectedPost.title}</h2>
            <p className="text-sm text-sage-500 mt-1">작성자: {selectedPost.author}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sage-50 rounded-full transition-colors"
          >
            <Plus className="rotate-45" size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="min-h-[150px] whitespace-pre-wrap text-sage-800 leading-relaxed">
            {selectedPost.content}
          </div>

          {selectedPost.replies && selectedPost.replies.length > 0 && (
            <div className="mt-8 space-y-4">
              <h4 className="font-bold text-sage-900 border-b border-sage-100 pb-2">
                답변 및 댓글
              </h4>
              {selectedPost.replies.map(reply => (
                <div
                  key={reply.id}
                  className={`p-4 rounded-xl ${
                    reply.author === 'admin'
                      ? 'bg-sage-50 border border-sage-100'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`font-bold text-sm ${
                        reply.author === 'admin' ? 'text-sage-800' : 'text-gray-700'
                      }`}
                    >
                      {reply.author === 'admin' ? '관리자' : '작성자'}
                    </span>
                    <span className="text-xs text-sage-400">{reply.date}</span>
                  </div>
                  <p className="text-sm text-sage-700 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-sage-100 bg-sage-50/50 rounded-b-2xl">
          <form onSubmit={onReplySubmit} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-200 text-sm"
              placeholder="추가 문의사항을 남겨주세요"
              value={replyInput}
              onChange={e => onReplyInputChange(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors whitespace-nowrap text-sm"
            >
              등록
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

import React from 'react'
import { Lock, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '../Common'
import { QAPost } from '../../types'

type AdminQaContentProps = {
  qaPosts: QAPost[]
  onSelectPost: (post: QAPost) => void
  onDeletePost: (id: number) => void | Promise<void>
  isLoadingQaPosts: boolean
  qaError: string
}

export const AdminQaContent = ({
  qaPosts,
  onSelectPost,
  onDeletePost,
  isLoadingQaPosts,
  qaError,
}: AdminQaContentProps) => {
  return (
    <motion.div
      key="qa"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h2 className="text-lg md:text-2xl font-bold text-sage-900 whitespace-nowrap">
        문의글 목록
      </h2>

      {qaError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {qaError}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-sage-50 text-sage-700 text-xs font-bold uppercase tracking-wider border-b border-sage-200">
            <tr>
              <th className="p-4 w-16 text-center whitespace-nowrap">No</th>
              <th className="p-4 w-24 text-center whitespace-nowrap">상태</th>
              <th className="p-4 whitespace-nowrap">제목</th>
              <th className="p-4 w-32 text-center whitespace-nowrap">작성자</th>
              <th className="p-4 w-32 text-center whitespace-nowrap">날짜</th>
              <th className="p-4 w-20 text-center whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100">
            {isLoadingQaPosts ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-sage-400">
                  Firestore에서 문의글을 불러오는 중입니다.
                </td>
              </tr>
            ) : qaPosts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-sage-400">
                  등록된 문의글이 없습니다.
                </td>
              </tr>
            ) : (
              qaPosts.map(post => (
                <tr
                  key={post.id}
                  className="hover:bg-sage-50/60 transition-colors group"
                >
                  <td className="p-4 text-center text-sage-500 text-sm font-mono whitespace-nowrap">
                    {post.id}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm',
                        post.status === '답변완료'
                          ? 'bg-sage-100 text-sage-700 border border-sage-200'
                          : 'bg-gray-100 text-gray-500 border border-gray-200',
                      )}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 max-w-[300px]">
                    <button
                      onClick={() => onSelectPost(post)}
                      className="w-full text-left flex items-center gap-2 group-hover:text-sage-800 transition-colors"
                    >
                      {post.isPrivate && (
                        <Lock
                          size={14}
                          className="text-sage-400 flex-shrink-0"
                        />
                      )}
                      <span className="font-medium text-sage-900 truncate block">
                        {post.title}
                      </span>
                    </button>
                  </td>
                  <td className="p-4 text-center text-sage-600 text-sm whitespace-nowrap">
                    {post.author}
                  </td>
                  <td className="p-4 text-center text-sage-400 text-xs font-mono whitespace-nowrap">
                    {post.date}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => onDeletePost(post.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

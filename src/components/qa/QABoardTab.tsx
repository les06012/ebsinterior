import React from 'react'
import { Lock, Plus, Search } from 'lucide-react'
import { QAPost } from '../../types'

type QABoardTabProps = {
  posts: QAPost[]
  searchInput: string
  onSearchInputChange: (value: string) => void
  onSearch: (e: React.FormEvent) => void
  onWrite: () => void
  onPostClick: (post: QAPost) => void
  isLoading: boolean
  error: string
}

export const QABoardTab = ({
  posts,
  searchInput,
  onSearchInputChange,
  onSearch,
  onWrite,
  onPostClick,
  isLoading,
  error,
}: QABoardTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-center">
        <form onSubmit={onSearch} className="relative flex-1">
          <input
            type="text"
            className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white border border-sage-200 rounded-lg text-xs md:text-sm"
            placeholder="검색어를 입력하세요"
            value={searchInput}
            onChange={e => onSearchInputChange(e.target.value)}
          />
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600"
          >
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </form>
        <button
          onClick={onWrite}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 bg-sage-800 text-white text-xs md:text-sm font-bold rounded-lg hover:bg-sage-900 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> 문의하기
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="hidden md:block bg-white rounded-2xl border border-sage-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-sage-50 border-b border-sage-100">
              <th className="px-6 py-4 text-left font-bold text-sage-600">번호</th>
              <th className="px-6 py-4 text-left font-bold text-sage-600">제목</th>
              <th className="px-6 py-4 text-left font-bold text-sage-600">작성자</th>
              <th className="px-6 py-4 text-left font-bold text-sage-600">날짜</th>
              <th className="px-6 py-4 text-left font-bold text-sage-600">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-50">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sage-400">
                  Firestore에서 문의글을 불러오는 중입니다.
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sage-400">
                  등록된 문의글이 없습니다.
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr
                  key={post.id}
                  onClick={() => onPostClick(post)}
                  className="hover:bg-sage-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-sage-400">{post.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {post.isPrivate && <Lock size={14} className="text-sage-300" />}
                      <span className={post.isPrivate ? 'text-sage-400' : 'text-sage-800'}>
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sage-600">{post.author}</td>
                  <td className="px-6 py-4 text-sage-400">{post.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap ${
                        post.status === '답변완료'
                          ? 'bg-sage-100 text-sage-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="bg-white p-5 rounded-xl border border-sage-100 shadow-sm text-sm text-sage-400 text-center">
            Firestore에서 문의글을 불러오는 중입니다.
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-5 rounded-xl border border-sage-100 shadow-sm text-sm text-sage-400 text-center">
            등록된 문의글이 없습니다.
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              onClick={() => onPostClick(post)}
              className="bg-white p-5 rounded-xl border border-sage-100 shadow-sm space-y-3 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      post.status === '답변완료'
                        ? 'bg-sage-100 text-sage-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {post.status}
                  </span>
                  <span className="text-xs text-sage-400">No. {post.id}</span>
                </div>
                <span className="text-xs text-sage-400">{post.date}</span>
              </div>

              <h3 className="font-bold text-sage-800 flex items-center gap-2">
                {post.isPrivate && (
                  <Lock size={14} className="text-sage-300 flex-shrink-0" />
                )}
                <span className="line-clamp-1">{post.title}</span>
              </h3>

              <div className="flex justify-between items-center pt-2 border-t border-sage-50">
                <span className="text-xs text-sage-500">작성자: {post.author}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

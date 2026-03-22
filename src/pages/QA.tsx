import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SectionTitle } from '../components/Common'
import { FAQS } from '../data/projects'
import { fetchQAPosts, saveQAPost } from '../api/qa'
import { QAPost } from '../types'
import { QAFaqTab } from '../components/qa/QAFaqTab'
import { QABoardTab } from '../components/qa/QABoardTab'
import { QAPasswordPromptModal } from '../components/qa/QAPasswordPromptModal'
import { QAPostDetailModal } from '../components/qa/QAPostDetailModal'
import { QAWriteInquiryModal } from '../components/qa/QAWriteInquiryModal'

export const QA = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'faq' | 'board'>('faq')
  const [isWriting, setIsWriting] = useState(false)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const [isSavingPost, setIsSavingPost] = useState(false)
  const [postError, setPostError] = useState('')

  const [selectedPost, setSelectedPost] = useState<QAPost | null>(null)
  const [passwordPromptPost, setPasswordPromptPost] = useState<QAPost | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [replyInput, setReplyInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<QAPost[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoadingPosts(true)
      setPostError('')

      try {
        const firestorePosts = await fetchQAPosts()
        setPosts(firestorePosts)
      } catch (error) {
        setPostError(
          error instanceof Error
            ? `문의글 조회에 실패했습니다: ${error.message}`
            : '문의글 조회에 실패했습니다.',
        )
      } finally {
        setIsLoadingPosts(false)
      }
    }

    void loadPosts()
  }, [])

  const handleSavePost = async (newPost: QAPost) => {
    setIsSavingPost(true)
    setPostError('')

    try {
      const savedPost = await saveQAPost(newPost)
      setPosts(prev => [savedPost, ...prev])
      setIsWriting(false)
      alert('작성되었습니다.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '문의글 저장 중 오류가 발생했습니다.'
      setPostError(message)
      alert('실패되었습니다.')
    } finally {
      setIsSavingPost(false)
    }
  }

  const handlePostClick = (post: QAPost) => {
    if (post.isPrivate) {
      setPasswordPromptPost(post)
      setPasswordInput('')
      return
    }

    setSelectedPost(post)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordPromptPost?.password === passwordInput) {
      setSelectedPost(passwordPromptPost)
      setPasswordPromptPost(null)
      return
    }

    alert('비밀번호가 일치하지 않습니다.')
  }

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!(selectedPost && replyInput.trim())) return

    const today = new Date().toISOString().split('T')[0]
    const updatedPost: QAPost = {
      ...selectedPost,
      status: '검토중',
      replies: [
        ...(selectedPost.replies || []),
        {
          id: `reply-${Date.now()}`,
          author: 'user',
          content: replyInput.trim(),
          date: today,
        },
      ],
    }

    try {
      const savedPost = await saveQAPost(updatedPost)
      setPosts(prev => prev.map(post => (post.id === savedPost.id ? savedPost : post)))
      setSelectedPost(savedPost)
      setReplyInput('')
      alert('작성되었습니다.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '추가 문의 저장 중 오류가 발생했습니다.'
      setPostError(message)
      alert('실패되었습니다.')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchInput.trim()

    if (query) {
      const filtered = posts.filter(post => post.title.includes(query))
      if (filtered.length === 0) {
        alert('검색하신 내용이 존재하지 않습니다.')
        setSearchInput('')
        setSearchQuery('')
        return
      }
    }

    setSearchQuery(query)
  }

  const filteredPosts = posts.filter(post => post.title.includes(searchQuery))

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative">
      <SectionTitle
        title="Q&A"
        subtitle="자주 묻는 질문과 1:1 문의 게시판입니다."
      />

      <AnimatePresence>
        {isWriting && (
          <QAWriteInquiryModal
            onClose={() => setIsWriting(false)}
            onSave={handleSavePost}
            isSubmitting={isSavingPost}
          />
        )}
      </AnimatePresence>

      <div className="flex border-b border-sage-200 mb-12">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-8 py-4 font-bold text-sm transition-colors relative ${
            activeTab === 'faq' ? 'text-sage-900' : 'text-sage-400'
          }`}
        >
          자주 묻는 질문
          {activeTab === 'faq' && (
            <motion.div
              layoutId="tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('board')}
          className={`px-8 py-4 font-bold text-sm transition-colors relative ${
            activeTab === 'board' ? 'text-sage-900' : 'text-sage-400'
          }`}
        >
          문의 게시판
          {activeTab === 'board' && (
            <motion.div
              layoutId="tab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900"
            />
          )}
        </button>
      </div>

      {activeTab === 'faq' ? (
        <QAFaqTab
          faqs={FAQS}
          openFaq={openFaq}
          onToggleFaq={index => setOpenFaq(openFaq === index ? null : index)}
        />
      ) : (
        <QABoardTab
          posts={filteredPosts}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          onSearch={handleSearch}
          onWrite={() => setIsWriting(true)}
          onPostClick={handlePostClick}
          isLoading={isLoadingPosts}
          error={postError}
        />
      )}

      <AnimatePresence>
        {passwordPromptPost && (
          <QAPasswordPromptModal
            passwordInput={passwordInput}
            onPasswordInputChange={setPasswordInput}
            onClose={() => setPasswordPromptPost(null)}
            onSubmit={handlePasswordSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPost && (
          <QAPostDetailModal
            selectedPost={selectedPost}
            replyInput={replyInput}
            onReplyInputChange={setReplyInput}
            onReplySubmit={handleReplySubmit}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

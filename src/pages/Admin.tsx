import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QAPost, Project } from '../types'
import { AnimatePresence } from 'motion/react'
import { deleteProject, fetchProjects, saveProject } from '../api/projects'
import { deleteQAPost, fetchQAPosts, saveQAPost } from '../api/qa'
import { AdminHeader } from '../components/admin/AdminHeader'
import { AdminLogin } from '../components/admin/AdminLogin'
import { AdminTabs } from '../components/admin/AdminTabs'
import { AdminGalleryContent } from '../components/admin/AdminGalleryContent'
import { AdminQaContent } from '../components/admin/AdminQaContent'
import { AdminQaDetailModal } from '../components/admin/AdminQaDetailModal'
import { AdminWriteProjectModal } from '../components/admin/AdminWriteProjectModal'

export const Admin = () => {
  const navigate = useNavigate()
  const [isAdmin, setIsAdmin] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [activeTab, setActiveTab] = useState<'gallery' | 'qa'>('gallery')

  // Gallery State
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [projectError, setProjectError] = useState('')
  const [isWritingProject, setIsWritingProject] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  // QA State
  const [qaPosts, setQaPosts] = useState<QAPost[]>([])
  const [isLoadingQaPosts, setIsLoadingQaPosts] = useState(true)
  const [qaError, setQaError] = useState('')
  const [selectedPost, setSelectedPost] = useState<QAPost | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmittingDraft, setIsSubmittingDraft] = useState(false)

  useEffect(() => {
    // Check if already logged in (optional, but good for refresh)
    const adminSession = sessionStorage.getItem('isAdmin')
    if (adminSession === 'true') {
      setIsAdmin(true)
    }

  }, [])

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoadingProjects(true)
      setProjectError('')

      try {
        const firestoreProjects = await fetchProjects()
        setProjects(firestoreProjects)
      } catch (error) {
        setProjectError(
          error instanceof Error
            ? `프로젝트 조회에 실패했습니다: ${error.message}`
            : '프로젝트 조회에 실패했습니다.',
        )
      } finally {
        setIsLoadingProjects(false)
      }
    }

    void loadProjects()
  }, [])

  useEffect(() => {
    const loadQaPosts = async () => {
      setIsLoadingQaPosts(true)
      setQaError('')

      try {
        const firestorePosts = await fetchQAPosts()
        setQaPosts(firestorePosts)
      } catch (error) {
        setQaError(
          error instanceof Error
            ? `문의글 조회에 실패했습니다: ${error.message}`
            : '문의글 조회에 실패했습니다.',
        )
      } finally {
        setIsLoadingQaPosts(false)
      }
    }

    void loadQaPosts()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === 'admin1234') {
      setIsAdmin(true)
      sessionStorage.setItem('isAdmin', 'true')
    } else {
      alert('비밀번호가 일치하지 않습니다.')
    }
  }

  const handleLogout = () => {
    setIsAdmin(false)
    sessionStorage.removeItem('isAdmin')
    navigate('/')
  }

  // Gallery Functions
  const handleSaveProject = async (newProject: Project) => {
    setIsSubmittingDraft(true)
    setProjectError('')

    try {
      const savedProject = await saveProject(newProject)

      setProjects(prev => {
        const exists = prev.some(p => p.id === savedProject.id)
        if (exists) {
          return prev.map(p => (p.id === savedProject.id ? savedProject : p))
        }
        return [savedProject, ...prev]
      })

      setIsWritingProject(false)
      setEditingProject(null)
      alert('작성되었습니다.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Firestore 저장 중 오류가 발생했습니다.'
      setProjectError(message)
      alert('실패되었습니다.')
    } finally {
      setIsSubmittingDraft(false)
    }
  }

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
      return
    }

    setIsSubmittingDraft(true)
    setProjectError('')

    try {
      await deleteProject(project.id)
      setProjects(prev => prev.filter(item => item.id !== project.id))
      setIsWritingProject(false)
      setEditingProject(null)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Firestore 삭제 중 오류가 발생했습니다.'
      setProjectError(message)
    } finally {
      setIsSubmittingDraft(false)
    }
  }

  // QA Functions
  const handleReply = async (id: number, reply: string) => {
    if (!reply.trim()) return

    const today = new Date().toISOString().split('T')[0]
    const targetPost = qaPosts.find(post => post.id === id)

    if (!targetPost) return

    const updatedPost: QAPost = {
      ...targetPost,
      status: '답변완료',
      replies: [
        ...(targetPost.replies || []),
        {
          id: `reply-${Date.now()}`,
          author: 'admin',
          content: reply,
          date: today,
        },
      ],
    }

    try {
      const savedPost = await saveQAPost(updatedPost)
      setQaPosts(prev => prev.map(post => (post.id === id ? savedPost : post)))
      setSelectedPost(savedPost)
      setReplyContent('')
      alert('답변이 등록되었습니다.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '답변 저장 중 오류가 발생했습니다.'
      setQaError(message)
      alert('답변 등록에 실패했습니다.')
    }
  }

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteQAPost(id)
      setQaPosts(prev => prev.filter(post => post.id !== id))
      if (selectedPost?.id === id) {
        setSelectedPost(null)
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '문의글 삭제 중 오류가 발생했습니다.'
      setQaError(message)
      alert('삭제에 실패했습니다.')
    }
  }

  if (!isAdmin) {
    return (
      <AdminLogin
        passwordInput={passwordInput}
        onPasswordChange={setPasswordInput}
        onSubmit={handleLogin}
      />
    )
  }

  return (
    <div className="min-h-screen bg-sage-50">
      <AdminHeader onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminTabs activeTab={activeTab} onChange={setActiveTab} />

        <AnimatePresence mode="wait">
          {activeTab === 'gallery' ? (
            <AdminGalleryContent
              projects={projects}
              onCreate={() => setIsWritingProject(true)}
              onSelectProject={project => {
                setIsWritingProject(true)
                setEditingProject(project)
              }}
              onDeleteProject={handleDeleteProject}
              isLoadingProjects={isLoadingProjects}
              projectError={projectError}
            />
          ) : (
            <AdminQaContent
              qaPosts={qaPosts}
              onSelectPost={setSelectedPost}
              onDeletePost={handleDeletePost}
              isLoadingQaPosts={isLoadingQaPosts}
              qaError={qaError}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isWritingProject && (
            <AdminWriteProjectModal
              onClose={() => {
                setIsWritingProject(false)
                setEditingProject(null)
              }}
              onSave={handleSaveProject}
              isSubmitting={isSubmittingDraft}
              onDelete={async projectId => {
                const targetProject = projects.find(
                  project => project.id === projectId,
                )
                if (!targetProject) return
                await handleDeleteProject(targetProject)
              }}
              categories={['주거', '상업', '사무', '숙박', '가구']}
              initialData={editingProject}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <AdminQaDetailModal
          selectedPost={selectedPost}
          replyContent={replyContent}
          onClose={() => setSelectedPost(null)}
          onReplyContentChange={setReplyContent}
          onReply={handleReply}
          onDeletePost={handleDeletePost}
        />
      </AnimatePresence>
    </div>
  )
}

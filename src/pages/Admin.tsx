import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle, cn } from '../components/Common';
import { QAPost, Project } from '../types';
import { PROJECTS, getProjects } from '../data/projects';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Lock, Plus, Trash2, Image, MessageSquare, LogOut, X, GripVertical, Edit2 } from 'lucide-react';

export const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'qa'>('gallery');

  // Gallery State
  const [projects, setProjects] = useState<Project[]>([]);
  const [isWritingProject, setIsWritingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // QA State
  const [qaPosts, setQaPosts] = useState<QAPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<QAPost | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    // Check if already logged in (optional, but good for refresh)
    const adminSession = sessionStorage.getItem('isAdmin');
    if (adminSession === 'true') {
      setIsAdmin(true);
    }

    // Load Projects
    setProjects(getProjects());

    // Load QA Posts
    const savedQa = localStorage.getItem('qaPosts_v3');
    if (savedQa) {
      setQaPosts(JSON.parse(savedQa));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin1234') {
      setIsAdmin(true);
      sessionStorage.setItem('isAdmin', 'true');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('isAdmin');
    navigate('/');
  };

  // Gallery Functions
  const handleSaveProject = (newProject: Project) => {
    const saved = localStorage.getItem('customProjects');
    const currentCustom = saved ? JSON.parse(saved) : [];
    
    let updatedCustom;
    if (editingProject) {
      // Update existing project
      // Check if it's a custom project or a default one
      const isCustom = currentCustom.some((p: Project) => p.id === newProject.id);
      
      if (isCustom) {
        updatedCustom = currentCustom.map((p: Project) => p.id === newProject.id ? newProject : p);
      } else {
        // If it's a default project being edited, we treat it as a new custom project but keep the ID?
        // Or we should clone it. For simplicity, let's just add it to custom projects if not there.
        // But wait, if we edit a default project, we need to override it in the display list.
        // The simple strategy: `projects` state is the source of truth for display.
        // We need to persist changes.
        // If we edit a default project, we can't easily "update" it in the static file.
        // So we might need to store "edited default projects" or just treat everything as custom once edited.
        // Let's assume we just save everything to local storage for now to keep it simple, 
        // but we need to filter out duplicates if we are merging.
        
        // Actually, the `projects` state is initialized from [...PROJECTS, ...customProjects].
        // If we edit a project from `PROJECTS`, we should probably add it to `customProjects` and 
        // when loading, we should prefer the custom version.
        
        // Let's simplify: If editing, update in `projects` state.
        // And save the *entire* `projects` list to localStorage? No, that duplicates static data.
        
        // Better approach for this demo:
        // 1. If ID exists in customProjects, update it there.
        // 2. If ID exists in static PROJECTS, add it to customProjects (effectively overriding it if we handle the merge logic right).
        // For now, let's just update the state and save the *custom* part.
        
        // To properly support editing default projects without a backend, we'd need a complex merge strategy.
        // Let's assume we only fully support editing *custom* projects for persistence, 
        // OR we just append the edited version to customProjects and ensuring the UI uses the latest one.
        
        // Let's go with: Update state, and if it's in customProjects, update localStorage.
        // If it was a default project, we add it to customProjects.
        
        const existingIndex = currentCustom.findIndex((p: Project) => p.id === newProject.id);
        if (existingIndex >= 0) {
          updatedCustom = [...currentCustom];
          updatedCustom[existingIndex] = newProject;
        } else {
          updatedCustom = [...currentCustom, newProject];
        }
      }
    } else {
      // Create new
      updatedCustom = [...currentCustom, newProject];
    }

    localStorage.setItem('customProjects', JSON.stringify(updatedCustom));
    
    // Update state using getProjects to ensure consistency
    setProjects(getProjects());

    setIsWritingProject(false);
    setEditingProject(null);
    alert(editingProject ? '프로젝트가 수정되었습니다.' : '프로젝트가 등록되었습니다.');
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // Add to deletedProjects to prevent static projects from reappearing
      const savedDeleted = localStorage.getItem('deletedProjects');
      const deletedProjects = savedDeleted ? JSON.parse(savedDeleted) : [];
      if (!deletedProjects.includes(id)) {
        deletedProjects.push(id);
        localStorage.setItem('deletedProjects', JSON.stringify(deletedProjects));
      }

      // Remove from customProjects if it's there
      const saved = localStorage.getItem('customProjects');
      if (saved) {
        const currentCustom = JSON.parse(saved);
        const updatedCustom = currentCustom.filter((p: Project) => p.id !== id);
        localStorage.setItem('customProjects', JSON.stringify(updatedCustom));
      }

      // Update state
      setProjects(getProjects());
      alert('프로젝트가 삭제되었습니다.');
    }
  };

  // QA Functions
  const handleReply = (id: number, reply: string) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedPosts = qaPosts.map(post => {
      if (post.id === id) {
        const newReply = {
          id: `reply-${Date.now()}`,
          author: 'admin' as const,
          content: reply,
          date: today
        };
        return { 
          ...post, 
          status: '답변완료',
          replies: [...(post.replies || []), newReply]
        };
      }
      return post;
    });
    setQaPosts(updatedPosts);
    localStorage.setItem('qaPosts_v3', JSON.stringify(updatedPosts));
    setSelectedPost(updatedPosts.find(p => p.id === id) || null);
    setReplyContent('');
    alert('답변이 등록되었습니다.');
  };

  const handleDeletePost = (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      const updatedPosts = qaPosts.filter(p => p.id !== id);
      setQaPosts(updatedPosts);
      localStorage.setItem('qaPosts_v3', JSON.stringify(updatedPosts));
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-sage-900">관리자 로그인</h2>
            <p className="text-sage-500 text-sm mt-2">관리자 계정으로 로그인하세요.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-sage-700 mb-1">비밀번호</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-3 border border-sage-200 rounded-lg focus:ring-2 focus:ring-sage-500 outline-none transition-all"
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors"
            >
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-sage-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-sage-900 flex items-center gap-2">
            <Lock size={20} className="text-sage-500" />
            관리자 페이지
          </h1>
          <button 
            onClick={handleLogout}
            className="text-sm text-sage-500 hover:text-sage-800 flex items-center gap-1"
          >
            <LogOut size={16} /> 로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 border-b border-sage-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('gallery')}
            className={cn(
              "pb-4 px-2 md:px-4 font-bold text-sm md:text-lg transition-colors relative whitespace-nowrap flex-shrink-0",
              activeTab === 'gallery' ? "text-sage-900" : "text-sage-400 hover:text-sage-600"
            )}
          >
            <span className="flex items-center gap-1.5 md:gap-2"><Image className="w-4 h-4 md:w-5 md:h-5" /> 포트폴리오 관리</span>
            {activeTab === 'gallery' && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900" />}
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={cn(
              "pb-4 px-2 md:px-4 font-bold text-sm md:text-lg transition-colors relative whitespace-nowrap flex-shrink-0",
              activeTab === 'qa' ? "text-sage-900" : "text-sage-400 hover:text-sage-600"
            )}
          >
            <span className="flex items-center gap-1.5 md:gap-2"><MessageSquare className="w-4 h-4 md:w-5 md:h-5" /> 문의게시판 관리</span>
            {activeTab === 'qa' && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900" />}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' ? (
            <motion.div 
              key="gallery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-lg md:text-2xl font-bold text-sage-900 whitespace-nowrap">포트폴리오 목록</h2>
                <button 
                  onClick={() => setIsWritingProject(true)}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-sage-800 text-white text-xs md:text-base font-bold rounded-lg hover:bg-sage-900 flex items-center gap-1.5 md:gap-2 whitespace-nowrap flex-shrink-0"
                >
                  <Plus className="w-4 h-4 md:w-[18px] md:h-[18px]" /> <span className="hidden sm:inline">새 프로젝트 등록</span><span className="sm:hidden">등록</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-sage-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-sage-50 text-sage-700 text-xs font-bold uppercase tracking-wider border-b border-sage-200">
                      <tr>
                        <th className="p-4 w-24 text-center whitespace-nowrap">썸네일</th>
                        <th className="p-4 w-24 text-center whitespace-nowrap">카테고리</th>
                        <th className="p-4 whitespace-nowrap">프로젝트명</th>
                        <th className="p-4 w-32 text-center whitespace-nowrap">위치</th>
                        <th className="p-4 w-24 text-center whitespace-nowrap">면적</th>
                        <th className="p-4 w-20 text-center whitespace-nowrap">관리</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sage-100">
                      {projects.map((p) => (
                        <tr 
                          key={p.id} 
                          className="hover:bg-sage-50/60 transition-colors group cursor-pointer"
                          onClick={() => {
                            setIsWritingProject(true);
                            setEditingProject(p);
                          }}
                        >
                          <td className="p-3 text-center">
                            <img src={p.thumbnail} alt="" className="w-16 h-10 object-cover rounded border border-sage-200 mx-auto" />
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-bold bg-sage-100 text-sage-700 border border-sage-200">
                              {p.category}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-sage-900 truncate max-w-[300px]">{p.title}</td>
                          <td className="p-4 text-center text-sage-600 text-sm whitespace-nowrap">{p.location}</td>
                          <td className="p-4 text-center text-sage-500 text-sm whitespace-nowrap">{p.area}</td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={(e) => handleDeleteProject(e, p.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Grid View */}
                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                  {projects.map((p) => (
                    <div 
                      key={p.id} 
                      className="bg-white rounded-xl overflow-hidden border border-sage-200 shadow-sm cursor-pointer"
                      onClick={() => {
                        setIsWritingProject(true);
                        setEditingProject(p);
                      }}
                    >
                      <div className="aspect-video relative">
                        <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-sage-800 border border-sage-200">
                            {p.category}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProject(e, p.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded border border-sage-200 hover:bg-red-50 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-sage-900 mb-1 line-clamp-1">{p.title}</h3>
                        <p className="text-xs text-sage-500">{p.location} · {p.area}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="qa"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg md:text-2xl font-bold text-sage-900 whitespace-nowrap">문의글 목록</h2>
              
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
                    {qaPosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-sage-400">등록된 문의글이 없습니다.</td>
                      </tr>
                    ) : (
                      qaPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-sage-50/60 transition-colors group">
                          <td className="p-4 text-center text-sage-500 text-sm font-mono whitespace-nowrap">{post.id}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <span className={cn(
                              "inline-block px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm",
                              post.status === '답변완료' 
                                ? "bg-sage-100 text-sage-700 border border-sage-200" 
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                            )}>
                              {post.status}
                            </span>
                          </td>
                          <td className="p-4 max-w-[300px]">
                            <button 
                              onClick={() => setSelectedPost(post)}
                              className="w-full text-left flex items-center gap-2 group-hover:text-sage-800 transition-colors"
                            >
                              {post.isPrivate && <Lock size={14} className="text-sage-400 flex-shrink-0" />}
                              <span className="font-medium text-sage-900 truncate block">{post.title}</span>
                            </button>
                          </td>
                          <td className="p-4 text-center text-sage-600 text-sm whitespace-nowrap">{post.author}</td>
                          <td className="p-4 text-center text-sage-400 text-xs font-mono whitespace-nowrap">{post.date}</td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <button 
                              onClick={() => handleDeletePost(post.id)}
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
          )}
        </AnimatePresence>
      </div>

      {/* Write Project Modal */}
      <AnimatePresence>
        {isWritingProject && (
          <WritePostModal 
            onClose={() => {
              setIsWritingProject(false);
              setEditingProject(null);
            }} 
            onSave={handleSaveProject} 
            categories={['주거', '상업', '사무', '숙박', '가구']}
            initialData={editingProject}
          />
        )}
      </AnimatePresence>

      {/* QA Detail/Reply Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {selectedPost.isPrivate && <Lock size={16} className="text-sage-400" />}
                  {selectedPost.title}
                </h2>
                <button onClick={() => setSelectedPost(null)}><X size={24} /></button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center text-sm text-sage-500 pb-4 border-b">
                  <div className="flex gap-4">
                    <span>작성자: {selectedPost.author}</span>
                    <span>날짜: {selectedPost.date}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    selectedPost.status === '답변완료' ? 'bg-sage-100 text-sage-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {selectedPost.status}
                  </span>
                </div>

                <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed text-sage-800">
                  {selectedPost.content || '내용이 없습니다.'}
                </div>

                {/* Threaded Replies */}
                {selectedPost.replies && selectedPost.replies.length > 0 && (
                  <div className="space-y-4 mt-8">
                    {selectedPost.replies.map(reply => (
                      <div key={reply.id} className={`p-4 rounded-xl ${reply.author === 'admin' ? 'bg-sage-50 ml-4' : 'bg-gray-50 mr-4'}`}>
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

                {/* Reply Section */}
                <div className="bg-sage-50 rounded-xl p-6 mt-8">
                  <h3 className="font-bold text-sage-800 mb-4 flex items-center gap-2">
                    <span className="text-sage-500">A.</span> 
                    관리자 답변 추가
                  </h3>
                  
                  <form onSubmit={(e) => { e.preventDefault(); handleReply(selectedPost.id, replyContent); }} className="mt-4">
                    <textarea 
                      className="w-full p-3 border border-sage-200 rounded-lg mb-3 h-32 focus:ring-2 focus:ring-sage-500 outline-none"
                      placeholder="답변 내용을 입력하세요..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
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

                {/* Delete Button */}
                <div className="flex justify-end pt-4 border-t mt-8">
                  <button 
                    onClick={() => handleDeletePost(selectedPost.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    <Trash2 size={16} /> 게시글 삭제
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusing the WritePostModal from Gallery.tsx logic but standalone here to avoid circular deps or complex exports
// Ideally this should be a shared component, but for now I'll duplicate the form logic for simplicity and speed
const WritePostModal = ({ onClose, onSave, categories, initialData }: { onClose: () => void, onSave: (p: Project) => void, categories: string[], initialData?: Project | null }) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    category: '주거',
    subCategory: '',
    title: '',
    area: '',
    location: '',
    duration: '',
    scope: '',
    description: '',
    keywords: [],
    thumbnail: '',
    heroImage: '',
    spaces: [],
    details: [],
    comparisons: [],
    ...initialData // Merge initial data if provided
  });

  const [keywordInput, setKeywordInput] = useState('');
  
  // Space Input State
  const [spaceName, setSpaceName] = useState('');
  const [spaceDesc, setSpaceDesc] = useState('');
  const [spaceImages, setSpaceImages] = useState<string[]>([]);
  const [spaceImageUrl, setSpaceImageUrl] = useState('');
  const [editingSpaceIndex, setEditingSpaceIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      ...formData as Project,
      id: initialData?.id || `project-${Date.now()}`, // Use existing ID if editing
      keywords: formData.keywords || [],
      spaces: formData.spaces || [],
      details: formData.details || [],
      comparisons: formData.comparisons || []
    };
    onSave(newProject);
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const addSpaceImage = () => {
    if (spaceImageUrl.trim()) {
      setSpaceImages([...spaceImages, spaceImageUrl.trim()]);
      setSpaceImageUrl('');
    }
  };

  const addOrUpdateSpace = () => {
    if (spaceName.trim() && spaceImages.length > 0) {
      if (editingSpaceIndex !== null) {
        // Update existing space
        setFormData(prev => {
          const updatedSpaces = [...(prev.spaces || [])];
          updatedSpaces[editingSpaceIndex] = {
            name: spaceName.trim(),
            description: spaceDesc.trim(),
            images: spaceImages
          };
          return { ...prev, spaces: updatedSpaces };
        });
        setEditingSpaceIndex(null);
      } else {
        // Add new space
        setFormData(prev => ({
          ...prev,
          spaces: [...(prev.spaces || []), {
            name: spaceName.trim(),
            description: spaceDesc.trim(),
            images: spaceImages
          }]
        }));
      }
      // Reset form
      setSpaceName('');
      setSpaceDesc('');
      setSpaceImages([]);
    } else {
      alert('공간 이름과 최소 1장의 이미지를 입력해주세요.');
    }
  };

  const editSpace = (index: number) => {
    const spaceToEdit = formData.spaces?.[index];
    if (spaceToEdit) {
      setSpaceName(spaceToEdit.name);
      setSpaceDesc(spaceToEdit.description || '');
      setSpaceImages(spaceToEdit.images);
      setEditingSpaceIndex(index);
    }
  };

  const removeSpace = (index: number) => {
    if (window.confirm('이 공간을 삭제하시겠습니까?')) {
      setFormData(prev => ({
        ...prev,
        spaces: prev.spaces?.filter((_, i) => i !== index)
      }));
      if (editingSpaceIndex === index) {
        setEditingSpaceIndex(null);
        setSpaceName('');
        setSpaceDesc('');
        setSpaceImages([]);
      }
    }
  };

  const handleReorderSpaces = (newOrder: any[]) => {
    setFormData(prev => ({
      ...prev,
      spaces: newOrder
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold">{initialData ? '프로젝트 수정' : '새 프로젝트 작성'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Info */}
          <section className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">기본 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">카테고리</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">세부 카테고리</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                  placeholder="예: 아파트, 카페"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">프로젝트 제목</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">면적</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  placeholder="예: 34평"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">위치</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">공사 기간</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  placeholder="예: 4주"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">공사 범위</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg"
                  value={formData.scope}
                  onChange={(e) => setFormData({...formData, scope: e.target.value})}
                  placeholder="예: 전체 리모델링"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">설명</label>
              <textarea 
                className="w-full p-2 border rounded-lg h-24"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">키워드</label>
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  className="flex-1 p-2 border rounded-lg"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="키워드 입력 후 추가"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                />
                <button type="button" onClick={addKeyword} className="px-4 py-2 bg-gray-200 rounded-lg">추가</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keywords?.map((k, i) => (
                  <span key={i} className="px-2 py-1 bg-sage-100 text-sage-800 rounded text-xs flex items-center gap-1">
                    #{k}
                    <button type="button" onClick={() => setFormData(prev => ({...prev, keywords: prev.keywords?.filter((_, idx) => idx !== i)}))}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">썸네일 이미지 URL</label>
              <input 
                type="url" 
                className="w-full p-2 border rounded-lg"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">메인(히어로) 이미지 URL</label>
              <input 
                type="url" 
                className="w-full p-2 border rounded-lg"
                value={formData.heroImage}
                onChange={(e) => setFormData({...formData, heroImage: e.target.value})}
                placeholder="https://..."
                required
              />
            </div>
          </section>

          {/* Spaces Section */}
          <section className="space-y-4">
            <h3 className="font-bold text-lg border-b pb-2">공간별 상세 (Spaces)</h3>
            <p className="text-sm text-gray-500">공간을 드래그하여 순서를 변경할 수 있습니다.</p>
            
            {/* Reorderable Spaces List */}
            <Reorder.Group axis="y" values={formData.spaces || []} onReorder={handleReorderSpaces} className="space-y-4 mb-6">
              {formData.spaces?.map((space, idx) => (
                <Reorder.Item 
                  key={space.name} 
                  value={space} 
                  className={cn(
                    "p-4 rounded-xl border transition-all",
                    editingSpaceIndex === idx 
                      ? "bg-sage-100 border-sage-300 shadow-md" 
                      : "bg-gray-50 border-gray-200 relative group cursor-grab active:cursor-grabbing"
                  )}
                >
                  {editingSpaceIndex === idx ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-sm text-sage-800 flex items-center gap-2">
                          <Edit2 size={14} /> 공간 수정 중...
                        </h4>
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingSpaceIndex(null);
                            setSpaceName('');
                            setSpaceDesc('');
                            setSpaceImages([]);
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          수정 취소
                        </button>
                      </div>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-lg bg-white"
                        placeholder="공간 이름 (예: 거실, 주방)"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        autoFocus
                      />
                      <textarea 
                        className="w-full p-2 border rounded-lg h-20 bg-white"
                        placeholder="공간에 대한 설명/코멘터리"
                        value={spaceDesc}
                        onChange={(e) => setSpaceDesc(e.target.value)}
                      />
                      <div>
                        <div className="flex gap-2 mb-2">
                          <input 
                            type="url" 
                            className="flex-1 p-2 border rounded-lg text-sm bg-white"
                            placeholder="이미지 URL 입력"
                            value={spaceImageUrl}
                            onChange={(e) => setSpaceImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpaceImage())}
                          />
                          <button type="button" onClick={addSpaceImage} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">추가</button>
                        </div>
                        {spaceImages.length > 0 && (
                          <Reorder.Group 
                            axis="x" 
                            values={spaceImages} 
                            onReorder={setSpaceImages} 
                            className="flex gap-2 flex-wrap"
                          >
                            {spaceImages.map((img, i) => (
                              <Reorder.Item 
                                key={img} 
                                value={img} 
                                className="relative group/img cursor-grab active:cursor-grabbing"
                              >
                                <img src={img} alt="" className="w-12 h-12 object-cover rounded border" />
                                <button 
                                  type="button" 
                                  onClick={() => setSpaceImages(spaceImages.filter((_, idx) => idx !== i))}
                                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity z-10"
                                >
                                  <X size={10} />
                                </button>
                              </Reorder.Item>
                            ))}
                          </Reorder.Group>
                        )}
                      </div>
                      <button 
                        type="button" 
                        onClick={addOrUpdateSpace}
                        className="w-full py-2 bg-sage-700 text-white text-sm font-bold rounded-lg hover:bg-sage-800"
                      >
                        공간 수정 완료
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button 
                          type="button" 
                          onClick={() => editSpace(idx)}
                          className="text-sage-500 hover:text-sage-700 p-1"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeSpace(idx)}
                          className="text-red-400 hover:text-red-600 p-1"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-gray-400"><GripVertical size={20} /></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sage-900 mb-1">{space.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{space.description}</p>
                          <div className="flex gap-2 overflow-x-auto pb-2">
                            {space.images.map((img, i) => (
                              <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Reorder.Item>
              ))}
            </Reorder.Group>

            {/* Add Space Form (Only shown when not editing a space) */}
            {editingSpaceIndex === null && (
              <div className="bg-sage-50 p-4 rounded-xl border border-sage-100">
                <h4 className="font-bold text-sm text-sage-800 mb-3 flex items-center gap-2">
                  <Plus size={14} /> 새 공간 추가
                </h4>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded-lg"
                    placeholder="공간 이름 (예: 거실, 주방)"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                  />
                  <textarea 
                    className="w-full p-2 border rounded-lg h-20"
                    placeholder="공간에 대한 설명/코멘터리"
                    value={spaceDesc}
                    onChange={(e) => setSpaceDesc(e.target.value)}
                  />
                  
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="url" 
                        className="flex-1 p-2 border rounded-lg text-sm"
                        placeholder="이미지 URL 입력"
                        value={spaceImageUrl}
                        onChange={(e) => setSpaceImageUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpaceImage())}
                      />
                      <button type="button" onClick={addSpaceImage} className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm">추가</button>
                    </div>
                    {spaceImages.length > 0 && (
                      <Reorder.Group 
                        axis="x" 
                        values={spaceImages} 
                        onReorder={setSpaceImages} 
                        className="flex gap-2 flex-wrap"
                      >
                        {spaceImages.map((img, i) => (
                          <Reorder.Item 
                            key={img} 
                            value={img} 
                            className="relative group cursor-grab active:cursor-grabbing"
                          >
                            <img src={img} alt="" className="w-12 h-12 object-cover rounded border" />
                            <button 
                              type="button" 
                              onClick={() => setSpaceImages(spaceImages.filter((_, idx) => idx !== i))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X size={10} />
                            </button>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    )}
                  </div>

                  <button 
                    type="button" 
                    onClick={addOrUpdateSpace}
                    className="w-full py-2 bg-sage-800 text-white text-sm font-bold rounded-lg hover:bg-sage-900"
                  >
                    공간 추가하기
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
            <button type="submit" className="px-6 py-2 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900">{initialData ? '수정 완료' : '프로젝트 등록하기'}</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

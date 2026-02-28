import React, { useState } from 'react';
import { SectionTitle } from '../components/Common';
import { FAQS } from '../data/projects';
import { QAPost } from '../types';
import { ChevronDown, ChevronUp, Lock, Search, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QA = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'board'>('faq');
  const [isWriting, setIsWriting] = useState(false);
  
  const [selectedPost, setSelectedPost] = useState<QAPost | null>(null);
  const [passwordPromptPost, setPasswordPromptPost] = useState<QAPost | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [replyInput, setReplyInput] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load posts from local storage
  const [posts, setPosts] = useState<QAPost[]>(() => {
    const saved = localStorage.getItem('qaPosts_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSavePost = (newPost: QAPost) => {
    const saved = localStorage.getItem('qaPosts_v3');
    const currentPosts = saved ? JSON.parse(saved) : [];
    const updatedPosts = [newPost, ...currentPosts];
    localStorage.setItem('qaPosts_v3', JSON.stringify(updatedPosts));
    
    // Update state with new post at the beginning
    setPosts(updatedPosts);
    setIsWriting(false);
  };

  const handlePostClick = (post: QAPost) => {
    if (post.isPrivate) {
      setPasswordPromptPost(post);
      setPasswordInput('');
    } else {
      setSelectedPost(post);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordPromptPost?.password === passwordInput) {
      setSelectedPost(passwordPromptPost);
      setPasswordPromptPost(null);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleUserReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !replyInput.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newReply = {
      id: `reply-${Date.now()}`,
      author: 'user' as const,
      content: replyInput,
      date: today
    };
    
    const updatedPost = {
      ...selectedPost,
      status: '검토중' as const,
      replies: [...(selectedPost.replies || []), newReply]
    };
    
    const saved = localStorage.getItem('qaPosts_v3');
    const currentPosts: QAPost[] = saved ? JSON.parse(saved) : [];
    const updatedPosts = currentPosts.map(p => p.id === updatedPost.id ? updatedPost : p);
    
    localStorage.setItem('qaPosts_v3', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    setSelectedPost(updatedPost);
    setReplyInput('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    
    if (query) {
      const filtered = posts.filter(post => post.title.includes(query));
      if (filtered.length === 0) {
        alert('검색하신 내용이 존재하지 않습니다.');
        setSearchInput('');
        setSearchQuery('');
        return;
      }
    }
    setSearchQuery(query);
  };

  const filteredPosts = posts.filter(post => post.title.includes(searchQuery));

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 relative">
      <SectionTitle title="Q&A" subtitle="자주 묻는 질문과 1:1 문의 게시판입니다." />

      {/* Write Inquiry Modal */}
      <AnimatePresence>
        {isWriting && (
          <WriteInquiryModal 
            onClose={() => setIsWriting(false)} 
            onSave={handleSavePost} 
            lastId={posts.length > 0 ? Math.max(...posts.map(p => p.id)) : 0}
          />
        )}
      </AnimatePresence>

      <div className="flex border-b border-sage-200 mb-12">
        <button 
          onClick={() => setActiveTab('faq')}
          className={`px-8 py-4 font-bold text-sm transition-colors relative ${activeTab === 'faq' ? 'text-sage-900' : 'text-sage-400'}`}
        >
          자주 묻는 질문
          {activeTab === 'faq' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900" />}
        </button>
        <button 
          onClick={() => setActiveTab('board')}
          className={`px-8 py-4 font-bold text-sm transition-colors relative ${activeTab === 'board' ? 'text-sage-900' : 'text-sage-400'}`}
        >
          문의 게시판
          {activeTab === 'board' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-900" />}
        </button>
      </div>

      {activeTab === 'faq' ? (
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-sage-100 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-4 py-4 md:px-8 md:py-6 flex items-center justify-between text-left hover:bg-sage-50 transition-colors"
              >
                <span className="font-bold text-sage-800 flex gap-2 md:gap-4 items-center overflow-hidden">
                  <span className="text-sage-300 flex-shrink-0">Q.</span>
                  <span className="text-xs md:text-base whitespace-nowrap overflow-hidden text-ellipsis">{faq.question}</span>
                </span>
                <span className="flex-shrink-0 ml-2">
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 pt-2 text-sm text-sage-600 leading-relaxed flex gap-4">
                      <span className="text-sage-300 font-bold">A.</span>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-2 items-center">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input 
                type="text" 
                className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white border border-sage-200 rounded-lg text-xs md:text-sm" 
                placeholder="검색어를 입력하세요" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600">
                <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </form>
            <button 
              onClick={() => setIsWriting(true)}
              className="flex items-center gap-1 md:gap-2 px-3 md:px-6 py-2 bg-sage-800 text-white text-xs md:text-sm font-bold rounded-lg hover:bg-sage-900 transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" /> 문의하기
            </button>
          </div>

          {/* Desktop Table View */}
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
                {filteredPosts.map((post) => (
                  <tr key={post.id} onClick={() => handlePostClick(post)} className="hover:bg-sage-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-sage-400">{post.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {post.isPrivate && <Lock size={14} className="text-sage-300" />}
                        <span className={post.isPrivate ? 'text-sage-400' : 'text-sage-800'}>{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sage-600">{post.author}</td>
                    <td className="px-6 py-4 text-sage-400">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap ${
                        post.status === '답변완료' ? 'bg-sage-100 text-sage-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} onClick={() => handlePostClick(post)} className="bg-white p-5 rounded-xl border border-sage-100 shadow-sm space-y-3 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      post.status === '답변완료' ? 'bg-sage-100 text-sage-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-xs text-sage-400">No. {post.id}</span>
                  </div>
                  <span className="text-xs text-sage-400">{post.date}</span>
                </div>
                
                <h3 className="font-bold text-sage-800 flex items-center gap-2">
                  {post.isPrivate && <Lock size={14} className="text-sage-300 flex-shrink-0" />}
                  <span className="line-clamp-1">{post.title}</span>
                </h3>
                
                <div className="flex justify-between items-center pt-2 border-t border-sage-50">
                  <span className="text-xs text-sage-500">작성자: {post.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Password Prompt Modal */}
      <AnimatePresence>
        {passwordPromptPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">비밀번호 확인</h3>
                <button onClick={() => setPasswordPromptPost(null)}><Plus className="rotate-45" size={20} /></button>
              </div>
              <p className="text-sm text-sage-600 mb-4">비공개 글입니다. 작성 시 입력한 비밀번호를 입력해주세요.</p>
              <form onSubmit={handlePasswordSubmit}>
                <input 
                  type="password" 
                  className="w-full p-3 border border-sage-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-sage-200"
                  placeholder="비밀번호"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="w-full py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors">
                  확인
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
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
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      selectedPost.status === '답변완료' ? 'bg-sage-100 text-sage-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {selectedPost.status}
                    </span>
                    <span className="text-xs text-sage-400">{selectedPost.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-sage-900">{selectedPost.title}</h2>
                  <p className="text-sm text-sage-500 mt-1">작성자: {selectedPost.author}</p>
                </div>
                <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-sage-50 rounded-full transition-colors">
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="min-h-[150px] whitespace-pre-wrap text-sage-800 leading-relaxed">
                  {selectedPost.content}
                </div>
                
                {/* Replies Section */}
                {selectedPost.replies && selectedPost.replies.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h4 className="font-bold text-sage-900 border-b border-sage-100 pb-2">답변 및 댓글</h4>
                    {selectedPost.replies.map(reply => (
                      <div key={reply.id} className={`p-4 rounded-xl ${reply.author === 'admin' ? 'bg-sage-50 border border-sage-100' : 'bg-gray-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-bold text-sm ${reply.author === 'admin' ? 'text-sage-800' : 'text-gray-700'}`}>
                            {reply.author === 'admin' ? '관리자' : '작성자'}
                          </span>
                          <span className="text-xs text-sage-400">{reply.date}</span>
                        </div>
                        <p className="text-sm text-sage-700 whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-sage-100 bg-sage-50/50 rounded-b-2xl">
                <form onSubmit={handleUserReply} className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 p-3 border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-200 text-sm"
                    placeholder="추가 문의사항을 남겨주세요"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                  />
                  <button type="submit" className="px-6 py-3 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors whitespace-nowrap text-sm">
                    등록
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WriteInquiryModal = ({ onClose, onSave, lastId }: { onClose: () => void, onSave: (p: QAPost) => void, lastId: number }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    password: '',
    content: '',
    isPrivate: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const newPost: QAPost = {
      id: lastId + 1,
      title: formData.title,
      author: formData.author.substring(0, 1) + '*' + formData.author.substring(2), // Simple masking
      date: today,
      status: '검토중',
      isPrivate: formData.isPrivate,
      content: formData.content,
      password: formData.password
    };
    onSave(newPost);
  };

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
          <button onClick={onClose}><Plus className="rotate-45" size={24} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">제목</label>
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
              <label className="block text-sm font-medium mb-1">작성자</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">비밀번호</label>
              <input 
                type="password" 
                className="w-full p-2 border rounded-lg"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">내용</label>
            <textarea 
              className="w-full p-2 border rounded-lg h-32"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({...formData, isPrivate: e.target.checked})}
            />
            <label htmlFor="isPrivate" className="text-sm">비밀글로 작성</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">취소</button>
            <button type="submit" className="px-6 py-2 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900">등록하기</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

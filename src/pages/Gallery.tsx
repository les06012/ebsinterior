import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SectionTitle, cn } from '../components/Common';
import { PROJECTS, getProjects } from '../data/projects';
import { Project } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Maximize2, Calendar, Tag, ArrowLeft, Phone, Plus, X, Lock } from 'lucide-react';

export const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Load projects from local storage and merge with static data
  const [projects, setProjects] = useState<Project[]>(() => {
    return getProjects();
  });

  const categories = ['전체', '주거', '상업', '사무', '숙박', '가구'];
  
  const filteredProjects = selectedCategory === '전체' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleAdminLogin = () => {
    if (passwordInput === 'admin123') {
      setIsAdmin(true);
      setShowPasswordModal(false);
      setPasswordInput('');
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSavePost = (newProject: Project) => {
    const saved = localStorage.getItem('customProjects');
    const currentCustom = saved ? JSON.parse(saved) : [];
    const updatedCustom = [...currentCustom, newProject];
    localStorage.setItem('customProjects', JSON.stringify(updatedCustom));
    setProjects(getProjects());
    setIsWriting(false);
  };

  return (
    <div className="py-12 px-4 relative">
      <SectionTitle title="갤러리" subtitle="에바스의 다양한 공간 포트폴리오입니다." />
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all border",
              selectedCategory === cat
                ? "bg-sage-800 text-white border-sage-800 shadow-md"
                : "bg-white text-sage-600 border-sage-200 hover:border-sage-400"
            )}
          >
            {cat}{(cat !== '전체' && cat !== '가구') ? '공간' : ''}
          </button>
        ))}
      </div>
      
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((p) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={p.id}
            >
              <Link to={`/gallery/detail/${p.id}`} className="group block">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-4 relative">
                <img 
                  src={p.thumbnail} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onContextMenu={(e) => e.preventDefault()}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 bg-white/90 rounded-full text-xs font-bold text-sage-900">상세보기</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-sage-500">{p.category} · {p.subCategory} · {p.area}</p>
                <h3 className="text-lg font-bold group-hover:text-sage-600 transition-colors">{p.title}</h3>
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.keywords.map(k => (
                    <span key={k} className="text-[10px] px-2 py-0.5 bg-sage-100 text-sage-600 rounded">#{k}</span>
                  ))}
                </div>
              </div>
            </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="col-span-full py-24 text-center text-sage-400"
          >
            등록된 프로젝트가 없습니다.
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const GalleryDetail = () => {
  const { id } = useParams();
  
  const project = useMemo(() => {
    const saved = localStorage.getItem('customProjects');
    const customProjects = saved ? JSON.parse(saved) : [];
    const allProjects = [...PROJECTS, ...customProjects] as Project[];
    return allProjects.find(p => p.id === id);
  }, [id]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Drag to scroll state
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Flatten all images for navigation
  const allImages = React.useMemo(() => {
    if (!project) return [];
    return project.spaces.flatMap(space => space.images);
  }, [project]);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = allImages.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % allImages.length;
    setSelectedImage(allImages[nextIndex]);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = allImages.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setSelectedImage(allImages[prevIndex]);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, allImages]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    sliderRef.current.style.cursor = 'grabbing';
    sliderRef.current.style.scrollSnapType = 'none'; // Disable snap while dragging
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
      sliderRef.current.style.scrollSnapType = 'x mandatory'; // Re-enable snap
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleImageClick = (url: string) => {
    if (isDragging) return;
    setSelectedImage(url);
  };

  if (!project) return <div className="p-12 text-center">프로젝트를 찾을 수 없습니다.</div>;

  return (
    <div className="pb-24 bg-[#D9E3D0]/30 min-h-screen overflow-x-hidden">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 md:p-12"
          >
            <motion.img
              key={selectedImage} // Add key to trigger animation on image change
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            
            {/* Navigation Buttons */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
              onClick={handlePrevImage}
            >
              <ArrowLeft size={48} />
            </button>
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
              onClick={handleNextImage}
            >
              <ArrowLeft className="rotate-180" size={48} />
            </button>

            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <ArrowLeft className="rotate-90" size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1) Project Cover Image + Title Overlay */}
      <div className="relative h-[70vh] min-h-[500px] -mt-8 -mx-8 mb-12 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={project.heroImage} 
          alt={project.title} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/gallery" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} /> Back to Gallery
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{project.title}</h1>
            <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm font-light tracking-wide">
              <span className="flex items-center gap-2"><MapPin size={14} /> {project.location}</span>
              <span className="flex items-center gap-2"><Maximize2 size={14} /> {project.area}</span>
              <span className="flex items-center gap-2"><Calendar size={14} /> {project.duration}</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Space Sections with Horizontal Swipe */}
        <div className="space-y-24 mb-24">
          {project.spaces.map((space, index) => (
            <section key={index}>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold text-sage-900">{space.name}</h3>
                  <span className="text-xs text-sage-400 font-medium tracking-widest uppercase">Drag or Swipe to view</span>
                </div>
                {space.description && (
                  <p className="text-sage-600 leading-relaxed max-w-3xl">{space.description}</p>
                )}
              </div>
              
              <div 
                ref={sliderRef}
                className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              >
                {space.images.map((url, idx) => (
                  <div key={idx} className="flex-none w-[85vw] md:w-[700px] snap-center">
                    <div 
                      className="aspect-[16/10] rounded-3xl overflow-hidden bg-white shadow-md group relative select-none"
                      onClick={() => handleImageClick(url)}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <img 
                        src={url} 
                        alt={`${space.name}-${idx}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={48} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Day/Night Comparison Section (Half-and-Half) */}
        {project.comparisons && project.comparisons.length > 0 && (
          <section className="mb-32">
            <div className="text-center mb-16">
              <h3 className="text-[11px] font-bold tracking-[0.3em] text-sage-400 uppercase mb-4">Comparison</h3>
              <h2 className="text-3xl font-bold text-sage-900">Day & Night</h2>
            </div>
            
            <div className="space-y-12">
              {project.comparisons.map((comp, idx) => (
                <div key={idx} className="space-y-6">
                  <h4 className="text-center text-lg font-medium text-sage-700">{comp.title}</h4>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="relative aspect-[4/5] md:aspect-video">
                      <img 
                        src={comp.day} 
                        alt="Day" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest">Day</div>
                    </div>
                    <div className="relative aspect-[4/5] md:aspect-video">
                      <img 
                        src={comp.night} 
                        alt="Night" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white rounded-full text-[10px] font-bold uppercase tracking-widest">Night</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <div className="p-16 bg-white rounded-[3rem] text-center shadow-sm border border-sage-100">
          <h3 className="text-3xl font-bold mb-6 text-sage-900">공간의 가치를 함께 고민합니다.</h3>
          <p className="text-sage-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            에바스는 단순한 시공을 넘어, 사용자의 삶과 브랜드의 철학이 담긴 공간을 제안합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="px-10 py-5 bg-sage-800 text-white font-bold rounded-2xl hover:bg-sage-900 transition-all hover:shadow-lg">
              상담 신청하기
            </Link>
            <a href="tel:010-6634-8119" className="px-10 py-5 bg-sage-50 text-sage-900 font-bold rounded-2xl border border-sage-200 hover:bg-white transition-all flex items-center justify-center gap-3">
              <Phone size={18} /> 010-6634-8119
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

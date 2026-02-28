import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, User, Image, ClipboardList, HelpCircle, Phone, Menu, X, MessageSquare } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: '인사말', path: '/about', icon: User },
    { name: '갤러리', path: '/gallery', icon: Image },
    { name: '업무안내', path: '/process', icon: ClipboardList },
    { name: 'Q&A', path: '/qa', icon: HelpCircle },
    { name: '연락처', path: '/contact', icon: Phone },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#C4C4C4] z-50">
      <div className="p-12 text-center">
        <Link to="/" className="block">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            에바스
          </h1>
          <p className="text-sm text-white/80 font-medium">상담 문의 전화 환영</p>
        </Link>
      </div>

      <nav className="flex-1 mt-12 flex flex-col justify-between pb-8">
        <ul className="space-y-0">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center justify-end px-8 py-4 text-sm transition-colors font-medium",
                    isActive ? "bg-[#A3B18A] text-white" : "text-white/80 hover:bg-white/10"
                  )
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="px-8 text-right">
          <Link to="/admin" className="text-xs text-white/50 hover:text-white transition-colors">
            관리자
          </Link>
        </div>
      </nav>

    </aside>
  );
};

export const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'HOME', path: '/', icon: Home },
    { name: '인사말', path: '/about', icon: User },
    { name: '갤러리', path: '/gallery', icon: Image },
    { name: '업무안내', path: '/process', icon: ClipboardList },
    { name: 'Q&A', path: '/qa', icon: HelpCircle },
    { name: '연락처', path: '/contact', icon: Phone },
  ];

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#C4C4C4] border-b border-white/10 z-[60] flex items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-white">에바스</Link>
        <button onClick={() => setIsOpen(true)} className="p-2 text-white">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div className={cn(
        "fixed inset-0 bg-black/50 z-[70] transition-opacity duration-300 lg:hidden",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )} onClick={() => setIsOpen(false)}>
        <div 
          className={cn(
            "absolute right-0 top-0 bottom-0 w-64 bg-[#C4C4C4] transition-transform duration-300 ease-in-out p-8 flex flex-col",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-12">
            <span className="font-bold tracking-tighter text-white">MENU</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-between">
            <ul className="space-y-6">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-4 text-lg font-medium",
                        isActive ? "text-white" : "text-white/60"
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-white/10">
              <Link 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className="text-xs text-white/40 hover:text-white transition-colors"
              >
                관리자 로그인
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export const MobileBottomCTA = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-sage-200 z-50 grid grid-cols-2">
      <a href="tel:010-6634-8119" className="flex flex-col items-center justify-center gap-1 border-r border-sage-100">
        <Phone size={20} className="text-sage-800" />
        <span className="text-[10px] font-medium">전화상담</span>
      </a>
      <Link to="/contact" className="flex flex-col items-center justify-center gap-1">
        <ClipboardList size={20} className="text-sage-800" />
        <span className="text-[10px] font-medium">상담신청</span>
      </Link>
    </div>
  );
};

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <h2 className="text-3xl font-bold text-sage-900 tracking-tight">{title}</h2>
    {subtitle && <p className="text-sage-600 mt-2">{subtitle}</p>}
  </div>
);

export const Footer = () => (
  <footer className="py-12 px-8 border-t border-sage-200 bg-white">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-lg mb-4">에바스</h3>
          <p className="text-sm text-sage-600 leading-relaxed">
            상호명: 에바스 | 대표자: 김태주<br />
            에바스 : 경기도 평택시 관동길 91-99<br />
            디자인센터 : 경기도 평택시 관광특구로36
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-sage-600 leading-relaxed">
            <span className="block md:inline">대표번호 : 010-6634-8119</span>
            <span className="hidden md:inline"> | </span>
            <span className="block md:inline">전화번호 : 031-664-4666</span><br />
            팩스 : 050-4040-8119<br />
            EMAIL : kimto99zz@gmail.com
          </p>
        </div>
      </div>
      <div className="pt-8 border-t border-sage-100 text-center">
        <p className="text-[10px] text-sage-400 uppercase tracking-widest">
          &copy; 2026 에바스. ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  </footer>
);

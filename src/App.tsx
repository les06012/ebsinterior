/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar, MobileHeader, MobileBottomCTA, Footer } from './components/Common';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Gallery, GalleryDetail } from './pages/Gallery';
import { Process } from './pages/Process';
import { QA } from './pages/QA';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ScrollNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isNavigating = useRef(false);
  const touchStartY = useRef(0);

  const navOrder = [
    '/',
    '/about',
    '/gallery',
    '/process',
    '/qa',
    '/contact'
  ];

  useEffect(() => {
    const handleNavigation = (direction: 'next' | 'prev') => {
      const currentIndex = navOrder.indexOf(pathname);
      if (currentIndex === -1) return;

      let targetPath = '';
      if (direction === 'next' && currentIndex < navOrder.length - 1) {
        targetPath = navOrder[currentIndex + 1];
      } else if (direction === 'prev' && currentIndex > 0) {
        targetPath = navOrder[currentIndex - 1];
      }

      if (targetPath) {
        isNavigating.current = true;
        setTimeout(() => {
          navigate(targetPath);
          isNavigating.current = false;
        }, 500);
      }
    };

    const isAtBottom = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;
      return scrollTop + clientHeight >= scrollHeight - 10;
    };

    const isAtTop = () => {
      return (window.scrollY || document.documentElement.scrollTop) <= 10;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isNavigating.current) return;

      if (e.deltaY > 0 && isAtBottom()) {
        handleNavigation('next');
      } else if (e.deltaY < 0 && isAtTop()) {
        handleNavigation('prev');
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isNavigating.current) return;

      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (deltaY > 50 && isAtBottom()) {
        handleNavigation('next');
      } else if (deltaY < -50 && isAtTop()) {
        handleNavigation('prev');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [pathname, navigate]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/detail/:id" element={<GalleryDetail />} />
          <Route path="/process" element={<Process />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <ScrollNavigation />
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Navigation */}
        <Sidebar />
        <MobileHeader />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16 lg:pt-8 bg-sage-50 min-h-screen flex flex-col">
          <div className="flex-1 px-4 lg:px-8 max-w-7xl mx-auto w-full overflow-hidden">
            <AnimatedRoutes />
          </div>
          <Footer />
        </main>

        {/* Mobile Fixed CTA */}
        <MobileBottomCTA />
      </div>
    </Router>
  );
}

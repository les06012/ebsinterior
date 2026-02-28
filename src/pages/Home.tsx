import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { SectionTitle } from '../components/Common';
import { PROJECTS } from '../data/projects';

export const Home = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
        setTimeout(() => setSubmitStatus('idle'), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { title: '사용자 중심 설계', desc: '거주자의 동선과 생활 습관을 면밀히 분석하여 최적의 레이아웃을 제안합니다.' },
    { title: '공정/예산 관리', desc: '투명한 견적 산출과 철저한 공정 관리를 통해 예산 내 최상의 품질을 보장합니다.' },
    { title: '맞춤가구 디테일', desc: '공간의 효율을 극대화하는 자체 제작 맞춤 가구로 완성도를 높입니다.' },
    { title: '사후관리 대응', desc: '시공 후에도 안심하고 사용하실 수 있도록 체계적인 AS 시스템을 운영합니다.' },
  ];

  const processes = [
    { step: '01', title: '상담 및 현장 진단', desc: '요구사항 상담 및 실측' },
    { step: '02', title: '맞춤 설계 및 제안', desc: '디자인 방향 및 자재 제안' },
    { step: '03', title: '계약', desc: '견적 및 일정 확정' },
    { step: '04', title: '시공 및 감리', desc: '철저한 현장 품질 관리' },
    { step: '05', title: '검수 및 인수인계', desc: '최종 점검 및 AS 안내' },
  ];

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden -mt-8 -mx-8">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 px-6 w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-white/90 text-xl md:text-2xl mb-4 font-medium tracking-tight">
              “공간에 가치를 담다, 인테리어의 선두주자”
            </p>
            <h1 className="text-5xl md:text-8xl font-bold text-white leading-tight mb-8">
              에바스
            </h1>
            <div className="space-y-2 mb-10">
              <p className="text-lg md:text-xl text-white/90 font-light">
                맞춤가구 친환경 인테리어 전문
              </p>
              <p className="text-lg md:text-xl text-white/90 font-light">
                상담 문의 환영
              </p>
            </div>
            
            <div className="space-y-2 mb-12 text-white/90 font-bold text-xl">
              <p>TEL. 010-6634-8119</p>
              <p>TEL. 031-664-4666</p>
            </div>

            <div className="flex justify-center">
              <Link 
                to="/contact" 
                className="px-16 py-4 border-2 border-white text-white text-2xl font-medium hover:bg-white/10 transition-colors"
              >
                문의하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4">
        <SectionTitle title="핵심 강점" subtitle="에바스가 추구하는 가치입니다." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-white rounded-2xl border border-sage-100 shadow-sm hover:shadow-md transition-shadow">
              <CheckCircle2 className="text-sage-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-sage-600 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Projects */}
      <section className="px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-sage-900 tracking-tight mb-2">대표 프로젝트</h2>
          <div className="flex justify-between items-center">
            <p className="text-sage-600 text-[11px] sm:text-sm whitespace-nowrap tracking-tighter sm:tracking-normal">최근 진행된 주요 시공 사례입니다.</p>
            {PROJECTS.length > 0 && (
              <Link to="/gallery" className="text-sage-600 hover:text-sage-900 text-[11px] sm:text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                전체보기 <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
        {PROJECTS.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROJECTS.slice(0, 3).map((p) => (
              <Link key={p.id} to={`/gallery/${p.id}`} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={p.thumbnail} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-xs text-sage-500 mb-1">{p.category} · {p.subCategory}</p>
                <h3 className="text-lg font-bold group-hover:text-sage-600 transition-colors">{p.title}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-2xl border border-sage-100 border-dashed">
            <p className="text-sage-400 text-sm">현재 업데이트 중입니다.</p>
          </div>
        )}
      </section>

      {/* Process Summary */}
      <section className="px-4 py-20 bg-sage-100 -mx-8 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-sage-900 tracking-tight mb-2">업무 프로세스</h2>
            <p className="text-sage-600 text-[11px] sm:text-sm whitespace-nowrap tracking-tighter sm:tracking-normal">체계적인 단계별 관리를 통해 완성도 높은 공간을 만듭니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {processes.map((p, i) => (
              <div key={i} className="relative p-6 bg-white rounded-xl border border-sage-200">
                <span className="text-3xl font-black text-sage-100 absolute top-4 right-4">{p.step}</span>
                <h4 className="font-bold mb-2 relative z-10">{p.title}</h4>
                <p className="text-xs text-sage-500 relative z-10">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Inquiry */}
      <section className="px-4 max-w-3xl mx-auto text-center">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-sage-900 tracking-tight mb-2">빠른 상담 문의</h2>
          <p className="text-sage-600 text-[11px] sm:text-sm whitespace-nowrap tracking-tighter sm:tracking-normal">궁금하신 점을 남겨주시면 확인 후 연락드리겠습니다.</p>
        </div>
        <form action="https://formspree.io/f/mpqjnkjy" method="POST" onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <label className="text-xs font-bold text-sage-600">성함</label>
            <input type="text" name="name" required className="w-full px-4 py-3 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-200" placeholder="성함을 입력해주세요" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-sage-600">연락처</label>
            <input type="tel" name="phone" required className="w-full px-4 py-3 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-200" placeholder="010-0000-0000" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-sage-600">문의내용</label>
            <textarea name="message" required className="w-full px-4 py-3 bg-white border border-sage-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-200 h-32" placeholder="공사 유형, 지역, 면적 등 대략적인 내용을 남겨주세요"></textarea>
          </div>
          <div className="md:col-span-2 flex items-center gap-2">
            <input type="checkbox" id="privacy" name="privacy_consent" required className="w-4 h-4 accent-sage-800" />
            <label htmlFor="privacy" className="text-xs text-sage-500">개인정보 수집 및 이용에 동의합니다.</label>
          </div>
          {submitStatus === 'success' && (
            <div className="md:col-span-2 p-4 bg-sage-50 text-sage-800 rounded-lg text-sm font-bold text-center">
              문의가 성공적으로 전송되었습니다. 확인 후 연락드리겠습니다.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-bold text-center">
              문의 전송에 실패했습니다. 다시 시도해주세요.
            </div>
          )}
          <button type="submit" disabled={isSubmitting} className="md:col-span-2 py-4 bg-sage-800 text-white font-bold rounded-lg hover:bg-sage-900 transition-colors disabled:opacity-50">
            {isSubmitting ? '전송 중...' : '문의 보내기'}
          </button>
        </form>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import { SectionTitle } from '../components/Common';
import { Phone, Mail, MapPin, Clock, MessageSquare, Printer } from 'lucide-react';

export const Contact = () => {
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

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-24">
      <section>
        <SectionTitle title="연락처" subtitle="방문 상담은 사전에 예약 부탁드립니다." />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Map Placeholder */}
            <div className="aspect-square md:aspect-video bg-sage-200 rounded-2xl md:rounded-3xl overflow-hidden relative">
              <img 
                src="https://picsum.photos/seed/map/1200/800" 
                alt="Map" 
                className="w-full h-full object-cover opacity-50 grayscale"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 p-4 md:p-8 flex flex-col gap-3 md:gap-4 justify-center items-center z-10">
                <a 
                  href={`https://map.naver.com/p/search/${encodeURIComponent('경기도 평택시 관동길 91-99')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 backdrop-blur-sm px-4 py-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg border border-white/50 w-[85%] md:w-full md:max-w-md text-center hover:bg-white transition-colors cursor-pointer block relative z-20"
                >
                  <h4 className="font-bold text-base md:text-lg text-sage-900 mb-1 md:mb-2 flex items-center justify-center gap-1 md:gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-sage-500" /> 에바스
                  </h4>
                  <p className="text-xs md:text-base text-sage-600 whitespace-nowrap">경기도 평택시 관동길 91-99</p>
                </a>
                <a 
                  href={`https://map.naver.com/p/search/${encodeURIComponent('경기도 평택시 관광특구로36')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 backdrop-blur-sm px-4 py-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg border border-white/50 w-[85%] md:w-full md:max-w-md text-center hover:bg-white transition-colors cursor-pointer block relative z-20"
                >
                  <h4 className="font-bold text-base md:text-lg text-sage-900 mb-1 md:mb-2 flex items-center justify-center gap-1 md:gap-2">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-sage-500" /> 디자인센터
                  </h4>
                  <p className="text-xs md:text-base text-sage-600 whitespace-nowrap">경기도 평택시 관광특구로36</p>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-2xl border border-sage-100 flex items-start gap-4">
                <div className="p-3 bg-sage-50 rounded-xl text-sage-800"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] text-sage-400 uppercase font-bold tracking-wider mb-1">Phone</p>
                  <p className="font-bold">010-6634-8119</p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-sage-100 flex items-start gap-4">
                <div className="p-3 bg-sage-50 rounded-xl text-sage-800"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] text-sage-400 uppercase font-bold tracking-wider mb-1">Email</p>
                  <p className="font-bold">kimto99zz@gmail.com</p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-sage-100 flex items-start gap-4">
                <div className="p-3 bg-sage-50 rounded-xl text-sage-800"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] text-sage-400 uppercase font-bold tracking-wider mb-1">전화번호</p>
                  <p className="font-bold">031-664-4666</p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-sage-100 flex items-start gap-4">
                <div className="p-3 bg-sage-50 rounded-xl text-sage-800"><Printer size={20} /></div>
                <div>
                  <p className="text-[10px] text-sage-400 uppercase font-bold tracking-wider mb-1">Fax</p>
                  <p className="font-bold">050-4040-8119</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-sage-800 rounded-3xl text-white">
              <h4 className="text-xl font-bold mb-6">간편 문의</h4>
              <form action="https://formspree.io/f/mpqjnkjy" method="POST" onSubmit={handleFormSubmit} className="space-y-4">
                <input type="text" name="name" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:bg-white/20" placeholder="성함" />
                <input type="tel" name="phone" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:bg-white/20" placeholder="연락처" />
                <textarea name="message" required className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:bg-white/20 h-32" placeholder="문의내용"></textarea>
                {submitStatus === 'success' && (
                  <div className="p-3 bg-sage-50/20 text-white rounded-lg text-sm font-bold text-center border border-white/30">
                    문의가 성공적으로 전송되었습니다.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-500/20 text-white rounded-lg text-sm font-bold text-center border border-red-500/30">
                    문의 전송에 실패했습니다. 다시 시도해주세요.
                  </div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-white text-sage-800 font-bold rounded-lg hover:bg-sage-100 transition-colors disabled:opacity-50">
                  {isSubmitting ? '전송 중...' : '문의 보내기'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { SectionTitle } from '../components/Common';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export const Process = () => {
  const steps = [
    {
      step: 'Step 1',
      title: '상담 및 현장 진단',
      items: ['요구사항 상담', '현장 실측', '현장 상태 및 설비 확인']
    },
    {
      step: 'Step 2',
      title: '맞춤 설계 및 제안',
      items: ['평면 검토 및 레이아웃 확정', '자재 제안 및 디자인 방향 설정', '3D 시뮬레이션 (필요 시)']
    },
    {
      step: 'Step 3',
      title: '계약',
      items: ['확정 견적서 산출', '공사 일정 협의', '계약 범위 및 특약 사항 정리']
    },
    {
      step: 'Step 4',
      title: '시공 및 감리',
      items: ['공정별 전문 인력 투입', '현장 소장 상주 관리', '실시간 공정 보고']
    },
    {
      step: 'Step 5',
      title: '검수 및 인수인계',
      items: ['최종 마감 점검', '사용 및 관리 방법 안내', '사후관리 보증서 발급']
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-24">
      <section>
        <SectionTitle title="업무 프로세스" subtitle="투명하고 체계적인 과정을 통해 신뢰할 수 있는 결과를 만듭니다." />
        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col md:flex-row gap-6 md:gap-12 p-8 bg-white rounded-2xl border border-sage-100 relative overflow-hidden"
            >
              <div className="md:w-48 shrink-0">
                <span className="text-sage-300 font-black text-4xl block mb-2">{s.step}</span>
                <h4 className="text-xl font-bold text-sage-900">{s.title}</h4>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {s.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sage-600 text-sm">
                    <CheckCircle2 size={16} className="text-sage-400" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-3xl border border-sage-100">
          <h4 className="text-xl font-bold mb-6">공사 기간 가이드</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-sage-50">
              <span className="text-sage-600">주거 (전체 리모델링)</span>
              <span className="font-bold">4 ~ 6주</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-sage-50">
              <span className="text-sage-600">주거 (부분 리모델링)</span>
              <span className="font-bold">1 ~ 3주</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-sage-50">
              <span className="text-sage-600">상업/사무 공간</span>
              <span className="font-bold">2 ~ 4주</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-sage-400 leading-relaxed">
            * 현장 면적 및 공사 범위에 따라 변동될 수 있습니다.
          </p>
        </div>

        <div className="bg-sage-800 p-10 rounded-3xl text-white">
          <h4 className="text-xl font-bold mb-6">고객 준비사항</h4>
          <ul className="space-y-4 text-sm text-white/80">
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-[10px]">1</span>
              <span>아파트의 경우 관리사무소 공사 신고 및 입주민 동의서 (대행 가능)</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-[10px]">2</span>
              <span>공사 전 버릴 가구 및 가전 정리</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-[10px]">3</span>
              <span>희망하는 스타일의 레퍼런스 이미지 준비</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 text-[10px]">4</span>
              <span>확정된 예산 범위 공유</span>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import { SectionTitle } from '../components/Common';
import { motion } from 'motion/react';

export const About = () => {
  const principles = [
    { title: '사용성 (Usability)', desc: '보여지는 화려함보다 실제 거주자가 생활하며 느끼는 편리함을 우선합니다.' },
    { title: '유지관리 (Maintenance)', desc: '내구성이 검증된 자재와 시공법을 선택하여 시간이 지나도 변함없는 공간을 지향합니다.' },
    { title: '예산 및 공정 (Budget & Schedule)', desc: '현실적인 예산 범위 내에서 최적의 결과를 도출하고, 약속된 공기를 엄수합니다.' },
    { title: '마감 (Finishing)', desc: '보이지 않는 곳까지 정직하게 시공하여 정교한 디테일의 차이를 만듭니다.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-24">
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12 text-center"
        >
          <h3 className="text-2xl md:text-4xl font-bold leading-tight text-sage-800 break-keep">
            공간, 저마다 가치의 답을<br className="hidden md:block" /> 제시하는 스튜디오
          </h3>
          <div className="text-[13px] md:text-base text-sage-600 leading-relaxed space-y-5 md:space-y-6 max-w-3xl mx-auto break-keep px-2 md:px-0">
            <p>
              우리는 상업공간, 주거공간, 사무공간, 숙박시설 등<br className="hidden md:block" />
              다양한 유형의 공간을 설계하고 시공하는 건축 전문 회사입니다.
            </p>
            <p>
              공간의 규모나 분야보다 먼저 고려하는 것은 이 공간이 어떻게 사용되는가입니다.<br className="hidden md:block" />
              각 공간이 가진 목적과 사용자의 행동, 운영 방식까지 분석한 뒤 설계와 시공을 진행합니다.
            </p>
            <p>
              상업공간에서는 브랜드와 동선, 주거공간에서는 생활의 흐름과 유지 관리,<br className="hidden md:block" />
              사무공간에서는 업무 효율과 확장성, 숙박공간에서는 체류 경험과 반복 사용을 기준으로 접근합니다.
            </p>
            <p>
              모든 프로젝트는 동일한 스타일을 적용하기보다,<br className="hidden md:block" />
              공간의 성격에 맞는 합리적인 구조와 마감을 찾는 데 집중합니다.
            </p>
            <p>
              우리는 보여지기 위한 건축보다, 사용하면서 신뢰가 쌓이는 공간을 목표로 합니다.<br className="hidden md:block" />
              설계 단계에서부터 시공 이후의 관리까지 고려하며,<br className="hidden md:block" />
              불필요한 요소를 줄이고 필요한 기능을 명확히 드러내는 방식으로 작업합니다.
            </p>
            <p className="text-[15px] md:text-lg font-medium text-sage-900 pt-2 md:pt-4">
              공간이 완성되는 순간보다,<br className="hidden md:block" />
              시간이 지나도 불편하지 않은 공간을 만드는 것이 우리의 기준입니다.
            </p>
          </div>
        </motion.div>
      </section>

      <section>
        <SectionTitle title="작업 원칙" subtitle="우리가 타협하지 않는 네 가지 기준입니다." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {principles.map((p, i) => (
            <div key={i} className="p-6 md:p-8 bg-white rounded-2xl border border-sage-100">
              <h4 className="text-base md:text-lg font-bold mb-4 text-sage-900 flex items-start md:items-center gap-2">
                <span className="w-1.5 h-6 bg-sage-200 rounded-full flex-shrink-0 mt-0.5 md:mt-0" />
                <span className="break-keep">{p.title}</span>
              </h4>
              <p className="text-sm text-sage-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sage-100 p-6 md:p-12 rounded-3xl">
        <h4 className="text-xl font-bold mb-8">서비스 범위</h4>
        <div className="flex flex-wrap justify-center gap-2 md:gap-4">
          {['주거공간', '상업공간', '숙박업소', '사무공간', '가구'].map((item) => (
            <div key={item} className="w-[31%] md:w-auto md:flex-1 bg-white p-3 md:p-6 rounded-xl text-center font-medium shadow-sm text-xs md:text-base break-keep">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-12 border-t border-sage-200">
          <h4 className="text-xl font-bold mb-4">사후관리 및 AS</h4>
          <p className="text-sage-600 text-sm leading-relaxed">
            시공 완료 후 1년간 무상 AS를 보장하며, 정기적인 해피콜을 통해 공간 사용의 불편함을 체크합니다. 
            보증 기간 이후에도 유상 유지보수 서비스를 통해 지속적인 관리를 도와드립니다.
          </p>
        </div>
      </section>
    </div>
  );
};

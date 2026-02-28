import { Project, FAQ } from '../types';

export const PROJECTS: Project[] = [
  {
    id: "project-residential-01",
    title: "30평대 아파트 인테리어 디자인 레퍼런스",
    category: "주거",
    subCategory: "아파트",
    area: "34평",
    location: "레퍼런스 디자인",
    duration: "4주",
    scope: "전체 리모델링",
    keywords: ["미니멀", "우드톤", "화이트", "친환경"],
    thumbnail: "https://i.postimg.cc/rsPpR5Lj/1.png",
    heroImage: "https://i.postimg.cc/rsPpR5Lj/1.png",
    spaces: [
      {
        name: "거실",
        images: [
          "https://i.postimg.cc/ydf120x5/2.png",
          "https://i.postimg.cc/9MxmsyzH/3.png",
          "https://i.postimg.cc/xCsfBLqQ/4.png",
          "https://i.postimg.cc/zfGX7dXj/7.png",
          "https://i.postimg.cc/s2gDmnDq/8.png"
        ],
        description: "거실은 가족이 함께하는 공간으로, 따뜻한 우드톤과 화이트 컬러를 매치하여 편안한 분위기를 연출했습니다."
      },
      {
        name: "주방",
        images: [
          "https://i.postimg.cc/pdLXC0X0/9.png",
          "https://i.postimg.cc/j5Gxst64/10.png"
        ],
        description: "주방은 효율적인 동선과 수납 공간을 확보하는 데 중점을 두었습니다."
      },
      {
        name: "복도",
        images: [
          "https://i.postimg.cc/63DW9tLW/11.png",
          "https://i.postimg.cc/zvKJv60r/12.png"
        ],
        description: "복도는 간접 조명을 활용하여 갤러리 같은 분위기를 자아냅니다."
      },
      {
        name: "침실",
        images: [
          "https://i.postimg.cc/rpf2pMTg/13.png",
          "https://i.postimg.cc/g0zPdrCq/14.png"
        ],
        description: "침실은 휴식을 위한 공간으로, 차분한 컬러와 조명을 사용하여 아늑함을 더했습니다."
      }
    ],
    details: [
      "input_file_3.png",
      "input_file_4.png",
      "input_file_5.png"
    ],
    comparisons: [
      {
        title: "거실 주야간 분위기 비교",
        day: "https://i.postimg.cc/rsPpR5Lj/1.png",
        night: "https://i.postimg.cc/0Qtkh7jB/1-1.png"
      }
    ],
    description: "공간마다 저마다의 가치를 담아낸 30평대 아파트 인테리어 프로젝트입니다. 미니멀한 감성과 따뜻한 우드톤을 조화롭게 배치하여 시간이 지나도 변함없는 편안함을 제공합니다."
  }
];

export const FAQS: FAQ[] = [
  {
    question: "상담 및 실측은 어떻게 진행되나요?",
    answer: "전화나 홈페이지를 통해 문의를 주시면 1차 유선 상담 후 현장을 방문하여 실측 및 상태 점검을 진행합니다. 이 과정에서 고객님의 요구사항을 상세히 파악합니다."
  },
  {
    question: "견적은 어떤 기준으로 산정되나요?",
    answer: "공사 범위, 선택 자재의 등급, 현장 상태(철거 필요성 등), 공사 기간 등을 종합적으로 고려하여 산정됩니다. 투명한 상세 견적서를 제공해 드립니다."
  },
  {
    question: "공사 기간은 어느 정도 소요되나요?",
    answer: "주거 공간의 경우 전체 리모델링 기준 보통 3~5주 정도 소요되며, 상업 공간은 규모에 따라 2~4주 정도 소요됩니다. 현장 상황에 따라 변동될 수 있습니다."
  },
  {
    question: "거주 중 공사가 가능한가요?",
    answer: "부분 공사(욕실, 주방 등)는 가능하나, 전체 리모델링의 경우 소음, 먼지, 공정 효율을 위해 가급적 비거주 상태에서 진행하는 것을 권장합니다."
  },
  {
    question: "맞춤가구만 별도로 의뢰할 수 있나요?",
    answer: "네, 가능합니다. 공간의 크기와 용도에 최적화된 맞춤 가구 설계 및 제작 서비스를 별도로 운영하고 있습니다."
  },
  {
    question: "자재 변경은 언제까지 가능한가요?",
    answer: "해당 공정 시작 1~2주 전까지는 변경이 가능하나, 이미 발주된 자재의 경우 취소 수수료가 발생할 수 있으므로 가급적 설계 단계에서 확정하시는 것이 좋습니다."
  },
  {
    question: "공사 중 추가 비용은 언제 발생하나요?",
    answer: "현장 철거 후 발견되는 구조적 결함이나 고객님의 추가 요청 사항이 있을 경우에만 발생하며, 사전에 충분한 협의와 승인 절차를 거칩니다."
  },
  {
    question: "AS 기간과 범위는 어떻게 되나요?",
    answer: "기본적으로 시공 완료 후 1년간 무상 AS를 보장하며, 구조적 결함 등 중대 사안에 대해서는 관련 법규에 따른 보증 기간을 준수합니다."
  },
  {
    question: "상업공간/숙박공간도 진행 가능한가요?",
    answer: "네, 저희는 주거 공간뿐만 아니라 카페, 식당, 오피스, 스테이(숙박) 등 다양한 상업 및 특수 공간 인테리어 경험을 보유하고 있습니다."
  },
  {
    question: "지방 지역도 시공 가능한가요?",
    answer: "수도권(서울, 경기, 인천)을 중심으로 활동하고 있으나, 프로젝트의 규모와 성격에 따라 지방 시공도 가능하오니 별도 문의 부탁드립니다."
  }
];

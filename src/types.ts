export interface Project {
  id: string;
  title: string;
  category: '주거' | '상업' | '사무' | '숙박' | '가구';
  subCategory: string;
  area: string;
  location: string;
  duration: string;
  scope: string;
  keywords: string[];
  thumbnail: string;
  heroImage: string;
  spaces: {
    name: string;
    images: string[];
    description?: string;
  }[];
  details: string[];
  comparisons?: {
    title: string;
    day: string;
    night: string;
  }[];
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface QAPost {
  id: number;
  title: string;
  author: string;
  date: string;
  status: '답변완료' | '검토중';
  isPrivate: boolean;
  content?: string;
  password?: string;
  reply?: string;
  replies?: {
    id: string;
    author: 'admin' | 'user';
    content: string;
    date: string;
  }[];
}

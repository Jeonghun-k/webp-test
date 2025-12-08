import { Goal, Skill, Trip, Certification, Project } from './types';

export const TRIPS: Trip[] = [];

export const SKILLS: Skill[] = [
  { name: 'HTML5+CSS3+JAVASCRIPT', level: 70, category: 'Tech' },
  { name: 'JAVA', level: 70, category: 'Tech' },
  { name: 'Python', level: 50, category: 'Tech' },
  { name: '어셈블리어', level: 50, category: 'Tech' },
  { name: 'Photo/Video Editing', level: 40, category: 'Creative' },
  { name: '프랑스어', level: 45, category: 'Language' },
];

export const GOALS: Goal[] = [
  {
    id: 'g1',
    title: '유니콘 기업',
    description: '향후 5년 내 유니콘 기업에 취직해보기.',
    timeframe: '2030',
    icon: 'rocket'
  },
  {
    id: 'g2',
    title: 'Orange회사 취직',
    description: '프랑스 통신사 중 하나인 orange 기업에 취직하기.',
    timeframe: '2030',
    icon: 'heart'
  },
  {
    id: 'g3',
    title: '디지털 노마드',
    description: '향후 15년 내 3개국에서 원격으로 일하면서 살아보기.',
    timeframe: '2040',
    icon: 'compass'
  },
  {
    id: 'g4',
    title: '세계일주',
    description: '디지털 노마드가 어느정도 자리 잡은 후 나라를 옮겨 다니면서 많은 경험들을 하고 다니고 그걸 기록하기.',
    timeframe: '2040',
    icon: 'mountain'
  }
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'c5',
    title: 'ADsP (데이터분석 준전문가)',
    issuer: '한국데이터산업진흥원',
    date: '2025.09',
    description: '데이터 분석 기획 및 분석 실무'
  },
  {
    id: 'c6',
    title: 'DELF A2',
    issuer: 'France Education International',
    date: '2025.05',
    description: '프랑스어 공인 인증 자격증'
  },
  {
    id: 'c4',
    title: '정보처리기능사',
    issuer: '한국산업인력공단',
    date: '2023.09',
    description: '컴퓨터 시스템 운용 및 프로그래밍 기초'
  },
  {
    id: 'c3',
    title: '비서 1급',
    issuer: '대한상공회의소',
    date: '2022.05',
    description: '전문 비서 실무 및 경영 관리'
  },
  {
    id: 'c2',
    title: '컴퓨터활용능력 2급',
    issuer: '대한상공회의소',
    date: '2022.05',
    description: '스프레드시트 일반 및 실무 활용'
  },
  {
    id: 'c1',
    title: 'ITQ OA Master',
    issuer: '한국생산성본부',
    date: '2022.04',
    description: '정보기술자격 OA 마스터 (A등급 3과목)'
  }
].sort((a, b) => b.date.localeCompare(a.date));

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'GameHub',
    description: '다양한 게임사들의 게임들을 한눈에 확인 할 수 있는 웹사이트.',
    techStack: ['HTML5', 'CSS3', 'JAVASCRIPT', 'VIBE CODING'],
    link: 'https://jeonghun-k.github.io/webprogramming/GameHub/'
  },
  {
    id: 'p2',
    title: 'Fêter',
    description: '전국의 축제 api를 가져와서 지역별로 나눠 확인 할 수 있고 공휴일에 어떤 축제를 하는지 확인 하는 웹페이지.',
    techStack: ['JAVASCRIPT', 'HTML5', 'CSS3', 'API', 'VIBE CODING', 'Readdy.ai'],
    link: 'https://readdy.link/preview/a8f69ef0-c19a-4f81-9913-f5d2d5fcda22/4170240'
  },
  {
    id: 'p3',
    title: 'Olymfit Guide',
    description: '올림픽공원 및 체육센터 강좌 정보를 API로 제공하며, 날씨/연령/취향 맞춤 추천과 시간대별 센터 혼잡도를 시각화하여 보여주는 서비스.',
    techStack: ['HTML5', 'CSS3', 'JAVASCRIPT', 'API', 'QR코드', '반응형 웹', '공모전'],
    link: 'https://jeonghun-k.github.io/webprogramming/olymfit%20guide/'
  },
  {
    id: 'p4',
    title: 'Study Spot Finder',
    description: '위치 검색 및 현재 위치 기반으로 주변 독서실, 도서관 정보를 찾아주며, Focus Timer 기능으로 학습 시간을 기록할 수 있는 웹 서비스.',
    techStack: ['HTML5', 'CSS3', 'JAVASCRIPT', 'VIBE CODING', 'API', 'QR코드', '반응형 웹', 'PWA', 'Figma'],
    link: 'https://jeonghun-k.github.io/webprogramming/1126/'
  }
];
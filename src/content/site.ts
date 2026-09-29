import type { RichText } from './types.ts';

export const SITE_URL = 'https://jinxuyeon.github.io';

export const profile = {
  name: '진수연',
  role: '프론트엔드 개발자',
  roleLine: '프론트엔드 개발자 · React · TypeScript · Next.js',
  email: 'ssyeo_n@naver.com',
  github: 'https://github.com/jinxuyeon',
  githubLabel: 'github.com/jinxuyeon',
  repo: 'https://github.com/jinxuyeon/jinxuyeon.github.io',
  /** 메타 설명과 OG 설명(원문 그대로) */
  description: '프론트엔드 개발자 진수연. 프로젝트 4개의 프론트엔드를 전담하며 쌓은 케이스 스터디 포트폴리오.',
  ogDescription: '프로젝트 4개의 프론트엔드를 전담하며 쌓은 케이스 스터디 포트폴리오.',
} as const;

/**
 * 원문 소개 문단(lead)은 세 문장이다.
 * 첫 문장은 히어로에, 나머지 두 문장은 소개 섹션에 둔다.
 * 히어로의 큰 헤드라인은 둘째 문장을 줄인 것이다.
 */
export const lead = {
  first: '자산운용사 개발팀에서 **프로젝트 4개의 프론트엔드를 전담**해 왔습니다.',
  rest: [
    '백엔드 1명과 2인 팀이라 화면을 그리는 일뿐 아니라 API 계약을 맞추고 회귀를 막고 사람이 실제로 쓸 수 있게 만드는 일까지 제 몫입니다.',
    '구현은 Claude Code로 속도를 내고 **설계 판단과 검증은 직접** 합니다.',
  ],
  /** 두 줄, 줄마다 두 구절. 좁은 화면에서는 구절마다 줄이 바뀌고 줄 마스크도 구절 단위로 걸린다. */
  headline: [
    ['화면을 그리는', '일부터'],
    ['API 계약과', '회귀 방지까지'],
  ] as const,
};

export const career = [
  {
    when: '2026.06 ~',
    whenNote: '재직 중',
    title: '자산운용사 개발팀',
    body: '프로젝트 4개의 프론트엔드 전담',
    note: '입사 이틀 만에 개발팀으로 전환',
  },
  {
    when: '2025.02',
    whenNote: '졸업',
    title: '국립한국해양대학교',
    body: '인공지능공학부 컴퓨터공학전공',
  },
] as const;

export interface Habit {
  no: string;
  label: string;
  title: string;
  body: RichText;
  proof: { slug: string; anchor: string; title: string };
}

export const habits: Habit[] = [
  {
    no: '01',
    label: '안전망',
    title: '회귀 방지 장치를 스스로 깝니다',
    body: '테스트가 없고 CI가 프론트를 검사하지 않던 저장소에 Vitest와 검사 워크플로를 직접 넣었습니다. 커밋 메시지에는 “테스트를 아무도 강제하지 않던 것”이라고 적었습니다.',
    proof: { slug: 'nutti', anchor: 'decision', title: '누띠 사진 놀이터' },
  },
  {
    no: '02',
    label: '접근성',
    title: '요구받기 전에 잡습니다',
    body: '포커스 트랩, 키보드 내비게이션, `prefers-reduced-motion`, 레이아웃 시프트. 키보드, 스크린리더, 모션에 민감한 사용자, 터치 기기를 기준으로 한 번씩 훑습니다.',
    proof: { slug: 'nutti', anchor: 'a11y', title: '누띠 사진 놀이터' },
  },
  {
    no: '03',
    label: '계약',
    title: '계약이 바뀌면 타입\u00a0검사가 먼저 깨지게 합니다',
    body: 'MSW 목으로 화면을 만들고, 실서버가 붙으면 응답 타입을 백엔드 OpenAPI 명세에서 생성해 계약이 어긋난 곳을 타입 검사 단계에서 잡습니다. 사내 협업툴에서는 이렇게 게시판 API 불일치 3건이 드러났습니다.',
    proof: { slug: 'collab-tool', anchor: 'contract', title: '사내 협업툴' },
  },
  {
    no: '04',
    label: '검증',
    title: '눈으로 찾은 문제는 검사로 만듭니다',
    body: 'AI로 빠르게 만들수록 확인을 사람 눈에 맡기지 않습니다. 시안과의 스타일 차이, CSP 위반, 적용되지 않는 CSS 규칙, Windows에서만 깨지는 한글 글꼴을 헤드리스 Chrome 검사로 만들어 두었습니다.',
    proof: { slug: 'proovit', anchor: 'checks', title: 'PROOVIT' },
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: '주력', items: ['React 19', 'TypeScript', 'Next.js 16 (App Router)', 'Vite'] },
  { group: '데이터·상태', items: ['TanStack Query', 'Zustand', 'Zod', 'MSW', 'openapi-typescript'] },
  { group: '실시간·편집기', items: ['WebSocket', 'SSE', 'Yjs', 'TipTap'] },
  { group: '스타일', items: ['Tailwind CSS v4', 'CSS Modules', '디자인 토큰'] },
  { group: '테스트·품질', items: ['Vitest', 'GitHub Actions', '헤드리스 Chrome 검사 (CDP)'] },
  {
    group: '서버·배포',
    items: ['Prisma', 'PostgreSQL', 'Auth.js', 'Upstash Redis', 'Vercel', 'Cloudflare (Workers · R2)', 'Tauri 2'],
  },
  { group: 'AI·협업', items: ['Claude Code', 'GitHub 이슈/PR 단위 작업', 'Figma 시안 협업'] },
];

export const awards: { when?: string; kind: string; body: string; strong?: boolean }[] = [
  {
    when: '2024.11',
    kind: '우수논문상',
    strong: true,
    body: '한국지능시스템학회 추계학술대회, 「메타버스 기반 대학 캠퍼스 체험 게임 프레임워크 개발」(공저)',
  },
  { when: '2024.01', kind: '특허 출원', body: '인공지능 사고감지 시스템' },
  { when: '2023.02', kind: '특허 출원', body: '자동 제동 및 동력 보조 수단을 구비한 스마트 유모차' },
  { kind: '우수상', body: '해양특성화 ICC대학 연합경진대회 (인천대학교 LINC\u00a03.0 사업단)' },
  { kind: '장려상', body: '캡스톤디자인 경진대회 (한국해양대학교 LINC\u00a03.0 사업단)' },
  { kind: '입상', body: '부산디지털혁신아카데미 잡페어 (부산정보산업진흥원)' },
];

export const language = { label: '어학', body: '토익스피킹 IH (2024.07)' };

/**
 * 홈 섹션(페이지 순서대로). 내비·모바일 메뉴·커맨드 팔레트가 같은 목록을 쓴다. en은 팔레트 검색어로만 쓴다.
 * 팔레트에는 item을 보이고(옆의 분류 표시 「이동」이 동사를 맡는다), 보조기기에는 jump로 읽힌다.
 */
export const sections = [
  { id: 'work', label: '프로젝트', en: 'Selected work', item: '프로젝트 목록', jump: '프로젝트 목록으로 이동' },
  { id: 'about', label: '소개', en: 'About', item: '소개', jump: '소개로 이동' },
  { id: 'stack', label: '기술', en: 'Stack', item: '기술', jump: '기술로 이동' },
  { id: 'contact', label: '연락', en: 'Contact', item: '연락처', jump: '연락처로 이동' },
] as const;

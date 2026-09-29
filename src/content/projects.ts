import type { MinorProject, Project } from './types.ts';

/*
 * 공개 저장소의 데이터 파일이다. README의 「이 파일은 공개용이다」 규칙을 따른다.
 * 재직 회사의 내부 지표·원가·데이터 규모는 여기에 적지 않는다.
 */

const EMPLOYED_TEAM = '2인(백엔드 1명과 함께)';

export const projects: Project[] = [
  {
    slug: 'collab-tool',
    title: '사내 협업툴',
    kind: '재직 · 프론트엔드',
    featured: true,
    summary: '문서, 채팅, 게시판, AI를 한 앱으로 묶어 회사 서버 안에서만 돌게 만든 협업툴',
    intro:
      '문서, 채팅, 게시판, AI를 한 앱으로 묶어 회사 서버 안에서만 돌게 만든 협업툴입니다. 실시간 공동 편집 문서, 채널·DM 채팅, 등급별 게시판, 전자결재·근태, ⌘K 통합 검색, CRM, 관리자 콘솔의 **프론트엔드 전체**를 맡았습니다. 사내 파일럿 준비 중입니다.',
    role: '프론트엔드 전체',
    team: EMPLOYED_TEAM,
    stack: ['React 19', 'Vite', 'TanStack Query', 'TipTap', 'Yjs', 'Tailwind CSS v4', 'Tauri 2'],
    facts: [
      { value: 3, unit: '건', label: '타입 생성으로 드러난 실서버 불일치', hi: true, onCard: false },
      { value: 252, label: '프론트엔드 테스트', onCard: false },
      { value: 2, label: '웹 + Windows 데스크톱', onCard: false },
    ],
    card: {
      did: '실시간 공동 편집 문서, 채널·DM 채팅, 등급별 게시판, 전자결재·근태, ⌘K 통합 검색, CRM, 관리자 콘솔의 프론트엔드 전체',
      hard: '채팅 소켓이 채팅 화면 안에서만 연결돼 있어 홈·문서·게시판에서는 메시지가 와도 안 읽음 배지가 움직이지 않았습니다.',
      result: '소켓을 로그인 구역 최상단에서 하나만 연결해, 어느 화면에서든 배지와 연결 끊김 배너가 동작합니다.',
    },
    sections: [
      {
        kind: 'beat',
        id: 'problem',
        label: '문제',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '채팅 소켓이 채팅 화면 안에서만 연결돼 있었습니다. 홈·문서·게시판에 있으면 메시지가 와도 안 읽음 배지가 움직이지 않았습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'decision',
        label: '판단',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '소켓을 로그인 구역 최상단으로 올려 하나만 연결했습니다. 보낸 메시지도 화면에 먼저 꽂지 않고 ==서버를 거쳐 같은 소켓으로 돌아오게== 했습니다. 순서는 서버 하나가 정하고 중복은 메시지 id로 거릅니다. 받은 이벤트는 TanStack Query 캐시에 바로 반영합니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'result',
        label: '결과',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '다른 탭·다른 사람과 메시지 순서가 어긋나지 않습니다. **어느 화면에서든 배지와 연결 끊김 배너**(5초 이상 끊겼을 때)가 동작합니다.',
          },
        ],
      },
      {
        kind: 'pull',
        text: '놓칠 뻔한 게 하나 있었습니다. 재연결 때 끊긴 동안의 메시지를 다시 받지 않으면 채팅 화면이 연결 직후 읽음을 보내 서버의 안 읽음이 0이 됩니다. **그 메시지는 화면에도 배지에도 없이 사라집니다.** 그래서 재연결마다 먼저 다시 받게 했습니다.',
      },
      {
        kind: 'beat',
        id: 'contract',
        label: '계약',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: '목(MSW)이 응답을 camelCase로 흉내 내면서 실서버의 snake_case와 어긋난 곳을 가리고 있었습니다. 응답 타입을 백엔드 OpenAPI 명세에서 생성하도록 바꾸자 **게시판 API 불일치 3건**이 드러났습니다. 이제 계약이 바뀌면 타입 검사가 먼저 깨집니다. 생성 파일이 명세와 어긋나면 테스트가 잡습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'editor',
        label: '편집기와 AI 답변',
        group: 'more',
        blocks: [
          {
            type: 'list',
            items: [
              '편집기에 올린 사진은 Y.Doc에 넣지 않고 URL만 둡니다. 넣으면 문서가 사진 크기만큼 불고 버전 스냅샷마다 복사됩니다.',
              'AI 답변의 SSE 스트림을 직접 파싱해(청크 경계, CRLF, 마지막 프레임) 받는 대로 그립니다. 중간에 끊기면 받은 데까지 남긴 채 사유를 보여 줍니다.',
              '아이폰에서만 문서 편집이 안 되던 것을 원인별로 고쳤습니다. 16px 미만 입력칸의 자동 확대, 키보드 뒤로 숨는 서식 팝오버, 첫 탭을 가로채는 드래그 손잡이가 원인이었습니다.',
            ],
          },
        ],
      },
      {
        kind: 'beat',
        id: 'desktop',
        label: '공용 PC와 Windows 앱',
        group: 'more',
        blocks: [
          {
            type: 'list',
            items: [
              '같은 브라우저에서 사용자가 바뀌면 앞사람의 AI 대화와 캐시, 오프라인 편집용 문서 사본(IndexedDB)을 지웁니다. 지우지 못하면 그 세션은 사본 없이 열어 공용 PC에서 앞사람 문서가 새지 않게 했습니다.',
              'Tauri 2로 Windows 앱을 만들고 서명을 검증하는 자동 업데이트를 붙였습니다. 설치 전에는 먼저 묻습니다. 묻지 않고 설치하면 관리자 권한이 없는 PC에서 앱이 켤 때마다 꺼집니다.',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'proovit',
    title: 'PROOVIT',
    kind: '사이드 프로젝트',
    featured: true,
    summary: 'AI로 만든 서비스를 실제 지표로 겨루는 시즌제 리그 플랫폼',
    intro:
      'AI로 만든 서비스를 실제 지표로 겨루는 시즌제 리그 플랫폼. 3인 팀의 **유일한 개발자**로 기획자의 ERD를 받아 화면부터 DB·배포까지 맡았습니다. [proovit.kr](https://proovit.kr)에서 사전 신청을 받고 있습니다.',
    role: '유일한 개발자 · 화면부터 DB·배포까지',
    team: '3인 팀',
    stack: [
      'Next.js 16 (App Router)',
      'TypeScript',
      'Prisma',
      'PostgreSQL(Neon)',
      'Auth.js',
      'Zod',
      'Upstash Redis',
      'Vercel',
      'Cloudflare Workers',
      'CSS Modules',
    ],
    facts: [],
    scale: [
      { label: '화면', value: 36 },
      { label: 'API 라우트', value: 12 },
      { label: 'DB 모델', value: 45 },
      { label: '테스트', value: 499 },
    ],
    card: {
      did: '3인 팀의 유일한 개발자로, 기획자의 ERD를 받아 화면부터 DB·배포까지',
      hard: '루트 레이아웃의 약관 동의 게이트가 세션 쿠키를 읽고 있어 랜딩·규칙·약관·처리방침이 전부 동적 렌더링이었습니다.',
      result: '약관 동의 판정 값을 `/api/v1/me` 응답에 실어 클라이언트에서 읽게 하자, 동적 렌더링되던 랜딩의 ISR과 규칙·약관·처리방침의 정적 생성이 돌아왔습니다.',
    },
    sections: [
      {
        kind: 'beat',
        id: 'problem',
        label: '문제',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '랜딩에 `revalidate = 60`을 걸어 뒀는데 비로그인 방문마다 DB를 조회하고 있었습니다. `next build`의 ○/ƒ 표를 보니 랜딩·규칙·약관·처리방침이 전부 ƒ(동적)였습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'cause',
        label: '원인',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '루트 레이아웃의 약관 동의 게이트가 세션 쿠키를 읽고 있었습니다. ==레이아웃이 쿠키를 읽는 순간 그 아래 화면이 전부 동적 렌더링==됩니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'decision',
        label: '판단',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '판정 값을 헤더가 이미 부르는 `/api/v1/me` 응답에 실어 클라이언트에서 읽게 했습니다. 요청은 늘지 않습니다. 접근을 실제로 막는 건 서버의 권한 판정이라 방벽도 그대로입니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'result',
        label: '결과',
        group: 'story',
        blocks: [{ type: 'p', text: '랜딩의 **ISR과 규칙·약관·처리방침·404의 정적 생성이 돌아왔습니다.**' }],
      },
      {
        kind: 'pull',
        text: '같은 이유로 CSP에 nonce를 쓰지 않았습니다. nonce는 요청마다 달라 랜딩을 동적 렌더링으로 바꾸고 **CDN 캐시를 잃게 합니다.** 대신 허용 도메인을 좁히고 모든 화면을 헤드리스 Chrome으로 열어 위반 0건을 확인하는 검사를 붙였습니다.',
      },
      {
        kind: 'beat',
        id: 'access',
        label: '권한',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: '시즌 단계와 팀의 스테이지에 따라 화면마다 접근이 갈립니다. 판정을 `canAccess()` 한 곳에 모으고 ==phase 값을 직접 비교하지 않도록== 술어 한 겹을 끼웠습니다. 이후 시즌 단계가 10개에서 6개로 합쳐졌을 때 판정표와 라우트 34개는 한 줄도 건드리지 않았습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'migration',
        label: '마이그레이션',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: 'Prisma가 만든 마이그레이션이 컬럼을 `DROP + ADD`로 처리해서 그대로 돌리면 시즌 이름이 사라지고 기존 구글 계정 연결이 끊길 상황이었습니다. `RENAME COLUMN`, `USING` 캐스트, 옛 값을 새 값으로 접는 `CASE` 매핑으로 직접 다시 썼습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'checks',
        label: '검사로 만든 것',
        group: 'more',
        blocks: [
          {
            type: 'list',
            items: [
              '시안과 구현의 계산된 스타일을 요소별로 비교합니다. Chrome DevTools Protocol을 직접 구동합니다.',
              'CSS Modules 해시 클래스 때문에 하위 선택자가 적용되지 않던 곳을 손으로 다섯 번 찾았습니다. 컴파일된 CSS를 훑는 검사를 만들어 붙이자 남은 세 곳이 바로 드러났습니다.',
              '고정폭 글꼴 스택에 한글 글꼴이 없어 Windows에서만 한글이 굴림으로 떨어졌습니다. 맥에서는 눈으로도 보이지 않아서 렌더 결과 대신 글꼴 선언을 보는 검사로 만들었습니다.',
              '삼성 인터넷의 강제 다크 모드가 이미 어두운 페이지의 밝은 버튼만 뒤집고 있었습니다. `color-scheme` 선언으로 막은 뒤 강제 다크를 켠 Chrome에서 색을 재서 확인했습니다.',
            ],
          },
        ],
      },
    ],
    shots: [
      {
        file: 'proovit-dashboard.png',
        width: 1400,
        height: 1085,
        alt: 'PROOVIT 참가자 대시보드. 5단계 진행과 다음 할 일',
        title: '참가자 대시보드',
        caption:
          '권한 판정이 내준 결론을 화면이 그대로 받습니다. “서비스를 배포할 차례예요”와 아래 체크리스트는 `GET /me`가 계산한 `nextAction`·`blockedReasons`입니다.',
      },
      {
        file: 'proovit-judging.png',
        width: 1290,
        height: 1400,
        alt: 'PROOVIT 운영자 심사 콘솔. 결과와 사유 입력',
        title: '운영자 심사 콘솔',
        caption:
          '결과와 사유만 받습니다. 채점식이 확정되기 전에 배점 칸을 만들면 임의 기준의 숫자가 근거로 남기 때문에 배점은 의도적으로 빼뒀습니다.',
      },
      {
        file: 'proovit-submit-s3.png',
        width: 842,
        height: 632,
        alt: 'PROOVIT 스테이지 제출 폼의 출시 전 점검. 개인정보·AI 표시 자가점검 항목',
        title: '스테이지 제출 폼',
        caption: '출시 전 점검. 개인정보·AI 표시 자가점검 항목입니다.',
      },
      {
        file: 'proovit-leaderboard.png',
        width: 1400,
        height: 996,
        alt: 'PROOVIT 공개 리더보드. 팀별 유효 방문과 매출',
        title: '공개 리더보드',
        caption:
          '집계 전에는 순위를 지어내지 않고 상태를 그대로 씁니다. 미배포 팀은 배지로 구분되고 어뷰징·실격 처리는 집계에서 빠집니다.',
      },
    ],
    shotNote:
      '이미지를 누르면 원본 크기로 열립니다. 개발 초기(2026.08) 화면에 데모 데이터를 채웠고 지금은 디자인 시안에 맞춰 바뀌었습니다.',
    thumb: 0,
    // 로고·「서비스를 배포할 차례예요」·배포 버튼·단계 표시 1~3이 들어오는 왼쪽 위 4:3
    thumbCrop: { left: 150, top: 0, width: 667, height: 500 },
  },
  {
    slug: 'nutti',
    title: '누띠 사진 놀이터',
    kind: '재직 · 프론트엔드',
    featured: true,
    summary: '강아지 사진을 AI로 바꿔 주고 간식 계산기로 이어 주는 쇼핑몰 유입용 마케팅 도구',
    intro:
      '강아지 사진을 AI로 바꿔 주고 간식 계산기로 이어 주는 쇼핑몰 유입용 마케팅 도구([play.nutti.co.kr](https://play.nutti.co.kr)). **사용자 화면 11개**를 맡았고, 클릭 이벤트를 백엔드 지표 API와 GA4에 함께 기록해 단계별 유입을 잴 수 있게 했습니다.',
    role: '사용자 화면 11개',
    team: EMPLOYED_TEAM,
    stack: ['React', 'Vite', 'TypeScript', 'TanStack Query', 'MSW', 'Vitest'],
    facts: [
      { prefix: '0 → ', value: 533, label: '테스트', hi: true },
      { value: 11, label: '사용자 화면' },
      { value: 4, unit: '단계', label: 'CI: 린트, 타입, 테스트, 빌드' },
    ],
    card: {
      did: '사용자 화면 11개. 클릭 이벤트를 백엔드 지표 API와 GA4에 함께 기록해 단계별 유입을 잴 수 있게 했습니다.',
      hard: '프론트에 테스트가 0개였고 CI가 프론트를 검사하지 않았습니다. 기능은 계속 늘어나는데 안전망이 없었습니다.',
      result: 'Vitest 도입 → 프론트 검사 워크플로 신설 → 목 상태 격리 순으로 깔아, 지금은 테스트 533개가 PR마다 CI에서 돕니다.',
    },
    sections: [
      {
        kind: 'beat',
        id: 'problem',
        label: '문제',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '프론트에 테스트가 **0개**였고 CI가 프론트를 검사하지 않았습니다. 기능은 계속 늘어나는데 안전망이 없었습니다. 특히 위험한 건 눈으로 확인할 수 없는 경우였습니다. 보관함에서 삭제한 뒤의 상태, 뒤로 가기 경로, 서버가 거절했을 때의 문구, 잔액을 알 수 없는 상황이 그랬습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'decision',
        label: '판단',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '순서를 이렇게 잡았습니다. Vitest 도입 → 프론트 검사 워크플로 신설 → ==목 상태 격리부터==. 테스트끼리 오염되면 나머지가 전부 무의미해지기 때문에 격리가 먼저였습니다.',
          },
          {
            type: 'p',
            text: '그다음 되돌릴 수 없는 동작(삭제, 뒤로 가기, 서버 거절, 미상 잔액) → 대기·결과·계산기 → 로그인·OAuth 복귀 순으로 덮었습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'result',
        label: '결과',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '지금은 **테스트 533개가 PR마다 CI에서** 돕니다. 백엔드 계약이 바뀌어도 깨지는 지점이 CI에서 먼저 드러납니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'a11y',
        label: '접근성',
        group: 'more',
        blocks: [
          { type: 'p', text: '요구받지 않은 작업입니다. 한 번에 훑어서 정리했습니다.' },
          {
            type: 'list',
            items: [
              '모달에 포커스 트랩과 초기 포커스, 닫은 뒤 포커스 복원을 넣었습니다. 키보드 사용자가 모달 뒤로 빠져나가고 있었습니다.',
              '로그인 시트가 떠 있는데 뒤 화면이 눌리던 것을 막았습니다. 겉모습만 모달이었습니다.',
              '버튼과 탭에 키보드 포커스 링을 달았습니다. 키보드로는 지금 어디 있는지 알 수 없었습니다.',
              '배경 대비가 1.02:1이라 사실상 보이지 않던 안내 문구를 고쳤습니다.',
              '그 밖에 `prefers-reduced-motion` 대응, 로딩 스켈레톤으로 레이아웃 점프 제거, 앱바 ← 버튼의 터치 영역 확대.',
            ],
          },
        ],
      },
      {
        kind: 'beat',
        id: 'fixes',
        label: 'CDN·API 응답·인앱 브라우저 결함',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: 'CDN을 붙이는 순간 이미지 저장이 저장이 아니게 되던 것은 blob 우회로 풀었습니다. 문서에 없는 `error_code` 하나에 결과 화면이 통째로 죽던 것은 모르는 코드용 폴백으로 막았습니다. 아이폰과 카카오톡 인앱 브라우저에서만 나던 결함(입력 시 화면 확대, 공유 시 사진 누락)은 실기기로 재현해 고쳤습니다.',
          },
        ],
      },
    ],
  },
  {
    slug: 'lead-crawler',
    title: 'Lead-Crawler',
    kind: '재직 · 프론트엔드',
    featured: true,
    summary: '기업 IR 연락처를 자동 수집하고 직원은 검수만 하는 시스템',
    intro:
      '기업 IR 연락처를 자동 수집하고 **직원은 검수만** 하는 시스템. 제가 맡은 검수 웹앱이 검수 직원이 쓰는 유일한 화면입니다.',
    role: '검수 웹앱',
    team: EMPLOYED_TEAM,
    stack: ['React', 'TypeScript', 'Tailwind CSS v4'],
    facts: [],
    compare: [
      { label: '기존', text: '직원 수작업 수집, 상시 인력 투입' },
      { label: '전환 후 체제', text: '**자동 수집 + 검수 1~2인**' },
    ],
    card: {
      did: '검수 직원이 쓰는 유일한 화면인 검수 웹앱',
      hardLabel: '전제',
      hard: '이 화면의 처리 속도가 곧 필요한 인원 수입니다. 그래서 처리량을 올리는 쪽과 측정하는 쪽, 두 갈래로 작업을 나눴습니다.',
      result: '일별·직원별 확정/거부 집계와 직원별 일일 검수 처리량 조회를 붙여, 검수 1~2인 체제가 실제로 도는지 숫자로 확인하게 했습니다.',
    },
    sections: [
      {
        kind: 'beat',
        id: 'premise',
        label: '전제',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '이 화면의 처리 속도가 곧 필요한 인원 수입니다. 그래서 작업을 두 갈래로 나눴습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'throughput',
        label: '처리량을 올리는 쪽',
        group: 'story',
        blocks: [
          {
            type: 'list',
            items: [
              '검수 건을 담당자에게 고정 배정했습니다. 반납을 없애고 조회와 받기를 나눠 같은 건을 두 사람이 붙잡는 일과 받아 놓고 방치하는 일을 함께 없앴습니다.',
              '확정과 거부를 2단계로 통일해 마우스로 눌러도 확인 모달이 뜨게 했습니다. 되돌리는 비용이 큰 동작입니다.',
              '거부에 `Delete` 단축키를 달아 손이 마우스를 떠나지 않게 했습니다.',
              '확정이나 거부를 번복하려 하면 모달에서 길이 끊기던 것을 이었습니다.',
              '국가, 업종, 상장 여부, 시장, 지역 다중 필터와 컬럼 정렬을 넣고 새로고침해도 탭이 유지되게 했습니다.',
            ],
          },
        ],
      },
      {
        kind: 'beat',
        id: 'measure',
        label: '처리량을 측정하는 쪽',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '일별·직원별 확정/거부 집계와 **직원별 일일 검수 처리량 조회**를 붙였습니다. 엑셀 추출에는 확정 처리일(KST) 범위 필터를 달았습니다. 체제가 실제로 도는지 보려면 이쪽이 더 중요했습니다.',
          },
        ],
      },
      {
        kind: 'pull',
        text: '인건비 절감은 시스템 전체의 성과입니다. 다만 검수 1~2인 체제가 실제로 도는지를 **숫자로 확인하게 만든 화면**은 제가 맡았습니다.',
      },
      {
        kind: 'beat',
        id: 'method',
        label: '목 모드와 운영 콘솔',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: '`npm run dev:mock`으로 켜는 목 모드를 직접 만들었습니다. fetch를 가로채는 방식이라 백엔드 서버 없이 화면을 개발할 수 있었습니다. 목 큐 100건을 넣어 데이터가 많을 때의 레이아웃도 미리 봤습니다. 백엔드 PR이 들어오면 그 번호를 커밋에 남기며 계약을 맞췄습니다.',
          },
          {
            type: 'p',
            text: '이후 운영 콘솔로 넓혀 과거 데이터 재수집 제어, 조건별 수집 요청, 회사 DB 검색, 보유 데이터 현황 화면을 더했습니다.',
          },
        ],
      },
    ],
  },
  {
    slug: 'comment-bot',
    title: 'SNS 댓글봇',
    kind: '재직 · 프론트엔드',
    featured: true,
    summary: 'SNS에서 관련 글을 찾아 링크를 알리는 쇼핑몰 유입용 마케팅 도구',
    intro:
      'SNS에서 관련 글을 찾아 링크를 알리는 쇼핑몰 유입용 마케팅 도구입니다. **사람이 승인 버튼을 눌러야만** 답글이 나갑니다. 자동 게시 봇이 아닙니다.',
    role: '화면 전체',
    team: EMPLOYED_TEAM,
    period: '2026.07 ~ 09',
    stack: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS v4'],
    facts: [{ value: 3, unit: '주', label: '화면 전체 구축', hi: true }],
    card: {
      did: '대시보드, 매칭 상세·승인, 소스/키워드/템플릿/계정 관리, 사용자 관리, 감사 로그, Threads OAuth 연동까지 화면 전체',
      hard: '여러 건을 한 번에 승인·발송하면 N건에 같은 문구가 그대로 실려 나가는 구조였습니다. 플랫폼 입장에서는 스팸이고 계정이 정지될 수도 있습니다.',
      result: 'N건에 같은 문구가 그대로 실려 나가는 위험을 이슈로 짚었고, 백엔드가 건별 렌더 API를 내자 발송 전에 각 건의 실제 문구를 확인할 수 있게 바꿨습니다.',
    },
    sections: [
      {
        kind: 'beat',
        id: 'scope',
        label: '범위',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '대시보드(매칭 리스트, 필터, 소스 상태 배지), 매칭 상세·승인, 소스/키워드/템플릿/계정 관리, 사용자 관리, 감사 로그, Threads OAuth 연동까지 3주 안에 올렸습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'problem',
        label: '문제',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '여러 건을 한 번에 승인·발송하는 기능을 붙이는데 구조상 **N건에 같은 문구가 그대로 실려 나가게** 되어 있었습니다. 기술적으로는 정상 동작이지만 플랫폼 입장에서는 스팸이고 계정이 정지될 수도 있습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'decision',
        label: '판단',
        group: 'story',
        blocks: [
          {
            type: 'p',
            text: '이 위험을 이슈로 짚었습니다. 백엔드가 건별 렌더 API를 내자 화면을 ==건별 문구==로 바꿨습니다.',
          },
        ],
      },
      {
        kind: 'beat',
        id: 'result',
        label: '결과',
        group: 'story',
        blocks: [{ type: 'p', text: '**발송 전에 각 건의 실제 문구를 확인**할 수 있습니다.' }],
      },
      {
        kind: 'beat',
        id: 'errors',
        label: '오류 문구와 재전송 방지',
        group: 'more',
        blocks: [
          {
            type: 'p',
            text: '**실패를 사람이 읽을 수 있게 만들었습니다.** 소스 `degraded`/`down` 배지에 원인을 붙였습니다. 상태만 빨갛게 보이면 대응할 수가 없습니다. 409 차단 사유는 “중복 답글”, “계정 삭제됨” 같은 문장으로 바꿨고 RSS 원문 HTML이 그대로 노출되던 것은 평문으로 정규화했습니다.',
          },
          {
            type: 'p',
            text: '정합성 쪽으로는 CSRF가 아닌 403에도 요청을 재전송하던 것을 막고 **단일비행(single-flight) 회귀 테스트로 고정**했습니다. 그 외 앱 전체 모바일 반응형, 파비콘·로고 SVG 제작.',
          },
        ],
      },
    ],
  },
  {
    slug: 'haetopia',
    title: '해토피아',
    kind: 'Unity · 인게임 GUI',
    featured: false,
    summary: '메타버스 기반 캠퍼스 체험 2D RPG',
    intro: '해토피아는 한국해양대 캠퍼스를 재현한 2D RPG입니다. 인게임 GUI를 설계하고 구현했습니다.',
    role: '기획 · Unity\u00a0클라이언트 · 인게임 GUI',
    stack: ['Unity'],
    facts: [],
    sections: [],
    shots: [
      {
        file: 'haetopia-title.jpg',
        width: 1400,
        height: 784,
        alt: '해토피아 타이틀 화면. 로고와 로그인·회원가입 버튼',
        title: '타이틀',
        caption: '로고·버튼 계층',
      },
      {
        file: 'haetopia-hud.jpg',
        width: 1400,
        height: 787,
        alt: '해토피아 인게임 화면. 퀘스트 HUD와 채팅',
        title: '인게임 HUD',
        caption: '퀘스트·레벨·채팅',
      },
      {
        file: 'haetopia-indoor.jpg',
        width: 1400,
        height: 787,
        alt: '해토피아 건물 내부. NPC 상호작용',
        title: 'NPC 상호작용',
        caption: '서브 퀘스트 부여',
      },
    ],
  },
];

export const otherProjects: MinorProject[] = [
  {
    title: '핵플레이',
    summary: '브라우저에서 코드를 쓰고 실행하는 웹 개발 학습 플랫폼',
    detail:
      '파일 트리, 탭, Monaco 에디터, xterm.js 터미널로 이뤄진 코드 에디터 화면을 구현하고 파일 CRUD API를 연동. 인증 상태는 Zustand 스토어로 관리',
    role: '프론트엔드',
    period: '2025.08 ~ 2026.05',
    stack: ['React 19', 'TS', 'Tailwind v4', 'Zustand', 'Monaco Editor', 'xterm.js'],
  },
  {
    title: '컴히얼',
    summary: '조립 PC 추천 플랫폼',
    detail: '인증은 Context, 서버 상태는 TanStack Query로 나누고 MSW로 에러 응답을 먼저 재현해 실패 경로를 구현',
    role: '프론트엔드',
    period: '2025.02 ~ 08',
    stack: ['React', 'TanStack Query', 'Context API', 'MSW'],
  },
  {
    title: '모아이 (MoAI)',
    summary: '학과 전용 커뮤니티',
    detail: '팀 스택은 React · Spring Boot · AWS',
    role: '4인 팀 · 프론트엔드·배포',
    stack: ['React'],
  },
  {
    title: '해토피아',
    summary: '메타버스 기반 캠퍼스 체험 2D RPG',
    role: '기획 · Unity\u00a0클라이언트 · 인게임 GUI',
    stack: ['Unity'],
    slug: 'haetopia',
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/**
 * 상세 페이지 순서상 앞뒤 프로젝트. 대표 사례(featured) 안에서만 잇는다.
 * 해토피아처럼 대표가 아닌 페이지는 홈 「그 외 프로젝트」에서만 들어오므로 앞뒤가 없다.
 */
export function getSiblings(slug: string): { prev?: Project; next?: Project } {
  const i = featuredProjects.findIndex((p) => p.slug === slug);
  if (i < 0) return {};
  return { prev: featuredProjects[i - 1], next: featuredProjects[i + 1] };
}

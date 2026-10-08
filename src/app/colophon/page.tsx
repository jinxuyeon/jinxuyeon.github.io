import type { Metadata } from 'next';
import Link from 'next/link';
import { Rich } from '@/components/Rich';
import { profile } from '@/content/site';
import { tokens, type TokenName } from '@/content/tokens';
import { contrastRatio } from '@/lib/contrast';
import { pageMeta } from '@/lib/meta';
import styles from './page.module.css';

export const metadata: Metadata = pageMeta({
  path: '/colophon/',
  title: '이 사이트를 만든 방식',
  description: '이 사이트를 만든 방식: 스택, 딥링크, 모션 원칙, 접근성, 색 대비, 글꼴 라이선스.',
  og: 'colophon',
  ogAlt: '이 사이트를 만든 방식',
});

const repo = new URL(profile.repo);
const ratio = (fg: string, bg: string) => `${contrastRatio(fg, bg).toFixed(2)}:1`;

const notes: { title: string; body: string[] }[] = [
  {
    title: '스택',
    body: [
      'Next.js 16 App Router의 정적 내보내기(`output: \'export\'`) · React 19 · TypeScript(strict) · CSS\u00a0Modules와 CSS 변수 토큰 · Motion(알림\u00a0토스트\u00a0한\u00a0곳).',
      `GitHub Actions가 린트·타입 검사·빌드·빌드 결과 검사를 거쳐 GitHub Pages로 배포합니다. 소스는 [${repo.host}${repo.pathname}](${repo.href})에 있습니다.`,
    ],
  },
  {
    title: '딥링크',
    body: [
      '라우트마다 정적 HTML을 빌드 때 만듭니다(`/projects/<slug>/index.html`). 상세 주소로 바로 들어오거나 새로고침해도 그 페이지가 열리고, 없는 주소는 `404.html`이 받습니다.',
      '링크·canonical·og:url·sitemap은 모두 끝 슬래시 형태로 맞췄습니다.',
    ],
  },
  {
    title: '미리보기',
    body: [
      '페이지마다 제목·설명·OG 이미지가 HTML에 들어 있어 메신저 미리보기가 JS 없이 읽힙니다.',
      'OG 이미지는 빌드 전에 PNG로 굽습니다. 정적 내보내기에서 `opengraph-image` 규약을 쓰면 확장자 없는 파일이 생겨서 쓰지 않았습니다.',
    ],
  },
  {
    title: '모션',
    body: [
      '움직임은 transform·opacity·clip-path로만 만듭니다. 링크 밑줄 그리기(`background-size`)와 색·그림자 전환만 예외입니다. 운영체제의 동작 줄이기를 켜면 전부 멈춥니다.',
      '본문은 JS 없이도 보입니다. 첫 화면 헤드라인은 CSS 애니메이션이라 첫 페인트와 함께 시작하고, 스크롤 연동 효과는 지원하는 브라우저에서만 켜집니다.',
    ],
  },
  {
    title: '접근성',
    body: [
      '키보드만으로 모두 쓸 수 있습니다. ⌘K 팔레트는 WAI-ARIA 콤보박스 패턴(입력칸 + `listbox`, `aria-activedescendant`)이고, 모바일 메뉴는 모달 `<dialog>`라 포커스가 갇히고 Esc로 닫힙니다. Esc나 닫기 버튼으로 닫으면 여는 버튼으로, 섹션 링크를 누르면 그 섹션으로 포커스가 갑니다.',
      '이메일 복사 결과는 `role="status"`로 알립니다. 한글은 어절 중간에서 끊지 않습니다(`word-break: keep-all` + `overflow-wrap: break-word`).',
    ],
  },
];

/** 대비 표. 색 값은 토큰(src/content/tokens.ts)에서 읽는다. */
const rows: { use: string; fg: TokenName; bg: TokenName; min: { light: number; dark: number } }[] = [
  { use: '본문 글자', fg: 'ink', bg: 'bg', min: { light: 4.5, dark: 4.5 } },
  { use: '보조 글자', fg: 'muted', bg: 'bg', min: { light: 4.5, dark: 4.5 } },
  { use: '링크·작은 강조', fg: 'accentInk', bg: 'bg', min: { light: 4.5, dark: 4.5 } },
  { use: '버튼 글자', fg: 'onAccent', bg: 'accentInk', min: { light: 4.5, dark: 4.5 } },
  { use: '포인트(큰 글자·그래픽만)', fg: 'brand', bg: 'bg', min: { light: 3, dark: 3 } },
  // 라이트의 연락 섹션은 큰 글자 기준만 통과해서 24px 이상만 쓴다. 다크는 한 톤 낮춰 작은 글자도 통과한다.
  { use: '연락 섹션', fg: 'onContact', bg: 'contactBg', min: { light: 3, dark: 4.5 } },
  { use: 'UI 경계선', fg: 'lineStrong', bg: 'bg', min: { light: 3, dark: 3 } },
];
const palettes = (['light', 'dark'] as const).map((theme) => {
  const hex = (s: TokenName) => tokens[theme][s].toUpperCase();
  return {
    name: theme === 'light' ? '라이트' : '다크',
    rows: rows.map((r) => ({ use: r.use, fg: hex(r.fg), bg: hex(r.bg), min: r.min[theme] })),
  };
});

const fonts = [
  { name: 'Pretendard', use: '한글 본문·제목. 사이트에 쓰인 글자만 남긴 가변 글꼴 한 파일을 자체 호스팅', license: 'SIL OFL 1.1' },
  { name: 'Instrument Serif', use: '큰 숫자와 인용 부호', license: 'SIL OFL 1.1' },
  { name: 'Reddit Mono', use: '영문·숫자 메타 라벨', license: 'SIL OFL 1.1' },
];

export default function ColophonPage() {
  return (
    <article className={`container ${styles.page}`}>
      <header className={styles.head}>
        <h1 className={styles.title}>이 사이트를 만든 방식</h1>
        <p className={styles.lede}>스택, 딥링크, 미리보기, 모션, 접근성, 색 대비, 글꼴을 적었습니다.</p>
      </header>

      <div className={styles.notes}>
        {notes.map((n) => (
          <section key={n.title} className={styles.note} aria-labelledby={`note-${n.title}`}>
            <h2 id={`note-${n.title}`} className={styles.noteTitle}>
              {n.title}
            </h2>
            <div className={styles.noteBody}>
              {n.body.map((b) => (
                <p key={b}>
                  <Rich text={b} />
                </p>
              ))}
            </div>
          </section>
        ))}

        <section className={styles.note} aria-labelledby="note-contrast">
          <h2 id="note-contrast" className={styles.noteTitle}>
            색 대비
          </h2>
          <div className={styles.noteBody}>
            <p>
              포인트 색 <span className="nowrap"><code>{tokens.light.brand.toUpperCase()}</code>는</span> 페이지 배경{' '}
              <span className="nowrap"><code>{tokens.light.bg.toUpperCase()}</code>에서</span>{' '}
              {ratio(tokens.light.brand, tokens.light.bg)}(흰 배경에서도{' '}
              <span className="nowrap">{ratio(tokens.light.brand, tokens.light.surface)})이라</span> 작은
              글자에는 쓰지 않습니다. 작은 글자와 링크는 한 톤 진한{' '}
              <span className="nowrap"><code>{tokens.light.accentInk.toUpperCase()}</code>를</span> 씁니다. 아래 값은
              토큰에서 빌드 때 계산한 WCAG 대비비입니다. 토큰과 CSS 변수가 같은 값인지는 빌드 결과 검사가 확인합니다.
            </p>
            {palettes.map((p) => (
              <table key={p.name} className={styles.table}>
                <caption>{p.name} 테마</caption>
                <thead>
                  <tr>
                    <th scope="col">쓰임</th>
                    <th scope="col">글자 / 배경</th>
                    <th scope="col">대비</th>
                  </tr>
                </thead>
                <tbody>
                  {p.rows.map((r) => {
                    const value = contrastRatio(r.fg, r.bg);
                    return (
                      <tr key={r.use}>
                        <th scope="row">{r.use}</th>
                        <td>
                          <span className={styles.swatches} aria-hidden="true">
                            <span style={{ background: r.fg }} />
                            <span style={{ background: r.bg }} />
                          </span>
                          <span className="mono">
                            {r.fg} / {r.bg}
                          </span>
                        </td>
                        <td className="mono">
                          {value.toFixed(2)}:1
                          <span className={styles.pass}>{value >= r.min ? ` ≥ ${r.min}` : ` < ${r.min}`}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ))}
          </div>
        </section>

        <section className={styles.note} aria-labelledby="note-fonts">
          <h2 id="note-fonts" className={styles.noteTitle}>
            글꼴
          </h2>
          <div className={styles.noteBody}>
            <ul role="list" className={styles.fonts}>
              {fonts.map((f) => (
                <li key={f.name}>
                  <strong>{f.name}</strong>
                  <span>{f.use}</span>
                  <span className="mono">{f.license}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <p className={styles.back}>
        <Link href="/" className="prose-link">
          홈으로
        </Link>
        <span aria-hidden="true"> · </span>
        <a href={`mailto:${profile.email}`} className="prose-link">
          {profile.email}
        </a>
      </p>
    </article>
  );
}

# jinxuyeon.github.io

프론트엔드 개발자 진수연의 포트폴리오. https://jinxuyeon.github.io

## 스택

- Next.js 16 App Router 정적 내보내기(`output: 'export'`, `trailingSlash: true`)
- React 19 · TypeScript(strict) · ESLint
- CSS Modules + CSS 변수 토큰(`src/app/globals.css`). 라이트·다크 두 벌
- Motion은 토스트 한 곳에만(LazyMotion). 나머지 움직임은 CSS
- 글꼴: Pretendard(사이트 글자만 남긴 가변 글꼴 한 파일, 자체 호스팅), Instrument Serif·JetBrains Mono(`next/font`, 라틴 서브셋)

## 로컬에서

Node 24가 필요하다.

```sh
npm ci
npm run dev         # 준비 단계(assets) 뒤 개발 서버
npm run build       # prebuild → next build → postbuild → out/
npx serve out       # 빌드 결과 미리 보기
npm run check       # out/ 검사: 라우트별 HTML·h1·canonical·og:image(PNG)·sitemap·색 토큰·글꼴 서브셋
npm run lint
npm run typecheck
```

`npm run build` 앞에 `scripts/prebuild.mjs`가 돈다. `src/`에 쓰인 글자만 남긴 Pretendard 서브셋을 `public/fonts/`에 만들고,
화면 이미지의 WebP 사본과 페이지별 OG 이미지(`scripts/og.mjs`, 1200×630 PNG)를 만든다.
네트워크 없이 돌고, 만든 파일은 커밋하지 않는다. 빌드 뒤에는 `scripts/postbuild.mjs`가 404 페이지의 여분 사본을 지운다.

색은 `src/content/tokens.ts`와 `src/app/globals.css`의 CSS 변수 두 곳에 있다. 하나를 바꾸면 다른 쪽도 바꾼다(`npm run check`가 비교한다).

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/content/` | 소개·프로젝트 데이터. 홈 카드와 상세 페이지가 같은 데이터를 쓴다 |
| `src/app/` | 라우트: `/`, `/projects/[slug]/`, `/colophon/`, 404 |
| `src/components/` | 내비, ⌘K 팔레트, 모바일 메뉴, 테마 토글, 카드 |
| `scripts/` | prebuild(글꼴·이미지·OG), postbuild(404 사본 정리), 빌드 결과 검사 |
| `public/img/` | 원본 화면 이미지. 예전 주소 그대로 둔다 |

모션·접근성·색 대비 원칙은 사이트의 「이 사이트를 만든 방식」(`/colophon/`) 페이지에 적었다.

## 배포

`main`에 push하면 `.github/workflows/deploy.yml`이 린트·타입 검사·빌드·`out/` 검사를 거쳐 GitHub Pages에 올린다.
저장소 Pages 설정의 소스가 「GitHub Actions」여야 한다. 예전 정적 판(main 루트의 `index.html`)은 legacy 빌드였으므로,
이 구조를 main에 합치기 **전에** Settings → Pages → Source를 「GitHub Actions」로 바꾼다.

## 이 파일은 공개용이다

이 사이트는 누구나 읽을 수 있고 검색엔진에 색인된다. 저장소를 공개하든 비공개로 두든 같다.
**재직 회사의 원가·내부 지표·정확한 건수는 여기에 적지 않는다.** 본문이든 README든 데이터 파일(`src/content/`)이든 같다.
데이터 규모는 대략적인 값(몇 만 건 단위)만 기준 시점과 함께 적는다(2026-10-07 결정). 화면 이미지는 목 데이터로만 찍는다.

상세 수치가 필요한 판본(이력서 상세본)은 로컬에만 두고 지원서·면접에서 1:1로 전달한다.
수정할 때 상세본을 그대로 복사해 붙이지 말 것. 이 구분이 무너진다.

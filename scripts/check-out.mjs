// 빌드 결과(out/)를 검사한다: npm run build && npm run check
// 라우트마다 정적 HTML이 있고, JS 없이 본문이 읽히고, 미리보기 메타가 자기 주소를 가리키는지.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/content/projects.ts';
import { SITE_URL } from '../src/content/site.ts';
import { cssVar, tokens } from '../src/content/tokens.ts';
import { collectChars } from './font-chars.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'out');
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const failures = [];
const fail = (msg) => failures.push(msg);

const meta = (html, attr, name) => {
  const m = new RegExp(`<meta ${attr}="${name}" content="([^"]*)"`).exec(html);
  return m?.[1];
};

const pages = [
  { route: '/', text: ['진수연', '화면을 그리는', '회귀 방지까지'] },
  ...projects.map((p) => ({ route: `/projects/${p.slug}/`, text: [p.title, p.summary.slice(0, 12)] })),
  { route: '/colophon/', text: ['이 사이트를 만든 방식'] },
];

for (const { route, text } of pages) {
  const file = path.join(out, route, 'index.html');
  if (!existsSync(file)) {
    fail(`${route}: index.html 없음`);
    continue;
  }
  const html = readFileSync(file, 'utf8');
  const self = new URL(route, SITE_URL).toString();

  if (!/<h1[\s>]/.test(html)) fail(`${route}: h1 없음`);
  for (const t of text) if (!html.includes(t)) fail(`${route}: 본문에 「${t}」 없음`);
  if (html.includes('style="opacity:0')) fail(`${route}: style="opacity:0 이 HTML에 있음`);

  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];
  if (canonical !== self) fail(`${route}: canonical ${canonical} ≠ ${self}`);
  const ogUrl = meta(html, 'property', 'og:url');
  if (ogUrl !== self) fail(`${route}: og:url ${ogUrl} ≠ ${self}`);

  const ogImage = meta(html, 'property', 'og:image');
  if (!ogImage?.startsWith(`${SITE_URL}/og/`) || !ogImage.endsWith('.png')) {
    fail(`${route}: og:image가 절대 URL PNG가 아님 (${ogImage})`);
  } else {
    const png = path.join(out, new URL(ogImage).pathname);
    if (!existsSync(png)) fail(`${route}: ${ogImage} 파일 없음`);
    else if (!readFileSync(png).subarray(0, 8).equals(PNG)) fail(`${route}: ${ogImage} PNG 시그니처 아님`);
  }
  if (meta(html, 'name', 'twitter:card') !== 'summary_large_image') fail(`${route}: twitter:card`);
  // 페이지 메타의 openGraph가 layout 값을 통째로 덮어쓰므로 사이트 이름·언어가 빠지기 쉽다
  if (!meta(html, 'property', 'og:site_name')) fail(`${route}: og:site_name 없음`);
  if (meta(html, 'property', 'og:locale') !== 'ko_KR') fail(`${route}: og:locale이 ko_KR 아님`);
  // 글꼴 preload는 한 번만(JSX <link>로 쓰면 React가 끌어올린 것과 두 번 찍힌다)
  const preloads = html.match(/<link[^>]*rel="preload"[^>]*href="\/fonts\/pretendard-site\.woff2"/g)?.length ?? 0;
  if (preloads !== 1) fail(`${route}: 글꼴 preload ${preloads}개(1개여야 함)`);
}

for (const f of ['404.html', 'sitemap.xml', 'robots.txt', 'favicon.svg']) {
  if (!existsSync(path.join(out, f))) fail(`${f} 없음`);
}
// 404 페이지 사본이 다른 주소에서 200으로 열리지 않게(scripts/postbuild.mjs가 지운다)
for (const f of ['404/index.html', '_not-found/index.html']) {
  if (existsSync(path.join(out, f))) fail(`${f}이 남아 있음(/${path.dirname(f)}/가 200으로 열린다)`);
}
// 화면 이미지 원본(옛 주소 유지). 기대 개수는 데이터에 적힌 스크린샷 수다.
const expectedShots = new Set(projects.flatMap((p) => (p.shots ?? []).map((s) => s.file)));
const originals = readdirSync(path.join(out, 'img')).filter((f) => /\.(png|jpe?g)$/.test(f));
if (originals.length !== expectedShots.size) {
  fail(`out/img 원본 이미지 ${originals.length}장(${expectedShots.size}장이어야 함)`);
}
for (const f of expectedShots) if (!originals.includes(f)) fail(`out/img/${f} 없음`);

// 색 토큰: 빌드된 CSS의 :root 값이 src/content/tokens.ts와 같은지. 대비 표·OG 이미지가 이 파일을 읽는다.
const cssDir = path.join(out, '_next/static');
const cssFiles = readdirSync(cssDir, { recursive: true })
  .filter((f) => String(f).endsWith('.css'))
  .map((f) => readFileSync(path.join(cssDir, String(f)), 'utf8'));
const hex6 = (v) => {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v.trim());
  if (!m) return v.trim().toLowerCase();
  const h = m[1].toLowerCase();
  return `#${h.length === 3 ? [...h].map((c) => c + c).join('') : h}`;
};
const blocks = { light: [], dark: [] };
for (const css of cssFiles) {
  for (const [, selector, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = selector.trim().replace(/["']/g, '');
    if (!body.includes('--bg:')) continue;
    if (sel === ':root') blocks.light.push(body);
    else if (sel === ':root[data-theme=dark]' || sel === ':root:not([data-theme=light])') blocks.dark.push(body);
  }
}
for (const theme of /** @type {const} */ (['light', 'dark'])) {
  const expected = theme === 'light' ? 1 : 2; // 다크는 prefers-color-scheme 쪽과 data-theme 쪽 두 벌
  if (blocks[theme].length !== expected) fail(`CSS :root ${theme} 블록 ${blocks[theme].length}개(${expected}개여야 함)`);
  for (const body of blocks[theme]) {
    for (const [name, value] of Object.entries(tokens[theme])) {
      const m = new RegExp(`${cssVar(name)}:([^;}]+)`).exec(body);
      if (!m) fail(`CSS ${theme}: ${cssVar(name)} 없음`);
      else if (hex6(m[1]) !== value) fail(`CSS ${theme}: ${cssVar(name)} ${m[1]} ≠ tokens.ts ${value}`);
    }
  }
}

const sitemap = readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
for (const { route } of pages) {
  if (!sitemap.includes(`<loc>${new URL(route, SITE_URL)}</loc>`)) fail(`sitemap에 ${route} 없음`);
}

// 글꼴 서브셋: 빌드된 HTML에 나오는 글자가 전부 서브셋에 넣은 글자 안에 있는지(빠진 글자는 대체 글꼴로 튄다).
const fontFile = path.join(out, 'fonts/pretendard-site.woff2');
if (!existsSync(fontFile)) fail('fonts/pretendard-site.woff2 없음');
const subset = new Set(collectChars(root));
const htmlFiles = readdirSync(out, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'));
const missing = new Set();
for (const f of htmlFiles) {
  const text = readFileSync(path.join(out, f), 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, ' ');
  // U+2060(단어 결합자)은 줄바꿈만 막는 보이지 않는 글자라 글리프가 필요 없다(src/lib/text.ts)
  for (const ch of text) if (!/[\s\u2060]/.test(ch) && !subset.has(ch)) missing.add(ch);
}
if (missing.size) fail(`글꼴 서브셋에 없는 글자 ${missing.size}개: ${[...missing].join('')}`);

if (failures.length) {
  console.error(`✗ ${failures.length}건\n` + failures.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}
console.log(
  `✓ out/ 검사 통과 — 페이지 ${pages.length}개, 원본 이미지 ${originals.length}장, 색 토큰 일치, 글꼴 서브셋 ${subset.size}자`,
);

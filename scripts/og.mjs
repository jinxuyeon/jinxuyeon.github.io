// 페이지별 OG 이미지(1200×630 PNG)를 public/og/에 굽는다.
//
// app/opengraph-image.tsx를 쓰지 않는 이유: output: 'export'에서 확장자 없는 파일이 생기고
// GitHub Pages가 그 파일을 application/octet-stream으로 보내 미리보기가 깨진다(vercel/next.js#82177).
// Satori는 woff2를 읽지 못하고, 글꼴을 넘기지 않으면 한글 글리프를 실행 중에 네트워크로 받는다.
// 그래서 Pretendard OTF를 직접 넘긴다.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';
import { ImageResponse } from 'next/og.js';
import { projects } from '../src/content/projects.ts';
import { lead, profile, SITE_URL } from '../src/content/site.ts';
import { tokens } from '../src/content/tokens.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const otf = (name) => readFile(path.join(root, 'node_modules/pretendard/dist/public/static', `Pretendard-${name}.otf`));

// 미리보기 이미지는 라이트 테마 한 벌로 굽는다.
const C = tokens.light;
const HOST = new URL(SITE_URL).host;

function card({ kind, title, summary }) {
  const lines = Array.isArray(title) ? title : [title];
  const longest = Math.max(...lines.map((l) => l.length));
  const titleSize = lines.length > 1 ? 76 : longest > 9 ? 84 : 112;
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: C.bg,
        padding: '64px 72px',
        fontFamily: 'Pretendard',
        color: C.ink,
      },
    },
    h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 32,
          borderBottom: `2px solid ${C.line}`,
        },
      },
      h(
        'div',
        { style: { display: 'flex', alignItems: 'center', gap: 24 } },
        h(
          'div',
          {
            style: {
              width: 84,
              height: 84,
              borderRadius: 20,
              background: C.brand,
              color: C.onAccent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              paddingBottom: 6,
            },
          },
          '>_',
        ),
        h(
          'div',
          { style: { display: 'flex', flexDirection: 'column' } },
          h('div', { style: { fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em' } }, profile.name),
          h('div', { style: { fontSize: 22, color: C.muted, fontWeight: 500 } }, profile.role),
        ),
      ),
      h('div', { style: { fontSize: 24, color: C.muted, fontWeight: 500 } }, HOST),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 18 } },
      h('div', { style: { fontSize: 28, fontWeight: 600, color: C.accentInk } }, kind),
      h(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            fontSize: titleSize,
            fontWeight: 800,
            letterSpacing: '-0.045em',
            lineHeight: 1.08,
          },
        },
        ...lines.map((line) => h('div', { key: line }, line)),
      ),
      h(
        'div',
        {
          style: {
            fontSize: 32,
            color: C.muted,
            fontWeight: 500,
            lineHeight: 1.45,
            // 본문 폭(1200 - 좌우 여백 72×2)을 다 써서 끝 한 단어만 다음 줄로 떨어지지 않게
            maxWidth: 1056,
            wordBreak: 'keep-all',
          },
        },
        summary,
      ),
    ),
  );
}

export async function buildOgImages(outDir) {
  await mkdir(outDir, { recursive: true });
  const fonts = [
    { name: 'Pretendard', data: await otf('Medium'), weight: 500, style: 'normal' },
    { name: 'Pretendard', data: await otf('SemiBold'), weight: 600, style: 'normal' },
    { name: 'Pretendard', data: await otf('ExtraBold'), weight: 800, style: 'normal' },
  ];

  const pages = [
    {
      file: 'home',
      kind: profile.roleLine,
      title: lead.headline.map((line) => line.join(' ')),
      summary: lead.first.replace(/\*\*/g, ''),
    },
    {
      file: 'colophon',
      kind: '포트폴리오 사이트',
      title: '이 사이트를 만든 방식',
      summary: 'Next.js 16 정적 내보내기 · TypeScript · CSS Modules · Motion',
    },
    ...projects.map((p) => ({ file: p.slug, kind: p.kind, title: p.title, summary: p.summary })),
  ];

  for (const page of pages) {
    const res = new ImageResponse(card(page), { width: 1200, height: 630, fonts });
    await writeFile(path.join(outDir, `${page.file}.png`), Buffer.from(await res.arrayBuffer()));
  }
  console.log(`og      ${pages.length} PNG → public/og/`);
}

// 따로 실행: node scripts/og.mjs
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await buildOgImages(path.join(root, 'public/og'));
}

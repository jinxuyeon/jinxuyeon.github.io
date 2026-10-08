import type { Metadata, Viewport } from 'next';
import { Instrument_Serif, Reddit_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';
import { Footer } from '@/components/Footer';
import { Nav } from '@/components/Nav';
import { Toaster } from '@/components/Toaster';
import { projects } from '@/content/projects';
import { profile, SITE_URL } from '@/content/site';
import { tokens } from '@/content/tokens';
import { SITE_NAME } from '@/lib/meta';
import { themeInitScript } from '@/lib/theme';
import './globals.css';

// 세리프는 큰 숫자·인용 부호에, 모노는 영문·숫자 메타 라벨에만 쓴다. 라틴 서브셋만 받아 빌드에 넣는다.
const serif = Instrument_Serif({
  weight: '400',
  style: 'italic',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
});
const mono = Reddit_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-reddit',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: profile.description,
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: { siteName: SITE_NAME, locale: 'ko_KR', type: 'website' },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: tokens.light.bg },
    { media: '(prefers-color-scheme: dark)', color: tokens.dark.bg },
  ],
};

const paletteProjects = projects.map((p) => ({ slug: p.slug, title: p.title }));

export default function RootLayout({ children }: { children: ReactNode }) {
  // 한글 본문 글꼴 한 파일(@font-face는 globals.css). 렌더링을 막는 글꼴 CSS 없이 바로 받는다.
  // JSX <link>로 쓰면 React가 끌어올린 것과 원래 자리 것, 두 번 찍힌다.
  preload('/fonts/pretendard-site.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });
  return (
    // data-theme은 첫 페인트 전에 인라인 스크립트가 붙인다. 서버 HTML과 달라지는 게 정상이다.
    <html lang="ko" className={`${serif.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          본문 바로가기
        </a>
        <Nav projects={paletteProjects} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}

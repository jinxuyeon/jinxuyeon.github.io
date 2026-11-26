import type { MetadataRoute } from 'next';
import { profile } from '@/content/site';
import { tokens } from '@/content/tokens';
import { SITE_NAME } from '@/lib/meta';

export const dynamic = 'force-static';

// 안드로이드 홈 화면에 추가할 때 쓰는 큰 아이콘을 알려 주는 용도다. 앱처럼 설치되게 하려는 게 아니라 display는 browser.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: profile.name,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: tokens.light.bg,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}

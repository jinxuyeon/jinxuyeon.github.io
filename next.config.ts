import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages는 정적 파일만 서빙한다. 라우트마다 index.html을 뽑는다.
  output: 'export',
  // /projects/nutti/ 처럼 끝 슬래시 폴더로 내보내야 직접 접속·새로고침이 200이다.
  trailingSlash: true,
  // export에서는 기본 이미지 최적화가 없다. WebP 사본은 scripts/prebuild.mjs가 만든다.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;

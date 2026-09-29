import type { Metadata } from 'next';
import { SITE_URL } from '@/content/site';

export const SITE_NAME = '진수연 포트폴리오';
/** 홈의 탭·미리보기 제목. 여러 지원서를 탭으로 열어 두어도 직무가 보이게 */
const HOME_TITLE = '진수연 — 프론트엔드 개발자 포트폴리오';

/**
 * 페이지마다 canonical·og:url(끝 슬래시)·og:image(절대 URL PNG)를 맞춘다.
 * og 이미지는 scripts/og.mjs가 prebuild에서 public/og/<name>.png로 굽는다.
 * 미리보기 제목은 <title>과 같게 「제목 · 진수연 포트폴리오」로 둔다(글자만 보이는 미리보기에서도 누구 것인지 보이게).
 * title이 없으면 홈이다.
 * openGraph는 layout 값과 합쳐지지 않고 통째로 덮어쓰므로 siteName·locale도 여기서 다시 넣는다.
 */
export function pageMeta({
  path,
  title,
  description,
  ogDescription = description,
  og,
  ogAlt,
}: {
  path: string;
  title?: string;
  description: string;
  /** 미리보기 설명이 메타 설명과 다를 때 */
  ogDescription?: string;
  og: string;
  ogAlt: string;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const image = { url: `${SITE_URL}/og/${og}.png`, width: 1200, height: 630, alt: ogAlt, type: 'image/png' };
  const shareTitle = title ? `${title} · ${SITE_NAME}` : HOME_TITLE;
  return {
    title: title ?? { absolute: HOME_TITLE },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'ko_KR',
      url,
      title: shareTitle,
      description: ogDescription,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: ogDescription,
      images: [image.url],
    },
  };
}

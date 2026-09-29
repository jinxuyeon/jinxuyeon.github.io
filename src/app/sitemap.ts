import type { MetadataRoute } from 'next';
import { projects } from '@/content/projects';
import { SITE_URL } from '@/content/site';

// output: 'export'에서는 이 설정이 있어야 sitemap.xml이 파일로 나온다.
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', ...projects.map((p) => `/projects/${p.slug}/`), '/colophon/'];
  return paths.map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}

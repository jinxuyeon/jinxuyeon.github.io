'use client';

import { useEffect } from 'react';
import { sections } from '@/content/site';

/**
 * 다른 페이지에서 홈 섹션 주소(/#about 등)로 들어오면 브라우저는 스크롤만 하고 포커스는 BODY에 둔다.
 * 홈 안에서 섹션 링크를 누를 때(lib/section.ts)처럼 그 섹션(tabIndex=-1)으로 포커스를 옮겨
 * 키보드·스크린리더의 읽기 위치도 함께 맞춘다.
 */
export function HashFocus() {
  useEffect(() => {
    // 섹션 id는 모두 ASCII라 디코딩하지 않는다. 잘못 인코딩된 해시(/#100%)에서 URIError가 나지 않게.
    const id = window.location.hash.slice(1);
    if (!sections.some((s) => s.id === id)) return;
    document.getElementById(id)?.focus({ preventScroll: true });
  }, []);
  return null;
}

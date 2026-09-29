'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 헤더 껍데기. 맨 위에 있을 때만 배경을 걷는다(data-top). JS가 없으면 늘 배경이 있는 상태다.
 * 안의 링크 목록·로고는 서버 컴포넌트로 그려 children으로 받는다.
 */
export function NavShell({
  className,
  sentinelClassName,
  children,
}: {
  className?: string;
  sentinelClassName?: string;
  children: ReactNode;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const sentinel = sentinelRef.current;
    if (!header || !sentinel) return;
    const io = new IntersectionObserver(([entry]) => {
      header.dataset.top = String(Boolean(entry?.isIntersecting));
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className={sentinelClassName} aria-hidden="true" />
      <header ref={headerRef} className={className}>
        {children}
      </header>
    </>
  );
}

/** 로고 링크. 홈에 있을 때 aria-current="page". */
export function BrandLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href="/" className={className} aria-current={pathname === '/' ? 'page' : undefined}>
      {children}
    </Link>
  );
}

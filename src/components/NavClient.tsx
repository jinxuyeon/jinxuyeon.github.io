'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 헤더 껍데기. 맨 위에 있을 때만 배경을 걷는다(data-top). JS가 없으면 늘 배경이 있는 상태다.
 * 홈에서는 첫 화면의 큰 이름이 보이는지도 알려 준다(data-hero-name).
 * 안의 링크 목록·이름은 서버 컴포넌트로 그려 children으로 받는다.
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
  const pathname = usePathname();

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

  // 홈: 첫 화면의 큰 이름(#hero-name)이 헤더 아래로 보이는 동안은 헤더의 이름을 감춘다(Nav.module.css).
  // 한 화면에 이름이 둘 보이지 않게 하려는 것이라, 큰 이름이 헤더 뒤로 올라가면 헤더의 이름이 나타난다.
  useEffect(() => {
    const header = headerRef.current;
    const name = document.getElementById('hero-name');
    if (!header || !name) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        header.dataset.heroName = entry?.isIntersecting ? 'in' : 'out';
      },
      { rootMargin: `-${header.offsetHeight}px 0px 0px 0px` },
    );
    io.observe(name);
    return () => {
      io.disconnect();
      delete header.dataset.heroName;
    };
  }, [pathname]);

  return (
    <>
      <div ref={sentinelRef} className={sentinelClassName} aria-hidden="true" />
      <header ref={headerRef} className={className}>
        {children}
      </header>
    </>
  );
}

/** 이름 링크. 홈에 있을 때 aria-current="page". */
export function BrandLink({ className, children }: { className?: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href="/" className={className} aria-current={pathname === '/' ? 'page' : undefined}>
      {children}
    </Link>
  );
}

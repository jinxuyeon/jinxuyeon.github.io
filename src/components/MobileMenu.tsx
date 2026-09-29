'use client';

import Link from 'next/link';
import { useId, useRef, useState, type CSSProperties } from 'react';
import { profile, sections } from '@/content/site';
import { goSection } from '@/lib/section';
import { LogoMark } from './LogoMark';
import styles from './MobileMenu.module.css';

/**
 * 좁은 화면의 전체 화면 메뉴. 모달 <dialog>로 포커스를 가두고 Esc로 닫는다.
 * Esc나 닫기 버튼으로 닫으면 브라우저가 여는 버튼으로 포커스를 돌려준다.
 * 섹션 링크로 닫으면 그 섹션으로 포커스를 보낸다.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const id = useId();

  const close = () => dialogRef.current?.close();
  const no = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <>
      <button
        type="button"
        className={`icon-btn ${styles.burger}`}
        data-needs-js
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
      >
        <span className="sr-only">메뉴 열기</span>
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4 8h16M4 16h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <dialog ref={dialogRef} id={id} className={styles.menu} aria-label="메뉴" onClose={() => setOpen(false)}>
        <div className={styles.top}>
          {/* 닫힌 내비의 로고 자리와 모양을 잇는다(장식) */}
          <span className={styles.brand} aria-hidden="true">
            <LogoMark size={28} />
            {profile.name}
          </span>
          <button type="button" className="icon-btn" onClick={close}>
            <span className="sr-only">메뉴 닫기</span>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav aria-label="메뉴">
          <ol role="list" className={styles.list}>
            {sections.map((s, i) => (
              <li key={s.id} className={styles.item} style={{ '--i': i } as CSSProperties}>
                <a
                  href={`/#${s.id}`}
                  className={styles.link}
                  onClick={(e) => {
                    close();
                    // 홈이면 대화상자가 닫힌 뒤 섹션으로 스크롤하고 포커스를 옮긴다.
                    // 다른 페이지면 기본 동작(홈을 새로 불러 해시로 이동)에 맡긴다.
                    if (goSection(s.id)) e.preventDefault();
                  }}
                >
                  <span className={`mono ${styles.no}`} aria-hidden="true">
                    {no(i)}
                  </span>
                  <span className={styles.label}>{s.label}</span>
                </a>
              </li>
            ))}
            <li className={styles.item} style={{ '--i': sections.length } as CSSProperties}>
              <Link href="/colophon/" className={styles.link} onClick={close}>
                <span className={`mono ${styles.no}`} aria-hidden="true">
                  {no(sections.length)}
                </span>
                <span className={styles.label}>이 사이트를 만든 방식</span>
              </Link>
            </li>
          </ol>
        </nav>

        <div className={styles.bottom}>
          <a href={`mailto:${profile.email}`} className="u-link">
            {profile.email}
          </a>
          <a href={profile.github} className="u-link" target="_blank" rel="noopener noreferrer">
            {profile.githubLabel}
            <span className="sr-only"> (새 탭)</span>
          </a>
        </div>
      </dialog>
    </>
  );
}

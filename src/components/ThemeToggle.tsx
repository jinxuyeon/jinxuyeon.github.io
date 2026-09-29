'use client';

import { useSyncExternalStore } from 'react';
import { currentTheme, THEME_EVENT, toggleTheme, type Theme } from '@/lib/theme';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  window.addEventListener(THEME_EVENT, onChange);
  mq.addEventListener('change', onChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    mq.removeEventListener('change', onChange);
  };
}

/** 서버에서는 테마를 모른다. 이름은 수화 뒤에 정해진다. */
const getServerSnapshot = (): Theme | null => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, getServerSnapshot);
  const label =
    theme === null ? '밝은 테마와 어두운 테마 전환' : theme === 'dark' ? '밝은 테마로 전환' : '어두운 테마로 전환';

  return (
    <button
      type="button"
      className="icon-btn"
      data-needs-js
      aria-label={label}
      title={label}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
    >
      {/* 해와 달을 CSS로 바꿔 끼운다(테마별로 한쪽만 보인다) */}
      <svg className="icon-sun" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      <svg className="icon-moon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

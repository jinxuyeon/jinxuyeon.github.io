export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
export const THEME_EVENT = 'site:theme';

/**
 * <head>에서 첫 페인트 전에 도는 스크립트. JS가 돈다는 표시(.js)를 붙이고,
 * 저장된 테마 값이 있을 때만 data-theme을 붙인다.
 */
export const themeInitScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // 저장이 막혀 있어도 이번 방문에서는 바뀐다.
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: theme }));
}

/**
 * 테마를 뒤집는다. origin이 있으면 그 점에서 원형으로 번지는 리빌.
 * View Transitions API가 없거나 동작 줄이기면 즉시 바꾼다.
 */
export function toggleTheme(origin?: { x: number; y: number }): void {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof document.startViewTransition !== 'function') {
    apply(next);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const root = document.documentElement;
  root.classList.add('theme-vt');

  // 새 테마는 data-theme과 CSS 변수로만 바뀐다. React 재렌더를 기다릴 필요가 없다.
  const vt = document.startViewTransition(() => apply(next));
  vt.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 480, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    })
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove('theme-vt'));
}

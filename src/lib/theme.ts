export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
export const THEME_EVENT = 'site:theme';

/**
 * <head>에서 첫 페인트 전에 도는 스크립트. JS가 돈다는 표시(.js)를 붙이고,
 * 저장된 테마 값이 있을 때만 data-theme을 붙인다.
 */
export const themeInitScript = `(function(){document.documentElement.classList.add('js');try{var t=localStorage.getItem('${STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

/**
 * 파비콘은 투명 바탕의 J 한 글자라 탭 바탕에 맞춰 검정·흰색이 바뀌어야 한다. 표준 방법(SVG 안의
 * prefers-color-scheme, <link media>)이 브라우저마다 달리 돌아서, 탭 아이콘 링크는 이 스크립트가 만든다.
 * (2026-11 사파리 27.2·크롬의 실제 탭으로 확인. 사이트의 테마 버튼이 아니라 브라우저 창의 테마를 따른다.)
 *
 * - 사파리는 파비콘 안의 미디어 쿼리를 늘 밝은 테마로 풀고 <link media>도 보지 않는다. 그래서 <head>에서
 *   로드 전에 테마에 맞는 파일을 골라 둔다.
 * - 사파리는 로드가 끝난 뒤의 아이콘 교체를 어떤 식으로도 따라오지 않는다(href 교체, 링크 새로 만들기,
 *   rel 다시 붙이기, pushState·replaceState·hash 변경 전부 시험함). 그래서 사파리에서만, 열린 탭에서
 *   테마가 바뀌면 페이지를 다시 읽어 아이콘을 새로 고르게 한다. 아이콘 파일이 캐시에 있으면 다시 읽어도
 *   탭 아이콘이 안 바뀌므로, 다시 읽은 로드(navigation type이 reload)에서는 주소에 꼬리표를 붙여 새로 받게 한다.
 *   기다렸다 읽을 필요는 없다(대기 0·0.3·0.8·1.5초를 비교했고 0초에서도 1초 안에 바뀐다).
 *   그래도 열 번에 한 번꼴로 사파리가 새 아이콘을 받아 가지 않는다(24번 중 2번, 대기 길이와 무관,
 *   페이지는 그때도 맞는 주소를 지정했다). 그때는 다음 로드까지 사파리의 대비용 판이 보인다.
 *   탭에 아이콘이 안 보이는 아이폰과, 사파리가 아닌 iOS 브라우저는 뺀다.
 * - 크롬은 파일 안 전환 규칙을 로드 때 한 번만 풀어 그린 결과를 주소별로 기억한다. 그래서 색이 고정된
 *   파일 둘을 두고 change 이벤트 때 주소를 바꾼다. 뒤에 있는 탭은 change가 늦게 오므로 탭이 다시
 *   보일 때(visibilitychange)도 맞춘다.
 * - 링크를 메타데이터(JSX)로 찍고 href만 바꾸면, 하이드레이션이 원래 href의 링크를 하나 더 만들고
 *   크롬은 뒤의 것을 쓴다. 그래서 링크 자체를 여기서 만든다.
 * - 스크립트를 안 돌리는 수집기·브라우저는 링크가 없으니 /favicon.ico(흰 판 위 검은 J)를 찾아간다.
 */
export const faviconInitScript = `(function(){try{var m=matchMedia('(prefers-color-scheme: dark)');var u=navigator.userAgent;var s=(navigator.vendor||'').indexOf('Apple')===0&&/Version\\/.*Safari/.test(u)&&!/iPhone|iPod/.test(u);var q='';try{var n=performance.getEntriesByType('navigation')[0];if(s&&n&&n.type==='reload')q='?'+Date.now();}catch(e){}var l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';var f=function(){l.href=(m.matches?'/favicon-dark.svg':'/favicon.svg')+q;};f();document.head.appendChild(l);var c=function(){if(s)location.reload();else f();};if(m.addEventListener)m.addEventListener('change',c);else if(m.addListener)m.addListener(c);document.addEventListener('visibilitychange',f);}catch(e){}})();`;

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

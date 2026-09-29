/**
 * 홈의 섹션으로 이동한다. 스크롤만 하지 않고 섹션(tabIndex=-1)에 포커스를 줘서
 * 키보드·스크린리더 사용자의 읽기 위치도 함께 옮긴다.
 * 홈이 아니거나 섹션이 없으면 false를 돌려주고 아무것도 하지 않는다(부르는 쪽이 홈으로 보낸다).
 */
export function goSection(id: string): boolean {
  if (window.location.pathname !== '/') return false;
  const el = document.getElementById(id);
  if (!el) return false;
  history.pushState(null, '', `#${id}`);
  el.scrollIntoView({ block: 'start' });
  el.focus({ preventScroll: true });
  return true;
}

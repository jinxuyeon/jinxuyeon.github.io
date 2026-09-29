/** 어디서든 토스트를 띄운다. <Toaster />가 이 이벤트를 듣는다. */
export const TOAST_EVENT = 'site:toast';

export function showToast(message: string): void {
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }));
}

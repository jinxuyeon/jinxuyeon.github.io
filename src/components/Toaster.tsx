'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { TOAST_EVENT } from '@/lib/toast';
import type { ToastState } from './ToastView';
import styles from './Toaster.module.css';

const loadView = () => import('./ToastView');
const ToastView = dynamic(loadView, { ssr: false });

/** requestIdleCallback이 없는 브라우저(Safari)에서는 setTimeout으로 대신하고, 치울 때도 같은 쪽으로 치운다. */
function whenIdle(cb: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(cb);
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(cb, 1500);
  return () => window.clearTimeout(handle);
}

/**
 * 「복사했어요」 같은 짧은 알림. role="status" 영역은 처음부터 DOM에 있고
 * 안의 글자가 바뀌면 스크린리더가 읽는다. 같은 문구가 연달아 와도 다시 읽도록 알림마다 새 노드로 바꾼다.
 * 보이는 말풍선(ToastView, Motion)은 첫 알림이 오기 전에는 마운트하지 않는다.
 * 코드만 유휴 시간에 미리 받아 둔다.
 */
export function Toaster() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      setArmed(true);
      setToast({ id: Date.now(), message });
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2600);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    const cancelPreload = whenIdle(() => void loadView());

    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      clearTimeout(timer);
      cancelPreload();
    };
  }, []);

  return (
    <div role="status" className={styles.region}>
      <span key={toast?.id ?? 'empty'} className="sr-only">
        {toast?.message ?? ''}
      </span>
      {armed ? <ToastView toast={toast} /> : null}
    </div>
  );
}

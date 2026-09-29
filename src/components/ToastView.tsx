'use client';

import { AnimatePresence, LazyMotion, MotionConfig, m } from 'motion/react';
import styles from './Toaster.module.css';

const loadFeatures = () => import('./motion-features').then((mod) => mod.default);

export interface ToastState {
  id: number;
  message: string;
}

/**
 * 토스트의 보이는 부분. 사라질 때 애니메이션이 필요해 Motion을 쓴다.
 * 이 파일은 첫 로드 번들에 들어가지 않는다(Toaster가 유휴 시간에 불러온다).
 * 서버 렌더에는 없으므로 initial의 opacity 0이 HTML에 박히지 않는다.
 */
export default function ToastView({ toast }: { toast: ToastState | null }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <AnimatePresence>
          {toast ? (
            <m.div
              key={toast.id}
              className={styles.toast}
              aria-hidden="true"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className={styles.dot} />
              {toast.message}
            </m.div>
          ) : null}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
}

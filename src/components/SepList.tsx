import type { ReactNode } from 'react';
import styles from './SepList.module.css';

/**
 * 「기획 · Unity 클라이언트 · 인게임 GUI」처럼 가운뎃점으로 잇는 짧은 목록.
 * 구분점은 항목 앞에 붙이고 목록을 점 폭만큼 왼쪽으로 밀어 잘라 낸다.
 * 줄이 바뀌어도 새 줄이 점으로 시작하거나 줄 끝에 점이 매달리지 않는다. 점은 보조기기에 읽히지 않는다.
 */
export function SepList({ items, className }: { items: ReactNode[]; className?: string }) {
  return (
    <ul role="list" className={className ? `${styles.list} ${className}` : styles.list}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/** 「a · b · c」 문자열을 항목으로 나눈다. */
export const splitDots = (s: string) => s.split(' · ');

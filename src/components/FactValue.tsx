import type { Fact } from '@/content/types';
import styles from './FactValue.module.css';

/** 숫자 칩의 값. 홈 카드와 상세 머리가 같이 쓴다. 최종값만 HTML에 둔다. */
export function FactValue({ fact }: { fact: Fact }) {
  return (
    <>
      {fact.prefix ? <span className={styles.prefix}>{fact.prefix}</span> : null}
      {fact.value}
      {fact.unit ? (
        <span className={styles.unit} data-hi={fact.hi || undefined}>
          {fact.unit}
        </span>
      ) : null}
    </>
  );
}

import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

/**
 * 섹션 머리: 헤어라인 + 한글 제목. 제목은 스크롤 연동 줄 마스크로 올라온다.
 * size="sm"은 표·목록·카드가 주인공인 섹션(프로젝트, 기술, 수상·특허)용.
 */
export function SectionHeader({
  id,
  title,
  size = 'lg',
  aside,
}: {
  id: string;
  title: string;
  size?: 'lg' | 'sm';
  /** 제목 옆에 붙는 짧은 요약(예: 특허·수상 건수) */
  aside?: ReactNode;
}) {
  return (
    <div className={styles.head} data-size={size}>
      <div className={styles.row}>
        <h2 id={id} className={`${styles.title} reveal-title`}>
          <span className="reveal-inner">{title}</span>
        </h2>
        {aside ? <p className={styles.aside}>{aside}</p> : null}
      </div>
    </div>
  );
}

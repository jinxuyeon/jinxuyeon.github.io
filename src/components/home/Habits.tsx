import Link from 'next/link';
import { habits } from '@/content/site';
import { Rich } from '../Rich';
import { SectionHeader } from '../SectionHeader';
import styles from './Habits.module.css';

export function Habits() {
  return (
    <section id="habits" className={`container ${styles.habits}`} aria-labelledby="habits-title" tabIndex={-1}>
      <SectionHeader id="habits-title" title="반복해서 하는 것" />
      <ol role="list" className={styles.list}>
        {habits.map((h) => (
          <li key={h.no} className={styles.row}>
            <span className={styles.no} aria-hidden="true">
              {h.no}
            </span>
            <div>
              <p className={styles.label}>{h.label}</p>
              <h3 className={styles.title}>{h.title}</h3>
            </div>
            <div className={styles.text}>
              <p>
                <Rich text={h.body} />
              </p>
              <Link href={`/projects/${h.proof.slug}/#${h.proof.anchor}`} className={styles.proof}>
                <span className="u-link">
                  {h.proof.title}에서 보기
                  {/* 같은 이름의 링크가 여럿이라 링크 목록으로 훑을 때 구별되게 */}
                  <span className="sr-only"> — {h.label}</span>
                </span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

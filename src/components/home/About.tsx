import { career, lead } from '@/content/site';
import { Rich } from '../Rich';
import { SectionHeader } from '../SectionHeader';
import styles from './About.module.css';

export function About() {
  return (
    <section id="about" className={`container ${styles.about}`} aria-labelledby="about-title" tabIndex={-1}>
      <SectionHeader id="about-title" title="소개" />
      <div className={styles.grid}>
        <div className={styles.statement}>
          {lead.rest.map((s) => (
            <p key={s}>
              <Rich text={s} />
            </p>
          ))}
        </div>
        <ol role="list" className={styles.bento} aria-label="이력">
          {career.map((c, i) => (
            <li key={c.when} className={styles.cell} data-variant={i === 0 ? 'accent' : undefined}>
              <p className={styles.when}>
                <span className="mono">{c.when}</span>
                <span>{c.whenNote}</span>
              </p>
              <h3 className={styles.org}>{c.title}</h3>
              <p className={styles.body}>{c.body}</p>
              {'note' in c && c.note ? <p className={styles.note}>{c.note}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

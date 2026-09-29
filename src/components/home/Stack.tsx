import { skills } from '@/content/site';
import { SectionHeader } from '../SectionHeader';
import styles from './Stack.module.css';

export function Stack() {
  return (
    <section id="stack" className={styles.stack} aria-labelledby="stack-title" tabIndex={-1}>
      <div className="container">
        <SectionHeader id="stack-title" title="기술" size="sm" />
        <dl className={styles.list}>
          {skills.map((s, i) => (
            <div key={s.group} className={styles.row} data-main={i === 0 || undefined}>
              <dt className={styles.group}>{s.group}</dt>
              <dd className={styles.items}>
                <ul role="list">
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

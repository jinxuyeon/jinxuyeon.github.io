import { awards, language } from '@/content/site';
import { SectionHeader } from '../SectionHeader';
import styles from './Awards.module.css';

const patents = awards.filter((a) => a.kind === '특허 출원').length;
const prizes = awards.length - patents;

export function Awards() {
  return (
    <section id="awards" className={`container ${styles.awards}`} aria-labelledby="awards-title" tabIndex={-1}>
      <SectionHeader
        id="awards-title"
        title="수상 · 특허"
        size="sm"
        aside={`특허 출원 ${patents}건 · 수상 ${prizes}건(학회 우수논문상 포함)`}
      />
      <div className={styles.head} aria-hidden="true">
        <span>시기</span>
        <span>구분</span>
        <span>내용</span>
      </div>
      <ul role="list" className={styles.list}>
        {awards.map((a) => (
          <li key={a.body} className={styles.row} data-strong={a.strong || undefined}>
            <span className={`mono ${styles.when}`}>{a.when ?? ''}</span>
            <span className={styles.kind}>{a.kind}</span>
            <span className={styles.body}>{a.body}</span>
          </li>
        ))}
      </ul>
      <p className={styles.lang}>
        <span className={styles.langLabel}>{language.label}</span>
        {language.body}
      </p>
    </section>
  );
}

import { profile } from '@/content/site';
import { CopyEmailButton } from '../CopyEmailButton';
import styles from './Contact.module.css';

/**
 * 섹션 전체를 글자색(--text)으로 뒤집고 글자는 배경색(--bg)으로 쓴다.
 */
export function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-title" tabIndex={-1}>
      <div className={`container ${styles.inner}`}>
        <h2 id="contact-title" className={styles.title}>
          연락
        </h2>

        <div className={styles.rows}>
          <div className={styles.row}>
            <a href={`mailto:${profile.email}`} className={styles.value}>
              {profile.email}
            </a>
            <div className={styles.actions}>
              <a href={`mailto:${profile.email}`} className={styles.pill}>
                메일 쓰기
              </a>
              <CopyEmailButton className={styles.pill}>주소 복사</CopyEmailButton>
            </div>
          </div>
          <div className={styles.row}>
            <a href={profile.github} className={styles.value} target="_blank" rel="noopener noreferrer">
              {profile.githubLabel}
              <span className="sr-only"> (새 탭)</span>
              <span className={styles.ext} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

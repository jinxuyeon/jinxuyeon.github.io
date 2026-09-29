import { profile } from '@/content/site';
import { CopyEmailButton } from '../CopyEmailButton';
import styles from './Contact.module.css';

/**
 * 섹션 전체를 --contact-bg로 뒤집는다. 라이트는 큰 글자 기준 대비만 통과해서
 * 이 안의 글자는 전부 24px 이상으로만 쓴다. 다크는 한 톤 낮춘 색이다(대비는 /colophon/ 표 참조).
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

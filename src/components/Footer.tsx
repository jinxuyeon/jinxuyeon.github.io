import { profile, SITE_URL } from '@/content/site';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.name}>{profile.name}</p>
        <ul role="list" className={styles.links}>
          <li>
            <a href={`mailto:${profile.email}`} className="u-link">
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.github} className="u-link" target="_blank" rel="noopener noreferrer">
              GitHub<span className="sr-only"> (새 탭)</span>
            </a>
          </li>
        </ul>
        <p className={`mono ${styles.url}`}>{new URL(SITE_URL).host}</p>
      </div>
    </footer>
  );
}

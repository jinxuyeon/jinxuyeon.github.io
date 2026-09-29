import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './not-found.module.css';

// robots noindex는 Next가 404에 알아서 넣는다. 여기서 또 적으면 태그가 두 번 들어간다.
export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다',
};

export default function NotFound() {
  return (
    <section className={`container ${styles.wrap}`} aria-labelledby="nf-title">
      <p className={`serif ${styles.code}`} aria-hidden="true">
        404
      </p>
      <h1 id="nf-title" className={styles.title}>
        이 주소에는 페이지가 없습니다
      </h1>
      <p className={styles.body}>주소가 바뀌었거나 잘못 입력됐을 수 있습니다.</p>
      <p className={styles.actions}>
        <Link href="/" className="btn btn-primary">
          홈으로 가기 <span className="arrow" aria-hidden="true">→</span>
        </Link>
        <Link href="/#work" className="btn btn-ghost">
          프로젝트 보기
        </Link>
      </p>
    </section>
  );
}

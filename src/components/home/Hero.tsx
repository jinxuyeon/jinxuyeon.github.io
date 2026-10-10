import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { lead, profile } from '@/content/site';
import { Rich } from '../Rich';
import styles from './Hero.module.css';

const order = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * 첫 화면. 헤드라인의 줄 마스크 리빌은 CSS 애니메이션이라 첫 페인트와 함께 시작하고
 * JS 수화와 상관없이 돈다. 마스크는 구절마다 걸어서, 좁은 화면에서 한 줄이 둘로 접혀도
 * 보이는 줄마다 따로 올라온다. 글자는 처음부터 절반 넘게 보이는 위치에서 출발한다.
 */
export function Hero() {
  const [[a, b], [c, d]] = lead.headline;
  const seg = (i: number, children: ReactNode) => (
    <span className={styles.seg}>
      <span className={styles.segInner} style={order(i)}>
        {children}
      </span>
    </span>
  );
  return (
    <section className={styles.hero} aria-labelledby="hero-name">
      <div className={`container ${styles.grid}`}>
        <div className={styles.id}>
          <h1 id="hero-name" className={styles.name}>
            {profile.name}
          </h1>
          <p className={styles.role}>{profile.roleLine}</p>
        </div>

        <p className={styles.headline}>
          <span className={styles.line}>
            {seg(0, a)}{' '}
            {seg(
              1,
              <>
                {b}{' '}
                <span className={styles.pill} aria-hidden="true">
                  <span className={styles.pillGlyph}>&gt;_</span>
                </span>
              </>,
            )}
          </span>
          <span className={styles.line}>
            {seg(2, c)}{' '}
            {seg(
              3,
              <>
                {d}
                <span className={styles.caret} aria-hidden="true">
                  _
                </span>
              </>,
            )}
          </span>
        </p>

        <div className={styles.foot}>
          <p className={styles.lead}>
            <Rich text={lead.first} />
          </p>
          <div className={styles.ctas}>
            <a href="#work" className="btn btn-primary">
              프로젝트 보기 <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="btn btn-ghost">
              연락하기
            </a>
          </div>

          {/* 핵심 숫자 네 개. 값은 사례 본문과 같은 근거이고, 각 항목이 그 사례로 이어진다.
              선과 위 여백은 감싸는 div에 둔다. ul에 주면 전역의 ul[role='list'] { padding: 0 } 초기화가 이긴다. */}
          <div className={styles.proof}>
            <ul role="list" className={styles.proofList} aria-label="핵심 숫자">
              {lead.proof.map((f) => (
                <li key={f.label}>
                  <Link href={f.href} className={styles.proofLink}>
                    <span className={styles.proofValue}>
                      {f.value}
                      {'unit' in f && f.unit ? <span className={styles.proofUnit}>{f.unit}</span> : null}
                    </span>
                    <span className={styles.proofLabel}>{f.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { featuredProjects, otherProjects } from '@/content/projects';
import { ProjectCard } from '../ProjectCard';
import { Rich } from '../Rich';
import { SectionHeader } from '../SectionHeader';
import { SepList, splitDots } from '../SepList';
import styles from './Work.module.css';

/** 앞의 세 장은 전폭, 나머지는 반폭 두 장으로 리듬을 나눈다 */
const WIDE_CARDS = 3;

export function Work() {
  return (
    <section id="work" className={`container ${styles.work}`} aria-labelledby="work-title" tabIndex={-1}>
      {/* 첫 카드가 첫 화면 끝에 걸리게 제목은 작게 둔다. 카드가 이 섹션의 주인공이다. */}
      <SectionHeader id="work-title" title="프로젝트" size="sm" />

      <div className={styles.cards}>
        {featuredProjects.map((p, i) => (
          <ProjectCard
            key={p.slug}
            project={p}
            index={i}
            total={featuredProjects.length}
            size={i < WIDE_CARDS ? 'lg' : 'md'}
          />
        ))}
      </div>

      <div className={styles.others}>
        <h3 className={styles.othersTitle}>
          그 외 프로젝트
          <span className={`mono ${styles.count}`} aria-hidden="true">
            {String(otherProjects.length).padStart(2, '0')}
          </span>
        </h3>
        <ul role="list" className={styles.rows}>
          {otherProjects.map((p) => (
            <li key={p.title} className={styles.row}>
              <div>
                <h4 className={styles.rowTitle}>
                  {p.slug ? (
                    <Link href={`/projects/${p.slug}/`} className={styles.rowLink}>
                      {p.title}
                      <span className={styles.rowArrow} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  ) : (
                    p.title
                  )}
                </h4>
                {p.period ? <p className={`mono ${styles.period}`}>{p.period}</p> : null}
              </div>
              <div className={styles.rowBody}>
                <p className={styles.rowSummary}>{p.summary}</p>
                {p.detail ? (
                  <p className={styles.rowDetail}>
                    <Rich text={p.detail} />
                  </p>
                ) : null}
              </div>
              <SepList items={splitDots(p.role)} className={styles.rowRole} />
              <ul role="list" className={styles.rowStack} aria-label="기술">
                {p.stack.map((s) => (
                  <li key={s} className="mono">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

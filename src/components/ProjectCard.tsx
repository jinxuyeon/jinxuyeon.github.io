import Link from 'next/link';
import { ViewTransition } from 'react';
import type { Project } from '@/content/types';
import { FactValue } from './FactValue';
import { Rich } from './Rich';
import styles from './ProjectCard.module.css';

export function ProjectCard({
  project,
  index,
  total,
  size = 'lg',
}: {
  project: Project;
  index: number;
  total: number;
  size?: 'lg' | 'md';
}) {
  const thumb = project.thumb !== undefined ? project.shots?.[project.thumb] : undefined;
  const facts = project.facts.filter((f) => f.onCard !== false);
  const titleId = `card-${project.slug}`;
  const no = (n: number) => String(n).padStart(2, '0');
  // 옆 칸을 채울 것이 썸네일·비교표·숫자 여럿일 때만 두 칸으로 나눈다. 아니면 한 칸으로 쌓아 오른쪽이 비지 않게.
  const split = Boolean(thumb) || Boolean(project.compare) || facts.length >= 2;

  return (
    <article
      className={styles.card}
      aria-labelledby={titleId}
      data-has-thumb={Boolean(thumb)}
      data-layout={split ? 'split' : 'stack'}
      data-size={size}
    >
      <div className={styles.meta}>
        <span className={`mono ${styles.no}`} aria-hidden="true">
          {no(index + 1)} / {no(total)}
        </span>
        <span className={styles.kind}>{project.kind}</span>
        {project.period ? <span className={`mono ${styles.period}`}>{project.period}</span> : null}
        <span className={styles.more} aria-hidden="true">
          자세히 보기 <span className={styles.arrow}>→</span>
        </span>
      </div>

      <div className={styles.body}>
        <div>
          <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
            <h3 className={styles.title}>
              {/* 카드를 덮는 링크. 보이는 「자세히 보기」와 같은 말로 부를 수 있게 이름에 붙인다(카드 이름은 제목만). */}
              <Link href={`/projects/${project.slug}/`} className={styles.link}>
                <span id={titleId}>{project.title}</span>
                <span className="sr-only"> 자세히 보기</span>
              </Link>
            </h3>
          </ViewTransition>
          <p className={styles.summary}>{project.summary}</p>

          {project.card ? (
            <dl className={styles.lines}>
              <div>
                <dt>맡은 것</dt>
                <dd>
                  <Rich text={project.card.did} />
                </dd>
              </div>
              <div data-line="hard">
                <dt>{project.card.hardLabel ?? '어려웠던 것'}</dt>
                <dd>
                  <Rich text={project.card.hard} />
                </dd>
              </div>
              <div data-line="result">
                <dt>결과</dt>
                <dd>
                  <Rich text={project.card.result} />
                </dd>
              </div>
            </dl>
          ) : null}
        </div>

        {thumb || facts.length || project.compare ? (
          <div className={styles.side}>
            {thumb ? (
              <div className={styles.thumb}>
                <img
                  src={`/img/${thumb.file.replace(/\.\w+$/, '')}${project.thumbCrop ? '-thumb' : '-800'}.webp`}
                  alt={thumb.alt}
                  width={project.thumbCrop?.width ?? 800}
                  height={project.thumbCrop?.height ?? Math.round((thumb.height / thumb.width) * 800)}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ) : null}

            {facts.length ? (
              <ul
                role="list"
                className={styles.facts}
                aria-label="주요 숫자"
                data-single={facts.length === 1 || undefined}
              >
                {facts.map((f) => (
                  <li
                    key={f.label}
                    className={styles.fact}
                    data-hi={f.hi || undefined}
                    data-wide={f.prefix ? true : undefined}
                  >
                    <span className={styles.value}>
                      <FactValue fact={f} />
                    </span>
                    <span className={styles.label}>{f.label}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {project.compare ? (
              <dl className={styles.compare}>
                {project.compare.map((c) => (
                  <div key={c.label}>
                    <dt>{c.label}</dt>
                    <dd>
                      <Rich text={c.text} />
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        ) : null}
      </div>

      <ul role="list" className={styles.tags} aria-label="기술">
        {project.stack.map((s) => (
          <li key={s} className="mono">
            {s}
          </li>
        ))}
      </ul>
      <span className={styles.moreBottom} aria-hidden="true">
        자세히 보기 <span className={styles.arrow}>→</span>
      </span>
    </article>
  );
}

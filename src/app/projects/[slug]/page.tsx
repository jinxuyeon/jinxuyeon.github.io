import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { FactValue } from '@/components/FactValue';
import { Rich } from '@/components/Rich';
import { SepList, splitDots } from '@/components/SepList';
import { featuredProjects, getProject, getSiblings, projects } from '@/content/projects';
import type { Beat, Block, Section, Shot } from '@/content/types';
import { pageMeta } from '@/lib/meta';
import { tidy } from '@/lib/text';
import styles from './page.module.css';

type Params = { slug: string };

/** 문제·판단·결과 뒤에 붙는 부록 묶음의 이름 */
const MORE_TITLE = '그 밖에 한 일';

// 목록에 없는 slug는 빌드하지 않는다(→ 404.html).
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMeta({
    path: `/projects/${p.slug}/`,
    title: p.title,
    description: p.summary,
    og: p.slug,
    ogAlt: `${p.title} — ${p.summary}`,
  });
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return blocks.map((b, i) =>
    b.type === 'p' ? (
      <p key={i}>
        <Rich text={b.text} />
      </p>
    ) : (
      <ul key={i} className={styles.bullets}>
        {b.items.map((item) => (
          <li key={item}>
            <Rich text={item} />
          </li>
        ))}
      </ul>
    ),
  );
}

function Screens({ shots, note, wide }: { shots: Shot[]; note?: string; wide: boolean }) {
  return (
    <section className={`container ${styles.screens}`} aria-labelledby="screens-title">
      <div className={styles.screensHead}>
        <h2 id="screens-title" className={`${styles.blockTitle} reveal-title`}>
          <span className="reveal-inner">화면</span>
        </h2>
        {note ? <p className={styles.screensNote}>{note}</p> : null}
      </div>
      <div className={styles.shots} data-wide={wide || undefined}>
        {shots.map((s) => {
          const base = s.file.replace(/\.\w+$/, '');
          return (
            <figure key={s.file} className={styles.shot}>
              <a href={`/img/${s.file}`} className={`${styles.frame} reveal-media`} target="_blank" rel="noopener">
                <img
                  src={`/img/${base}.webp`}
                  srcSet={`/img/${base}-800.webp 800w, /img/${base}.webp ${s.width}w`}
                  sizes={wide ? '(min-width: 900px) 33vw, 100vw' : '(min-width: 900px) 50vw, 100vw'}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  loading="lazy"
                  decoding="async"
                />
                <span className="sr-only"> — 원본 이미지 새 탭에서 열기</span>
              </a>
              <figcaption>
                <strong>{s.title}</strong>
                <span>
                  <Rich text={s.caption} />
                </span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getSiblings(slug);
  const featuredIndex = featuredProjects.findIndex((p) => p.slug === slug);
  const beats = project.sections.filter((s): s is Beat => s.kind === 'beat');
  const story = beats.filter((b) => b.group === 'story');
  const more = beats.filter((b) => b.group === 'more');
  const firstMore = project.sections.findIndex((s) => s.kind === 'beat' && s.group === 'more');

  const beatNo = (b: Beat) => String(beats.indexOf(b) + 1).padStart(2, '0');

  const renderSection = (s: Section, i: number) => {
    if (s.kind === 'pull') {
      return (
        <blockquote key={`pull-${i}`} className={styles.pull}>
          <p>
            <Rich text={s.text} />
          </p>
        </blockquote>
      );
    }
    const Heading = s.group === 'more' ? 'h3' : 'h2';
    return (
      <section key={s.id} id={s.id} className={styles.beat} aria-labelledby={`${s.id}-title`}>
        <p className={`mono ${styles.beatNo}`} aria-hidden="true">
          {beatNo(s)}
        </p>
        <Heading id={`${s.id}-title`} className={styles.beatLabel}>
          {s.label}
        </Heading>
        <div className={styles.beatBody}>
          <Blocks blocks={s.blocks} />
        </div>
      </section>
    );
  };

  return (
    <article className={styles.page}>
      <header className={`container ${styles.head}`}>
        <div className={styles.topbar}>
          <Link href="/#work" className={styles.back}>
            <span aria-hidden="true">←</span> <span className="u-link">프로젝트 목록</span>
          </Link>
          {featuredIndex >= 0 ? (
            <span className="mono" aria-hidden="true">
              {String(featuredIndex + 1).padStart(2, '0')} / {String(featuredProjects.length).padStart(2, '0')}
            </span>
          ) : null}
        </div>

        <div className={styles.lede}>
          <p className={styles.kind}>{project.kind}</p>
          <ViewTransition name={`project-title-${project.slug}`} share="morph" default="none">
            <h1 className={styles.title}>{project.title}</h1>
          </ViewTransition>
          <p className={styles.intro}>
            <Rich text={project.intro} />
          </p>
        </div>

        <div className={styles.side}>
          <dl className={styles.meta}>
            <div>
              <dt>맡은 것</dt>
              <dd>
                <SepList items={splitDots(project.role).map(tidy)} />
              </dd>
            </div>
            {project.team ? (
              <div>
                <dt>팀</dt>
                <dd>{project.team}</dd>
              </div>
            ) : null}
            {project.period ? (
              <div>
                <dt>기간</dt>
                <dd className="mono">{project.period}</dd>
              </div>
            ) : null}
            {project.scale ? (
              <div>
                <dt>규모</dt>
                <dd>
                  <SepList
                    items={project.scale.map((s) => (
                      <>
                        {s.label} <span className={styles.scaleValue}>{s.value}</span>
                      </>
                    ))}
                  />
                </dd>
              </div>
            ) : null}
            <div className={styles.metaStack}>
              <dt>기술</dt>
              <dd>
                <ul role="list" className={styles.tags}>
                  {project.stack.map((t) => (
                    <li key={t} className="mono">
                      {t}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>

          {project.facts.length ? (
            <ul role="list" className={styles.facts} aria-label="주요 숫자">
              {project.facts.map((f) => (
                <li key={f.label} data-hi={f.hi || undefined}>
                  <span className={styles.factValue}>
                    <FactValue fact={f} />
                  </span>
                  <span className={styles.factLabel}>{f.label}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {project.compare ? (
          <dl className={styles.compare}>
            {project.compare.map((c, i) => (
              <div key={c.label}>
                <dt>{c.label}</dt>
                <dd>
                  <Rich text={c.text} />
                </dd>
                {i < (project.compare?.length ?? 0) - 1 ? (
                  <span className={styles.compareArrow} aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </dl>
        ) : null}
      </header>

      {beats.length ? (
        <div className={`container ${styles.split}`}>
          <aside className={styles.aside}>
            <nav className={styles.toc} aria-label="이 페이지 목차">
              <p className={styles.tocHead} aria-hidden="true">
                목차
              </p>
              <ol role="list">
                {story.map((b) => (
                  <li key={b.id}>
                    <a href={`#${b.id}`}>
                      <span className="mono" aria-hidden="true">
                        {beatNo(b)}
                      </span>
                      <span className={styles.tocLabel}>{b.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
              {more.length ? (
                <>
                  <p className={styles.tocGroup}>{MORE_TITLE}</p>
                  <ol role="list">
                    {more.map((b) => (
                      <li key={b.id}>
                        <a href={`#${b.id}`}>
                          <span className="mono" aria-hidden="true">
                            {beatNo(b)}
                          </span>
                          <span className={styles.tocLabel}>{b.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </>
              ) : null}
            </nav>
          </aside>

          <div className={styles.flow}>
            {project.sections.map((s, i) => (
              <div key={s.kind === 'beat' ? s.id : `p-${i}`} className={styles.flowItem}>
                {i === firstMore ? (
                  <h2 className={styles.moreTitle}>{MORE_TITLE}</h2>
                ) : null}
                {renderSection(s, i)}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {project.shots?.length ? (
        <Screens shots={project.shots} note={project.shotNote} wide={project.shots.length === 3} />
      ) : null}

      <nav className={`container ${styles.pager}`} aria-label="다른 프로젝트">
        {prev || next ? (
          <div className={styles.pagerPair}>
            {prev ? (
              <Link href={`/projects/${prev.slug}/`} className={styles.pagerLink} data-dir="prev">
                <span className={styles.pagerDir}>
                  <span aria-hidden="true">←</span> 이전 프로젝트
                </span>
                <span className={styles.pagerTitle}>{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/projects/${next.slug}/`} className={styles.pagerLink} data-dir="next">
                <span className={styles.pagerDir}>
                  다음 프로젝트 <span aria-hidden="true">→</span>
                </span>
                <span className={styles.pagerTitle}>{next.title}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        ) : null}
        <Link href="/" className={styles.pagerHome}>
          <span className="u-link">홈으로</span>
        </Link>
      </nav>
    </article>
  );
}

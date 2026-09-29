'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from 'react';
import { profile, sections } from '@/content/site';
import { copyText } from '@/lib/clipboard';
import { goSection } from '@/lib/section';
import { toggleTheme } from '@/lib/theme';
import { showToast } from '@/lib/toast';
import styles from './CommandPalette.module.css';

export interface PaletteProject {
  slug: string;
  title: string;
}

interface Command {
  id: string;
  label: string;
  /** 보조기기에 읽힐 이름. 보이는 label을 포함해야 한다(없으면 label). */
  name?: string;
  group: '프로젝트' | '이동' | '기능';
  keywords: string;
  run: () => void;
}

const normalize = (s: string) => s.toLowerCase().replace(/[\s·()_\-/]+/g, '');

// 애플 기기면 ⌘, 아니면 Ctrl. 서버 렌더에서는 ⌘로 둔다.
const noop = () => () => {};
const isApple = () => /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

const optionDomId = (baseId: string, cmd: Command | undefined, i: number) => `${baseId}-opt-${cmd?.id ?? i}`;

/**
 * ⌘K 커맨드 팔레트. WAI-ARIA APG의 콤보박스(리스트박스 팝업) 패턴:
 * 포커스는 입력칸에 머물고, aria-activedescendant가 고른 항목을 가리킨다.
 * 모달 <dialog>라 포커스 가둠과 Esc 닫기는 브라우저가 한다.
 */
export function CommandPalette({ projects }: { projects: PaletteProject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const baseId = useId();
  const listId = `${baseId}-list`;
  const apple = useSyncExternalStore(noop, isApple, () => true);

  const toSection = useCallback(
    (id: string) => {
      if (pathname !== '/' || !goSection(id)) router.push(`/#${id}`);
    },
    [pathname, router],
  );

  // 목록은 그룹 순서대로: 프로젝트 → 이동 → 기능
  const commands = useMemo<Command[]>(
    () => [
      ...projects.map((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        group: '프로젝트' as const,
        keywords: `${p.slug} 프로젝트 project`,
        run: () => router.push(`/projects/${p.slug}/`),
      })),
      {
        id: 'home',
        label: '홈으로',
        group: '이동',
        keywords: 'home 처음 메인',
        run: () => router.push('/'),
      },
      ...sections.map((s) => ({
        id: `section-${s.id}`,
        label: s.item,
        name: s.jump,
        group: '이동' as const,
        keywords: `${s.label} ${s.en} ${s.id}`,
        run: () => toSection(s.id),
      })),
      {
        id: 'colophon',
        label: '이 사이트를 만든 방식',
        group: '이동',
        keywords: 'colophon 사이트 만든 방식 이 사이트는 about site',
        run: () => router.push('/colophon/'),
      },
      {
        id: 'copy-email',
        label: '이메일 주소 복사',
        group: '기능',
        keywords: `email mail 메일 연락 ${profile.email}`,
        run: () => {
          void copyText(profile.email).then((ok) =>
            showToast(ok ? '복사했어요' : `복사하지 못했어요. ${profile.email}`),
          );
        },
      },
      {
        id: 'github',
        label: 'GitHub 열기',
        group: '기능',
        keywords: 'github 깃허브 code 코드',
        run: () => window.open(profile.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'theme',
        label: '테마 전환',
        group: '기능',
        keywords: 'theme dark light 다크 라이트 어두운 밝은',
        run: () => toggleTheme(),
      },
    ],
    [projects, toSection, router],
  );

  const results = useMemo(() => {
    const q = normalize(query);
    if (!q) return commands;
    return commands.filter((c) => normalize(`${c.label} ${c.keywords}`).includes(q));
  }, [commands, query]);

  const optionId = (i: number) => optionDomId(baseId, results[i], i);

  const show = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery('');
    setActive(0);
    d.showModal();
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // ⌘K / Ctrl+K 로 열고 닫는다.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialogRef.current?.open) hide();
        else show();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [show, hide]);

  // 고른 항목이 목록 밖으로 나가면 따라 스크롤한다.
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionDomId(baseId, results[active], active))?.scrollIntoView({ block: 'nearest' });
  }, [active, results, open, baseId]);

  const run = (cmd: Command | undefined) => {
    if (!cmd) return;
    hide();
    cmd.run();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const n = results.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (n) setActive((a) => (a + 1) % n);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (n) setActive((a) => (a - 1 + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    } else if (e.key === 'Tab') {
      // 대화상자에서 조작할 곳은 입력칸 하나다. Tab으로 빠져나가면 ↑↓가 먹지 않으므로 제자리에 둔다(닫기는 Esc).
      e.preventDefault();
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        data-needs-js
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        onClick={show}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className={styles.triggerLabel}>프로젝트 찾기</span>
        <kbd className={`mono ${styles.kbd}`} aria-hidden="true">
          {apple ? '⌘K' : 'Ctrl K'}
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label="프로젝트 찾기"
        // 닫히면 브라우저가 열기 전 포커스 자리로 돌려준다(APG의 모달 대화상자 규칙).
        onClose={() => setOpen(false)}
        onClick={(e) => {
          // 바깥(backdrop)을 누르면 닫는다.
          if (e.target === e.currentTarget) hide();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.field}>
            <span className={`mono ${styles.prompt}`} aria-hidden="true">
              &gt;_
            </span>
            <input
              className={styles.input}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results.length ? optionId(active) : undefined}
              aria-label="프로젝트·섹션·기능 찾기"
              placeholder="프로젝트·섹션·기능 찾기"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
            />
            <kbd className={`mono ${styles.esc}`} aria-hidden="true">
              esc
            </kbd>
          </div>

          {/* 목록이 넘쳐 스크롤되면 Chrome이 목록을 Tab 대상으로 만든다. 거기서 ↑↓는 선택이 아니라 스크롤만 움직이므로 Tab 순서에서 뺀다.
              고르기는 입력칸의 aria-activedescendant로만 한다. */}
          <ul id={listId} role="listbox" aria-label="명령" className={styles.list} tabIndex={-1}>
            {results.map((cmd, i) => (
              <li
                key={cmd.id}
                id={optionId(i)}
                role="option"
                aria-selected={i === active}
                aria-label={cmd.name}
                className={styles.option}
                onMouseMove={() => setActive(i)}
                onClick={() => run(cmd)}
              >
                <span>{cmd.label}</span>
                {/* 보이는 분류 표시. 옵션 이름에 붙어 「소개 이동」처럼 읽히지 않게 숨긴다. */}
                <span className={styles.optionGroup} aria-hidden="true">
                  {cmd.group}
                </span>
              </li>
            ))}
          </ul>
          <p role="status" className={results.length ? 'sr-only' : styles.empty}>
            {results.length
              ? `${results.length}개 항목`
              : `‘${query}’에 맞는 항목이 없습니다. 다른 말로 찾아 보세요.`}
          </p>

          <div className={styles.foot} aria-hidden="true">
            <span>↑↓ 고르기</span>
            <span>↵ 선택</span>
            <span>esc 닫기</span>
          </div>
        </div>
      </dialog>
    </>
  );
}

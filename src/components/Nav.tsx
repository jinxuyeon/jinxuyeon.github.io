import { sections } from '@/content/site';
import { CommandPalette, type PaletteProject } from './CommandPalette';
import { LogoMark } from './LogoMark';
import { MobileMenu } from './MobileMenu';
import { BrandLink, NavShell } from './NavClient';
import { ThemeToggle } from './ThemeToggle';
import styles from './Nav.module.css';

/** 상단 내비. 정적인 로고·링크는 서버에서 그리고, 스크롤 감시와 aria-current만 클라이언트(NavClient)에 둔다. */
export function Nav({ projects }: { projects: PaletteProject[] }) {
  return (
    <NavShell className={styles.nav} sentinelClassName={styles.sentinel}>
      <div className={`container ${styles.inner}`}>
        <BrandLink className={styles.brand}>
          <LogoMark size={28} />
          <span>진수연</span>
        </BrandLink>

        {/* 섹션 링크는 next/link가 아닌 일반 <a>다. 홈에서는 같은 문서 안 해시 이동이라 브라우저가
            대상 섹션(tabIndex=-1)으로 포커스를 옮기고, 다른 페이지에서는 홈을 새로 불러온다(홈의 HashFocus가 포커스를 옮긴다). */}
        <nav className={styles.links} aria-label="주요 메뉴">
          <ul role="list">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`/#${s.id}`} className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <CommandPalette projects={projects} />
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </NavShell>
  );
}

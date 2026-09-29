import { Fragment, type ReactNode } from 'react';
import type { RichText } from '@/content/types';
import { tidy } from '@/lib/text';

// **굵게**  ==강조==  `코드`  [글자](주소)
const TOKEN = /(\*\*[^*]+\*\*|==[^=]+==|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;
// 코드 바로 뒤에 붙은 한글(조사). 「`GET /me`가」에서 「가」만 다음 줄로 떨어지지 않게 코드와 묶는다.
const PARTICLE = /^[가-힣]+/;

function token(part: string, key: number): ReactNode {
  if (part.startsWith('**')) return <strong key={key}>{tidy(part.slice(2, -2))}</strong>;
  if (part.startsWith('==')) return <mark key={key}>{tidy(part.slice(2, -2))}</mark>;
  if (part.startsWith('`')) return <code key={key}>{part.slice(1, -1)}</code>;
  const m = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
  if (!m) return part;
  const [, label, href] = m;
  const external = /^https?:\/\//.test(href ?? '');
  return (
    <a
      key={key}
      href={href}
      className="prose-link"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {tidy(label ?? '')}
      {external ? <span className="sr-only"> (새 탭)</span> : null}
    </a>
  );
}

/** 데이터 파일의 인라인 표기를 React 노드로 바꾼다. 중첩은 쓰지 않는다. 글자는 tidy()로 줄바꿈 자리를 다듬는다. */
export function Rich({ text }: { text: RichText }): ReactNode {
  const parts = text.split(TOKEN);
  const nodes: ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] ?? '';
    if (i % 2 === 0) {
      if (part) nodes.push(<Fragment key={i}>{tidy(part)}</Fragment>);
      continue;
    }
    const next = parts[i + 1] ?? '';
    const particle = part.startsWith('`') ? PARTICLE.exec(next)?.[0] : undefined;
    if (particle) {
      nodes.push(
        <span key={i} className="nowrap">
          {token(part, i)}
          {particle}
        </span>,
      );
      parts[i + 1] = next.slice(particle.length);
    } else {
      nodes.push(token(part, i));
    }
  }
  return nodes;
}

// Pretendard 서브셋에 넣을 글자. 사이트의 글자는 전부 src/ 아래(데이터·컴포넌트 문구·CSS 생성 문자)에서 나온다.
// prebuild가 이 글자로 글꼴을 자르고, check-out이 빌드된 HTML의 글자가 이 안에 다 있는지 확인한다.
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

// 사용자가 팔레트에 치는 글자처럼 소스에 없는 영문·숫자·기호도 같은 글꼴로 보이게 인쇄 가능한 ASCII는 늘 넣는다.
const ASCII = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCharCode(0x20 + i)).join('');

export function collectChars(root) {
  const src = path.join(root, 'src');
  const files = readdirSync(src, { recursive: true })
    .map(String)
    .filter((f) => /\.(tsx?|css)$/.test(f));
  const set = new Set(ASCII);
  for (const f of files) for (const ch of readFileSync(path.join(src, f), 'utf8')) set.add(ch);
  // 줄바꿈·탭 같은 제어 문자는 글리프가 없다
  for (const ch of set) if (/[\u0000-\u001f]/.test(ch)) set.delete(ch);
  return [...set].sort().join('');
}

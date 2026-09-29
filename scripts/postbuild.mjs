// next build 뒤에 도는 정리 단계. 정적 내보내기는 404 페이지를 404.html 말고도
// 404/index.html과 _not-found/index.html로 한 벌씩 더 만든다. Pages에서는 이 둘이
// /404/와 /_not-found/ 주소로 200을 돌려주므로 지운다. 없는 주소는 404.html이 받는다.
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../out');
for (const dir of ['404', '_not-found']) {
  await rm(path.join(out, dir, 'index.html'), { force: true });
}
console.log('postbuild  out/404/index.html, out/_not-found/index.html 지움');

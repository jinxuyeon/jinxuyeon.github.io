import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // 정적 내보내기라 next/image의 최적화가 꺼진다. WebP 사본과 srcset은
      // scripts/prebuild.mjs가 만들고 <img>에 직접 width·height를 적는다.
      '@next/next/no-img-element': 'off',
      // import 사이에 다른 문장이 끼지 않게(eslint-config-next가 import 플러그인을 이미 등록한다)
      'import/first': 'error',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'public/**']),
]);

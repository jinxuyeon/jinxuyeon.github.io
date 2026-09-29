/**
 * 색 토큰의 한 벌. globals.css의 CSS 변수와 같은 값이어야 한다.
 * 「이 사이트를 만든 방식」 페이지의 대비 표, OG 이미지(scripts/og.mjs), 브라우저 테마 색이 이 값을 읽고,
 * scripts/check-out.mjs가 빌드된 CSS의 :root 값과 이 파일을 비교한다.
 * 키는 CSS 변수 이름을 camelCase로 쓴 것이다(lineStrong ↔ --line-strong).
 */
export const tokens = {
  light: {
    bg: '#faf8f5',
    surface: '#ffffff',
    ink: '#1a1716',
    muted: '#6b635e',
    line: '#e7e1d9',
    lineStrong: '#928983',
    brand: '#c4554d',
    accentInk: '#b0423a',
    accentHover: '#993a33',
    accentTint: '#f6e3df',
    onAccent: '#ffffff',
    markBg: '#f6e3df',
    invertBg: '#1a1716',
    invertInk: '#faf8f5',
    contactBg: '#c4554d',
    onContact: '#ffffff',
    shotFrame: '#0f1117',
  },
  dark: {
    bg: '#141211',
    surface: '#1c1918',
    ink: '#ede8e3',
    muted: '#a39b95',
    line: '#2e2a28',
    lineStrong: '#6e6661',
    brand: '#c4554d',
    accentInk: '#d86c64',
    accentHover: '#e58a83',
    accentTint: '#2a1a18',
    onAccent: '#141211',
    markBg: '#492623',
    invertBg: '#2a2320',
    invertInk: '#ede8e3',
    contactBg: '#a8463f',
    onContact: '#ffffff',
    shotFrame: '#0f1117',
  },
} as const;

export type TokenName = keyof typeof tokens.light;

/** lineStrong → --line-strong */
export const cssVar = (name: string) => `--${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

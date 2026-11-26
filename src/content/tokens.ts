/**
 * 색 토큰의 한 벌. globals.css의 CSS 변수와 같은 값이어야 한다.
 * OG 이미지(scripts/og.mjs)와 브라우저 테마 색이 이 값을 읽고,
 * scripts/check-out.mjs가 빌드된 CSS의 :root 값과 이 파일을 비교한다.
 * 키는 CSS 변수 이름을 camelCase로 쓴 것이다(noticeHover ↔ --notice-hover).
 */
export const tokens = {
  light: {
    bg: '#f5f5f7',
    text: '#2a2a2a',
    muted: '#999999',
    border: '#e0d9d0',
    surface: '#ffffff',
    tint: 'rgba(0, 0, 0, 0.03)',
    notice: '#ebebeb',
    noticeHover: '#e4e4e4',
  },
  dark: {
    bg: '#222222',
    text: '#f5f5f7',
    muted: '#8a8a8a',
    border: '#3a3a3a',
    surface: '#2a2a2a',
    tint: 'rgba(255, 255, 255, 0.05)',
    notice: '#2c2c2c',
    noticeHover: '#333333',
  },
} as const;

export type TokenName = keyof typeof tokens.light;

/** noticeHover → --notice-hover */
export const cssVar = (name: string) => `--${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

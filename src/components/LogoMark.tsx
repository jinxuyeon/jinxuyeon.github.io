/** `>_` 타일. 파비콘과 같은 모양. */
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <path
        d="M8.5 10.5 14 16l-5.5 5.5"
        fill="none"
        stroke="#fff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16.5 22h7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

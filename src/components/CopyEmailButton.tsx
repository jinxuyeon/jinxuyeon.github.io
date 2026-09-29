'use client';

import type { ReactNode } from 'react';
import { profile } from '@/content/site';
import { copyText } from '@/lib/clipboard';
import { showToast } from '@/lib/toast';

/** 이메일 주소를 클립보드에 복사한다. 메일 쓰기(mailto)는 별도 링크로 둔다. */
export function CopyEmailButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      data-needs-js
      onClick={async () => {
        const ok = await copyText(profile.email);
        showToast(ok ? '복사했어요' : `복사하지 못했어요. ${profile.email}`);
      }}
    >
      {children}
    </button>
  );
}

import type { Metadata } from 'next';
import { About } from '@/components/home/About';
import { Awards } from '@/components/home/Awards';
import { Contact } from '@/components/home/Contact';
import { Habits } from '@/components/home/Habits';
import { HashFocus } from '@/components/home/HashFocus';
import { Hero } from '@/components/home/Hero';
import { Stack } from '@/components/home/Stack';
import { Work } from '@/components/home/Work';
import { profile } from '@/content/site';
import { pageMeta } from '@/lib/meta';

export const metadata: Metadata = pageMeta({
  path: '/',
  description: profile.description,
  ogDescription: profile.ogDescription,
  og: 'home',
  ogAlt: '진수연 — 프론트엔드 개발자',
});

// 대표 사례를 첫 화면 바로 아래에 둔다. 「반복해서 하는 것」은 카드를 본 뒤에 읽혀야 링크가 산다.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Work />
      <About />
      <Habits />
      <Stack />
      <Awards />
      <Contact />
      <HashFocus />
    </>
  );
}

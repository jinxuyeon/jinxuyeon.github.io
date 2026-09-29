/**
 * 문장 안의 강조는 작은 인라인 표기로 적는다. <Rich>가 React 노드로 바꾼다.
 *   **굵게**   ==형광 강조==   `코드`   [링크](https://...)
 * 데이터 파일이 JSX에 묶이지 않아서 빌드 스크립트(OG 생성)도 같은 파일을 읽을 수 있다.
 */
export type RichText = string;

/** 숫자 칩. 최종값은 늘 HTML에 있다. */
export interface Fact {
  value: number | string;
  prefix?: string;
  unit?: string;
  label: string;
  /** 사례의 핵심 숫자. 한 프로젝트에 하나만 둔다. */
  hi?: boolean;
  /** false면 홈 카드에서는 빼고 상세 머리에만 둔다. 카드에는 카드 이야기와 이어지는 숫자만. */
  onCard?: false;
}

export type Block =
  | { type: 'p'; text: RichText }
  | { type: 'list'; items: RichText[] };

export interface Beat {
  kind: 'beat';
  /** 상세 페이지 앵커. 홈의 「반복해서 하는 것」이 이 id로 링크한다. */
  id: string;
  label: string;
  /** story = 문제·원인·판단·결과 흐름, more = 그 밖에 한 일. label은 목차에 그대로 나오므로 내용을 부르는 이름으로. */
  group: 'story' | 'more';
  blocks: Block[];
}

export interface Pull {
  kind: 'pull';
  text: RichText;
}

export type Section = Beat | Pull;

export interface Shot {
  /** public/img/ 안의 원본 파일 이름. WebP 사본은 같은 이름에 .webp */
  file: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  caption: RichText;
}

export interface Project {
  slug: string;
  title: string;
  kind: string;
  /** 홈의 대형 카드(Selected work)에 오르는지 */
  featured: boolean;
  /** 한 줄 소개. 카드·메타 설명·OG 이미지에 쓴다. */
  summary: string;
  /** 상세 페이지 첫 문단 */
  intro: RichText;
  role: string;
  team?: string;
  period?: string;
  stack: string[];
  facts: Fact[];
  /** 규모를 보여 주는 숫자. 이야기와 이어지는 숫자가 아니라서 크게 띄우지 않고 상세 메타에 한 줄로 둔다. */
  scale?: { label: string; value: number }[];
  /** 전후 비교(Lead-Crawler) */
  compare?: { label: string; text: RichText }[];
  /**
   * 카드의 세 줄. 원문 문장에서 발췌한다.
   * 원문에 어려움이 따로 없으면 hardLabel로 가운데 칸 이름을 바꾼다(예: 전제).
   * 좁은 화면(559px 이하)에서는 가운데 줄을 숨기므로 result는 앞 줄 없이도 뜻이 통하게 쓴다(「이 위험을」처럼 앞 줄을 가리키지 않는다).
   */
  card?: { did: RichText; hard: RichText; hardLabel?: string; result: RichText };
  sections: Section[];
  shots?: Shot[];
  shotNote?: string;
  /** 카드 썸네일로 쓸 shots의 인덱스 */
  thumb?: number;
  /**
   * 카드 썸네일로 잘라 쓸 원본 구역(원본 px). 틀이 작아 화면 전체를 줄이면 글자가 읽히지 않으므로 한 부분만 쓴다.
   * scripts/prebuild.mjs가 `<파일>-thumb.webp`로 굽는다. 없으면 원본 전체의 800px 사본을 쓴다.
   */
  thumbCrop?: { left: number; top: number; width: number; height: number };
}

/** 상세 페이지가 없는 작은 프로젝트(그 외 프로젝트 행) */
export interface MinorProject {
  title: string;
  summary: string;
  detail?: RichText;
  role: string;
  period?: string;
  stack: string[];
  /** 상세 페이지가 있으면 그 slug */
  slug?: string;
}

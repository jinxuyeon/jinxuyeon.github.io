// next build 전에 도는 준비 단계. 결과물은 전부 public/ 아래에 생기고 git에는 올리지 않는다.
//   1) Pretendard 가변 글꼴을 사이트에 쓰인 글자만 남겨 한 파일로 자르기(public/fonts/)
//   2) 화면 이미지의 WebP 사본(원본 폭 + 800px 폭)
//      카드 썸네일은 데이터(thumbCrop)에 적힌 구역만 잘라 `<파일>-thumb.webp`로
//   3) 배경 그레인용 256px 노이즈 PNG
//   4) 페이지별 OG 이미지(scripts/og.mjs)
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import subsetFont from 'subset-font';
import { projects } from '../src/content/projects.ts';
import { collectChars } from './font-chars.mjs';
import { buildOgImages } from './og.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

// dynamic-subset(unicode-range로 쪼갠 92개)은 페이지에 나온 글자가 걸친 조각을 12~20개씩 받게 했다.
// 사이트 글자는 몇백 자뿐이라 그 글자만 남긴 가변 글꼴 한 파일이 더 작고 요청도 하나다. 네트워크 없이 돈다.
// 굵기 축도 CSS가 쓰는 범위(400~900)로 좁힌다. globals.css의 @font-face font-weight와 같아야 한다.
const WEIGHT_RANGE = { min: 400, max: 900 };
async function subsetFonts() {
  const src = path.join(root, 'node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2');
  const dir = path.join(pub, 'fonts');
  await mkdir(dir, { recursive: true });
  const chars = collectChars(root);
  const out = await subsetFont(await readFile(src), chars, {
    targetFormat: 'woff2',
    variationAxes: { wght: WEIGHT_RANGE },
  });
  await writeFile(path.join(dir, 'pretendard-site.woff2'), out);
  console.log(
    `fonts   Pretendard Variable ${[...chars].length}자, 굵기 ${WEIGHT_RANGE.min}~${WEIGHT_RANGE.max} → ${(out.length / 1024).toFixed(0)}KB`,
  );
}

async function isFresh(out, src) {
  if (!existsSync(out)) return false;
  return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
}

async function convertImages() {
  const dir = path.join(pub, 'img');
  const files = (await readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f));
  for (const file of files) {
    const src = path.join(dir, file);
    const base = file.replace(/\.[^.]+$/, '');
    const full = path.join(dir, `${base}.webp`);
    const small = path.join(dir, `${base}-800.webp`);
    if ((await isFresh(full, src)) && (await isFresh(small, src))) continue;
    await sharp(src).webp({ quality: 82, effort: 5 }).toFile(full);
    await sharp(src).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(small);
  }
  console.log(`images  ${files.length} → WebP (full, 800w)`);
}

// 카드 썸네일. 한 장뿐이고 자를 구역이 바뀌어도 새로 구워지게 매번 만든다.
async function makeThumbs() {
  const dir = path.join(pub, 'img');
  let n = 0;
  for (const p of projects) {
    const shot = p.thumb !== undefined ? p.shots?.[p.thumb] : undefined;
    if (!shot || !p.thumbCrop) continue;
    const base = shot.file.replace(/\.[^.]+$/, '');
    await sharp(path.join(dir, shot.file))
      .extract(p.thumbCrop)
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(dir, `${base}-thumb.webp`));
    n++;
  }
  console.log(`thumbs  ${n}장 → WebP(잘라 낸 구역)`);
}

// 256px라 매번 구워도 몇 ms다. 있으면 건너뛰면 생성 방식을 바꿔도 예전 파일이 남는다.
async function makeGrain() {
  const out = path.join(pub, 'grain.png');
  const size = 256;
  const data = Buffer.alloc(size * size);
  // 빌드마다 같은 결과가 나오도록 씨앗을 고정한 xorshift
  let s = 0x2f6b1d3;
  for (let i = 0; i < data.length; i++) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    data[i] = (s >>> 0) & 0xff;
  }
  // 불투명도 0.035~0.05로 깔리는 회색 노이즈라 16단계 팔레트로도 차이가 보이지 않는다(96KB → 약 33KB).
  await sharp(data, { raw: { width: size, height: size, channels: 1 } })
    .toColourspace('b-w')
    .png({ compressionLevel: 9, palette: true, colours: 16 })
    .toFile(out);
  console.log('grain   256px noise');
}

await subsetFonts();
await convertImages();
await makeThumbs();
await makeGrain();
await buildOgImages(path.join(pub, 'og'));

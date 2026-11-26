// public/favicon.svg(J 글리프 하나)에서 나머지 아이콘을 만든다. prebuild가 부른다.
//
//   favicon.svg          손으로 둔 원본. 투명 바탕에 검은 J
//   favicon-dark.svg     같은 J를 흰색으로. 어두운 테마의 탭에서 쓴다
//                        (둘 중 무엇을 쓸지는 src/lib/theme.ts의 스크립트가 고른다. 이유도 거기 적었다)
//   favicon.ico          스크립트를 안 돌리는 수집기·옛 브라우저가 스스로 찾아가는 파일(16·32·48).
//                        어떤 바탕에 놓일지 알 수 없으므로 흰 판 위에 검은 J
//   apple-touch-icon.png iOS 홈 화면·즐겨찾기(180). 투명이면 검게 칠해지므로 흰 바탕
//   icon-192/512.png     안드로이드 홈 화면(manifest). 흰 바탕, J는 마스크 안전 구역 안
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BOX = 32; // favicon.svg의 viewBox 한 변
const J_HEIGHT = 30; // 원본에서 J가 차지하는 높이
// 판 위에 놓을 때는 외곽 상자 가운데보다 왼쪽이 눈에 맞다(세로획이 오른쪽에 몰려 있다). 글자 높이 대비 비율.
const OPTICAL_SHIFT = -0.055;

/** 판 위에 J를 올린 SVG. scale은 원본 대비 J 크기, radius는 판 모서리(0이면 꽉 찬 사각형). */
function onPlate(d, { scale, radius }) {
  const dx = OPTICAL_SHIFT * J_HEIGHT * scale;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}">` +
    `<rect width="${BOX}" height="${BOX}" rx="${radius}" fill="#fff"/>` +
    `<path transform="translate(${BOX / 2 + dx} ${BOX / 2}) scale(${scale}) translate(${-BOX / 2} ${-BOX / 2})" d="${d}" fill="#000"/>` +
    `</svg>`
  );
}

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: (72 * size) / BOX })
    .resize(size, size)
    .png()
    .toBuffer();

/** PNG를 그대로 담은 ICO. */
function ico(images) {
  const head = Buffer.alloc(6 + 16 * images.length);
  head.writeUInt16LE(1, 2); // 종류: 아이콘
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    head.writeUInt8(size, e); // 폭
    head.writeUInt8(size, e + 1); // 높이
    head.writeUInt16LE(1, e + 4); // 색 평면
    head.writeUInt16LE(32, e + 6); // 픽셀당 비트
    head.writeUInt32LE(data.length, e + 8);
    head.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((i) => i.data)]);
}

export async function buildFavicons(pub) {
  const src = await readFile(path.join(pub, 'favicon.svg'), 'utf8');
  const d = src.match(/<path d="([^"]+)"/)?.[1];
  if (!d) throw new Error('favicon.svg에서 J 경로를 못 찾음');

  await writeFile(
    path.join(pub, 'favicon-dark.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOX} ${BOX}"><path d="${d}" fill="#fff"/></svg>\n`,
  );

  const tile = onPlate(d, { scale: 0.72, radius: 7 });
  const sizes = [16, 32, 48];
  const tiles = await Promise.all(sizes.map((s) => png(tile, s)));
  await writeFile(path.join(pub, 'favicon.ico'), ico(sizes.map((size, i) => ({ size, data: tiles[i] }))));

  const full = onPlate(d, { scale: 0.6, radius: 0 });
  await writeFile(path.join(pub, 'apple-touch-icon.png'), await png(full, 180));
  await writeFile(path.join(pub, 'icon-192.png'), await png(full, 192));
  await writeFile(path.join(pub, 'icon-512.png'), await png(full, 512));

  console.log('favicon dark.svg, ico(16·32·48), apple-touch 180, icon 192·512');
}

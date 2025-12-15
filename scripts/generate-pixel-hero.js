const fs = require('fs');
const path = require('path');

const COLS = 28;   // дні
const ROWS = 7;    // тижні
const CELL = 16;   // розмір блоку
const GAP = 4;

const WIDTH = COLS * (CELL + GAP);
const HEIGHT = ROWS * (CELL + GAP) + 30;

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     width="${WIDTH}"
     height="${HEIGHT}">`;

// grid + “сад”
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * (CELL + GAP);
    const py = y * (CELL + GAP);
    const level = Math.floor(Math.random() * 6); // 0–5 комітів

    // земля
    svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" fill="#e5e7eb"/>`;

    // паросток
    if (level === 1 || level === 2) {
      svg += `<circle cx="${px + CELL/2}" cy="${py + CELL/2}" r="4" fill="#86efac">
                <animate attributeName="cy" values="${py+CELL/2};${py+CELL/2-2};${py+CELL/2}" dur="2s" repeatCount="indefinite"/>
              </circle>`;
    }

    // кущ
    if (level === 3 || level === 4) {
      svg += `<rect x="${px + 4}" y="${py + 4}" width="8" height="8" rx="2" fill="#22c55e">
                <animateTransform attributeName="transform" type="scale" values="1;1.05;1" dur="2s" repeatCount="indefinite" additive="sum" origin="${px+8} ${py+8}"/>
              </rect>`;
    }

    // дерево
    if (level >= 5) {
      svg += `<rect x="${px + 7}" y="${py + 6}" width="2" height="6" fill="#7c2d12"/>
              <circle cx="${px + CELL/2}" cy="${py + 6}" r="6" fill="#15803d">
                <animate attributeName="cy" values="${py+6};${py+4};${py+6}" dur="2s" repeatCount="indefinite"/>
              </circle>`;
    }
  }
}

// Pixel Hero рухається окремо
svg += `<g id="hero" transform="translate(0 ${ROWS*(CELL+GAP)+6})">
  <!-- тіло героя -->
  <rect x="4" y="0" width="12" height="12" fill="#111827"/>
  <rect x="6" y="12" width="8" height="10" fill="#22c55e"/>
  <rect x="4" y="22" width="4" height="6" fill="#111827"/>
  <rect x="12" y="22" width="4" height="6" fill="#111827"/>

  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 0"
    to="${WIDTH - 20} 0"
    dur="6s"
    repeatCount="indefinite"
  />
</g>`;

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ Commit Garden SVG for GitHub README generated');

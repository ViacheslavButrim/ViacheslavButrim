const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const WIDTH = COLS * (CELL + GAP);
const HEIGHT = ROWS * (CELL + GAP) + 50;

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     width="${WIDTH}"
     height="${HEIGHT}">`;

// skyline
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * (CELL + GAP);
    const py = HEIGHT - (y+1) * (CELL + GAP);
    const level = Math.floor(Math.random() * (ROWS+1)); // висота будинку

    for (let h = 0; h < level; h++) {
      svg += `<rect x="${px}" y="${py - h*(CELL+GAP)}" width="${CELL}" height="${CELL}" fill="#15803d"/>`;
    }
  }
}

// Pixel Hero знизу
svg += `<g id="hero" transform="translate(0 ${HEIGHT-20})">
  <rect x="4" y="0" width="12" height="12" fill="#111827"/>
  <rect x="6" y="12" width="8" height="10" fill="#22c55e"/>
  <rect x="4" y="22" width="4" height="6" fill="#111827"/>
  <rect x="12" y="22" width="4" height="6" fill="#111827"/>

  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 ${HEIGHT-20}"
    to="${WIDTH - 20} ${HEIGHT-20}"
    dur="6s"
    repeatCount="indefinite"
  />
</g>`;

// Літак над skyline
svg += `<g id="plane" transform="translate(0 10)">
  <polygon points="0,5 10,0 10,10" fill="#facc15"/>
  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 10"
    to="${WIDTH + 20} 10"
    dur="8s"
    repeatCount="indefinite"
  />
</g>`;

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ Pixel Hero Skyline with plane SVG generated');

const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const SIZE = 18;
const GAP = 4;

const width = COLS * (SIZE + GAP);
const height = ROWS * (SIZE + GAP);

// background grid
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height + 40}" viewBox="0 0 ${width} ${height + 40}">`;

// grid
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    svg += `<rect x="${x * (SIZE + GAP)}" y="${y * (SIZE + GAP)}"
      width="${SIZE}" height="${SIZE}" rx="4"
      fill="#e5e7eb"/>`;
  }
}

// hero (pixel style)
svg += `
<g id="hero" transform="translate(0 ${height + 10})">
  <rect x="0" y="0" width="8" height="8" fill="#111827"/>
  <rect x="8" y="0" width="8" height="8" fill="#111827"/>
  <rect x="0" y="8" width="8" height="8" fill="#111827"/>
  <rect x="8" y="8" width="8" height="8" fill="#22c55e"/>

  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 ${height + 10}"
    to="${width - 16} ${height + 10}"
    dur="6s"
    repeatCount="indefinite"
  />
</g>
`;

svg += `</svg>`;

// write file
const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ Pixel Hero animated SVG generated');

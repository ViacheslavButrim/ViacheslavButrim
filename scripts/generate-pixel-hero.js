const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const WIDTH = COLS * (CELL + GAP);
const HEIGHT = ROWS * (CELL + GAP) + 30;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     width="${WIDTH}"
     height="${HEIGHT}">

<style>
  .cell { fill: #e5e7eb; }
  .active { fill: #22c55e; }
</style>
`;

// grid
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const active = Math.random() > 0.7;
    svg += `
      <rect
        x="${x * (CELL + GAP)}"
        y="${y * (CELL + GAP)}"
        width="${CELL}"
        height="${CELL}"
        rx="4"
        class="${active ? 'active' : 'cell'}"
      />
    `;
  }
}

// hero INSIDE viewBox
svg += `
<g>
  <rect x="0" y="${ROWS * (CELL + GAP) + 6}" width="10" height="10" fill="#111827"/>
  <rect x="10" y="${ROWS * (CELL + GAP) + 6}" width="10" height="10" fill="#22c55e"/>

  <animateTransform
    attributeName="transform"
    type="translate"
    from="0 0"
    to="${WIDTH - 20} 0"
    dur="6s"
    repeatCount="indefinite"
  />
</g>
`;

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ SVG for GitHub README generated');

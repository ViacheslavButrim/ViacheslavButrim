const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const STEP = CELL + GAP;
const WIDTH = COLS * STEP;
const HEIGHT = ROWS * STEP;

// snake path
const pathPoints = [];
for (let y = 0; y < ROWS; y++) {
  const row = [...Array(COLS).keys()];
  if (y % 2) row.reverse();
  row.forEach(x => pathPoints.push([x, y]));
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  width="${WIDTH}"
  height="${HEIGHT}"
  style="background:#020617">`;

// grid
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * STEP;
    const py = y * STEP;
    const commits = Math.floor(Math.random() * 6);

    let color = '#1f2937';
    if (commits >= 1) color = '#374151';
    if (commits >= 3) color = '#4b5563';
    if (commits >= 5) color = '#6b7280';

    svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="3" fill="${color}" />`;
  }
}

// scan pulse
svg += `
<rect
  x="0" y="0"
  width="${CELL}" height="${CELL}"
  rx="3"
  fill="none"
  stroke="#9ca3af"
  stroke-width="2"
>
  <animateTransform
    attributeName="transform"
    type="translate"
    dur="${pathPoints.length * 0.1}s"
    repeatCount="indefinite"
    values="${pathPoints.map(p => `${p[0]*STEP} ${p[1]*STEP}`).join(';')}"
  />
</rect>
`;

svg += `</svg>`;

fs.mkdirSync(path.resolve('output'), { recursive: true });
fs.writeFileSync('output/pixel-fireworks.svg', svg);

console.log('✔ Activity Scan SVG generated');

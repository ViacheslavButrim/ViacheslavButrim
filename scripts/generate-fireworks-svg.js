const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const STEP_X = CELL + GAP;
const STEP_Y = CELL + GAP;

const WIDTH = COLS * STEP_X;
const HEIGHT = ROWS * STEP_Y;

// Генеруємо шлях змійки
const pathPoints = [];
for (let y = 0; y < ROWS; y++) {
  if (y % 2 === 0) {
    for (let x = 0; x < COLS; x++) pathPoints.push([x, y]);
  } else {
    for (let x = COLS - 1; x >= 0; x--) pathPoints.push([x, y]);
  }
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  width="${WIDTH}"
  height="${HEIGHT}">`;

// Квадрати (статичні)
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * STEP_X;
    const py = y * STEP_Y;
    const commits = Math.floor(Math.random() * 6);

    let color = '#e5e7eb';
    if (commits >= 1) color = '#86efac';
    if (commits >= 3) color = '#22c55e';
    if (commits >= 5) color = '#facc15';

    svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" fill="${color}" />`;
  }
}

// Snake pulse (ОДИН елемент)
svg += `
<circle
  cx="${CELL / 2}"
  cy="${CELL / 2}"
  r="7"
  fill="none"
  stroke="#111827"
  stroke-width="2"
  opacity="0.9"
>
  <animateTransform
    attributeName="transform"
    type="translate"
    dur="${pathPoints.length * 0.12}s"
    repeatCount="indefinite"
    values="
      ${pathPoints
        .map(
          ([x, y]) =>
            `${x * STEP_X} ${y * STEP_Y}`
        )
        .join(';')}
    "
  />
</circle>
`;

svg += `</svg>`;

const outDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'pixel-fireworks.svg'), svg);

console.log('✔ Snake-like pulse SVG generated');

const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;
const STEP = CELL + GAP;

const WIDTH = COLS * STEP;
const HEIGHT = ROWS * STEP;

// random helper
const rand = (max) => Math.floor(Math.random() * max);

// generate random drift path
const points = Array.from({ length: 80 }, () => [
  rand(COLS),
  rand(ROWS)
]);

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  width="${WIDTH}"
  height="${HEIGHT}"
  style="background:#020617">`;

// neon grid
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * STEP;
    const py = y * STEP;
    const commits = rand(6);

    let color = '#020617';
    if (commits >= 1) color = '#0f766e';
    if (commits >= 3) color = '#14b8a6';
    if (commits >= 5) color = '#5eead4';

    svg += `
<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="3"
  fill="${color}" />
`;
  }
}

// glow filter
svg += `
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
`;

// spaceship (simple geometric drone)
svg += `
<g filter="url(#glow)">
  <polygon
    points="0,-6 10,0 0,6 -4,0"
    fill="none"
    stroke="#e5e7eb"
    stroke-width="1.5"
  >
    <animateTransform
      attributeName="transform"
      type="translate"
      dur="22s"
      repeatCount="indefinite"
      calcMode="discrete"
      values="${points
        .map(p => `${p[0]*STEP + CELL/2} ${p[1]*STEP + CELL/2}`)
        .join(';')}"
    />
  </polygon>
</g>
`;

svg += `</svg>`;

fs.mkdirSync(path.resolve('output'), { recursive: true });
fs.writeFileSync('output/pixel-fireworks.svg', svg);

console.log('✔ Neon Space Drift generated');

const fs = require('fs');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;
const STEP = CELL + GAP;

const WIDTH = COLS * STEP;
const HEIGHT = ROWS * STEP;

// helpers
const rand = (n) => Math.floor(Math.random() * n);

// маршрут корабля (хаотичний)
const path = Array.from({ length: 60 }, () => [rand(COLS), rand(ROWS)]);

// які клітинки "будуть зʼїдені"
const eaten = path.map((p, i) => ({
  x: p[0],
  y: p[1],
  t: i * 0.35
}));

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  width="${WIDTH}"
  height="${HEIGHT}"
  style="background:#020617">`;

// ===== GRID =====
for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * STEP;
    const py = y * STEP;
    const commits = rand(6);

    let color = '#020617';
    if (commits >= 1) color = '#0f766e';
    if (commits >= 3) color = '#14b8a6';
    if (commits >= 5) color = '#5eead4';

    const eat = eaten.find(e => e.x === x && e.y === y);
    const hideAnim = eat
      ? `<animate attributeName="opacity"
           values="1;0"
           begin="${eat.t}s"
           dur="0.4s"
           fill="freeze" />`
      : '';

    svg += `
<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="3"
  fill="${color}">
  ${hideAnim}
</rect>`;
  }
}

// ===== GLOW =====
svg += `
<defs>
  <filter id="neon">
    <feGaussianBlur stdDeviation="2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
`;

// ===== NEON TAIL =====
svg += `
<polyline
  points="${path.map(p => `${p[0]*STEP + CELL/2},${p[1]*STEP + CELL/2}`).join(' ')}"
  fill="none"
  stroke="#67e8f9"
  stroke-width="2"
  stroke-linecap="round"
  stroke-dasharray="4 12"
  opacity="0.4"
  filter="url(#neon)"
>
  <animate
    attributeName="stroke-dashoffset"
    from="0"
    to="-200"
    dur="6s"
    repeatCount="indefinite"/>
</polyline>
`;

// ===== SHIP =====
svg += `
<g filter="url(#neon)">
  <polygon
    points="0,-6 12,0 0,6 -4,0"
    fill="none"
    stroke="#e5e7eb"
    stroke-width="1.5"
  >
    <animateTransform
      attributeName="transform"
      type="translate"
      dur="18s"
      repeatCount="indefinite"
      values="${path.map(p => `${p[0]*STEP + CELL/2} ${p[1]*STEP + CELL/2}`).join(';')}"
    />
  </polygon>
</g>
`;

svg += `</svg>`;

fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/pixel-fireworks.svg', svg);

console.log('✔ Neon Hunter generated');
fs.mkdirSync('output', { recursive: true });

// основний файл (можеш лишити)
fs.writeFileSync('output/pixel-hero.svg', svg);

// ФАЙЛ ДЛЯ README (БЕЗ КЕШУ)
fs.writeFileSync('output/pixel-hero-latest.svg', svg);

console.log('✔ Pixel Hero generated');

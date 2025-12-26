const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 120;
const NUM_LAYERS = 3;
const PIXELS_PER_LAYER = [50, 30, 20];
const SPEEDS = [4, 6, 8];

const GRID_COLS = 30; // кількість колонок у сітці
const GRID_ROWS = 6;  // кількість рядів
const GRID_PADDING = 4; // відстань між квадратиками

const random = (min, max) => Math.random() * (max - min) + min;

// створюємо масив позицій сітки
let positions = [];
const cellWidth = WIDTH / GRID_COLS;
const cellHeight = HEIGHT / GRID_ROWS;

for (let r = 0; r < GRID_ROWS; r++) {
  for (let c = 0; c < GRID_COLS; c++) {
    positions.push({
      x: c * cellWidth + GRID_PADDING / 2,
      y: r * cellHeight + GRID_PADDING / 2,
    });
  }
}

// перемішуємо масив позицій для неповторності
positions = positions.sort(() => Math.random() - 0.5);

let svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#0a0a1f; overflow:visible">
  <defs>
    <linearGradient id="pixelGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#00fff7"/>
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#22d3ee"/>
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00fff7"/>
    </filter>
  </defs>
`;

// створюємо квадратики
let posIndex = 0;

for (let layer = 0; layer < NUM_LAYERS; layer++) {
  for (let i = 0; i < PIXELS_PER_LAYER[layer]; i++) {
    if (posIndex >= positions.length) break; // якщо позиції закінчились

    const pos = positions[posIndex++];
    const size = random(4 + layer * 2, 8 + layer * 3);
    const delay = 0; // стартує одразу
    const duration = random(SPEEDS[layer] - 1, SPEEDS[layer] + 1);
    const aliveTime = random(1, 3); // час світіння після падіння

    // невеликі хвилі при падінні
    const waveAmplitude = random(5, 15);

    svg += `
      <rect x="${pos.x}" y="-${size}" width="${size}" height="${size}" fill="url(#pixelGradient)" filter="url(#glow)">
        <animate attributeName="y" from="-${size}" to="${pos.y}" dur="${duration}s" begin="${delay}s" fill="freeze"/>
        <animateTransform attributeName="transform" attributeType="XML" type="translate" 
          values="0 0; ${waveAmplitude} 0; 0 0" dur="${duration}s" begin="${delay}s" fill="freeze"/>
        <animate attributeName="opacity" values="0;1;0" dur="${aliveTime}s" begin="${duration}s" fill="freeze"/>
      </rect>
    `;
  }
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-contributions.svg'), svg);

console.log('✔ Pixel Contributions SVG generated');

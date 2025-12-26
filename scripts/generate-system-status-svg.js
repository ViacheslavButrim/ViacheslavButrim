const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 100;
const NUM_PIXELS = 80;

const random = (min, max) => Math.random() * (max - min) + min;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#0a0a1f; overflow:visible">
  <defs>
    <linearGradient id="pixelGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#00fff7"/>
    </linearGradient>
  </defs>
`;

for (let i = 0; i < NUM_PIXELS; i++) {
  const x = random(0, WIDTH);
  const size = random(4, 10);
  const delay = random(0, 5);
  const duration = random(3, 6);

  svg += `
    <rect x="${x}" y="-${size}" width="${size}" height="${size}" fill="url(#pixelGradient)">
      <animate attributeName="y" from="-${size}" to="${HEIGHT}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
    </rect>
  `;
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-rain.svg'), svg);

console.log('✔ Pixel Rain SVG generated');

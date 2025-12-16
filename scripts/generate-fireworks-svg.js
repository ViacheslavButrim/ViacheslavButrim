const fs = require('fs');
const path = require('path');

const WIDTH = 28;
const HEIGHT = 7;
const CELL = 20;
const PADDING = 2;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH*CELL}" height="${HEIGHT*CELL}" style="background:#111827">\n`;

// Коміти
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const px = x*CELL;
    const py = y*CELL;
    const color = Math.random() > 0.5 ? "#0ff" : "#22d3ee";
    const delay = (x + y*WIDTH) * 0.1;

    svg += `
      <rect x="${px}" y="${py}" width="${CELL-PADDING}" height="${CELL-PADDING}" fill="${color}" rx="4" ry="4"/>
      <circle cx="${px + CELL/2}" cy="${py + CELL/2}" r="2" fill="#111827">
        <animate attributeName="r" values="2;6;2" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
    `;
  }
}

// Ракета з коротким хвостом
svg += `
  <g>
    <!-- ракета -->
    <polygon points="10,0 0,20 20,20" fill="#facc15">
      <animateMotion dur="5s" repeatCount="indefinite" path="M0,0 L560,140 L0,280 L560,420 L0,560"/>
    </polygon>

    <!-- хвіст -->
    <circle r="3" fill="#3b82f6">
      <animateMotion dur="5s" repeatCount="indefinite" path="M0,0 L560,140 L0,280 L560,420 L0,560"/>
      <animate attributeName="r" values="3;0" dur="0.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="indefinite" />
    </circle>
  </g>
`;

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(path.join(outputDir, 'pixel-contrib-rocket.svg'), svg);
console.log('✔ Pixel Contribution SVG з ракетою та коротким хвостом згенеровано у output/pixel-contrib-rocket.svg');

fs.mkdirSync('output', { recursive: true });
fs.writeFileSync('output/pixel-fireworks.svg', svg);

console.log('✔ Neon Hunter generated');
fs.mkdirSync('output', { recursive: true });

// основний файл (можеш лишити)
fs.writeFileSync('output/pixel-hero.svg', svg);

// ФАЙЛ ДЛЯ README (БЕЗ КЕШУ)
fs.writeFileSync('output/pixel-hero-latest.svg', svg);

console.log('✔ Pixel Hero generated');

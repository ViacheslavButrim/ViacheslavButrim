const fs = require('fs');
const path = require('path');

const WIDTH = 28;  // дні
const HEIGHT = 7;  // тижні
const CELL = 20;
const PADDING = 2;

// Параметри комітів
const colors = ["#0ff", "#22d3ee"];
const pulseDuration = 1.5; // сек
const rocketSpeed = 0.5; // сек на коміт (регулює швидкість ракети)

// Генеруємо коміти
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH*CELL}" height="${HEIGHT*CELL}" style="background:#111827">\n`;

let commitPositions = [];

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const px = x*CELL;
    const py = y*CELL;
    commitPositions.push({x:px, y:py});
    const color = colors[Math.floor(Math.random()*colors.length)];
    const delay = (x + y*WIDTH)*0.1;

    svg += `
      <rect x="${px}" y="${py}" width="${CELL-PADDING}" height="${CELL-PADDING}" fill="${color}" rx="4" ry="4"/>
      <circle cx="${px + CELL/2}" cy="${py + CELL/2}" r="2" fill="#111827">
        <animate attributeName="r" values="2;6;2" dur="${pulseDuration}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.4;1" dur="${pulseDuration}s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
    `;
  }
}

// Ракета з хвостом і слідкуванням за комітами
svg += `<g id="rocket">`;
svg += `
  <polygon points="10,0 0,20 20,20" fill="#facc15">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite" keyPoints="${commitPositions.map((p,i)=>`${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}" keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
  </polygon>
  <circle r="3" fill="#3b82f6">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite" keyPoints="${commitPositions.map((p,i)=>`${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}" keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
    <animate attributeName="r" values="3;0" dur="0.5s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="indefinite" />
  </circle>
`;
svg += `</g>\n`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(path.join(outputDir, 'pixel-contrib-rocket.svg'), svg);
console.log('✔ Pixel Contribution SVG з ракетою та хвостом згенеровано у output/pixel-contrib-rocket.svg');

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

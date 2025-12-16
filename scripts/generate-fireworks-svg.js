const fs = require('fs');
const path = require('path');

const WIDTH = 28;
const HEIGHT = 7;
const CELL = 20;
const PADDING = 2;

const pulseDuration = 1.5;
const rocketSpeed = 0.5;

// Створюємо масив комітів
let commitPositions = [];
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const px = x * CELL;
    const py = y * CELL;
    commitPositions.push({ x: px, y: py });
  }
}

// Перемішуємо коміти хаотично для анімації ракети
commitPositions.sort(() => Math.random() - 0.5);

// Генеруємо SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH*CELL}" height="${HEIGHT*CELL}" style="background:#111827">\n`;

// Коміти
commitPositions.forEach((pos, i) => {
  const color = `hsl(180, 100%, ${30 + Math.random()*40}%)`; // легкий неон, трохи темніше
  const delay = i * 0.1 + Math.random()*0.2;
  svg += `
    <rect x="${pos.x}" y="${pos.y}" width="${CELL-PADDING}" height="${CELL-PADDING}" fill="${color}" rx="4" ry="4"/>
    <circle cx="${pos.x + CELL/2}" cy="${pos.y + CELL/2}" r="2" fill="#111827">
      <animate attributeName="r" values="2;6;2" dur="${pulseDuration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0.4;1" dur="${pulseDuration}s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>
  `;
});

// Ракета з коротким хвостом
svg += `<g id="rocket">
  <polygon points="10,0 0,20 20,20" fill="#facc15">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite"
      keyPoints="${commitPositions.map(p => `${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}"
      keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
  </polygon>
  <circle r="3" fill="#3b82f6">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite"
      keyPoints="${commitPositions.map(p => `${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}"
      keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
    <animate attributeName="r" values="3;0" dur="0.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="indefinite"/>
  </circle>
</g>\n`;

svg += `</svg>`;

// Створюємо папку та записуємо файл
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-contrib-rocket.svg'), svg);
console.log('✔ Pixel Contribution Rocket з хаотичною ракетою та пульсуючими комітами згенеровано');

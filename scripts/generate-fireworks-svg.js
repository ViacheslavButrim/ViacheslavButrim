const fs = require('fs');
const path = require('path');

const WIDTH = 28;  // дні
const HEIGHT = 7;  // тижні
const CELL = 20;
const PADDING = 2;

const colors = ["#0ff", "#22d3ee"];
const pulseDuration = 1.5;
const rocketSpeed = 0.5;

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

// Ракета з коротким хвостом
svg += `<g id="rocket">
  <polygon points="10,0 0,20 20,20" fill="#facc15">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite"
      keyPoints="${commitPositions.map((p,i)=>`${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}"
      keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
  </polygon>
  <circle r="3" fill="#3b82f6">
    <animateMotion dur="${commitPositions.length*rocketSpeed}s" repeatCount="indefinite"
      keyPoints="${commitPositions.map((p,i)=>`${p.x/((WIDTH-1)*CELL)};${p.y/((HEIGHT-1)*CELL)}`).join(';')}"
      keyTimes="${commitPositions.map((_,i)=>i/commitPositions.length).join(';')}" />
    <animate attributeName="r" values="3;0" dur="0.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="indefinite"/>
  </circle>
</g>\n`;

svg += `</svg>`;

// Створюємо папку один раз
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Записуємо **тільки один файл**, який будемо вставляти у README
fs.writeFileSync(path.join(outputDir, 'pixel-contrib-rocket.svg'), svg);

console.log('✔ Pixel Contribution Rocket згенеровано у output/pixel-contrib-rocket.svg');

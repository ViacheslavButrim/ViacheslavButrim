const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 180;
const CELL_SIZE = 20;
const ROWS = 6;
const COLS = Math.floor(WIDTH / CELL_SIZE);

const COLORS = ['#22d3ee', '#00fff7', '#15bdfa', '#22c55e']; // як у футері

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDelay = () => (Math.random() * 3).toFixed(2); // початкова затримка падіння
const randomDuration = () => (1 + Math.random()).toFixed(2); // тривалість падіння

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#020617; display:block">`;

// Генеруємо квадрати
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = c * CELL_SIZE;
    const yEnd = r * CELL_SIZE;
    const yStart = -CELL_SIZE - Math.random() * 100;
    const color = random(COLORS);
    const delay = randomDelay();
    const fallDur = randomDuration();
    const stayTime = 1 + Math.random() * 2; // час перебування на місці
    const fadeDur = 1; // тривалість зникання

    svg += `
      <rect x="${x}" y="${yStart}" width="${CELL_SIZE-2}" height="${CELL_SIZE-2}" fill="${color}">
        <!-- Падіння -->
        <animate attributeName="y" from="${yStart}" to="${yEnd}" dur="${fallDur}s" begin="${delay}s" fill="freeze" />
        <!-- Залишання на місці -->
        <animate attributeName="y" from="${yEnd}" to="${yEnd}" dur="${stayTime}s" begin="${(parseFloat(delay) + parseFloat(fallDur)).toFixed(2)}s" fill="freeze" />
        <!-- Плавне зникання -->
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="${fadeDur + stayTime}s" begin="${(parseFloat(delay) + parseFloat(fallDur)).toFixed(2)}s" fill="freeze"/>
      </rect>
    `;
  }
}

svg += `</svg>`;

// Збереження
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'contribution-rain.svg'), svg);

console.log('✔ Contribution Rain SVG (advanced) generated');

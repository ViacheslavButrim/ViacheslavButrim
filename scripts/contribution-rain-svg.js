const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 180;
const CELL_SIZE = 20; // розмір квадратика
const ROWS = 6;
const COLS = Math.floor(WIDTH / CELL_SIZE);

const COLORS = ['#22d3ee', '#00fff7', '#15bdfa', '#22c55e']; // неон як у футері

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDelay = () => (Math.random() * 3).toFixed(2);
const randomDuration = () => (1 + Math.random()).toFixed(2);

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#020617; display:block">`;

// Створюємо квадратики з рандомним падінням
for (let i = 0; i < 30; i++) { // обмежуємо кількість квадратиків для помірної анімації
  const col = Math.floor(Math.random() * COLS);
  const row = Math.floor(Math.random() * ROWS);
  const x = col * CELL_SIZE;
  const yEnd = row * CELL_SIZE;
  const yStart = -CELL_SIZE - Math.random() * 100;
  const color = random(COLORS);
  const delay = randomDelay();
  const fallDur = (1 + Math.random()).toFixed(2); // швидкість падіння
  const stayTime = 2 + Math.random(); // час на місці 2-3 секунди
  const fadeDur = 1; // плавне зникання

  svg += `
    <rect x="${x}" y="${yStart}" width="${CELL_SIZE-2}" height="${CELL_SIZE-2}" fill="${color}" rx="2" ry="2" style="filter:drop-shadow(0 0 6px ${color}); opacity:0;">
      <!-- Падіння -->
      <animate attributeName="y" from="${yStart}" to="${yEnd}" dur="${fallDur}s" begin="${delay}s" fill="freeze" />
      <!-- Поява -->
      <animate attributeName="opacity" values="0;1" dur="0.5s" begin="${delay}s" fill="freeze"/>
      <!-- Залишання на місці -->
      <animate attributeName="y" from="${yEnd}" to="${yEnd}" dur="${stayTime}s" begin="${(parseFloat(delay) + parseFloat(fallDur)).toFixed(2)}s" fill="freeze" />
      <!-- Плавне зникання -->
      <animate attributeName="opacity" values="1;0" dur="${fadeDur}s" begin="${(parseFloat(delay) + parseFloat(fallDur) + stayTime).toFixed(2)}s" fill="freeze"/>
    </rect>
  `;
}

svg += `</svg>`;

// Збереження файлу
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'contribution-rain.svg'), svg);

console.log('✔ Contribution Rain SVG (Tetris-style Neon) generated');

const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 180;
const CELL_SIZE = 20;
const ROWS = 6;
const COLS = Math.floor(WIDTH / CELL_SIZE);

const COLORS = ['#22d3ee', '#00fff7', '#15bdfa', '#22c55e']; // як у футері

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDelay = () => (Math.random() * 3).toFixed(2); // затримка падіння

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#020617">`;

// створюємо сітку
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const x = c * CELL_SIZE;
    const yStart = -CELL_SIZE - Math.random() * 100;
    const yEnd = r * CELL_SIZE;
    const color = random(COLORS);
    const delay = randomDelay();

    svg += `
      <rect x="${x}" y="${yStart}" width="${CELL_SIZE-2}" height="${CELL_SIZE-2}" fill="${color}">
        <animate attributeName="y" from="${yStart}" to="${yEnd}" dur="1s" begin="${delay}s" fill="freeze" />
        <animate attributeName="opacity" values="1;1;0" dur="2s" begin="${(parseFloat(delay)+1).toFixed(2)}s" fill="freeze"/>
      </rect>
    `;
  }
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'contribution-rain.svg'), svg);

console.log('✔ Contribution Rain SVG generated');
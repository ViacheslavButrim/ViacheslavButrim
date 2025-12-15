const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const WIDTH = COLS * (CELL + GAP);
const HEIGHT = ROWS * (CELL + GAP);

let svg = `<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     width="${WIDTH}"
     height="${HEIGHT}">`;

for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const px = x * (CELL + GAP);
    const py = y * (CELL + GAP);
    const commits = Math.floor(Math.random() * 6);

    // Залишаємо барвисті квадратики
    let color = '#e5e7eb'; // 0 комітів
    if (commits === 1 || commits === 2) color = '#86efac';
    if (commits === 3 || commits === 4) color = '#22c55e';
    if (commits >= 5) color = '#facc15';

    svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" fill="${color}"/>`;

    if (commits >= 3) {
      // Темна пульсація всередині квадратика
      svg += `<circle cx="${px + CELL/2}" cy="${py + CELL/2}" r="2" fill="#1f2937">
                <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
              </circle>`;
    }
  }
}

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-fireworks.svg'), svg);

console.log('✔ Pixel Fireworks SVG updated with dark pulsation inside squares');

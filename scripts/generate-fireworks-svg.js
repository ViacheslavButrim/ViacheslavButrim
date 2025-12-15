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
    const commits = Math.floor(Math.random() * 6); // random 0-5

    // Темніші кольори
    let color = '#d1d5db';
    if (commits === 1 || commits === 2) color = '#4ade80';
    if (commits === 3 || commits === 4) color = '#16a34a';
    if (commits >= 5) color = '#ca8a04';

    svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" fill="${color}"/>`;

    if (commits >= 3) {
      // Затримка анімації по координатах, щоб вибухали по черзі
      const delay = ((x + y) * 0.1).toFixed(1);
      svg += `<circle cx="${px + CELL/2}" cy="${py + CELL/2}" r="2" fill="#ca8a04">
                <animate attributeName="r" values="2;6;2" dur="1.5s" repeatCount="indefinite" begin="${delay}s"/>
                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="${delay}s"/>
              </circle>`;
    }
  }
}

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-fireworks.svg'), svg);

console.log('✔ Pixel Fireworks SVG updated with darker colors and sequential explosions');

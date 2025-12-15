const fs = require('fs');
const path = require('path');

const COLS = 28;
const ROWS = 7;
const CELL = 16;
const GAP = 4;

const WIDTH = COLS * (CELL + GAP);
const HEIGHT = ROWS * (CELL + GAP) + 10;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     width="${WIDTH}"
     height="${HEIGHT}">

<style>
  .soil { fill: #e5e7eb; }
  .sprout { fill: #86efac; }
  .bush { fill: #22c55e; }
  .tree { fill: #15803d; }

  .plant {
    animation: grow 2s ease-in-out infinite alternate;
  }

  @keyframes grow {
    from { transform: scale(0.9); }
    to { transform: scale(1.05); }
  }
</style>
`;

for (let y = 0; y < ROWS; y++) {
  for (let x = 0; x < COLS; x++) {
    const level = Math.floor(Math.random() * 6); // 0–5 commits (поки random)

    const px = x * (CELL + GAP);
    const py = y * (CELL + GAP);

    if (level === 0) {
      svg += `<rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" class="soil"/>`;
    }

    if (level >= 1 && level <= 2) {
      svg += `
        <rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" class="soil"/>
        <circle cx="${px + CELL / 2}" cy="${py + CELL / 2}" r="4" class="sprout plant"/>
      `;
    }

    if (level >= 3 && level <= 4) {
      svg += `
        <rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" class="soil"/>
        <rect x="${px + 4}" y="${py + 4}" width="8" height="8" rx="2" class="bush plant"/>
      `;
    }

    if (level >= 5) {
      svg += `
        <rect x="${px}" y="${py}" width="${CELL}" height="${CELL}" rx="4" class="soil"/>
        <rect x="${px + 7}" y="${py + 6}" width="2" height="6" fill="#7c2d12"/>
        <circle cx="${px + CELL / 2}" cy="${py + 6}" r="6" class="tree plant"/>
      `;
    }
  }
}

svg += `</svg>`;

const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ Commit Garden SVG generated');

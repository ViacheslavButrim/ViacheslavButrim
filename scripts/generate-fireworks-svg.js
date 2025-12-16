const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;
const NUM_STARS = 500;

const random = (min, max) => Math.random() * (max - min) + min;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:#0b0c1a">\n`;

for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);
  const size = random(1, 3);
  const delay = random(0, 3);
  const pulseSpeed = random(1, 3);
  const color = `hsl(${random(170, 200)}, 100%, ${random(40, 80)}%)`;

  // Пульсація
  svg += `
    <circle cx="${x}" cy="${y}" r="${size}" fill="${color}">
      <animate attributeName="r" values="${size};${size*2};${size}" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;1;0.3" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y+random(-10,10)};${y}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>
  `;
}

// Додаткові спалахи “supernova” для випадкових зірок
for (let i = 0; i < 50; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);
  const size = random(2,5);
  const delay = random(0,5);
  const color = `hsl(${random(180,200)}, 100%, 85%)`;

  svg += `
    <circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.5">
      <animate attributeName="r" values="${size};${size*5};${size}" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>
  `;
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'epic-starfield.svg'), svg);
console.log('✔ Epic Starfield SVG згенеровано у output/epic-starfield.svg');

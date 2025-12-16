const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;
const NUM_STARS = 1200;
const NUM_FRACTALS = 10;

// Випадкове число
const random = (min, max) => Math.random() * (max - min) + min;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:#0b0c1a">\n`;

// --- Пульсуючі зірки ---
for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);
  const size = random(0.5, 1.5);
  const delay = random(0, 3);
  const pulseSpeed = random(1, 3);
  const color = `hsl(${random(170, 200)}, 100%, ${random(40, 80)}%)`;

  svg += `
    <circle cx="${x}" cy="${y}" r="${size}" fill="${color}">
      <animate attributeName="r" values="${size};${size*2};${size}" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;1;0.3" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y+random(-5,5)};${y}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>
  `;
}

// --- Фрактали (L-system / дерево) у випадкових позиціях ---
function drawFractal(x1, y1, length, angle, depth) {
  if (depth === 0) return;

  const rad = angle * Math.PI / 180;
  const x2 = x1 + length * Math.cos(rad);
  const y2 = y1 - length * Math.sin(rad);

  svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(${random(180,200)}, 100%, ${random(50,70)}%)" stroke-width="${depth*0.8}">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
          </line>`;

  drawFractal(x2, y2, length*0.7, angle - random(20,30), depth - 1);
  drawFractal(x2, y2, length*0.7, angle + random(20,30), depth - 1);
}

// Генеруємо кілька фракталів по небу
for (let i = 0; i < NUM_FRACTALS; i++) {
  const fx = random(100, WIDTH-100);
  const fy = random(HEIGHT/2, HEIGHT);
  const flength = random(30, 60);
  const fdepth = Math.floor(random(3,5));
  const fang = -90;
  drawFractal(fx, fy, flength, fang, fdepth);
}

// --- Додаткові спалахи ---
for (let i = 0; i < 50; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);
  const size = random(2,4);
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

// --- Записуємо файл ---
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'epic-fractal-starfield.svg'), svg);
console.log('✔ Epic Fractal Starfield SVG згенеровано у output/epic-fractal-starfield.svg');

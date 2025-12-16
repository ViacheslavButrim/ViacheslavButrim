const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;
const NUM_STARS = 1800;
const NUM_SATELLITES = 3;

// Випадкове число
const random = (min, max) => Math.random() * (max - min) + min;

// Генеруємо SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:#0a0a1f">\n`;

// --- Зірки ---
for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);
  const size = random(0.5, 1.5); // маленькі зірки
  const delay = random(0, 3);
  const pulseSpeed = random(1, 3);
  const color = `hsl(${random(180, 200)}, 100%, ${random(40, 80)}%)`;

  svg += `
    <circle cx="${x}" cy="${y}" r="${size}" fill="${color}">
      <animate attributeName="r" values="${size};${size*2};${size}" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;1;0.2" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y+random(-2,2)};${y}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="${x};${x+random(-1.5,1.5)};${x}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>
  `;
}

// --- Супутники ---
for (let i = 0; i < NUM_SATELLITES; i++) {
  const orbitRadius = random(100, 180);
  const orbitCx = WIDTH/2;
  const orbitCy = HEIGHT/2;
  const size = random(2,3);
  const delay = i * 2; // рознесені по фазі
  const speed = random(20,30); // сек на оберт

  svg += `
    <circle r="${size}" fill="hsl(200, 100%, 70%)">
      <animateMotion dur="${speed}s" repeatCount="indefinite" begin="${delay}s">
        <mpath>
          <path d="M ${orbitCx-orbitRadius},${orbitCy} 
                   a ${orbitRadius},${orbitRadius} 0 1,1 ${orbitRadius*2},0 
                   a ${orbitRadius},${orbitRadius} 0 1,1 -${orbitRadius*2},0"/>
        </mpath>
      </animateMotion>
      <animate attributeName="opacity" values="0.3;1;0.3" dur="5s" repeatCount="indefinite"/>
    </circle>
  `;
}

svg += `</svg>`;

// --- Записуємо файл ---
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'epic-starfield-1800.svg'), svg);
console.log('✔ Epic Starfield 1800 stars + satellites згенеровано у output/epic-starfield-1800.svg');

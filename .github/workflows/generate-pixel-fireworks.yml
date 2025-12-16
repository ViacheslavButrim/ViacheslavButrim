const fs = require('fs');
const path = require('path');

const WIDTH = 28;
const HEIGHT = 7;
const CELL = 20;

const numStars = WIDTH * HEIGHT;
const pulseDuration = 1.5;
const shipSpeed = 0.5;

// Функція випадкового числа в діапазоні
const random = (min, max) => Math.random() * (max - min) + min;

// Генеруємо коміти-зірочки
let stars = [];
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    stars.push({
      x: x * CELL + random(0, CELL-4),
      y: y * CELL + random(0, CELL-4),
      color: `hsl(180, 100%, ${random(40, 70)}%)`,
      delay: random(0, 2)
    });
  }
}

// Генеруємо SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH*CELL}" height="${HEIGHT*CELL}" style="background:#0e0e1f">\n`;

// Коміти-зірочки
stars.forEach(star => {
  svg += `
    <circle cx="${star.x}" cy="${star.y}" r="2" fill="${star.color}">
      <animate attributeName="r" values="2;5;2" dur="${pulseDuration}s" begin="${star.delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0.4;1" dur="${pulseDuration}s" begin="${star.delay}s" repeatCount="indefinite"/>
    </circle>
  `;
});

// Корабель
const pathPoints = stars.map(star => `${star.x},${star.y}`).join(' ');

svg += `
  <g id="ship">
    <polygon points="10,0 0,20 20,20" fill="#facc15">
      <animateMotion dur="${numStars*shipSpeed}s" repeatCount="indefinite">
        <mpath>
          <path d="M${pathPoints}" />
        </mpath>
      </animateMotion>
    </polygon>

    <circle r="3" fill="#3b82f6">
      <animateMotion dur="${numStars*shipSpeed}s" repeatCount="indefinite">
        <mpath>
          <path d="M${pathPoints}" />
        </mpath>
      </animateMotion>
      <animate attributeName="r" values="3;0" dur="0.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0" dur="0.5s" repeatCount="indefinite"/>
    </circle>
  </g>
`;

svg += `</svg>`;

// Створюємо папку та записуємо файл
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-galaxy.svg'), svg);

console.log('✔ Neon Galaxy Contribution SVG згенеровано у output/pixel-galaxy.svg');

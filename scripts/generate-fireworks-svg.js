const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;
const NUM_STARS = 1000;
const NUM_LAYERS = 3; // передній, середній, задній
const NUM_SATELLITES = 3;
const NUM_METEORS = 5;

// Випадкове число
const random = (min, max) => Math.random() * (max - min) + min;

// Генеруємо SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:#0a0a1f" onmousemove="const e=event;document.querySelectorAll('circle.star').forEach(s=>{const dx=s.cx.baseVal.value-e.offsetX,dy=s.cy.baseVal.value-e.offsetY,dist=Math.sqrt(dx*dx+dy*dy);if(dist<50){s.setAttribute('cx',s.cx.baseVal.value+dx/15);s.setAttribute('cy',s.cy.baseVal.value+dy/15)}})">\n`;

// --- Зоряні шари ---
for(let layer=0; layer<NUM_LAYERS; layer++){
  const layerFactor = 0.5 + layer*0.25;

  for (let i = 0; i < NUM_STARS/NUM_LAYERS; i++) {
    const x = random(0, WIDTH);
    const y = random(0, HEIGHT);
    const size = random(0.5, 1.5) * layerFactor;
    const delay = random(0, 3);
    const pulseSpeed = random(1, 3) / layerFactor;
    const color = `hsl(${random(180,200)}, 100%, ${random(40,80)}%)`;

    svg += `
      <circle class="star" cx="${x}" cy="${y}" r="${size}" fill="${color}">
        <animate attributeName="r" values="${size};${size*2};${size}" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="${pulseSpeed}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="${y};${y+random(-2,2)};${y}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="cx" values="${x};${x+random(-1.5,1.5)};${x}" dur="${pulseSpeed*2}s" begin="${delay}s" repeatCount="indefinite"/>
      </circle>
    `;
  }
}

// --- Супутники ---
for (let i = 0; i < NUM_SATELLITES; i++) {
  const orbitRadius = random(100, 180);
  const orbitCx = WIDTH/2;
  const orbitCy = HEIGHT/2;
  const size = random(2,3);
  const delay = i * 3; 
  const speed = random(20,30); 

  svg += `
    <circle r="${size}" fill="hsl(${random(190,220)}, 100%, 70%)">
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

// --- Метеори / спалахи ---
for (let i = 0; i < NUM_METEORS; i++){
  const startX = random(0, WIDTH/2);
  const startY = random(0, HEIGHT/2);
  const length = random(50,100);
  const delay = random(0,10);
  const duration = random(3,6);
  const color = `hsl(${random(180,200)}, 100%, 80%)`;

  svg += `
    <line x1="${startX}" y1="${startY}" x2="${startX+length}" y2="${startY+length}" stroke="${color}" stroke-width="1">
      <animate attributeName="x1" values="${startX};${startX+length*2}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="y1" values="${startY};${startY+length*2}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="x2" values="${startX+length};${startX+length*3}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="y2" values="${startY+length};${startY+length*3}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;1;0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
    </line>
  `;
}

svg += `</svg>`;

// --- Запис ---
const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'interactive-starfield.svg'), svg);
console.log('✔ Ultimate Interactive Starfield згенеровано у output/interactive-starfield.svg');

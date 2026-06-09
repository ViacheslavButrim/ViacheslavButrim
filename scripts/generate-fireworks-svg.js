const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;
const NUM_STARS = 1000;
const NUM_SATELLITES = 3;
const NUM_METEORS = 5;

const random = (min, max) => Math.random() * (max - min) + min;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${WIDTH}"
     height="${HEIGHT}"
     style="background:#02020B;cursor:none"
     onmousemove="const e=event;document.querySelectorAll('circle.star').forEach(s=>{const dx=(s.cx.baseVal.value-e.offsetX)/15,dy=(s.cy.baseVal.value-e.offsetY)/15;s.setAttribute('cx',s.cx.baseVal.value+dx);s.setAttribute('cy',s.cy.baseVal.value+dy)})">

<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="2" result="blur"/>
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
`;

/* ---------- STARS ---------- */

for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);

  const size = random(0.5, 1.6);
  const pulse = random(1, 3);
  const delay = random(0, 3);

  let color;

  if (x < WIDTH * 0.35) {
    const palette = [
      '#00BFFF',
      '#4DEEFF',
      '#7DF9FF'
    ];
    color = palette[Math.floor(Math.random() * palette.length)];
  } else if (x < WIDTH * 0.65) {
    const palette = [
      '#4DEEFF',
      '#00BFFF',
      '#8B5CF6'
    ];
    color = palette[Math.floor(Math.random() * palette.length)];
  } else {
    const palette = [
      '#A855F7',
      '#D946EF',
      '#7C3AED'
    ];
    color = palette[Math.floor(Math.random() * palette.length)];
  }

  svg += `
    <circle
      class="star"
      cx="${x}"
      cy="${y}"
      r="${size}"
      fill="${color}"
      filter="url(#glow)"
    >
      <animate
        attributeName="r"
        values="${size};${size * 2};${size}"
        dur="${pulse}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="opacity"
        values="0.2;1;0.2"
        dur="${pulse}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="cx"
        values="${x};${x + random(-2, 2)};${x}"
        dur="${pulse * 2}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="cy"
        values="${y};${y + random(-2, 2)};${y}"
        dur="${pulse * 2}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
    </circle>
  `;
}

/* ---------- SATELLITES ---------- */

for (let i = 0; i < NUM_SATELLITES; i++) {
  const orbitRadius = random(100, 180);
  const orbitCx = WIDTH / 2;
  const orbitCy = HEIGHT / 2;

  const size = random(2, 3);
  const delay = i * 2;
  const speed = random(20, 30);

  const color =
    Math.random() > 0.5
      ? '#4DEEFF'
      : '#D946EF';

  svg += `
    <circle
      r="${size}"
      fill="${color}"
      filter="url(#glow)"
    >
      <animateMotion
        dur="${speed}s"
        repeatCount="indefinite"
        begin="${delay}s"
      >
        <mpath>
          <path d="M ${orbitCx - orbitRadius},${orbitCy}
                   a ${orbitRadius},${orbitRadius} 0 1,1 ${orbitRadius * 2},0
                   a ${orbitRadius},${orbitRadius} 0 1,1 -${orbitRadius * 2},0"/>
        </mpath>
      </animateMotion>

      <animate
        attributeName="opacity"
        values="0.3;1;0.3"
        dur="5s"
        repeatCount="indefinite"
      />
    </circle>
  `;
}

/* ---------- METEORS ---------- */

for (let i = 0; i < NUM_METEORS; i++) {
  const startX = random(0, WIDTH);
  const startY = random(0, HEIGHT * 0.5);

  const length = random(50, 120);
  const delay = random(0, 10);
  const duration = random(3, 6);

  const meteorColors = [
    '#4DEEFF',
    '#00BFFF',
    '#A855F7',
    '#D946EF'
  ];

  const color =
    meteorColors[
      Math.floor(Math.random() * meteorColors.length)
    ];

  svg += `
    <line
      x1="${startX}"
      y1="${startY}"
      x2="${startX + length}"
      y2="${startY + length}"
      stroke="${color}"
      stroke-width="1.5"
      filter="url(#glow)"
    >
      <animate
        attributeName="x1"
        values="${startX};${startX + length * 2}"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="y1"
        values="${startY};${startY + length * 2}"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="x2"
        values="${startX + length};${startX + length * 3}"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="y2"
        values="${startY + length};${startY + length * 3}"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="opacity"
        values="0;1;0"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
    </line>
  `;
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'interactive-starfield-hover.svg'),
  svg
);

console.log(
  'Interactive Starfield Neon Edition generated successfully.'
);

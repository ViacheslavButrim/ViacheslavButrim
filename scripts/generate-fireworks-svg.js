const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;

const NUM_STARS = 800;
const NUM_SATELLITES = 3;
const NUM_METEORS = 3;

const random = (min, max) =>
  Math.random() * (max - min) + min;

const parts = [];

parts.push(`
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${WIDTH}"
  height="${HEIGHT}"
  viewBox="0 0 ${WIDTH} ${HEIGHT}"
  style="background:#02020B"
>

<defs>

  <filter id="glow">
    <feGaussianBlur
      stdDeviation="2"
      result="blur"
    />
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

`);
for (let i = 0; i < NUM_SATELLITES; i++) {
  const radius = random(90, 170);

  parts.push(`
    <path
      id="orbit-${i}"
      d="
        M ${WIDTH / 2 - radius},${HEIGHT / 2}
        a ${radius},${radius} 0 1,1 ${radius * 2},0
        a ${radius},${radius} 0 1,1 -${radius * 2},0
      "
      fill="none"
      stroke="none"
    />
  `);
}

parts.push(`</defs>`);
const leftColors = [
  '#00BFFF',
  '#4DEEFF',
  '#7DF9FF'
];

const centerColors = [
  '#4DEEFF',
  '#00BFFF',
  '#8B5CF6'
];

const rightColors = [
  '#A855F7',
  '#D946EF',
  '#7C3AED'
];

for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);

  const size = random(0.4, 1.4);

  const pulse = random(2, 6);
  const delay = random(0, 5);

  let palette;

  if (x < WIDTH * 0.35) {
    palette = leftColors;
  } else if (x < WIDTH * 0.65) {
    palette = centerColors;
  } else {
    palette = rightColors;
  }

  const color =
    palette[
      Math.floor(Math.random() * palette.length)
    ];

  parts.push(`
    <circle
      cx="${x}"
      cy="${y}"
      r="${size}"
      fill="${color}"
      filter="url(#glow)"
    >
      <animate
        attributeName="opacity"
        values="0.2;1;0.2"
        dur="${pulse}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
    </circle>
  `);
}
for (let i = 0; i < NUM_SATELLITES; i++) {

  const size = random(2, 3);

  const speed = random(18, 28);

  const color =
    Math.random() > 0.5
      ? '#4DEEFF'
      : '#D946EF';

  parts.push(`
    <circle
      r="${size}"
      fill="${color}"
      filter="url(#glow)"
    >

      <animateMotion
        dur="${speed}s"
        repeatCount="indefinite"
      >
        <mpath href="#orbit-${i}" />
      </animateMotion>

      <animate
        attributeName="opacity"
        values="0.4;1;0.4"
        dur="4s"
        repeatCount="indefinite"
      />

    </circle>
  `);
}
for (let i = 0; i < NUM_METEORS; i++) {

  const startX = random(-200, WIDTH);
  const startY = random(0, HEIGHT / 2);

  const length = random(60, 120);

  const duration = random(4, 8);
  const delay = random(0, 10);

  const colors = [
    '#4DEEFF',
    '#00BFFF',
    '#A855F7',
    '#D946EF'
  ];

  const color =
    colors[
      Math.floor(
        Math.random() * colors.length
      )
    ];

  parts.push(`
    <g>

      <line
        x1="0"
        y1="0"
        x2="${length}"
        y2="${length}"
        stroke="${color}"
        stroke-width="1.5"
        filter="url(#glow)"
      />

      <animateTransform
        attributeName="transform"
        type="translate"
        from="${startX} ${startY}"
        to="${WIDTH + 200} ${HEIGHT + 200}"
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

    </g>
  `);
}
parts.push(`</svg>`);

const svg = parts.join('');

const outputDir =
  path.join(__dirname, '..', 'output');

fs.mkdirSync(outputDir, {
  recursive: true
});

fs.writeFileSync(
  path.join(
    outputDir,
    'interactive-starfield-hover.svg'
  ),
  svg
);

console.log(
  'Optimized SVG generated successfully'
);

const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 400;

const NUM_STARS = 800;
const NUM_METEORS = 2;

const random = (min, max) =>
  Math.random() * (max - min) + min;

const parts = [];

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
      stdDeviation="1.8"
      result="blur"
    />
    <feMerge>
      <feMergeNode in="blur"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>

</defs>
`);

//
// STARS
//

for (let i = 0; i < NUM_STARS; i++) {
  const x = random(0, WIDTH);
  const y = random(0, HEIGHT);

  const size = random(0.4, 1.4);

  const pulse = random(2, 8);
  const delay = random(0, 5);

  const palette =
    x < WIDTH * 0.35
      ? leftColors
      : x < WIDTH * 0.65
      ? centerColors
      : rightColors;

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
        values="0.25;1;0.25"
        dur="${pulse}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />
    </circle>
  `);
}

//
// FAST METEORS
//

for (let i = 0; i < NUM_METEORS; i++) {

  const startX = random(-400, WIDTH * 0.25);
  const startY = random(-100, HEIGHT * 0.5);

  const length = random(40, 120);

  const duration = random(0.4, 0.8);

  const delay = random(i * 40, i * 90);

  const colors = [
  '#7DF9FF',
  '#4DEEFF',
  '#B8FFFF'
  ];

  const color =
    colors[
      Math.floor(
        Math.random() * colors.length
      )
    ];

  parts.push(`
    <g opacity="0">

      <line
        x1="0"
        y1="0"
        x2="${length}"
        y2="${length * 0.22}"
        stroke="${color}"
        stroke-width="0.4"
        stroke-linecap="round"
        filter="url(#glow)"
      />

      <animateTransform
        attributeName="transform"
        type="translate"
        from="${startX} ${startY}"
        to="${WIDTH + 300} ${HEIGHT + 150}"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

      <animate
        attributeName="opacity"
        values="0;1;1;0"
        keyTimes="0;0.15;0.8;1"
        dur="${duration}s"
        begin="${delay}s"
        repeatCount="indefinite"
      />

    </g>
  `);
}

parts.push(`</svg>`);

const svg = parts.join('');

const outputDir = path.join(__dirname, '..', 'output');

fs.mkdirSync(outputDir, {
  recursive: true
});

fs.writeFileSync(
  path.join(outputDir, 'interactive-starfield-hover.svg'),
  svg
);

console.log('Starfield generated successfully');

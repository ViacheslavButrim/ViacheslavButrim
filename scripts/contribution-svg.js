const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 120;
const NUM_LAYERS = 3;
const PIXELS_PER_LAYER = [50, 30, 20];
const SPEEDS = [4, 6, 8];
const random = (min, max) => Math.random() * (max - min) + min;

let svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:#0a0a1f; overflow:visible">
  <defs>
    <linearGradient id="pixelGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#00fff7"/>
    </linearGradient>
  </defs>
`;

for (let layer = 0; layer < NUM_LAYERS; layer++) {
  for (let i = 0; i < PIXELS_PER_LAYER[layer]; i++) {
    const size = random(4 + layer*2, 8 + layer*3);
    const x = random(0, WIDTH - size);
    const fallDuration = random(SPEEDS[layer]-1, SPEEDS[layer]+1);
    const stopY = random(HEIGHT * 0.45, HEIGHT * 0.9);
    const fadeDuration = random(1, 2);
    const delay = random(0, 10); // випадкова початкова затримка
    const waveAmplitude = random(3, 8);

    svg += `
      <rect x="${x}" y="-${size}" width="${size}" height="${size}" fill="url(#pixelGradient)">
        <animate attributeName="y"
                 values="-${size};${stopY}"
                 dur="${fallDuration}s"
                 begin="${delay}s"
                 fill="freeze"
                 repeatCount="indefinite"/>
                 
        <animateTransform attributeName="transform"
                          type="translate"
                          values="0 0; ${waveAmplitude} 0; 0 0"
                          dur="${fallDuration}s"
                          begin="${delay}s"
                          repeatCount="indefinite"/>
        
        <animate attributeName="opacity"
                 values="1;1;0"
                 keyTimes="0;${fallDuration/(fallDuration+fadeDuration)};1"
                 dur="${fallDuration + fadeDuration}s"
                 begin="${delay}s"
                 repeatCount="indefinite"/>
      </rect>
    `;
  }
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-rain-readme-ааа.svg'), svg);

console.log('✔ SVG для README згенеровано');

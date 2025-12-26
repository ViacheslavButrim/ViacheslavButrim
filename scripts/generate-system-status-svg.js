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

    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#22d3ee"/>
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#00fff7"/>
    </filter>
  </defs>
`;

for (let layer = 0; layer < NUM_LAYERS; layer++) {
  for (let i = 0; i < PIXELS_PER_LAYER[layer]; i++) {
    const x = random(0, WIDTH);
    const size = random(4 + layer*2, 8 + layer*3);
    const delay = random(0, 5);
    const duration = random(SPEEDS[layer]-1, SPEEDS[layer]+1);
    const waveAmplitude = random(5, 15);
    const waveFrequency = random(1, 3);

    svg += `
      <rect x="${x}" y="-${size}" width="${size}" height="${size}" fill="url(#pixelGradient)" filter="url(#glow)">
        <animate attributeName="y" from="-${size}" to="${HEIGHT}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" attributeType="XML" type="translate" 
          values="0 0; ${waveAmplitude} 0; 0 0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;1;0" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/>
      </rect>
    `;
  }
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(path.join(outputDir, 'pixel-rain-advanced.svg'), svg);

console.log('✔ Advanced Pixel Rain SVG generated');

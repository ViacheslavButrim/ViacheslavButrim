const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 120;

const NUM_LAYERS = 3;
const PIXELS_PER_LAYER = [50, 30, 20];
const SPEEDS = [4, 6, 8];

const random = (min, max) => Math.random() * (max - min) + min;

// ✅ Абсолютний шлях — ПРАВИЛЬНО для GitHub Actions
const outputDir = path.resolve(process.cwd(), 'output');
const outputFile = 'pixel-rain-advanced-stop.svg';
const outputPath = path.join(outputDir, outputFile);

// гарантовано створюємо output
fs.mkdirSync(outputDir, { recursive: true });

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${WIDTH}"
     height="${HEIGHT}"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     style="background:#0a0a1f; overflow:visible">

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

// === PIXEL GENERATION ===
for (let layer = 0; layer < NUM_LAYERS; layer++) {
  for (let i = 0; i < PIXELS_PER_LAYER[layer]; i++) {

    const size = random(4 + layer * 2, 8 + layer * 3);
    const x = random(0, WIDTH - size);

    const fallDuration = random(SPEEDS[layer] - 1, SPEEDS[layer] + 1);
    const delay = random(0, 5);

    const stopY = random(HEIGHT * 0.45, HEIGHT * 0.9);
    const fadeDuration = random(1, 3);
    const waveAmplitude = random(5, 15);

    svg += `
    <rect x="${x}" y="-${size}" width="${size}" height="${size}"
          fill="url(#pixelGradient)" filter="url(#glow)">

      <!-- падіння -->
      <animate attributeName="y"
               from="-${size}"
               to="${stopY}"
               dur="${fallDuration}s"
               begin="${delay}s"
               fill="freeze"/>

      <!-- легке хитання -->
      <animateTransform attributeName="transform"
                        type="translate"
                        values="0 0; ${waveAmplitude} 0; 0 0"
                        dur="${fallDuration}s"
                        begin="${delay}s"
                        fill="freeze"/>

      <!-- світіння + стухання -->
      <animate attributeName="opacity"
               values="0;1;1;0"
               dur="${fadeDuration}s"
               begin="${delay + fallDuration}s"
               fill="freeze"/>
    </rect>
    `;
  }
}

svg += `
</svg>
`;

// === WRITE FILE ===
fs.writeFileSync(outputPath, svg);

// === LOGS (ВАЖЛИВО) ===
console.log('✔ SVG GENERATED');
console.log('📁 Output dir:', outputDir);
console.log('📄 File:', outputPath);
console.log('📦 Output files:', fs.readdirSync(outputDir));

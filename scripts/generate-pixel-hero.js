const fs = require('fs');
const path = require('path');

// Генеруємо простий SVG Pixel Hero на основі випадкових "комітів" для прикладу
// В реальному використанні заміниш на історію комітів через gh api

const width = 28; // дні в тижні
const height = 7; // тижні в місяці
const blockSize = 20; // розмір пікселя
const padding = 2;

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width*blockSize}" height="${height*blockSize}">\n`;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const commits = Math.floor(Math.random() * 5); // замість випадкових значень використовуй реальні коміти
    let color = commits === 0 ? "#eeeeee" : "#00ff00"; // сірий = 0, зелений = коміт
    svg += `<rect x="${x*blockSize}" y="${y*blockSize}" width="${blockSize-padding}" height="${blockSize-padding}" fill="${color}" />\n`;
  }
}

svg += `</svg>`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);
console.log('Pixel Hero SVG згенеровано у output/pixel-hero.svg');
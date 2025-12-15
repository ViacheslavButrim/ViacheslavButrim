const fs = require('fs');
const path = require('path');

// Параметри
const width = 28; // дні в тижні
const height = 7; // тижні
const blockSize = 20; 
const padding = 2;

// Створюємо SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width*blockSize}" height="${height*blockSize}">\n`;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const commits = Math.floor(Math.random() * 5);
    let color = commits === 0 ? "#eeeeee" : "#00ff00";
    svg += `<rect x="${x*blockSize}" y="${y*blockSize}" width="${blockSize-padding}" height="${blockSize-padding}" fill="${color}" />\n`;
  }
}

svg += `</svg>`;

// Папка output у корені репозиторію
const outputDir = path.resolve(__dirname, '../output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filePath = path.join(outputDir, 'pixel-hero.svg');
fs.writeFileSync(filePath, svg);

console.log('Pixel Hero SVG згенеровано у:', filePath);
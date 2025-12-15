try {
  const fs = require('fs');
  const path = require('path');

  const width = 28;
  const height = 7;
  const blockSize = 20;
  const padding = 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width*blockSize}" height="${height*blockSize}">\n`;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const commits = Math.floor(Math.random() * 5);
      let color = commits === 0 ? "#eeeeee" : "#00ff00";
      svg += `<rect x="${x*blockSize}" y="${y*blockSize}" width="${blockSize-padding}" height="${blockSize-padding}" fill="${color}" />\n`;
    }
  }

  svg += `</svg>`;

  const outputDir = path.resolve(__dirname, '../output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, 'pixel-hero.svg');
  fs.writeFileSync(filePath, svg);

  console.log('Pixel Hero SVG згенеровано у:', filePath);
} catch (error) {
  console.error('Помилка під час генерації SVG:', error);
  process.exit(1);
}
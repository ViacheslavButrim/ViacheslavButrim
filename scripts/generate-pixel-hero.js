const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DAYS = 28;
const WEEKS = 7;
const SIZE = 20;

// отримуємо commits по днях
const raw = execSync(
  `git log --since="${DAYS} days ago" --pretty=format:%ad --date=short`
).toString().trim();

const commitsPerDay = {};
raw.split('\n').forEach(date => {
  if (!date) return;
  commitsPerDay[date] = (commitsPerDay[date] || 0) + 1;
});

// формуємо масив дат
const dates = [];
for (let i = DAYS - 1; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);
  dates.push(d.toISOString().slice(0, 10));
}

// SVG
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${DAYS * SIZE}" height="${WEEKS * SIZE}">`;

dates.forEach((date, i) => {
  const count = commitsPerDay[date] || 0;
  const x = i * SIZE;
  const y = 0;

  let color = '#e5e7eb';
  if (count >= 1) color = '#86efac';
  if (count >= 3) color = '#22c55e';
  if (count >= 5) color = '#15803d';

  svg += `<rect x="${x}" y="${y}" width="${SIZE - 2}" height="${SIZE - 2}" fill="${color}">
    <title>${date}: ${count} commits</title>
  </rect>`;
});

svg += `</svg>`;

// output
const outputDir = path.resolve(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'pixel-hero.svg'), svg);

console.log('✔ Real commits SVG generated');

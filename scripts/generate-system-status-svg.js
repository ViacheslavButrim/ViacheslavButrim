const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 90;

const START_DATE = new Date('2020-01-01'); // ❗ заміни на дату першого серйозного коміту
const NOW = new Date();
const UPTIME_DAYS = Math.floor((NOW - START_DATE) / (1000 * 60 * 60 * 24));

const STATUS_COLOR = '#22c55e'; // green
const TEXT_COLOR = '#c7d2fe';

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${WIDTH}" height="${HEIGHT}"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     style="background:#020617; font-family: Fira Code, monospace">

  <defs>
    <linearGradient id="pulse" x1="0" x2="1">
      <stop offset="0%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#00fff7"/>
    </linearGradient>
  </defs>

  <!-- STATUS DOT -->
  <circle cx="40" cy="45" r="8" fill="${STATUS_COLOR}">
    <animate attributeName="opacity"
             values="0.3;1;0.3"
             dur="2s"
             repeatCount="indefinite"/>
  </circle>

  <!-- STATUS TEXT -->
  <text x="60" y="50" fill="${TEXT_COLOR}" font-size="14">
    SYSTEM: <tspan fill="${STATUS_COLOR}">ONLINE</tspan>
  </text>

  <!-- UPTIME -->
  <text x="280" y="50" fill="${TEXT_COLOR}" font-size="14">
    UPTIME: <tspan fill="#38bdf8">${UPTIME_DAYS} days</tspan>
  </text>

  <!-- BUILDS -->
  <text x="500" y="50" fill="${TEXT_COLOR}" font-size="14">
    BUILDS: <tspan fill="#facc15">AUTO</tspan>
  </text>

  <!-- FOCUS BAR -->
  <rect x="720" y="38" width="200" height="14" rx="7" fill="#020617" stroke="#334155"/>
  <rect x="720" y="38" width="80" height="14" rx="7" fill="url(#pulse)">
    <animate attributeName="x"
             from="720"
             to="840"
             dur="3s"
             repeatCount="indefinite"/>
  </rect>

  <text x="940" y="50" fill="${TEXT_COLOR}" font-size="14">
    FOCUS
  </text>

</svg>
`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, 'system-status.svg'),
  svg
);

console.log('✔ System Status Footer generated');
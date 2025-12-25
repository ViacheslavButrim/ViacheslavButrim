const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 120;

const START_DATE = new Date('2020-01-01'); // дата першого серйозного коміту
const NOW = new Date();
const UPTIME_DAYS = Math.floor((NOW - START_DATE) / (1000 * 60 * 60 * 24));

const STATUS_COLOR = '#22c55e';
const TEXT_COLOR = '#c7d2fe';
const BUILD_COLOR = '#facc15';
const FOCUS_COLOR_START = '#22d3ee';
const FOCUS_COLOR_END = '#00fff7';

let svg = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${WIDTH}" height="${HEIGHT}"
     viewBox="0 0 ${WIDTH} ${HEIGHT}"
     style="background:#020617; font-family:Fira Code, monospace; overflow:visible">

  <defs>
    <linearGradient id="pulse" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${FOCUS_COLOR_START}"/>
      <stop offset="100%" stop-color="${FOCUS_COLOR_END}"/>
    </linearGradient>

    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#22d3ee"/>
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#00fff7"/>
    </filter>
  </defs>

  <!-- STATUS DOT -->
  <circle cx="40" cy="60" r="10" fill="${STATUS_COLOR}" filter="url(#glow)">
    <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- STATUS TEXT -->
  <text x="70" y="65" fill="${TEXT_COLOR}" font-size="16">
    SYSTEM: <tspan fill="${STATUS_COLOR}" font-weight="bold">ONLINE</tspan>
  </text>

  <!-- UPTIME -->
  <text x="280" y="65" fill="${TEXT_COLOR}" font-size="16">
    UPTIME: <tspan fill="#38bdf8" font-weight="bold">${UPTIME_DAYS} days</tspan>
  </text>

  <!-- BUILDS ANIMATION -->
  <g transform="translate(500,55)">
    ${[0,1,2,3,4].map(i => `
      <rect x="${i*15}" y="0" width="10" height="20" fill="${BUILD_COLOR}">
        <animate attributeName="height" values="10;25;10" dur="1s" begin="${i*0.2}s" repeatCount="indefinite"/>
      </rect>
    `).join('')}
  </g>

  <text x="580" y="65" fill="${TEXT_COLOR}" font-size="16">
    BUILDS
  </text>

  <!-- FOCUS BAR -->
  <rect x="720" y="50" width="200" height="20" rx="10" fill="#020617" stroke="#334155"/>
  <rect x="720" y="50" width="80" height="20" rx="10" fill="url(#pulse)" filter="url(#glow)">
    <animate attributeName="x" from="720" to="840" dur="3s" repeatCount="indefinite"/>
  </rect>
  <text x="940" y="65" fill="${TEXT_COLOR}" font-size="16">FOCUS</text>

  <!-- EXTRA PULSING DOTS -->
  ${[0,1,2,3].map(i => `
    <circle cx="${1000 + i*30}" cy="60" r="6" fill="#38bdf8" filter="url(#glow)">
      <animate attributeName="r" values="4;8;4" dur="${1+i*0.3}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;1;0.3" dur="${1+i*0.3}s" repeatCount="indefinite"/>
    </circle>
  `).join('')}

</svg>
`;

const outputDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, 'system-status-advanced.svg'),
  svg
);

console.log('✔ System Status Advanced Footer generated');

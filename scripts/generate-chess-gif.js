const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const boardSize = 600;
const canvasWidth = boardSize;
const canvasHeight = boardSize;

const squareSize = boardSize / 8;

const MOVE_DELAY = 1000;        
const RAIN_DELAY = 60;         
const RAIN_FRAMES = 3;         
const END_FRAMES = 20;

const GAMES = [
  // сюди вставляй PGN партій
  `[Event "Random Game"]
  1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`,
  `[Event "Another Game"]
  1. d4 d5 2. c4 c6 3. Nc3 Nf6`
];

// ================= RANDOM START =================
function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v);
}

function rotateArray(arr, startIndex) {
  return [...arr.slice(startIndex), ...arr.slice(0, startIndex)];
}

const startIndex = Math.floor(Math.random() * GAMES.length);
const RANDOMIZED_GAMES = rotateArray(GAMES, startIndex);

const encoder = new GIFEncoder(canvasWidth, canvasHeight);
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};
let boardImage;

// ============== Load Assets ==============
async function loadAssets() {
  try {
    for (const c of ['w','b']) {
      for (const p of pieces) {
        const imgPath = path.join(__dirname, 'assets', 'pieces', `${c}${p}.png`);
        pieceImages[c+p] = await loadImage(imgPath);
      }
    }
    boardImage = await loadImage(path.join(__dirname, 'assets', 'dashboard.png'));
    console.log('✔ Assets loaded');
  } catch (err) {
    console.error('❌ Error loading assets:', err);
  }
}

// ================= PIXEL RAIN =================
const PIXEL_LAYERS = [
  { count: 30, speed: 2, size: [4, 8], alpha: 0.8 },
  { count: 20, speed: 3.5, size: [6, 12], alpha: 0.6 },
  { count: 10, speed: 5, size: [8, 14], alpha: 0.4 },
];
const COLORS = ['#22d3ee', '#00fff7'];

function createRain() {
  const arr = [];
  for (const l of PIXEL_LAYERS) {
    for (let i = 0; i < l.count; i++) {
      arr.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        speed: l.speed * (0.8 + Math.random()),
        size: l.size[0] + Math.random() * (l.size[1] - l.size[0]),
        alpha: l.alpha,
        drift: Math.random() * 1.5 - 0.75,
        color: COLORS[Math.random() * COLORS.length | 0]
      });
    }
  }
  return arr;
}

const rain = createRain();

function updateRain(rainArr) {
  for (const p of rainArr) {
    p.y += p.speed;
    p.x += p.drift;
    if (p.y > canvasHeight) {
      p.y = -p.size;
      p.x = Math.random() * canvasWidth;
    }
  }
}

function drawRain(rainArr) {
  for (const p of rainArr) {
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

// ================= DRAW FRAME =================
function drawFrame(chess) {
  ctx.fillStyle = '#0a0a1f';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawRain(rain);

  ctx.drawImage(boardImage, 0, 0, boardSize, boardSize);

  const b = chess.board();
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const s = b[y][x];
      if (s) {
        ctx.drawImage(
          pieceImages[s.color + s.type.toUpperCase()],
          x * squareSize,
          y * squareSize,
          squareSize,
          squareSize
        );
      }
    }
  }
}

// ================= PLAY GAME =================
async function playGame(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const moves = chess.history();
  chess.reset();

  for (const m of moves) {
    chess.move(m);

    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess);
    encoder.addFrame(ctx);

    encoder.setDelay(RAIN_DELAY);
    for (let i = 0; i < RAIN_FRAMES; i++) {
      updateRain(rain);
      drawFrame(chess);
      encoder.addFrame(ctx);
    }
  }

  for (let i = 0; i < END_FRAMES; i++) {
    updateRain(rain);
    drawFrame(chess);
    encoder.addFrame(ctx);
  }
}

// ================= MAIN =================
(async () => {
  await loadAssets();

  const outputDir = path.join(process.cwd(), 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const gifPath = path.join(outputDir, 'chess-ai.gif');

  encoder.createReadStream().pipe(fs.createWriteStream(gifPath));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setQuality(10);

  for (const g of RANDOMIZED_GAMES) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

// ================= SIZES =================
const boardSize = 400;
const sidebarWidth = 260;

const canvasWidth = boardSize + sidebarWidth;
const canvasHeight = boardSize;

const squareSize = boardSize / 8;

// ================= TIMING =================
const MOVE_DELAY = 1000;
const RAIN_DELAY = 60;
const RAIN_FRAMES = 3;
const END_FRAMES = 20;

// ================= GAMES =================
const GAMES = [
  {
    pgn: `[Event "Random Game"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`,
    text: `Іспанська партія.
Класичний дебют з тиском на коня c6.
Білі отримують комфортну ініціативу.`
  },
  {
    pgn: `[Event "Another Game"]
1. d4 d5 2. c4 c6 3. Nc3 Nf6`,
    text: `Слов’янський захист.
Надійна пішакова структура.
Гра на позиційне перевищення.`
  }
];

// ================= RANDOM START =================
function rotateArray(arr, startIndex) {
  return [...arr.slice(startIndex), ...arr.slice(0, startIndex)];
}

const startIndex = Math.floor(Math.random() * GAMES.length);
const RANDOMIZED_GAMES = rotateArray(GAMES, startIndex);

// ================= CANVAS / GIF =================
const encoder = new GIFEncoder(canvasWidth, canvasHeight);
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const pieces = ['K', 'Q', 'R', 'B', 'N', 'P'];
const pieceImages = {};
let boardImage;

// ================= LOAD ASSETS =================
async function loadAssets() {
  const assetsDir = path.join(process.cwd(), 'assets');

  for (const c of ['w', 'b']) {
    for (const p of pieces) {
      pieceImages[c + p] = await loadImage(
        path.join(assetsDir, 'pieces', `${c}${p}.png`)
      );
    }
  }

  boardImage = await loadImage(path.join(assetsDir, 'dashboard.png'));
  console.log('✔ Assets loaded');
}

// ================= PIXEL RAIN =================
const PIXEL_LAYERS = [
  { count: 30, speed: 2, size: [4, 8], alpha: 0.8 },
  { count: 20, speed: 3.5, size: [6, 12], alpha: 0.6 },
  { count: 10, speed: 5, size: [8, 14], alpha: 0.4 }
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

// ================= SIDEBAR TEXT =================
function drawSidebar(text) {
  const x = boardSize;
  const padding = 16;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(x, 0, sidebarWidth, canvasHeight);

  ctx.fillStyle = '#22d3ee';
  ctx.font = '14px monospace';
  ctx.textBaseline = 'top';

  const maxWidth = sidebarWidth - padding * 2;
  let y = padding;

  const paragraphs = text.split('\n');

  for (const p of paragraphs) {
    let line = '';
    const words = p.split(' ');

    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxWidth) {
        ctx.fillText(line, x + padding, y);
        line = w + ' ';
        y += 18;
      } else {
        line = test;
      }
    }

    if (line) {
      ctx.fillText(line, x + padding, y);
      y += 22;
    }
  }
}

// ================= DRAW FRAME =================
function drawFrame(chess, sidebarText) {
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

  drawSidebar(sidebarText);
}

// ================= PLAY GAME =================
async function playGame(game) {
  const chess = new Chess();
  chess.loadPgn(game.pgn);

  const moves = chess.history();
  chess.reset();

  for (const m of moves) {
    chess.move(m);

    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess, game.text);
    encoder.addFrame(ctx);

    encoder.setDelay(RAIN_DELAY);
    for (let i = 0; i < RAIN_FRAMES; i++) {
      updateRain(rain);
      drawFrame(chess, game.text);
      encoder.addFrame(ctx);
    }
  }

  for (let i = 0; i < END_FRAMES; i++) {
    updateRain(rain);
    drawFrame(chess, game.text);
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

  for (const game of RANDOMIZED_GAMES) {
    await playGame(game);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

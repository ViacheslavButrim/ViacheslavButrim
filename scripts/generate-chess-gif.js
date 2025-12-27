const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */
const boardSize = 600;
const sideWidth = 600;
const canvasWidth = boardSize + sideWidth * 2;
const canvasHeight = boardSize;

const squareSize = boardSize / 8;
const MOVES_DELAY_MS = 900;
const FRAMES_BETWEEN_GAMES = 6;
const FPS = 20;
const FRAMES_PER_MOVE = Math.floor((MOVES_DELAY_MS / 1000) * FPS);
encoder.setDelay(1000 / FPS);

/* ================= PIXEL RAIN CONFIG ================= */
const PIXEL_LAYERS = [
  { count: 40, speed: 2.2, size: [4, 8], alpha: 0.8 },
  { count: 25, speed: 3.6, size: [6, 12], alpha: 0.6 },
  { count: 15, speed: 5.2, size: [8, 16], alpha: 0.4 },
];

const NEON_COLORS = ['#22d3ee', '#00fff7'];

/* ================= GAME ================= */
const GAMES = [
  `1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6
   8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8
   14.Ng3 g6 15.a4 c5 16.d5 c4 17.Be3 Qc7 18.Nd2 Nc5 19.f4 exf4
   20.Bxf4 Nfd7 21.Nf3 Bg7 22.Nd4 Qb6 23.Kh1 Ne5 24.Rf1 Ned3
   25.Bc1 Nxc1 26.Rxc1 Be5 27.Nge2 b4 28.cxb4 Qxb4 29.b3 cxb3
   30.Bxb3 Nxb3 31.Nxb3 Qxa4 32.Rc7 Rf8 33.Rxb7 Qxe4 34.Na5 Rac8
   35.Nc6 Rxc6 36.dxc6 Qxc6 37.Rb3 a5 38.Nd4 Qc4 39.Nf3 Qf4
   40.Rb5 Rc8 41.Rxa5 Rc1 42.Qe2 Rxf1+ 43.Qxf1 h5 44.Ra8+ Kg7
   45.Ra7 g5 46.Ra5 g4 47.Nxe5 Qxf1+ 48.Kh2 dxe5 49.hxg4 hxg4
   50.Kg3 Qf4+ 51.Kh4 Kg6 52.Ra6+ f6 53.Rxf6+ Kxf6 54.g3 Qg5# 0-1`
];

/* ================= OUTPUT ================= */
const outputDir = path.join(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });

const gifPath = path.join(outputDir, 'chess-ai.gif');
const encoder = new GIFEncoder(canvasWidth, canvasHeight);
encoder.createReadStream().pipe(fs.createWriteStream(gifPath));

encoder.start();
encoder.setRepeat(0);
encoder.setDelay(MOVES_DELAY_MS);
encoder.setQuality(10);

/* ================= CANVAS ================= */
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

/* ================= ASSETS ================= */
const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};
let boardImage;

/* ================= LOAD ================= */
async function loadPieces() {
  for (const c of ['w','b']) {
    for (const p of pieces) {
      const img = path.join(__dirname, '..', 'assets/pieces', `${c}${p}.png`);
      if (!fs.existsSync(img)) throw new Error(`Missing piece: ${img}`);
      pieceImages[c+p] = await loadImage(img);
    }
  }
}

async function loadBoard() {
  const img = path.join(__dirname, '..', 'assets', 'dashboard.png');
  if (!fs.existsSync(img)) throw new Error(`Missing board: ${img}`);
  boardImage = await loadImage(img);
}

/* ================= PIXEL RAIN ================= */
function createPixelRain(xStart, width) {
  const pixels = [];
  for (const layer of PIXEL_LAYERS) {
    for (let i = 0; i < layer.count; i++) {
      pixels.push({
        xStart,
        width,
        x: xStart + Math.random() * width,
        y: Math.random() * canvasHeight,
        speed: layer.speed * (0.8 + Math.random()),
        size: layer.size[0] + Math.random() * (layer.size[1] - layer.size[0]),
        alpha: layer.alpha,
        drift: Math.random() * 2 - 1,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      });
    }
  }
  return pixels;
}

const leftRain = createPixelRain(0, sideWidth);
const rightRain = createPixelRain(sideWidth + boardSize, sideWidth);

function drawPixelRain(pixels) {
  for (const p of pixels) {
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 14;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;

    ctx.fillRect(p.x, p.y, p.size, p.size);

    p.y += p.speed;
    p.x += p.drift * 0.3;

    if (p.y > canvasHeight) {
      p.y = -p.size;
      p.x = p.xStart + Math.random() * p.width;
    }
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

/* ================= DRAW FRAME ================= */
function drawFrame(chess) {
  ctx.fillStyle = '#0a0a1f';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawPixelRain(leftRain);
  drawPixelRain(rightRain);

  const boardX = sideWidth;
  ctx.drawImage(boardImage, boardX, 0, boardSize, boardSize);

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const sq = chess.board()[y][x];
      if (sq) {
        const key = sq.color + sq.type.toUpperCase();
        ctx.drawImage(
          pieceImages[key],
          boardX + x * squareSize,
          y * squareSize,
          squareSize,
          squareSize
        );
      }
    }
  }
}

/* ================= GAME LOOP ================= */
async function playGame(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const moves = chess.history();
  chess.reset();

for (const move of moves) {
  chess.move(move);

  // Основний кадр з ходом
  encoder.setDelay(MOVES_DELAY_MS);
  drawFrame(chess);
  encoder.addFrame(ctx);

  // Кілька легких кадрів ТІЛЬКИ для Pixel Rain
  encoder.setDelay(RAIN_DELAY);
  for (let i = 0; i < RAIN_FRAMES; i++) {
    drawFrame(chess);   // шахи ті самі, рухається тільки дощ
    encoder.addFrame(ctx);
  }
}

  for (let i = 0; i < FRAMES_BETWEEN_GAMES; i++) {
    drawFrame(chess);
    encoder.addFrame(ctx);
  }
}

/* ================= MAIN ================= */
(async () => {
  await loadPieces();
  await loadBoard();

  for (const g of GAMES) await playGame(g);

  encoder.finish();
  console.log('✔ chess-ai.gif з Pixel Rain секціями згенеровано');
})();

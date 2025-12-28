const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

// ================= SIZES =================
const boardSize = 400;
const canvasWidth = boardSize;
const canvasHeight = boardSize;
const squareSize = boardSize / 8;

// ================= TIMING =================
const MOVE_DELAY = 1000;    // затримка на хід
const END_FRAMES = 5;       // фінальні кадри партії
const PAUSE_BETWEEN_GAMES = 200; // пауза між партіями (мс)

// ================= GAMES =================
const GAMES = [
  `[Event "Random Game"]
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6`,
  `[Event "Another Game"]
1. d4 d5 2. c4 c6 3. Nc3 Nf6`
];

// ================= RANDOMIZE ARRAY =================
function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

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

// ================= DRAW FRAME =================
function drawFrame(chess) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
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

  // основні ходи
  for (const m of moves) {
    chess.move(m);
    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess);
    encoder.addFrame(ctx);
  }

  // фінальні кадри партії (короткі)
  encoder.setDelay(PAUSE_BETWEEN_GAMES);
  for (let i = 0; i < END_FRAMES; i++) {
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

  // Рандомний порядок партій
  const randomizedGames = shuffleArray(GAMES);

  for (const g of randomizedGames) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

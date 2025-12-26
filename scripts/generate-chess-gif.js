const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const boardSize = 400;
const squareSize = boardSize / 8;
const MOVES_DELAY_MS = 800;
const FRAMES_BETWEEN_GAMES = 5;

/* ================= GAMES ================= */

const GAMES = [
  `
  [Event "Italian Game"]
  1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6
  `,
  `
  [Event "Queen's Gambit"]
  1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7
  `
];

/* ================= SETUP ================= */

const outputDir = path.join(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });

const gifPath = path.join(outputDir, 'chess-ai.gif');
const encoder = new GIFEncoder(boardSize, boardSize);
const writeStream = fs.createWriteStream(gifPath);

encoder.createReadStream().pipe(writeStream);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(MOVES_DELAY_MS);
encoder.setQuality(10);

const canvas = createCanvas(boardSize, boardSize);
const ctx = canvas.getContext('2d');

/* ================= PIECES ================= */

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};

async function loadPieces() {
  for (const color of ['w','b']) {
    for (const p of pieces) {
      const imgPath = path.join(__dirname, '..', 'assets/pieces', `${color}${p}.png`);
      if (!fs.existsSync(imgPath)) throw new Error(`Missing PNG: ${imgPath}`);
      pieceImages[color+p] = await loadImage(imgPath);
    }
  }
}

/* ================= DRAW ================= */

function drawBoard(chess) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const isLight = (x + y) % 2 === 0;
      ctx.fillStyle = isLight ? '#a0c4ff' : '#2b2b7b';
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

      const square = chess.board()[y][x];
      if (square) {
        const key = square.color + square.type.toUpperCase();
        ctx.drawImage(pieceImages[key], x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }
  }
}

/* ================= MAIN ================= */

async function playGame(gameData) {
  const chess = new Chess();

  // PGN
  if (typeof gameData === 'string') {
    chess.loadPgn(gameData);
    chess.reset();
    const moves = chess.history({ verbose: true });

    for (const move of moves) {
      chess.move(move);
      drawBoard(chess);
      encoder.addFrame(ctx);
    }
  }

  // SAN array
  if (Array.isArray(gameData)) {
    for (const san of gameData) {
      chess.move(san);
      drawBoard(chess);
      encoder.addFrame(ctx);
    }
  }

  // пауза між партіями
  for (let i = 0; i < FRAMES_BETWEEN_GAMES; i++) {
    drawBoard(chess);
    encoder.addFrame(ctx);
  }
}

async function generateGIF() {
  await loadPieces();

  for (const game of GAMES) {
    await playGame(game);
  }

  encoder.finish();
  await new Promise(r => writeStream.on('finish', r));

  console.log('✔ chess-ai.gif з кількома партіями згенеровано');
}

generateGIF().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

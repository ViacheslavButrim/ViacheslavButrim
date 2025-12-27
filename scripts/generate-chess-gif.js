const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */
const boardSize = 600;
const squareSize = boardSize / 8;
const MOVES_DELAY_MS = 1000;
const FRAMES_BETWEEN_GAMES = 5;

/* ================= GAMES ================= */
const GAMES = [
  `1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6
   8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8 14.Ng3 g6 15.a4 c5 16.d5 c4
   17.Be3 Qc7 18.Nd2 Nc5 19.f4 exf4 20.Bxf4 Nfd7 21.Nf3 Bg7 22.Nd4 Qb6 23.Kh1 Ne5 24.Rf1 Ned3
   25.Bc1 Nxc1 26.Rxc1 Be5 27.Nge2 b4 28.cxb4 Qxb4 29.b3 cxb3 30.Bxb3 Nxb3 31.Nxb3 Qxa4 32.Rc7 Rf8
   33.Rxb7 Qxe4 34.Na5 Rac8 35.Nc6 Rxc6 36.dxc6 Qxc6 37.Rb3 a5 38.Nd4 Qc4 39.Nf3 Qf4 40.Rb5 Rc8 41.Rxa5 Rc1
   42.Qe2 Rxf1+ 43.Qxf1 h5 44.Ra8+ Kg7 45.Ra7 g5 46.Ra5 g4 47.Nxe5 Qxf1+ 48.Kh2 dxe5 49.hxg4 hxg4 50.Kg3 Qf4+ 51.Kh4 Kg6 52.Ra6+ f6 53.Rxf6+ Kxf6 54.g3 Qg5# 0-1`,
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
      const imgPath = path.join(__dirname, 'assets/pieces', `${color}${p}.png`);
      if (!fs.existsSync(imgPath)) throw new Error(`Missing PNG: ${imgPath}`);
      pieceImages[color+p] = await loadImage(imgPath);
    }
  }
}

/* ================= BOARD ================= */
let boardImage;

async function loadBoard() {
  const boardPath = path.join(__dirname, 'assets/board.png'); // обов'язково PNG 600x600
  if (!fs.existsSync(boardPath)) throw new Error(`Missing board PNG: ${boardPath}`);
  boardImage = await loadImage(boardPath);
}

/* ================= DRAW ================= */
function drawBoard(chess) {
  ctx.clearRect(0, 0, boardSize, boardSize);
  ctx.drawImage(boardImage, 0, 0, boardSize, boardSize);

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const square = chess.board()[y][x];
      if (square) {
        const key = square.color + square.type.toUpperCase();
        ctx.drawImage(pieceImages[key], x * squareSize, y * squareSize, squareSize, squareSize);
      }
    }
  }
}

/* ================= MAIN ================= */
async function playGame(gamePgn) {
  const chess = new Chess();
  chess.loadPgn(gamePgn);

  const moves = chess.history();
  chess.reset();

  for (const move of moves) {
    chess.move(move);
    drawBoard(chess);
    encoder.addFrame(ctx);
  }

  // Пауза між партіями
  for (let i = 0; i < FRAMES_BETWEEN_GAMES; i++) {
    drawBoard(chess);
    encoder.addFrame(ctx);
  }
}

async function generateGIF() {
  await loadPieces();
  await loadBoard();

  let currentIndex = Math.floor(Math.random() * GAMES.length); // стартуємо з випадкової партії

  for (let i = 0; i < GAMES.length; i++) {
    const game = GAMES[currentIndex];
    await playGame(game);

    // переходимо до наступної партії по порядку, циклічно
    currentIndex = (currentIndex + 1) % GAMES.length;
  }

  encoder.finish();
  await new Promise(r => writeStream.on('finish', r));
  console.log('✔ chess-ai.gif з кількома партіями згенеровано');
}
generateGIF().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

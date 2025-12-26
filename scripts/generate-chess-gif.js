const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const boardSize = 1200;
const squareSize = boardSize / 8;
const MOVES_DELAY_MS = 1000;
const FRAMES_BETWEEN_GAMES = 5;

/* ================= GAMES ================= */

const GAMES = [
  `
 [Event "Wch U16"]
[Site "Wattignies"]
[Date "1976.08.27"]
[Round "?"]
[White "Chandler, Murray G"]
[Black "Kasparov, Gary"]
[Result "1-0"]
[WhiteElo ""]
[BlackElo ""]
[ECO "B22"]

1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 Nc6 5.Nf3 cxd4 6.cxd4 e6 7.a3 d6 8.Bd3 Qa5+
9.Bd2 Qb6 10.Nc3 Nxc3 11.Bxc3 dxe5 12.dxe5 Be7 13.O-O Bd7 14.Nd2 Qc7 15.Qg4 O-O-O
16.Rfc1 Kb8 17.Qc4 Rc8 18.b4 f6 19.Nf3 Qb6 20.Qe4 f5 21.Qe1 a6 22.Rab1 g5
23.Nd2 Nd4 24.Qe3 Rxc3 25.Rxc3 f4 26.Qe1 g4 27.Ne4 Bc6 28.Nc5 Ka7 29.a4 Bf3
30.a5 Qd8 31.Bc4 Bxc5 32.bxc5 Qh4 33.gxf3 gxf3 34.Kh1 Rg8 35.Qe4 Rg7 36.Qxd4 Qg5
37.c6+ Kb8 38.c7+ Rxc7 39.Rg1 Qh5 40.Rg8+ Rc8 41.Qd6+ Ka7  1-0
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

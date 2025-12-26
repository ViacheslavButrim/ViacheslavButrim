const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { spawn } = require('child_process');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

/* ================= CONFIG ================= */

const BOARD_SIZE = 400;
const SQUARE = BOARD_SIZE / 8;
const FRAMES = 80;
const DELAY = 800;

const OUTPUT_DIR = path.join(process.cwd(), 'output');
const GIF_PATH = path.join(OUTPUT_DIR, 'chess-ai.gif');

const PIECES_DIR = path.join(process.cwd(), 'assets', 'pieces');

/* ========================================== */

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

/* ============= STOCKFISH ENGINE ============ */

class Stockfish {
  constructor(depth) {
    this.depth = depth;
    this.proc = spawn('stockfish');
    this.queue = [];

    this.proc.stdout.on('data', data => {
      const text = data.toString();
      if (text.includes('bestmove')) {
        const move = text.split('bestmove ')[1].split(' ')[0];
        this.queue.shift()?.(move);
      }
    });

    this.proc.stdin.write('uci\n');
  }

  getMove(fen) {
    return new Promise(resolve => {
      this.queue.push(resolve);
      this.proc.stdin.write(`position fen ${fen}\n`);
      this.proc.stdin.write(`go depth ${this.depth}\n`);
    });
  }

  quit() {
    this.proc.stdin.write('quit\n');
  }
}

/* =============== OPENINGS ================= */

const OPENINGS = [
  ['e4', 'e5', 'Nf3', 'Nc6'],
  ['d4', 'd5', 'c4'],
  ['c4', 'e5'],
  ['Nf3', 'd5', 'g3'],
  ['e4', 'c5'],
];

/* ================ DRAWING ================= */

const canvas = createCanvas(BOARD_SIZE, BOARD_SIZE);
const ctx = canvas.getContext('2d');

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};

async function loadPieces() {
  for (const color of ['w','b']) {
    for (const p of pieces) {
      const file = path.join(PIECES_DIR, `${color}${p}.png`);
      if (!fs.existsSync(file)) {
        throw new Error(`❌ Missing piece: ${file}`);
      }
      pieceImages[color + p] = await loadImage(file);
    }
  }
}

function drawBoard(chess) {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const light = (x + y) % 2 === 0;
      ctx.fillStyle = light ? '#a0c4ff' : '#2b2b7b';
      ctx.fillRect(x * SQUARE, y * SQUARE, SQUARE, SQUARE);

      const square = chess.board()[y][x];
      if (square) {
        const key = square.color + square.type.toUpperCase();
        ctx.drawImage(
          pieceImages[key],
          x * SQUARE,
          y * SQUARE,
          SQUARE,
          SQUARE
        );
      }
    }
  }
}

/* =============== MAIN ===================== */

async function generateGIF() {
  console.log('♟️ Generating Chess AI GIF…');

  await loadPieces();

  const encoder = new GIFEncoder(BOARD_SIZE, BOARD_SIZE);
  const stream = fs.createWriteStream(GIF_PATH);
  encoder.createReadStream().pipe(stream);

  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(DELAY);
  encoder.setQuality(10);

  const chess = new Chess();

  // opening
  const opening = OPENINGS[Math.floor(Math.random() * OPENINGS.length)];
  opening.forEach(m => chess.move(m));

  const white = new Stockfish(10);
  const black = new Stockfish(7);

  for (let i = 0; i < FRAMES; i++) {
    if (chess.isGameOver()) break;

    const engine = chess.turn() === 'w' ? white : black;
    const move = await engine.getMove(chess.fen());
    if (!move) break;

    chess.move(move);
    drawBoard(chess);
    encoder.addFrame(ctx);
  }

  encoder.finish();
  white.quit();
  black.quit();

  await new Promise(res => stream.on('finish', res));

  console.log('✅ chess-ai.gif generated:', GIF_PATH);
}

generateGIF().catch(err => {
  console.error('❌ ERROR:', err);
  process.exit(1);
});
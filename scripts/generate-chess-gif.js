const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const stockfish = require('stockfish');
const fs = require('fs');
const path = require('path');
const boardSize = 400;
const squareSize = boardSize / 8;
const MOVES_LIMIT = 60;
const STOCKFISH_DEPTH = 6;
const OPENING_RANDOM_MOVES = 4;
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const gifPath = path.join(outputDir, 'chess-ai.gif');
const encoder = new GIFEncoder(boardSize, boardSize);
const writeStream = fs.createWriteStream(gifPath);

encoder.createReadStream().pipe(writeStream);
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(800);
encoder.setQuality(10);

const canvas = createCanvas(boardSize, boardSize);
const ctx = canvas.getContext('2d');
const chess = new Chess();
const engine = stockfish();

engine.postMessage('uci');
engine.postMessage('isready');

function getBestMove(fen, depth = STOCKFISH_DEPTH) {
  return new Promise(resolve => {
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage(`go depth ${depth}`);
    
      engine.onmessage = event => {
      const line = typeof event === 'string' ? event : event.data;
      if (line.startsWith('bestmove')) {
        resolve(line.split(' ')[1]);
      }
    };
  });
}

const pieces = ['K', 'Q', 'R', 'B', 'N', 'P'];
const pieceImages = {};

async function loadPieces() {
  for (const color of ['w', 'b']) {
    for (const p of pieces) {
      const imgPath = path.join(__dirname, '..', 'assets/pieces', `${color}${p}.png`);
      if (!fs.existsSync(imgPath)) {
        throw new Error(`Missing PNG: ${imgPath}`);
      }
      pieceImages[color + p] = await loadImage(imgPath);
    }
  }
}

function drawBoard() {
  const board = chess.board();

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const isLight = (x + y) % 2 === 0;
      ctx.fillStyle = isLight ? '#a0c4ff' : '#2b2b7b';
      ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);

      const square = board[y][x];
      if (square) {
        const key = square.color + square.type.toUpperCase();
        ctx.drawImage(
          pieceImages[key],
          x * squareSize,
          y * squareSize,
          squareSize,
          squareSize
        );
      }
    }
  }
}


async function generateGIF() {
  await loadPieces();

  for (let i = 0; i < MOVES_LIMIT; i++) {
    let move;

    if (i < OPENING_RANDOM_MOVES) {
      const moves = chess.moves();
      move = moves[Math.floor(Math.random() * moves.length)];
    } else {
      move = await getBestMove(chess.fen());
    }

    if (!move) break;

    chess.move(move);
    drawBoard();
    encoder.addFrame(ctx);
  }

  encoder.finish();

  await new Promise(resolve => writeStream.on('finish', resolve));
  console.log('✔ chess-ai.gif згенеровано у output/');
}

generateGIF().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
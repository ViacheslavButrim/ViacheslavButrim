import fs from 'fs';
import { Chess } from 'chess.js';

// ================= CONFIG =================
const BOARD_SIZE = 600;
const SQUARE = BOARD_SIZE / 8;
const FPS = 30;
const MOVE_FRAMES = 12;
const OUTPUT = './output/chess.svg';

// ================= GAMES =================
const GAMES = [
  `1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 0-1`,
  `1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6 8.cxd5 Nxd5 1-0`,
  `1.c4 g6 2.Nc3 Bg7 3.d4 d6 4.e4 Nc6 5.Nf3 Bg4 6.Be3 e5 7.d5 Nd4 0-1`,
  // 👉 додавай скільки хочеш
];

// ================= RANDOM START =================
const startIndex = Math.floor(Math.random() * GAMES.length);
let gameIndex = startIndex;

function getNextGame() {
  const pgn = GAMES[gameIndex];
  gameIndex = (gameIndex + 1) % GAMES.length;
  return pgn;
}

console.log(`♟ Start game: ${startIndex + 1}/${GAMES.length}`);

// ================= SVG HELPERS =================
function squareColor(x, y) {
  return (x + y) % 2 === 0 ? '#111' : '#1e1e1e';
}

function drawBoard() {
  let svg = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      svg += `<rect x="${x * SQUARE}" y="${y * SQUARE}" width="${SQUARE}" height="${SQUARE}" fill="${squareColor(x, y)}"/>`;
    }
  }
  return svg;
}

function pieceChar(piece) {
  const map = {
    p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
    P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔',
  };
  return map[piece];
}

function drawPieces(board) {
  let svg = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const piece = board[y][x];
      if (!piece) continue;
      const char = pieceChar(
        piece.color === 'w'
          ? piece.type.toUpperCase()
          : piece.type
      );
      svg += `
        <text
          x="${x * SQUARE + SQUARE / 2}"
          y="${y * SQUARE + SQUARE * 0.72}"
          font-size="${SQUARE * 0.75}"
          text-anchor="middle"
          fill="${piece.color === 'w' ? '#eaeaea' : '#888'}"
        >${char}</text>`;
    }
  }
  return svg;
}

// ================= ANIMATION =================
function generateSVG() {
  let frames = [];
  let chess = new Chess();

  const pgn = getNextGame();
  chess.loadPgn(pgn);
  const moves = chess.history();

  chess.reset();

  frames.push(`
    <g>${drawBoard()}${drawPieces(chess.board())}</g>
  `);

  for (const move of moves) {
    chess.move(move);
    frames.push(`
      <g>${drawBoard()}${drawPieces(chess.board())}</g>
    `);
  }

  return `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${BOARD_SIZE}" height="${BOARD_SIZE}"
     viewBox="0 0 ${BOARD_SIZE} ${BOARD_SIZE}">
  <rect width="100%" height="100%" fill="#000"/>
  <g>
    <animate
      attributeName="opacity"
      dur="${frames.length / FPS}s"
      repeatCount="indefinite"
    />
  </g>

  ${frames
    .map(
      (f, i) => `
      <g opacity="0">
        ${f}
        <animate
          attributeName="opacity"
          from="0" to="1"
          dur="${1 / FPS}s"
          begin="${i / FPS}s"
          fill="freeze"
        />
      </g>`
    )
    .join('\n')}
</svg>`;
}

// ================= RUN =================
fs.writeFileSync(OUTPUT, generateSVG(), 'utf8');
console.log('✅ SVG generated:', OUTPUT);

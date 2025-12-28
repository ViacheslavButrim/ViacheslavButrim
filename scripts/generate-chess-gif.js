const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

// ================= SIZES =================
const boardSize = 400;
const sidebarWidth = 300; // трохи ширше для красивого тексту
const canvasWidth = boardSize + sidebarWidth;
const canvasHeight = boardSize;
const squareSize = boardSize / 8;

// ================= TIMING =================
const MOVE_DELAY = 1000;
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

// ================= DRAW TEXT =================
function drawSidebar(text) {
  const xStart = boardSize + 20; // відступ від дошки
  const maxWidth = sidebarWidth - 40; // padding
  ctx.fillStyle = '#22d3ee';
  ctx.font = '18px "Courier New", monospace';
  ctx.textBaseline = 'top';

  const paragraphs = text.split('\n');

  // вирівнювання по центру
  const totalHeight = paragraphs.length * 24 + (paragraphs.length - 1) * 8;
  let y = (canvasHeight - totalHeight) / 2;

  for (const p of paragraphs) {
    const textWidth = ctx.measureText(p).width;
    const x = xStart + (maxWidth - textWidth) / 2;
    ctx.fillText(p, x, y);
    y += 32; // висота рядка + відстань між рядками
  }
}

// ================= DRAW FRAME =================
function drawFrame(chess, sidebarText) {
  // фон прозорий, нічого не малюємо
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // дошка
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

  // текст справа
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
  }

  // фінальні кадри
  for (let i = 0; i < END_FRAMES; i++) {
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

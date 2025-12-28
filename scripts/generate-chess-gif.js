const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const boardSize = 400; // шахівниця 400x400
const textWidth = 400; // місце для тексту праворуч
const canvasWidth = boardSize + textWidth;
const canvasHeight = boardSize;

const squareSize = boardSize / 8;

const MOVE_DELAY = 1000;
const END_FRAMES = 20;

// PGN партії
const GAMES = [
  `[Event "January 07 Late 2025"]
[Date "2025.01.07"]
[White "Magnus Carlsen"]
[Black "Jose Carlos Ibarra Jerez"]
[Result "1-0"]
1. h4 e5 2. c4 Nf6 3. e3 c6 4. g4 g6 5. d4 d6 6. g5 Nh5 7. dxe5 dxe5 8. Qxd8+
Kxd8 9. Nf3 Bg7 10. Nc3 Bg4 11. Be2 Nd7 12. Nd2 Bxe2 13. Kxe2 h6 14. Nde4 hxg5
15. Nxg5 Ke7 16. b3 Ke8 17. Nce4 Bf8 18. Bb2 f5 19. Ng3 Bd6 20. Rad1 Ke7 21. Rd2
Nxg3+ 22. fxg3 Bb4 23. Rd3 e4 24. Rd4 Rh5 25. Rhd1 Nf6 26. a3 Bc5 27. R4d2 Re8
28. b4 Bb6 29. Rd6 Rf8 30. Re6# 1-0`
];

const startIndex = Math.floor(Math.random() * GAMES.length);
const RANDOMIZED_GAMES = [...GAMES.slice(startIndex), ...GAMES.slice(0, startIndex)];

const encoder = new GIFEncoder(canvasWidth, canvasHeight);
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};
let boardImage;

async function loadAssets() {
  try {
    for (const c of ['w','b']) {
      for (const p of pieces) {
        const imgPath = path.join(__dirname, 'assets', 'pieces', `${c}${p}.png`);
        pieceImages[c+p] = await loadImage(imgPath);
      }
    }
    boardImage = await loadImage(path.join(__dirname, 'assets', 'dashboard.png'));
    console.log('✔ Assets loaded');
  } catch (err) {
    console.error('❌ Error loading assets:', err);
  }
}

function drawFrame(chess, gameText) {
  // чисте полотно
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // малюємо шахівницю
  ctx.drawImage(boardImage, 0, 0, boardSize, boardSize);

  // малюємо фігури
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

  // малюємо текст праворуч
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px monospace';
  ctx.textBaseline = 'top';

  const lines = gameText.split('\n');
  lines.forEach((line, i) => {
    ctx.fillText(line, boardSize + 10, 10 + i * 18);
  });
}

async function playGame(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const moves = chess.history();
  chess.reset();

  for (const m of moves) {
    chess.move(m);
    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess, pgn);
    encoder.addFrame(ctx);
  }

  // додаткові кадри наприкінці
  for (let i = 0; i < END_FRAMES; i++) {
    drawFrame(chess, pgn);
    encoder.addFrame(ctx);
  }
}

(async () => {
  await loadAssets();

  const outputDir = path.join(process.cwd(), 'output');
  fs.mkdirSync(outputDir, { recursive: true });
  const gifPath = path.join(outputDir, 'chess-ai.gif');

  encoder.createReadStream().pipe(fs.createWriteStream(gifPath));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setQuality(10);

  for (const g of RANDOMIZED_GAMES) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

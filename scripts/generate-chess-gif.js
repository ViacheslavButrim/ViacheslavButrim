const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const boardSize = 400;
const canvasWidth = boardSize;
const canvasHeight = boardSize;
const squareSize = boardSize / 8;

const MOVE_DELAY = 1000;   
const END_FRAMES = 5;      
const PAUSE_BETWEEN_GAMES = 2000; 

// ================= GAMES =================
const GAMES = [
`1. b3 b6 2. Bb2 Bb7 3. e3 Nf6 4. Nf3 e6 5. g3 c5 6. Bg2 Qc7 7. O-O Be7 8. d4 d6
9. c4 cxd4 10. exd4 a6 11. Nc3 Nbd7 12. d5 e5 13. Nh4 O-O 14. Nf5 Rae8 15. Nxe7+
Rxe7 16. a4 Rfe8 17. Bc1 h6 18. Be3 Bc8 19. h3 Nf8 20. Qd2 N6d7 21. a5 bxa5 22.
Ne2 f5 23. Qxa5 Qb8 24. Qa3 Ng6 25. Bd2 Nc5 26. Bb4 Rc7 27. Ba5 Rf7 28. b4 Ne4
29. c5 Nd2 30. Rfd1 Nc4 31. Qd3 Nxa5 32. bxa5 dxc5 33. d6 e4 34. Qc3 Bd7 35.
Qxc5 f4 36. Qh5 f3 37. Qxg6 fxg2 38. Nf4 e3 39. fxe3 Rxe3 40. Rab1 Qa7 41. Rb6
Bf5 42. Qh5 Qd7 43. Nd5 Rxg3 44. Ne7+ Kh7 45. Qxf7 Rxh3 46. Qg8# 1-0`,
  `1. b3 Nf6 2. Bb2 g6 3. Bxf6 exf6 4. e3 d5 5. d4 c6 6. Ne2 Bd6 7. c4 Be6 8. cxd5
Bxd5 9. Nbc3 Qa5 10. f3 f5 11. Kf2 Be6 12. h4 h5 13. a3 O-O 14. g3 Nd7 15. b4
Qc7 16. Nf4 Rae8 17. Rc1 Qb8 18. Bd3 Nf6 19. Qd2 Re7 20. Rhe1 Rfe8 21. Bb1 Bc4
22. Ba2 Bxa2 23. Qxa2 Qd8 24. Nxg6 Re6 25. Nf4 Bxf4 26. gxf4 Nd5 27. Rg1+ Kh8
28. Nxd5 Qxh4+ 29. Kf1 Qh3+ 30. Kf2 Qh2+ 31. Rg2 Qh4+ 32. Kg1 cxd5 33. Rh2 Rg6+
34. Kf1 Qg3 35. Rxh5+ Kg7 36. Qf2 Rxe3 37. Qxe3 Qg2+ 38. Ke1 Kf8 39. Rc8+ Kg7
40. Rg8+ Kxg8 41. Qe8+ Kg7 42. Qh8# 1-0`,
  `1. h4 e5 2. c4 Nf6 3. e3 c6 4. g4 g6 5. d4 d6 6. g5 Nh5 7. dxe5 dxe5 8. Qxd8+
Kxd8 9. Nf3 Bg7 10. Nc3 Bg4 11. Be2 Nd7 12. Nd2 Bxe2 13. Kxe2 h6 14. Nde4 hxg5
15. Nxg5 Ke7 16. b3 Ke8 17. Nce4 Bf8 18. Bb2 f5 19. Ng3 Bd6 20. Rad1 Ke7 21. Rd2
Nxg3+ 22. fxg3 Bb4 23. Rd3 e4 24. Rd4 Rh5 25. Rhd1 Nf6 26. a3 Bc5 27. R4d2 Re8
28. b4 Bb6 29. Rd6 Rf8 30. Re6# 1-0`
];

function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const encoder = new GIFEncoder(canvasWidth, canvasHeight);
const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const pieces = ['K', 'Q', 'R', 'B', 'N', 'P'];
const pieceImages = {};
let boardImage;

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

async function playGame(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);

  const moves = chess.history();
  chess.reset();

  for (const m of moves) {
    chess.move(m);
    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess);
    encoder.addFrame(ctx);
  }

  encoder.setDelay(PAUSE_BETWEEN_GAMES);
  for (let i = 0; i < END_FRAMES; i++) {
    drawFrame(chess);
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
  encoder.setQuality(15);

  const randomizedGames = shuffleArray(GAMES);

  for (const g of randomizedGames) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

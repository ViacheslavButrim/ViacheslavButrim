const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const boardSize = 360;
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
  `1. e4 c5 2. Nf3 d6 3. c3 Nf6 4. Bd3 Nc6 5. Bc2 Bg4 6. h3 Bh5 7. d3 e6 8. Nbd2 d5
9. Qe2 Be7 10. Nf1 h6 11. Ng3 Bg6 12. O-O Qc7 13. Re1 O-O 14. e5 Nd7 15. h4 Rac8
16. h5 Bh7 17. Bf4 b5 18. a3 a5 19. Nh2 b4 20. Ng4 Kh8 21. Ba4 bxc3 22. bxc3 Rb8
23. Qd2 Rb7 24. Bc2 Rfb8 25. Qd1 Rb2 26. Bc1 R2b7 27. Qe2 Qd8 28. Ba4 Qc7 29.
Kh2 Rb1 30. Bf4 R1b2 31. Qf3 Nb6 32. Bd1 Nd7 33. Ba4 Nb6 34. Bxc6 Qxc6 35. Bc1
Rc2 36. Qxf7 Bh4 37. Nf6 Qb7 38. Qxe6 Rxf2 39. Nxh7 Kxh7 40. Be3 Rff8 41. Bxc5
Qf7 42. Qg6+ Qxg6 43. hxg6+ Kxg6 44. Bxf8 Rxf8 45. Rf1 Rc8 46. Nf5 Bg5 47. Rab1
Na4 48. Rb7 Rxc3 49. Rxg7+ Kh5 50. Kh3 Rxd3+ 51. Ng3+ Rxg3+ 52. Kxg3 Bh4+ 53.
Kh3 Nc3 54. g4# 1-0`,
  `1. b3 d5 2. Bb2 Nf6 3. e3 g6 4. Bxf6 exf6 5. g3 Bd6 6. Bg2 Be6 7. c4 c6 8. cxd5
Bxd5 9. Bxd5 cxd5 10. d4 Qa5+ 11. Kf1 h5 12. Nf3 Nd7 13. Qd3 f5 14. Nc3 Nf6 15.
Kg2 O-O 16. a3 Rac8 17. Rhc1 Ne4 18. b4 Qd8 19. Nd2 h4 20. Ndxe4 dxe4 21. Qb5
Qg5 22. Nxe4 h3+ 23. Kg1 Qe7 24. Nxd6 Qxd6 25. Qxb7 Rb8 26. Qc6 Qe7 27. Qc4 g5
28. Qf1 g4 29. Qd3 Qb7 30. d5 Qd7 31. Rc5 Rb6 32. f3 Re8 33. Rd1 Rd6 34. Kf2
gxf3 35. Qd4 Re4 36. Qc3 Re8 37. Rd4 Rg6 38. Rh4 Rg7 39. Qf6 Qa4 40. Qh6 Kf8 41.
Qf6 Kg8 42. Qh6 Kf8 43. Qh8+ Rg8 44. Qd4 Qb3 45. Qd2 Qb1 46. Rc1 Qb3 47. d6 Rd8
48. Rd4 Rg6 49. d7 Ke7 50. Rc8 Re6 51. Rxd8 Kxd8 52. e4 fxe4 53. Qg5+ f6 54.
Qg8+ Kc7 55. d8=Q+ Kc6 56. Qd7+ Kb6 57. Qb8+ Ka6 58. Qdb5# 1-0`,
  `1. b3 Nf6 2. Bb2 g6 3. Bxf6 exf6 4. e3 d5 5. d4 c6 6. Ne2 Bd6 7. c4 Be6 8. cxd5
Bxd5 9. Nbc3 Qa5 10. f3 f5 11. Kf2 Be6 12. h4 h5 13. a3 O-O 14. g3 Nd7 15. b4
Qc7 16. Nf4 Rae8 17. Rc1 Qb8 18. Bd3 Nf6 19. Qd2 Re7 20. Rhe1 Rfe8 21. Bb1 Bc4
22. Ba2 Bxa2 23. Qxa2 Qd8 24. Nxg6 Re6 25. Nf4 Bxf4 26. gxf4 Nd5 27. Rg1+ Kh8
28. Nxd5 Qxh4+ 29. Kf1 Qh3+ 30. Kf2 Qh2+ 31. Rg2 Qh4+ 32. Kg1 cxd5 33. Rh2 Rg6+
34. Kf1 Qg3 35. Rxh5+ Kg7 36. Qf2 Rxe3 37. Qxe3 Qg2+ 38. Ke1 Kf8 39. Rc8+ Kg7
40. Rg8+ Kxg8 41. Qe8+ Kg7 42. Qh8# 1-0`,
  `1. b3 d5 2. Bb2 Nf6 3. d3 c5 4. Nd2 Nc6 5. Ngf3 Qc7 6. e4 d4 7. c3 e5 8. cxd4
cxd4 9. Rc1 Bd6 10. Be2 O-O 11. O-O Qe7 12. Nc4 Be6 13. Nxd6 Qxd6 14. Qc2 Rfc8
15. Nd2 b5 16. Qb1 h6 17. Rc2 Nb4 18. Rxc8+ Rxc8 19. Rc1 Rxc1+ 20. Bxc1 Qc5 21.
Ba3 a5 22. Nf3 Nd7 23. Ne1 Qc3 24. Bb2 Qc7 25. h4 Nc5 26. Ba3 Nba6 27. Bc1 b4
28. Bd2 Qd6 29. h5 Nc7 30. f4 exf4 31. Qc1 Nb5 32. Bxf4 Qb6 33. Bxh6 gxh6 34.
Qxh6 Qd8 35. Nf3 Nc3 36. Bf1 Nd7 37. e5 Qf8 38. Qg5+ Kh8 39. Qf4 Qg7 40. Nxd4
Qxe5 41. Qh6+ Kg8 42. Nc6 Qc5+ 43. d4 Qxc6 44. Qg5+ Kf8 45. Qd8+ Kg7 46. Qg5+
Kf8 47. h6 Qe4 48. Qd8# 1-0`,
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
  encoder.setQuality(1);

  const randomizedGames = shuffleArray(GAMES);

  for (const g of randomizedGames) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

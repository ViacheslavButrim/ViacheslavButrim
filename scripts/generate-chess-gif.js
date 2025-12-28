const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

// ================= SIZES =================
const boardSize = 400;
const canvasWidth = boardSize;
const canvasHeight = boardSize;
const squareSize = boardSize / 8;

// ================= TIMING =================
const MOVE_DELAY = 1000;    // затримка на хід
const END_FRAMES = 5;       // фінальні кадри партії
const PAUSE_BETWEEN_GAMES = 200; // пауза між партіями (мс)

// ================= GAMES =================
const GAMES = [
  `1. h4 e5 2. c4 Nf6 3. e3 c6 4. g4 g6 5. d4 d6 6. g5 Nh5 7. dxe5 dxe5 8. Qxd8+
Kxd8 9. Nf3 Bg7 10. Nc3 Bg4 11. Be2 Nd7 12. Nd2 Bxe2 13. Kxe2 h6 14. Nde4 hxg5
15. Nxg5 Ke7 16. b3 Ke8 17. Nce4 Bf8 18. Bb2 f5 19. Ng3 Bd6 20. Rad1 Ke7 21. Rd2
Nxg3+ 22. fxg3 Bb4 23. Rd3 e4 24. Rd4 Rh5 25. Rhd1 Nf6 26. a3 Bc5 27. R4d2 Re8
28. b4 Bb6 29. Rd6 Rf8 30. Re6# 1-0`,
  `1. h4 d5 2. d4 Nf6 3. e3 Bf5 4. f3 h5 5. c4 e6 6. Nc3 c5 7. cxd5 exd5 8. Bd3
Bxd3 9. Qxd3 Nc6 10. Nge2 Be7 11. Bd2 O-O 12. Kf2 Rc8 13. Rad1 Re8 14. g3 Bd6
15. Kg2 cxd4 16. exd4 Qb6 17. Bg5 Nh7 18. Bf4 Bxf4 19. Nxf4 Qxb2+ 20. Rd2 Nb4
21. Qxh7+ Kxh7 22. Rxb2 Rxc3 23. Rxb4 Rc2+ 24. Kh3 Kh6 25. Rxb7 f6 26. Rxa7 g5
27. hxg5+ fxg5 28. Ra6+ 1-0`,
  `1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bf4 O-O 6. e3 c5 7. dxc5 Bxc5 8. Be2
dxc4 9. Qc2 Nc6 10. Bxc4 h6 11. O-O Qe7 12. Rfd1 Bd7 13. Ne4 Nxe4 14. Qxe4 Rac8
15. a3 Rfd8 16. h4 Be8 17. Rxd8 Rxd8 18. Rc1 Bd6 19. Bd3 f5 20. Qc4 Bf7 21. Bxd6
Qxd6 22. Be2 e5 23. Qb5 e4 24. Nh2 f4 25. Rd1 Qc7 26. Rxd8+ Nxd8 27. Nf1 fxe3
28. Nxe3 Ne6 29. Bc4 a6 30. Qf5 Nd4 31. Qxe4 Bxc4 32. Qxd4 Be6 33. f3 Kf7 34.
Kf2 b5 35. g4 Qh2+ 36. Ng2 Kg8 37. Qf4 Qh1 38. Qe5 Bc4 39. Qe8+ Kh7 40. Qe1 Qh2
41. b3 Bd5 42. Qd1 Bf7 43. Qd4 Kg8 44. b4 Bc4 45. a4 Qh1 46. a5 1-0`,
  `1. d4 d5 2. c4 e6 3. Nf3 Nf6 4. g3 Be7 5. Bg2 O-O 6. O-O dxc4 7. Nc3 a6 8. Ne5
Ra7 9. Nxc4 b5 10. Ne5 Bb7 11. Bxb7 Rxb7 12. Be3 Nd5 13. Nxd5 Qxd5 14. Qb3 Rd8
15. Rfc1 c5 16. dxc5 Qxe5 17. c6 Nxc6 18. Rxc6 a5 19. Rd1 Rxd1+ 20. Qxd1 h6 21.
Rc8+ Kh7 22. Qc2+ Qf5 23. Qc6 Qd5 24. Qxd5 exd5 25. Bd4 Kg6 26. Kg2 f6 27. Kf3
Kf5 28. Rc6 a4 29. g4+ Kg6 30. h4 Kf7 31. h5 b4 32. Bc5 a3 33. b3 Bxc5 34. Rxc5
Ke6 35. Ke3 Kd6 36. Kd4 Ke6 37. f4 f5 38. Rc6+ Kd7 39. Rg6 fxg4 40. Rxg7+ Kc6
41. Rxg4 Re7 42. e3 Re4+ 43. Kd3 Kc5 44. Rg6 Re8 45. Rxh6 Rg8 46. Rg6 Rh8 47. h6
1-0`,
  `1. e4 d5 2. exd5 Qxd5 3. Nc3 Qe5+ 4. Be2 Bg4 5. d4 Bxe2 6. Ncxe2 Qa5+ 7. c3 Nf6
8. Nf3 e6 9. O-O Bd6 10. c4 c6 11. Nc3 O-O 12. Re1 Nbd7 13. c5 Be7 14. a3 Qc7
15. g3 b6 16. Bf4 Qb7 17. b4 a5 18. Rb1 axb4 19. axb4 Rfd8 20. Qc2 Nf8 21. h4
Nd5 22. Bg5 f6 23. Bd2 Nxc3 24. Qxc3 Rd5 25. Kg2 Rad8 26. Ra1 e5 27. cxb6 exd4
28. Qc4 Bd6 29. Nxd4 Rc8 30. Nf5 Kh8 31. Ra7 Qxb6 32. Rxg7 Qb5 33. Qg4 Ng6 34.
Rxh7+ Kxh7 35. Qh5+ Kg8 36. Qxg6+ Kf8 37. Qg7# 1-0`,
  `1. Nf3 c5 2. e4 e6 3. b3 Nc6 4. Bb2 a6 5. g3 d5 6. d3 d4 7. Nbd2 e5 8. Nc4 Qc7
9. a4 Be6 10. a5 Bxc4 11. bxc4 Nxa5 12. Nxe5 Bd6 13. Nf3 Nc6 14. Bg2 Nge7 15.
O-O h5 16. Bc1 h4 17. Ng5 Ng6 18. f4 Be7 19. Qg4 Nb4 20. Rf2 hxg3 21. hxg3 Qc8
22. Qf5 O-O 23. Nxf7 Qxf5 24. exf5 Kxf7 25. fxg6+ Kxg6 26. Bxb7 Ra7 27. Be4+ Kf7
28. Ra5 Rc8 29. Ba3 Bd8 30. Bxb4 cxb4 31. Rf5+ Ke8 32. Re2 Be7 33. Bf3 a5 34.
Bh5+ Kd7 35. Rxe7+ 1-0`,
  `1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Qa4+ Nd7 8.
Nf3 O-O 9. Bg5 c5 10. Rd1 cxd4 11. cxd4 Nf6 12. Bd3 Bg4 13. O-O Bxf3 14. gxf3
Nh5 15. Be2 Bf6 16. Be3 Qc8 17. Kg2 e5 18. d5 Qd8 19. d6 Bg5 20. Kh1 Bf4 21. Rg1
Qh4 22. Rg2 Rfd8 23. Qb3 Bxe3 24. fxe3 Rxd6 25. Rxd6 Qe1+ 26. Rg1 Qxe2 27. Qd1
Qxe3 28. Re1 Qg5 29. Rd7 Nf4 30. Rg1 Qf6 31. Rxb7 Rd8 32. Rd7 Rxd7 33. Qxd7 Ne2
34. Rf1 Nf4 35. Qxa7 Qg5 36. Qf2 h5 37. a4 Nd3 38. Qe2 Nf4 39. Qd2 Qf6 40. a5
Qa6 41. Re1 Ne6 42. Qc3 Nd4 43. Kg2 Qf6 44. Rf1 h4 45. Kh1 Qa6 46. Re1 Kg7 47.
f4 f6 48. fxe5 fxe5 49. Qc7+ Kh6 50. Qxe5 Qd3 51. Qh8+ Kg5 52. Rg1+ Kf4 53.
Qxh4+ Ke3 54. Rg3+ Nf3 55. Rxf3+ 1-0`,
  `1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Qa4+ Nd7 8.
Nf3 O-O 9. Bg5 c5 10. Rd1 cxd4 11. cxd4 Nf6 12. Bd3 Bg4 13. O-O Bxf3 14. gxf3
Nh5 15. Be2 Bf6 16. Be3 Qc8 17. Kg2 e5 18. d5 Qd8 19. d6 Bg5 20. Kh1 Bf4 21. Rg1
Qh4 22. Rg2 Rfd8 23. Qb3 Bxe3 24. fxe3 Rxd6 25. Rxd6 Qe1+ 26. Rg1 Qxe2 27. Qd1
Qxe3 28. Re1 Qg5 29. Rd7 Nf4 30. Rg1 Qf6 31. Rxb7 Rd8 32. Rd7 Rxd7 33. Qxd7 Ne2
34. Rf1 Nf4 35. Qxa7 Qg5 36. Qf2 h5 37. a4 Nd3 38. Qe2 Nf4 39. Qd2 Qf6 40. a5
Qa6 41. Re1 Ne6 42. Qc3 Nd4 43. Kg2 Qf6 44. Rf1 h4 45. Kh1 Qa6 46. Re1 Kg7 47.
f4 f6 48. fxe5 fxe5 49. Qc7+ Kh6 50. Qxe5 Qd3 51. Qh8+ Kg5 52. Rg1+ Kf4 53.
Qxh4+ Ke3 54. Rg3+ Nf3 55. Rxf3+ 1-0`,
  `1. d4 e6 2. c4 b6 3. Nf3 Bb7 4. g3 Nf6 5. Bg2 g6 6. Nc3 Bg7 7. d5 O-O 8. O-O Na6
9. e4 exd5 10. cxd5 c6 11. d6 Re8 12. Re1 Ng4 13. Bg5 Bf6 14. Bxf6 Qxf6 15. h3
Ne5 16. Nxe5 Qxe5 17. f4 Qc5+ 18. Kh2 Nb4 19. a3 Na6 20. e5 f5 21. Rc1 Qa5 22.
g4 Rf8 23. e6 dxe6 24. Re5 b5 25. Rxe6 Rad8 26. Re7 Qb6 27. Qb3+ Kh8 28. Qe6 Qd4
29. Ne2 Qxd6 30. Qxd6 Rxd6 31. Rxb7 Rd2 32. Rxc6 Nb8 33. Rcc7 Re8 34. Rxh7+ 1-0`,
  `1. d4 d5 2. c4 Nc6 3. Nc3 dxc4 4. d5 Ne5 5. Nf3 Nxf3+ 6. exf3 e6 7. Bxc4 c6 8.
dxe6 Qxd1+ 9. Kxd1 Bxe6 10. Bxe6 fxe6 11. Ke2 Nf6 12. Be3 Nd5 13. a4 Bb4 14. Ne4
O-O-O 15. a5 a6 16. Ra4 e5 17. Rc1 Rd7 18. g3 Rhd8 19. Bc5 Bxc5 20. Nxc5 Rd6 21.
Re4 Nf6 22. Rb4 Rd2+ 23. Ke1 Nd5 24. Rxb7 Rd4 25. Ra7 Kb8 26. Rxa6 Nb4 27. Rb6+
Kc7 28. Rxb4 Rxb4 29. Na6+ 1-0`,
  `1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3 Bg7 7. Bb5+ c6 8.
Ba4 b5 9. Bb3 b4 10. Nf3 O-O 11. cxb4 Bg4 12. Be3 a5 13. bxa5 Qxa5+ 14. Qd2 Qb5
15. Rc1 Rd8 16. Bc4 Qa4 17. Ng5 e6 18. h3 h6 19. Nxf7 Kxf7 20. hxg4 g5 21. O-O
Bxd4 22. Bxd4 c5 23. f4 Rxd4 24. fxg5+ Ke7 25. Qf4 Nd7 26. Qf7+ Kd6 27. Qxe6+
Kc7 28. gxh6 Rb8 29. Bb3 Qa3 30. Rcd1 Qb2 31. h7 Qc3 32. Rxd4 Qxd4+ 33. Kh1 Rb6
34. Qxb6+ Kxb6 35. Rd1 Qg7 36. Rxd7 Qh6+ 37. Kg1 Qe3+ 38. Kh2 Qf4+ 39. Kh3 Qh6+
40. Kg3 Qe3+ 41. Kh2 Qf4+ 42. g3 Qf2+ 43. Kh3 Qf1+ 44. Kh4 Qf6+ 45. g5 Qa1 46.
Rd1 Qc3 47. Rd8 Qg7 48. h8=Q 1-0`,
  `1. d4 d5 2. c4 Nc6 3. Nc3 Nf6 4. Nf3 dxc4 5. e4 Bg4 6. d5 Ne5 7. Bf4 Bxf3 8.
gxf3 Ng6 9. Be3 c6 10. Bxc4 Ne5 11. Bb3 g6 12. f4 Ned7 13. dxc6 bxc6 14. e5 Nh5
15. Ba4 Rc8 16. Qf3 Qc7 17. Rc1 Bh6 18. O-O O-O 19. Nd5 Nxe5 20. fxe5 Qxe5 21.
Bxh6 cxd5 22. Rce1 Qd6 23. Bxf8 Rxf8 24. Qe3 e6 25. Bd1 Nf4 26. Qe5 Qb4 27. a3
Nh3+ 28. Kg2 Qh4 29. f4 Re8 30. Qe3 1-0`
];

// ================= RANDOMIZE ARRAY =================
function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

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

// ================= DRAW FRAME =================
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

// ================= PLAY GAME =================
async function playGame(pgn) {
  const chess = new Chess();
  chess.loadPgn(pgn);

  const moves = chess.history();
  chess.reset();

  // основні ходи
  for (const m of moves) {
    chess.move(m);
    encoder.setDelay(MOVE_DELAY);
    drawFrame(chess);
    encoder.addFrame(ctx);
  }

  // фінальні кадри партії (короткі)
  encoder.setDelay(PAUSE_BETWEEN_GAMES);
  for (let i = 0; i < END_FRAMES; i++) {
    drawFrame(chess);
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

  // Рандомний порядок партій
  const randomizedGames = shuffleArray(GAMES);

  for (const g of randomizedGames) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif generated');
})();

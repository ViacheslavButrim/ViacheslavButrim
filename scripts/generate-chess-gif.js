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
Nh3+ 28. Kg2 Qh4 29. f4 Re8 30. Qe3 1-0`,
  `1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 dxc4 5. e4 b5 6. Nxb5 Nxe4 7. Qa4 Bd7 8.
Qxc4 Bd6 9. d5 Nf6 10. Nxd6+ cxd6 11. dxe6 Bxe6 12. Qa4+ Nbd7 13. Be2 O-O 14.
O-O Re8 15. Re1 Nc5 16. Qa3 Bd5 17. Be3 Nce4 18. h3 Qd7 19. Rad1 Bc6 20. Nd4 Nd5
21. Bg4 Qb7 22. Nxc6 Nxe3 23. Na5 Qb6 24. Rxe3 Nxf2 25. Kxf2 Rxe3 26. Qxe3 Qxa5
27. a3 g6 28. Rxd6 Qc7 29. Qd4 Re8 30. Bf3 Qc2+ 31. Kg3 h5 32. Kh2 1-0`,
  `1. e4 c5 2. b3 Nf6 3. e5 Nd5 4. Bb2 e6 5. Nc3 Nxc3 6. dxc3 d5 7. exd6 Qxd6 8.
Nf3 Nc6 9. Qe2 a6 10. g3 f6 11. Bg2 Be7 12. Nd2 O-O 13. O-O-O Qc7 14. Rhe1 b5
15. c4 b4 16. f4 Rb8 17. Bh3 a5 18. Bxe6+ Bxe6 19. Qxe6+ Kh8 20. Nf3 Rbd8 21.
Nh4 Rxd1+ 22. Rxd1 Rd8 23. Rxd8+ Nxd8 24. Qd5 Qd6 25. Nf5 Qc7 26. a4 h6 27. Kb1
Bf8 28. h4 Nf7 29. h5 Nd6 30. Nh4 Qf7 31. Ng6+ Kg8 32. Qxc5 Qe6 33. Qxa5 Ne4 34.
Qa8 Nd2+ 35. Ka2 Qd6 36. Nxf8 Qxf8 37. Qd5+ Qf7 38. Qxd2 Kf8 39. Qd8+ Qe8 40.
Qxe8+ Kxe8 41. a5 Kd7 42. a6 Kc6 43. Bd4 Kc7 44. f5 Kb8 45. g4 Ka8 46. c3 bxc3
47. Kb1 Kb8 48. Kc2 Ka8 49. b4 Kb8 50. b5 Ka8 51. b6 Kb8 52. c5 Ka8 53. c6 Kb8
54. a7+ 1-0`,
  `1. c4 c5 2. Nc3 Nc6 3. g3 g6 4. Bg2 Bg7 5. d3 d6 6. Qd2 e6 7. b3 Nge7 8. Bb2 O-O
9. h4 h6 10. h5 g5 11. f4 g4 12. e4 f5 13. Nge2 a6 14. O-O-O Rb8 15. exf5 Nxf5
16. Bxc6 bxc6 17. Ne4 Nd4 18. Nxd4 cxd4 19. c5 dxc5 20. Ba3 Rf5 21. Bxc5 Rb5 22.
Bd6 Bb7 23. Be5 c5 24. Bxg7 Kxg7 25. Qe2 Qa5 26. Nd6 Bxh1 27. Rxh1 Qc3+ 28. Kb1
Rxb3+ 29. axb3 Qxb3+ 30. Qb2 Qxd3+ 31. Qc2 Qxc2+ 32. Kxc2 Rd5 33. Nc4 Kf6 34.
Kd3 Rd7 35. Ra1 Rb7 36. Nd2 Rb5 37. Rxa6 Kf5 38. Ra8 Rb2 39. Rf8# 1-0`,
  `1. e4 c5 2. Nf3 a6 3. a3 d6 4. b4 Nf6 5. bxc5 Nxe4 6. cxd6 Nxd6 7. Bb2 Nc6 8. d4
Bg4 9. d5 Na5 10. Nbd2 Rc8 11. Rb1 b5 12. a4 Qc7 13. axb5 axb5 14. Bd3 Nac4 15.
O-O Nxb2 16. Rxb2 g6 17. Rb4 Bxf3 18. Qxf3 Bg7 19. Rxb5 Nxb5 20. Bxb5+ Kf8 21.
c4 Bd4 22. Qd3 Bc5 23. Ne4 Kg7 24. Qc3+ f6 25. Ng5 Qe5 26. Qxe5 fxe5 27. Bd7 Kf6
28. Ne4+ Kg7 29. Bxc8 Rxc8 30. Rc1 Bd4 31. c5 h6 32. Kf1 Kf7 33. Ke2 Ra8 34. c6
Ke8 35. d6 exd6 36. Nxd6+ Ke7 37. c7 1-0`,
  `1. d4 Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 dxc4 5. e4 Bb4 6. Bg5 h6 7. Bxf6 Qxf6 8.
Bxc4 c5 9. O-O cxd4 10. e5 Qd8 11. Nxd4 O-O 12. Qg4 Nd7 13. Nxe6 fxe6 14. Bxe6+
Kh8 15. Qxb4 Nxe5 16. Rad1 Qe8 17. Bd5 Bf5 18. Rfe1 Nd3 19. Rxe8 Nxb4 20. Rxa8
Rxa8 21. Bxb7 Rb8 22. Bf3 Nd3 23. b3 Rc8 24. Nd5 Bh7 25. Ne3 Rc1 26. Be2 Rxd1+
27. Nxd1 Nc1 28. Nc3 Bb1 29. Nxb1 Nxe2+ 30. Kf1 Nf4 31. g3 Nd5 32. Ke2 g5 33.
Kd2 Kg7 34. Nc3 Nb4 35. a3 Nc6 36. Ke3 Kf6 37. Ke4 Ke6 38. Nb5 Na5 39. Nd4+ Kd6
40. f4 gxf4 41. gxf4 Nb7 42. Nf5+ Ke6 43. b4 a5 44. Nxh6 axb4 45. axb4 Nd6+ 46.
Kd4 Kf6 47. Kd5 Nb5 48. Kc5 Nc3 49. b5 Kg6 50. Ng4 Kf5 51. h3 Kxf4 52. b6 Na4+
53. Kc6 Nxb6 54. Kxb6 Kg3 55. Nf2 Kxf2 56. h4 1-0`,
  `1. Nh3 g6 2. e4 Bg7 3. Nc3 c6 4. Bc4 d6 5. Ng5 e6 6. d4 d5 7. Bb3 dxe4 8. Ncxe4
Nf6 9. Nxf7 Kxf7 10. Ng5+ Ke7 11. O-O h6 12. Nxe6 Bxe6 13. Re1 Nd5 14. Qg4 Qg8
15. c4 Nf6 16. Qxg6 Qf7 17. Rxe6+ Kxe6 18. c5+ Ke7 19. Qxf7+ Kd8 20. Qxg7 1-0`,
  `1. h3 d5 2. d4 Nf6 3. Nf3 c5 4. e3 Nc6 5. c4 e6 6. Nc3 a6 7. cxd5 exd5 8. Bd3 c4
9. Bc2 Bb4 10. O-O O-O 11. Ne5 Re8 12. f4 Ne7 13. g4 Bxc3 14. bxc3 Ne4 15. Ba3
Nxc3 16. Qe1 Nb5 17. Bxh7+ Kxh7 18. Nxf7 Qb6 19. Bxe7 Kg8 20. Bc5 Qf6 21. Ne5 b6
22. a4 bxc5 23. axb5 cxd4 24. exd4 Qb6 25. Qe3 a5 26. f5 a4 27. g5 Ra7 28. f6
Qe6 29. Qg3 Rf8 30. Ra3 Qd6 31. Kh2 Be6 32. Raf3 a3 33. b6 Rb7 34. Rxa3 Rxb6 35.
Raf3 Rb2+ 36. R1f2 Rxf2+ 37. Rxf2 Rc8 38. f7+ Bxf7 39. Rxf7 c3 40. Rf1 c2 41.
Qf4 Qb6 42. Rc1 Rf8 43. Qd2 Qb5 44. Rxc2 Qf1 45. g6 Qf5 46. Rc3 Qh5 47. Rg3 Qh4
48. Ng4 1-0`,
  `1. Nh3 d5 2. d4 Bxh3 3. gxh3 Nf6 4. c4 e6 5. Nc3 Bb4 6. Rg1 O-O 7. Bg5 c6 8. Qb3
a5 9. e4 dxe4 10. O-O-O Bxc3 11. Qxc3 Nbd7 12. Kb1 a4 13. d5 cxd5 14. cxd5 e5
15. Bb5 Qb6 16. Bh6 g6 17. Bxd7 Nxd7 18. Bxf8 Rxf8 19. Rd2 Qc5 20. Rc1 b6 21. d6
f5 22. Qc4+ Qxc4 23. Rxc4 Kf7 24. Rxa4 Ke6 25. Rc4 g5 26. a4 h5 27. b4 g4 28.
hxg4 hxg4 29. a5 bxa5 30. bxa5 Ra8 31. Ra2 Kd5 32. Rc1 Ra6 33. Rd1+ Ke6 34. Kc2
f4 35. Kc3 1-0`,
  `1. b4 e5 2. Bb2 Bxb4 3. Bxe5 Nf6 4. c3 Be7 5. g3 Nc6 6. Bxf6 Bxf6 7. Bg2 O-O 8.
e3 d5 9. Ne2 Ne7 10. O-O c6 11. d4 Bg4 12. Nd2 Re8 13. h3 Bh5 14. g4 Bg6 15. f4
Bd3 16. Nf3 Bxe2 17. Qxe2 Nc8 18. g5 Be7 19. Ne5 Nd6 20. Rab1 Qa5 21. c4 dxc4
22. Nxc4 Nxc4 23. Qxc4 Qc7 24. e4 Rac8 25. e5 Red8 26. Kh2 Qd7 27. Rbd1 Qe6 28.
Qc2 g6 29. h4 Rb8 30. f5 Qd7 31. Bh3 Qd5 32. e6 fxe6 33. fxg6 Rf8 34. gxh7+ Kh8
35. Bg4 Bd6+ 36. Kh3 Rxf1 37. Rxf1 Qxd4 38. Qf2 Qd3+ 39. Qf3 Qxf3+ 40. Rxf3 Rf8
41. Rb3 b5 42. Bxe6 Kxh7 43. Rd3 Bb4 44. Rd7+ Kh8 45. g6 1-0`,
  `1. Na3 c5 2. e4 Nc6 3. Bb5 g6 4. f4 Nd4 5. Bc4 Bg7 6. c3 Nc6 7. Nf3 e6 8. Nb5 d6
9. e5 dxe5 10. fxe5 Nxe5 11. Nxe5 Bxe5 12. d4 Qh4+ 13. g3 Bxg3+ 14. hxg3 Qxh1+
15. Bf1 Qc6 16. Bf4 b6 17. dxc5 Kf8 18. Qd6+ Qxd6 19. Bxd6+ Kg7 20. Nc7 Bb7 21.
Nxa8 Bxa8 22. O-O-O Nh6 23. cxb6 axb6 24. Be5+ f6 25. Rd7+ Nf7 26. Bc7 Bc6 27.
Re7 Re8 28. Rxe8 Bxe8 29. Bxb6 Nd6 30. b4 h5 31. c4 Ne4 32. b5 Nxg3 33. Bd3 h4
34. Bf2 g5 35. c5 Nf5 36. c6 Nd6 37. Bc5 1-0`,
  `1. Nf3 c5 2. e3 Nc6 3. Bb5 g6 4. O-O Bg7 5. d4 cxd4 6. exd4 a6 7. Be2 d5 8. c3
Nf6 9. h3 O-O 10. Bf4 Ne4 11. Nbd2 Nd6 12. Re1 Re8 13. Qb3 e6 14. Bd3 Na5 15.
Qc2 Nac4 16. h4 b5 17. h5 Bb7 18. a4 Bc6 19. axb5 Bxb5 20. Nf1 Rc8 21. h6 Bh8
22. N1h2 Nb6 23. Ng4 Nf5 24. Bxb5 axb5 25. Ra7 Nd7 26. Qd3 b4 27. Qb5 Re7 28.
Qxb4 Ra8 29. Rea1 Rc8 30. Rb7 Nf8 31. Raa7 Rxb7 32. Qxb7 Qe8 33. Be5 Bxe5 34.
Nfxe5 Nd6 35. Nf6+ Kh8 36. Qxf7 Nxf7 37. Rxf7 Qd8 38. Rxh7+ Nxh7 39. Nxg6# 1-0`,
  `1. Nf3 Nf6 2. g3 b5 3. Bg2 Bb7 4. O-O b4 5. c4 bxc3 6. bxc3 e6 7. c4 c5 8. Nc3
Nc6 9. Rb1 Rb8 10. d3 Ba8 11. Rxb8 Qxb8 12. Qa4 Bd6 13. Nb5 O-O 14. Nxd6 Qxd6
15. Ba3 Rb8 16. Rd1 Qe7 17. Nd2 Nd4 18. Bxa8 Rxa8 19. Kf1 Qd6 20. e3 Nc6 21. d4
e5 22. d5 Nb4 23. Bxb4 cxb4 24. Qa5 Ng4 25. h3 Nh6 26. Nb3 Nf5 27. c5 Qg6 28.
Qxb4 Nxg3+ 29. fxg3 Qxg3 30. Qg4 Qxe3 31. Kg2 f5 32. Qf3 Qg5+ 33. Kh1 e4 34. Qg2
Qf6 35. d6 Rc8 36. Qd2 Qh4 37. Kg2 Kh8 38. Qf2 Qg5+ 39. Kh1 Qf6 40. Rd5 g6 41.
Qd4 Kg7 42. Qxf6+ Kxf6 43. Nd4 h5 44. c6 Kf7 45. cxd7 Rd8 46. h4 Rxd7 47. Kg2
Kf6 48. Kg3 e3 49. Kf3 a6 50. Kxe3 Rd8 51. Kf4 Rd7 52. a4 a5 53. Ke3 Rd8 54. Nc6
Rd7 55. Kd4 Ke6 56. Kc5 f4 57. Re5+ Kf6 58. Kd5 f3 59. Re3 g5 60. Rxf3+ Kg6 61.
Ne5+ 1-0`,
  `1. d4 d5 2. Nc3 Nf6 3. Bf4 a6 4. e3 h6 5. h4 e6 6. Nf3 b6 7. Ne5 Nfd7 8. Qf3
Nxe5 9. Bxe5 Nd7 10. Bf4 c5 11. Qg3 Bb7 12. O-O-O Rc8 13. e4 cxd4 14. exd5 Nf6
15. dxe6 Nh5 16. Qg4 Nxf4 17. exf7+ Kxf7 18. Qxf4+ Qf6 19. Rxd4 Qxf4+ 20. Rxf4+
Ke8 21. Bd3 Rc7 22. Re1+ Kd8 23. Be4 Bc8 24. Bf5 Bxf5 25. Rxf5 Bc5 26. Ne4 Be7
27. g3 Kc8 28. Re5 Rd8 29. Rd1 Rf8 30. c3 g5 31. hxg5 hxg5 32. Rd2 g4 33. Re6
Kb7 34. Rg6 b5 35. Rxg4 b4 36. Kc2 bxc3 37. bxc3 Rf5 38. a4 Ra5 39. Kb3 Ka7 40.
Rd4 Rb7+ 41. Kc2 Ba3 42. Kd3 Rh5 43. Rg6 Rh1 44. Ke2 Ra1 45. Rc4 Re7 46. Kf3 Bb2
47. Nc5 1-0`,
  `1. d4 d5 2. Nc3 Nf6 3. Bf4 a6 4. e3 h6 5. h4 e6 6. Nf3 b6 7. Ne5 Nfd7 8. Qf3
Nxe5 9. Bxe5 Nd7 10. Bf4 c5 11. Qg3 Bb7 12. O-O-O Rc8 13. e4 cxd4 14. exd5 Nf6
15. dxe6 Nh5 16. Qg4 Nxf4 17. exf7+ Kxf7 18. Qxf4+ Qf6 19. Rxd4 Qxf4+ 20. Rxf4+
Ke8 21. Bd3 Rc7 22. Re1+ Kd8 23. Be4 Bc8 24. Bf5 Bxf5 25. Rxf5 Bc5 26. Ne4 Be7
27. g3 Kc8 28. Re5 Rd8 29. Rd1 Rf8 30. c3 g5 31. hxg5 hxg5 32. Rd2 g4 33. Re6
Kb7 34. Rg6 b5 35. Rxg4 b4 36. Kc2 bxc3 37. bxc3 Rf5 38. a4 Ra5 39. Kb3 Ka7 40.
Rd4 Rb7+ 41. Kc2 Ba3 42. Kd3 Rh5 43. Rg6 Rh1 44. Ke2 Ra1 45. Rc4 Re7 46. Kf3 Bb2
47. Nc5 1-0`,
  `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. d3 b5 6. Bb3 Bc5 7. a4 Rb8 8. axb5
axb5 9. O-O d6 10. Be3 O-O 11. h3 Bxe3 12. fxe3 Be6 13. Bxe6 fxe6 14. Nbd2 d5
15. c3 b4 16. Ra6 bxc3 17. bxc3 Rb6 18. Rxb6 cxb6 19. Qb3 Qd6 20. exd5 exd5 21.
Ne4 Qd8 22. Rb1 Na5 23. Nxf6+ Rxf6 24. Qa2 Nc6 25. e4 Ne7 26. Nxe5 Qc7 27. Ng4
Rd6 28. Rc1 Rd8 29. d4 Qf4 30. Re1 h5 31. Ne5 Qg3 32. Qf2 Qxf2+ 33. Kxf2 dxe4
34. Rxe4 b5 35. Re1 Nd5 36. Rc1 Rc8 37. c4 bxc4 38. Rxc4 Rxc4 39. Nxc4 Kf7 40.
Kf3 g5 41. Ne3 Nf6 42. Ke2 Ke6 43. Kd3 h4 44. Kc4 Kd6 45. d5 Nh5 46. Kd4 Ng3 47.
Nc4+ Kd7 48. Ke5 Nh5 49. Kf5 Nf4 50. Ne3 Kd6 51. Kxg5 Ke5 52. Ng4+ Ke4 53. d6
Ne6+ 54. Kxh4 Kd5 55. d7 Kd6 56. Nf6 Ke7 57. Ne4 Kxd7 58. Kg4 Ke7 59. h4 Nd4 60.
Kg5 Kf7 61. h5 Kg7 62. g4 Ne6+ 63. Kh4 Nd4 64. g5 Nf3+ 65. Kg4 Nd4 66. Nd6 Nc6
67. Nf5+ Kf7 68. Kf4 Nb4 69. Ne3 Nd3+ 70. Kf5 Nc5 71. g6+ Kg7 72. Ng4 Nd7 73.
h6+ Kh8 74. Nf6 1-0`,
  `1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. d3 h6 5. O-O Bc5 6. c3 d6 7. Nbd2 O-O 8. h3
Bb6 9. Re1 a5 10. a4 Be6 11. b3 Re8 12. Bb5 Bd7 13. Nc4 Bc5 14. Bd2 Ba7 15. Bxc6
Bxc6 16. Nxa5 Bxf2+ 17. Kxf2 Rxa5 18. b4 Ra8 19. b5 Bd7 20. c4 c6 21. Kg1 Be6
22. a5 Nd7 23. Kh1 cxb5 24. cxb5 Nc5 25. Ra3 Bd7 26. Qb1 Ne6 27. a6 bxa6 28.
bxa6 Nc5 29. a7 Qc7 30. Qa1 Bb5 31. Be3 Nxd3 32. Rb1 Bc4 33. Nd2 d5 34. exd5 f5
35. Qc3 e4 36. Qxc4 Qg3 37. Nf1 Nf2+ 38. Bxf2 Qxa3 39. d6+ Kh7 40. Qd5 f4 41.
Qf5+ 1-0`,
  `1. d4 e6 2. Nc3 Nf6 3. e4 d5 4. e5 Nfd7 5. Nce2 c5 6. c3 cxd4 7. cxd4 f6 8. exf6
Nxf6 9. Nf3 Nc6 10. a3 Bd6 11. g3 O-O 12. Bg2 Bd7 13. O-O Qb6 14. Bf4 Bxf4 15.
Nxf4 Qxb2 16. Rb1 Qxa3 17. Rxb7 Rab8 18. Rxd7 Nxd7 19. Nxe6 Rxf3 20. Bxf3 Nf6
21. Kg2 Qc3 22. Re1 Rb2 23. Ng5 Qxd4 24. Bxd5+ Kh8 25. Qf3 Nd8 26. Re8+ 1-0`,
  `1. e4 c5 2. Nc3 g6 3. h4 Nc6 4. h5 Bg7 5. Bb5 d6 6. Bxc6+ bxc6 7. d3 Rb8 8. Qd2
gxh5 9. b3 c4 10. dxc4 Nf6 11. f3 Qa5 12. Nge2 Ba6 13. Nd4 Qe5 14. Nxc6 Nxe4 15.
Nxe5 Nxd2 16. Bxd2 Bxe5 17. Rxh5 Kd7 18. O-O-O Rbg8 19. g4 Bb7 20. Nd5 e6 21.
Rxe5 exd5 22. Rf5 dxc4 23. Rxf7+ Kc8 24. Bc3 Rf8 25. Rxb7 Kxb7 26. Bxh8 Rxh8 27.
Rxd6 Rf8 28. Rd4 cxb3 29. axb3 Rxf3 30. Rd7+ Kb6 31. Rxh7 a5 32. Kb2 Kb5 33.
Rh5+ Kb4 34. c3+ Rxc3 35. Rb5+ Kxb5 36. Kxc3 1-0`
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

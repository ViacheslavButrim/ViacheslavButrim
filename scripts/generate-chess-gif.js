const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const { Chess } = require('chess.js');
const fs = require('fs');
const path = require('path');

const boardSize = 600;
const sideWidth = 300;
const canvasWidth = boardSize + sideWidth * 2;
const canvasHeight = boardSize;

const squareSize = boardSize / 8;

const MOVE_DELAY = 1000;        
const RAIN_DELAY = 60;         
const RAIN_FRAMES = 3;        

const GAMES = [
  `1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6
   8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1 Bf8
   14.Ng3 g6 15.a4 c5 16.d5 c4 17.Be3 Qc7 18.Nd2 Nc5 19.f4 exf4
   20.Bxf4 Nfd7 21.Nf3 Bg7 22.Nd4 Qb6 23.Kh1 Ne5 24.Rf1 Ned3
   25.Bc1 Nxc1 26.Rxc1 Be5 27.Nge2 b4 28.cxb4 Qxb4 29.b3 cxb3
   30.Bxb3 Nxb3 31.Nxb3 Qxa4 32.Rc7 Rf8 33.Rxb7 Qxe4 34.Na5 Rac8
   35.Nc6 Rxc6 36.dxc6 Qxc6 37.Rb3 a5 38.Nd4 Qc4 39.Nf3 Qf4
   40.Rb5 Rc8 41.Rxa5 Rc1 42.Qe2 Rxf1+ 43.Qxf1 h5 44.Ra8+ Kg7
   45.Ra7 g5 46.Ra5 g4 47.Nxe5 Qxf1+ 48.Kh2 dxe5 49.hxg4 hxg4
   50.Kg3 Qf4+ 51.Kh4 Kg6 52.Ra6+ f6 53.Rxf6+ Kxf6 54.g3 Qg5# 0-1`
   `1.e4 e5 2.Nf3 Nc6 3.Bb5 d6 4.d4 a6 5.Bxc6+ bxc6 6.dxe5 Ne7 7.exd6 cxd6 8.O-O Ng6
9.Nc3 Be7 10.Be3 O-O 11.Qd2 a5 12.Rad1 Ba6 13.Rfe1 Qd7 14.Na4 Rad8 15.Qxa5 Ra8
16.Qd2 d5 17.Nb6 Qe6 18.exd5 cxd5 19.Nxa8 Rxa8 20.Qxd5 Qc8 21.Ne5 Nxe5 22.Qxe5 Bf6
23.Qc5 Qe6 24.Bg5 Qg4 25.Bxf6 Bb7 26.Qg5 Qxg5 27.Bxg5  1-0`
`1.e4 e5 2.Nf3 Nc6 3.Bc4 Be7 4.O-O Nf6 5.Nc3 O-O 6.d3 d6 7.Be3 Bg4 8.Qe2 Na5
9.Bb3 Nxb3 10.axb3 a6 11.b4 d5 12.Rfd1 d4 13.Bd2 dxc3 14.Bxc3 Nd7 15.Rf1 Kh8
16.Qe3 Bd6 17.Rad1 f5 18.d4 fxe4 19.dxe5 exf3 20.exd6 fxg2 21.Qd4 gxf1=Q+
22.Rxf1 Qg5 23.Qxg7+ Qxg7 24.Bxg7+ Kxg7  0-1`
`1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bb5 d6 5.O-O Be7 6.d4 O-O 7.d5 a6 8.dxc6 axb5
9.cxb7 Bxb7 10.Nd5 c6 11.Nxe7+ Qxe7 12.Bg5 Qe6 13.Qd2 Nxe4 14.Qe3 c5 15.Nh4 g6
16.Bh6 Rfe8 17.Qf3 Bd5 18.Qd3 c4 19.Qe3 Qg4 20.f3 Qxh4 21.fxe4 Be6 22.Qf3 Qxh6
23.Rad1 Rf8 24.Rxd6 b4 25.Qf6 Qe3+ 26.Kh1 Bg4 27.h3 Be2 28.Re1 Qf2 29.Qxf2 c3
30.Qxe2 cxb2 31.Rb1 Rxa2 32.Rdd1 Rfa8 33.Qe1 R2a3 34.Rxb2  1-0`
`1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 d5 5.exd5 Nd4 6.d6 Bxd6 7.Nxf7 Qe7 8.Nxh8 Bf5
9.O-O c6 10.Qe1 O-O-O 11.Nf7 Bh3 12.Nxd8  1-0`
`1.d4 d5 2.Nf3 Nc6 3.Nc3 Nf6 4.Bf4 Bf5 5.e3 a6 6.Be2 Qd7 7.Qd2 O-O-O 8.O-O-O e6
9.Ne5 Qd6 10.Nxf7 Qb4 11.Nb1 Qb6 12.Qc3 Bb4 13.Qb3 Na5 14.Qa4 Ng4 15.Bxg4 Bxg4
16.f3 Bf5 17.a3 Be7 18.b4 Nc4 19.Qb3 h6 20.Nc3 a5 21.bxa5 Qxa5 22.a4 Ba3+
23.Kb1 Bb4 24.Nb5 c6 25.Na7+ Qxa7 26.Qxb4 Qa6 27.Nxh8 Rxh8 28.g4 Bg6 29.h4 Nb6
30.a5 Nd7 31.h5 Bh7 32.Rh2 g6 33.Bxh6 gxh5 34.gxh5 Bf5 35.Bf4 Nf6 36.Be5 Kd7
37.Bxf6 Ra8 38.Qe7+  1-0`
`1.e4 c5 2.Nf3 d6 3.Bc4 Nf6 4.O-O Nxe4 5.d3 Nf6 6.Nc3 g6 7.Ng5 e6 8.Bb5+ Bd7
9.Qf3 Nc6 10.Be3 Bg7 11.Nge4 Nxe4 12.Nxe4 O-O 13.Ng3 Rb8 14.Nh5 gxh5 15.Qxh5 Qf6
16.Bd2 Qg6 17.Qh4 Bf6 18.Qh3 Bxb2 19.Rae1 Rbd8 20.Re3 Be5 21.Rfe1 Nd4 22.Bc4 Nxc2
23.Rxe5 dxe5 24.Rxe5 Qf6 25.Qg3+ Kh8 26.Rg5 Qa1+  0-1`
`1.e4 e5 2.Nf3 Nc6 3.d4 f6 4.dxe5 fxe5 5.Nc3 Nf6 6.Bc4 Bc5 7.O-O Qe7 8.Bg5 d6
9.Nd5 Qd7 10.Bxf6 Qf7 11.Bh4 Be6 12.Ng5 Qh5 13.Qxh5+  1-0`
`1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6 4.Ng5 Nxe4 5.Bxf7+ Ke7 6.Nxe4 Kxf7 7.Qh5+ g6
8.Qf3+ Kg7 9.O-O Be7 10.d3 Rf8 11.Qh3 d5 12.Qh6+ Kg8 13.Nec3 Be6 14.Ne2 Bf6
15.c4 Bg7 16.Qd2 Qe7 17.cxd5 Bxd5 18.Nbc3 Be6 19.Ng3 Rad8 20.Nge4 h6 21.Na4 Bc4
22.Qc3 Bxd3 23.Qb3+ Kh7 24.Rd1 Bxe4 25.Rxd8 Rxd8 26.h3 Nd4 27.Qg3 Ne2+ 28.Kh2 Nxg3
29.Kxg3 Rd1 30.Nc3 Re1 31.a4 Rxc1 32.Rxc1 Qg5+ 33.Kh2 Qxg2+  0-1`
`1.Nf3 Nf6 2.g3 b6 3.Bg2 Bb7 4.O-O e6 5.d3 d5 6.Nbd2 Be7 7.e4 O-O 8.e5 Nfd7
9.Re1 c5 10.Nf1 Nc6 11.h4 Nd4 12.Nxd4 cxd4 13.Qg4 Re8 14.Qxd4 Qc7 15.c3 f6
16.exf6 Bxf6 17.Qg4 Ne5 18.Bf4 Nxg4 19.Bxc7 Rac8 20.Bf4 e5 21.Bd2 e4 22.dxe4 dxe4
23.Bf4 Rcd8 24.Re2 Be5 25.Ne3 Bxf4 26.Nxg4 Bc7 27.Rae1 h5 28.Nh2 b5 29.Bxe4 Bxe4
30.Rxe4 Rxe4 31.Rxe4 Rd2 32.Nf3 Rxb2 33.Ng5 Bd6 34.Re8+ Bf8 35.Rb8 Re2 36.Kf1 Re7
37.Rxb5 g6 38.Rb8 Kg7 39.c4  1-0`
`1.e4 g6 2.d4 Bg7 3.Nc3 d6 4.Be3 a6 5.Qd2 Nd7 6.h4 h6 7.O-O-O b5 8.Nh3 Ngf6
9.f3 Nb6 10.Nf4 b4 11.Nce2 Nc4 12.Qd3 Nxe3 13.Qxe3 c6 14.Kb1 Qb6 15.Qd2 h5
16.e5 dxe5 17.dxe5 Nd5 18.Nxd5 cxd5 19.Qxd5 Ra7 20.Qd4 Qc7 21.Nf4 Bxe5 22.Nd5 Bxd4
23.Nxc7+ Rxc7 24.Rxd4 a5 25.Rd5 Ra7 26.Bb5+ Kf8 27.Rhd1 Kg7 28.Bc4 Be6 29.R5d4 Bf5
30.Bd3 Be6 31.Bc4 Bf5 32.Bd3 Rc8 33.Bxf5 gxf5 34.b3 Rac7 35.R1d2 e6 36.Kb2 Kf6
37.Rd6 Ke5 38.Ra6 Rc5 39.Ra7 R8c7 40.Rxc7 Rxc7 41.a3 Kf4 42.axb4 axb4 43.Rd4+ Kg3
44.Rxb4 e5 45.Rc4 Re7 46.b4 e4 47.fxe4 fxe4 48.b5 e3  0-1`
`1.c4 g6 2.g3 Bg7 3.Bg2 c5 4.Nc3 Nc6 5.d3 e6 6.Nh3 Nge7 7.Nf4 a6 8.h4 h6 9.Qd2 b5
10.cxb5 axb5 11.Nxb5 d5 12.e4 Ba6 13.exd5 Bxb5 14.dxc6 Bxc6 15.O-O O-O 16.Qc2 e5
17.Bxc6 Nxc6 18.Ne2 Rc8 19.Bd2 Qd7 20.Rad1 f5 21.f4 Kh7 22.Bc3 Nd4 23.Qd2 exf4
24.Rxf4 Rfe8 25.Bxd4 cxd4 26.Rdf1 Re3 27.R4f3 Rce8 28.Nf4 Qb7 29.Qg2 Qa6
30.b3 Be5 31.h5 Bxf4 32.hxg6+ Qxg6 33.gxf4 Qh5 34.Rxe3 dxe3 35.Qh2 Rg8+ 36.Kh1 e2  0-1`
`1.e4 Nc6 2.Nf3 d6 3.d4 Nf6 4.Nc3 g6 5.d5 Nb8 6.Be2 Bg7 7.O-O O-O 8.a4 Bg4
9.h3 Bxf3 10.Bxf3 c6 11.a5 a6 12.Be3 Nbd7 13.Bd4 Re8 14.Re1 Qc7 15.Na4 e5
16.Bb6 Nxb6 17.Nxb6 Rad8 18.Re3 Nd7 19.Rb3 f5 20.Nxd7 Qxd7 21.Qd3 c5 22.Rb6 Rc8
23.c4 Rf8 24.b4 cxb4 25.Rb1 Rc5 26.R1xb4 Rxa5 27.Qb1 Qd8 28.Rxb7 Qf6 29.Rb2 Ra3
30.c5 dxc5 31.Ra2 Rxa2 32.Qxa2 Kh8 33.Qc2  0-1`
`1.b3 Nf6 2.Bb2 g6 3.g3 Bg7 4.Bg2 d5 5.Nf3 c5 6.O-O O-O 7.e3 Nc6 8.Ne5 Bd7
9.c4 d4 10.Nxc6 Bxc6 11.Bxc6 bxc6 12.d3 Qd7 13.Qe2 dxe3 14.fxe3 Rad8 15.Rd1 h5
16.Nc3 Ng4 17.Na4 Bxb2 18.Nxb2 Qe6 19.Re1 h4 20.gxh4 Kg7 21.Qg2 Rh8 22.Qg3 Rh5
23.h3 Ne5 24.Rad1 Rdh8 25.d4 Nd7 26.Nd3 Rxh4 27.Nf2 Nf6 28.Qe5 Rxh3 29.Qxe6 Rg3+
30.Kf1 fxe6 31.Ke2 Rh2 32.Rh1 Rhg2 33.Rdf1 Ng4 34.Rh4 Rxe3+ 35.Kd2 Re4 36.Rxg4 Rexg4
37.dxc5 Rf4 38.Ke3 e5  0-1`
`1.d4 Nc6 2.Nf3 d5 3.c4 Bg4 4.cxd5 Bxf3 5.gxf3 Qxd5 6.e3 e5 7.Nc3 Bb4 8.Bd2 Bxc3
9.bxc3 Qd6 10.Qb1 O-O-O 11.f4 exf4 12.Qf5+ Kb8 13.Qxf4 Qxf4 14.exf4 Nf6 15.f3 Nd5
16.Kf2 Nb6 17.f5 Ne7 18.Bd3 c5 19.Be4 cxd4 20.cxd4 Rxd4 21.Bc3 Ra4 22.Bxg7 Re8
23.Rhd1 Nc6 24.Rd6 Nc4 25.Rxc6 Rxe4 26.fxe4 bxc6 27.Rd1 Rxa2+ 28.Kf3 Kc7
29.e5 Rd2 30.Rc1 Nb6 31.Ra1 Kb7 32.h4 c5 33.e6 fxe6 34.fxe6 Rd8 35.Ke4 Re8
36.Ke5 a5 37.Rd1 Kc6 38.Kf6 Nd5+ 39.Ke5 Ne3 40.Rd6+ Kb5 41.Rd7 a4 42.e7 Kc6
43.Ke6 Nf5 44.Bf6 Nxe7 45.Bxe7 Ra8 46.Rd6+ Kb5 47.Rd5 Rc8 48.Rd3 Ra8 49.Rc3 c4
50.Kf7 Ra7 51.h5 Rd7 52.h6 Rd3 53.Rc1 a3 54.Kg8 a2 55.Bf6 c3 56.Kxh7 Kc4
57.Kg8 Rg3+ 58.Bg7 Kb3 59.h7 Kb2 60.Rh1 Rxg7+ 61.Kxg7 c2 62.h8=Q c1=Q 63.Kf7+ Qc3
64.Rh2+ Kb3 65.Qxc3+  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.g3 e5 7.Nb3 Nbd7 8.a4 b6
9.Bg2 Bb7 10.O-O Be7 11.Re1 Rc8 12.Nd2 h5 13.Nf1 h4 14.Ne3 g6 15.Re2 hxg3
16.hxg3 Rxc3 17.bxc3 Nxe4 18.Bb2 Ndf6 19.c4 Qc8 20.Nd5 Nxd5 21.cxd5 Ng5 22.c4 a5
23.Rc1 Ba6 24.Qb3 Qg4 25.Rcc2 Bc8 26.f4 Nh3+ 27.Kf1 f6 28.Qf3 Qf5 29.Re4 Kf7
30.Rce2 Qg4 31.fxe5 Qxf3+ 32.Bxf3 dxe5 33.Rh4 Rxh4 34.gxh4 Nf4 35.Rd2 Bc5
36.d6 Bh3+ 37.Ke1 Bb4 38.Kd1 Bd7 39.Rh2 Bxa4+ 40.Kc1 Bxd6 41.Kb1 f5 42.Bc1 e4
43.Bh1 Nd3 44.Re2 Bd1 45.Rd2 Bb3 46.Rxd3 exd3 47.Bd5+ Kf6 48.Kb2 a4 49.Kc3 b5
50.Kxd3 Bxc4+ 51.Bxc4 bxc4+ 52.Kxc4 f4 53.Kd4  0-1`
`1.d4 Nf6 2.c4 b6 3.f3 Nc6 4.Nc3 e5 5.d5 Ne7 6.e3 c6 7.Nh3 Bb7 8.e4 Ng6 9.Be3 Bc5
10.Bxc5 bxc5 11.d6 O-O 12.Qd2 Qa5 13.b3 Qa3 14.Na4 Rfb8 15.Qc1 Qb4+ 16.Qc3 Nf8
17.Qxb4 cxb4 18.c5 Ne6 19.Nf2 a5 20.Rc1 Nf4 21.g3 Ng6 22.Bc4 Ba6 23.Bxa6 Rxa6
24.Nd3 h5 25.h4 Nh7 26.Kd2 Nhf8 27.f4 Re8 28.Rce1 f6 29.f5 Nh8 30.Rhf1 Nf7
31.Rf3 Nh6 32.Nf2 Ra7 33.Nb6 Kf7 34.Ra1 g6 35.Kd3 Kg7 36.a3 Rb7 37.axb4 gxf5
38.exf5 Ng4 39.Ne4 axb4 40.Kc4 Reb8 41.Kxb4 Rxb6+ 42.cxb6 Rxb6+ 43.Kc4 Rb5
44.b4 Rd5 45.Rd3 Rxd3 46.Kxd3 Nh6 47.Rf1 Kf7 48.Kc4 Nh7 49.Kc5  1-0`
`1.e4 c5 2.Nc3 Nc6 3.Nge2 Nf6 4.d4 cxd4 5.Nxd4 d6 6.Bg5 e6 7.Qd2 Be7 8.O-O-O O-O
9.h4 a6 10.Kb1 h6 11.f4 Bd7 12.Bxf6 Bxf6 13.Nf3 Qa5 14.e5 dxe5 15.Qxd7 e4
16.Ne5 Bxe5 17.fxe5 Rad8 18.Qxb7 Rxd1+ 19.Nxd1 Qe1 20.Be2 Qxh1 21.Qxc6 Rd8
22.b4 Qe1 23.Qxa6 Qxb4+ 24.Kc1 Qd2+ 25.Kb2 Rb8+ 26.Bb5 Qb4+ 27.Kc1 Rxb5 28.Nc3 Rxe5
29.Qc6 e3  0-1`
`1.e4 e6 2.d3 d5 3.Nd2 b6 4.Ngf3 Nf6 5.c3 c5 6.Be2 Be7 7.O-O a5 8.Re1 O-O
9.e5 Nfd7 10.Nf1 Nc6 11.d4 Ba6 12.Bxa6 Rxa6 13.Qd3 c4 14.Qc2 b5 15.Ne3 b4
16.Ng4 a4 17.a3 bxc3 18.bxc3 Rb6 19.Qxa4 Qa8 20.Qc2 h5 21.Ne3 Rfb8 22.g4 hxg4
23.Nxg4 R8b7 24.Kh1 Na5 25.Rg1 Qe8 26.Bg5 Rb2 27.Qc1 Kf8 28.Qf4 Qd8 29.Bh6 Re2
30.Bxg7+ Ke8 31.Nh6 Nb6 32.Qxf7+ Kd7 33.Ng5 Kc8 34.Qxe6+ Kb8 35.Ngf7 Qc7
36.Nf5 Rxf2 37.N7d6 Bxd6 38.Nxd6 Qxg7 39.Rxg7 Rxg7 40.Rg1  1-0`
`1.d4 Nf6 2.Nf3 g6 3.Bg5 Bg7 4.Nbd2 h6 5.Bh4 d6 6.c3 g5 7.Bg3 Nh5 8.e3 Nd7
9.Bd3 e6 10.O-O Qe7 11.a4 f5 12.Ne1 Ndf6 13.f4 Nxg3 14.hxg3 O-O 15.e4 c5
16.dxc5 d5 17.exf5 Qxc5+ 18.Kh1 exf5 19.Nb3 Qe3 20.Qf3 Qe8 21.Nc2 Ng4 22.Kg1 Qh5
23.Rfe1 Bd7 24.Qxd5+ Kh8 25.Qxd7 Qh2+ 26.Kf1 Rad8 27.Qxb7 Qxg3 28.Re2 Rxd3
29.Nc5 Qxf4+ 30.Ke1 Qg3+ 31.Kf1 Qh4 32.g3 Rxg3 33.Ne6 Rg8 34.Nxg7 Nh2+ 35.Ke1 Nf3+
36.Kf2 Rh3+ 37.Ke3 Qf4+ 38.Kd3 Ne5+  0-1`
`1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nc6 5.g3 Nf6 6.Bg2 Be7 7.O-O O-O 8.Re1 b5
9.e5 Nd7 10.Nf1 Rb8 11.h4 b4 12.N1h2 a5 13.h5 h6 14.Ng4 a4 15.a3 bxa3 16.Rxa3 Nb6
17.Bf4 c4 18.d4 Bxa3 19.bxa3 Qe7 20.Qc1 c3 21.Bxh6 gxh6 22.Qxh6 f6 23.exf6 Qh7
24.Qg5+ Kh8 25.Nh4 Bd7 26.Ng6+ Kg8 27.Nh6+  1-0`
`1.e4 g6 2.d4 Bg7 3.Be3 Nf6 4.f3 O-O 5.Nc3 d6 6.Qd2 e5 7.O-O-O Nc6 8.Nge2 Be6
9.d5 Bd7 10.dxc6 Bxc6 11.g4 Qe7 12.Ng3 a6 13.h4 a5 14.h5 b6 15.Bc4 gxh5 16.Nf5 Qd8
17.Bh6 Bxh6 18.Qxh6 Ne8 19.Rxh5 Qf6 20.Qxh7+  1-0`
`1.e4 d5 2.exd5 Nf6 3.Nf3 Nxd5 4.d4 Bg4 5.h3 Bh5 6.Be2 e6 7.O-O Be7 8.Ne5 Bxe2
9.Qxe2 O-O 10.Rd1 c6 11.c4 Nf6 12.Nc3 Nbd7 13.Rd3 Qc7 14.Bf4 Bd6 15.Rg3 Kh8
16.Rd1 g6 17.Rf3 Kg7 18.Qe3 Rfe8 19.Bg5 Bxe5 20.dxe5 Ng8 21.Rd6 h6 22.Bf6+ Ndxf6
23.exf6+ Kh7 24.Ne4 Rad8 25.c5 b6 26.b4 bxc5 27.bxc5 Qa5 28.a3 Qa6 29.Qd4 Rb8
30.Rd3 Rb7 31.Kh2 e5 32.Qc3 Rc7 33.Rd7 Qc8 34.Qd2 Rxd7 35.Rxd7 Rf8 36.Qd6 Qe8
37.Qxc6 Kh8 38.Qd6 Qa8 39.c6 Rc8 40.Rb7 Re8 41.Rxf7 Qc8 42.Rd7  1-0`
`1.e4 e5 2.Nf3 Bc5 3.Nxe5 d6 4.Nf3 b6 5.d4 Bb4+ 6.c3 Ba5 7.b4 Bxb4 8.cxb4 Nc6
9.b5 Nce7 10.Nc3 Qd7 11.Bc4 Bb7 12.O-O Nf6 13.Re1 O-O 14.Bg5 h6 15.Bxf6 gxf6
16.Qd2 Ng6 17.Qxh6 f5 18.Qxg6+ Kh8 19.Qh6+ Kg8 20.Ng5 d5 21.Qh7+  1-0`
`1.d4 b6 2.e4 Bb7 3.Bd3 e6 4.Nf3 h6 5.c4 Nf6 6.Nc3 Bb4 7.Qe2 Nh7 8.O-O Ng5
9.Ne1 Nc6 10.Nc2 Bxc3 11.bxc3 Qe7 12.f4 Nh7 13.c5 O-O 14.Ba3 d6 15.cxd6 cxd6
16.e5 Qd7 17.Bxd6 Rfc8 18.f5 a6 19.Ne3 Na5 20.c4 Ra7 21.f6 g6 22.Qg4 Nf8
23.Qh4 h5 24.Qg5 Kh7 25.Qxh5+ Kg8  1-0`
`1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Nd7 5.exd6 Bxd6 6.Nc3 Ngf6 7.h3 Bh5 8.Nb5 Nxe4
9.Nxd6+ Nxd6 10.Qe2+ Qe7 11.Qxe7+ Kxe7 12.Nh4 Rhe8 13.g4 Kf8+ 14.Be3 Bg6
15.Nxg6+ fxg6 16.O-O-O Nf6 17.Bg2 Nde4 18.Rhe1 c6 19.g5 Nd5 20.Bxe4 Rxe4
21.Bc5+ Re7 22.Rxe7 Nxe7 23.Rd7 Re8 24.Rxb7 Kf7 25.Rxa7 h5 26.a4 Ke6 27.Rxe7+ Rxe7
28.Bxe7 Kxe7 29.b4 Kd7 30.Kd2 Kc7 31.Ke3 Kb6 32.Kd4 Kc7 33.Kc5 h4 34.a5 Kb7
35.Kd6 Ka6 36.Kxc6  1-0`
`1.d4 Nf6 2.Bg5 d5 3.e3 Bf5 4.Bxf6 exf6 5.Bd3 Bg6 6.h4 Qe7 7.h5 Qb4+ 8.Nc3 Qxb2
9.hxg6 Bb4 10.Rb1 Bxc3+ 11.Kf1 Qxa2 12.Ne2 Bb2 13.Rxh7 Rg8 14.c3 Qa3 15.Qc2 Ba1
16.Nf4 c6 17.gxf7+ Kxf7 18.Rxb7+  1-0`
`1.d4 d5 2.c4 dxc4 3.e3 Nc6 4.Bxc4 g6 5.Nf3 Bg7 6.Nc3 h6 7.O-O Nf6 8.d5 Na5
9.Be2 Nxd5 10.Nxd5 Be6 11.e4 O-O 12.Bf4 Bxb2 13.Bxc7 Qc8 14.Nxe7+ Kg7 15.Nxc8 Raxc8
16.Bxa5 b6 17.Rb1 bxa5 18.Rxb2 Rb8 19.Qd4+ f6 20.Rxb8 Rxb8 21.Qxa7+ Bf7 22.Qxb8 f5
23.exf5 gxf5 24.Qe5+ Kf8 25.Qxf5 a4 26.Ne5 h5 27.Qxf7+  1-0`
`1.d4 e6 2.g3 d5 3.Bg2 c6 4.Nf3 f6 5.c4 Bb4+ 6.Bd2 Qa5 7.O-O Na6 8.a3 Bxd2
9.Nbxd2 c5 10.cxd5 exd5 11.dxc5 Ne7 12.b4 Qc7 13.Nd4 Qe5 14.N2f3 Qh5 15.Rc1 O-O
16.b5 Nc7 17.Qb3 Bd7 18.a4 Rac8 19.Rc3 b6 20.cxb6 axb6 21.Rfc1 Rfd8 22.Rxc7 Rxc7
23.Rxc7 Rc8 24.Rxc8+ Bxc8 25.Qc3 h6 26.Qc7 Qe8 27.Nc6 Nxc6 28.bxc6 Ba6 29.Nd4 Bxe2
30.Qd7 Bh5 31.Bxd5+  1-0`
`1.d4 c5 2.d5 e6 3.e4 exd5 4.exd5 d6 5.Nf3 Nf6 6.c4 Bg4 7.Be2 g6 8.Qb3 Qc7
9.O-O Bg7 10.Qe3+ Qe7 11.Nc3 a6 12.Qxe7+ Kxe7 13.Re1 Re8 14.Bf4 Nh5 15.Bd1+ Kd7
16.Rxe8 Kxe8 17.Bxd6 Nd7 18.Ng5 Bxd1 19.Rxd1 h6 20.Re1+ Be5 21.Bxe5 hxg5
22.g4 f6 23.Bd6+ Kd8 24.gxh5 gxh5 25.Re7 b5 26.Rh7 Kc8 27.Ne4 bxc4 28.Nxc5 Nxc5
29.Bxc5 Rb8 30.Rh8+ Kb7 31.Rxb8+ Kxb8 32.Be7  1-0`
`1.d4 f5 2.Nc3 Nf6 3.Bg5 e6 4.e4 fxe4 5.Nxe4 Be7 6.Bxf6 Bxf6 7.Qh5+ g6 8.Qh6 d5
9.Nxf6+ Qxf6 10.Nf3 Nd7 11.O-O-O a6 12.h4 Qf8 13.Qe3 Nf6 14.Ne5 Qg7 15.Be2 Rf8
16.Kb1 Ne4 17.Bf3 Nf6 18.h5 g5 19.h6 Qe7 20.Qxg5 Rg8 21.Bh5+ Kd8 22.Qf4 Bd7
23.g4 Be8 24.Bxe8 Kxe8 25.g5 Nd7 26.Nd3 Rc8 27.Rhg1 Rg6 28.Qe3 c5 29.Nf4 Nf8
30.Nxg6 Nxg6 31.dxc5 Rxc5 32.f4 Nh4 33.g6 Nxg6 34.Rxg6 hxg6 35.h7 Qxh7 36.Qxc5  1-0`
`1.e4 d6 2.d4 Nf6 3.f3 Nbd7 4.Be3 e5 5.d5 Be7 6.Qd2 O-O 7.c4 a5 8.Ne2 b6 9.Nbc3 Nc5
10.Ng3 h6 11.Bd3 Nxd3+ 12.Qxd3 Ne8 13.Nf5 Bxf5 14.exf5 Bg5 15.Bf2 Qd7 16.h4 Be7
17.O-O-O Rb8 18.g4 c6 19.Kb1 Nc7 20.g5 hxg5 21.hxg5 Bxg5 22.dxc6 Qxc6 23.f4 Bxf4
24.f6 Bh6 25.Rxh6 e4 26.Rdh1 gxh6 27.Qg3+  1-0`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Ba6
9.b3 g6 10.Ba3 c5 11.g3 Bg7 12.f4 Nb4 13.Bg2 Rd8 14.Nc3 O-O 15.Bb2 d5 16.a3 d4
17.axb4 dxc3 18.Bxc3 cxb4 19.Bb2 Bc8 20.O-O f6 21.Bd5+ Rxd5 22.cxd5 Qc5+
23.Rf2 fxe5 24.Bxe5 Bxe5 25.Qxe5 Rd8 26.Rd1 Bg4 27.Qd4 Qa5 28.Rdd2 Re8 29.Kg2 Qb5
30.h3 Bf5 31.g4 Be4+ 32.Kh2 c5 33.Qf6 c4 34.d6 Bc6 35.f5 Rf8 36.Qe6+ Kg7
37.d7 Qc5 38.Qd6  1-0`
`1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Nf3 c5 8.Rb1 O-O
9.Be2 b6 10.O-O Bb7 11.Qd3 Ba6 12.Qe3 Qd7 13.h4 Qa4 14.h5 Qxa2 15.Rb2 Qa4
16.hxg6 hxg6 17.Bxa6 cxd4 18.cxd4 Nxa6 19.Qe2 Nc7 20.Ra2 Qb5 21.Qe3 Qc4 22.Rd2 Rfd8
23.Ba3 Nb5 24.Bb2 Rac8 25.Rfd1 Nc3 26.Rc1  1-0`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4 Ne5 8.Bb3 d6
9.O-O O-O 10.f3 N7c6 11.Kh1 Bb6 12.Na3 Kh8 13.Qd2 Na5 14.Ndb5 Bxe3 15.Qxe3 Qe7
16.Bc2 a6 17.Nd4 c5 18.Ne2 Nac4 19.Nxc4 Nxc4 20.Qc1 f5 21.b3 Nb6 22.c4 fxe4
23.Bxe4 Bf5 24.Ng3 Bxe4 25.Nxe4 Rad8 26.Re1 Rfe8 27.Qd2 Qf8 28.Ng5 Qf6 29.Rxe8+ Rxe8
30.Re1 Rxe1+ 31.Qxe1 Nd7 32.Qe8+ Nf8 33.h3 Kg8 34.Ne4 Qf4 35.Qe7 Qc1+ 36.Kh2 Qf4+
37.Kg1 Qc1+ 38.Kf2 Qb2+ 39.Kg3 h5 40.Nxd6 h4+ 41.Qxh4 Ng6 42.Qe4 Qf6 43.Nf5 Qg5+
44.Kh2 Nf4 45.g3 Nh5 46.f4 Qd8 47.Qd5+ Qxd5 48.Ne7+ Kf7 49.Nxd5  1-0`
`1.e4 c5 2.Nf3 e6 3.b3 b6 4.Bd3 Bb7 5.O-O Nf6 6.e5 Nd5 7.Be4 Qc7 8.Re1 Be7
9.Bb2 b5 10.Na3 a6 11.c4 bxc4 12.Nxc4 O-O 13.d4 Nf4 14.Qd2 Bxe4 15.Rxe4 Nd5
16.dxc5 Qxc5 17.Rg4 Kh8 18.Ng5 Nc6 19.Ne4 Qa7 20.Rd1 a5 21.Nf6 Nxe5 22.Nxd5 Nxg4
23.Nxe7 f6 24.Nd6 a4 25.h3 Nh6 26.b4 Qb6 27.Rc1 a3 28.Ba1 Rab8 29.Rc4 Qd8
30.Nec8 Nf5 31.Qc2 Nxd6 32.Nxd6 Qe7 33.Qd3 e5 34.b5 Qe6 35.Qxa3 Qd5 36.Rc1 Ra8
37.Qb4 Rxa2 38.Bc3 h6 39.b6 Ra6 40.Rb1 Rb8 41.b7 Qxd6  0-1`
`1.d4 Nf6 2.c4 g6 3.f3 c5 4.d5 d6 5.Nc3 e6 6.e4 Bg7 7.Bg5 exd5 8.cxd5 O-O
9.Qd2 Re8 10.Nge2 Nbd7 11.Ng3 a6 12.a4 Qc7 13.Be2 c4 14.O-O Rb8 15.Be3 h5
16.Rfc1 h4 17.Nh1 h3 18.g3 b5 19.axb5 axb5 20.Ra7 Qd8 21.Nf2 Ne5 22.Bd4 Nfd7
23.Qe3 Nc5 24.Bxc5 dxc5 25.Qxc5 b4 26.Ncd1 Bd7 27.Qc7 Qxc7 28.Rxc7 Bb5 29.f4 c3
30.Bxb5 cxb2 31.Rb1 Nf3+ 32.Kh1 Rxb5 33.d6 Nd2 34.d7 Rd8 35.Rxb2 Bxb2 36.Nxb2 Kf8
37.Nfd3 Nxe4 38.Ne5 Ke7 39.Nbd3 Kd6 40.Rc6+ Ke7 41.Rc4 Nf6 42.Nc6+ Kxd7 43.Nxd8 Rd5
44.Nxf7 Ng4 45.Nfe5+ Nxe5 46.Nxe5+ Kd6 47.Rc6+ Ke7 48.Kg1 b3 49.Rb6 Rd1+
50.Kf2 Rd2+ 51.Kf3 Rxh2 52.Nxg6+  1-0`
`1.e4 e5 2.Nc3 Nc6 3.Bc4 Nf6 4.d3 Bc5 5.f4 d6 6.Nf3 exf4 7.Bxf4 O-O 8.Bg5 h6
9.Bh4 Be6 10.Bb3 Nd4 11.Rf1 Nxf3+ 12.Qxf3 Bd4 13.Ne2 Bxb2 14.Rb1 Ba3 15.Nf4 Bb4+
16.Ke2 Bg4 17.Qxg4 Nxg4 18.Bxd8 Raxd8 19.Ng6 Bc5 20.Nxf8 Rxf8 21.h3 Nf6 22.c3 Bb6
23.Rf5 Re8 24.Rbf1 c6 25.Kd2 Re7 26.g4 d5 27.exd5 cxd5 28.Bxd5 Be3+ 29.Kd1 Bg5
30.Bb3 b6 31.Re1 Rc7 32.Kc2 g6 33.Rfe5 Kf8 34.Rf1 Kg7 35.d4 Bh4 36.Kd3 Bg3
37.Re3 Bh4 38.a4 Nh7 39.a5 Ng5 40.axb6 axb6 41.Bc4 Ra7 42.Rb1 Rb7 43.Rb5 Bf2
44.Re8 Nxh3 45.Ke2 Bh4 46.Kf3 Ng5+ 47.Kg2 Rc7 48.Rb4 Nh7 49.Kf3 Bf6 50.Ke2 Be7
51.Ra4 Nf6 52.Rb8 Nxg4 53.Rxb6 h5 54.Rba6 h4 55.Ra7 Rxa7 56.Rxa7 Kf6 57.Bd5 Nh6
58.c4 Nf5 59.Kd3 g5 60.c5 g4 61.c6 Bd6 62.Rxf7+ Kg5 63.c7 Bxc7 64.Rxc7 h3
65.Rh7 Nh4 66.Be6 Ng6 67.Rg7 h2 68.Bd5 Kf6 69.Rxg6+  1-0`
`1.Nf3 g6 2.e4 Bg7 3.d4 d6 4.c4 Bg4 5.Be2 Nc6 6.Nbd2 e5 7.d5 Nce7 8.h3 Bd7
9.c5 dxc5 10.Nc4 f6 11.d6 Nc8 12.Be3 b6 13.O-O Bc6 14.dxc7 Qxc7 15.b4 cxb4
16.Rc1 Nge7 17.Qb3 h6 18.Rfd1 b5 19.Ncxe5 fxe5 20.Bxb5 Rb8 21.Ba4 Qb7 22.Rxc6 Nxc6
23.Qe6+ Ne7 24.Bc5 Rc8 25.Bxe7  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.h3 e6 7.g4 Be7 8.Bg2 Nfd7
9.Be3 Nc6 10.Qe2 O-O 11.O-O-O Nxd4 12.Bxd4 Qc7 13.f4 b5 14.g5 b4 15.Na4 e5
16.Be3 exf4 17.Bxf4 Ne5 18.Qf2 Rb8 19.h4 Bg4 20.Rd2 Rfc8 21.b3 Qa5 22.Bh3 Be6
23.h5 Nc4 24.Re2 Bxg5 25.bxc4 Bxc4 26.Bxg5 Qxg5+ 27.Re3 Bd3 28.Qg3 Rxc2+
29.Kd1 Qxh5+ 30.Qg4 Qe5 31.Rxd3 Rxa2 32.Rd2 Qa1+ 33.Ke2 Rxd2+ 34.Kxd2 Qxh1
35.Nb2 Qh2+ 36.Bg2 h5 37.Qg5 Qe5 38.Qxe5 dxe5 39.Bf1 a5 40.Bc4 h4  0-1`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4 O-O 8.O-O b6
9.Nc2 Ne5 10.Be2 Bb7 11.f4 N5g6 12.e5 Qe6 13.b4 Bxe3+ 14.Nxe3 Nh4 15.Bg4 f5
16.Be2 Kh8 17.Bc4 Qg6 18.Rf2 d6 19.exd6 Rad8 20.d7 Bc6 21.Nd2 Rxd7 22.Qe2 Re8
23.Re1 Nc8 24.g3 Rde7 25.Ndf1 Nd6 26.Bd3 Be4 27.Qd1 Bxd3 28.Qxd3 Ne4 29.Nd5 Rd7
30.Qc4 Nxf2 31.Rxe8+ Qxe8 32.Kxf2 Ng6 33.Nfe3 Qe6 34.Qb3 c6  0-1`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.Bc4 Ne5 8.Bb3 Qg6
9.O-O d5 10.Bf4 Bg4 11.Qc2 Bxd4 12.cxd4 N5c6 13.Qd2 Qxe4 14.f3 Bxf3 15.gxf3 Qxd4+
16.Qxd4 Nxd4 17.Bxc7 Kd7 18.Bg3 Nxb3 19.axb3 Nf5 20.Nc3 d4 21.Rfd1 Rhd8 22.Rd3 Kc6
23.Ne2 Rd5 24.Rad1 Rad8 25.Bf2 Kc5 26.Rc1+ Kb5 27.Rc4 b6 28.Ng3 Nh4 29.Kf1 Ka6
30.Rc7 Rf8 31.b4 g6 32.Ne2 Nf5 33.Nxd4 Nxd4 34.Rxd4 Rf5 35.Rd3 Rf4 36.Rb3 Kb5
37.Rxa7 Re8 38.Rb7 Re6 39.Re3 Ref6 40.Kg2 Rxb4 41.b3 Kc6 42.Ra7 h5 43.Rc3+ Kb5
44.Re7 Rf5 45.h4 g5 46.hxg5 Rxg5+ 47.Kh3 Rf5 48.Rb7 Ka6 49.Re7 Rbf4 50.Ree3 Kb5
51.Bg3 Rd4 52.Re5+ Rd5 53.Rxd5+ Rxd5 54.Rc4 Rd3 55.Rf4 Rxb3 56.Rxf7 Kc4 57.f4 b5
58.f5 Kd5 59.Rd7+ Ke4 60.f6 Rf3 61.f7 b4 62.Kg2 b3 63.Re7+  1-0`
`1.Nf3 Nf6 2.g3 g6 3.Bg2 Bg7 4.O-O O-O 5.c4 d6 6.b3 e5 7.Bb2 c5 8.e3 Nc6 9.Nc3 Bf5
10.d4 e4 11.Ne1 Re8 12.Nc2 h5 13.Qd2 h4 14.Ba3 b6 15.Rfd1 Bg4 16.Rdc1 Qd7
17.b4 Qf5 18.Bb2 Rad8 19.Nb5 Bf3 20.d5 Ne5 21.Bxe5 Rxe5 22.Ne1 hxg3 23.fxg3 Bh6
24.Rab1 Kg7 25.Rb3 Qh5 26.h3 Nh7 27.g4 Bxg4 28.hxg4 Qxg4 29.Qd1 Qg3 30.Qe2 Ng5
31.Kh1 Rh8 32.Nxd6 Kg8 33.bxc5 Bf8+ 34.Kg1 Nh3+ 35.Kf1 Bxd6 36.cxd6 Rf5+
37.Nf3 Rxf3+  0-1`
`1.e4 c5 2.Nf3 e6 3.g3 Qc7 4.Bg2 Nf6 5.d3 Nc6 6.O-O Be7 7.Re1 d6 8.c3 O-O
9.d4 cxd4 10.cxd4 e5 11.h3 b6 12.Nc3 Bb7 13.Be3 Rac8 14.Rc1 Qb8 15.d5 Na5
16.b3 Ba8 17.Nd2 b5 18.Qe2 a6 19.h4 b4 20.Na4 Rxc1 21.Rxc1 Rc8 22.Rxc8+ Qxc8
23.Nb6 Qb7 24.Bf1 Bd8 25.Nxa8 Qxa8 26.Qxa6 Qxa6 27.Bxa6 Ng4 28.Ba7 Bc7 29.f3 Nh6
30.Nf1 f6 31.Ne3 Nf7 32.Nc2 Nh6  1-0`
`1.e4 c5 2.Nf3 e6 3.b3 b6 4.Bd3 Nc6 5.O-O Be7 6.Re1 d6 7.c3 Nf6 8.Bc2 Ne5
9.d4 Nxf3+ 10.Qxf3 e5 11.dxe5 dxe5 12.c4 Qc7 13.Nc3 O-O 14.Bb2 Re8 15.Qg3 Bf8
16.Nd5 Nxd5 17.exd5 f6 18.f4 Bd6 19.fxe5 Bxe5 20.Bxe5 fxe5 21.Re3 Bb7 22.Rf1 g6
23.Bxg6 hxg6 24.Qxg6+ Qg7 25.Qe4 Re6 26.Rg3  1-0`
`1.e4 e5 2.Nf3 Nf6 3.d4 Nxe4 4.Nxe5 d5 5.Nd2 Nxd2 6.Bxd2 Bd6 7.Qf3 Be6 8.O-O-O Nd7
9.Re1 Nxe5 10.dxe5 Be7 11.Qg3 g6 12.Qb3 Qc8 13.Bh6 c6 14.Bd3 Qc7 15.Qa4 Qb6
16.Be3 Qb4 17.Qxb4 Bxb4 18.c3 Be7 19.f4 Kd7 20.Rd1 f6 21.Bd4 Rhf8 22.g3 fxe5
23.Bxe5 Bd6 24.Rde1 Bf5 25.Kd2 Bxd3 26.Kxd3 Rae8 27.Bxd6 Kxd6 28.Rhf1 Re6
29.Rxe6+ Kxe6 30.Re1+ Kd6 31.Re5 h6 32.h4 b6 33.Ke3 a5 34.g4 b5 35.a3 b4
36.axb4 axb4 37.cxb4 Rb8 38.h5 g5 39.Rf5 gxf4+ 40.Rxf4 Ke5 41.Kf3 d4 42.Rf5+ Ke6
43.b5 cxb5 44.Ke4 Rg8 45.Rf4 Rd8 46.Kd3 Rd5 47.Rxd4 Rg5 48.Ke3 Ke5 49.Rb4 Kd6
50.Kf4 Rd5 51.Re4 Rg5 52.Re8 Rg7 53.Rh8 Rf7+ 54.Ke4 Rf6 55.g5 hxg5 56.h6 Rf1
57.h7  1-0`
`1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 dxc6 5.d3 Bg7 6.h3 Nf6 7.Nc3 Qc7 8.Be3 b6
9.Qd2 h6 10.Bf4 Qb7 11.O-O g5 12.Be5 Be6 13.a3 O-O-O 14.b4 c4 15.Qe2 cxd3
16.cxd3 Qd7 17.d4 g4 18.hxg4 Bxg4 19.a4 h5 20.Rfc1 Kb7 21.a5 Ra8 22.d5 Bxf3
23.Qxf3 cxd5 24.a6+ Kc8 25.Nxd5+ Kd8 26.Nxf6 Bxf6 27.Bxf6 Rh6 28.e5 Rb8 29.Rd1 exf6
30.Qc6 Ke8 31.Rxd7 fxe5 32.Qc7 Kf8 33.Qxb8+  1-0`
`1.e4 c5 2.Nf3 Nc6 3.Bb5 g6 4.Bxc6 bxc6 5.O-O Bg7 6.Re1 e5 7.c3 Ne7 8.d4 cxd4
9.cxd4 exd4 10.Nxd4 O-O 11.Nc3 Re8 12.Bf4 a6 13.Bd6 Bb7 14.Nb3 Nc8 15.Bg3 d6
16.Qd2 Qe7 17.Rad1 Bf8 18.Na5 Rd8 19.Qf4 Qd7 20.e5 Qc7 21.Nxb7 Qxb7 22.Ne4 d5
23.Nf6+ Kh8 24.Qh4 h5 25.Nxh5 gxh5 26.Qxh5+ Kg8 27.Qg5+ Bg7 28.Qxd8+ Bf8
29.Qg5+ Bg7 30.e6 f6 31.Qh5 Qe7 32.Rd4 Ra7 33.Rh4 Nd6 34.Bxd6 Qxd6 35.Qe8+  1-0`
`1.d4 Nf6 2.Bg5 d5 3.e3 g6 4.Bxf6 exf6 5.c4 c6 6.Nc3 Bg7 7.cxd5 cxd5 8.Qb3 O-O
9.Qxd5 Nc6 10.Qxd8 Rxd8 11.a3 a6 12.Nf3 b5 13.Be2 Bb7 14.O-O Ne7 15.Rfc1 Rac8
16.Ne1 Nd5 17.Nxd5 Bxd5 18.Bf3 Bxf3 19.Nxf3 Bf8 20.Kf1 Bd6 21.Ke2 Kf8 22.Nd2 Ke8
23.h3 Kd7 24.Kd3 f5 25.Rc3 Rxc3+ 26.bxc3 Rb8 27.a4 Rb7 28.axb5 axb5 29.Ra6 h6
30.g4 Kc7 31.gxf5 gxf5 32.c4 h5 33.c5 Be7 34.Nb3 Rb8 35.d5 Bd8 36.Nd4 b4
37.Kc4 h4 38.Ra7+ Kc8 39.d6 b3 40.d7+  1-0`
`1.d4 d5 2.Bf4 Nf6 3.e3 Bf5 4.c4 dxc4 5.Bxc4 e6 6.Nc3 Bd6 7.Bg5 h6 8.Bh4 g5
9.Bg3 Bxg3 10.hxg3 Nbd7 11.Nf3 Ne4 12.Bd3 Nxc3 13.bxc3 Bxd3 14.Qxd3 g4 15.Nd2 c6
16.Rb1 Rc8 17.Qe2 f5 18.Rxb7 Qa5 19.O-O Qxa2 20.e4 Qc2 21.exf5 Qxf5 22.Nc4 Ke7
23.Ne5 Rhd8 24.Ra1 Ke8 25.Nc4 Ke7 26.Ra5 c5 27.Ne5 Ke8 28.Qb5 Qh7 29.Raxa7 Rb8
30.Rxb8 Rxb8 31.Qxb8+  1-0`
`1.d4 Nf6 2.Bg5 e6 3.e4 Be7 4.Nd2 d5 5.e5 Nfd7 6.Be3 b6 7.Nh3 Bb7 8.Qg4 g6
9.Ng5 Nf8 10.h4 h6 11.Ngf3 Na6 12.c3 Qd7 13.a4 O-O-O 14.b4 c5 15.Bb5 Qc7
16.dxc5 bxc5 17.O-O f5 18.exf6 Bxf6 19.Rac1 h5 20.Qh3 Kb8 21.Rfe1 Bc8 22.Bxa6 Bxa6
23.Bxc5 Bc8 24.c4 Be7 25.Bxe7 Qxe7 26.Qg3+ Qd6 27.Ne5 Rd7 28.Nxd7+ Kc7 29.Ne5 Kb7
30.c5 Qc7 31.c6+ Ka8 32.b5 Rh7 33.Qf4 Rh8 34.Ndf3 a6 35.Nd4 Nh7 36.bxa6 Rf8
37.Qe3 Bxa6 38.Nb5 Bxb5 39.axb5 Kb8 40.b6 Qe7 41.Ra1 Qd6 42.Nd7+ Kc8 43.Ra8+  1-0`
`1.e4 g6 2.d4 Bg7 3.Nc3 c6 4.h3 d5 5.Nf3 dxe4 6.Nxe4 Nf6 7.Bd3 Nxe4 8.Bxe4 Qc7
9.O-O O-O 10.Re1 Nd7 11.c3 e5 12.Nxe5 Nxe5 13.Bf4 Rd8 14.Qc1 Be6 15.Bxe5 Bxe5
16.dxe5 Rd7 17.Qg5 Qd8 18.Qe3 Rd2 19.b3 Qd7 20.Re2 Rxe2 21.Qxe2 Rd8 22.Bf3 Qd3
23.Rd1 Qxd1+ 24.Qxd1 Rxd1+ 25.Bxd1 c5 26.f4 Kf8 27.Kf2 Ke7 28.Ke3 Bf5 29.g4 Bd7
30.b4 cxb4 31.cxb4 Bb5 32.h4 b6 33.a4 Bc6 34.a5 Bd7 35.g5 Be6 36.h5 Bd7 37.h6 Be6
38.Bc2 Ba2 39.f5 Bc4 40.fxg6 fxg6 41.Bxg6  1-0`
`1.e4 e5 2.Nf3 Nf6 3.Nxe5 d6 4.Nf3 Nxe4 5.d3 Nf6 6.d4 c6 7.Bd3 Be7 8.h3 h6
9.O-O Be6 10.Re1 Qc7 11.c4 Nbd7 12.Nc3 Nb6 13.b3 O-O-O 14.a4 a5 15.d5 cxd5
16.Nb5 Qd7 17.Be3 Na8 18.cxd5 Bxd5 19.Rc1+ Bc6 20.Qd2 Nd5 21.Qxa5 Ndc7 22.Nxc7 Nxc7
23.Bf5 Ne6 24.Bb6 Qe8 25.Nd4 Bg5 26.Qa8+ Kd7 27.Qxb7+ Bxb7 28.Rc7+  1-0`
`1.d4 d5 2.Bf4 Nc6 3.e3 Bf5 4.Nf3 e6 5.a3 Nf6 6.c4 Be7 7.Nc3 O-O 8.cxd5 exd5
9.Bd3 Bg4 10.Qc2 g6 11.h3 Bf5 12.Bxf5 gxf5 13.Qxf5 Kh8 14.Ne5 Nxe5 15.Bxe5 Rg8
16.g4 h6 17.h4 Rg6 18.g5 h5 19.Nxd5 Kg7 20.Nxe7 Qxe7 21.gxf6+ Rxf6 22.Rg1+ Kf8
23.Bxf6 Qd6 24.Be5 Qd5 25.Bg7+ Ke8 26.Qxd5 Rd8 27.Qf5 b6 28.Bf6 Rd6 29.Rg8+  1-0`
`1.d4 Nf6 2.c4 c6 3.Bf4 d5 4.e3 Nbd7 5.Nc3 e6 6.Nf3 g6 7.h3 Bg7 8.Bd3 O-O
9.O-O Re8 10.Rc1 a6 11.a4 dxc4 12.Bxc4 Nd5 13.Bh2 N7b6 14.Be2 a5 15.Ne4 Nb4
16.Ne5 Nd7 17.Nc4 Nb6 18.Ncd6 Rf8 19.Nc5 Qe7 20.e4 e5 21.dxe5 Bxe5 22.Bxe5 Qxe5
23.b3 Rb8 24.f4 Qe7 25.Qd4 Qc7 26.f5 Nd7 27.fxg6 hxg6 28.Bc4 Nxc5 29.Nxf7 Kh7
30.Ng5+ Kh6 31.Rxf8  1-0`
`1.e4 e5 2.Nf3 Nc6 3.Bb5 d6 4.d4 Bd7 5.Nc3 exd4 6.Nxd4 Nxd4 7.Bxd7+ Qxd7 8.Qxd4 Nf6
9.Bg5 Be7 10.O-O-O O-O 11.e5 Ne8 12.h4 h6 13.Bf4 Qf5 14.Nd5 Qd7 15.Rhe1 Bd8
16.exd6 cxd6 17.Rd3 f6 18.Rde3 Nc7 19.Re7 Qc8 20.Rxc7 Qg4 21.Rxb7 Bb6 22.Qd3 f5
23.Ree7 Qg6 24.h5 Qxg2 25.Bg3 Qg1+ 26.Kd2 Ba5+ 27.b4  1-0`
`1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d3 d6 6.Bb3 O-O 7.Bg5 h6 8.Bh4 Qe7
9.Nbd2 a5 10.h3 Be6 11.Ba4 Bd7 12.g4 Nd8 13.Bxf6 gxf6 14.Bxd7 Qxd7 15.d4 exd4
16.cxd4 Bb4 17.d5 c6 18.O-O b5 19.Nd4 Kh7 20.N2f3 h5 21.Nf5 Rg8 22.Kh2 Qe8
23.Qc1 Qf8 24.a3 Bc5 25.gxh5 cxd5 26.exd5 Nb7 27.Qf4 Re8 28.b4 Bb6 29.Rae1 Re5
30.Nxe5 fxe5 31.Qe4 Kh8 32.Rg1 Bxf2 33.Rxg8+ Qxg8 34.Rf1 Bb6 35.Qg4 a4 36.Qxg8+ Kxg8
37.Rc1  1-0`
`1.e4 e6 2.d4 d5 3.Nd2 c5 4.Ngf3 Nc6 5.exd5 exd5 6.Bb5 Nf6 7.O-O Be6 8.Re1 Qb6
9.c4 O-O-O 10.Qa4 a6 11.Bxc6 Qxc6 12.Qxc6+ bxc6 13.Ng5 cxd4 14.Nxe6 fxe6
15.Rxe6 Kd7 16.cxd5 Nxd5 17.Re4 c5 18.Nc4 Bd6 19.Bd2 Rde8 20.Rae1 Rxe4 21.Rxe4 Rf8
22.g3 Bc7 23.b3 Nb6 24.Nb2 Re8 25.Rxe8 Kxe8 26.Kg2 Ke7 27.Kf3 Ke6 28.Ke4 Nd5
29.Kd3 Nf6 30.Kc4 Kd6 31.Bf4+ Kc6 32.Bxc7 Kxc7 33.Kxc5 Ne4+ 34.Kxd4 Nxf2
35.Nd3 Ng4 36.h4 Nh6 37.Ke5 Kc6 38.Ke6 Kb5 39.Ne5 Kb4 40.g4 Ka3 41.g5 Kxa2
42.gxh6 gxh6 43.b4 Kb3 44.Nc6 Kc4 45.Kf6 Kb5 46.Nb8  1-0`
`1.e4 e6 2.d3 d5 3.Nd2 c5 4.Ngf3 Nc6 5.g3 Bd6 6.Bg2 Ne5 7.Nxe5 Bxe5 8.exd5 exd5
9.Qe2 Qe7 10.Bxd5 Nf6 11.Bg2 O-O 12.Nc4 Re8 13.O-O Rb8 14.Qxe5 Qxe5 15.Nxe5 Rxe5
16.Bf4 Nd7 17.Bxe5 Nxe5 18.Rfe1 f6 19.f4 Nc6 20.Bxc6 bxc6 21.Re8+ Kf7 22.Rae1 Ra8
23.f5 Bxf5 24.Rxa8 Kg6 25.Rxa7 Kh6 26.Ree7 g5 27.a4 c4 28.a5 cxd3 29.cxd3 Bxd3
30.Rac7 Bb5 31.Rxh7+ Kg6 32.g4 f5 33.h3 f4 34.Rhe7 Kf6 35.Kf2  1-0`
`1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.h4 c6 6.Bg5 dxc4 7.e4 Be6 8.e5 Nd5
9.h5 Nd7 10.h6 Bf8 11.Ne4 f6 12.Bd2 b5 13.a4 Bf5 14.Ng3 e6 15.Nxf5 exf5 16.axb5 cxb5
17.Be2 Be7 18.O-O a5 19.b3 c3 20.Bxb5 cxd2 21.e6 O-O 22.exd7 Nc3 23.Bc4+ Kh8
24.Qxd2 Ne4 25.Qe3 Qxd7 26.Nd2 Nxd2 27.Qxd2 Bb4 28.Qd3 Qd6 29.Ra2 Rae8 30.Re2 Qf4
31.g3 Qxh6 32.Kg2 f4 33.Rh1 Qg5 34.Rxe8 Rxe8 35.Bf7 Re3 36.fxe3 Qxg3+ 37.Kf1 f3  0-1`
`1.e4 c6 2.d4 d5 3.e5 Bf5 4.Nc3 e6 5.g4 Bg6 6.Nge2 c5 7.Be3 Ne7 8.f4 h5 9.f5 exf5
10.g5 Nbc6 11.Nf4 a6 12.Bg2 cxd4 13.Bxd4 Nxd4 14.Qxd4 Nc6 15.Qf2 Bb4 16.O-O-O Bxc3
17.bxc3 Qa5 18.Rxd5 Qxc3 19.Qc5 Qxc5 20.Rxc5 O-O 21.Bxc6 bxc6 22.Rd1 Rab8
23.c4 Rfd8 24.Rd6 Kf8 25.Rcxc6 Rdc8 26.Kc2 h4 27.Rxc8+ Rxc8 28.Kc3 a5 29.Ra6 Rb8
30.Rxa5 Rb1 31.c5 Re1 32.Ra8+ Ke7 33.Ra7+ Ke8 34.Nd3 Re3 35.Kd2 Rh3 36.c6 Rxh2+
37.Ke3 Rc2 38.e6 h3 39.Nb4 f4+ 40.Kd4 h2 41.Ra8+ Ke7 42.Rh8 Rd2+ 43.Kc5 Be4
44.c7 Bb7 45.Kb6 Bc8 46.Rxc8 h1=Q 47.Re8+ Kxe8 48.c8=Q+ Ke7 49.Nc6+ Qxc6+
50.Qxc6 Rd6  0-1`
`1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 d5 5.cxd5 exd5 6.Bg5 h6 7.Bh4 c5 8.dxc5 O-O
9.e3 Be6 10.Nf3 Nbd7 11.a3 Bxc3+ 12.Qxc3 g5 13.Bg3 Ne4 14.Qc2 Ndxc5 15.Nd4 Rc8
16.Be2 Bd7 17.b4 Ne6 18.Qb2 Qf6 19.O-O Rfe8 20.Rac1 Nxd4 21.exd4 Nxg3 22.hxg3 Kg7
23.Bf3 Be6 24.Qd2 b6 25.Be2 Bf5 26.Ba6 Rxc1 27.Rxc1 Re4 28.Rd1 Re7 29.Rc1 Bg6
30.f3 h5 31.Bb5 Re6 32.Bd7 Rd6 33.Bb5 h4 34.g4 Re6 35.Bd7 Rd6 36.Bb5 h3 37.Kh2 hxg2
38.Kxg2 Re6 39.Bd7 Re7 40.Bb5 Re8 41.Bxe8  1-0`
`1.e4 c5 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Qxd7 5.c4 Nc6 6.Nc3 g6 7.d4 Bg7 8.Be3 cxd4
9.Nxd4 Nf6 10.f3 O-O 11.O-O a6 12.Na4 Rab8 13.Nxc6 Qxc6 14.Nb6 Nd7 15.Nxd7 Qxd7
16.Rf2 b5 17.c5 Qa7 18.Rc1 dxc5 19.Bxc5 Qc7 20.f4 Rfd8 21.Qe1 Rd3 22.e5 Qd7
23.h3 Qe6 24.Rd2 Rxd2 25.Qxd2 f6 26.exf6 Bxf6 27.b4 Re8 28.Rf1 Kf7 29.Rf3 h5
30.a3 Qc4 31.Qd7 a5 32.f5 g5 33.Qe6+ Qxe6 34.fxe6+ Kxe6 35.bxa5 Ra8 36.Bb6 Kd5
37.Rf5+ Kc4 38.Rc5+ Kb3 39.Rxb5+ Kxa3 40.Kf2 Ka4 41.Rf5 Kb3 42.Ke3 Kc4 43.Ke4 g4
44.Rxh5 gxh3 45.gxh3 Bc3 46.Rc5+ Kb3 47.h4 Bb4 48.Rg5 Kc4 49.h5 Bd6 50.h6  1-0`
`1.e4 e6 2.d4 d5 3.Nc3 Nf6 4.e5 Nfd7 5.f4 c5 6.Nf3 Nc6 7.Be3 Be7 8.Qd2 a6
9.a3 b5 10.Bd3 Bb7 11.O-O O-O 12.Kh1 f5 13.Qf2 Rc8 14.Rg1 b4 15.axb4 Nxb4
16.g4 g6 17.gxf5 Nxd3 18.cxd3 Rxf5 19.Ne2 Rf7 20.h4 Kh8 21.h5 gxh5 22.Qh2 Qf8
23.Qxh5 c4 24.Ng5 Bxg5 25.Rxg5 cxd3 26.Nc3 Nb6 27.f5 Rxf5 28.Rxf5 Qxf5 29.Bg5 Rf8
30.Qh4 Qf3+ 31.Kg1 Nd7 32.Kh2 Qf2+ 33.Qxf2 Rxf2+ 34.Kg3 Rxb2 35.Rf1 Kg7 36.Na4 Rc2
37.Bf6+ Kg6 38.Kf4 Nxf6 39.exf6 d2 40.f7 Rc1  0-1`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Bc5 5.Be3 Qf6 6.c3 Nge7 7.g3 d5 8.Bg2 dxe4
9.O-O O-O 10.Nd2 Bb6 11.Nxe4 Qg6 12.Re1 Rd8 13.Nxc6 Nxc6 14.Qa4 Be6 15.h4 h6
16.Qb5 a6 17.Qa4 Ne5 18.Bxb6 cxb6 19.Nc5 bxc5 20.Rxe5 Rd2 21.Qf4 Rxb2 22.Rxc5 Rd8
23.Re1 Qf6 24.Qxf6 gxf6 25.a4 Rdd2 26.Rf1 b5 27.axb5 axb5 28.Rc6 Kg7 29.Rc7 Bc4
30.Re1 Rxf2 31.Bc6 Rfc2  0-1`
`1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 d5 7.Nf3 dxc4 8.Qxc4 b6
9.h4 Bb7 10.Bg5 Qd5 11.Rc1 Nbd7 12.Qxd5 Bxd5 13.Ne5 c5 14.Bxf6 Nxf6 15.dxc5 bxc5
16.f3 Rab8 17.e4 Ba2 18.Rc2 Bb1 19.Rd2 Rfd8 20.Rxd8+ Rxd8 21.Bb5 Nh5 22.g4 Nf4
23.Kf2 f6 24.Nc6 Rd2+ 25.Ke3 Rxb2 26.Kxf4 Rxb5 27.Rd1 h6 28.h5 Rb3 29.e5 Bd3
30.a4 c4 31.Nxa7 Ra3 32.Nb5 Rxa4 33.Ke3 fxe5 34.Nd6 Ra3 35.Kf2 Kf8 36.Nb5 Rb3  0-1`
`1.e4 e5 2.Nf3 Nc6 3.Bb5 Nf6 4.Nc3 Nd4 5.Ba4 Bc5 6.Nxe5 O-O 7.Nd3 Bb6 8.e5 Ne8
9.Nd5 c6 10.Ne3 d5 11.O-O f6 12.c3 Nf5 13.Bc2 Qe7 14.f4 Nxe3 15.dxe3 Bf5
16.a4 Bc7 17.b3 fxe5 18.Ba3 Bd6 19.Bxd6 Nxd6 20.Nxe5 Bxc2 21.Qxc2 Nf7 22.Ng4 h5
23.Nf2 Qxe3 24.g3 Rae8 25.Qg6 Qf3 26.Rae1 Rxe1 27.Rxe1 Nh6 28.Qd3 Qxd3 29.Nxd3 Nf5
30.a5 Kf7 31.Ne5+ Kg8 32.b4 Re8 33.Kf2 a6 34.Nd7 Rxe1 35.Kxe1 Kf7 36.Ke2 Ke7
37.Nc5 Nd6 38.h3 Kf6 39.g4 hxg4 40.hxg4 g5 41.Kf3 Kg6 42.f5+ Kf6 43.Ke3 Nc4+
44.Kd4 Nd6 45.Nd7+ Ke7 46.Nc5 Kf6 47.Kd3 Ke5 48.Ke3 Kf6 49.Kd4 Nb5+ 50.Kd3 Nd6
51.Ke3 Nc4+ 52.Kd4 Nd6 53.Ne6 Ne4 54.Nd8 Nd6 55.Kc5 Ne4+ 56.Kb6 Nxc3 57.Nxb7 Na2
58.Kxa6 Nxb4+ 59.Kb6 d4 60.Nc5 d3 61.Nxd3 Nxd3 62.a6  1-0`
`1.b3 e5 2.Bb2 Nc6 3.e3 g6 4.c4 Bg7 5.Nf3 d6 6.Be2 Nf6 7.d4 O-O 8.O-O exd4
9.Nxd4 Re8 10.Nxc6 bxc6 11.Bf3 Bd7 12.Nc3 Rb8 13.h3 c5 14.Qd2 h5 15.Rad1 Qe7
16.Rfe1 a6 17.Qc1 Be6 18.Ne2 Nd7 19.Bxg7 Kxg7 20.Nf4 Ne5 21.Be2 Qf6 22.Bxh5 Rh8
23.Be2 g5 24.Nxe6+ fxe6 25.f4 gxf4 26.exf4 Nc6 27.Rd3 Nd4 28.Rg3+ Kf7 29.Bd3 Rbg8
30.Rg5 e5 31.Rf1 Ke7 32.Qe3 Kd7 33.Rxg8 Rxg8 34.fxe5 Qxe5 35.Rf7+ Ke6 36.Qf2 Qg5
37.Rxc7 Qc1+ 38.Kh2  1-0`
`1.e4 c5 2.Nc3 d6 3.Nge2 Nf6 4.g3 g6 5.Bg2 Nc6 6.d3 Bg7 7.O-O O-O 8.a3 Rb8
9.Rb1 b6 10.b4 Bb7 11.h3 Nd7 12.Be3 Re8 13.Qd2 Ba8 14.f4 Rc8 15.g4 e6 16.f5 Nd4
17.Bxd4 cxd4 18.Nb5 exf5 19.gxf5 Ne5 20.Nbxd4 d5 21.Qf4 dxe4 22.dxe4 Qc7
23.f6 Bf8 24.Rb3 Nc4 25.Rc3 a6 26.Qxc7 Rxc7 27.Nf4 b5 28.Nd5 Rcc8 29.Rd3 Bd6
30.Nb3 Bxd5 31.exd5 Re5 32.Nc5 a5 33.Rfd1 a4 34.Rf1 Rce8 35.Rdf3 h5 36.Nd3 Re2
37.R3f2 R2e3 38.Rf3 Re2 39.R1f2 Kh7 40.Bf1 R2e4 41.Nc5 Re1 42.Kg2 Ne3+ 43.Kh1 Nxd5
44.Rd3 R8e5 45.Nd7 Rg5 46.Rff3 Bc7 47.Nc5 h4 48.Rd4 Bg3 49.Nd3 Ra1 50.Re4 Rxa3
51.Re7 Kg8 52.Re8+ Kh7 53.Rf8 Ra1 54.Rxf7+ Kg8 55.Rg7+ Kf8 56.Ra7 Rf5 57.Rxf5 gxf5
58.Kg2 Ne3+ 59.Kf3 Nxf1 60.Nc5 Re1 61.Kg2 Ne3+ 62.Kf3 Nc4 63.Ra6 Nd2+ 64.Kg2 Re2+
65.Kh1 Rh2+  0-1`
`1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Qc2 O-O 5.a3 Bxc3+ 6.Qxc3 d5 7.Nf3 dxc4 8.Qxc4 b6
9.h4 c5 10.dxc5 bxc5 11.h5 h6 12.g4 Qd5 13.Qxd5 Nxd5 14.g5 hxg5 15.Bxg5 f6
16.Bd2 Nc6 17.Rc1 Nd4 18.Rxc5 Nxf3+ 19.exf3 Bd7 20.Rh4 Rfb8 21.b4 a6 22.Rd4 Bb5
23.Bg2 Re8 24.f4 f5 25.Bf3 Kh7 26.Bc3 Re7 27.Kd2 Rd8 28.Bxd5 exd5 29.Rdxd5 Rxd5+
30.Rxd5 Rd7 31.Rxd7 Bxd7 32.Ke3 g6 33.h6 Kxh6 34.Kd4 Kh5 35.Kc5 Kg4 36.Bd2 Kf3
37.Kb6 Bb5 38.a4 Bf1 39.b5 axb5 40.axb5 Kxf2 41.Kc6 Ke2 42.Bc1 Kd1 43.Ba3 Kd2
44.Be7  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.h3 e6 7.g4 h6 8.Bg2 g5 9.Be3 Nbd7
10.Qe2 Ne5 11.O-O-O Nfd7 12.h4 Rg8 13.hxg5 hxg5 14.Kb1 b5 15.a3 Bb7 16.Bc1 Rc8
17.Rh3 Ng6 18.Bh1 Nde5 19.Rg3 Be7 20.Na2 Rh8 21.Rc3 Rxc3 22.Nxc3 Qc7 23.Bg2 Qc4
24.Qxc4 bxc4 25.f3 Rh2 26.Bf1 Nf4 27.Be3 Bd8 28.Rd2 Rxd2 29.Bxd2 Bb6 30.Bxf4 gxf4
31.Nce2 d5 32.exd5 Bxd5 33.Bg2 Nxg4 34.Nxf4 Ne3 35.Nde2 Nxg2 36.Nxg2 Bxf3
37.Nef4 Ke7 38.Kc1 e5 39.Nh4 Be3+ 40.Kb1 Bxf4 41.Nxf3 Ke6 42.b3 e4 43.Nd4+ Kd5
44.c3 Be5 45.bxc4+ Kxc4 46.Nf5 Kxc3 47.Kc1 Kd3 48.Kd1 e3  0-1`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qc7 8.Bxf6 gxf6
9.Qf3 b5 10.a3 Nc6 11.Nxc6 Qxc6 12.f5 Qc5 13.Be2 Ra7 14.O-O-O Qe5 15.Rhf1 Rc7
16.Kb1 h5 17.h4 Be7 18.Qe3 Qc5 19.Qg3 Kf8 20.fxe6 fxe6 21.Qg6 Qe5 22.Rd3 Bd8
23.Rg3 Rf7 24.Rg5 Qd4 25.Bxh5  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qc7 8.Bxf6 gxf6
9.Qf3 b5 10.a3 Nc6 11.O-O-O Nxd4 12.Rxd4 Rb8 13.Be2 Bd7 14.f5 Qc5 15.Rhd1 Qe5
16.Qh5 Be7 17.fxe6 Bxe6 18.Nd5 Qxh5 19.Bxh5 Rg8 20.Nc7+ Kd8 21.Nxa6 Rb6 22.Nb4 Rxg2
23.R4d2 Rxd2 24.Kxd2 f5 25.exf5 Bg5+ 26.Ke2  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Bg5 e6 7.f4 Qc7 8.Bxf6 gxf6
9.Qf3 b5 10.a3 Nc6 11.O-O-O Nxd4 12.Rxd4 Qc5 13.Rd3 Rb8 14.b4 Qa7 15.f5 a5
16.Na2 Be7 17.Be2 h5 18.Kb1 Bd7 19.Rhd1 h4 20.bxa5 Qxa5 21.Nb4 Rc8 22.Qg4 Kf8
23.fxe6 Bxe6 24.Qf3 Rc5 25.Qe3 f5 26.Bf3 fxe4 27.Bxe4 Rc4 28.Bd5 Bf6 29.Bxc4 bxc4
30.Rxd6  1-0`
`1.c4 e6 2.d4 d5 3.Nf3 Nf6 4.e3 Be7 5.Bd3 O-O 6.b3 b6 7.O-O Bb7 8.Bb2 Nbd7
9.Nc3 a6 10.Rc1 Bd6 11.cxd5 exd5 12.Ne2 Re8 13.Ng3 Ne4 14.Qc2 Nxg3 15.hxg3 Nf6
16.Ne5 Qe7 17.b4 Ne4 18.b5 axb5 19.Bxb5 Rec8 20.Nc6 Qg5 21.a4 h5 22.Qe2 h4
23.gxh4 Qxh4 24.g3 Qg5 25.Rc2 Re8 26.Kg2 Re6  0-1`
`1.d4 d5 2.c4 dxc4 3.e3 e5 4.Nf3 exd4 5.Bxc4 Nf6 6.Qb3 Qe7 7.O-O  1-0`
`1.c4 Nf6 2.Nc3 e5 3.e3 Nc6 4.a3 d5 5.cxd5 Nxd5 6.Qc2 Nxc3 7.bxc3 Qd6 8.Bd3 Be6
9.Rb1 O-O-O 10.Be2 g5 11.Nf3 Be7 12.d4 Kb8 13.O-O g4 14.Nd2 f5 15.Nc4 Qd7
16.Rd1 Bd5 17.Bd3 Rhf8 18.a4 Qe6 19.Nd2 exd4 20.exd4 f4 21.Ne4 g3 22.hxg3 fxg3
23.fxg3 h5 24.Bf4 h4 25.Re1 Qd7 26.Qb2 b6 27.Nc5 Bxc5 28.dxc5 Rxf4 29.cxb6 axb6
30.gxf4 h3 31.a5 Rg8 32.Bf1 hxg2  0-1`
`1.e4 c5 2.Nf3 e6 3.c3 d5 4.e5 d4 5.Bd3 Bd7 6.O-O Bc6 7.Re1 g5 8.h3 h5 9.Na3 g4
10.Nh2 Nh6 11.Be4 d3 12.b4 Bxe4 13.Rxe4 Qd5 14.Qa4+ Nc6 15.bxc5 Bxc5 16.Nb5 O-O-O
17.Qc4 g3 18.Nf1 gxf2+ 19.Kh2 Nf5 20.Ba3 Bxa3 21.Nxa3 Kb8 22.Qxd5 Rxd5 23.Nc4 b5
24.Nce3 Nxe3 25.Nxe3 Rxe5 26.Rf4 f5 27.Kg3 Kc7 28.a4 a6 29.axb5 axb5 30.Kxf2 Re4
31.Rxe4 fxe4 32.Kg3 Rf8 33.Re1 Ne7 34.Rb1 Kc6 35.Rb4 Nf5+ 36.Kf4 Nd6+ 37.Ke5 Rf2
38.Rd4 Nf7+ 39.Kxe6 Ng5+ 40.Ke5 Rxd2 41.h4 Re2 42.Rd6+ Kb7 43.hxg5 Rxe3 44.g6 Re2
45.g4 Rg2 46.gxh5 d2 47.Kxe4  1-0`
`1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Nf3 d5 5.cxd5 exd5 6.Bf4 Ne4 7.Rc1 Nd7 8.e3 g5
9.Bg3 h5 10.Qb3 Bxc3+ 11.bxc3 c6 12.Nd2 Nxd2 13.Kxd2 h4 14.Bd6 Qf6 15.Ba3 Qxf2+
16.Be2 Nf6 17.Qb4 Ne4+ 18.Kd1 c5  0-1`
`1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4 Nf6 5.Nxc6 bxc6 6.e5 Qe7 7.Qe2 Nd5 8.c4 Qb4+
9.Nd2 Nf4 10.Qe3 Ng6 11.Bd3 Bc5 12.Qg3 O-O 13.O-O d6 14.Nb3 Nxe5 15.a3 Qb6
16.Nxc5 Qxc5 17.Be3 Qa5 18.b4 Qa4 19.Bd4 f6 20.Bxe5 fxe5 21.f4 Bf5 22.fxe5 Bxd3
23.Qxd3 dxe5 24.Qd7 Qb3 25.Qxc6 Qe3+ 26.Kh1 Kh8 27.Rfe1 Qc3 28.Qxc7 Rac8
29.Qxa7 Rxc4 30.h3 Rcf4 31.Qc5 Qb2 32.Qxe5 Qb3 33.Qe3 Qc4 34.Rac1 Qf7 35.Qg3 h6
36.b5 Qd5 37.a4 Rxa4 38.Rb1 Rf5 39.b6 Rg5 40.b7 Qxb7 41.Qxg5  1-0`
`1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Nf3 c5 8.h3 O-O
9.Be2 cxd4 10.cxd4 Nc6 11.Be3 f5 12.Bc4+ Kh8 13.O-O fxe4 14.Ng5 Nxd4 15.Nf7+ Rxf7
16.Bxf7 Qd6 17.Re1 Bxh3 18.Bxd4 Bxd4 19.Rxe4 e5 20.gxh3 Rf8 21.Rxd4 exd4
22.Bc4 Qf4 23.Qe2 Qg5+ 24.Qg4  1-0`
`1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6 6.Be2 e5 7.Nb3 Be7 8.O-O O-O
9.Kh1 Be6 10.f4 exf4 11.Bxf4 Nc6 12.Qe1 Qc7 13.Qg3 Kh8 14.Rad1 Rad8 15.Nd5 Bxd5
16.exd5 Ne5 17.Nd4 Ne4 18.Qe3 Nc5 19.Bxe5 dxe5 20.Nf5 Bf6 21.b4 Na4 22.c4 e4
23.d6 Qd7 24.c5 g6 25.Nd4 Bg7 26.Bc4 Nb2 27.Rc1 Nxc4 28.Rxc4 f5 29.Ne2 h6
30.h3 g5 31.Rc2 Rde8 32.Nd4 f4 33.Qd2 f3  0-1`
`1.d4 Nf6 2.c4 e6 3.Nc3 Bb4 4.Nf3 d5 5.cxd5 exd5 6.Bf4 c6 7.Qc2 g6 8.e3 Bf5
9.Qb3 Qb6 10.Nh4 Be6 11.Bd3 Nh5 12.Be5 O-O 13.g4 Bxg4 14.Rg1 Be6 15.Qc2 Nd7
16.Bxg6 fxg6 17.Nxg6 Nxe5 18.Nxf8+ Kxf8 19.dxe5 Qc7 20.f4 Qf7 21.O-O-O Bf5
22.Qb3 a5 23.Ne2 Ng7 24.Nd4 Bc5 25.Rg3 Bxd4 26.exd4  0-1`
`1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6 5.Be2 O-O 6.Bg5 Na6 7.Qd2 e5 8.d5 Qe8
9.Bd1 Nh5 10.Nge2 f5 11.f3 Bd7 12.a3 fxe4 13.Nxe4 Nf4 14.O-O h6 15.Nxf4 hxg5
16.Nd3 Bf5 17.Re1  1-0`
`1.d4 Nf6 2.c4 e6 3.Nc3 d5 4.Bg5 Nbd7 5.e3 Be7 6.Nf3 O-O 7.Qc2 a6 8.cxd5 exd5
9.Bd3 h6 10.Bf4 c5 11.O-O c4 12.Bf5 b5 13.Ne5 Bb7 14.a3 Re8 15.Rad1 Nf8 16.Bg3 Qb6
17.Bh4 Rad8 18.f4 a5 19.Kh1 b4 20.Na4 Qb5 21.Bxf6 gxf6 22.Ng4 h5 23.Qe2 Kg7
24.Rf3 Qxa4 25.Rh3 Ng6 26.Rxh5 Rh8  0-1`
`1.Nf3 c5 2.c4 Nf6 3.Nc3 e6 4.e3 Nc6 5.d4 d5 6.a3 cxd4 7.exd4 Be7 8.c5 Ne4
9.Qc2 Nxc3 10.Qxc3 a5 11.Bb5 Bd7 12.O-O O-O 13.Bf4 a4 14.Qc2 Bf6 15.Rad1 Re8
16.Rfe1 Qc8 17.Bg5 Ne7 18.Bd3 Ng6 19.Qd2 Qd8 20.Bxg6 hxg6 21.h4 Be7 22.Bxe7 Rxe7
23.Ne5 Be8 24.Qf4 b6 25.Rc1 bxc5 26.Rxc5 Rb7 27.Re2 f6 28.Nd3 Bf7 29.Nb4 Qb8
30.Qe3 Qd6 31.Qc3 Re8 32.Rc6 Qd7 33.Qc5 e5 34.Rd6 Qg4 35.f3 Qxh4 36.Nxd5 Rxb2
37.Rxb2 Qe1+ 38.Kh2 Qh4+ 39.Kg1  1/2-1/2`
`1.Nf3 c5 2.c4 Nf6 3.g3 b6 4.Bg2 Bb7 5.Nc3 g6 6.O-O Bg7 7.d4 cxd4 8.Nxd4 Bxg2
9.Kxg2 Qc8 10.b3 Qb7+ 11.f3 d5 12.cxd5 Nxd5 13.Nxd5 Qxd5 14.Be3 Nc6 15.Nxc6 Qxc6
16.Rc1 Qe6 17.Qd3 O-O 18.Rfd1 h5 19.Bf2 Bf6 20.Qc4 Qxc4 21.Rxc4 Rfd8 22.Rxd8+ Rxd8
23.Rc7 a5 24.Be3 Rd6 25.Rb7 Bd4 26.Bxd4 Rxd4 27.Kf2 a4 28.Rxb6 Rd2 29.bxa4 Rxa2
30.Rb4 Ra3 31.h4 Kg7 32.Ke1 Ra2 33.Kf2 Ra3 34.Re4 Kf6 35.Rf4+ Ke6 36.g4 hxg4
37.fxg4 f6 38.h5 gxh5 39.gxh5 Rh3 40.a5 Ra3 41.h6 Rxa5 42.Rh4 Ra8 43.Ke3 Ke5  0-1`
`1.c4 b6 2.Nc3 e6 3.e4 Bb7 4.Nf3 Bb4 5.Bd3 Bxc3 6.dxc3 d6 7.Nd4 Nd7 8.b3 Nc5
9.f3 Nxd3+ 10.Qxd3 Ne7 11.Bg5 Qd7 12.a4 f6 13.Bh4 e5 14.Nc2 g5 15.Bf2 f5
16.Ne3 f4 17.Nd5 Nxd5 18.cxd5 a5 19.Qb5 Ba6 20.Qxd7+ Kxd7 21.c4 h5 22.h3 Ke7
23.Ke2 Bc8 24.Rag1 Bd7 25.g3 Rag8 26.gxf4 gxf4 27.h4 Kf7 28.Kd2 Ke7 29.Ke2 Kf7
30.Kd2 Ke7  1/2-1/2`
];

function shuffle(arr) {
  return arr
    .map(v => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(o => o.v);
}

const RANDOM_GAMES = shuffle(GAMES);

const outputDir = path.join(process.cwd(), 'output');
fs.mkdirSync(outputDir, { recursive: true });

const gifPath = path.join(outputDir, 'chess-ai.gif');
const encoder = new GIFEncoder(canvasWidth, canvasHeight);
encoder.createReadStream().pipe(fs.createWriteStream(gifPath));

encoder.start();
encoder.setRepeat(0);
encoder.setQuality(10);

const canvas = createCanvas(canvasWidth, canvasHeight);
const ctx = canvas.getContext('2d');

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};
let boardImage;

async function loadAssets() {
  for (const c of ['w','b']) {
    for (const p of pieces) {
      pieceImages[c+p] = await loadImage(
        path.join(__dirname, '..', 'assets/pieces', `${c}${p}.png`)
      );
    }
  }
  boardImage = await loadImage(
    path.join(__dirname, '..', 'assets', 'dashboard.png')
  );
}

const PIXEL_LAYERS = [
  { count: 30, speed: 2, size: [4, 8], alpha: 0.8 },
  { count: 20, speed: 3.5, size: [6, 12], alpha: 0.6 },
  { count: 10, speed: 5, size: [8, 14], alpha: 0.4 },
];

const COLORS = ['#22d3ee', '#00fff7'];

function createRain(xStart, width) {
  const arr = [];
  for (const l of PIXEL_LAYERS) {
    for (let i = 0; i < l.count; i++) {
      arr.push({
        xStart,
        width,
        x: xStart + Math.random() * width,
        y: Math.random() * canvasHeight,
        speed: l.speed * (0.8 + Math.random()),
        size: l.size[0] + Math.random() * (l.size[1] - l.size[0]),
        alpha: l.alpha,
        drift: Math.random() * 1.5 - 0.75,
        color: COLORS[Math.random() * COLORS.length | 0]
      });
    }
  }
  return arr;
}

const leftRain = createRain(0, sideWidth);
const rightRain = createRain(sideWidth + boardSize, sideWidth);

function updateRain(rain) {
  for (const p of rain) {
    p.y += p.speed;
    p.x += p.drift;
    if (p.y > canvasHeight) {
      p.y = -p.size;
      p.x = p.xStart + Math.random() * p.width;
    }
  }
}

function drawRain(rain) {
  for (const p of rain) {
    ctx.globalAlpha = p.alpha;
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
}

function drawFrame(chess) {
  ctx.fillStyle = '#0a0a1f';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  drawRain(leftRain);
  drawRain(rightRain);

  const boardX = sideWidth;
  ctx.drawImage(boardImage, boardX, 0, boardSize, boardSize);

  const b = chess.board();
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const s = b[y][x];
      if (s) {
        ctx.drawImage(
          pieceImages[s.color + s.type.toUpperCase()],
          boardX + x * squareSize,
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

    encoder.setDelay(RAIN_DELAY);
    for (let i = 0; i < RAIN_FRAMES; i++) {
      updateRain(leftRain);
      updateRain(rightRain);
      drawFrame(chess);
      encoder.addFrame(ctx);
    }
  }

  for (let i = 0; i < END_FRAMES; i++) {
    updateRain(leftRain);
    updateRain(rightRain);
    drawFrame(chess);
    encoder.addFrame(ctx);
  }
}

(async () => {
  await loadAssets();

  for (const g of RANDOM_GAMES) {
    await playGame(g);
  }

  encoder.finish();
  console.log('✔ chess-ai.gif (optimized, random games) generated');
})();

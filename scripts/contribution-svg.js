const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const Chess = require('chess.js').Chess;
const fs = require('fs');
const path = require('path');

const boardSize = 400;
const squareSize = boardSize / 8;
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const encoder = new GIFEncoder(boardSize, boardSize);
encoder.createReadStream().pipe(fs.createWriteStream(path.join(outputDir, 'chess-ai.gif')));
encoder.start();
encoder.setRepeat(0); // нескінченно
encoder.setDelay(800); // мс між ходами
encoder.setQuality(10);

const canvas = createCanvas(boardSize, boardSize);
const ctx = canvas.getContext('2d');

const chess = new Chess();

// Завантажуємо PNG фігури
const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};

async function loadPieces() {
  for(const color of ['w','b']){
    for(const p of pieces){
      const imgPath = path.join(__dirname, 'assets/pieces', `${color}${p}.png`);
      pieceImages[color+p] = await loadImage(imgPath);
    }
  }
}

function drawBoard() {
  // Малюємо шахівницю
  for(let y=0; y<8; y++){
    for(let x=0; x<8; x++){
      const isLight = (x+y)%2===0;
      ctx.fillStyle = isLight ? '#a0c4ff' : '#2b2b7b'; // синій фон
      ctx.fillRect(x*squareSize, y*squareSize, squareSize, squareSize);

      const square = chess.board()[y][x];
      if(square){
        const key = square.color + square.type.toUpperCase();
        const img = pieceImages[key];
        if(img) ctx.drawImage(img, x*squareSize, y*squareSize, squareSize, squareSize);
      }
    }
  }
}

async function generateGIF() {
  await loadPieces();
  // Генеруємо гру: комп'ютер проти себе
  for(let i=0; i<60; i++){ // кількість ходів у GIF
    const moves = chess.moves();
    if(moves.length===0) break;
    const move = moves[Math.floor(Math.random()*moves.length)];
    chess.move(move);
    drawBoard();
    encoder.addFrame(ctx);
  }
  encoder.finish();
  console.log('✔ GIF шахів згенеровано у output/chess-ai.gif');
}

generateGIF();

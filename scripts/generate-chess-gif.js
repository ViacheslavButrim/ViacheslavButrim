const { createCanvas, loadImage } = require('canvas');
const GIFEncoder = require('gifencoder');
const Chess = require('chess.js').Chess;
const fs = require('fs');
const path = require('path');

const boardSize = 400;
const squareSize = boardSize / 8;
const outputDir = path.join(process.cwd(), 'output');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const encoder = new GIFEncoder(boardSize, boardSize);
const gifPath = path.join(outputDir, 'chess-ai.gif');
const writeStream = fs.createWriteStream(gifPath);
encoder.createReadStream().pipe(writeStream);

encoder.start();
encoder.setRepeat(0); // нескінченно
encoder.setDelay(800);
encoder.setQuality(10);

const canvas = createCanvas(boardSize, boardSize);
const ctx = canvas.getContext('2d');

const chess = new Chess();

const pieces = ['K','Q','R','B','N','P'];
const pieceImages = {};

async function loadPieces() {
  for(const color of ['w','b']){
    for(const p of pieces){
      const imgPath = path.join(__dirname, '..', 'assets/pieces', `${color}${p}.png`);
      if (!fs.existsSync(imgPath)) throw new Error(`Missing PNG: ${imgPath}`);
      pieceImages[color+p] = await loadImage(imgPath);
    }
  }
}

function drawBoard() {
  for(let y=0; y<8; y++){
    for(let x=0; x<8; x++){
      const isLight = (x+y)%2===0;
      ctx.fillStyle = isLight ? '#a0c4ff' : '#2b2b7b';
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

  for(let i=0; i<60; i++){ // 60 ходів
    const moves = chess.moves();
    if(moves.length === 0) break;
    const move = moves[Math.floor(Math.random() * moves.length)];
    chess.move(move);
    drawBoard();
    encoder.addFrame(ctx);
  }

  encoder.finish();

  await new Promise(resolve => writeStream.on('finish', resolve));
  console.log('✔ GIF chess-ai.gif згенеровано у output');
}

generateGIF().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

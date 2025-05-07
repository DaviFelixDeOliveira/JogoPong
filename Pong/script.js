const canvas = document.getElementById('jogo');
const context = canvas.getContext('2d');

canvas.style.border = '3px solid rgba(255, 255, 255, 0.2)';
const grid = 15;

const direcaoAleatoria = () => Math.random() < 0.5 ? -1 : 1;

const velocidadeRaquete = 6;
const alturaRaquete = grid * 5;
const limiteRaquete = canvas.height - grid - alturaRaquete;
const raqueteEsquerda = {
  x: grid * 2,
  y: canvas.height / 2 - alturaRaquete / 2,
  width: grid,
  height: alturaRaquete,
  dy: 0
}

const raqueteDireita = {
  x: canvas.width - (grid * 3),
  y: canvas.height / 2 - alturaRaquete / 2,
  width: grid,
  height: alturaRaquete,
  dy: 0
}
// Velocidade da bola
const velocidadeBola = 5 * direcaoAleatoria();

const ball = {
  x: canvas.width / 2 - grid / 2,
  y: canvas.height / 2 - grid / 2,
  width: grid,
  height: grid,
  reset: false,
  dx: velocidadeBola,
  dy: -velocidadeBola,
}

function Colisao(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}

function showGameStart() {
  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'firebrick';
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 90);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('START GAME', canvas.width / 2, canvas.height / 2);
  context.fillText('Press "N" to start', canvas.width / 2, (canvas.height / 2) + 30);
}

function showGamePause() {
  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME PAUSED', canvas.width / 2, canvas.height / 2);
  context.fillText('Press "P" to continue', canvas.width / 2, (canvas.height / 2) + 30);
}

function showGameOver(paddle) {
  cancelAnimationFrame(rAF);
  gameOver = true;
  gameStart = false;
  

  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'firebrick';
  context.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);
  context.fillText(
    paddle === 'left' ? 'LEFT PADDLE WON!' : 
    paddle === 'right' && 'RIGHT PADDLE WON!', 
    canvas.width / 2, canvas.height / 2);
  context.fillText('Press "N" to try again', canvas.width / 2, (canvas.height / 2) + 30);
}

const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    document.getElementById('fps-counter').innerText = times.length;
    refreshLoop();
  });
}

let scoreLeft = 0;
let scoreRight = 0;
let maxScore = 5;
let rAF = null;
let gameOver = false;
let gameStart = false;
let gamePause = false;


function game() {
  if (!gamePause) {
    rAF = requestAnimationFrame(() => {
      setTimeout(() => {
        game();
      }, 1000 / 100); // 100 fps
    });
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'lightgrey';
  context.fillRect(0,0,canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.width);

  context.font = '30px "Courier New", Courier, monospace';
  context.fillText(('0' + scoreLeft).slice(-2), grid * 5, grid * 5);
  context.fillText(('0' + scoreRight).slice(-2), canvas.width - (grid * 8), grid * 5);
  
  for (let i = grid; i < canvas.height - grid; i+= grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }

  document.getElementById('max-score').innerText = ('0' + maxScore).slice(-2);

  if (gameStart) {
    raqueteEsquerda.y += raqueteEsquerda.dy;
    raqueteDireita.y += raqueteDireita.dy;
  
    if (raqueteEsquerda.y < grid) {
      raqueteEsquerda.y = grid;
    } else if (raqueteEsquerda.y > limiteRaquete) {
      raqueteEsquerda.y = limiteRaquete;
    }
  
    if (raqueteDireita.y < grid) {
      raqueteDireita.y = grid;
    } else if (raqueteDireita.y > limiteRaquete) {
      raqueteDireita.y = limiteRaquete;
    }
  
    context.fillStyle = 'white';
    context.fillRect(raqueteEsquerda.x, raqueteEsquerda.y, raqueteEsquerda.width, raqueteEsquerda.height);
    context.fillRect(raqueteDireita.x, raqueteDireita.y, raqueteDireita.width, raqueteDireita.height);
    
    ball.x += ball.dx;
    ball.y += ball.dy;
  
    if (ball.y < grid) {
      ball.y = grid;
      ball.dy *= -1;
    } else if (ball.y + grid > canvas.height - grid) {
      ball.y = canvas.height - (grid * 2);
      ball.dy *= -1;
    }
  
    if (Colisao(ball, raqueteDireita)) {
      ball.dx *= -1;
      ball.x = raqueteDireita.x - ball.width;
    } else if (Colisao(ball, raqueteEsquerda)) {
      ball.dx *= -1;
      ball.x = raqueteEsquerda.x + raqueteEsquerda.width;
    }
  
    if ((ball.x < 0 || ball.x > canvas.width) && !ball.reset) {
      ball.reset = true;
      
      if (ball.x < 0) {
        scoreRight++;
        if (scoreRight === maxScore) {
          setTimeout(() => showGameOver('right'), 250);
        }
      } else if (ball.x > canvas.width) {
        scoreLeft++;
        if (scoreLeft === maxScore) {
          setTimeout(() => showGameOver('left'), 250);
        }
      }
  
      setTimeout(() => {
        ball.reset = false;
        ball.x = canvas.width / 2 - grid / 2;
        ball.y = canvas.height / 2 - grid / 2;
        ball.dx *= -1;
        ball.dy *= direcaoAleatoria();
      }, 500);
    }
  
    context.fillStyle = 'white';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    if (gamePause) {
      showGamePause();
    }
  } else {
    return showGameStart();
  }
}

document.addEventListener('keydown',(e) => {
  if (e.key === 'n') {
    if (gameOver) {
      rAF = requestAnimationFrame(game);
      gameOver = false;
    }
    gameStart = true;
    scoreLeft = 0;
    scoreRight = 0;
    ball.x = canvas.width / 2 - grid / 2;
    ball.y = canvas.height / 2 - grid / 2;
    ball.dx *= direcaoAleatoria();
    ball.dy *= direcaoAleatoria();
    raqueteEsquerda.y = canvas.height / 2 - alturaRaquete / 2;
    raqueteDireita.y = canvas.height / 2 - alturaRaquete / 2;
  }

  if (!gameStart || gameOver) {
    if (e.key === '+' && maxScore < 99) {
      maxScore++;
    }
    if (e.key === '-' && maxScore > 1) {
      maxScore--;
    }
  }

  if (gameStart) {
    if (e.key === 'p') {
      if (!gamePause) {
        gamePause = true;
      } else {
        requestAnimationFrame(game);
        gamePause = false;
      }
    }

    if (e.key === 'ArrowUp') {
      raqueteDireita.dy = -velocidadeRaquete;
    }
    if (e.key === 'ArrowDown') {
      raqueteDireita.dy = velocidadeRaquete;
    }
    if (e.key === 'w') {
      raqueteEsquerda.dy = -velocidadeRaquete;
    }
    if (e.key === 's') {
      raqueteEsquerda.dy = velocidadeRaquete;
    }
  }
})

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    raqueteDireita.dy = 0;
  }
  if (e.key === 'w' || e.key === 's') {
    raqueteEsquerda.dy = 0;
  }
})

rAF = requestAnimationFrame(game);
window.onload = () => {
  refreshLoop();
}
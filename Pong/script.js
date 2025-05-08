const canvas = document.getElementById('jogo');
const context = canvas.getContext('2d');

canvas.style.border = '3px solid rgba(255, 255, 255, 0.2)';
const grid = 15;

const direcaoAleatoria = () => Math.random() < 0.5 ? -1 : 1;

// dados da raquete
const velocidadeRaquete = 12;
const alturaRaquete = grid * 9;
const limiteRaquete = canvas.height - grid - alturaRaquete;
const bolaAceleracao = 1.2;
const bolaLimite = 35;

// raquetes
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

const bola = {
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

// inicio de jogo
function mostrarinicioDeJogo() {
  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'firebrick';
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 90);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('Começar o jogo', canvas.width / 2, canvas.height / 2);
  context.fillText('Pressione "N" para iniciar!', canvas.width / 2, (canvas.height / 2) + 30);
}
// pausa o jogo
function pausarJogo() {
  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('Jogo pausado', canvas.width / 2, canvas.height / 2);
  context.fillText('Pressione "P" para continuar', canvas.width / 2, (canvas.height / 2) + 30);
}

// fim de jogo
function fimJogo(paddle) {
  cancelAnimationFrame(rAF);
  fimDeJogo = true;
  inicioDeJogo = false;

  context.fillStyle = 'rgba(15,15,15,0.5)';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'firebrick';
  context.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);

  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '15px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('Fim de Jogo', canvas.width / 2, canvas.height / 2 - 30);
  context.fillText(
    paddle === 'left' ? 'Raquete da ESQUERDA venceu!' : 
    paddle === 'right' && 'Raquete da DIREITA venceu!', 
    canvas.width / 2, canvas.height / 2);
  context.fillText('Pressione "N" para jogar de novo', canvas.width / 2, (canvas.height / 2) + 30);
}




// var do jogo
let pontuacaoDireita = 0;
let pontuacaoEsquerda = 0;
let maxPontos = 5;
let rAF = null;
let fimDeJogo = false;
let inicioDeJogo = false;
let jogoPausado = false;


function game() {
  if (!jogoPausado) {
    rAF = requestAnimationFrame(game);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'lightgrey';
  context.fillRect(0,0,canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.width);

  context.font = '30px "Courier New", Courier, monospace';
  context.fillText(('0' + pontuacaoDireita).slice(-2), grid * 5, grid * 5);
  context.fillText(('0' + pontuacaoEsquerda).slice(-2), canvas.width - (grid * 8), grid * 5);
  
  for (let i = grid; i < canvas.height - grid; i+= grid * 2) {
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }

  document.getElementById('maxPontos').innerText = ('0' + maxPontos).slice(-2);

  if (inicioDeJogo) {
    // MOVIMENTO DA RAQUETE
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
  
    // TEXTURA DAS RAQUETES
    context.fillStyle = 'white';
    context.fillRect(raqueteEsquerda.x, raqueteEsquerda.y, raqueteEsquerda.width, raqueteEsquerda.height);
    context.fillRect(raqueteDireita.x, raqueteDireita.y, raqueteDireita.width, raqueteDireita.height);
    
    // MOVIMENTO DA BOLA
    bola.x += bola.dx;
    bola.y += bola.dy;
  
    // COLISÃO VERTICAL DA BOLA
    if (bola.y < grid) {
      bola.y = grid;
      bola.dy *= -1;
    } else if (bola.y + grid > canvas.height - grid) {
      bola.y = canvas.height - (grid * 2);
      bola.dy *= -1;
    }
  
    // COLISÃO BOLA RAQUETE
    if (Colisao(bola, raqueteDireita)) {
      bola.dx = Math.max(-bolaLimite, bola.dx * -bolaAceleracao);
      bola.x = raqueteDireita.x - bola.width;
    } else if (Colisao(bola, raqueteEsquerda)) {
      bola.dx = Math.min(bolaLimite, bola.dx * -bolaAceleracao);
      bola.x = raqueteEsquerda.x + raqueteEsquerda.width;
    }
    
  
    // BOLA POTUAÇÃO E GAME OVER
    if ((bola.x < 0 || bola.x > canvas.width) && !bola.reset) {
      bola.reset = true;
      
      if (bola.x < 0) {
        pontuacaoEsquerda++;
        if (pontuacaoEsquerda === maxPontos) {
          setTimeout(() => fimJogo('right'), 250);
        }
      } else if (bola.x > canvas.width) {
        pontuacaoDireita++;
        if (pontuacaoDireita === maxPontos) {
          setTimeout(() => fimJogo('left'), 250);
        }
      }
  
      setTimeout(() => {
        bola.reset = false;
        bola.x = canvas.width / 2 - grid / 2;
        bola.y = canvas.height / 2 - grid / 2;
        bola.dx = -1 * velocidadeBola;
        bola.dy = velocidadeBola;
      }, 700);
    }
  
    context.fillStyle = 'white';
    context.fillRect(bola.x, bola.y, bola.width, bola.height);
    if (jogoPausado) {
      pausarJogo();
    }
  } else {
    return mostrarinicioDeJogo();
  }
}

document.addEventListener('keydown',(e) => {
  if (e.key === 'n') {
    if (fimDeJogo) {
      rAF = requestAnimationFrame(game);
      fimDeJogo = false;
    }
    inicioDeJogo = true;
    pontuacaoDireita = 0;
    pontuacaoEsquerda = 0;
    bola.x = canvas.width / 2 - grid / 2;
    bola.y = canvas.height / 2 - grid / 2;
    bola.dx *= direcaoAleatoria();
    bola.dy *= direcaoAleatoria();
    raqueteEsquerda.y = canvas.height / 2 - alturaRaquete / 2;
    raqueteDireita.y = canvas.height / 2 - alturaRaquete / 2;
  }

  if (!inicioDeJogo || fimDeJogo) {
    if (e.key === '+' && maxPontos < 99) {
      maxPontos++;
    }
    if (e.key === '-' && maxPontos > 1) {
      maxPontos--;
    }
  }

  if (inicioDeJogo) {
    if (e.key === 'p') {
      if (!jogoPausado) {
        jogoPausado = true;
      } else {
        requestAnimationFrame(game);
        jogoPausado = false;
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
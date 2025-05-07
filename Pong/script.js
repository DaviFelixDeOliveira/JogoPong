const canvas = document.getElementById('jogo');
const contexto = canvas.getContext('2d');
 
// Borda do canvas
canvas.style.border = '3px solid rgba(255, 255, 255, 0.2)';
 
const grade = 15;
 
// Direção aleatória para o início da bola
const direcaoAleatoria = () => Math.random() < 0.5 ? -1 : 1;
 
const velocidadeRaquete = 6;
const alturaRaquete = grade * 5;
const limiteRaqueteY = canvas.height - grade - alturaRaquete;
 
// Raquete esquerda
const raqueteEsquerda = {
  x: grade * 2,
  y: canvas.height / 2 - alturaRaquete / 2,
  largura: grade,
  altura: alturaRaquete,
  dy: 0
};
 
// Raquete direita
const raqueteDireita = {
  x: canvas.width - (grade * 3),
  y: canvas.height / 2 - alturaRaquete / 2,
  largura: grade,
  altura: alturaRaquete,
  dy: 0
};
 
// Bola
const velocidadeInicial = 5 * direcaoAleatoria();
const bola = {
  x: canvas.width / 2 - grade / 2,
  y: canvas.height / 2 - grade / 2,
  largura: grade,
  altura: grade,
  reset: false,
  dx: velocidadeInicial,
  dy: -velocidadeInicial
};
 
const velocidadeMaxima = 12;
 
// Colisão entre dois objetos
function colide(a, b) {
  return a.x < b.x + b.largura &&
         a.x + a.largura > b.x &&
         a.y < b.y + b.altura &&
         a.y + a.altura > b.y;
}
 
// Tela inicial
function mostrarInicio() {
  contexto.fillStyle = 'rgba(15,15,15,0.5)';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
 
  contexto.fillStyle = 'firebrick';
  contexto.fillRect(0, canvas.height / 2 - 30, canvas.width, 90);
 
  contexto.globalAlpha = 1;
  contexto.fillStyle = 'white';
  contexto.font = '15px monospace';
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillText('INICIAR JOGO', canvas.width / 2, canvas.height / 2);
  contexto.fillText('Pressione "N" para começar', canvas.width / 2, canvas.height / 2 + 30);
}
 
// Tela pausa
function mostrarPausa() {
  contexto.fillStyle = 'rgba(15,15,15,0.5)';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
 
  contexto.globalAlpha = 1;
  contexto.fillStyle = 'white';
  contexto.font = '15px monospace';
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillText('Jogo pausado', canvas.width / 2, canvas.height / 2);
  contexto.fillText('Pressione "P" para continuar', canvas.width / 2, canvas.height / 2 + 30);
}
 
// Tela fim de jogo
function mostrarFim(vencedor) {
  cancelAnimationFrame(rAF);
  jogoFinalizado = true;
  jogoIniciado = false;
 
  contexto.fillStyle = 'rgba(15,15,15,0.5)';
  contexto.fillRect(0, 0, canvas.width, canvas.height);
 
  contexto.fillStyle = 'firebrick';
  contexto.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
 
  contexto.globalAlpha = 1;
  contexto.fillStyle = 'white';
  contexto.font = '15px monospace';
  contexto.textAlign = 'center';
  contexto.textBaseline = 'middle';
  contexto.fillText('FIM DE JOGO', canvas.width / 2, canvas.height / 2 - 30);
  contexto.fillText(
    vencedor === 'esquerda' ? 'Jogador 1 VENCEU!' :
    vencedor === 'direita' && 'Jogador 2 VENCEU!',
    canvas.width / 2, canvas.height / 2
  );
  contexto.fillText('Pressione "N" para jogar novamente', canvas.width / 2, canvas.height / 2 + 30);
}
 
// FPS
const tempos = [];
function atualizarFPS() {
  window.requestAnimationFrame(() => {
    const agora = performance.now();
    while (tempos.length > 0 && tempos[0] <= agora - 1000) {
      tempos.shift();
    }
    tempos.push(agora);
    document.getElementById('fps-counter').innerText = tempos.length;
    atualizarFPS();
  });
}
 
// Pontuação
let pontosEsquerda = 0;
let pontosDireita = 0;
let pontuacaoMaxima = 5;
 
let rAF = null;
let jogoFinalizado = false;
let jogoIniciado = false;
let jogoPausado = false;
 
// Função principal
function jogo() {
  if (!jogoPausado) {
    rAF = requestAnimationFrame(() => {
      setTimeout(() => {
        jogo();
      }, 1000 / 100);
    });
  }
 
  contexto.clearRect(0, 0, canvas.width, canvas.height);
 
  // Linhas superior e inferior
  contexto.fillStyle = 'lightgrey';
  contexto.fillRect(0, 0, canvas.width, grade);
  contexto.fillRect(0, canvas.height - grade, canvas.width, grade);
 
  // Placar
  contexto.font = '30px "Courier New", Courier, monospace';
  contexto.fillText(('0' + pontosEsquerda).slice(-2), grade * 5, grade * 5);
  contexto.fillText(('0' + pontosDireita).slice(-2), canvas.width - (grade * 8), grade * 5);
 
  // Linha central
  for (let i = grade; i < canvas.height - grade; i += grade * 2) {
    contexto.fillRect(canvas.width / 2 - grade / 2, i, grade, grade);
  }
 
  document.getElementById('max-score').innerText = ('0' + pontuacaoMaxima).slice(-2);
 
  if (jogoIniciado) {
    // Movimento das raquetes
    raqueteEsquerda.y += raqueteEsquerda.dy;
    raqueteDireita.y += raqueteDireita.dy;
 
    // Limites das raquetes
    raqueteEsquerda.y = Math.max(grade, Math.min(limiteRaqueteY, raqueteEsquerda.y));
    raqueteDireita.y = Math.max(grade, Math.min(limiteRaqueteY, raqueteDireita.y));
 
    // Desenhar raquetes
    contexto.fillStyle = 'white';
    contexto.fillRect(raqueteEsquerda.x, raqueteEsquerda.y, raqueteEsquerda.largura, raqueteEsquerda.altura);
    contexto.fillRect(raqueteDireita.x, raqueteDireita.y, raqueteDireita.largura, raqueteDireita.altura);
 
    // Movimento da bola
    bola.x += bola.dx;
    bola.y += bola.dy;
 
    // Colisão com topo e fundo
    if (bola.y < grade || bola.y + grade > canvas.height - grade) {
      bola.dy *= -1;
      bola.y = Math.max(grade, Math.min(canvas.height - grade - grade, bola.y));
    }
 
    // Colisão com raquetes
    if (colide(bola, raqueteDireita)) {
      bola.dx *= -1;
      bola.x = raqueteDireita.x - bola.largura;
      bola.dx *= 1.1;
      bola.dy *= 1.1;
    } else if (colide(bola, raqueteEsquerda)) {
      bola.dx *= -1;
      bola.x = raqueteEsquerda.x + raqueteEsquerda.largura;
      bola.dx *= 1.1;
      bola.dy *= 1.1;
    }
 
    // Limita velocidade máxima
    bola.dx = Math.sign(bola.dx) * Math.min(Math.abs(bola.dx), velocidadeMaxima);
    bola.dy = Math.sign(bola.dy) * Math.min(Math.abs(bola.dy), velocidadeMaxima);
 
    // Ponto marcado
    if ((bola.x < 0 || bola.x > canvas.width) && !bola.reset) {
      bola.reset = true;
 
      if (bola.x < 0) {
        pontosDireita++;
        if (pontosDireita === pontuacaoMaxima) {
          return setTimeout(() => mostrarFim('direita'), 250);
        }
      } else {
        pontosEsquerda++;
        if (pontosEsquerda === pontuacaoMaxima) {
          return setTimeout(() => mostrarFim('esquerda'), 250);
        }
      }
 
      setTimeout(() => {
        bola.reset = false;
        bola.x = canvas.width / 2 - grade / 2;
        bola.y = canvas.height / 2 - grade / 2;
        bola.dx = 5 * direcaoAleatoria();
        bola.dy = 5 * direcaoAleatoria();
      }, 500);
    }
 
    // Cálculo da velocidade para tamanho da bola
    const velocidadeAtual = Math.sqrt(bola.dx ** 2 + bola.dy ** 2);
    const escala = Math.min(1.5, 1 + (velocidadeAtual - 5) / 10);
    const tamanhoAtual = grade * escala;
 
    // Desenhar bola com tamanho proporcional à velocidade
    contexto.fillStyle = 'white';
    contexto.fillRect(
      bola.x + (grade - tamanhoAtual) / 2,
      bola.y + (grade - tamanhoAtual) / 2,
      tamanhoAtual,
      tamanhoAtual
    );
 
    if (jogoPausado) mostrarPausa();
  } else {
    return mostrarInicio();
  }
}
 
// Controles
document.addEventListener('keydown', (e) => {
  if (e.key === 'n') {
    if (jogoFinalizado) rAF = requestAnimationFrame(jogo);
    jogoFinalizado = false;
    jogoIniciado = true;
    pontosEsquerda = 0;
    pontosDireita = 0;
    bola.x = canvas.width / 2 - grade / 2;
    bola.y = canvas.height / 2 - grade / 2;
    bola.dx = 5 * direcaoAleatoria();
    bola.dy = 5 * direcaoAleatoria();
    raqueteEsquerda.y = canvas.height / 2 - alturaRaquete / 2;
    raqueteDireita.y = canvas.height / 2 - alturaRaquete / 2;
  }
 
  if (!jogoIniciado || jogoFinalizado) {
    if (e.key === '+' && pontuacaoMaxima < 99) pontuacaoMaxima++;
    if (e.key === '-' && pontuacaoMaxima > 1) pontuacaoMaxima--;
  }
 
  if (jogoIniciado) {
    if (e.key === 'p') {
      if (!jogoPausado) jogoPausado = true;
      else {
        requestAnimationFrame(jogo);
        jogoPausado = false;
      }
    }
    if (e.key === 'w') raqueteEsquerda.dy = -velocidadeRaquete;
    if (e.key === 's') raqueteEsquerda.dy = velocidadeRaquete;
    if (e.key === 'ArrowUp') raqueteDireita.dy = -velocidadeRaquete;
    if (e.key === 'ArrowDown') raqueteDireita.dy = velocidadeRaquete;
  }
});
 
document.addEventListener('keyup', (e) => {
  if (['w', 's'].includes(e.key)) raqueteEsquerda.dy = 0;
  if (['ArrowUp', 'ArrowDown'].includes(e.key)) raqueteDireita.dy = 0;
});
 
// Inicia o loop do jogo
rAF = requestAnimationFrame(jogo);
window.onload = atualizarFPS;
 
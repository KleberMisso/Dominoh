const mesa = document.getElementById("mesa");
const maoJogadorDiv = document.getElementById("mao-jogador");

let maoJogador = [];
let pecas = [];
let maoComputador = [];
let extremidadeEsquerda = null;
let extremidadeDireita = null;

// =============================
// 1️⃣ Criar todas as peças (0-0 até 6-6)
// =============================

function criarMetade(valor) {
  const metade = document.createElement("div");
  metade.classList.add("metade");

  const posicoes = {
    0: [],
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  for (let i = 0; i < 9; i++) {
    if (posicoes[valor].includes(i)) {
      const ponto = document.createElement("div");
      ponto.classList.add("ponto");
      metade.appendChild(ponto);
    } else {
      const vazio = document.createElement("div");
      metade.appendChild(vazio);
    }
  }

  return metade;
}

function criarPecas() {
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      pecas.push({ a: i, b: j });
    }
  }
}

// =============================
// 2️⃣ Embaralhar (Fisher-Yates)
// =============================
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// =============================
// 3️⃣ Distribuir peças
// =============================
function distribuirPecas() {
  embaralhar(pecas);

  for (let i = 0; i < 7; i++) {
    maoJogador.push(pecas.pop());
    maoComputador.push(pecas.pop());
  }
}


// =============================
// Placeholder da função jogar
// (vamos implementar na próxima etapa)
// =============================
function jogarPeca(index) {
  const peca = maoJogador[index];

  // Primeira validação
  if (
    peca.a !== extremidadeEsquerda &&
    peca.b !== extremidadeEsquerda &&
    peca.a !== extremidadeDireita &&
    peca.b !== extremidadeDireita
  ) {
    console.log("Peça inválida");
    return;
  }

  // Verificar se encaixa na esquerda
  if (peca.b === extremidadeEsquerda) {
    extremidadeEsquerda = peca.a;
    adicionarNaEsquerda(peca);
  } else if (peca.a === extremidadeEsquerda) {
    extremidadeEsquerda = peca.b;
    inverterPeca(peca);
    adicionarNaEsquerda(peca);
  }

  // Verificar se encaixa na direita
  else if (peca.a === extremidadeDireita) {
    extremidadeDireita = peca.b;
    adicionarNaDireita(peca);
  } else if (peca.b === extremidadeDireita) {
    extremidadeDireita = peca.a;
    inverterPeca(peca);
    adicionarNaDireita(peca);
  }

  // Remove da mão
 maoJogador.splice(index, 1);

// Atualiza visual da mão
renderizarMao();

console.log("Esquerda:", extremidadeEsquerda);
console.log("Direita:", extremidadeDireita);

}

// =============================
// 5️⃣ Iniciar jogo
// =============================


function renderizarMao() {
  maoJogadorDiv.innerHTML = "";

  maoJogador.forEach((peca, index) => {
    const div = criarDivPeca(peca);

    div.addEventListener("click", () => jogarPeca(index));

    maoJogadorDiv.appendChild(div);
  });
}

function colocarPrimeiraPeca() {
  const primeira = maoJogador.pop();

  extremidadeEsquerda = primeira.a;
  extremidadeDireita = primeira.b;

    renderizarMesa(primeira);

}

function renderizarMesa(peca) {
  const div = criarDivPeca(peca);
  mesa.appendChild(div);
}

function iniciarJogo() {
  criarPecas();
  distribuirPecas();

  colocarPrimeiraPeca(); // 👈 NOVO

  renderizarMao();

  console.log("Extremidade esquerda:", extremidadeEsquerda);
  console.log("Extremidade direita:", extremidadeDireita);
}

function adicionarNaDireita(peca) {
  const div = criarDivPeca(peca);
  mesa.appendChild(div);
}

function adicionarNaEsquerda(peca) {
  const div = criarDivPeca(peca);
  mesa.prepend(div);
}

function inverterPeca(peca) {
  [peca.a, peca.b] = [peca.b, peca.a];
}

function criarDivPeca(peca) {
  const div = document.createElement("div");
  div.classList.add("peca");

  const metadeA = criarMetade(peca.a);
  const metadeB = criarMetade(peca.b);

  div.appendChild(metadeA);
  div.appendChild(metadeB);

  return div;
}


iniciarJogo();
const mesa = document.getElementById("mesa");
const areaMesa = document.getElementById("area-mesa");
const maoJogadorDiv = document.getElementById("mao-jogador");

let maoJogador = [];
let pecas = [];
let maoComputador = [];
let extremidadeEsquerda = null;
let extremidadeDireita = null;
let pecaSelecionada = null;
let indexSelecionado = null;

const marcadorEsquerda = document.getElementById("marcador-esquerda");
const marcadorDireita = document.getElementById("marcador-direita");

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


function jogarPeca(index) {
  const peca = maoJogador[index];

  const combinaEsquerda =
    peca.a === extremidadeEsquerda ||
    peca.b === extremidadeEsquerda;

  const combinaDireita =
    peca.a === extremidadeDireita ||
    peca.b === extremidadeDireita;

  if (!combinaEsquerda && !combinaDireita) {
    console.log("Peça inválida");
    return;
  }

  // Guarda peça selecionada
  pecaSelecionada = peca;
  indexSelecionado = index;

  // Mostra marcadores válidos
  if (combinaEsquerda) {
    marcadorEsquerda.style.display = "block";
  }

  if (combinaDireita) {
    marcadorDireita.style.display = "block";
  }
}

function jogarSelecionada(lado) {
  if (!pecaSelecionada) return;

  const peca = pecaSelecionada;
  const index = indexSelecionado;

  if (lado === "esquerda") {
    if (peca.b === extremidadeEsquerda) {
      extremidadeEsquerda = peca.a;
    } else {
      inverterPeca(peca);
      extremidadeEsquerda = peca.a;
    }

    adicionarNaEsquerda(peca);
  }

  if (lado === "direita") {
    if (peca.a === extremidadeDireita) {
      extremidadeDireita = peca.b;
    } else {
      inverterPeca(peca);
      extremidadeDireita = peca.b;
    }

    adicionarNaDireita(peca);
  }

  // Remove da mão
  maoJogador.splice(index, 1);
  renderizarMao();

  // Limpa seleção
  pecaSelecionada = null;
  indexSelecionado = null;

  marcadorEsquerda.style.display = "none";
  marcadorDireita.style.display = "none";

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
  areaMesa.appendChild(div);
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
  areaMesa.appendChild(div);
}

function adicionarNaEsquerda(peca) {
  const div = criarDivPeca(peca);
  areaMesa.prepend(div);
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

marcadorEsquerda.addEventListener("click", () => {
  jogarSelecionada("esquerda");
});

marcadorDireita.addEventListener("click", () => {
  jogarSelecionada("direita");
});

iniciarJogo();
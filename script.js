const mesa = document.getElementById("mesa");
const areaMesa = document.getElementById("area-mesa");
const maoJogadorDiv = document.getElementById("mao-jogador");

let maoJogador = [];
let pecas = [];
let maoComputador1 = [];
let maoComputador2 = [];
let maoComputador3 = [];
let extremidadeEsquerda = null;
let extremidadeDireita = null;
let pecaSelecionada = null;
let indexSelecionado = null;
let ordemTurnos = ["jogador", "comp3", "parceiro", "comp1"];
let turnoAtualIndex = 0;

const marcadorEsquerda = document.getElementById("marcador-esquerda");
const marcadorDireita = document.getElementById("marcador-direita");

let mostrarPecas = false;

function renderizarMaoReal(id, mao) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  mao.forEach(peca => {
    const div = criarDivPeca(peca);
    container.appendChild(div);
  });
}

document.getElementById("toggle-visao").addEventListener("click", () => {
  mostrarPecas = !mostrarPecas;

  const btn = document.getElementById("toggle-visao");
  btn.textContent = mostrarPecas
    ? "Esconder"
    : "Mostrar";

  atualizarVisao();
});

function atualizarVisao() {
  renderizarMao();

  if (mostrarPecas) {
    renderizarMaoReal("mao-esquerda", maoComputador1);
    renderizarMaoReal("mao-direita", maoComputador3);
    renderizarMaoReal("mao-parceiro", maoComputador2);
  } else {
    renderizarMaoVerso("mao-esquerda", maoComputador1.length);
    renderizarMaoVerso("mao-direita", maoComputador3.length);
    renderizarMaoVerso("mao-parceiro", maoComputador2.length);
  }
}

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
    maoComputador1.push(pecas.pop());
    maoComputador2.push(pecas.pop());
    maoComputador3.push(pecas.pop());
  }
}

function jogadorTemJogada() {
  return maoJogador.some(peca => 
    peca.a === extremidadeEsquerda ||
    peca.b === extremidadeEsquerda ||
    peca.a === extremidadeDireita ||
    peca.b === extremidadeDireita
  );
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
    proximoTurno();
  }

  if (lado === "direita") {
    if (peca.a === extremidadeDireita) {
      extremidadeDireita = peca.b;
    } else {
      inverterPeca(peca);
      extremidadeDireita = peca.b;
    }

    adicionarNaDireita(peca);
    proximoTurno();
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

function jogadorAtual() {
  return ordemTurnos[turnoAtualIndex];
}

function proximoTurno() {
  turnoAtualIndex++;

  if (turnoAtualIndex >= ordemTurnos.length) {
    turnoAtualIndex = 0;
  }

  console.log("Agora é a vez de:", jogadorAtual());
  atualizarDestaque();
  executarTurno();
}


function criarPecaVerso() {
  const peca = document.createElement("div");
  peca.classList.add("peca");

  // remove qualquer conteúdo interno
  peca.innerHTML = "";

  return peca;
}

function renderizarMaoVerso(id, quantidade) {
  const mao = document.getElementById(id);
  mao.innerHTML = "";

  for (let i = 0; i < quantidade; i++) {
    const peca = criarPecaVerso();
    mao.appendChild(peca);
  }
}

renderizarMaoVerso("mao-esquerda", 7);
renderizarMaoVerso("mao-direita", 7);
renderizarMaoVerso("mao-parceiro", 7);


function renderizarMao() {
  maoJogadorDiv.innerHTML = "";

  maoJogador.forEach((peca, index) => {
    const div = criarDivPeca(peca);

    div.addEventListener("click", () => jogarPeca(index));

    maoJogadorDiv.appendChild(div);
  });
}

function colocarPrimeiraPeca() {
  const resultado = encontrarMaiorDuplo();

  if (!resultado.vencedor) {
    console.log("Nenhum duplo encontrado.");
    return;
  }

  const { vencedor, indexPeca } = resultado;

  const primeira = vencedor.mao.splice(indexPeca, 1)[0];

  extremidadeEsquerda = primeira.a;
  extremidadeDireita = primeira.b;

  renderizarMesa(primeira);

  // Define quem começa (quem jogou a Senona)
  turnoAtualIndex = ordemTurnos.indexOf(vencedor.nome);

  console.log("Começa:", vencedor.nome);

  atualizarDestaque();
  executarTurno();
}

function encontrarMaiorDuplo() {
  const jogadores = [
    { nome: "jogador", mao: maoJogador },
    { nome: "comp3", mao: maoComputador3 },
    { nome: "parceiro", mao: maoComputador2 },
    { nome: "comp1", mao: maoComputador1 }
  ];

  let maiorDuplo = -1;
  let vencedor = null;
  let indexPeca = null;

  jogadores.forEach(jogador => {
    jogador.mao.forEach((peca, index) => {
      if (peca.a === peca.b && peca.a > maiorDuplo) {
        maiorDuplo = peca.a;
        vencedor = jogador;
        indexPeca = index;
      }
    });
  });

  return { vencedor, indexPeca, valor: maiorDuplo };
}

function renderizarMesa(peca) {
  const div = criarDivPeca(peca);
  areaMesa.appendChild(div);
}

function iniciarJogo() {
  criarPecas();
  distribuirPecas();

  colocarPrimeiraPeca(); 

  atualizarVisao(); 

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

    if (peca.a === peca.b) {
    div.classList.add("duplo"); // marca como dobrão
  }

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

function executarTurno() {
  const atual = jogadorAtual();

 if (atual === "jogador") {

  if (!jogadorTemJogada()) {
    console.log("Jogador passou a vez.");
    mostrarPassou("jogador");

    setTimeout(() => {
      proximoTurno();
    }, 800);

    return;
  }

    return; // espera clique
  }

  console.log("Turno do", atual);

  let mao;

  if (atual === "comp1") mao = maoComputador1;
  if (atual === "comp3") mao = maoComputador3;
  if (atual === "parceiro") mao = maoComputador2;

  setTimeout(() => {
    jogarComputador(mao);
    proximoTurno();
  }, 800);
}

function atualizarDestaque() {

  document.querySelectorAll(
    ".area-jogador, .area-adversario, .area-parceiro"
  ).forEach(el => el.classList.remove("ativo"));

  const atual = jogadorAtual();

  if (atual === "jogador") {
    document.querySelector(".area-jogador").classList.add("ativo");
  }

  if (atual === "comp1") {
    document.querySelector(".area-adversario.esquerda").classList.add("ativo");
  }

  if (atual === "comp3") {
    document.querySelector(".area-adversario.direita").classList.add("ativo");
  }

  if (atual === "parceiro") {
    document.querySelector(".area-parceiro").classList.add("ativo");
  }
}

//IA jogando

function jogarComputador(mao) {

  for (let i = 0; i < mao.length; i++) {

    const peca = mao[i];

    const combinaEsquerda =
      peca.a === extremidadeEsquerda ||
      peca.b === extremidadeEsquerda;

    const combinaDireita =
      peca.a === extremidadeDireita ||
      peca.b === extremidadeDireita;

    if (combinaEsquerda) {

      if (peca.b === extremidadeEsquerda) {
        extremidadeEsquerda = peca.a;
      } else {
        inverterPeca(peca);
        extremidadeEsquerda = peca.a;
      }

      adicionarNaEsquerda(peca);
      mao.splice(i, 1);
      return;
    }

    if (combinaDireita) {

      if (peca.a === extremidadeDireita) {
        extremidadeDireita = peca.b;
      } else {
        inverterPeca(peca);
        extremidadeDireita = peca.b;
      }

      adicionarNaDireita(peca);
      mao.splice(i, 1);
      return;
    }
  }

  console.log("Computador passou a vez.");
  mostrarPassou(jogadorAtual());
}

function mostrarPassou(nome) {

  const status = document.getElementById("status-" + nome);

  if (!status) return;

  status.textContent = "Passou";
  status.classList.add("passou");

  setTimeout(() => {
    status.textContent = "";
    status.classList.remove("passou");
  }, 1500);
}

iniciarJogo();
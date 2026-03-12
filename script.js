const areaMesa = document.getElementById("area-mesa");
const maoJogadorDiv = document.getElementById("mao-jogador");

const marcadorEsquerda = document.getElementById("marcador-esquerda");
const marcadorDireita = document.getElementById("marcador-direita");

let pecas = [];
let maoJogador = [];
let maoComp1 = [];
let maoComp2 = [];
let maoComp3 = [];

let extremidadeEsquerda = null;
let extremidadeDireita = null;

let pecaSelecionada = null;
let indexSelecionado = null;

let ultimaDireita = null;
let ultimaEsquerda = null;

let direcaoDireita = "direita";
let direcaoEsquerda = "esquerda";

let mostrarPecas = false;

let ordemTurnos = ["jogador", "comp3", "parceiro", "comp1"];
let turnoIndex = 0;

let centroX = 500;
let centroY = 220;

let posDireita = { x: centroX, y: centroY };
let posEsquerda = { x: centroX, y: centroY };

const espacamento = 14;




/* ---------------- PEÇAS ---------------- */

function criarMetade(valor) {

  const metade = document.createElement("div");
  metade.classList.add("metade");

  const pos = {
    0: [],
    1: [4],
    2: [0,8],
    3: [0,4,8],
    4: [0,2,6,8],
    5: [0,2,4,6,8],
    6: [0,2,3,5,6,8]
  };

  for(let i=0;i<9;i++){

    if(pos[valor].includes(i)){

      const p=document.createElement("div");
      p.classList.add("ponto");
      metade.appendChild(p);

    }else{

      metade.appendChild(document.createElement("div"));

    }

  }

  return metade;
}

function criarDivPeca(peca){

  const div=document.createElement("div");
  div.classList.add("peca");

  if(peca.a===peca.b){
    div.classList.add("duplo");
  }

  div.appendChild(criarMetade(peca.a));
  div.appendChild(criarMetade(peca.b));

  return div;
}



/* ---------------- CRIAR PEÇAS ---------------- */

function criarPecas(){

  for(let i=0;i<=6;i++){
    for(let j=i;j<=6;j++){
      pecas.push({a:i,b:j});
    }
  }

}

function embaralhar(array){

  for(let i=array.length-1;i>0;i--){

    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];

  }

}

function distribuir(){

  embaralhar(pecas);

  for(let i=0;i<7;i++){

    maoJogador.push(pecas.pop());
    maoComp1.push(pecas.pop());
    maoComp2.push(pecas.pop());
    maoComp3.push(pecas.pop());

  }

}

function tamanhoPeca(peca){

  if(peca.a === peca.b){
    return { largura:30, altura:78 }
  }

  return { largura:80, altura:25 }

}



/* ---------------- RENDER MÃOS ---------------- */

function renderizarMao(){

  maoJogadorDiv.innerHTML="";

  maoJogador.forEach((peca,index)=>{

    const div=criarDivPeca(peca);

    div.addEventListener("click",()=>clicarPeca(index));

    maoJogadorDiv.appendChild(div);

  });

}

function renderizarVerso(id,qtd){

  const mao=document.getElementById(id);

  mao.innerHTML="";

  for(let i=0;i<qtd;i++){

    const p=document.createElement("div");
    p.classList.add("peca");

    mao.appendChild(p);

  }

}

function renderizarReal(id,mao){

  const el=document.getElementById(id);
  el.innerHTML="";

  mao.forEach(p=>{
    el.appendChild(criarDivPeca(p));
  });

}



/* ---------------- VISÃO ---------------- */

document.getElementById("toggle-visao").addEventListener("click",()=>{

  mostrarPecas=!mostrarPecas;

  atualizarVisao();

});

function atualizarVisao(){

  renderizarMao();

  if(mostrarPecas){

    renderizarReal("mao-esquerda",maoComp1);
    renderizarReal("mao-direita",maoComp3);
    renderizarReal("mao-parceiro",maoComp2);

  }else{

    renderizarVerso("mao-esquerda",maoComp1.length);
    renderizarVerso("mao-direita",maoComp3.length);
    renderizarVerso("mao-parceiro",maoComp2.length);

  }

}



/* ---------------- MESA ---------------- */

function mover(pos,dir){

  if(dir==="direita")pos.x+=passo;
  if(dir==="esquerda")pos.x-=passo;
  if(dir==="cima")pos.y-=passo;
  if(dir==="baixo")pos.y+=passo;

}

function colocarCentro(peca){

  const div=criarDivPeca(peca);

  aplicarRotacao(div,"direita");

  div.style.position="absolute";
  div.style.left=centroX+"px";
  div.style.top=centroY+"px";

  areaMesa.appendChild(div);

  posDireita.x=centroX;
  posDireita.y=centroY;

  posEsquerda.x=centroX;
  posEsquerda.y=centroY;

}

function adicionarDireita(peca){

  calcularDireita(peca);

  const div = criarDivPeca(peca);

  aplicarRotacao(div, direcaoDireita);

  div.style.position="absolute";
  div.style.left = posDireita.x+"px";
  div.style.top = posDireita.y+"px";

  areaMesa.appendChild(div);

  ultimaDireita = peca;

}

function adicionarEsquerda(peca){

  calcularEsquerda(peca);

  const div = criarDivPeca(peca);

  aplicarRotacao(div, direcaoEsquerda);

  div.style.position="absolute";
  div.style.left = posEsquerda.x+"px";
  div.style.top = posEsquerda.y+"px";

  areaMesa.appendChild(div);

  ultimaEsquerda = peca;

}


function calcularDireita(peca){

  const tamAnterior = tamanhoPeca(ultimaDireita);

  if(direcaoDireita === "direita"){
    posDireita.x += tamAnterior.largura + espacamento;

    if(posDireita.x > 900){
      direcaoDireita = "cima";
    }
  }

  else if(direcaoDireita === "cima"){
    posDireita.y -= tamAnterior.altura + espacamento;

    if(posDireita.y < 40){
      direcaoDireita = "esquerda";
    }
  }

  else if(direcaoDireita === "esquerda"){
    posDireita.x -= tamAnterior.largura + espacamento;
  }

}

function calcularEsquerda(peca){

  const tamAtual = tamanhoPeca(peca);

  if(direcaoEsquerda === "esquerda"){
    posEsquerda.x -= tamAtual.largura + espacamento;

    if(posEsquerda.x < 60){
      direcaoEsquerda = "baixo";
    }
  }

  else if(direcaoEsquerda === "baixo"){
    posEsquerda.y += tamAtual.altura + espacamento;

    if(posEsquerda.y > 380){
      direcaoEsquerda = "direita";
    }
  }

  else if(direcaoEsquerda === "direita"){
    posEsquerda.x += tamAtual.largura + espacamento;
  }

}

function aplicarRotacao(div, direcao){

  if(direcao === "direita"){
    div.style.transform = "rotate(0deg)";
  }

  if(direcao === "cima"){
    div.style.transform = "rotate(-90deg)";
  }

  if(direcao === "esquerda"){
    div.style.transform = "rotate(180deg)";
  }

  if(direcao === "baixo"){
    div.style.transform = "rotate(90deg)";
  }

}



/* ---------------- JOGADOR ---------------- */

function clicarPeca(index){

  const p=maoJogador[index];

  const esq=(p.a===extremidadeEsquerda||p.b===extremidadeEsquerda);
  const dir=(p.a===extremidadeDireita||p.b===extremidadeDireita);

  if(!esq && !dir)return;

  pecaSelecionada=p;
  indexSelecionado=index;

  marcadorEsquerda.style.display=esq?"block":"none";
  marcadorDireita.style.display=dir?"block":"none";

}

marcadorEsquerda.onclick=()=>jogarSelecionada("esquerda");
marcadorDireita.onclick=()=>jogarSelecionada("direita");

function inverter(p){
  [p.a,p.b]=[p.b,p.a];
}

function jogarSelecionada(lado){

  const p=pecaSelecionada;

  if(!p)return;

  if(lado==="direita"){

    if(p.a===extremidadeDireita){
      extremidadeDireita=p.b;
    }else{
      inverter(p);
      extremidadeDireita=p.b;
    }

    adicionarDireita(p);

  }

  if(lado==="esquerda"){

    if(p.b===extremidadeEsquerda){
      extremidadeEsquerda=p.a;
    }else{
      inverter(p);
      extremidadeEsquerda=p.a;
    }

    adicionarEsquerda(p);

  }

  maoJogador.splice(indexSelecionado,1);

  marcadorEsquerda.style.display="none";
  marcadorDireita.style.display="none";

  pecaSelecionada=null;

  atualizarVisao();

  proximoTurno();

}



/* ---------------- TURNOS ---------------- */

function jogadorAtual(){
  return ordemTurnos[turnoIndex];
}

function proximoTurno(){

  turnoIndex++;

  if(turnoIndex>=ordemTurnos.length){
    turnoIndex=0;
  }

  atualizarDestaque();
  executarTurno();

}

function atualizarDestaque(){

  document.querySelectorAll(
    ".area-jogador,.area-adversario,.area-parceiro"
  ).forEach(e=>e.classList.remove("ativo"));

  const j=jogadorAtual();

  if(j==="jogador")document.querySelector(".area-jogador").classList.add("ativo");
  if(j==="comp1")document.querySelector(".area-adversario.esquerda").classList.add("ativo");
  if(j==="comp3")document.querySelector(".area-adversario.direita").classList.add("ativo");
  if(j==="parceiro")document.querySelector(".area-parceiro").classList.add("ativo");

}



/* ---------------- IA ---------------- */

function jogarIA(mao){

  for(let i=0;i<mao.length;i++){

    const p=mao[i];

    if(p.a===extremidadeDireita||p.b===extremidadeDireita){

      if(p.a!==extremidadeDireita)inverter(p);

      extremidadeDireita=p.b;

      adicionarDireita(p);

      mao.splice(i,1);

      return true;

    }

    if(p.a===extremidadeEsquerda||p.b===extremidadeEsquerda){

      if(p.b!==extremidadeEsquerda)inverter(p);

      extremidadeEsquerda=p.a;

      adicionarEsquerda(p);

      mao.splice(i,1);

      return true;

    }

  }

  return false;

}



/* ---------------- EXECUTAR TURNO ---------------- */

function executarTurno(){

  const j=jogadorAtual();

  if(j==="jogador"){

    if(!maoJogador.some(p=>
      p.a===extremidadeDireita||
      p.b===extremidadeDireita||
      p.a===extremidadeEsquerda||
      p.b===extremidadeEsquerda
    )){
      setTimeout(proximoTurno,800);
    }

    return;
  }

  let mao;

  if(j==="comp1")mao=maoComp1;
  if(j==="comp3")mao=maoComp3;
  if(j==="parceiro")mao=maoComp2;

  setTimeout(()=>{

    jogarIA(mao);

    atualizarVisao();

    proximoTurno();

  },700);

}



/* ---------------- SENONA ---------------- */

function iniciarMesa(){

  const todos=[
    {nome:"jogador",mao:maoJogador},
    {nome:"comp1",mao:maoComp1},
    {nome:"comp3",mao:maoComp3},
    {nome:"parceiro",mao:maoComp2}
  ];

  let maior=-1;
  let vencedor=null;
  let idx=null;

  todos.forEach(j=>{

    j.mao.forEach((p,i)=>{

      if(p.a===p.b && p.a>maior){
        maior=p.a;
        vencedor=j;
        idx=i;
      }

    });

  });

  const p=vencedor.mao.splice(idx,1)[0];

  extremidadeEsquerda=p.a;
  extremidadeDireita=p.b;

  colocarCentro(p);

  ultimaDireita = p;
  ultimaEsquerda = p;

  turnoIndex=ordemTurnos.indexOf(vencedor.nome);

}



/* ---------------- INICIO ---------------- */

function iniciar(){

  criarPecas();
  distribuir();

  iniciarMesa();

  atualizarVisao();

  proximoTurno();

}

iniciar();
/*
 * Bancada de variáveis e @media: fase de LABORATÓRIO do motor, fora do
 * currículo (só no /lab/fases?fase=lab-motor-u1-f3).
 *
 * Mostra o motor resolvendo propriedades personalizadas (declaradas no
 * :root e numa regra, herdadas, encadeadas, com reserva) e avaliando
 * @media contra a largura da prévia: no painel Estilos, as variáveis
 * aparecem nas regras que as declaram, o var() mostra o valor e leva até a
 * declaração, e a regra da @media só aparece quando a tela é estreita.
 *
 * Os validadores mostram os dois jeitos de conferir: `valorEfetivo` com o
 * valor já resolvido e `larguraTela` para perguntar "e num celular?".
 */
import type { FasePratica } from "../tipos";

const CSS_DAS_VARIAVEIS = `:root {
  --cor-marca: #7b2cbf;
  --cor-fundo: #f7f0ff;
  --cor-texto: #2b2135;
  --espaco: 16px;
  --destaque: var(--cor-marca);
}

body {
  margin: 0;
  font-family: Verdana, sans-serif;
  color: var(--cor-texto);
  background-color: var(--cor-fundo);
}

header {
  background-color: var(--cor-marca);
  color: #ffffff;
  padding: var(--espaco);
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--espaco);
  padding: var(--espaco);
}

.card {
  border: 2px solid var(--destaque);
  border-radius: 12px;
  padding: 12px;
}

.card h2 {
  color: var(--destaque);
  font-size: 18px;
}

.aviso {
  color: var(--cor-alerta, #b00020);
}

.promo {
  --destaque: #e85d04;
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: 22px;
  }
}`;

export const SITE_BANCADA_VARIAVEIS = {
  url: "variaveis.motor.site",
  titulo: "Bancada de variáveis",
  head: `<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estúdio Lavanda</title>`,
  body: `<header>
  <h1>Estúdio Lavanda</h1>
  <p class="aviso">Agenda aberta para março</p>
</header>
<main class="cards">
  <article class="card">
    <h2>Yoga</h2>
    <p>Segunda e quarta, às 7h.</p>
  </article>
  <article class="card promo" id="pilates">
    <h2>Pilates</h2>
    <p>Terça e quinta, às 18h.</p>
  </article>
  <article class="card">
    <h2>Dança</h2>
    <p>Sábado, às 10h.</p>
  </article>
</main>`,
  css: CSS_DAS_VARIAVEIS,
};

export const FASE_BANCADA_VARIAVEIS: FasePratica = {
  id: "lab-motor-u1-f3",
  tipo: "pratica",
  unidadeId: "lab-motor-u1",
  titulo: "Bancada de variáveis e @media",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["editor-css", "painel-estilos", "editar-valor-css", "ligar-desligar-declaracao", "nova-regra", "painel-calculado", "modelo-de-caixa"],
  apresentar: ["editor-css", "painel-estilos", "editar-valor-css", "ligar-desligar-declaracao", "nova-regra", "painel-calculado", "modelo-de-caixa"],
  paineisElementos: ["estilos", "calculado"],
  introducao: [{ texto: "Bancada de variáveis e @media. Mexa nas variáveis do :root e veja tudo mudar junto.", expressao: "curioso" }],
  siteAlvo: SITE_BANCADA_VARIAVEIS,
  objetivos: [
    {
      id: "trocar-marca",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque a variável --cor-marca para verde (#2d6a4f).",
        toque: "Troque a variável --cor-marca para verde (#2d6a4f).",
      },
      validador: { tipo: "valorEfetivo", seletor: "header", propriedade: "background-color", valor: "#2d6a4f" },
      ajudas: {
        pergunta: "Onde a cor do cabeçalho é declarada de verdade?",
        dica: "O header usa var(--cor-marca): mude a variável no :root.",
        linha: { alvo: "css", seletorRegra: ":root", propriedade: "--cor-marca", fala: "A variável mora aqui." },
        solucao: {
          fala: "Troquei --cor-marca no :root: o cabeçalho e os cards mudaram juntos.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-marca", valor: "#2d6a4f" }],
        },
      },
      falaAoConcluir: { texto: "Uma troca, a página inteira acompanhou!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-marca", valor: "#2d6a4f" }],
    },
    {
      id: "coluna-no-celular",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "No celular (390 px), deixe os cards em duas colunas (1fr 1fr).",
        toque: "No celular (390 px), deixe os cards em duas colunas (1fr 1fr).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".cards", propriedade: "grid-template-columns", valor: "1fr 1fr", larguraTela: 390 },
          { tipo: "valorEfetivo", seletor: ".cards", propriedade: "grid-template-columns", valor: "1fr 1fr 1fr", larguraTela: 1280 },
        ],
      },
      ajudas: {
        pergunta: "Qual regra vale só em tela estreita?",
        dica: "A regra .cards dentro da @media (max-width: 600px).",
        linha: { alvo: "css", seletorRegra: ".cards", fala: "Procure a .cards de dentro da @media." },
        solucao: {
          fala: "Escrevi uma regra nova na @media, no fim da folha.",
          acoes: [{ tipo: "editarCss", posicao: "fim", texto: "@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr 1fr; }\n}" }],
        },
      },
      falaAoConcluir: { texto: "Duas colunas no celular, três no notebook.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "@media (max-width: 600px) {\n  .cards { grid-template-columns: 1fr 1fr; }\n}" }],
    },
  ],
  conclusao: [{ texto: "Bancada de variáveis testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo na bancada.", expressao: "feliz" },
};

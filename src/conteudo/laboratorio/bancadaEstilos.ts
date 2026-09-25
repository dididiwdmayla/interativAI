/*
 * Bancada de estilos: uma fase de LABORATÓRIO do motor, fora do currículo.
 *
 * Ela só aparece no /lab/fases (e abre direto por /lab/fases?fase=<id>).
 * Serve para testar a interface do CSS no navegador (editor com abas,
 * painel Estilos, Calculado, modo de caixa) e de bancada para quem escreve
 * fases de CSS ver o motor de cascata trabalhando: atalhos, !important,
 * estilo inline, herança, uma declaração desligada e a folha do navegador.
 *
 * Não é conteúdo do jogo: não entra em UNIDADES nem em FASES, não conta
 * progresso e não é publicada. As checagens da fábrica rodam nela mesmo
 * assim (testes/conteudo/css.test.ts), para ela não apodrecer.
 */
import type { FasePratica, Unidade } from "../tipos";

const CSS_DA_BANCADA = `body {
  font-family: Georgia, serif;
  color: #3b2a1a;
  background-color: #fdf6ec;
  margin: 0;
}

header {
  background: #6b3e26;
  color: #fff8ee;
  padding: 16px 24px;
}

h1 {
  font-size: 32px;
  margin: 0;
}

.slogan {
  font-style: italic;
  /* color: #ffd9a0; */
}

.cardapio {
  padding: 8px 24px;
}

.prato {
  border: 2px solid #d9b99b;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.prato .preco {
  color: #2e7d32;
  font-weight: bold;
}

#do-dia .preco {
  color: #c62828 !important;
}

.preco {
  color: #1565c0;
}`;

export const SITE_BANCADA = {
  url: "bancada.motor.site",
  titulo: "Bancada de estilos",
  head: `<title>Bistrô da Bancada</title>
<style>
  .rodape { text-align: center; font-size: 14px; }
</style>`,
  body: `<header>
  <h1>Bistrô da Bancada</h1>
  <p class="slogan">Comida caseira com tempero de laboratório</p>
</header>
<main class="cardapio">
  <h2>Pratos</h2>
  <article class="prato">
    <h3 class="nome">Feijoada leve</h3>
    <p>Feijão preto, couve e farofa.</p>
    <span class="preco">R$ 32</span>
  </article>
  <article class="prato" id="do-dia">
    <h3 class="nome">Prato do dia</h3>
    <p>Pergunte ao garçom.</p>
    <span class="preco" style="font-size: 20px">R$ 28</span>
  </article>
</main>
<footer class="rodape">
  <p>Aberto de terça a domingo.</p>
</footer>`,
  css: CSS_DA_BANCADA,
};

export const UNIDADE_BANCADA: Unidade = {
  id: "lab-motor-u1",
  ilha: "Laboratório",
  zona: "Bancada do motor",
  numero: 1,
  titulo: "Bancada do motor",
  meta: { enunciado: "Testar o motor de CSS: editor com abas, painel Estilos e Calculado." },
  fases: ["lab-motor-u1-f1"],
};

export const FASE_BANCADA_ESTILOS: FasePratica = {
  id: "lab-motor-u1-f1",
  tipo: "pratica",
  unidadeId: UNIDADE_BANCADA.id,
  titulo: "Bancada de estilos",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["editor-css"],
  apresentar: ["editor-css"],
  paineisElementos: ["estilos", "calculado"],
  introducao: [{ texto: "Bancada de estilos do motor. Aqui dá para mexer no CSS à vontade.", expressao: "curioso" }],
  siteAlvo: SITE_BANCADA,
  objetivos: [
    {
      id: "cor-do-titulo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque a cor do título h1 para dourado (gold).",
        toque: "Troque a cor do título h1 para dourado (gold).",
      },
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "gold" },
      ajudas: {
        pergunta: "O h1 tem cor própria ou herda de alguém?",
        dica: "Uma declaração color na regra do h1 vence a cor herdada do header.",
        linha: { alvo: "css", seletorRegra: "h1", fala: "A regra do h1 fica aqui." },
        solucao: {
          fala: "Pus color: gold na regra do h1: a cor própria vence a herdada.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "gold" }],
        },
      },
      falaAoConcluir: { texto: "Dourado! A cor herdada do header ficou riscada.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "#ffd700" }],
    },
    {
      id: "ligar-slogan",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ligue a cor desligada do slogan.",
        toque: "Ligue a cor desligada do slogan.",
      },
      validador: { tipo: "declaracao", seletorRegra: ".slogan", propriedade: "color", ativa: true },
      ajudas: {
        pergunta: "Qual declaração está comentada?",
        dica: "Uma declaração desligada vira comentário no CSS.",
        linha: { alvo: "css", seletorRegra: ".slogan", propriedade: "color", fala: "Esta linha está desligada." },
        solucao: {
          fala: "Liguei a cor do slogan: o comentário sumiu.",
          acoes: [{ tipo: "alternarDeclaracao", seletorRegra: ".slogan", propriedade: "color" }],
        },
      },
      falaAoConcluir: { texto: "Ligada!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "alternarDeclaracao", seletorRegra: ".slogan", propriedade: "color" }],
    },
    {
      id: "regra-do-rodape",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Crie uma regra nova para o parágrafo do rodapé, com a cor cinza.",
        toque: "Crie uma regra nova para o parágrafo do rodapé, com a cor cinza.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".rodape p", propriedade: "color", valor: "gray" },
      ajudas: {
        pergunta: "Que seletor pega só o parágrafo do rodapé?",
        dica: "Uma regra nova com um seletor descendente: .rodape p.",
        linha: { alvo: "css", seletorRegra: ".preco", fala: "A regra nova entra no fim da folha." },
        solucao: {
          fala: "Criei a regra .rodape p com color: gray no fim da folha.",
          acoes: [{ tipo: "adicionarRegra", seletorRegra: ".rodape p", declaracoes: [{ propriedade: "color", valor: "gray" }] }],
        },
      },
      falaAoConcluir: { texto: "Regra nova no ar!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: ".rodape p {\n  color: gray;\n}" }],
    },
  ],
  conclusao: [{ texto: "Bancada testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo na bancada.", expressao: "feliz" },
};

/** Fases de laboratório, na ordem em que aparecem no /lab/fases. */
export const FASES_LABORATORIO: readonly FasePratica[] = [FASE_BANCADA_ESTILOS];

export const UNIDADES_LABORATORIO: readonly Unidade[] = [UNIDADE_BANCADA];

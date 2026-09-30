/*
 * Revisão: position sticky (L4, Fase 3).
 *
 * Ação: um título de seção que gruda ao chegar no topo; previsão: quando o sticky
 * gruda.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_POSITION_STICKY: ItemRevisao[] = [
  {
    id: "position-sticky-1",
    conceito: "position-sticky",
    tipo: "acao",
    enunciado: {
      mouse: "Faça o título de seção grudar no topo ao rolar: position: sticky e top: 0.",
      toque: "Faça o título de seção grudar no topo ao rolar: position: sticky e top: 0.",
    },
    siteAlvo: {
      url: "guiadeviagem.exemplo",
      titulo: "Guia de Viagem",
      head: HEAD_CSS,
      body: `<h2 class="secao">Praias</h2>
<p>Texto longo sobre as praias.</p>
<h2 class="secao">Trilhas</h2>
<p>Texto longo sobre as trilhas.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.secao {
  background-color: #ffe08a;
  padding: 6px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".secao", propriedade: "position", valor: "sticky" },
        { tipo: "valorEfetivo", seletor: ".secao", propriedade: "top", valor: "0" },
      ],
    },
    ajudas: {
      pergunta: "Qual position se comporta normal até a rolagem chegar num limite, e aí gruda?",
      dica: "sticky, com top: 0, na regra .secao.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".secao" },
      { tipo: "definirPropriedade", seletorRegra: ".secao", propriedade: "position", valor: "sticky" },
      { tipo: "definirPropriedade", seletorRegra: ".secao", propriedade: "top", valor: "0" },
    ],
  },
  {
    id: "position-sticky-2",
    conceito: "position-sticky",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "jornaldabaia.exemplo",
      titulo: "Jornal da Baía",
      head: HEAD_CSS,
      body: `<h2 class="titulo">Cidade</h2>
<p>Muitas notícias, uma embaixo da outra.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.titulo {
  position: sticky;
  top: 0;
  background-color: #cbd5f5;
}
`,
    },
    previsao: {
      pergunta: "O .titulo é sticky com top: 0. Quando ele gruda no topo?",
      opcoes: ["Só quando a rolagem chega nele", "Desde o começo, sempre", "Nunca, só o fixed gruda"],
      correta: 0,
      explicacao: "O sticky se comporta normal até a rolagem chegar no limite (top: 0), e então gruda, como o fixed.",
    },
    ajudas: {
      pergunta: "O sticky começa grudado ou só grudando ao chegar no limite?",
      dica: "Só ao chegar no limite.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

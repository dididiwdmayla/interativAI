/*
 * Revisão: alinhamento do texto, text-align (E1, Fase 2).
 *
 * Ação: centralizar um título; previsão: para onde vai o texto com right.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ALINHAMENTO_DO_TEXTO: ItemRevisao[] = [
  {
    id: "alinhamento-do-texto-1",
    conceito: "alinhamento-do-texto",
    tipo: "acao",
    enunciado: {
      mouse: "Centralize o título da página com text-align.",
      toque: "Centralize o título da página com text-align.",
    },
    siteAlvo: {
      url: "clubedecorridapasso.exemplo",
      titulo: "Clube de Corrida Passo",
      head: HEAD_CSS,
      body: `<h1 class="titulo">Corrida de domingo</h1>
<p>Saída às 6h, na praça.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.titulo {
  color: #264653;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".titulo", propriedade: "text-align", valor: "center" },
    ajudas: {
      pergunta: "Qual propriedade põe o texto no centro da caixa?",
      dica: "text-align: center. Acrescente na regra .titulo.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".titulo" },
      { tipo: "definirPropriedade", seletorRegra: ".titulo", propriedade: "text-align", valor: "center" },
    ],
  },
  {
    id: "alinhamento-do-texto-2",
    conceito: "alinhamento-do-texto",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra do rodapé.",
      toque: "Responda olhando a regra do rodapé.",
    },
    siteAlvo: {
      url: "espacoartesanal.exemplo",
      titulo: "Espaço Artesanal",
      head: HEAD_CSS,
      body: '<p class="rodape">Rua das Palmeiras, 200</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.rodape {
  text-align: right;
}
`,
    },
    previsao: {
      pergunta: "Com text-align: right, onde o texto fica dentro da caixa?",
      opcoes: ["Encostado no lado direito", "No centro", "No lado esquerdo"],
      correta: 0,
      explicacao: "text-align põe o texto à esquerda (padrão), no centro ou à direita da caixa dele.",
    },
    ajudas: {
      pergunta: "right quer dizer para que lado?",
      dica: "Direita. O padrão é a esquerda.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

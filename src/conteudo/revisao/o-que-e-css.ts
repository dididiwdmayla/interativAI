/*
 * Revisão: o que é CSS (E1, Fase 1).
 *
 * A confusão é achar que a aparência mora no HTML. A ação muda a cor só pela folha
 * (o HTML não se mexe); a previsão pergunta o que uma regra diz sobre a peça.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_O_QUE_E_CSS: ItemRevisao[] = [
  {
    id: "o-que-e-css-1",
    conceito: "o-que-e-css",
    tipo: "acao",
    enunciado: {
      mouse: "Sem mexer no HTML, pinte o título de azul-marinho (navy) pela folha de estilo.",
      toque: "Sem mexer no HTML, pinte o título de azul-marinho (navy) pela folha de estilo.",
    },
    siteAlvo: {
      url: "clinicapedeipe.exemplo",
      titulo: "Clínica Pé de Ipê",
      head: HEAD_CSS,
      body: `<h1>Clínica Pé de Ipê</h1>
<p>Consultas de segunda a sexta.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h1 {
  font-size: 2rem;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "color", valor: "navy" },
    ajudas: {
      pergunta: "O que diz como a peça aparece: o HTML ou a folha de estilo?",
      dica: "A folha de estilo (CSS). No painel Estilos, na regra do h1, acrescente color: navy.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: "h1" },
      { tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "navy" },
    ],
  },
  {
    id: "o-que-e-css-2",
    conceito: "o-que-e-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra no painel Estilos.",
      toque: "Responda olhando a regra no painel Estilos.",
    },
    siteAlvo: {
      url: "recadodosindico.exemplo",
      titulo: "Recado do Síndico",
      head: HEAD_CSS,
      body: '<p class="aviso">Volto já!</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: crimson;
}
`,
    },
    previsao: {
      pergunta: "Na regra .aviso { color: crimson; }, o CSS está dizendo o quê sobre o aviso?",
      opcoes: ["Como ele aparece", "Que tipo de peça ele é", "Para onde ele leva"],
      correta: 0,
      explicacao: "O HTML diz o que a peça é (um parágrafo); o CSS diz como ela aparece: cor, tamanho, fonte.",
    },
    ajudas: {
      pergunta: "O CSS diz o que a peça É ou como ela APARECE?",
      dica: "Como ela aparece. O que ela é fica por conta das tags do HTML.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

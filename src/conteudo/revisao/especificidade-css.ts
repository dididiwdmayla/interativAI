/*
 * Revisão: especificidade (E4, Fase 1).
 *
 * Ação: vencer a regra da classe com uma regra por id, sem mexer nela; previsão: o
 * id vence a classe mesmo vindo antes.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_ESPECIFICIDADE_CSS: ItemRevisao[] = [
  {
    id: "especificidade-css-1",
    conceito: "especificidade-css",
    tipo: "acao",
    enunciado: {
      mouse: "O #topo está cinza pela regra .aviso. Faça ele ficar vermelho (red) com uma regra mais específica, sem mexer na .aviso.",
      toque: "O #topo está cinza pela regra .aviso. Faça ele ficar vermelho (red) com uma regra mais específica, sem mexer na .aviso.",
    },
    siteAlvo: {
      url: "consorciovizinhos.exemplo",
      titulo: "Consórcio Vizinhos",
      head: HEAD_CSS,
      body: '<p id="topo" class="aviso">Assembleia no sábado.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: gray;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: "#topo", propriedade: "color", valor: "red" },
    ajudas: {
      pergunta: "Entre id e classe, qual seletor é mais específico?",
      dica: "O id. Crie a regra #topo com color: red: ele vence a .aviso.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: "#topo" },
      { tipo: "adicionarRegra", seletorRegra: "#topo", declaracoes: [{"propriedade":"color","valor":"red"}] },
    ],
  },
  {
    id: "especificidade-css-2",
    conceito: "especificidade-css",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as regras no painel Estilos.",
      toque: "Responda olhando as regras no painel Estilos.",
    },
    siteAlvo: {
      url: "estudiodetatuagem.exemplo",
      titulo: "Estúdio de Tatuagem",
      head: HEAD_CSS,
      body: '<p id="a" class="a">Agende sua sessão.</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

#a {
  color: red;
}

.a {
  color: blue;
}
`,
    },
    previsao: {
      pergunta: "A regra do #a vem ANTES da .a. De que cor fica o texto?",
      opcoes: ["Vermelho: o id é mais específico", "Azul: a última regra vence", "Roxo: mistura das duas"],
      correta: 0,
      explicacao: "A especificidade vem antes da ordem: id vence classe, que vence tag, não importa a ordem no arquivo.",
    },
    ajudas: {
      pergunta: "A ordem da folha ou a especificidade manda primeiro?",
      dica: "A especificidade. A ordem só desempata quando ela é igual.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

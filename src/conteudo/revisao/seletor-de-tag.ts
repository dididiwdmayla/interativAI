/*
 * Revisão: seletor de tag (E2, Fase 1).
 *
 * Ação: uma regra por tag que pinta todos os parágrafos de uma vez; previsão:
 * quantas peças o seletor pega.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_SELETOR_DE_TAG: ItemRevisao[] = [
  {
    id: "seletor-de-tag-1",
    conceito: "seletor-de-tag",
    tipo: "acao",
    enunciado: {
      mouse: "Com uma regra só, pinte de cinza (gray) o texto de TODOS os parágrafos.",
      toque: "Com uma regra só, pinte de cinza (gray) o texto de TODOS os parágrafos.",
    },
    siteAlvo: {
      url: "casadeparto.exemplo",
      titulo: "Casa de Parto Luz",
      head: HEAD_CSS,
      body: `<h2>Nossos serviços</h2>
<p id="p1">Acompanhamento durante a gravidez.</p>
<p id="p2">Aulas para o parto.</p>
<p id="p3">Cuidados depois do parto.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h2 {
  color: #7b2d5f;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "#p1", propriedade: "color", valor: "gray" },
        { tipo: "valorEfetivo", seletor: "#p2", propriedade: "color", valor: "gray" },
        { tipo: "valorEfetivo", seletor: "#p3", propriedade: "color", valor: "gray" },
      ],
    },
    ajudas: {
      pergunta: "Que seletor pega TODAS as peças de um tipo?",
      dica: "O nome da tag, sem ponto e sem sustenido: p. Crie uma regra p com color: gray.",
    },
    solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: "p", declaracoes: [{"propriedade":"color","valor":"gray"}] }],
  },
  {
    id: "seletor-de-tag-2",
    conceito: "seletor-de-tag",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a página.",
      toque: "Responda olhando a página.",
    },
    siteAlvo: {
      url: "revistadofuturo.exemplo",
      titulo: "Revista do Futuro",
      head: HEAD_CSS,
      body: `<h3>Ciência</h3>
<p>Robôs na cozinha.</p>
<h3>Cidades</h3>
<p>Ônibus elétricos.</p>
<h3>Espaço</h3>
<p>Foguetes reutilizáveis.</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

h3 {
  color: darkviolet;
}
`,
    },
    previsao: {
      pergunta: "O seletor h3 pega quantas peças desta página?",
      opcoes: ["Só o primeiro", "Todos os três h3", "Nenhum, falta o ponto"],
      correta: 1,
      explicacao: "Um seletor com o nome da tag pega TODAS as peças daquele tipo na página.",
    },
    ajudas: {
      pergunta: "O seletor de tag pega uma peça ou todas do tipo?",
      dica: "Todas do tipo. Conte quantos h3 há na árvore.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];

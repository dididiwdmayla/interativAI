/*
 * Revisão: seletor descendente (E2, Fase 2).
 *
 * Ação: pintar só os links de dentro do menu, não os do rodapé; previsão: o que a
 * regra pega e o que deixa de fora.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_SELETOR_DESCENDENTE: ItemRevisao[] = [
  {
    id: "seletor-descendente-1",
    conceito: "seletor-descendente",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte de verde-escuro (darkgreen) só os links de dentro do menu (nav), não os do rodapé.",
      toque: "Pinte de verde-escuro (darkgreen) só os links de dentro do menu (nav), não os do rodapé.",
    },
    siteAlvo: {
      url: "cooperativagrao.exemplo",
      titulo: "Cooperativa Grão",
      head: HEAD_CSS,
      body: `<nav><a href="#a">Início</a> <a href="#b">Loja</a></nav>
<footer><a href="#c">Contato</a></footer>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

footer {
  margin-top: 24px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: "nav a", propriedade: "color", valor: "darkgreen" },
        { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: "footer a", propriedade: "color", valor: "darkgreen" } },
      ],
    },
    ajudas: {
      pergunta: "Como pegar só os links que estão dentro do menu?",
      dica: "Dois seletores com um espaço: nav a. Crie a regra com color: darkgreen.",
    },
    solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: "nav a", declaracoes: [{"propriedade":"color","valor":"darkgreen"}] }],
  },
  {
    id: "seletor-descendente-2",
    conceito: "seletor-descendente",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a regra.",
      toque: "Responda olhando a regra.",
    },
    siteAlvo: {
      url: "petisqueiragostosa.exemplo",
      titulo: "Petisqueira Gostosa",
      head: HEAD_CSS,
      body: `<section class="menu"><p class="preco">R$ 18</p></section>
<p class="preco">R$ 25</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.menu .preco {
  font-weight: bold;
}
`,
    },
    previsao: {
      pergunta: "A regra é .menu .preco. O preco de FORA do menu ganha negrito?",
      opcoes: ["Sim, todo .preco", "Não, só o de dentro do .menu", "Sim, o primeiro que aparecer"],
      correta: 1,
      explicacao: "Dois seletores separados por espaço pegam só o segundo quando ele está DENTRO do primeiro.",
    },
    ajudas: {
      pergunta: "O espaço entre .menu e .preco quer dizer o quê?",
      dica: "Que o .preco está dentro do .menu.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];

/*
 * Revisão: enchimento de palavra-chave (S2, Fase 2).
 *
 * Uma ação (achar e apagar o parágrafo que só repete uma expressão) e uma
 * previsão sobre o efeito de repetir a palavra várias vezes.
 */
import type { ItemRevisao } from "../tipos";

export const ITENS_ENCHIMENTO_DE_PALAVRA_CHAVE: ItemRevisao[] = [
  {
    id: "enchimento-de-palavra-chave-1",
    conceito: "enchimento-de-palavra-chave",
    tipo: "acao",
    enunciado: {
      mouse: "Um parágrafo só repete a mesma expressão para tentar subir na busca. Apague ele.",
      toque: "Um parágrafo só repete a mesma expressão para tentar subir na busca. Apague ele (toque na peça e em Apagar).",
    },
    siteAlvo: {
      url: "docericapedacodeceu.exemplo",
      titulo: "Doceria Pedaço de Céu",
      body: `<h1>Doceria Pedaço de Céu</h1>
<p>Bolos, brigadeiros e tortas feitos no dia.</p>
<p class="palavras">doceria barata doceria em Niterói doceria boa doceria perto doceria barata</p>
<p>Encomendas até as 15h.</p>`,
    },
    validador: { tipo: "naoExiste", seletor: ".palavras" },
    ajudas: {
      pergunta: "Qual parágrafo só repete palavras, sem dizer nada de novo?",
      dica: "É o que tem a classe palavras. Selecione e apague.",
    },
    solucaoDeTeste: [{ tipo: "apagar", seletor: ".palavras" }],
  },
  {
    id: "enchimento-de-palavra-chave-2",
    conceito: "enchimento-de-palavra-chave",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "oficinacambiocerto.exemplo",
      titulo: "Oficina Câmbio Certo",
      body: `<h1>Oficina Câmbio Certo</h1>
<p>oficina barata oficina mecânica oficina em Goiânia oficina de carro oficina barata oficina boa oficina</p>
<p>Troca de óleo e revisão completa.</p>`,
    },
    previsao: {
      pergunta: "O texto repete \"oficina\" mais de dez vezes. O que isso faz por quem lê a página?",
      opcoes: [
        "Ajuda a pessoa a achar a oficina mais rápido",
        "Deixa o texto ruim de ler, e a pessoa desiste",
        "Faz a página abrir mais rápido",
      ],
      correta: 1,
      explicacao: "Repetir sem sentido é enchimento de palavra-chave. Cansa quem lê, e o objetivo da página é ser útil para a pessoa.",
    },
    ajudas: {
      pergunta: "Você leria esse parágrafo até o fim?",
      dica: "Pense em quem chega na página: o que ela ganha com a repetição?",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];

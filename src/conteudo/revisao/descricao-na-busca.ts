/*
 * Revisão: descrição na busca (S1, Fase 2).
 *
 * Uma ação num site novo (criar a meta description pelo editor, falando
 * do que a pessoa procura) e uma previsão sobre o que a busca mostra
 * quando ela não existe.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_DESCRICAO_NA_BUSCA: ItemRevisao[] = [
  {
    id: "descricao-na-busca-1",
    conceito: "descricao-na-busca",
    tipo: "acao",
    enunciado: {
      mouse: "Crie, pelo editor, uma meta description no head que fale da primeira aula grátis.",
      toque: "Crie, pelo Código, uma meta description no head que fale da primeira aula grátis.",
    },
    siteAlvo: {
      url: "academianatacao.exemplo",
      titulo: "Natação Onda Azul",
      head: cabecaComTitulo("Onda Azul | Aulas de natação"),
      body: "<h1>Natação Onda Azul</h1>\n<p>Piscina aquecida.</p>\n<p>A primeira aula é grátis.</p>",
    },
    modoDocumento: true,
    validador: { tipo: "resultadoBusca", campo: "descricao", contem: "aula" },
    ajudas: {
      pergunta: "Que meta do head vira o texto embaixo do título do resultado?",
      dica: "<meta name=\"description\" content=\"...\">, no head. O content é o convite.",
    },
    solucaoDeTeste: [
      {
        tipo: "inserirHTML",
        seletor: "title",
        posicao: "depois",
        html: '<meta name="description" content="Aulas de natação em piscina aquecida. A primeira aula é grátis.">',
      },
    ],
  },
  {
    id: "descricao-na-busca-2",
    conceito: "descricao-na-busca",
    tipo: "previsao",
    enunciado: { mouse: "Responda e confira na aba Busca.", toque: "Responda e confira na aba Busca." },
    siteAlvo: {
      url: "chaveiroexpresso.exemplo",
      titulo: "Chaveiro Expresso",
      head: cabecaComTitulo("Chaveiro Expresso | 24 horas"),
      body: "<h1>Chaveiro Expresso</h1>\n<p>Aberto desde 2005.</p>\n<p>Cópia de chave e abertura de porta 24 horas.</p>",
    },
    modoDocumento: true,
    previsao: {
      pergunta: "Esta página não tem meta description. O que a busca mostra embaixo do título?",
      opcoes: ["Um trecho da página que ela escolher", "Nada, fica em branco", "O endereço de novo"],
      correta: 0,
      explicacao: "Sem descrição, a busca pega um trecho da página, às vezes o menos útil (aqui, o ano de abertura).",
    },
    ajudas: {
      pergunta: "O que a aba Busca mostra embaixo do título desta página?",
      dica: "Olhe o resultado simulado: o texto de baixo é um parágrafo da própria página.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

/*
 * S1, Fase 3: "Fora da busca" (Escola de Dança Passo Leve).
 *
 * O QUE ENSINA: o noindex (meta robots). A confusão de leigo: "noindex
 * tira a página do ar" (não tira: ela continua abrindo para quem tem o
 * link; só sai do catálogo da busca).
 *
 * REVISA: indexação (Fase 1: sem entrar no catálogo, não aparece) e
 * apagar pela árvore (U2), agora no head.
 *
 * ORDEM: 1) guiado, com previsão: o que o noindex faz, e apagar a meta
 * esquecida; 2) sozinho, a situação ao contrário: a escola faz uma página
 * de teste (momento roteirizado troca o título) e ELA deve sair da busca.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { ESCOLA_PASSO_LEVE } from "./sites/escolaPassoLeve";

export const FASE_S1_F3: FasePratica = {
  id: "sites-ser-encontrado-u1-f3",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u1",
  titulo: "Fora da busca",
  conceitos: ["noindex"],
  revisa: ["indexacao", "remover-do-documento"],
  prerequisitos: ["indexacao", "head-vs-body"],
  usaFerramentas: ["resultado-busca", "arvore", "apagar", "editor"],
  modoDocumento: true,
  siteAlvo: ESCOLA_PASSO_LEVE,
  introducao: [
    { texto: "A Escola de Dança Passo Leve tem título e descrição bons, mas ninguém acha ela na busca.", expressao: "pensativo" },
    { texto: "Olha a aba Busca: a página nem aparece. Alguma coisa no head está pedindo isso.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "tirar-noindex",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O head tem <meta name=\"robots\" content=\"noindex\">. O que acontece com a página?",
        opcoes: ["Sai do ar para todo mundo", "Aparece em primeiro na busca", "Continua no ar, mas fica fora da busca"],
        correta: 2,
        explicacao: "noindex pede para a busca não guardar a página no catálogo. Quem tem o link ainda abre; quem busca, não acha.",
      },
      enunciado: {
        mouse: "Apague a meta robots do head (pela árvore) para a escola voltar a aparecer na busca.",
        toque: "Apague a meta robots do head (pela árvore) para a escola voltar a aparecer na busca.",
      },
      validador: { tipo: "indexavel", valor: true },
      ajudas: {
        pergunta: "Qual linha do head fala com os robôs dos buscadores?",
        dica: "A meta com name=\"robots\". O noindex dela é o que tira a página da busca.",
        linha: { alvo: "arvore", seletor: 'meta[name="robots"]', fala: "Esta meta está tirando a escola da busca. Apague ela." },
        solucao: {
          fala: "Apaguei a meta robots: sem o noindex, a busca pode guardar a página de novo.",
          acoes: [{ tipo: "apagar", seletor: 'meta[name="robots"]' }],
        },
      },
      falaAoConcluir: {
        texto: "Voltou para a busca! Esse noindex costuma sobrar de quando o site estava em construção. Vale sempre conferir.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "apagar", seletor: 'meta[name="robots"]' },
      ],
    },
    {
      id: "pagina-de-teste",
      tipo: "acao",
      modo: "sozinho",
      eventoAoComecar: {
        acoes: [{ tipo: "definirTexto", seletor: "h1", valor: "Página de teste: não divulgar" }],
        fala: { texto: "A escola usou esta página para testar uma promoção. Essa não deveria aparecer na busca!", expressao: "preocupado" },
      },
      enunciado: {
        mouse: "Esta virou uma página de teste. Ponha um noindex no head, pelo editor, para ela sair da busca.",
        toque: "Esta virou uma página de teste. Ponha um noindex no head, pelo Código, para ela sair da busca.",
      },
      // A página de teste (o título que o momento roteirizado trocou) fora da busca.
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "textoIgual", seletor: "h1", valor: "Página de teste: não divulgar" },
          { tipo: "indexavel", valor: false },
        ],
      },
      ajudas: {
        pergunta: "Qual linha você acabou de apagar? Ela faz exatamente o que a escola quer agora.",
        dica: "A meta robots com content=\"noindex\", escrita no head (o editor de código mostra o documento inteiro).",
      },
      falaAoConcluir: { texto: "Página de teste fora da busca, e continua abrindo para quem tem o link. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: '<meta name="robots" content="noindex">' }],
    },
  ],
  conclusao: [
    { texto: "Uma linha no head decide se a página entra ou não na busca. Esquecida, ela some com o site sem ninguém saber por quê.", expressao: "comemorando" },
    { texto: "Hora de juntar tudo num site novo, sem passo a passo.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Em alguns sites de verdade, aperte F12 e procure no head uma meta name=\"robots\". Quase sempre ela não existe (e tudo bem: sem ela, a página pode entrar na busca). Se achar um noindex, pense: por que o dono não quer essa página na busca?",
  falaFinal: { texto: "Próxima fase: o desafio da Casa de Farinha.", expressao: "feliz" },
};

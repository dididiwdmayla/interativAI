/*
 * Revisão: indexação (S1, Fases 1 e 3).
 *
 * Uma previsão sobre o que é o catálogo e uma ação com uma variação que a
 * fase não mostrou: a meta para o robô do Google (googlebot) com "none",
 * que também tira a página do catálogo.
 */
import type { ItemRevisao } from "../tipos";
import { cabecaComTitulo } from "./sites/cabecas";

export const ITENS_INDEXACAO: ItemRevisao[] = [
  {
    id: "indexacao-1",
    conceito: "indexacao",
    tipo: "previsao",
    enunciado: { mouse: "Responda a pergunta do computadorzinho.", toque: "Responda a pergunta do computadorzinho." },
    siteAlvo: {
      url: "papelariarabisco.exemplo",
      titulo: "Papelaria Rabisco",
      head: cabecaComTitulo("Papelaria Rabisco | Material escolar"),
      body: "<h1>Papelaria Rabisco</h1>\n<p>Cadernos, canetas e mochilas.</p>",
    },
    modoDocumento: true,
    previsao: {
      pergunta: "O que é o índice, o catálogo de um buscador?",
      opcoes: ["Uma cópia organizada das páginas que o robô visitou", "A lista dos sites que pagaram anúncio", "O primeiro resultado de cada busca"],
      correta: 0,
      explicacao: "É onde o buscador guarda o que o robô viu, organizado para achar rápido. Na busca, ele procura ali, não nos sites.",
    },
    ajudas: {
      pergunta: "Onde a busca procura quando alguém digita uma pergunta?",
      dica: "Indexar é guardar a página no catálogo depois de visitar.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
  {
    id: "indexacao-2",
    conceito: "indexacao",
    tipo: "acao",
    enunciado: {
      mouse: "Esta página está fora do catálogo da busca. Ache no head o que pede isso e apague (confira na aba Busca).",
      toque: "Esta página está fora do catálogo da busca. Ache no head o que pede isso e apague (confira na aba Busca).",
    },
    siteAlvo: {
      url: "vidracariacristal.exemplo",
      titulo: "Vidraçaria Cristal",
      head: cabecaComTitulo("Vidraçaria Cristal | Box e espelhos", '<meta name="googlebot" content="none">'),
      body: "<h1>Vidraçaria Cristal</h1>\n<p>Box de banheiro e espelhos sob medida.</p>",
    },
    modoDocumento: true,
    validador: { tipo: "indexavel", valor: true },
    ajudas: {
      pergunta: "Qual meta do head fala com o robô do Google?",
      dica: "A meta com name=\"googlebot\": content=\"none\" é o mesmo que noindex (e mais um pouco).",
    },
    solucaoDeTeste: [{ tipo: "apagar", seletor: 'meta[name="googlebot"]' }],
  },
];

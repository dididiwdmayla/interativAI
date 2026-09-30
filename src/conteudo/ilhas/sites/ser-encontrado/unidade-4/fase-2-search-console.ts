/*
 * S4, Fase 2: "O que a busca vê do seu site" (Loja Vale Verde, modo
 * documento).
 *
 * O QUE ENSINA: o Search Console como conceito: a ferramenta gratuita do
 * Google que mostra como o site aparece na busca (pesquisas, cliques e
 * problemas de indexação). Também as duas propriedades (domínio: só por DNS;
 * prefixo de URL: mais jeitos). O passo a passo mora em
 * src/conteudo/plataformas-marketing.ts (conferido em 30/09/2026); a fase
 * mostra o "conferido em" e não cita nomes de menu.
 *
 * REVISA: o noindex (S1), o title na busca (S1) e a indexação.
 *
 * ORDEM: 1) guiado, com previsão (qual ferramenta mostra as pesquisas e os
 * cliques), o recado "a página não está na busca": achar e tirar o noindex;
 * 2) sozinho, o recado "as pessoas chegam buscando vasos de cerâmica": pôr
 * isso no title sem corte.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LOJA_VALE_VERDE } from "./sites/lojaValeVerde";

export const FASE_S4_F2: FasePratica = {
  id: "sites-ser-encontrado-u4-f2",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u4",
  titulo: "O que a busca vê do seu site",
  conceitos: ["search-console"],
  revisa: ["noindex", "titulo-na-busca"],
  prerequisitos: ["noindex", "titulo-na-busca", "analytics"],
  usaFerramentas: ["resultado-busca", "arvore", "apagar", "editor", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: LOJA_VALE_VERDE,
  introducao: [
    { texto: "O Search Console é uma ferramenta gratuita do Google que mostra como o seu site aparece na busca.", expressao: "curioso" },
    { texto: "Ele mostra as pesquisas que trouxeram gente, os cliques e os problemas de indexação. Aqui, deu dois recados sobre a Loja Vale Verde.", expressao: "pensativo" },
    { texto: "O primeiro: a página não está na busca. O segundo: as pessoas chegam buscando vasos de cerâmica. Vamos ver o que fazer.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "voltar-para-a-busca",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Você quer saber que pesquisas trouxeram gente ao site pela busca. Qual ferramenta mostra isso?",
        opcoes: ["Analytics: mostra o que as pessoas fazem no site", "Nenhuma: não dá para saber", "Search Console: mostra pesquisas, cliques e indexação"],
        correta: 2,
        explicacao: "O Search Console mostra como o site aparece na busca. O Analytics mostra o que as pessoas fazem depois que entram.",
      },
      enunciado: {
        mouse: "O recado 1 diz que a página está fora da busca. Ache o que esconde ela no head (veja a aba Busca) e conserte.",
        toque: "O recado 1 diz que a página está fora da busca. Ache o que esconde ela no head (veja a aba Busca) e conserte.",
      },
      validador: { tipo: "indexavel", valor: true },
      ajudas: {
        pergunta: "O que a aba Busca mostra no lugar do resultado desta página?",
        dica: "Uma meta robots com noindex tira a página da busca. Apague ela do head.",
        linha: { alvo: "arvore", seletor: 'meta[name="robots"]', fala: "Esta meta robots pede para a página ficar fora da busca." },
        solucao: {
          fala: "Apaguei a meta robots com noindex: a página voltou a poder aparecer na busca.",
          acoes: [{ tipo: "apagar", seletor: 'meta[name="robots"]' }],
        },
      },
      falaAoConcluir: { texto: "A página voltou para a busca. Problema de indexação resolvido, no código.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "apagar", seletor: 'meta[name="robots"]' },
      ],
    },
    {
      id: "title-com-a-pesquisa",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O recado 2: as pessoas buscam \"vasos de cerâmica\". Ponha isso no title, sem ele passar do espaço na busca.",
        toque: "O recado 2: as pessoas buscam \"vasos de cerâmica\". Ponha isso no title, sem ele passar do espaço na busca.",
      },
      validador: { tipo: "resultadoBusca", campo: "titulo", contem: "vasos de cerâmica", semCorte: true },
      ajudas: {
        pergunta: "O título diz o que a pessoa buscou? E se ficar comprido, o que a aba Busca mostra?",
        dica: "Escreva o nome da loja e a busca, como \"Loja Vale Verde | Vasos de cerâmica em Goiânia\", e olhe a aba Busca a cada mudança.",
      },
      falaAoConcluir: { texto: "O título agora fala do que as pessoas buscam. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Loja Vale Verde | Vasos de cerâmica em Goiânia" }],
    },
  ],
  conclusao: [
    { texto: "Para usar o Search Console, adicione uma propriedade e prove que o site é seu. Depois dá para enviar o sitemap e ver os dados.", expressao: "feliz" },
    { texto: "Propriedade de domínio (exemplo.com) só se verifica por DNS. A de prefixo de URL (https://www.exemplo.com) tem mais jeitos.", expressao: "pensativo" },
    { texto: "Passo a passo e tipos de propriedade conferido em 30/09/2026: essas telas mudam com o tempo.", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Pense num site que você faria. Que propriedade você adicionaria no Search Console, de domínio ou de prefixo de URL? Escreva o endereço dela e como você provaria que é o dono.",
  falaFinal: { texto: "Próxima fase: links que contam de onde a visita veio.", expressao: "feliz" },
};

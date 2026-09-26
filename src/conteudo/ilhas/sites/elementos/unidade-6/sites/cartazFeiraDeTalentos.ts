/*
 * Sites-alvo dos micro-passos da Unidade 6: o cartaz da Feira de Talentos
 * da escola, escrito do ZERO (por isso o head e o body começam vazios: o
 * documentoInteiroInicial monta <head></head> e <body></body> mesmo assim).
 *
 * Dois estágios, um por fase (cada fase é independente, como em qualquer
 * unidade: o que o jogador escreve numa fase não é herdado pela outra):
 * - SITE_CARTAZ_EM_BRANCO (Fase 1): head e body totalmente vazios, para
 *   escrever o h1, o title e o parágrafo com o link do zero;
 * - SITE_CARTAZ_QUASE_PRONTO (Fase 2): já chega com o body pronto (h1,
 *   parágrafo com acento e o link), mas sem title e sem meta charset —
 *   os acentos aparecem quebrados até o jogador acrescentar o charset.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const SITE_CARTAZ_EM_BRANCO: SiteAlvo = {
  url: "feiradetalentos.escola.site",
  titulo: "Site do cartaz da Feira de Talentos",
  head: "",
  body: "",
};

export const SITE_CARTAZ_QUASE_PRONTO: SiteAlvo = {
  url: "feiradetalentos.escola.site",
  titulo: "Site do cartaz da Feira de Talentos",
  head: "",
  body: `<h1>Feira de Talentos</h1>
<p>Inscrições até sexta-feira!</p>
<a href="https://exemplo.site/inscricao">Inscreva-se aqui</a>`,
};

import type { SiteAlvo } from "@/conteudo/tipos";

/**
 * P2, Fase 2 (projeto-ponte): o ponto de partida do site do PRÓPRIO
 * jogador. Quase vazio de propósito: o head já traz charset e viewport
 * (ensinados na Unidade 6), o title vem vazio (o primeiro requisito é dar
 * um nome à aba) e o body tem só um recado para ser trocado. O style.css
 * começa com o básico, sem @media (um requisito pede uma).
 */
export const SITE_MEU_PRIMEIRO_SITE: SiteAlvo = {
  url: "meu-primeiro-site.site",
  titulo: "Meu primeiro site",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title></title>`,
  body: `<h1>Meu site</h1>
<p>Troque este texto: este site é seu.</p>`,
  css: `body {
  margin: 0;
  padding: 16px;
  font-family: Verdana, sans-serif;
  color: #222222;
  background-color: #ffffff;
}
`,
};

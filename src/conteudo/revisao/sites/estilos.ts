/*
 * O visual dos mini-sites da Revisão do dia. Como os sites-alvo das fases,
 * representam "o site de outra pessoa", então podem ter cores próprias (a
 * exceção da regra das cores vale para src/conteudo/**\/sites/*.ts).
 *
 * Um head pequeno e neutro, reaproveitado pelos itens: o que importa num
 * item de revisão é a situação nova, não o enfeite.
 */

/** Head com um estilo simples de cartão, em tons claros. */
export const HEAD_MINI =
  "<style>body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#fbf7f0;color:#2b2233}" +
  "h1,h2{margin:0 0 8px}p{margin:0 0 8px}.cartao{background:#fff;border:2px solid #e5dccf;border-radius:12px;padding:12px;margin-bottom:12px}" +
  "button,.botao{background:#2f6f5e;color:#fff;border:0;border-radius:999px;padding:8px 14px;font-weight:700}" +
  "ul,ol{margin:0 0 8px;padding-left:20px}nav a{margin-right:10px;color:#2f6f5e}</style>";

/** Variação em tons escuros, para os itens não parecerem todos iguais. */
export const HEAD_MINI_ESCURO =
  "<style>body{font-family:system-ui,sans-serif;margin:0;padding:16px;background:#1f2430;color:#f1ecff}" +
  "h1,h2{margin:0 0 8px;color:#ffd166}p{margin:0 0 8px}.cartao{background:#2b3242;border-radius:12px;padding:12px;margin-bottom:12px}" +
  "button,.botao{background:#ffd166;color:#1f2430;border:0;border-radius:999px;padding:8px 14px;font-weight:700}" +
  "ul,ol{margin:0 0 8px;padding-left:20px}nav a{margin-right:10px;color:#8fd3ff}</style>";

/** Head dos itens com CSS editável: só o essencial (o visual mora no `css` do item, que aparece no painel Estilos). */
export const HEAD_CSS =
  '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">';

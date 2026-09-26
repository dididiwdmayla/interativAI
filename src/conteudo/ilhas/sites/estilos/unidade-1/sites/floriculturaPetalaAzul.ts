/*
 * Site-alvo dos micro-passos da E1: "Floricultura Pétala Azul".
 *
 * O HTML é simples e já está certo: tudo o que a unidade ensina é mexer na
 * APARÊNCIA pela folha de estilo (estilo.css), sem tocar no HTML. A folha
 * começa sem graça de propósito: o nome apagadinho no cabeçalho, preços
 * quase invisíveis, tudo alinhado à esquerda e uma fonte qualquer.
 *
 * Duas peças não têm regra nenhuma (.promo e .horario): é nelas que o
 * jogador cria regras novas na Fase 3.
 *
 * Sem @media na folha: o motor de cascata não avalia @media no
 * testar:conteudo (jsdom), e a página funciona em 390 px com uma coluna só.
 *
 * Âncoras naturais: header, h1, .slogan, h2, .buque, .descricao, .preco,
 * .promo, footer, .horario.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_FLORICULTURA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Floricultura Pétala Azul</title>`;

const BODY_FLORICULTURA = `<header>
  <h1>Floricultura Pétala Azul</h1>
  <p class="slogan">Flores frescas todo dia, direto do sítio</p>
</header>
<main>
  <h2>Buquês da semana</h2>
  <p class="promo">Promoção: na compra de dois buquês, o vaso sai de graça!</p>
  <article class="buque">
    <h3>Girassóis alegres</h3>
    <p class="descricao">Seis girassóis com folhagem verde.</p>
    <p class="preco">R$ 45</p>
  </article>
  <article class="buque">
    <h3>Rosas do campo</h3>
    <p class="descricao">Doze rosas cor-de-rosa amarradas com juta.</p>
    <p class="preco">R$ 60</p>
  </article>
  <article class="buque">
    <h3>Mix de margaridas</h3>
    <p class="descricao">Margaridas brancas e amarelas num vasinho.</p>
    <p class="preco">R$ 38</p>
  </article>
</main>
<footer>
  <p>Floricultura Pétala Azul, Rua das Hortênsias, 12</p>
  <p class="horario">Aberta de segunda a sábado, das 8h às 18h</p>
</footer>`;

export const CSS_FLORICULTURA = `body {
  font-family: Arial, sans-serif;
  color: #444444;
  background-color: #fffdf8;
  margin: 0;
}

header {
  background-color: #7a9e7e;
  padding: 16px 24px;
}

h1 {
  color: #a9c4ab;
  font-size: 28px;
  margin: 0;
}

.slogan {
  color: #f4f1de;
  font-style: italic;
  margin: 4px 0 0;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #5c6b73;
  font-size: 22px;
}

.buque {
  background-color: white;
  border: 2px solid #cfe0d0;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 12px;
}

.buque h3 {
  margin: 0 0 4px;
  font-size: 18px;
}

.descricao {
  font-size: 16px;
  margin: 0 0 6px;
}

.preco {
  color: #d9ded9;
  margin: 0;
}

footer {
  background-color: #eef3ee;
  color: #6b705c;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const FLORICULTURA_PETALA_AZUL: SiteAlvo = {
  url: "petalaazul.flores.site",
  titulo: "Floricultura Pétala Azul",
  head: HEAD_FLORICULTURA,
  body: BODY_FLORICULTURA,
  css: CSS_FLORICULTURA,
};

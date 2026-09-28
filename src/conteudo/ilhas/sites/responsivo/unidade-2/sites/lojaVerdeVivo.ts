/*
 * Site-alvo da R2, Fase 2: "Loja de Plantas Verde Vivo".
 *
 * Escrita mobile first: o CSS de base já é o do celular (uma coluna,
 * imagem no tamanho fixo — o problema a consertar primeiro), sem @media
 * nenhuma; o jogador ACRESCENTA um @media (min-width) para o layout de
 * duas colunas só quando a tela cresce.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_VERDE_VIVO = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Verde Vivo</title>`;

const BODY_VERDE_VIVO = `<header>
  <h1>Verde Vivo</h1>
  <p>Plantas para dentro e fora de casa</p>
</header>
<main class="conteudo">
  <img class="foto-loja" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='320'%3E%3Crect width='480' height='320' fill='%2315803d'/%3E%3C/svg%3E" alt="Vasos de plantas na entrada da loja">
  <section class="produtos">
    <article><h2>Samambaia</h2><p>R$ 35</p></article>
    <article><h2>Suculenta</h2><p>R$ 18</p></article>
    <article><h2>Jiboia</h2><p>R$ 42</p></article>
  </section>
</main>
<footer>
  <p>Rua das Flores, 210</p>
</footer>`;

const CSS_VERDE_VIVO = `body {
  margin: 0;
  font-family: Arial, sans-serif;
  color: #14532d;
  background-color: #f0fdf4;
}

header {
  padding: 20px 24px;
  background-color: #15803d;
  color: white;
}

h1 {
  margin: 0 0 6px;
}

.foto-loja {
  width: 480px;
  display: block;
  margin: 16px auto;
}

.produtos {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 24px 24px;
}

.produtos article {
  padding: 12px;
  border: 2px solid #86efac;
  border-radius: 8px;
}

footer {
  padding: 14px 24px;
  background-color: #14532d;
  color: #bbf7d0;
}`;

export const LOJA_VERDE_VIVO: SiteAlvo = {
  url: "verdevivoplantas.com.br",
  titulo: "Verde Vivo",
  head: HEAD_VERDE_VIVO,
  body: BODY_VERDE_VIVO,
  css: CSS_VERDE_VIVO,
};

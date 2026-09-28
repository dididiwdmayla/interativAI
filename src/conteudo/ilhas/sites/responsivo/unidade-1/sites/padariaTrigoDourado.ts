/*
 * Site-alvo da R1, Fase 1: "Padaria Trigo Dourado".
 *
 * Site comum (head fixo, COM meta viewport): serve para praticar o modo
 * dispositivo (aparelhos e girar) sem mexer no documento. A folha já tem
 * um pouco de espaçamento generoso, para o cabeçalho ficar visivelmente
 * diferente entre o Celular 390 e o Notebook 1280 (sem usar @media, que é
 * assunto da R2).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PADARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Padaria Trigo Dourado</title>`;

const BODY_PADARIA = `<header>
  <h1>Padaria Trigo Dourado</h1>
  <p>Pão quentinho desde 1998</p>
</header>
<main>
  <section id="paes">
    <h2>Pães do dia</h2>
    <p>Pão francês <span class="preco">R$ 0,80</span></p>
    <p>Pão de queijo <span class="preco">R$ 3,50</span></p>
    <p>Pão integral <span class="preco">R$ 9,90</span></p>
  </section>
  <section id="doces">
    <h2>Doces</h2>
    <p>Sonho de creme <span class="preco">R$ 6,00</span></p>
    <p>Brigadeiro <span class="preco">R$ 3,00</span></p>
  </section>
</main>
<footer>
  <p>Rua das Padarias, 45 — aberto das 6h às 20h</p>
</footer>`;

const CSS_PADARIA = `body {
  margin: 0;
  font-family: Georgia, serif;
  color: #4a2c17;
  background-color: #fff8ee;
}

header {
  padding: 32px 40px;
  background-color: #d97706;
  color: white;
}

h1 {
  margin: 0 0 8px;
  font-size: 32px;
}

main {
  padding: 24px 40px;
}

h2 {
  color: #92400e;
}

.preco {
  float: right;
  font-weight: bold;
}

footer {
  padding: 16px 40px;
  background-color: #4a2c17;
  color: #fde68a;
}`;

export const PADARIA_TRIGO_DOURADO: SiteAlvo = {
  url: "padariatrigodourado.com.br",
  titulo: "Padaria Trigo Dourado",
  head: HEAD_PADARIA,
  body: BODY_PADARIA,
  css: CSS_PADARIA,
};

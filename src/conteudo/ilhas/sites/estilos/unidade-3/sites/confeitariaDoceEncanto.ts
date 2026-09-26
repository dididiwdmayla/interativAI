/*
 * Site-alvo dos micro-passos da E3: "Confeitaria Doce Encanto".
 *
 * Os bolos (.bolo) começam sem padding, border nem margin: o texto cola
 * nas bordas e as duas caixas colam uma na outra, de propósito, para o
 * jogador ver o antes e o depois de cada camada. O aviso de domingo
 * (.aviso) e o bloco do WhatsApp (.chamada-whatsapp, largura 100% com
 * padding, sem box-sizing) reaparecem em objetivos diferentes.
 *
 * Âncoras: header, h1, main, h2, .bolo (dois, sem id), h3, .descricao,
 * .preco, .aviso, .chamada-whatsapp, footer.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_CONFEITARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Confeitaria Doce Encanto</title>`;

const BODY_CONFEITARIA = `<header>
  <h1>Confeitaria Doce Encanto</h1>
</header>
<main>
  <h2>Bolos da semana</h2>
  <article class="bolo">
    <h3>Bolo de chocolate</h3>
    <p class="descricao">Massa fofinha com cobertura de ganache.</p>
    <p class="preco">R$ 55</p>
  </article>
  <article class="bolo">
    <h3>Bolo de morango</h3>
    <p class="descricao">Recheio de morango com chantininho.</p>
    <p class="preco">R$ 60</p>
  </article>
  <aside class="aviso">Aberto também aos domingos, das 9h ao meio-dia!</aside>
  <div class="chamada-whatsapp">Peça pelo WhatsApp: (11) 99999-0000</div>
</main>
<footer>
  <p>Confeitaria Doce Encanto, Rua do Açúcar, 10</p>
</footer>`;

export const CSS_CONFEITARIA = `body {
  font-family: Arial, sans-serif;
  color: #333333;
  background-color: #fff8f0;
  margin: 0;
}

header {
  background-color: #f2a65a;
  padding: 16px 24px;
}

h1 {
  margin: 0;
  color: #ffffff;
  font-size: 24px;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #a45c28;
  font-size: 18px;
}

.bolo {
  background-color: #ffffff;
}

.bolo h3 {
  margin: 0;
  font-size: 16px;
}

.descricao {
  margin: 0;
  font-size: 14px;
  color: #666666;
}

.preco {
  margin: 0;
  color: #a45c28;
  font-weight: bold;
}

.aviso {
  display: block;
  background-color: #ffe8cc;
  color: #a45c28;
}

.chamada-whatsapp {
  display: block;
  width: 100%;
  background-color: #25d366;
  color: #ffffff;
  text-align: center;
  padding: 12px;
}

footer {
  background-color: #f2a65a;
  color: #ffffff;
  font-size: 12px;
  padding: 10px 24px;
}`;

export const CONFEITARIA_DOCE_ENCANTO: SiteAlvo = {
  url: "doceencanto.confeitaria.site",
  titulo: "Site da Confeitaria Doce Encanto",
  head: HEAD_CONFEITARIA,
  body: BODY_CONFEITARIA,
  css: CSS_CONFEITARIA,
};

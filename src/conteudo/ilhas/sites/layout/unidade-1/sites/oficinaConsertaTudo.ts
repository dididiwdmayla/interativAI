/*
 * Site-alvo do desafio da L1: "Oficina Conserta Tudo" (mecânica).
 *
 * Site NOVO e diferente da papelaria: outro assunto (oficina), outra
 * estrutura de menu (#menu-servicos), outros nomes de classe
 * (.aviso-garantia, .promo-vencida). Junta as três habilidades da unidade
 * sem passo a passo: display block (aviso em linha própria), inline-block
 * (menu horizontal) e none (sumir com o aviso vencido).
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_OFICINA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Oficina Conserta Tudo</title>`;

const BODY_OFICINA = `<header>
  <h1>Oficina Conserta Tudo</h1>
  <nav id="menu-servicos">
    <ul>
      <li><a href="#carros">Carros</a></li>
      <li><a href="#motos">Motos</a></li>
      <li><a href="#bicicletas">Bicicletas</a></li>
    </ul>
  </nav>
</header>
<main>
  <p class="promo-vencida">Promoção de aniversário: válida só até março do ano passado</p>
  <p>Fazemos revisão completa. <span class="aviso-garantia">Todo serviço tem 90 dias de garantia.</span></p>
  <section id="carros">
    <h2>Carros</h2>
    <p>Troca de óleo e filtros <span class="preco-oficina">R$ 120</span></p>
  </section>
  <section id="motos">
    <h2>Motos</h2>
    <p>Revisão de freios <span class="preco-oficina">R$ 80</span></p>
  </section>
  <section id="bicicletas">
    <h2>Bicicletas</h2>
    <p>Troca de pneus <span class="preco-oficina">R$ 45</span></p>
  </section>
</main>
<footer>
  <p>Oficina Conserta Tudo, Avenida dos Mecânicos, 200</p>
</footer>`;

const CSS_OFICINA = `body {
  font-family: Arial, sans-serif;
  color: #2b2d2f;
  background-color: #f5f5f5;
  margin: 0;
}

header {
  background-color: #1b2a41;
  color: white;
  padding: 16px 24px;
}

h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

#menu-servicos ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

#menu-servicos li {
  background-color: #0f1b2d;
  margin-bottom: 2px;
}

#menu-servicos a {
  color: white;
  padding: 8px 16px;
  text-decoration: none;
}

main {
  padding: 8px 24px;
}

h2 {
  color: #1b2a41;
  font-size: 20px;
}

.promo-vencida {
  background-color: #f2b134;
  padding: 8px 12px;
}

.aviso-garantia {
  background-color: #2f9c95;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.preco-oficina {
  background-color: #f2b134;
  width: 70px;
  font-weight: bold;
  padding: 2px 6px;
}

footer {
  background-color: #0f1b2d;
  color: #c9c9d9;
  font-size: 14px;
  padding: 12px 24px;
}`;

export const OFICINA_CONSERTA_TUDO: SiteAlvo = {
  url: "consertatudo.oficina.site",
  titulo: "Oficina Conserta Tudo",
  head: HEAD_OFICINA,
  body: BODY_OFICINA,
  css: CSS_OFICINA,
};

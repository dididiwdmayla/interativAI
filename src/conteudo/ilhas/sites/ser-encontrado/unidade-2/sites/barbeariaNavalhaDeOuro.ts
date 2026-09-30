/*
 * Site-alvo da S2, Fase 1: "Barbearia Navalha de Ouro".
 *
 * O problema de propósito: o nome da barbearia é uma div estilizada (grande
 * e dourada, parece título, mas não é), e a promoção da semana virou um
 * segundo h1. Fica um h1 que não diz o que a página é, e o que deveria ser
 * o título está sem etiqueta de título.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

export const BARBEARIA_NAVALHA_DE_OURO: SiteAlvo = {
  url: "navalhadeouro.exemplo",
  titulo: "Barbearia Navalha de Ouro",
  head: `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Barbearia Navalha de Ouro | Corte e barba em Campinas</title>
<style>
  body { font-family: Verdana, sans-serif; margin: 0; padding: 20px; color: #2d2a26; background: #f7f1e6; }
  .nome { font-size: 30px; font-weight: bold; color: #9a6a12; }
  h1 { font-size: 24px; color: #6b4a10; }
</style>`,
  body: `<header>
  <div id="nome" class="nome">Barbearia Navalha de Ouro</div>
</header>
<main>
  <p>Corte, barba e sobrancelha em Campinas, sem fila.</p>
  <h1 id="promo">Promoção de inverno</h1>
  <p>Combo de corte e barba por R$ 55, de segunda a quinta.</p>
  <h3 id="servicos">Serviços</h3>
  <ul>
    <li>Corte</li>
    <li>Barba</li>
    <li>Sobrancelha</li>
  </ul>
</main>`,
};

/*
 * Site-alvo dos micro-passos da Unidade 5: "Oficina Roda Livre".
 *
 * Uma oficina de bicicletas com a página inteira feita só de div: o
 * cabeçalho, o agrupamento dos serviços, cada card de serviço e o rodapé.
 * Até o preço (destaque em negrito) usa b, sem nenhum significado — o
 * gancho perfeito pra revisar strong vs span.
 *
 * Âncoras naturais: #topo, #servicos, #servico-revisao, #servico-pintura,
 * .servico, .preco, #sobre, #rodape.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_OFICINA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Oficina Roda Livre</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #eef2ea;
    color: #23301f;
    font-family: Arial, sans-serif;
  }
  #topo { padding: 18px 24px; background: #3f5c2c; color: #fff; text-align: center; }
  .marca { margin: 0 0 10px; font-size: 24px; font-weight: bold; }
  .menu { display: flex; justify-content: center; gap: 18px; }
  .menu a { color: #fff; text-decoration: none; font-weight: bold; }
  .conteudo { max-width: 640px; margin: 0 auto; padding: 20px; }
  .secao { margin-bottom: 26px; }
  h2 { color: #3f5c2c; }
  .servico { padding: 12px 16px; background: #fff; border-radius: 8px; margin-bottom: 10px; }
  .preco { color: #a15a1f; }
  #rodape { padding: 16px 24px; background: #23301f; color: #eef2ea; text-align: center; font-size: 13px; }
</style>`;

const BODY_OFICINA = `<div id="topo">
  <p class="marca">Oficina Roda Livre</p>
  <div class="menu">
    <a href="#servicos">Serviços</a>
    <a href="#sobre">Sobre nós</a>
  </div>
</div>
<div class="conteudo">
  <div id="servicos" class="secao">
    <h2>Nossos serviços</h2>
    <div class="servico" id="servico-revisao">
      <h3>Revisão completa</h3>
      <p>Freios, marchas e pneus, a partir de <b class="preco">R$ 80</b>.</p>
    </div>
    <div class="servico" id="servico-pintura">
      <h3>Pintura da armação</h3>
      <p>Escolha a cor, a partir de <b class="preco">R$ 150</b>.</p>
    </div>
  </div>
  <div id="sobre" class="secao">
    <h2>Sobre nós</h2>
    <p>Consertamos bicicletas da vila desde 2015.</p>
  </div>
</div>
<div id="rodape">Oficina Roda Livre. Aberta de terça a sábado.</div>`;

export const SITE_OFICINA: SiteAlvo = {
  url: "oficina-roda-livre.site",
  titulo: "Site da Oficina Roda Livre",
  head: HEAD_OFICINA,
  body: BODY_OFICINA,
};

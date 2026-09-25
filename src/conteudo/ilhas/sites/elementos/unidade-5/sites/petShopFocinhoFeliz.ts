/*
 * Site-alvo do desafio da Unidade 5: "Pet Shop Focinho Feliz".
 *
 * Os mesmos quatro problemas dos micro-passos (cabeçalho e rodapé em div,
 * agrupamento e cards sem tag semântica, preço em negrito sem significado),
 * num site novo e diferente da Oficina Roda Livre.
 *
 * Âncoras naturais: #topo, #servicos, #servico-banho, #servico-vet,
 * .preco, #sobre, #rodape.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PET = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pet Shop Focinho Feliz</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #fff3e6;
    color: #452c14;
    font-family: "Trebuchet MS", Arial, sans-serif;
  }
  #topo { padding: 18px 24px; background: #e07a2c; color: #fff; text-align: center; }
  .marca { margin: 0 0 10px; font-size: 24px; font-weight: bold; }
  .menu { display: flex; justify-content: center; gap: 18px; }
  .menu a { color: #fff; text-decoration: none; font-weight: bold; }
  .conteudo { max-width: 640px; margin: 0 auto; padding: 20px; }
  .secao { margin-bottom: 26px; }
  h2 { color: #e07a2c; }
  .servico { padding: 12px 16px; background: #fff; border-radius: 8px; margin-bottom: 10px; }
  .preco { color: #a15a1f; }
  #rodape { padding: 16px 24px; background: #452c14; color: #fff3e6; text-align: center; font-size: 13px; }
</style>`;

const BODY_PET = `<div id="topo">
  <p class="marca">Pet Shop Focinho Feliz</p>
  <div class="menu">
    <a href="#servicos">Serviços</a>
    <a href="#sobre">Sobre</a>
  </div>
</div>
<div class="conteudo">
  <div id="servicos" class="secao">
    <h2>Nossos serviços</h2>
    <div class="servico" id="servico-banho">
      <h3>Banho e tosa</h3>
      <p>A partir de <b class="preco">R$ 45</b>.</p>
    </div>
    <div class="servico" id="servico-vet">
      <h3>Consulta veterinária</h3>
      <p>A partir de <b class="preco">R$ 90</b>.</p>
    </div>
  </div>
  <div id="sobre" class="secao">
    <h2>Sobre nós</h2>
    <p>Cuidando dos bichanos da vila desde 2018.</p>
  </div>
</div>
<div id="rodape">Pet Shop Focinho Feliz. Aberto todos os dias.</div>`;

export const SITE_PET_SHOP: SiteAlvo = {
  url: "focinho-feliz.site",
  titulo: "Site do Pet Shop Focinho Feliz",
  head: HEAD_PET,
  body: BODY_PET,
};

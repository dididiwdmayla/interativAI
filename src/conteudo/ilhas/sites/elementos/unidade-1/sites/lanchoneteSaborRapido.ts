/*
 * Site-alvo do desafio da Unidade 1: "Lanchonete Sabor Rápido".
 *
 * Site NOVO e diferente da padaria (outro assunto, outra estrutura), só
 * com CSS (sem imagens). Exceção à regra das cores: representa "o site de
 * outra pessoa".
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_LANCHONETE = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lanchonete Sabor Rápido</title>
<style>
  * { box-sizing: border-box; }
  html { background: #f4f8f1; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: Verdana, Geneva, sans-serif;
    color: #2c4a1e;
    background: #f4f8f1;
  }
  .topo {
    padding: 16px 32px;
    background: #4c7a2e;
    color: #f4f8f1;
    font-weight: bold;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 6px solid #ffb703;
  }
  #aviso {
    margin: 16px 32px 0;
    padding: 10px 16px;
    display: inline-block;
    background: #ffb703;
    color: #3a2a05;
    font-weight: bold;
    border-radius: 10px;
  }
  h1 {
    margin: 24px 32px 8px;
    font-size: 38px;
    line-height: 1.1;
    color: #2c4a1e;
  }
  .descricao {
    margin: 0 32px 20px;
    max-width: 520px;
    font-size: 17px;
    line-height: 1.5;
    color: #3f5c2f;
  }
  .botao {
    margin: 0 32px 36px;
    padding: 12px 28px;
    border: none;
    border-radius: 999px;
    background: #4c7a2e;
    color: #ffffff;
    font-size: 17px;
    font-weight: bold;
    box-shadow: 0 5px 0 #2c4a1e;
    cursor: pointer;
  }
  h2 {
    margin: 0 32px 12px;
    font-size: 24px;
    color: #2c4a1e;
  }
  .cardapio {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0 32px 40px;
    padding: 0;
    list-style: none;
  }
  .cardapio li {
    padding: 14px 20px;
    background: #ffffff;
    border: 2px solid #cfe3c1;
    border-radius: 16px;
    font-size: 16px;
    box-shadow: 0 4px 0 #cfe3c1;
  }
  .cardapio li::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
    background: #ffb703;
  }
  .rodape {
    padding: 18px 32px;
    background: #2c4a1e;
    color: #dcecd2;
    font-size: 14px;
  }
  @media (max-width: 560px) {
    .cardapio { flex-direction: column; }
  }
</style>`;

const BODY_LANCHONETE = `<header class="topo">Lanchonete Sabor Rápido</header>
<div id="aviso">Aberto todos os dias, das 11h às 22h</div>
<h1>Cardápio de hoje</h1>
<p class="descricao">Sanduíches, sucos naturais e porções prontas na hora, para comer aqui ou levar.</p>
<button class="botao">Pedir agora</button>
<h2>Pratos do dia</h2>
<ul class="cardapio">
  <li>Sanduíche especial</li>
  <li>Suco de laranja</li>
  <li>Batata rústica</li>
</ul>
<footer class="rodape">Rua da Praça, 45. Entrega em até 40 minutos.</footer>`;

export const SITE_LANCHONETE: SiteAlvo = {
  url: "lanchonete-sabor-rapido.site",
  titulo: "Site da Lanchonete Sabor Rápido",
  head: HEAD_LANCHONETE,
  body: BODY_LANCHONETE,
};

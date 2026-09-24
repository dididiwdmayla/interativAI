/*
 * Site-alvo da Unidade 1: "Padaria Pão Quentinho".
 *
 * Este arquivo representa "o site de outra pessoa". Por isso os arquivos
 * em sites/ são a única exceção à regra de cores: o CSS abaixo tem cores
 * próprias e fixas, que não mudam com o tema do jogo.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_PADARIA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Padaria Pão Quentinho</title>
<style>
  * { box-sizing: border-box; }
  html { background: #fdf3e4; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: Georgia, "Times New Roman", serif;
    color: #4a2a14;
    background:
      radial-gradient(circle at 90% 8%, #ffe2b8 0 120px, transparent 121px),
      #fdf3e4;
  }
  .topo {
    padding: 16px 32px;
    background: #c4611f;
    color: #fff6e9;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-weight: bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-bottom: 6px dashed #f2b56b;
  }
  h1 {
    margin: 40px 32px 8px;
    font-size: 44px;
    line-height: 1.1;
    color: #8a3510;
  }
  .descricao {
    margin: 0 32px 20px;
    max-width: 520px;
    font-size: 18px;
    line-height: 1.5;
    color: #6b4428;
  }
  .botao {
    margin: 0 32px 36px;
    padding: 12px 28px;
    border: none;
    border-radius: 999px;
    background: #e0762f;
    color: #ffffff;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-size: 17px;
    font-weight: bold;
    box-shadow: 0 5px 0 #a8480f;
    cursor: pointer;
  }
  h2 {
    margin: 0 32px 12px;
    font-size: 26px;
    color: #8a3510;
  }
  .produtos {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0 32px 40px;
    padding: 0;
    list-style: none;
  }
  .produtos li {
    padding: 14px 20px;
    background: #fffaf2;
    border: 2px solid #f0c48e;
    border-radius: 16px;
    font-size: 17px;
    box-shadow: 0 4px 0 #f0c48e;
  }
  .produtos li::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
    background: #e0762f;
  }
  .rodape {
    padding: 18px 32px;
    background: #4a2a14;
    color: #f7dcb8;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-size: 14px;
  }
</style>`;

const BODY_PADARIA = `<header class="topo">Padaria Pão Quentinho</header>
<h1>Pão quentinho toda manhã</h1>
<p class="descricao">Fornadas fresquinhas desde as 6 da manhã, feitas com carinho aqui no bairro.</p>
<button class="botao">Encomendar</button>
<h2>Nossos produtos</h2>
<ul class="produtos">
  <li>Pão francês</li>
  <li>Pão de queijo</li>
  <li>Bolo de cenoura</li>
</ul>
<footer class="rodape">Rua das Flores, 123. Aberto todos os dias, das 6h às 20h.</footer>`;

export const SITE_PADARIA: SiteAlvo = {
  url: "padaria-pao-quentinho.site",
  titulo: "Site da Padaria Pão Quentinho",
  head: HEAD_PADARIA,
  body: BODY_PADARIA,
};

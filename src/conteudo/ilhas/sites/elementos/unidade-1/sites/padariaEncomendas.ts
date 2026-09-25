/*
 * Site-alvo da Unidade 1, Fase 2: "Padaria Pão Quentinho — Encomendas".
 *
 * Variação da mesma padaria (outra página: pedidos por encomenda), com
 * outros elementos e outros textos, para o jogador não decorar o caminho
 * de cor. Exceção à regra das cores: representa "o site de outra pessoa".
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_ENCOMENDAS = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Padaria Pão Quentinho — Encomendas</title>
<style>
  * { box-sizing: border-box; }
  html { background: #fdf3e4; }
  body {
    margin: 0;
    min-height: 100vh;
    font-family: Georgia, "Times New Roman", serif;
    color: #4a2a14;
    background:
      radial-gradient(circle at 92% 10%, #ffe2b8 0 110px, transparent 111px),
      #fdf3e4;
  }
  .topo {
    padding: 16px 32px;
    background: #8a3510;
    color: #fff6e9;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-bottom: 6px dashed #f2b56b;
  }
  h1 {
    margin: 40px 32px 8px;
    font-size: 40px;
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
    background: #c4611f;
    color: #ffffff;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-size: 17px;
    font-weight: bold;
    box-shadow: 0 5px 0 #8a3510;
    cursor: pointer;
  }
  h2 {
    margin: 0 32px 12px;
    font-size: 24px;
    color: #8a3510;
  }
  .sabores {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 0 32px 40px;
    padding: 0;
    list-style: none;
  }
  .sabores li {
    padding: 14px 20px;
    background: #fffaf2;
    border: 2px solid #f0c48e;
    border-radius: 16px;
    font-size: 17px;
    box-shadow: 0 4px 0 #f0c48e;
  }
  .sabores li::before {
    content: "";
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    border-radius: 50%;
    background: #c4611f;
  }
  .rodape {
    padding: 18px 32px;
    background: #4a2a14;
    color: #f7dcb8;
    font-family: "Trebuchet MS", Verdana, sans-serif;
    font-size: 14px;
  }
</style>`;

const BODY_ENCOMENDAS = `<header class="topo">Padaria Pão Quentinho — Encomendas</header>
<h1>Peça seu docinho preferido</h1>
<p class="descricao">Prontos para retirar em uma hora, direto do forno da nossa cozinha.</p>
<button class="botao">Fazer encomenda</button>
<h2>Sabores de hoje</h2>
<ul class="sabores">
  <li>Brigadeiro</li>
  <li>Beijinho</li>
  <li>Cajuzinho</li>
</ul>
<footer class="rodape">Encomendas até as 16h. Retirada na loja, rua das Flores, 123.</footer>`;

export const SITE_PADARIA_ENCOMENDAS: SiteAlvo = {
  url: "padaria-pao-quentinho.site/encomendas",
  titulo: "Site da Padaria Pão Quentinho — Encomendas",
  head: HEAD_ENCOMENDAS,
  body: BODY_ENCOMENDAS,
};

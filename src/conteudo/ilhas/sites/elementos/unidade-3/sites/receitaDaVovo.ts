/*
 * Site-alvo do desafio da Unidade 3: "Receita da Vovó".
 *
 * Uma página de receita de bolo de fubá, com os mesmos três problemas dos
 * micro-passos (hierarquia de títulos errada, negrito só estético e lista de
 * passos sem numeração), num site novo e diferente do Blog da Horta.
 *
 * Âncoras naturais: #titulo-receita, #ingredientes-titulo, #ingredientes,
 * #modo-titulo, #passos-receita, #aviso-receita .destaque-importante.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_RECEITA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Receita da Vovó</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #fbeee0;
    color: #4a2c14;
    font-family: Georgia, "Times New Roman", serif;
  }
  article { max-width: 640px; margin: 0 auto; padding: 24px 20px 40px; }
  h1, h2, h4, h5 { color: #7a3b12; line-height: 1.2; }
  h1 { font-size: 32px; margin: 0 0 12px; }
  h2 { font-size: 22px; margin: 26px 0 10px; border-bottom: 2px dashed #e0b487; padding-bottom: 4px; }
  h4 { font-size: 26px; margin: 0 0 12px; }
  h5 { font-size: 20px; margin: 26px 0 10px; }
  p { margin: 0 0 12px; line-height: 1.5; font-size: 15px; }
  ul, ol { margin: 0 0 16px; padding-left: 22px; line-height: 1.5; }
  li { margin-bottom: 4px; }
  .destaque-importante { color: #a12b2b; }
  #aviso-receita {
    padding: 10px 14px;
    background: #ffe9c9;
    border: 1px solid #e0b487;
    border-radius: 8px;
  }
</style>`;

const BODY_RECEITA = `<article>
  <h4 id="titulo-receita">Bolo de fubá da vovó</h4>
  <p id="intro-receita">Uma receita simples, direto do caderno da vovó Alzira.</p>

  <h5 id="ingredientes-titulo">Ingredientes</h5>
  <ul id="ingredientes">
    <li>3 ovos</li>
    <li>2 xícaras de fubá</li>
    <li>1 xícara de açúcar</li>
    <li>1 xícara de leite</li>
  </ul>

  <h5 id="modo-titulo">Modo de preparo</h5>
  <ul id="passos-receita">
    <li>Bata os ovos com o açúcar</li>
    <li>Acrescente o fubá aos poucos</li>
    <li>Junte o leite e misture bem</li>
    <li>Asse por 40 minutos</li>
  </ul>

  <p id="aviso-receita"><b class="destaque-importante">Atenção</b>: o forno precisa estar bem quente antes de colocar a forma.</p>
</article>`;

export const SITE_RECEITA: SiteAlvo = {
  url: "receita-da-vovo.site",
  titulo: "Site da Receita da Vovó",
  head: HEAD_RECEITA,
  body: BODY_RECEITA,
};

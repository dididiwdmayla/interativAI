/*
 * Site-alvo dos micro-passos da Unidade 3: "Blog da Horta Comunitária".
 *
 * Um post de blog sobre plantar tomate, com a hierarquia de títulos errada
 * (h4, h5 e h6 fora de ordem), negrito e itálico usados só por estética (b e
 * i) e uma lista de passos que devia ser numerada (ul em vez de ol).
 *
 * Âncoras naturais: #titulo-principal, #materiais-titulo, #materiais,
 * #passos-titulo, #passos, #dica-titulo, #dica, #cuidados-titulo, #cuidados,
 * #aviso .destaque-importante, #curiosidade .destaque-tom, #extra
 * .destaque-importante/.destaque-tom.
 *
 * `SITE_HORTA_LIMPO` já sai com a hierarquia de títulos e as ênfases certas
 * (fase 1 e 2 já feitas): usado na fase 3, que só mexe nas listas.
 */
import type { SiteAlvo } from "@/conteudo/tipos";

const HEAD_HORTA = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blog da Horta Comunitária</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    background: #f3f1e6;
    color: #2c3320;
    font-family: "Trebuchet MS", Arial, sans-serif;
  }
  article { max-width: 640px; margin: 0 auto; padding: 24px 20px 40px; }
  h1, h2, h3, h4, h5, h6 { color: #3f5c2c; line-height: 1.2; }
  h1 { font-size: 30px; margin: 0 0 12px; }
  h2 { font-size: 22px; margin: 26px 0 10px; border-bottom: 2px solid #cfe0b6; padding-bottom: 4px; }
  h3 { font-size: 18px; margin: 18px 0 8px; }
  h4 { font-size: 26px; margin: 0 0 12px; }
  h5 { font-size: 20px; margin: 26px 0 10px; }
  h6 { font-size: 16px; margin: 18px 0 8px; }
  p { margin: 0 0 12px; line-height: 1.5; font-size: 15px; }
  ul, ol { margin: 0 0 16px; padding-left: 22px; line-height: 1.5; }
  li { margin-bottom: 4px; }
  .destaque-importante, .destaque-tom { color: #6b3f16; }
  #aviso, #extra {
    padding: 10px 14px;
    background: #fff4d6;
    border: 1px solid #e3c988;
    border-radius: 8px;
  }
</style>`;

const BODY_BAGUNCADO = `<article>
  <h4 id="titulo-principal">Como plantar tomate em casa</h4>
  <p id="intro">Um guia rápido para colher tomates fresquinhos na varanda.</p>

  <h2 id="materiais-titulo">O que você vai precisar</h2>
  <ul id="materiais">
    <li>Vaso grande</li>
    <li>Terra adubada</li>
    <li>Muda de tomate</li>
  </ul>

  <h5 id="passos-titulo">Passo a passo</h5>
  <ul id="passos">
    <li>Encha o vaso com terra</li>
    <li>Plante a muda no centro</li>
    <li>Regue todos os dias</li>
  </ul>

  <h6 id="dica-titulo">Dica da vizinha Dona Zilda</h6>
  <p id="dica">Regue de manhã cedo, antes do sol esquentar.</p>

  <h2 id="cuidados-titulo">Cuidados durante a semana</h2>
  <ul id="cuidados">
    <li>Segunda: confira a terra</li>
    <li>Quarta: adube de leve</li>
    <li>Sábado: pode as folhas secas</li>
  </ul>

  <p id="aviso"><b class="destaque-importante">Atenção</b>: não deixe o vaso no sol direto o dia inteiro.</p>
  <p id="curiosidade">O tomateiro cresce rápido: em <i class="destaque-tom">oito semanas</i> já dá para colher.</p>
  <p id="extra"><b class="destaque-importante">Importante</b>: regue <i class="destaque-tom">com carinho</i>, sem encharcar demais.</p>
</article>`;

/** Fase 3: hierarquia e ênfases já certas, só as listas continuam sem numeração. */
const BODY_LIMPO = `<article>
  <h1 id="titulo-principal">Como plantar tomate em casa</h1>
  <p id="intro">Um guia rápido para colher tomates fresquinhos na varanda.</p>

  <h2 id="materiais-titulo">O que você vai precisar</h2>
  <ul id="materiais">
    <li>Vaso grande</li>
    <li>Terra adubada</li>
    <li>Muda de tomate</li>
  </ul>

  <h2 id="passos-titulo">Passo a passo</h2>
  <ul id="passos">
    <li>Encha o vaso com terra</li>
    <li>Plante a muda no centro</li>
    <li>Regue todos os dias</li>
  </ul>

  <h3 id="dica-titulo">Dica da vizinha Dona Zilda</h3>
  <p id="dica">Regue de manhã cedo, antes do sol esquentar.</p>

  <h2 id="cuidados-titulo">Cuidados durante a semana</h2>
  <ul id="cuidados">
    <li>Segunda: confira a terra</li>
    <li>Quarta: adube de leve</li>
    <li>Sábado: pode as folhas secas</li>
  </ul>

  <p id="aviso"><strong class="destaque-importante">Atenção</strong>: não deixe o vaso no sol direto o dia inteiro.</p>
  <p id="curiosidade">O tomateiro cresce rápido: em <em class="destaque-tom">oito semanas</em> já dá para colher.</p>
  <p id="extra"><strong class="destaque-importante">Importante</strong>: regue <em class="destaque-tom">com carinho</em>, sem encharcar demais.</p>
</article>`;

const BASE = {
  url: "blog-da-horta.site",
  titulo: "Site do Blog da Horta Comunitária",
  head: HEAD_HORTA,
};

export const SITE_HORTA: SiteAlvo = { ...BASE, body: BODY_BAGUNCADO };

export const SITE_HORTA_LIMPO: SiteAlvo = { ...BASE, body: BODY_LIMPO };

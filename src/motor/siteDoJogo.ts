/*
 * O próprio jogo como site-alvo (E5, `siteAlvo.tipo: "jogo"`): uma maquete
 * pequena do jogo (barra superior, um pedaço do mapa, o painel com a
 * árvore, o computadorzinho e um botão), pintada SÓ com as variáveis
 * `--cor-*` do tema.
 *
 * O head (fixo) desenha a maquete com `var(--cor-...)` e nenhuma cor
 * literal. A folha editável (estilo.css) é um `:root { ... }` com os tokens
 * reais do tema aberto (src/tema/tokens.css, lidos por
 * src/tema/tokensDoJogo.ts): mudar uma variável no painel Estilos ou no
 * editor CSS repinta a maquete ao vivo. "Salvar como Meu tema" guarda o
 * conjunto inteiro.
 *
 * A folha é montada quando a fase abre (`materializarSiteAlvo`), com o
 * tema do jogador; nos testes, com o Doce.
 */
import type { Fase, SiteAlvo } from "@/conteudo/tipos";
import { type TemaDeBase, type Tokens, tokensDoTema } from "@/tema/tokensDoJogo";

/** Os tokens que a maquete usa, em grupos, na ordem em que aparecem no estilo.css. */
export const GRUPOS_DA_MAQUETE: readonly { nome: string; tokens: readonly string[] }[] = [
  { nome: "Base", tokens: ["--cor-fundo", "--cor-superficie", "--cor-painel", "--cor-borda", "--cor-texto", "--cor-texto-suave"] },
  {
    nome: "Marca (botões e destaques)",
    tokens: [
      "--cor-primaria",
      "--cor-texto-sobre-primaria",
      "--cor-secundaria",
      "--cor-texto-sobre-secundaria",
      "--cor-destaque",
      "--cor-texto-sobre-destaque",
      "--cor-sucesso",
    ],
  },
  { nome: "Painel", tokens: ["--cor-selecao", "--cor-sombra"] },
  { nome: "Código", tokens: ["--cor-codigo-fundo", "--cor-codigo-tag", "--cor-codigo-atributo", "--cor-codigo-valor", "--cor-codigo-texto"] },
  {
    nome: "Computadorzinho",
    tokens: ["--cor-mascote-moldura", "--cor-mascote-moldura-sombra", "--cor-mascote-tela", "--cor-mascote-rosto", "--cor-mascote-bochecha", "--cor-mascote-base"],
  },
  { nome: "Mapa", tokens: ["--cor-mar", "--cor-onda", "--cor-areia", "--cor-grama", "--cor-rota"] },
];

export const TOKENS_DA_MAQUETE: readonly string[] = GRUPOS_DA_MAQUETE.flatMap((grupo) => grupo.tokens);

/** O estilo.css da maquete: um :root com os tokens do tema, em grupos comentados. */
export function cssDosTokens(tokens: Tokens): string {
  const grupos = GRUPOS_DA_MAQUETE.map((grupo) => {
    const linhas = grupo.tokens.filter((nome) => tokens[nome] !== undefined).map((nome) => `  ${nome}: ${tokens[nome]};`);
    return linhas.length > 0 ? `  /* ${grupo.nome} */\n${linhas.join("\n")}` : "";
  }).filter((grupo) => grupo.length > 0);
  return `/* As cores do jogo. Mude uma variável e tudo que usa ela muda junto. */\n:root {\n${grupos.join("\n\n")}\n}\n`;
}

const HEAD_DA_MAQUETE = `<meta name="viewport" content="width=device-width, initial-scale=1">
<title>InterativAI: o jogo</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: system-ui, sans-serif; background: var(--cor-fundo); color: var(--cor-texto); }
  .barra { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: var(--cor-superficie); border-bottom: 2px solid var(--cor-borda); }
  .logo { width: 28px; height: 22px; border-radius: 6px; background: var(--cor-mascote-moldura); padding: 3px; }
  .logo span { display: block; height: 100%; border-radius: 3px; background: var(--cor-mascote-tela); }
  .onde { margin: 0; font-weight: 800; flex: 1; }
  .estrelas { margin: 0; padding: 2px 10px; border-radius: 999px; background: var(--cor-destaque); color: var(--cor-texto-sobre-destaque); font-weight: 800; font-size: 13px; }
  .jogo { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px; }
  .mapa { position: relative; min-height: 150px; border-radius: 16px; background: var(--cor-mar); overflow: hidden; border: 2px solid var(--cor-borda); }
  .onda { position: absolute; left: 12px; right: 12px; height: 4px; border-radius: 4px; background: var(--cor-onda); opacity: 0.7; }
  .onda.um { top: 18px; } .onda.dois { bottom: 16px; }
  .ilha { position: absolute; left: 18%; top: 28%; width: 64%; height: 52%; border-radius: 50%; background: var(--cor-areia); }
  .grama { position: absolute; inset: 14% 12% 24% 12%; border-radius: 50%; background: var(--cor-grama); }
  .rota { position: absolute; left: 30%; right: 30%; top: 52%; border-top: 3px dashed var(--cor-rota); }
  .ponto { position: absolute; top: calc(52% - 9px); width: 16px; height: 16px; border-radius: 50%; background: var(--cor-superficie); border: 3px solid var(--cor-primaria); }
  .ponto.feito { left: calc(30% - 8px); background: var(--cor-sucesso); border-color: var(--cor-sucesso); }
  .ponto.proximo { right: calc(30% - 8px); }
  .painel { border-radius: 16px; background: var(--cor-painel); border: 2px solid var(--cor-borda); box-shadow: 0 4px 0 var(--cor-sombra); overflow: hidden; }
  .aba { margin: 0; padding: 6px 10px; background: var(--cor-superficie); color: var(--cor-primaria); font-weight: 800; font-size: 13px; }
  .arvore { margin: 0; padding: 8px 10px; list-style: none; background: var(--cor-codigo-fundo); color: var(--cor-codigo-texto); font-family: ui-monospace, monospace; font-size: 12px; line-height: 1.7; }
  .arvore li.selecionada { background: var(--cor-selecao); border-radius: 4px; }
  .arvore .dentro { padding-left: 14px; }
  .tag { color: var(--cor-codigo-tag); } .atributo { color: var(--cor-codigo-atributo); } .valor { color: var(--cor-codigo-valor); }
  .mascote { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 16px; background: var(--cor-superficie); border: 2px solid var(--cor-borda); }
  .monitor { flex: none; width: 64px; padding: 6px; border-radius: 12px; background: var(--cor-mascote-moldura); box-shadow: 0 4px 0 var(--cor-mascote-moldura-sombra); }
  .tela { position: relative; height: 40px; border-radius: 6px; background: var(--cor-mascote-tela); }
  .olho { position: absolute; top: 12px; width: 6px; height: 8px; border-radius: 3px; background: var(--cor-mascote-rosto); }
  .olho.esquerdo { left: 14px; } .olho.direito { right: 14px; }
  .bochecha { position: absolute; top: 22px; width: 8px; height: 4px; border-radius: 4px; background: var(--cor-mascote-bochecha); }
  .bochecha.esquerda { left: 6px; } .bochecha.direita { right: 6px; }
  .boca { position: absolute; left: 22px; top: 22px; width: 10px; height: 5px; border-bottom: 3px solid var(--cor-mascote-rosto); border-radius: 0 0 8px 8px; }
  .pe { width: 26px; height: 8px; margin: 4px auto 0; border-radius: 4px; background: var(--cor-mascote-base); }
  .fala { flex: 1; margin: 0; padding: 8px 10px; border-radius: 12px; background: var(--cor-painel); color: var(--cor-texto); }
  .fala small { display: block; color: var(--cor-texto-suave); }
  .botoes { display: flex; flex-direction: column; gap: 6px; }
  .botao { border: 0; border-radius: 12px; padding: 8px 14px; font: inherit; font-weight: 800; background: var(--cor-primaria); color: var(--cor-texto-sobre-primaria); box-shadow: 0 3px 0 var(--cor-sombra); }
  .botao.secundario { background: var(--cor-secundaria); color: var(--cor-texto-sobre-secundaria); }
  @media (max-width: 560px) {
    .jogo { grid-template-columns: 1fr; }
    .mascote { flex-wrap: wrap; }
  }
</style>`;

const BODY_DA_MAQUETE = `<header class="barra" id="barra">
  <div class="logo"><span></span></div>
  <p class="onde">Ilha Sites › Estilos</p>
  <p class="estrelas" id="estrelas">3 estrelas</p>
</header>
<main class="jogo">
  <section class="mapa" id="mapa" aria-label="Um pedaço do mapa">
    <span class="onda um"></span>
    <div class="ilha"><div class="grama"></div></div>
    <div class="rota"></div>
    <span class="ponto feito" title="Unidade concluída"></span>
    <span class="ponto proximo" title="Próxima unidade"></span>
    <span class="onda dois"></span>
  </section>
  <section class="painel" id="painel" aria-label="O painel com a árvore">
    <p class="aba">Elementos</p>
    <ul class="arvore">
      <li><span class="tag">&lt;main</span> <span class="atributo">class</span>=<span class="valor">"jogo"</span><span class="tag">&gt;</span></li>
      <li class="dentro selecionada"><span class="tag">&lt;h1&gt;</span>Meu site<span class="tag">&lt;/h1&gt;</span></li>
      <li class="dentro"><span class="tag">&lt;p&gt;</span>Olá!<span class="tag">&lt;/p&gt;</span></li>
      <li><span class="tag">&lt;/main&gt;</span></li>
    </ul>
  </section>
  <aside class="mascote" id="computadorzinho" aria-label="O computadorzinho">
    <div>
      <div class="monitor">
        <div class="tela">
          <span class="olho esquerdo"></span><span class="olho direito"></span>
          <span class="bochecha esquerda"></span><span class="bochecha direita"></span>
          <span class="boca"></span>
        </div>
      </div>
      <div class="pe"></div>
    </div>
    <p class="fala">Que tal umas cores novas pra mim?<small>Mude as variáveis do :root no estilo.css.</small></p>
    <div class="botoes">
      <button class="botao" id="botao" type="button">Próximo objetivo</button>
      <button class="botao secundario" type="button">Me ajuda</button>
    </div>
  </aside>
</main>`;

/**
 * O site-alvo da E5 (sem `css`: a folha editável sai do tema do jogador
 * quando a fase abre). As fases usam este objeto direto.
 */
export const SITE_ALVO_DO_JOGO: SiteAlvo = {
  tipo: "jogo",
  url: "interativai.jogo/meu-tema",
  titulo: "O próprio jogo (maquete)",
  head: HEAD_DA_MAQUETE,
  body: BODY_DA_MAQUETE,
};

/** De onde saem as cores da maquete: um tema de base ou um conjunto pronto (o Meu tema). */
export type FonteDasCores = TemaDeBase | Tokens;

/** O site-alvo pronto para jogar: no tipo "jogo" sem css, a folha vem das cores dadas. */
export function materializarSiteAlvo(siteAlvo: SiteAlvo, cores: FonteDasCores = "doce"): SiteAlvo {
  if (siteAlvo.tipo !== "jogo" || siteAlvo.css !== undefined) return siteAlvo;
  const tokens = typeof cores === "string" ? tokensDoTema(cores) : cores;
  return { ...siteAlvo, css: cssDosTokens(tokens) };
}

/** A fase com o site-alvo pronto (a mesma fase se não for do tipo "jogo"). */
export function materializarFase<T extends Fase>(fase: T, cores: FonteDasCores = "doce"): T {
  const pronto = materializarSiteAlvo(fase.siteAlvo, cores);
  return pronto === fase.siteAlvo ? fase : { ...fase, siteAlvo: pronto };
}

/*
 * E5: o próprio jogo como site-alvo e o Meu tema. Os tokens reais do
 * tokens.css (lidos do arquivo, como o jogo lê das folhas da página), a
 * maquete pintada só com var(--cor-*), o contraste dos pares principais,
 * a limpeza das cores salvas, o progresso e a simulação (variavelCss,
 * temaSalvo, salvarTema) com as sabotagens da checagem.
 */
import { describe, expect, it } from "vitest";
import { FASE_BANCADA_TEMA } from "@/conteudo/laboratorio/bancadaTema";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import type { FasePratica } from "@/conteudo/tipos";
import { contrasteEntre, formatarContraste, razaoDeContraste } from "@/lib/contraste";
import { conferirContraste, cssDoMeuTema, lerMeuTema, limparCores, montarMeuTema, PARES_PRINCIPAIS } from "@/lib/meuTema";
import { normalizarProgresso } from "@/lib/progresso";
import { valorEfetivo } from "@/motor/css/cascata";
import { criarSimulacao } from "@/motor/simulacao";
import { cssDosTokens, materializarFase, SITE_ALVO_DO_JOGO, TOKENS_DA_MAQUETE } from "@/motor/siteDoJogo";
import { TEMAS_DE_BASE, tokensDoTema } from "@/tema/tokensDoJogo";

describe("tokens reais do tema", () => {
  it("os três temas do tokens.css têm todos os tokens da maquete", () => {
    for (const tema of TEMAS_DE_BASE) {
      const tokens = tokensDoTema(tema);
      for (const nome of TOKENS_DA_MAQUETE) expect(tokens[nome], `${tema} ${nome}`).toBeDefined();
    }
    expect(tokensDoTema("doce")["--cor-primaria"]).not.toBe(tokensDoTema("fliperama")["--cor-primaria"]);
  });

  it("os três temas do jogo passam em todos os pares principais (4,5:1)", () => {
    for (const tema of TEMAS_DE_BASE) {
      const ruins = conferirContraste(tokensDoTema(tema)).filter((par) => !par.bom);
      expect(ruins.map((par) => par.nome), tema).toEqual([]);
    }
  });
});

describe("a maquete do jogo", () => {
  it("o head e o body não têm nenhuma cor literal: tudo é var(--cor-*)", () => {
    const semVar = SITE_ALVO_DO_JOGO.head.replace(/var\(--cor-[a-z0-9-]+\)/g, "");
    expect(semVar).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
    expect(SITE_ALVO_DO_JOGO.body).not.toMatch(/#[0-9a-f]{3,8}\b|style=/i);
    expect(SITE_ALVO_DO_JOGO.css).toBeUndefined();
  });

  it("o estilo.css é um :root com os tokens em grupos", () => {
    const css = cssDosTokens(tokensDoTema("doce"));
    expect(css).toContain(":root {");
    expect(css).toContain("/* Base */");
    for (const nome of TOKENS_DA_MAQUETE) expect(css).toContain(`${nome}: `);
  });

  it("materializar: sem cores, o Doce; com um conjunto pronto, ele; fase comum não muda", () => {
    const doce = materializarFase(FASE_BANCADA_TEMA);
    expect(doce.siteAlvo.css).toContain(`--cor-primaria: ${tokensDoTema("doce")["--cor-primaria"]};`);
    const fliperama = materializarFase(FASE_BANCADA_TEMA, "fliperama");
    expect(fliperama.siteAlvo.css).toContain(`--cor-primaria: ${tokensDoTema("fliperama")["--cor-primaria"]};`);
    const comum: FasePratica = { ...FASE_BANCADA_TEMA, siteAlvo: { ...SITE_ALVO_DO_JOGO, tipo: undefined, css: "p{}" } };
    expect(materializarFase(comum)).toBe(comum);
  });

  it("o motor resolve as cores da maquete pelas variáveis", () => {
    const sim = criarSimulacao(FASE_BANCADA_TEMA);
    const botao = sim.documento.querySelector("#botao");
    if (!botao) throw new Error("#botao");
    const efetivo = valorEfetivo(botao, "background-color")["background-color"];
    expect(efetivo.tipo === "valor" && efetivo.valor).toBe(tokensDoTema("doce")["--cor-primaria"]);
  });
});

describe("contraste (WCAG 2)", () => {
  it("preto no branco é 21:1, igual é 1:1, e o clássico #777 no branco fica abaixo de 4,5", () => {
    expect(contrasteEntre("#000", "#fff")).toBeCloseTo(21, 5);
    expect(contrasteEntre("red", "#f00")).toBeCloseTo(1, 5);
    expect(contrasteEntre("#777", "#fff")).toBeLessThan(4.5);
    expect(contrasteEntre("#767676", "#fff")).toBeGreaterThanOrEqual(4.5);
    expect(contrasteEntre("nada", "#fff")).toBeNull();
    expect(formatarContraste(4.54)).toBe("4,5:1");
  });

  it("texto transparente é misturado ao fundo antes", () => {
    expect(razaoDeContraste([0, 0, 0, 0.5], [255, 255, 255, 1])).toBeLessThan(razaoDeContraste([0, 0, 0, 1], [255, 255, 255, 1]));
  });

  it("os pares principais: texto e fundo, texto e botão", () => {
    expect(PARES_PRINCIPAIS.map((par) => `${par.texto} ${par.fundo}`)).toContain("--cor-texto-sobre-primaria --cor-primaria");
    const ruim = conferirContraste({ ...tokensDoTema("doce"), "--cor-primaria": "#ffe0f0" });
    expect(ruim.find((par) => par.fundo === "--cor-primaria")?.bom).toBe(false);
  });
});

describe("Meu tema salvo", () => {
  it("só entram nomes --cor-* e valores de cor seguros (nada de fechar a chave do <style>)", () => {
    expect(
      limparCores({
        "--cor-fundo": "#fff",
        "--cor-texto": "red;} body{display:none",
        "--outra": "#000",
        "--cor-primaria": "rgb(10, 20, 30)",
        "--cor-borda": "url(x)",
      }),
    ).toEqual({ "--cor-fundo": "#fff", "--cor-primaria": "rgb(10, 20, 30)" });
  });

  it("montar: as cores da maquete cobrem as da base; o fundo diz se é escuro", () => {
    const base = tokensDoTema("doce");
    const meu = montarMeuTema("doce", base, { "--cor-fundo": "#101010", "--cor-texto": "#f0f0f0" });
    expect(meu.cores["--cor-fundo"]).toBe("#101010");
    expect(meu.cores["--cor-mar"]).toBe(base["--cor-mar"]);
    expect(meu.escuro).toBe(true);
    expect(cssDoMeuTema(meu)).toMatch(/^\[data-theme="meu"\]\{color-scheme:dark;--cor-fundo:#101010;/);
  });

  it("progresso: o Meu tema vale só com as cores; sem elas, o tema cai no padrão e sai do desbloqueado", () => {
    const cores = { "--cor-fundo": "#101010" };
    const com = normalizarProgresso({ tema: "meu", temasDesbloqueados: ["doce", "fliperama", "meu"], meuTema: { cores, base: "fliperama" } });
    expect(com.tema).toBe("meu");
    expect(com.meuTema).toMatchObject({ cores, base: "fliperama", escuro: true });
    const sem = normalizarProgresso({ tema: "meu", temasDesbloqueados: ["doce", "fliperama", "meu"] });
    expect(sem.tema).toBe("doce");
    expect(sem.temasDesbloqueados).not.toContain("meu");
    expect(lerMeuTema({ cores: { "--x": "#fff" } })).toBeNull();
  });
});

describe("validadores e ação da E5", () => {
  it("variavelCss com diferenteDoInicial, com valor em qualquer formato de cor, e temaSalvo pelo salvarTema", () => {
    const sim = criarSimulacao(FASE_BANCADA_TEMA);
    const mudou = { tipo: "variavelCss", nome: "--cor-primaria", diferenteDoInicial: true } as const;
    expect(sim.avaliar(mudou).passou).toBe(false);
    expect(sim.avaliar({ tipo: "variavelCss", nome: "--cor-primaria" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "variavelCss", nome: "--cor-nada" }).passou).toBe(false);
    sim.executar([{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#1d4ed8" }]);
    expect(sim.avaliar(mudou).passou).toBe(true);
    expect(sim.avaliar({ tipo: "variavelCss", nome: "--cor-primaria", valor: "rgb(29, 78, 216)" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "temaSalvo" }).passou).toBe(false);
    sim.executar([{ tipo: "salvarTema" }]);
    expect(sim.avaliar({ tipo: "temaSalvo" }).passou).toBe(true);
  });

  it("sabotagem: temaSalvo e salvarTema fora do site do jogo, e o site do jogo com css próprio", () => {
    const regra = REGRAS_DE_FASE.find((item) => item.id === "site-do-jogo");
    if (!regra) throw new Error("site-do-jogo");
    const fora: FasePratica = {
      ...FASE_BANCADA_TEMA,
      siteAlvo: { url: "x.site", titulo: "x", head: "", body: "<p>x</p>", css: "p {}" },
    };
    const problemas = regra.checar(fora, { unidades: [], fases: [fora] }).join("\n");
    expect(problemas).toContain('temaSalvo só vale numa fase com siteAlvo.tipo "jogo"');
    expect(problemas).toContain('salvarTema só vale numa fase com siteAlvo.tipo "jogo"');
    const comCss: FasePratica = { ...FASE_BANCADA_TEMA, siteAlvo: { ...SITE_ALVO_DO_JOGO, css: ":root{}" } };
    expect(regra.checar(comCss, { unidades: [], fases: [comCss] }).join("\n")).toContain("o site-alvo do jogo vem sem css");
  });
});

/*
 * O motor de cascata (src/motor/css): o mesmo que o painel Estilos, os
 * validadores de CSS e o testar:conteudo usam. Cada caso monta uma página
 * pequena no jsdom e confere o que ganha, o que fica riscado e o que o
 * motor admite que não sabe.
 */
import { describe, expect, it } from "vitest";
import { analisarCss, analisarEstiloInline } from "@/motor/css/analisarCss";
import { type Bloco, calcularCascata, type ResultadoCascata, type Situacao, valorEfetivo } from "@/motor/css/cascata";
import {
  adicionarDeclaracaoNoTexto,
  adicionarRegraNoTexto,
  alternarPropriedadeNoTexto,
  definirPropriedadeNoTexto,
  removerDeclaracao,
  seletorSimples,
} from "@/motor/css/editarCss";
import { dividirListaDeSeletores, especificidade } from "@/motor/css/especificidade";
import { abrirAtalho, lerCor, normalizarValor, validadeDoValor, valoresIguais } from "@/motor/css/valores";

/** Monta um documento com a folha do jogo e um corpo. */
function pagina(css: string, body: string, head = ""): Document {
  return new DOMParser().parseFromString(
    `<!doctype html><html><head>${head}<style data-folha-jogo>${css}</style></head><body>${body}</body></html>`,
    "text/html",
  );
}

function elemento(documento: Document, seletor: string): Element {
  const achado = documento.querySelector(seletor);
  if (!achado) throw new Error(`não achei ${seletor}`);
  return achado;
}

/** Situação da declaração `propriedade` no bloco de seletor `seletor` (próprio ou herdado). */
function situacao(resultado: ResultadoCascata, seletor: string, propriedade: string, indice = -1): Situacao | undefined {
  const blocos: Bloco[] = [...resultado.proprios, ...resultado.herdados.flatMap((grupo) => grupo.blocos)];
  const bloco = blocos.find((item) => item.seletorExibido === seletor);
  const declaracoes = bloco?.declaracoes.filter((item) => item.declaracao.propriedade === propriedade) ?? [];
  return (indice < 0 ? declaracoes[declaracoes.length + indice] : declaracoes[indice])?.situacao;
}

function valor(documento: Document, seletor: string, propriedade: string): string {
  const efetivo = valorEfetivo(elemento(documento, seletor), propriedade)[propriedade];
  return efetivo.tipo === "valor" ? efetivo.valor : `incerto: ${efetivo.motivo}`;
}

describe("especificidade", () => {
  it.each([
    ["p", [0, 0, 1]],
    ["*", [0, 0, 0]],
    [".card", [0, 1, 0]],
    ["#menu", [1, 0, 0]],
    ["ul li.ativo", [0, 1, 2]],
    ["#topo .menu > a:hover", [1, 2, 1]],
    ["a[href^='http']", [0, 1, 1]],
    ["p::first-line", [0, 0, 2]],
    ["p:before", [0, 0, 2]],
    [":is(#a, .b) p", [1, 0, 1]],
    [":not(.x, .y)", [0, 1, 0]],
    [":where(#a, .b) p", [0, 0, 1]],
    ["li:nth-child(2n+1 of .item)", [0, 2, 1]],
    ["h1 + p ~ span", [0, 0, 3]],
    [".a.b.c", [0, 3, 0]],
    ["div#x.y[z]", [1, 2, 1]],
  ])("%s vale %j", (seletor, esperado) => {
    expect(especificidade(seletor)).toEqual(esperado);
  });

  it("seletor que não dá para ler devolve null", () => {
    expect(especificidade("")).toBeNull();
    expect(especificidade("& .x")).toBeNull();
    expect(especificidade("p:is(")).toBeNull();
  });

  it("divide listas nas vírgulas de fora", () => {
    expect(dividirListaDeSeletores("h1, h2 , :is(a, b), [data-x='1,2']")).toEqual(["h1", "h2", ":is(a, b)", "[data-x='1,2']"]);
  });
});

describe("analisador de CSS", () => {
  it("lê regras, declarações, !important, linhas e declarações desligadas", () => {
    const folha = analisarCss(`/* topo */\nh1 {\n  color: red;\n  /* margin: 0; */\n  font-size: 20px !important\n}\n\n.a, .b { padding: 4px }`);
    expect(folha.regras).toHaveLength(2);
    const [h1, ab] = folha.regras;
    expect(h1.seletor).toBe("h1");
    expect(h1.linha).toBe(2);
    expect(h1.declaracoes.map((item) => [item.propriedade, item.valor, item.ativa, item.importante, item.linha])).toEqual([
      ["color", "red", true, false, 3],
      ["margin", "0", false, false, 4],
      ["font-size", "20px", true, true, 5],
    ]);
    expect(ab.seletor).toBe(".a, .b");
    expect(ab.declaracoes[0].valor).toBe("4px");
  });

  it("guarda @media como condição e marca @layer como incerta", () => {
    const comMedia = analisarCss("@media (max-width: 500px) { p { color: red } }");
    expect(comMedia.regras[0].condicoes).toEqual([{ tipo: "media", texto: "(max-width: 500px)" }]);
    expect(comMedia.incerta).toBe(false);
    expect(analisarCss("@layer base { p { color: red } }").incerta).toBe(true);
    expect(analisarCss("p { color: red; & span { color: blue } }").incerta).toBe(true);
  });

  it("lê o atributo style", () => {
    expect(analisarEstiloInline("color: red; margin:0 auto").map((item) => [item.propriedade, item.valor])).toEqual([
      ["color", "red"],
      ["margin", "0 auto"],
    ]);
  });

  it("não quebra com CSS pela metade (o jogador digitando)", () => {
    expect(() => analisarCss("h1 { color: ")).not.toThrow();
    expect(() => analisarCss("h1 { color: red; } p {")).not.toThrow();
    expect(analisarCss("h1 { color: red; } p {").regras[0].declaracoes[0].valor).toBe("red");
    expect(() => analisarCss('a[title="}"] { color: red }')).not.toThrow();
    expect(analisarCss('a[title="}"] { color: red }').regras[0].seletor).toBe('a[title="}"]');
  });
});

describe("valores", () => {
  it("lê cores em qualquer formato", () => {
    expect(lerCor("red")).toEqual([255, 0, 0, 1]);
    expect(lerCor("#f00")).toEqual([255, 0, 0, 1]);
    expect(lerCor("#FF000080")?.[3]).toBeCloseTo(0.5, 2);
    expect(lerCor("rgb(255, 0, 0)")).toEqual([255, 0, 0, 1]);
    expect(lerCor("rgb(255 0 0 / 50%)")).toEqual([255, 0, 0, 0.5]);
    expect(lerCor("hsl(0, 100%, 50%)")?.map(Math.round)).toEqual([255, 0, 0, 1]);
    expect(lerCor("vermelho")).toBeNull();
  });

  it("compara valores normalizados", () => {
    expect(valoresIguais("red", "#FF0000")).toBe(true);
    expect(valoresIguais("rgb(255,0,0)", "rgb(255, 0, 0)")).toBe(true);
    expect(valoresIguais("16.0px", "16px")).toBe(true);
    expect(valoresIguais("0px", "0")).toBe(true);
    expect(valoresIguais("  10px   20px ", "10px 20px")).toBe(true);
    expect(valoresIguais('"Georgia", serif', "Georgia, serif")).toBe(true);
    expect(valoresIguais("16px", "1rem")).toBe(false);
    expect(normalizarValor("CENTER")).toBe("center");
  });

  it("diz se o valor serve, sem certeza quando não sabe", () => {
    expect(validadeDoValor("color", "red")).toBe("valido");
    expect(validadeDoValor("color", "vermelho")).toBe("invalido");
    expect(validadeDoValor("color", "#12")).toBe("invalido");
    expect(validadeDoValor("font-size", "20")).toBe("invalido");
    expect(validadeDoValor("font-size", "1.2rem")).toBe("valido");
    expect(validadeDoValor("padding", "-4px")).toBe("invalido");
    expect(validadeDoValor("margin", "0 auto")).toBe("valido");
    expect(validadeDoValor("text-align", "meio")).toBe("invalido");
    expect(validadeDoValor("color", "var(--marca)")).toBe("valido");
    expect(validadeDoValor("box-shadow", "0 2px 4px black")).toBe("desconhecido");
    expect(validadeDoValor("propriedade-inventada", "1")).toBe("desconhecido");
  });

  it("abre os atalhos mais comuns", () => {
    expect(abrirAtalho("margin", "10px 20px").longas).toEqual({
      "margin-top": "10px",
      "margin-right": "20px",
      "margin-bottom": "10px",
      "margin-left": "20px",
    });
    expect(abrirAtalho("padding", "1px 2px 3px").longas?.["padding-left"]).toBe("2px");
    expect(abrirAtalho("border", "2px solid red").longas?.["border-left-color"]).toBe("red");
    expect(abrirAtalho("border-top", "dashed").longas).toEqual({
      "border-top-width": "medium",
      "border-top-style": "dashed",
      "border-top-color": "currentcolor",
    });
    expect(abrirAtalho("background", "#fff").longas?.["background-color"]).toBe("#fff");
    expect(abrirAtalho("background", "#fff").longas?.["background-image"]).toBe("none");
    expect(abrirAtalho("font", "italic bold 16px/1.5 Georgia, serif").longas).toMatchObject({
      "font-style": "italic",
      "font-weight": "bold",
      "font-size": "16px",
      "line-height": "1.5",
      "font-family": "Georgia, serif",
    });
    expect(abrirAtalho("gap", "8px 16px").longas).toEqual({ "row-gap": "8px", "column-gap": "16px" });
    expect(abrirAtalho("flex", "1").longas).toEqual({ "flex-grow": "1", "flex-shrink": "1", "flex-basis": "0%" });
    expect(abrirAtalho("flex", "none").longas).toEqual({ "flex-grow": "0", "flex-shrink": "0", "flex-basis": "auto" });
    expect(abrirAtalho("inset", "0").longas).toEqual({ top: "0", right: "0", bottom: "0", left: "0" });
    // Não sabe separar: longas null, mas não inventa.
    expect(abrirAtalho("background", "url(a.png) center / cover no-repeat").longas).toBeNull();
  });
});

describe("cascata: ordem e especificidade", () => {
  it("a regra mais específica vence e a outra fica riscada", () => {
    const documento = pagina("#titulo { color: green; }\nh1 { color: red; }", '<h1 id="titulo">Oi</h1>');
    const resultado = calcularCascata(elemento(documento, "h1"));
    expect(situacao(resultado, "#titulo", "color")).toBe("vence");
    expect(situacao(resultado, "h1", "color")).toBe("perdeu");
    expect(valor(documento, "h1", "color")).toBe("green");
    // Na ordem do Chrome: a que ganha aparece primeiro, a do navegador por último.
    expect(resultado.proprios.map((bloco) => bloco.seletorExibido).slice(0, 3)).toEqual(["#titulo", "h1", "h1"]);
    expect(resultado.proprios.slice(2).every((bloco) => bloco.folha?.origem === "navegador")).toBe(true);
  });

  it("empate de especificidade: a que vem depois na folha vence", () => {
    const documento = pagina(".a { color: red; }\n.b { color: blue; }", '<p class="a b">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, ".b", "color")).toBe("vence");
    expect(situacao(resultado, ".a", "color")).toBe("perdeu");
  });

  it("a mesma propriedade repetida na regra: a última vence", () => {
    const documento = pagina("p { color: red; color: blue; }", "<p>x</p>");
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "color", 0)).toBe("perdeu");
    expect(situacao(resultado, "p", "color", 1)).toBe("vence");
  });

  it("!important passa na frente da especificidade, e inline vence regras normais", () => {
    const documento = pagina("#x { color: green; }\np { color: red !important; }", '<p id="x" style="color: purple">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "color")).toBe("vence");
    expect(situacao(resultado, "#x", "color")).toBe("perdeu");
    expect(situacao(resultado, "element.style", "color")).toBe("perdeu");
    expect(resultado.proprios[0].seletorExibido).toBe("element.style");

    const semImportante = pagina("#x { color: green; }", '<p id="x" style="color: purple">x</p>');
    expect(valor(semImportante, "p", "color")).toBe("purple");
  });

  it("!important inline vence !important de regra", () => {
    const documento = pagina("#x { color: green !important; }", '<p id="x" style="color: purple !important">x</p>');
    expect(valor(documento, "p", "color")).toBe("purple");
  });

  it("valor inválido é jogado fora (riscado) e a anterior continua valendo", () => {
    const documento = pagina("p { color: red; color: vermelho; }", "<p>x</p>");
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "color", 0)).toBe("vence");
    expect(situacao(resultado, "p", "color", 1)).toBe("invalida");
    expect(valor(documento, "p", "color")).toBe("red");
  });

  it("declaração desligada (comentada) não conta e aparece desligada", () => {
    const documento = pagina("p { color: red; }\n.a { /* color: blue; */ }", '<p class="a">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, ".a", "color")).toBe("desligada");
    expect(situacao(resultado, "p", "color")).toBe("vence");
  });

  it("a folha do navegador perde para o autor (h1 do site troca o tamanho)", () => {
    const documento = pagina("h1 { font-size: 30px; margin-top: 0; }", "<h1>Oi</h1>");
    const resultado = calcularCascata(elemento(documento, "h1"));
    const doNavegador = resultado.proprios.find((bloco) => bloco.folha?.origem === "navegador" && bloco.seletorExibido === "h1");
    expect(doNavegador?.declaracoes.find((item) => item.declaracao.propriedade === "font-size")?.situacao).toBe("perdeu");
    expect(doNavegador?.declaracoes.find((item) => item.declaracao.propriedade === "font-weight")?.situacao).toBe("vence");
    expect(valor(documento, "h1", "font-weight")).toBe("bold");
  });

  it("regra sob @media vale quando a condição vale e o motor consegue avaliar", () => {
    const documento = pagina("p { color: red; }\n@media (max-width: 1px) { p { color: blue; } }", "<p>x</p>");
    // No jsdom não há matchMedia: o motor não tem certeza e não risca.
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "color", 0)).not.toBe("perdeu");
    expect(valor(documento, "p", "color")).toMatch(/^incerto/);
  });

  it("pseudo-classes de estado (hover) não contam", () => {
    const documento = pagina("a { color: red; }\na:hover { color: blue; }", '<a href="#">x</a>');
    const resultado = calcularCascata(elemento(documento, "a"));
    expect(resultado.proprios.some((bloco) => bloco.seletorExibido === "a:hover")).toBe(false);
    expect(valor(documento, "a", "color")).toBe("red");
  });

  it("lista de seletores: a especificidade é a do seletor que casa", () => {
    const documento = pagina("h1, #x { color: red; }\n.y { color: blue; }", '<p id="x" class="y">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    const regra = resultado.proprios.find((bloco) => bloco.seletorExibido === "h1, #x");
    expect(regra?.especificidade).toEqual([1, 0, 0]);
    expect(regra?.seletores.map((seletor) => seletor.casa)).toEqual([false, true]);
    expect(valor(documento, "p", "color")).toBe("red");
  });
});

describe("cascata: atalhos", () => {
  it("uma longa depois do atalho derruba só a parte dela", () => {
    const documento = pagina("p { margin: 10px; margin-top: 0; }", "<p>x</p>");
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "margin")).toBe("vence");
    expect(situacao(resultado, "p", "margin-top")).toBe("vence");
    const margem = resultado.proprios[0].declaracoes.find((item) => item.declaracao.propriedade === "margin");
    expect(margem?.longas.find((longa) => longa.propriedade === "margin-top")?.situacao).toBe("perdeu");
    expect(margem?.longas.find((longa) => longa.propriedade === "margin-left")?.situacao).toBe("vence");
    expect(valor(documento, "p", "margin-top")).toBe("0");
    expect(valor(documento, "p", "margin-left")).toBe("10px");
  });

  it("um atalho depois da longa derruba a longa inteira", () => {
    const documento = pagina("p { padding-left: 4px; padding: 8px; }", "<p>x</p>");
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "padding-left")).toBe("perdeu");
    expect(situacao(resultado, "p", "padding")).toBe("vence");
    expect(valor(documento, "p", "padding-left")).toBe("8px");
  });

  it("atalho riscado quando todas as partes perdem", () => {
    const documento = pagina(".a { border: 1px solid red; }\n#b { border: 2px dashed blue; }", '<div class="a" id="b">x</div>');
    const resultado = calcularCascata(elemento(documento, "div"));
    expect(situacao(resultado, ".a", "border")).toBe("perdeu");
    expect(situacao(resultado, "#b", "border")).toBe("vence");
    expect(valor(documento, "div", "border-top-style")).toBe("dashed");
  });

  it("background, font, gap, flex e inset contra as longas", () => {
    const documento = pagina(
      ".c { background: #fff; background-color: black; font: 16px Arial; font-weight: bold; gap: 4px; column-gap: 9px; flex: 1; flex-basis: 50px; inset: 0; left: 5px; }",
      '<div class="c">x</div>',
    );
    expect(valor(documento, ".c", "background-color")).toBe("black");
    expect(valor(documento, ".c", "background-image")).toBe("none");
    expect(valor(documento, ".c", "font-weight")).toBe("bold");
    expect(valor(documento, ".c", "font-family")).toBe("Arial");
    expect(valor(documento, ".c", "row-gap")).toBe("4px");
    expect(valor(documento, ".c", "column-gap")).toBe("9px");
    expect(valor(documento, ".c", "flex-grow")).toBe("1");
    expect(valor(documento, ".c", "flex-basis")).toBe("50px");
    expect(valor(documento, ".c", "top")).toBe("0");
    expect(valor(documento, ".c", "left")).toBe("5px");
  });

  it("valor efetivo de um atalho vem por longa", () => {
    const documento = pagina("p { margin: 1px 2px; }", "<p>x</p>");
    const efetivo = valorEfetivo(elemento(documento, "p"), "margin");
    expect(Object.keys(efetivo)).toEqual(["margin-top", "margin-right", "margin-bottom", "margin-left"]);
    expect(efetivo["margin-right"]).toMatchObject({ tipo: "valor", valor: "2px" });
  });
});

describe("cascata: herança", () => {
  it("herda do ancestral mais perto; o do mais longe fica riscado", () => {
    const documento = pagina("body { color: gray; font-family: Arial; }\nmain { color: navy; }", "<main><p>x</p></main>");
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(valor(documento, "p", "color")).toBe("navy");
    expect(valor(documento, "p", "font-family")).toBe("Arial");
    expect(situacao(resultado, "main", "color")).toBe("vence");
    expect(situacao(resultado, "body", "color")).toBe("perdeu");
    expect(situacao(resultado, "body", "font-family")).toBe("vence");
    expect(resultado.herdados.map((grupo) => grupo.elemento.tagName.toLowerCase())).toEqual(["main", "body"]);
  });

  it("a declaração própria vence a herdada, mesmo menos específica", () => {
    const documento = pagina("#pai { color: red; }\np { color: blue; }", '<div id="pai"><p>x</p></div>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(valor(documento, "p", "color")).toBe("blue");
    expect(situacao(resultado, "#pai", "color")).toBe("perdeu");
  });

  it("só as herdadas aparecem nas seções de herança", () => {
    const documento = pagina("div { color: red; padding: 10px; }", "<div><p>x</p></div>");
    const resultado = calcularCascata(elemento(documento, "p"));
    const herdado = resultado.herdados[0].blocos.find((bloco) => bloco.seletorExibido === "div");
    expect(herdado?.declaracoes.map((item) => item.declaracao.propriedade)).toEqual(["color"]);
    expect(valor(documento, "p", "padding-top")).toBe("0");
  });

  it("inherit pega o valor do pai; a folha do navegador ganha da herança (h1 em negrito)", () => {
    const documento = pagina("body { font-weight: 300; }\n.x { border-top-color: inherit; }\nsection { border-top-color: red; }", '<section><h1 class="x">x</h1></section>');
    expect(valor(documento, "h1", "font-weight")).toBe("bold");
    expect(valor(documento, "h1", "border-top-color")).toBe("red");
  });

  it("var() é resolvida pelas variáveis herdadas", () => {
    const documento = pagina(":root { --marca: #c0392b; }\nh1 { color: var(--marca); }\np { color: var(--nada, green); }", "<h1>x</h1><p>y</p>");
    expect(valor(documento, "h1", "color")).toBe("#c0392b");
    expect(valor(documento, "p", "color")).toBe("green");
  });
});

describe("cascata: não sei, não risca", () => {
  it("valor que o motor não conhece no topo: nada abaixo fica riscado e o valor é incerto", () => {
    const documento = pagina("p { box-shadow: 0 1px 2px black; }\n.a { box-shadow: none; }\np.a { box-shadow: 1px 1px 3px 2px rgb(0 0 0 / 40%); }", '<p class="a">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p.a", "box-shadow")).not.toBe("vence");
    expect(situacao(resultado, ".a", "box-shadow")).not.toBe("perdeu");
    expect(situacao(resultado, "p", "box-shadow")).not.toBe("perdeu");
    expect(valor(documento, "p", "box-shadow")).toMatch(/^incerto/);
  });

  it("lógica misturada com física: não risca nenhuma das duas", () => {
    const documento = pagina("p { margin-left: 4px; }\n.a { margin-inline-start: 8px; }", '<p class="a">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(situacao(resultado, "p", "margin-left")).not.toBe("perdeu");
    expect(situacao(resultado, ".a", "margin-inline-start")).not.toBe("perdeu");
    expect(valor(documento, "p", "margin-left")).toMatch(/^incerto/);
  });

  it("folha com @layer: nada é riscado", () => {
    const documento = pagina("@layer base { p { color: red; } }\np { color: blue; }\n.a { color: green; }", '<p class="a">x</p>');
    const resultado = calcularCascata(elemento(documento, "p"));
    expect(resultado.incerta).toContain("@layer");
    expect(situacao(resultado, "p", "color")).not.toBe("perdeu");
    expect(valor(documento, "p", "color")).toMatch(/^incerto/);
  });

  it("atalho que o motor não sabe separar: não inventa o valor", () => {
    const documento = pagina("div { background: url(x.png) center / cover no-repeat; }", "<div>x</div>");
    expect(valor(documento, "div", "background-size")).toMatch(/^incerto/);
  });
});

describe("edições no texto da folha", () => {
  const css = "h1 {\n  color: red;\n  font-size: 20px\n}\n\n.a {\n}\n";

  it("define propriedade: troca o valor que existe, ou acrescenta com o recuo da regra", () => {
    expect(definirPropriedadeNoTexto(css, "h1", "color", "blue")).toBe("h1 {\n  color: blue;\n  font-size: 20px\n}\n\n.a {\n}\n");
    expect(definirPropriedadeNoTexto(css, "h1", "text-align", "center")).toBe(
      "h1 {\n  color: red;\n  font-size: 20px;\n  text-align: center;\n}\n\n.a {\n}\n",
    );
    expect(definirPropriedadeNoTexto(css, ".a", "margin", "0")).toBe("h1 {\n  color: red;\n  font-size: 20px\n}\n\n.a {\n  margin: 0;\n}\n");
    expect(definirPropriedadeNoTexto(css, ".nao-existe", "margin", "0")).toBeNull();
  });

  it("liga e desliga com comentário, como o Chrome", () => {
    const desligado = alternarPropriedadeNoTexto(css, "h1", "color");
    expect(desligado).toContain("/* color: red; */");
    expect(analisarCss(desligado ?? "").regras[0].declaracoes[0].ativa).toBe(false);
    const ligado = alternarPropriedadeNoTexto(desligado ?? "", "h1", "color");
    expect(ligado).toBe(css);
  });

  it("acrescenta regra no fim e declaração numa regra de uma linha só", () => {
    const comRegra = adicionarRegraNoTexto(css, "p.destaque", [{ propriedade: "color", valor: "gold" }]);
    expect(comRegra?.texto.endsWith("p.destaque {\n  color: gold;\n}\n")).toBe(true);
    expect(comRegra?.indiceRegra).toBe(2);
    const umaLinha = adicionarDeclaracaoNoTexto("p { color: red }", 0, "margin", "0");
    expect(analisarCss(umaLinha?.texto ?? "").regras[0].declaracoes.map((item) => item.propriedade)).toEqual(["color", "margin"]);
  });

  it("remove a declaração e a linha dela", () => {
    expect(removerDeclaracao(css, { indiceRegra: 0, indiceDeclaracao: 0 })).toBe("h1 {\n  font-size: 20px\n}\n\n.a {\n}\n");
  });

  it("seletor da regra nova igual ao do Chrome", () => {
    const documento = pagina("", '<h1 id="t">x</h1><div class="card destaque">y</div><p class="nota">z</p><span>w</span>');
    expect(seletorSimples(elemento(documento, "h1"))).toBe("h1#t");
    expect(seletorSimples(elemento(documento, "div"))).toBe(".card.destaque");
    expect(seletorSimples(elemento(documento, "p"))).toBe("p.nota");
    expect(seletorSimples(elemento(documento, "span"))).toBe("span");
  });
});

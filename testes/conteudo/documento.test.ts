/*
 * Modo documento (o jogador edita o documento inteiro) e "Adicionar
 * atributo" pela árvore, sobre documentos soltos (jsdom), com o mesmo
 * núcleo e o mesmo executor de ações da interface.
 */
import { describe, expect, it } from "vitest";
import { FASE_BANCADA_DOCUMENTO } from "@/conteudo/laboratorio/bancadaDocumento";
import type { FasePratica } from "@/conteudo/tipos";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { lerAtributosDigitados } from "@/lib/atributosDigitados";
import {
  acentosQuebrados,
  criarDocumentoInteiroSolto,
  documentoInteiroInicial,
  serializarDocumentoInteiro,
} from "@/lib/documentoSiteAlvo";
import { chaveDoSeletor, filhosVisiveis, raizDaArvore } from "@/motor/chaveArvore";
import { criarSimulacao } from "@/motor/simulacao";

const TEXTO = documentoInteiroInicial(
  "<title>Meu cartão</title>",
  `<h1 id="nome">Cartão da Ana</h1>
<a href="https://exemplo.site">Portfólio</a>`,
);

describe("documento inteiro", () => {
  it("o texto inicial tem doctype, html com lang, head e body", () => {
    expect(TEXTO.startsWith("<!DOCTYPE html>\n<html lang=\"pt-BR\">\n<head>\n  <title>Meu cartão</title>\n</head>\n<body>")).toBe(true);
    expect(TEXTO.endsWith("</body>\n</html>")).toBe(true);
  });

  it("a árvore começa no <html>: head é 0, body é 1, e os estilos do jogo não aparecem", () => {
    const documento = criarDocumentoInteiroSolto(TEXTO, "h1 { color: red; }");
    expect(raizDaArvore(documento)).toBe(documento.documentElement);
    expect(chaveDoSeletor(documento, "head")).toBe("0");
    expect(chaveDoSeletor(documento, "title")).toBe("0.0");
    expect(chaveDoSeletor(documento, "h1")).toBe("1.0");
    expect(filhosVisiveis(documento.head).map((no) => (no as Element).tagName.toLowerCase())).toEqual(["title"]);
    // Mas estão lá: a folha editável vale na página.
    expect(documento.querySelectorAll("head style").length).toBe(2);
  });

  it("sem meta charset, a prévia quebra os acentos; o código e os validadores veem o texto certo", () => {
    const documento = criarDocumentoInteiroSolto(TEXTO);
    expect(acentosQuebrados(documento)).toBe(true);
    expect(documento.title).toBe("Meu cartÃ£o");
    expect(documento.querySelector("h1")?.textContent).toBe("CartÃ£o da Ana");
    const texto = serializarDocumentoInteiro(documento);
    expect(texto).toContain("<title>Meu cartão</title>");
    expect(texto).toContain("Cartão da Ana");
    expect(texto).not.toContain("data-jogo-injetado");
  });

  it("com meta charset, nada quebra", () => {
    const documento = criarDocumentoInteiroSolto(TEXTO.replace("<head>\n", '<head>\n  <meta charset="utf-8">\n'));
    expect(acentosQuebrados(documento)).toBe(false);
    expect(documento.title).toBe("Meu cartão");
  });
});

describe("modo documento na simulação (o mesmo núcleo da interface)", () => {
  const fase = FASE_BANCADA_DOCUMENTO;

  it("pôr o meta charset pelo código conserta os acentos na hora", () => {
    const sim = criarSimulacao(fase);
    expect(acentosQuebrados(sim.documento)).toBe(true);
    sim.executar([{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }]);
    expect(acentosQuebrados(sim.documento)).toBe(false);
    expect(sim.documento.querySelector("h1")?.textContent).toBe("Cartão de visita");
    expect(sim.avaliar({ tipo: "existe", seletor: "head > meta[charset]" }).passou).toBe(true);
  });

  it("tituloDaAba olha o <title> (o texto de verdade, mesmo com a prévia quebrada)", () => {
    const sim = criarSimulacao(fase);
    expect(sim.avaliar({ tipo: "tituloDaAba", valor: "Meu cartão" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "textoIgual", seletor: "h1", valor: "Cartão de visita" }).passou).toBe(true);
    sim.executar([{ tipo: "definirTexto", seletor: "title", valor: "Cartão da Ana" }]);
    expect(sim.avaliar({ tipo: "tituloDaAba", valor: "Cartão da Ana" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "tituloDaAba" }).passou).toBe(true);
    sim.executar([{ tipo: "apagar", seletor: "title" }]);
    expect(sim.avaliar({ tipo: "tituloDaAba" })).toMatchObject({ passou: false, detalhe: "a página não tem <title>" });
  });

  it("desfazer volta o head, os atributos do html e os acentos", () => {
    const sim = criarSimulacao(fase);
    const antes = sim.htmlAtual();
    sim.executar([{ tipo: "definirAtributo", seletor: "html", nome: "lang", valor: "en" }]);
    sim.executar([{ tipo: "inserirHTML", seletor: "head", posicao: "inicio", html: '<meta charset="utf-8">' }]);
    expect(acentosQuebrados(sim.documento)).toBe(false);
    sim.nucleo.desfazer();
    expect(acentosQuebrados(sim.documento)).toBe(true);
    expect(sim.documento.querySelectorAll("head style[data-jogo-injetado]").length).toBe(1);
    sim.nucleo.desfazer();
    expect(sim.documento.documentElement.getAttribute("lang")).toBe("pt-BR");
    expect(sim.htmlAtual()).toBe(antes);
    sim.nucleo.refazer();
    expect(sim.documento.documentElement.getAttribute("lang")).toBe("en");
  });

  it("o texto do editor no modo documento é a página inteira", () => {
    const sim = criarSimulacao(fase);
    expect(sim.htmlAtual().startsWith("<!DOCTYPE html>\n<html lang=\"pt-BR\"><head>")).toBe(true);
  });
});

describe("adicionar atributo", () => {
  it("lê o que o jogador escreve como atributos de tag", () => {
    expect(lerAtributosDigitados('target="_blank"')).toEqual([{ nome: "target", valor: "_blank" }]);
    expect(lerAtributosDigitados("target=_blank rel='noopener'")).toEqual([
      { nome: "target", valor: "_blank" },
      { nome: "rel", valor: "noopener" },
    ]);
    expect(lerAtributosDigitados('alt="Foto da banda"')).toEqual([{ nome: "alt", valor: "Foto da banda" }]);
    expect(lerAtributosDigitados("hidden")).toEqual([{ nome: "hidden", valor: "" }]);
    expect(lerAtributosDigitados("   ")).toEqual([]);
    expect(lerAtributosDigitados('"sem nome"')).toEqual([]);
  });

  it("a ação cria o atributo, gera adicionouAtributo e entra no desfazer", () => {
    const sim = criarSimulacao(FASE_BANCADA_DOCUMENTO);
    sim.comecarObjetivo(null);
    sim.executar([{ tipo: "adicionarAtributo", seletor: "a", nome: "target", valor: "_blank" }]);
    expect(sim.documento.querySelector("a")?.getAttribute("target")).toBe("_blank");
    expect(sim.avaliar({ tipo: "evento", evento: "adicionouAtributo" }).passou).toBe(true);
    sim.nucleo.desfazer();
    expect(sim.documento.querySelector("a")?.hasAttribute("target")).toBe(false);
  });

  it("vários de uma vez (uma foto só); nome inválido é ignorado", () => {
    const sim = criarSimulacao(FASE_BANCADA_DOCUMENTO);
    // No modo documento, o caminho começa no <html>: body é 1, o link é o terceiro filho dele.
    const caminho = [1, 2];
    expect(sim.nucleo.adicionarAtributos(caminho, [{ nome: "target", valor: "_blank" }, { nome: "rel", valor: "noopener" }, { nome: "9x", valor: "" }])).toBe(true);
    const link = sim.documento.querySelector("a");
    expect(link?.getAttribute("rel")).toBe("noopener");
    expect(link?.hasAttribute("9x")).toBe(false);
    sim.nucleo.desfazer();
    expect(sim.documento.querySelector("a")?.hasAttribute("target")).toBe(false);
    expect(sim.documento.querySelector("a")?.hasAttribute("rel")).toBe(false);
  });
});

describe("checagens do modo documento", () => {
  function problemas(fase: FasePratica): string[] {
    const contexto = { unidades: [], fases: [fase] };
    return REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(fase, contexto)));
  }

  it("a bancada do documento passa em todas as regras de fase", () => {
    expect(problemas(FASE_BANCADA_DOCUMENTO)).toEqual([]);
  });

  it("sabotagem: tituloDaAba numa fase sem modoDocumento", () => {
    const semModo: FasePratica = { ...FASE_BANCADA_DOCUMENTO, modoDocumento: undefined };
    expect(problemas(semModo).join("\n")).toContain("validador tituloDaAba numa fase sem modoDocumento");
  });

  it("sabotagem: adicionarAtributo sem a ferramenta em usaFerramentas", () => {
    const sabotada = { ...FASE_BANCADA_DOCUMENTO, usaFerramentas: FASE_BANCADA_DOCUMENTO.usaFerramentas.filter((id) => id !== "adicionar-atributo") };
    expect(problemas(sabotada).join("\n")).toContain('usa a ferramenta "adicionar-atributo", que não está em usaFerramentas');
  });
});

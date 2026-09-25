/*
 * As setas nos números do painel Estilos (como no Chrome) e a edição do
 * estilo inline com as funções da folha.
 */
import { describe, expect, it } from "vitest";
import { incrementarNumero, passoDaTecla } from "@/componentes/painel/estilos/numeros";
import { adicionarDeclaracaoNoTexto, alternarDeclaracaoNoTexto, editarEstiloInlineNoTexto, trocarValor } from "@/motor/css/editarCss";

const tecla = (key: string, extra: Partial<{ shiftKey: boolean; altKey: boolean; ctrlKey: boolean; metaKey: boolean }> = {}) => ({
  key,
  shiftKey: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  ...extra,
});

describe("setas numéricas", () => {
  it("o passo segue o Chrome", () => {
    expect(passoDaTecla(tecla("ArrowUp"))).toEqual({ base: 1, direcao: 1 });
    expect(passoDaTecla(tecla("ArrowDown", { shiftKey: true }))).toEqual({ base: 10, direcao: -1 });
    expect(passoDaTecla(tecla("ArrowUp", { altKey: true }))).toEqual({ base: 0.1, direcao: 1 });
    expect(passoDaTecla(tecla("PageUp", { ctrlKey: true, shiftKey: true }))).toEqual({ base: 100, direcao: 1 });
    expect(passoDaTecla(tecla("ArrowUp", { shiftKey: true, metaKey: true }))).toEqual({ base: 100, direcao: 1 });
    expect(passoDaTecla(tecla("PageUp"))).toBeNull();
    expect(passoDaTecla(tecla("a"))).toBeNull();
  });

  it("mexe no número do cursor e mantém a unidade", () => {
    expect(incrementarNumero("32px", 1, { base: 1, direcao: 1 })).toEqual({ valor: "33px", cursor: 2 });
    expect(incrementarNumero("10px 20px", 7, { base: 10, direcao: -1 })?.valor).toBe("10px 10px");
    expect(incrementarNumero("10px 20px", 0, { base: 1, direcao: 1 })?.valor).toBe("11px 20px");
    expect(incrementarNumero("1.5", 0, { base: 0.1, direcao: 1 })?.valor).toBe("1.6");
  });

  it("entre -1 e 1 a seta anda 0,1", () => {
    expect(incrementarNumero("0.5em", 0, { base: 1, direcao: 1 })?.valor).toBe("0.6em");
    expect(incrementarNumero("0", 0, { base: 1, direcao: -1 })?.valor).toBe("-0.1");
    expect(incrementarNumero("0.3", 0, { base: 0.1, direcao: -1 })?.valor).toBe("0.2");
  });

  it("não mexe em números que são parte de um nome", () => {
    expect(incrementarNumero("#f00", 2, { base: 1, direcao: 1 })).toBeNull();
    expect(incrementarNumero("red", 0, { base: 1, direcao: 1 })).toBeNull();
    expect(incrementarNumero("var(--espaco2)", 3, { base: 1, direcao: 1 })).toBeNull();
  });
});

describe("estilo inline com as funções da folha", () => {
  it("troca valor, liga e desliga e acrescenta, numa linha só", () => {
    const estilo = "color: red; font-size: 20px";
    expect(editarEstiloInlineNoTexto(estilo, (css) => trocarValor(css, { indiceRegra: 0, indiceDeclaracao: 1 }, "22px"))).toBe(
      "color: red; font-size: 22px",
    );
    expect(editarEstiloInlineNoTexto(estilo, (css) => alternarDeclaracaoNoTexto(css, { indiceRegra: 0, indiceDeclaracao: 0 }))).toBe(
      "/* color: red; */ font-size: 20px",
    );
    expect(editarEstiloInlineNoTexto(estilo, (css) => adicionarDeclaracaoNoTexto(css, 0, "margin", "0")?.texto ?? null)).toBe(
      "color: red; font-size: 20px; margin: 0;",
    );
    expect(editarEstiloInlineNoTexto("", (css) => adicionarDeclaracaoNoTexto(css, 0, "color", "blue")?.texto ?? null)).toBe("color: blue;");
  });
});

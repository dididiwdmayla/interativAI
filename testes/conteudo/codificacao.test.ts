/*
 * A simulação do acento quebrado (modo documento sem meta charset).
 */
import { describe, expect, it } from "vitest";
import { consertarAcentos, quebrarAcentos, temCharset } from "@/lib/codificacao";

describe("acento quebrado (simulação)", () => {
  it("quebra como o navegador que lê UTF-8 como Windows-1252", () => {
    expect(quebrarAcentos("Cartão de visita")).toBe("CartÃ£o de visita");
    expect(quebrarAcentos("café")).toBe("cafÃ©");
    expect(quebrarAcentos("ação")).toBe("aÃ§Ã£o");
    expect(quebrarAcentos("sem acento")).toBe("sem acento");
  });

  it("volta igual (as duas funções são inversas)", () => {
    for (const texto of ["Cartão de visita", "Olá, João! Açaí é ótimo.", "ÁÍÓÚ àèìòù ç Ç ñ", "“aspas” — travessão €"]) {
      expect(consertarAcentos(quebrarAcentos(texto))).toBe(texto);
    }
    expect(consertarAcentos("texto normal ç")).toBe("texto normal ç");
  });

  it("acha o meta charset (e o http-equiv antigo)", () => {
    const doc = (head: string) => new DOMParser().parseFromString(`<html><head>${head}</head><body></body></html>`, "text/html");
    expect(temCharset(doc('<meta charset="utf-8">'))).toBe(true);
    expect(temCharset(doc('<meta http-equiv="Content-Type" content="text/html; charset=utf-8">'))).toBe(true);
    expect(temCharset(doc("<title>x</title>"))).toBe(false);
  });
});

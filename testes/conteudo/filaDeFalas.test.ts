/*
 * A fila de falas do computadorzinho (src/motor/filaDeFalas.ts): a importante
 * espera o jogador, a automática espera a vez e a pedida entra na hora.
 */
import { describe, expect, it } from "vitest";
import { avancarFila, enfileirarFala, enfileirarFalas, type EstadoDaFala, falaDaPausa, filaPedeJogador, trocarFala } from "@/motor/filaDeFalas";
import type { Fala } from "@/motor/tipos";

const fala = (texto: string): Fala => ({ texto, expressao: "feliz" });
const inicio: EstadoDaFala = { fala: fala("enunciado"), falaAguarda: false, filaFalas: [] };

describe("fila de falas do computadorzinho", () => {
  it("fala automática entra na hora quando nada espera o jogador", () => {
    const estado = enfileirarFala(inicio, fala("Isso! Parte feita: A"));
    expect(estado.fala.texto).toBe("Isso! Parte feita: A");
    expect(estado.falaAguarda).toBe(false);
    expect(filaPedeJogador(estado)).toBe(false);
  });

  it("a fala importante segura as automáticas até o jogador continuar", () => {
    const importante = enfileirarFala(inicio, fala("Ops! Tropecei e apaguei o rodapé."), true);
    const comFila = enfileirarFalas(importante, [
      { fala: fala("Desfaça o esbarrão"), aguarda: false },
      { fala: fala("Os acentos quebraram"), aguarda: true },
    ]);
    expect(comFila.fala.texto).toBe("Ops! Tropecei e apaguei o rodapé.");
    expect(comFila.filaFalas.map((item) => item.fala.texto)).toEqual(["Desfaça o esbarrão", "Os acentos quebraram"]);
    expect(filaPedeJogador(comFila)).toBe(true);
    const enunciado = avancarFila(comFila);
    expect(enunciado.fala.texto).toBe("Desfaça o esbarrão");
    expect(enunciado.falaAguarda).toBe(false);
    // Com fila atrás, o Continuar continua na tela.
    expect(filaPedeJogador(enunciado)).toBe(true);
    const aviso = avancarFila(enunciado);
    expect(aviso.fala.texto).toBe("Os acentos quebraram");
    expect(aviso.falaAguarda).toBe(true);
    // Sem fila, Continuar só tira a espera: a fala continua na tela.
    const lida = avancarFila(aviso);
    expect(lida.fala.texto).toBe("Os acentos quebraram");
    expect(filaPedeJogador(lida)).toBe(false);
  });

  it("a fala que o jogador pede entra na hora e a fila continua", () => {
    const importante = enfileirarFalas(inicio, [
      { fala: fala("A"), aguarda: true },
      { fala: fala("B"), aguarda: true },
    ]);
    const resposta = trocarFala(importante, fala("resposta do tutor"));
    expect(resposta.fala.texto).toBe("resposta do tutor");
    expect(resposta.falaAguarda).toBe(false);
    expect(resposta.filaFalas.map((item) => item.fala.texto)).toEqual(["B"]);
  });

  it("a pausa toma a cena, espera o jogador e leva a fila que saiu de moda", () => {
    const comFila = enfileirarFalas(inicio, [
      { fala: fala("o que o roteiro contou"), aguarda: true },
      { fala: fala("o enunciado"), aguarda: false },
    ]);
    const pausa = falaDaPausa(comFila, fala("Isso! Objetivo concluído."));
    expect(pausa.fala.texto).toBe("Isso! Objetivo concluído.");
    expect(pausa.falaAguarda).toBe(true);
    expect(pausa.filaFalas).toEqual([]);
  });

  it("a mesma fala duas vezes seguidas não entra de novo na fila", () => {
    const importante = enfileirarFala(inicio, fala("A"), true);
    const repetida = enfileirarFala(enfileirarFala(importante, fala("B"), true), fala("B"), true);
    expect(repetida.filaFalas).toHaveLength(1);
  });
});

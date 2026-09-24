/*
 * Migração do progresso v1 para a v2: nada que o jogador fez pode sumir.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  CHAVE_PROGRESSO,
  CHAVE_PROGRESSO_V1,
  lerProgressoDoArmazenamento,
  migrarProgressoV1,
} from "@/lib/progresso";

const V1 = {
  versao: 1,
  fasesConcluidas: ["sites-elementos-1"],
  estrelasPorFase: { "sites-elementos-1": 2 },
  fasesEmAndamento: {
    "sites-elementos-1": { objetivoAtual: 2, htmlAtual: "<h1>Oi</h1>", estrelas: 2, introducaoVista: true },
  },
  tema: "fliperama",
  temasDesbloqueados: ["doce", "fliperama", "segredo"],
  som: false,
  missoesDeCampo: { "sites-elementos-1": true },
  apresentacoesVistas: ["painel", "previa", "arvore"],
  proporcaoPrevia: 0.5,
};

describe("progresso v1 para v2", () => {
  beforeEach(() => localStorage.clear());

  it("renomeia a Fase 1 e mantém tudo", () => {
    const v2 = migrarProgressoV1(V1);
    expect(v2.versao).toBe(2);
    expect(v2.fasesConcluidas).toEqual(["sites-elementos-u1-f1"]);
    expect(v2.estrelasPorFase).toEqual({ "sites-elementos-u1-f1": 2 });
    expect(v2.missoesDeCampo).toEqual({ "sites-elementos-u1-f1": true });
    expect(v2.fasesEmAndamento["sites-elementos-u1-f1"]).toMatchObject({
      objetivoAtual: 2,
      htmlAtual: "<h1>Oi</h1>",
      estrelas: 2,
      introducaoVista: true,
      metaVista: true,
      partesFeitas: [],
      reveres: 0,
    });
    expect(v2.faseAtual).toBe("sites-elementos-u1-f1");
    expect(v2.tema).toBe("fliperama");
    expect(v2.temasDesbloqueados).toContain("segredo");
    expect(v2.som).toBe(false);
    expect(v2.apresentacoesVistas).toEqual(["painel", "previa", "arvore"]);
    expect(v2.proporcaoPrevia).toBe(0.5);
  });

  it("lê a v1 do localStorage, grava a v2 e deixa a v1 intacta", () => {
    localStorage.setItem(CHAVE_PROGRESSO_V1, JSON.stringify(V1));
    const lido = lerProgressoDoArmazenamento();
    expect(lido.fasesEmAndamento["sites-elementos-u1-f1"]?.htmlAtual).toBe("<h1>Oi</h1>");
    expect(JSON.parse(localStorage.getItem(CHAVE_PROGRESSO) ?? "null").versao).toBe(2);
    expect(JSON.parse(localStorage.getItem(CHAVE_PROGRESSO_V1) ?? "null")).toEqual(V1);
  });

  it("com v2 salva, a v1 é ignorada", () => {
    localStorage.setItem(CHAVE_PROGRESSO_V1, JSON.stringify(V1));
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify({ versao: 2, tema: "doce", faseAtual: "outra" }));
    expect(lerProgressoDoArmazenamento().faseAtual).toBe("outra");
  });

  it("lixo no armazenamento vira o progresso padrão", () => {
    localStorage.setItem(CHAVE_PROGRESSO, "{quebrado");
    localStorage.setItem(CHAVE_PROGRESSO_V1, "também quebrado");
    expect(lerProgressoDoArmazenamento().versao).toBe(2);
  });
});

/*
 * Migração do progresso v1 para a v2: nada que o jogador fez pode sumir.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { FASES, UNIDADES } from "@/conteudo";
import { faseAbreComMeta } from "@/lib/metaDaUnidade";
import {
  CHAVE_PROGRESSO,
  CHAVE_PROGRESSO_V1,
  lerProgressoDoArmazenamento,
  migrarProgressoV1,
  normalizarProgresso,
  PROGRESSO_PADRAO,
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
    expect(v2.metasVistas).toEqual([]);
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

describe("meta da unidade: uma vez só na entrada, sempre no desafio", () => {
  const [u1] = UNIDADES;
  const primeira = FASES.find((fase) => fase.id === u1.fases[0]);
  const segunda = FASES.find((fase) => fase.id === u1.fases[1]);
  const desafio = FASES.find((fase) => fase.id === u1.meta.desafioId);
  if (!primeira || !segunda || !desafio) throw new Error("Unidade 1 incompleta");

  it("sem progresso nenhum, a primeira fase abre com a meta", () => {
    expect(faseAbreComMeta(primeira, u1, PROGRESSO_PADRAO)).toBe(true);
    expect(faseAbreComMeta(segunda, u1, PROGRESSO_PADRAO)).toBe(false);
  });

  it("depois de vista (metasVistas), não aparece de novo, nem recomeçando a fase", () => {
    expect(faseAbreComMeta(primeira, u1, { ...PROGRESSO_PADRAO, metasVistas: [u1.id] })).toBe(false);
  });

  it("com progresso na unidade (jogador antigo), não aparece", () => {
    const antigo = normalizarProgresso({
      versao: 2,
      fasesEmAndamento: {
        [primeira.id]: { objetivoAtual: 1, htmlAtual: null, estrelas: 3, introducaoVista: true },
      },
    });
    expect(antigo.metasVistas).toEqual([]);
    expect(faseAbreComMeta(primeira, u1, antigo)).toBe(false);
    const concluiu = { ...PROGRESSO_PADRAO, fasesConcluidas: [segunda.id] };
    expect(faseAbreComMeta(primeira, u1, concluiu)).toBe(false);
  });

  it("fase aberta só até a meta (recarregou nela) ainda não conta como progresso", () => {
    const soMeta = normalizarProgresso({
      versao: 2,
      fasesEmAndamento: {
        [primeira.id]: { objetivoAtual: 0, htmlAtual: null, estrelas: 3, introducaoVista: false, metaVista: false },
      },
    });
    expect(faseAbreComMeta(primeira, u1, soMeta)).toBe(true);
  });

  it("no desafio, a meta continua aparecendo", () => {
    expect(faseAbreComMeta(desafio, u1, { ...PROGRESSO_PADRAO, metasVistas: [u1.id], fasesConcluidas: [...u1.fases] })).toBe(true);
  });
});

/*
 * Regras do mapa das ilhas (src/lib/mapa.ts): desbloqueio de ilhas, zonas
 * e unidades, a partir do currículo, do conteúdo e do progresso.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, ilhaDoId } from "@/curriculo";
import type { IlhaCurriculo } from "@/curriculo/tipos";
import {
  acaoDaUnidade,
  estadoDaIlha,
  estadoDaUnidade,
  ilhaAtual,
  pontoAtual,
  totalDeEstrelas,
  zonaAberta,
} from "@/lib/mapa";
import { PROGRESSO_PADRAO, type Progresso } from "@/lib/progresso";

const [U1, U2, U3, U4, U5, E1] = UNIDADES;
const ilha = (id: string): IlhaCurriculo => {
  const achada = ilhaDoId(id);
  if (!achada) throw new Error(id);
  return achada;
};
const SITES = ilha("sites");
const ELEMENTOS = SITES.zonas[0];
const ESTILOS = SITES.zonas[1];
const item = (id: string) => {
  const achado = ELEMENTOS.unidades.find((unidade) => unidade.id === id);
  if (!achado) throw new Error(id);
  return achado;
};
const concluiu = (...unidades: Unidade[]): Progresso => ({
  ...PROGRESSO_PADRAO,
  fasesConcluidas: unidades.flatMap((unidade) => unidade.fases),
  estrelasPorFase: Object.fromEntries(unidades.flatMap((unidade) => unidade.fases.map((id) => [id, 3]))),
});

/** Conteúdo de mentirinha para a Lógica, só para testar o desbloqueio entre ilhas. */
const LOGICA_FALSA: Unidade = {
  ...U1,
  id: "logica-primeiros-comandos-u1",
  ilha: "Ilha Lógica",
  zona: "Primeiros comandos",
  titulo: "Primeiros comandos",
  fases: ["logica-primeiros-comandos-u1-f1"],
};

describe("ilhas", () => {
  it("do zero: Sites aberta, as sem unidade pronta em construção (Origens inclusive)", () => {
    const fonte = { progresso: PROGRESSO_PADRAO };
    expect(CURRICULO.map((item) => [item.id, estadoDaIlha(item, fonte)])).toEqual([
      ["origens", "construcao"],
      ["sites", "disponivel"],
      ["logica", "construcao"],
      ["paginas-vivas", "construcao"],
      ["rede-servidor", "construcao"],
      ["ia", "construcao"],
      ["oficio", "construcao"],
      ["frameworks", "construcao"],
    ]);
  });

  it("a ilha seguinte abre quando a anterior tem todas as unidades prontas concluídas", () => {
    const unidades = [...UNIDADES, LOGICA_FALSA];
    const logica = ilha("logica");
    expect(estadoDaIlha(logica, { progresso: PROGRESSO_PADRAO, unidades })).toBe("bloqueada");
    expect(estadoDaIlha(logica, { progresso: concluiu(U1, U2, U3, U4), unidades })).toBe("bloqueada");
    // A E1 (zona Estilos) também está pronta: a Lógica só abre depois dela.
    expect(estadoDaIlha(logica, { progresso: concluiu(U1, U2, U3, U4, U5), unidades })).toBe("bloqueada");
    expect(estadoDaIlha(logica, { progresso: concluiu(U1, U2, U3, U4, U5, E1), unidades })).toBe("disponivel");
  });

  it("o /lab/mapa desbloqueia tudo o que tem conteúdo", () => {
    const unidades = [...UNIDADES, LOGICA_FALSA];
    const progresso = { ...PROGRESSO_PADRAO, mapaDesbloqueado: true };
    expect(estadoDaIlha(ilha("logica"), { progresso, unidades })).toBe("disponivel");
    expect(estadoDaIlha(ilha("oficio"), { progresso, unidades })).toBe("construcao");
  });
});

describe("zonas e unidades", () => {
  it("do zero: U1 disponível, U2-U5 bloqueadas (já prontas), a U6 planejada (requer motor)", () => {
    const fonte = { progresso: PROGRESSO_PADRAO };
    expect(ELEMENTOS.unidades.map((unidade) => estadoDaUnidade(SITES, ELEMENTOS, unidade, fonte))).toEqual([
      "disponivel",
      "bloqueada",
      "bloqueada",
      "bloqueada",
      "bloqueada",
      "planejada",
    ]);
    expect(zonaAberta(SITES, ESTILOS, fonte)).toBe(false);
  });

  it("dentro da zona é em sequência; a zona seguinte abre com tudo pronto concluído", () => {
    const depoisU1 = { progresso: concluiu(U1) };
    expect(estadoDaUnidade(SITES, ELEMENTOS, item("sites-elementos-u1"), depoisU1)).toBe("concluida");
    expect(estadoDaUnidade(SITES, ELEMENTOS, item("sites-elementos-u2"), depoisU1)).toBe("disponivel");
    expect(zonaAberta(SITES, ESTILOS, depoisU1)).toBe(false);
    expect(zonaAberta(SITES, ESTILOS, { progresso: concluiu(U1, U2, U3, U4) })).toBe(false);
    expect(zonaAberta(SITES, ESTILOS, { progresso: concluiu(U1, U2, U3, U4, U5) })).toBe(true);
  });

  it("a E1 fica bloqueada até a zona Elementos acabar, e as outras de Estilos seguem planejadas", () => {
    const estados = (progresso: Progresso) => ESTILOS.unidades.map((unidade) => estadoDaUnidade(SITES, ESTILOS, unidade, { progresso }));
    expect(E1.id).toBe("sites-estilos-u1");
    expect(estados(concluiu(U1, U2, U3, U4))).toEqual(["bloqueada", "planejada", "planejada", "planejada", "planejada"]);
    expect(estados(concluiu(U1, U2, U3, U4, U5))).toEqual(["disponivel", "planejada", "planejada", "planejada", "planejada"]);
  });

  it("botão do card: Jogar, Continuar e Jogar de novo, abrindo a próxima fase não concluída", () => {
    expect(acaoDaUnidade(U1, PROGRESSO_PADRAO)).toEqual({ rotulo: "Jogar", faseId: U1.fases[0] });
    const noMeio: Progresso = { ...PROGRESSO_PADRAO, fasesConcluidas: [U1.fases[0]] };
    expect(acaoDaUnidade(U1, noMeio)).toEqual({ rotulo: "Continuar", faseId: U1.fases[1] });
    expect(acaoDaUnidade(U1, concluiu(U1))).toEqual({ rotulo: "Jogar de novo", faseId: U1.fases[0] });
  });

  it("o computadorzinho fica na ilha e no ponto certos", () => {
    expect(ilhaAtual({ progresso: PROGRESSO_PADRAO }).id).toBe("sites");
    expect(pontoAtual(SITES, { progresso: PROGRESSO_PADRAO }).id).toBe("sites-elementos-u1");
    const naU2: Progresso = { ...concluiu(U1), faseAtual: U2.fases[1] };
    expect(pontoAtual(SITES, { progresso: naU2 }).id).toBe("sites-elementos-u2");
    // Acabou a U1 e a fase atual ainda é dela: o ponto segue para a U2.
    expect(pontoAtual(SITES, { progresso: { ...concluiu(U1), faseAtual: U1.fases[2] } }).id).toBe("sites-elementos-u2");
    expect(pontoAtual(SITES, { progresso: concluiu(U1, U2) }).id).toBe("sites-elementos-u3");
    expect(pontoAtual(SITES, { progresso: concluiu(U1, U2, U3) }).id).toBe("sites-elementos-u4");
    expect(pontoAtual(SITES, { progresso: concluiu(U1, U2, U3, U4) }).id).toBe("sites-elementos-u5");
  });

  it("total de estrelas soma todas as fases", () => {
    expect(totalDeEstrelas(concluiu(U1, U2))).toBe(3 * (U1.fases.length + U2.fases.length));
  });
});

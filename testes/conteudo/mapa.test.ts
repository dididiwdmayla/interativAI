/*
 * Regras do mapa das ilhas (src/lib/mapa.ts): desbloqueio de ilhas, zonas
 * e unidades, a partir do currículo, do conteúdo e do progresso.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, ilhaDoId, localNoCurriculo } from "@/curriculo";
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

const [U1, U2, U3, U4, U5, U6, E1] = UNIDADES;
const ilha = (id: string): IlhaCurriculo => {
  const achada = ilhaDoId(id);
  if (!achada) throw new Error(id);
  return achada;
};
const SITES = ilha("sites");
const ELEMENTOS = SITES.zonas[0];
const ESTILOS = SITES.zonas[1];
/** As unidades prontas de Sites, na ordem do currículo (derivado: vale com qualquer zona pronta). */
const SITES_PRONTAS = UNIDADES.filter((unidade) => unidade.id.startsWith("sites-"));
/** As que contam para abrir a Lógica: sem as da zona opcional (Ser encontrado). */
const SITES_OBRIGATORIAS = SITES_PRONTAS.filter((unidade) => !localNoCurriculo(unidade.id)?.zona.opcional);
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
  it("do zero: Sites aberta, Lógica trancada (tem unidade pronta), as sem unidade pronta em construção (Origens inclusive)", () => {
    const fonte = { progresso: PROGRESSO_PADRAO };
    expect(CURRICULO.map((item) => [item.id, estadoDaIlha(item, fonte)])).toEqual([
      ["origens", "construcao"],
      ["sites", "disponivel"],
      ["logica", "bloqueada"],
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
    // Cada unidade pronta de Sites precisa acabar: com qualquer uma faltando, a Lógica segue bloqueada.
    for (let quantas = 0; quantas < SITES_OBRIGATORIAS.length; quantas += 1) {
      const progresso = concluiu(...SITES_OBRIGATORIAS.slice(0, quantas));
      expect(estadoDaIlha(logica, { progresso, unidades }), `com ${quantas} de ${SITES_OBRIGATORIAS.length}`).toBe("bloqueada");
    }
    // A zona opcional (Ser encontrado) não tranca: sem nenhuma unidade dela, a Lógica abre.
    expect(SITES_OBRIGATORIAS.length).toBeLessThan(SITES_PRONTAS.length);
    expect(estadoDaIlha(logica, { progresso: concluiu(...SITES_OBRIGATORIAS), unidades })).toBe("disponivel");
  });

  it("o /lab/mapa desbloqueia tudo o que tem conteúdo", () => {
    const unidades = [...UNIDADES, LOGICA_FALSA];
    const progresso = { ...PROGRESSO_PADRAO, mapaDesbloqueado: true };
    expect(estadoDaIlha(ilha("logica"), { progresso, unidades })).toBe("disponivel");
    expect(estadoDaIlha(ilha("oficio"), { progresso, unidades })).toBe("construcao");
  });
});

describe("zonas e unidades", () => {
  it("do zero: U1 disponível, U2-U6 bloqueadas (já prontas)", () => {
    const fonte = { progresso: PROGRESSO_PADRAO };
    expect(ELEMENTOS.unidades.map((unidade) => estadoDaUnidade(SITES, ELEMENTOS, unidade, fonte))).toEqual([
      "disponivel",
      "bloqueada",
      "bloqueada",
      "bloqueada",
      "bloqueada",
      "bloqueada",
    ]);
    expect(zonaAberta(SITES, ESTILOS, fonte)).toBe(false);
  });

  it("dentro da zona é em sequência; a zona seguinte abre com tudo pronto concluído", () => {
    const depoisU1 = { progresso: concluiu(U1) };
    expect(estadoDaUnidade(SITES, ELEMENTOS, item("sites-elementos-u1"), depoisU1)).toBe("concluida");
    expect(estadoDaUnidade(SITES, ELEMENTOS, item("sites-elementos-u2"), depoisU1)).toBe("disponivel");
    expect(zonaAberta(SITES, ESTILOS, depoisU1)).toBe(false);
    expect(zonaAberta(SITES, ESTILOS, { progresso: concluiu(U1, U2, U3, U4) })).toBe(false);
    // Falta a U6: a zona Estilos ainda não abre só com U1 a U5.
    expect(zonaAberta(SITES, ESTILOS, { progresso: concluiu(U1, U2, U3, U4, U5) })).toBe(false);
    expect(zonaAberta(SITES, ESTILOS, { progresso: concluiu(U1, U2, U3, U4, U5, U6) })).toBe(true);
  });

  it("a E1 fica bloqueada até a zona Elementos acabar, e as unidades da Estilos vão em sequência (planejadas ficam planejadas)", () => {
    const estados = (progresso: Progresso) => ESTILOS.unidades.map((unidade) => estadoDaUnidade(SITES, ESTILOS, unidade, { progresso }));
    const prontasEstilos = UNIDADES.filter((unidade) => ESTILOS.unidades.some((item) => item.id === unidade.id));
    expect(E1.id).toBe("sites-estilos-u1");
    /** O esperado, derivado do currículo: planejada, concluída, a primeira pronta não concluída disponível, o resto bloqueado. */
    const esperado = (zonaAberta: boolean, concluidas: number) => {
      let achouDisponivel = false;
      return ESTILOS.unidades.map((item) => {
        const indice = prontasEstilos.findIndex((unidade) => unidade.id === item.id);
        if (indice < 0) return "planejada";
        if (!zonaAberta) return "bloqueada";
        if (indice < concluidas) return "concluida";
        if (!achouDisponivel) {
          achouDisponivel = true;
          return "disponivel";
        }
        return "bloqueada";
      });
    };
    expect(estados(concluiu(U1, U2, U3, U4, U5))).toEqual(esperado(false, 0));
    for (let quantas = 0; quantas <= prontasEstilos.length; quantas += 1) {
      expect(estados(concluiu(U1, U2, U3, U4, U5, U6, ...prontasEstilos.slice(0, quantas))), `${quantas} concluídas`).toEqual(
        esperado(true, quantas),
      );
    }
  });

  it("desbloqueio permanente: uma unidade nova numa zona anterior não tranca de novo a zona já aberta", () => {
    // Quem já tinha aberto (ou concluído) a E1 antes de a U6 existir continua
    // com a zona Estilos aberta, mesmo sem ter jogado a U6 (registrada depois).
    const jaAbriuEstilosSemAU6: Progresso = { ...PROGRESSO_PADRAO, fasesConcluidas: [U1, U2, U3, U4, U5, E1].flatMap((u) => u.fases) };
    expect(zonaAberta(SITES, ESTILOS, { progresso: jaAbriuEstilosSemAU6 })).toBe(true);
    const itemE1 = ESTILOS.unidades.find((unidade) => unidade.id === E1.id);
    if (!itemE1) throw new Error("sites-estilos-u1 não está no currículo");
    expect(estadoDaUnidade(SITES, ESTILOS, itemE1, { progresso: jaAbriuEstilosSemAU6 })).not.toBe("bloqueada");

    // Só começar (sem concluir) alguma fase da E1 já basta pra manter aberta.
    const comecouEstilosSemAU6: Progresso = {
      ...PROGRESSO_PADRAO,
      fasesConcluidas: [U1, U2, U3, U4, U5].flatMap((u) => u.fases),
      fasesEmAndamento: {
        [E1.fases[0]]: {
          objetivoAtual: 0,
          htmlAtual: null,
          cssAtual: null,
          estrelas: 0,
          introducaoVista: true,
          metaVista: false,
          htmlInicioObjetivo: null,
          cssInicioObjetivo: null,
          previsaoRespondida: null,
          partesFeitas: [],
          reveres: 0,
          programa: null,
          circuito: null,
        },
      },
    };
    expect(zonaAberta(SITES, ESTILOS, { progresso: comecouEstilosSemAU6 })).toBe(true);
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

describe("zona opcional", () => {
  // Currículo de mentirinha: a ilha A tem uma zona opcional no meio; a B vem depois.
  const unidade = (id: string): Unidade => ({
    id,
    ilha: "Ilha A",
    zona: "z",
    numero: 1,
    titulo: id,
    meta: { enunciado: "meta" },
    fases: [`${id}-f1`],
  });
  const [A1, AOPC, A3, B1] = ["a-z1-u1", "a-opc-u1", "a-z3-u1", "b-z1-u1"].map(unidade);
  const zona = (id: string, u: Unidade, opcional?: true) => ({
    id,
    nome: id,
    icone: "elementos" as const,
    ...(opcional ? { opcional } : {}),
    unidades: [{ id: u.id, titulo: u.titulo, meta: "meta" }],
  });
  const A: IlhaCurriculo = { id: "a", nome: "A", zonas: [zona("z1", A1), zona("opc", AOPC, true), zona("z3", A3)] };
  const B: IlhaCurriculo = { id: "b", nome: "B", zonas: [zona("z1", B1)] };
  const fonte = (...feitas: Unidade[]) => ({
    progresso: concluiu(...feitas),
    unidades: [A1, AOPC, A3, B1],
    curriculo: [A, B],
  });

  it("a zona opcional abre como as outras, depois das obrigatórias de antes", () => {
    expect(zonaAberta(A, A.zonas[1], fonte())).toBe(false);
    expect(zonaAberta(A, A.zonas[1], fonte(A1))).toBe(true);
  });

  it("não tranca a zona seguinte nem a próxima ilha", () => {
    expect(zonaAberta(A, A.zonas[2], fonte(A1))).toBe(true);
    expect(estadoDaIlha(B, fonte(A1))).toBe("bloqueada");
    expect(estadoDaIlha(B, fonte(A1, A3))).toBe("disponivel");
  });

  it("no jogo de verdade, a zona Ser encontrado é opcional e fica no fim da Ilha Sites", () => {
    const ultima = SITES.zonas[SITES.zonas.length - 1];
    expect(ultima.id).toBe("ser-encontrado");
    expect(ultima.opcional).toBe(true);
    expect(SITES.zonas.filter((item) => item.opcional)).toHaveLength(1);
  });
});

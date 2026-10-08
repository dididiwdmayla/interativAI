/*
 * Regras do mapa das ilhas (src/lib/mapa.ts): desbloqueio de ilhas, zonas
 * e unidades, a partir do currículo, do conteúdo e do progresso.
 */
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import type { Unidade } from "@/conteudo/tipos";
import { CURRICULO, ilhaDoId, ilhasDaTrilha, localNoCurriculo, TODAS_AS_ILHAS, TRILHAS } from "@/curriculo";
import { ARTE_DAS_ILHAS } from "@/componentes/mapa/arte";
import { desenhoDoMundo } from "@/componentes/mapa/desenhoMundo";
import { dentroDoArredondado, encolher } from "@/componentes/mapa/geometria";
import { type Caixa, caixaDaPlaca, caixaDoMascote, caixaDoNome, desenharIlha } from "@/componentes/mapa/ilha/desenhoIlha";
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

// As unidades de Sites, na ordem (o museu das Origens vem antes em UNIDADES).
const [U1, U2, U3, U4, U5, U6, E1] = UNIDADES.filter((unidade) => unidade.id.startsWith("sites-"));
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
  it("do zero: Origens (sempre aberta, com as salas 1 e 2) e Sites abertas, Lógica trancada, as sem unidade pronta em construção", () => {
    const fonte = { progresso: PROGRESSO_PADRAO };
    expect(CURRICULO.map((item) => [item.id, estadoDaIlha(item, fonte)])).toEqual([
      ["origens", "disponivel"],
      ["sites", "disponivel"],
      ["logica", "bloqueada"],
      ["paginas-vivas", "construcao"],
      ["rede-servidor", "construcao"],
      ["python", "construcao"],
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

describe("o mundo completo: toda ilha, com arte, na ordem do currículo", () => {
  it("a trilha Web passa por todas as ilhas do currículo, na ordem dele", () => {
    expect(TRILHAS.find((trilha) => trilha.id === "web")?.ilhas).toEqual(CURRICULO.map((item) => item.id));
  });
  it("toda ilha (do currículo e das trilhas em construção) tem arte própria no mundo", () => {
    for (const item of TODAS_AS_ILHAS) expect(ARTE_DAS_ILHAS[item.id], item.id).toBeDefined();
  });
  for (const trilha of TRILHAS) {
    it(`trilha ${trilha.id}: a rota segue a ordem da trilha, em zigue-zague, e a opcional fica no fim`, () => {
      const ilhas = ilhasDaTrilha(trilha);
      const desenho = desenhoDoMundo(ilhas, 1440, 796);
      const rota = ilhas.filter((item) => !item.opcional).map((item) => desenho.posicao(item));
      rota.forEach((ponto, indice) => {
        if (indice === 0) return;
        expect(ponto.x).toBeGreaterThan(rota[indice - 1].x);
        expect(ponto.y).not.toBeCloseTo(rota[indice - 1].y);
      });
      for (const opcional of ilhas.filter((item) => item.opcional)) expect(desenho.posicao(opcional).x).toBeGreaterThan(rota[rota.length - 1].x);
    });
  }
});

describe("o desenho do mundo (src/componentes/mapa/desenhoMundo.ts)", () => {
  // As telas do jogo: em pé (390 x 844 menos as barras), deitado, o computador pequeno e o grande.
  const TELAS = [
    { nome: "em pé", largura: 390, altura: 740 },
    { nome: "deitado", largura: 844, altura: 306 },
    { nome: "computador pequeno", largura: 1024, altura: 596 },
    { nome: "computador", largura: 1440, altura: 796 },
    { nome: "monitor largo", largura: 2560, altura: 1300 },
  ];
  for (const trilha of TRILHAS) {
    const ilhas = ilhasDaTrilha(trilha);
    for (const tela of TELAS) {
      it(`trilha ${trilha.id}, ${tela.nome}: cabe na altura com a mesma margem em cima e embaixo`, () => {
        const desenho = desenhoDoMundo(ilhas, tela.largura, tela.altura);
        const ys = ilhas.map((ilha) => desenho.posicao(ilha).y);
        // Em cima: a arte (até 86 acima do centro; o pier do Porto, 52); embaixo: a etiqueta (70 abaixo e mais 44 px).
        const topo = Math.min(Math.min(...ys) - 86, desenho.porto.y - 52) * desenho.escala;
        const base = desenho.altura * desenho.escala - ((Math.max(...ys) + 70) * desenho.escala + 44);
        expect(desenho.altura * desenho.escala).toBeLessThanOrEqual(tela.altura + 0.5);
        expect(topo).toBeGreaterThanOrEqual(9);
        expect(Math.abs(topo - base)).toBeLessThan(1);
        // O mundo cobre a tela (o mar sobra igual dos dois lados num monitor largo).
        expect(desenho.largura * desenho.escala).toBeGreaterThanOrEqual(tela.largura - 0.5);
        const xs = ilhas.map((ilha) => desenho.posicao(ilha).x);
        expect(Math.min(...xs) - 118).toBeGreaterThanOrEqual(0);
        expect(Math.max(...xs) + 118).toBeLessThanOrEqual(desenho.largura);
      });
      it(`trilha ${trilha.id}, ${tela.nome}: as ilhas não se encostam (nem as etiquetas nas artes)`, () => {
        const desenho = desenhoDoMundo(ilhas, tela.largura, tela.altura);
        const etiquetaPx = { largura: 140, altura: 44 };
        const caixas = ilhas.flatMap((ilha) => {
          const { x, y } = desenho.posicao(ilha);
          const metade = etiquetaPx.largura / 2 / desenho.escala;
          return [
            { id: `${ilha.id} (arte)`, x0: x - 118, x1: x + 118, y0: y - 86, y1: y + 76 },
            { id: `${ilha.id} (etiqueta)`, x0: x - metade, x1: x + metade, y0: y + 70, y1: y + 70 + etiquetaPx.altura / desenho.escala },
          ];
        });
        // O Porto da revisão: o pier e a etiqueta ("Porto da revisão" e, embaixo, "3 hoje").
        const porto = desenho.porto;
        const metadePorto = 70 / desenho.escala;
        caixas.push(
          { id: "porto (arte)", x0: porto.x - 100, x1: porto.x + 104, y0: porto.y - 52, y1: porto.y + 51 },
          { id: "porto (etiqueta)", x0: porto.x + 20 - metadePorto, x1: porto.x + 20 + metadePorto, y0: porto.y + 50 - 12 / desenho.escala, y1: porto.y + 50 + 40 / desenho.escala },
        );
        for (const a of caixas) {
          for (const b of caixas) {
            if (a === b || a.id.split(" ")[0] === b.id.split(" ")[0]) continue;
            const encosta = a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
            expect(encosta, `${a.id} encosta em ${b.id}`).toBe(false);
          }
        }
      });
    }
  }
});

describe("o desenho de cada ilha por dentro (src/componentes/mapa/ilha/desenhoIlha.ts)", () => {
  const encosta = (a: Caixa, b: Caixa) => a.x < b.x + b.largura && b.x < a.x + a.largura && a.y < b.y + b.altura && b.y < a.y + a.altura;
  const TELAS = [
    { nome: "em pé", vertical: true, largura: 390, altura: 740 },
    { nome: "em pé, celular estreito", vertical: true, largura: 320, altura: 568 },
    { nome: "deitado", vertical: false, largura: 844, altura: 306 },
    { nome: "computador", vertical: false, largura: 1440, altura: 796 },
  ];
  for (const ilhaCurriculo of CURRICULO.filter((item) => item.zonas.length > 0 && item.id !== "origens")) {
    for (const tela of TELAS) {
      const desenho = desenharIlha(ilhaCurriculo, tela.vertical, tela.largura, tela.altura);
      it(`${ilhaCurriculo.id}, ${tela.nome}: as zonas dividem o chão em ordem e cada ponto fica na zona dele`, () => {
        for (const [i, regiao] of desenho.regioes.entries()) {
          const proxima = desenho.regioes[i + 1];
          if (proxima) expect(tela.vertical ? regiao.y + regiao.altura : regiao.x + regiao.largura).toBeCloseTo(tela.vertical ? proxima.y : proxima.x);
          for (const ponto of desenho.pontos.filter((p) => p.zona === regiao.zona)) {
            expect(ponto.x >= regiao.x && ponto.x <= regiao.x + regiao.largura && ponto.y >= regiao.y && ponto.y <= regiao.y + regiao.altura).toBe(true);
          }
        }
      });
      it(`${ilhaCurriculo.id}, ${tela.nome}: placas, nomes e o lugar do computadorzinho não se encostam`, () => {
        const e = desenho.escala;
        const placas = desenho.regioes.map((regiao) => ({ id: `placa ${regiao.zona.id}`, caixa: caixaDaPlaca(regiao, e) }));
        const nomes = desenho.pontos.map((ponto) => ({ id: `nome ${ponto.item.id}`, caixa: caixaDoNome(ponto, e) }));
        const pontos = desenho.pontos.map((ponto) => ({ id: `ponto ${ponto.item.id}`, caixa: { x: ponto.x - 30 / e, y: ponto.y - 30 / e, largura: 60 / e, altura: 60 / e } }));
        const mascotes = desenho.pontos.map((ponto) => ({ id: `computadorzinho em ${ponto.item.id}`, caixa: caixaDoMascote(ponto, e) }));
        for (const placa of placas) {
          for (const outro of [...nomes, ...pontos, ...mascotes]) expect(encosta(placa.caixa, outro.caixa), `${placa.id} encosta em ${outro.id}`).toBe(false);
          // A placa fica dentro do chão (nem no mar, nem na areia).
          expect(placa.caixa.x).toBeGreaterThanOrEqual(desenho.grama.x - 1);
          expect(placa.caixa.x + placa.caixa.largura).toBeLessThanOrEqual(desenho.grama.x + desenho.grama.largura + 1);
        }
        for (const a of nomes) {
          for (const b of [...nomes, ...pontos]) {
            if (b.id.endsWith(a.id.slice(5))) continue;
            expect(encosta(a.caixa, b.caixa), `${a.id} encosta em ${b.id}`).toBe(false);
          }
        }
      });
      it(`${ilhaCurriculo.id}, ${tela.nome}: os enfeites ficam dentro da grama, sem cobrir nada`, () => {
        expect(desenho.enfeites.length).toBeGreaterThan(0);
        const seguro = encolher(desenho.grama, 6);
        for (const enfeite of desenho.enfeites) {
          const caixa = { x: enfeite.x - 24, y: enfeite.y - 24, largura: 48, altura: 48 };
          for (const canto of [
            { x: caixa.x, y: caixa.y },
            { x: caixa.x + 48, y: caixa.y },
            { x: caixa.x, y: caixa.y + 48 },
            { x: caixa.x + 48, y: caixa.y + 48 },
          ]) expect(dentroDoArredondado(seguro, canto)).toBe(true);
          expect(desenho.ocupado.some((ocupada) => encosta(caixa, ocupada))).toBe(false);
        }
      });
    }
  }
});

/*
 * Os dois chamados da Depuração (U5 e U6): contratos de manutenção. Além das
 * regras gerais (o contrato inteiro é jogado pelo testar:conteudo), aqui:
 * o defeito do cliente cai nos casos escondidos, consertos errados e
 * "mexer até passar" não passam, o conserto certo sem investigação e sem
 * diagnóstico não cumpre o processo, a mudança de pedido exige ajuste, e a
 * jornada de navegador acompanha o conteúdo.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { UNIDADES } from "@/conteudo";
import { CODIGO_COM_DEFEITO as DEFEITO_ESTOQUE, CODIGO_CONSERTADO as CONSERTO_ESTOQUE, FASE_DEPURACAO_U5_F2 } from "@/conteudo/ilhas/logica/depuracao/unidade-5/fase-2-contrato";
import { FASES_DEPURACAO_U5 } from "@/conteudo/ilhas/logica/depuracao/unidade-5/unidade";
import { CODIGO_COM_DEFEITO as DEFEITO_AGENDA, CODIGO_CONSERTADO as CONSERTO_AGENDA, FASE_DEPURACAO_U6_F2 } from "@/conteudo/ilhas/logica/depuracao/unidade-6/fase-2-contrato";
import { FASES_DEPURACAO_U6 } from "@/conteudo/ilhas/logica/depuracao/unidade-6/unidade";
import type { Acao } from "@/conteudo/tipos";
import { escolhaCerta, type FaseContrato, partesVisiveis } from "@/motor/contrato/modelo";
import { criarSimulacao, metaDoContrato } from "@/motor/simulacao";
import { estadoNoTempo } from "@/motor/cena/modelo";
import { cenaDaFase } from "@/motor/composicao";
import { programaParaLevar } from "@/motor/contrato/levarProMundo";

const CHAMADOS = [
  { unidade: "logica-depuracao-u5", fase: FASE_DEPURACAO_U5_F2 as FaseContrato, defeito: DEFEITO_ESTOQUE, conserto: CONSERTO_ESTOQUE, parteDoConserto: "fecha", parteNova: "fecha-e-ignora" },
  { unidade: "logica-depuracao-u6", fase: FASE_DEPURACAO_U6_F2 as FaseContrato, defeito: DEFEITO_AGENDA, conserto: CONSERTO_AGENDA, parteDoConserto: "agenda", parteNova: "agenda-expediente" },
];

const rodar = (codigo: string): Acao[] => [{ tipo: "definirSnippet", codigo }, { tipo: "executarSnippet" }];
/** Escolhe a causa certa no relatório (o diagnóstico) e roda o código: o conserto só vale depois disso. */
const comCausa = (fase: FaseContrato, codigo: string): Acao[] => [...fase.partes.find((parte) => parte.id === "causa")!.solucaoDeTeste, ...rodar(codigo)];

/** Roda o código numa simulação nova e diz quais partes do contrato passam. */
function partesQuePassam(fase: FaseContrato, acoes: Acao[], mudou = false): string[] {
  const simulacao = criarSimulacao(fase);
  simulacao.comecarObjetivo(null);
  simulacao.executar(acoes);
  return partesVisiveis(fase, mudou)
    .filter((parte) => simulacao.avaliar(parte.validador).passou)
    .map((parte) => parte.id);
}

describe.each(CHAMADOS)("o chamado $unidade", ({ unidade, fase, defeito, conserto, parteDoConserto, parteNova }) => {
  it("é um contrato de manutenção no meio da ilha, sem a comemoração de fim de ilha, na zona Depuração", () => {
    expect(fase.contrato.fimDeIlha).toBe(false);
    const registrada = UNIDADES.find((u) => u.id === unidade);
    expect(registrada?.zona).toBe("Depuração");
    expect(registrada?.meta.desafioId).toBe(fase.id);
  });

  it("Levar pro mundo: só quando o arquivo leva todos os aparelhos da cena (a agenda sai do jogo; o estoque, sem cena, não oferece o botão)", () => {
    const cena = cenaDaFase(fase);
    if (!cena) {
      expect(fase.contrato.levarProMundo).toBeUndefined();
      return;
    }
    expect(fase.contrato.levarProMundo?.arquivo).toMatch(/\.js$/);
    expect(() => programaParaLevar({ contrato: fase.contrato, cena, codigo: conserto })).not.toThrow();
  });

  it("o programa do cliente, do jeito que chegou, cai nos casos escondidos: o defeito é real", () => {
    const causa = fase.partes.find((parte) => parte.id === "causa")!.solucaoDeTeste;
    expect(partesQuePassam(fase, [...causa, ...rodar(defeito)])).not.toContain(parteDoConserto);
    expect(partesQuePassam(fase, [...causa, ...rodar(conserto)])).toContain(parteDoConserto);
  });

  it("um conserto certo sem diagnóstico não vale: reproduzir, causa, relatório e o próprio conserto esperam o diagnóstico", () => {
    const passam = partesQuePassam(fase, rodar(conserto));
    for (const parte of ["reproduzir", "causa", "relatorio", parteDoConserto]) expect(passam).not.toContain(parte);
    const depois = partesQuePassam(fase, comCausa(fase, conserto));
    expect(depois).toContain(parteDoConserto);
    expect(depois).not.toContain("reproduzir");
    expect(depois).not.toContain("relatorio");
  });

  it("a causa errada no relatório não cumpre o diagnóstico, nem com a causa certa junto", () => {
    const causa = fase.partes.find((parte) => parte.id === "causa")!;
    const cartoes = fase.plano!.cartoes;
    const certa = cartoes.find((c) => !c.sobra && c.grupo === "errado")!.id;
    const distracoes = cartoes.filter((c) => c.sobra && c.id.startsWith("causa-"));
    expect(distracoes.length).toBeGreaterThanOrEqual(3);
    for (const distracao of distracoes) {
      const sozinha = criarSimulacao(fase);
      sozinha.comecarObjetivo(null);
      sozinha.executar([{ tipo: "porPasso", passo: distracao.id, grupo: "errado" }]);
      expect(sozinha.avaliar(causa.validador).passou, distracao.id).toBe(false);
      const junto = criarSimulacao(fase);
      junto.comecarObjetivo(null);
      junto.executar([{ tipo: "porPasso", passo: certa, grupo: "errado" }, { tipo: "porPasso", passo: distracao.id, grupo: "errado" }]);
      expect(junto.avaliar(causa.validador).passou, `${distracao.id} junto da certa`).toBe(false);
    }
  });

  it("a cada unidade, a lista certa dos cartões de requisitos tem os três pedidos e nenhuma distração", () => {
    const certa = escolhaCerta(fase.contrato);
    expect(certa.cartoes).toEqual(["causa", unidade === "logica-depuracao-u5" ? "fecha" : "agenda", "relatorio"]);
  });

  it("a mudança de pedido exige ajuste: o conserto do começo não passa na parte nova", () => {
    expect(partesQuePassam(fase, comCausa(fase, conserto), true)).not.toContain(parteNova);
  });
});

describe("chamado 1: o estoque do Mercadinho Estrela", () => {
  const fase = FASE_DEPURACAO_U5_F2 as FaseContrato;
  const conserto = (conta: string) => DEFEITO_ESTOQUE.replace("estoque[mov.codigo] + mov.quantidade", conta);

  it("consertar o sintoma de um dia (o resultado da sexta, escrito à mão) não passa", () => {
    const decorado = ["function fecharDia(estoque, movimentos) {", "  return { arroz: 10, feijao: 10 };", "}"].join("\n");
    expect(partesQuePassam(fase, comCausa(fase, decorado))).not.toContain("fecha");
  });

  it("converter o resultado da soma (Number(a + b)) é mexer até passar: os casos escondidos rejeitam", () => {
    const errado = conserto("Number(estoque[mov.codigo] + mov.quantidade)");
    expect(partesQuePassam(fase, comCausa(fase, errado))).not.toContain("fecha");
    expect(partesQuePassam(fase, comCausa(fase, conserto("estoque[mov.codigo] + Number(mov.quantidade)")))).toContain("fecha");
    expect(partesQuePassam(fase, comCausa(fase, conserto("estoque[mov.codigo] + parseInt(mov.quantidade)")))).toContain("fecha");
  });

  it("o conserto do texto, sem ignorar o produto que não existe, ainda deixa NaN depois da mudança", () => {
    expect(partesQuePassam(fase, comCausa(fase, CONSERTO_ESTOQUE), true)).not.toContain("fecha-e-ignora");
  });
});

describe("chamado 2: a agenda do Salão Girassol", () => {
  const fase = FASE_DEPURACAO_U6_F2 as FaseContrato;

  it("recusar tudo com a agenda cheia é conserto de sintoma: o horário livre também precisa marcar", () => {
    const recusaTudo = ["function agendar(agenda, pedido) {", "  if (agenda.length > 0) return agenda;", "  agenda.push(pedido);", "  return agenda;", "}"].join("\n");
    expect(partesQuePassam(fase, comCausa(fase, recusaTudo))).not.toContain("agenda");
  });

  it("olhar só a última marcação ou só a primeira continua marcando em dobro", () => {
    const soUltima = [
      "function agendar(agenda, pedido) {",
      "  if (agenda.length > 0 && agenda[agenda.length - 1].horario === pedido.horario) return agenda;",
      "  agenda.push(pedido);",
      "  return agenda;",
      "}",
    ].join("\n");
    expect(partesQuePassam(fase, comCausa(fase, soUltima))).not.toContain("agenda");
  });

  it("o expediente aceita as bordas 9 e 17 e recusa 8 e 18: trocar < por <= quebra a borda das 18h", () => {
    const expediente = FASE_DEPURACAO_U6_F2.partes.find((parte) => parte.id === "agenda-expediente")!;
    const certo = expediente.solucaoDeTeste;
    expect(partesQuePassam(fase, [...fase.partes.find((parte) => parte.id === "causa")!.solucaoDeTeste, ...certo], true)).toContain("agenda-expediente");
    const maisUmaHora = (certo[0] as Extract<Acao, { tipo: "definirSnippet" }>).codigo.replace("pedido.horario >= 18", "pedido.horario > 18");
    expect(partesQuePassam(fase, comCausa(fase, maisUmaHora), true)).not.toContain("agenda-expediente");
  });
});

describe("a jornada de navegador dos chamados", () => {
  it("testes/chamados-jornadas.json tem as mesmas soluções, validadores e escolhas do conteúdo (não se desvia do TS)", () => {
    const jornada = JSON.parse(readFileSync("testes/chamados-jornadas.json", "utf8"));
    for (const [n, fases] of [
      ["5", FASES_DEPURACAO_U5],
      ["6", FASES_DEPURACAO_U6],
    ] as const) {
      const [pratica, contrato] = fases;
      if (pratica.tipo !== "pratica" || contrato.tipo !== "desafio" || !contrato.contrato) throw new Error("a unidade mudou de forma");
      expect(jornada[n].pratica).toEqual({
        id: pratica.id,
        cena: pratica.cena?.id,
        objetivos: pratica.objetivos.map((o) => ({ id: o.id, modo: o.modo, validador: o.validador, solucaoDeTeste: o.solucaoDeTeste })),
      });
      expect(jornada[n].contrato).toEqual({
        id: contrato.id,
        escolha: escolhaCerta(contrato.contrato),
        depoisDe: contrato.contrato.mudanca.depoisDe,
        novas: contrato.contrato.mudanca.novas,
        partes: contrato.partes.map((p) => ({ id: p.id, validador: p.validador, solucaoDeTeste: p.solucaoDeTeste })),
      });
    }
  });
});

describe("o Levar pro mundo da agenda do salão (a tela do aplicativo sai do jogo)", () => {
  const rodarFora = async (codigo: string) => {
    const { execFileSync } = await import("node:child_process");
    const { mkdtempSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const fase = FASE_DEPURACAO_U6_F2 as FaseContrato;
    const arquivo = join(mkdtempSync(join(tmpdir(), "levar-")), "agenda-do-salao.js");
    writeFileSync(arquivo, programaParaLevar({ contrato: fase.contrato, cena: cenaDaFase(fase), codigo }));
    return execFileSync(process.execPath, [arquivo], { encoding: "utf8" });
  };

  it("com o defeito, a agenda de terça aparece no console com o horário das 10h marcado duas vezes", async () => {
    const saida = await rodarFora(DEFEITO_AGENDA);
    expect(saida).toContain("Tela da agenda: agenda de Terça");
    expect(saida).toMatch(/10h\s+Dani\s+<- 10h marcado 2 vezes!/);
  });

  it("consertada, a mesma terça sai sem horário repetido", async () => {
    const saida = await rodarFora(CONSERTO_AGENDA);
    expect(saida).toMatch(/9h\s+Ana/);
    expect(saida).toMatch(/10h\s+Bia/);
    expect(saida).not.toContain("marcado 2 vezes");
    expect(saida).not.toContain("Dani");
  });
});

describe("a tela do aplicativo na cena (o motor)", () => {
  const fase = FASE_DEPURACAO_U6_F2 as FaseContrato;
  const conflitosDepois = (codigo: string) => {
    const simulacao = criarSimulacao(fase);
    simulacao.comecarObjetivo(null);
    simulacao.executar(rodar(codigo));
    return simulacao.avaliar({ tipo: "estadoNaCena", dispositivo: "tela", propriedade: "conflitos", valor: 1 }).passou;
  };
  it("o código que chegou deixa um horário repetido na tela; o conserto, nenhum", () => {
    expect(conflitosDepois(DEFEITO_AGENDA)).toBe(true);
    expect(conflitosDepois(CONSERTO_AGENDA)).toBe(false);
  });
  it("uma marcação sem horário de verdade é um erro claro (TypeError), não uma tela quebrada", () => {
    const simulacao = criarSimulacao(fase);
    simulacao.comecarObjetivo(null);
    simulacao.executar(rodar('tela.mostrarAgenda([{ horario: "dez", cliente: "Ana" }]);'));
    expect(simulacao.programa().ultimaExecucao?.erro?.mensagem ?? "").toMatch(/horario: um número inteiro de 0 a 23/);
  });
});

describe("a meta dos chamados (o antes e o depois de verdade, ou nada)", () => {
  it("o estoque (sem cena): a saída do programa antes e depois do conserto, com o que mudou em destaque", () => {
    const meta = metaDoContrato(FASE_DEPURACAO_U5_F2);
    if (meta?.tipo !== "saida") throw new Error(`esperava a saída do programa, veio ${meta?.tipo ?? "nada"}`);
    expect(meta.antes).toContainEqual({ rotulo: "sexta", texto: "{arroz: 10, feijao: '64'}", mudou: true });
    expect(meta.depois).toContainEqual({ rotulo: "sexta", texto: "{arroz: 10, feijao: 10}", mudou: true });
    expect(meta.depois).toContainEqual({ rotulo: "segunda", texto: "{arroz: 7, feijao: 6}", mudou: false });
  });

  it("a agenda (com a tela do aplicativo): antes, a terça com o horário repetido; depois, sem", () => {
    const meta = metaDoContrato(FASE_DEPURACAO_U6_F2);
    if (meta?.tipo !== "cena") throw new Error(`esperava a cena, veio ${meta?.tipo ?? "nada"}`);
    const tela = (retrato: typeof meta.antes) => (retrato.cena ? estadoNoTempo(retrato.cena.rastro, retrato.cena.tempoMs).tela : null);
    expect(tela(meta.antes)).toMatchObject({ texto: "Terça: 9h Ana, 10h Bia, 10h Dani", conflitos: 1 });
    expect(tela(meta.depois)).toMatchObject({ texto: "Terça: 9h Ana, 10h Bia", conflitos: 0 });
    // Nunca o código nem o plano: a meta de um contrato mostra o mundo.
    for (const retrato of [meta.antes, meta.depois]) expect([retrato.codigo, retrato.plano, retrato.casos]).toEqual([null, null, null]);
  });

  it("um contrato que começa em branco e sem cena não tem antes e depois: a meta esconde a seção", () => {
    const vazio = { ...FASE_DEPURACAO_U5_F2, programa: { snippet: { nome: "novo.js", codigoInicial: "" } } };
    expect(metaDoContrato(vazio)).toBeNull();
  });
});

/*
 * O formato contrato (src/motor/contrato): as partes antes e depois da
 * mudança de pedido, a conferência dos requisitos (cartões, distrações e
 * lacunas), o relatório da entrega, as checagens dos dados e a simulação do
 * contrato inteiro (o antes, a mudança exigindo ajuste e o depois). Mais as
 * sabotagens.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASES_BANCADA_CENAS } from "@/conteudo/laboratorio/bancadaCenas";
import { CODIGO_ESTUDIO_ANTES, CODIGO_ESTUDIO_DEPOIS, FASE_DEMO_CONTRATO } from "@/conteudo/laboratorio/bancadaContrato";
import type { FaseDesafio } from "@/conteudo/tipos";
import {
  conferirRequisitos,
  ehContrato,
  escolhaCerta,
  type FaseContrato,
  falaDaConferencia,
  montarRelatorio,
  mudancaPronta,
  partesVisiveis,
  pedacosDoCartao,
  textoDoCartao,
  textoDoTempoDeTrabalho,
} from "@/motor/contrato/modelo";
import { conferirContrato } from "@/motor/contrato/conferir";
import { CLIENTES } from "@/motor/contrato/clientes";
import { formaDaLetra } from "@/motor/contrato/expressoes";
import { criarSimulacao } from "@/motor/simulacao";
import { recalcularPartesFeitas } from "@/motor/validadores";

const CONTRATO = FASE_DEMO_CONTRATO as FaseContrato;
const contexto = { unidades: [], fases: [...FASES_BANCADA_CENAS, FASE_DEMO_CONTRATO] };

function problemas(fase: FaseDesafio): string[] {
  return REGRAS_DE_FASE.flatMap((regra) => regra.checar(fase, contexto).map((p) => `${regra.id}: ${p}`));
}

describe("o checklist antes e depois da mudança", () => {
  it("antes: as partes do começo; depois: a parte nova no lugar da que ela troca", () => {
    expect(ehContrato(CONTRATO)).toBe(true);
    expect(partesVisiveis(CONTRATO, false).map((p) => p.id)).toEqual(["ficha", "pisca", "ventilador"]);
    expect(partesVisiveis(CONTRATO, true).map((p) => p.id)).toEqual(["ficha", "pisca-e-fica", "ventilador"]);
    expect(mudancaPronta(CONTRATO.contrato, ["ficha"])).toBe(false);
    expect(mudancaPronta(CONTRATO.contrato, ["pisca"])).toBe(true);
  });

  it("uma parte só nova (sem substitui) entra depois das do cliente e antes das do processo", () => {
    const fase: FaseContrato = {
      ...CONTRATO,
      partes: [...CONTRATO.partes, { ...CONTRATO.partes[3], id: "extra" }],
      contrato: { ...CONTRATO.contrato, mudanca: { ...CONTRATO.contrato.mudanca, novas: [...CONTRATO.contrato.mudanca.novas, { parte: "extra" }] } },
    };
    // "ficha" é do processo (sem cartão); "ventilador" é a última do cliente.
    expect(partesVisiveis(fase, true).map((p) => p.id)).toEqual(["ficha", "pisca-e-fica", "ventilador", "extra"]);
  });
});

describe("a etapa de requisitos", () => {
  it("as lacunas viram pedaços e o texto preenchido", () => {
    const cartao = CONTRATO.contrato.requisitos.cartoes[0];
    expect(pedacosDoCartao(cartao)).toEqual([
      { tipo: "texto", texto: "A luz pisca " },
      { tipo: "lacuna", indice: 0 },
      { tipo: "texto", texto: " vezes, meio segundo acesa e meio apagada" },
    ]);
    expect(textoDoCartao(cartao, [0])).toBe("A luz pisca 2 vezes, meio segundo acesa e meio apagada");
    expect(textoDoCartao(cartao)).toContain("___");
  });

  it("a lista certa passa; distração, pedido faltando e lacuna errada não", () => {
    const certa = escolhaCerta(CONTRATO.contrato);
    expect(certa.cartoes).toEqual(["pisca", "ventilador"]);
    expect(conferirRequisitos(CONTRATO.contrato, certa).certo).toBe(true);
    const comSobra = conferirRequisitos(CONTRATO.contrato, { ...certa, cartoes: [...certa.cartoes, "roxa"] });
    expect(comSobra).toMatchObject({ certo: false, sobraram: 1, faltaram: 0 });
    const faltando = conferirRequisitos(CONTRATO.contrato, { ...certa, cartoes: ["pisca"] });
    expect(faltando).toMatchObject({ certo: false, faltaram: 1 });
    const lacuna = conferirRequisitos(CONTRATO.contrato, { ...certa, lacunas: { ...certa.lacunas, pisca: [1] } });
    expect(lacuna).toMatchObject({ certo: false, lacunasErradas: 1 });
    expect(lacuna.cartoes.find((c) => c.id === "pisca")?.situacao).toBe("lacuna");
    // O colega diz o que falta sem dizer qual cartão.
    expect(falaDaConferencia(comSobra)).toMatch(/só comentou/);
    expect(falaDaConferencia(faltando)).toMatch(/ficou de fora/);
  });
});

describe("a simulação do contrato (o mesmo motor do jogo)", () => {
  it("o código do antes passa no pisca e cai na parte nova; o do depois passa em todas", () => {
    const simulacao = criarSimulacao(CONTRATO);
    simulacao.comecarObjetivo(null);
    simulacao.executar([{ tipo: "abrirFicha", dispositivo: "ventilador" }, { tipo: "definirSnippet", codigo: CODIGO_ESTUDIO_ANTES }, { tipo: "executarSnippet" }]);
    const antes = recalcularPartesFeitas(CONTRATO, [], simulacao.contexto(), false);
    expect(antes).toEqual(["ficha", "pisca", "ventilador"]);
    expect(recalcularPartesFeitas(CONTRATO, antes, simulacao.contexto(), true)).toEqual(["ficha", "ventilador"]);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_ESTUDIO_DEPOIS }, { tipo: "executarSnippet" }]);
    expect(recalcularPartesFeitas(CONTRATO, antes, simulacao.contexto(), true)).toEqual(["ficha", "pisca-e-fica", "ventilador"]);
  });

  it("o contrato do /lab passa em todas as regras de fase", () => {
    expect(problemas(FASE_DEMO_CONTRATO)).toEqual([]);
  });

  it("o relatório: os pedidos do cliente (com o que mudou), o processo, os testes e o tempo", () => {
    const relatorio = montarRelatorio({ fase: CONTRATO, feitas: ["ficha", "pisca-e-fica", "ventilador"], mudou: true, casos: null, cenarios: 0, tempoMs: 65 * 60_000 });
    expect(relatorio.requisitos).toEqual([
      { descricao: "A luz pisca 2 vezes e depois fica acesa, com brilho 30", atendido: true, mudou: true },
      { descricao: "O ventilador fica na velocidade 1", atendido: true, mudou: false },
    ]);
    expect(relatorio.processo).toEqual([{ descricao: "Leu a ficha do ventilador (o manual da peça) antes de usar", atendido: true }]);
    expect(textoDoTempoDeTrabalho(relatorio.tempoMs)).toBe("1 h 05 min");
    expect(textoDoTempoDeTrabalho(20_000)).toBe("menos de 1 min");
    expect(textoDoTempoDeTrabalho(12 * 60_000)).toBe("12 min");
  });
});

describe("sabotagens", () => {
  it("mudança que não exige ajuste: a parte nova já passa com o código do antes", () => {
    const fase: FaseContrato = {
      ...CONTRATO,
      partes: CONTRATO.partes.map((parte) => (parte.id === "pisca-e-fica" ? { ...parte, validador: { tipo: "estadoNaCena", dispositivo: "ventilador", propriedade: "velocidade", valor: 1 } } : parte)),
    };
    expect(problemas(fase).join("\n")).toMatch(/já passa com a solução do antes/);
  });

  it("dados: cartão sem parte, parte que não existe, lacuna sem marca, poucas distrações, mudança que nunca chega", () => {
    const { contrato } = CONTRATO;
    const ruim: FaseContrato = {
      ...CONTRATO,
      contrato: {
        ...contrato,
        cliente: "ninguem" as FaseContrato["contrato"]["cliente"],
        requisitos: {
          cartoes: [
            { id: "pisca", texto: "A luz pisca", parte: "pisca", lacunas: [{ opcoes: ["2", "3"], correta: 5 }], porque: "x" },
            { id: "fantasma", texto: "Algo", parte: "nao-existe", porque: "x" },
            { id: "solto", texto: "Sem parte", porque: "x" },
            { id: "roxa", texto: "Roxa", sobra: true, porque: "x" },
          ],
        },
        mudanca: { ...contrato.mudanca, depoisDe: ["pisca-e-fica"], novas: [{ parte: "pisca-e-fica", substitui: "nao-existe" }] },
      },
    };
    const lista = conferirContrato(ruim).join("\n");
    expect(lista).toMatch(/cliente "ninguem" não existe/);
    expect(lista).toMatch(/0 lacuna\(s\) no texto/);
    expect(lista).toMatch(/correta fora das opções/);
    expect(lista).toMatch(/a parte "nao-existe" não existe/);
    expect(lista).toMatch(/precisa da parte que ele vira/);
    expect(lista).toMatch(/1 distração/);
    expect(lista).toMatch(/depoisDe: a parte "pisca-e-fica" só existe depois da mudança/);
    expect(lista).toMatch(/substitui "nao-existe", que não existe/);
  });

  it("parte sem a pergunta do colega e parte nova antes das do começo", () => {
    const fase: FaseContrato = {
      ...CONTRATO,
      partes: [CONTRATO.partes[3], ...CONTRATO.partes.slice(0, 3).map((parte, i) => (i === 0 ? { ...parte, pergunta: undefined } : parte))],
    };
    const lista = conferirContrato(fase).join("\n");
    expect(lista).toMatch(/parte "ficha": num contrato, toda parte tem a pergunta/);
    expect(lista).toMatch(/partes novas \(da mudança\) vêm depois/);
  });
});

describe("o kit de clientes", () => {
  it("a boca acompanha a letra: abre nas vogais (com acento também), quase fecha nas consoantes, descansa no resto", () => {
    expect(["a", "Á", "e", "í", "o", "ú", "m", "ç", " ", "!", undefined].map(formaDaLetra)).toEqual(["a", "a", "e", "e", "o", "o", "m", "m", null, null, null]);
  });

  it("os clientes têm nome e negócio curtos e ids iguais à chave", () => {
    for (const [chave, cliente] of Object.entries(CLIENTES)) {
      expect(cliente.id).toBe(chave);
      expect(cliente.nome.length).toBeLessThanOrEqual(24);
      expect(cliente.negocio.length).toBeLessThanOrEqual(40);
    }
  });
});

describe("Levar pro mundo: o .js que roda fora do jogo", () => {
  it("roda no Node e mostra as ações dos aparelhos no relógio simulado", async () => {
    const { programaParaLevar } = await import("@/motor/contrato/levarProMundo");
    const { execFileSync } = await import("node:child_process");
    const { mkdtempSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const texto = programaParaLevar({ contrato: CONTRATO.contrato, cena: CONTRATO.cena ?? null, codigo: CODIGO_ESTUDIO_DEPOIS });
    expect(texto).toMatch(/node estudio-do-rafa\.js/);
    const arquivo = join(mkdtempSync(join(tmpdir(), "levar-")), "estudio-do-rafa.js");
    writeFileSync(arquivo, texto);
    const saida = execFileSync(process.execPath, [arquivo], { encoding: "utf8" }).trim().split("\n");
    expect(saida).toEqual([
      "Quarto que avisa a gravação: começou a simulação.",
      "[0,0 s] Lâmpada: ligada",
      "[0,5 s] Lâmpada: desligada",
      "[1,0 s] Lâmpada: ligada",
      "[1,5 s] Lâmpada: desligada",
      "[2,0 s] Lâmpada: brilho 30",
      "[2,0 s] Lâmpada: ligada",
      "[2,0 s] Ventilador: velocidade 1",
      "[6,0 s] Fim da simulação.",
    ]);
  });
});

describe("o contrato da Lógica (Padaria Pão de Mel)", () => {
  it("o código decorado (o total de um dia só) cai nos outros dias de teste", async () => {
    const { FASE_CONTRATO_LOGICA, CODIGO_PADARIA_ANTES } = await import("@/conteudo/ilhas/logica/programa-de-verdade/unidade-1/fase-2-contrato");
    const contador = FASE_CONTRATO_LOGICA.partes.find((parte) => parte.id === "contador");
    const simulacao = criarSimulacao(FASE_CONTRATO_LOGICA);
    simulacao.comecarObjetivo(null);
    simulacao.executar([{ tipo: "definirSnippet", codigo: CODIGO_PADARIA_ANTES }, { tipo: "executarSnippet" }]);
    expect(contador && simulacao.avaliar(contador.validador).passou).toBe(true);
    const decorado = CODIGO_PADARIA_ANTES.replace('"CLIENTES: " + clientes', '"CLIENTES: 4"');
    simulacao.executar([{ tipo: "definirSnippet", codigo: decorado }, { tipo: "executarSnippet" }]);
    const resultado = contador ? simulacao.avaliar(contador.validador) : null;
    expect(resultado?.passou).toBe(false);
    expect(resultado?.detalhe).toMatch(/falhou com/);
  });

  it("o .js da vitrine roda no Node: a luz, a campainha, o letreiro e quem chega, no relógio do dia", async () => {
    const { FASE_CONTRATO_LOGICA, CODIGO_PADARIA_DEPOIS } = await import("@/conteudo/ilhas/logica/programa-de-verdade/unidade-1/fase-2-contrato");
    const { programaParaLevar } = await import("@/motor/contrato/levarProMundo");
    const { execFileSync } = await import("node:child_process");
    const { mkdtempSync, writeFileSync } = await import("node:fs");
    const { tmpdir } = await import("node:os");
    const { join } = await import("node:path");
    const contrato = FASE_CONTRATO_LOGICA as FaseContrato;
    const arquivo = join(mkdtempSync(join(tmpdir(), "levar-")), "vitrine-pao-de-mel.js");
    writeFileSync(arquivo, programaParaLevar({ contrato: contrato.contrato, cena: contrato.cena ?? null, codigo: CODIGO_PADARIA_DEPOIS }));
    const saida = execFileSync(process.execPath, [arquivo], { encoding: "utf8" });
    for (const linha of [
      "[06:00] Forno: ligado (esquentando)",
      "[07:00] Luz da vitrine: ligada",
      '[07:00] Letreiro: "SONHO R$ 4"',
      "[07:30] Chegou alguém.",
      "[08:00] Campainha do forno: plim!",
      "[09:00] Luz da vitrine: desligada",
      "[10:30] Luz da vitrine: ligada",
      '[19:00] Letreiro: "CLIENTES: 4"',
      "[21:00] Fim da simulação.",
    ]) {
      expect(saida, linha).toContain(linha);
    }
  });
});

describe("a jornada de navegador do contrato da Lógica", () => {
  it("testes/contrato-jornadas.json tem as mesmas soluções do conteúdo (não se desvia do TS)", async () => {
    const { readFileSync } = await import("node:fs");
    const { FASES_UNIDADE_CONTRATO_LOGICA } = await import("@/conteudo/ilhas/logica/programa-de-verdade/unidade-1/unidade");
    const jornada = JSON.parse(readFileSync("testes/contrato-jornadas.json", "utf8"));
    const [f1, f2] = FASES_UNIDADE_CONTRATO_LOGICA;
    if (f1.tipo !== "pratica" || !ehContrato(f2)) throw new Error("a unidade mudou de forma");
    expect(jornada.pratica.objetivos).toEqual(f1.objetivos.map((o) => ({ id: o.id, solucaoDeTeste: o.solucaoDeTeste })));
    expect(jornada.contrato.partes).toEqual(f2.partes.map((p) => ({ id: p.id, solucaoDeTeste: p.solucaoDeTeste })));
    expect(jornada.contrato.escolha).toEqual(escolhaCerta(f2.contrato));
    expect(jornada.contrato.novas).toEqual(f2.contrato.mudanca.novas);
  });
});

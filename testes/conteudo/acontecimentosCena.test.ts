import { describe, expect, it } from "vitest";
import { criarNucleoNode } from "@/motor/executor/node";
import { conferirCena, conferirLinhaDoTempo } from "@/motor/cena/conferir";
import { resolverAtores } from "@/motor/cena/acontecimentos";
import { type DadosCena, estadoNoTempo, rastroInicial, valorNoTempo } from "@/motor/cena/modelo";
import { quandoAconteceu } from "@/motor/cena/validar";

const dados: DadosCena = {
  id: "teste-generico", titulo: "Entradas e atores", ambiente: "teste", periodo: "dia", duracaoMs: 10000, cenario: [],
  dispositivos: [{ id: "sensor", tipo: "sensorCarro", x: 0, y: 0 }, { id: "portao", tipo: "portao", x: 0, y: 0 }, { id: "umidade", tipo: "sensorUmidade", x: 0, y: 0 }, { id: "forno", tipo: "forno", x: 0, y: 0 }],
  linhaDoTempo: [{ em: 1000, dispositivo: "sensor", propriedade: "temCarro", valor: true }, { de: 0, ate: 6000, dispositivo: "umidade", propriedade: "valor", valorInicial: 80, valorFinal: 20 }],
  atores: [{ id: "carro", desenho: "carro", x: 0, y: 0, acoes: { entrar: { duracaoMs: 800, destino: { x: 100, y: 0 }, aoConcluir: [{ dispositivo: "sensor", propriedade: "temCarro", valor: false }] } } }],
  reacoes: [{ quando: { dispositivo: "portao", propriedade: "aberto", valor: true }, se: [{ dispositivo: "sensor", propriedade: "temCarro", valor: true }], atrasoMs: 1200, entao: { ator: "carro", acao: "entrar" } }],
};
function rodar(codigo: string, cena = dados) {
  const n = criarNucleoNode({ deterministico: true }); n.definirCena(cena);
  const r = n.executar(codigo, "snippet"); expect(r.erro).toBeNull();
  if (!r.cena) throw new Error("Sem cena"); return r.cena;
}

describe("acontecimentos genéricos e atores", () => {
  it("confere o contrato e interpola com fronteiras e precedência temporal", () => {
    expect(conferirCena(dados)).toEqual([]);
    const r = rastroInicial(dados);
    expect(valorNoTempo(r, "sensor", "temCarro", 1000, { antes: true })).toBe(false);
    expect(valorNoTempo(r, "sensor", "temCarro", 1000)).toBe(true);
    expect(valorNoTempo(r, "umidade", "valor", 3000)).toBe(50);
    expect(valorNoTempo(r, "umidade", "valor", 8000)).toBe(20);
    r.linhaDoTempo = [...r.linhaDoTempo, { em: 3000, dispositivo: "umidade", propriedade: "valor", valor: 90 }];
    expect(valorNoTempo(r, "umidade", "valor", 5000)).toBe(90);
  });
  it("encontra igualdade no meio da rampa sem depender de quadros", () => {
    expect(quandoAconteceu(rastroInicial(dados), { dispositivo: "umidade", propriedade: "valor", valor: 50 })).toEqual([3000]);
  });
  it("entrada de presença genérica preserva a API publicada", () => {
    const d: DadosCena = { ...dados, atores: [], reacoes: [], dispositivos: [{ id: "sensor", tipo: "sensor", x: 0, y: 0 }], linhaDoTempo: [{ em: 700, dispositivo: "sensor", propriedade: "temGente", valor: true }] };
    expect(conferirCena(d)).toEqual([]);
    expect(valorNoTempo(rodar("esperar(900); console.log(sensor.temGente);", d), "sensor", "temGente", 900)).toBe(true);
  });
  it("espera a abertura inteira, desloca e só então libera o sensor; rebobinar é puro", () => {
    const r = rodar("while (true) { if (sensor.temCarro) portao.abrir(); else portao.fechar(); esperar(100); }");
    expect(resolverAtores(r, 2199).movimentos).toHaveLength(0);
    expect(resolverAtores(r, 2500).movimentos[0]).toMatchObject({ inicio: 2200, fim: 3000 });
    expect(valorNoTempo(r, "sensor", "temCarro", 2999)).toBe(true);
    expect(valorNoTempo(r, "sensor", "temCarro", 3000)).toBe(false);
    expect(valorNoTempo(r, "portao", "aberto", 3100)).toBe(false);
    expect(estadoNoTempo(r, 2000)).toEqual(estadoNoTempo(structuredClone(r), 2000));
    expect(quandoAconteceu(r, { dispositivo: "sensor", propriedade: "temCarro", valor: false })).toEqual([3000]);
  });
  it("cancela a reação quando a condição deixa de valer durante o atraso", () => {
    const r = rodar("esperar(1000); portao.abrir(); esperar(400); portao.fechar();");
    expect(resolverAtores(r, 10000).movimentos).toEqual([]);
  });
  it("o filtro do depurador não antecipa o ator", () => {
    const r = rodar("esperar(1000); portao.abrir(); esperar(4000);");
    expect(resolverAtores(r, 4000, { filtro: { execucao: r.execucao, passo: 0 } }).movimentos).toEqual([]);
  });
  it("trocar a linha do tempo altera a entrada e o início do ator", () => {
    const r = rodar("while (true) { if (sensor.temCarro) portao.abrir(); esperar(100); }", { ...dados, linhaDoTempo: [{ em: 4000, dispositivo: "sensor", propriedade: "temCarro", valor: true }] });
    expect(resolverAtores(r, 9000).movimentos[0].inicio).toBe(5200);
  });
  it("rejeita saídas como entradas, alvos ausentes, NaN e intervalos invertidos", () => {
    for (const linha of [
      [{ em: 0, dispositivo: "portao", propriedade: "aberto", valor: true }],
      [{ em: 0, dispositivo: "fantasma", propriedade: "x", valor: true }],
      [{ de: 1000, ate: 500, dispositivo: "umidade", propriedade: "valor", valorInicial: 1, valorFinal: 2 }],
      [{ em: 0, dispositivo: "umidade", propriedade: "valor", valor: NaN }],
    ]) expect(conferirLinhaDoTempo(dados, linha)).not.toEqual([]);
  });
  it("uma ordem no instante exato da expiração vence o timer anterior", () => {
    const r = rodar("forno.assar(2000); esperar(2000); forno.ligar(); esperar(100);");
    expect(valorNoTempo(r, "forno", "ligado", 2100)).toBe(true);
    expect(valorNoTempo(r, "forno", "temperatura", 2100)).toBe(109);
  });
  it("o forno desliga com timer e começa a esfriar no instante certo", () => {
    const r = rodar("forno.assar(2000); esperar(3000);");
    expect(valorNoTempo(r, "forno", "ligado", 1999)).toBe(true);
    expect(valorNoTempo(r, "forno", "ligado", 2000)).toBe(false);
    expect(valorNoTempo(r, "forno", "restante", 1000)).toBe(1000);
    expect(valorNoTempo(r, "forno", "temperatura", 3000)).toBe(90);
    const novo = rodar("forno.assar(2000); esperar(3000); forno.ligar(); esperar(100);");
    expect(valorNoTempo(novo, "forno", "ligado", 3100)).toBe(true);
  });
});

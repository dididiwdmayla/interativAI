/*
 * Medição simulada (src/motor/medicao.ts) e o simulador de campanha
 * (src/motor/campanha.ts), com as contas da demonstração do /lab.
 */
import { describe, expect, it } from "vitest";
import { CAMPANHA_DEMO, FASE_DEMO_CAMPANHA } from "@/conteudo/laboratorio/demoCampanha";
import { estadoInicialDaCampanha, simularCampanha } from "@/motor/campanha";
import { conferirLinkRastreavel, eventoDoClique, lerUtm, montarLinkRastreavel } from "@/motor/medicao";
import { criarSimulacao } from "@/motor/simulacao";

describe("medição simulada", () => {
  it("o data-evento do elemento (ou de um ancestral) vira o nome do evento", () => {
    const doc = new DOMParser().parseFromString('<button data-evento="pedido"><span>Pedir</span></button><p>x</p>', "text/html");
    expect(eventoDoClique(doc.querySelector("span") as Element)?.nome).toBe("pedido");
    expect(eventoDoClique(doc.querySelector("p") as Element)).toBeNull();
  });

  it("monta e lê o link rastreável", () => {
    const link = montarLinkRastreavel("loja.exemplo", { source: "Instagram", medium: "social", campaign: "promo inverno" });
    expect(link).toBe("https://loja.exemplo/?utm_source=instagram&utm_medium=social&utm_campaign=promo-inverno");
    expect(lerUtm(link)).toEqual({ source: "instagram", medium: "social", campaign: "promo-inverno" });
    expect(lerUtm("https://loja.exemplo/?utm_source=x")).toBeNull();
  });

  it("confere o link do seletor, sem diferenciar maiúsculas", () => {
    const doc = new DOMParser().parseFromString('<a id="a" href="/?utm_source=Email&utm_medium=email&utm_campaign=natal">x</a>', "text/html");
    const links = [doc.querySelector("#a") as Element];
    expect(conferirLinkRastreavel(links, { source: "email", campaign: "natal" }).passou).toBe(true);
    expect(conferirLinkRastreavel(links, { source: "instagram" }).passou).toBe(false);
  });
});

describe("simulador de campanha", () => {
  const simulacao = () => criarSimulacao(FASE_DEMO_CAMPANHA);

  it("o leilão ordena por lance vezes qualidade, e a página fraca paga caro", () => {
    const { documento } = simulacao();
    const inicio = simularCampanha(CAMPANHA_DEMO, estadoInicialDaCampanha(CAMPANHA_DEMO), documento);
    expect(inicio.leilao.map((item) => item.pontuacao)).toEqual([...inicio.leilao.map((item) => item.pontuacao)].sort((a, b) => b - a));
    expect(inicio.posicao).toBeGreaterThan(1);
    const caro = simularCampanha(CAMPANHA_DEMO, { ...estadoInicialDaCampanha(CAMPANHA_DEMO), lance: 6 }, documento);
    expect(caro.posicao).toBe(1);
    expect(caro.notaPagina).toBeLessThan(80);
  });

  it("melhorar a página sobe a qualidade e a conversão, e baixa o custo por cliente", () => {
    const antes = simulacao();
    const estado = { ...estadoInicialDaCampanha(CAMPANHA_DEMO), lance: 6 };
    const ruim = simularCampanha(CAMPANHA_DEMO, estado, antes.documento);
    const depois = simulacao();
    const melhorar = FASE_DEMO_CAMPANHA.objetivos[3].solucaoDeTeste.filter((acao) => acao.tipo !== "responderPrevisao");
    depois.executar(melhorar);
    const boa = simularCampanha(CAMPANHA_DEMO, estado, depois.documento);
    expect(boa.notaPagina).toBeGreaterThanOrEqual(80);
    expect(boa.qualidade).toBeGreaterThan(ruim.qualidade);
    expect(boa.taxaConversao).toBeGreaterThan(ruim.taxaConversao);
    expect(boa.clientes).toBeGreaterThan(ruim.clientes);
    // Mesma verba, lance menor, página boa: mais clientes e mais baratos que a página ruim no 1º lugar.
    const barato = simularCampanha(CAMPANHA_DEMO, { ...estado, lance: 1.4 }, depois.documento);
    expect(barato.posicao).toBe(2);
    expect(barato.clientes).toBeGreaterThanOrEqual(9);
    expect(barato.custoPorCliente ?? Infinity).toBeLessThanOrEqual(18);
    expect(barato.custoPorCliente ?? Infinity).toBeLessThan(ruim.custoPorCliente ?? Infinity);
  });

  it("o orçamento limita os cliques", () => {
    const { documento } = simulacao();
    const pouco = simularCampanha(CAMPANHA_DEMO, { orcamento: 5, palavra: "bolo-de-aniversario", lance: 6 }, documento);
    expect(pouco.limitadoPeloOrcamento).toBe(true);
    expect(pouco.gasto).toBeLessThanOrEqual(5);
  });
});

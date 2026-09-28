/*
 * Modo dispositivo (src/motor/dispositivos.ts): modelos, girar, largura
 * livre, a regra dos 980 px sem meta viewport num celular, o zoom para
 * caber, a tela das @media e, na simulação, as ações, os eventos
 * (trocouDispositivo, girou) e o validador dispositivo, com as @media
 * reagindo à largura escolhida.
 */
import { describe, expect, it } from "vitest";
import { FASE_BANCADA_VARIAVEIS } from "@/conteudo/laboratorio/bancadaVariaveis";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import type { FasePratica } from "@/conteudo/tipos";
import { valorEfetivo } from "@/motor/css/cascata";
import {
  arrastarLargura,
  DISPOSITIVO_INICIAL,
  girarDispositivo,
  LARGURA_SEM_VIEWPORT,
  medidasNaTela,
  orientacaoDe,
  telaDoDispositivo,
  trocarModelo,
  viewportDoDispositivo,
  zoomParaCaber,
} from "@/motor/dispositivos";
import { criarSimulacao } from "@/motor/simulacao";

function documento(head: string): Document {
  return new DOMParser().parseFromString(`<!doctype html><html><head>${head}</head><body><p>x</p></body></html>`, "text/html");
}
const COM_META = documento('<meta name="viewport" content="width=device-width, initial-scale=1">');
const SEM_META = documento("<title>x</title>");

describe("estado do aparelho", () => {
  it("modelos prontos, girar e largura livre", () => {
    const celular = trocarModelo(DISPOSITIVO_INICIAL, "celular-360");
    expect(celular).toMatchObject({ ligado: true, modelo: "celular-360", largura: 360, altura: 800, deitado: false });
    expect(orientacaoDe(celular)).toBe("retrato");
    const deitado = girarDispositivo(celular);
    expect(medidasNaTela(deitado)).toEqual({ largura: 800, altura: 360 });
    expect(orientacaoDe(deitado)).toBe("paisagem");
    // Trocar de modelo volta a ficar em pé.
    expect(trocarModelo(deitado, "tablet-768").deitado).toBe(false);
    const livre = arrastarLargura(celular, 512.6);
    expect(livre).toMatchObject({ modelo: "livre", largura: 513 });
    expect(arrastarLargura(celular, 10).largura).toBe(240);
    // Deitado, arrastar mexe na largura que aparece (a altura guardada).
    expect(medidasNaTela(arrastarLargura(deitado, 700)).largura).toBe(700);
  });

  it("zoom para caber: nunca aumenta, encolhe o que não cabe", () => {
    expect(zoomParaCaber(390, 844, { largura: 800, altura: 900 })).toBe(1);
    expect(zoomParaCaber(1280, 800, { largura: 640, altura: 900 })).toBe(0.5);
    expect(zoomParaCaber(390, 844, { largura: 800, altura: 422 })).toBe(0.5);
  });
});

describe("meta viewport: a regra dos 980 px", () => {
  it("celular sem meta viewport: desenha em 980 px e encolhe; com o meta, a largura do aparelho", () => {
    const celular = trocarModelo(DISPOSITIVO_INICIAL, "celular-390");
    const sem = viewportDoDispositivo(celular, SEM_META);
    expect(sem).toMatchObject({ largura: 390, larguraLayout: LARGURA_SEM_VIEWPORT, simulandoViewport: true });
    expect(sem.alturaLayout).toBe(Math.round((844 * 980) / 390));
    expect(viewportDoDispositivo(celular, COM_META)).toMatchObject({ larguraLayout: 390, simulandoViewport: false });
  });

  it("notebook não usa a regra; a tela das @media é a largura de desenho", () => {
    const notebook = trocarModelo(DISPOSITIVO_INICIAL, "notebook-1280");
    expect(viewportDoDispositivo(notebook, SEM_META).simulandoViewport).toBe(false);
    expect(telaDoDispositivo(trocarModelo(DISPOSITIVO_INICIAL, "celular-390"), SEM_META)).toEqual({ largura: 980, altura: Math.round((844 * 980) / 390) });
    expect(telaDoDispositivo(DISPOSITIVO_INICIAL, SEM_META)).toBeNull();
  });
});

describe("na simulação: ações, eventos, validador e @media", () => {
  it("trocar, girar e desligar geram os eventos; o validador olha o estado de agora", () => {
    const sim = criarSimulacao(FASE_BANCADA_VARIAVEIS);
    expect(sim.avaliar({ tipo: "dispositivo" })).toMatchObject({ passou: false, detalhe: "a barra de dispositivo está desligada" });
    sim.executar([{ tipo: "trocarDispositivo", modelo: "celular-390" }]);
    expect(sim.contexto().eventos.at(-1)).toMatchObject({ tipo: "trocouDispositivo", ligado: true, largura: 390, altura: 844 });
    expect(sim.avaliar({ tipo: "dispositivo", largura: 390, orientacao: "retrato" }).passou).toBe(true);
    sim.executar([{ tipo: "girarDispositivo" }]);
    expect(sim.contexto().eventos.at(-1)).toMatchObject({ tipo: "girou", orientacao: "paisagem" });
    expect(sim.avaliar({ tipo: "dispositivo", largura: 844, orientacao: "paisagem" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "dispositivo", largura: 390 }).passou).toBe(false);
    sim.executar([{ tipo: "desligarDispositivo" }]);
    expect(sim.avaliar({ tipo: "dispositivo" }).passou).toBe(false);
  });

  it("as @media dos validadores seguem a largura do aparelho", () => {
    const sim = criarSimulacao(FASE_BANCADA_VARIAVEIS);
    const colunas = { tipo: "valorEfetivo", seletor: ".cards", propriedade: "grid-template-columns", valor: "1fr" } as const;
    expect(sim.avaliar(colunas).passou).toBe(false);
    sim.executar([{ tipo: "trocarDispositivo", modelo: "celular-360" }]);
    expect(sim.avaliar(colunas).passou).toBe(true);
    sim.executar([{ tipo: "trocarDispositivo", modelo: "livre", largura: 700 }]);
    expect(sim.avaliar(colunas).passou).toBe(false);
    // larguraTela no validador vale mais que o aparelho.
    expect(sim.avaliar({ ...colunas, larguraTela: 360 }).passou).toBe(true);
    const cards = sim.documento.querySelector(".cards");
    if (!cards) throw new Error(".cards");
    const efetivo = valorEfetivo(cards, "grid-template-columns", { tela: { largura: 600, altura: 800 } })["grid-template-columns"];
    expect(efetivo.tipo === "valor" && efetivo.valor).toBe("1fr");
  });

  it("sabotagens: ação de dispositivo sem a ferramenta e validador dispositivo sem ela", () => {
    const sem: FasePratica = { ...FASE_BANCADA_VARIAVEIS, usaFerramentas: FASE_BANCADA_VARIAVEIS.usaFerramentas.filter((id) => id !== "modo-dispositivo") };
    const sim = criarSimulacao(sem);
    expect(() => sim.executar([{ tipo: "trocarDispositivo", modelo: "celular-390" }])).toThrow("pede a ferramenta modo-dispositivo");
    const regra = REGRAS_DE_FASE.find((item) => item.id === "ferramentas-dos-validadores");
    if (!regra) throw new Error("ferramentas-dos-validadores");
    expect(regra.checar(sem, { unidades: [], fases: [sem] }).join("\n")).toContain('o validador dispositivo pede "modo-dispositivo"');
  });
});

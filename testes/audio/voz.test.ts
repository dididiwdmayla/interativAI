/*
 * Voz de modem do computadorzinho: a parte pura (texto + humor -> eventos).
 */
import { describe, expect, it } from "vitest";
import {
  DURACAO_HANDSHAKE,
  DURACAO_MAXIMA_VOZ,
  duracaoDaFala,
  type EventoVoz,
  gerarFala,
  HUMOR_DA_EXPRESSAO,
  HUMORES_VOZ,
  type HumorVoz,
  PASSA_BAIXA_VOZ,
  silabasDe,
} from "@/audio/vozModem";
import { EXPRESSOES } from "@/motor/expressao";

/** Uma resposta comprida, do tamanho das do tutor Gemini. */
const TEXTO_LONGO =
  "Boa pergunta! Pensa assim: a árvore de elementos mostra a família inteira da página. " +
  "O body é o pai de quase tudo, e cada caixa dentro dele é um filho. Quando você clica num nó, " +
  "o código correspondente acende no editor e a caixa aparece na tela. Tenta clicar no título " +
  "principal e ver o que acontece com o código? Depois me conta o que você descobriu, combinado?";

const blips = (eventos: readonly EventoVoz[]) => eventos.filter((evento) => evento.tipo === "blip");
const media = (valores: readonly number[]) => valores.reduce((soma, valor) => soma + valor, 0) / valores.length;

/** Início dos blips de dois pedaços separados por pontuação: a maior distância entre blips seguidos. */
function maiorIntervaloEntreBlips(texto: string, humor: HumorVoz): number {
  const inicios = blips(gerarFala(texto, humor)).map((evento) => evento.tempo);
  let maior = 0;
  for (let indice = 1; indice < inicios.length; indice++) maior = Math.max(maior, inicios[indice] - inicios[indice - 1]);
  return maior;
}

describe("voz de modem: geração", () => {
  it("é determinística: mesmo texto e humor geram a mesma lista", () => {
    for (const humor of HUMORES_VOZ) {
      expect(gerarFala(TEXTO_LONGO, humor)).toEqual(gerarFala(TEXTO_LONGO, humor));
      expect(gerarFala("Oi, tudo bem?", humor)).toEqual(gerarFala("Oi, tudo bem?", humor));
    }
  });

  it("textos diferentes soam diferentes", () => {
    expect(gerarFala("Oi, tudo bem?", "feliz")).not.toEqual(gerarFala("Olha só isso!", "feliz"));
  });

  it("nunca passa do teto de 2,5 s, mesmo com texto longo", () => {
    for (const humor of HUMORES_VOZ) {
      const eventos = gerarFala(TEXTO_LONGO.repeat(4), humor);
      expect(duracaoDaFala(eventos)).toBeLessThanOrEqual(DURACAO_MAXIMA_VOZ);
      expect(duracaoDaFala(eventos)).toBeGreaterThan(1.8);
    }
  });

  it("texto longo termina com final natural (cauda que desliza), sem corte seco", () => {
    for (const humor of ["feliz", "pensativo", "surpreso"] as const) {
      const eventos = gerarFala(TEXTO_LONGO, humor);
      const ultimo = eventos[eventos.length - 1];
      expect(ultimo.tipo).toBe("blip");
      expect(ultimo.frequenciaFinal).toBeDefined();
    }
  });

  it("fala curta dura menos que fala longa (proporcional ao texto)", () => {
    const curta = duracaoDaFala(gerarFala("Oi!", "feliz"));
    const media = duracaoDaFala(gerarFala("Muito bem, você achou o título.", "feliz"));
    expect(curta).toBeLessThan(media);
    expect(media).toBeLessThanOrEqual(DURACAO_MAXIMA_VOZ);
  });

  it("pausas: espaço < vírgula < ponto", () => {
    for (const humor of HUMORES_VOZ) {
      const espaco = maiorIntervaloEntreBlips("la la", humor);
      const virgula = maiorIntervaloEntreBlips("la, la", humor);
      const ponto = maiorIntervaloEntreBlips("la. la", humor);
      expect(virgula).toBeGreaterThan(espaco + 0.08);
      expect(ponto).toBeGreaterThan(virgula + 0.05);
    }
  });

  it("pergunta termina subindo; afirmação não", () => {
    for (const humor of HUMORES_VOZ) {
      const pergunta = blips(gerarFala("Você viu isso?", humor));
      const ultimo = pergunta[pergunta.length - 1];
      expect(ultimo.frequenciaFinal ?? 0).toBeGreaterThan(ultimo.frequencia * 1.2);

      const afirmacao = blips(gerarFala("Você viu isso.", humor));
      const final = afirmacao[afirmacao.length - 1];
      expect(final.frequenciaFinal ?? final.frequencia).toBeLessThanOrEqual(final.frequencia * 1.1);
    }
  });

  it("começa com handshake curto (tons duplos e varrido, até 150 ms)", () => {
    for (const humor of ["feliz", "pensativo", "triste"] as const) {
      const eventos = gerarFala("Vamos lá!", humor);
      // O handshake: os tons antes do primeiro blip (o chiado da primeira consoante já é fala).
      const antesDoPrimeiroBlip = eventos.filter(
        (evento) => evento.tempo < blips(eventos)[0].tempo && evento.tipo !== "chiado",
      );
      const duplos = antesDoPrimeiroBlip.filter((evento) => evento.tipo === "tom" && evento.tempo === 0);
      expect(duplos).toHaveLength(2);
      expect(antesDoPrimeiroBlip.some((evento) => evento.tipo === "varrido")).toBe(true);
      expect(Math.max(...antesDoPrimeiroBlip.map((evento) => evento.tempo + evento.duracao))).toBeLessThanOrEqual(
        DURACAO_HANDSHAKE,
      );
    }
  });

  it("limita a taxa de blips (no máximo 14 por segundo em qualquer janela)", () => {
    for (const humor of HUMORES_VOZ) {
      const inicios = blips(gerarFala(TEXTO_LONGO, humor)).map((evento) => evento.tempo);
      for (const inicio of inicios) {
        const naJanela = inicios.filter((tempo) => tempo >= inicio && tempo < inicio + 1).length;
        expect(naJanela).toBeLessThanOrEqual(14);
      }
    }
  });

  it("agrupa por sílaba, não por letra", () => {
    expect(silabasDe("computadorzinho")).toHaveLength(6);
    expect(silabasDe("html")).toHaveLength(2);
    const eventos = gerarFala("computadorzinho", "feliz");
    expect(blips(eventos).length).toBeLessThan("computadorzinho".length / 2);
  });

  it("blips de 40 a 70 ms; ruído sempre mais baixo que os tons; tudo abaixo do passa-baixa", () => {
    for (const humor of HUMORES_VOZ) {
      const eventos = gerarFala(TEXTO_LONGO, humor);
      for (const blip of blips(eventos)) {
        expect(blip.duracao).toBeGreaterThanOrEqual(0.04);
        expect(blip.duracao).toBeLessThanOrEqual(0.07);
      }
      const chiados = eventos.filter((evento) => evento.tipo === "chiado").map((evento) => evento.ganho);
      const tons = eventos.filter((evento) => evento.tipo !== "chiado").map((evento) => evento.ganho);
      expect(Math.max(...chiados)).toBeLessThan(Math.min(...tons));
      for (const evento of eventos) {
        expect(evento.frequencia).toBeLessThan(PASSA_BAIXA_VOZ);
        expect(evento.frequenciaFinal ?? 0).toBeLessThan(PASSA_BAIXA_VOZ);
      }
    }
  });
});

describe("voz de modem: humores", () => {
  const frase = "Muito bem, você encontrou o elemento certo na árvore.";

  it("toda expressão do mascote tem uma assinatura de voz", () => {
    for (const expressao of EXPRESSOES) expect(HUMORES_VOZ).toContain(HUMOR_DA_EXPRESSAO[expressao]);
  });

  it("feliz é mais agudo que pensativo, que é mais agudo que triste", () => {
    const altura = (humor: HumorVoz) => media(blips(gerarFala(frase, humor)).map((evento) => evento.frequencia));
    expect(altura("feliz")).toBeGreaterThan(altura("pensativo"));
    expect(altura("pensativo")).toBeGreaterThan(altura("triste"));
  });

  it("feliz é mais saltitante e mais rápido que pensativo", () => {
    const saltos = (humor: HumorVoz) => {
      const alturas = blips(gerarFala(frase, humor)).map((evento) => Math.log2(evento.frequencia));
      return media(alturas.slice(1).map((altura, indice) => Math.abs(altura - alturas[indice])));
    };
    expect(saltos("feliz")).toBeGreaterThan(saltos("pensativo"));
    expect(duracaoDaFala(gerarFala(frase, "feliz"))).toBeLessThan(duracaoDaFala(gerarFala(frase, "pensativo")));
  });

  it("triste termina com a linha caindo (varrido para baixo com chiado)", () => {
    const eventos = gerarFala(frase, "triste");
    const fim = duracaoDaFala(eventos);
    const varrido = eventos.filter((evento) => evento.tipo === "varrido").at(-1);
    expect(varrido).toBeDefined();
    expect(varrido?.frequenciaFinal ?? Infinity).toBeLessThan((varrido?.frequencia ?? 0) * 0.5);
    expect((varrido?.tempo ?? 0) + (varrido?.duracao ?? 0)).toBeGreaterThan(fim - 0.05);
    expect(eventos.some((evento) => evento.tipo === "chiado" && evento.tempo > fim - 0.25)).toBe(true);
    // Os outros humores não têm a linha caindo.
    const feliz = gerarFala(frase, "feliz");
    expect(feliz.filter((evento) => evento.tipo === "varrido").every((evento) => evento.tempo < 0.2)).toBe(true);
  });

  it("surpreso começa com um apito subindo", () => {
    const [primeiro] = gerarFala(frase, "surpreso");
    expect(primeiro.tipo).toBe("varrido");
    expect(primeiro.tempo).toBe(0);
    expect(primeiro.frequenciaFinal ?? 0).toBeGreaterThan(primeiro.frequencia * 2);
    for (const humor of ["feliz", "pensativo", "triste"] as const) expect(gerarFala(frase, humor)[0].tipo).toBe("tom");
  });

  it("cada humor gera uma fala diferente para o mesmo texto", () => {
    const falas = HUMORES_VOZ.map((humor) => JSON.stringify(gerarFala(frase, humor)));
    expect(new Set(falas).size).toBe(HUMORES_VOZ.length);
  });
});

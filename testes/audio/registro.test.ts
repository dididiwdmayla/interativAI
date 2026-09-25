/*
 * Registro de efeitos, tabela tela -> faixa, manifestos e escolha de formato.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EFEITOS_GRANDES, fonteDoEfeito, IDS_EFEITOS } from "@/audio/efeitos";
import {
  escolherFormato,
  lerManifestoEfeitos,
  lerManifestoMusicas,
  type ManifestoEfeitos,
  type ManifestoMusicas,
  URL_MANIFESTO_EFEITOS,
  URL_MANIFESTO_MUSICAS,
} from "@/audio/manifestos";
import { RECEITAS } from "@/audio/receitas";
import { FAIXA_DA_ILHA, faixaDaTela, faixaTocavel } from "@/audio/telas";
import { CURRICULO } from "@/curriculo";
import { normalizarProgresso, PROGRESSO_PADRAO } from "@/lib/progresso";

const PUBLICO = path.resolve(__dirname, "../../public");
const lerJson = (url: string): unknown => JSON.parse(readFileSync(path.join(PUBLICO, url), "utf8"));
const brutoMusicas = lerJson(URL_MANIFESTO_MUSICAS) as { faixas: Record<string, { arquivos: Record<string, string>; sampleRate: number; amostras: number; duracaoSegundos: number }> };
const MUSICAS = lerManifestoMusicas(brutoMusicas);
const EFEITOS = lerManifestoEfeitos(lerJson(URL_MANIFESTO_EFEITOS));

describe("registro de efeitos", () => {
  const manifestoComArquivo: ManifestoEfeitos = {
    efeitos: {
      boot: { arquivos: { webm: "/audio/efeitos/boot.webm", m4a: "/audio/efeitos/boot.m4a" }, preCarregar: true },
      clique: { arquivos: null },
      erro: { arquivos: { m4a: "/audio/efeitos/erro.m4a" } },
    },
  };

  it("usa o arquivo quando ele está no manifesto", () => {
    expect(fonteDoEfeito("boot", manifestoComArquivo, "webm")).toEqual({ tipo: "arquivo", url: "/audio/efeitos/boot.webm" });
    expect(fonteDoEfeito("boot", manifestoComArquivo, "m4a")).toEqual({ tipo: "arquivo", url: "/audio/efeitos/boot.m4a" });
  });

  it("usa o outro formato se só ele existir", () => {
    expect(fonteDoEfeito("erro", manifestoComArquivo, "webm")).toEqual({ tipo: "arquivo", url: "/audio/efeitos/erro.m4a" });
  });

  it("cai no sintetizado quando não há arquivo (null ou fora do manifesto)", () => {
    expect(fonteDoEfeito("clique", manifestoComArquivo, "webm")).toEqual({ tipo: "sintetizado" });
    expect(fonteDoEfeito("tecla", manifestoComArquivo, "webm")).toEqual({ tipo: "sintetizado" });
  });

  it("todo id tem versão sintetizada e está no efeitos.json", () => {
    for (const id of IDS_EFEITOS) {
      expect(typeof RECEITAS[id]).toBe("function");
      expect(EFEITOS.efeitos[id], `efeitos.json sem "${id}"`).toBeDefined();
    }
    expect(Object.keys(EFEITOS.efeitos).sort()).toEqual([...IDS_EFEITOS].sort());
  });

  it("o efeitos.json documenta o formato e marca os momentos grandes para pré-carregar", () => {
    const bruto = lerJson(URL_MANIFESTO_EFEITOS) as { descricao?: string };
    expect(bruto.descricao).toMatch(/webm/);
    for (const id of EFEITOS_GRANDES) expect(EFEITOS.efeitos[id].preCarregar).toBe(true);
  });

  it("manifesto malformado não quebra: tudo cai no sintetizado", () => {
    const vazio = lerManifestoEfeitos("isso não é um manifesto");
    for (const id of IDS_EFEITOS) expect(fonteDoEfeito(id, vazio, "webm")).toEqual({ tipo: "sintetizado" });
  });
});

describe("tabela tela -> faixa", () => {
  it("cada ilha com música resolve para a faixa certa (ilha, zona, unidade e fase)", () => {
    const esperado: Record<string, string> = {
      origens: "origens",
      sites: "sites",
      logica: "logica",
      "paginas-vivas": "paginas-vivas",
      "rede-servidor": "rede-servidor",
      oficio: "oficio",
    };
    for (const [ilhaId, faixa] of Object.entries(esperado)) {
      expect(faixaTocavel({ tipo: "ilha", ilhaId }, MUSICAS)).toBe(faixa);
      expect(faixaTocavel({ tipo: "fase", ilhaId }, MUSICAS)).toBe(faixa);
    }
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ia" }, MUSICAS)).toBe("ia");
  });

  it("todas as ilhas do currículo com música têm a faixa no manifesto", () => {
    for (const ilha of CURRICULO) {
      const faixa = FAIXA_DA_ILHA[ilha.id];
      if (faixa) expect(MUSICAS.faixas[faixa], ilha.id).toBeDefined();
    }
  });

  it("o museu resolve para origens", () => {
    expect(faixaTocavel({ tipo: "museu" }, MUSICAS)).toBe("origens");
  });

  it("mapa do mundo pendente, ilha sem faixa e id desconhecido resolvem para silêncio", () => {
    expect(faixaDaTela({ tipo: "mundo" })).toBe("mapa");
    expect(MUSICAS.pendentes).toContain("mapa");
    expect(faixaTocavel({ tipo: "mundo" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "frameworks" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ilha-que-nao-existe" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "__proto__" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "fase", ilhaId: null }, MUSICAS)).toBeNull();
  });

  it("a faixa do mapa entra só com o arquivo e a entrada no manifesto", () => {
    const comMapa: ManifestoMusicas = {
      pendentes: [],
      faixas: { ...MUSICAS.faixas, mapa: { titulo: "Mapa", arquivos: { webm: "/audio/musica/mapa.webm" }, duracaoSegundos: 60 } },
    };
    expect(faixaTocavel({ tipo: "mundo" }, comMapa)).toBe("mapa");
    // Listada mas ainda pendente: continua silêncio.
    expect(faixaTocavel({ tipo: "mundo" }, { ...comMapa, pendentes: ["mapa"] })).toBeNull();
  });
});

describe("manifestos", () => {
  it("musicas.json tem as 7 faixas, com duração batendo com as amostras", () => {
    expect(Object.keys(MUSICAS.faixas).sort()).toEqual(
      ["ia", "logica", "oficio", "origens", "paginas-vivas", "rede-servidor", "sites"].sort(),
    );
    for (const [id, faixa] of Object.entries(brutoMusicas.faixas)) {
      expect(faixa.amostras / faixa.sampleRate, id).toBeCloseTo(faixa.duracaoSegundos, 3);
    }
  });

  it("todo arquivo citado em musicas.json e efeitos.json existe em public/", () => {
    const citados = [
      ...Object.values(MUSICAS.faixas).flatMap((faixa) => Object.values(faixa.arquivos)),
      ...Object.values(EFEITOS.efeitos).flatMap((efeito) => Object.values(efeito.arquivos ?? {})),
    ];
    expect(citados.length).toBeGreaterThanOrEqual(14);
    for (const url of citados) {
      expect(url.startsWith("/audio/"), url).toBe(true);
      expect(existsSync(path.join(PUBLICO, url)), url).toBe(true);
    }
  });

  it("toda música .webm tem o .m4a correspondente, com o mesmo nome", () => {
    for (const [id, faixa] of Object.entries(MUSICAS.faixas)) {
      expect(faixa.arquivos.webm, id).toBe(`/audio/musica/${id}.webm`);
      expect(faixa.arquivos.m4a, id).toBe(`/audio/musica/${id}.m4a`);
    }
  });

  it("manifesto de músicas malformado vira silêncio, sem erro", () => {
    expect(lerManifestoMusicas(null)).toEqual({ pendentes: [], faixas: {} });
    const semDuracao = lerManifestoMusicas({ faixas: { x: { arquivos: { webm: "/a.webm" } } } });
    expect(semDuracao.faixas).toEqual({});
  });
});

describe("escolha de formato", () => {
  it("webm quando o navegador toca Opus; m4a quando não", () => {
    const pergunta: string[] = [];
    const responde = (resposta: string) => (tipo: string) => {
      pergunta.push(tipo);
      return resposta;
    };
    expect(escolherFormato(responde("probably"))).toBe("webm");
    expect(escolherFormato(responde("maybe"))).toBe("webm");
    expect(escolherFormato(responde(""))).toBe("m4a");
    expect(pergunta[0]).toBe('audio/webm; codecs="opus"');
  });
});

describe("ajustes de som no progresso", () => {
  it("padrões: música 50%, efeitos 70%, voz 70%, som ligado", () => {
    expect(PROGRESSO_PADRAO).toMatchObject({ som: true, volumeMusica: 0.5, volumeEfeitos: 0.7, volumeVoz: 0.7 });
  });

  it("preserva o mudo salvo e limita os volumes entre 0 e 1", () => {
    const lido = normalizarProgresso({ som: false, volumeMusica: 3, volumeEfeitos: -1, volumeVoz: "alto" });
    expect(lido).toMatchObject({ som: false, volumeMusica: 1, volumeEfeitos: 0, volumeVoz: 0.7 });
  });
});

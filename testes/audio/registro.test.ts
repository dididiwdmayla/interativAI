/*
 * Registro de efeitos, tabela tela -> faixa, manifestos e escolha de formato.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { EFEITOS_GRANDES, fonteDoEfeito, IDS_EFEITOS, resolverEfeito } from "@/audio/efeitos";
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
const brutoEfeitos = lerJson(URL_MANIFESTO_EFEITOS) as {
  descricao: string;
  efeitos: Record<string, { descricao: string; arquivos: Record<string, string>; duracaoSegundos: number }>;
};
const EFEITOS = lerManifestoEfeitos(brutoEfeitos);

/** Os momentos grandes que chegaram gravados (audio-v2). */
const EFEITOS_GRAVADOS = [
  "boot",
  "dormir",
  "acordar",
  "esbarrao",
  "fase-concluida",
  "unidade-concluida",
  "desbloqueio",
  "insignia",
  "entrar-mapa",
  "viagem-ilha",
  "abrir-museu",
];

describe("registro de efeitos", () => {
  const manifestoComArquivo: ManifestoEfeitos = lerManifestoEfeitos({
    efeitos: {
      boot: {
        descricao: "Computador ligando",
        arquivos: { webm: "/audio/efeitos/boot.webm", m4a: "/audio/efeitos/boot.m4a" },
        duracaoSegundos: 3.584,
      },
      erro: { descricao: "Erro", arquivos: { m4a: "/audio/efeitos/erro.m4a" }, duracaoSegundos: 0.4 },
      // Entrada sem arquivo válido não vale: o id continua sintetizado.
      clique: { descricao: "Clique", arquivos: null },
    },
  });

  it("usa o arquivo quando ele está no manifesto, com a duração do manifesto", () => {
    expect(fonteDoEfeito("boot", manifestoComArquivo, "webm")).toEqual({
      tipo: "arquivo",
      url: "/audio/efeitos/boot.webm",
      duracaoSegundos: 3.584,
    });
    expect(fonteDoEfeito("boot", manifestoComArquivo, "m4a")).toMatchObject({ tipo: "arquivo", url: "/audio/efeitos/boot.m4a" });
  });

  it("usa o outro formato se só ele existir", () => {
    expect(fonteDoEfeito("erro", manifestoComArquivo, "webm")).toMatchObject({ tipo: "arquivo", url: "/audio/efeitos/erro.m4a" });
  });

  it("cai no sintetizado quando o id não está no manifesto (ou a entrada não tem arquivo)", () => {
    expect(fonteDoEfeito("clique", manifestoComArquivo, "webm")).toEqual({ tipo: "sintetizado" });
    expect(fonteDoEfeito("tecla", manifestoComArquivo, "webm")).toEqual({ tipo: "sintetizado" });
  });

  it("toca o arquivo carregado; sem arquivo no manifesto, nem tenta carregar", async () => {
    const pedidos: string[] = [];
    const carregar = async (url: string) => {
      pedidos.push(url);
      return { url };
    };
    expect(await resolverEfeito(fonteDoEfeito("boot", manifestoComArquivo, "webm"), carregar)).toEqual({
      tipo: "arquivo",
      buffer: { url: "/audio/efeitos/boot.webm" },
      duracaoSegundos: 3.584,
    });
    expect(await resolverEfeito(fonteDoEfeito("tecla", manifestoComArquivo, "webm"), carregar)).toEqual({ tipo: "sintetizado" });
    expect(pedidos).toEqual(["/audio/efeitos/boot.webm"]);
  });

  it("cai no sintetizado quando o carregamento do arquivo falha", async () => {
    const fonte = fonteDoEfeito("boot", manifestoComArquivo, "webm");
    // 404 ou formato que o navegador não abre: o carregador devolve null.
    expect(await resolverEfeito(fonte, async () => null)).toEqual({ tipo: "sintetizado" });
    // Rede caída ou decodificação que explode.
    expect(
      await resolverEfeito(fonte, async () => {
        throw new Error("falhou");
      }),
    ).toEqual({ tipo: "sintetizado" });
  });

  it("todo id tem versão sintetizada (a reserva de quem tem arquivo)", () => {
    for (const id of IDS_EFEITOS) expect(typeof RECEITAS[id], id).toBe("function");
  });

  it("o efeitos.json segue o contrato: descricao, arquivos (webm e m4a) e duracaoSegundos por id", () => {
    expect(brutoEfeitos.descricao).toMatch(/webm/);
    for (const [id, entrada] of Object.entries(brutoEfeitos.efeitos)) {
      expect(IDS_EFEITOS as readonly string[], `id "${id}" do efeitos.json fora do registro`).toContain(id);
      expect(typeof entrada.descricao, id).toBe("string");
      expect(Object.keys(entrada.arquivos).sort(), id).toEqual(["m4a", "webm"]);
      expect(entrada.duracaoSegundos, id).toBeGreaterThan(0);
      expect(EFEITOS.efeitos[id], id).toEqual({
        descricao: entrada.descricao,
        arquivos: entrada.arquivos,
        duracaoSegundos: entrada.duracaoSegundos,
      });
    }
  });

  it("os momentos grandes gravados tocam arquivo; os de interação, sintetizado", () => {
    expect(Object.keys(EFEITOS.efeitos).sort()).toEqual([...EFEITOS_GRAVADOS].sort());
    for (const id of EFEITOS_GRAVADOS) expect(EFEITOS_GRANDES, id).toContain(id);
    for (const id of IDS_EFEITOS) {
      const esperado = EFEITOS_GRAVADOS.includes(id) ? "arquivo" : "sintetizado";
      expect(fonteDoEfeito(id, EFEITOS, "webm").tipo, id).toBe(esperado);
    }
  });

  it("manifesto malformado não quebra: tudo cai no sintetizado", () => {
    for (const bruto of ["isso não é um manifesto", null, { efeitos: [] }, { efeitos: { boot: "boot.webm" } }]) {
      const lido = lerManifestoEfeitos(bruto);
      for (const id of IDS_EFEITOS) expect(fonteDoEfeito(id, lido, "webm")).toEqual({ tipo: "sintetizado" });
    }
    // Duração faltando não impede o arquivo (o fim fica sendo o do arquivo).
    const semDuracao = lerManifestoEfeitos({ efeitos: { boot: { arquivos: { webm: "/audio/efeitos/boot.webm" } } } });
    expect(fonteDoEfeito("boot", semDuracao, "webm")).toEqual({
      tipo: "arquivo",
      url: "/audio/efeitos/boot.webm",
      duracaoSegundos: null,
    });
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
      ia: "ia",
      oficio: "oficio",
    };
    for (const [ilhaId, faixa] of Object.entries(esperado)) {
      expect(faixaTocavel({ tipo: "ilha", ilhaId }, MUSICAS)).toBe(faixa);
      expect(faixaTocavel({ tipo: "fase", ilhaId }, MUSICAS)).toBe(faixa);
    }
  });

  it("o mapa do mundo resolve para mapa", () => {
    expect(faixaDaTela({ tipo: "mundo" })).toBe("mapa");
    expect(faixaTocavel({ tipo: "mundo" }, MUSICAS)).toBe("mapa");
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

  it("faixa pendente, ilha sem faixa e id desconhecido resolvem para silêncio", () => {
    expect(MUSICAS.pendentes).toEqual([]);
    const comPendente: ManifestoMusicas = { ...MUSICAS, pendentes: ["sites"] };
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "sites" }, comPendente)).toBeNull();
    expect(faixaTocavel({ tipo: "fase", ilhaId: "sites" }, comPendente)).toBeNull();
    const semMapa: ManifestoMusicas = { pendentes: ["mapa"], faixas: {} };
    expect(faixaTocavel({ tipo: "mundo" }, semMapa)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "frameworks" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ilha-que-nao-existe" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "__proto__" }, MUSICAS)).toBeNull();
    expect(faixaTocavel({ tipo: "fase", ilhaId: null }, MUSICAS)).toBeNull();
  });

  it("uma faixa nova entra só com o arquivo e a entrada no manifesto", () => {
    const semIa: ManifestoMusicas = { pendentes: ["ia"], faixas: { ...MUSICAS.faixas } };
    delete semIa.faixas.ia;
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ia" }, semIa)).toBeNull();
    const comIa: ManifestoMusicas = {
      pendentes: [],
      faixas: { ...semIa.faixas, ia: { titulo: "IA", arquivos: { webm: "/audio/musica/ia.webm" }, duracaoSegundos: 60 } },
    };
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ia" }, comIa)).toBe("ia");
    // Listada mas ainda pendente: continua silêncio.
    expect(faixaTocavel({ tipo: "ilha", ilhaId: "ia" }, { ...comIa, pendentes: ["ia"] })).toBeNull();
  });
});

describe("manifestos", () => {
  it("musicas.json tem as 8 faixas, com duração batendo com as amostras", () => {
    expect(Object.keys(MUSICAS.faixas).sort()).toEqual(
      ["ia", "logica", "mapa", "oficio", "origens", "paginas-vivas", "rede-servidor", "sites"].sort(),
    );
    for (const [id, faixa] of Object.entries(brutoMusicas.faixas)) {
      expect(faixa.amostras / faixa.sampleRate, id).toBeCloseTo(faixa.duracaoSegundos, 3);
    }
  });

  it("todo arquivo citado em musicas.json e efeitos.json existe em public/", () => {
    const citados = [
      ...Object.values(MUSICAS.faixas).flatMap((faixa) => Object.values(faixa.arquivos)),
      ...Object.values(EFEITOS.efeitos).flatMap((efeito) => Object.values(efeito.arquivos)),
    ];
    expect(citados.length).toBe(16 + 22);
    for (const url of citados) {
      expect(url.startsWith("/audio/"), url).toBe(true);
      expect(existsSync(path.join(PUBLICO, url)), url).toBe(true);
    }
  });

  it("toda música e todo efeito .webm tem o .m4a correspondente, com o mesmo nome", () => {
    for (const [id, faixa] of Object.entries(MUSICAS.faixas)) {
      expect(faixa.arquivos.webm, id).toBe(`/audio/musica/${id}.webm`);
      expect(faixa.arquivos.m4a, id).toBe(`/audio/musica/${id}.m4a`);
    }
    for (const [id, efeito] of Object.entries(EFEITOS.efeitos)) {
      expect(efeito.arquivos.webm, id).toBe(`/audio/efeitos/${id}.webm`);
      expect(efeito.arquivos.m4a, id).toBe(`/audio/efeitos/${id}.m4a`);
    }
  });

  it("toda pasta de áudio em public/ só tem arquivos citados, e cada .webm tem o seu .m4a", () => {
    for (const [pasta, citados] of [
      ["audio/musica", Object.values(MUSICAS.faixas).flatMap((faixa) => Object.values(faixa.arquivos))],
      ["audio/efeitos", Object.values(EFEITOS.efeitos).flatMap((efeito) => Object.values(efeito.arquivos))],
    ] as const) {
      const arquivos = readdirSync(path.join(PUBLICO, pasta)).filter((nome) => !nome.endsWith(".json"));
      expect(arquivos.map((nome) => `/${pasta}/${nome}`).sort(), pasta).toEqual([...citados].sort());
      for (const nome of arquivos.filter((item) => item.endsWith(".webm"))) {
        expect(arquivos, `${pasta}/${nome}`).toContain(nome.replace(/\.webm$/, ".m4a"));
      }
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

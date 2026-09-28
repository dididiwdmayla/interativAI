/*
 * Projeto-ponte, Levar pro mundo e guia de publicação (Etapa 6): os dois
 * arquivos do .zip, o formato do link publicado, os validadores do
 * projeto (temMediaQuery, cabeNaTela), o checklist de requisitos, o
 * progresso de Meus projetos e as checagens que pegam um projeto mal
 * escrito.
 */
import { strFromU8, unzipSync } from "fflate";
import { describe, expect, it } from "vitest";
import { FASES, UNIDADES } from "@/conteudo";
import { REGRAS_DE_FASE, REGRAS_GERAIS, type ContextoChecagem } from "@/conteudo/checagens";
import { FASE_P2_F1 } from "@/conteudo/ilhas/sites/publicar/unidade-2/fase-1-arquivos";
import { FASE_P2_F2 } from "@/conteudo/ilhas/sites/publicar/unidade-2/fase-2-projeto";
import { GUIA_PUBLICACAO, linkPublicadoValido } from "@/conteudo/publicacao";
import type { Fase, FaseProjetoPonte } from "@/conteudo/tipos";
import { LINHA_DO_CSS, ligaOCss, montarArquivos, NOME_CSS, NOME_HTML, nomeDoZip, zipDoProjeto } from "@/lib/exportarProjeto";
import { normalizarProgresso, PROGRESSO_PADRAO } from "@/lib/progresso";
import { semOSiteDoProjeto } from "@/lib/projetos";
import { temSimboloSemSeletorDeTexto } from "@/conteudo/checagens";
import { criarSimulacao } from "@/motor/simulacao";
import { recalcularPartesFeitas } from "@/motor/validadores";

const DOCUMENTO = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Site do Leo</title>
</head>
<body>
  <h1>Olá</h1>
</body>
</html>`;

describe("Levar pro mundo: os dois arquivos", () => {
  it("põe a linha do <link> no fim do head e separa o CSS", () => {
    const arquivos = montarArquivos(DOCUMENTO, "h1 { color: red; }");
    expect(Object.keys(arquivos)).toEqual([NOME_HTML, NOME_CSS]);
    const html = arquivos[NOME_HTML];
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain(`  ${LINHA_DO_CSS}\n</head>`);
    expect(html.indexOf(LINHA_DO_CSS)).toBeGreaterThan(html.indexOf("<title>"));
    expect(arquivos[NOME_CSS]).toBe("h1 { color: red; }");
  });

  it("não repete a linha se o jogador já escreveu (com ./ ou aspas simples)", () => {
    for (const linha of [LINHA_DO_CSS, `<link href='./style.css' rel='stylesheet'>`]) {
      const documento = DOCUMENTO.replace("</head>", `  ${linha}\n</head>`);
      expect(ligaOCss(documento)).toBe(true);
      const html = montarArquivos(documento, "")[NOME_HTML];
      expect(html.match(/<link\b/g)?.length).toBe(1);
    }
  });

  it("garante o doctype e cria o head se ele faltar", () => {
    const html = montarArquivos("<html><body><p>Oi</p></body></html>", null)[NOME_HTML];
    expect(html.startsWith("<!DOCTYPE html>\n<html>")).toBe(true);
    expect(html).toContain(`<head>\n  ${LINHA_DO_CSS}\n</head>`);
  });

  it("o .zip abre com os dois arquivos na raiz, com os textos certos (acentos inclusos)", () => {
    const arquivos = montarArquivos(DOCUMENTO.replace("Olá", "Coração"), "p::after { content: \"ação\"; }");
    const aberto = unzipSync(zipDoProjeto(arquivos));
    expect(Object.keys(aberto).sort()).toEqual([NOME_HTML, NOME_CSS].sort());
    expect(strFromU8(aberto[NOME_HTML])).toBe(arquivos[NOME_HTML]);
    expect(strFromU8(aberto[NOME_HTML])).toContain("Coração");
    expect(strFromU8(aberto[NOME_CSS])).toBe(arquivos[NOME_CSS]);
  });

  it("o nome do .zip vem do nome do projeto, sem acento", () => {
    expect(nomeDoZip("Meu primeiro site")).toBe("meu-primeiro-site.zip");
    expect(nomeDoZip("Cantinho da Bia: versão 2!")).toBe("cantinho-da-bia-versao-2.zip");
    expect(nomeDoZip("   ")).toBe("meu-site.zip");
  });

  it("na simulação, levarProMundo monta os arquivos de verdade e avisa exportouProjeto", () => {
    const simulacao = criarSimulacao(FASE_P2_F1);
    simulacao.executar([{ tipo: "levarProMundo" }]);
    expect(simulacao.contexto().eventos).toContainEqual({ tipo: "exportouProjeto", arquivos: [NOME_HTML, NOME_CSS] });
  });
});

describe("guia de publicação", () => {
  it("passos com id estável em kebab-case, sem repetição, e data verificada", () => {
    const ids = GUIA_PUBLICACAO.passos.map((passo) => passo.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(GUIA_PUBLICACAO.verificadoEm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(GUIA_PUBLICACAO.verificadoEm))).toBe(false);
  });

  it("nenhum texto do guia tem emoji", () => {
    const textos = [
      GUIA_PUBLICACAO.aviso,
      ...GUIA_PUBLICACAO.outras,
      ...GUIA_PUBLICACAO.passos.flatMap((passo) => [passo.titulo, passo.detalhe]),
    ];
    for (const texto of textos) expect(temSimboloSemSeletorDeTexto(texto), texto).toBe(false);
  });

  it("o link publicado só confere o formato", () => {
    for (const bom of ["https://meu-site.netlify.app", "https://leo.github.io/site/", "http://exemplo.com.br"]) {
      expect(linkPublicadoValido(bom), bom).toBe(true);
    }
    for (const ruim of ["meu-site.netlify.app", "https://localhost", "https://meu site.com", "javascript:alert(1)", "ftp://a.com", ""]) {
      expect(linkPublicadoValido(ruim), ruim).toBe(false);
    }
  });
});

describe("validadores do projeto", () => {
  it("temMediaQuery conta as @media do style.css (não as do navegador)", () => {
    const simulacao = criarSimulacao(FASE_P2_F2);
    expect(simulacao.avaliar({ tipo: "temMediaQuery" }).passou).toBe(false);
    simulacao.executar([{ tipo: "editarCss", posicao: "fim", texto: "@media (max-width: 600px) { h1 { color: red; } }" }]);
    expect(simulacao.avaliar({ tipo: "temMediaQuery" }).passou).toBe(true);
    expect(simulacao.avaliar({ tipo: "temMediaQuery", minimo: 2 }).passou).toBe(false);
  });

  it("cabeNaTela pega largura fixa maior que a tela e respeita a @media", () => {
    const simulacao = criarSimulacao(FASE_P2_F2);
    expect(simulacao.avaliar({ tipo: "cabeNaTela", largura: 390 }).passou).toBe(true);
    simulacao.executar([{ tipo: "editarCss", posicao: "fim", texto: "h1 { width: 600px; }" }]);
    const resultado = simulacao.avaliar({ tipo: "cabeNaTela", largura: 390 });
    expect(resultado.passou).toBe(false);
    expect(resultado.detalhe).toContain("600");
    expect(simulacao.avaliar({ tipo: "cabeNaTela", largura: 768 }).passou).toBe(true);
    simulacao.executar([{ tipo: "editarCss", posicao: "fim", texto: "@media (max-width: 600px) { h1 { width: auto; } }" }]);
    expect(simulacao.avaliar({ tipo: "cabeNaTela", largura: 390 }).passou).toBe(true);
  });

  it("o checklist do projeto marca cada requisito na hora da solução dele", () => {
    const simulacao = criarSimulacao(FASE_P2_F2);
    simulacao.comecarObjetivo(null);
    let feitas: string[] = [];
    for (const requisito of FASE_P2_F2.requisitos) {
      feitas = recalcularPartesFeitas(FASE_P2_F2, feitas, simulacao.contexto());
      expect(feitas).not.toContain(requisito.id);
      simulacao.executar(requisito.solucaoDeTeste);
      feitas = recalcularPartesFeitas(FASE_P2_F2, feitas, simulacao.contexto());
      expect(feitas).toContain(requisito.id);
    }
    expect(feitas).toHaveLength(FASE_P2_F2.requisitos.length);
  });
});

describe("Meus projetos no progresso", () => {
  it("lê o projeto salvo e descarta o que não serve", () => {
    const lido = normalizarProgresso({
      ...PROGRESSO_PADRAO,
      projetos: {
        [FASE_P2_F2.id]: { html: DOCUMENTO, css: "h1{}", atualizadoEm: 10, guia: ["baixar-zip", "baixar-zip", 3], link: "https://a.netlify.app" },
        quebrado: "nada",
      },
      ilhasComemoradas: ["sites", "sites", 7],
    });
    expect(lido.projetos[FASE_P2_F2.id]).toEqual({
      html: DOCUMENTO,
      css: "h1{}",
      atualizadoEm: 10,
      guia: ["baixar-zip"],
      link: "https://a.netlify.app",
    });
    expect(lido.projetos.quebrado).toBeUndefined();
    expect(lido.ilhasComemoradas).toEqual(["sites"]);
    expect(normalizarProgresso({}).projetos).toEqual({});
  });

  it("recomeçar zera o site, mas o guia e o link ficam", () => {
    const progresso = {
      ...PROGRESSO_PADRAO,
      projetos: { [FASE_P2_F2.id]: { html: DOCUMENTO, css: "", atualizadoEm: 1, guia: ["baixar-zip"], link: "https://a.netlify.app" } },
    };
    expect(semOSiteDoProjeto(progresso, FASE_P2_F2.id)[FASE_P2_F2.id]).toEqual({
      html: null,
      css: null,
      atualizadoEm: null,
      guia: ["baixar-zip"],
      link: "https://a.netlify.app",
    });
  });
});

describe("checagens do projeto-ponte", () => {
  const regraDeFase = (id: string) => {
    const regra = REGRAS_DE_FASE.find((item) => item.id === id);
    if (!regra) throw new Error(`regra ${id} não existe`);
    return regra;
  };
  const comFase = (fase: Fase): ContextoChecagem => ({
    unidades: UNIDADES,
    fases: FASES.map((item) => (item.id === fase.id ? fase : item)),
  });

  it("projeto sem modo documento é pego", () => {
    const sabotada = { ...FASE_P2_F2, modoDocumento: undefined } as unknown as FaseProjetoPonte;
    expect(regraDeFase("projeto-e-levar-pro-mundo").checar(sabotada, comFase(sabotada)).join("\n")).toMatch(/modoDocumento/);
  });

  it("Levar pro mundo sem style.css é pego", () => {
    const sabotada: Fase = { ...FASE_P2_F1, siteAlvo: { ...FASE_P2_F1.siteAlvo, css: undefined } };
    expect(regraDeFase("projeto-e-levar-pro-mundo").checar(sabotada, comFase(sabotada)).join("\n")).toMatch(/style\.css/);
  });

  it("projeto que apresenta ferramenta é pego", () => {
    const sabotada: FaseProjetoPonte = { ...FASE_P2_F2, apresentar: ["lighthouse"] };
    expect(regraDeFase("acoes-usam-ferramentas-da-fase").checar(sabotada, comFase(sabotada)).join("\n")).toMatch(/não apresenta/);
  });

  it("projeto que pratica conceito nunca ensinado é pego", () => {
    const sabotada: FaseProjetoPonte = { ...FASE_P2_F2, conceitos: [...FASE_P2_F2.conceitos, "position-sticky"] };
    const regra = REGRAS_GERAIS.find((item) => item.id === "revisao-depois-do-ensino");
    const semSticky: ContextoChecagem = {
      unidades: UNIDADES,
      fases: comFase(sabotada).fases.map((fase) => (fase.tipo === "pratica" ? { ...fase, conceitos: fase.conceitos.filter((id) => id !== "position-sticky") } : fase)),
    };
    expect(regra?.checar(semSticky).join("\n")).toMatch(/o projeto "sites-publicar-u2-f2" pratica "position-sticky"/);
  });

  it("requisito com pergunta longa demais é pego", () => {
    const sabotada: FaseProjetoPonte = {
      ...FASE_P2_F2,
      requisitos: FASE_P2_F2.requisitos.map((item, indice) => (indice === 0 ? { ...item, pergunta: "x".repeat(200) } : item)),
    };
    expect(regraDeFase("textos").checar(sabotada, comFase(sabotada)).join("\n")).toMatch(/pergunta com 200 caracteres/);
  });
});

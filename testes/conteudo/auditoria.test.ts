/*
 * A auditoria do painel Lighthouse (src/motor/auditoria.ts): cada
 * verificação acha o problema de verdade e não reclama da página certa;
 * as notas são a média pesada das que se aplicam (como o Lighthouse), com
 * as faixas 90 e 50; o contraste usa as cores resolvidas pelo motor
 * (variáveis, herança, fundo do ancestral, @media na tela); e os
 * validadores notaAuditoria e semProblema na simulação.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASE_BANCADA_LIGHTHOUSE } from "@/conteudo/laboratorio/bancadaLighthouse";
import type { FasePratica } from "@/conteudo/tipos";
import { auditar, faixaDaNota, IDS_REGRAS_AUDITORIA, type IdRegraAuditoria, REGRAS_AUDITORIA } from "@/motor/auditoria";
import { criarSimulacao } from "@/motor/simulacao";

const HEAD_BOM = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Boa</title><meta name="description" content="Uma página boa.">`;

function pagina(body: string, { head = HEAD_BOM, css = "", lang = ' lang="pt-BR"', doctype = "<!doctype html>" } = {}): Document {
  return new DOMParser().parseFromString(`${doctype}<html${lang}><head>${head}<style>${css}</style></head><body>${body}</body></html>`, "text/html");
}

const BOA = `<header><h1>Oi</h1><nav><a href="#fim">Ver o fim</a></nav></header><main><h2>Parte</h2><p>Texto</p><img src="x.png" alt="Uma foto"><button>Enviar</button></main><footer id="fim">Fim</footer>`;

function problemas(documento: Document): IdRegraAuditoria[] {
  return auditar(documento).problemas.map((problema) => problema.regra);
}

describe("verificações", () => {
  it("a página boa passa em tudo e tira 100", () => {
    const resultado = auditar(pagina(BOA));
    expect(resultado.problemas).toEqual([]);
    expect(resultado.notas).toEqual({ acessibilidade: 100, "boas-praticas": 100, seo: 100 });
  });

  it.each<[IdRegraAuditoria, string, Parameters<typeof pagina>[1]?]>([
    ["imagem-sem-alt", BOA.replace(' alt="Uma foto"', "")],
    ["link-sem-texto", BOA.replace("Ver o fim", "")],
    ["botao-sem-texto", BOA.replace("Enviar", "")],
    ["titulos-pulando-nivel", BOA.replace("<h2>Parte</h2>", "<h4>Parte</h4>")],
    ["sem-main", BOA.replace("<main>", "<div>").replace("</main>", "</div>")],
    ["id-duplicado", BOA.replace("<p>Texto</p>", '<p id="fim">Texto</p>')],
    ["link-generico", BOA.replace("Ver o fim", "clique aqui")],
    ["contraste", BOA, { css: "p { color: #dddddd; }" }],
    ["html-sem-lang", BOA, { lang: "" }],
    ["pagina-sem-titulo", BOA, { head: HEAD_BOM.replace("<title>Boa</title>", "") }],
    ["sem-meta-viewport", BOA, { head: HEAD_BOM.replace(/<meta name="viewport"[^>]*>/, "") }],
    ["sem-charset", BOA, { head: HEAD_BOM.replace('<meta charset="utf-8">', "") }],
    ["sem-descricao", BOA, { head: HEAD_BOM.replace(/<meta name="description"[^>]*>/, "") }],
    ["sem-doctype", BOA, { doctype: "" }],
  ])("%s: acha o problema", (regra, body, opcoes) => {
    expect(problemas(pagina(body, opcoes))).toEqual([regra]);
  });

  it("cobre todas as regras do catálogo", () => {
    expect(new Set(IDS_REGRAS_AUDITORIA).size).toBe(14);
    for (const regra of IDS_REGRAS_AUDITORIA) {
      const dados = REGRAS_AUDITORIA[regra];
      expect(dados.porQue.length, regra).toBeGreaterThan(20);
      expect(Object.keys(dados.pesos).length, regra).toBeGreaterThan(0);
    }
  });

  it("nome de link e botão: aria-label, title e o alt de uma imagem dentro valem", () => {
    const corpo = BOA.replace('<a href="#fim">Ver o fim</a>', '<a href="#fim" aria-label="Ir ao fim"></a><a href="#fim"><img src="s.svg" alt="Sobre"></a>').replace(
      "<button>Enviar</button>",
      '<button title="Enviar"></button>',
    );
    expect(problemas(pagina(corpo))).toEqual([]);
  });

  it("o que não se vê não conta (display: none, hidden, aria-hidden)", () => {
    const corpo = `${BOA}<img src="y.png" style="display:none"><div hidden><button></button></div><a href="#" aria-hidden="true"></a>`;
    expect(problemas(pagina(corpo))).toEqual([]);
  });

  it("não se aplica: sem imagem, sem link, sem botão e um título só", () => {
    const resultado = auditar(pagina("<main><h1>Só um título</h1><p>Texto</p></main>"));
    expect(resultado.naoSeAplicam).toEqual(expect.arrayContaining(["imagem-sem-alt", "link-sem-texto", "botao-sem-texto", "titulos-pulando-nivel", "link-generico"]));
    expect(resultado.notas.acessibilidade).toBe(100);
  });
});

describe("contraste com o motor de cascata", () => {
  it("resolve variáveis, herança e o fundo do ancestral", () => {
    const css = ":root { --apagado: #cccccc; } main { background-color: #ffffff; } .aviso { color: var(--apagado); }";
    const resultado = auditar(pagina(BOA.replace("<p>Texto</p>", '<p class="aviso">Texto</p>'), { css }));
    const contraste = resultado.problemas.find((problema) => problema.regra === "contraste");
    expect(contraste?.elementos.map((elemento) => elemento.className)).toEqual(["aviso"]);
    expect(contraste?.detalhes[0]).toMatch(/^1,6:1, o mínimo aqui é 4,5:1$/);
  });

  it("texto grande (24 px, ou 18,66 px em negrito) pede só 3:1", () => {
    const css = "p { color: #888888; }";
    expect(problemas(pagina(BOA, { css }))).toEqual(["contraste"]);
    expect(problemas(pagina(BOA, { css: `${css} p { font-size: 24px; }` }))).toEqual([]);
    expect(problemas(pagina(BOA, { css: `${css} p { font-size: 19px; font-weight: bold; }` }))).toEqual([]);
  });

  it("fundo com imagem ou gradiente fica de fora (como o Lighthouse, que deixa para conferir à mão)", () => {
    expect(problemas(pagina(BOA, { css: "main { background-image: linear-gradient(white, white); } p { color: #eeeeee; }" }))).toEqual([]);
  });

  it("segue a @media da tela informada (o modo dispositivo)", () => {
    const documento = pagina(BOA, { css: "@media (max-width: 600px) { p { color: #eeeeee; } }" });
    expect(auditar(documento).problemas).toEqual([]);
    expect(auditar(documento, { tela: { largura: 390, altura: 844 } }).problemas.map((problema) => problema.regra)).toEqual(["contraste"]);
  });
});

describe("notas", () => {
  it("média pesada das verificações que se aplicam, como o Lighthouse", () => {
    // Sem alt (peso 10) e sem lang (7): 10 + 7 de 54 perdidos na Acessibilidade.
    const resultado = auditar(pagina(BOA.replace(' alt="Uma foto"', ""), { lang: "" }));
    const total = 10 + 7 + 3 + 7 + 10 + 7 + 7 + 3;
    expect(resultado.notas.acessibilidade).toBe(Math.round(((total - 17) / total) * 100));
    // No SEO, a imagem pesa 1 de 4.
    expect(resultado.notas.seo).toBe(75);
  });

  it("faixas: 90 ou mais boa, 50 a 89 média, abaixo de 50 ruim", () => {
    expect([faixaDaNota(100), faixaDaNota(90), faixaDaNota(89), faixaDaNota(50), faixaDaNota(49), faixaDaNota(0)]).toEqual([
      "boa",
      "boa",
      "media",
      "media",
      "ruim",
      "ruim",
    ]);
  });
});

describe("validadores e ação do Lighthouse", () => {
  it("semProblema e notaAuditoria olham a página de agora; analisarAuditoria gera auditou", () => {
    const sim = criarSimulacao(FASE_BANCADA_LIGHTHOUSE);
    expect(sim.avaliar({ tipo: "semProblema", regra: "imagem-sem-alt" }).passou).toBe(false);
    expect(sim.avaliar({ tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 90 })).toMatchObject({ passou: false, detalhe: "nota 26" });
    sim.executar([{ tipo: "analisarAuditoria" }]);
    expect(sim.contexto().eventos.at(-1)).toMatchObject({ tipo: "auditou", notas: { acessibilidade: 26 } });
    sim.executar(FASE_BANCADA_LIGHTHOUSE.objetivos[1].solucaoDeTeste);
    expect(sim.avaliar({ tipo: "semProblema", regra: "imagem-sem-alt" }).passou).toBe(true);
    sim.executar(FASE_BANCADA_LIGHTHOUSE.objetivos[2].solucaoDeTeste);
    expect(sim.avaliar({ tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 90 }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "semProblema", regra: "id-duplicado" }).passou).toBe(false);
  });

  it("sabotagem: validadores do Lighthouse sem a ferramenta e nota fora de 0 a 100", () => {
    const regra = REGRAS_DE_FASE.find((item) => item.id === "ferramentas-dos-validadores");
    if (!regra) throw new Error("ferramentas-dos-validadores");
    const [primeiro, segundo] = FASE_BANCADA_LIGHTHOUSE.objetivos;
    const sem: FasePratica = {
      ...FASE_BANCADA_LIGHTHOUSE,
      usaFerramentas: FASE_BANCADA_LIGHTHOUSE.usaFerramentas.filter((id) => id !== "lighthouse"),
      objetivos: [primeiro, { ...segundo, validador: { tipo: "notaAuditoria", categoria: "seo", minimo: 120 } }],
    };
    const problemasDaRegra = regra.checar(sem, { unidades: [], fases: [sem] }).join("\n");
    expect(problemasDaRegra).toContain('o validador notaAuditoria pede "lighthouse"');
    expect(problemasDaRegra).toContain("notaAuditoria com minimo 120");
  });
});

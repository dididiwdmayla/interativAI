/*
 * CSS no formato declarativo: a folha editável do site-alvo, as ações
 * (definirPropriedade, alternarDeclaracao, adicionarRegra, editarCss), os
 * validadores (valorEfetivo, declaracao, regraExiste, riscada), o desfazer
 * com HTML e CSS juntos e as checagens da fábrica para fases de CSS.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASES_LABORATORIO } from "@/conteudo/laboratorio/bancadaEstilos";
import type { FasePratica, Validador } from "@/conteudo/tipos";
import { criarSimulacao } from "@/motor/simulacao";

const CSS = `body {
  font-family: Arial, sans-serif;
  color: #333333;
}

h1 {
  color: #8b4513;
  font-size: 28px;
}

.preco {
  color: green;
}

#destaque .preco {
  color: red;
}`;

const FASE: FasePratica = {
  id: "teste-u0-f1",
  tipo: "pratica",
  unidadeId: "teste-u0",
  titulo: "Teste de CSS",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["editor-css"],
  apresentar: ["editor-css"],
  paineisElementos: ["estilos"],
  introducao: [{ texto: "Oi", expressao: "feliz" }],
  conclusao: [{ texto: "Tchau", expressao: "feliz" }],
  siteAlvo: {
    url: "cafe.site",
    titulo: "Café",
    head: "<title>Café</title><style>p { margin: 0; }</style>",
    body: `<h1 id="titulo">Café da Praça</h1>
<ul id="cardapio">
  <li class="item"><span class="preco">R$ 5</span></li>
  <li class="item" id="destaque"><span class="preco">R$ 7</span></li>
</ul>`,
    css: CSS,
  },
  objetivos: [
    {
      id: "cor-titulo",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Troque a cor do título.", toque: "Troque a cor do título." },
      validador: { tipo: "valorEfetivo", seletor: "#titulo", propriedade: "color", valor: "#1e90ff" },
      ajudas: {
        pergunta: "Qual regra pinta o título?",
        dica: "A cor do texto é a propriedade color.",
        linha: { alvo: "css", seletorRegra: "h1", propriedade: "color", fala: "É esta linha." },
        solucao: {
          fala: "Troquei a cor.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "dodgerblue" }],
        },
      },
      falaAoConcluir: { texto: "Azul!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "rgb(30, 144, 255)" }],
    },
    {
      id: "desligar-preco",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Desligue a cor verde do preço.", toque: "Desligue a cor verde do preço." },
      validador: { tipo: "declaracao", seletorRegra: ".preco", propriedade: "color", ativa: false },
      ajudas: { pergunta: "Onde está o verde?", dica: "A checkbox desliga sem apagar." },
      falaAoConcluir: { texto: "Desligou!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "alternarDeclaracao", seletorRegra: ".preco", propriedade: "color" }],
    },
  ],
};

function simulacao() {
  return criarSimulacao(FASE);
}

describe("CSS na simulação (o mesmo núcleo da interface)", () => {
  it("a folha editável entra no documento e vale na cascata", () => {
    const sim = simulacao();
    expect(sim.cssAtual()).toBe(CSS);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "#titulo", propriedade: "color", valor: "#8b4513" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "#titulo", propriedade: "font-family", valor: "Arial, sans-serif" }).passou).toBe(true);
    // O head fixo também entra na cascata (p { margin: 0 }).
    expect(sim.avaliar({ tipo: "regraExiste", seletorRegra: "p" }).passou).toBe(true);
  });

  it("definirPropriedade troca o valor ou acrescenta, e gera editouPropriedade", () => {
    const sim = simulacao();
    sim.comecarObjetivo(null);
    sim.executar([{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "text-align", valor: "center" }]);
    expect(sim.cssAtual()).toContain("  text-align: center;\n}");
    expect(sim.avaliar({ tipo: "evento", evento: "editouPropriedade" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "declaracao", seletorRegra: "h1", propriedade: "text-align", valor: "center", ativa: true }).passou).toBe(true);
    expect(() => sim.executar([{ tipo: "definirPropriedade", seletorRegra: ".nao-existe", propriedade: "color", valor: "red" }])).toThrow(
      /não deu para definir color na regra ".nao-existe"/,
    );
  });

  it("alternarDeclaracao comenta a declaração, e a cascata passa para a próxima", () => {
    const sim = simulacao();
    sim.comecarObjetivo(null);
    const preco: Validador = { tipo: "valorEfetivo", seletor: ".item:not(#destaque) .preco", propriedade: "color", valor: "#333" };
    expect(sim.avaliar(preco).passou).toBe(false);
    sim.executar([{ tipo: "alternarDeclaracao", seletorRegra: ".preco", propriedade: "color" }]);
    expect(sim.cssAtual()).toContain("/* color: green; */");
    // Sem a regra .preco, a cor vem herdada do body.
    expect(sim.avaliar(preco).passou).toBe(true);
    expect(sim.avaliar({ tipo: "evento", evento: "alternouDeclaracao" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "declaracao", seletorRegra: ".preco", propriedade: "color", ativa: false }).passou).toBe(true);
  });

  it("riscada: a regra .preco perde para #destaque .preco só no item em destaque", () => {
    const sim = simulacao();
    expect(sim.avaliar({ tipo: "riscada", seletor: "#destaque .preco", propriedade: "color", seletorRegra: ".preco" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "riscada", seletor: ".item:first-child .preco", propriedade: "color", seletorRegra: ".preco" }).passou).toBe(false);
  });

  it("adicionarRegra e editarCss escrevem no fim da folha", () => {
    const sim = simulacao();
    sim.comecarObjetivo(null);
    sim.executar([
      { tipo: "adicionarRegra", seletorRegra: "#cardapio", declaracoes: [{ propriedade: "padding", valor: "0" }] },
      { tipo: "editarCss", posicao: "fim", texto: ".item { list-style: none; }" },
    ]);
    expect(sim.avaliar({ tipo: "regraExiste", seletorRegra: "#cardapio" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "#cardapio", propriedade: "padding", valor: "0" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: ".item", propriedade: "list-style-type", valor: "none" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "evento", evento: "adicionouRegra" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "evento", evento: "editouCss" }).passou).toBe(true);
  });

  it("desfazer volta o CSS (e refazer vai de novo), na mesma pilha do HTML", () => {
    const sim = simulacao();
    sim.executar([
      { tipo: "definirTexto", seletor: "#titulo", valor: "Café Novo" },
      { tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "purple" },
    ]);
    expect(sim.cssAtual()).toContain("color: purple");
    sim.executar([{ tipo: "desfazer" }]);
    expect(sim.cssAtual()).toBe(CSS);
    expect(sim.htmlAtual()).toContain("Café Novo");
    sim.executar([{ tipo: "desfazer" }]);
    expect(sim.htmlAtual()).toContain("Café da Praça");
    expect(sim.nucleo.refazer()).toBe(true);
    expect(sim.nucleo.refazer()).toBe(true);
    expect(sim.cssAtual()).toContain("color: purple");
  });

  it("valorEfetivo normaliza cor, número e atalho; incerto não passa", () => {
    const sim = simulacao();
    sim.executar([{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "margin", valor: "0 auto" }]);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "h1", propriedade: "margin", valor: "0px auto 0 auto" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "h1", propriedade: "margin-left", valor: "auto" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "h1", propriedade: "font-size", valor: "28.0px" }).passou).toBe(true);
    expect(sim.avaliar({ tipo: "valorEfetivo", seletor: "h1", propriedade: "font-weight", valor: "700" }).passou).toBe(true);
    sim.executar([{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "box-shadow", valor: "0 1px 2px black" }]);
    const incerto = sim.avaliar({ tipo: "valorEfetivo", seletor: "h1", propriedade: "box-shadow", valor: "0 1px 2px black" });
    expect(incerto.passou).toBe(false);
    expect(incerto.detalhe).toContain("incerto");
  });

  it("ações de CSS numa fase sem CSS explicam o problema", () => {
    const semCss = criarSimulacao({ ...FASE, siteAlvo: { ...FASE.siteAlvo, css: undefined } });
    expect(() => semCss.executar([{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "color", valor: "red" }])).toThrow(
      /não tem CSS editável/,
    );
  });
});

describe("checagens de fases de CSS", () => {
  function problemas(fase: FasePratica): string[] {
    const contexto = { unidades: [], fases: [fase] };
    return REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(fase, contexto)));
  }

  it("a fase de exemplo passa em todas as regras de fase", () => {
    expect(problemas(FASE)).toEqual([]);
  });

  it("as fases da bancada do motor (/lab/fases) passam em todas as regras de fase", () => {
    for (const fase of FASES_LABORATORIO) expect(problemas(fase), fase.id).toEqual([]);
  });

  it("sabotagem: usar CSS sem siteAlvo.css", () => {
    const sabotada = { ...FASE, siteAlvo: { ...FASE.siteAlvo, css: undefined } };
    expect(problemas(sabotada).join("\n")).toContain("mas o site-alvo não tem css");
  });

  it("sabotagem: valorEfetivo numa propriedade que o motor não conhece", () => {
    const [primeiro, segundo] = FASE.objetivos;
    const sabotada: FasePratica = {
      ...FASE,
      objetivos: [{ ...primeiro, validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "box-shadow", valor: "none" } }, segundo],
    };
    expect(problemas(sabotada).join("\n")).toContain('não conhece os valores de "box-shadow"');
  });

  it("sabotagem: seletorRegra que não é CSS válido", () => {
    const [primeiro, segundo] = FASE.objetivos;
    const sabotada: FasePratica = {
      ...FASE,
      objetivos: [primeiro, { ...segundo, validador: { tipo: "declaracao", seletorRegra: ".preco[", propriedade: "color" } }],
    };
    expect(problemas(sabotada).join("\n")).toContain('o seletorRegra ".preco[" não é CSS válido');
  });
});

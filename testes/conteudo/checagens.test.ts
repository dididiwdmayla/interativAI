/*
 * As checagens pegam o que devem pegar: cada teste sabota um conteúdo de
 * propósito e confere que a regra falha com uma mensagem clara.
 */
import { describe, expect, it } from "vitest";
import { FASES, UNIDADES } from "@/conteudo";
import { REGRAS_DE_FASE, REGRAS_GERAIS, type ContextoChecagem } from "@/conteudo/checagens";
import { FASE_U1_F2 } from "@/conteudo/ilhas/sites/elementos/unidade-1/fase-2";
import { FASE_U1_F3 } from "@/conteudo/ilhas/sites/elementos/unidade-1/fase-3-desafio";
import { conferirPublicados, montarPublicados, PUBLICADOS } from "@/conteudo/publicados";
import type { Fase, FaseDesafio, FasePratica } from "@/conteudo/tipos";

const CONTEXTO: ContextoChecagem = { unidades: UNIDADES, fases: FASES };

function regraDeFase(id: string) {
  const regra = REGRAS_DE_FASE.find((item) => item.id === id);
  if (!regra) throw new Error(`regra ${id} não existe`);
  return regra;
}

function regraGeral(id: string) {
  const regra = REGRAS_GERAIS.find((item) => item.id === id);
  if (!regra) throw new Error(`regra ${id} não existe`);
  return regra;
}

/** O contexto real com uma fase trocada por outra versão. */
function comFase(fase: Fase): ContextoChecagem {
  return { unidades: UNIDADES, fases: FASES.map((item) => (item.id === fase.id ? fase : item)) };
}

describe("simulação do desafio usa o checklist do motor", () => {
  const DESAFIO: FaseDesafio = {
    id: "teste-u0-f2",
    tipo: "desafio",
    unidadeId: "teste-u0",
    titulo: "Teste",
    conceitos: ["editar-texto"],
    revisa: [],
    prerequisitos: [],
    usaFerramentas: ["editar-duplo-clique"],
    introducao: [{ texto: "Oi", expressao: "feliz" }],
    conclusao: [{ texto: "Tchau", expressao: "feliz" }],
    siteAlvo: {
      url: "teste.site",
      titulo: "Teste",
      head: "<title>Teste</title>",
      body: `<h1 id="titulo">Original</h1><p id="texto">Texto</p>`,
    },
    partes: [
      {
        id: "trocar-titulo",
        descricao: "Trocar o título",
        validador: { tipo: "textoIgual", seletor: "#titulo", valor: "Novo" },
        revisarEm: "teste-u0-f1",
        solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#titulo", valor: "Novo" }],
      },
      {
        id: "trocar-texto",
        descricao: "Trocar o parágrafo",
        validador: { tipo: "textoIgual", seletor: "#texto", valor: "Outro" },
        revisarEm: "teste-u0-f1",
        solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#texto", valor: "Outro" }],
      },
    ],
  };

  it("o desafio certinho passa", () => {
    expect(regraDeFase("solucoes-de-teste").checar(DESAFIO, CONTEXTO)).toEqual([]);
  });

  it("sabotagem: uma parte posterior desfaz a anterior e a checagem falha", () => {
    const sabotado: FaseDesafio = {
      ...DESAFIO,
      partes: [
        DESAFIO.partes[0],
        {
          ...DESAFIO.partes[1],
          // Troca o parágrafo, mas devolve o título ao original: a parte 1 desmarca.
          solucaoDeTeste: [
            { tipo: "definirTexto", seletor: "#texto", valor: "Outro" },
            { tipo: "definirTexto", seletor: "#titulo", valor: "Original" },
          ],
        },
      ],
    };
    const problemas = regraDeFase("solucoes-de-teste").checar(sabotado, CONTEXTO);
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('a parte "trocar-titulo" (avaliada ao vivo) não passa mais');
    expect(problemas[0]).toContain("desfez o efeito dela");
    expect(problemas[0]).toContain('texto de #titulo igual a "Novo"');
  });

  it("parte travada (seleção) continua marcada mesmo perdendo a seleção depois", () => {
    const comSelecao: FaseDesafio = {
      ...DESAFIO,
      usaFerramentas: ["arvore", "editar-duplo-clique"],
      partes: [
        {
          id: "selecionar-titulo",
          descricao: "Selecionar o título",
          validador: { tipo: "selecionado", seletor: "#titulo" },
          revisarEm: "teste-u0-f1",
          solucaoDeTeste: [{ tipo: "selecionar", seletor: "#titulo" }],
        },
        DESAFIO.partes[1],
      ],
    };
    expect(regraDeFase("solucoes-de-teste").checar(comSelecao, CONTEXTO)).toEqual([]);
  });
});

describe("fase só de sozinho", () => {
  it("todos os objetivos sozinho com conceitos preenchidos falha", () => {
    const errada: FasePratica = { ...FASE_U1_F2, conceitos: ["tag"], pratica: FASE_U1_F2.pratica };
    const problemas = regraDeFase("fase-so-sozinho").checar(errada, comFase(errada));
    expect(problemas.join("\n")).toContain('todos os objetivos são sozinho, então a fase só treina: conceitos precisa ficar vazio e "tag" vão para pratica');
  });

  it("objetivo guiado numa fase que só treina falha", () => {
    const [primeiro, ...resto] = FASE_U1_F2.objetivos;
    const guiado: FasePratica = {
      ...FASE_U1_F2,
      objetivos: [
        {
          ...primeiro,
          modo: "guiado",
          ajudas: {
            pergunta: "?",
            dica: "!",
            linha: { alvo: "arvore", seletor: "h2", fala: "Aqui." },
            solucao: { fala: "Assim.", acoes: [{ tipo: "selecionar", seletor: "h2" }] },
          },
        },
        ...resto,
      ],
    };
    const problemas = regraDeFase("fase-so-sozinho").checar(guiado, comFase(guiado));
    expect(problemas.join("\n")).toContain('objetivo 1 "achar-sabores-sozinho" é um objetivo guiado, mas a fase só treina');
  });

  it("sem conceitos e sem pratica falha", () => {
    const vazia: FasePratica = { ...FASE_U1_F2, pratica: [] };
    const problemas = regraDeFase("conceitos-do-catalogo").checar(vazia, comFase(vazia));
    expect(problemas.join("\n")).toContain("nem treina (pratica) nenhum conceito");
  });

  it("pratica de conceito que nenhuma fase anterior ensinou falha", () => {
    const adiantada: FasePratica = { ...FASE_U1_F2, pratica: ["duplicar-elemento"] };
    const problemas = regraGeral("revisao-depois-do-ensino").checar(comFase(adiantada));
    expect(problemas.join("\n")).toContain('treina (pratica) "duplicar-elemento", que nenhuma fase anterior ensinou');
  });
});

describe("revisarEm aponta para a fase guiada", () => {
  it("apontar para a fase só de sozinho (u1-f2) falha", () => {
    const desafio: FaseDesafio = {
      ...FASE_U1_F3,
      partes: FASE_U1_F3.partes.map((parte) => ({ ...parte, revisarEm: "sites-elementos-u1-f2" })),
    };
    const problemas = regraDeFase("partes-do-desafio").checar(desafio, comFase(desafio));
    expect(problemas).toHaveLength(desafio.partes.length);
    expect(problemas[0]).toContain('revisarEm "sites-elementos-u1-f2" não tem nenhum objetivo guiado');
  });
});

describe("meta.desafioId", () => {
  it("apontar para o desafio de outra unidade falha", () => {
    const [u1, u2] = UNIDADES;
    const unidades = [{ ...u1, meta: { ...u1.meta, desafioId: "sites-elementos-u2-f4" } }, u2];
    const problemas = regraGeral("meta-e-desafio").checar({ unidades, fases: FASES });
    expect(problemas.join("\n")).toContain('meta.desafioId "sites-elementos-u2-f4" é da unidade "sites-elementos-u2", não da "sites-elementos-u1"');
  });
});

describe("congelamento do conteúdo publicado", () => {
  it("o registro atual bate com o conteúdo", () => {
    expect(conferirPublicados(PUBLICADOS, CONTEXTO)).toEqual([]);
  });

  it("sabotagem: id de objetivo publicado alterado falha com mensagem clara", () => {
    const sabotada: FasePratica = {
      ...FASE_U1_F2,
      objetivos: FASE_U1_F2.objetivos.map((objetivo) =>
        objetivo.id === "trocar-sabor" ? { ...objetivo, id: "trocar-o-sabor" } : objetivo,
      ),
    };
    const problemas = conferirPublicados(PUBLICADOS, comFase(sabotada));
    expect(problemas).toHaveLength(1);
    expect(problemas[0]).toContain('a fase publicada "sites-elementos-u1-f2" mudou os objetivos');
    expect(problemas[0]).toContain('sumiram "trocar-sabor"');
    expect(problemas[0]).toContain("apaga o progresso de quem já jogou");
  });

  it("sabotagem: fase publicada com id novo falha", () => {
    const renomeada: FasePratica = { ...FASE_U1_F2, id: "sites-elementos-u1-f2b" };
    const fases = FASES.map((fase) => (fase.id === FASE_U1_F2.id ? renomeada : fase));
    const problemas = conferirPublicados(PUBLICADOS, { unidades: UNIDADES, fases });
    expect(problemas.join("\n")).toContain('a fase publicada "sites-elementos-u1-f2" sumiu ou mudou de id');
  });

  it("objetivos em outra ordem também falham (o progresso guarda a posição)", () => {
    const [a, b, ...resto] = FASE_U1_F2.objetivos;
    const trocada: FasePratica = { ...FASE_U1_F2, objetivos: [b, a, ...resto] };
    const problemas = conferirPublicados(PUBLICADOS, comFase(trocada));
    expect(problemas.join("\n")).toContain("a ordem mudou");
  });

  it("conteúdo novo, ainda não publicado, é livre", () => {
    const vazio = { unidades: {}, fases: {} };
    expect(conferirPublicados(vazio, CONTEXTO)).toEqual([]);
    expect(Object.keys(montarPublicados(CONTEXTO).fases)).toEqual(FASES.map((fase) => fase.id));
  });
});

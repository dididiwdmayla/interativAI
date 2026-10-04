/*
 * Composição de áreas de trabalho (src/motor/composicao.ts): a fase declara
 * as áreas e o motor monta a tela. Aqui: as regras da fábrica, a simulação
 * de uma fase composta (o quadro e o Snippet juntos) e as sabotagens.
 */
import { describe, expect, it } from "vitest";
import { REGRAS_DE_FASE } from "@/conteudo/checagens";
import { FASES, UNIDADES } from "@/conteudo";
import type { Fase } from "@/conteudo/tipos";
import {
  CODIGO_MEDIA,
  COMENTARIOS_MEDIA,
  FASE_DEMO_DESAFIO_RESOLVER,
  FASE_DEMO_RESOLVER,
  FASES_BANCADA_RESOLVER,
  PLANO_MEDIA,
  UNIDADE_BANCADA_RESOLVER,
} from "@/conteudo/laboratorio/bancadaResolver";
import { conferirOrdem, type DadosOrdenar, estadoInicialOrdenar, type EstadoOrdenar, porPasso } from "@/motor/ordenar/modelo";
import { codigoComPlano, linhaDoPasso, passosNoCodigo, planoDosComentarios } from "@/motor/plano/comentarios";
import { avaliarDetalhado, recalcularPartesFeitas } from "@/motor/validadores";
import { areasDaFase, faseComposta, quadroDaFase, temArea } from "@/motor/composicao";
import { composicaoDoDesafio, criarSimulacao } from "@/motor/simulacao";
import { semPagina } from "@/motor/tiposDeFase";

function problemas(fase: Fase): string[] {
  return REGRAS_DE_FASE.flatMap((regra) => (regra.id === "partes-do-desafio" ? [] : regra.checar(fase, { unidades: [], fases: [fase] }).map((p) => `${regra.id}: ${p}`)));
}

describe("composição de áreas: o formato", () => {
  it("a fase composta do /lab passa em todas as regras de fase", () => {
    expect(problemas(FASE_DEMO_RESOLVER)).toEqual([]);
  });

  it("as áreas saem na ordem da tela e o quadro vem do campo plano", () => {
    const embaralhada = { ...FASE_DEMO_RESOLVER, areas: ["palco", "snippet", "plano"] as typeof FASE_DEMO_RESOLVER.areas };
    expect(areasDaFase(embaralhada)).toEqual(["plano", "snippet", "palco"]);
    expect(faseComposta(FASE_DEMO_RESOLVER)).toBe(true);
    expect(temArea(FASE_DEMO_RESOLVER, "plano")).toBe(true);
    expect(quadroDaFase(FASE_DEMO_RESOLVER)?.problema).toBe("Calcular a média das notas");
    expect(semPagina(FASE_DEMO_RESOLVER)).toBe(true);
  });

  it("as zonas anteriores à resolução preservam suas telas publicadas", () => {
    const inicio = UNIDADES.findIndex((unidade) => unidade.id === "logica-resolvendo-problemas-u1");
    const anteriores = new Set(UNIDADES.slice(0, inicio).map((unidade) => unidade.id));
    expect(FASES.filter((fase) => anteriores.has(fase.unidadeId) && faseComposta(fase)).map((fase) => fase.id)).toEqual([]);
  });
});

describe("composição de áreas: a simulação", () => {
  it("o quadro e o Snippet funcionam juntos, na mesma fase", () => {
    const simulacao = criarSimulacao(FASE_DEMO_RESOLVER);
    simulacao.comecarObjetivo(null);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(false);
    simulacao.executar(FASE_DEMO_RESOLVER.objetivos[0].solucaoDeTeste);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    // Outra ordem que respeita as dependências também vale (a lista vazia pode vir depois da soma).
    simulacao.executar([{ tipo: "porPasso", passo: "vazia", posicao: 2 }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(true);
    simulacao.executar([
      { tipo: "definirSnippet", codigo: CODIGO_MEDIA },
      { tipo: "executarSnippet" },
    ]);
    const programar = FASE_DEMO_RESOLVER.objetivos.find((objetivo) => objetivo.id === "programar");
    expect(programar && simulacao.avaliar(programar.validador).passou).toBe(true);
    // O plano continua editável depois do código; sem o bloco do plano no código, mexer nele não mexe no Snippet.
    simulacao.executar([{ tipo: "tirarPasso", passo: "devolver" }]);
    expect(simulacao.avaliar({ tipo: "ordemValida" }).passou).toBe(false);
    expect(simulacao.programa().snippet).toBe(CODIGO_MEDIA);
  });
});

describe("composição de áreas: sabotagens", () => {
  const texto = (fase: Fase) => problemas(fase).join("\n");

  it("sem a área snippet, área sem o campo e campo sem a área", () => {
    expect(texto({ ...FASE_DEMO_RESOLVER, areas: ["plano", "palco"] })).toContain('fase composta pede a área "snippet"');
    expect(texto({ ...FASE_DEMO_RESOLVER, plano: undefined })).toContain('a área "plano" pede o campo plano');
    expect(texto({ ...FASE_DEMO_RESOLVER, areas: undefined })).toContain('a fase tem plano, mas não declara a área "plano"');
    expect(texto({ ...FASE_DEMO_RESOLVER, programa: {} })).toContain('a área "snippet" pede programa.snippet');
  });

  it("ferramenta de uma área que a fase não declara, e a área sem a ferramenta", () => {
    const semPalco = { ...FASE_DEMO_RESOLVER, areas: ["plano", "snippet"] as typeof FASE_DEMO_RESOLVER.areas };
    const t = texto(semPalco);
    expect(t).toContain('usaFerramentas tem "palco-memoria", mas a fase não declara a área "palco"');
    expect(t).toContain('a linha do tempo mora no palco');
    const semQuadro = { ...FASE_DEMO_RESOLVER, usaFerramentas: FASE_DEMO_RESOLVER.usaFerramentas.filter((id) => id !== "quadro-de-passos") };
    expect(texto(semQuadro)).toContain('a área "plano" pede "quadro-de-passos"');
    const semBotao = { ...FASE_DEMO_RESOLVER, usaFerramentas: FASE_DEMO_RESOLVER.usaFerramentas.filter((id) => id !== "plano-no-codigo") };
    expect(texto(semBotao)).toContain('ponha "plano-no-codigo" em usaFerramentas');
  });

  it("a área plano não roda o plano", () => {
    const comRodar = { ...FASE_DEMO_RESOLVER, plano: { ...FASE_DEMO_RESOLVER.plano!, rodar: true as const } };
    expect(texto(comRodar)).toContain("a área plano não roda o plano");
  });
});

describe("o plano no código: comentários", () => {
  const dados = PLANO_MEDIA;
  const estado = (ids: string[]) => {
    let atual = estadoInicialOrdenar(dados);
    for (const id of ids) atual = porPasso(dados, atual, id) as EstadoOrdenar;
    return atual;
  };
  const certo = estado(["vazia", "zerar", "somar", "dividir", "devolver"]);

  it("leva o plano pro topo do código, na ordem do aluno, sem apagar o que já existe", () => {
    const codigo = "function media(notas) {\n  return 0;\n}";
    const novo = codigoComPlano(codigo, dados, certo, true);
    expect(novo).toBe(
      [
        "// Plano: Calcular a média das notas",
        "// 1. Se não tiver nenhuma nota, devolver 0",
        "// 2. Começar a soma em zero",
        "// 3. Somar cada nota na soma",
        "// 4. Dividir a soma pela quantidade de notas",
        "// 5. Devolver a média",
        "",
        codigo,
      ].join("\n"),
    );
    expect(codigoComPlano("", dados, certo, true).endsWith("// 5. Devolver a média\n")).toBe(true);
  });

  it("mexer no plano reescreve só o bloco: o código do aluno fica", () => {
    const codigoDoAluno = "\nfunction media(notas) {\n  // um comentário meu\n  return 0;\n}\n";
    const comPlano = codigoComPlano(codigoDoAluno, dados, certo, true);
    const trocado = codigoComPlano(comPlano, dados, estado(["zerar", "vazia", "somar", "dividir", "devolver"]), false);
    expect(trocado).toContain("// 1. Começar a soma em zero\n// 2. Se não tiver nenhuma nota, devolver 0");
    expect(trocado.endsWith(codigoDoAluno)).toBe(true);
    // Sem o bloco (o aluno apagou), mexer no plano não põe o bloco de volta sozinho.
    expect(codigoComPlano(codigoDoAluno, dados, certo, false)).toBe(codigoDoAluno);
    // Bloco recuado (dentro da função): o recuo continua.
    const recuado = "function media(notas) {\n  // Plano: x\n  // 1. Devolver a média\n  return 0;\n}";
    expect(codigoComPlano(recuado, dados, estado(["devolver"]), false)).toBe("function media(notas) {\n  // Plano: Calcular a média das notas\n  // 1. Devolver a média\n  return 0;\n}");
  });

  it("lê os comentários de volta como plano, mesmo espalhados pelo código", () => {
    const espalhado = [
      "// Plano: Calcular a média das notas",
      "function media(notas) {",
      "  // 1. se nao tiver nenhuma nota, devolver 0.",
      "  if (notas.length === 0) return 0;",
      "  // 2. Começar a soma em zero",
      "  let soma = 0;",
      "  // 3. Somar cada nota na soma",
      "  // 4. Dividir a soma pela quantidade de notas",
      "  // 5. Devolver a média",
      "  return soma / notas.length; // 9. Pôr as notas em ordem (comentário no fim da linha não conta)",
      "}",
    ].join("\n");
    const { estado: lido, achados } = planoDosComentarios(dados, espalhado);
    expect(achados).toBe(5);
    expect(lido.listas.plano).toEqual(["vazia", "zerar", "somar", "dividir", "devolver"]);
    expect(linhaDoPasso(dados, espalhado, "zerar")).toBe(5);
    expect(linhaDoPasso(dados, espalhado, "ordenar")).toBeNull();
    expect([...passosNoCodigo(dados, espalhado)].sort()).toEqual(["devolver", "dividir", "somar", "vazia", "zerar"]);
  });

  it("planoComentado: passa com o plano no código na ordem certa, e diz o que quebrou", () => {
    const contexto = (snippet: string) => ({ ...criarSimulacao(FASE_DEMO_RESOLVER).contexto(), snippet });
    const avaliar = (snippet: string) => avaliarDetalhado({ tipo: "planoComentado" }, contexto(snippet));
    expect(avaliar("function media() {}").detalhe).toBe("nenhum passo do plano está no código como comentário");
    expect(avaliar(codigoComPlano("", dados, certo, true)).passou).toBe(true);
    const foraDeOrdem = codigoComPlano("", dados, estado(["vazia", "zerar", "dividir", "somar", "devolver"]), true);
    expect(avaliar(foraDeOrdem).detalhe).toBe('nos comentários do código: "Dividir a soma pela quantidade de notas" veio antes de "Somar cada nota na soma"');
    const comSobra = `${codigoComPlano("", dados, certo, true)}// 6. Pôr as notas em ordem\n`;
    expect(avaliar(comSobra).passou).toBe(false);
  });

  it("no agrupar, cada passo grande vira um número e os subpassos, 1.1, 1.2...", () => {
    const festa: DadosOrdenar = {
      modo: "agrupar",
      problema: "Festa",
      grupos: [
        { id: "convidar", titulo: "Convidar" },
        { id: "preparar", titulo: "Preparar" },
      ],
      cartoes: [
        { id: "lista", texto: "Fazer a lista", grupo: "convidar" },
        { id: "mandar", texto: "Mandar a mensagem", grupo: "convidar", depoisDe: ["lista"] },
        { id: "bolo", texto: "Fazer o bolo", grupo: "preparar" },
      ],
    };
    let plano = estadoInicialOrdenar(festa);
    for (const [id, grupo] of [["lista", "convidar"], ["mandar", "convidar"], ["bolo", "preparar"]]) plano = porPasso(festa, plano, id, grupo) as EstadoOrdenar;
    const codigo = codigoComPlano("", festa, plano, true);
    expect(codigo).toBe("// Plano: Festa\n// 1. Convidar\n//   1.1 Fazer a lista\n//   1.2 Mandar a mensagem\n// 2. Preparar\n//   2.1 Fazer o bolo\n");
    expect(planoDosComentarios(festa, codigo).estado.listas).toEqual({ convidar: ["lista", "mandar"], preparar: ["bolo"] });
    // O bolo no passo grande errado: o plano dos comentários não vale.
    const errado = codigo.replace("//   1.2 Mandar a mensagem\n", "//   1.2 Mandar a mensagem\n//   1.3 Fazer o bolo\n").replace("//   2.1 Fazer o bolo\n", "");
    expect(conferirOrdem(festa, planoDosComentarios(festa, errado).estado).foraDoGrupo).toEqual(["bolo"]);
  });
});

describe("o plano no código: a fase de demonstração", () => {
  it("levar o plano, acender um passo e reordenar: os comentários acompanham e o código do aluno fica", () => {
    const simulacao = criarSimulacao(FASE_DEMO_RESOLVER);
    simulacao.executar(FASE_DEMO_RESOLVER.objetivos[0].solucaoDeTeste);
    simulacao.executar([{ tipo: "definirSnippet", codigo: "let rascunho = 1;" }]);
    expect(simulacao.avaliar({ tipo: "planoComentado" }).passou).toBe(false);
    simulacao.executar([{ tipo: "levarPlanoProCodigo" }]);
    expect(simulacao.avaliar({ tipo: "planoComentado" }).passou).toBe(true);
    expect(simulacao.programa().snippet.endsWith("\n\nlet rascunho = 1;")).toBe(true);
    simulacao.comecarObjetivo(null);
    simulacao.executar([{ tipo: "verPassoNoCodigo", passo: "dividir" }]);
    expect(simulacao.avaliar({ tipo: "evento", evento: "apontouPasso" }).passou).toBe(true);
    simulacao.executar([{ tipo: "porPasso", passo: "vazia", posicao: 1 }]);
    expect(simulacao.programa().snippet).toBe(`${COMENTARIOS_MEDIA}\n\nlet rascunho = 1;`);
    // Tirar um passo do plano tira o comentário dele, e o plano no código deixa de valer.
    simulacao.executar([{ tipo: "tirarPasso", passo: "devolver" }]);
    expect(simulacao.programa().snippet).not.toContain("Devolver a média");
    expect(simulacao.avaliar({ tipo: "planoComentado" }).detalhe).toBe('nos comentários do código: falta "Devolver a média"');
    expect(() => simulacao.executar([{ tipo: "verPassoNoCodigo", passo: "devolver" }])).toThrow("não está no código");
  });

  it("sabotagem: plano no código sem as áreas plano e snippet", () => {
    const semPlano = { ...FASE_DEMO_RESOLVER, areas: ["snippet", "palco"] as typeof FASE_DEMO_RESOLVER.areas, plano: undefined };
    expect(problemas(semPlano).join("\n")).toContain('o validador planoComentado pede as áreas "plano" e "snippet"');
    expect(problemas(semPlano).join("\n")).toContain('levarPlanoProCodigo pede as áreas "plano" e "snippet"');
  });
});

describe("o desafio composto", () => {
  it("passa em todas as regras de fase, com o Rever na prática composta da mesma unidade", () => {
    const contexto = { unidades: [UNIDADE_BANCADA_RESOLVER], fases: [...FASES_BANCADA_RESOLVER] };
    const todos = REGRAS_DE_FASE.flatMap((regra) => regra.checar(FASE_DEMO_DESAFIO_RESOLVER, contexto).map((p) => `${regra.id}: ${p}`));
    expect(todos).toEqual([]);
  });

  it("o checklist cobra plano, plano no código, código e testes, cada parte na sua hora", () => {
    const simulacao = criarSimulacao(FASE_DEMO_DESAFIO_RESOLVER);
    simulacao.comecarObjetivo(null);
    let feitas: string[] = [];
    const atualizar = () => (feitas = recalcularPartesFeitas(FASE_DEMO_DESAFIO_RESOLVER, feitas, simulacao.contexto()));
    for (const parte of FASE_DEMO_DESAFIO_RESOLVER.partes) {
      simulacao.executar(parte.solucaoDeTeste);
      atualizar();
      expect(feitas).toContain(parte.id);
    }
    expect(feitas).toEqual(["plano", "plano-no-codigo", "codigo", "testes"]);
    // Mexer no plano depois: o plano e os comentários desmarcam, o código e os testes ficam.
    simulacao.executar([{ tipo: "tirarPasso", passo: "devolver" }]);
    atualizar();
    expect(feitas).toEqual(["codigo", "testes"]);
    expect(simulacao.programa().snippet).toContain("function aprovados(notas) {");
    simulacao.executar([{ tipo: "porPasso", passo: "devolver" }]);
    atualizar();
    expect(feitas).toEqual(["plano", "plano-no-codigo", "codigo", "testes"]);
  });

  it("a meta mostra as áreas antes e depois", () => {
    const { antes, depois } = composicaoDoDesafio(FASE_DEMO_DESAFIO_RESOLVER);
    expect(antes).toEqual({ cena: null, plano: [], codigo: "", casos: [], memoria: null });
    expect(depois.plano).toEqual(["Começar a contagem em zero", "Olhar cada nota da lista", "Se a nota for 6 ou mais, contar mais um", "Devolver a contagem"]);
    expect(depois.codigo?.startsWith("// Plano: Contar quantos passaram\n// 1. Começar a contagem em zero")).toBe(true);
    expect(depois.casos?.map((caso) => [caso.chamada, caso.esperado, caso.passou])).toEqual([
      ["aprovados([7, 4, 9])", "2", true],
      ["aprovados([6])", "1", true],
      ["aprovados([])", "0", true],
    ]);
  });
});

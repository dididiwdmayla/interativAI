/*
 * Revisão do dia: o agendador (src/lib/revisao.ts), com relógio falso, a
 * leitura do estado salvo (migração sem perda) e as regras dos itens.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { FASES, faseDoId, UNIDADES } from "@/conteudo";
import { checarItensDeRevisao } from "@/conteudo/checagens";
import { conferirItensDeRevisao } from "@/conteudo/revisao/conferirItens";
import { faseDoItem } from "@/conteudo/revisao/faseDoItem";
import type { Fase, ItemRevisao } from "@/conteudo/tipos";
import { normalizarProgresso, PROGRESSO_PADRAO } from "@/lib/progresso";
import {
  aplicarResultado,
  diaLocal,
  diasEntre,
  type EstadoRevisao,
  lerEstadoRevisao,
  quandoVolta,
  registrarFaseConcluida,
  registrarSessao,
  REVISAO_PADRAO,
  sequenciaDeHoje,
  sessaoDeHoje,
  sincronizarRevisao,
  somarDias,
  treinoLivre,
  vencidosHoje,
} from "@/lib/revisao";

afterEach(() => {
  vi.useRealTimers();
});

/** "Hoje" pelo relógio falso, como o jogo pega. */
function hojeAs(isoLocal: string): string {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(isoLocal));
  return diaLocal();
}

const U1_F1 = faseDoId("sites-elementos-u1-f1") as Fase;
const U2_F1 = faseDoId("sites-elementos-u2-f1") as Fase;
const ESTILOS_F1 = faseDoId("sites-estilos-u1-f1") as Fase;

/** Um item de mentirinha, bem formado, para o conceito dado. */
function item(id: string, conceito: ItemRevisao["conceito"], extra: Partial<ItemRevisao> = {}): ItemRevisao {
  return {
    id,
    conceito,
    tipo: "acao",
    enunciado: { mouse: "Clique no título.", toque: "Toque no título." },
    siteAlvo: { url: `teste-${id}.exemplo`, body: `<h1 id="t">Oi ${id}</h1><p>Texto</p>` },
    validador: { tipo: "selecionado", seletor: "#t" },
    ajudas: { pergunta: "Onde está o título?", dica: "Ele fica no alto." },
    solucaoDeTeste: [{ tipo: "selecionar", seletor: "#t" }],
    ...extra,
  };
}

describe("dias pelo calendário local", () => {
  it("diaLocal usa a data do aparelho, não UTC", () => {
    expect(hojeAs("2026-03-10T23:30:00")).toBe("2026-03-10");
    expect(hojeAs("2026-03-11T00:10:00")).toBe("2026-03-11");
  });

  it("soma e conta dias atravessando mês, ano e bissexto", () => {
    expect(somarDias("2026-01-31", 1)).toBe("2026-02-01");
    expect(somarDias("2026-12-31", 1)).toBe("2027-01-01");
    expect(somarDias("2028-02-28", 1)).toBe("2028-02-29");
    expect(somarDias("2026-03-01", -1)).toBe("2026-02-28");
    expect(diasEntre("2026-09-30", "2026-11-29")).toBe(60);
    expect(diasEntre("2026-10-02", "2026-09-30")).toBe(-2);
  });
});

describe("entrar na fila", () => {
  it("o conceito entra 1 dia depois de concluir a fase que o ensina", () => {
    const hoje = hojeAs("2026-09-30T10:00:00");
    const estado = registrarFaseConcluida(REVISAO_PADRAO, U1_F1, false, hoje);
    for (const conceito of U1_F1.conceitos) {
      expect(estado.conceitos[conceito]).toEqual({ nivel: 0, proxima: "2026-10-01", vezes: 0, ultima: null });
    }
    // Não vence no mesmo dia; vence no seguinte.
    const fonte = { itens: [item("a-1", U1_F1.conceitos[0]), item("a-2", U1_F1.conceitos[0])] };
    expect(vencidosHoje(estado, hoje, fonte)).toHaveLength(0);
    expect(vencidosHoje(estado, "2026-10-01", fonte)).toHaveLength(1);
  });

  it("concluir de novo sem ajuda não mexe no que já está agendado", () => {
    const hoje = "2026-09-30";
    const conceito = U1_F1.conceitos[0];
    const agendado: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 3, proxima: "2026-10-20", vezes: 4, ultima: "2026-09-29" } } };
    expect(registrarFaseConcluida(agendado, U1_F1, false, hoje).conceitos[conceito]).toEqual(agendado.conceitos[conceito]);
  });

  it("fase com solução (ou desafio com Rever) reinicia o intervalo para amanhã", () => {
    const hoje = "2026-09-30";
    const conceito = U1_F1.conceitos[0];
    const agendado: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 3, proxima: "2026-10-20", vezes: 4, ultima: "2026-09-29" } } };
    const depois = registrarFaseConcluida(agendado, U1_F1, true, hoje);
    expect(depois.conceitos[conceito]).toEqual({ nivel: 0, proxima: "2026-10-01", vezes: 4, ultima: "2026-09-29" });
    const desafio = FASES.find((fase) => fase.tipo === "desafio" && fase.conceitos.includes(conceito as never));
    if (desafio) expect(registrarFaseConcluida(agendado, desafio, true, hoje).conceitos[conceito].nivel).toBe(0);
  });

  it("desafio não põe conceito novo na fila: quem ensina é a prática", () => {
    const desafio = FASES.find((fase) => fase.tipo === "desafio") as Fase;
    expect(registrarFaseConcluida(REVISAO_PADRAO, desafio, true, "2026-09-30")).toBe(REVISAO_PADRAO);
  });

  it("progresso antigo: as fases já concluídas entram na fila para amanhã, sem perder nada", () => {
    const conceito = U2_F1.conceitos[0];
    const antes: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 2, proxima: "2026-10-05", vezes: 2, ultima: "2026-09-28" } } };
    const depois = sincronizarRevisao(antes, [U1_F1.id, U2_F1.id], "2026-09-30");
    for (const id of U1_F1.conceitos) expect(depois.conceitos[id]?.proxima).toBe("2026-10-01");
    expect(depois.conceitos[conceito]).toEqual(antes.conceitos[conceito]);
    expect(sincronizarRevisao(depois, [U1_F1.id, U2_F1.id], "2026-10-09")).toBe(depois);
  });
});

describe("depois de revisar", () => {
  const conceito = "elemento";
  const inicio: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 0, proxima: "2026-10-01", vezes: 0, ultima: null } } };

  it("acertando sem ajuda, os intervalos sobem 1, 3, 7, 21 e 60 dias e param no 60", () => {
    let estado = inicio;
    let hoje = "2026-10-01";
    const esperados = [3, 7, 21, 60, 60];
    for (const dias of esperados) {
      estado = aplicarResultado(estado, conceito, "sem-ajuda", hoje);
      expect(diasEntre(hoje, estado.conceitos[conceito].proxima)).toBe(dias);
      hoje = estado.conceitos[conceito].proxima;
    }
    expect(estado.conceitos[conceito].vezes).toBe(5);
  });

  it("com ajuda mantém o intervalo; errar ou desistir volta para 1 dia", () => {
    const nivel2: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 2, proxima: "2026-10-01", vezes: 3, ultima: null } } };
    const comAjuda = aplicarResultado(nivel2, conceito, "com-ajuda", "2026-10-01").conceitos[conceito];
    expect(comAjuda).toEqual({ nivel: 2, proxima: "2026-10-08", vezes: 4, ultima: "2026-10-01" });
    const errou = aplicarResultado(nivel2, conceito, "errou", "2026-10-01").conceitos[conceito];
    expect(errou).toEqual({ nivel: 0, proxima: "2026-10-02", vezes: 4, ultima: "2026-10-01" });
  });

  it("treino livre tem efeito menor: acertar não sobe, errar só traz para amanhã", () => {
    const longe: EstadoRevisao = { ...REVISAO_PADRAO, conceitos: { [conceito]: { nivel: 3, proxima: "2026-10-20", vezes: 3, ultima: "2026-09-29" } } };
    const acertou = aplicarResultado(longe, conceito, "sem-ajuda", "2026-10-01", true).conceitos[conceito];
    expect(acertou).toMatchObject({ nivel: 3, proxima: "2026-10-20", vezes: 4 });
    const errou = aplicarResultado(longe, conceito, "errou", "2026-10-01", true).conceitos[conceito];
    expect(errou).toMatchObject({ nivel: 3, proxima: "2026-10-02" });
  });

  it("quando volta, em palavras", () => {
    expect(quandoVolta({ nivel: 0, proxima: "2026-10-02", vezes: 1, ultima: null }, "2026-10-01")).toBe("amanhã");
    expect(quandoVolta({ nivel: 1, proxima: "2026-10-04", vezes: 1, ultima: null }, "2026-10-01")).toBe("em 3 dias");
  });
});

describe("a sessão de hoje", () => {
  // Conceitos de ilhas diferentes não existem ainda (só Sites tem conteúdo): a mistura
  // é conferida pela ordem estável dos empates, e o atraso manda.
  const conceitos = ["elemento", "tag", "elemento-pai", "aninhamento", "regra-e-declaracao", "cor-do-texto"] as const;
  const itens = conceitos.flatMap((conceito) => [item(`${conceito}-1`, conceito), item(`${conceito}-2`, conceito)]);
  const estado: EstadoRevisao = {
    ...REVISAO_PADRAO,
    conceitos: Object.fromEntries(
      conceitos.map((conceito, indice) => [conceito, { nivel: 1, proxima: somarDias("2026-10-10", -indice), vezes: indice, ultima: null }]),
    ),
  };

  it("até 5 itens vencidos, os mais atrasados primeiro", () => {
    const sessao = sessaoDeHoje(estado, "2026-10-10", { itens });
    expect(sessao).toHaveLength(5);
    expect(sessao.map((parte) => parte.atraso)).toEqual([5, 4, 3, 2, 1]);
    expect(sessao[0].conceito).toBe("cor-do-texto");
  });

  it("a variação roda a cada revisão", () => {
    const sessao = sessaoDeHoje(estado, "2026-10-10", { itens });
    const tag = sessao.find((parte) => parte.conceito === "tag");
    expect(tag?.item.id).toBe("tag-2");
  });

  it("conceito sem item não entra; nada vencido dá lista vazia; treino livre pega os aprendidos", () => {
    expect(vencidosHoje(estado, "2026-10-10", { itens: [] })).toHaveLength(0);
    expect(sessaoDeHoje(estado, "2026-10-01", { itens })).toHaveLength(0);
    expect(treinoLivre(estado, "2026-10-01", { itens }).length).toBe(5);
  });

  it("\"Rever onde aprendi\" aponta a fase que ensina", () => {
    const sessao = sessaoDeHoje(estado, "2026-10-10", { itens });
    const elemento = sessao.find((parte) => parte.conceito === "aninhamento");
    const fase = elemento?.faseQueEnsina ? faseDoId(elemento.faseQueEnsina) : undefined;
    expect(fase?.conceitos).toContain("aninhamento");
  });
});

describe("sequência de dias", () => {
  it("conta dias seguidos, não repete no mesmo dia e recomeça sem culpa", () => {
    let estado = registrarSessao(REVISAO_PADRAO, "2026-10-01");
    estado = registrarSessao(estado, "2026-10-01");
    estado = registrarSessao(estado, "2026-10-02");
    expect(estado.sequencia).toEqual({ atual: 2, melhor: 2, ultimoDia: "2026-10-02" });
    expect(sequenciaDeHoje(estado, "2026-10-03")).toBe(2);
    expect(sequenciaDeHoje(estado, "2026-10-05")).toBe(0);
    estado = registrarSessao(estado, "2026-10-05");
    expect(estado.sequencia).toEqual({ atual: 1, melhor: 2, ultimoDia: "2026-10-05" });
  });
});

describe("estado salvo", () => {
  it("progresso antigo, sem revisão, ganha o estado vazio e não perde nada", () => {
    const antigo = { ...PROGRESSO_PADRAO, fasesConcluidas: [U1_F1.id], revisao: undefined };
    const lido = normalizarProgresso(JSON.parse(JSON.stringify(antigo)));
    expect(lido.revisao).toEqual(REVISAO_PADRAO);
    expect(lido.fasesConcluidas).toEqual([U1_F1.id]);
  });

  it("lixo vira padrão; o que é válido fica", () => {
    const lido = lerEstadoRevisao({
      conceitos: { elemento: { nivel: 9, proxima: "2026-10-01", vezes: -1 }, tag: { proxima: "amanhã" }, x: 3 },
      sequencia: { atual: 4, melhor: 2, ultimoDia: "2026-09-30" },
    });
    expect(lido.conceitos).toEqual({ elemento: { nivel: 4, proxima: "2026-10-01", vezes: 0, ultima: null } });
    expect(lido.sequencia).toEqual({ atual: 4, melhor: 4, ultimoDia: "2026-09-30" });
  });
});

describe("regras dos itens de revisão", () => {
  const contexto = { unidades: UNIDADES, fases: FASES };
  const bons = [item("elemento-1", "elemento"), item("elemento-2", "elemento", { siteAlvo: { body: '<h2 id="t">Outro</h2>' } })];

  it("itens bem formados passam", () => {
    expect(conferirItensDeRevisao(bons, FASES)).toEqual([]);
    expect(checarItensDeRevisao(bons, contexto)).toEqual([]);
  });

  it("acusa uma variação só, conceito que não existe, tipo incoerente e site igual ao de uma fase", () => {
    const problemas = conferirItensDeRevisao(
      [
        item("sozinho-1", "tag"),
        item("x-1", "nao-existe" as never),
        item("x-2", "elemento", { validador: undefined }),
        item("x-3", "elemento", { tipo: "previsao" }),
        item("x-4", "elemento", { siteAlvo: { body: U1_F1.siteAlvo.body } }),
      ],
      FASES,
    ).join("\n");
    expect(problemas).toContain('o conceito "tag" tem 1 item de revisão');
    expect(problemas).toContain('o conceito "nao-existe" não existe');
    expect(problemas).toContain("item de ação precisa de validador");
    expect(problemas).toContain("item de previsão precisa de previsao");
    expect(problemas).toContain(`igual ao da fase "${U1_F1.id}"`);
  });

  it("com as regras dos objetivos: estado inicial já passando, solução que não resolve e emoji", () => {
    const ruins = [
      item("ruim-1", "elemento", { validador: { tipo: "existe", seletor: "h1" } }),
      item("ruim-2", "elemento", { solucaoDeTeste: [{ tipo: "selecionar", seletor: "p" }] }),
      item("ruim-3", "elemento", { enunciado: { mouse: "Clique \u{1F600}", toque: "Toque." } }),
    ];
    const mensagens = checarItensDeRevisao(ruins, contexto).map((problema) => `${problema.onde} ${problema.mensagem}`).join("\n");
    expect(mensagens).toMatch(/revisao:ruim-1 .*estado inicial|revisao:ruim-1 .*já passa/);
    expect(mensagens).toContain("revisao:ruim-2");
    expect(mensagens).toMatch(/revisao:ruim-3 .*emoji/);
  });

  it("o item vira uma fase de um objetivo sozinho, com o painel Estilos se tiver CSS", () => {
    const fase = faseDoItem(item("css-1", "cor-do-texto", { siteAlvo: { body: "<p>Oi</p>", css: "p { color: red; }" } }));
    expect(fase.objetivos).toHaveLength(1);
    expect(fase.objetivos[0].modo).toBe("sozinho");
    expect(fase.paineisElementos).toEqual(["estilos"]);
    expect(fase.pratica).toEqual(["cor-do-texto"]);
  });
});

describe("o jogo liga a revisão ao progresso", () => {
  it("ESTILOS_F1 ensina conceitos que entram na fila", () => {
    const estado = registrarFaseConcluida(REVISAO_PADRAO, ESTILOS_F1, false, "2026-09-30");
    expect(Object.keys(estado.conceitos).length).toBeGreaterThan(0);
  });
});

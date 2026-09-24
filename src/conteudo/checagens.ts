/*
 * Checagens automáticas do conteúdo.
 *
 * Cada regra devolve uma lista de problemas (frases em PT-BR dizendo o que
 * quebrou e onde). Lista vazia = tudo certo. Rodam em
 * `npm run testar:conteudo` (jsdom) e no /lab/fases (navegador).
 *
 * Há três grupos:
 * - regras gerais, que olham todas as unidades e fases juntas;
 * - regras de fase, que só olham os dados de uma fase;
 * - regras de simulação, que carregam o site da fase num Document solto e
 *   aplicam as soluções pelo mesmo núcleo que a interface usa.
 */
import type { IdFerramenta } from "@/ferramentas/ids";
import { TIPOS_EVENTO } from "@/motor/eventos";
import { descreverAcao } from "@/motor/executarAcao";
import { criarSimulacao, estadoFinalDoDesafio } from "@/motor/simulacao";
import { explicarResultado } from "@/motor/validadores";
import { ehIdConceito, type IdConceito } from "./conceitos";
import type { Acao, Fase, FaseDesafio, FasePratica, Objetivo, Unidade, Validador } from "./tipos";
import { VALIDADORES_CUSTOM } from "./validadoresCustom";

/** Limites de tamanho dos textos (em caracteres). */
export const LIMITES = {
  fala: 160,
  enunciado: 140,
  descricaoParte: 140,
  meta: 200,
  missaoDeCampo: 320,
  opcaoPrevisao: 80,
  titulo: 40,
} as const;

export type ContextoChecagem = { unidades: readonly Unidade[]; fases: readonly Fase[] };

export type RegraGeral = { id: string; nome: string; checar: (contexto: ContextoChecagem) => string[] };

export type RegraFase = {
  id: string;
  nome: string;
  /** Precisa de DOM (jsdom ou navegador). */
  simulacao?: boolean;
  checar: (fase: Fase, contexto: ContextoChecagem) => string[];
};

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMOJI = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{20E3}]/u;

/* ------------------------------------------------------------------ */
/* Utilitários                                                        */
/* ------------------------------------------------------------------ */

function objetivosDe(fase: Fase): readonly Objetivo[] {
  return fase.tipo === "pratica" ? fase.objetivos : [];
}

function nomeObjetivo(objetivo: Objetivo, indice: number): string {
  return `objetivo ${indice + 1} "${objetivo.id}"`;
}

function repetidos(ids: readonly string[]): string[] {
  const vistos = new Set<string>();
  const repetidos = new Set<string>();
  for (const id of ids) {
    if (vistos.has(id)) repetidos.add(id);
    vistos.add(id);
  }
  return [...repetidos];
}

function mensagemDe(erro: unknown): string {
  return erro instanceof Error ? erro.message : String(erro);
}

/** Todos os textos de um valor (objeto, lista...), com o caminho de cada um. */
function textos(valor: unknown, caminho = ""): { caminho: string; texto: string }[] {
  if (typeof valor === "string") return [{ caminho, texto: valor }];
  if (Array.isArray(valor)) return valor.flatMap((item, indice) => textos(item, `${caminho}[${indice}]`));
  if (typeof valor === "object" && valor !== null) {
    return Object.entries(valor).flatMap(([chave, item]) => textos(item, caminho ? `${caminho}.${chave}` : chave));
  }
  return [];
}

/** Falas da fase com um rótulo de onde estão. */
function falasDe(fase: Fase): { onde: string; texto: string }[] {
  const falas: { onde: string; texto: string }[] = [];
  fase.introducao.forEach((fala, indice) => falas.push({ onde: `introdução ${indice + 1}`, texto: fala.texto }));
  fase.conclusao.forEach((fala, indice) => falas.push({ onde: `conclusão ${indice + 1}`, texto: fala.texto }));
  if (fase.falaFinal) falas.push({ onde: "falaFinal", texto: fase.falaFinal.texto });
  (fase.eventosIniciais ?? []).forEach((evento, indice) => {
    if (evento.fala) falas.push({ onde: `evento inicial ${indice + 1}`, texto: evento.fala.texto });
  });
  objetivosDe(fase).forEach((objetivo, indice) => {
    const nome = nomeObjetivo(objetivo, indice);
    falas.push({ onde: `${nome} falaAoConcluir`, texto: objetivo.falaAoConcluir.texto });
    falas.push({ onde: `${nome} ajudas.pergunta`, texto: objetivo.ajudas.pergunta });
    falas.push({ onde: `${nome} ajudas.dica`, texto: objetivo.ajudas.dica });
    if (objetivo.modo === "guiado") {
      falas.push({ onde: `${nome} ajudas.linha.fala`, texto: objetivo.ajudas.linha.fala });
      falas.push({ onde: `${nome} ajudas.solucao.fala`, texto: objetivo.ajudas.solucao.fala });
    }
    if (objetivo.eventoAoComecar?.fala) {
      falas.push({ onde: `${nome} eventoAoComecar.fala`, texto: objetivo.eventoAoComecar.fala.texto });
    }
    if (objetivo.tipo === "previsao") {
      falas.push({ onde: `${nome} previsao.pergunta`, texto: objetivo.previsao.pergunta });
      falas.push({ onde: `${nome} previsao.explicacao`, texto: objetivo.previsao.explicacao });
    }
  });
  return falas;
}

/** Validadores da fase (objetivos e partes), com um rótulo. */
function validadoresDe(fase: Fase): { onde: string; validador: Validador }[] {
  if (fase.tipo === "pratica") {
    return fase.objetivos.map((objetivo, indice) => ({ onde: nomeObjetivo(objetivo, indice), validador: objetivo.validador }));
  }
  return fase.partes.map((parte) => ({ onde: `parte "${parte.id}"`, validador: parte.validador }));
}

/** O validador e todos os que estão dentro dele. */
function achatarValidador(validador: Validador): Validador[] {
  if (validador.tipo === "todos" || validador.tipo === "algum") {
    return [validador, ...validador.validadores.flatMap(achatarValidador)];
  }
  if (validador.tipo === "nao") return [validador, ...achatarValidador(validador.validador)];
  return [validador];
}

/** Ações que o JOGADOR faria (soluções), com um rótulo. */
function acoesDoJogador(fase: Fase): { onde: string; acoes: readonly Acao[] }[] {
  if (fase.tipo === "desafio") {
    return fase.partes.map((parte) => ({ onde: `parte "${parte.id}" solucaoDeTeste`, acoes: parte.solucaoDeTeste }));
  }
  return fase.objetivos.flatMap((objetivo, indice) => {
    const nome = nomeObjetivo(objetivo, indice);
    const lista = [{ onde: `${nome} solucaoDeTeste`, acoes: objetivo.solucaoDeTeste }];
    if (objetivo.modo === "guiado") lista.push({ onde: `${nome} ajudas.solucao`, acoes: objetivo.ajudas.solucao.acoes });
    return lista;
  });
}

/** Ações roteirizadas (feitas pelo computadorzinho), com um rótulo. */
function acoesRoteirizadas(fase: Fase): { onde: string; acoes: readonly Acao[] }[] {
  const lista = (fase.eventosIniciais ?? []).map((evento, indice) => ({
    onde: `evento inicial ${indice + 1}`,
    acoes: evento.acoes,
  }));
  objetivosDe(fase).forEach((objetivo, indice) => {
    if (objetivo.eventoAoComecar) {
      lista.push({ onde: `${nomeObjetivo(objetivo, indice)} eventoAoComecar`, acoes: objetivo.eventoAoComecar.acoes });
    }
  });
  return lista;
}

/** A ferramenta que o jogador usa para fazer a ação à mão. */
export function ferramentaDaAcao(acao: Acao): IdFerramenta | null {
  switch (acao.tipo) {
    case "selecionar":
      switch (acao.via ?? "arvore") {
        case "arvore":
          return "arvore";
        case "inspecionar":
          return "inspecionar";
        case "editor":
          return "sincronia";
        case "trilha":
          return "trilha";
      }
      return null;
    case "definirTexto":
    case "definirAtributo":
      return "editar-duplo-clique";
    case "inserirHTML":
      return "editor";
    case "esconder":
      return "esconder";
    case "apagar":
      return "apagar";
    case "duplicar":
      return "duplicar";
    case "desfazer":
      return "desfazer";
    case "responderPrevisao":
      return null;
  }
}

/** Ferramentas apresentadas pela fase (dela e dos objetivos). */
function apresentadasPor(fase: Fase): IdFerramenta[] {
  return [...(fase.apresentar ?? []), ...objetivosDe(fase).flatMap((objetivo) => objetivo.apresentar ?? [])];
}

function conceitosDe(fase: Fase): IdConceito[] {
  return [...fase.conceitos, ...fase.revisa, ...fase.prerequisitos];
}

/** Seletores de validadores, linhas e ações (sem o $0 do começo). */
function seletoresDe(fase: Fase): { onde: string; seletor: string; deAcao: boolean }[] {
  const lista: { onde: string; seletor: string; deAcao: boolean }[] = [];
  for (const { onde, validador } of validadoresDe(fase)) {
    for (const item of achatarValidador(validador)) {
      if ("seletor" in item) lista.push({ onde, seletor: item.seletor, deAcao: false });
    }
  }
  objetivosDe(fase).forEach((objetivo, indice) => {
    if (objetivo.modo === "guiado" && "seletor" in objetivo.ajudas.linha) {
      lista.push({ onde: `${nomeObjetivo(objetivo, indice)} ajudas.linha`, seletor: objetivo.ajudas.linha.seletor, deAcao: false });
    }
  });
  for (const { onde, acoes } of [...acoesDoJogador(fase), ...acoesRoteirizadas(fase)]) {
    for (const acao of acoes) if ("seletor" in acao) lista.push({ onde, seletor: acao.seletor, deAcao: true });
  }
  return lista;
}

function seletorValido(seletor: string): boolean {
  try {
    document.createDocumentFragment().querySelector(seletor);
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Regras gerais                                                      */
/* ------------------------------------------------------------------ */

export const REGRAS_GERAIS: readonly RegraGeral[] = [
  {
    id: "ids-unicos",
    nome: "ids de unidades e fases são únicos e em kebab-case",
    checar: ({ unidades, fases }) => [
      ...repetidos(unidades.map((unidade) => unidade.id)).map((id) => `unidade com id repetido: "${id}"`),
      ...repetidos(fases.map((fase) => fase.id)).map((id) => `fase com id repetido: "${id}"`),
      ...[...unidades, ...fases]
        .filter((item) => !KEBAB.test(item.id))
        .map((item) => `id "${item.id}" não está em kebab-case (minúsculas, números e hífens)`),
    ],
  },
  {
    id: "unidades-e-fases",
    nome: "cada fase está na sua unidade, na mesma ordem do registro",
    checar: ({ unidades, fases }) => {
      const problemas: string[] = [];
      for (const unidade of unidades) {
        if (unidade.fases.length === 0) problemas.push(`a unidade "${unidade.id}" não tem fases`);
        for (const id of unidade.fases) {
          const fase = fases.find((item) => item.id === id);
          if (!fase) problemas.push(`a unidade "${unidade.id}" lista a fase "${id}", que não está em FASES`);
          else if (fase.unidadeId !== unidade.id) {
            problemas.push(`a fase "${id}" diz ser da unidade "${fase.unidadeId}", mas está listada em "${unidade.id}"`);
          }
        }
      }
      for (const fase of fases) {
        if (!unidades.some((unidade) => unidade.id === fase.unidadeId)) {
          problemas.push(`a fase "${fase.id}" aponta para a unidade "${fase.unidadeId}", que não existe`);
        }
      }
      const ordem = unidades.flatMap((unidade) => unidade.fases);
      const registradas = fases.map((fase) => fase.id);
      if (ordem.join("|") !== registradas.join("|")) {
        problemas.push(`a ordem de FASES (${registradas.join(", ")}) não bate com a das unidades (${ordem.join(", ")})`);
      }
      return problemas;
    },
  },
  {
    id: "meta-e-desafio",
    nome: "a meta aponta para o desafio, que é a última fase da unidade",
    checar: ({ unidades, fases }) => {
      const problemas: string[] = [];
      for (const unidade of unidades) {
        const desafios = fases.filter((fase) => fase.unidadeId === unidade.id && fase.tipo === "desafio");
        if (desafios.length > 1) problemas.push(`a unidade "${unidade.id}" tem mais de um desafio`);
        const id = unidade.meta.desafioId;
        if (desafios.length === 1 && id !== desafios[0].id) {
          problemas.push(`a unidade "${unidade.id}" tem o desafio "${desafios[0].id}", mas meta.desafioId é "${id ?? "vazio"}"`);
        }
        if (id !== undefined) {
          const fase = fases.find((item) => item.id === id);
          if (!fase || fase.tipo !== "desafio") problemas.push(`meta.desafioId "${id}" não é uma fase de desafio`);
          if (unidade.fases[unidade.fases.length - 1] !== id) {
            problemas.push(`o desafio "${id}" precisa ser a última fase da unidade "${unidade.id}"`);
          }
        }
        if (unidade.meta.enunciado.length > LIMITES.meta) {
          problemas.push(`a meta da unidade "${unidade.id}" tem ${unidade.meta.enunciado.length} caracteres (máximo ${LIMITES.meta})`);
        }
        for (const { caminho, texto } of textos(unidade)) {
          if (EMOJI.test(texto)) problemas.push(`emoji na unidade "${unidade.id}", em ${caminho}`);
        }
      }
      return problemas;
    },
  },
  {
    id: "revisao-depois-do-ensino",
    nome: "revisa e prerequisitos só usam conceitos ensinados antes",
    checar: ({ fases }) => {
      const problemas: string[] = [];
      const ensinados = new Set<IdConceito>();
      for (const fase of fases) {
        for (const conceito of [...fase.revisa, ...fase.prerequisitos]) {
          if (!ensinados.has(conceito)) {
            problemas.push(`a fase "${fase.id}" revisa ou pede "${conceito}", que nenhuma fase anterior ensinou`);
          }
        }
        if (fase.tipo === "desafio") {
          const daUnidade = new Set(
            fases
              .filter((item) => item.unidadeId === fase.unidadeId && item.tipo === "pratica")
              .flatMap((item) => item.conceitos),
          );
          for (const conceito of fase.conceitos) {
            if (!daUnidade.has(conceito)) {
              problemas.push(`o desafio "${fase.id}" pratica "${conceito}", que nenhuma fase da unidade ensinou`);
            }
          }
        } else {
          for (const conceito of fase.conceitos) ensinados.add(conceito);
        }
      }
      return problemas;
    },
  },
  {
    id: "ferramentas-apresentadas",
    nome: "toda ferramenta usada foi apresentada nesta fase ou antes",
    checar: ({ fases }) => {
      const problemas: string[] = [];
      const apresentadas = new Set<IdFerramenta>();
      for (const fase of fases) {
        for (const id of apresentadasPor(fase)) apresentadas.add(id);
        for (const id of fase.usaFerramentas) {
          if (!apresentadas.has(id)) {
            problemas.push(`a fase "${fase.id}" usa a ferramenta "${id}", que ainda não foi apresentada`);
          }
        }
      }
      return problemas;
    },
  },
];

/* ------------------------------------------------------------------ */
/* Regras de uma fase (só dados)                                      */
/* ------------------------------------------------------------------ */

const REGRAS_DE_DADOS: readonly RegraFase[] = [
  {
    id: "ids-internos",
    nome: "ids de objetivos e partes são únicos e em kebab-case",
    checar: (fase) => {
      const ids = fase.tipo === "pratica" ? fase.objetivos.map((item) => item.id) : fase.partes.map((item) => item.id);
      return [
        ...(ids.length === 0 ? [fase.tipo === "pratica" ? "a fase não tem objetivos" : "o desafio não tem partes"] : []),
        ...repetidos(ids).map((id) => `id repetido dentro da fase: "${id}"`),
        ...ids.filter((id) => !KEBAB.test(id)).map((id) => `id "${id}" não está em kebab-case`),
      ];
    },
  },
  {
    id: "conceitos-do-catalogo",
    nome: "conceitos, revisa e prerequisitos existem no catálogo",
    checar: (fase) => [
      ...conceitosDe(fase)
        .filter((id) => !ehIdConceito(id))
        .map((id) => `o conceito "${id}" não existe em src/conteudo/conceitos.ts`),
      ...(fase.tipo === "pratica" && fase.conceitos.length === 0 ? ["a fase não ensina nenhum conceito"] : []),
    ],
  },
  {
    id: "modos-e-ajudas",
    nome: "sozinho não tem linha nem solução; guiado tem as duas",
    checar: (fase) =>
      objetivosDe(fase).flatMap((objetivo, indice) => {
        const nome = nomeObjetivo(objetivo, indice);
        const ajudas: Record<string, unknown> = objetivo.ajudas;
        if (objetivo.modo === "sozinho") {
          return [
            ...("linha" in ajudas ? [`${nome} é sozinho e não pode ter ajudas.linha`] : []),
            ...("solucao" in ajudas ? [`${nome} é sozinho e não pode ter ajudas.solucao`] : []),
          ];
        }
        return [
          ...(!ajudas.linha ? [`${nome} é guiado e precisa de ajudas.linha`] : []),
          ...(!ajudas.solucao ? [`${nome} é guiado e precisa de ajudas.solucao`] : []),
        ];
      }),
  },
  {
    id: "textos",
    nome: "textos dentro dos limites, sem emoji e com a versão de toque",
    checar: (fase) => {
      const problemas: string[] = [];
      if (fase.titulo.length > LIMITES.titulo) {
        problemas.push(`título com ${fase.titulo.length} caracteres (máximo ${LIMITES.titulo})`);
      }
      if (fase.introducao.length === 0) problemas.push("a introdução está vazia");
      if (fase.conclusao.length === 0) problemas.push("a conclusão está vazia");
      for (const { onde, texto } of falasDe(fase)) {
        if (texto.trim().length === 0) problemas.push(`${onde}: fala vazia`);
        if (texto.length > LIMITES.fala) problemas.push(`${onde}: fala com ${texto.length} caracteres (máximo ${LIMITES.fala})`);
      }
      objetivosDe(fase).forEach((objetivo, indice) => {
        const nome = nomeObjetivo(objetivo, indice);
        for (const modo of ["mouse", "toque"] as const) {
          const texto = objetivo.enunciado[modo] ?? "";
          if (texto.trim().length === 0) problemas.push(`${nome}: enunciado.${modo} está vazio`);
          if (texto.length > LIMITES.enunciado) {
            problemas.push(`${nome}: enunciado.${modo} com ${texto.length} caracteres (máximo ${LIMITES.enunciado})`);
          }
        }
      });
      if (fase.tipo === "desafio") {
        for (const parte of fase.partes) {
          if (parte.descricao.length > LIMITES.descricaoParte) {
            problemas.push(`parte "${parte.id}": descrição com ${parte.descricao.length} caracteres (máximo ${LIMITES.descricaoParte})`);
          }
        }
      }
      if (fase.missaoDeCampo && fase.missaoDeCampo.length > LIMITES.missaoDeCampo) {
        problemas.push(`missão de campo com ${fase.missaoDeCampo.length} caracteres (máximo ${LIMITES.missaoDeCampo})`);
      }
      for (const { caminho, texto } of textos(fase)) {
        if (EMOJI.test(texto)) problemas.push(`emoji em ${caminho}`);
      }
      return problemas;
    },
  },
  {
    id: "previsao",
    nome: "previsões têm 2 a 4 opções, a certa existe e a solução responde",
    checar: (fase) =>
      objetivosDe(fase).flatMap((objetivo, indice) => {
        const nome = nomeObjetivo(objetivo, indice);
        const respondeNoTeste = objetivo.solucaoDeTeste.some((acao) => acao.tipo === "responderPrevisao");
        const respondeNaAjuda =
          objetivo.modo === "guiado" && objetivo.ajudas.solucao.acoes.some((acao) => acao.tipo === "responderPrevisao");
        if (objetivo.tipo !== "previsao") {
          return respondeNoTeste || respondeNaAjuda ? [`${nome} não é previsão, mas a solução usa responderPrevisao`] : [];
        }
        const { opcoes, correta } = objetivo.previsao;
        const problemas: string[] = [];
        if (opcoes.length < 2 || opcoes.length > 4) problemas.push(`${nome}: a previsão tem ${opcoes.length} opções (são 2 a 4)`);
        if (!Number.isInteger(correta) || correta < 0 || correta >= opcoes.length) {
          problemas.push(`${nome}: correta = ${correta}, fora das opções (0 a ${opcoes.length - 1})`);
        }
        opcoes.forEach((opcao, indiceOpcao) => {
          if (opcao.length > LIMITES.opcaoPrevisao) {
            problemas.push(`${nome}: opção ${indiceOpcao} com ${opcao.length} caracteres (máximo ${LIMITES.opcaoPrevisao})`);
          }
        });
        if (objetivo.solucaoDeTeste[0]?.tipo !== "responderPrevisao") {
          problemas.push(`${nome}: a solucaoDeTeste de uma previsão começa com responderPrevisao`);
        }
        if (respondeNaAjuda) {
          problemas.push(`${nome}: ajudas.solucao não responde a previsão (o jogador responde antes de pedir ajuda)`);
        }
        return problemas;
      }),
  },
  {
    id: "validadores-bem-formados",
    nome: "validadores bem formados (custom registrado, sem $0, eventos que existem)",
    checar: (fase) =>
      validadoresDe(fase).flatMap(({ onde, validador }) =>
        achatarValidador(validador).flatMap((item) => {
          const problemas: string[] = [];
          if ("seletor" in item && item.seletor.trim().startsWith("$0")) {
            problemas.push(`${onde}: "$0" só vale em ações; em validador use "selecionado"`);
          }
          if (item.tipo === "custom" && !VALIDADORES_CUSTOM[item.id]) {
            problemas.push(`${onde}: validador custom "${item.id}" não está em src/conteudo/validadoresCustom.ts`);
          }
          if (item.tipo === "evento" && !TIPOS_EVENTO.includes(item.evento)) {
            problemas.push(`${onde}: o evento "${item.evento}" não existe`);
          }
          if ((item.tipo === "todos" || item.tipo === "algum") && item.validadores.length === 0) {
            problemas.push(`${onde}: "${item.tipo}" sem validadores dentro`);
          }
          if (item.tipo === "contagem" && (item.valor < 0 || !Number.isInteger(item.valor))) {
            problemas.push(`${onde}: contagem com valor ${item.valor}`);
          }
          return problemas;
        }),
      ),
  },
  {
    id: "acoes-usam-ferramentas-da-fase",
    nome: "as soluções só usam ferramentas listadas em usaFerramentas",
    checar: (fase) => {
      const problemas: string[] = [];
      for (const { onde, acoes } of acoesDoJogador(fase)) {
        if (acoes.length === 0) problemas.push(`${onde}: sem ações`);
        for (const acao of acoes) {
          const ferramenta = ferramentaDaAcao(acao);
          if (ferramenta && !fase.usaFerramentas.includes(ferramenta)) {
            problemas.push(`${onde}: "${descreverAcao(acao)}" usa a ferramenta "${ferramenta}", que não está em usaFerramentas`);
          }
        }
      }
      objetivosDe(fase).forEach((objetivo, indice) => {
        if (objetivo.modo === "guiado" && objetivo.ajudas.linha.alvo === "ferramenta") {
          const { ferramenta } = objetivo.ajudas.linha;
          if (!fase.usaFerramentas.includes(ferramenta)) {
            problemas.push(`${nomeObjetivo(objetivo, indice)}: a linha aponta "${ferramenta}", que não está em usaFerramentas`);
          }
        }
      });
      for (const id of apresentadasPor(fase)) {
        if (!fase.usaFerramentas.includes(id)) problemas.push(`apresenta "${id}", mas não lista em usaFerramentas`);
      }
      if (fase.tipo === "desafio" && apresentadasPor(fase).length > 0) {
        problemas.push("o desafio não apresenta ferramentas: tudo o que ele usa já foi ensinado");
      }
      return problemas;
    },
  },
  {
    id: "partes-do-desafio",
    nome: "cada parte do desafio aponta para uma fase anterior da mesma unidade",
    checar: (fase, { fases }) => {
      if (fase.tipo !== "desafio") return [];
      const indice = fases.indexOf(fase);
      return fase.partes.flatMap((parte) => {
        const alvo = fases.find((item) => item.id === parte.revisarEm);
        if (!alvo) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" não existe`];
        if (alvo.unidadeId !== fase.unidadeId) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" é de outra unidade`];
        if (alvo.tipo !== "pratica") return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" não é uma fase de prática`];
        if (fases.indexOf(alvo) > indice) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" vem depois do desafio`];
        return [];
      });
    },
  },
];

/* ------------------------------------------------------------------ */
/* Regras de simulação (precisam de DOM)                              */
/* ------------------------------------------------------------------ */

type Jogada = {
  /** Problemas dos momentos roteirizados (eventos iniciais e ao começar). */
  eventos: string[];
  /** Problemas das soluções e dos validadores. */
  solucoes: string[];
};

/**
 * Joga os objetivos em ordem com as soluções (de teste ou do "Me ajuda").
 * Para no primeiro erro que deixa o resto sem sentido.
 */
function jogarObjetivos(fase: FasePratica, usarAjuda: boolean): Jogada {
  const simulacao = criarSimulacao(fase);
  const jogada: Jogada = { eventos: [], solucoes: [] };
  for (const [indice, evento] of (fase.eventosIniciais ?? []).entries()) {
    try {
      simulacao.executar(evento.acoes);
    } catch (erro) {
      jogada.eventos.push(`evento inicial ${indice + 1} quebrou: ${mensagemDe(erro)}`);
      return jogada;
    }
  }
  for (const [indice, objetivo] of fase.objetivos.entries()) {
    const nome = nomeObjetivo(objetivo, indice);
    if (objetivo.eventoAoComecar) {
      try {
        simulacao.executar(objetivo.eventoAoComecar.acoes);
      } catch (erro) {
        jogada.eventos.push(`${nome}: o eventoAoComecar quebrou: ${mensagemDe(erro)}`);
        return jogada;
      }
    }
    // Os eventos contam a partir daqui (os do momento roteirizado não contam).
    simulacao.comecarObjetivo(objetivo.tipo === "previsao" ? objetivo.previsao : null);
    const antes = simulacao.avaliar(objetivo.validador);
    if (antes.passou) {
      jogada.solucoes.push(`${nome} já está cumprido quando começa, antes de qualquer ação:\n${explicarResultado(antes)}`);
    }
    const usandoAjuda = usarAjuda && objetivo.modo === "guiado";
    const acoes: Acao[] = usandoAjuda
      ? [
          ...(objetivo.tipo === "previsao"
            ? [{ tipo: "responderPrevisao", opcao: objetivo.previsao.correta } as const]
            : []),
          ...objetivo.ajudas.solucao.acoes,
        ]
      : objetivo.solucaoDeTeste;
    const origem = usandoAjuda ? "ajudas.solucao" : "solucaoDeTeste";
    try {
      simulacao.executar(acoes);
    } catch (erro) {
      jogada.solucoes.push(`${nome}: a ${origem} quebrou na ${mensagemDe(erro)}`);
      return jogada;
    }
    const depois = simulacao.avaliar(objetivo.validador);
    if (!depois.passou) {
      jogada.solucoes.push(`${nome}: depois da ${origem}, o validador ainda não passa:\n${explicarResultado(depois)}`);
      return jogada;
    }
    if (objetivo.tipo === "previsao" && simulacao.respostaPrevisao() === null) {
      jogada.solucoes.push(`${nome}: a ${origem} não responde a previsão`);
    }
  }
  return jogada;
}

function jogarDesafio(fase: FaseDesafio): Jogada {
  const simulacao = criarSimulacao(fase);
  const jogada: Jogada = { eventos: [], solucoes: [] };
  const problemas = jogada.solucoes;
  for (const [indice, evento] of (fase.eventosIniciais ?? []).entries()) {
    try {
      simulacao.executar(evento.acoes);
    } catch (erro) {
      jogada.eventos.push(`evento inicial ${indice + 1} quebrou: ${mensagemDe(erro)}`);
      return jogada;
    }
  }
  simulacao.comecarObjetivo(null);
  const feitas = new Set<string>();
  const marcar = () => {
    for (const parte of fase.partes) if (simulacao.avaliar(parte.validador).passou) feitas.add(parte.id);
  };
  for (const parte of fase.partes) {
    if (feitas.has(parte.id)) {
      problemas.push(`a parte "${parte.id}" já estava marcada antes da própria solução (as partes se misturam)`);
    }
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch (erro) {
      problemas.push(`parte "${parte.id}": a solucaoDeTeste quebrou na ${mensagemDe(erro)}`);
      return jogada;
    }
    const resultado = simulacao.avaliar(parte.validador);
    if (!resultado.passou) {
      problemas.push(`parte "${parte.id}": depois da solucaoDeTeste, o validador ainda não passa:\n${explicarResultado(resultado)}`);
      return jogada;
    }
    marcar();
  }
  const faltando = fase.partes.filter((parte) => !feitas.has(parte.id));
  if (faltando.length > 0) problemas.push(`no fim, faltaram as partes ${faltando.map((parte) => parte.id).join(", ")}`);
  try {
    estadoFinalDoDesafio(fase);
  } catch (erro) {
    problemas.push(`não deu para gerar o "depois" da meta: ${mensagemDe(erro)}`);
  }
  return jogada;
}

function jogar(fase: Fase, usarAjuda: boolean): Jogada {
  return fase.tipo === "pratica" ? jogarObjetivos(fase, usarAjuda) : jogarDesafio(fase);
}

const REGRAS_DE_SIMULACAO: readonly RegraFase[] = [
  {
    id: "seletores-validos",
    nome: "todos os seletores são CSS válido",
    simulacao: true,
    checar: (fase) =>
      seletoresDe(fase).flatMap(({ onde, seletor, deAcao }) => {
        const limpo = deAcao ? seletor.trim().replace(/^\$0\b/, "").trim() : seletor;
        if (deAcao && limpo.length === 0) return [];
        return seletorValido(limpo) ? [] : [`${onde}: o seletor "${seletor}" não é CSS válido`];
      }),
  },
  {
    id: "estado-inicial",
    nome: "no começo, nenhum objetivo (ou parte) já passa",
    simulacao: true,
    checar: (fase) => {
      const simulacao = criarSimulacao(fase);
      simulacao.comecarObjetivo(null);
      return validadoresDe(fase).flatMap(({ onde, validador }) => {
        const resultado = simulacao.avaliar(validador);
        return resultado.passou ? [`${onde} já passa no estado inicial:\n${explicarResultado(resultado)}`] : [];
      });
    },
  },
  {
    id: "eventos-roteirizados",
    nome: "os momentos roteirizados rodam sem erro, cada um na sua hora",
    simulacao: true,
    checar: (fase) => jogar(fase, false).eventos,
  },
  {
    id: "solucoes-de-teste",
    nome: "as soluções de teste, em ordem, cumprem cada objetivo (ou parte) na sua hora",
    simulacao: true,
    checar: (fase) => jogar(fase, false).solucoes,
  },
  {
    id: "solucoes-do-me-ajuda",
    nome: "a solução do Me ajuda (degrau 4) cumpre cada objetivo guiado",
    simulacao: true,
    checar: (fase) => (fase.tipo === "pratica" ? jogar(fase, true).solucoes : []),
  },
];

export const REGRAS_DE_FASE: readonly RegraFase[] = [...REGRAS_DE_DADOS, ...REGRAS_DE_SIMULACAO];

export type ProblemaConteudo = { onde: string; regra: string; mensagem: string };

/** Roda todas as regras e junta os problemas. */
export function checarTudo(contexto: ContextoChecagem): ProblemaConteudo[] {
  const problemas: ProblemaConteudo[] = [];
  for (const regra of REGRAS_GERAIS) {
    for (const mensagem of regra.checar(contexto)) problemas.push({ onde: "geral", regra: regra.nome, mensagem });
  }
  for (const fase of contexto.fases) {
    for (const regra of REGRAS_DE_FASE) {
      let mensagens: string[];
      try {
        mensagens = regra.checar(fase, contexto);
      } catch (erro) {
        mensagens = [`a checagem quebrou: ${mensagemDe(erro)}`];
      }
      for (const mensagem of mensagens) problemas.push({ onde: fase.id, regra: regra.nome, mensagem });
    }
  }
  return problemas;
}

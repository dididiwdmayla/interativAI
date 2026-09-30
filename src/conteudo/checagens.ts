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
import { temObjetivos } from "@/motor/tiposDeFase";
import { conferirPlataformas, PLATAFORMAS_MARKETING, type PlataformaMarketing, rotuloConferido } from "./plataformas-marketing";
import { ITENS_REVISAO } from "./revisao";
import { conferirItensDeRevisao } from "./revisao/conferirItens";
import { faseDoItem } from "./revisao/faseDoItem";
import { CURRICULO, ILHAS_FUTURAS } from "@/curriculo/curriculo";
import { NUCLEO_COMUM, TRILHA_PADRAO, TRILHAS } from "@/curriculo/trilhas";
import { conferirTemas } from "@/lib/temas";
import { PROFISSOES } from "@/curriculo/profissoes";
import { conferirProfissoes } from "@/lib/profissoes";
import {
  conferirConteudoNoCurriculo,
  conferirIdsDoCurriculo,
  conferirMotorDoConteudo,
  conferirMotoresPlanejados,
  conferirTrilhas,
} from "@/curriculo/conferir";
import { MOTORES_PLANEJADOS } from "@/curriculo/motores";
import type { IdFerramenta } from "@/ferramentas/ids";
import { TIPOS_EVENTO } from "@/motor/eventos";
import { descreverAcao } from "@/motor/executarAcao";
import { criarSimulacao, estadoFinalDoDesafio } from "@/motor/simulacao";
import { propriedadeConhecida } from "@/motor/css/valores";
import { nomeDeTagValido } from "@/motor/nucleoPainel";
import { explicarResultado, itensDoChecklist, recalcularPartesFeitas, validadorTravado } from "@/motor/validadores";
import { CONCEITOS, ehIdConceito, type IdConceito } from "./conceitos";
import { conferirPublicados, PUBLICADOS } from "./publicados";
import type { Acao, Fase, FaseComObjetivos, FaseDesafio, FaseProjetoPonte, ItemRevisao, Objetivo, Unidade, Validador } from "./tipos";
import { VALIDADORES_CUSTOM } from "./validadoresCustom";
import { ferramentaDaAcao } from "./ferramentaDaAcao";

export { ferramentaDaAcao } from "./ferramentaDaAcao";

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

export type ContextoChecagem = {
  unidades: readonly Unidade[];
  fases: readonly Fase[];
  /** Itens da Revisão do dia (padrão: os registrados em src/conteudo/revisao). */
  itens?: readonly ItemRevisao[];
};

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

/**
 * Faixas Unicode de símbolos tipográficos que celulares (Android e iOS)
 * costumam trocar por emoji colorido, mesmo sem serem "emoji" no sentido do
 * Unicode (por isso o EMOJI acima, baseado em Extended_Pictographic, não os
 * pega): setas, símbolos técnicos, formas geométricas, símbolos diversos,
 * dingbats e símbolos/setas diversos. Um símbolo dessas faixas só passa se
 * vier seguido do seletor de apresentação de texto U+FE0E, que impede a
 * troca por emoji (ex.: "↓︎").
 */
const FAIXAS_SIMBOLOS_DE_RISCO: readonly (readonly [number, number])[] = [
  [0x2190, 0x21ff], // setas
  [0x2300, 0x23ff], // símbolos técnicos
  [0x25a0, 0x25ff], // formas geométricas
  [0x2600, 0x26ff], // símbolos diversos
  [0x2700, 0x27bf], // dingbats
  [0x2b00, 0x2bff], // símbolos e setas diversos
];
const SELETOR_TEXTO = "︎";

/** Um símbolo de risco (ou emoji) sem o seletor de apresentação de texto logo depois. */
export function temSimboloSemSeletorDeTexto(texto: string): boolean {
  const caracteres = Array.from(texto);
  return caracteres.some((caractere, indice) => {
    const codigo = caractere.codePointAt(0) ?? 0;
    const ehSimboloDeRisco = FAIXAS_SIMBOLOS_DE_RISCO.some(([inicio, fim]) => codigo >= inicio && codigo <= fim);
    if (!ehSimboloDeRisco && !EMOJI.test(caractere)) return false;
    return caracteres[indice + 1] !== SELETOR_TEXTO;
  });
}

/* ------------------------------------------------------------------ */
/* Utilitários                                                        */
/* ------------------------------------------------------------------ */

function objetivosDe(fase: Fase): readonly Objetivo[] {
  return temObjetivos(fase) ? fase.objetivos : [];
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
  if (temObjetivos(fase)) {
    return fase.objetivos.map((objetivo, indice) => ({ onde: nomeObjetivo(objetivo, indice), validador: objetivo.validador }));
  }
  const rotulo = fase.tipo === "desafio" ? "parte" : "requisito";
  return (itensDoChecklist(fase) ?? []).map((parte) => ({ onde: `${rotulo} "${parte.id}"`, validador: parte.validador }));
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
  if (!temObjetivos(fase)) {
    const rotulo = fase.tipo === "desafio" ? "parte" : "requisito";
    return (itensDoChecklist(fase) ?? []).map((parte) => ({ onde: `${rotulo} "${parte.id}" solucaoDeTeste`, acoes: parte.solucaoDeTeste }));
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

const VALIDADORES_DE_CSS: ReadonlySet<Validador["tipo"]> = new Set(["valorEfetivo", "declaracao", "regraExiste", "riscada", "variavelCss", "temMediaQuery"]);
const ACOES_DE_CSS: ReadonlySet<Acao["tipo"]> = new Set(["definirPropriedade", "alternarDeclaracao", "adicionarRegra", "editarCss"]);

/** Onde a fase usa CSS (validadores, ações e linhas de ajuda), com um rótulo. */
function usosDeCss(fase: Fase): string[] {
  const usos: string[] = [];
  for (const { onde, validador } of validadoresDe(fase)) {
    for (const item of achatarValidador(validador)) if (VALIDADORES_DE_CSS.has(item.tipo)) usos.push(`${onde}: validador ${item.tipo}`);
  }
  for (const { onde, acoes } of [...acoesDoJogador(fase), ...acoesRoteirizadas(fase)]) {
    for (const acao of acoes) if (ACOES_DE_CSS.has(acao.tipo)) usos.push(`${onde}: ação ${acao.tipo}`);
  }
  objetivosDe(fase).forEach((objetivo, indice) => {
    const { alvo } = objetivo.modo === "guiado" ? objetivo.ajudas.linha : { alvo: null };
    if (alvo === "css" || alvo === "estilos") usos.push(`${nomeObjetivo(objetivo, indice)}: linha no ${alvo === "css" ? "CSS" : "painel Estilos"}`);
  });
  return usos;
}

/** Seletores de regra (seletorRegra) de validadores, ações e linhas. */
function seletoresDeRegraDe(fase: Fase): { onde: string; seletor: string }[] {
  const lista: { onde: string; seletor: string }[] = [];
  for (const { onde, validador } of validadoresDe(fase)) {
    for (const item of achatarValidador(validador)) if ("seletorRegra" in item) lista.push({ onde, seletor: item.seletorRegra });
  }
  for (const { onde, acoes } of [...acoesDoJogador(fase), ...acoesRoteirizadas(fase)]) {
    for (const acao of acoes) if ("seletorRegra" in acao) lista.push({ onde, seletor: acao.seletorRegra });
  }
  objetivosDe(fase).forEach((objetivo, indice) => {
    if (objetivo.modo === "guiado" && (objetivo.ajudas.linha.alvo === "css" || objetivo.ajudas.linha.alvo === "estilos")) {
      lista.push({ onde: `${nomeObjetivo(objetivo, indice)} ajudas.linha`, seletor: objetivo.ajudas.linha.seletorRegra });
    }
  });
  return lista;
}

/** Ferramentas apresentadas pela fase (dela e dos objetivos). */
function apresentadasPor(fase: Fase): IdFerramenta[] {
  return [...(fase.apresentar ?? []), ...objetivosDe(fase).flatMap((objetivo) => objetivo.apresentar ?? [])];
}

/** O que a fase treina (campo `pratica`; só fases de prática têm). */
function praticaDe(fase: Fase): readonly IdConceito[] {
  return temObjetivos(fase) ? (fase.pratica ?? []) : [];
}

function conceitosDe(fase: Fase): IdConceito[] {
  return [...fase.conceitos, ...praticaDe(fase), ...fase.revisa, ...fase.prerequisitos];
}

/** Fase de prática com pelo menos um objetivo guiado (ação ou previsão). */
function temObjetivoGuiado(fase: Fase): boolean {
  return objetivosDe(fase).some((objetivo) => objetivo.modo === "guiado");
}

/** Seletores de validadores, linhas e ações (sem o $0 do começo). */
function seletoresDe(fase: Fase): { onde: string; seletor: string; deAcao: boolean }[] {
  const lista: { onde: string; seletor: string; deAcao: boolean }[] = [];
  for (const { onde, validador } of validadoresDe(fase)) {
    for (const item of achatarValidador(validador)) {
      if ("seletor" in item && item.seletor !== undefined) lista.push({ onde, seletor: item.seletor, deAcao: false });
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
          if (!fase) problemas.push(`meta.desafioId "${id}" da unidade "${unidade.id}" não existe`);
          else if (fase.tipo !== "desafio") problemas.push(`meta.desafioId "${id}" não é uma fase do tipo desafio`);
          if (fase && fase.unidadeId !== unidade.id) {
            problemas.push(`meta.desafioId "${id}" é da unidade "${fase.unidadeId}", não da "${unidade.id}"`);
          }
          if (unidade.fases[unidade.fases.length - 1] !== id) {
            problemas.push(`o desafio "${id}" precisa ser a última fase da unidade "${unidade.id}"`);
          }
        }
        if (unidade.meta.enunciado.length > LIMITES.meta) {
          problemas.push(`a meta da unidade "${unidade.id}" tem ${unidade.meta.enunciado.length} caracteres (máximo ${LIMITES.meta})`);
        }
        for (const { caminho, texto } of textos(unidade)) {
          if (temSimboloSemSeletorDeTexto(texto)) {
            problemas.push(`emoji (ou símbolo que vira emoji no celular) na unidade "${unidade.id}", em ${caminho}`);
          }
        }
      }
      return problemas;
    },
  },
  {
    id: "revisao-depois-do-ensino",
    nome: "revisa, prerequisitos e pratica só usam conceitos ensinados antes",
    checar: ({ fases }) => {
      const problemas: string[] = [];
      const ensinados = new Set<IdConceito>();
      for (const fase of fases) {
        for (const conceito of [...fase.revisa, ...fase.prerequisitos]) {
          if (!ensinados.has(conceito)) {
            problemas.push(`a fase "${fase.id}" revisa ou pede "${conceito}", que nenhuma fase anterior ensinou`);
          }
        }
        for (const conceito of praticaDe(fase)) {
          if (!ensinados.has(conceito)) {
            problemas.push(
              `a fase "${fase.id}" treina (pratica) "${conceito}", que nenhuma fase anterior ensinou: ` +
                "pratica é só para o que já foi ensinado com objetivo guiado; o que é novo vai em conceitos",
            );
          }
        }
        if (fase.tipo === "desafio") {
          const daUnidade = new Set(
            fases
              .filter((item) => item.unidadeId === fase.unidadeId && temObjetivos(item))
              .flatMap((item) => item.conceitos),
          );
          for (const conceito of fase.conceitos) {
            if (!daUnidade.has(conceito)) {
              problemas.push(`o desafio "${fase.id}" pratica "${conceito}", que nenhuma fase da unidade ensinou`);
            }
          }
        } else if (fase.tipo === "projeto-ponte") {
          // O projeto não ensina: tudo o que ele pratica já foi ensinado em alguma fase antes.
          for (const conceito of fase.conceitos) {
            if (!ensinados.has(conceito)) {
              problemas.push(`o projeto "${fase.id}" pratica "${conceito}", que nenhuma fase anterior ensinou`);
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
  {
    id: "curriculo-ids",
    nome: "os ids do currículo (src/curriculo) são únicos e em kebab-case",
    checar: () => conferirIdsDoCurriculo(CURRICULO),
  },
  {
    id: "curriculo-conteudo",
    nome: "toda unidade de conteúdo está no currículo, na ilha e zona certas",
    checar: ({ unidades }) => conferirConteudoNoCurriculo(CURRICULO, unidades),
  },
  {
    id: "curriculo-motor",
    nome: "nenhuma unidade de conteúdo mora em zona (ou unidade) que requer motor",
    checar: ({ unidades }) => conferirMotorDoConteudo(CURRICULO, unidades),
  },
  {
    id: "trilhas",
    nome: "toda trilha cita ilhas que existem e toda ilha com conteúdo está em alguma trilha",
    checar: ({ unidades }) => conferirTrilhas(TRILHAS, CURRICULO, ILHAS_FUTURAS, unidades, NUCLEO_COMUM, TRILHA_PADRAO),
  },
  {
    id: "motores-planejados",
    nome: "todo motor planejado cita unidades que existem e continuam travadas pelo requerMotor",
    checar: () => conferirMotoresPlanejados(MOTORES_PLANEJADOS, CURRICULO, ILHAS_FUTURAS, TRILHAS),
  },
  {
    id: "temas",
    nome: "todo conceito tem tema, todo tema citado existe e os temas das unidades prontas batem com os conceitos",
    checar: ({ unidades, fases }) => conferirTemas(CONCEITOS, CURRICULO, unidades, fases),
  },
  {
    id: "profissoes",
    nome: "toda profissão usa temas que existem, com pesos de 1 a 3",
    checar: () => conferirProfissoes(PROFISSOES),
  },
  {
    id: "itens-de-revisao",
    nome: "itens de revisão: ids únicos, conceito ensinado, tipo coerente, 2 variações e site próprio",
    checar: ({ fases, itens }) => conferirItensDeRevisao(itens ?? ITENS_REVISAO, fases),
  },
  {
    id: "posicao-da-correta",
    nome: "a opção correta das previsões de uma mesma unidade (ou de um mesmo conceito, na revisão) não fica sempre na mesma posição",
    checar: ({ unidades, fases, itens }) => conferirPosicaoDaCorreta(unidades, fases, itens ?? ITENS_REVISAO),
  },
  {
    id: "plataformas-marketing",
    nome: "o arquivo de plataformas de marketing tem ids únicos, data conferida e passos",
    checar: () => conferirPlataformas(PLATAFORMAS_MARKETING),
  },
  {
    id: "conferido-em-nas-fases",
    nome: "toda unidade que cita uma plataforma mostra o \"conferido em\" com a data do arquivo de plataformas",
    checar: ({ unidades, fases }) => conferirConferidoNasFases(PLATAFORMAS_MARKETING, unidades, fases),
  },
  {
    id: "publicados-congelados",
    nome: "ids publicados (src/conteudo/publicados.json) não somem nem mudam",
    checar: (contexto) => conferirPublicados(PUBLICADOS, { ...contexto, itens: contexto.itens ?? ITENS_REVISAO }),
  },
];

/**
 * Quem escreve previsões em volume tende a pôr a certa sempre na mesma
 * posição, e o jogador que "escolhe a primeira" acertaria tudo. Acusa, por
 * unidade (objetivos) e por conceito (itens de revisão), 2 ou mais
 * previsões com o mesmo `correta`. Com uma previsão só, não há o que comparar.
 */
export function conferirPosicaoDaCorreta(
  unidades: readonly Unidade[],
  fases: readonly Fase[],
  itens: readonly ItemRevisao[],
): string[] {
  const problemas: string[] = [];
  const sempreIgual = (posicoes: readonly number[]) => posicoes.length >= 2 && posicoes.every((posicao) => posicao === posicoes[0]);
  for (const unidade of unidades) {
    const posicoes = fases
      .filter((fase) => fase.unidadeId === unidade.id)
      .flatMap((fase) => objetivosDe(fase))
      .flatMap((objetivo) => (objetivo.tipo === "previsao" ? [objetivo.previsao.correta] : []));
    if (sempreIgual(posicoes)) {
      problemas.push(`a unidade "${unidade.id}" tem ${posicoes.length} previsões, todas com a certa na posição ${posicoes[0]}: gire a posição`);
    }
  }
  const porConceito = new Map<string, number[]>();
  for (const item of itens) {
    if (item.tipo !== "previsao" || !item.previsao) continue;
    porConceito.set(item.conceito, [...(porConceito.get(item.conceito) ?? []), item.previsao.correta]);
  }
  for (const [conceito, posicoes] of porConceito) {
    if (sempreIgual(posicoes)) {
      problemas.push(`o conceito "${conceito}" tem ${posicoes.length} previsões de revisão, todas com a certa na posição ${posicoes[0]}: gire a posição`);
    }
  }
  return problemas;
}

/**
 * O passo a passo das plataformas mora em plataformas-marketing.ts, com a
 * data em que foi conferido. Como o jogo não tem uma tela que liste os
 * passos, as fases carregam o "conferido em <data>" (uma fala ou a missão de
 * campo). Cada unidade em `usadaEm` mostra a data do arquivo, e nenhuma fase
 * mostra uma data que o arquivo não tem (o arquivo foi atualizado e o texto
 * ficou para trás).
 */
export function conferirConferidoNasFases(
  plataformas: readonly PlataformaMarketing[],
  unidades: readonly Unidade[],
  fases: readonly Fase[],
): string[] {
  const problemas: string[] = [];
  const textosDaFase = (fase: Fase) => [...falasDe(fase).map((fala) => fala.texto), fase.missaoDeCampo ?? ""];
  for (const plataforma of plataformas) {
    const rotulo = rotuloConferido(plataforma.verificadoEm);
    for (const unidadeId of plataforma.usadaEm) {
      if (!unidades.some((unidade) => unidade.id === unidadeId)) {
        problemas.push(`a plataforma "${plataforma.id}" diz ser usada em "${unidadeId}", que não existe`);
        continue;
      }
      const mostra = fases.filter((fase) => fase.unidadeId === unidadeId).some((fase) => textosDaFase(fase).some((texto) => texto.includes(rotulo)));
      if (!mostra) {
        problemas.push(`nenhuma fase da unidade "${unidadeId}" mostra "${rotulo}", e ela cita a plataforma "${plataforma.id}"`);
      }
    }
  }
  for (const fase of fases) {
    const datas = new Set(plataformas.filter((plataforma) => plataforma.usadaEm.includes(fase.unidadeId)).map((plataforma) => rotuloConferido(plataforma.verificadoEm)));
    for (const texto of textosDaFase(fase)) {
      for (const achado of texto.match(/conferido em \d{2}\/\d{2}\/\d{4}/g) ?? []) {
        if (!datas.has(achado)) {
          problemas.push(`a fase "${fase.id}" diz "${achado}", mas nenhuma plataforma da unidade tem essa data em plataformas-marketing.ts`);
        }
      }
    }
  }
  return problemas;
}

/* ------------------------------------------------------------------ */
/* Regras de uma fase (só dados)                                      */
/* ------------------------------------------------------------------ */

const REGRAS_DE_DADOS: readonly RegraFase[] = [
  {
    id: "ids-internos",
    nome: "ids de objetivos e partes são únicos e em kebab-case",
    checar: (fase) => {
      const ids = temObjetivos(fase) ? fase.objetivos.map((item) => item.id) : (itensDoChecklist(fase) ?? []).map((item) => item.id);
      const vazio = {
        pratica: "a fase não tem objetivos",
        desafio: "o desafio não tem partes",
        "projeto-ponte": "o projeto não tem requisitos",
        "simulador-campanha": "o simulador não tem objetivos",
      }[fase.tipo];
      return [
        ...(ids.length === 0 ? [vazio] : []),
        ...repetidos(ids).map((id) => `id repetido dentro da fase: "${id}"`),
        ...ids.filter((id) => !KEBAB.test(id)).map((id) => `id "${id}" não está em kebab-case`),
      ];
    },
  },
  {
    id: "conceitos-do-catalogo",
    nome: "conceitos, pratica, revisa e prerequisitos existem no catálogo",
    checar: (fase) => [
      ...conceitosDe(fase)
        .filter((id) => !ehIdConceito(id))
        .map((id) => `o conceito "${id}" não existe em src/conteudo/conceitos.ts`),
      ...(temObjetivos(fase) && fase.conceitos.length === 0 && praticaDe(fase).length === 0
        ? ["a fase não ensina (conceitos) nem treina (pratica) nenhum conceito: preencha um dos dois"]
        : []),
      ...praticaDe(fase)
        .filter((id) => fase.conceitos.includes(id))
        .map((id) => `"${id}" está em conceitos e em pratica: ou a fase ensina (conceitos), ou só treina (pratica)`),
    ],
  },
  {
    id: "fase-so-sozinho",
    nome: "fase só de sozinho só treina: conceitos vazio e nenhum objetivo guiado",
    checar: (fase) => {
      if (!temObjetivos(fase) || fase.objetivos.length === 0) return [];
      const problemas: string[] = [];
      const todosSozinho = fase.objetivos.every((objetivo) => objetivo.modo === "sozinho");
      if (todosSozinho && fase.conceitos.length > 0) {
        problemas.push(
          `todos os objetivos são sozinho, então a fase só treina: conceitos precisa ficar vazio e ` +
            `${fase.conceitos.map((id) => `"${id}"`).join(", ")} vão para pratica`,
        );
      }
      if (fase.conceitos.length === 0) {
        fase.objetivos.forEach((objetivo, indice) => {
          if (objetivo.modo !== "guiado") return;
          const tipo = objetivo.tipo === "previsao" ? "uma previsão guiada" : "um objetivo guiado";
          problemas.push(
            `${nomeObjetivo(objetivo, indice)} é ${tipo}, mas a fase só treina (conceitos vazio): ` +
              "guiado ensina algo novo, então precisa de um conceito em conceitos (e do sozinho dele depois)",
          );
        });
      }
      return problemas;
    },
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
    nome: "textos dentro dos limites, sem emoji (nem símbolo que vira emoji no celular) e com a versão de toque",
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
      if (fase.tipo === "projeto-ponte") {
        for (const requisito of fase.requisitos) {
          if (requisito.descricao.length > LIMITES.descricaoParte) {
            problemas.push(`requisito "${requisito.id}": descrição com ${requisito.descricao.length} caracteres (máximo ${LIMITES.descricaoParte})`);
          }
          if (requisito.pergunta.trim().length === 0) problemas.push(`requisito "${requisito.id}": pergunta vazia`);
          if (requisito.pergunta.length > LIMITES.fala) {
            problemas.push(`requisito "${requisito.id}": pergunta com ${requisito.pergunta.length} caracteres (máximo ${LIMITES.fala})`);
          }
        }
      }
      if (fase.missaoDeCampo && fase.missaoDeCampo.length > LIMITES.missaoDeCampo) {
        problemas.push(`missão de campo com ${fase.missaoDeCampo.length} caracteres (máximo ${LIMITES.missaoDeCampo})`);
      }
      for (const { caminho, texto } of textos(fase)) {
        if (temSimboloSemSeletorDeTexto(texto)) {
          problemas.push(`emoji (ou símbolo que vira emoji no celular, sem U+FE0E) em ${caminho}`);
        }
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
          if ("seletor" in item && item.seletor?.trim().startsWith("$0")) {
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
          if (item.tipo === "evento" && item.href !== undefined && item.evento !== "clicouLink") {
            problemas.push(`${onde}: href só vale no evento "clicouLink"`);
          }
          if (item.tipo === "tag" && !nomeDeTagValido(item.nome)) {
            problemas.push(`${onde}: "${item.nome}" não é um nome de tag válido (minúsculas, como "h4" ou "section")`);
          }
          if (item.tipo === "valorEfetivo" && !propriedadeConhecida(item.propriedade.trim().toLowerCase())) {
            problemas.push(
              `${onde}: o motor de cascata não conhece os valores de "${item.propriedade}" e nunca teria certeza do valor final; ` +
                "use uma propriedade da tabela do guia ou o validador declaracao",
            );
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
        if (objetivo.modo === "guiado" && objetivo.ajudas.linha.alvo === "estilos" && !fase.usaFerramentas.includes("painel-estilos")) {
          problemas.push(`${nomeObjetivo(objetivo, indice)}: a linha aponta o painel Estilos, que não está em usaFerramentas ("painel-estilos")`);
        }
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
      if (fase.tipo === "projeto-ponte" && apresentadasPor(fase).length > 0) {
        problemas.push("o projeto-ponte não apresenta ferramentas: ele usa as que o jogador já conhece");
      }
      return problemas;
    },
  },
  {
    id: "css-da-fase",
    nome: "fase que mexe em CSS tem siteAlvo.css, e os seletores de regra são válidos",
    checar: (fase) => {
      const usos = usosDeCss(fase);
      const problemas: string[] = [];
      if (usos.length > 0 && fase.siteAlvo.css === undefined && fase.siteAlvo.tipo !== "jogo") {
        problemas.push(`a fase usa CSS (${usos.slice(0, 3).join("; ")}), mas o site-alvo não tem css (a folha editável)`);
      }
      // O que o jogador faz pelo painel Estilos precisa do painel na tela.
      const doPainel = [...acoesDoJogador(fase)].flatMap(({ onde, acoes }) =>
        acoes
          .filter((acao) => acao.tipo === "definirPropriedade" || acao.tipo === "alternarDeclaracao" || acao.tipo === "adicionarRegra")
          .map((acao) => `${onde}: ${acao.tipo}`),
      );
      const linhaNoPainel = objetivosDe(fase).some((objetivo) => objetivo.modo === "guiado" && objetivo.ajudas.linha.alvo === "estilos");
      const ferramentasDoPainel = fase.usaFerramentas.filter((id) =>
        ["painel-estilos", "editar-valor-css", "ligar-desligar-declaracao", "setas-numericas", "seletor-de-cor", "nova-regra"].includes(id),
      );
      if ((doPainel.length > 0 || linhaNoPainel || ferramentasDoPainel.length > 0) && !(fase.paineisElementos ?? []).includes("estilos")) {
        problemas.push(
          `a fase usa o painel Estilos (${[...doPainel, ...ferramentasDoPainel].slice(0, 3).join("; ") || "linha de ajuda"}), ` +
            'mas não liga o painel: ponha paineisElementos: ["estilos"]',
        );
      }
      const ferramentasDoCalculado = fase.usaFerramentas.filter((id) => id === "painel-calculado" || id === "modelo-de-caixa");
      if (ferramentasDoCalculado.length > 0 && !(fase.paineisElementos ?? []).includes("calculado")) {
        problemas.push(
          `a fase usa a aba Calculado (${ferramentasDoCalculado.join("; ")}), mas não liga a aba: ponha paineisElementos: ["estilos", "calculado"]`,
        );
      }
      if ((fase.paineisElementos ?? []).includes("calculado") && !(fase.paineisElementos ?? []).includes("estilos")) {
        problemas.push('paineisElementos com "calculado" precisa de "estilos" também (no Chrome, Computed mora ao lado de Styles)');
      }
      for (const { onde, seletor } of seletoresDeRegraDe(fase)) {
        if (seletor.trim() === "element.style") continue;
        if (seletor.trim().length === 0 || /[{}]/.test(seletor)) problemas.push(`${onde}: seletorRegra "${seletor}" não serve`);
      }
      return problemas;
    },
  },
  {
    id: "modo-documento",
    nome: "tituloDaAba só no modo documento (a aba do navegador falso só aparece nele)",
    checar: (fase) => {
      if (fase.modoDocumento) return [];
      return validadoresDe(fase).flatMap(({ onde, validador }) =>
        achatarValidador(validador)
          .filter((item) => item.tipo === "tituloDaAba")
          .map(() => `${onde}: validador tituloDaAba numa fase sem modoDocumento (o title fica no head fixo, que o jogador não vê)`),
      );
    },
  },
  {
    id: "projeto-e-levar-pro-mundo",
    nome: "projeto-ponte e Levar pro mundo pedem modo documento e style.css (o site vira index.html + style.css)",
    checar: (fase) => {
      const problemas: string[] = [];
      const exporta = fase.usaFerramentas.includes("levar-pro-mundo");
      if (fase.tipo === "projeto-ponte") {
        if (!fase.modoDocumento) problemas.push("o projeto-ponte precisa de modoDocumento: true (o jogador escreve a página inteira)");
        if (!exporta) problemas.push('o projeto-ponte usa "levar-pro-mundo" (o site do jogador sai do jogo)');
        if (fase.nomeDoProjeto.trim().length === 0 || fase.nomeDoProjeto.length > LIMITES.titulo) {
          problemas.push(`nomeDoProjeto com ${fase.nomeDoProjeto.length} caracteres (de 1 a ${LIMITES.titulo})`);
        }
      }
      if (exporta && !fase.modoDocumento) problemas.push('"levar-pro-mundo" só numa fase com modoDocumento (o index.html é o documento inteiro)');
      if (exporta && fase.siteAlvo.css === undefined) problemas.push('"levar-pro-mundo" pede siteAlvo.css (vira o style.css)');
      return problemas;
    },
  },
  {
    id: "site-do-jogo",
    nome: 'temaSalvo e salvarTema só com o site-alvo do jogo, que vem sem css (a folha sai do tema do jogador)',
    checar: (fase) => {
      const problemas: string[] = [];
      const doJogo = fase.siteAlvo.tipo === "jogo";
      if (doJogo && fase.siteAlvo.css !== undefined) {
        problemas.push('o site-alvo do jogo vem sem css: a folha (o :root com os tokens) é montada com o tema do jogador; use SITE_ALVO_DO_JOGO');
      }
      if (doJogo && fase.modoDocumento) problemas.push("o site-alvo do jogo não usa modoDocumento (o head da maquete é fixo)");
      if (doJogo) return problemas;
      for (const { onde, validador } of validadoresDe(fase)) {
        for (const item of achatarValidador(validador)) {
          if (item.tipo === "temaSalvo") problemas.push(`${onde}: temaSalvo só vale numa fase com siteAlvo.tipo "jogo"`);
        }
      }
      for (const { onde, acoes } of [...acoesDoJogador(fase), ...acoesRoteirizadas(fase)]) {
        if (acoes.some((acao) => acao.tipo === "salvarTema")) problemas.push(`${onde}: salvarTema só vale numa fase com siteAlvo.tipo "jogo"`);
      }
      return problemas;
    },
  },
  {
    id: "fase-de-programa",
    nome: "fase de programa (Console, Snippet): validadores e ações de código só nela, com as ferramentas certas e sem página",
    checar: (fase) => {
      const problemas: string[] = [];
      const programa = fase.programa;
      const deCodigo = new Set(["valorVariavel", "respostaDoConsole", "saida", "semErro", "erroDoTipo", "usouSintaxe", "funcaoPassa"]);
      for (const { onde, validador } of validadoresDe(fase)) {
        for (const item of achatarValidador(validador)) {
          if (deCodigo.has(item.tipo) && !programa) problemas.push(`${onde}: o validador ${item.tipo} só vale numa fase de programa (campo programa)`);
          if (programa && "seletor" in item) problemas.push(`${onde}: fase de programa não tem página; o validador ${item.tipo} olha a página`);
          if (item.tipo === "saida" && item.contem === undefined && item.igual === undefined) problemas.push(`${onde}: saida sem contem nem igual`);
          if (item.tipo === "funcaoPassa") {
            if (!/^[A-Za-z_$][\w$]*$/.test(item.nome)) problemas.push(`${onde}: funcaoPassa com nome "${item.nome}", que não é um nome de função`);
            if (item.casos.length === 0) problemas.push(`${onde}: funcaoPassa sem casos`);
          }
          if (item.tipo === "valorVariavel" && !/^[A-Za-z_$][\w$]*$/.test(item.nome)) problemas.push(`${onde}: valorVariavel com nome "${item.nome}"`);
        }
      }
      if (!programa) return problemas;
      if (fase.siteAlvo.body.trim() || fase.siteAlvo.head.trim() || fase.siteAlvo.css !== undefined) {
        problemas.push("fase de programa usa siteAlvo: SITE_DO_PROGRAMA (sem página: a tela é o palco da memória)");
      }
      if (fase.modoDocumento) problemas.push("fase de programa não usa modoDocumento");
      if (!fase.usaFerramentas.includes("console")) problemas.push('fase de programa pede "console" em usaFerramentas (o Console sempre aparece)');
      const usaSnippet = [...acoesDoJogador(fase), ...acoesRoteirizadas(fase)].some(({ acoes }) =>
        acoes.some((acao) => acao.tipo === "definirSnippet" || acao.tipo === "executarSnippet"),
      );
      if (usaSnippet && !programa.snippet) problemas.push("as ações usam o Snippet, mas a fase não tem programa.snippet");
      if (programa.snippet && !fase.usaFerramentas.includes("snippet")) problemas.push('a fase tem programa.snippet: ponha "snippet" em usaFerramentas');
      objetivosDe(fase).forEach((objetivo, indice) => {
        if (objetivo.modo !== "guiado") return;
        const { linha } = objetivo.ajudas;
        if (linha.alvo === "snippet" && !programa.snippet) problemas.push(`${nomeObjetivo(objetivo, indice)}: a linha aponta o Snippet, que a fase não tem`);
        if (linha.alvo === "snippet" && linha.linhas.some((n) => !Number.isInteger(n) || n < 1)) problemas.push(`${nomeObjetivo(objetivo, indice)}: linhas do Snippet começam em 1`);
        if (linha.alvo === "arvore" || linha.alvo === "editor" || linha.alvo === "css" || linha.alvo === "estilos") {
          problemas.push(`${nomeObjetivo(objetivo, indice)}: fase de programa não tem ${linha.alvo}; aponte o console ou o snippet`);
        }
      });
      return problemas;
    },
  },
  {
    id: "ferramentas-dos-validadores",
    nome: "validador que olha uma ferramenta (dispositivo, auditoria) pede a ferramenta em usaFerramentas",
    checar: (fase) => {
      const problemas: string[] = [];
      for (const { onde, validador } of validadoresDe(fase)) {
        for (const item of achatarValidador(validador)) {
          if (item.tipo === "dispositivo" && !fase.usaFerramentas.includes("modo-dispositivo")) {
            problemas.push(`${onde}: o validador dispositivo pede "modo-dispositivo" em usaFerramentas (sem ela, a barra nem aparece)`);
          }
          if ((item.tipo === "notaAuditoria" || item.tipo === "semProblema") && !fase.usaFerramentas.includes("lighthouse")) {
            problemas.push(`${onde}: o validador ${item.tipo} pede "lighthouse" em usaFerramentas (o jogador precisa da aba para ver as notas)`);
          }
          if ((item.tipo === "resultadoBusca" || item.tipo === "indexavel") && !fase.usaFerramentas.includes("resultado-busca")) {
            problemas.push(`${onde}: o validador ${item.tipo} pede "resultado-busca" em usaFerramentas (o jogador precisa ver o resultado)`);
          }
          if (item.tipo === "dadosEstruturados" && !fase.usaFerramentas.includes("dados-estruturados")) {
            problemas.push(`${onde}: o validador dadosEstruturados pede "dados-estruturados" em usaFerramentas`);
          }
          if (item.tipo === "eventoMedido" && !fase.usaFerramentas.includes("medicao")) {
            problemas.push(`${onde}: o validador eventoMedido pede "medicao" em usaFerramentas (a aba que mostra os eventos)`);
          }
          if (item.tipo === "linkRastreavel" && !fase.usaFerramentas.includes("link-rastreavel")) {
            problemas.push(`${onde}: o validador linkRastreavel pede "link-rastreavel" em usaFerramentas (o construtor do link)`);
          }
          if (item.tipo === "simulacao" && fase.tipo !== "simulador-campanha") {
            problemas.push(`${onde}: o validador simulacao só vale numa fase do tipo "simulador-campanha"`);
          }
          if (item.tipo === "simulacao" && !fase.usaFerramentas.includes("simulador-campanha")) {
            problemas.push(`${onde}: o validador simulacao pede "simulador-campanha" em usaFerramentas`);
          }
          if (item.tipo === "notaAuditoria" && (item.minimo < 0 || item.minimo > 100)) {
            problemas.push(`${onde}: notaAuditoria com minimo ${item.minimo} (vai de 0 a 100)`);
          }
        }
      }
      return problemas;
    },
  },
  {
    id: "partes-do-desafio",
    nome: "cada parte do desafio aponta para uma fase guiada anterior da mesma unidade",
    checar: (fase, { fases }) => {
      if (fase.tipo !== "desafio") return [];
      const indice = fases.indexOf(fase);
      return fase.partes.flatMap((parte) => {
        const alvo = fases.find((item) => item.id === parte.revisarEm);
        if (!alvo) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" não existe`];
        if (alvo.unidadeId !== fase.unidadeId) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" é de outra unidade`];
        if (!temObjetivos(alvo)) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" não é uma fase de prática`];
        if (fases.indexOf(alvo) > indice) return [`parte "${parte.id}": revisarEm "${parte.revisarEm}" vem depois do desafio`];
        if (!temObjetivoGuiado(alvo)) {
          return [
            `parte "${parte.id}": revisarEm "${parte.revisarEm}" não tem nenhum objetivo guiado; ` +
              "aponte para a fase onde a habilidade foi ensinada com ajuda completa",
          ];
        }
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
function jogarObjetivos(fase: FaseComObjetivos, usarAjuda: boolean): Jogada {
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

/**
 * Joga o desafio parte por parte, com o MESMO checklist do motor
 * (`recalcularPartesFeitas`): partes travadas (seleção ou evento) ficam
 * marcadas; as de estado são conferidas de novo a cada passo. No fim,
 * confere a regra de conclusão: todas as partes de estado passando ao
 * mesmo tempo e todas as travadas já marcadas.
 */
function jogarDesafio(fase: FaseDesafio | FaseProjetoPonte): Jogada {
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
  let feitas: string[] = [];
  const atualizar = () => {
    feitas = recalcularPartesFeitas(fase, feitas, simulacao.contexto());
  };
  const itens = itensDoChecklist(fase) ?? [];
  const nomeItem = fase.tipo === "desafio" ? "parte" : "requisito";
  for (const parte of itens) {
    atualizar();
    if (feitas.includes(parte.id)) {
      problemas.push(`a ${nomeItem} "${parte.id}" já estava marcada antes da própria solução (os itens se misturam)`);
    }
    try {
      simulacao.executar(parte.solucaoDeTeste);
    } catch (erro) {
      problemas.push(`${nomeItem} "${parte.id}": a solucaoDeTeste quebrou na ${mensagemDe(erro)}`);
      return jogada;
    }
    const resultado = simulacao.avaliar(parte.validador);
    if (!resultado.passou) {
      problemas.push(`${nomeItem} "${parte.id}": depois da solucaoDeTeste, o validador ainda não passa:\n${explicarResultado(resultado)}`);
      return jogada;
    }
    atualizar();
  }
  for (const parte of itens) {
    if (feitas.includes(parte.id)) continue;
    if (validadorTravado(parte.validador)) {
      problemas.push(`no fim, a ${nomeItem} travada "${parte.id}" não ficou marcada`);
      continue;
    }
    const agora = simulacao.avaliar(parte.validador);
    problemas.push(
      `no fim, a ${nomeItem} "${parte.id}" (avaliada ao vivo) não passa mais: a solução de uma ${nomeItem} seguinte ` +
        "desfez o efeito dela, e o desafio nunca concluiria (as partes de estado precisam passar ao mesmo tempo):\n" +
        explicarResultado(agora),
    );
  }
  if (fase.tipo === "desafio") {
    try {
      estadoFinalDoDesafio(fase);
    } catch (erro) {
      problemas.push(`não deu para gerar o "depois" da meta: ${mensagemDe(erro)}`);
    }
  }
  return jogada;
}

function jogar(fase: Fase, usarAjuda: boolean): Jogada {
  return temObjetivos(fase) ? jogarObjetivos(fase, usarAjuda) : jogarDesafio(fase);
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
      }).concat(
        seletoresDeRegraDe(fase)
          .filter(({ seletor }) => seletor.trim() !== "element.style" && !seletorValido(seletor))
          .map(({ onde, seletor }) => `${onde}: o seletorRegra "${seletor}" não é CSS válido`),
      ),
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
    checar: (fase) => (temObjetivos(fase) ? jogar(fase, true).solucoes : []),
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
  problemas.push(...checarItensDeRevisao(contexto.itens ?? ITENS_REVISAO, contexto));
  return problemas;
}

/**
 * Os itens da Revisão do dia com as MESMAS regras dos objetivos: cada item
 * vira a fase de um objetivo sozinho (`faseDoItem`) e passa pelas regras
 * de fase (estado inicial não passa, solução passa, limites de texto, sem
 * emoji, conceito existe, ferramentas das ações...).
 */
export function checarItensDeRevisao(itens: readonly ItemRevisao[], contexto: ContextoChecagem): ProblemaConteudo[] {
  const problemas: ProblemaConteudo[] = [];
  for (const item of itens) {
    const fase = faseDoItem(item);
    for (const regra of REGRAS_DE_FASE) {
      let mensagens: string[];
      try {
        mensagens = regra.checar(fase, contexto);
      } catch (erro) {
        mensagens = [`a checagem quebrou: ${mensagemDe(erro)}`];
      }
      for (const mensagem of mensagens) problemas.push({ onde: `revisao:${item.id}`, regra: regra.nome, mensagem });
    }
  }
  return problemas;
}

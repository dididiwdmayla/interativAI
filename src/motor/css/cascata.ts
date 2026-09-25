/*
 * Motor de cascata do jogo.
 *
 * Para um elemento, ele descobre:
 * - as regras que casam com ele (element.matches), com o seletor, as
 *   declarações, a linha na folha e a especificidade;
 * - a ordem de precedência: importância e origem, estilo inline,
 *   especificidade, ordem na folha;
 * - quais declarações perdem (riscadas no painel), por propriedade longa,
 *   sabendo que um atalho (margin) e uma longa (margin-top) brigam pelo
 *   mesmo lugar;
 * - o que vem herdado de cada ancestral (só as propriedades herdadas);
 * - o valor vencedor de cada propriedade.
 *
 * O MESMO motor alimenta o painel Estilos, os validadores e o
 * testar:conteudo. Ele só usa `matches` e o texto das folhas, sem layout:
 * roda igual no navegador e no jsdom (que não calcula cascata de verdade).
 *
 * Regra de ouro: quando o motor não sabe resolver com certeza (valor que ele
 * não conhece, atalho que não sabe abrir, @media sem como avaliar, lógica
 * misturada com física, folha com @layer), ele NÃO risca nada naquela
 * propriedade e diz "incerto" no valor. É melhor deixar de riscar do que
 * riscar errado.
 */
import { type Condicao, type Declaracao, type FolhaAnalisada, type Regra, analisarCss, analisarEstiloInline } from "./analisarCss";
import {
  compararEspecificidade,
  dividirListaDeSeletores,
  type Especificidade,
  ESPECIFICIDADE_ZERO,
  especificidade,
} from "./especificidade";
import { SELETOR_EXIBIDO, TEXTO_FOLHA_DO_NAVEGADOR } from "./folhaDoNavegador";
import { ehHerdada, GRUPO_LOGICO_DE, HERDADAS, INICIAIS, longasDe } from "./propriedades";
import { abrirAtalho, type Validade, validadeDoValor } from "./valores";

/** Onde a folha mora: a do navegador, um <style> fixo da página ou a folha editável do jogo. */
export type OrigemFolha = "navegador" | "pagina" | "folha";

/** Atributo que marca o <style> editável do site-alvo. */
export const ATRIBUTO_FOLHA_DO_JOGO = "data-folha-jogo";

/** Nome da folha editável no painel ("estilo.css:12"). */
export const NOME_FOLHA_DO_JOGO = "estilo.css";

export type FolhaNaCascata = {
  origem: OrigemFolha;
  /** Ordem entre as folhas (a do navegador é a 0). */
  indice: number;
  /** "estilo.css", "(index)" ou "folha do navegador". */
  nome: string;
  analisada: FolhaAnalisada;
};

export type SeletorNaRegra = { texto: string; casa: boolean; especificidade: Especificidade | null };

export type Situacao =
  /** Está valendo (pelo menos numa propriedade). */
  | "vence"
  /** Perdeu para outra declaração em todas as propriedades que ela define: riscada. */
  | "perdeu"
  /** Desligada pela checkbox (comentada no CSS): riscada. */
  | "desligada"
  /** Valor que o navegador joga fora: riscada, com aviso. */
  | "invalida"
  /** O motor não tem certeza: fica normal (não risca). */
  | "incerta";

export type LongaNaCascata = { propriedade: string; valor: string | null; situacao: Situacao };

export type DeclaracaoNaCascata = {
  declaracao: Declaracao;
  /** Posição dentro do bloco. */
  indice: number;
  situacao: Situacao;
  herdavel: boolean;
  validade: Validade;
  /** As propriedades longas que ela define (um item só, se não for atalho). */
  longas: LongaNaCascata[];
};

export type Bloco = {
  /** "inline" ou "<folha>:<regra>", estável enquanto o texto não muda. */
  id: string;
  tipo: "inline" | "regra";
  /** O dono: o próprio elemento ou o ancestral de quem herda. */
  elemento: Element;
  folha: FolhaNaCascata | null;
  regra: Regra | null;
  indiceRegra: number;
  /** Como o painel mostra o seletor (a folha do navegador tem nomes do Chrome). */
  seletorExibido: string;
  seletores: SeletorNaRegra[];
  especificidade: Especificidade;
  condicoes: Condicao[];
  declaracoes: DeclaracaoNaCascata[];
};

export type ResultadoCascata = {
  elemento: Element;
  /** element.style primeiro, depois as regras na ordem do Chrome (a que ganha primeiro), a do navegador por último. */
  proprios: Bloco[];
  /** Do ancestral mais perto ao mais longe, só com blocos que têm propriedade herdada. */
  herdados: { elemento: Element; blocos: Bloco[] }[];
  /** Motivo de incerteza da página inteira (ex.: @layer), ou null. */
  incerta: string | null;
};

/* ------------------------------------------------------------------ */
/* Folhas                                                              */
/* ------------------------------------------------------------------ */

const CACHE_FOLHAS = new Map<string, FolhaAnalisada>();

function analisarComCache(texto: string): FolhaAnalisada {
  const guardada = CACHE_FOLHAS.get(texto);
  if (guardada) return guardada;
  const analisada = analisarCss(texto);
  if (CACHE_FOLHAS.size > 40) CACHE_FOLHAS.clear();
  CACHE_FOLHAS.set(texto, analisada);
  return analisada;
}

const FOLHA_DO_NAVEGADOR: FolhaNaCascata = {
  origem: "navegador",
  indice: 0,
  nome: "folha do navegador",
  analisada: analisarCss(TEXTO_FOLHA_DO_NAVEGADOR),
};

/** As folhas que valem no documento, na ordem da cascata: a do navegador e cada <style>. */
export function folhasDoDocumento(documento: Document): FolhaNaCascata[] {
  const folhas: FolhaNaCascata[] = [FOLHA_DO_NAVEGADOR];
  documento.querySelectorAll("style").forEach((estilo) => {
    const doJogo = estilo.hasAttribute(ATRIBUTO_FOLHA_DO_JOGO);
    folhas.push({
      origem: doJogo ? "folha" : "pagina",
      indice: folhas.length,
      nome: doJogo ? NOME_FOLHA_DO_JOGO : "(index)",
      analisada: analisarComCache(estilo.textContent ?? ""),
    });
  });
  return folhas;
}

/** A folha editável do jogo no documento (o <style data-folha-jogo>), se existir. */
export function elementoDaFolhaDoJogo(documento: Document): HTMLStyleElement | null {
  return documento.querySelector<HTMLStyleElement>(`style[${ATRIBUTO_FOLHA_DO_JOGO}]`);
}

/* ------------------------------------------------------------------ */
/* Seletores                                                           */
/* ------------------------------------------------------------------ */

/** Pseudo-classes de estado (mouse, foco...): o motor não conta com elas. */
const PSEUDO_DE_ESTADO = /:(hover|focus|focus-within|focus-visible|active|visited|target|target-within)(?![\w-])/i;

/** Seletor comparável: espaços normalizados em volta de combinadores e vírgulas. */
export function normalizarSeletor(seletor: string): string {
  return seletor
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\s*([>+~,])\s*/g, (_, sinal: string) => (sinal === "," ? ", " : ` ${sinal} `))
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");
}

function casa(elemento: Element, seletor: string): boolean {
  if (PSEUDO_DE_ESTADO.test(seletor)) return false;
  try {
    return elemento.matches(seletor);
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Condições                                                           */
/* ------------------------------------------------------------------ */

type ResultadoCondicao = "sim" | "nao" | "incerto";

function avaliarCondicoes(condicoes: readonly Condicao[], documento: Document): ResultadoCondicao {
  let resultado: ResultadoCondicao = "sim";
  for (const condicao of condicoes) {
    let agora: ResultadoCondicao = "incerto";
    try {
      if (condicao.tipo === "media") {
        const janela = documento.defaultView as (Window & typeof globalThis) | null;
        if (janela && typeof janela.matchMedia === "function") agora = janela.matchMedia(condicao.texto).matches ? "sim" : "nao";
      } else {
        const janela = documento.defaultView as (Window & typeof globalThis) | null;
        const suporta = janela?.CSS?.supports;
        if (typeof suporta === "function") agora = janela?.CSS.supports(condicao.texto) ? "sim" : "nao";
      }
    } catch {
      agora = "incerto";
    }
    if (agora === "nao") return "nao";
    if (agora === "incerto") resultado = "incerto";
  }
  return resultado;
}

/* ------------------------------------------------------------------ */
/* Blocos de um elemento                                               */
/* ------------------------------------------------------------------ */

type Candidato = {
  bloco: Bloco;
  item: DeclaracaoNaCascata;
  /** Valor desta declaração para a propriedade longa (null: não sabe separar). */
  valor: string | null;
  chave: readonly number[];
  /** O motor não sabe se ela vale (regra sob @media que ele não avalia, seletor que não lê). */
  duvidosa: boolean;
};

type BlocosDoElemento = {
  blocos: Bloco[];
  /** Candidatos por propriedade longa, já em ordem (o primeiro ganha). */
  candidatos: Map<string, Candidato[]>;
  /** Propriedades longas em que o motor não decide nada neste elemento. */
  incertas: Set<string>;
};

function montarDeclaracoes(declaracoes: readonly Declaracao[]): DeclaracaoNaCascata[] {
  return declaracoes.map((declaracao, indice) => {
    const validade = declaracao.ativa ? validadeDoValor(declaracao.propriedade, declaracao.valor) : "desconhecido";
    const aberto = abrirAtalho(declaracao.propriedade, declaracao.valor);
    return {
      declaracao,
      indice,
      situacao: declaracao.ativa ? (validade === "invalido" ? "invalida" : "incerta") : "desligada",
      herdavel: ehHerdada(declaracao.propriedade),
      validade,
      longas: longasDe(declaracao.propriedade).map((propriedade) => ({
        propriedade,
        valor: aberto.longas
          ? (aberto.longas[propriedade] ?? null)
          : longasDe(declaracao.propriedade).length === 1
            ? declaracao.valor
            : null,
        situacao: "incerta" as Situacao,
      })),
    };
  });
}

function camada(importante: boolean, origem: OrigemFolha | "inline"): number {
  const doNavegador = origem === "navegador";
  if (importante) return doNavegador ? 3 : 2;
  return doNavegador ? 0 : 1;
}

function lerBlocos(elemento: Element, folhas: readonly FolhaNaCascata[]): BlocosDoElemento {
  const documento = elemento.ownerDocument;
  const blocos: Bloco[] = [];
  const duvidosos = new Set<Bloco>();

  const estilo = elemento.getAttribute("style");
  if (estilo !== null && estilo.trim().length > 0) {
    blocos.push({
      id: "inline",
      tipo: "inline",
      elemento,
      folha: null,
      regra: null,
      indiceRegra: -1,
      seletorExibido: "element.style",
      seletores: [],
      especificidade: ESPECIFICIDADE_ZERO,
      condicoes: [],
      declaracoes: montarDeclaracoes(analisarEstiloInline(estilo)),
    });
  }

  for (const folha of folhas) {
    folha.analisada.regras.forEach((regra, indiceRegra) => {
      const seletores = dividirListaDeSeletores(regra.seletor).map((texto) => ({
        texto,
        casa: casa(elemento, texto),
        especificidade: especificidade(texto),
      }));
      const casados = seletores.filter((seletor) => seletor.casa);
      if (casados.length === 0) return;
      const condicao = avaliarCondicoes(regra.condicoes, documento);
      if (condicao === "nao") return;
      let maior: Especificidade = ESPECIFICIDADE_ZERO;
      let seletorIlegivel = false;
      for (const seletor of casados) {
        if (seletor.especificidade === null) seletorIlegivel = true;
        else if (compararEspecificidade(seletor.especificidade, maior) > 0) maior = seletor.especificidade;
      }
      const bloco: Bloco = {
        id: `${folha.indice}:${indiceRegra}`,
        tipo: "regra",
        elemento,
        folha,
        regra,
        indiceRegra,
        seletorExibido: folha.origem === "navegador" ? (SELETOR_EXIBIDO[regra.seletor] ?? regra.seletor) : regra.seletor,
        seletores,
        especificidade: maior,
        condicoes: regra.condicoes,
        declaracoes: montarDeclaracoes(regra.declaracoes),
      };
      if (condicao === "incerto" || seletorIlegivel) duvidosos.add(bloco);
      blocos.push(bloco);
    });
  }

  // Candidatos por propriedade longa.
  const candidatos = new Map<string, Candidato[]>();
  for (const bloco of blocos) {
    const origem = bloco.tipo === "inline" ? "inline" : (bloco.folha?.origem ?? "pagina");
    for (const item of bloco.declaracoes) {
      if (!item.declaracao.ativa) continue;
      const chave = [
        camada(item.declaracao.importante, origem),
        bloco.tipo === "inline" ? 1 : 0,
        ...bloco.especificidade,
        bloco.folha?.indice ?? Number.MAX_SAFE_INTEGER,
        bloco.indiceRegra,
        item.indice,
      ];
      for (const longa of item.longas) {
        const lista = candidatos.get(longa.propriedade) ?? [];
        lista.push({ bloco, item, valor: longa.valor, chave, duvidosa: duvidosos.has(bloco) });
        candidatos.set(longa.propriedade, lista);
      }
    }
  }
  for (const lista of candidatos.values()) lista.sort((a, b) => compararChaves(b.chave, a.chave));

  // Lógica e física no mesmo grupo: o motor não sabe a direção da escrita com certeza.
  const incertas = new Set<string>();
  for (const [propriedade] of candidatos) {
    const grupo = GRUPO_LOGICO_DE.get(propriedade);
    if (!grupo) continue;
    const temLogica = grupo.logicas.some((longa) => candidatos.has(longa));
    const temFisica = grupo.fisicas.some((longa) => candidatos.has(longa));
    if (temLogica && temFisica) for (const longa of [...grupo.logicas, ...grupo.fisicas]) incertas.add(longa);
  }

  // Na ordem do Chrome: inline, regras do autor (a que ganha primeiro), navegador.
  blocos.sort((a, b) => {
    if (a.tipo !== b.tipo) return a.tipo === "inline" ? -1 : 1;
    const origemA = a.folha?.origem === "navegador" ? 0 : 1;
    const origemB = b.folha?.origem === "navegador" ? 0 : 1;
    if (origemA !== origemB) return origemB - origemA;
    return (
      compararEspecificidade(b.especificidade, a.especificidade) ||
      (b.folha?.indice ?? 0) - (a.folha?.indice ?? 0) ||
      b.indiceRegra - a.indiceRegra
    );
  });

  return { blocos, candidatos, incertas };
}

function compararChaves(a: readonly number[], b: readonly number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diferenca = (a[i] ?? 0) - (b[i] ?? 0);
    if (diferenca !== 0) return diferenca;
  }
  return 0;
}

/* ------------------------------------------------------------------ */
/* A cascata                                                           */
/* ------------------------------------------------------------------ */

/** Quem venceu uma propriedade longa num elemento (olhando a herança). */
export type Vencedor =
  | { tipo: "declaracao"; candidato: Candidato; elemento: Element }
  | { tipo: "nenhum" }
  | { tipo: "incerto"; motivo: string };

type Contexto = {
  folhas: FolhaNaCascata[];
  incerta: string | null;
  porElemento: Map<Element, BlocosDoElemento>;
};

function blocosDe(contexto: Contexto, elemento: Element): BlocosDoElemento {
  let achados = contexto.porElemento.get(elemento);
  if (!achados) {
    achados = lerBlocos(elemento, contexto.folhas);
    contexto.porElemento.set(elemento, achados);
  }
  return achados;
}

function cadeia(elemento: Element): Element[] {
  const lista: Element[] = [];
  let atual: Element | null = elemento;
  while (atual) {
    lista.push(atual);
    atual = atual.parentElement;
  }
  return lista;
}

/**
 * Decide uma propriedade longa num elemento (só as declarações dele):
 * devolve o vencedor e marca a situação de cada candidato.
 */
function decidirLocal(
  achados: BlocosDoElemento,
  propriedade: string,
  incerta: string | null,
): { vencedor: Candidato | null; certeza: boolean; motivo: string | null } {
  const lista = achados.candidatos.get(propriedade) ?? [];
  const validos = lista.filter((candidato) => candidato.item.validade !== "invalido");
  const vencedor = validos[0] ?? null;
  if (!vencedor) return { vencedor: null, certeza: true, motivo: null };
  let motivo: string | null = incerta;
  if (!motivo && achados.incertas.has(propriedade)) motivo = `${propriedade} mistura propriedades lógicas e físicas`;
  if (!motivo && vencedor.item.validade === "desconhecido") {
    motivo = `o motor não conhece o valor "${vencedor.item.declaracao.valor}" de ${vencedor.item.declaracao.propriedade}`;
  }
  if (!motivo && vencedor.duvidosa) motivo = `a regra "${vencedor.bloco.seletorExibido}" pode não valer (condição ou seletor que o motor não avalia)`;
  if (!motivo) {
    // Uma declaração duvidosa acima de outra também deixa tudo incerto.
    const duvidosaNaFrente = lista.find((candidato) => candidato.duvidosa && candidato !== vencedor);
    if (duvidosaNaFrente && compararChaves(duvidosaNaFrente.chave, vencedor.chave) > 0) {
      motivo = `a regra "${duvidosaNaFrente.bloco.seletorExibido}" pode valer ou não`;
    }
  }
  return { vencedor, certeza: motivo === null, motivo };
}

/** Quem vence uma propriedade longa no elemento, subindo pela herança se ela for herdada. */
function vencedorDe(contexto: Contexto, elemento: Element, propriedade: string): Vencedor {
  const herdada = HERDADAS.has(propriedade) || propriedade.startsWith("--");
  const lista = herdada ? cadeia(elemento) : [elemento];
  for (const atual of lista) {
    const decisao = decidirLocal(blocosDe(contexto, atual), propriedade, contexto.incerta);
    if (!decisao.vencedor) continue;
    if (!decisao.certeza) return { tipo: "incerto", motivo: decisao.motivo ?? "o motor não tem certeza" };
    return { tipo: "declaracao", candidato: decisao.vencedor, elemento: atual };
  }
  return { tipo: "nenhum" };
}

function situacaoDaLonga(contexto: Contexto, elementoAlvo: Element, candidato: Candidato, propriedade: string): Situacao {
  const vencedor = vencedorDe(contexto, elementoAlvo, propriedade);
  if (vencedor.tipo === "incerto") return "incerta";
  if (vencedor.tipo === "declaracao" && vencedor.candidato.item === candidato.item && vencedor.candidato.bloco === candidato.bloco) {
    return "vence";
  }
  return "perdeu";
}

/** Marca as situações das declarações de um bloco, do ponto de vista do elemento alvo. */
function marcarBloco(contexto: Contexto, alvo: Element, bloco: Bloco, soHerdadas: boolean): Bloco {
  const achados = blocosDe(contexto, bloco.elemento);
  const declaracoes = bloco.declaracoes
    .filter((item) => !soHerdadas || item.herdavel)
    .map((item): DeclaracaoNaCascata => {
      if (!item.declaracao.ativa) return { ...item, situacao: "desligada" };
      if (item.validade === "invalido") return { ...item, situacao: "invalida" };
      const longas = item.longas.map((longa): LongaNaCascata => {
        const candidato = (achados.candidatos.get(longa.propriedade) ?? []).find(
          (possivel) => possivel.item === item && possivel.bloco === bloco,
        );
        const situacao = candidato ? situacaoDaLonga(contexto, alvo, candidato, longa.propriedade) : "incerta";
        return { ...longa, situacao };
      });
      const situacoes = longas.map((longa) => longa.situacao);
      const situacao: Situacao = situacoes.every((valor) => valor === "perdeu")
        ? "perdeu"
        : situacoes.includes("vence")
          ? "vence"
          : "incerta";
      return { ...item, longas, situacao };
    });
  return { ...bloco, declaracoes };
}

function novoContexto(documento: Document): Contexto {
  const folhas = folhasDoDocumento(documento);
  const incerta = folhas.find((folha) => folha.analisada.incerta);
  return {
    folhas,
    incerta: incerta ? `a folha usa ${incerta.analisada.motivoIncerta}` : null,
    porElemento: new Map(),
  };
}

/** A cascata inteira de um elemento: o que o painel Estilos mostra. */
export function calcularCascata(elemento: Element): ResultadoCascata {
  const contexto = novoContexto(elemento.ownerDocument);
  const proprios = blocosDe(contexto, elemento).blocos.map((bloco) => marcarBloco(contexto, elemento, bloco, false));
  const herdados = cadeia(elemento)
    .slice(1)
    .map((ancestral) => ({
      elemento: ancestral,
      blocos: blocosDe(contexto, ancestral)
        .blocos.filter((bloco) => bloco.declaracoes.some((item) => item.herdavel))
        .map((bloco) => marcarBloco(contexto, elemento, bloco, true)),
    }))
    .filter((grupo) => grupo.blocos.length > 0);
  return { elemento, proprios, herdados, incerta: contexto.incerta };
}

/* ------------------------------------------------------------------ */
/* Valor efetivo                                                       */
/* ------------------------------------------------------------------ */

export type ValorEfetivo =
  | {
      tipo: "valor";
      valor: string;
      /** A declaração que deu o valor (null: valor inicial, nada declarou). */
      declaracao: Declaracao | null;
      /** De onde veio: o próprio elemento ou o ancestral de quem herdou. */
      de: Element | null;
    }
  | { tipo: "incerto"; motivo: string };

const PROFUNDIDADE_VAR = 12;

function valorInicial(propriedade: string): ValorEfetivo {
  if (Object.hasOwn(INICIAIS, propriedade)) return { tipo: "valor", valor: INICIAIS[propriedade], declaracao: null, de: null };
  return { tipo: "incerto", motivo: `nada declara ${propriedade} e o valor inicial depende do navegador` };
}

function efetivoLonga(contexto: Contexto, elemento: Element, propriedade: string, profundidade: number): ValorEfetivo {
  if (profundidade > PROFUNDIDADE_VAR) return { tipo: "incerto", motivo: "var() dentro de var() demais" };
  const vencedor = vencedorDe(contexto, elemento, propriedade);
  if (vencedor.tipo === "incerto") return { tipo: "incerto", motivo: vencedor.motivo };
  if (vencedor.tipo === "nenhum") {
    if (propriedade.startsWith("--")) return { tipo: "incerto", motivo: `a variável ${propriedade} não foi declarada` };
    return valorInicial(propriedade);
  }
  const { candidato, elemento: dono } = vencedor;
  if (candidato.valor === null) {
    return {
      tipo: "incerto",
      motivo: `o motor não sabe separar "${candidato.item.declaracao.propriedade}: ${candidato.item.declaracao.valor}"`,
    };
  }
  const valor = candidato.valor.trim();
  const palavra = valor.toLowerCase();
  const pai = dono.parentElement;
  if (palavra === "inherit" || (palavra === "unset" && (HERDADAS.has(propriedade) || propriedade.startsWith("--")))) {
    return pai ? efetivoLonga(contexto, pai, propriedade, profundidade + 1) : valorInicial(propriedade);
  }
  if (palavra === "initial" || palavra === "unset") return valorInicial(propriedade);
  if (palavra === "revert" || palavra === "revert-layer") {
    return { tipo: "incerto", motivo: `${propriedade}: ${valor} depende da folha do navegador inteira` };
  }
  if (/var\(/i.test(valor)) {
    const resolvido = resolverVariaveis(contexto, dono, valor, profundidade);
    if (resolvido.tipo === "incerto") return resolvido;
    return { tipo: "valor", valor: resolvido.valor, declaracao: candidato.item.declaracao, de: dono };
  }
  return { tipo: "valor", valor, declaracao: candidato.item.declaracao, de: dono };
}

/** Troca cada var(--nome, reserva) pelo valor da variável no elemento. */
function resolverVariaveis(
  contexto: Contexto,
  elemento: Element,
  valor: string,
  profundidade: number,
): { tipo: "valor"; valor: string } | { tipo: "incerto"; motivo: string } {
  let saida = "";
  let i = 0;
  while (i < valor.length) {
    const inicio = valor.toLowerCase().indexOf("var(", i);
    if (inicio < 0) {
      saida += valor.slice(i);
      break;
    }
    saida += valor.slice(i, inicio);
    let nivel = 0;
    let fim = inicio + 3;
    for (; fim < valor.length; fim++) {
      if (valor[fim] === "(") nivel++;
      else if (valor[fim] === ")") {
        nivel--;
        if (nivel === 0) break;
      }
    }
    const dentro = valor.slice(inicio + 4, fim);
    const virgula = dentro.indexOf(",");
    const nome = (virgula >= 0 ? dentro.slice(0, virgula) : dentro).trim();
    const reserva = virgula >= 0 ? dentro.slice(virgula + 1).trim() : null;
    const efetivo = efetivoLonga(contexto, elemento, nome, profundidade + 1);
    if (efetivo.tipo === "valor") saida += efetivo.valor;
    else if (reserva !== null) {
      const resolvida = /var\(/i.test(reserva) ? resolverVariaveis(contexto, elemento, reserva, profundidade + 1) : { tipo: "valor" as const, valor: reserva };
      if (resolvida.tipo === "incerto") return resolvida;
      saida += resolvida.valor;
    } else return efetivo;
    i = fim + 1;
  }
  return { tipo: "valor", valor: saida.trim() };
}

/**
 * O valor que vence para uma propriedade no elemento (a declarada que
 * ganhou, ou herdada, ou a inicial). Para um atalho, devolve um valor por
 * propriedade longa.
 */
export function valorEfetivo(elemento: Element, propriedade: string): Record<string, ValorEfetivo> {
  const contexto = novoContexto(elemento.ownerDocument);
  const nome = propriedade.startsWith("--") ? propriedade : propriedade.toLowerCase();
  return Object.fromEntries(longasDe(nome).map((longa) => [longa, efetivoLonga(contexto, elemento, longa, 0)]));
}

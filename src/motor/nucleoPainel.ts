/*
 * Núcleo da aba Elementos, sem React: seleção, edições pela árvore
 * (texto, atributo, esconder, apagar, duplicar, inserir HTML) e a pilha de
 * desfazer e refazer.
 *
 * É a MESMA peça nos dois mundos:
 * - na interface, usePainelElementos embrulha este núcleo e liga os avisos
 *   (acender árvore, código e tela);
 * - nos testes de conteúdo e na prévia do "depois" do desafio, ele roda
 *   sobre um Document solto.
 * Assim, quando um teste aplica a solução de uma fase, ele passa pelo
 * mesmo código que roda quando o jogador faz a ação à mão.
 */
import type { PosicaoInsercao, ViaSelecao } from "@/conteudo/tipos";
import { elementoDoNo } from "@/lib/arvore";
import { caminhoDoNo, ehElemento, ehTexto, filhosVisiveis, noPeloCaminho } from "@/lib/dom";
import { CLASSE_ESCONDER, temClasseEsconder } from "@/lib/esconder";
import { classificarLink, type LinkClicado } from "@/lib/linksPrevia";
import type { EventoFase, OrigemSelecao } from "./eventos";

/** Tamanho máximo da pilha de desfazer. */
export const LIMITE_HISTORICO = 50;

export type Selecao = { caminho: number[]; origem: OrigemSelecao };

/** Avisos do núcleo para quem o usa (podem ser trocados depois, com definirAvisos). */
export type AvisosNucleo = {
  aoEvento?: (evento: EventoFase) => void;
  /** A seleção mudou (a interface acende árvore, código e tela). */
  aoSelecionar?: (selecao: Selecao | null) => void;
  /** O documento mudou por uma operação do núcleo. */
  aoMudar?: () => void;
  /** As pilhas de desfazer ou refazer mudaram. */
  aoMudarHistorico?: () => void;
};

export type OpcoesNucleo = AvisosNucleo & {
  obterDocumento: () => Document | null;
  /**
   * Aplica uma mudança no documento (caminho B). A função recebe o
   * documento e devolve true se mudou algo; o resultado volta igual.
   */
  mutarDocumento: (mutar: (documento: Document) => boolean) => boolean;
};

type Foto = { html: string; caminho: number[] | null };

const POSICOES: Record<PosicaoInsercao, InsertPosition> = {
  antes: "beforebegin",
  depois: "afterend",
  inicio: "afterbegin",
  fim: "beforeend",
};

/** Tags que o Chrome não deixa renomear (e que também não viram destino). */
export const TAGS_SEM_RENOMEAR: ReadonlySet<string> = new Set(["html", "head", "body"]);

/** Tags sem conteúdo nem fechamento: uma peça com filhos não vira uma delas. */
export const TAGS_SEM_CONTEUDO: ReadonlySet<string> = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr",
]);

/** Nome de tag aceito: letra e depois letras, números ou hífen (em minúsculas). */
export function nomeDeTagValido(nome: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(nome);
}

/** Tag (minúscula) do nó, ou do elemento dono se for texto. */
export function tagDoNo(no: Node | null): string {
  if (ehElemento(no)) return no.tagName.toLowerCase();
  return elementoDoNo(no)?.tagName.toLowerCase() ?? "";
}

/** A via (dos dados de conteúdo) que corresponde a cada origem de seleção. */
export function viaDaOrigem(origem: OrigemSelecao): ViaSelecao | null {
  switch (origem) {
    case "arvore":
    case "teclado":
      return "arvore";
    case "inspecao":
      return "inspecionar";
    case "trilha":
      return "trilha";
    case "codigo":
      return "editor";
    case "sistema":
      return null;
  }
}

/** A origem de seleção que cada via usa quando uma ação é executada. */
export function origemDaVia(via: ViaSelecao): OrigemSelecao {
  switch (via) {
    case "arvore":
      return "arvore";
    case "inspecionar":
      return "inspecao";
    case "trilha":
      return "trilha";
    case "editor":
      return "codigo";
  }
}

export function criarNucleoPainel(opcoes: OpcoesNucleo) {
  let avisos: AvisosNucleo = opcoes;
  const emitir = (evento: EventoFase) => avisos.aoEvento?.(evento);
  let selecao: Selecao | null = null;
  const pilhaDesfazer: Foto[] = [];
  const pilhaRefazer: Foto[] = [];
  /** A última entrada da pilha veio de uma sequência de edições no código. */
  let editandoCodigo = false;

  const avisarHistorico = () => avisos.aoMudarHistorico?.();

  const noSelecionado = (): Node | null => {
    const documento = opcoes.obterDocumento();
    return documento?.body && selecao ? noPeloCaminho(documento.body, selecao.caminho) : null;
  };

  const definirSelecao = (nova: Selecao | null) => {
    selecao = nova;
    avisos.aoSelecionar?.(nova);
  };

  /** Seleciona sem gerar evento (o próprio jogo mudou a seleção). */
  const selecionarEmSilencio = (caminho: number[] | null) => {
    const documento = opcoes.obterDocumento();
    const existe = documento?.body && caminho ? noPeloCaminho(documento.body, caminho) !== null : false;
    definirSelecao(existe && caminho ? { caminho, origem: "sistema" } : null);
  };

  const selecionar = (caminho: number[], origem: OrigemSelecao) => {
    if (origem === "sistema") {
      selecionarEmSilencio(caminho);
      return;
    }
    definirSelecao({ caminho, origem });
    const tag = tagDoNo(noSelecionado());
    emitir({ tipo: "selecionou", tag, caminho, origem });
    if (origem === "inspecao") emitir({ tipo: "inspecionou", tag, caminho });
    if (origem === "trilha") emitir({ tipo: "trilha", tag, caminho });
  };

  const empilhar = (foto: Foto) => {
    pilhaDesfazer.push(foto);
    if (pilhaDesfazer.length > LIMITE_HISTORICO) pilhaDesfazer.shift();
    pilhaRefazer.length = 0;
    avisarHistorico();
  };

  /**
   * Operação feita pela árvore: tira a foto do body antes e só guarda na
   * pilha se algo mudou de verdade.
   */
  const operar = (mutar: (documento: Document) => boolean): boolean => {
    const antes: { foto: Foto | null } = { foto: null };
    const mudou = opcoes.mutarDocumento((documento) => {
      antes.foto = { html: documento.body.innerHTML, caminho: selecao?.caminho ?? null };
      return mutar(documento);
    });
    if (mudou && antes.foto) {
      editandoCodigo = false;
      empilhar(antes.foto);
      avisos.aoMudar?.();
    }
    return mudou;
  };

  const editarTexto = (caminho: number[], texto: string): boolean => {
    let tag = "";
    const mudou = operar((documento) => {
      const no = noPeloCaminho(documento.body, caminho);
      if (!no) return false;
      tag = tagDoNo(no);
      if (ehTexto(no)) {
        if (no.nodeValue === texto) return false;
        no.nodeValue = texto;
        return true;
      }
      if (ehElemento(no)) {
        if (no.textContent === texto) return false;
        no.textContent = texto;
        return true;
      }
      return false;
    });
    if (mudou) emitir({ tipo: "editouTexto", tag, caminho, texto });
    return mudou;
  };

  const editarAtributo = (caminho: number[], nome: string, valor: string): boolean => {
    let tag = "";
    const mudou = operar((documento) => {
      const no = noPeloCaminho(documento.body, caminho);
      if (!ehElemento(no) || no.getAttribute(nome) === valor) return false;
      tag = tagDoNo(no);
      no.setAttribute(nome, valor);
      return true;
    });
    if (mudou) emitir({ tipo: "editouAtributo", tag, caminho, atributo: nome, valor });
    return mudou;
  };

  /** Liga e desliga o esconder do Chrome (tecla H). */
  const alternarEsconder = (caminho: number[]): boolean => {
    let tag = "";
    let escondeu = false;
    let caminhoElemento = caminho;
    const mudou = operar((documento) => {
      const elemento = elementoDoNo(noPeloCaminho(documento.body, caminho));
      if (!elemento) return false;
      caminhoElemento = caminhoDoNo(documento.body, elemento) ?? caminho;
      tag = elemento.tagName.toLowerCase();
      escondeu = !temClasseEsconder(elemento);
      elemento.classList.toggle(CLASSE_ESCONDER, escondeu);
      return true;
    });
    if (mudou) emitir({ tipo: escondeu ? "escondeu" : "mostrou", tag, caminho: caminhoElemento });
    return mudou;
  };

  /** Apaga o nó. A seleção passa para o próximo irmão ou, sem ele, para o pai. */
  const apagar = (caminho: number[]): boolean => {
    if (caminho.length === 0) return false;
    let tag = "";
    let proximaSelecao: number[] = caminho.slice(0, -1);
    const mudou = operar((documento) => {
      const no = noPeloCaminho(documento.body, caminho);
      const pai = no?.parentNode;
      if (!no || !pai) return false;
      tag = tagDoNo(no);
      const irmaos = filhosVisiveis(pai);
      const temProximo = irmaos.indexOf(no) < irmaos.length - 1;
      pai.removeChild(no);
      // Depois de tirar o nó, o próximo irmão ocupa o mesmo índice.
      proximaSelecao = temProximo ? caminho : caminho.slice(0, -1);
      return true;
    });
    if (mudou) {
      selecionarEmSilencio(proximaSelecao);
      emitir({ tipo: "apagou", tag, caminho });
    }
    return mudou;
  };

  /** Duplica o elemento logo depois dele e seleciona a cópia. */
  const duplicar = (caminho: number[]): boolean => {
    if (caminho.length === 0) return false;
    let tag = "";
    let caminhoCopia = caminho;
    const mudou = operar((documento) => {
      const elemento = noPeloCaminho(documento.body, caminho);
      if (!ehElemento(elemento) || !elemento.parentNode) return false;
      tag = elemento.tagName.toLowerCase();
      const copia = elemento.cloneNode(true);
      elemento.parentNode.insertBefore(copia, elemento.nextSibling);
      caminhoCopia = caminhoDoNo(documento.body, copia) ?? caminho;
      return true;
    });
    if (mudou) {
      selecionarEmSilencio(caminhoCopia);
      emitir({ tipo: "duplicou", tag, caminho: caminhoCopia });
    }
    return mudou;
  };

  /**
   * Troca o nome da tag, como os dois cliques no nome da tag do F12: uma
   * peça nova com a tag nova, os mesmos atributos e os mesmos filhos, no
   * mesmo lugar (a seleção continua nela). Nome vazio, igual, inválido,
   * html, head e body são recusados (o Chrome também desiste).
   */
  const renomearTag = (caminho: number[], novaTag: string): boolean => {
    const nova = novaTag.trim().toLowerCase();
    if (caminho.length === 0 || !nomeDeTagValido(nova) || TAGS_SEM_RENOMEAR.has(nova)) return false;
    let de = "";
    const mudou = operar((documento) => {
      const elemento = noPeloCaminho(documento.body, caminho);
      if (!ehElemento(elemento) || !elemento.parentNode) return false;
      de = elemento.tagName.toLowerCase();
      if (de === nova || TAGS_SEM_RENOMEAR.has(de)) return false;
      if (TAGS_SEM_CONTEUDO.has(nova) && filhosVisiveis(elemento).length > 0) return false;
      let substituta: Element;
      try {
        substituta = documento.createElement(nova);
      } catch {
        return false;
      }
      for (const atributo of Array.from(elemento.attributes)) substituta.setAttribute(atributo.name, atributo.value);
      while (elemento.firstChild) substituta.appendChild(elemento.firstChild);
      elemento.parentNode.replaceChild(substituta, elemento);
      return true;
    });
    if (mudou) {
      selecionarEmSilencio(caminho);
      emitir({ tipo: "renomeouTag", tag: nova, de, caminho });
    }
    return mudou;
  };

  /**
   * Clique num link da prévia: não navega (a página sumiria), só descobre
   * para onde ele levaria e avisa. Quem usa decide o efeito (rolar até a
   * âncora, a fala do computadorzinho). Devolve null se não é um link.
   */
  const clicarLink = (caminho: number[]): LinkClicado | null => {
    const documento = opcoes.obterDocumento();
    const elemento = documento?.body ? noPeloCaminho(documento.body, caminho) : null;
    const link = ehElemento(elemento) ? elemento.closest("a, area") : null;
    if (!link || !documento?.body) return null;
    const resultado = classificarLink(link);
    emitir({ tipo: "clicouLink", href: resultado.href, destino: resultado.destino, caminho: caminhoDoNo(documento.body, link) ?? caminho });
    return resultado;
  };

  /** Escreve HTML novo perto de um elemento (o body só aceita início e fim). */
  const inserirHtml = (caminho: number[], posicao: PosicaoInsercao, html: string): boolean => {
    if (caminho.length === 0 && (posicao === "antes" || posicao === "depois")) return false;
    const mudou = operar((documento) => {
      const elemento = noPeloCaminho(documento.body, caminho);
      if (!ehElemento(elemento)) return false;
      elemento.insertAdjacentHTML(POSICOES[posicao], html);
      return true;
    });
    if (mudou) {
      selecionarEmSilencio(selecao?.caminho ?? null);
      emitir({ tipo: "editouCodigo" });
    }
    return mudou;
  };

  const restaurar = (foto: Foto) => {
    opcoes.mutarDocumento((documento) => {
      documento.body.innerHTML = foto.html;
      return true;
    });
    editandoCodigo = false;
    selecionarEmSilencio(foto.caminho);
    avisos.aoMudar?.();
  };

  const fotoAtual = (): Foto | null => {
    const documento = opcoes.obterDocumento();
    return documento?.body ? { html: documento.body.innerHTML, caminho: selecao?.caminho ?? null } : null;
  };

  const desfazer = (): boolean => {
    const foto = pilhaDesfazer.pop();
    const agora = fotoAtual();
    if (!foto || !agora) {
      if (foto) pilhaDesfazer.push(foto);
      return false;
    }
    pilhaRefazer.push(agora);
    restaurar(foto);
    avisarHistorico();
    emitir({ tipo: "desfez" });
    return true;
  };

  const refazer = (): boolean => {
    const foto = pilhaRefazer.pop();
    const agora = fotoAtual();
    if (!foto || !agora) {
      if (foto) pilhaRefazer.push(foto);
      return false;
    }
    pilhaDesfazer.push(agora);
    restaurar(foto);
    avisarHistorico();
    emitir({ tipo: "refez" });
    return true;
  };

  /**
   * Chamado a cada tecla no editor de código, ANTES do texto mudar a
   * página. A primeira tecla de uma sequência guarda uma foto, para o
   * Desfazer do painel voltar ao estado de antes da digitação sem perder
   * o resto do histórico.
   */
  const antesDeEditarCodigo = () => {
    if (editandoCodigo) return;
    const agora = fotoAtual();
    if (!agora) return;
    editandoCodigo = true;
    empilhar(agora);
  };

  return {
    /** Troca os avisos (a interface liga os dela depois de montar). */
    definirAvisos: (novos: AvisosNucleo) => {
      avisos = novos;
    },
    selecao: (): Selecao | null => selecao,
    noSelecionado,
    selecionar,
    editarTexto,
    editarAtributo,
    alternarEsconder,
    apagar,
    duplicar,
    renomearTag,
    clicarLink,
    inserirHtml,
    desfazer,
    refazer,
    antesDeEditarCodigo,
    podeDesfazer: () => pilhaDesfazer.length > 0,
    podeRefazer: () => pilhaRefazer.length > 0,
  };
}

export type NucleoPainel = ReturnType<typeof criarNucleoPainel>;

/*
 * Núcleo da aba Elementos, sem React: seleção, edições pela árvore
 * (texto, atributo, esconder, apagar, duplicar, inserir HTML), edições de
 * CSS (painel Estilos e editor CSS) e a pilha de desfazer e refazer (uma
 * só, com o HTML e o CSS juntos em cada foto).
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
import { caminhoDoNo, ehElemento, ehTexto, filhosVisiveis, noPeloCaminho, raizDaArvore } from "@/lib/dom";
import { CLASSE_ESCONDER, temClasseEsconder } from "@/lib/esconder";
import { escreverCssNoDocumento, fotografarRaiz, lerCssDoDocumento, restaurarRaiz } from "@/lib/documentoSiteAlvo";
import { classificarLink, type LinkClicado } from "@/lib/linksPrevia";
import { analisarCss } from "./css/analisarCss";
import {
  acharDeclaracao,
  acharRegra,
  adicionarDeclaracaoNoTexto,
  adicionarRegraNoTexto,
  alternarDeclaracaoNoTexto,
  alternarPropriedadeNoTexto,
  definirPropriedadeNoTexto,
  escreverNoTexto,
  type RefDeclaracao,
  removerDeclaracao,
  trocarNome,
  trocarValor,
} from "./css/editarCss";
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
  /**
   * Troca o texto da folha editável (o CSS do site-alvo). Sem ela, o núcleo
   * escreve direto no <style data-folha-jogo> do documento (a simulação).
   * A interface passa a dela, que também atualiza o editor CSS.
   */
  mutarCss?: (css: string) => boolean;
};

type Foto = { html: string; css: string | null; caminho: number[] | null };

/** Qual editor está numa sequência de digitação (a primeira tecla tira a foto). */
type Digitacao = "html" | "css" | null;

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

/** A raiz da árvore (o body ou, no modo documento, o html), ou null se não há página. */
function raizDe(documento: Document | null): Element | null {
  return documento?.body ? raizDaArvore(documento) : null;
}

/** A raiz de um documento que já está carregado (dentro das operações). */
function raizDoDocumento(documento: Document): Element {
  return raizDaArvore(documento) ?? documento.body;
}

export function criarNucleoPainel(opcoes: OpcoesNucleo) {
  let avisos: AvisosNucleo = opcoes;
  const emitir = (evento: EventoFase) => avisos.aoEvento?.(evento);
  let selecao: Selecao | null = null;
  const pilhaDesfazer: Foto[] = [];
  const pilhaRefazer: Foto[] = [];
  /** A última entrada da pilha veio de uma sequência de digitação num editor. */
  let digitando: Digitacao = null;

  const avisarHistorico = () => avisos.aoMudarHistorico?.();

  const noSelecionado = (): Node | null => {
    const raiz = raizDe(opcoes.obterDocumento());
    return raiz && selecao ? noPeloCaminho(raiz, selecao.caminho) : null;
  };

  const definirSelecao = (nova: Selecao | null) => {
    selecao = nova;
    avisos.aoSelecionar?.(nova);
  };

  /** Seleciona sem gerar evento (o próprio jogo mudou a seleção). */
  const selecionarEmSilencio = (caminho: number[] | null) => {
    const raiz = raizDe(opcoes.obterDocumento());
    const existe = raiz && caminho ? noPeloCaminho(raiz, caminho) !== null : false;
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
  const lerCss = (): string | null => {
    const documento = opcoes.obterDocumento();
    return documento ? lerCssDoDocumento(documento) : null;
  };

  const aplicarCss = (css: string): boolean => {
    if (opcoes.mutarCss) return opcoes.mutarCss(css);
    const documento = opcoes.obterDocumento();
    return documento ? escreverCssNoDocumento(documento, css) : false;
  };

  const operar = (mutar: (documento: Document) => boolean): boolean => {
    const antes: { foto: Foto | null } = { foto: null };
    const css = lerCss();
    const mudou = opcoes.mutarDocumento((documento) => {
      antes.foto = { html: fotografarRaiz(documento), css, caminho: selecao?.caminho ?? null };
      return mutar(documento);
    });
    if (mudou && antes.foto) {
      digitando = null;
      empilhar(antes.foto);
      avisos.aoMudar?.();
    }
    return mudou;
  };

  /**
   * Operação no CSS (painel Estilos, ações): calcula o texto novo a partir
   * do atual e só guarda a foto se ele mudou de verdade.
   */
  const operarCss = (calcular: (css: string) => string | null): boolean => {
    const agora = fotoAtual();
    if (!agora || agora.css === null) return false;
    const novo = calcular(agora.css);
    if (novo === null || novo === agora.css) return false;
    if (!aplicarCss(novo)) return false;
    digitando = null;
    empilhar(agora);
    avisos.aoMudar?.();
    return true;
  };

  const editarTexto = (caminho: number[], texto: string): boolean => {
    let tag = "";
    const mudou = operar((documento) => {
      const no = noPeloCaminho(raizDoDocumento(documento), caminho);
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
      const no = noPeloCaminho(raizDoDocumento(documento), caminho);
      if (!ehElemento(no) || no.getAttribute(nome) === valor) return false;
      tag = tagDoNo(no);
      no.setAttribute(nome, valor);
      return true;
    });
    if (mudou) emitir({ tipo: "editouAtributo", tag, caminho, atributo: nome, valor });
    return mudou;
  };

  /**
   * "Adicionar atributo" do menu do nó (Chrome: Add attribute): põe um ou
   * mais atributos no elemento. Se ele já tem um, o valor é trocado.
   */
  const adicionarAtributos = (caminho: number[], atributos: readonly { nome: string; valor: string }[]): boolean => {
    let tag = "";
    const novos: { nome: string; valor: string }[] = [];
    const mudou = operar((documento) => {
      const no = noPeloCaminho(raizDoDocumento(documento), caminho);
      if (!ehElemento(no)) return false;
      tag = tagDoNo(no);
      for (const { nome, valor } of atributos) {
        const limpo = nome.trim().toLowerCase();
        if (!/^[a-z_:][-a-z0-9_:.]*$/.test(limpo) || no.getAttribute(limpo) === valor) continue;
        no.setAttribute(limpo, valor);
        novos.push({ nome: limpo, valor });
      }
      return novos.length > 0;
    });
    if (mudou) for (const { nome, valor } of novos) emitir({ tipo: "adicionouAtributo", tag, caminho, atributo: nome, valor });
    return mudou;
  };

  /** Liga e desliga o esconder do Chrome (tecla H). */
  const alternarEsconder = (caminho: number[]): boolean => {
    let tag = "";
    let escondeu = false;
    let caminhoElemento = caminho;
    const mudou = operar((documento) => {
      const elemento = elementoDoNo(noPeloCaminho(raizDoDocumento(documento), caminho));
      if (!elemento) return false;
      caminhoElemento = caminhoDoNo(raizDoDocumento(documento), elemento) ?? caminho;
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
      const no = noPeloCaminho(raizDoDocumento(documento), caminho);
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
      const elemento = noPeloCaminho(raizDoDocumento(documento), caminho);
      if (!ehElemento(elemento) || !elemento.parentNode) return false;
      tag = elemento.tagName.toLowerCase();
      const copia = elemento.cloneNode(true);
      elemento.parentNode.insertBefore(copia, elemento.nextSibling);
      caminhoCopia = caminhoDoNo(raizDoDocumento(documento), copia) ?? caminho;
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
      const elemento = noPeloCaminho(raizDoDocumento(documento), caminho);
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
    const raiz = raizDe(documento);
    const elemento = raiz ? noPeloCaminho(raiz, caminho) : null;
    const link = ehElemento(elemento) ? elemento.closest("a, area") : null;
    if (!link || !documento || !raiz) return null;
    const resultado = classificarLink(link);
    emitir({ tipo: "clicouLink", href: resultado.href, destino: resultado.destino, caminho: caminhoDoNo(raiz, link) ?? caminho });
    return resultado;
  };

  /** Escreve HTML novo perto de um elemento (o body só aceita início e fim). */
  const inserirHtml = (caminho: number[], posicao: PosicaoInsercao, html: string): boolean => {
    if (caminho.length === 0 && (posicao === "antes" || posicao === "depois")) return false;
    const mudou = operar((documento) => {
      const elemento = noPeloCaminho(raizDoDocumento(documento), caminho);
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
    // O CSS de agora é lido antes: no modo documento, a folha mora no <html> que a foto troca.
    const cssAgora = lerCss();
    opcoes.mutarDocumento((documento) => {
      restaurarRaiz(documento, foto.html);
      return true;
    });
    if (foto.css !== null && foto.css !== cssAgora) aplicarCss(foto.css);
    digitando = null;
    selecionarEmSilencio(foto.caminho);
    avisos.aoMudar?.();
  };

  const fotoAtual = (): Foto | null => {
    const documento = opcoes.obterDocumento();
    return documento?.body
      ? { html: fotografarRaiz(documento), css: lerCssDoDocumento(documento), caminho: selecao?.caminho ?? null }
      : null;
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
   * Chamado a cada tecla num editor (HTML ou CSS), ANTES do texto mudar a
   * página. A primeira tecla de uma sequência guarda uma foto, para o
   * Desfazer do painel voltar ao estado de antes da digitação sem perder
   * o resto do histórico.
   */
  const antesDeEditarCodigo = (editor: "html" | "css" = "html") => {
    if (digitando === editor) return;
    const agora = fotoAtual();
    if (!agora) return;
    digitando = editor;
    empilhar(agora);
  };

  /* -------------------------------------------------------------- */
  /* CSS: painel Estilos e editor CSS                               */
  /* -------------------------------------------------------------- */

  /** O seletor da regra de uma referência, no CSS de agora (para os eventos). */
  const seletorDaRef = (css: string, ref: RefDeclaracao): string =>
    analisarCss(css).regras[ref.indiceRegra]?.seletor ?? "";

  /** Define uma propriedade numa regra (troca o valor ou acrescenta). */
  const definirPropriedade = (seletorRegra: string, propriedade: string, valor: string): boolean => {
    const mudou = operarCss((css) => definirPropriedadeNoTexto(css, seletorRegra, propriedade, valor));
    if (mudou) emitir({ tipo: "editouPropriedade", seletor: seletorRegra, propriedade, valor: valor.trim() });
    return mudou;
  };

  /**
   * Edição de uma declaração pelo painel (nome ou valor). Nome ou valor
   * vazio apaga a declaração, como no Chrome.
   */
  const editarDeclaracao = (ref: RefDeclaracao, campo: "nome" | "valor", texto: string): boolean => {
    const antes = lerCss();
    if (antes === null) return false;
    const declaracao = analisarCss(antes).regras[ref.indiceRegra]?.declaracoes[ref.indiceDeclaracao];
    if (!declaracao) return false;
    const vazio = texto.trim().length === 0;
    const mudou = operarCss((css) =>
      vazio ? removerDeclaracao(css, ref) : campo === "nome" ? trocarNome(css, ref, texto) : trocarValor(css, ref, texto),
    );
    if (mudou) {
      emitir({
        tipo: "editouPropriedade",
        seletor: seletorDaRef(antes, ref),
        propriedade: campo === "nome" && !vazio ? texto.trim().toLowerCase() : declaracao.propriedade,
        valor: campo === "valor" && !vazio ? texto.trim() : vazio ? "" : declaracao.valorBruto,
      });
    }
    return mudou;
  };

  /** Liga ou desliga uma declaração (a checkbox do painel). */
  const alternarDeclaracao = (ref: RefDeclaracao): boolean => {
    const antes = lerCss();
    if (antes === null) return false;
    const declaracao = analisarCss(antes).regras[ref.indiceRegra]?.declaracoes[ref.indiceDeclaracao];
    if (!declaracao) return false;
    const mudou = operarCss((css) => alternarDeclaracaoNoTexto(css, ref));
    if (mudou) {
      emitir({ tipo: "alternouDeclaracao", seletor: seletorDaRef(antes, ref), propriedade: declaracao.propriedade, ativa: !declaracao.ativa });
    }
    return mudou;
  };

  /** Liga ou desliga a declaração da propriedade numa regra (a ação alternarDeclaracao). */
  const alternarPropriedade = (seletorRegra: string, propriedade: string): boolean => {
    const antes = lerCss();
    if (antes === null) return false;
    const mudou = operarCss((css) => alternarPropriedadeNoTexto(css, seletorRegra, propriedade));
    if (mudou) {
      const regra = acharRegra(analisarCss(lerCss() ?? ""), seletorRegra)?.regra;
      const declaracao = regra?.declaracoes[acharDeclaracao(regra, propriedade)];
      emitir({ tipo: "alternouDeclaracao", seletor: seletorRegra, propriedade: propriedade.toLowerCase(), ativa: declaracao?.ativa ?? true });
    }
    return mudou;
  };

  /** Acrescenta uma declaração no fim de uma regra (o "+" do painel). Devolve a referência dela. */
  const adicionarDeclaracao = (indiceRegra: number, propriedade: string, valor: string): RefDeclaracao | null => {
    const antes = lerCss();
    if (antes === null) return null;
    const resultado = adicionarDeclaracaoNoTexto(antes, indiceRegra, propriedade, valor);
    if (!resultado || !operarCss(() => resultado.texto)) return null;
    emitir({ tipo: "editouPropriedade", seletor: seletorDaRef(antes, resultado.ref), propriedade: propriedade.trim().toLowerCase(), valor: valor.trim() });
    return resultado.ref;
  };

  /** Cria uma regra nova no fim da folha. Devolve o índice dela. */
  const adicionarRegra = (seletor: string, declaracoes: readonly { propriedade: string; valor: string }[] = []): number | null => {
    const antes = lerCss();
    if (antes === null) return null;
    const resultado = adicionarRegraNoTexto(antes, seletor, declaracoes);
    if (!resultado || !operarCss(() => resultado.texto)) return null;
    emitir({ tipo: "adicionouRegra", seletor: seletor.trim() });
    return resultado.indiceRegra;
  };

  /** Escreve CSS no começo ou no fim da folha (como o jogador faria no editor CSS). */
  const escreverCss = (posicao: "inicio" | "fim", texto: string): boolean => {
    const mudou = operarCss((css) => escreverNoTexto(css, posicao, texto));
    if (mudou) emitir({ tipo: "editouCss" });
    return mudou;
  };

  /**
   * Troca o atributo style inteiro de um elemento (o element.style do painel
   * Estilos). Vazio tira o atributo. Entra no desfazer como qualquer edição.
   */
  const editarEstiloInline = (caminho: number[], estilo: string, detalhe: { propriedade: string; valor: string }): boolean => {
    const mudou = operar((documento) => {
      const elemento = noPeloCaminho(raizDoDocumento(documento), caminho);
      if (!ehElemento(elemento)) return false;
      const novo = estilo.trim();
      if ((elemento.getAttribute("style") ?? "") === novo) return false;
      if (novo.length === 0) elemento.removeAttribute("style");
      else elemento.setAttribute("style", novo);
      return true;
    });
    if (mudou) emitir({ tipo: "editouPropriedade", seletor: "element.style", propriedade: detalhe.propriedade, valor: detalhe.valor });
    return mudou;
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
    adicionarAtributos,
    alternarEsconder,
    apagar,
    duplicar,
    renomearTag,
    clicarLink,
    inserirHtml,
    desfazer,
    refazer,
    antesDeEditarCodigo,
    lerCss,
    definirPropriedade,
    editarDeclaracao,
    alternarDeclaracao,
    alternarPropriedade,
    adicionarDeclaracao,
    adicionarRegra,
    escreverCss,
    editarEstiloInline,
    podeDesfazer: () => pilhaDesfazer.length > 0,
    podeRefazer: () => pilhaRefazer.length > 0,
  };
}

export type NucleoPainel = ReturnType<typeof criarNucleoPainel>;

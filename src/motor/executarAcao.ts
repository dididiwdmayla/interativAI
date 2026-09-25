/*
 * Executor das ações declarativas (src/conteudo/tipos.ts).
 *
 * Ele traduz cada ação em chamadas ao painel (PainelDasAcoes). Na
 * interface, o painel são as mesmas funções que a árvore, o menu, a
 * trilha e a setinha chamam quando o jogador faz a ação à mão; nos testes,
 * é o núcleo (src/motor/nucleoPainel.ts) rodando num Document solto.
 */
import type { Acao } from "@/conteudo/tipos";
import { elementoDoNo } from "@/lib/arvore";
import { caminhoDoNo, ehTexto, filhosVisiveis } from "@/lib/dom";
import { temClasseEsconder } from "@/lib/esconder";
import type { OrigemSelecao } from "./eventos";
import { origemDaVia } from "./nucleoPainel";

/** O que o executor precisa do painel. */
export type PainelDasAcoes = {
  obterDocumento: () => Document | null;
  noSelecionado: () => Node | null;
  selecionar: (caminho: number[], origem: OrigemSelecao) => void;
  editarTexto: (caminho: number[], texto: string) => boolean;
  editarAtributo: (caminho: number[], nome: string, valor: string) => boolean;
  alternarEsconder: (caminho: number[]) => boolean;
  apagar: (caminho: number[]) => boolean;
  duplicar: (caminho: number[]) => boolean;
  renomearTag: (caminho: number[], novaTag: string) => boolean;
  /** Devolve null se o caminho não é (nem está dentro de) um link. */
  clicarLink: (caminho: number[]) => unknown;
  inserirHtml: (caminho: number[], posicao: Extract<Acao, { tipo: "inserirHTML" }>["posicao"], html: string) => boolean;
  desfazer: () => boolean;
  responderPrevisao: (opcao: number) => void;
  /** CSS (painel Estilos e editor CSS). Só existem numa fase com `siteAlvo.css`. */
  definirPropriedade: (seletorRegra: string, propriedade: string, valor: string) => boolean;
  alternarPropriedade: (seletorRegra: string, propriedade: string) => boolean;
  adicionarRegra: (seletor: string, declaracoes?: readonly { propriedade: string; valor: string }[]) => number | null;
  escreverCss: (posicao: "inicio" | "fim", texto: string) => boolean;
  /** O texto da folha editável agora (null: a fase não tem CSS). */
  lerCss: () => string | null;
};

/** Ação que não deu para executar: a mensagem diz o que quebrou. */
export class ErroAcao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroAcao";
  }
}

/** Resumo curto de uma ação, para mensagens de erro e o /lab/fases. */
export function descreverAcao(acao: Acao): string {
  switch (acao.tipo) {
    case "selecionar":
      return `selecionar ${acao.seletor}${acao.via ? ` pela via ${acao.via}` : ""}`;
    case "definirTexto":
      return `definirTexto ${acao.seletor} = "${acao.valor}"`;
    case "definirAtributo":
      return `definirAtributo ${acao.seletor} ${acao.nome}="${acao.valor}"`;
    case "esconder":
      return `esconder ${acao.seletor}`;
    case "apagar":
      return `apagar ${acao.seletor}`;
    case "duplicar":
      return `duplicar ${acao.seletor}`;
    case "renomearTag":
      return `renomearTag ${acao.seletor} para ${acao.novaTag}`;
    case "clicarLink":
      return `clicarLink ${acao.seletor}`;
    case "desfazer":
      return "desfazer";
    case "inserirHTML":
      return `inserirHTML ${acao.posicao} de ${acao.seletor}`;
    case "responderPrevisao":
      return `responderPrevisao ${acao.opcao}`;
    case "definirPropriedade":
      return `definirPropriedade ${acao.seletorRegra} { ${acao.propriedade}: ${acao.valor} }`;
    case "alternarDeclaracao":
      return `alternarDeclaracao ${acao.seletorRegra} { ${acao.propriedade} }`;
    case "adicionarRegra":
      return `adicionarRegra ${acao.seletorRegra}`;
    case "editarCss":
      return `editarCss no ${acao.posicao}`;
  }
}

/** A fase precisa ter CSS editável para as ações de CSS. */
function exigirCss(painel: PainelDasAcoes): string {
  const css = painel.lerCss();
  if (css === null) throw new ErroAcao("esta fase não tem CSS editável (siteAlvo.css)");
  return css;
}

function documentoDo(painel: PainelDasAcoes): Document {
  const documento = painel.obterDocumento();
  if (!documento?.body) throw new ErroAcao("a página ainda não carregou");
  return documento;
}

/**
 * Acha o elemento de um seletor de ação. "$0" é o selecionado e
 * "$0 h3" procura dentro dele, como no Console do F12.
 */
export function resolverElemento(painel: PainelDasAcoes, seletor: string): Element {
  const documento = documentoDo(painel);
  const texto = seletor.trim();
  let raiz: Document | Element = documento;
  let resto = texto;
  if (texto === "$0" || texto.startsWith("$0 ")) {
    const selecionado = elementoDoNo(painel.noSelecionado());
    if (!selecionado) throw new ErroAcao(`o seletor "${seletor}" usa $0, mas nada está selecionado`);
    if (texto === "$0") return selecionado;
    raiz = selecionado;
    resto = texto.slice(3).trim();
  }
  let achado: Element | null;
  try {
    achado = raiz.querySelector(resto);
  } catch {
    throw new ErroAcao(`o seletor "${seletor}" não é um seletor CSS válido`);
  }
  if (!achado) throw new ErroAcao(`o seletor "${seletor}" não achou nenhum elemento`);
  return achado;
}

function caminhoDe(painel: PainelDasAcoes, elemento: Element, seletor: string): number[] {
  const documento = documentoDo(painel);
  const caminho = elemento === documento.body ? [] : caminhoDoNo(documento.body, elemento);
  if (!caminho) throw new ErroAcao(`o seletor "${seletor}" achou algo fora do body`);
  return caminho;
}

/**
 * Onde os dois cliques da árvore mexem: no texto único do elemento
 * (quando ele só tem um texto dentro) ou no próprio elemento vazio.
 */
function caminhoDoTexto(painel: PainelDasAcoes, elemento: Element, seletor: string): number[] {
  const caminho = caminhoDe(painel, elemento, seletor);
  const filhos = filhosVisiveis(elemento);
  if (filhos.length === 0) return caminho;
  if (filhos.length === 1 && ehTexto(filhos[0])) return [...caminho, 0];
  throw new ErroAcao(
    `"${seletor}" tem outros elementos dentro; pela árvore só dá para trocar o texto de um elemento que só tem texto`,
  );
}

/** Seleciona como o clique da árvore (e o botão direito) fazem antes de editar. */
function selecionarPelaArvore(painel: PainelDasAcoes, caminho: number[]) {
  painel.selecionar(caminho, "arvore");
}

/** Executa uma ação. Lança ErroAcao quando não dá. */
export function executarAcao(acao: Acao, painel: PainelDasAcoes): void {
  switch (acao.tipo) {
    case "selecionar": {
      const via = acao.via ?? "arvore";
      if (via === "trilha") {
        // A trilha só mostra os ancestrais do selecionado: sobe até o mais próximo que casa.
        const selecionado = elementoDoNo(painel.noSelecionado());
        if (!selecionado) throw new ErroAcao(`selecionar pela trilha pede algo selecionado antes`);
        let alvo: Element | null;
        try {
          alvo = selecionado.closest(acao.seletor);
        } catch {
          throw new ErroAcao(`o seletor "${acao.seletor}" não é um seletor CSS válido`);
        }
        if (!alvo) {
          throw new ErroAcao(`a trilha do selecionado não tem nenhum ancestral que case com "${acao.seletor}"`);
        }
        painel.selecionar(caminhoDe(painel, alvo, acao.seletor), "trilha");
        return;
      }
      const elemento = resolverElemento(painel, acao.seletor);
      painel.selecionar(caminhoDe(painel, elemento, acao.seletor), origemDaVia(via));
      return;
    }
    case "definirTexto": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDoTexto(painel, elemento, acao.seletor);
      selecionarPelaArvore(painel, caminhoDe(painel, elemento, acao.seletor));
      painel.editarTexto(caminho, acao.valor);
      return;
    }
    case "definirAtributo": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      selecionarPelaArvore(painel, caminho);
      painel.editarAtributo(caminho, acao.nome, acao.valor);
      return;
    }
    case "esconder": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      selecionarPelaArvore(painel, caminho);
      // Esconder é "deixar escondido": se já está, não mexe (a tecla H alternaria).
      if (!temClasseEsconder(elemento)) painel.alternarEsconder(caminho);
      return;
    }
    case "apagar": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      if (caminho.length === 0) throw new ErroAcao("o body não pode ser apagado");
      selecionarPelaArvore(painel, caminho);
      painel.apagar(caminho);
      return;
    }
    case "duplicar": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      if (caminho.length === 0) throw new ErroAcao("o body não pode ser duplicado");
      selecionarPelaArvore(painel, caminho);
      painel.duplicar(caminho);
      return;
    }
    case "renomearTag": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      if (caminho.length === 0) throw new ErroAcao("o body não pode ser renomeado");
      selecionarPelaArvore(painel, caminho);
      if (!painel.renomearTag(caminho, acao.novaTag)) {
        throw new ErroAcao(
          `não deu para renomear <${elemento.tagName.toLowerCase()}> para "${acao.novaTag}" ` +
            "(nome igual, inválido, html/head/body, ou tag sem conteúdo numa peça com filhos)",
        );
      }
      return;
    }
    case "clicarLink": {
      const elemento = resolverElemento(painel, acao.seletor);
      if (!elemento.closest("a, area")) throw new ErroAcao(`"${acao.seletor}" não é um link (a) nem está dentro de um`);
      if (painel.clicarLink(caminhoDe(painel, elemento, acao.seletor)) === null) {
        throw new ErroAcao(`não deu para clicar no link "${acao.seletor}"`);
      }
      return;
    }
    case "desfazer": {
      if (!painel.desfazer()) throw new ErroAcao("não havia nada para desfazer");
      return;
    }
    case "inserirHTML": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      if (!painel.inserirHtml(caminho, acao.posicao, acao.html)) {
        throw new ErroAcao(`não deu para inserir HTML ${acao.posicao} de "${acao.seletor}"`);
      }
      return;
    }
    case "responderPrevisao": {
      painel.responderPrevisao(acao.opcao);
      return;
    }
    case "definirPropriedade": {
      exigirCss(painel);
      if (!painel.definirPropriedade(acao.seletorRegra, acao.propriedade, acao.valor)) {
        throw new ErroAcao(
          `não deu para definir ${acao.propriedade} na regra "${acao.seletorRegra}" (a regra não existe, o nome não serve ou o valor já era esse)`,
        );
      }
      return;
    }
    case "alternarDeclaracao": {
      exigirCss(painel);
      if (!painel.alternarPropriedade(acao.seletorRegra, acao.propriedade)) {
        throw new ErroAcao(`a regra "${acao.seletorRegra}" não tem ${acao.propriedade} para ligar ou desligar`);
      }
      return;
    }
    case "adicionarRegra": {
      exigirCss(painel);
      if (painel.adicionarRegra(acao.seletorRegra, acao.declaracoes ?? []) === null) {
        throw new ErroAcao(`não deu para criar a regra "${acao.seletorRegra}"`);
      }
      return;
    }
    case "editarCss": {
      exigirCss(painel);
      if (!painel.escreverCss(acao.posicao, acao.texto)) throw new ErroAcao("editarCss não mudou nada");
      return;
    }
  }
}

/** Executa várias ações em ordem; o erro diz qual delas quebrou. */
export function executarAcoes(acoes: readonly Acao[], painel: PainelDasAcoes): void {
  acoes.forEach((acao, indice) => {
    try {
      executarAcao(acao, painel);
    } catch (erro) {
      const motivo = erro instanceof Error ? erro.message : String(erro);
      throw new ErroAcao(`ação ${indice + 1} de ${acoes.length} (${descreverAcao(acao)}): ${motivo}`);
    }
  });
}

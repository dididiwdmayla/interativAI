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
import { caminhoDoNo, ehTexto, filhosVisiveis, raizDaArvore } from "@/lib/dom";
import { temClasseEsconder } from "@/lib/esconder";
import type { OrigemSelecao } from "./eventos";
import type { Utm } from "./medicao";
import type { TipoPortao } from "./circuito/modelo";
import type { ControleDepurador } from "./depurador";
import { origemDaVia } from "./nucleoPainel";

/** O que o executor precisa do painel. */
export type PainelDasAcoes = {
  obterDocumento: () => Document | null;
  noSelecionado: () => Node | null;
  selecionar: (caminho: number[], origem: OrigemSelecao) => void;
  editarTexto: (caminho: number[], texto: string) => boolean;
  editarAtributo: (caminho: number[], nome: string, valor: string) => boolean;
  adicionarAtributos: (caminho: number[], atributos: readonly { nome: string; valor: string }[]) => boolean;
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
  /** (E5) Salva a maquete do jogo como Meu tema. Só existe numa fase com site-alvo "jogo". */
  salvarTema?: () => boolean;
  /** (Publicar) O "Levar pro mundo": só existe numa fase com a ferramenta levar-pro-mundo. */
  levarProMundo?: () => void;
  /** (Lighthouse) O botão Analisar: só existe numa fase com a ferramenta lighthouse. */
  analisarAuditoria?: () => void;
  /** (Medição) Um clique num elemento da prévia: só existe numa fase com a ferramenta medicao. */
  clicarNaPrevia?: (elemento: Element) => void;
  /** (Medição) Uma visita simulada por um link rastreável: só numa fase com link-rastreavel. */
  simularVisita?: (utm: Utm) => void;
  /** (Campanha) Muda o orçamento, a palavra-chave ou o lance: só numa fase simulador-campanha. */
  configurarCampanha?: (mudanca: { orcamento?: number; palavra?: string; lance?: number }) => void;
  /** (Código) Console e Snippet: só existem numa fase de programa. */
  programa?: {
    executarNoConsole: (codigo: string) => void;
    definirSnippet: (codigo: string) => void;
    executarSnippet: () => void;
  };
  /** (Circuito) A bancada: só existe numa fase circuito-logico ou num desafio com circuito. Devolve false se não deu (peça que não existe). */
  circuito?: {
    adicionarPortao: (portao: TipoPortao, id: string, lugar?: { x: number; y: number }) => boolean;
    ligarFio: (de: string, para: string, porta: number) => boolean;
    alternarEntrada: (entrada: string, ligada?: boolean) => boolean;
    apagarPeca: (id: string) => boolean;
    verComoCodigo: () => void;
  };
  /**
   * (Depurador) Pontos de parada, controles e o painel Observar: só numa fase
   * com o depurador. `controlar` devolve false se o programa não está pausado.
   */
  depurador?: {
    alternarPontoDeParada: (linha: number) => void;
    controlar: (controle: ControleDepurador) => boolean;
    observar: (expressao: string) => void;
  };
  /** (Ordenar) O quadro de passos: só numa fase ordenar-passos. Devolve false se o cartão (ou o grupo) não existe. */
  ordenar?: {
    porPasso: (passo: string, posicao?: number, grupo?: string) => boolean;
    tirarPasso: (passo: string) => boolean;
    rodarPlano: () => boolean;
  };
  /**
   * (Fase composta, área plano) O "Levar o plano pro código": só numa fase
   * com as áreas plano e snippet. Devolve false se não deu.
   */
  plano?: {
    levarProCodigo: () => boolean;
    /** Acende o comentário do passo no código; false se ele não está lá. */
    verPassoNoCodigo: (passo: string) => boolean;
  };
  /**
   * (Fase composta, área testes) Os casos de teste do aluno: escrever,
   * apagar e rodar. Só numa fase com a área testes. Devolvem false se não deu.
   */
  casos?: {
    escrever: (entrada: string, esperado: string) => boolean;
    apagar: (indice: number) => boolean;
    rodar: () => boolean;
  };
  /**
   * (Área cena) Abrir a ficha de um dispositivo, ver o "por dentro" e trocar
   * a velocidade da simulação. Devolvem false se o dispositivo não existe.
   */
  cena?: {
    abrirFicha: (dispositivo: string) => boolean;
    verPorDentro: (dispositivo: string) => boolean;
    mudarVelocidade: (velocidade: 1 | 2 | 4) => void;
  };
  /** (Estruturas e desempenho) Ver como árvore e o Medir da aba Desempenho: só nas fases com as ferramentas. */
  estruturas?: {
    verComoArvore?: (nome: string) => boolean;
    medirDesempenho?: () => boolean;
  };
  /** (Modo dispositivo) A barra de dispositivo: só existe numa fase com a ferramenta modo-dispositivo. */
  dispositivo?: {
    trocar: (modelo: Extract<Acao, { tipo: "trocarDispositivo" }>["modelo"], largura?: number) => void;
    girar: () => void;
    desligar: () => void;
  };
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
    case "adicionarAtributo":
      return `adicionarAtributo ${acao.seletor} ${acao.nome}="${acao.valor}"`;
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
    case "salvarTema":
      return "salvarTema";
    case "trocarDispositivo":
      return `trocarDispositivo ${acao.modelo}${acao.largura !== undefined ? ` ${acao.largura}px` : ""}`;
    case "girarDispositivo":
      return "girarDispositivo";
    case "desligarDispositivo":
      return "desligarDispositivo";
    case "analisarAuditoria":
      return "analisarAuditoria";
    case "levarProMundo":
      return "levarProMundo";
    case "clicarNaPrevia":
      return `clicarNaPrevia ${acao.seletor}`;
    case "simularVisita":
      return `simularVisita ${acao.utm.source} / ${acao.utm.medium} / ${acao.utm.campaign}`;
    case "configurarCampanha":
      return `configurarCampanha${acao.orcamento !== undefined ? ` orçamento ${acao.orcamento}` : ""}${
        acao.palavraChave !== undefined ? ` palavra ${acao.palavraChave}` : ""
      }${acao.lance !== undefined ? ` lance ${acao.lance}` : ""}`;
    case "executarNoConsole":
      return `executarNoConsole ${JSON.stringify(acao.codigo.length > 60 ? `${acao.codigo.slice(0, 60)}…` : acao.codigo)}`;
    case "definirSnippet":
      return `definirSnippet (${acao.codigo.split("\n").length} linha(s))`;
    case "executarSnippet":
      return "executarSnippet";
    case "adicionarPortao":
      return `adicionarPortao ${acao.portao} (${acao.id})`;
    case "ligarFio":
      return `ligarFio ${acao.de} -> ${acao.para}:${acao.porta ?? 0}`;
    case "alternarEntrada":
      return `alternarEntrada ${acao.entrada}${acao.ligada === undefined ? "" : acao.ligada ? " ligada" : " desligada"}`;
    case "apagarPeca":
      return `apagarPeca ${acao.id}`;
    case "verComoCodigo":
      return "verComoCodigo";
    case "alternarPontoDeParada":
      return `alternarPontoDeParada linha ${acao.linha}`;
    case "controlarDepurador":
      return `controlarDepurador ${acao.controle}`;
    case "observar":
      return `observar ${JSON.stringify(acao.expressao)}`;
    case "porPasso":
      return `porPasso ${acao.passo}${acao.grupo ? ` em ${acao.grupo}` : ""}${acao.posicao !== undefined ? ` na posição ${acao.posicao}` : ""}`;
    case "tirarPasso":
      return `tirarPasso ${acao.passo}`;
    case "rodarPlano":
      return "rodarPlano";
    case "levarPlanoProCodigo":
      return "levarPlanoProCodigo";
    case "verPassoNoCodigo":
      return `verPassoNoCodigo ${acao.passo}`;
    case "escreverCaso":
      return `escreverCaso (${acao.entrada}) => ${acao.esperado}`;
    case "apagarCaso":
      return `apagarCaso ${acao.indice}`;
    case "rodarCasos":
      return "rodarCasos";
    case "verComoArvore":
      return `verComoArvore ${acao.nome}`;
    case "medirDesempenho":
      return "medirDesempenho";
    case "abrirFicha":
      return `abrirFicha ${acao.dispositivo}`;
    case "verPorDentro":
      return `verPorDentro ${acao.dispositivo}`;
    case "velocidadeCena":
      return `velocidadeCena ${acao.velocidade}x`;
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
  const raiz = raizDaArvore(documento) ?? documento.body;
  const caminho = elemento === raiz ? [] : caminhoDoNo(raiz, elemento);
  if (!caminho) throw new ErroAcao(`o seletor "${seletor}" achou algo fora do ${raiz.tagName.toLowerCase()}`);
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
    case "adicionarAtributo": {
      const elemento = resolverElemento(painel, acao.seletor);
      const caminho = caminhoDe(painel, elemento, acao.seletor);
      selecionarPelaArvore(painel, caminho);
      painel.adicionarAtributos(caminho, [{ nome: acao.nome, valor: acao.valor }]);
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
    case "salvarTema": {
      if (!painel.salvarTema) throw new ErroAcao('salvarTema só existe numa fase com o site-alvo do jogo (siteAlvo.tipo: "jogo")');
      if (!painel.salvarTema()) throw new ErroAcao("não deu para salvar o tema (a maquete sem as cores do jogo?)");
      return;
    }
    case "trocarDispositivo":
    case "girarDispositivo":
    case "desligarDispositivo": {
      const dispositivo = painel.dispositivo;
      if (!dispositivo) throw new ErroAcao(`${acao.tipo} pede a ferramenta modo-dispositivo em usaFerramentas`);
      if (acao.tipo === "trocarDispositivo") dispositivo.trocar(acao.modelo, acao.largura);
      else if (acao.tipo === "girarDispositivo") dispositivo.girar();
      else dispositivo.desligar();
      return;
    }
    case "analisarAuditoria": {
      if (!painel.analisarAuditoria) throw new ErroAcao("analisarAuditoria pede a ferramenta lighthouse em usaFerramentas");
      painel.analisarAuditoria();
      return;
    }
    case "levarProMundo": {
      if (!painel.levarProMundo) throw new ErroAcao("levarProMundo pede a ferramenta levar-pro-mundo em usaFerramentas");
      painel.levarProMundo();
      return;
    }
    case "clicarNaPrevia": {
      if (!painel.clicarNaPrevia) throw new ErroAcao("clicarNaPrevia pede a ferramenta medicao em usaFerramentas");
      painel.clicarNaPrevia(resolverElemento(painel, acao.seletor));
      return;
    }
    case "simularVisita": {
      if (!painel.simularVisita) throw new ErroAcao("simularVisita pede a ferramenta link-rastreavel em usaFerramentas");
      painel.simularVisita(acao.utm);
      return;
    }
    case "configurarCampanha": {
      if (!painel.configurarCampanha) throw new ErroAcao("configurarCampanha só existe numa fase simulador-campanha");
      painel.configurarCampanha({ orcamento: acao.orcamento, palavra: acao.palavraChave, lance: acao.lance });
      return;
    }
    case "executarNoConsole":
    case "definirSnippet":
    case "executarSnippet": {
      if (!painel.programa) throw new ErroAcao(`${acao.tipo} só existe numa fase de programa (com o campo programa)`);
      if (acao.tipo === "executarNoConsole") painel.programa.executarNoConsole(acao.codigo);
      else if (acao.tipo === "definirSnippet") painel.programa.definirSnippet(acao.codigo);
      else painel.programa.executarSnippet();
      return;
    }
    case "adicionarPortao":
    case "ligarFio":
    case "alternarEntrada":
    case "apagarPeca":
    case "verComoCodigo": {
      const bancada = painel.circuito;
      if (!bancada) throw new ErroAcao(`${acao.tipo} só existe numa fase com circuito (circuito-logico ou desafio com circuito)`);
      let deu = true;
      if (acao.tipo === "adicionarPortao") deu = bancada.adicionarPortao(acao.portao, acao.id, acao.x !== undefined && acao.y !== undefined ? { x: acao.x, y: acao.y } : undefined);
      else if (acao.tipo === "ligarFio") deu = bancada.ligarFio(acao.de, acao.para, acao.porta ?? 0);
      else if (acao.tipo === "alternarEntrada") deu = bancada.alternarEntrada(acao.entrada, acao.ligada);
      else if (acao.tipo === "apagarPeca") deu = bancada.apagarPeca(acao.id);
      else bancada.verComoCodigo();
      if (!deu) throw new ErroAcao(`não deu para ${descreverAcao(acao)} (peça ou porta que não existe?)`);
      return;
    }
    case "alternarPontoDeParada":
    case "controlarDepurador":
    case "observar": {
      const depurador = painel.depurador;
      if (!depurador) throw new ErroAcao(`${acao.tipo} só existe numa fase com o depurador (programa.snippet e as ferramentas do depurador)`);
      if (acao.tipo === "alternarPontoDeParada") depurador.alternarPontoDeParada(acao.linha);
      else if (acao.tipo === "observar") depurador.observar(acao.expressao);
      else if (!depurador.controlar(acao.controle)) throw new ErroAcao(`${acao.controle}: o depurador não está pausado (rode o Snippet com um ponto de parada antes)`);
      return;
    }
    case "porPasso":
    case "tirarPasso":
    case "rodarPlano": {
      const quadro = painel.ordenar;
      if (!quadro) throw new ErroAcao(`${acao.tipo} só existe numa fase ordenar-passos`);
      const deu = acao.tipo === "porPasso" ? quadro.porPasso(acao.passo, acao.posicao, acao.grupo) : acao.tipo === "tirarPasso" ? quadro.tirarPasso(acao.passo) : quadro.rodarPlano();
      if (!deu) throw new ErroAcao(acao.tipo === "rodarPlano" ? "rodarPlano pede ordenar.rodar e programa na fase" : `não deu para ${descreverAcao(acao)} (cartão ou grupo que não existe?)`);
      return;
    }
    case "levarPlanoProCodigo": {
      const plano = painel.plano;
      if (!plano) throw new ErroAcao("levarPlanoProCodigo só existe numa fase composta com as áreas plano e snippet");
      if (!plano.levarProCodigo()) throw new ErroAcao("não deu para levar o plano pro código");
      return;
    }
    case "verPassoNoCodigo": {
      const plano = painel.plano;
      if (!plano) throw new ErroAcao("verPassoNoCodigo só existe numa fase composta com as áreas plano e snippet");
      if (!plano.verPassoNoCodigo(acao.passo)) throw new ErroAcao(`o passo "${acao.passo}" não está no código como comentário`);
      return;
    }
    case "escreverCaso":
    case "apagarCaso":
    case "rodarCasos": {
      const casos = painel.casos;
      if (!casos) throw new ErroAcao(`${acao.tipo} só existe numa fase composta com a área testes`);
      const deu = acao.tipo === "escreverCaso" ? casos.escrever(acao.entrada, acao.esperado) : acao.tipo === "apagarCaso" ? casos.apagar(acao.indice) : casos.rodar();
      if (!deu) throw new ErroAcao(acao.tipo === "escreverCaso" ? "a lista de casos está cheia" : acao.tipo === "apagarCaso" ? `não existe o caso ${acao.indice}` : "não deu para rodar os casos");
      return;
    }
    case "verComoArvore": {
      const ver = painel.estruturas?.verComoArvore;
      if (!ver) throw new ErroAcao("verComoArvore pede a ferramenta arvore-palco em usaFerramentas");
      if (!ver(acao.nome)) throw new ErroAcao(`${acao.nome} não é (ainda) um objeto com filhos objetos para ver como árvore`);
      return;
    }
    case "medirDesempenho": {
      const medir = painel.estruturas?.medirDesempenho;
      if (!medir) throw new ErroAcao("medirDesempenho pede a ferramenta grafico-passos e programa.desempenho");
      if (!medir()) throw new ErroAcao("não deu para medir (a fase não tem programa.desempenho?)");
      return;
    }
    case "abrirFicha":
    case "verPorDentro": {
      const cena = painel.cena;
      if (!cena) throw new ErroAcao(`${acao.tipo} só existe numa fase com a área cena`);
      const deu = acao.tipo === "abrirFicha" ? cena.abrirFicha(acao.dispositivo) : cena.verPorDentro(acao.dispositivo);
      if (!deu) throw new ErroAcao(`a cena não tem o dispositivo "${acao.dispositivo}"`);
      return;
    }
    case "velocidadeCena": {
      const cena = painel.cena;
      if (!cena) throw new ErroAcao("velocidadeCena só existe numa fase com a área cena");
      cena.mudarVelocidade(acao.velocidade);
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

/*
 * Formato declarativo do conteúdo do jogo.
 *
 * Tudo aqui é DADO: nenhuma função mora dentro de uma fase. O motor lê
 * estes dados e sabe validar, ajudar, roteirizar e testar sozinho.
 * Isso deixa o conteúdo seguro de produzir em massa: o TypeScript reclama
 * de campo faltando, e `npm run testar:conteudo` reclama de conteúdo que
 * não funciona (seletor que não acha nada, solução que não resolve, texto
 * grande demais, ferramenta não apresentada...).
 *
 * Guia completo de como escrever: docs/GUIA-DE-CONTEUDO.md
 * Template anotado de fase: docs/TEMPLATE-FASE.ts
 */
import type { IdFerramenta } from "@/ferramentas/ids";
import type { TipoEvento } from "@/motor/eventos";
import type { Fala } from "@/motor/tipos";
import type { IdConceito } from "./conceitos";

export type { Fala } from "@/motor/tipos";
export type { IdConceito } from "./conceitos";
export type { IdFerramenta } from "@/ferramentas/ids";

/* ------------------------------------------------------------------ */
/* Validadores: perguntas de sim ou não sobre a página e o que o      */
/* jogador fez. Textos são comparados normalizados (sem espaços nas   */
/* pontas e com espaços repetidos virando um só).                     */
/*                                                                    */
/* Regra dos seletores: quando o seletor acha vários elementos, basta */
/* UM deles cumprir (existe, textoIgual, textoNaoVazio, atributo,     */
/* escondido, selecionado). "contagem" conta todos e                  */
/* "textoDiferenteDoInicial" compara os conjuntos de textos.          */
/* ------------------------------------------------------------------ */

/** Por onde o jogador escolheu o elemento selecionado. */
export type ViaSelecao = "arvore" | "inspecionar" | "trilha" | "editor";

export type OperadorContagem = "==" | ">=" | "<=" | ">" | "<";

export type Validador =
  /** Algum elemento casa com o seletor. */
  | { tipo: "existe"; seletor: string }
  /** Nenhum elemento casa com o seletor (foi apagado, por exemplo). */
  | { tipo: "naoExiste"; seletor: string }
  /**
   * Quantos elementos casam com o seletor, comparado com `valor`.
   * `comTexto: true` só conta os que têm algum texto (um <li></li> vazio não conta).
   */
  | { tipo: "contagem"; seletor: string; op: OperadorContagem; valor: number; comTexto?: boolean }
  /** Algum elemento do seletor tem exatamente este texto. */
  | { tipo: "textoIgual"; seletor: string; valor: string }
  /**
   * Existe texto NOVO: algum elemento do seletor tem um texto (não vazio)
   * que nenhum elemento do mesmo seletor tinha no começo da fase.
   * `minimo` pede pelo menos N textos novos e diferentes entre si (padrão 1).
   */
  | { tipo: "textoDiferenteDoInicial"; seletor: string; minimo?: number }
  /** Algum elemento do seletor tem texto (não está vazio). */
  | { tipo: "textoNaoVazio"; seletor: string }
  /** Algum elemento do seletor tem o atributo (e, se `valor` vier, com esse valor). */
  | { tipo: "atributo"; seletor: string; nome: string; valor?: string }
  /**
   * Algum elemento do seletor está escondido MANTENDO o espaço
   * (visibility: hidden, como a tecla H do F12 faz). Apagado não conta:
   * para isso use naoExiste.
   */
  | { tipo: "escondido"; seletor: string }
  /**
   * O elemento selecionado agora casa com o seletor. Se o selecionado for
   * um texto, vale o elemento dono dele. `via` exige o caminho usado.
   */
  | { tipo: "selecionado"; seletor: string; via?: ViaSelecao }
  /**
   * O evento aconteceu pelo menos `minimo` vezes (padrão 1) desde que o
   * objetivo começou. Com `evento: "clicouLink"`, `href` só conta os
   * cliques em links com esse href (ex.: "#rodape").
   */
  | { tipo: "evento"; evento: TipoEvento; minimo?: number; href?: string }
  /**
   * Algum elemento do seletor tem esta tag (em minúsculas). Renomear
   * preserva os atributos, então um seletor por id continua achando a peça
   * depois de h2 virar h4.
   */
  | { tipo: "tag"; seletor: string; nome: string }
  /**
   * (Modo documento) O título da aba do navegador, que vem do <title>:
   * igual a `valor` (sem os espaços das pontas) ou, sem `valor`, qualquer
   * título que não esteja vazio.
   */
  | { tipo: "tituloDaAba"; valor?: string }
  /*
   * Validadores de CSS: usam o motor de cascata do jogo (src/motor/css),
   * o mesmo que o painel Estilos mostra. Ver "Como escrever fases de CSS"
   * no guia.
   */
  /**
   * O valor que VENCE a cascata para a propriedade, em algum elemento do
   * seletor: a declaração vencedora, a herdada do ancestral ou a inicial.
   * Compara normalizado: cores em qualquer formato (red = #f00 =
   * rgb(255, 0, 0)), números (16.0px = 16px, 0px = 0), espaços e aspas de
   * fonte. Compara o valor DECLARADO, não os pixels calculados (2em
   * continua 2em). Atalho (margin) confere cada propriedade longa. Se o
   * motor não tem certeza, não passa (e o detalhe diz por quê).
   */
  | { tipo: "valorEfetivo"; seletor: string; propriedade: string; valor: string }
  /**
   * A regra `seletorRegra` (nas folhas do site) tem a declaração da
   * propriedade. `valor` confere o valor (normalizado); `ativa: true` pede
   * ligada, `ativa: false` pede desligada (a checkbox); sem `ativa`, vale
   * de qualquer jeito.
   */
  | { tipo: "declaracao"; seletorRegra: string; propriedade: string; valor?: string; ativa?: boolean }
  /** Existe uma regra com esse seletor nas folhas do site (espaços não importam). */
  | { tipo: "regraExiste"; seletorRegra: string }
  /**
   * Em algum elemento do seletor, a declaração da propriedade que mora na
   * regra `seletorRegra` PERDE para outra (fica riscada no painel).
   * `seletorRegra: "element.style"` fala do estilo inline. Desligada não
   * conta: aqui é perder a briga.
   */
  | { tipo: "riscada"; seletor: string; propriedade: string; seletorRegra: string }
  | { tipo: "todos"; validadores: Validador[] }
  | { tipo: "algum"; validadores: Validador[] }
  | { tipo: "nao"; validador: Validador }
  /**
   * Raro: validação escrita em código, registrada em
   * src/conteudo/validadoresCustom.ts com um comentário explicando por que
   * nenhum validador declarativo serve. Veja o guia antes de usar.
   */
  | { tipo: "custom"; id: string };

/* ------------------------------------------------------------------ */
/* Ações: o que o jogador faz, escrito como dado. Servem para a       */
/* solução do "Me ajuda", para os eventos roteirizados e para os      */
/* testes. O executor chama as MESMAS funções que a interface chama   */
/* quando o jogador faz a ação à mão.                                 */
/*                                                                    */
/* Seletores de ação usam o primeiro elemento que casar. "$0" é o     */
/* elemento selecionado (igual ao $0 do F12) e "$0 h3" é um h3 dentro */
/* dele. Com via "trilha", o seletor escolhe o ancestral mais próximo */
/* do selecionado, como a trilha de verdade.                          */
/* ------------------------------------------------------------------ */

export type PosicaoInsercao = "antes" | "depois" | "inicio" | "fim";

export type Acao =
  /** Seleciona o elemento (padrão: pela árvore). */
  | { tipo: "selecionar"; seletor: string; via?: ViaSelecao }
  /** Troca o texto, como os dois cliques na árvore (seleciona o elemento antes). */
  | { tipo: "definirTexto"; seletor: string; valor: string }
  /** Troca o valor de um atributo pela árvore (seleciona o elemento antes). */
  | { tipo: "definirAtributo"; seletor: string; nome: string; valor: string }
  /**
   * Cria um atributo novo pelo menu do nó ("Adicionar atributo", como o
   * Chrome). Se o elemento já tem o atributo, o valor é trocado.
   */
  | { tipo: "adicionarAtributo"; seletor: string; nome: string; valor: string }
  /** Esconde mantendo o espaço, como a tecla H (seleciona o elemento antes). */
  | { tipo: "esconder"; seletor: string }
  /** Apaga o elemento, como a tecla Delete (seleciona o elemento antes). */
  | { tipo: "apagar"; seletor: string }
  /** Duplica o elemento logo depois dele; a cópia fica selecionada. */
  | { tipo: "duplicar"; seletor: string }
  /** Troca o nome da tag pela árvore (dois cliques no nome); atributos e filhos ficam. */
  | { tipo: "renomearTag"; seletor: string; novaTag: string }
  /** Clica num link da prévia (a prévia não navega; ver src/lib/linksPrevia.ts). */
  | { tipo: "clicarLink"; seletor: string }
  /** Desfaz a última mudança feita pelo painel. */
  | { tipo: "desfazer" }
  /** Escreve HTML novo perto de um elemento (o que o jogador faria no editor de código). */
  | { tipo: "inserirHTML"; seletor: string; posicao: PosicaoInsercao; html: string }
  /** Responde o card de previsão (índice a partir de 0). */
  | { tipo: "responderPrevisao"; opcao: number }
  /**
   * Define uma propriedade numa regra, como a edição do painel Estilos: se
   * a regra já tem a propriedade ligada, troca o valor; se não, acrescenta.
   */
  | { tipo: "definirPropriedade"; seletorRegra: string; propriedade: string; valor: string }
  /** Liga ou desliga (a checkbox) a declaração da propriedade na regra. */
  | { tipo: "alternarDeclaracao"; seletorRegra: string; propriedade: string }
  /** Cria uma regra nova no fim da folha (o botão de regra nova do painel Estilos). */
  | { tipo: "adicionarRegra"; seletorRegra: string; declaracoes?: { propriedade: string; valor: string }[] }
  /** Escreve CSS no começo ou no fim da folha (o que o jogador digitaria no editor CSS). */
  | { tipo: "editarCss"; posicao: "inicio" | "fim"; texto: string };

/* ------------------------------------------------------------------ */
/* Objetivos                                                          */
/* ------------------------------------------------------------------ */

/** Degrau 3 da escada de ajuda: mostra ONDE olhar. */
export type AjudaLinha =
  /** Pisca um nó da árvore (ou só o texto dele, com parte: "texto"). */
  | { alvo: "arvore"; seletor: string; parte?: "no" | "texto"; fala: string }
  /** Pisca no editor as linhas de todos os elementos do seletor. */
  | { alvo: "editor"; seletor: string; fala: string }
  /** Pisca o botão ou a área de uma ferramenta (a setinha, a trilha...). */
  | { alvo: "ferramenta"; ferramenta: IdFerramenta; fala: string }
  /** Pisca no editor CSS as linhas da regra (e, com `propriedade`, só a declaração). */
  | { alvo: "css"; seletorRegra: string; propriedade?: string; fala: string }
  /** Pisca a regra no painel Estilos (e, com `propriedade`, só a declaração). */
  | { alvo: "estilos"; seletorRegra: string; propriedade?: string; fala: string };

/** Degrau 4: a solução aplicada na frente do jogador (custa 1 estrela). */
export type SolucaoAjuda = {
  /** Explica O QUE foi feito e POR QUÊ. */
  fala: string;
  acoes: Acao[];
};

/** Guiado: ajuda completa, os 4 degraus. */
export type AjudasGuiado = {
  /** Degrau 1: pergunta socrática, que faz pensar e não entrega. */
  pergunta: string;
  /** Degrau 2: o conceito. */
  dica: string;
  linha: AjudaLinha;
  solucao: SolucaoAjuda;
};

/** Sozinho: ajuda limitada, só os degraus 1 e 2. */
export type AjudasSozinho = {
  pergunta: string;
  dica: string;
};

/** Momento roteirizado (ex.: o computadorzinho esbarra e apaga algo). */
export type EventoRoteirizado = {
  acoes: Acao[];
  /** Fala mostrada depois das ações. */
  fala?: Fala;
  /** Animação do computadorzinho antes das ações. */
  animacao?: "esbarrao";
};

export type Previsao = {
  pergunta: string;
  /** 2 a 4 opções curtas. */
  opcoes: string[];
  /** Índice da certa (a partir de 0). */
  correta: number;
  /** Mostrada depois da resposta, certa ou errada. */
  explicacao: string;
};

type ObjetivoBase = {
  /** Único dentro da fase, kebab-case. */
  id: string;
  /** Até 140 caracteres cada. `toque` troca "clique" por "toque" e afins. */
  enunciado: { mouse: string; toque: string };
  /** Quando passa, o objetivo está cumprido (numa previsão: depois de responder). */
  validador: Validador;
  /** Ferramentas apresentadas quando este objetivo começa. */
  apresentar?: IdFerramenta[];
  /** Momento roteirizado que roda quando o objetivo começa. */
  eventoAoComecar?: EventoRoteirizado;
  falaAoConcluir: Fala;
  /**
   * Obrigatória: ações que cumprem o objetivo, usadas pelos testes e pelo
   * /lab/fases. Num objetivo de previsão, comece com responderPrevisao.
   */
  solucaoDeTeste: Acao[];
};

type ObjetivoPorModo =
  | { modo: "guiado"; ajudas: AjudasGuiado }
  | { modo: "sozinho"; ajudas: AjudasSozinho };

type ObjetivoPorTipo =
  /** Fazer algo na página. */
  | { tipo: "acao" }
  /** Primeiro prever (card com opções), depois fazer e ver acontecer. */
  | { tipo: "previsao"; previsao: Previsao };

export type Objetivo = ObjetivoBase & ObjetivoPorModo & ObjetivoPorTipo;

export type ModoObjetivo = Objetivo["modo"];

/* ------------------------------------------------------------------ */
/* Fases                                                              */
/* ------------------------------------------------------------------ */

/**
 * O site de outra pessoa que o jogador vai mexer. Única exceção à regra
 * das cores: o CSS dele tem cores próprias. Mora em `sites/` da unidade.
 */
export type SiteAlvo = {
  /** Endereço de mentirinha mostrado na barra do navegador. */
  url: string;
  /** Título acessível do iframe. */
  titulo: string;
  /**
   * <head> fixo (estilos). Não aparece no editor. Numa fase com
   * `modoDocumento`, é o head INICIAL, editável como o resto.
   */
  head: string;
  /** <body> inicial: é o que aparece na árvore e no editor. */
  body: string;
  /**
   * Opcional: a folha de estilo EDITÁVEL do site (a aba CSS do editor e o
   * painel Estilos mexem nela; no painel ela se chama "estilo.css"). Vai
   * num <style data-folha-jogo> depois do head. Sem ela, a fase funciona
   * como sempre (só o head fixo).
   */
  css?: string;
};

/** Sub-painéis da aba Elementos, como no Chrome (Styles e Computed). */
export type PainelElementos = "estilos" | "calculado";

/** Uma parte do desafio: a validação do desafio é a soma das partes. */
export type ParteDesafio = {
  id: string;
  /** Aparece no checklist. Até 140 caracteres. */
  descricao: string;
  validador: Validador;
  /**
   * Id da fase (da mesma unidade) onde isso foi ensinado de forma GUIADA:
   * abre no "Rever". A fase apontada tem pelo menos 1 objetivo guiado
   * (a escada de ajuda completa socorre quem travou).
   */
  revisarEm: string;
  /** Ações que cumprem esta parte (testes, /lab/fases e a prévia do "depois"). */
  solucaoDeTeste: Acao[];
};

type FaseBase = {
  /** Formato: "<ilha>-<zona>-u<unidade>-f<fase>", ex.: "sites-elementos-u2-f1". */
  id: string;
  unidadeId: string;
  titulo: string;
  /** O que esta fase ENSINA (no desafio: o que ele PRATICA). */
  conceitos: IdConceito[];
  /** O que ela REVISITA de fases anteriores, misturado na tarefa. */
  revisa: IdConceito[];
  /** O que o jogador precisa saber antes. */
  prerequisitos: IdConceito[];
  /** Toda ferramenta que a fase usa (inclusive nas soluções). */
  usaFerramentas: IdFerramenta[];
  /** Ferramentas apresentadas logo depois da introdução. */
  apresentar?: IdFerramenta[];
  introducao: Fala[];
  /** Momentos roteirizados logo depois da introdução. */
  eventosIniciais?: EventoRoteirizado[];
  siteAlvo: SiteAlvo;
  /**
   * Sub-painéis liberados dentro de Elementos (o painel Estilos e o
   * Calculado). Sem o campo, a fase não mostra nenhum.
   */
  paineisElementos?: PainelElementos[];
  /**
   * Modo documento: o jogador edita o documento INTEIRO (doctype, html,
   * head e body). O editor mostra tudo, a árvore começa no <html> (com o
   * head, o title e os meta, como no Chrome), a aba do navegador falso
   * mostra o <title> ao vivo e, sem <meta charset>, a prévia simula os
   * acentos quebrados. O documento inicial é montado de siteAlvo.head e
   * siteAlvo.body.
   */
  modoDocumento?: true;
  conclusao: Fala[];
  /** Algo para o jogador fazer num site de verdade, pelo F12. */
  missaoDeCampo?: string;
  /** Última fala, depois da missão de campo. */
  falaFinal?: Fala;
};

/** Micro-passos: objetivos guiados e sozinho, em sequência. */
export type FasePratica = FaseBase & {
  tipo: "pratica";
  objetivos: Objetivo[];
  /**
   * O que a fase TREINA: conceitos já ensinados (com objetivo guiado) numa
   * fase anterior e que aqui voltam só para o jogador fazer sozinho. Uma
   * fase de prática precisa ter `conceitos` ou `pratica` não vazio; uma
   * fase só de objetivos sozinho deixa `conceitos` vazio e põe tudo aqui.
   */
  pratica?: IdConceito[];
};

/** Desafio: sem passo a passo, só o checklist das partes. */
export type FaseDesafio = FaseBase & { tipo: "desafio"; partes: ParteDesafio[] };

/**
 * Registro extensível de tipos de fase (ver src/motor/tiposDeFase.ts).
 * Tipos futuros ("linha-do-tempo", "comparador", "diagrama-rede") entram
 * aqui como novas variantes.
 */
export type Fase = FasePratica | FaseDesafio;

export type TipoFase = Fase["tipo"];

/* ------------------------------------------------------------------ */
/* Unidades                                                           */
/* ------------------------------------------------------------------ */

export type Unidade = {
  /** Formato: "<ilha>-<zona>-u<numero>", ex.: "sites-elementos-u2". */
  id: string;
  ilha: string;
  zona: string;
  /** Número da unidade dentro da zona (1, 2, 3...). */
  numero: number;
  titulo: string;
  meta: {
    /** "No fim desta unidade, você..." Até 200 caracteres. */
    enunciado: string;
    /**
     * Fase de desafio da unidade (a última, do tipo desafio, da mesma
     * unidade). A prévia antes/depois vem do site dela. Opcional só enquanto
     * a unidade ainda não tem desafio. A meta aparece uma vez na entrada da
     * unidade (primeira fase, sem progresso nenhum nela) e antes do desafio.
     */
    desafioId?: string;
  };
  /** Ids das fases, em ordem, terminando no desafio. */
  fases: string[];
};

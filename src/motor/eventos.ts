import type { Utm } from "./medicao";
import type { ResumoExecucao } from "./programa";
import type { ControleDepurador, MotivoPausa } from "./depurador";
import type { MedicaoPassos, ValorExibido } from "./executor/tipos";

/**
 * De onde veio uma seleção.
 * - "arvore" e "teclado": clique ou setas na árvore de elementos;
 * - "inspecao": modo inspecionar (a setinha);
 * - "trilha": a trilha de ancestrais no rodapé da aba Elementos;
 * - "codigo": cursor posto no editor de código;
 * - "sistema": o próprio jogo mudou a seleção (depois de apagar, duplicar,
 *   desfazer). Não gera evento "selecionou".
 */
export type OrigemSelecao = "arvore" | "teclado" | "inspecao" | "trilha" | "codigo" | "sistema";

export type EventoFase =
  | { tipo: "selecionou"; tag: string; caminho: number[]; origem: OrigemSelecao }
  | { tipo: "inspecionou"; tag: string; caminho: number[] }
  | { tipo: "trilha"; tag: string; caminho: number[] }
  | { tipo: "editouTexto"; tag: string; caminho: number[]; texto: string }
  | { tipo: "editouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  /** Criou um atributo que o elemento não tinha ("Adicionar atributo" do menu do nó). */
  | { tipo: "adicionouAtributo"; tag: string; caminho: number[]; atributo: string; valor: string }
  | { tipo: "editouCodigo" }
  | { tipo: "escondeu"; tag: string; caminho: number[] }
  | { tipo: "mostrou"; tag: string; caminho: number[] }
  | { tipo: "apagou"; tag: string; caminho: number[] }
  /** O caminho é o da cópia, que fica logo depois do original. */
  | { tipo: "duplicou"; tag: string; caminho: number[] }
  | { tipo: "desfez" }
  | { tipo: "refez" }
  | { tipo: "respondeuPrevisao"; opcao: number; acertou: boolean }
  /** Trocou o nome da tag (h2 virou h4). `tag` é a nova; `de`, a antiga. O caminho não muda. */
  | { tipo: "renomeouTag"; tag: string; de: string; caminho: number[] }
  /** Clicou num link da prévia (a navegação é segurada; ver src/lib/linksPrevia.ts). */
  | { tipo: "clicouLink"; href: string; destino: DestinoLink; caminho: number[] }
  /** Digitou no editor CSS (ou uma ação editarCss escreveu na folha). */
  | { tipo: "editouCss" }
  /**
   * Mudou o nome ou o valor de uma declaração (ou acrescentou uma) pelo
   * painel Estilos. `seletor` é o da regra ("element.style" no inline).
   */
  | { tipo: "editouPropriedade"; seletor: string; propriedade: string; valor: string }
  /** Ligou ou desligou uma declaração pela checkbox do painel Estilos. */
  | { tipo: "alternouDeclaracao"; seletor: string; propriedade: string; ativa: boolean }
  /** Criou uma regra nova pelo painel Estilos. */
  | { tipo: "adicionouRegra"; seletor: string }
  /** (E5) Salvou a maquete do jogo como "Meu tema". `paresRuins`: quantos pares ficaram abaixo de 4,5:1. */
  | { tipo: "temaSalvo"; paresRuins: number }
  /** (Modo dispositivo) Ligou, desligou ou trocou o aparelho. `largura` e `altura`: como aparecem na tela. */
  | { tipo: "trocouDispositivo"; ligado: boolean; modelo: string; largura: number; altura: number }
  /** (Modo dispositivo) Girou o aparelho. */
  | { tipo: "girou"; orientacao: "retrato" | "paisagem" }
  /** (Lighthouse) Rodou a auditoria (o botão Analisar). */
  | { tipo: "auditou"; notas: Record<"acessibilidade" | "boas-praticas" | "seo", number> }
  /** (Publicar) Levou o projeto pro mundo: o .zip com os arquivos (os nomes). */
  | { tipo: "exportouProjeto"; arquivos: string[] }
  /** (Medição) Um clique num elemento com data-evento: o evento medido, com a origem da visita (utm) ou null. */
  | { tipo: "eventoMedido"; nome: string; origem: Utm | null }
  /** (Medição) Uma visita simulada por um link rastreável. */
  | { tipo: "visitaSimulada"; utm: Utm }
  /** (Campanha) Mudou o orçamento, a palavra-chave ou o lance. */
  | { tipo: "configurouCampanha"; orcamento: number; palavra: string; lance: number }
  /** (Código) Rodou código no Console ou no Snippet: o resumo do que aconteceu (saídas, erro, sintaxes usadas). */
  | { tipo: "executouCodigo"; execucao: ResumoExecucao }
  /** (Circuito) Pôs ou tirou peça, ligou ou tirou fio. */
  | { tipo: "mudouCircuito" }
  /** (Circuito) Ligou ou desligou uma entrada. */
  | { tipo: "alternouEntrada"; entrada: string; ligada: boolean }
  /** (Circuito) Abriu o "Ver como código". */
  | { tipo: "viuCodigoDoCircuito" }
  /** (Depurador) Ligou ou desligou um ponto de parada (a linha já escorregada para a que tem código). */
  | { tipo: "alternouPontoDeParada"; linha: number; ativo: boolean }
  /** (Depurador) O programa pausou nesta linha (ponto de parada, debugger; ou um passo dos controles). */
  | { tipo: "pausouNoDepurador"; linha: number; motivo: MotivoPausa }
  /** (Depurador) Usou um controle (retomar, passar por cima, entrar, sair). */
  | { tipo: "usouControleDepurador"; controle: ControleDepurador }
  /** (Depurador) Pôs uma expressão no painel Observar. */
  | { tipo: "adicionouObservacao"; expressao: string }
  /** (Depurador) Uma expressão do Observar foi avaliada num momento pausado (null: deu erro ou não existia ali). */
  | { tipo: "observouValor"; expressao: string; valor: ValorExibido | null }
  /** (Ordenar) Pôs, mudou de lugar ou tirou um cartão. `destino`: "plano", o id do grupo ou "fora". */
  | { tipo: "moveuPasso"; passo: string; destino: string; posicao: number }
  /** (Estruturas) Abriu o "Ver como árvore" da variável. */
  | { tipo: "viuComoArvore"; nome: string }
  /** (Desempenho) Mediu o gráfico passos x tamanho. */
  | { tipo: "mediuDesempenho"; medicoes: MedicaoPassos[] }
  /** (Fase composta) "Levar o plano pro código": o bloco de comentários do plano entrou (ou foi atualizado) no Snippet. */
  | { tipo: "levouPlanoProCodigo"; passos: number }
  /** (Fase composta) Tocou num passo do plano que está no código: o comentário dele acendeu no Snippet. */
  | { tipo: "apontouPasso"; passo: string; linha: number }
  /** (Fase composta) O texto do Snippet mudou (avisado depois de uma pausa na digitação, para conferir o plano no código). */
  | { tipo: "editouSnippet" };

/**
 * Para onde um link levaria:
 * - "ancora": #id de um elemento que existe na página (a prévia rola até ele);
 * - "quebrado": #id que nenhum elemento tem;
 * - "vazio": sem href, href vazio ou só "#";
 * - "externo": outra página ou site (a prévia não navega).
 */
export type DestinoLink = "ancora" | "quebrado" | "vazio" | "externo";

export type TipoEvento = EventoFase["tipo"];

/** Todos os tipos de evento, para conferir dados de conteúdo. */
export const TIPOS_EVENTO: readonly TipoEvento[] = [
  "selecionou",
  "inspecionou",
  "trilha",
  "editouTexto",
  "editouAtributo",
  "adicionouAtributo",
  "editouCodigo",
  "escondeu",
  "mostrou",
  "apagou",
  "duplicou",
  "desfez",
  "refez",
  "respondeuPrevisao",
  "renomeouTag",
  "clicouLink",
  "editouCss",
  "editouPropriedade",
  "alternouDeclaracao",
  "adicionouRegra",
  "temaSalvo",
  "trocouDispositivo",
  "girou",
  "auditou",
  "exportouProjeto",
  "eventoMedido",
  "visitaSimulada",
  "configurouCampanha",
  "executouCodigo",
  "mudouCircuito",
  "alternouEntrada",
  "viuCodigoDoCircuito",
  "alternouPontoDeParada",
  "pausouNoDepurador",
  "usouControleDepurador",
  "adicionouObservacao",
  "observouValor",
  "moveuPasso",
  "viuComoArvore",
  "mediuDesempenho",
  "levouPlanoProCodigo",
  "apontouPasso",
  "editouSnippet",
];

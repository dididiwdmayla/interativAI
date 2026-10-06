/*
 * Os acontecimentos da linha do tempo (sala 2), já na ordem certa. Fatos
 * conferidos na rodada 36; épocas por década (nenhuma data exata, exceto
 * onde está conferida). Cada exposição usa um pedaço desta lista, sem dois
 * cartões da mesma década na mesma linha (a ordem precisa ser clara).
 *
 * - Tear de Jacquard: demonstrado em 1804, lia cartões perfurados.
 * - Máquina Analítica (Babbage): projetada a partir de 1834-1837, nunca
 *   foi construída inteira; as notas de Ada Lovelace (1843) trazem um
 *   programa para ela (números de Bernoulli).
 * - Censo dos EUA de 1890: as máquinas de tabular de Herman Hollerith
 *   liam cartões perfurados.
 * - Anos 1940: computadores eletrônicos de válvulas (o ENIAC ficou pronto
 *   em 1945), programados ligando cabos e chaves; uma equipe de mulheres
 *   programou o ENIAC.
 * - Transistor: inventado no fim de 1947, nos Laboratórios Bell.
 * - Anos 1950: FORTRAN (1957) e COBOL (1959), programas em cartões.
 * - Microprocessador: o primeiro comercial é de 1971.
 * - Computador pessoal: fim dos anos 1970 e anos 1980.
 * - Web: proposta em 1989, aberta ao público no começo dos anos 1990.
 * - Smartphone: se populariza no fim dos anos 2000.
 * - Modelos de linguagem que conversam: anos 2020.
 */
import type { EventoHistorico } from "@/motor/exposicao/modelo";

const TODOS = {
  tear: {
    id: "tear",
    titulo: "O tear que lê cartões",
    figura: "tecela",
    pista: "Um tear que tecia desenhos sozinho, lendo uma corrente de cartões furados.",
    epoca: "início dos anos 1800",
    mudou: "Mostrou que uma máquina pode seguir instruções guardadas em cartões.",
  },
  analitica: {
    id: "analitica",
    titulo: "A Máquina Analítica",
    figura: "engrenagens",
    pista: "Um projeto de máquina de calcular, de engrenagens, que ia ler cartões como os do tear.",
    epoca: "anos 1830 e 1840",
    mudou: "Foi o primeiro projeto de computador de uso geral, e Ada Lovelace escreveu um programa para ela.",
  },
  censo: {
    id: "censo",
    titulo: "Os cartões do censo",
    figura: "cartao",
    pista: "Máquinas elétricas que contavam as respostas de um censo lendo cartões furados.",
    epoca: "fim dos anos 1800",
    mudou: "Contar milhões de respostas ficou muito mais rápido, e o cartão furado foi para os escritórios.",
  },
  valvulas: {
    id: "valvulas",
    titulo: "Os gigantes de válvulas",
    figura: "valvulas",
    pista: "Computadores do tamanho de uma sala, programados ligando cabos e chaves.",
    epoca: "anos 1940",
    mudou: "Contas de dias viraram segundos. Uma equipe de mulheres programava ligando cabos.",
  },
  transistor: {
    id: "transistor",
    titulo: "O transistor",
    figura: "transistor",
    pista: "Uma chavinha elétrica pequena, sem vidro, que não esquenta como a válvula.",
    epoca: "fim dos anos 1940",
    mudou: "Os computadores ficaram menores, mais baratos e quebravam bem menos.",
  },
  linguagens: {
    id: "linguagens",
    titulo: "As primeiras linguagens",
    figura: "cartao",
    pista: "Programas escritos com palavras e contas, como FORTRAN e COBOL, furados em cartões.",
    epoca: "anos 1950",
    mudou: "Programar ficou mais perto da escrita de gente: um tradutor passava para a máquina.",
  },
  chip: {
    id: "chip",
    titulo: "O microprocessador",
    figura: "chip",
    pista: "O cérebro de um computador inteiro num pedacinho de silício.",
    epoca: "anos 1970",
    mudou: "Abriu o caminho para computadores pequenos e baratos o bastante para uma mesa.",
  },
  terminal: {
    id: "terminal",
    titulo: "Os terminais de texto",
    figura: "terminal",
    pista: "Uma tela de letras verdes e um teclado para conversar com o computador.",
    epoca: "anos 1970",
    mudou: "Em vez de furar cartão, dava para digitar o programa e ver a resposta na tela.",
  },
  pc: {
    id: "pc",
    titulo: "O computador pessoal",
    figura: "pc",
    pista: "Um computador que cabia na mesa de casa, com teclado e disquete.",
    epoca: "fim dos anos 1970 e anos 1980",
    mudou: "O computador saiu das empresas e foi morar nas casas e nas escolas.",
  },
  web: {
    id: "web",
    titulo: "A web",
    figura: "internet",
    pista: "Páginas ligadas por links, abertas num navegador, com o modem chiando.",
    epoca: "anos 1990",
    mudou: "Qualquer pessoa passou a publicar e ler páginas do mundo inteiro.",
  },
  celular: {
    id: "celular",
    titulo: "O smartphone",
    figura: "celular",
    pista: "Um computador com tela de toque que cabe no bolso.",
    epoca: "fim dos anos 2000",
    mudou: "A internet foi para o bolso: mapa, câmera, banco e aplicativos o tempo todo.",
  },
  ia: {
    id: "ia",
    titulo: "A IA que conversa",
    figura: "ia",
    pista: "Programas que conversam e escrevem textos e código junto com a gente.",
    epoca: "anos 2020",
    mudou: "Programar ganhou um ajudante, e conferir o que ele faz virou parte do trabalho.",
  },
} satisfies Record<string, EventoHistorico>;

export type IdEvento = keyof typeof TODOS;

/** Os eventos pedidos, na ordem em que aparecem na lista acima (a ordem certa). */
export function eventos(...ids: IdEvento[]): EventoHistorico[] {
  const ordem = Object.keys(TODOS) as IdEvento[];
  return [...ids].sort((a, b) => ordem.indexOf(a) - ordem.indexOf(b)).map((id) => TODOS[id]);
}

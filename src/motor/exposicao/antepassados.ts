/*
 * Os antepassados do computadorzinho: a família que mora no corredor do
 * Museu das Origens, na ordem das épocas. Cada um tem um jeito próprio de
 * falar (o texto aparece do jeito da época dele) e um som da época.
 *
 * Fatos conferidos (rodada 36), sem data inventada: na dúvida, a década.
 * - O tear de Jacquard (Joseph Marie Jacquard) é do início dos anos 1800 e
 *   lia o desenho do tecido numa corrente de cartões perfurados.
 * - A Máquina Analítica (Charles Babbage) foi projetada nos anos 1830 e
 *   nunca foi construída inteira; ia ler cartões perfurados como os do
 *   tear. Nas notas de Ada Lovelace (1843) está um dos primeiros programas
 *   publicados: o cálculo dos números de Bernoulli na máquina.
 * - Os computadores de válvulas dos anos 1940 ocupavam salas inteiras e
 *   eram programados ligando cabos e chaves; uma equipe de mulheres
 *   programou o ENIAC (sem nomes aqui: só o que está conferido).
 * - Terminais de vídeo com letras verdes: anos 1970.
 * - O computador pessoal chega às casas no fim dos anos 1970 e nos 1980.
 * - A web se espalha nos anos 1990 (a internet discada, com o modem).
 * - O smartphone se populariza no fim dos anos 2000.
 */
import type { IdAntepassado } from "./modelo";

/** Como o texto da fala aparece na tela. */
export type JeitoDeFalar =
  /** A tecelã: o texto vira trama, letra por letra, com a lançadeira passando. */
  | "trama"
  /** A sonhadora: letra por letra, com as engrenagens girando. */
  | "engrenagens"
  /** O gigante: palavra por palavra, cada uma acende uma válvula. */
  | "valvulas"
  /** O terminal: letras verdes maiúsculas, sem acento, com o cursor piscando. */
  | "terminal"
  /** O PC bege: letra por letra num quadro azul, com bipes de 8 bits. */
  | "oito-bits"
  /** A internet: o chiado do modem conectando, e o texto aparece do meio do ruído. */
  | "modem"
  /** O celular: cada frase é uma notificação que chega. */
  | "notificacao"
  /** O computadorzinho: o balão de sempre. */
  | "balao";

export type FichaAntepassado = {
  /** A fala na árvore da família, quando o aluno entra para ela (no jeito dele). Até 60. */
  boasVindas: string;
  id: IdAntepassado;
  /** "A tecelã". */
  nome: string;
  /** "o tear de Jacquard". */
  maquina: string;
  /** "início dos anos 1800". */
  epoca: string;
  /** Como o computadorzinho chama: "minha tataravó". */
  parentesco: string;
  /** A sala (unidade) que ele recebe; null: não tem sala própria. */
  sala: string | null;
  jeito: JeitoDeFalar;
  /** O que ele diz quando acorda no corredor (no jeito dele). Até 160. */
  saudacao: string;
  /** O que ele diz quando a sala dele ainda não abriu. Até 160. */
  emBreve: string;
  /** A reação do computadorzinho ao parente. Até 120. */
  reacao: string;
};

export const FICHAS_ANTEPASSADOS: Record<IdAntepassado, FichaAntepassado> = {
  tecela: {
    id: "tecela",
    boasVindas: "Boas-vindas à família, meu bem.",
    nome: "A tecelã",
    maquina: "o tear de Jacquard",
    epoca: "início dos anos 1800",
    parentesco: "a tataravó de todo mundo",
    sala: "origens-museu-u1",
    jeito: "trama",
    saudacao: "Ah, uma visita! Chega mais, meu bem. Eu leio cartões furados e cada furo vira um fio no lugar. Vem tecer comigo na sala 1.",
    emBreve: "Minha sala está arrumando os novelos. Volta logo, que eu te espero.",
    reacao: "Essa é a tataravó de todo mundo! Foi com ela que tudo começou.",
  },
  engrenagens: {
    id: "engrenagens",
    boasVindas: "Eu sonhei. Você programa.",
    nome: "A sonhadora de engrenagens",
    maquina: "a Máquina Analítica",
    epoca: "anos 1830 e 1840",
    parentesco: "minha bisavó",
    sala: "origens-museu-u2",
    jeito: "engrenagens",
    saudacao: "Olá! Vou ser sincera: nunca me construíram inteira. Mas sonharam comigo, e escreveram para mim um dos primeiros programas da história.",
    emBreve: "Minha sala ainda é só projeto, como eu fui um dia. Logo ela sai do papel.",
    reacao: "Essa é a minha bisavó! Ela nunca saiu do papel inteira, mas já tinha programa.",
  },
  valvulas: {
    id: "valvulas",
    boasVindas: "BOAS-VINDAS, PEQUENO!",
    nome: "O gigante de válvulas",
    maquina: "os computadores de válvulas",
    epoca: "anos 1940",
    parentesco: "meu bisavô gigante",
    sala: null,
    jeito: "valvulas",
    saudacao: "OLÁ, PEQUENO! Eu ocupava uma sala inteira e esquentava feito forno. Me programavam ligando cabos, um por um. Sala própria eu não tenho: apareço de visita.",
    emBreve: "Sala própria eu não tenho, sou grande demais! Me procura nas salas 1 e 4.",
    reacao: "Meu bisavô gigante! Cada válvula dele liga e desliga, que nem um bit.",
  },
  terminal: {
    id: "terminal",
    boasVindas: "BOAS-VINDAS. NÃO ESQUEÇA O PONTO E VÍRGULA.",
    nome: "O terminal verde",
    maquina: "os terminais de texto",
    epoca: "anos 1970",
    parentesco: "meu avô",
    sala: "origens-museu-u3",
    jeito: "terminal",
    saudacao: "SIM. SOU EU. TERMINAL. LETRA VERDE, TELA PRETA. NADA DE FIRULA.",
    emBreve: "SALA 3: EM BREVE. AGUARDE.",
    reacao: "Meu avô! Ele fala pouco, mas sabe muito. Não repara no mau humor.",
  },
  pc: {
    id: "pc",
    boasVindas: "Bip bip! Família completa!",
    nome: "O computador bege",
    maquina: "o computador pessoal",
    epoca: "anos 1980",
    parentesco: "meu tio",
    sala: "origens-museu-u4",
    jeito: "oito-bits",
    saudacao: "Oiê! Carregando... PRONTO! Eu fui um dos primeiros computadores a morar na casa das pessoas. Disquete? Tenho um monte!",
    emBreve: "A sala 4 ainda está carregando. Calma que o disquete está girando!",
    reacao: "Meu tio! Ele trouxe o computador pra dentro de casa. E nunca larga os disquetes.",
  },
  internet: {
    id: "internet",
    boasVindas: "Já contei para o mundo inteiro!",
    nome: "A internet discada",
    maquina: "a web e o modem",
    epoca: "anos 1990",
    parentesco: "minha tia",
    sala: "origens-museu-u5",
    jeito: "modem",
    saudacao: "Alôôô? Conectando... conectei! Eu ligo todo mundo com todo mundo, sabia? Mensagem, foto, site, tudo passa por mim.",
    emBreve: "A sala 5 ainda está conectando. Já já ela carrega, juro!",
    reacao: "Minha tia! Ela conversa com o mundo inteiro ao mesmo tempo.",
  },
  celular: {
    id: "celular",
    boasVindas: "Plim. Nova mensagem: boas-vindas.",
    nome: "O celular",
    maquina: "o smartphone",
    epoca: "fim dos anos 2000",
    parentesco: "meu primo mais velho",
    sala: "origens-museu-u6",
    jeito: "notificacao",
    saudacao: "Oi. Sou o computador que cabe no bolso. Câmera, mapa e mensagem, tudo aqui.",
    emBreve: "Sala 6 em breve. Ativa as notificações.",
    reacao: "Meu primo mais velho! Ele vive no bolso de todo mundo.",
  },
  computadorzinho: {
    id: "computadorzinho",
    boasVindas: "Agora você também programa. Boas-vindas à família!",
    nome: "O computadorzinho",
    maquina: "o computador de hoje",
    epoca: "hoje",
    parentesco: "eu",
    sala: null,
    jeito: "balao",
    saudacao: "E aqui estou eu! Tudo o que você viu no corredor mora dentro de mim de algum jeito.",
    emBreve: "",
    reacao: "Esse aqui sou eu!",
  },
};

/** Os antepassados na ordem do corredor (das épocas), o computadorzinho por último. */
export const ORDEM_DO_CORREDOR: readonly IdAntepassado[] = ["tecela", "engrenagens", "valvulas", "terminal", "pc", "internet", "celular", "computadorzinho"];

/** O jeito de escrever do terminal: maiúsculas e sem acento (os terminais da época não tinham). */
export function textoDeTerminal(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

/** As frases de um texto (o celular manda uma notificação por frase). */
export function frasesDoTexto(texto: string): string[] {
  return (texto.match(/[^.!?]+[.!?]*/g) ?? [texto]).map((frase) => frase.trim()).filter(Boolean);
}

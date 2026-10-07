/*
 * Exposições do Museu das Origens (área `exposicao` da tela composta).
 *
 * Uma fase do museu é uma prática (ou um desafio) com a área `exposicao`:
 * uma sala com um antepassado do computadorzinho como anfitrião e uma ou
 * mais ESTAÇÕES interativas, cada uma de um tipo:
 *
 * - "tear": o tear de cartões perfurados. Cada cartão é uma linha do
 *   tecido; furo levanta o fio (a cor aparece), sem furo não. Furar os
 *   cartões tece o desenho pedido: é binário sem dizer que é.
 * - "bits": lâmpadas (ou válvulas) que ligam e desligam; o número aparece
 *   embaixo, com os pesos (8, 4, 2, 1) e, com 8 bits, a letra.
 * - "camadas": o mesmo programa em camadas, do que a gente escreve até a
 *   linguagem de máquina. "Descer" traduz para a camada de baixo; tocar
 *   numa linha acende as linhas que ela vira nas outras camadas.
 * - "cor": o hexadecimal montando uma cor (#RRGGBB), com o pedacinho de
 *   CSS que a usa (a ponte com a Ilha Sites).
 * - "linha-do-tempo": acontecimentos e máquinas para pôr na ordem; cada
 *   cartão no lugar certo mostra a época e o que ele mudou. Com
 *   `plaquinhas`, as frases do "o que mudou" ficam soltas para o aluno
 *   pendurar no cartão certo.
 *
 * - Salas 3 a 6 (rodada 38): "comparador", "ligar", "ordem", "circuito" e
 *   as simulações (traducao, memoria, processador, sistema, arquivos,
 *   clique, pacote, aba-rede, cidade), cada uma no seu arquivo.
 *
 * Puro (sem React): a tela, a simulação dos testes, os validadores e as
 * checagens usam as mesmas funções. As mudanças devolvem um estado novo
 * (ou null quando a mudança não existe: estação, linha ou cartão errado).
 */
import type { Acao } from "@/conteudo/tipos";
import * as cartoes from "./cartoes";
import * as circuitoMuseu from "./circuitoMuseu";
import * as comparador from "./comparador";
import { ehObjeto } from "./comum";
import { ehTipoSimulacao, type EstacaoSimulacao, estadoDaSimulacaoCabe, type EstadoSimulacao, modeloDa, SIMULACOES, type TipoSimulacao } from "./simulacoes";

/** Os antepassados do computadorzinho, na ordem do corredor (das épocas). */
export const IDS_ANTEPASSADOS = ["tecela", "engrenagens", "valvulas", "terminal", "pc", "internet", "celular", "computadorzinho"] as const;

export type IdAntepassado = (typeof IDS_ANTEPASSADOS)[number];

export function ehIdAntepassado(valor: unknown): valor is IdAntepassado {
  return typeof valor === "string" && (IDS_ANTEPASSADOS as readonly string[]).includes(valor);
}

/* ------------------------------------------------------------------ estações */

export type EstacaoTear = {
  id: string;
  tipo: "tear";
  titulo: string;
  /**
   * O desenho pedido, uma linha por cartão (de cima para baixo): "#" é fio
   * levantado (furo no cartão), "." é fio baixo (sem furo). Todas as linhas
   * com o mesmo tamanho (de 3 a 8 agulhas), de 2 a 8 cartões.
   */
  modelo: string[];
  /** Os furos que já vêm feitos (mesma forma do modelo). Ausente: cartões em branco. */
  inicial?: string[];
  /** Mostra o 1 e o 0 ao lado de cada cartão (a revelação do binário). */
  mostrarBinario?: boolean;
};

export type EstacaoBits = {
  id: string;
  tipo: "bits";
  titulo: string;
  /** Quantas lâmpadas: 4 (meio byte) ou 8 (um byte). */
  quantos: 4 | 8;
  /** Como cada bit aparece: válvula (anos 1940) ou lâmpada. */
  aparencia: "valvula" | "lampada";
  /** Os bits que já vêm ligados ("0101"); ausente: tudo desligado. */
  inicial?: string;
  /** Mostra o peso de cada lâmpada (8, 4, 2, 1) em cima dela. */
  pesos?: boolean;
  /** (8 bits) Mostra a letra do número (tabela ASCII, de 32 a 126). */
  letra?: boolean;
};

/** Uma linha de uma camada. `de`: as linhas da camada de cima que viraram esta. */
export type LinhaCamada = { id: string; texto: string; de?: string[] };

export type Camada = {
  id: string;
  /** "O que a gente escreve", "Instruções", "Linguagem de máquina". */
  nome: string;
  /** Uma frase sobre quem lê esta camada. */
  legenda: string;
  linhas: LinhaCamada[];
  /** Linhas em fonte de código (a máquina e as instruções); ausente: sim. */
  codigo?: boolean;
};

export type EstacaoCamadas = {
  id: string;
  tipo: "camadas";
  titulo: string;
  /** De cima (o que a gente escreve) para baixo (a linguagem de máquina): de 2 a 4 camadas. */
  camadas: Camada[];
};

export type EstacaoCor = {
  id: string;
  tipo: "cor";
  titulo: string;
  /** A cor do começo ("#000000"). */
  inicial: string;
  /** O pedacinho de CSS que usa a cor: a regra e a propriedade (a ponte com a Ilha Sites). */
  css: { seletor: string; propriedade: "color" | "background" };
  /** Uma cor pedida, desenhada como amostra ao lado (opcional). */
  amostra?: { valor: string; nome: string };
};

export type EventoHistorico = {
  id: string;
  /** "O tear que lê cartões". Até 48. */
  titulo: string;
  /** O desenho do cartão: um antepassado ou um objeto da época. */
  figura: IdAntepassado | "cartao" | "transistor" | "chip" | "ia";
  /** A pista que aparece antes de pôr no lugar (sem a data). Até 110. */
  pista: string;
  /** A época, revelada no lugar certo: "início dos anos 1800", "anos 1940". Sem data inventada. */
  epoca: string;
  /** O que mudou por causa dele, revelado no lugar certo. Até 140. */
  mudou: string;
};

export type EstacaoLinhaDoTempo = {
  id: string;
  tipo: "linha-do-tempo";
  titulo: string;
  /** Os acontecimentos JÁ NA ORDEM CERTA (do mais antigo ao mais novo); a tela embaralha. */
  eventos: EventoHistorico[];
  /** Acontecimentos que já começam na linha, como âncoras (na ordem certa). */
  fixos?: string[];
  /**
   * Modo "o que mudou": as frases do `mudou` ficam soltas, como plaquinhas,
   * e o aluno pendura cada uma no cartão certo (o cartão no lugar mostra só
   * a época).
   */
  plaquinhas?: boolean;
};

/*
 * As estações das salas 3 a 6 (rodada 38): o comparador de linguagens
 * (comparador.ts), os cartões de ligar e de ordem (cartoes.ts), o circuito
 * do gigante e dos portões (circuitoMuseu.ts) e as simulações por comando
 * e marco (simulacoes/).
 */
export type EstacaoComparador = comparador.EstacaoComparador;
export type EstacaoLigar = cartoes.EstacaoLigar;
export type EstacaoOrdem = cartoes.EstacaoOrdem;
export type EstacaoCircuito = circuitoMuseu.EstacaoCircuito;
export type { EstacaoSimulacao, EstadoSimulacao, TipoSimulacao };

export type Estacao =
  | EstacaoTear
  | EstacaoBits
  | EstacaoCamadas
  | EstacaoCor
  | EstacaoLinhaDoTempo
  | EstacaoComparador
  | EstacaoLigar
  | EstacaoOrdem
  | EstacaoCircuito
  | EstacaoSimulacao;

export type TipoEstacao = Estacao["tipo"];

/** A fala do anfitrião (cada antepassado fala do seu jeito). Até 160. */
export type FalasAnfitriao = {
  /** Quando a fase abre. */
  abrir: string;
  /** Quando um objetivo (prática) começa, ou quando uma parte (desafio) é feita: pelo id. */
  porEtapa?: Record<string, string>;
  /** Quando a fase termina. */
  concluir?: string;
};

/** A exposição de uma fase: o anfitrião, a placa da sala e as estações. */
export type DadosExposicao = {
  /** O antepassado que recebe o aluno nesta exposição. */
  anfitriao: IdAntepassado;
  /** A placa de museu (o nome da peça e uma linha sobre ela). Até 200. */
  placa: { titulo: string; texto: string };
  falas: FalasAnfitriao;
  /** De 1 a 4 estações (o desafio junta várias). */
  estacoes: Estacao[];
};

/* ------------------------------------------------------------------ estado */

export type EstadoTear = { tipo: "tear"; furos: string[] };
export type EstadoBits = { tipo: "bits"; bits: string };
export type EstadoCamadas = { tipo: "camadas"; abertas: number; escolhida: string | null };
export type EstadoCor = { tipo: "cor"; hex: string };
export type EstadoLinhaDoTempo = { tipo: "linha-do-tempo"; linha: string[]; plaquinhas: Record<string, string> };

export type EstadoComparador = comparador.EstadoComparador;
export type EstadoLigar = cartoes.EstadoLigar;
export type EstadoOrdem = cartoes.EstadoOrdem;
export type EstadoCircuito = circuitoMuseu.EstadoCircuito;

export type EstadoEstacao =
  | EstadoTear
  | EstadoBits
  | EstadoCamadas
  | EstadoCor
  | EstadoLinhaDoTempo
  | EstadoComparador
  | EstadoLigar
  | EstadoOrdem
  | EstadoCircuito
  | EstadoSimulacao;

/** O estado de cada estação (pelo id) e a estação aberta agora. */
export type EstadoExposicao = { estacoes: Record<string, EstadoEstacao>; aberta: string };

const FURO = "#";
const SEM_FURO = ".";

function cartaoEmBranco(colunas: number): string {
  return SEM_FURO.repeat(colunas);
}

export function estadoInicialDaEstacao(estacao: Estacao): EstadoEstacao {
  switch (estacao.tipo) {
    case "tear": {
      const colunas = estacao.modelo[0]?.length ?? 0;
      return { tipo: "tear", furos: estacao.modelo.map((_, i) => estacao.inicial?.[i] ?? cartaoEmBranco(colunas)) };
    }
    case "bits":
      return { tipo: "bits", bits: estacao.inicial ?? "0".repeat(estacao.quantos) };
    case "camadas":
      return { tipo: "camadas", abertas: 1, escolhida: null };
    case "cor":
      return { tipo: "cor", hex: normalizarHex(estacao.inicial) ?? "#000000" };
    case "linha-do-tempo":
      return { tipo: "linha-do-tempo", linha: [...(estacao.fixos ?? [])], plaquinhas: {} };
    case "comparador":
      return comparador.estadoInicialComparador();
    case "ligar":
      return cartoes.estadoInicialLigar();
    case "ordem":
      return cartoes.estadoInicialOrdem();
    case "circuito":
      return circuitoMuseu.estadoInicialCircuito(estacao);
    default:
      return modeloDa(estacao).inicial(estacao);
  }
}

export function estadoInicialExposicao(dados: DadosExposicao): EstadoExposicao {
  return {
    estacoes: Object.fromEntries(dados.estacoes.map((estacao) => [estacao.id, estadoInicialDaEstacao(estacao)])),
    aberta: dados.estacoes[0]?.id ?? "",
  };
}

export function estacaoDo(dados: DadosExposicao, id: string): Estacao | null {
  return dados.estacoes.find((estacao) => estacao.id === id) ?? null;
}

/** O estado de uma estação, do tipo pedido (null se a estação não existe ou é de outro tipo). */
function estadoDo<T extends EstadoEstacao["tipo"]>(estado: EstadoExposicao, id: string, tipo: T): Extract<EstadoEstacao, { tipo: T }> | null {
  const atual = estado.estacoes[id];
  return atual && atual.tipo === tipo ? (atual as Extract<EstadoEstacao, { tipo: T }>) : null;
}

function comEstacao(estado: EstadoExposicao, id: string, novo: EstadoEstacao): EstadoExposicao {
  return { ...estado, estacoes: { ...estado.estacoes, [id]: novo } };
}

/** O estado salvo só vale se as estações ainda existem e têm a mesma forma (a fase pode ter mudado). */
export function estadoValidoExposicao(dados: DadosExposicao, salvo: EstadoExposicao | null): EstadoExposicao {
  const inicial = estadoInicialExposicao(dados);
  if (!salvo) return inicial;
  const estacoes: Record<string, EstadoEstacao> = {};
  for (const estacao of dados.estacoes) {
    const guardado = salvo.estacoes[estacao.id];
    estacoes[estacao.id] = guardado && estadoCabe(estacao, guardado) ? guardado : inicial.estacoes[estacao.id];
  }
  const aberta = dados.estacoes.some((estacao) => estacao.id === salvo.aberta) ? salvo.aberta : inicial.aberta;
  return { estacoes, aberta };
}

function estadoCabe(estacao: Estacao, estado: EstadoEstacao): boolean {
  if (estacao.tipo !== estado.tipo) return false;
  switch (estado.tipo) {
    case "tear": {
      const modelo = (estacao as EstacaoTear).modelo;
      return estado.furos.length === modelo.length && estado.furos.every((linha, i) => linha.length === modelo[i].length && /^[#.]*$/.test(linha));
    }
    case "bits":
      return estado.bits.length === (estacao as EstacaoBits).quantos && /^[01]+$/.test(estado.bits);
    case "camadas":
      return estado.abertas >= 1 && estado.abertas <= (estacao as EstacaoCamadas).camadas.length;
    case "cor":
      return normalizarHex(estado.hex) !== null;
    case "linha-do-tempo": {
      const ids = new Set((estacao as EstacaoLinhaDoTempo).eventos.map((evento) => evento.id));
      return estado.linha.every((id) => ids.has(id)) && Object.entries(estado.plaquinhas).every(([cartao, plaquinha]) => ids.has(cartao) && ids.has(plaquinha));
    }
    case "comparador":
      return comparador.comparadorCabe(estacao as EstacaoComparador, estado);
    case "ligar":
      return cartoes.ligarCabe(estacao as EstacaoLigar, estado);
    case "ordem":
      return cartoes.ordemCabe(estacao as EstacaoOrdem, estado);
    case "circuito":
      return circuitoMuseu.circuitoCabe(estacao as EstacaoCircuito, estado);
    default:
      return estadoDaSimulacaoCabe(estacao as EstacaoSimulacao, estado);
  }
}

/**
 * Lê o estado salvo de uma estação das salas 3 a 6 (só a forma: a fase
 * confere contra os dados ao abrir). As das salas 1 e 2 são lidas em
 * src/lib/progresso.ts.
 */
export function lerEstadoDeEstacaoNova(valor: unknown): EstadoEstacao | null {
  if (!ehObjeto(valor) || typeof valor.tipo !== "string") return null;
  switch (valor.tipo) {
    case "comparador":
      return comparador.lerEstadoComparador(valor);
    case "ligar":
      return cartoes.lerEstadoLigar(valor);
    case "ordem":
      return cartoes.lerEstadoOrdem(valor);
    case "circuito":
      return circuitoMuseu.lerEstadoCircuito(valor);
    default:
      return ehTipoSimulacao(valor.tipo) ? SIMULACOES[valor.tipo].ler(valor) : null;
  }
}

/** Troca a estação aberta (o desafio tem várias). */
export function abrirEstacao(dados: DadosExposicao, estado: EstadoExposicao, id: string): EstadoExposicao | null {
  if (!estacaoDo(dados, id)) return null;
  return { ...estado, aberta: id };
}

/* ------------------------------------------------------------------ tear */

/** Fura (ou tapa) um furo do cartão. Sem `furado`, alterna. */
export function furarCartao(dados: DadosExposicao, estado: EstadoExposicao, id: string, linha: number, coluna: number, furado?: boolean): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "tear");
  if (!estacao || estacao.tipo !== "tear" || !atual) return null;
  const cartao = atual.furos[linha];
  if (cartao === undefined || coluna < 0 || coluna >= cartao.length) return null;
  const agora = cartao[coluna] === FURO;
  const novo = furado ?? !agora;
  const furos = atual.furos.map((texto, i) => (i === linha ? `${texto.slice(0, coluna)}${novo ? FURO : SEM_FURO}${texto.slice(coluna + 1)}` : texto));
  return comEstacao(estado, id, { tipo: "tear", furos });
}

/** O cartão como bits: furo é 1, sem furo é 0. */
export function cartaoEmBits(cartao: string): string {
  return [...cartao].map((c) => (c === FURO ? "1" : "0")).join("");
}

/** Quantos furos diferem do desenho pedido (0: o tecido está igual). Com `linhas`, só esses cartões (a partir de 0). */
export function diferencasDoTecido(estacao: EstacaoTear, estado: EstadoTear, linhas?: readonly number[]): number {
  let diferentes = 0;
  estacao.modelo.forEach((linha, i) => {
    if (linhas && !linhas.includes(i)) return;
    for (let c = 0; c < linha.length; c += 1) if ((estado.furos[i]?.[c] ?? SEM_FURO) !== linha[c]) diferentes += 1;
  });
  return diferentes;
}

/* ------------------------------------------------------------------ bits */

/** Liga (ou desliga) uma lâmpada. Sem `ligado`, alterna. O índice 0 é a da esquerda (a de maior peso). */
export function alternarBit(dados: DadosExposicao, estado: EstadoExposicao, id: string, indice: number, ligado?: boolean): EstadoExposicao | null {
  const atual = estadoDo(estado, id, "bits");
  if (!estacaoDo(dados, id) || !atual || indice < 0 || indice >= atual.bits.length) return null;
  const novo = ligado ?? atual.bits[indice] !== "1";
  const bits = `${atual.bits.slice(0, indice)}${novo ? "1" : "0"}${atual.bits.slice(indice + 1)}`;
  return comEstacao(estado, id, { tipo: "bits", bits });
}

/** O número que as lâmpadas mostram. */
export function valorDosBits(bits: string): number {
  return [...bits].reduce((total, bit) => total * 2 + (bit === "1" ? 1 : 0), 0);
}

/** O peso de cada lâmpada, da esquerda para a direita (8, 4, 2, 1). */
export function pesosDosBits(quantos: number): number[] {
  return Array.from({ length: quantos }, (_, i) => 2 ** (quantos - 1 - i));
}

/** A letra de um número (tabela ASCII, só os que se imprimem: de 32 a 126). */
export function letraDoNumero(numero: number): string | null {
  return numero >= 32 && numero <= 126 ? String.fromCharCode(numero) : null;
}

/** O número em bits, com `quantos` dígitos (null se não cabe). */
export function bitsDoNumero(numero: number, quantos: number): string | null {
  if (!Number.isInteger(numero) || numero < 0 || numero >= 2 ** quantos) return null;
  return numero.toString(2).padStart(quantos, "0");
}

/* ------------------------------------------------------------------ camadas */

/** Desce uma camada (traduz para a de baixo). Na última, não faz nada (devolve null). */
export function descerCamada(dados: DadosExposicao, estado: EstadoExposicao, id: string): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "camadas");
  if (!estacao || estacao.tipo !== "camadas" || !atual || atual.abertas >= estacao.camadas.length) return null;
  return comEstacao(estado, id, { ...atual, abertas: atual.abertas + 1 });
}

/** Escolhe (ou solta, com null) uma linha de uma camada aberta: ela e as ligadas a ela acendem. */
export function escolherLinhaCamada(dados: DadosExposicao, estado: EstadoExposicao, id: string, linha: string | null): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "camadas");
  if (!estacao || estacao.tipo !== "camadas" || !atual) return null;
  if (linha !== null) {
    const camada = estacao.camadas.findIndex((c) => c.linhas.some((l) => l.id === linha));
    if (camada < 0 || camada >= atual.abertas) return null;
  }
  return comEstacao(estado, id, { ...atual, escolhida: linha });
}

/** As linhas ligadas à escolhida, em todas as camadas: as que ela virou (para baixo) e as que viraram ela (para cima). */
export function linhasLigadas(estacao: EstacaoCamadas, escolhida: string | null): Set<string> {
  const acesas = new Set<string>();
  if (!escolhida) return acesas;
  const todas = estacao.camadas.flatMap((camada) => camada.linhas);
  acesas.add(escolhida);
  // Para baixo: quem diz que veio de uma acesa.
  let mudou = true;
  while (mudou) {
    mudou = false;
    for (const linha of todas) {
      if (!acesas.has(linha.id) && linha.de?.some((origem) => acesas.has(origem)) && !ehAcimaDe(estacao, linha.id, escolhida)) {
        acesas.add(linha.id);
        mudou = true;
      }
    }
  }
  // Para cima: as origens da escolhida, e as origens delas.
  const subir = (id: string) => {
    for (const origem of todas.find((linha) => linha.id === id)?.de ?? []) {
      if (!acesas.has(origem)) {
        acesas.add(origem);
        subir(origem);
      }
    }
  };
  subir(escolhida);
  return acesas;
}

function indiceDaCamada(estacao: EstacaoCamadas, linha: string): number {
  return estacao.camadas.findIndex((camada) => camada.linhas.some((l) => l.id === linha));
}

function ehAcimaDe(estacao: EstacaoCamadas, linha: string, referencia: string): boolean {
  return indiceDaCamada(estacao, linha) < indiceDaCamada(estacao, referencia);
}

/* ------------------------------------------------------------------ cor */

/** "#F80", "ff8800" ou "#FF8800" viram "#ff8800"; o resto, null. */
export function normalizarHex(valor: string): string | null {
  const limpo = valor.trim().toLowerCase().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/.test(limpo)) return `#${[...limpo].map((c) => c + c).join("")}`;
  if (/^[0-9a-f]{6}$/.test(limpo)) return `#${limpo}`;
  return null;
}

export function definirCor(dados: DadosExposicao, estado: EstadoExposicao, id: string, valor: string): EstadoExposicao | null {
  const atual = estadoDo(estado, id, "cor");
  const hex = normalizarHex(valor);
  if (!estacaoDo(dados, id) || !atual || !hex) return null;
  return comEstacao(estado, id, { tipo: "cor", hex });
}

/** Um dígito da cor sobe ou desce (0 a f, dando a volta): os botões da mesa de cores. `posicao` de 0 a 5. */
export function hexComDigito(hex: string, posicao: number, delta: 1 | -1): string {
  const digitos = (normalizarHex(hex) ?? "#000000").slice(1).split("");
  const valor = (parseInt(digitos[posicao] ?? "0", 16) + delta + 16) % 16;
  digitos[posicao] = valor.toString(16);
  return `#${digitos.join("")}`;
}

/** Os três canais da cor, de 0 a 255. */
export function canaisDaCor(hex: string): { r: number; g: number; b: number } {
  const limpo = (normalizarHex(hex) ?? "#000000").slice(1);
  return { r: parseInt(limpo.slice(0, 2), 16), g: parseInt(limpo.slice(2, 4), 16), b: parseInt(limpo.slice(4, 6), 16) };
}

/* ------------------------------------------------------------------ linha do tempo */

/** Põe (ou muda de lugar) um cartão na linha, na posição pedida (sem ela, no fim). Fixos não saem do lugar. */
export function porNaLinha(dados: DadosExposicao, estado: EstadoExposicao, id: string, evento: string, posicao?: number): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "linha-do-tempo");
  if (!estacao || estacao.tipo !== "linha-do-tempo" || !atual) return null;
  if (!estacao.eventos.some((e) => e.id === evento) || estacao.fixos?.includes(evento)) return null;
  const sem = atual.linha.filter((e) => e !== evento);
  const lugar = Math.max(0, Math.min(posicao ?? sem.length, sem.length));
  const linha = [...sem.slice(0, lugar), evento, ...sem.slice(lugar)];
  return comEstacao(estado, id, { ...atual, linha });
}

/** Tira o cartão da linha (volta para a caixa), com a plaquinha pendurada nele. */
export function tirarDaLinha(dados: DadosExposicao, estado: EstadoExposicao, id: string, evento: string): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "linha-do-tempo");
  if (!estacao || estacao.tipo !== "linha-do-tempo" || !atual || !atual.linha.includes(evento) || estacao.fixos?.includes(evento)) return null;
  const plaquinhas = { ...atual.plaquinhas };
  delete plaquinhas[evento];
  return comEstacao(estado, id, { ...atual, linha: atual.linha.filter((e) => e !== evento), plaquinhas });
}

/**
 * Pendura a plaquinha de "o que mudou" (a frase do `mudou` do evento
 * `plaquinha`) no cartão `evento`, que precisa estar na linha. Se ela estava
 * em outro cartão, sai de lá; o cartão que já tinha uma solta a dele.
 */
export function pendurarPlaquinha(dados: DadosExposicao, estado: EstadoExposicao, id: string, evento: string, plaquinha: string): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estadoDo(estado, id, "linha-do-tempo");
  if (!estacao || estacao.tipo !== "linha-do-tempo" || !estacao.plaquinhas || !atual) return null;
  if (!atual.linha.includes(evento) || !estacao.eventos.some((e) => e.id === plaquinha)) return null;
  const plaquinhas = Object.fromEntries(Object.entries(atual.plaquinhas).filter(([, p]) => p !== plaquinha));
  plaquinhas[evento] = plaquinha;
  return comEstacao(estado, id, { ...atual, plaquinhas });
}

/** A ordem em que os cartões aparecem na caixa: embaralhada, mas sempre igual (para os testes e para quem volta). */
export function ordemNaCaixa(estacao: EstacaoLinhaDoTempo): string[] {
  const ids = estacao.eventos.map((evento) => evento.id);
  // Intercala o fim e o começo (nunca a ordem certa, nem a inversa, a partir de 3 cartões).
  const resultado: string[] = [];
  let de = 0;
  let ate = ids.length - 1;
  let vez = 1;
  while (de <= ate) {
    resultado.push(vez % 2 === 1 ? ids[de++] : ids[ate--]);
    vez += 1;
  }
  // Gira um pouco pelo tamanho do título do primeiro, para cada linha do tempo ter o seu embaralhado.
  const giro = (estacao.eventos[0]?.titulo.length ?? 0) % Math.max(1, resultado.length);
  return [...resultado.slice(giro), ...resultado.slice(0, giro)];
}

/**
 * O cartão está no lugar certo em relação a todos os outros que estão na
 * linha agora (os que vêm antes dele são mais antigos, os depois, mais
 * novos). É o que acende a época e o "o que mudou" dele.
 */
export function cartaoNoLugar(estacao: EstacaoLinhaDoTempo, linha: readonly string[], evento: string): boolean {
  const certa = estacao.eventos.map((e) => e.id);
  const aqui = linha.indexOf(evento);
  if (aqui < 0) return false;
  const minha = certa.indexOf(evento);
  return linha.every((outro, i) => i === aqui || (i < aqui ? certa.indexOf(outro) < minha : certa.indexOf(outro) > minha));
}

/** A linha tem os eventos pedidos (todos, sem a lista), na ordem certa entre eles. */
export function linhaEmOrdem(estacao: EstacaoLinhaDoTempo, linha: readonly string[], eventos?: readonly string[]): { passou: boolean; detalhe: string } {
  const pedidos = eventos ?? estacao.eventos.map((e) => e.id);
  const faltam = pedidos.filter((id) => !linha.includes(id));
  if (faltam.length) return { passou: false, detalhe: `fora da linha: ${faltam.join(", ")}` };
  const certa = estacao.eventos.map((e) => e.id);
  const naLinha = linha.filter((id) => pedidos.includes(id));
  const fora = naLinha.filter((id, i) => i > 0 && certa.indexOf(naLinha[i - 1]) > certa.indexOf(id));
  return fora.length ? { passou: false, detalhe: `fora de ordem perto de: ${fora.join(", ")}` } : { passou: true, detalhe: "na ordem certa" };
}

/** As plaquinhas penduradas no cartão certo (cada evento com a sua). Com `eventos`, só nesses cartões. */
export function plaquinhasCertas(estacao: EstacaoLinhaDoTempo, estado: EstadoLinhaDoTempo, eventos?: readonly string[]): { passou: boolean; detalhe: string } {
  const erradas = estacao.eventos.filter((evento) => (!eventos || eventos.includes(evento.id)) && estado.plaquinhas[evento.id] !== evento.id).map((evento) => evento.id);
  return erradas.length ? { passou: false, detalhe: `sem a plaquinha certa: ${erradas.join(", ")}` } : { passou: true, detalhe: "todas no lugar" };
}

/* ------------------------------------------------------------------ geral */

/** O estado de uma estação pelo id (para os validadores e a tela). */
export function estadoDaEstacao(estado: EstadoExposicao, id: string): EstadoEstacao | null {
  return estado.estacoes[id] ?? null;
}

/** Uma frase curta do estado de uma estação (o tutor, o /lab e a miniatura da meta). */
export function resumoDaEstacao(estacao: Estacao, estado: EstadoEstacao | null): string {
  if (!estado) return `${estacao.titulo}: sem estado`;
  switch (estado.tipo) {
    case "tear":
      return `${estacao.titulo}: cartões ${estado.furos.join(" | ")}`;
    case "bits":
      return `${estacao.titulo}: ${estado.bits} (vale ${valorDosBits(estado.bits)})`;
    case "camadas": {
      const camadas = (estacao as EstacaoCamadas).camadas;
      return `${estacao.titulo}: ${estado.abertas} de ${camadas.length} camadas abertas${estado.escolhida ? `, linha ${estado.escolhida} escolhida` : ""}`;
    }
    case "cor":
      return `${estacao.titulo}: ${estado.hex}`;
    case "linha-do-tempo":
      return `${estacao.titulo}: ${estado.linha.length ? estado.linha.join(" > ") : "linha vazia"}`;
    case "comparador":
      return `${estacao.titulo}: ${estado.rodadas.length ? `rodou ${estado.rodadas.join(", ")}` : "nada rodou"}${estado.acesa ? `, parte ${estado.acesa.parte} acesa` : ""}`;
    case "ligar":
      return `${estacao.titulo}: ${Object.keys(estado.ligacoes).length} cartão(ões) ligado(s)`;
    case "ordem":
      return `${estacao.titulo}: ${estado.fila.length ? estado.fila.join(" > ") : "fila vazia"}`;
    case "circuito":
      return `${estacao.titulo}: ${estado.circuito.pecas.length} peças, ${estado.circuito.fios.length} fio(s)`;
    default:
      return estacao.tipo === estado.tipo ? modeloDa(estacao as EstacaoSimulacao).resumo(estacao as EstacaoSimulacao, estado) : `${estacao.titulo}: sem estado`;
  }
}

/** Os marcos de agora de uma estação de simulação (o validador marcoNaEstacao). */
export function marcosDaEstacao(estacao: EstacaoSimulacao, estado: EstadoSimulacao): string[] {
  return modeloDa(estacao).marcos(estacao, estado);
}

export function ehEstacaoSimulacao(estacao: Estacao): estacao is EstacaoSimulacao {
  return ehTipoSimulacao(estacao.tipo);
}

/* ------------------------------------------------------------------ ações */

/** Os tipos de ação das exposições (as mesmas na tela, nas soluções e na simulação dos testes). */
export const TIPOS_ACAO_EXPOSICAO = [
  "abrirEstacao",
  "furarCartao",
  "alternarBit",
  "descerCamada",
  "escolherLinha",
  "definirCor",
  "porNaLinha",
  "tirarDaLinha",
  "pendurarPlaquinha",
  "rodarLinguagem",
  "cantarCoral",
  "tocarParte",
  "escreverNaLinguagem",
  "ligarCartao",
  "porNaOrdem",
  "tirarDaOrdem",
  "mexerNoCircuito",
  "comandoNaEstacao",
] as const;

export type AcaoExposicao = Extract<Acao, { tipo: (typeof TIPOS_ACAO_EXPOSICAO)[number] }>;

export function ehAcaoExposicao(acao: Acao): acao is AcaoExposicao {
  return (TIPOS_ACAO_EXPOSICAO as readonly string[]).includes(acao.tipo);
}

/** O tipo de estação que cada ação pede (abrirEstacao serve para qualquer uma; comandoNaEstacao, para qualquer simulação). */
export const ESTACAO_DA_ACAO: Record<AcaoExposicao["tipo"], TipoEstacao | null> = {
  abrirEstacao: null,
  furarCartao: "tear",
  alternarBit: "bits",
  descerCamada: "camadas",
  escolherLinha: "camadas",
  definirCor: "cor",
  porNaLinha: "linha-do-tempo",
  tirarDaLinha: "linha-do-tempo",
  pendurarPlaquinha: "linha-do-tempo",
  rodarLinguagem: "comparador",
  cantarCoral: "comparador",
  tocarParte: "comparador",
  escreverNaLinguagem: "comparador",
  ligarCartao: "ligar",
  porNaOrdem: "ordem",
  tirarDaOrdem: "ordem",
  mexerNoCircuito: "circuito",
  comandoNaEstacao: null,
};

/** A estação do tipo pedido com o estado dela (null se não existe ou é de outro tipo). */
function parDo<T extends TipoEstacao>(
  dados: DadosExposicao,
  estado: EstadoExposicao,
  id: string,
  tipo: T,
): { estacao: Extract<Estacao, { tipo: T }>; atual: Extract<EstadoEstacao, { tipo: T }> } | null {
  const estacao = estacaoDo(dados, id);
  const atual = estado.estacoes[id];
  if (!estacao || estacao.tipo !== tipo || !atual || atual.tipo !== tipo) return null;
  return { estacao: estacao as Extract<Estacao, { tipo: T }>, atual: atual as Extract<EstadoEstacao, { tipo: T }> };
}

function mudar<T extends TipoEstacao>(
  dados: DadosExposicao,
  estado: EstadoExposicao,
  id: string,
  tipo: T,
  mudanca: (estacao: Extract<Estacao, { tipo: T }>, atual: Extract<EstadoEstacao, { tipo: T }>) => EstadoEstacao | null,
): EstadoExposicao | null {
  const par = parDo(dados, estado, id, tipo);
  const novo = par ? mudanca(par.estacao, par.atual) : null;
  return novo ? comEstacao(estado, id, novo) : null;
}

/** Um comando numa estação de simulação. */
export function comandoNaEstacao(dados: DadosExposicao, estado: EstadoExposicao, id: string, comando: string): EstadoExposicao | null {
  const estacao = estacaoDo(dados, id);
  const atual = estado.estacoes[id];
  if (!estacao || !ehEstacaoSimulacao(estacao) || !atual || atual.tipo !== estacao.tipo) return null;
  const novo = modeloDa(estacao).comando(estacao, atual as EstadoSimulacao, comando);
  return novo ? comEstacao(estado, id, novo) : null;
}

/**
 * Aplica uma ação da exposição: o estado novo (que também abre a estação
 * mexida) ou null se a ação não existe ali (estação, peça ou cartão errado,
 * ou nada a fazer, como descer da última camada).
 */
export function aplicarAcaoExposicao(dados: DadosExposicao, estado: EstadoExposicao, acao: AcaoExposicao): EstadoExposicao | null {
  let novo: EstadoExposicao | null;
  switch (acao.tipo) {
    case "abrirEstacao":
      return abrirEstacao(dados, estado, acao.estacao);
    case "furarCartao":
      novo = furarCartao(dados, estado, acao.estacao, acao.linha, acao.coluna, acao.furado);
      break;
    case "alternarBit":
      novo = alternarBit(dados, estado, acao.estacao, acao.indice, acao.ligado);
      break;
    case "descerCamada":
      novo = descerCamada(dados, estado, acao.estacao);
      break;
    case "escolherLinha":
      novo = escolherLinhaCamada(dados, estado, acao.estacao, acao.linha);
      break;
    case "definirCor":
      novo = definirCor(dados, estado, acao.estacao, acao.valor);
      break;
    case "porNaLinha":
      novo = porNaLinha(dados, estado, acao.estacao, acao.evento, acao.posicao);
      break;
    case "tirarDaLinha":
      novo = tirarDaLinha(dados, estado, acao.estacao, acao.evento);
      break;
    case "pendurarPlaquinha":
      novo = pendurarPlaquinha(dados, estado, acao.estacao, acao.evento, acao.plaquinha);
      break;
    case "rodarLinguagem":
      novo = mudar(dados, estado, acao.estacao, "comparador", (e, a) => comparador.rodarNoComparador(e, a, acao.linguagem));
      break;
    case "cantarCoral":
      novo = mudar(dados, estado, acao.estacao, "comparador", (e, a) => comparador.cantarCoral(e, a));
      break;
    case "tocarParte":
      novo = mudar(dados, estado, acao.estacao, "comparador", (e, a) => comparador.tocarParte(e, a, acao.parte, acao.linguagem));
      break;
    case "escreverNaLinguagem":
      novo = mudar(dados, estado, acao.estacao, "comparador", (e, a) => comparador.escreverNoComparador(e, a, acao.linguagem, acao.codigo));
      break;
    case "ligarCartao":
      novo = mudar(dados, estado, acao.estacao, "ligar", (e, a) => cartoes.ligarCartao(e, a, acao.cartao, acao.alvo));
      break;
    case "porNaOrdem":
      novo = mudar(dados, estado, acao.estacao, "ordem", (e, a) => cartoes.porNaOrdem(e, a, acao.item, acao.posicao));
      break;
    case "tirarDaOrdem":
      novo = mudar(dados, estado, acao.estacao, "ordem", (e, a) => cartoes.tirarDaOrdem(e, a, acao.item));
      break;
    case "mexerNoCircuito":
      novo = mudar(dados, estado, acao.estacao, "circuito", (e, a) => circuitoMuseu.mexerNoCircuito(e, a, acao.mudanca));
      break;
    case "comandoNaEstacao":
      novo = comandoNaEstacao(dados, estado, acao.estacao, acao.comando);
      break;
  }
  return novo ? { ...novo, aberta: acao.estacao } : null;
}

/* ------------------------------------------------------------------ o anfitrião */

/**
 * O que o anfitrião diz agora. Na prática, a fala do objetivo atual ou, se
 * ele não tem, a do último objetivo de antes que tem (senão, a de abrir).
 * No desafio, a da última parte feita que tem fala. Concluída, a de
 * concluir (se houver).
 */
export function falaDoAnfitriao(
  dados: DadosExposicao,
  andamento: { tipo: "objetivos"; ids: readonly string[]; atual: number } | { tipo: "partes"; ids: readonly string[]; feitas: readonly string[] },
  concluida: boolean,
): string {
  if (concluida && dados.falas.concluir) return dados.falas.concluir;
  const porEtapa = dados.falas.porEtapa ?? {};
  if (andamento.tipo === "objetivos") {
    for (let i = Math.min(andamento.atual, andamento.ids.length - 1); i >= 0; i -= 1) {
      const fala = porEtapa[andamento.ids[i]];
      if (fala) return fala;
    }
    return dados.falas.abrir;
  }
  const feitas = andamento.ids.filter((id) => andamento.feitas.includes(id) && porEtapa[id]);
  return feitas.length ? porEtapa[feitas[feitas.length - 1]] : dados.falas.abrir;
}

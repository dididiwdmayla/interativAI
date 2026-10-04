/*
 * O plano no código (área plano de uma fase composta): o botão "Levar o
 * plano pro código" escreve os passos, na ordem do aluno, como um bloco de
 * comentários numerados no Snippet, sem apagar o código que já existe:
 *
 *   // Plano: Calcular a média das notas
 *   // 1. Se não tiver nenhuma nota, devolver 0
 *   // 2. Começar a soma em zero
 *   ...
 *
 * No agrupar, cada passo grande vira "// 1. Título" e os subpassos,
 * "//   1.1 texto". Mexer no plano depois reescreve SÓ esse bloco (o
 * cabeçalho "// Plano:" e as linhas numeradas logo abaixo dele); o resto do
 * código fica como está.
 *
 * O caminho de volta (validador planoComentado): os comentários de linha
 * inteira do código que batem com o texto de um cartão viram um plano, na
 * ordem em que aparecem, conferido pelas mesmas dependências do quadro.
 * Assim o aluno pode descer cada comentário para perto do código que ele
 * vira (como no pseudocódigo), desde que a ordem continue valendo.
 *
 * Puro (sem React): a tela, a simulação e o validador usam as mesmas funções.
 */
import { type DadosOrdenar, destinosDo, type EstadoOrdenar, LISTA_DO_PLANO, ordemDoPlano } from "../ordenar/modelo";

/** O começo do cabeçalho do bloco ("// Plano: <problema>"). */
export const CABECALHO_DO_PLANO = "// Plano:";

/** Linha de comentário inteira: o texto depois de "//". */
const COMENTARIO = /^\s*\/\/(.*)$/;
/** Cabeçalho do bloco. */
const CABECALHO = /^\s*\/\/\s*Plano\s*:/i;
/** Linha numerada do bloco ("// 2. texto", "//   1.2 texto"). */
const LINHA_NUMERADA = /^\s*\/\/\s*\d+(?:\.\d+)*[.)]?\s/;
/** A numeração no começo do texto de um comentário. */
const NUMERACAO = /^\s*\d+(?:\.\d+)*[.)]?\s*/;

const textoDoCartao = (dados: DadosOrdenar, id: string) => dados.cartoes.find((c) => c.id === id)?.texto ?? id;

/** As linhas do bloco do plano, na ordem do aluno (sem recuo). */
export function linhasDoPlano(dados: DadosOrdenar, estado: EstadoOrdenar): string[] {
  const linhas = [`${CABECALHO_DO_PLANO} ${dados.problema}`];
  if (dados.modo === "agrupar") {
    (dados.grupos ?? []).forEach((grupo, g) => {
      linhas.push(`// ${g + 1}. ${grupo.titulo}`);
      (estado.listas[grupo.id] ?? []).forEach((id, i) => linhas.push(`//   ${g + 1}.${i + 1} ${textoDoCartao(dados, id)}`));
    });
  } else {
    ordemDoPlano(dados, estado).forEach((id, i) => linhas.push(`// ${i + 1}. ${textoDoCartao(dados, id)}`));
  }
  return linhas;
}

/** Onde o bloco do plano está no código: posições (de, até) do texto e o recuo do cabeçalho. */
export function acharBlocoDoPlano(codigo: string): { de: number; ate: number; recuo: string } | null {
  const linhas = codigo.split("\n");
  const inicio = linhas.findIndex((linha) => CABECALHO.test(linha));
  if (inicio < 0) return null;
  let fim = inicio;
  while (fim + 1 < linhas.length && LINHA_NUMERADA.test(linhas[fim + 1])) fim += 1;
  const de = linhas.slice(0, inicio).reduce((total, linha) => total + linha.length + 1, 0);
  const ate = de + linhas.slice(inicio, fim + 1).join("\n").length;
  return { de, ate, recuo: /^\s*/.exec(linhas[inicio])?.[0] ?? "" };
}

/** Uma troca de texto no código: de, até (posições) e o que entra no lugar. */
export type MudancaNoCodigo = { de: number; ate: number; texto: string };

/**
 * O que muda no código para ele ter o plano de agora: reescreve o bloco que
 * já existe (com o mesmo recuo) ou, com `inserir`, põe o bloco no topo, antes
 * do código que já existe. Null: nada a mudar (o bloco já está igual, ou não
 * existe e não é para inserir).
 */
export function mudancaDoPlano(codigo: string, linhasPlano: readonly string[], inserir: boolean): MudancaNoCodigo | null {
  const bloco = acharBlocoDoPlano(codigo);
  if (bloco) {
    const texto = linhasPlano.map((linha) => bloco.recuo + linha).join("\n");
    return codigo.slice(bloco.de, bloco.ate) === texto ? null : { de: bloco.de, ate: bloco.ate, texto };
  }
  if (!inserir) return null;
  return { de: 0, ate: 0, texto: linhasPlano.join("\n") + (codigo.trim() ? "\n\n" : "\n") };
}

export function aplicarMudanca(codigo: string, mudanca: MudancaNoCodigo | null): string {
  return mudanca ? codigo.slice(0, mudanca.de) + mudanca.texto + codigo.slice(mudanca.ate) : codigo;
}

/** O código com o plano de agora (o bloco reescrito, ou inserido no topo com `inserir`). */
export function codigoComPlano(codigo: string, dados: DadosOrdenar, estado: EstadoOrdenar, inserir: boolean): string {
  return aplicarMudanca(codigo, mudancaDoPlano(codigo, linhasDoPlano(dados, estado), inserir));
}

/** Texto comparável: sem acento, minúsculo, espaços simples e sem a pontuação do fim. */
export function normalizarPasso(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.;:!]+$/, "")
    .trim();
}

type ComentarioDoPlano = { linha: number; tipo: "cartao" | "grupo"; id: string };

/** Os comentários de linha inteira que são passos do plano (cartões ou passos grandes), na ordem do código. */
function comentariosDoPlano(dados: DadosOrdenar, codigo: string): ComentarioDoPlano[] {
  const cartoes = new Map(dados.cartoes.map((c) => [normalizarPasso(c.texto), c.id]));
  const grupos = new Map((dados.modo === "agrupar" ? (dados.grupos ?? []) : []).map((g) => [normalizarPasso(g.titulo), g.id]));
  const achados: ComentarioDoPlano[] = [];
  codigo.split("\n").forEach((linha, indice) => {
    const comentario = COMENTARIO.exec(linha);
    if (!comentario || CABECALHO.test(linha)) return;
    const texto = normalizarPasso(comentario[1].replace(NUMERACAO, ""));
    if (!texto) return;
    const grupo = grupos.get(texto);
    if (grupo !== undefined) achados.push({ linha: indice + 1, tipo: "grupo", id: grupo });
    else if (cartoes.has(texto)) achados.push({ linha: indice + 1, tipo: "cartao", id: cartoes.get(texto) as string });
  });
  return achados;
}

/**
 * O plano que os comentários do código descrevem: os cartões na ordem em
 * que aparecem (cada um só a primeira vez). No agrupar, cada cartão entra no
 * passo grande do último comentário de passo grande antes dele (sem nenhum
 * antes, ele fica de fora e conta como faltando).
 */
export function planoDosComentarios(dados: DadosOrdenar, codigo: string): { estado: EstadoOrdenar; achados: number } {
  const listas: Record<string, string[]> = Object.fromEntries(destinosDo(dados).map((d) => [d, [] as string[]]));
  const vistos = new Set<string>();
  let grupoAtual: string | null = dados.modo === "agrupar" ? null : LISTA_DO_PLANO;
  let achados = 0;
  for (const item of comentariosDoPlano(dados, codigo)) {
    if (item.tipo === "grupo") {
      grupoAtual = item.id;
      continue;
    }
    achados += 1;
    if (vistos.has(item.id) || grupoAtual === null) continue;
    vistos.add(item.id);
    listas[grupoAtual].push(item.id);
  }
  return { estado: { listas }, achados };
}

/** A linha (de 1) do comentário do passo no código, ou null se ele não está lá. */
export function linhaDoPasso(dados: DadosOrdenar, codigo: string, passo: string): number | null {
  return comentariosDoPlano(dados, codigo).find((item) => item.tipo === "cartao" && item.id === passo)?.linha ?? null;
}

/** Os cartões que já estão no código como comentário. */
export function passosNoCodigo(dados: DadosOrdenar, codigo: string): Set<string> {
  return new Set(comentariosDoPlano(dados, codigo).flatMap((item) => (item.tipo === "cartao" ? [item.id] : [])));
}

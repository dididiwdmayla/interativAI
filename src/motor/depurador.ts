/*
 * O depurador da aba Fontes (Sources, no Chrome), construído sobre o rastro
 * do executor: o programa roda inteiro no Worker (como sempre) e o
 * depurador "pausa" andando pelo rastro, passo a passo. Cada passo do
 * rastro é a memória ANTES da linha rodar, que é exatamente o que o Chrome
 * mostra quando pausa numa linha.
 *
 * Fidelidade (developer.chrome.com, "JavaScript debugging reference",
 * "Pause your code with breakpoints" e "Keyboard shortcuts"):
 * - ponto de parada: clicar no número da linha (Ctrl+B / Cmd+B na linha do
 *   cursor); a instrução `debugger;` pausa como um ponto de parada escrito
 *   no código; o Chrome pausa ANTES da linha rodar;
 * - Retomar (F8 ou Ctrl+\): roda até o próximo ponto de parada;
 * - Passar por cima (F10 ou Ctrl+'): a próxima linha da mesma função (a
 *   função chamada roda inteira, a não ser que tenha um ponto de parada);
 * - Entrar na função (F11 ou Ctrl+;): entra na função chamada na linha;
 * - Sair da função (Shift+F11 ou Ctrl+Shift+;): roda até voltar para quem
 *   chamou;
 * - Escopo (Scope): Local, Bloco, Script e Global; Observar (Watch):
 *   expressões avaliadas no momento pausado; Pilha de chamadas (Call
 *   Stack): as funções abertas, a de cima é a que roda agora.
 *
 * Puro (sem React): a tela (useDepurador) e a simulação dos testes
 * (src/motor/simulacao.ts) usam as mesmas funções.
 */
import { analisarCodigo } from "./executor/instrumentar";
import type { EscopoMemoria, FotoMemoria, PassoRastro, QuadroMemoria, ValorMemoria } from "./executor/tipos";
import type { IdFerramenta } from "@/ferramentas/ids";
import type { Fase } from "@/conteudo/tipos";

export type ControleDepurador = "retomar" | "passar-por-cima" | "entrar" | "sair";

export const CONTROLES_DEPURADOR: readonly ControleDepurador[] = ["retomar", "passar-por-cima", "entrar", "sair"];

/** Nome, atalho do Windows/Linux e do Mac de cada controle (conferidos na documentação do Chrome). */
export const DADOS_DO_CONTROLE: Record<ControleDepurador, { nome: string; atalho: string; atalhoMac: string }> = {
  retomar: { nome: "Retomar", atalho: "F8 ou Ctrl+\\", atalhoMac: "F8 ou Cmd+\\" },
  "passar-por-cima": { nome: "Passar por cima", atalho: "F10 ou Ctrl+'", atalhoMac: "F10 ou Cmd+'" },
  entrar: { nome: "Entrar na função", atalho: "F11 ou Ctrl+;", atalhoMac: "F11 ou Cmd+;" },
  sair: { nome: "Sair da função", atalho: "Shift+F11 ou Ctrl+Shift+;", atalhoMac: "Shift+F11 ou Cmd+Shift+;" },
};

/** As ferramentas do depurador. Qualquer uma delas em usaFerramentas liga o depurador na aba Fontes. */
export const FERRAMENTAS_DO_DEPURADOR: readonly IdFerramenta[] = ["pontos-de-parada", "controles-depurador", "painel-escopo", "painel-observar", "pilha-de-chamadas"];

/** A fase tem o depurador (o Snippet e alguma ferramenta do depurador). */
export function faseComDepurador(fase: Fase): boolean {
  return Boolean(fase.programa?.snippet) && FERRAMENTAS_DO_DEPURADOR.some((id) => fase.usaFerramentas.includes(id));
}

export type MotivoPausa = "ponto-de-parada" | "debugger" | "passo";

/** Onde o depurador está pausado: o índice do passo no rastro e o porquê. */
export type PausaDepurador = { indice: number; motivo: MotivoPausa; linha: number };

const profundidade = (passo: PassoRastro) => passo.memoria.quadros.length;

function pausaPorParada(passo: PassoRastro, pontos: readonly number[]): MotivoPausa | null {
  if (passo.tipo !== "passo" || passo.linha === null) return null;
  if (passo.depurador) return "debugger";
  return pontos.includes(passo.linha) ? "ponto-de-parada" : null;
}

function pausaEm(passos: readonly PassoRastro[], indice: number, motivo: MotivoPausa): PausaDepurador {
  return { indice, motivo, linha: passos[indice].linha ?? 0 };
}

/** A primeira pausa de uma execução (null: o programa roda direto até o fim). */
export function primeiraPausa(passos: readonly PassoRastro[], pontos: readonly number[]): PausaDepurador | null {
  for (let i = 0; i < passos.length; i += 1) {
    const motivo = pausaPorParada(passos[i], pontos);
    if (motivo) return pausaEm(passos, i, motivo);
  }
  return null;
}

/**
 * A próxima pausa depois de um controle (null: o programa terminou). O
 * passo de "retorno" (a função devolvendo, com o valor) também é parada de
 * quem anda passo a passo, como o Chrome parando no fecha-chave da função.
 */
export function proximaPausa(passos: readonly PassoRastro[], atual: number, controle: ControleDepurador, pontos: readonly number[]): PausaDepurador | null {
  const aqui = passos[atual];
  if (!aqui) return null;
  const nivel = profundidade(aqui);
  for (let i = atual + 1; i < passos.length; i += 1) {
    const passo = passos[i];
    if (passo.tipo === "fim" || passo.tipo === "erro") return null;
    const parada = pausaPorParada(passo, pontos);
    if (controle === "retomar") {
      if (parada) return pausaEm(passos, i, parada);
      continue;
    }
    if (parada && profundidade(passo) > nivel) return pausaEm(passos, i, parada);
    const nivelAgora = profundidade(passo);
    if (controle === "entrar") {
      return pausaEm(passos, i, parada ?? "passo");
    }
    if (controle === "passar-por-cima") {
      if (passo.tipo === "passo" && nivelAgora <= nivel) return pausaEm(passos, i, parada ?? "passo");
      if (passo.tipo === "retorno" && nivelAgora === nivel) return pausaEm(passos, i, "passo");
      continue;
    }
    // sair: até voltar para quem chamou (no código de cima, roda até o próximo ponto de parada).
    if (passo.tipo === "passo" && (nivelAgora < nivel || parada)) return pausaEm(passos, i, parada ?? "passo");
  }
  return null;
}

/**
 * As linhas onde dá para pausar (onde algum comando começa). Ponto de
 * parada numa linha vazia, num comentário ou num fecha-chave escorrega para
 * a próxima linha com código, como no Chrome. Código que não dá para ler:
 * null (qualquer linha vale).
 */
export function linhasComCodigo(codigo: string): Set<number> | null {
  const lido = analisarCodigo(codigo);
  if (!lido.ok) return null;
  const linhas = new Set<number>();
  const andar = (no: unknown) => {
    if (typeof no !== "object" || no === null) return;
    const atual = no as { type?: unknown; loc?: { start: { line: number } } };
    if (typeof atual.type === "string") {
      const ehComando = /Statement$|Declaration$/.test(atual.type) && atual.type !== "BlockStatement" && atual.type !== "FunctionDeclaration" && atual.type !== "EmptyStatement" && atual.type !== "ClassDeclaration";
      if (ehComando && atual.loc) linhas.add(atual.loc.start.line);
    }
    for (const [chave, valor] of Object.entries(no)) {
      if (chave === "loc") continue;
      if (Array.isArray(valor)) valor.forEach(andar);
      else if (typeof valor === "object" && valor !== null) andar(valor);
    }
  };
  andar(lido.programa);
  return linhas;
}

/** Onde o ponto de parada fica de verdade: a própria linha ou a próxima com código. */
export function linhaDoPontoDeParada(codigo: string, linha: number): number {
  const total = codigo.split("\n").length;
  const comCodigo = linhasComCodigo(codigo);
  if (!comCodigo) return Math.max(1, Math.min(total, linha));
  for (let l = linha; l <= total; l += 1) if (comCodigo.has(l)) return l;
  for (let l = linha - 1; l >= 1; l -= 1) if (comCodigo.has(l)) return l;
  return Math.max(1, Math.min(total, linha));
}

/** Liga ou desliga o ponto de parada (já escorregado para a linha com código). */
export function alternarPonto(pontos: readonly number[], linha: number): number[] {
  return pontos.includes(linha) ? pontos.filter((l) => l !== linha) : [...pontos, linha].sort((a, b) => a - b);
}

/** Expressões comparadas sem os espaços (total+1 é o mesmo que total + 1). */
export function normalizarExpressao(expressao: string): string {
  return expressao.replace(/\s+/g, "");
}

/* ------------------------------------------------------------------ */
/* Os painéis: Escopo e Pilha de chamadas                              */
/* ------------------------------------------------------------------ */

export type VariavelEscopo = { nome: string; valor: ValorMemoria };

/** Uma seção do painel Escopo, como no Chrome: Local, Bloco, Script e Global. */
export type SecaoEscopo = { id: string; titulo: "Local" | "Bloco" | "Script" | "Global"; variaveis: VariavelEscopo[] };

/**
 * O painel Escopo de um quadro: os blocos (de dentro para fora) e o Local
 * (função), depois o Script (let, const e class do código de cima) e o
 * Global (var e function do código de cima). No passo de retorno, o Local
 * ganha "Valor devolvido" (Return value, no Chrome).
 */
export function secoesDoEscopo(foto: FotoMemoria, quadro: number, retorno?: ValorMemoria): SecaoEscopo[] {
  const q = foto.quadros[quadro];
  if (!q) return [];
  const secoes: SecaoEscopo[] = [];
  const locais = q.escopos.filter((escopo) => escopo.tipo !== "global");
  const variaveisDe = (escopo: EscopoMemoria) => escopo.variaveis.map((v) => ({ nome: v.nome, valor: v.valor }));
  for (const escopo of [...locais].reverse()) {
    if (escopo.tipo === "bloco") secoes.push({ id: escopo.id, titulo: "Bloco", variaveis: variaveisDe(escopo) });
    else {
      const variaveis = variaveisDe(escopo);
      if (retorno && quadro === foto.quadros.length - 1) variaveis.unshift({ nome: "Valor devolvido", valor: retorno });
      secoes.push({ id: escopo.id, titulo: "Local", variaveis });
    }
  }
  const global = foto.quadros[0]?.escopos.find((escopo) => escopo.tipo === "global");
  const doScript = global?.variaveis.filter((v) => v.declaracao === "let" || v.declaracao === "const" || v.declaracao === "classe") ?? [];
  const doGlobal = global?.variaveis.filter((v) => !(v.declaracao === "let" || v.declaracao === "const" || v.declaracao === "classe")) ?? [];
  secoes.push({ id: "script", titulo: "Script", variaveis: doScript.map((v) => ({ nome: v.nome, valor: v.valor })) });
  secoes.push({ id: "global", titulo: "Global", variaveis: doGlobal.map((v) => ({ nome: v.nome, valor: v.valor })) });
  return secoes;
}

export type QuadroDaPilha = { indice: number; nome: string; linha: number | null };

/** A Pilha de chamadas: a função que roda agora em cima e o código de cima embaixo. */
export function pilhaDeChamadas(foto: FotoMemoria): QuadroDaPilha[] {
  return foto.quadros
    .map((quadro: QuadroMemoria, indice) => ({ indice, nome: indice === 0 ? "(anônima)" : quadro.nome, linha: quadro.linha ?? null }))
    .reverse();
}

/** O valor de um nome no momento pausado (o hover do código): do quadro, de dentro para fora, e depois o global. */
export function valorDoNome(foto: FotoMemoria, quadro: number, nome: string): ValorMemoria | null {
  const q = foto.quadros[quadro];
  const escopos = [...(q?.escopos ?? [])].reverse();
  const global = foto.quadros[0]?.escopos.find((escopo) => escopo.tipo === "global");
  for (const escopo of [...escopos, ...(global ? [global] : [])]) {
    const achada = escopo.variaveis.find((v) => v.nome === nome);
    if (achada) return achada.valor;
  }
  return null;
}

/*
 * Instrumentação do código do jogador (decisão no PROJETO.md, "Executor de
 * JavaScript"). O acorn lê a árvore do código e os ganchos entram DIRETO NO
 * TEXTO, nas posições dos nós: nada é regerado, nenhuma quebra de linha é
 * acrescentada, então a linha N do código instrumentado é a linha N que o
 * jogador escreveu (os erros do motor de JavaScript apontam a linha certa).
 *
 * Ganchos (o objeto global `__r`, ver runtime.ts):
 * - `__r.p(linha, coluna)` antes de cada comando: um passo do rastro, e a
 *   proteção contra loop infinito (todo corpo de laço ganha pelo menos um);
 * - `__r.f(...)` / `__r.s()` na entrada e na saída de cada função (a moldura
 *   da chamada no palco), com um leitor das variáveis dela. O leitor nasce
 *   DENTRO do try que embrulha o corpo: as let e const do corpo moram nesse
 *   bloco, e um leitor criado fora não enxergaria nenhuma;
 * - `__r.b(...)` / `__r.x()` nos blocos que declaram variáveis (let, const,
 *   classe, função, a cabeça do for e o parâmetro do catch);
 * - `__r.ret(valor)` no return (o valor devolvido entra no rastro);
 * - `__r.c(erro)` guarda onde um erro nasceu (o quadro mais de dentro);
 * - `__r.d([...])` registra as globais e `__r.k(nome)` protege as const
 *   globais, no modo do Console (abaixo);
 * - `__r.res(valor)` guarda o valor da última expressão (a resposta do
 *   Console).
 *
 * Modo do Console (REPL do Chrome, que aceita declarar de novo let, const e
 * class em entradas separadas, desde o Chrome 80 e 92): as declarações do
 * nível de cima viram `var` (propriedades do global, que sobrevivem entre
 * entradas e podem ser declaradas de novo). A const continua sem poder
 * trocar de valor: toda atribuição a um nome global passa por `__r.k`, que
 * lança o mesmo TypeError do navegador. `__r.t` marca a zona morta das
 * declarações do topo e `__r.l` confere leituras (inclusive typeof). Cada
 * declarador inicializado sai da zona morta em `__r.d`.
 */
import { parse, tokenizer, type AnyNode, type Comment, type Program, type Statement, type Pattern, type Node as NoAcorn } from "acorn";
import type { TipoDeclaracao } from "./tipos";

export type SintaxeJs =
  | "if"
  | "else"
  | "else-if"
  | "for"
  | "for-of"
  | "for-in"
  | "while"
  | "do-while"
  | "switch"
  | "break"
  | "funcao"
  | "arrow"
  | "return"
  | "template"
  | "let"
  | "const"
  | "var"
  | "classe"
  | "ternario"
  | "array"
  | "objeto"
  | "desestruturacao"
  | "spread"
  | "e-logico"
  | "ou-logico"
  | "nao-logico"
  | "igualdade-estrita"
  | "igualdade-solta"
  | "comparacao"
  | "incremento"
  | "atribuicao-composta"
  | "typeof"
  | "try"
  | "throw"
  | "comentario"
  | "console-log"
  | `metodo:${string}`;

export type ErroDeSintaxe = { mensagem: string; linha: number; coluna: number };

export type CodigoInstrumentado = {
  ok: true;
  codigo: string;
  /** O texto que o jogador escreveu (com os parênteses do objeto solto no Console, se for o caso). */
  fonte: string;
  sintaxes: SintaxeJs[];
  /** Texto original de cada função (id do escopo -> código do jogador). */
  fontes: Record<string, string>;
};

export type FalhaInstrumentacao = { ok: false; erro: ErroDeSintaxe; naoSuportado: boolean };

type Edicao = {
  pos: number;
  texto: string;
  /** Quantos caracteres do original somem a partir de `pos`. */
  remover: number;
  fecha: boolean;
  profundidade: number;
  ordem: number;
};

type Declaracao = [string, TipoDeclaracao];

const OPCOES_ACORN = { ecmaVersion: "latest", sourceType: "script", locations: true } as const;

/** Lê o código com o acorn; a mensagem de erro sai sem o "(linha:coluna)" do fim. */
export function analisarCodigo(fonte: string): { ok: true; programa: Program } | { ok: false; erro: ErroDeSintaxe } {
  try {
    return { ok: true, programa: parse(fonte, OPCOES_ACORN) };
  } catch (erro) {
    const loc = (erro as { loc?: { line: number; column: number } }).loc;
    const mensagem = erro instanceof Error ? erro.message.replace(/\s*\(\d+:\d+\)$/, "") : String(erro);
    return { ok: false, erro: { mensagem, linha: loc?.line ?? 1, coluna: (loc?.column ?? 0) + 1 } };
  }
}

/**
 * Como o Console do Chrome: uma entrada que começa com "{" e termina com "}"
 * e é um objeto válido vira um objeto (entre parênteses), não um bloco.
 */
export function fonteDoConsole(fonte: string): string {
  const aparado = fonte.trim();
  if (!aparado.startsWith("{") || !aparado.endsWith("}")) return fonte;
  const entre = `(${fonte})`;
  const lido = analisarCodigo(entre);
  if (lido.ok && lido.programa.body.length === 1 && lido.programa.body[0].type === "ExpressionStatement") return entre;
  return fonte;
}

function ehNo(valor: unknown): valor is AnyNode {
  return typeof valor === "object" && valor !== null && typeof (valor as { type?: unknown }).type === "string";
}

/** Os filhos de um nó, na ordem do código. */
function filhos(no: AnyNode): AnyNode[] {
  const lista: AnyNode[] = [];
  for (const [chave, valor] of Object.entries(no)) {
    if (chave === "loc" || chave === "type" || chave === "start" || chave === "end") continue;
    if (Array.isArray(valor)) {
      for (const item of valor) if (ehNo(item)) lista.push(item);
    } else if (ehNo(valor)) lista.push(valor);
  }
  return lista.sort((a, b) => a.start - b.start);
}

export function nomesDoPadrao(padrao: Pattern | null | undefined): string[] {
  if (!padrao) return [];
  switch (padrao.type) {
    case "Identifier":
      return [padrao.name];
    case "ObjectPattern":
      return padrao.properties.flatMap((prop) => (prop.type === "RestElement" ? nomesDoPadrao(prop.argument) : nomesDoPadrao(prop.value)));
    case "ArrayPattern":
      return padrao.elements.flatMap((el) => nomesDoPadrao(el));
    case "RestElement":
      return nomesDoPadrao(padrao.argument);
    case "AssignmentPattern":
      return nomesDoPadrao(padrao.left);
    default:
      return [];
  }
}

function ehFuncao(no: AnyNode): boolean {
  return no.type === "FunctionDeclaration" || no.type === "FunctionExpression" || no.type === "ArrowFunctionExpression";
}

/** As `var` de um corpo (sem entrar em funções de dentro). */
function varsDoCorpo(no: AnyNode): string[] {
  const nomes: string[] = [];
  const andar = (atual: AnyNode) => {
    if (atual.type === "VariableDeclaration" && atual.kind === "var") {
      for (const d of atual.declarations) nomes.push(...nomesDoPadrao(d.id));
    }
    for (const filho of filhos(atual)) {
      if (ehFuncao(filho) || filho.type === "ClassDeclaration" || filho.type === "ClassExpression") continue;
      andar(filho);
    }
  };
  andar(no);
  return nomes;
}

/** Declarações léxicas diretas de uma lista de comandos. */
function lexicosDaLista(comandos: readonly AnyNode[], dentroDeFuncao: boolean): Declaracao[] {
  const decl: Declaracao[] = [];
  for (const comando of comandos) {
    if (comando.type === "VariableDeclaration" && comando.kind !== "var") {
      for (const d of comando.declarations) for (const nome of nomesDoPadrao(d.id)) decl.push([nome, comando.kind === "const" ? "const" : "let"]);
    } else if (comando.type === "ClassDeclaration" && comando.id) {
      decl.push([comando.id.name, "classe"]);
    } else if (comando.type === "FunctionDeclaration" && comando.id) {
      decl.push([comando.id.name, "funcao"]);
    }
  }
  void dentroDeFuncao;
  return decl;
}

function semRepetir(decl: Declaracao[]): Declaracao[] {
  const vistos = new Set<string>();
  const saida: Declaracao[] = [];
  for (const item of decl) {
    if (vistos.has(item[0])) continue;
    vistos.add(item[0]);
    saida.push(item);
  }
  return saida;
}

const texto = JSON.stringify;

function leitor(decl: Declaracao[]): string {
  const casos = decl.map(([nome], i) => `case ${i}:return ${nome};`).join("");
  return `(__k)=>{switch(__k){${casos}}}`;
}

/** Posição logo depois da seta "=>" de uma arrow (pula comentários). */
function posicaoDaSeta(fonte: string, desde: number, ate: number): number {
  let i = desde;
  while (i < ate) {
    if (fonte.startsWith("/*", i)) {
      const fim = fonte.indexOf("*/", i + 2);
      i = fim < 0 ? ate : fim + 2;
      continue;
    }
    if (fonte.startsWith("//", i)) {
      const fim = fonte.indexOf("\n", i);
      i = fim < 0 ? ate : fim + 1;
      continue;
    }
    if (fonte.startsWith("=>", i)) return i + 2;
    i += 1;
  }
  return -1;
}

class Instrumentador {
  private edicoes: Edicao[] = [];
  private ordem = 0;
  private contadorEscopo = 0;
  /** Nomes declarados nos escopos locais abertos (para saber se um nome é global). */
  private pilhaNomes: Set<string>[] = [];
  naoSuportado: { mensagem: string; linha: number; coluna: number } | null = null;
  /** Texto original de cada função, pelo id do escopo (o toString mostra este, não o instrumentado). */
  readonly fontes: Record<string, string> = {};

  constructor(
    private readonly fonte: string,
    private readonly prefixo: string,
  ) {}

  private inserir(pos: number, textoNovo: string, fecha: boolean, profundidade: number, remover = 0) {
    this.edicoes.push({ pos, texto: textoNovo, remover, fecha, profundidade, ordem: this.ordem++ });
  }

  private idEscopo(): string {
    this.contadorEscopo += 1;
    return `${this.prefixo}e${this.contadorEscopo}`;
  }

  private naoSuporta(no: NoAcorn, mensagem: string) {
    if (!this.naoSuportado) this.naoSuportado = { mensagem, linha: no.loc?.start.line ?? 1, coluna: (no.loc?.start.column ?? 0) + 1 };
  }

  private ehLocal(nome: string): boolean {
    return this.pilhaNomes.some((nomes) => nomes.has(nome));
  }

  private passo(no: NoAcorn): string {
    return `__r.p(${no.loc?.start.line ?? 0},${(no.loc?.start.column ?? 0) + 1});`;
  }

  aplicar(): string {
    const ordenadas = [...this.edicoes].sort((a, b) => {
      if (a.pos !== b.pos) return a.pos - b.pos;
      if (a.fecha !== b.fecha) return a.fecha ? -1 : 1;
      if (a.fecha) return b.profundidade - a.profundidade || a.ordem - b.ordem;
      return a.profundidade - b.profundidade || a.ordem - b.ordem;
    });
    let saida = "";
    let cursor = 0;
    for (const e of ordenadas) {
      if (e.pos > cursor) {
        saida += this.fonte.slice(cursor, e.pos);
        cursor = e.pos;
      }
      saida += e.texto;
      if (e.remover) cursor = Math.max(cursor, e.pos + e.remover);
    }
    return saida + this.fonte.slice(cursor);
  }

  programa(programa: Program) {
    const topo = programa.body;
    // Funções do nível de cima existem desde o começo (içamento).
    const funcoes = topo.flatMap((c) => (c.type === "FunctionDeclaration" && c.id ? [[c.id.name, "funcao"] as Declaracao] : []));
    if (funcoes.length) this.inserir(0, `__r.d(${texto(funcoes)});`, false, -1);

    const lexicos = lexicosDaLista(topo, false).filter(([, tipo]) => tipo !== "funcao");
    if (lexicos.length) this.inserir(0, `__r.t(${texto(lexicos.map(([nome]) => nome))});`, false, -1);

    let ultimaExpressao = -1;
    for (let i = topo.length - 1; i >= 0; i -= 1) {
      const c = topo[i];
      if (c.type === "EmptyStatement" || c.type === "FunctionDeclaration") continue;
      if (c.type === "ExpressionStatement") ultimaExpressao = i;
      break;
    }

    topo.forEach((comando, i) => {
      const prof = 0;
      if (comando.type !== "FunctionDeclaration" && comando.type !== "EmptyStatement") {
        // var soltas dentro do comando (ex.: for (var i...)) existem antes dele rodar.
        const soltas = comando.type === "VariableDeclaration" ? [] : varsDoCorpo(comando);
        if (soltas.length) this.inserir(comando.start, `__r.d(${texto(soltas.map((n) => [n, "var"]))});`, false, prof - 0.5);
        this.inserir(comando.start, this.passo(comando), false, prof);
      }
      if (comando.type === "VariableDeclaration") {
        const tipo = comando.kind as "const" | "let" | "var";
        if (comando.kind !== "var") this.inserir(comando.start, "var", false, prof + 0.5, comando.kind.length);
        comando.declarations.forEach((d, indice) => {
          const semValor = !d.init && d.id.type === "Identifier" ? " = undefined" : "";
          const decl = nomesDoPadrao(d.id).map((nome) => [nome, tipo]);
          this.inserir(d.end, `${semValor};__r.d(${texto(decl)});`, true, prof);
          const seguinte = comando.declarations[indice + 1];
          if (seguinte) {
            const virgula = d.end + tokenizer(this.fonte.slice(d.end, seguinte.start), OPCOES_ACORN).getToken().start;
            this.inserir(virgula, "var ", false, prof, 1);
          }
        });
        this.comando(comando, prof);
        return;
      }
      if (comando.type === "ClassDeclaration" && comando.id) {
        this.inserir(comando.start, `var ${comando.id.name} = `, false, prof + 0.5);
        this.comando(comando, prof);
        this.inserir(comando.end, `;__r.d(${texto([[comando.id.name, "classe"]])});`, true, prof);
        return;
      }
      if (i === ultimaExpressao && comando.type === "ExpressionStatement") {
        this.inserir(comando.expression.start, "__r.res((", false, prof + 0.5);
        this.expressao(comando.expression, prof + 1);
        this.inserir(comando.expression.end, "))", true, prof + 0.5);
        return;
      }
      this.comando(comando, prof);
    });
  }

  private listaDeComandos(comandos: readonly Statement[], prof: number) {
    for (const comando of comandos) {
      if (comando.type !== "FunctionDeclaration" && comando.type !== "EmptyStatement") this.inserir(comando.start, this.passo(comando), false, prof);
      this.comando(comando, prof);
    }
  }

  private abrirEscopo(nomes: Iterable<string>) {
    this.pilhaNomes.push(new Set(nomes));
  }

  private fecharEscopo() {
    this.pilhaNomes.pop();
  }

  /** Bloco `{ ... }` (não o corpo de função). */
  private bloco(no: AnyNode & { type: "BlockStatement" }, prof: number, cabeca: Declaracao[], corpoDeLaco: boolean) {
    const decl = semRepetir([...cabeca, ...lexicosDaLista(no.body, false)]);
    const abre = decl.length ? `try{__r.b(${texto(this.idEscopo())},${texto(decl)},${leitor(decl)});` : "";
    const fecha = decl.length ? "}finally{__r.x()}" : "";
    if (no.body.length === 0) {
      // Bloco vazio: abre e fecha no mesmo ponto, numa inserção só (a ordem não se perde).
      const meio = abre + (corpoDeLaco ? this.passo(no) : "") + fecha;
      if (meio) this.inserir(no.start + 1, meio, false, prof);
    } else if (decl.length) {
      this.inserir(no.start + 1, abre, false, prof);
      this.inserir(no.end - 1, fecha, true, prof);
    }
    this.abrirEscopo(decl.map(([n]) => n));
    this.listaDeComandos(no.body, prof + 1);
    this.fecharEscopo();
  }

  /** Corpo de if, else e laços: bloco ou um comando só (que ganha chaves). */
  private corpo(no: Statement, prof: number, cabeca: Declaracao[], corpoDeLaco: boolean) {
    if (no.type === "BlockStatement") {
      this.bloco(no, prof, cabeca, corpoDeLaco);
      return;
    }
    let abre = "{";
    let fecha = "}";
    if (cabeca.length) {
      const id = this.idEscopo();
      abre += `try{__r.b(${texto(id)},${texto(cabeca)},${leitor(cabeca)});`;
      fecha = "}finally{__r.x()}}";
    }
    this.inserir(no.start, abre + this.passo(no), false, prof);
    this.inserir(no.end, fecha, true, prof);
    this.abrirEscopo(cabeca.map(([n]) => n));
    this.comando(no, prof + 1);
    this.fecharEscopo();
  }

  private declaracoesDaCabeca(no: AnyNode | null | undefined): Declaracao[] {
    if (!no || no.type !== "VariableDeclaration" || no.kind === "var") return [];
    const tipo: TipoDeclaracao = no.kind === "const" ? "const" : "let";
    return no.declarations.flatMap((d) => nomesDoPadrao(d.id).map((n) => [n, tipo] as Declaracao));
  }

  private comando(no: Statement | AnyNode, prof: number) {
    switch (no.type) {
      case "BlockStatement":
        this.bloco(no, prof, [], false);
        return;
      case "IfStatement":
        this.expressao(no.test, prof + 1);
        this.corpo(no.consequent, prof + 1, [], false);
        if (no.alternate) this.corpo(no.alternate, prof + 1, [], false);
        return;
      case "ForStatement": {
        const cabeca = this.declaracoesDaCabeca(no.init);
        this.abrirEscopo(cabeca.map(([n]) => n));
        if (no.init) this.qualquer(no.init, prof + 1);
        if (no.test) this.expressao(no.test, prof + 1);
        if (no.update) this.expressao(no.update, prof + 1);
        this.corpo(no.body, prof + 1, cabeca, true);
        this.fecharEscopo();
        return;
      }
      case "ForInStatement":
      case "ForOfStatement": {
        if (no.type === "ForOfStatement" && no.await) this.naoSuporta(no, "for await ainda não roda aqui.");
        const cabeca = this.declaracoesDaCabeca(no.left);
        this.expressao(no.right, prof + 1);
        this.abrirEscopo(cabeca.map(([n]) => n));
        if (no.left.type !== "VariableDeclaration") this.qualquer(no.left, prof + 1);
        this.corpo(no.body, prof + 1, cabeca, true);
        this.fecharEscopo();
        return;
      }
      case "WhileStatement":
      case "DoWhileStatement":
        this.expressao(no.test, prof + 1);
        this.corpo(no.body, prof + 1, [], true);
        return;
      case "LabeledStatement":
        this.comando(no.body, prof);
        return;
      case "SwitchStatement":
        this.expressao(no.discriminant, prof + 1);
        for (const caso of no.cases) {
          if (caso.test) this.expressao(caso.test, prof + 1);
          this.listaDeComandos(caso.consequent, prof + 1);
        }
        return;
      case "TryStatement":
        this.bloco(no.block, prof + 1, [], false);
        if (no.handler) {
          const param: Declaracao[] = nomesDoPadrao(no.handler.param).map((n) => [n, "parametro"]);
          this.bloco(no.handler.body, prof + 1, param, false);
        }
        if (no.finalizer) this.bloco(no.finalizer, prof + 1, [], false);
        return;
      case "ReturnStatement":
        if (no.argument) {
          this.inserir(no.argument.start, "__r.ret(", false, prof + 0.5);
          this.expressao(no.argument, prof + 1);
          this.inserir(no.argument.end, ")", true, prof + 0.5);
        } else {
          this.inserir(no.start + "return".length, " __r.ret(void 0)", false, prof + 0.5);
        }
        return;
      case "ThrowStatement":
      case "ExpressionStatement":
        this.expressao(no.type === "ThrowStatement" ? no.argument : no.expression, prof + 1);
        return;
      case "VariableDeclaration":
        for (const d of no.declarations) {
          this.qualquer(d.id, prof + 1);
          if (d.init) this.expressao(d.init, prof + 1, d.id.type === "Identifier" ? d.id.name : undefined);
        }
        return;
      case "FunctionDeclaration":
        this.funcao(no, prof, no.id?.name ?? "(anônima)");
        return;
      case "ClassDeclaration":
        this.classe(no, prof);
        return;
      case "WithStatement":
        this.naoSuporta(no, "with não roda aqui.");
        return;
      default:
        return;
    }
  }

  private classe(no: AnyNode & { type: "ClassDeclaration" | "ClassExpression" }, prof: number) {
    if (no.superClass) this.expressao(no.superClass, prof + 1);
    for (const membro of no.body.body) {
      if (membro.type === "MethodDefinition") {
        const nome = membro.key.type === "Identifier" ? membro.key.name : "(método)";
        this.funcao(membro.value, prof + 1, no.id ? `${no.id.name}.${nome}` : nome);
      } else if (membro.type === "PropertyDefinition" && membro.value) {
        this.expressao(membro.value, prof + 1);
      } else if (membro.type === "StaticBlock") {
        this.naoSuporta(membro, "bloco static de classe ainda não roda aqui.");
      }
    }
  }

  private funcao(
    no: AnyNode & { type: "FunctionDeclaration" | "FunctionExpression" | "ArrowFunctionExpression" },
    prof: number,
    nome: string,
  ) {
    if (no.async) this.naoSuporta(no, "funções async ainda não rodam aqui.");
    if (no.generator) this.naoSuporta(no, "geradores (function*) ainda não rodam aqui.");
    const params: Declaracao[] = no.params.flatMap((p) => nomesDoPadrao(p).map((n) => [n, "parametro"] as Declaracao));
    const corpoLista = no.body.type === "BlockStatement" ? no.body.body : [];
    const decl = semRepetir([
      ...params,
      ...varsDoCorpo(no.body).map((n) => [n, "var"] as Declaracao),
      ...lexicosDaLista(corpoLista, true),
    ]);
    const id = this.idEscopo();
    this.fontes[id] = this.fonte.slice(no.start, no.end);
    const entrar = `try{__r.f(${texto(id)},${texto(nome)},${texto(decl)},${leitor(decl)});`;
    const sair = "}catch(__e){__r.c(__e);throw __e}finally{__r.s()}";
    this.abrirEscopo([...decl.map(([n]) => n), ...(no.type === "FunctionExpression" && no.id ? [no.id.name] : [])]);
    for (const p of no.params) this.qualquer(p, prof + 1);
    if (no.body.type === "BlockStatement") {
      if (no.body.body.length === 0) this.inserir(no.body.start + 1, entrar + sair, false, prof);
      else {
        this.inserir(no.body.start + 1, entrar, false, prof);
        this.inserir(no.body.end - 1, sair, true, prof);
      }
      this.listaDeComandos(no.body.body, prof + 1);
    } else {
      const inicioBusca = no.params.length ? no.params[no.params.length - 1].end : no.start;
      const seta = posicaoDaSeta(this.fonte, inicioBusca, no.body.start);
      if (seta < 0) {
        this.naoSuporta(no, "não achei a seta => desta função.");
      } else {
        this.inserir(seta, `{${entrar}${this.passo(no.body)}return __r.ret(`, false, prof);
        this.inserir(no.end, `)${sair}}`, true, prof);
      }
      this.expressao(no.body, prof + 1);
    }
    this.fecharEscopo();
  }

  /** Um nó qualquer (padrão, declaração na cabeça do for...): procura expressões dentro. */
  private qualquer(no: AnyNode, prof: number) {
    if (no.type === "VariableDeclaration") {
      this.comando(no, prof);
      return;
    }
    // Em um padrão, só defaults e chaves computadas são expressões.
    if (no.type === "Identifier") return;
    if (no.type === "AssignmentPattern") {
      this.qualquer(no.left, prof + 1);
      this.expressao(no.right, prof + 1);
      return;
    }
    if (no.type === "Property") {
      if (no.computed) this.expressao(no.key, prof + 1);
      this.qualquer(no.value, prof + 1);
      return;
    }
    for (const filho of filhos(no)) this.qualquer(filho, prof + 1);
  }

  private expressao(no: AnyNode, prof: number, nomeSugerido?: string) {
    switch (no.type) {
      case "Identifier":
        if (!this.ehLocal(no.name)) {
          this.inserir(no.start, `(__r.l(${texto(no.name)}),`, false, prof);
          this.inserir(no.end, ")", true, prof);
        }
        return;
      case "MemberExpression":
        this.expressao(no.object, prof + 1);
        if (no.computed) this.expressao(no.property, prof + 1);
        return;
      case "UnaryExpression":
        if (no.operator === "typeof" && no.argument.type === "Identifier" && !this.ehLocal(no.argument.name)) {
          this.inserir(no.start, `(__r.l(${texto(no.argument.name)}),`, false, prof);
          this.inserir(no.end, ")", true, prof);
        } else this.expressao(no.argument, prof + 1);
        return;
      case "FunctionExpression":
      case "ArrowFunctionExpression":
        this.funcao(no, prof, no.type === "FunctionExpression" && no.id ? no.id.name : (nomeSugerido ?? "(anônima)"));
        return;
      case "ClassExpression":
        this.classe(no, prof);
        return;
      case "AwaitExpression":
        this.naoSuporta(no, "await ainda não roda aqui.");
        return;
      case "YieldExpression":
        this.naoSuporta(no, "yield ainda não roda aqui.");
        return;
      case "ImportExpression":
        this.naoSuporta(no, "import() não roda aqui: o código do jogo não acessa a rede.");
        return;
      case "MetaProperty":
        this.naoSuporta(no, "import.meta e new.target ainda não rodam aqui.");
        return;
      case "AssignmentExpression":
        if (no.left.type === "Identifier" && !this.ehLocal(no.left.name)) {
          this.inserir(no.start, `(__r.k(${texto(no.left.name)}),`, false, prof);
          this.inserir(no.end, ")", true, prof);
        }
        if (no.left.type === "ObjectPattern" || no.left.type === "ArrayPattern") {
          const nomes = nomesDoPadrao(no.left).filter((nome) => !this.ehLocal(nome));
          if (nomes.length) {
            this.inserir(no.start, `(${nomes.map((nome) => `__r.k(${texto(nome)})`).join(",")},`, false, prof);
            this.inserir(no.end, ")", true, prof);
          }
          this.qualquer(no.left, prof + 1);
        } else if (no.left.type !== "Identifier") this.expressao(no.left, prof + 1);
        this.expressao(no.right, prof + 1, no.left.type === "Identifier" ? no.left.name : undefined);
        return;
      case "UpdateExpression":
        if (no.argument.type === "Identifier" && !this.ehLocal(no.argument.name)) {
          this.inserir(no.start, `(__r.k(${texto(no.argument.name)}),`, false, prof);
          this.inserir(no.end, ")", true, prof);
        }
        if (no.argument.type !== "Identifier") this.expressao(no.argument, prof + 1);
        return;
      case "Property":
        if (no.key.type !== "Identifier" || no.computed) this.expressao(no.key, prof + 1);
        if (no.shorthand && no.value.type === "Identifier" && !this.ehLocal(no.value.name)) this.inserir(no.value.start, `${no.value.name}:`, false, prof);
        this.expressao(no.value, prof + 1, no.key.type === "Identifier" ? no.key.name : undefined);
        return;
      default:
        for (const filho of filhos(no)) this.expressao(filho, prof + 1);
    }
  }
}

/** O que o código usa (para o validador `usouSintaxe`): lido da árvore, não do texto. */
export function sintaxesDoPrograma(programa: Program, fonte: string): SintaxeJs[] {
  const achadas = new Set<SintaxeJs>();
  const andar = (no: AnyNode, pai: AnyNode | null) => {
    switch (no.type) {
      case "IfStatement":
        achadas.add("if");
        if (no.alternate) achadas.add(no.alternate.type === "IfStatement" ? "else-if" : "else");
        break;
      case "ForStatement":
        achadas.add("for");
        break;
      case "ForOfStatement":
        achadas.add("for-of");
        break;
      case "ForInStatement":
        achadas.add("for-in");
        break;
      case "WhileStatement":
        achadas.add("while");
        break;
      case "DoWhileStatement":
        achadas.add("do-while");
        break;
      case "SwitchStatement":
        achadas.add("switch");
        break;
      case "BreakStatement":
        achadas.add("break");
        break;
      case "FunctionDeclaration":
      case "FunctionExpression":
        achadas.add("funcao");
        break;
      case "ArrowFunctionExpression":
        achadas.add("arrow");
        break;
      case "ReturnStatement":
        achadas.add("return");
        break;
      case "TemplateLiteral":
        if (pai?.type !== "TaggedTemplateExpression") achadas.add("template");
        break;
      case "VariableDeclaration":
        achadas.add(no.kind === "using" || no.kind === "await using" ? "const" : no.kind);
        break;
      case "ClassDeclaration":
      case "ClassExpression":
        achadas.add("classe");
        break;
      case "ConditionalExpression":
        achadas.add("ternario");
        break;
      case "ArrayExpression":
        achadas.add("array");
        break;
      case "ObjectExpression":
        achadas.add("objeto");
        break;
      case "ObjectPattern":
      case "ArrayPattern":
        achadas.add("desestruturacao");
        break;
      case "SpreadElement":
        achadas.add("spread");
        break;
      case "LogicalExpression":
        if (no.operator === "&&") achadas.add("e-logico");
        if (no.operator === "||") achadas.add("ou-logico");
        break;
      case "UnaryExpression":
        if (no.operator === "!") achadas.add("nao-logico");
        if (no.operator === "typeof") achadas.add("typeof");
        break;
      case "BinaryExpression":
        if (no.operator === "===" || no.operator === "!==") achadas.add("igualdade-estrita");
        if (no.operator === "==" || no.operator === "!=") achadas.add("igualdade-solta");
        if (["<", ">", "<=", ">="].includes(no.operator)) achadas.add("comparacao");
        break;
      case "UpdateExpression":
        achadas.add("incremento");
        break;
      case "AssignmentExpression":
        if (no.operator !== "=") achadas.add("atribuicao-composta");
        break;
      case "TryStatement":
        achadas.add("try");
        break;
      case "ThrowStatement":
        achadas.add("throw");
        break;
      case "CallExpression":
        if (no.callee.type === "MemberExpression" && !no.callee.computed && no.callee.property.type === "Identifier") {
          const metodo = no.callee.property.name;
          achadas.add(`metodo:${metodo}`);
          if (metodo === "log" && no.callee.object.type === "Identifier" && no.callee.object.name === "console") achadas.add("console-log");
        }
        break;
      default:
        break;
    }
    for (const filho of filhos(no)) andar(filho, no);
  };
  andar(programa, null);
  if (/\/\/|\/\*/.test(fonte)) {
    // Confirma que é comentário de verdade (e não "//" dentro de um texto).
    const comentarios: Comment[] = [];
    try {
      parse(fonte, { ...OPCOES_ACORN, onComment: comentarios });
    } catch {
      /* já lido antes */
    }
    if (comentarios.length) achadas.add("comentario");
  }
  return [...achadas];
}

/** Sintaxes usadas num código (lista vazia se não der para ler). */
export function sintaxesUsadas(fonte: string): SintaxeJs[] {
  const lido = analisarCodigo(fonte);
  return lido.ok ? sintaxesDoPrograma(lido.programa, fonte) : [];
}

/**
 * Instrumenta uma entrada (do Console ou do Snippet). `prefixo` deixa os ids
 * de escopo únicos entre entradas da mesma sessão.
 */
export function instrumentar(fonteOriginal: string, opcoes: { origem: "console" | "snippet" | "teste"; prefixo: string }): CodigoInstrumentado | FalhaInstrumentacao {
  const fonte = opcoes.origem === "console" ? fonteDoConsole(fonteOriginal) : fonteOriginal;
  const lido = analisarCodigo(fonte);
  if (!lido.ok) return { ok: false, erro: lido.erro, naoSuportado: false };
  const inst = new Instrumentador(fonte, opcoes.prefixo);
  inst.programa(lido.programa);
  if (inst.naoSuportado) return { ok: false, erro: inst.naoSuportado, naoSuportado: true };
  return { ok: true, codigo: inst.aplicar(), fonte, sintaxes: sintaxesDoPrograma(lido.programa, fonte), fontes: inst.fontes };
}

/*
 * Os erros do Python no formato do executor (ErroExecucao), lidos do
 * traceback que o Pyodide devolve, e a explicação em linguagem de leigo
 * (como o dicionário de erros do JavaScript, src/motor/executor/erros.ts).
 * A mensagem original vem primeiro: é ela que aparece no Python de verdade.
 */
import type { ExplicacaoErro } from "../../executor/erros";
import type { ErroExecucao } from "../../executor/tipos";

/** O nome do arquivo do programa no traceback (as linhas do aluno). */
export const ARQUIVO_DO_PROGRAMA = "<programa>";

const ERROS_DE_SINTAXE = new Set(["SyntaxError", "IndentationError", "TabError"]);

/**
 * Lê o traceback: a última linha é "NomeDoErro: mensagem"; a linha do
 * programa é a do último `File "<programa>", line N` (as outras são do
 * próprio Pyodide, por dentro).
 */
export function erroDoTraceback(texto: string): ErroExecucao {
  const linhas = texto.split("\n").map((linha) => linha.trimEnd()).filter((linha) => linha.trim());
  const ultima = linhas[linhas.length - 1] ?? "";
  const casou = /^([A-Za-z_][\w.]*)(?::\s?(.*))?$/.exec(ultima.trim());
  const nome = casou?.[1]?.split(".").pop() ?? "Error";
  const mensagem = casou ? (casou[2] ?? "") : ultima.trim();
  let linha: number | null = null;
  const local = new RegExp(`File "${ARQUIVO_DO_PROGRAMA.replace(/[<>]/g, "\\$&")}", line (\\d+)`, "g");
  for (const achado of texto.matchAll(local)) linha = Number(achado[1]);
  return { tipo: ERROS_DE_SINTAXE.has(nome) ? "sintaxe" : "execucao", nome, mensagem, linha, coluna: null };
}

type Entrada = { nome: string; padrao?: RegExp; explicar: (grupos: string[]) => ExplicacaoErro };

const ENTRADAS: Entrada[] = [
  {
    nome: "NameError",
    padrao: /^name '(.+)' is not defined/,
    explicar: ([nome]) => ({
      titulo: "Nome desconhecido",
      explicacao: `O Python não conhece nada chamado "${nome}". Ou a variável ainda não recebeu valor, ou o nome está escrito diferente.`,
      dica: "Confira as letras e as maiúsculas. Se era para ser um texto, faltaram as aspas?",
    }),
  },
  {
    nome: "SyntaxError",
    padrao: /^expected ':'/,
    explicar: () => ({
      titulo: "Faltaram os dois-pontos",
      explicacao: "No Python, linhas como if, for, while e def terminam com dois-pontos, e o bloco de dentro vem embaixo, com recuo.",
      dica: "Olhe o fim da linha apontada. Tem o : no final?",
    }),
  },
  {
    nome: "SyntaxError",
    explicar: () => ({
      titulo: "Erro de escrita",
      explicacao: "O Python não conseguiu ler o programa: alguma coisa está fora do lugar (parêntese, aspas, vírgula).",
      dica: "Comece pela linha apontada e confira se cada parêntese e cada aspas abre e fecha.",
    }),
  },
  {
    nome: "IndentationError",
    explicar: () => ({
      titulo: "Recuo fora do lugar",
      explicacao: "No Python, o recuo (os espaços no começo da linha) diz o que fica dentro de um bloco. Um recuo a mais ou a menos muda o programa.",
      dica: "As linhas do mesmo bloco começam na mesma coluna?",
    }),
  },
  {
    nome: "TypeError",
    padrao: /can only concatenate str/,
    explicar: () => ({
      titulo: "Texto com número",
      explicacao: "O Python não junta texto e número com +. Ele não adivinha: você escolhe.",
      dica: "Use str(numero) para virar texto, ou separe com vírgula no print.",
    }),
  },
  {
    nome: "ZeroDivisionError",
    explicar: () => ({
      titulo: "Divisão por zero",
      explicacao: "Dividir por zero não dá um número. O Python para o programa em vez de inventar um resultado.",
      dica: "De onde veio o zero que está embaixo da divisão?",
    }),
  },
];

/** A explicação de um erro do Python (null: erro sem explicação própria; a mensagem original basta). */
export function explicarErroPython(erro: Pick<ErroExecucao, "nome" | "mensagem">): ExplicacaoErro | null {
  for (const entrada of ENTRADAS) {
    if (entrada.nome !== erro.nome) continue;
    if (!entrada.padrao) return entrada.explicar([]);
    const casou = entrada.padrao.exec(erro.mensagem);
    if (casou) return entrada.explicar(casou.slice(1));
  }
  return null;
}

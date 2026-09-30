/*
 * Dicionário dos erros de iniciante: a mensagem original do navegador vem
 * primeiro (é ela que o jogador vai ver no Chrome de verdade) e, embaixo, a
 * explicação em linguagem de leigo. Os padrões cobrem as mensagens do V8
 * (Chrome, Edge, Node), do SpiderMonkey (Firefox) e do JavaScriptCore
 * (Safari), porque o código roda no navegador de quem joga.
 */
import type { ErroExecucao } from "./tipos";

export type ExplicacaoErro = {
  /** O nome do erro em português, curto. */
  titulo: string;
  /** O que aconteceu, para quem nunca programou. */
  explicacao: string;
  /** Por onde começar a consertar (pergunta, não resposta). */
  dica?: string;
};

type Entrada = {
  nome: string;
  padroes: RegExp[];
  explicar: (grupos: string[]) => ExplicacaoErro;
};

const q = (nome: string | undefined) => (nome ? `"${nome}"` : "esse nome");

const ENTRADAS: Entrada[] = [
  {
    nome: "ReferenceError",
    padroes: [/^(?:Can't find variable: )?(\S+) is not defined$/, /^Can't find variable: (\S+)$/],
    explicar: ([nome]) => ({
      titulo: "Nome desconhecido",
      explicacao: `O JavaScript não conhece nada chamado ${q(nome)}. Ou a variável ainda não foi criada (com let ou const), ou o nome está escrito diferente.`,
      dica: "Confira as letras e as maiúsculas. Se era para ser um texto, faltaram as aspas?",
    }),
  },
  {
    nome: "ReferenceError",
    padroes: [/^Cannot access '(.+)' before initialization$/, /^can't access lexical declaration [`'"](.+?)[`'"] before initialization$/, /^Cannot access uninitialized variable\.?$/],
    explicar: ([nome]) => ({
      titulo: "Usou antes de criar",
      explicacao: `A linha usa ${q(nome)} antes da linha que cria essa variável. O programa roda de cima para baixo.`,
      dica: "Qual linha precisa vir primeiro?",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/^Assignment to constant variable\.?$/, /^invalid assignment to const [`'"]?(.+?)[`'"]?$/, /^Attempted to assign to readonly property\.?$/],
    explicar: ([nome]) => ({
      titulo: "const não troca de valor",
      explicacao: `${nome ? `"${nome}"` : "Essa variável"} foi criada com const, e uma const guarda o mesmo valor para sempre.`,
      dica: "Se o valor precisa mudar, com que palavra a variável devia ser criada?",
    }),
  },
  {
    nome: "TypeError",
    padroes: [
      /^Cannot read properties of (undefined|null) \(reading '(.+)'\)$/,
      /^can't access property "(.+)", (.+) is (undefined|null)$/,
      /^(\S+) is (undefined|null)$/,
      /^(undefined|null) is not an object \(evaluating '(.+)'\)$/,
    ],
    explicar: () => ({
      titulo: "Ler dentro de algo vazio",
      explicacao: "O código tentou pegar um campo (o que vem depois do ponto) de algo que é undefined ou null, ou seja, de nada.",
      dica: "O que vem antes do ponto tem mesmo um valor nessa hora? Confira o nome e se a lista ou o objeto tem esse item.",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/^Cannot set properties of (undefined|null)/, /^can't assign to property/],
    explicar: () => ({
      titulo: "Escrever dentro de algo vazio",
      explicacao: "O código tentou guardar um campo dentro de algo que é undefined ou null.",
      dica: "O objeto antes do ponto foi criado?",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/^(.+) is not a function/],
    explicar: ([nome]) => ({
      titulo: "Isso não é uma função",
      explicacao: `Os parênteses () mandam rodar uma função, mas ${q(nome)} não é uma função${nome?.includes(".") ? ": o que vem antes do ponto não tem esse método" : ""}.`,
      dica: nome?.includes(".") ? "O valor antes do ponto é do tipo que você imagina (uma lista, um texto)?" : "O nome está certo? Essa função foi criada antes?",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/is not iterable/, /is not a valid iterable/],
    explicar: () => ({
      titulo: "Não dá para percorrer isso",
      explicacao: "O for...of (ou o ...) só passa por coisas que têm itens, como listas e textos. O valor usado aqui não tem.",
      dica: "O que está depois do of é mesmo uma lista?",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/^Cannot convert undefined or null to object$/, /^can't convert (undefined|null) to object$/],
    explicar: () => ({
      titulo: "undefined ou null no lugar de um objeto",
      explicacao: "Uma função que trabalha com objetos recebeu undefined ou null.",
    }),
  },
  {
    nome: "TypeError",
    padroes: [/^Class constructor (\S+) cannot be invoked without 'new'$/],
    explicar: ([nome]) => ({ titulo: "Classe sem new", explicacao: `${q(nome)} é uma classe: para criar um objeto com ela, escreva new antes.` }),
  },
  {
    nome: "RangeError",
    padroes: [/^Maximum call stack size exceeded$/, /^too much recursion$/],
    explicar: () => ({
      titulo: "Função que chama ela mesma sem parar",
      explicacao: "Uma função chamou ela mesma (ou outra que chama de volta) tantas vezes que a pilha de chamadas encheu.",
      dica: "Onde a função devia parar de chamar ela mesma? Esse caso chega a acontecer?",
    }),
  },
  {
    nome: "RangeError",
    padroes: [/^Invalid array length$/, /^invalid array length$/],
    explicar: () => ({ titulo: "Tamanho de lista impossível", explicacao: "Uma lista não pode ter tamanho negativo, quebrado ou gigante." }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Identifier '(.+)' has already been declared$/, /^redeclaration of (?:let|const|class) (.+)$/, /^Cannot declare a (?:let|const) variable twice: '(.+)'\.?$/],
    explicar: ([nome]) => ({
      titulo: "Criou a mesma variável duas vezes",
      explicacao: `O mesmo trecho de código cria ${q(nome)} duas vezes com let ou const.`,
      dica: "Para mudar o valor, basta usar o nome com =, sem o let de novo.",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Missing initializer in const declaration$/, /^missing = in const declaration$/, /^Unexpected token '?;'?\. const declared variable/],
    explicar: () => ({ titulo: "const sem valor", explicacao: "Uma const precisa receber o valor na mesma linha em que é criada: const nome = valor." }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Unexpected end of input$/, /^missing \} (?:after|in)/, /^Unexpected end of script$/, /^expected expression, got end of script$/],
    explicar: () => ({
      titulo: "Faltou fechar alguma coisa",
      explicacao: "O código acabou antes da hora: algum parêntese (, chave { ou colchete [ abriu e não fechou.",
      dica: "Conte os que abrem e os que fecham. Todo { tem o seu }?",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Invalid or unexpected token$/, /^unterminated string literal$/, /^Unterminated string literal$/, /^Unexpected EOF$/],
    explicar: () => ({
      titulo: "Texto sem fechar ou símbolo estranho",
      explicacao: "Tem um texto que abriu aspas e não fechou, ou um símbolo que o JavaScript não reconhece (às vezes uma aspa curva copiada de outro lugar).",
      dica: "Toda aspa que abre fecha com o mesmo tipo de aspa?",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^missing \) after argument list$/, /^missing \) after/, /^Unexpected token '?\{'?\. Expected '\)'/],
    explicar: () => ({
      titulo: "Faltou um )",
      explicacao: "Uma chamada de função abriu parêntese e o JavaScript esperava o ) antes do que veio.",
      dica: "Entre dois valores dentro dos parênteses precisa de vírgula. Faltou vírgula ou o )?",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Unexpected (identifier|string|number)(?: '(.+)')?$/, /^unexpected token: (identifier|string literal|numeric literal)/],
    explicar: () => ({
      titulo: "Faltou algo entre duas coisas",
      explicacao: "Apareceu um nome, um texto ou um número colado em outro sem nada no meio.",
      dica: "Faltou um +, uma vírgula ou um ponto e vírgula ali?",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Invalid left-hand side in assignment$/, /^invalid assignment left-hand side$/, /^Left side of assignment is not a reference\.?$/],
    explicar: () => ({
      titulo: "O = do lado errado",
      explicacao: "Um = só sabe guardar um valor dentro de uma variável, com o nome da variável à esquerda. Para comparar dois valores, o sinal é ===.",
      dica: "Era para guardar ou para comparar?",
    }),
  },
  {
    nome: "SyntaxError",
    padroes: [/^Unexpected token '?(.+?)'?$/, /^unexpected token: '?(.+?)'?$/, /^Unexpected token (.+)$/],
    explicar: ([simbolo]) => ({
      titulo: "Símbolo no lugar errado",
      explicacao: `O JavaScript leu ${simbolo ? `"${simbolo}"` : "um símbolo"} num lugar onde não esperava. Normalmente o problema está logo antes dele.`,
      dica: "Olhe o que vem antes na mesma linha (ou no fim da linha de cima): falta ou sobra alguma coisa?",
    }),
  },
];

const GENERICOS: Record<string, ExplicacaoErro> = {
  ReferenceError: { titulo: "Nome desconhecido", explicacao: "O código usou um nome que o JavaScript não conhece." },
  TypeError: { titulo: "Tipo errado", explicacao: "O código tentou fazer com um valor algo que esse tipo de valor não faz." },
  SyntaxError: {
    titulo: "Erro de escrita",
    explicacao: "O JavaScript não conseguiu nem ler o código: alguma coisa está escrita fora das regras da linguagem.",
    dica: "Olhe a linha indicada e a de cima.",
  },
  RangeError: { titulo: "Valor fora do permitido", explicacao: "Um número passou do limite que a operação aceita." },
};

/** A explicação de leigo de um erro (sempre existe uma). */
export function explicarErro(erro: ErroExecucao): ExplicacaoErro {
  if (erro.tipo === "limite-passos") {
    return {
      titulo: "Loop que nunca termina?",
      explicacao:
        "O programa repetiu tantas vezes que o jogo parou ele, para a aba não travar. Quase sempre é um laço cuja condição nunca fica falsa.",
      dica: "Dentro do laço, alguma coisa muda para a condição um dia ficar falsa? No Chrome de verdade, um loop assim trava a aba.",
    };
  }
  if (erro.tipo === "limite-tempo") {
    return {
      titulo: "Demorou demais",
      explicacao: "O programa rodou por tempo demais e o jogo parou ele, para a aba não travar.",
      dica: "Tem algum laço que nunca termina ou que repete muito mais vezes do que devia?",
    };
  }
  if (erro.tipo === "nao-suportado") {
    return { titulo: "Ainda não roda aqui", explicacao: `Isso funciona no Chrome, mas o jogo ainda não roda: ${erro.mensagem}` };
  }
  if (!erro.nome) {
    return {
      titulo: "Erro lançado pelo programa",
      explicacao: "O próprio programa lançou esse erro com throw, com um valor que não é um objeto de erro.",
    };
  }
  for (const entrada of ENTRADAS) {
    if (entrada.nome !== erro.nome) continue;
    for (const padrao of entrada.padroes) {
      const achado = padrao.exec(erro.mensagem.trim());
      if (achado) return entrada.explicar(achado.slice(1));
    }
  }
  if (GENERICOS[erro.nome]) return GENERICOS[erro.nome];
  return {
    titulo: "Erro lançado pelo programa",
    explicacao: `O programa parou com um erro do tipo ${erro.nome}. Se foi o seu código que lançou (com throw), a mensagem é a que você escreveu.`,
  };
}

/** A primeira linha do erro como o Console escreve: "Uncaught TypeError: ...". */
export function textoDoErro(erro: ErroExecucao): string {
  if (erro.tipo === "limite-passos" || erro.tipo === "limite-tempo" || erro.tipo === "nao-suportado") return erro.mensagem;
  return `Uncaught ${erro.nome ? `${erro.nome}: ` : ""}${erro.mensagem}`;
}

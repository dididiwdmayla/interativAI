/*
 * Depuração, U5, fase 2: o CHAMADO 1, no formato contrato (guia, seção 31).
 * Seu Tonho, do Mercadinho Estrela, tem um programa que fecha o estoque do
 * dia e "às vezes dá errado, não sei quando". É um trabalho de manutenção:
 * o aluno reproduz, investiga com o depurador, diz a causa antes de
 * consertar (cartões com distrações), conserta sem quebrar o resto e entrega
 * o relatório do conserto.
 *
 * O DEFEITO: nos dias com entrega, a quantidade chega digitada como texto
 * ("4") e o + junta em vez de somar: feijao fica "64". Dias só de venda
 * fecham certo, por isso o defeito parece "às vezes".
 * O PEDIDO (partes do cliente): dizer a causa antes de consertar (causa), o
 * fechamento certo (fecha) e o relatório do conserto (relatorio). O PROCESSO:
 * reproduzir o defeito e os casos de teste do aluno.
 * A MUDANÇA (depois do conserto): um produto que não está no estoque virava
 * NaN no resultado. A parte nova toma o lugar de fecha e junta tudo: o que já
 * funcionava (casos escondidos antigos) e o produto desconhecido ignorado.
 *
 * Sem cena: o estoque é o próprio programa, com palco, console e testes.
 */
import type { FaseDesafio, Validador } from "@/conteudo/tipos";
import { linhasDoPlano } from "@/motor/plano/comentarios";
import { casosDe, FERRAMENTAS_INVESTIGACAO, SABE_DEPURACAO, SITE_DE_CONSOLE, soltarPonto } from "../chamados";

const CHAMADAS = [
  'const segunda = fecharDia({ arroz: 10, feijao: 6 }, [{ codigo: "arroz", tipo: "venda", quantidade: 3 }]);',
  'const sexta = fecharDia({ arroz: 10, feijao: 6 }, [{ codigo: "feijao", tipo: "entrega", quantidade: "4" }]);',
].join("\n");

/** O código que o cliente entregou, com o defeito. */
export const CODIGO_COM_DEFEITO = [
  "function fecharDia(estoque, movimentos) {",
  "  for (const mov of movimentos) {",
  '    if (mov.tipo === "venda") {',
  "      estoque[mov.codigo] = estoque[mov.codigo] - mov.quantidade;",
  "    } else {",
  "      estoque[mov.codigo] = estoque[mov.codigo] + mov.quantidade;",
  "    }",
  "  }",
  "  return estoque;",
  "}",
  CHAMADAS,
].join("\n");

/** O conserto da causa: a quantidade vira número antes da conta. */
export const CODIGO_CONSERTADO = [
  "function fecharDia(estoque, movimentos) {",
  "  for (const mov of movimentos) {",
  "    const quantidade = Number(mov.quantidade);",
  '    if (mov.tipo === "venda") {',
  "      estoque[mov.codigo] = estoque[mov.codigo] - quantidade;",
  "    } else {",
  "      estoque[mov.codigo] = estoque[mov.codigo] + quantidade;",
  "    }",
  "  }",
  "  return estoque;",
  "}",
  CHAMADAS,
].join("\n");

/** O depois da mudança: produto que não está no estoque fica de fora. */
const CORPO_DEPOIS = [
  "function fecharDia(estoque, movimentos) {",
  "  for (const mov of movimentos) {",
  "    if (estoque[mov.codigo] !== undefined) {",
  "      const quantidade = Number(mov.quantidade);",
  '      if (mov.tipo === "venda") {',
  "        estoque[mov.codigo] = estoque[mov.codigo] - quantidade;",
  "      } else {",
  "        estoque[mov.codigo] = estoque[mov.codigo] + quantidade;",
  "      }",
  "    }",
  "  }",
  "  return estoque;",
  "}",
  CHAMADAS,
].join("\n");

/** Os casos escondidos de antes: o que já funcionava e o defeito. */
type Casos = Parameters<typeof casosDe>[1];
export const CASOS_FECHA: Casos = [
  [[{ arroz: 10 }, [{ codigo: "arroz", tipo: "venda", quantidade: 3 }]], { arroz: 7 }],
  [[{ arroz: 10 }, [{ codigo: "arroz", tipo: "entrega", quantidade: 5 }]], { arroz: 15 }],
  [[{ arroz: 10 }, [{ codigo: "arroz", tipo: "entrega", quantidade: "5" }]], { arroz: 15 }],
  [
    [
      { arroz: 10, feijao: 6 },
      [
        { codigo: "arroz", tipo: "venda", quantidade: 3 },
        { codigo: "feijao", tipo: "entrega", quantidade: "4" },
        { codigo: "arroz", tipo: "entrega", quantidade: "2" },
        { codigo: "arroz", tipo: "venda", quantidade: 1 },
      ],
    ],
    { arroz: 8, feijao: 10 },
  ],
  [[{ arroz: 10 }, []], { arroz: 10 }],
  [[{ arroz: 4 }, [{ codigo: "arroz", tipo: "venda", quantidade: 4 }]], { arroz: 0 }],
];

/** Os casos da mudança: produto fora do estoque, venda ou entrega. */
export const CASOS_DESCONHECIDO: Casos = [
  [[{ arroz: 10 }, [{ codigo: "sal", tipo: "venda", quantidade: 2 }]], { arroz: 10 }],
  [
    [
      { arroz: 10 },
      [
        { codigo: "sal", tipo: "entrega", quantidade: "2" },
        { codigo: "arroz", tipo: "venda", quantidade: 1 },
      ],
    ],
    { arroz: 9 },
  ],
  [
    [
      { arroz: 10, feijao: 6 },
      [
        { codigo: "feijao", tipo: "venda", quantidade: 6 },
        { codigo: "x9", tipo: "venda", quantidade: 1 },
      ],
    ],
    { arroz: 10, feijao: 0 },
  ],
];

/** O relatório do conserto, como o botão "Levar o plano pro código" o escreve no topo do Snippet. */
const PLANO_RELATORIO = {
  modo: "agrupar" as const,
  problema: "Relatório do conserto",
  grupos: [
    { id: "errado", titulo: "O que estava errado" },
    { id: "achado", titulo: "Como foi achado" },
    { id: "testado", titulo: "Como foi testado" },
  ],
  cartoes: [
    { id: "causa-texto", texto: "A quantidade da entrega chega como texto e o + junta em vez de somar", grupo: "errado" },
    { id: "causa-leitor", texto: "O leitor de código de barras do caixa lê errado", sobra: true as const },
    { id: "causa-venda", texto: "A venda tira mais do que devia do estoque", sobra: true as const },
    { id: "causa-caderno", texto: "O caderno do Seu Tonho está com as contas erradas", sobra: true as const },
    { id: "achou-comparar", texto: "Comparei o dia que fecha certo com o dia da entrega que falhava", grupo: "achado" },
    { id: "achou-observar", texto: "Parei na linha da conta e observei o tipo da quantidade", grupo: "achado", depoisDe: ["achou-comparar"] },
    { id: "achou-chute", texto: "Troquei sinais no código até o número parecer certo", sobra: true as const },
    { id: "testou-novo", texto: "Rodei o dia da entrega digitada e o estoque fechou certo", grupo: "testado" },
    { id: "testou-antigos", texto: "Rodei de novo os dias antigos, só com venda e com entrega em número", grupo: "testado", depoisDe: ["testou-novo"] },
    { id: "testou-so-um", texto: "Testei só o dia que tinha falhado", sobra: true as const },
  ],
};

const BLOCO_RELATORIO = linhasDoPlano(PLANO_RELATORIO, {
  listas: { errado: ["causa-texto"], achado: ["achou-comparar", "achou-observar"], testado: ["testou-novo", "testou-antigos"] },
}).join("\n");

/** O diagnóstico feito: a causa certa no relatório e nenhuma das hipóteses erradas. O conserto só vale depois dele. */
const CAUSA_ESCOLHIDA: Validador = {
  tipo: "todos",
  validadores: [
    { tipo: "passoNoPlano", passo: "causa-texto", grupo: "errado" },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-leitor" } },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-venda" } },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-caderno" } },
  ],
};

const CODIGO_DEPOIS_COM_RELATORIO = `${BLOCO_RELATORIO}\n\n${CORPO_DEPOIS}`;

export const FASE_DEPURACAO_U5_F2: FaseDesafio = {
  id: "logica-depuracao-u5-f2",
  tipo: "desafio",
  unidadeId: "logica-depuracao-u5",
  titulo: "O estoque que nunca fecha",
  conceitos: ["reproduzir-o-defeito", "causa-raiz"],
  revisa: [...SABE_DEPURACAO, "reproduzir-o-defeito", "causa-raiz", "tipo-js", "typeof-js", "conversao-number", "casos-de-borda", "plano-comentado"],
  prerequisitos: [...SABE_DEPURACAO, "reproduzir-o-defeito", "causa-raiz"],
  areas: ["plano", "snippet", "palco", "testes"],
  plano: PLANO_RELATORIO,
  testes: {
    funcao: "fecharDia",
    parametros: ["estoque", "movimentos"],
    inicial: [{ entrada: '{ arroz: 10 }, [{ codigo: "arroz", tipo: "venda", quantidade: 3 }]', esperado: "{ arroz: 7 }" }],
  },
  usaFerramentas: [...FERRAMENTAS_INVESTIGACAO, "quadro-de-passos", "plano-no-codigo", "casos-de-teste"],
  siteAlvo: SITE_DE_CONSOLE,
  programa: { snippet: { nome: "fechamento.js", codigoInicial: CODIGO_COM_DEFEITO } },
  introducao: [
    { texto: "Chegou chamado! Seu Tonho, do Mercadinho Estrela, tem um programa que não fecha o estoque direito.", expressao: "comemorando" },
    { texto: "Eu sou o colega da mesa ao lado: pergunto e lembro do processo. Primeiro escutar, depois reproduzir, dizer a causa e só então consertar.", expressao: "curioso" },
  ],
  contrato: {
    cliente: "seu-tonho",
    projeto: "Conserto do fechamento do estoque",
    fimDeIlha: false,
    briefing: [
      { texto: "Boa tarde! Sou o Tonho, do Mercadinho Estrela. Tenho um programa que fecha o estoque no fim do dia, mas ele anda me aprontando.", expressao: "feliz" },
      { texto: "O estoque nunca fecha direito! Às vezes dá certo, às vezes não, e eu não sei quando. Um dia o arroz sobra, no outro o feijão vira um monte.", expressao: "preocupado" },
      { texto: "O moço que fez o programa foi embora e não deixou nada escrito. Só sei que o caderno e o computador não batem.", expressao: "pensativo" },
      { texto: "Ah, o fornecedor digita as entregas no celular. Às vezes vem uma quantidade esquisita, mas eu achei que era coisa dele.", expressao: "preocupado" },
      { texto: "Antes de mexer em qualquer coisa, quero saber o que causou o defeito. E no fim, um papel curto: o que era, como achou e como testou.", expressao: "pensativo" },
      { texto: "Meu genro falou de trocar tudo por planilha, ler código de barras e fazer promoção automática. Fica pra outra hora, tá?", expressao: "feliz" },
    ],
    documento: {
      titulo: "Chamado do Seu Tonho",
      paragrafos: [
        "Todo dia, depois do caixa, o programa recebe o estoque da manhã (cada produto com sua quantidade) e a lista de movimentos do dia: vendas e entregas.",
        "Cada venda tira do estoque do produto. Cada entrega do fornecedor soma ao estoque. O resultado é o estoque que sobrou, produto por produto.",
        'As entregas são digitadas no celular pelo moço do fornecedor, então a quantidade pode chegar escrita entre aspas, como "24".',
        "Antes de mexer no código, quero saber a causa do defeito. No fim, quero um papel curto: o que estava errado, como foi achado e como foi testado.",
        "Trocar o sistema por planilha, ler código de barras e fazer promoção automática ficam para depois.",
      ],
    },
    requisitos: {
      pergunta: "O que o Seu Tonho pediu de verdade?",
      cartoes: [
        {
          id: "causa",
          texto: "Antes de mexer no código, descobrir e dizer a ___ do defeito",
          parte: "causa",
          lacunas: [{ opcoes: ["causa", "culpa", "data"], correta: 0 }],
          porque: "Ele quer saber o que causou o defeito antes de qualquer conserto: a causa, não o culpado.",
        },
        {
          id: "fecha",
          texto: "No fechamento, a venda ___ do estoque e a entrega ___ ao estoque",
          parte: "fecha",
          lacunas: [
            { opcoes: ["tira", "soma", "zera"], correta: 0 },
            { opcoes: ["tira", "soma", "zera"], correta: 1 },
          ],
          porque: "É a regra do fechamento: venda tira, entrega soma, produto por produto, mesmo com a entrega digitada como texto.",
        },
        {
          id: "relatorio",
          texto: "No fim, um papel curto com o que estava errado, como foi achado e como foi ___",
          parte: "relatorio",
          lacunas: [{ opcoes: ["testado", "pintado", "vendido"], correta: 0 }],
          porque: "Ele pediu três coisas no papel: o que era, como achou e como testou.",
        },
        { id: "planilha", texto: "Trocar o programa por uma planilha", sobra: true, porque: "O genro sugeriu, mas Seu Tonho disse que fica para depois." },
        { id: "barras", texto: "Ler código de barras no caixa", sobra: true, porque: "Também ficou para depois. O chamado é consertar o fechamento." },
        { id: "promocao", texto: "Fazer promoção automática", sobra: true, porque: "Foi uma ideia solta do genro, não faz parte do chamado." },
        { id: "avisar", texto: "Avisar o fornecedor quando um produto acabar", sobra: true, porque: "Parece com o fechamento, mas ele nunca pediu esse aviso." },
      ],
    },
    mudanca: {
      depoisDe: ["fecha"],
      mensagem: [
        { texto: "Oi, Tonho de novo! Consertou, o caderno fechou! Mas olha: ontem apareceu NaN no resultado e eu nem sei o que é isso.", expressao: "preocupado" },
        { texto: "Foi uma venda de sal. Eu ainda não tinha cadastrado o sal no estoque, e o caixa vendeu mesmo assim.", expressao: "pensativo" },
        { texto: "Produto que não está no estoque, o programa ignora e fecha o resto normal, tá? O que já funcionava continua igualzinho!", expressao: "empolgado" },
      ],
      adendo:
        "Mensagem do Seu Tonho: venda ou entrega de um produto que não está no estoque deve ser ignorada. O produto não entra no resultado e os outros fecham normalmente, como antes.",
      novas: [{ parte: "fecha-e-ignora", substitui: "fecha" }],
    },
    entrega: {
      reacao: [
        { texto: "Agora sim! Até o que eu mudei no meio do caminho está no papel. Parece coisa de empresa grande.", expressao: "satisfeito" },
        { texto: "Amanhã o caderno e o computador vão bater. O café do fim do expediente é por minha conta!", expressao: "feliz" },
      ],
    },
  },
  partes: [
    {
      id: "reproduzir",
      descricao: "Reproduza o defeito: compare o dia só de venda com o dia da entrega e veja o tipo da quantidade",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "observou", expressao: "mov.tipo", valor: "venda" },
          { tipo: "observou", expressao: "mov.tipo", valor: "entrega" },
          { tipo: "observou", expressao: "typeof mov.quantidade", valor: "string" },
        ],
      },
      revisarEm: "logica-depuracao-u5-f1",
      pergunta: "Qual dia fecha certo e qual falha? O que muda entre as duas listas de movimentos?",
      solucaoDeTeste: [
        { tipo: "alternarPontoDeParada", linha: 3 },
        { tipo: "observar", expressao: "mov.tipo" },
        { tipo: "observar", expressao: "typeof mov.quantidade" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "causa",
      descricao: "Diagnóstico: escolha no relatório a causa raiz do defeito, entre as hipóteses, antes de consertar",
      validador: CAUSA_ESCOLHIDA,
      revisarEm: "logica-depuracao-u5-f1",
      pergunta: "Qual hipótese explica o dia da entrega falhar e o dia só de venda fechar certo?",
      solucaoDeTeste: [{ tipo: "porPasso", passo: "causa-texto", grupo: "errado" }],
    },
    {
      id: "fecha",
      descricao: "Depois do diagnóstico, o estoque fecha certo: venda tira, entrega soma, mesmo com a quantidade digitada como texto",
      validador: { tipo: "todos", validadores: [CAUSA_ESCOLHIDA, { tipo: "semErro" }, casosDe("fecharDia", CASOS_FECHA)] },
      revisarEm: "logica-depuracao-u4-f2",
      pergunta: "Você já disse a causa no relatório antes de mexer? E o dia que só tinha venda continua fechando igual?",
      solucaoDeTeste: [...soltarPonto(3), { tipo: "definirSnippet", codigo: CODIGO_CONSERTADO }, { tipo: "executarSnippet" }],
    },
    {
      id: "testes",
      descricao: "Seus casos de teste de fecharDia passam: venda, entrega em texto, vários movimentos e dia sem movimento",
      validador: {
        tipo: "casosDoAluno",
        minimo: 4,
        passando: true,
        incluir: [
          { args: [{ arroz: 10 }, [{ codigo: "arroz", tipo: "entrega", quantidade: "5" }]], esperado: { arroz: 15 }, rotulo: "a entrega digitada como texto" },
          { args: [{ arroz: 10 }, []], esperado: { arroz: 10 }, rotulo: "o dia sem nenhum movimento" },
        ],
      },
      revisarEm: "logica-resolvendo-problemas-u4-f1",
      pergunta: "Você já testou um dia sem nenhum movimento? E um com a entrega digitada entre aspas?",
      solucaoDeTeste: [
        { tipo: "escreverCaso", entrada: '{ arroz: 10 }, [{ codigo: "arroz", tipo: "venda", quantidade: 3 }]', esperado: "{ arroz: 7 }" },
        { tipo: "escreverCaso", entrada: '{ arroz: 10 }, [{ codigo: "arroz", tipo: "entrega", quantidade: "5" }]', esperado: "{ arroz: 15 }" },
        {
          tipo: "escreverCaso",
          entrada: '{ arroz: 10, feijao: 6 }, [{ codigo: "feijao", tipo: "entrega", quantidade: "4" }, { codigo: "arroz", tipo: "venda", quantidade: 2 }]',
          esperado: "{ arroz: 8, feijao: 10 }",
        },
        { tipo: "escreverCaso", entrada: "{ arroz: 10 }, []", esperado: "{ arroz: 10 }" },
        { tipo: "rodarCasos" },
      ],
    },
    {
      id: "relatorio",
      descricao: "O relatório do conserto está montado (o que estava errado, como foi achado e como foi testado) e no código",
      validador: { tipo: "todos", validadores: [{ tipo: "ordemValida" }, { tipo: "planoComentado" }] },
      revisarEm: "logica-resolvendo-problemas-u1-f3",
      pergunta: "Alguém que nunca viu o programa entende, só pelo relatório, o que estava errado e como você sabe que consertou?",
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "achou-comparar", grupo: "achado" },
        { tipo: "porPasso", passo: "achou-observar", grupo: "achado" },
        { tipo: "porPasso", passo: "testou-novo", grupo: "testado" },
        { tipo: "porPasso", passo: "testou-antigos", grupo: "testado" },
        { tipo: "levarPlanoProCodigo" },
      ],
    },
    {
      id: "fecha-e-ignora",
      descricao: "Produto fora do estoque é ignorado e o resto fecha certo, com tudo o que já funcionava e a causa já dita",
      validador: { tipo: "todos", validadores: [CAUSA_ESCOLHIDA, { tipo: "semErro" }, casosDe("fecharDia", [...CASOS_FECHA, ...CASOS_DESCONHECIDO])] },
      revisarEm: "logica-depuracao-u5-f1",
      pergunta: "O que o programa faz hoje com a venda de um produto que nunca esteve no estoque?",
      solucaoDeTeste: [{ tipo: "definirSnippet", codigo: CODIGO_DEPOIS_COM_RELATORIO }, { tipo: "executarSnippet" }],
    },
  ],
  conclusao: [
    { texto: "Chamado entregue! Você reproduziu, disse a causa antes de mexer, consertou sem quebrar o resto e ainda aguentou o segundo sintoma.", expressao: "comemorando" },
    { texto: "O relatório do conserto fica nos comentários do código: quem pegar o programa depois sabe o que era, como foi achado e como foi testado.", expressao: "apontando" },
  ],
  missaoDeCampo:
    "No Chrome, abra DevTools > Sources > Snippets, cole um programa seu com um defeito, marque um ponto de parada e use Watch para comparar um caso que funciona com um que falha.",
};

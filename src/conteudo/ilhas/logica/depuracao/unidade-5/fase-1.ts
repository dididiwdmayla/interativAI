/*
 * Chamado 1, aquecimento: o caixa do Mercadinho Estrela.
 *
 * O QUE ENSINA: reproduzir o defeito (um defeito que só aparece "às vezes"
 * se acha comparando um pedido que funciona com um que falha) e a causa raiz
 * (o sintoma é o total sem desconto; a causa é a condição que deixa de fora
 * os pedidos de 3 itens).
 * REVISÃO ESPAÇADA: pontos de parada e Observar (U2 e U4), o limite de uma
 * comparação e testar bordas.
 * POR QUE ESTA ORDEM: reproduzir antes de qualquer edição; separar sintoma
 * de causa antes de consertar; só então mexer. No sozinho, o frete repete o
 * método com outro defeito, e o conserto confere o desconto de novo (o
 * conserto do frete não pode quebrar o que já funcionava).
 */
import type { FasePratica, Validador } from "@/conteudo/tipos";
import type { DadosCena } from "@/motor/cena/modelo";
import { casosDe, curioso, enunciado, FERRAMENTAS_INVESTIGACAO, SABE_DEPURACAO, SITE_DE_CONSOLE, soltarPonto } from "../chamados";

const CODIGO_DESCONTO = [
  "function totalComDesconto(quantidade, preco) {",
  "  const bruto = quantidade * preco;",
  "  if (quantidade > 3) {",
  "    return bruto - 5;",
  "  }",
  "  return bruto;",
  "}",
].join("\n");
const CODIGO_FRETE = ["function frete(peso) {", "  if (peso > 10) {", "    return 0;", "  }", "  return 15;", "}"].join("\n");
const PEDIDOS = [
  "const segunda = totalComDesconto(5, 10);",
  'caixa.mostrar("R$ " + segunda);',
  "esperar(1000);",
  "const terca = totalComDesconto(3, 10);",
  'caixa.mostrar("R$ " + terca);',
  "esperar(1000);",
].join("\n");

/**
 * O caixa do Mercadinho Estrela: o balcão com a esteira e a cesta de compras
 * e a registradora, cujo visor mostra o total de cada pedido.
 */
const CENA_CAIXA: DadosCena = {
  id: "mercadinho-caixa",
  titulo: "O caixa do Mercadinho Estrela",
  ambiente: "mercadinho",
  periodo: "dia",
  duracaoMs: 4_000,
  cenario: [
    { peca: "parede", x: 0, y: 0, largura: 320, altura: 152 },
    { peca: "prateleira", x: 12, y: 28, largura: 80, altura: 30, variante: "potes" },
    { peca: "prateleira", x: 12, y: 70, largura: 80, altura: 30, variante: "paes" },
    { peca: "porta", x: 272, y: 70, largura: 40, altura: 82, variante: "vidro" },
    { peca: "piso", x: 0, y: 150, largura: 320, altura: 50 },
    { peca: "balcao", x: 104, y: 112, largura: 152, altura: 40, variante: "mercadinho" },
    { peca: "cesta", x: 114, y: 88, largura: 36, altura: 24 },
  ],
  dispositivos: [{ id: "caixa", tipo: "registradora", x: 178, y: 62, nome: "Visor do caixa" }],
  linhaDoTempo: [],
};
const CODIGO_INICIAL = [CODIGO_DESCONTO, CODIGO_FRETE, PEDIDOS].join("\n");

const DESCONTO_CERTO = CODIGO_DESCONTO.replace("quantidade > 3", "quantidade >= 3");
const FRETE_CERTO = CODIGO_FRETE.replace("peso > 10", "peso >= 10");
const FRETES = ["const leve = frete(12);", "const borda = frete(10);"].join("\n");
/** O visor do caixa mostra o total com desconto do pedido de 3 itens. */
const VISOR_CERTO: Validador = { tipo: "estadoNaCena", dispositivo: "caixa", propriedade: "texto", valor: "R$ 25", noTempo: 1_500 };

const CASOS_DESCONTO: [number[], number][] = [
  [[2, 10], 20],
  [[3, 10], 25],
  [[4, 10], 35],
  [[5, 10], 45],
  [[3, 20], 55],
  [[0, 10], 0],
];
const CASOS_FRETE: [number[], number][] = [
  [[9], 15],
  [[10], 0],
  [[11], 0],
  [[12], 0],
  [[0], 15],
];

export const FASE_DEPURACAO_U5_F1: FasePratica = {
  id: "logica-depuracao-u5-f1",
  tipo: "pratica",
  unidadeId: "logica-depuracao-u5",
  titulo: "O desconto que some",
  conceitos: ["reproduzir-o-defeito", "causa-raiz"],
  revisa: ["limite-da-comparacao", "comparacao-js", "if-js", "hipotese-de-bug", "observar-expressoes"],
  prerequisitos: SABE_DEPURACAO,
  usaFerramentas: [...FERRAMENTAS_INVESTIGACAO, "cena", "ficha-dispositivo", "velocidade-simulacao"],
  siteAlvo: SITE_DE_CONSOLE,
  programa: { snippet: { nome: "caixa.js", codigoInicial: CODIGO_INICIAL } },
  areas: ["cena", "snippet", "palco"],
  cena: CENA_CAIXA,
  introducao: [
    curioso("Chamado de verdade: o Mercadinho Estrela diz que o desconto de R$ 5 \"às vezes some\". Defeito vago assim pede um primeiro passo: reproduzir."),
    curioso("Reproduzir é achar um pedido que funciona e um que falha. O que muda entre os dois é a pista. Só depois a gente procura a causa."),
    curioso("O visor da registradora mostra para o cliente o total que o programa calcula. Toque nela para abrir a ficha."),
  ],
  conclusao: [curioso("Você reproduziu o defeito, separou o sintoma da causa raiz e consertou sem quebrar o resto. É assim que se atende um chamado.")],
  falaFinal: curioso("Agora o chamado grande: um cliente de verdade, um defeito vago e um conserto que não pode quebrar nada."),
  objetivos: [
    {
      id: "reproduzir-guiado",
      tipo: "previsao",
      modo: "guiado",
      enunciado: enunciado("Marque a linha 3, observe quantidade e compare os dois pedidos: o de segunda e o de terça."),
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "pausouNaLinha", linha: 3 },
          { tipo: "observou", expressao: "quantidade", valor: 5 },
          { tipo: "observou", expressao: "quantidade", valor: 3 },
        ],
      },
      previsao: {
        pergunta: "O defeito só aparece às vezes. O que fazer primeiro?",
        opcoes: ["Trocar sinais no código até o desconto voltar", "Achar um pedido que funciona e um que falha e comparar", "Reescrever a função inteira"],
        correta: 1,
        explicacao: "Reproduzir é comparar um caso que funciona com um que falha: a diferença entre as entradas é a pista.",
      },
      ajudas: {
        pergunta: "Em quais pedidos o desconto aparece, e em quais não?",
        dica: "Reproduzir o defeito é comparar um caso que funciona com um que falha, mudando uma coisa de cada vez.",
        linha: { alvo: "snippet", linhas: [14, 17], fala: "Dois pedidos: um com 5 itens e outro com 3." },
        solucao: {
          fala: "O ponto de parada na linha 3 mostra a quantidade de cada pedido, um depois do outro.",
          acoes: [
            { tipo: "alternarPontoDeParada", linha: 3 },
            { tipo: "observar", expressao: "quantidade" },
            { tipo: "executarSnippet" },
            { tipo: "controlarDepurador", controle: "retomar" },
          ],
        },
      },
      falaAoConcluir: curioso("Com 5 itens o desconto vem; com 3, não. O que muda entre os dois pedidos é a pista."),
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "alternarPontoDeParada", linha: 3 },
        { tipo: "observar", expressao: "quantidade" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "causa-guiado",
      tipo: "previsao",
      modo: "guiado",
      enunciado: enunciado("Estamos pausados no pedido de 3 itens. Observe quantidade > 3 e descubra a causa raiz."),
      validador: { tipo: "observou", expressao: "quantidade > 3", valor: false },
      previsao: {
        pergunta: "No pedido de 3 itens, quantidade > 3 dá false. Qual é a causa raiz do desconto sumir?",
        opcoes: ["O total ficou sem desconto", "O preço 10 está errado", "A condição deixa de fora justamente os pedidos de 3 itens"],
        correta: 2,
        explicacao: "Total sem desconto é o sintoma, o que o cliente vê. A causa raiz é a condição > 3, que não vale para 3.",
      },
      ajudas: {
        pergunta: "O que o cliente vê é a causa ou é o sintoma?",
        dica: "Causa raiz é a decisão no código que produz o erro; o resultado errado é só o sintoma.",
        linha: { alvo: "snippet", linhas: [3], fala: "A decisão do desconto está nesta linha." },
        solucao: { fala: "Observar compara a regra com a quantidade que está na pausa.", acoes: [{ tipo: "observar", expressao: "quantidade > 3" }] },
      },
      falaAoConcluir: curioso("O sintoma era o total sem desconto. A causa raiz: > 3 deixa o pedido de 3 itens de fora."),
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "observar", expressao: "quantidade > 3" },
      ],
    },
    {
      id: "conserto-guiado",
      tipo: "acao",
      modo: "guiado",
      enunciado: enunciado("Conserte a causa, não o sintoma: pedidos de 3 itens ou mais ganham R$ 5. Teste 2, 3 e 4 itens."),
      validador: { tipo: "todos", validadores: [{ tipo: "semErro" }, casosDe("totalComDesconto", CASOS_DESCONTO), VISOR_CERTO] },
      ajudas: {
        pergunta: "Qual comparação diz \"3 ou mais\"?",
        dica: "Trocar o resultado só do pedido de 3 itens conserta o sintoma; o conserto da causa muda a condição.",
        linha: { alvo: "snippet", linhas: [3], fala: "Esta condição é a causa raiz." },
        solucao: {
          fala: "A condição passa a aceitar 3 ou mais itens. O ponto de parada sai antes de rodar o conserto.",
          acoes: [...soltarPonto(3), { tipo: "definirSnippet", codigo: [DESCONTO_CERTO, CODIGO_FRETE, PEDIDOS].join("\n") }, { tipo: "executarSnippet" }],
        },
      },
      falaAoConcluir: curioso("Os casos escondidos pedem 2, 3, 4 e 5 itens: consertar a causa vale para todos, e consertar só o de 3 não."),
      solucaoDeTeste: [...soltarPonto(3), { tipo: "definirSnippet", codigo: [DESCONTO_CERTO, CODIGO_FRETE, PEDIDOS].join("\n") }, { tipo: "executarSnippet" }],
    },
    {
      id: "reproduzir-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: enunciado("O frete grátis também some às vezes. Chame frete(12) e frete(10), pause na linha 9 e observe peso e peso > 10."),
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "pausouNaLinha", linha: 9 },
          { tipo: "observou", expressao: "peso", valor: 12 },
          { tipo: "observou", expressao: "peso", valor: 10 },
          { tipo: "observou", expressao: "peso > 10", valor: false },
        ],
      },
      ajudas: {
        pergunta: "Que pesos funcionam e qual falha? O que muda entre eles?",
        dica: "Escreva as duas chamadas no fim do código, marque a linha 9 e use Retomar para ver a segunda.",
      },
      falaAoConcluir: curioso("Com 12 o frete é grátis e com 10, não. Mesma pista de antes: o limite ficou de fora."),
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: [DESCONTO_CERTO, CODIGO_FRETE, PEDIDOS, FRETES].join("\n") },
        { tipo: "alternarPontoDeParada", linha: 9 },
        { tipo: "observar", expressao: "peso" },
        { tipo: "observar", expressao: "peso > 10" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "conserto-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: enunciado("Conserte o frete grátis (10 kg ou mais) sem perder o desconto que já funciona. Os dois casos valem."),
      validador: { tipo: "todos", validadores: [{ tipo: "semErro" }, casosDe("frete", CASOS_FRETE), casosDe("totalComDesconto", CASOS_DESCONTO)] },
      ajudas: {
        pergunta: "Depois de mexer no frete, o desconto continua certo? Como você prova?",
        dica: "Mude só a causa do frete e rode de novo as duas funções: o conserto não pode quebrar o que funcionava.",
      },
      falaAoConcluir: curioso("Frete e desconto certos juntos: o conserto da causa não quebrou nada que funcionava."),
      solucaoDeTeste: [
        ...soltarPonto(9),
        { tipo: "definirSnippet", codigo: [DESCONTO_CERTO, FRETE_CERTO, PEDIDOS, FRETES].join("\n") },
        { tipo: "executarSnippet" },
      ],
    },
  ],
};

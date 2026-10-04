/*
 * Bancada da resolução de problemas: fases de LABORATÓRIO do motor de
 * composição de áreas (src/motor/composicao.ts), fora do currículo (só no
 * /lab/fases?fase=<id>). Um problema do começo ao fim, na mesma tela: o
 * plano (o quadro de passos), o código (o Snippet) e o palco da memória.
 * Modelo para a zona Resolvendo problemas e, depois, para a Ilha IA e os
 * projetos do Ofício. Ver o guia, seção 29.
 */
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import type { DadosOrdenar } from "@/motor/ordenar/modelo";
import type { Fase, FasePratica, Unidade } from "../tipos";

export const UNIDADE_BANCADA_RESOLVER: Unidade = {
  id: "lab-resolver-u1",
  ilha: "Laboratório",
  zona: "Bancada da resolução de problemas",
  numero: 1,
  titulo: "Resolver um problema inteiro",
  meta: { enunciado: "Testar a composição de áreas: o plano, o código e o palco na mesma tela, do plano à função pronta." },
  fases: ["lab-resolver-u1-f1"],
};

/** A média das notas: o problema da prática composta. */
export const PLANO_MEDIA: DadosOrdenar = {
  modo: "ordenar",
  problema: "Calcular a média das notas",
  cartoes: [
    { id: "vazia", texto: "Se não tiver nenhuma nota, devolver 0" },
    { id: "zerar", texto: "Começar a soma em zero" },
    { id: "somar", texto: "Somar cada nota na soma", depoisDe: ["zerar"] },
    { id: "dividir", texto: "Dividir a soma pela quantidade de notas", depoisDe: ["somar", "vazia"] },
    { id: "devolver", texto: "Devolver a média", depoisDe: ["dividir"] },
    { id: "ordenar", texto: "Pôr as notas em ordem", sobra: true },
  ],
};

const SOLUCAO_PLANO_MEDIA = ["vazia", "zerar", "somar", "dividir", "devolver"].map((passo) => ({ tipo: "porPasso" as const, passo }));

/** O plano depois da troca (a lista vazia depois da soma), como o "Levar o plano pro código" escreve. */
export const COMENTARIOS_MEDIA = [
  "// Plano: Calcular a média das notas",
  "// 1. Começar a soma em zero",
  "// 2. Se não tiver nenhuma nota, devolver 0",
  "// 3. Somar cada nota na soma",
  "// 4. Dividir a soma pela quantidade de notas",
  "// 5. Devolver a média",
].join("\n");

export const CODIGO_MEDIA = [
  "function media(notas) {",
  "  if (notas.length === 0) return 0;",
  "  let soma = 0;",
  "  for (const nota of notas) {",
  "    soma = soma + nota;",
  "  }",
  "  return soma / notas.length;",
  "}",
].join("\n");

export const FASE_DEMO_RESOLVER: FasePratica = {
  id: "lab-resolver-u1-f1",
  tipo: "pratica",
  unidadeId: "lab-resolver-u1",
  titulo: "A média das notas, do plano ao código",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  areas: ["plano", "snippet", "palco"],
  plano: PLANO_MEDIA,
  usaFerramentas: ["quadro-de-passos", "plano-no-codigo", "snippet", "console", "palco-memoria", "linha-do-tempo"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "media.js" } },
  introducao: [
    { texto: "Um problema inteiro: a média das notas da turma. Primeiro o plano, depois o código, tudo na mesma tela.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "planejar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Monte o plano: arraste os passos na ordem em que eles acontecem. Um cartão não faz parte.",
        toque: "Monte o plano: toque num passo e depois no lugar, na ordem em que eles acontecem. Um cartão não faz parte.",
      },
      validador: { tipo: "ordemValida" },
      ajudas: {
        pergunta: "Dá para dividir a soma antes de somar as notas?",
        dica: "Cada passo vem depois do que ele usa: a soma nasce em zero, recebe as notas e só então é dividida.",
        linha: { alvo: "ordenar", fala: "O plano mora aqui." },
        solucao: { fala: "Montei o plano na ordem das dependências.", acoes: SOLUCAO_PLANO_MEDIA },
      },
      falaAoConcluir: { texto: "Plano pronto! Repare que ele não fala de JavaScript: é o problema em passos pequenos.", expressao: "comemorando" },
      solucaoDeTeste: SOLUCAO_PLANO_MEDIA,
    },
    {
      id: "levar",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["plano-no-codigo"],
      enunciado: {
        mouse: "Clique em Levar pro código: o plano vira comentários no topo do Snippet.",
        toque: "Toque em Levar pro código: o plano vira comentários no topo do Snippet.",
      },
      validador: { tipo: "planoComentado" },
      ajudas: {
        pergunta: "Onde o plano ajuda mais: num papel do lado ou dentro do próprio código?",
        dica: "O botão escreve cada passo como um comentário (//), na sua ordem. Comentário não roda: é lembrete.",
        linha: { alvo: "ferramenta", ferramenta: "plano-no-codigo", fala: "O botão mora no alto do plano." },
        solucao: { fala: "Levei o plano: cada passo virou um comentário numerado.", acoes: [{ tipo: "levarPlanoProCodigo" }] },
      },
      falaAoConcluir: { texto: "O plano está no código! Cada comentário é um passo que ainda vai virar JavaScript.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "levarPlanoProCodigo" }],
    },
    {
      id: "acender",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: 'Clique no passo "Dividir a soma pela quantidade de notas" no plano: o comentário dele acende no código.',
        toque: 'Toque no passo "Dividir a soma pela quantidade de notas" no plano: o comentário dele acende no código.',
      },
      validador: { tipo: "evento", evento: "apontouPasso" },
      ajudas: {
        pergunta: "Com o plano no código, como achar onde cada passo mora?",
        dica: "Tocar num passo do plano acende a linha do comentário dele.",
        linha: { alvo: "ordenar", passo: "dividir", fala: "Este passo aqui." },
        solucao: { fala: "Acendi o comentário do passo de dividir.", acoes: [{ tipo: "verPassoNoCodigo", passo: "dividir" }] },
      },
      falaAoConcluir: { texto: "Plano e código ligados: o passo e o comentário são a mesma coisa em dois lugares.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "verPassoNoCodigo", passo: "dividir" }],
    },
    {
      id: "reordenar",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O plano já está no código. Se você trocar a ordem de dois passos no plano, o que acontece com os comentários?",
        opcoes: ["Trocam de ordem junto", "Ficam como estavam", "O código inteiro some"],
        correta: 0,
        explicacao: "O bloco de comentários acompanha o plano: só ele muda, o resto do código fica.",
      },
      enunciado: {
        mouse: "Leve a lista vazia para depois da soma em zero e olhe os comentários no código.",
        toque: "Leve a lista vazia para depois da soma em zero e olhe os comentários no código.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "passoAntes", passo: "zerar", antesDe: "vazia" },
          { tipo: "planoComentado" },
        ],
      },
      ajudas: {
        pergunta: "A lista vazia precisa vir antes de quê, de verdade?",
        dica: "Ela só precisa vir antes da divisão: depois da soma em zero também vale.",
        linha: { alvo: "ordenar", passo: "vazia", fala: "Mude este cartão de lugar." },
        solucao: { fala: "Troquei de lugar: os comentários acompanharam.", acoes: [{ tipo: "porPasso", passo: "vazia", posicao: 1 }] },
      },
      falaAoConcluir: { texto: "Os comentários mudaram junto, e o plano continua valendo: as duas ordens respeitam as dependências.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "porPasso", passo: "vazia", posicao: 1 },
      ],
    },
    {
      id: "programar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora escreva a função media(notas) embaixo do plano, no Snippet, e clique em Executar.",
        toque: "Agora escreva a função media(notas) embaixo do plano, no Snippet, e toque em Executar.",
      },
      validador: {
        tipo: "funcaoPassa",
        nome: "media",
        casos: [
          { args: [[8, 6]], esperado: 7 },
          { args: [[]], esperado: 0 },
          { args: [[10]], esperado: 10 },
          { args: [[5, 6, 7]], esperado: 6 },
        ],
      },
      ajudas: {
        pergunta: "Qual passo do plano vira o if? E qual vira o for?",
        dica: "Um passo do plano vira uma ou duas linhas: o if da lista vazia, a soma, o for...of, a divisão e o return.",
      },
      falaAoConcluir: { texto: "Funciona, até com a lista vazia! O plano virou código, passo por passo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: `${COMENTARIOS_MEDIA}\n\n${CODIGO_MEDIA}` },
        { tipo: "executarSnippet" },
      ],
    },
  ],
  conclusao: [{ texto: "Plano, código e palco na mesma tela.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo no plano e no código.", expressao: "feliz" },
};

export const FASES_BANCADA_RESOLVER: readonly Fase[] = [FASE_DEMO_RESOLVER];

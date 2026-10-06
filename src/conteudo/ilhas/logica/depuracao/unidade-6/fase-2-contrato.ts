/*
 * Depuração, U6, fase 2: o CHAMADO 2, no formato contrato (guia, seção 31).
 * O aplicativo de agenda do Salão Girassol marca duas clientes no mesmo
 * horário "de vez em quando". É um software com defeito: a cena é a tela do
 * aplicativo no balcão (a agenda de terça, com o horário repetido em
 * vermelho até o conserto), com palco, console e casos de teste. O aluno
 * reproduz, investiga com o depurador, diz a causa antes de consertar
 * (cartões com distrações), conserta sem quebrar o resto e entrega o
 * relatório do conserto.
 *
 * O DEFEITO: o laço decide na primeira marcação da lista (o else marca a
 * cliente já na primeira volta). Só recusa o horário ocupado quando ele é o
 * primeiro da lista; por isso "de vez em quando".
 * O PEDIDO (partes do cliente): a causa antes de consertar (causa), a agenda
 * sem horário repetido (agenda) e o relatório (relatorio). O PROCESSO:
 * reproduzir o defeito e os casos de teste do aluno.
 * A MUDANÇA (depois do conserto): o aplicativo aceitava horário fora do
 * expediente (22h). A parte nova toma o lugar de agenda: tudo o que já
 * funcionava e o expediente de 9h às 18h, com as bordas 9 e 18.
 */
import type { FaseDesafio, Validador } from "@/conteudo/tipos";
import { linhasDoPlano } from "@/motor/plano/comentarios";
import { casosDe, FERRAMENTAS_INVESTIGACAO, SABE_DEPURACAO, SITE_DE_CONSOLE, soltarPonto } from "../chamados";
import { CENA_SALAO } from "./cena";

const CHAMADAS = [
  'const segunda = agendar([{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }], { horario: 9, cliente: "Caio" });',
  'const terca = agendar([{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }], { horario: 10, cliente: "Dani" });',
  'tela.mostrarAgenda(terca, "Terça");',
].join("\n");

/** O código que o sobrinho deixou, com o defeito. */
export const CODIGO_COM_DEFEITO = [
  "function agendar(agenda, pedido) {",
  "  for (let i = 0; i < agenda.length; i++) {",
  "    if (agenda[i].horario === pedido.horario) {",
  "      return agenda;",
  "    } else {",
  "      agenda.push(pedido);",
  "      return agenda;",
  "    }",
  "  }",
  "  agenda.push(pedido);",
  "  return agenda;",
  "}",
  CHAMADAS,
].join("\n");

/** O conserto da causa: olhar todas as marcações antes de marcar. */
export const CODIGO_CONSERTADO = [
  "function agendar(agenda, pedido) {",
  "  for (let i = 0; i < agenda.length; i++) {",
  "    if (agenda[i].horario === pedido.horario) {",
  "      return agenda;",
  "    }",
  "  }",
  "  agenda.push(pedido);",
  "  return agenda;",
  "}",
  CHAMADAS,
].join("\n");

/** O depois da mudança: fora do expediente a agenda volta como estava. */
const CORPO_DEPOIS = [
  "function agendar(agenda, pedido) {",
  "  if (pedido.horario < 9 || pedido.horario >= 18) {",
  "    return agenda;",
  "  }",
  "  for (let i = 0; i < agenda.length; i++) {",
  "    if (agenda[i].horario === pedido.horario) {",
  "      return agenda;",
  "    }",
  "  }",
  "  agenda.push(pedido);",
  "  return agenda;",
  "}",
  CHAMADAS,
].join("\n");

const ana = { horario: 9, cliente: "Ana" };
const bia = { horario: 10, cliente: "Bia" };
const cris = { horario: 11, cliente: "Cris" };

type Casos = Parameters<typeof casosDe>[1];

/** Os casos escondidos de antes: o que já funcionava e o defeito (horários ocupados em qualquer posição). */
export const CASOS_AGENDA: Casos = [
  [[[], { horario: 10, cliente: "Ana" }], [{ horario: 10, cliente: "Ana" }]],
  [[[ana], bia], [ana, bia]],
  [[[ana, bia], { horario: 9, cliente: "Caio" }], [ana, bia]],
  [[[ana, bia], { horario: 10, cliente: "Dani" }], [ana, bia]],
  [[[ana, bia, cris], { horario: 11, cliente: "Duda" }], [ana, bia, cris]],
  [[[ana, bia], { horario: 11, cliente: "Ana" }], [ana, bia, { horario: 11, cliente: "Ana" }]],
];

/** Os casos da mudança: fora do expediente (9h às 18h) e as bordas. */
export const CASOS_EXPEDIENTE: Casos = [
  [[[ana], { horario: 8, cliente: "Bia" }], [ana]],
  [[[ana], { horario: 18, cliente: "Bia" }], [ana]],
  [[[], { horario: 22, cliente: "Caio" }], []],
  [[[bia], { horario: 17, cliente: "Bia" }], [bia, { horario: 17, cliente: "Bia" }]],
  [[[bia], { horario: 9, cliente: "Ana" }], [bia, ana]],
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
    { id: "causa-primeira", texto: "O programa decide olhando só a primeira marcação da lista, não todas", grupo: "errado" },
    { id: "causa-comparacao", texto: "A comparação usa o sinal errado e nunca acha o mesmo horário", sobra: true as const },
    { id: "causa-ordem", texto: "A lista de marcações está fora de ordem", sobra: true as const },
    { id: "causa-pressa", texto: "Duas clientes pediram o mesmo horário ao mesmo tempo", sobra: true as const },
    { id: "achou-comparar", texto: "Comparei o pedido que a agenda recusou com o que marcou em dobro", grupo: "achado" },
    { id: "achou-observar", texto: "Parei na linha do if e observei a comparação a cada pausa", grupo: "achado", depoisDe: ["achou-comparar"] },
    { id: "achou-chute", texto: "Apaguei marcações da lista até parar de dobrar", sobra: true as const },
    { id: "testou-novo", texto: "Testei o horário ocupado na primeira, na segunda e na última posição", grupo: "testado" },
    { id: "testou-antigos", texto: "Rodei de novo os casos antigos: lista vazia e horários livres", grupo: "testado", depoisDe: ["testou-novo"] },
    { id: "testou-so-um", texto: "Testei só o horário que dobrou na terça", sobra: true as const },
  ],
};

const BLOCO_RELATORIO = linhasDoPlano(PLANO_RELATORIO, {
  listas: { errado: ["causa-primeira"], achado: ["achou-comparar", "achou-observar"], testado: ["testou-novo", "testou-antigos"] },
}).join("\n");

/** O diagnóstico feito: a causa certa no relatório e nenhuma das hipóteses erradas. O conserto só vale depois dele. */
const CAUSA_ESCOLHIDA: Validador = {
  tipo: "todos",
  validadores: [
    { tipo: "passoNoPlano", passo: "causa-primeira", grupo: "errado" },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-comparacao" } },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-ordem" } },
    { tipo: "nao", validador: { tipo: "passoNoPlano", passo: "causa-pressa" } },
  ],
};

const CODIGO_DEPOIS_COM_RELATORIO = `${BLOCO_RELATORIO}\n\n${CORPO_DEPOIS}`;

export const FASE_DEPURACAO_U6_F2: FaseDesafio = {
  id: "logica-depuracao-u6-f2",
  tipo: "desafio",
  unidadeId: "logica-depuracao-u6",
  titulo: "A agenda que marca em dobro",
  conceitos: ["teste-de-regressao"],
  revisa: [...SABE_DEPURACAO, "reproduzir-o-defeito", "causa-raiz", "teste-de-regressao", "for-js", "casos-de-borda", "plano-comentado"],
  prerequisitos: [...SABE_DEPURACAO, "reproduzir-o-defeito", "causa-raiz", "teste-de-regressao"],
  areas: ["cena", "plano", "snippet", "palco", "testes"],
  // A tela do aplicativo no balcão: a agenda de terça, com o horário marcado em dobro em vermelho até o conserto.
  cena: CENA_SALAO,
  plano: PLANO_RELATORIO,
  testes: {
    funcao: "agendar",
    parametros: ["agenda", "pedido"],
    inicial: [{ entrada: '[{ horario: 9, cliente: "Ana" }], { horario: 10, cliente: "Bia" }', esperado: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }]' }],
  },
  usaFerramentas: [...FERRAMENTAS_INVESTIGACAO, "cena", "ficha-dispositivo", "velocidade-simulacao", "quadro-de-passos", "plano-no-codigo", "casos-de-teste"],
  siteAlvo: SITE_DE_CONSOLE,
  programa: { snippet: { nome: "agenda.js", codigoInicial: CODIGO_COM_DEFEITO } },
  introducao: [
    { texto: "Chegou chamado! Dona Zélia, do Salão Girassol, tem um aplicativo de agenda que às vezes marca duas clientes no mesmo horário.", expressao: "comemorando" },
    { texto: "Eu sou o colega da mesa ao lado: pergunto e lembro do processo. Reproduzir, dizer a causa, consertar sem quebrar o resto e entregar o relatório.", expressao: "curioso" },
    { texto: "A tela do balcão mostra a agenda que o programa monta. Rode o código e olhe a terça: tem horário em vermelho.", expressao: "apontando" },
  ],
  contrato: {
    cliente: "dona-zelia",
    projeto: "Conserto da agenda do salão",
    fimDeIlha: false,
    // O aplicativo sai do jogo: a agenda (com os horários repetidos marcados) aparece no console.
    levarProMundo: { arquivo: "agenda-do-salao.js" },
    briefing: [
      { texto: "Oi, querida! Sou a Zélia, do Salão Girassol. Meu sobrinho fez um aplicativo de agenda e eu adorava, até ele começar a me dar dor de cabeça.", expressao: "feliz" },
      { texto: "De vez em quando duas clientes aparecem no mesmo horário! Aconteceu na terça, às 10. Mas na segunda, às 9, ele recusou direitinho. Não entendo!", expressao: "preocupado" },
      { texto: "O sobrinho foi estudar fora e o aplicativo ficou aí. Eu só sei marcar e olhar a lista de horários.", expressao: "pensativo" },
      { texto: "Antes de mexer, me conta o que causou isso, tá? Já mexeram uma vez sem me explicar e piorou.", expressao: "preocupado" },
      { texto: "E no fim, um papel curtinho: o que estava errado, como achou e como testou. Pra eu guardar na gaveta.", expressao: "pensativo" },
      { texto: "Minha filha quer lembrete por WhatsApp, foto dos cortes e pagamento no aplicativo. Tudo isso fica pra depois!", expressao: "feliz" },
    ],
    documento: {
      titulo: "Chamado da Dona Zélia",
      paragrafos: [
        "A agenda do salão é uma lista de marcações. Cada marcação tem o horário (um número: 9 é 9h) e o nome da cliente.",
        "Para marcar, o programa recebe a agenda e o pedido { horario, cliente } e devolve a agenda. Se o horário já estiver ocupado, a agenda volta como estava, sem marcar de novo.",
        "Só uma cliente por horário, não importa em que posição da lista o horário ocupado esteja. A cliente nova entra no fim da lista.",
        "Antes de mexer no código, quero saber a causa do defeito. No fim, quero um papel curto: o que estava errado, como foi achado e como foi testado.",
        "Lembrete por WhatsApp, foto dos cortes e pagamento no aplicativo ficam para depois.",
      ],
    },
    requisitos: {
      pergunta: "O que a Dona Zélia pediu de verdade?",
      cartoes: [
        {
          id: "causa",
          texto: "Antes de mexer no código, descobrir e dizer a ___ do defeito",
          parte: "causa",
          lacunas: [{ opcoes: ["causa", "culpa", "data"], correta: 0 }],
          porque: "Ela quer saber o que causou o defeito antes de qualquer conserto: a causa, não o culpado.",
        },
        {
          id: "agenda",
          texto: "Horário ocupado: a agenda volta ___. Senão, a cliente entra ___",
          parte: "agenda",
          lacunas: [
            { opcoes: ["como estava", "com a cliente nova", "vazia"], correta: 0 },
            { opcoes: ["no fim da lista", "no começo da lista", "no lugar da antiga"], correta: 0 },
          ],
          porque: "O documento diz: horário ocupado devolve a agenda como estava, e a cliente nova entra no fim da lista.",
        },
        {
          id: "relatorio",
          texto: "No fim, um papel curto com o que estava errado, como foi achado e como foi ___",
          parte: "relatorio",
          lacunas: [{ opcoes: ["testado", "pintado", "marcado"], correta: 0 }],
          porque: "Ela pediu três coisas no papel: o que era, como achou e como testou.",
        },
        { id: "whatsapp", texto: "Mandar lembrete por WhatsApp", sobra: true, porque: "A filha sugeriu, mas a Dona Zélia disse que fica para depois." },
        { id: "fotos", texto: "Guardar fotos dos cortes de cada cliente", sobra: true, porque: "Também ficou para depois. O chamado é consertar a agenda." },
        { id: "pagamento", texto: "Cobrar o pagamento pelo aplicativo", sobra: true, porque: "Foi outra ideia da filha, não faz parte do chamado." },
        { id: "avisar", texto: "Avisar a cliente quando o horário estiver ocupado", sobra: true, porque: "Parece com a agenda, mas ela só pediu que a agenda volte como estava." },
      ],
    },
    mudanca: {
      depoisDe: ["agenda"],
      mensagem: [
        { texto: "Zélia de novo! A agenda parou de dobrar, que alívio! Mas ontem marcaram uma moça às 22h pelo celular, e eu fecho às 18h.", expressao: "preocupado" },
        { texto: "Atendo das 9 às 18, e a última cliente entra às 17. Horário fora disso, a agenda tem que recusar, igual quando está ocupado.", expressao: "pensativo" },
        { texto: "E o resto fica igualzinho, viu? Lista vazia, horário livre, horário ocupado... tudo como está!", expressao: "empolgado" },
      ],
      adendo:
        "Mensagem da Dona Zélia: o salão atende das 9h às 18h. Horário antes das 9 ou a partir das 18 não pode ser marcado: a agenda volta como estava. O resto continua como antes.",
      novas: [{ parte: "agenda-expediente", substitui: "agenda" }],
    },
    entrega: {
      reacao: [
        { texto: "Que capricho! O papel já foi para a gaveta, junto com a mudança das 18h.", expressao: "satisfeito" },
        { texto: "Amanhã cedo eu teste com a Ana e a Bia. O primeiro corte da semana é por minha conta!", expressao: "feliz" },
      ],
    },
  },
  partes: [
    {
      id: "reproduzir",
      descricao: "Reproduza o defeito: compare o pedido que a agenda recusou com o que ela marcou em dobro",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "observou", expressao: "pedido.horario", valor: 9 },
          { tipo: "observou", expressao: "pedido.horario", valor: 10 },
          { tipo: "observou", expressao: "agenda[i].horario === pedido.horario", valor: false },
        ],
      },
      revisarEm: "logica-depuracao-u6-f1",
      pergunta: "Em qual dia a agenda recusou e em qual marcou em dobro? O que muda entre os dois pedidos?",
      solucaoDeTeste: [
        { tipo: "alternarPontoDeParada", linha: 3 },
        { tipo: "observar", expressao: "pedido.horario" },
        { tipo: "observar", expressao: "agenda[i].horario === pedido.horario" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "causa",
      descricao: "Diagnóstico: escolha no relatório a causa raiz do defeito, entre as hipóteses, antes de consertar",
      validador: CAUSA_ESCOLHIDA,
      revisarEm: "logica-depuracao-u6-f1",
      pergunta: "Em que volta do laço a agenda decide se marca? O que a segunda marcação da lista tem a ver com isso?",
      solucaoDeTeste: [{ tipo: "porPasso", passo: "causa-primeira", grupo: "errado" }],
    },
    {
      id: "agenda",
      descricao: "Depois do diagnóstico, a agenda recusa horário ocupado em qualquer posição da lista e marca os livres no fim",
      validador: { tipo: "todos", validadores: [CAUSA_ESCOLHIDA, { tipo: "semErro" }, casosDe("agendar", CASOS_AGENDA)] },
      revisarEm: "logica-depuracao-u3-f1",
      pergunta: "Você já disse a causa no relatório antes de mexer? A lista vazia e o horário livre continuam como antes?",
      solucaoDeTeste: [...soltarPonto(3), { tipo: "definirSnippet", codigo: CODIGO_CONSERTADO }, { tipo: "executarSnippet" }],
    },
    {
      id: "testes",
      descricao: "Seus casos de teste de agendar passam: lista vazia, horário livre e horário ocupado na segunda posição",
      validador: {
        tipo: "casosDoAluno",
        minimo: 4,
        passando: true,
        incluir: [
          { args: [[], { horario: 10, cliente: "Ana" }], esperado: [{ horario: 10, cliente: "Ana" }], rotulo: "a agenda vazia" },
          { args: [[ana, bia], { horario: 10, cliente: "Dani" }], esperado: [ana, bia], rotulo: "o horário ocupado na segunda posição" },
        ],
      },
      revisarEm: "logica-resolvendo-problemas-u4-f1",
      pergunta: "Você já testou um horário ocupado que não é o primeiro da lista? E a agenda vazia?",
      solucaoDeTeste: [
        { tipo: "escreverCaso", entrada: '[], { horario: 10, cliente: "Ana" }', esperado: '[{ horario: 10, cliente: "Ana" }]' },
        { tipo: "escreverCaso", entrada: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }], { horario: 9, cliente: "Caio" }', esperado: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }]' },
        { tipo: "escreverCaso", entrada: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }], { horario: 10, cliente: "Dani" }', esperado: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }]' },
        {
          tipo: "escreverCaso",
          entrada: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }], { horario: 11, cliente: "Ana" }',
          esperado: '[{ horario: 9, cliente: "Ana" }, { horario: 10, cliente: "Bia" }, { horario: 11, cliente: "Ana" }]',
        },
        { tipo: "rodarCasos" },
      ],
    },
    {
      id: "relatorio",
      descricao: "O relatório do conserto está montado (o que estava errado, como foi achado e como foi testado) e no código",
      validador: { tipo: "todos", validadores: [{ tipo: "ordemValida" }, { tipo: "planoComentado" }] },
      revisarEm: "logica-resolvendo-problemas-u1-f3",
      pergunta: "Alguém que nunca viu o aplicativo entende, só pelo relatório, o que estava errado e como você sabe que consertou?",
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "achou-comparar", grupo: "achado" },
        { tipo: "porPasso", passo: "achou-observar", grupo: "achado" },
        { tipo: "porPasso", passo: "testou-novo", grupo: "testado" },
        { tipo: "porPasso", passo: "testou-antigos", grupo: "testado" },
        { tipo: "levarPlanoProCodigo" },
      ],
    },
    {
      id: "agenda-expediente",
      descricao: "Fora do expediente (antes das 9h ou a partir das 18h) a agenda recusa, e tudo o que já funcionava continua",
      validador: { tipo: "todos", validadores: [CAUSA_ESCOLHIDA, { tipo: "semErro" }, casosDe("agendar", [...CASOS_AGENDA, ...CASOS_EXPEDIENTE])] },
      revisarEm: "logica-depuracao-u6-f1",
      pergunta: "O que a agenda faz hoje com um pedido para as 22h? E para as 9h e as 18h, onde começa e termina o expediente?",
      solucaoDeTeste: [{ tipo: "definirSnippet", codigo: CODIGO_DEPOIS_COM_RELATORIO }, { tipo: "executarSnippet" }],
    },
  ],
  conclusao: [
    { texto: "Chamado entregue! Você reproduziu, disse a causa antes de mexer, consertou sem quebrar o resto e ainda cobriu o expediente.", expressao: "comemorando" },
    { texto: "O relatório do conserto fica nos comentários do código: quem pegar o aplicativo depois sabe o que era, como foi achado e como foi testado.", expressao: "apontando" },
    { texto: "E o aplicativo pode sair do jogo: o Levar pro mundo baixa a agenda num arquivo .js, que roda no Console de qualquer navegador.", expressao: "comemorando" },
  ],
  missaoDeCampo:
    "No Chrome, abra DevTools > Sources > Snippets, cole uma função sua, marque um ponto de parada dentro de um laço e use Watch e Retomar para ver o que muda de uma volta para a outra.",
};

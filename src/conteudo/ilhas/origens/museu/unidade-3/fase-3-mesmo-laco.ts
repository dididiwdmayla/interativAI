/* Sala 3, fase 3: o mesmo laço em quatro linguagens, e o Python editado de verdade. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { FORNADAS, FORNADAS_PYTHON_ATE_5, PARTES_FORNADAS } from "./programas";

export const FASE_ORIGENS_U3_F3: Fase = {
  id: "origens-museu-u3-f3",
  tipo: "pratica",
  unidadeId: "origens-museu-u3",
  titulo: "O mesmo laço",
  conceitos: ["indentacao"],
  revisa: ["sintaxe"],
  prerequisitos: ["sintaxe"],
  usaFerramentas: ["comparador-de-linguagens"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "As fornadas",
      texto: "Repetir uma ordem três vezes: o laço. BASIC dos anos 1980, C dos 1970, JavaScript e Python dos 1990. O Python dá para editar e rodar.",
    },
    falas: {
      abrir: "Repetir é com a máquina. Três fornadas, quatro linguagens. Um laço só.",
      porEtapa: {
        "o-laco": "FOR. Em quase todas é FOR. Toque no do BASIC.",
        "ate-onde": "Python é diferente. range(1, 4). Pense antes de tocar.",
        "onde-acaba": "Todo laço acaba em algum lugar. Ache onde, no JavaScript.",
        "cinco-fornadas": "Agora mexa. Cinco fornadas no Python. Rode e prove.",
      },
      concluir: "Cinco fornadas. Python de verdade. Recuo certo. Aprovado.",
    },
    estacoes: [{ id: "fornadas", tipo: "comparador", titulo: "As fornadas", partes: PARTES_FORNADAS, programas: FORNADAS, editavel: "python" }],
  },
  introducao: [
    { texto: "A padaria assa três fornadas por manhã. Mandar o computador repetir é um laço.", expressao: "apontando" },
    { texto: "Quatro linguagens repetindo a mesma coisa. Bora ver se o laço é o mesmo?", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "rode-os-dois",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Rode o JavaScript e o Python: os dois contam as três fornadas.",
        toque: "Rode o JavaScript e o Python: os dois contam as três fornadas.",
      },
      validador: { tipo: "linguagensRodadas", estacao: "fornadas", linguagens: ["javascript", "python"] },
      ajudas: {
        pergunta: "Quais dos quatro rodam de verdade aqui?",
        dica: "Os que têm a etiqueta roda de verdade: JavaScript e Python. Rode os dois.",
        linha: { alvo: "exposicao", estacao: "fornadas", peca: "rodar:python", fala: "Rode este e o do JavaScript." },
        solucao: {
          fala: "Rodei os dois: Fornada 1, 2 e 3, nos dois.",
          acoes: [
            { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "javascript" },
            { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "python" },
          ],
        },
      },
      falaAoConcluir: { texto: "Três fornadas nos dois. Um laço repete a linha de dentro, uma vez por volta.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "javascript" },
        { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "python" },
      ],
    },
    {
      id: "o-laco",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na linha do laço no BASIC e veja o mesmo laço acender nas outras.",
        toque: "Toque na linha do laço no BASIC e veja o mesmo laço acender nas outras.",
      },
      validador: { tipo: "parteVista", estacao: "fornadas", parte: "repete", linguagens: ["basic"] },
      ajudas: {
        pergunta: "Qual linha do BASIC diz de onde até onde contar?",
        dica: "FOR I = 1 TO 3 quer dizer: para I de 1 até 3.",
        linha: { alvo: "exposicao", estacao: "fornadas", peca: "basic:repete", fala: "Esta é a linha do laço." },
        solucao: { fala: "Toquei no FOR do BASIC: o laço acendeu nas quatro.", acoes: [{ tipo: "tocarParte", estacao: "fornadas", parte: "repete", linguagem: "basic" }] },
      },
      falaAoConcluir: { texto: "FOR no BASIC, for no C e no JavaScript, for no Python. O laço tem até o mesmo nome!", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "tocarParte", estacao: "fornadas", parte: "repete", linguagem: "basic" }],
    },
    {
      id: "ate-onde",
      tipo: "previsao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora toque, no Python, na linha que diz até onde contar.",
        toque: "Agora toque, no Python, na linha que diz até onde contar.",
      },
      previsao: {
        pergunta: "No Python, o laço diz range(1, 4). Até que número ele conta?",
        opcoes: ["Até 3", "Até 4"],
        correta: 0,
        explicacao: "O range para ANTES do segundo número: 1, 2 e 3. Por isso o 4 está lá.",
      },
      validador: { tipo: "parteVista", estacao: "fornadas", parte: "repete", linguagens: ["python"] },
      ajudas: {
        pergunta: "Qual linha do Python tem a palavra for?",
        dica: "É a primeira. O range(1, 4) diz de onde começar e onde parar.",
      },
      falaAoConcluir: { texto: "Até 3! O range do Python para antes do 4. Cada linguagem tem as suas manias.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "tocarParte", estacao: "fornadas", parte: "repete", linguagem: "python" }],
    },
    {
      id: "onde-acaba",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ache, no JavaScript, a linha onde o laço acaba.",
        toque: "Ache, no JavaScript, a linha onde o laço acaba.",
      },
      validador: { tipo: "parteVista", estacao: "fornadas", parte: "fecha", linguagens: ["javascript"] },
      ajudas: {
        pergunta: "O que fecha um bloco no JavaScript?",
        dica: "A chave que abre na linha do for fecha numa linha sozinha, mais embaixo.",
      },
      falaAoConcluir: { texto: "A chave fecha o laço. E no Python? Não tem chave: o recuo (os espaços na frente) diz o que está dentro.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "tocarParte", estacao: "fornadas", parte: "fecha", linguagem: "javascript" }],
    },
    {
      id: "cinco-fornadas",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Editar no Python, troque o 4 por 6 e rode: cinco fornadas.",
        toque: "Toque em Editar no Python, troque o 4 por 6 e rode: cinco fornadas.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "saida", contem: "Fornada 5" },
          { tipo: "linguagensRodadas", estacao: "fornadas", linguagens: ["python"] },
        ],
      },
      ajudas: {
        pergunta: "Se range(1, 4) para no 3, onde ele precisa parar para chegar no 5?",
        dica: "Para contar até 5, o range para antes do 6: range(1, 6). Deixe o recuo da segunda linha como está.",
        linha: { alvo: "exposicao", estacao: "fornadas", peca: "editar", fala: "Este botão abre o Python para editar." },
        solucao: {
          fala: "Troquei para range(1, 6) e rodei: cinco fornadas.",
          acoes: [
            { tipo: "escreverNaLinguagem", estacao: "fornadas", linguagem: "python", codigo: FORNADAS_PYTHON_ATE_5 },
            { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "python" },
          ],
        },
      },
      falaAoConcluir: { texto: "Cinco fornadas! Você escreveu Python, e ele rodou de verdade.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "escreverNaLinguagem", estacao: "fornadas", linguagem: "python", codigo: FORNADAS_PYTHON_ATE_5 },
        { tipo: "rodarLinguagem", estacao: "fornadas", linguagem: "python" },
      ],
    },
  ],
  conclusao: [
    { texto: "O laço é o mesmo em todas: de onde, até onde, o que repete e onde acaba.", expressao: "apontando" },
    { texto: "No Python, quem diz o que está dentro do laço é o recuo. Se tirar os espaços, ele reclama.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Num papel, escreva as três fornadas em português, como um laço: \"para cada número de 1 até 3, mostre Fornada e o número\". Isso é pseudocódigo: o laço antes de qualquer linguagem.",
  falaFinal: { texto: "Quando chegar a vez do for na Ilha Lógica, você já sabe: é o mesmo laço, na escrita do JavaScript.", expressao: "feliz" },
};

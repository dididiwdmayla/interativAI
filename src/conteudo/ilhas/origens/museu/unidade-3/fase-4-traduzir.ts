/* Sala 3, fase 4: compilar ou interpretar, e a escada do baixo nível ao alto nível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const ESCADA_DAS_LINGUAGENS = [
  { id: "maquina", texto: "Linguagem de máquina (os bits)", revela: "0010 0111: o que o processador lê de verdade. Quase ninguém escreve assim hoje." },
  { id: "assembly", texto: "Assembly", revela: "Uma palavrinha para cada ordem do processador (ADD, MOV). Ainda colado na máquina." },
  { id: "c", texto: "C", revela: "Já tem nomes e contas, mas quem programa cuida da memória na mão." },
  { id: "python", texto: "Python e JavaScript", revela: "Perto do jeito de pensar da gente: a linguagem cuida dos detalhes da máquina." },
];

export const FASE_ORIGENS_U3_F4: Fase = {
  id: "origens-museu-u3-f4",
  tipo: "pratica",
  unidadeId: "origens-museu-u3",
  titulo: "Compilar ou interpretar",
  conceitos: ["compilador", "interpretador", "alto-e-baixo-nivel"],
  revisa: ["linguagem-de-maquina", "sintaxe"],
  prerequisitos: ["linguagem-de-maquina"],
  usaFerramentas: ["compilar-interpretar", "ordem-dos-cartoes"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "Os dois tradutores",
      texto: "Toda linguagem precisa virar linguagem de máquina. Uns traduzem tudo antes (compilar); outros, linha a linha, enquanto roda (interpretar).",
    },
    falas: {
      abrir: "Eu só entendo bits. Vocês escrevem palavras. Alguém traduz. Existem dois jeitos.",
      porEtapa: {
        interpretar: "Agora o intérprete. Uma linha. Roda. Outra linha. Roda. Sem pressa.",
        "de-novo": "Rode de novo. Conte quem trabalhou dobrado.",
        "primeiro-degrau": "Uma escada. Embaixo, eu. Em cima, vocês. Monte.",
        escada: "Cada degrau esconde o de baixo. Por isso vocês não escrevem bits.",
      },
      concluir: "Compilar: traduz antes, roda rápido. Interpretar: traduz enquanto roda. Os dois chegam em mim.",
    },
    estacoes: [
      { id: "traducao", tipo: "traducao", titulo: "Compilar ou interpretar", programa: ["pao = 12", "total = pao + 28", "total = total - 5", "mostrar total"], exemplos: { compilada: "C", interpretada: "Python" } },
      { id: "escada", tipo: "ordem", titulo: "A escada", aparencia: "escada", itens: ESCADA_DAS_LINGUAGENS, pontas: { inicio: "Perto da máquina (baixo nível)", fim: "Perto da gente (alto nível)" } },
    ],
  },
  introducao: [
    { texto: "Na sala 1, uma linha nossa virou três fileiras de bits. Quem faz essa tradução?", expressao: "curioso" },
    { texto: "Tem dois jeitos de traduzir: tudo antes, ou um pouco de cada vez. Vamos comparar.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "compilar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Compilar e acompanhe: o compilador lê o programa inteiro antes de rodar.",
        toque: "Toque em Compilar e acompanhe: o compilador lê o programa inteiro antes de rodar.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "traducao", marco: "compilou" },
      apresentar: ["compilar-interpretar"],
      ajudas: {
        pergunta: "Qual botão manda traduzir tudo antes?",
        dica: "Compilar: o tradutor lê todas as linhas e entrega um programa pronto, em bits.",
        linha: { alvo: "exposicao", estacao: "traducao", peca: "compilar", fala: "Este botão compila." },
        solucao: { fala: "Compilei: as quatro linhas viraram um programa pronto.", acoes: [{ tipo: "comandoNaEstacao", estacao: "traducao", comando: "compilar" }] },
      },
      falaAoConcluir: { texto: "Traduziu tudo primeiro e depois rodou depressa. O programa pronto fica guardado.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "traducao", comando: "compilar" }],
    },
    {
      id: "interpretar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora clique em Interpretar: uma linha é traduzida e roda, depois a próxima.",
        toque: "Agora toque em Interpretar: uma linha é traduzida e roda, depois a próxima.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "traducao", marco: "interpretou" },
      ajudas: {
        pergunta: "Qual é o outro jeito de traduzir?",
        dica: "Interpretar: traduz e roda uma linha, depois a próxima, como um intérprete numa conversa.",
        linha: { alvo: "exposicao", estacao: "traducao", peca: "interpretar", fala: "Este botão interpreta." },
        solucao: { fala: "Interpretei: linha a linha, traduzindo e rodando.", acoes: [{ tipo: "comandoNaEstacao", estacao: "traducao", comando: "interpretar" }] },
      },
      falaAoConcluir: { texto: "Começou a rodar logo na primeira linha, sem esperar traduzir tudo.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "traducao", comando: "interpretar" }],
    },
    {
      id: "de-novo",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Confira: clique em Rodar de novo e olhe o placar de traduções.",
        toque: "Confira: toque em Rodar de novo e olhe o placar de traduções.",
      },
      previsao: {
        pergunta: "Rodando o mesmo programa de novo, quem precisa traduzir tudo outra vez?",
        opcoes: ["O compilado", "Os dois", "O interpretado"],
        correta: 2,
        explicacao: "O compilado já tem o programa pronto em bits. O interpretado traduz enquanto roda, toda vez.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "traducao", marco: "repetiu" },
      ajudas: {
        pergunta: "Depois de compilar, o que ficou guardado?",
        dica: "O compilador entrega um programa pronto. O intérprete não guarda nada pronto.",
        linha: { alvo: "exposicao", estacao: "traducao", peca: "repetir", fala: "Este botão roda os dois de novo." },
        solucao: { fala: "Rodei de novo: só o intérprete traduziu outra vez.", acoes: [{ tipo: "comandoNaEstacao", estacao: "traducao", comando: "repetir" }] },
      },
      falaAoConcluir: { texto: "O placar do intérprete dobrou; o do compilador nem mexeu. O JavaScript é traduzido pelo próprio navegador, enquanto a página roda.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }, { tipo: "comandoNaEstacao", estacao: "traducao", comando: "repetir" }],
    },
    {
      id: "primeiro-degrau",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Na escada, ponha a linguagem de máquina no degrau de baixo, o mais perto da máquina.",
        toque: "Na escada, ponha a linguagem de máquina no degrau de baixo, o mais perto da máquina.",
      },
      validador: { tipo: "ordemCerta", estacao: "escada", itens: ["maquina"] },
      apresentar: ["ordem-dos-cartoes"],
      ajudas: {
        pergunta: "Qual delas o processador lê sem tradutor nenhum?",
        dica: "Os bits: a linguagem de máquina fica no primeiro degrau.",
        linha: { alvo: "exposicao", estacao: "escada", peca: "maquina", fala: "Este cartão vai no degrau de baixo." },
        solucao: { fala: "Pus a linguagem de máquina no primeiro degrau.", acoes: [{ tipo: "porNaOrdem", estacao: "escada", item: "maquina", posicao: 0 }] },
      },
      falaAoConcluir: { texto: "O degrau de baixo é o dos bits: baixo nível quer dizer perto da máquina, não pior.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "porNaOrdem", estacao: "escada", item: "maquina", posicao: 0 }],
    },
    {
      id: "escada",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: monte o resto da escada, do mais perto da máquina ao mais perto da gente.",
        toque: "Agora sozinho: monte o resto da escada, do mais perto da máquina ao mais perto da gente.",
      },
      validador: { tipo: "ordemCerta", estacao: "escada" },
      ajudas: {
        pergunta: "Qual delas ainda fala com o processador quase palavra por palavra?",
        dica: "Assembly fica logo acima dos bits; o C vem depois; Python e JavaScript, no alto.",
      },
      falaAoConcluir: { texto: "A escada inteira! Quanto mais alto, mais perto do jeito de falar da gente.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porNaOrdem", estacao: "escada", item: "assembly" },
        { tipo: "porNaOrdem", estacao: "escada", item: "c" },
        { tipo: "porNaOrdem", estacao: "escada", item: "python" },
      ],
    },
  ],
  conclusao: [
    { texto: "Compilador traduz tudo antes; interpretador traduz enquanto roda. Os dois entregam bits ao processador.", expressao: "apontando" },
    { texto: "Alto nível é perto da gente; baixo nível, perto da máquina. Cada degrau esconde o de baixo.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra o F12, aba Desempenho (Performance), grave alguns segundos de um site e procure, no meio do trabalho, o tempo de \"Compile\". É o navegador traduzindo o JavaScript da página.",
  falaFinal: { texto: "Você escreve no alto da escada. O resto o tradutor resolve.", expressao: "feliz" },
};

/* Sala 4, fase 2: o processador de brinquedo no ciclo buscar, entender, executar (a máquina da sala 1, rodando). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U4_F2: Fase = {
  id: "origens-museu-u4-f2",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "O processador",
  conceitos: ["processador"],
  revisa: ["instrucao-de-maquina", "endereco-de-memoria"],
  prerequisitos: ["instrucao-de-maquina", "endereco-de-memoria"],
  usaFerramentas: ["processador-de-brinquedo"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "O processador de brinquedo",
      texto: "A máquina simplificada da sala 1 (PEGA, SOMA, GUARDA), agora rodando. Os de verdade têm muitas ordens, mas o ciclo é este: buscar, entender, executar.",
    },
    falas: {
      abrir: "Agora o meu coração: o processador! Ele faz uma coisinha de cada vez. Mas faz MUITO rápido!",
      porEtapa: {
        acumulador: "Buscar, entender, executar. De novo! E de novo! Eu adoro esse ritmo.",
        "ate-o-fim": "Deixa comigo até o PARA! Quero ver o total na caixa 8.",
      },
      concluir: "Uma linha de JavaScript, quatro ordens, doze passos. E eu faço bilhões por segundo!",
    },
    estacoes: [
      {
        id: "cpu",
        tipo: "processador",
        titulo: "O total com frete",
        memoria: [
          { ordem: "PEGA", endereco: 6 },
          { ordem: "SOMA", endereco: 7 },
          { ordem: "GUARDA", endereco: 8 },
          { ordem: "PARA", endereco: 0 },
          { valor: null },
          { valor: null },
          { valor: 12, nome: "preco" },
          { valor: 8, nome: "frete" },
          { valor: null, nome: "total" },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Lembra da sala 1? let total = preco + frete virou PEGA, SOMA e GUARDA, em bits.", expressao: "curioso" },
    { texto: "Agora você vê o processador cumprindo essas ordens, uma etapa de cada vez.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "buscar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Próximo passo: o processador busca a primeira ordem na memória.",
        toque: "Toque em Próximo passo: o processador busca a primeira ordem na memória.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "cpu", marco: "buscou" },
      apresentar: ["processador-de-brinquedo"],
      ajudas: {
        pergunta: "Onde o contador está apontando agora?",
        dica: "Buscar é ler a caixa que o contador aponta. Depois, o contador anda para a próxima.",
        linha: { alvo: "exposicao", estacao: "cpu", peca: "passo", fala: "Este botão anda uma etapa do ciclo." },
        solucao: { fala: "Buscou a caixa 0: 0001 0110, o PEGA 6.", acoes: [{ tipo: "comandoNaEstacao", estacao: "cpu", comando: "passo" }] },
      },
      falaAoConcluir: { texto: "Buscou a caixa 0: 0001 0110. E o contador já apontou a caixa 1, a próxima ordem.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "cpu", comando: "passo" }],
    },
    {
      id: "acumulador",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Continue no Próximo passo até o SOMA ser executado.",
        toque: "Continue no Próximo passo até o SOMA ser executado.",
      },
      previsao: {
        pergunta: "O PEGA põe o 12 no acumulador. Depois do SOMA 7, quanto ele vai guardar?",
        opcoes: ["8", "12", "20"],
        correta: 2,
        explicacao: "O SOMA junta o número da caixa 7 (o frete, 8) com o que já estava no acumulador (12): 20.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "cpu", marco: "acumulador=20" },
      ajudas: {
        pergunta: "Quantas etapas cada ordem tem?",
        dica: "Cada ordem passa por buscar, entender e executar. O acumulador só muda no executar.",
        linha: { alvo: "exposicao", estacao: "cpu", peca: "passo", fala: "Continue por este botão." },
        solucao: {
          fala: "Andei até o SOMA ser executado: o acumulador ficou com 20.",
          acoes: [1, 2, 3, 4, 5].map(() => ({ tipo: "comandoNaEstacao", estacao: "cpu", comando: "passo" }) as const),
        },
      },
      falaAoConcluir: { texto: "Vinte! O acumulador é a mão do processador: segura a conta do momento.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }, ...[1, 2, 3, 4, 5].map(() => ({ tipo: "comandoNaEstacao", estacao: "cpu", comando: "passo" }) as const)],
    },
    {
      id: "ate-o-fim",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: rode até o PARA e confira o total guardado na caixa 8.",
        toque: "Agora sozinho: rode até o PARA e confira o total guardado na caixa 8.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "marcoNaEstacao", estacao: "cpu", marco: "fim" },
          { tipo: "marcoNaEstacao", estacao: "cpu", marco: "caixa:8=20" },
        ],
      },
      ajudas: {
        pergunta: "Que ordem falta? E depois dela?",
        dica: "Falta o GUARDA 8 e o PARA. Dá para ir passo a passo ou rodar até o fim.",
      },
      falaAoConcluir: { texto: "Total 20, guardado na caixa 8. O programa da sala 1 rodou inteirinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "comandoNaEstacao", estacao: "cpu", comando: "rodar" }],
    },
  ],
  conclusao: [
    { texto: "O processador repete o ciclo: buscar a ordem, entender o que ela pede e executar.", expressao: "apontando" },
    { texto: "Ele faz uma coisa por vez, mas bilhões de vezes por segundo. Por isso parece mágica.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Procure o nome do processador do seu computador ou celular (nas configurações, em Sobre). Depois procure quantos GHz ele tem: 3 GHz são uns 3 bilhões de tiques do relógio por segundo.",
  falaFinal: { texto: "Toda linha que você escrever vira um punhado dessas ordens, buscadas e executadas uma a uma.", expressao: "feliz" },
};

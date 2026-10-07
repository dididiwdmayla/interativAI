/*
 * Sala 4, fase 6: os portões por dentro. O meio somador do gigante, agora
 * só com E, OU e NÃO (o OU exclusivo montado à mão), e a memória com
 * realimentação: a saída voltando para a entrada, o mesmo princípio do
 * selo de uma contatora (a ponte com a futura trilha Automação).
 */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { BANCADA_DO_SELO, BANCADA_DO_SOMADOR, tabelaDoSomador } from "./circuitos";

const fio = (estacao: string, de: string, para: string, porta: number) => ({ tipo: "mexerNoCircuito", estacao, mudanca: { tipo: "fio", de, para, porta } }) as const;
const portao = (estacao: string, tipo: "e" | "ou" | "nao", id: string) => ({ tipo: "mexerNoCircuito", estacao, mudanca: { tipo: "portao", portao: tipo, id } }) as const;

export const FASE_ORIGENS_U4_F6: Fase = {
  id: "origens-museu-u4-f6",
  tipo: "pratica",
  unidadeId: "origens-museu-u4",
  titulo: "Os portões por dentro",
  conceitos: ["realimentacao"],
  revisa: ["meio-somador", "memoria-ram"],
  prerequisitos: ["meio-somador"],
  usaFerramentas: ["painel-de-cabos"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "pc",
    placa: {
      titulo: "Somar e lembrar",
      texto: "Dentro do chip, tudo é portão: E, OU e NÃO. Juntos, eles somam e até lembram. O mesmo truque do selo de uma contatora, nos quadros elétricos.",
    },
    falas: {
      abrir: "O vovô gigante usou caixas prontas. Eu vou abrir as caixas! Lá dentro: só E, OU e NÃO. Bip!",
      porEtapa: {
        "soma-sem-xou": "A soma acende se uma OU outra, mas NÃO as duas. Três portões, e pronto!",
        "o-selo": "Agora a mágica: a saída volta para a entrada. O circuito vai se lembrar!",
        lembrou: "Aperta e solta o liga. Pisca não, hein? Lembra!",
      },
      concluir: "Somar e lembrar, só com portões! É disso que eu sou feito por dentro. Bilhões deles!",
    },
    estacoes: [
      { id: "somador", tipo: "circuito", titulo: "O somador com portões", aparencia: "portoes", inicial: BANCADA_DO_SOMADOR, paleta: ["e", "ou", "nao"] },
      { id: "selo", tipo: "circuito", titulo: "A memória (o selo)", aparencia: "portoes", inicial: BANCADA_DO_SELO, paleta: ["e", "ou", "nao"] },
    ],
  },
  introducao: [
    { texto: "As caixas de válvulas do gigante tinham portões lógicos por dentro. Vamos montar a mesma soma com eles.", expressao: "apontando" },
    { texto: "E depois, um circuito que lembra de um valor. É assim que nasce a memória!", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "vai-um-com-e",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Comece pelo vai um: ponha um portão E, ligue A e B nele e ele na lâmpada vai um.",
        toque: "Comece pelo vai um: ponha um portão E, ligue A e B nele e ele na lâmpada vai um.",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "somador", esperado: tabelaDoSomador("vaiUm") },
      ajudas: {
        pergunta: "O vai um acende quando as duas chaves estão ligadas. Que portão faz isso?",
        dica: "O E só acende com as duas entradas acesas. Tire um E da paleta e ligue os fios.",
        linha: { alvo: "exposicao", estacao: "somador", peca: "vai-um", fala: "Esta lâmpada é o vai um." },
        solucao: {
          fala: "Pus um E e liguei A, B e o vai um.",
          acoes: [portao("somador", "e", "e1"), fio("somador", "a", "e1", 0), fio("somador", "b", "e1", 1), fio("somador", "e1", "vai-um", 0)],
        },
      },
      falaAoConcluir: { texto: "O vai um é só um E. O gigante tinha razão: as duas acenderam, vai um!", expressao: "feliz" },
      solucaoDeTeste: [portao("somador", "e", "e1"), fio("somador", "a", "e1", 0), fio("somador", "b", "e1", 1), fio("somador", "e1", "vai-um", 0)],
    },
    {
      id: "soma-sem-xou",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora a soma, só com E, OU e NÃO: acende se uma OU outra chave, mas NÃO as duas.",
        toque: "Agora a soma, só com E, OU e NÃO: acende se uma OU outra chave, mas NÃO as duas.",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "somador", esperado: tabelaDoSomador("as-duas") },
      ajudas: {
        pergunta: "O OU acende com uma ou com as duas. Como tirar o caso das duas?",
        dica: "Junte num E o OU das chaves com o NÃO do E que você já tem. Esse E vai na soma.",
      },
      falaAoConcluir: { texto: "Quatro portões: um meio somador inteiro! Com vários deles em fila, dá para somar números grandes.", expressao: "comemorando" },
      solucaoDeTeste: [
        portao("somador", "ou", "ou1"),
        portao("somador", "nao", "nao1"),
        portao("somador", "e", "e2"),
        fio("somador", "a", "ou1", 0),
        fio("somador", "b", "ou1", 1),
        fio("somador", "e1", "nao1", 0),
        fio("somador", "ou1", "e2", 0),
        fio("somador", "nao1", "e2", 1),
        fio("somador", "e2", "soma", 0),
      ],
    },
    {
      id: "o-selo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Na memória, ligue a saída do E de volta na entrada livre do OU: a realimentação.",
        toque: "Na memória, ligue a saída do E de volta na entrada livre do OU: a realimentação.",
      },
      validador: { tipo: "circuitoLembra", estacao: "selo", saida: "luz", liga: "liga", desliga: "desliga" },
      ajudas: {
        pergunta: "O OU tem uma entrada sem fio. O que acontece se a própria luz entrar nela?",
        dica: "É o selo da contatora: a saída volta para segurar a entrada ligada, mesmo depois de soltar o botão.",
        linha: { alvo: "exposicao", estacao: "selo", peca: "e1", fala: "A saída deste E volta para o OU." },
        solucao: { fala: "Liguei a saída do E de volta no OU: a realimentação.", acoes: [fio("selo", "e1", "ou1", 1)] },
      },
      falaAoConcluir: { texto: "O circuito agora segura a si mesmo. Quem trabalha com quadro elétrico chama isso de selo.", expressao: "apontando" },
      solucaoDeTeste: [fio("selo", "e1", "ou1", 1)],
    },
    {
      id: "lembrou",
      tipo: "previsao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ligue a chave liga e depois desligue: confira o que a luz faz.",
        toque: "Ligue a chave liga e depois desligue: confira o que a luz faz.",
      },
      previsao: {
        pergunta: "Ligando e soltando o liga, o que a luz faz quando você solta?",
        opcoes: ["Apaga junto", "Fica acesa: lembrou"],
        correta: 1,
        explicacao: "A saída voltou para a entrada: o circuito se segura aceso até alguém apertar o desliga.",
      },
      validador: { tipo: "circuitoNaEstacao", estacao: "selo", agora: { entradas: { liga: false, desliga: false }, saidas: { luz: true } } },
      ajudas: {
        pergunta: "Depois de soltar o liga, quem continua mandando corrente para o OU?",
        dica: "Toque na chave liga duas vezes: liga e desliga. A luz deve ficar.",
      },
      falaAoConcluir: { texto: "A luz lembrou! Um circuito que guarda um bit: é a semente da memória.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "mexerNoCircuito", estacao: "selo", mudanca: { tipo: "chave", entrada: "liga", ligada: true } },
        { tipo: "mexerNoCircuito", estacao: "selo", mudanca: { tipo: "chave", entrada: "liga", ligada: false } },
      ],
    },
  ],
  conclusao: [
    { texto: "Com E, OU e NÃO dá para somar (o meio somador) e para lembrar (a realimentação).", expressao: "apontando" },
    { texto: "É o mesmo selo das contatoras dos comandos elétricos. Na trilha Automação, você vai ver ele de perto.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Procure um vídeo de \"selo de contatora\" (ou \"contato de selo\"). O botão liga é apertado e solto, e o motor continua ligado: o mesmo truque da luz que lembrou.",
  falaFinal: { texto: "Na Ilha Lógica, os portões viram &&, || e ! no JavaScript. Você vai reconhecer na hora.", expressao: "feliz" },
};

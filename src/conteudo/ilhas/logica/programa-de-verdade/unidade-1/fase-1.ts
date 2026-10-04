/*
 * Programa de verdade, U1, Fase 1: "A vitrine às seis da manhã".
 *
 * O QUE É: antes do contrato, o aluno conhece o lugar e os aparelhos (é a
 * primeira fase com cena da ilha publicada): a ficha do relógio, o tempo de
 * mentirinha andando no Console (esperar e relogio.hora), a campainha e o
 * loop de controle que roda o dia inteiro (while (true) com esperar). No
 * fim, sozinho, a campainha toca uma vez para cada pessoa que chega: a
 * mesma ideia do contador de clientes do contrato (lembrar se já tinha
 * gente na volta anterior).
 *
 * CONCEITOS: o acesso às propriedades de um objeto (os aparelhos são
 * objetos) e o loop que não termina de propósito (o loop de controle, que
 * para junto com a simulação). Os dois já existem no catálogo; aqui eles
 * voltam no mundo da cena.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { CENA_DIA_NA_PADARIA, DIA_DA_CENA } from "./cena";

export const CODIGO_LUZ_ABRE = ["while (true) {", "  if (relogio.hora >= 7) {", "    luz.ligar();", "  }", "  esperar(500);", "}"].join("\n");

export const CODIGO_CAMPAINHA_NA_PORTA = [
  "let tinhaGente = false;",
  "while (true) {",
  "  if (sensor.temGente && !tinhaGente) {",
  "    campainha.tocar();",
  "  }",
  "  tinhaGente = sensor.temGente;",
  "  esperar(500);",
  "}",
].join("\n");

const rodar = (codigo: string) => [{ tipo: "definirSnippet", codigo } as const, { tipo: "executarSnippet" } as const];

export const FASE_CONTRATO_LOGICA_F1: FasePratica = {
  id: "logica-programa-de-verdade-u1-f1",
  tipo: "pratica",
  unidadeId: "logica-programa-de-verdade-u1",
  titulo: "A vitrine às seis da manhã",
  conceitos: ["acesso-objeto-js", "loop-infinito"],
  pratica: ["if-js", "booleano-js"],
  revisa: ["while-js", "comparacao-js", "objeto-js"],
  prerequisitos: ["while-js", "if-js", "objeto-js"],
  areas: ["cena", "snippet", "palco"],
  cena: CENA_DIA_NA_PADARIA,
  usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"],
  apresentar: ["cena"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "vitrine.js" } },
  introducao: [
    { texto: "A Padaria Pão de Mel quer contratar você! Antes, vamos conhecer a vitrine: os aparelhos dela obedecem ao seu código.", expressao: "feliz" },
    { texto: "Aqui o tempo é de mentirinha: o dia vai das 6h às 21h e cada hora passa em 2 segundos. O relógio da parede conta.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "ficha-do-relogio",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["ficha-dispositivo"],
      enunciado: {
        mouse: "Clique no relógio da parede para abrir a ficha dele.",
        toque: "Toque no relógio da parede para abrir a ficha dele.",
      },
      validador: { tipo: "evento", evento: "abriuFicha" },
      ajudas: {
        pergunta: "Onde você descobre o que um aparelho sabe fazer antes de usar?",
        dica: "Todo aparelho da cena tem uma ficha, o manual dele: é só tocar nele.",
        linha: { alvo: "ferramenta", ferramenta: "ficha-dispositivo", fala: "O relógio está aqui, na parede da direita." },
        solucao: { fala: "Abri a ficha do relógio: ele só tem a propriedade hora, que o código lê.", acoes: [{ tipo: "abrirFicha", dispositivo: "relogio" }] },
      },
      falaAoConcluir: { texto: "O relógio é só de ler: quem muda a hora é o mundo. relogio.hora é um número de 0 a 23.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "abrirFicha", dispositivo: "relogio" }],
    },
    {
      id: "hora-no-console",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A cena começa às 6h e cada hora passa em 2 segundos. Depois de esperar(4000) no Console, quanto vale relogio.hora?",
        opcoes: ["6", "8", "10"],
        correta: 1,
        explicacao: "4000 milissegundos são 2 horas da cena: 6h mais 2 horas dá 8h. O esperar só avança o relógio de mentirinha.",
      },
      enunciado: {
        mouse: "No Console, rode esperar(4000) e depois relogio.hora.",
        toque: "No Console, rode esperar(4000) e depois relogio.hora.",
      },
      validador: { tipo: "respostaDoConsole", valor: 8 },
      ajudas: {
        pergunta: "O que o Console responde quando você pede o valor de uma propriedade?",
        dica: "Primeiro esperar(4000) faz o tempo andar. Depois, relogio.hora, sozinho na linha, mostra a hora.",
        linha: { alvo: "console", fala: "Escreva aqui embaixo, uma linha de cada vez." },
        solucao: {
          fala: "Rodei esperar(4000) e depois relogio.hora: deu 8.",
          acoes: [
            { tipo: "executarNoConsole", codigo: "esperar(4000)" },
            { tipo: "executarNoConsole", codigo: "relogio.hora" },
          ],
        },
      },
      falaAoConcluir: { texto: "8h! O Console continua o dia de onde ele parou, como a memória. O Executar do Snippet recomeça o dia às 6h.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "executarNoConsole", codigo: "esperar(4000)" },
        { tipo: "executarNoConsole", codigo: "relogio.hora" },
      ],
    },
    {
      id: "plim",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ainda no Console, faça a campainha tocar com campainha.tocar().",
        toque: "Ainda no Console, faça a campainha tocar com campainha.tocar().",
      },
      validador: { tipo: "sequenciaNaCena", dispositivo: "campainha", eventos: [{ acao: "tocar" }] },
      ajudas: {
        pergunta: "Como se manda um objeto fazer alguma coisa no JavaScript?",
        dica: "O nome do objeto, um ponto e o comando com parênteses: campainha.tocar()",
        linha: { alvo: "console", fala: "Aqui no Console mesmo." },
        solucao: { fala: "Rodei campainha.tocar(): plim!", acoes: [{ tipo: "executarNoConsole", codigo: "campainha.tocar()" }] },
      },
      falaAoConcluir: { texto: "Plim! É esse som que vai avisar a Dona Celeste que o forno esquentou.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "campainha.tocar()" }],
    },
    {
      id: "luz-na-abertura",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["velocidade-simulacao"],
      enunciado: {
        mouse: "No Snippet, faça um while (true) que liga a luz quando relogio.hora for 7 ou mais, com esperar(500) no fim de cada volta. Execute.",
        toque: "No Snippet, faça um while (true) que liga a luz quando relogio.hora for 7 ou mais, com esperar(500) no fim de cada volta. Execute.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "estadoNaCena", dispositivo: "luz", propriedade: "ligada", valor: false, noTempo: 1_500 },
          { tipo: "estadoNaCena", dispositivo: "luz", propriedade: "ligada", valor: true, noTempo: 2_600 },
          { tipo: "usouSintaxe", sintaxe: "while" },
        ],
      },
      ajudas: {
        pergunta: "Um if sozinho olha o relógio uma vez só, às 6h. Como fazer o programa olhar de novo o dia inteiro?",
        dica: "Um loop que não termina: while (true). Dentro, o if com relogio.hora >= 7 e, no fim, esperar(500) para o tempo andar meia hora.",
        linha: { alvo: "snippet", linhas: [1], fala: "Comece aqui: o while (true) por fora, o if e o esperar por dentro." },
        solucao: { fala: "Fiz o loop: a cada meia hora ele olha o relógio e, das 7h em diante, liga a luz.", acoes: rodar(CODIGO_LUZ_ABRE) },
      },
      falaAoConcluir: {
        texto: "Esse é o loop de controle: ele não termina nunca de propósito, e para junto com o fim do dia da simulação. Sem o esperar, o tempo não andaria.",
        expressao: "comemorando",
      },
      solucaoDeTeste: rodar(CODIGO_LUZ_ABRE),
    },
    {
      id: "plim-na-porta",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Sozinho: troque o programa para a campainha tocar uma vez cada vez que alguém chega na porta (4 pessoas, 4 plins).",
        toque: "Sozinho: troque o programa para a campainha tocar uma vez cada vez que alguém chega na porta (4 pessoas, 4 plins).",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "reagiu", quando: { dispositivo: "sensor", propriedade: "temGente", valor: true }, entao: { dispositivo: "campainha", acao: "tocar" }, prazoMs: 600 },
          { tipo: "sequenciaNaCena", dispositivo: "campainha", exata: true, eventos: DIA_DA_CENA.map(() => ({ acao: "tocar" })) },
        ],
      },
      ajudas: {
        pergunta: "Se a pessoa fica parada na porta por meia hora, quantas voltas do loop veem sensor.temGente valendo true?",
        dica: "Guarde numa variável se tinha gente na volta anterior. Só toque quando tem gente agora e não tinha antes.",
      },
      falaAoConcluir: { texto: "Uma vez por pessoa! Lembrar da volta anterior é o truque para contar quem chega. Guarda esse: o contrato vai pedir.", expressao: "comemorando" },
      solucaoDeTeste: rodar(CODIGO_CAMPAINHA_NA_PORTA),
    },
  ],
  conclusao: [
    { texto: "Você já lê o relógio, toca a campainha e mantém um loop rodando o dia inteiro. É tudo o que o trabalho vai pedir.", expressao: "comemorando" },
    { texto: "A Dona Celeste está chegando para contratar você. Vamos ouvir o que ela quer?", expressao: "feliz" },
  ],
  falaFinal: { texto: "O forno, o letreiro e o sensor também obedecem: abra as fichas deles quando quiser.", expressao: "feliz" },
};

/*
 * Bancada das cenas programáveis: fases de LABORATÓRIO do motor de cenas
 * (src/motor/cena), fora do currículo (só no /lab/fases?fase=<id>). Uma
 * missão em cada cena de referência:
 * - f1, o quarto à noite: acender, ler a ficha (e o por dentro), prever o
 *   liga-e-desliga sem esperar e fazer a lâmpada piscar 3 vezes no ritmo
 *   (loop e esperar), com a velocidade da simulação;
 * - f2, a vitrine da Padaria Pão de Mel: ler o sensor no Console andando no
 *   tempo, ver que um if sozinho roda uma vez só e acender a luz quando
 *   alguém se aproxima (if com o sensor dentro de um loop de controle),
 *   em várias linhas do tempo; depois, apagar quando a pessoa vai embora.
 * Modelo para as fases com cena das zonas da Lógica. Ver o guia, seção 30.
 */
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import type { AcontecimentoCena } from "@/motor/cena/modelo";
import type { Fase, FasePratica, Unidade, Validador } from "../tipos";
import { CENA_QUARTO, CENA_VITRINE } from "./cenasDeReferencia";

export const UNIDADE_BANCADA_CENAS: Unidade = {
  id: "lab-cenas-u1",
  ilha: "Laboratório",
  zona: "Bancada das cenas",
  numero: 1,
  titulo: "Programar o mundo",
  meta: { enunciado: "Controlar o mundo com código: piscar a lâmpada do quarto e acender a vitrine da padaria quando alguém chega." },
  fases: ["lab-cenas-u1-f1", "lab-cenas-u1-f2"],
};

const FERRAMENTAS_DA_CENA = ["cena", "ficha-dispositivo", "velocidade-simulacao", "snippet", "console", "palco-memoria", "linha-do-tempo"] as const;

/* ------------------------------------------------------------------ */
/* f1: o quarto à noite                                                */
/* ------------------------------------------------------------------ */

export const CODIGO_PISCAR = ["for (let vez = 1; vez <= 3; vez++) {", "  lampada.ligar();", "  esperar(500);", "  lampada.desligar();", "  esperar(500);", "}"].join("\n");

/** Piscou 3 vezes, meio segundo acesa e meio apagada (e não 4). */
export const PISCOU_3_VEZES: Validador = {
  tipo: "sequenciaNaCena",
  dispositivo: "lampada",
  exata: true,
  eventos: [
    { acao: "ligar" },
    { acao: "desligar", aposMs: 500 },
    { acao: "ligar", aposMs: 500 },
    { acao: "desligar", aposMs: 500 },
    { acao: "ligar", aposMs: 500 },
    { acao: "desligar", aposMs: 500 },
  ],
};

export const FASE_DEMO_QUARTO: FasePratica = {
  id: "lab-cenas-u1-f1",
  tipo: "pratica",
  unidadeId: "lab-cenas-u1",
  titulo: "A lâmpada do quarto",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  areas: ["cena", "snippet", "palco"],
  cena: CENA_QUARTO,
  usaFerramentas: [...FERRAMENTAS_DA_CENA],
  apresentar: ["cena"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "quarto.js" } },
  introducao: [
    { texto: "Este quarto é de mentirinha, mas a lâmpada obedece ao seu código de verdade.", expressao: "curioso" },
    { texto: "No código, ela se chama lampada. É um objeto: tem comandos, como ligar(), e propriedades, como ligada.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "acender",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Escreva lampada.ligar(); no Snippet e clique em Executar.",
        toque: "Escreva lampada.ligar(); no Snippet e toque em Executar.",
      },
      validador: { tipo: "estadoNaCena", dispositivo: "lampada", propriedade: "ligada", valor: true },
      ajudas: {
        pergunta: "Como se manda um objeto fazer alguma coisa no JavaScript?",
        dica: "O nome do objeto, um ponto e o comando com parênteses: lampada.ligar();",
        linha: { alvo: "snippet", linhas: [1], fala: "Escreva aqui, na primeira linha." },
        solucao: {
          fala: "Escrevi lampada.ligar(); e executei.",
          acoes: [
            { tipo: "definirSnippet", codigo: "lampada.ligar();" },
            { tipo: "executarSnippet" },
          ],
        },
      },
      falaAoConcluir: { texto: "Acendeu! O código mandou e a lâmpada obedeceu. Repare como a luz clareia o quarto.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: "lampada.ligar();" },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "ficha",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["ficha-dispositivo"],
      enunciado: {
        mouse: "Clique na lâmpada da cena para abrir a ficha dela e depois em Por dentro.",
        toque: "Toque na lâmpada da cena para abrir a ficha dela e depois em Por dentro.",
      },
      validador: { tipo: "evento", evento: "viuPorDentro" },
      ajudas: {
        pergunta: "Onde você descobre o que uma peça sabe fazer antes de usar?",
        dica: "Todo dispositivo da cena tem uma ficha: toque nele.",
        linha: { alvo: "ferramenta", ferramenta: "ficha-dispositivo", fala: "Toque na lâmpada, aqui na cena." },
        solucao: {
          fala: "Abri a ficha da lâmpada e o Por dentro.",
          acoes: [
            { tipo: "abrirFicha", dispositivo: "lampada" },
            { tipo: "verPorDentro", dispositivo: "lampada" },
          ],
        },
      },
      falaAoConcluir: { texto: "Ler a ficha antes de usar é o que todo programador faz. E por dentro tem um relé!", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "abrirFicha", dispositivo: "lampada" },
        { tipo: "verPorDentro", dispositivo: "lampada" },
      ],
    },
    {
      id: "sem-esperar",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O código liga e desliga, sem esperar nada entre os dois. O que você vê na cena?",
        opcoes: ["A lâmpada pisca rapidinho", "Nada: ela liga e desliga no mesmo instante", "Dá erro"],
        correta: 1,
        explicacao: "O tempo da cena só anda com esperar(ms). Sem ele, ligar e desligar acontecem no mesmo instante: ninguém veria a luz.",
      },
      enunciado: {
        mouse: "Troque o código por lampada.ligar(); lampada.desligar(); e clique em Executar.",
        toque: "Troque o código por lampada.ligar(); lampada.desligar(); e toque em Executar.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "usouSintaxe", sintaxe: "metodo:desligar" },
          { tipo: "sequenciaNaCena", dispositivo: "lampada", exata: true, eventos: [{ acao: "ligar" }, { acao: "desligar", aposMs: 0, toleranciaMs: 0 }] },
        ],
      },
      ajudas: {
        pergunta: "Quanto tempo passa entre uma linha e a outra, se ninguém manda esperar?",
        dica: "Duas linhas: lampada.ligar(); e lampada.desligar();",
        linha: { alvo: "snippet", linhas: [1, 2], fala: "Uma linha liga, a outra desliga." },
        solucao: {
          fala: "Liguei e desliguei, sem esperar.",
          acoes: [
            { tipo: "definirSnippet", codigo: "lampada.ligar();\nlampada.desligar();" },
            { tipo: "executarSnippet" },
          ],
        },
      },
      falaAoConcluir: { texto: "Viu? Nada! Na linha do tempo dá para ver os dois passos, mas os dois aconteceram no instante 0,0 s.", expressao: "curioso" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirSnippet", codigo: "lampada.ligar();\nlampada.desligar();" },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "piscar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Faça a lâmpada piscar 3 vezes: meio segundo acesa, meio apagada. Use um loop e esperar(500).",
        toque: "Faça a lâmpada piscar 3 vezes: meio segundo acesa, meio apagada. Use um loop e esperar(500).",
      },
      validador: { tipo: "todos", validadores: [PISCOU_3_VEZES, { tipo: "algum", validadores: [{ tipo: "usouSintaxe", sintaxe: "for" }, { tipo: "usouSintaxe", sintaxe: "while" }] }] },
      ajudas: {
        pergunta: "O que se repete três vezes? E onde entra o tempo?",
        dica: "Dentro de um for: ligar, esperar(500), desligar e esperar(500) de novo.",
      },
      falaAoConcluir: { texto: "Pisca, pisca, pisca! Loop e esperar: é assim que se faz um pisca-pisca de verdade.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: CODIGO_PISCAR },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "velocidade",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["velocidade-simulacao"],
      enunciado: {
        mouse: "Troque a velocidade da cena para 4x e toque a cena de novo, bem rápido.",
        toque: "Troque a velocidade da cena para 4x e toque a cena de novo, bem rápido.",
      },
      validador: { tipo: "evento", evento: "mudouVelocidade" },
      ajudas: {
        pergunta: "Dá para ver a cena mais rápido sem mudar o código?",
        dica: "Embaixo da cena: 1x, 2x e 4x.",
        linha: { alvo: "ferramenta", ferramenta: "velocidade-simulacao", fala: "Aqui, embaixo da cena." },
        solucao: { fala: "Troquei para 4x.", acoes: [{ tipo: "velocidadeCena", velocidade: 4 }] },
      },
      falaAoConcluir: { texto: "Em 4x a cena voa, mas o esperar(500) continua sendo meio segundo da cena.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "velocidadeCena", velocidade: 4 }],
    },
  ],
  conclusao: [{ texto: "O código mandou, a lâmpada obedeceu e o tempo andou com esperar.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo no quarto: o ventilador também obedece (velocidade de 0 a 3).", expressao: "feliz" },
};

/* ------------------------------------------------------------------ */
/* f2: a vitrine da Padaria Pão de Mel                                 */
/* ------------------------------------------------------------------ */

export const CODIGO_ACENDER = ["while (true) {", "  if (sensor.temGente) {", "    luz.ligar();", "  }", "  esperar(100);", "}"].join("\n");

export const CODIGO_VITRINE = ["while (true) {", "  if (sensor.temGente) {", "    luz.ligar();", "  } else {", "    luz.desligar();", "  }", "  esperar(100);", "}"].join("\n");

const CHEGOU: Validador = { tipo: "reagiu", quando: { dispositivo: "sensor", propriedade: "temGente", valor: true }, entao: { dispositivo: "luz", acao: "ligar" }, prazoMs: 500 };
const FOI_EMBORA: Validador = { tipo: "reagiu", quando: { dispositivo: "sensor", propriedade: "temGente", valor: false }, entao: { dispositivo: "luz", acao: "desligar" }, prazoMs: 500 };

/** Outras horas de chegada (uma pessoa por vez): quem decorou o segundo 3 não passa. */
export const CHEGADAS_DE_TESTE: AcontecimentoCena[][] = [
  [{ tipo: "pessoa", chegaMs: 1_500, saiMs: 4_000, x: 100 }],
  [{ tipo: "pessoa", chegaMs: 5_500, saiMs: 8_500, x: 140, lado: "direita" }],
  [{ tipo: "pessoa", chegaMs: 800, saiMs: 9_000, x: 120 }],
];

/** Duas pessoas, uma depois da outra: a luz precisa apagar e acender de novo. */
export const IDAS_E_VINDAS: AcontecimentoCena[][] = [
  [
    { tipo: "pessoa", chegaMs: 1_500, saiMs: 3_500, x: 96 },
    { tipo: "pessoa", chegaMs: 6_000, saiMs: 8_500, x: 140, lado: "direita" },
  ],
  [{ tipo: "pessoa", chegaMs: 4_000, saiMs: 6_000, x: 118 }],
];

export const FASE_DEMO_VITRINE: FasePratica = {
  id: "lab-cenas-u1-f2",
  tipo: "pratica",
  unidadeId: "lab-cenas-u1",
  titulo: "A vitrine que acende sozinha",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  areas: ["cena", "snippet", "palco"],
  cena: CENA_VITRINE,
  usaFerramentas: [...FERRAMENTAS_DA_CENA],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "vitrine.js" } },
  introducao: [
    { texto: "A Padaria Pão de Mel quer a vitrine acesa só quando tem alguém olhando: economiza luz e chama atenção.", expressao: "curioso" },
    { texto: "Em cima da porta tem um sensor de presença. No código ele se chama sensor, e a luz da vitrine, luz.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "ler-sensor",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "No Console, rode esperar(3500) e depois sensor.temGente, para ler o sensor no segundo 3,5.",
        toque: "No Console, rode esperar(3500) e depois sensor.temGente, para ler o sensor no segundo 3,5.",
      },
      validador: { tipo: "respostaDoConsole", valor: true },
      ajudas: {
        pergunta: "No começo da cena tem alguém na frente da vitrine? E no segundo 3,5?",
        dica: "esperar(3500) anda 3,5 segundos na cena. Depois, sensor.temGente diz o que o sensor vê agora.",
        linha: { alvo: "console", fala: "É no Console, uma linha de cada vez." },
        solucao: {
          fala: "Andei 3,5 segundos e li o sensor: tem gente!",
          acoes: [
            { tipo: "executarNoConsole", codigo: "esperar(3500)" },
            { tipo: "executarNoConsole", codigo: "sensor.temGente" },
          ],
        },
      },
      falaAoConcluir: { texto: "true! O sensor só lê o mundo no instante de agora. Antes do segundo 3, ele respondia false.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "executarNoConsole", codigo: "esperar(3500)" },
        { tipo: "executarNoConsole", codigo: "sensor.temGente" },
      ],
    },
    {
      id: "uma-vez",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se o programa for só if (sensor.temGente) luz.ligar(); a luz acende quando a pessoa chega, no segundo 3?",
        opcoes: ["Sim, no segundo 3", "Não: o if roda uma vez só, no segundo 0", "Só se a pessoa demorar"],
        correta: 1,
        explicacao: "O programa roda de cima para baixo uma vez. No segundo 0 ninguém está lá, o if dá falso e o programa acaba.",
      },
      enunciado: {
        mouse: "Escreva if (sensor.temGente) luz.ligar(); no Snippet, clique em Executar e olhe a cena.",
        toque: "Escreva if (sensor.temGente) luz.ligar(); no Snippet, toque em Executar e olhe a cena.",
      },
      validador: { tipo: "todos", validadores: [{ tipo: "usouSintaxe", sintaxe: "if" }, { tipo: "estadoNaCena", dispositivo: "luz", propriedade: "ligada", valor: false }] },
      ajudas: {
        pergunta: "Quantas vezes o if olha o sensor?",
        dica: "Uma linha só: if (sensor.temGente) luz.ligar();",
        linha: { alvo: "snippet", linhas: [1], fala: "Uma linha, aqui." },
        solucao: {
          fala: "Rodei o if sozinho: ele olhou uma vez, no segundo 0.",
          acoes: [
            { tipo: "definirSnippet", codigo: "if (sensor.temGente) luz.ligar();" },
            { tipo: "executarSnippet" },
          ],
        },
      },
      falaAoConcluir: { texto: "A pessoa chegou e a vitrine ficou apagada: o programa já tinha acabado. Precisa olhar o sensor de novo e de novo.", expressao: "curioso" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirSnippet", codigo: "if (sensor.temGente) luz.ligar();" },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "loop",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Acenda a luz quando alguém se aproximar: um while (true) com o if dentro e um esperar(100) no fim de cada volta.",
        toque: "Acenda a luz quando alguém se aproximar: um while (true) com o if dentro e um esperar(100) no fim de cada volta.",
      },
      validador: { tipo: "variosCenarios", linhasDoTempo: [CENA_VITRINE.linhaDoTempo, ...CHEGADAS_DE_TESTE], validador: CHEGOU },
      ajudas: {
        pergunta: "Um while (true) nunca acaba. O que faz ele parar aqui?",
        dica: "O tempo da cena: com esperar(100) em cada volta, o loop termina junto com a cena, depois de 10 segundos.",
        linha: { alvo: "snippet", linhas: [1, 2, 3, 4, 5], fala: "O loop inteiro: olhar, decidir, esperar." },
        solucao: {
          fala: "Pus o if dentro de um loop que espera 100 ms a cada volta.",
          acoes: [
            { tipo: "definirSnippet", codigo: CODIGO_ACENDER },
            { tipo: "executarSnippet" },
          ],
        },
      },
      falaAoConcluir: { texto: "Acendeu quando a pessoa chegou! Embaixo da cena, Teste 1, 2 e 3 mostram o mesmo código com gente chegando em outras horas.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: CODIGO_ACENDER },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "apagar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora apague a luz quando a pessoa for embora, para a vitrine ficar acesa só com alguém olhando.",
        toque: "Agora apague a luz quando a pessoa for embora, para a vitrine ficar acesa só com alguém olhando.",
      },
      validador: { tipo: "variosCenarios", linhasDoTempo: [CENA_VITRINE.linhaDoTempo, ...IDAS_E_VINDAS], validador: { tipo: "todos", validadores: [CHEGOU, FOI_EMBORA] } },
      ajudas: {
        pergunta: "Quando o if dá falso, o que o programa faz com a luz?",
        dica: "Um else, com luz.desligar();",
      },
      falaAoConcluir: { texto: "Um loop de controle de verdade: olhar, decidir, esperar, de novo. É assim que portões e vitrines funcionam.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: CODIGO_VITRINE },
        { tipo: "executarSnippet" },
      ],
    },
  ],
  conclusao: [{ texto: "A vitrine reage sozinha, com qualquer horário de chegada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo na vitrine: o letreiro também obedece (letreiro.mostrar(\"ABERTO\")).", expressao: "feliz" },
};

export const FASES_BANCADA_CENAS: readonly Fase[] = [FASE_DEMO_QUARTO, FASE_DEMO_VITRINE];

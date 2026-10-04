/*
 * Programa de verdade, U1, Fase 2: o CONTRATO da Ilha Lógica (o "TCC" do
 * fim da ilha). A Dona Celeste, da Padaria Pão de Mel, contrata o aluno para
 * automatizar a vitrine. Formato contrato (guia, seção 31): briefing com a
 * cara dela, requisitos escolhidos entre distrações (com lacunas que se
 * acham no documento), a tela composta inteira (cena, plano, código, palco
 * e casos de teste) com o checklist ao vivo, a mudança de pedido no meio,
 * a entrega e o Levar pro mundo.
 *
 * O PEDIDO (as partes do cliente):
 * - luz: acende às 7h (abertura) e apaga às 19h (fechamento);
 * - letreiro: uma promoção por hora, na ordem do documento, só com a
 *   padaria aberta (apagado antes de abrir);
 * - forno: liga às 6h e a campainha toca UMA vez quando chega a 180 graus
 *   (precisa lembrar que já avisou);
 * - contador: no fechamento, o letreiro mostra CLIENTES: e o total de quem
 *   entrou pela porta (conferido em três dias, com 4, 3 e 5 clientes).
 * O PROCESSO: o plano montado e no código, e a função aberta(hora) com
 * casos de teste do aluno, inclusive as bordas 7 e 19.
 *
 * A MUDANÇA (depois da luz e do letreiro prontos): a conta de luz assustou;
 * com a padaria aberta, uma hora sem ninguém na porta apaga a luz, e ela
 * acende de novo quando alguém chega. A parte nova toma o lugar da luz e é
 * conferida em três dias, em instantes com folga de meia hora para o ritmo
 * do loop. O código do antes (luz acesa o dia inteiro) não passa nela.
 */
import type { FaseDesafio, Validador } from "@/conteudo/tipos";
import type { AcontecimentoCena } from "@/motor/cena/modelo";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { CENA_DIA_NA_PADARIA, DIA_CALMO, DIA_CORRIDO, DIA_DA_CENA, DIAS_DE_TESTE } from "./cena";

/** As promoções do documento, na ordem (cabem no letreiro: até 16 letras). */
export const PROMOCOES = ["SONHO R$ 4", "PÃO QUEIJO R$ 3", "CAFÉ+BOLO R$ 8"];

const PLANO = [
  "// Plano: Vitrine automática",
  "// 1. Guardar as promoções e começar o contador de clientes em zero",
  "// 2. Ligar o forno no começo do dia",
  "// 3. Repetir o dia inteiro, de meia em meia hora",
  "// 4. Acender a luz se a padaria estiver aberta; senão, apagar",
  "// 5. Mostrar a promoção da hora ou, depois de fechar, o total de clientes",
  "// 6. Contar cada cliente que chega pelo sensor da porta",
  "// 7. Tocar a campainha uma vez quando o forno chegar a 180 graus",
  "// 8. Esperar meia hora",
].join("\n");

const ABERTA = ["function aberta(hora) {", "  return hora >= 7 && hora < 19;", "}"].join("\n");
const LISTA = `const promocoes = [${PROMOCOES.map((p) => JSON.stringify(p)).join(", ")}];`;

/** As soluções em camadas: cada parte acrescenta ao código da anterior (o plano fica sempre no topo). */
const CODIGO_LUZ = [PLANO, "", ABERTA, "", "while (true) {", "  if (aberta(relogio.hora)) {", "    luz.ligar();", "  } else {", "    luz.desligar();", "  }", "  esperar(500);", "}"].join("\n");

const CODIGO_LETREIRO = [
  PLANO,
  "",
  ABERTA,
  "",
  LISTA,
  "",
  "while (true) {",
  "  const hora = relogio.hora;",
  "  if (aberta(hora)) {",
  "    luz.ligar();",
  "    letreiro.mostrar(promocoes[(hora - 7) % promocoes.length]);",
  "  } else {",
  "    luz.desligar();",
  "  }",
  "  esperar(500);",
  "}",
].join("\n");

const CODIGO_FORNO = [
  PLANO,
  "",
  ABERTA,
  "",
  LISTA,
  "let avisou = false;",
  "forno.ligar();",
  "",
  "while (true) {",
  "  const hora = relogio.hora;",
  "  if (aberta(hora)) {",
  "    luz.ligar();",
  "    letreiro.mostrar(promocoes[(hora - 7) % promocoes.length]);",
  "  } else {",
  "    luz.desligar();",
  "  }",
  "  if (!avisou && forno.temperatura >= 180) {",
  "    campainha.tocar();",
  "    avisou = true;",
  "  }",
  "  esperar(500);",
  "}",
].join("\n");

/** O código do antes: o pedido do começo inteiro (a luz fica acesa o dia todo). */
export const CODIGO_PADARIA_ANTES = [
  PLANO,
  "",
  ABERTA,
  "",
  LISTA,
  "let clientes = 0;",
  "let tinhaGente = false;",
  "let avisou = false;",
  "forno.ligar();",
  "",
  "while (true) {",
  "  const hora = relogio.hora;",
  "  if (aberta(hora)) {",
  "    luz.ligar();",
  "    letreiro.mostrar(promocoes[(hora - 7) % promocoes.length]);",
  "  } else {",
  "    luz.desligar();",
  '    if (hora >= 19) letreiro.mostrar("CLIENTES: " + clientes);',
  "  }",
  "  if (sensor.temGente && !tinhaGente) clientes = clientes + 1;",
  "  tinhaGente = sensor.temGente;",
  "  if (!avisou && forno.temperatura >= 180) {",
  "    campainha.tocar();",
  "    avisou = true;",
  "  }",
  "  esperar(500);",
  "}",
].join("\n");

/** O código do depois: a luz apaga depois de uma hora (2000 ms) sem ninguém e acende quando alguém chega. */
export const CODIGO_PADARIA_DEPOIS = [
  PLANO,
  "",
  ABERTA,
  "",
  LISTA,
  "let clientes = 0;",
  "let tinhaGente = false;",
  "let avisou = false;",
  "let semNinguem = 0;",
  "forno.ligar();",
  "",
  "while (true) {",
  "  const hora = relogio.hora;",
  "  if (aberta(hora)) {",
  "    if (sensor.temGente) {",
  "      semNinguem = 0;",
  "    } else {",
  "      semNinguem = semNinguem + 500;",
  "    }",
  "    if (semNinguem <= 2000) {",
  "      luz.ligar();",
  "    } else {",
  "      luz.desligar();",
  "    }",
  "    letreiro.mostrar(promocoes[(hora - 7) % promocoes.length]);",
  "  } else {",
  "    luz.desligar();",
  "    semNinguem = 0;",
  '    if (hora >= 19) letreiro.mostrar("CLIENTES: " + clientes);',
  "  }",
  "  if (sensor.temGente && !tinhaGente) clientes = clientes + 1;",
  "  tinhaGente = sensor.temGente;",
  "  if (!avisou && forno.temperatura >= 180) {",
  "    campainha.tocar();",
  "    avisou = true;",
  "  }",
  "  esperar(500);",
  "}",
].join("\n");

const rodar = (codigo: string) => [{ tipo: "definirSnippet", codigo } as const, { tipo: "executarSnippet" } as const];

/** A luz num instante (ms), acesa ou não. */
const luzEm = (ms: number, valor: boolean): Validador => ({ tipo: "estadoNaCena", dispositivo: "luz", propriedade: "ligada", valor, noTempo: ms });
const conferirLuz = (pontos: [number, boolean][]): Validador => ({ tipo: "todos", validadores: pontos.map(([ms, valor]) => luzEm(ms, valor)) });

/**
 * Os instantes conferidos da luz depois da mudança, em cada dia de teste:
 * pelo menos 1,1 s (meia hora e mais um pouco) depois de cada troca ideal e
 * longe da troca seguinte, para valer qualquer ritmo de loop até meia hora.
 */
const LUZ_NOS_DIAS: Record<string, [number, boolean][]> = {
  cena: [[2_600, true], [3_500, true], [5_000, true], [7_200, false], [9_600, true], [11_000, true], [13_200, false], [15_500, true], [19_300, false], [21_600, true], [25_200, false]],
  calmo: [[2_600, true], [5_100, false], [6_600, true], [7_500, true], [9_000, true], [11_200, false], [16_500, false], [17_600, true], [19_000, true], [21_200, false]],
  corrido: [[2_600, true], [3_300, true], [5_000, true], [7_700, false], [8_600, true], [12_700, false], [14_500, true], [18_200, false], [24_500, true]],
};

const quantosClientes = (dia: AcontecimentoCena[]) => dia.filter((item) => item.tipo === "pessoa").length;

export const FASE_CONTRATO_LOGICA: FaseDesafio = {
  id: "logica-programa-de-verdade-u1-f2",
  tipo: "desafio",
  unidadeId: "logica-programa-de-verdade-u1",
  titulo: "O contrato da padaria",
  conceitos: ["acesso-objeto-js", "loop-infinito"],
  revisa: [
    "while-js",
    "if-js",
    "else-js",
    "condicao-composta",
    "comparacao-js",
    "booleano-js",
    "contador-js",
    "contador-condicional",
    "array-js",
    "indice-lista-js",
    "concatenacao-js",
    "funcao-js",
    "decompor-problema",
    "plano-comentado",
    "exemplos-de-teste",
    "casos-de-borda",
  ],
  prerequisitos: ["while-js", "if-js", "funcao-js", "array-js", "contador-condicional"],
  areas: ["cena", "plano", "snippet", "palco", "testes"],
  cena: CENA_DIA_NA_PADARIA,
  plano: {
    modo: "ordenar",
    problema: "Vitrine automática",
    cartoes: [
      { id: "inicio", texto: "Guardar as promoções e começar o contador de clientes em zero" },
      { id: "forno", texto: "Ligar o forno no começo do dia" },
      { id: "repetir", texto: "Repetir o dia inteiro, de meia em meia hora", depoisDe: ["inicio", "forno"] },
      { id: "luz", texto: "Acender a luz se a padaria estiver aberta; senão, apagar", depoisDe: ["repetir"] },
      { id: "letreiro", texto: "Mostrar a promoção da hora ou, depois de fechar, o total de clientes", depoisDe: ["repetir"] },
      { id: "contar", texto: "Contar cada cliente que chega pelo sensor da porta", depoisDe: ["repetir"] },
      { id: "avisar", texto: "Tocar a campainha uma vez quando o forno chegar a 180 graus", depoisDe: ["repetir"] },
      { id: "esperar", texto: "Esperar meia hora", depoisDe: ["luz", "letreiro", "contar", "avisar"] },
      { id: "fachada", texto: "Pintar a fachada de azul", sobra: true },
      { id: "site", texto: "Montar um site com fotos da padaria", sobra: true },
    ],
  },
  testes: { funcao: "aberta", parametros: ["hora"] },
  usaFerramentas: ["cena", "ficha-dispositivo", "velocidade-simulacao", "quadro-de-passos", "plano-no-codigo", "snippet", "console", "palco-memoria", "linha-do-tempo", "casos-de-teste"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: "", nome: "vitrine.js" } },
  introducao: [
    { texto: "Chegou cliente! A Dona Celeste, da Padaria Pão de Mel, quer a vitrine funcionando sozinha.", expressao: "comemorando" },
    { texto: "Eu sou o colega da mesa ao lado: pergunto e lembro do processo. Primeiro a gente escuta, depois separa o pedido do papo.", expressao: "curioso" },
  ],
  contrato: {
    cliente: "dona-celeste",
    projeto: "Vitrine automática",
    briefing: [
      { texto: "Bom dia, meu bem! Sou a Celeste, da Padaria Pão de Mel. Me disseram que você mexe com esses programas de computador.", expressao: "feliz" },
      { texto: "Olha, eu abro às 7 e fecho às 7 da noite. E toda manhã é uma correria: ligar a luz, trocar o letreiro, olhar o forno...", expressao: "preocupado" },
      { texto: "Queria a vitrine se virando sozinha! A luz acende quando abre e apaga quando fecha. E o letreiro vai mostrando as promoções.", expressao: "empolgado" },
      { texto: "Ah, e o forno! Ele tem que ligar cedinho, às 6. Quando chegar nos 180 graus, a campainha toca uma vez pra eu pôr o pão.", expressao: "pensativo" },
      { texto: "Minha sobrinha diz que eu devia pintar a fachada de azul. E o vizinho tem um site cheio de foto... mas isso fica pra outro dia.", expressao: "pensativo" },
      { texto: "E no fim do dia eu queria saber quantos clientes entraram. Aparece no letreiro, tipo CLIENTES: 12, que eu anoto no caderno.", expressao: "feliz" },
    ],
    documento: {
      titulo: "Pedido da Dona Celeste",
      paragrafos: [
        "A padaria abre às 7h e fecha às 19h. A luz da vitrine acende quando abre e apaga quando fecha.",
        `O letreiro mostra as promoções do dia, uma por hora, nesta ordem, e depois volta pro começo: ${PROMOCOES.join(", ")}. Antes de abrir, fica apagado.`,
        "O forno liga sozinho às 6h, quando o dia começa. Quando ele chegar a 180 graus, a campainha toca uma vez só, pra me avisar.",
        "No fechamento, o letreiro mostra quantos clientes entraram pela porta no dia, assim: CLIENTES: 12.",
        "Um dia quero pintar a fachada de azul e ter um site com fotos, mas isso fica pra depois.",
      ],
    },
    requisitos: {
      cartoes: [
        {
          id: "luz",
          texto: "A luz da vitrine acende às ___ e apaga às ___",
          parte: "luz",
          lacunas: [
            { opcoes: ["6h", "7h", "8h"], correta: 1 },
            { opcoes: ["18h", "19h", "20h"], correta: 1 },
          ],
          porque: "Ela abre às 7h e fecha às 19h (as 7 da noite): a luz acompanha o horário da padaria.",
        },
        {
          id: "letreiro",
          texto: "O letreiro mostra as promoções do documento, uma por hora, só com a padaria aberta",
          parte: "letreiro",
          porque: "Ela pediu as promoções passando no letreiro, na ordem da lista, e apagado antes de abrir.",
        },
        {
          id: "forno",
          texto: "O forno liga às 6h e a campainha toca uma vez quando ele chega a ___ graus",
          parte: "forno",
          lacunas: [{ opcoes: ["150", "180", "220"], correta: 1 }],
          porque: "O aviso é na temperatura de pôr o pão: 180 graus, e uma vez só.",
        },
        {
          id: "contador",
          texto: "No fechamento, o letreiro mostra o total de clientes, assim: ___",
          parte: "contador",
          lacunas: [{ opcoes: ["CLIENTES: 12", "12 CLIENTES", "OBRIGADO!"], correta: 0 }],
          porque: "Ela quer anotar no caderno quantos clientes entraram, no formato CLIENTES: 12.",
        },
        { id: "fachada", texto: "Pintar a fachada de azul", sobra: true, porque: "Quem sugeriu foi a sobrinha, e é trabalho de pintor, não de programa." },
        { id: "site", texto: "Fazer um site com fotos da padaria", sobra: true, porque: "Ela falou do site do vizinho, mas disse que fica pra outro dia." },
        { id: "pao-pronto", texto: "Avisar quando o pão ficar pronto", sobra: true, porque: "O aviso que ela pediu é quando o forno esquenta (180 graus), não quando o pão assa." },
      ],
    },
    mudanca: {
      depoisDe: ["luz", "letreiro"],
      mensagem: [
        { texto: "Oi, sou eu de novo! Ficou lindo, mas a conta de luz me assustou: a vitrine fica acesa o dia inteiro, mesmo sem ninguém na rua.", expressao: "preocupado" },
        { texto: "Dá pra luz apagar sozinha quando passar uma hora sem ninguém na porta? E acender de novo quando alguém chegar.", expressao: "pensativo" },
        { texto: "Mas na hora de abrir ela acende, viu? E fechou, apaga, igualzinho antes!", expressao: "empolgado" },
      ],
      adendo:
        "Mensagem da Dona Celeste: com a padaria aberta, se passar 1 hora sem ninguém na porta, a luz apaga; quando alguém chega, acende de novo. Na abertura ela acende e no fechamento apaga, como antes.",
      novas: [{ parte: "luz-movimento", substitui: "luz" }],
    },
    entrega: {
      reacao: [
        { texto: "Ai, que beleza! Tudo escrito direitinho, até o que eu mudei no meio do caminho. Parece relatório de banco!", expressao: "satisfeito" },
        { texto: "Amanhã cedo eu já ligo isso na vitrine. E o pão de queijo da semana é por minha conta!", expressao: "feliz" },
      ],
    },
    levarProMundo: { arquivo: "vitrine-pao-de-mel.js" },
  },
  partes: [
    {
      id: "plano",
      descricao: "O plano do programa está montado (sem as distrações) e no código, como comentários",
      validador: { tipo: "todos", validadores: [{ tipo: "ordemValida" }, { tipo: "planoComentado" }] },
      revisarEm: "logica-resolvendo-problemas-u1-f3",
      pergunta: "Antes do código: quais passos o programa repete o dia inteiro, e quais acontecem uma vez só, de manhã?",
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "inicio" },
        { tipo: "porPasso", passo: "forno" },
        { tipo: "porPasso", passo: "repetir" },
        { tipo: "porPasso", passo: "luz" },
        { tipo: "porPasso", passo: "letreiro" },
        { tipo: "porPasso", passo: "contar" },
        { tipo: "porPasso", passo: "avisar" },
        { tipo: "porPasso", passo: "esperar" },
        { tipo: "levarPlanoProCodigo" },
      ],
    },
    {
      id: "luz",
      descricao: "A luz da vitrine acende às 7h e apaga às 19h",
      validador: {
        tipo: "sequenciaNaCena",
        dispositivo: "luz",
        exata: true,
        eventos: [
          { acao: "ligar", aposMs: 2_000, toleranciaMs: 600 },
          { acao: "desligar", aposMs: 24_000, toleranciaMs: 800 },
        ],
      },
      revisarEm: "logica-programa-de-verdade-u1-f1",
      pergunta: "Que hora o relogio.hora marca às 7h30? E às 19h, a padaria ainda está aberta?",
      solucaoDeTeste: rodar(CODIGO_LUZ),
    },
    {
      id: "letreiro",
      descricao: "O letreiro mostra as promoções, uma por hora, na ordem, só com a padaria aberta",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: "", noTempo: 1_000 },
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: PROMOCOES[0], noTempo: 3_000 },
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: PROMOCOES[1], noTempo: 5_000 },
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: PROMOCOES[2], noTempo: 7_000 },
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: PROMOCOES[0], noTempo: 9_000 },
          { tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: PROMOCOES[2], noTempo: 25_000 },
        ],
      },
      revisarEm: "logica-listas-e-objetos-u1-f1",
      pergunta: "Às 10h, qual promoção é a da vez? Que conta leva a hora até a posição certa da lista, e volta pro começo?",
      solucaoDeTeste: rodar(CODIGO_LETREIRO),
    },
    {
      id: "forno",
      descricao: "O forno liga às 6h e a campainha toca uma vez só, quando ele chega a 180 graus",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "estadoNaCena", dispositivo: "forno", propriedade: "ligado", valor: true, noTempo: 1_000 },
          { tipo: "sequenciaNaCena", dispositivo: "campainha", exata: true, eventos: [{ acao: "tocar", aposMs: 3_875, toleranciaMs: 600 }] },
        ],
      },
      revisarEm: "logica-programa-de-verdade-u1-f1",
      pergunta: "Se o loop olha o forno a cada meia hora, o que impede a campainha de tocar de novo na volta seguinte?",
      solucaoDeTeste: rodar(CODIGO_FORNO),
    },
    {
      id: "contador",
      descricao: "No fechamento, o letreiro mostra CLIENTES: e o total de clientes do dia",
      validador: {
        tipo: "variosCenarios",
        linhasDoTempo: DIAS_DE_TESTE,
        validador: { tipo: "estadoNaCena", dispositivo: "luz", propriedade: "ligada", valor: false, noTempo: 28_000 },
        porLinha: DIAS_DE_TESTE.map((dia) => ({ tipo: "estadoNaCena", dispositivo: "letreiro", propriedade: "texto", valor: `CLIENTES: ${quantosClientes(dia)}`, noTempo: 28_000 })),
      },
      revisarEm: "logica-repeticao-u3-f2",
      pergunta: "Uma pessoa parada na porta por meia hora conta como quantos clientes? Como saber que ela acabou de chegar?",
      solucaoDeTeste: rodar(CODIGO_PADARIA_ANTES),
    },
    {
      id: "testes",
      descricao: "A função aberta(hora) tem casos de teste seus, com as bordas 7 e 19, passando",
      validador: {
        tipo: "todos",
        validadores: [
          {
            tipo: "funcaoPassa",
            nome: "aberta",
            casos: [
              { args: [6], esperado: false },
              { args: [7], esperado: true },
              { args: [12], esperado: true },
              { args: [18], esperado: true },
              { args: [19], esperado: false },
              { args: [20], esperado: false },
            ],
          },
          {
            tipo: "casosDoAluno",
            minimo: 4,
            incluir: [
              { args: [7], esperado: true, rotulo: "a abertura, às 7" },
              { args: [19], esperado: false, rotulo: "o fechamento, às 19" },
            ],
            passando: true,
          },
        ],
      },
      revisarEm: "logica-resolvendo-problemas-u4-f1",
      pergunta: "Você já testou a função aberta com 7 e com 19? Em qual das duas a padaria ainda está aberta?",
      solucaoDeTeste: [
        { tipo: "escreverCaso", entrada: "6", esperado: "false" },
        { tipo: "escreverCaso", entrada: "7", esperado: "true" },
        { tipo: "escreverCaso", entrada: "12", esperado: "true" },
        { tipo: "escreverCaso", entrada: "19", esperado: "false" },
        { tipo: "rodarCasos" },
      ],
    },
    {
      id: "luz-movimento",
      descricao: "Aberta, a luz apaga depois de 1 hora sem ninguém e acende quando alguém chega; abre e fecha como antes",
      validador: {
        tipo: "variosCenarios",
        linhasDoTempo: DIAS_DE_TESTE,
        validador: conferirLuz([
          [1_000, false],
          [27_000, false],
        ]),
        porLinha: [conferirLuz(LUZ_NOS_DIAS.cena), conferirLuz(LUZ_NOS_DIAS.calmo), conferirLuz(LUZ_NOS_DIAS.corrido)],
      },
      revisarEm: "logica-repeticao-u1-f2",
      pergunta: "Você já testou com a vitrine vazia logo cedo? A hora sem ninguém começa a contar de quando?",
      solucaoDeTeste: rodar(CODIGO_PADARIA_DEPOIS),
    },
  ],
  conclusao: [
    { texto: "Contrato entregue! Você escutou a cliente, separou o pedido do papo, planejou, programou, testou e ainda aguentou a mudança.", expressao: "comemorando" },
    { texto: "Agora leve o programa pro mundo: ele roda no Console de qualquer navegador, fora do jogo. Toque em Levar pro mundo.", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Abra o Console de qualquer site (F12), cole o arquivo vitrine-pao-de-mel.js que você baixou e veja a vitrine rodar fora do jogo. Depois troque a lista de promoções e rode de novo.",
  falaFinal: { texto: "A Ilha Lógica fecha aqui. As próximas ilhas também terminam com um cliente de verdade.", expressao: "feliz" },
};

/** Os dias de teste, nomeados (para os testes conferirem as contagens). */
export const DIAS_NOMEADOS = { cena: DIA_DA_CENA, calmo: DIA_CALMO, corrido: DIA_CORRIDO };

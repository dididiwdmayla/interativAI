/*
 * Lógica U1, Fase 2: "Caixinhas com nome: let" (ainda a Padaria Pão de Mel).
 *
 * O QUE ENSINA: guardar um valor numa variável com let (a caixinha com
 * nome que aparece no palco), o undefined que o Console responde depois de
 * uma declaração e trocar o valor da caixinha (sem let de novo).
 *
 * ORDEM: criar a primeira caixinha (guiado, apresenta nada: o palco já foi
 * apresentado na Fase 1 e aqui ganha a primeira caixinha), a previsão do
 * undefined (a confusão "undefined é erro"), usar as caixinhas numa conta
 * (guiado) e trocar o valor sozinho (a caixinha pisca).
 *
 * VALIDADORES: `valorVariavel` (o estado da memória agora) com
 * `usouSintaxe: let`; `respostaDoConsole` na conta com as caixinhas.
 *
 * REVISÃO ESPAÇADA: operações de conta (Fase 1), na conta do objetivo 3.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U1_F2: FasePratica = {
  id: "logica-primeiros-comandos-u1-f2",
  tipo: "pratica",
  unidadeId: "logica-primeiros-comandos-u1",
  titulo: "Caixinhas com nome: let",
  conceitos: ["variavel-let", "undefined-js"],
  revisa: ["operacoes-aritmeticas"],
  prerequisitos: ["console-js"],
  usaFerramentas: ["console", "palco-memoria"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {},
  introducao: [
    { texto: "Uma variável é uma caixinha com nome: você guarda um valor nela e usa o nome depois, quantas vezes quiser.", expressao: "curioso" },
    { texto: "Olho no palco: cada caixinha que você criar aparece lá, com o nome, o valor e o tipo.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "primeira-caixinha",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Guarde o preço do pão: escreva let precoDoPao = 0.80 no Console.", toque: "Guarde o preço do pão: escreva let precoDoPao = 0.80 no Console." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorVariavel", nome: "precoDoPao", valor: 0.8 },
          { tipo: "usouSintaxe", sintaxe: "let" },
        ],
      },
      ajudas: {
        pergunta: "Qual palavra cria uma caixinha nova no JavaScript?",
        dica: "let, depois o nome da caixinha, o sinal de igual e o valor: let nome = valor.",
        linha: { alvo: "console", fala: "Escreva a linha inteira aqui: let precoDoPao = 0.80" },
        solucao: { fala: "Criei a caixinha precoDoPao com 0.80. Olha ela no palco!", acoes: [{ tipo: "executarNoConsole", codigo: "let precoDoPao = 0.80" }] },
      },
      falaAoConcluir: { texto: "Nasceu a caixinha! O = aqui não é o igual da matemática: é guardar. A caixinha recebe o 0.80.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let precoDoPao = 0.80" }],
    },
    {
      id: "o-undefined",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Você vai escrever let quantidade = 3. O que o Console responde?",
        opcoes: ["3", "quantidade", "undefined"],
        correta: 2,
        explicacao: "undefined: a linha só guardou o 3 na caixinha, e o Console não tem valor para mostrar. Não é erro!",
      },
      enunciado: { mouse: "Confira: crie let quantidade = 3.", toque: "Confira: crie let quantidade = 3." },
      validador: { tipo: "valorVariavel", nome: "quantidade", valor: 3 },
      ajudas: {
        pergunta: "Uma linha que só guarda um valor tem alguma resposta para mostrar?",
        dica: "Depois de let, o Console responde undefined, que quer dizer não tem valor aqui.",
        linha: { alvo: "console", fala: "Escreva aqui: let quantidade = 3" },
        solucao: { fala: "Criei a caixinha quantidade. O Console respondeu undefined, e o 3 foi para o palco.", acoes: [{ tipo: "executarNoConsole", codigo: "let quantidade = 3" }] },
      },
      falaAoConcluir: { texto: "Viu o undefined? É o Console dizendo que a linha não tem resposta, só guardou. No Chrome é igual.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "executarNoConsole", codigo: "let quantidade = 3" },
      ],
    },
    {
      id: "conta-com-caixinhas",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Calcule o valor dos pães usando os nomes: precoDoPao * quantidade.", toque: "Calcule o valor dos pães usando os nomes: precoDoPao * quantidade." },
      validador: { tipo: "respostaDoConsole", valor: 2.4 },
      ajudas: {
        pergunta: "Dá para fazer conta com o nome da caixinha em vez do número?",
        dica: "Dá! O JavaScript troca cada nome pelo valor guardado e faz a conta.",
        linha: { alvo: "console", fala: "Escreva a conta com os dois nomes aqui." },
        solucao: { fala: "Rodei precoDoPao * quantidade: 0.80 vezes 3.", acoes: [{ tipo: "executarNoConsole", codigo: "precoDoPao * quantidade" }] },
      },
      falaAoConcluir: { texto: "2.4000000000000004? O computador guarda decimais com um restinho. Vale 2,40, e mais tarde a gente arredonda.", expressao: "pensativo" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "precoDoPao * quantidade" }],
    },
    {
      id: "trocar-a-quantidade",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "O cliente quer 5 pães. Troque o valor da caixinha quantidade para 5.", toque: "O cliente quer 5 pães. Troque o valor da caixinha quantidade para 5." },
      validador: { tipo: "valorVariavel", nome: "quantidade", valor: 5 },
      ajudas: {
        pergunta: "A caixinha já existe. Precisa criar de novo ou só guardar outro valor nela?",
        dica: "Para trocar, é o nome, o = e o valor novo. O let é só para criar.",
      },
      falaAoConcluir: { texto: "A caixinha piscou: o 3 saiu e o 5 entrou. Uma caixinha de let guarda um valor por vez.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "quantidade = 5" }],
    },
  ],
  conclusao: [
    { texto: "Agora a memória lembra: as caixinhas ficam no palco e você usa os nomes nas contas.", expressao: "comemorando" },
    { texto: "Mas tem valor que não devia mudar nunca, como uma taxa. Para isso existe o const: próxima fase!", expressao: "curioso" },
  ],
  missaoDeCampo:
    "No Console de qualquer site, crie let meuNome = 'seu nome, entre aspas' e depois escreva só meuNome. O Console lembra o que você guardou até a página recarregar.",
  falaFinal: { texto: "Toda variável que você cria num site vive até a página recarregar. Aqui no jogo, ela fica salva com a fase.", expressao: "feliz" },
};

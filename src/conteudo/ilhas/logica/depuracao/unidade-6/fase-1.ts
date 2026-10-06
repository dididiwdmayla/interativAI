/*
 * Chamado 2, aquecimento: o conserto que quebrou o resto.
 *
 * O QUE ENSINA: teste de regressão. Um colega consertou o grupo de 4 pessoas
 * com uma comparação que só vale para 4 e quebrou os grupos de 5 ou mais, que
 * funcionavam. O aluno vê o conserto quebrar o que funcionava, observa a
 * regra certa e prova o conserto com o caso novo e os antigos juntos.
 * REVISÃO ESPAÇADA: reproduzir o defeito e causa raiz (U5), pontos de parada
 * e Observar.
 * POR QUE ESTA ORDEM: ver a regressão pela pausa, escolher os casos que a
 * provam, consertar. No sozinho, o brinde repete o caminho, e o conserto
 * confere também a taxa (o segundo conserto não pode quebrar o primeiro).
 */
import type { FasePratica, Validador } from "@/conteudo/tipos";
import { casosDe, curioso, enunciado, FERRAMENTAS_INVESTIGACAO, SABE_DEPURACAO, SITE_DE_CONSOLE, soltarPonto } from "../chamados";
import { CENA_SALAO } from "./cena";

const CODIGO_TAXA = ["function taxa(pessoas) {", "  if (pessoas === 4) {", "    return 10;", "  }", "  return 0;", "}"].join("\n");
const CODIGO_BRINDE = ["function brinde(visitas) {", "  if (visitas === 5) {", "    return true;", "  }", "  return false;", "}"].join("\n");
const GRUPOS = [
  "const reclamada = taxa(4);",
  'tela.mostrar("Taxa R$ " + reclamada);',
  "esperar(1000);",
  "const antiga = taxa(5);",
  'tela.mostrar("Taxa R$ " + antiga);',
  "esperar(1000);",
].join("\n");

/** A tela do aplicativo no balcão mostra a taxa do grupo de 4 depois do conserto. */
const TELA_CERTA: Validador = { tipo: "estadoNaCena", dispositivo: "tela", propriedade: "texto", valor: "Taxa R$ 10", noTempo: 1_500 };
const CODIGO_INICIAL = [CODIGO_TAXA, CODIGO_BRINDE, GRUPOS].join("\n");

const TAXA_CERTA = CODIGO_TAXA.replace("pessoas === 4", "pessoas >= 4");
const BRINDE_CERTO = CODIGO_BRINDE.replace("visitas === 5", "visitas >= 5");
const VISITAS = ["const nova = brinde(5);", "const velha = brinde(6);"].join("\n");

const CASOS_TAXA: [number[], number][] = [
  [[1], 0],
  [[3], 0],
  [[4], 10],
  [[5], 10],
  [[8], 10],
];
const CASOS_BRINDE: [number[], boolean][] = [
  [[0], false],
  [[4], false],
  [[5], true],
  [[6], true],
  [[10], true],
];

export const FASE_DEPURACAO_U6_F1: FasePratica = {
  id: "logica-depuracao-u6-f1",
  tipo: "pratica",
  unidadeId: "logica-depuracao-u6",
  titulo: "O conserto que quebrou o resto",
  conceitos: ["teste-de-regressao"],
  revisa: ["reproduzir-o-defeito", "causa-raiz", "igualdade-estrita", "comparacao-js", "observar-expressoes"],
  prerequisitos: [...SABE_DEPURACAO, "reproduzir-o-defeito", "causa-raiz"],
  usaFerramentas: [...FERRAMENTAS_INVESTIGACAO, "cena", "ficha-dispositivo", "velocidade-simulacao"],
  siteAlvo: SITE_DE_CONSOLE,
  programa: { snippet: { nome: "salao.js", codigoInicial: CODIGO_INICIAL } },
  areas: ["cena", "snippet", "palco"],
  cena: CENA_SALAO,
  introducao: [
    curioso("No Salão Girassol, a taxa de serviço vale para grupos de 4 pessoas ou mais. Uma colega consertou o grupo de 4, que não pagava, e agora os grupos de 5 reclamam."),
    curioso("Consertar um defeito pode quebrar outra coisa. A defesa é rodar, depois de cada conserto, o caso novo junto com os casos antigos."),
    curioso("A tela no balcão é o aplicativo do salão: o programa escreve nela. Toque nela para abrir a ficha."),
  ],
  conclusao: [curioso("O conserto bom passa no caso novo e nos antigos. Rodar tudo de novo depois de mexer é o teste de regressão.")],
  falaFinal: curioso("Agora o chamado do salão: um aplicativo de agenda que marca duas clientes no mesmo horário."),
  objetivos: [
    {
      id: "regressao-guiado",
      tipo: "previsao",
      modo: "guiado",
      enunciado: enunciado("Marque a linha 2 e observe pessoas e pessoas === 4 nos dois grupos: o que a colega consertou e o que funcionava."),
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "pausouNaLinha", linha: 2 },
          { tipo: "observou", expressao: "pessoas", valor: 4 },
          { tipo: "observou", expressao: "pessoas", valor: 5 },
          { tipo: "observou", expressao: "pessoas === 4", valor: false },
        ],
      },
      previsao: {
        pergunta: "O grupo de 4 passou a pagar, mas o de 5, que funcionava antes, não paga mais. Como se chama isso?",
        opcoes: ["Regressão: o conserto quebrou algo que funcionava", "Um defeito novo sem relação com o conserto", "Uma melhoria do programa"],
        correta: 0,
        explicacao: "Regressão é quando um conserto quebra algo que já funcionava. O grupo de 5 passou a falhar depois da mudança.",
      },
      ajudas: {
        pergunta: "Que grupo a colega consertou, e que grupo deixou de funcionar?",
        dica: "Compare os dois grupos na mesma linha. Se o que funcionava antes deixou de funcionar, o conserto causou uma regressão.",
        linha: { alvo: "snippet", linhas: [13, 16], fala: "Dois grupos: o de 4, que foi consertado, e o de 5, que já funcionava." },
        solucao: {
          fala: "O ponto de parada na linha 2 mostra cada grupo, e Retomar passa para o seguinte.",
          acoes: [
            { tipo: "alternarPontoDeParada", linha: 2 },
            { tipo: "observar", expressao: "pessoas" },
            { tipo: "observar", expressao: "pessoas === 4" },
            { tipo: "executarSnippet" },
            { tipo: "controlarDepurador", controle: "retomar" },
          ],
        },
      },
      falaAoConcluir: curioso("pessoas === 4 vale só para 4. O grupo de 5 perdeu a taxa: o conserto quebrou o que funcionava."),
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "alternarPontoDeParada", linha: 2 },
        { tipo: "observar", expressao: "pessoas" },
        { tipo: "observar", expressao: "pessoas === 4" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "casos-guiado",
      tipo: "previsao",
      modo: "guiado",
      enunciado: enunciado("Estamos pausados no grupo de 5. Observe pessoas >= 4: é a regra que vale para o grupo de 4 e para o de 5."),
      validador: { tipo: "observou", expressao: "pessoas >= 4", valor: true },
      previsao: {
        pergunta: "Que casos provam que o conserto da taxa está bom?",
        opcoes: ["Só o grupo de 4, que era o defeito", "O grupo de 4 junto com os grupos que já funcionavam", "Só os grupos antigos"],
        correta: 1,
        explicacao: "O caso novo prova o conserto e os casos antigos provam que nada quebrou. Os dois juntos formam o teste de regressão.",
      },
      ajudas: {
        pergunta: "Se você só testar o grupo de 4, descobre a regressão do grupo de 5?",
        dica: "Teste de regressão é rodar de novo os casos antigos junto com o caso novo.",
        linha: { alvo: "snippet", linhas: [2], fala: "Esta condição só vale para 4 pessoas." },
        solucao: { fala: "Observar mostra que a regra certa vale para os dois grupos.", acoes: [{ tipo: "observar", expressao: "pessoas >= 4" }] },
      },
      falaAoConcluir: curioso("pessoas >= 4 vale para o grupo de 4 e para o de 5. Testar os dois junto prova o conserto e a ausência de regressão."),
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "observar", expressao: "pessoas >= 4" },
      ],
    },
    {
      id: "conserto-guiado",
      tipo: "acao",
      modo: "guiado",
      enunciado: enunciado("Conserte a taxa sem quebrar os grupos que funcionavam. Os casos escondidos testam 1, 3, 4, 5 e 8 pessoas."),
      validador: { tipo: "todos", validadores: [{ tipo: "semErro" }, casosDe("taxa", CASOS_TAXA), TELA_CERTA] },
      ajudas: {
        pergunta: "Qual comparação vale para 4 e também para quem passa de 4?",
        dica: "O conserto bom passa no caso novo e nos casos antigos: grupos de 4 ou mais pagam a taxa.",
        linha: { alvo: "snippet", linhas: [2], fala: "Esta comparação é a causa da regressão." },
        solucao: {
          fala: "A condição passa a aceitar 4 ou mais pessoas. O ponto de parada sai antes de rodar o conserto.",
          acoes: [...soltarPonto(2), { tipo: "definirSnippet", codigo: [TAXA_CERTA, CODIGO_BRINDE, GRUPOS].join("\n") }, { tipo: "executarSnippet" }],
        },
      },
      falaAoConcluir: curioso("Os casos antigos (1, 3, 5 e 8) e o novo (4) passam juntos. Isso é teste de regressão."),
      solucaoDeTeste: [...soltarPonto(2), { tipo: "definirSnippet", codigo: [TAXA_CERTA, CODIGO_BRINDE, GRUPOS].join("\n") }, { tipo: "executarSnippet" }],
    },
    {
      id: "regressao-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: enunciado("O brinde da 5ª visita tem o mesmo problema. Chame brinde(5) e brinde(6), pause na linha 8 e observe visitas e visitas === 5."),
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "pausouNaLinha", linha: 8 },
          { tipo: "observou", expressao: "visitas", valor: 5 },
          { tipo: "observou", expressao: "visitas", valor: 6 },
          { tipo: "observou", expressao: "visitas === 5", valor: false },
        ],
      },
      ajudas: {
        pergunta: "Que visita foi consertada e qual deixou de ganhar o brinde?",
        dica: "Escreva as duas chamadas no fim do código, marque a linha 8 e use Retomar para ver a segunda.",
      },
      falaAoConcluir: curioso("A 5ª visita ganha e a 6ª não: mesma regressão, outra função."),
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: [TAXA_CERTA, CODIGO_BRINDE, GRUPOS, VISITAS].join("\n") },
        { tipo: "alternarPontoDeParada", linha: 8 },
        { tipo: "observar", expressao: "visitas" },
        { tipo: "observar", expressao: "visitas === 5" },
        { tipo: "executarSnippet" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
    {
      id: "conserto-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: enunciado("Conserte o brinde (5 visitas ou mais) e prove que a taxa continua certa. Os dois casos valem."),
      validador: { tipo: "todos", validadores: [{ tipo: "semErro" }, casosDe("brinde", CASOS_BRINDE), casosDe("taxa", CASOS_TAXA)] },
      ajudas: {
        pergunta: "Depois de mexer no brinde, a taxa continua certa? Como você prova?",
        dica: "Rode de novo as duas funções com os casos antigos e o novo: o segundo conserto não pode quebrar o primeiro.",
      },
      falaAoConcluir: curioso("Brinde e taxa certos juntos: o conserto novo não quebrou o antigo."),
      solucaoDeTeste: [
        ...soltarPonto(8),
        { tipo: "definirSnippet", codigo: [TAXA_CERTA, BRINDE_CERTO, GRUPOS, VISITAS].join("\n") },
        { tipo: "executarSnippet" },
      ],
    },
  ],
};

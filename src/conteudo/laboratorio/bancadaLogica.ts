/*
 * Bancada da Lógica: fases de LABORATÓRIO do motor da Ilha Lógica, fora do
 * currículo (só no /lab/fases?fase=<id>). Mostram cada validador de código
 * funcionando, para quem escreve as fases da ilha usar de modelo:
 * `respostaDoConsole` (a resposta do Console), `valorVariavel` e
 * `usouSintaxe`, `erroDoTipo` (fase que ensina a ler erro), `funcaoPassa`
 * (o jeito certo de validar função: roda a função do jogador com os
 * casos) e `saida` com `semErro`.
 */
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import type { FasePratica, Unidade } from "../tipos";

export const UNIDADE_BANCADA_LOGICA: Unidade = {
  id: "lab-logica-u1",
  ilha: "Laboratório",
  zona: "Bancada da Lógica",
  numero: 1,
  titulo: "Bancada da Lógica",
  meta: { enunciado: "Testar o motor da Ilha Lógica: Console, Snippet, palco da memória, linha do tempo e circuito lógico." },
  fases: ["lab-logica-u1-f1"],
};

export const FASE_BANCADA_CONSOLE: FasePratica = {
  id: "lab-logica-u1-f1",
  tipo: "pratica",
  unidadeId: "lab-logica-u1",
  titulo: "Bancada do Console",
  // Bancada fora do currículo: os conceitos da Lógica entram no catálogo com as unidades que os ensinam.
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["console", "snippet", "palco-memoria", "linha-do-tempo"],
  apresentar: ["console", "palco-memoria"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {
    snippet: { codigoInicial: "// Escreva seu programa aqui\n", nome: "programa.js" },
    preparo: "const taxa = 2;",
  },
  introducao: [{ texto: "Bancada do Console: cada objetivo usa um validador de código diferente.", expressao: "curioso" }],
  objetivos: [
    {
      id: "conta",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O que o Console responde para 2 + 3 * 4?",
        opcoes: ["20", "14", "24"],
        correta: 1,
        explicacao: "A multiplicação vem antes da soma: 3 * 4 = 12, e 2 + 12 = 14.",
      },
      enunciado: { mouse: "Escreva 2 + 3 * 4 no Console e aperte Enter.", toque: "Escreva 2 + 3 * 4 no Console e toque em Rodar." },
      validador: { tipo: "respostaDoConsole", valor: 14 },
      apresentar: [],
      ajudas: {
        pergunta: "Onde se escreve um comando para o Console responder?",
        dica: "Na linha com o sinal >, embaixo de tudo.",
        linha: { alvo: "console", fala: "É nesta linha aqui." },
        solucao: { fala: "Escrevi a conta e apertei Enter.", acoes: [{ tipo: "executarNoConsole", codigo: "2 + 3 * 4" }] },
      },
      falaAoConcluir: { texto: "14! Vezes antes de mais, como na escola.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "executarNoConsole", codigo: "2 + 3 * 4" },
      ],
    },
    {
      id: "variavel",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Crie a variável total com let, guardando 15.", toque: "Crie a variável total com let, guardando 15." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorVariavel", nome: "total", valor: 15 },
          { tipo: "usouSintaxe", sintaxe: "let" },
        ],
      },
      ajudas: { pergunta: "Qual palavra cria uma caixinha que pode mudar?", dica: "let nome = valor" },
      falaAoConcluir: { texto: "A caixinha total nasceu com 15.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let total = 15" }],
    },
    {
      id: "erro-da-const",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Tente trocar o valor da const taxa para 3 e leia o erro.", toque: "Tente trocar o valor da const taxa para 3 e leia o erro." },
      validador: { tipo: "erroDoTipo", nome: "TypeError" },
      ajudas: {
        pergunta: "O que acontece quando alguém tenta trocar o valor de uma const?",
        dica: "Escreva taxa = 3 e veja o que o Console diz.",
        linha: { alvo: "console", fala: "Escreva aqui." },
        solucao: { fala: "Tentei trocar a const: o Console reclamou.", acoes: [{ tipo: "executarNoConsole", codigo: "taxa = 3" }] },
      },
      falaAoConcluir: { texto: "TypeError: a const não troca de valor.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "taxa = 3" }],
    },
    {
      id: "funcao",
      tipo: "acao",
      modo: "guiado",
      apresentar: ["snippet", "linha-do-tempo"],
      enunciado: {
        mouse: "No Snippet, crie a função dobro(n) que DEVOLVE o dobro de n, e execute.",
        toque: "No Snippet, crie a função dobro(n) que DEVOLVE o dobro de n, e execute.",
      },
      validador: {
        tipo: "funcaoPassa",
        nome: "dobro",
        casos: [
          { args: [2], esperado: 4 },
          { args: [5], esperado: 10 },
          { args: [0], esperado: 0 },
        ],
      },
      ajudas: {
        pergunta: "Qual palavra faz a função devolver uma resposta?",
        dica: "return. console.log só mostra; return devolve.",
        linha: { alvo: "snippet", linhas: [1], fala: "Escreva a função a partir desta linha." },
        solucao: {
          fala: "Escrevi a função com return e executei.",
          acoes: [
            { tipo: "definirSnippet", codigo: "function dobro(n) {\n  return n * 2;\n}" },
            { tipo: "executarSnippet" },
          ],
        },
      },
      falaAoConcluir: { texto: "dobro passou nos três casos.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirSnippet", codigo: "function dobro(n) {\n  return n * 2;\n}" },
        { tipo: "executarSnippet" },
      ],
    },
    {
      id: "mensagem",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Mostre Pronto! no console, com console.log.", toque: "Mostre Pronto! no console, com console.log." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "saida", igual: ["Pronto!"] },
          { tipo: "semErro" },
        ],
      },
      ajudas: { pergunta: "Qual comando escreve um texto no console?", dica: "console.log('texto')" },
      falaAoConcluir: { texto: "Pronto!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "console.log('Pronto!')" }],
    },
  ],
  conclusao: [{ texto: "Bancada testada.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo na bancada.", expressao: "feliz" },
};

export const FASES_BANCADA_LOGICA: readonly FasePratica[] = [FASE_BANCADA_CONSOLE];

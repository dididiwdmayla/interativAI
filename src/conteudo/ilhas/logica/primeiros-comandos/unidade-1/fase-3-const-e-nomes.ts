/*
 * Lógica U1, Fase 3: "const e nomes bons" (a encomenda de bolo da Pão de Mel).
 *
 * O QUE ENSINA: const (a caixinha que não troca de valor), LER a mensagem
 * de erro (a primeira vez que o jogador provoca um erro de propósito e lê o
 * que ele diz) e nomes bons de variável (diz o que guarda, sem espaço nem
 * acento, as palavras coladas com a segunda em maiúscula).
 *
 * ORDEM: criar a const (guiado), provocar o erro e ler (guiado, com o
 * `erroDoTipo`: a fase só conclui quando o erro aparece), a previsão do nome
 * bom (a confusão "qualquer nome serve") e, sozinho, um programa de várias
 * linhas com Shift+Enter (a linha do tempo é apresentada aqui: dá para
 * voltar e ver a caixinha total mudar a cada linha).
 *
 * REVISÃO ESPAÇADA: let e troca de valor (Fase 2) no objetivo sozinho; a
 * ordem das contas (Fase 1) aparece na soma.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U1_F3: FasePratica = {
  id: "logica-primeiros-comandos-u1-f3",
  tipo: "pratica",
  unidadeId: "logica-primeiros-comandos-u1",
  titulo: "const e nomes bons",
  conceitos: ["variavel-const", "ler-mensagem-de-erro", "nome-de-variavel"],
  revisa: ["variavel-let", "operacoes-aritmeticas"],
  prerequisitos: ["console-js", "variavel-let"],
  usaFerramentas: ["console", "palco-memoria", "linha-do-tempo"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {},
  introducao: [
    { texto: "A Pão de Mel cobra R$ 5 de entrega, sempre. Um valor assim não devia mudar sem querer.", expressao: "curioso" },
    { texto: "Para isso existe o const: uma caixinha que guarda o mesmo valor para sempre. Vamos testar os limites dela!", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "criar-const",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Crie a taxa de entrega com const: const taxaDeEntrega = 5.", toque: "Crie a taxa de entrega com const: const taxaDeEntrega = 5." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorVariavel", nome: "taxaDeEntrega", valor: 5 },
          { tipo: "usouSintaxe", sintaxe: "const" },
        ],
      },
      ajudas: {
        pergunta: "Qual palavra cria uma caixinha que nunca troca de valor?",
        dica: "const, no lugar do let: const nome = valor.",
        linha: { alvo: "console", fala: "Escreva aqui: const taxaDeEntrega = 5" },
        solucao: { fala: "Criei a const taxaDeEntrega. No palco, a caixinha mostra que ela é const.", acoes: [{ tipo: "executarNoConsole", codigo: "const taxaDeEntrega = 5" }] },
      },
      falaAoConcluir: { texto: "Repare na etiqueta da caixinha: const. Agora vamos ver o que acontece se alguém tentar mexer nela.", expressao: "curioso" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "const taxaDeEntrega = 5" }],
    },
    {
      id: "ler-o-erro",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Tente trocar a taxa: taxaDeEntrega = 7. Leia o erro vermelho com calma.", toque: "Tente trocar a taxa: taxaDeEntrega = 7. Leia o erro vermelho com calma." },
      validador: { tipo: "erroDoTipo", nome: "TypeError" },
      ajudas: {
        pergunta: "O que você acha que acontece quando alguém tenta trocar o valor de uma const?",
        dica: "Escreva a troca como faria com um let e leia o que o Console diz.",
        linha: { alvo: "console", fala: "Escreva a troca aqui, sem const na frente." },
        solucao: { fala: "Tentei trocar a const: o Console recusou com um TypeError, e a taxa continuou 5.", acoes: [{ tipo: "executarNoConsole", codigo: "taxaDeEntrega = 7" }] },
      },
      falaAoConcluir: {
        texto: "Erro não é bronca: é o JavaScript explicando. TypeError, Assignment to constant variable: tentou trocar uma constante.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "taxaDeEntrega = 7" }],
    },
    {
      id: "nome-bom",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Qual é o melhor nome para a caixinha do preço do bolo?",
        opcoes: ["x", "preço do bolo", "precoDoBolo"],
        correta: 2,
        explicacao: "precoDoBolo diz o que guarda, sem espaço nem acento. x não diz nada, e com espaço o JavaScript nem entende.",
      },
      enunciado: { mouse: "Crie a caixinha do preço do bolo, com o nome bom e o valor 18.", toque: "Crie a caixinha do preço do bolo, com o nome bom e o valor 18." },
      validador: { tipo: "valorVariavel", nome: "precoDoBolo", valor: 18 },
      ajudas: {
        pergunta: "Como juntar as palavras preço, do e bolo num nome só?",
        dica: "Sem espaço e sem acento, com as palavras coladas e cada nova palavra em maiúscula.",
        linha: { alvo: "console", fala: "Crie aqui, com let e o nome bom." },
        solucao: { fala: "Criei let precoDoBolo = 18. Daqui a um mês, qualquer pessoa entende o que essa caixinha guarda.", acoes: [{ tipo: "executarNoConsole", codigo: "let precoDoBolo = 18" }] },
      },
      falaAoConcluir: { texto: "Nome bom é presente para quem lê o código depois, e quase sempre essa pessoa é você mesmo.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "executarNoConsole", codigo: "let precoDoBolo = 18" },
      ],
    },
    {
      id: "encomenda",
      tipo: "acao",
      modo: "sozinho",
      apresentar: ["linha-do-tempo"],
      enunciado: {
        mouse: "Em várias linhas (Shift+Enter): let total = 0, some o bolo, some a entrega. total tem que dar 23.",
        toque: "Em várias linhas: let total = 0, some o bolo, some a entrega. total tem que dar 23.",
      },
      validador: { tipo: "valorVariavel", nome: "total", valor: 23 },
      ajudas: {
        pergunta: "Se total começa em 0, como guardar nele o total mais o preço do bolo?",
        dica: "total = total + precoDoBolo pega o valor de agora, soma e guarda de volta.",
      },
      falaAoConcluir: { texto: "23! Volte a linha do tempo e veja a caixinha total mudar linha por linha: 0, 18, 23.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let total = 0\ntotal = total + precoDoBolo\ntotal = total + taxaDeEntrega" }],
    },
  ],
  conclusao: [
    { texto: "const para o que não muda, let para o que muda, e nomes que dizem o que guardam. E você leu o seu primeiro erro!", expressao: "comemorando" },
    { texto: "Hora do desafio: outra loja, outra conta, sem passo a passo.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "No Console de qualquer site, crie const pi = 3.14 e tente trocar: pi = 3. Leia o erro com calma. Em inglês ele diz o mesmo que aqui: trocar o valor de uma constante não pode.",
  falaFinal: { texto: "Todo programador lê erro o dia inteiro. Quem lê com calma conserta mais rápido.", expressao: "feliz" },
};

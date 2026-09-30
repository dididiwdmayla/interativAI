/*
 * Lógica U1, Desafio: "Mercadinho do Seu Zé".
 *
 * O QUE PRATICA: tudo da unidade num contexto NOVO (um mercadinho, não a
 * padaria), sem passo a passo. A meta mostra o palco antes (vazio) e
 * depois (as caixinhas que as soluções deixam).
 *
 * PARTES (uma por habilidade, cada uma apontando a fase guiada dela):
 * - os preços do arroz e do feijão em const: Fase 3 (const);
 * - o total de 2 arrozes e 3 feijões numa let: Fase 2 (let e conta com
 *   nomes; a ordem das contas entra aqui, sem parênteses necessários);
 * - o troco de R$ 100 numa const: Fase 3;
 * - a divisão do total entre 4 irmãos, perguntada ao Console: Fase 1
 *   (`respostaDoConsole`: a resposta, não uma variável).
 * Os nomes das caixinhas vêm no enunciado das partes: o validador lê a
 * memória pelo nome (`valorVariavel`).
 *
 * NENHUMA PARTE DESFAZ OUTRA: o total fica 68 e o troco 32 ao mesmo tempo
 * (partes de estado são avaliadas ao vivo e precisam passar juntas).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U1_F4: FaseDesafio = {
  id: "logica-primeiros-comandos-u1-f4",
  tipo: "desafio",
  unidadeId: "logica-primeiros-comandos-u1",
  titulo: "Mercadinho do Seu Zé",
  conceitos: ["variavel-const", "variavel-let", "operacoes-aritmeticas", "console-js"],
  revisa: [],
  prerequisitos: ["variavel-const", "variavel-let", "operacoes-aritmeticas", "ordem-das-operacoes", "console-js"],
  usaFerramentas: ["console", "palco-memoria", "linha-do-tempo"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {},
  introducao: [
    { texto: "O Seu Zé do mercadinho faz as contas no caderno e sempre erra o troco. Vamos fazer por ele, no Console!", expressao: "curioso" },
    { texto: "O arroz custa R$ 22 e o feijão, R$ 8. Uma cliente leva 2 arrozes e 3 feijões e paga com R$ 100.", expressao: "apontando" },
  ],
  partes: [
    {
      id: "precos-em-const",
      descricao: "Os preços em duas const: precoDoArroz (22) e precoDoFeijao (8).",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorVariavel", nome: "precoDoArroz", valor: 22 },
          { tipo: "valorVariavel", nome: "precoDoFeijao", valor: 8 },
          { tipo: "usouSintaxe", sintaxe: "const" },
        ],
      },
      revisarEm: "logica-primeiros-comandos-u1-f3",
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "const precoDoArroz = 22\nconst precoDoFeijao = 8" }],
    },
    {
      id: "total-da-compra",
      descricao: "O total da compra numa let total, usando os nomes dos preços.",
      validador: { tipo: "valorVariavel", nome: "total", valor: 68 },
      revisarEm: "logica-primeiros-comandos-u1-f2",
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let total = 2 * precoDoArroz + 3 * precoDoFeijao" }],
    },
    {
      id: "troco",
      descricao: "O troco dos R$ 100 numa const troco.",
      validador: { tipo: "valorVariavel", nome: "troco", valor: 32 },
      revisarEm: "logica-primeiros-comandos-u1-f3",
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "const troco = 100 - total" }],
    },
    {
      id: "dividir-entre-irmaos",
      descricao: "A cliente divide o total com os 4 irmãos: pergunte ao Console quanto cada um paga.",
      validador: { tipo: "respostaDoConsole", valor: 17 },
      revisarEm: "logica-primeiros-comandos-u1-f1",
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "total / 4" }],
    },
  ],
  conclusao: [
    { texto: "Troco certinho: R$ 32! E cada irmão paga R$ 17. O Seu Zé vai querer um Console no caixa.", expressao: "comemorando" },
    { texto: "Você calculou, guardou com nomes bons, protegeu os preços com const e leu erros. É o começo de todo programa.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Na próxima compra, abra o Console de qualquer site e confira a conta: guarde os preços em const e o total numa let. Se o troco bater, o programa foi seu.",
  falaFinal: { texto: "Próxima parada da ilha: textos entre aspas, juntar palavras e montar frases com valores dentro.", expressao: "curioso" },
};

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
import type { FaseCircuitoLogico, FasePratica, Unidade } from "../tipos";

export const UNIDADE_BANCADA_LOGICA: Unidade = {
  id: "lab-logica-u1",
  ilha: "Laboratório",
  zona: "Bancada da Lógica",
  numero: 1,
  titulo: "Bancada da Lógica",
  meta: { enunciado: "Testar o motor da Ilha Lógica: Console, Snippet, palco da memória, linha do tempo e circuito lógico." },
  fases: ["lab-logica-u1-f1", "lab-logica-u1-f2"],
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

/*
 * Demonstração do circuito lógico (modelo para as fases da Decisões u2 e,
 * depois, das Origens e da Automação). O que ela mostra:
 * - a bancada já vem com as chaves e a saída (fixas: não saem); o jogador
 *   tira os portões da paleta;
 * - `circuitoTabela` confere a TABELA (qualquer montagem certa passa) e
 *   `usouPortao` garante o portão que o objetivo ensina;
 * - as soluções usam ids próprios nos portões (adicionarPortao com id) para
 *   os fios das ações seguintes;
 * - testar as combinações é evento (`alternouEntrada`), e "Ver como código"
 *   também (`viuCodigoDoCircuito`), a ponte para o if.
 */
const TABELA_E = [
  { entradas: { temCliente: false, lojaAberta: false }, saida: false },
  { entradas: { temCliente: true, lojaAberta: false }, saida: false },
  { entradas: { temCliente: false, lojaAberta: true }, saida: false },
  { entradas: { temCliente: true, lojaAberta: true }, saida: true },
];

export const FASE_DEMO_CIRCUITO: FaseCircuitoLogico = {
  id: "lab-logica-u1-f2",
  tipo: "circuito-logico",
  unidadeId: "lab-logica-u1",
  titulo: "Demonstração do circuito lógico",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["circuito", "tabela-verdade"],
  apresentar: ["circuito", "tabela-verdade"],
  siteAlvo: SITE_DO_PROGRAMA,
  circuito: {
    paleta: ["e", "ou", "nao", "xou"],
    inicial: {
      pecas: [
        { id: "cliente", tipo: "entrada", nome: "temCliente", rotulo: "tem cliente", x: 24, y: 70, fixa: true },
        { id: "aberta", tipo: "entrada", nome: "lojaAberta", rotulo: "loja aberta", x: 24, y: 250, fixa: true },
        { id: "porta", tipo: "saida", nome: "portaAbre", rotulo: "porta abre", forma: "porta", x: 520, y: 150, fixa: true },
      ],
      fios: [],
    },
  },
  introducao: [{ texto: "A porta da padaria só abre se tiver cliente E a loja estiver aberta. Vamos montar isso com portões.", expressao: "curioso" }],
  objetivos: [
    {
      id: "porta-com-e",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ponha um portão E e ligue: as duas chaves nas entradas dele, a saída dele na porta.",
        toque: "Ponha um portão E e ligue: as duas chaves nas entradas dele, a saída dele na porta.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "circuitoTabela", esperado: TABELA_E },
          { tipo: "usouPortao", portao: "e" },
        ],
      },
      ajudas: {
        pergunta: "Qual portão só deixa passar quando as DUAS coisas são verdade?",
        dica: "O E. Cada chave vai numa bolinha da esquerda dele, e a bolinha da direita vai na porta.",
        linha: { alvo: "circuito", fala: "Os portões moram aqui, na paleta." },
        solucao: {
          fala: "Pus um E: as duas chaves entram nele, e ele manda na porta.",
          acoes: [
            { tipo: "adicionarPortao", portao: "e", id: "e1", x: 280, y: 150 },
            { tipo: "ligarFio", de: "cliente", para: "e1", porta: 0 },
            { tipo: "ligarFio", de: "aberta", para: "e1", porta: 1 },
            { tipo: "ligarFio", de: "e1", para: "porta" },
          ],
        },
      },
      falaAoConcluir: { texto: "Montado! Agora a porta obedece às duas chaves ao mesmo tempo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarPortao", portao: "e", id: "e1", x: 280, y: 150 },
        { tipo: "ligarFio", de: "cliente", para: "e1", porta: 0 },
        { tipo: "ligarFio", de: "aberta", para: "e1", porta: 1 },
        { tipo: "ligarFio", de: "e1", para: "porta" },
      ],
    },
    {
      id: "testar",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Com só a loja aberta (sem cliente), a porta abre?",
        opcoes: ["Abre", "Não abre"],
        correta: 1,
        explicacao: "O E precisa das duas: sem cliente, a porta fica fechada.",
      },
      enunciado: { mouse: "Ligue só a chave loja aberta e veja a porta.", toque: "Ligue só a chave loja aberta e veja a porta." },
      validador: { tipo: "evento", evento: "alternouEntrada" },
      ajudas: {
        pergunta: "Como se liga uma chave?",
        dica: "Clicando nela (no celular, tocando).",
        linha: { alvo: "circuito", peca: "aberta", fala: "Esta chave." },
        solucao: { fala: "Liguei a loja aberta: sem cliente, a porta continua fechada.", acoes: [{ tipo: "alternarEntrada", entrada: "aberta", ligada: true }] },
      },
      falaAoConcluir: { texto: "Viu a linha acender na tabela? Cada combinação testada fica marcada.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "alternarEntrada", entrada: "aberta", ligada: true },
      ],
    },
    {
      id: "ver-codigo",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Clique em Ver como código.", toque: "Toque em Ver como código." },
      validador: { tipo: "evento", evento: "viuCodigoDoCircuito" },
      ajudas: {
        pergunta: "Onde a tabela mostra o circuito escrito em JavaScript?",
        dica: "No botão Ver como código, em cima da tabela.",
        linha: { alvo: "ferramenta", ferramenta: "tabela-verdade", fala: "Aqui, na tabela verdade." },
        solucao: { fala: "O E virou &&: temCliente && lojaAberta.", acoes: [{ tipo: "verComoCodigo" }] },
      },
      falaAoConcluir: { texto: "temCliente && lojaAberta: o mesmo circuito, em código. Isso vai dentro de um if.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "verComoCodigo" }],
    },
    {
      id: "sem-cliente",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora a porta abre para a faxina: loja aberta E NÃO tem cliente.",
        toque: "Agora a porta abre para a faxina: loja aberta E NÃO tem cliente.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          {
            tipo: "circuitoTabela",
            esperado: [
              { entradas: { temCliente: false, lojaAberta: false }, saida: false },
              { entradas: { temCliente: true, lojaAberta: false }, saida: false },
              { entradas: { temCliente: false, lojaAberta: true }, saida: true },
              { entradas: { temCliente: true, lojaAberta: true }, saida: false },
            ],
          },
          { tipo: "usouPortao", portao: "nao" },
        ],
      },
      ajudas: { pergunta: "Qual portão vira o sim em não?", dica: "O NÃO fica entre a chave tem cliente e o E." },
      falaAoConcluir: { texto: "O NÃO inverteu o cliente. No código: lojaAberta && !temCliente.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarPortao", portao: "nao", id: "n1", x: 170, y: 60 },
        { tipo: "ligarFio", de: "cliente", para: "n1" },
        { tipo: "ligarFio", de: "n1", para: "e1", porta: 0 },
      ],
    },
  ],
  conclusao: [{ texto: "Circuito testado.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo na bancada.", expressao: "feliz" },
};

export const FASES_BANCADA_LOGICA: readonly (FasePratica | FaseCircuitoLogico)[] = [FASE_BANCADA_CONSOLE, FASE_DEMO_CIRCUITO];

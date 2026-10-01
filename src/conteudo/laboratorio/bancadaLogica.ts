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
import type { Fase, FaseCircuitoLogico, FaseDesafio, FaseOrdenarPassos, FasePratica, Unidade } from "../tipos";

export const UNIDADE_BANCADA_LOGICA: Unidade = {
  id: "lab-logica-u1",
  ilha: "Laboratório",
  zona: "Bancada da Lógica",
  numero: 1,
  titulo: "Bancada da Lógica",
  meta: { enunciado: "Testar o motor da Ilha Lógica: Console, Snippet, palco da memória, linha do tempo e circuito lógico." },
  fases: ["lab-logica-u1-f1", "lab-logica-u1-f2", "lab-logica-u1-f3", "lab-logica-u1-f4", "lab-logica-u1-f5", "lab-logica-u1-f6", "lab-logica-u1-f7"],
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

/*
 * Desafio com circuito, na ponte circuito/Console (modelo para um desafio
 * de portões lógicos): a bancada é a tela e o painel tem a tabela verdade
 * em cima e o Console embaixo. As partes misturam validadores de circuito
 * (circuitoTabela, usouPortao) com os de código (valorVariavel,
 * usouSintaxe). Sem palco: a tela é a bancada.
 */
export const FASE_DEMO_DESAFIO_CIRCUITO: FaseDesafio = {
  id: "lab-logica-u1-f3",
  tipo: "desafio",
  unidadeId: "lab-logica-u1",
  titulo: "Catraca na bancada e no Console",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["circuito", "tabela-verdade", "console"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { preparo: "const temCartao = true;\nconst catracaLivre = false;" },
  circuito: {
    paleta: ["e", "ou", "nao"],
    inicial: {
      pecas: [
        { id: "cartao", tipo: "entrada", nome: "temCartao", rotulo: "tem cartão", x: 24, y: 70, fixa: true },
        { id: "livre", tipo: "entrada", nome: "catracaLivre", rotulo: "catraca livre", x: 24, y: 250, fixa: true },
        { id: "gira", tipo: "saida", nome: "gira", rotulo: "catraca gira", x: 520, y: 150, fixa: true },
      ],
      fios: [],
    },
  },
  introducao: [{ texto: "A catraca do metrô só gira com cartão E com a catraca livre. Monte na bancada e depois escreva no Console.", expressao: "curioso" }],
  partes: [
    {
      id: "monta-a-catraca",
      descricao: "Na bancada, a catraca gira só com cartão e catraca livre.",
      revisarEm: "lab-logica-u1-f2",
      validador: {
        tipo: "todos",
        validadores: [
          {
            tipo: "circuitoTabela",
            esperado: [
              { entradas: { temCartao: false, catracaLivre: false }, saida: false },
              { entradas: { temCartao: true, catracaLivre: false }, saida: false },
              { entradas: { temCartao: false, catracaLivre: true }, saida: false },
              { entradas: { temCartao: true, catracaLivre: true }, saida: true },
            ],
          },
          { tipo: "usouPortao", portao: "e" },
        ],
      },
      solucaoDeTeste: [
        { tipo: "adicionarPortao", portao: "e", id: "e1", x: 280, y: 150 },
        { tipo: "ligarFio", de: "cartao", para: "e1", porta: 0 },
        { tipo: "ligarFio", de: "livre", para: "e1", porta: 1 },
        { tipo: "ligarFio", de: "e1", para: "gira" },
      ],
    },
    {
      id: "no-console",
      descricao: "No Console, crie gira com o mesmo portão: temCartao && catracaLivre.",
      revisarEm: "lab-logica-u1-f1",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorVariavel", nome: "gira", valor: false },
          { tipo: "usouSintaxe", sintaxe: "e-logico" },
        ],
      },
      solucaoDeTeste: [{ tipo: "executarNoConsole", codigo: "let gira = temCartao && catracaLivre" }],
    },
  ],
  conclusao: [{ texto: "O mesmo E, na bancada e no código: false, porque a catraca não estava livre.", expressao: "comemorando" }],
  falaFinal: { texto: "Pode continuar mexendo na bancada e no Console.", expressao: "feliz" },
};

/*
 * Demonstração do depurador da aba Fontes (modelo para a zona Depuração):
 * - `pontoDeParada` (estado) e a ação alternarPontoDeParada (clicar no
 *   número da linha);
 * - `pausouNaLinha` depois de Executar (o programa pausa ANTES da linha);
 * - `observou` sem valor (a expressão está no Observar) e com valor (ela
 *   mostrou esse valor numa pausa);
 * - `usouControle` com os controles do Chrome (passar por cima, entrar,
 *   sair e retomar), e a Pilha de chamadas dentro da função.
 */
const SNIPPET_DEPURADOR = [
  "function comDesconto(preco) {",
  "  const desconto = preco * 0.1;",
  "  return preco - desconto;",
  "}",
  "let total = 0;",
  "const precos = [20, 30, 50];",
  "for (const preco of precos) {",
  "  total = total + comDesconto(preco);",
  "}",
  "console.log(total);",
].join("\n");

export const FASE_DEMO_DEPURADOR: FasePratica = {
  id: "lab-logica-u1-f4",
  tipo: "pratica",
  unidadeId: "lab-logica-u1",
  titulo: "Demonstração do depurador",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["console", "snippet", "palco-memoria", "pontos-de-parada", "controles-depurador", "painel-escopo", "painel-observar", "pilha-de-chamadas"],
  apresentar: ["snippet"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: { snippet: { codigoInicial: SNIPPET_DEPURADOR, nome: "desconto.js" } },
  introducao: [{ texto: "O caixa dá 10% de desconto em cada preço. Vamos parar o programa no meio e olhar a memória.", expressao: "curioso" }],
  objetivos: [
    {
      id: "ponto",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Clique no número da linha 8 para pôr um ponto de parada.", toque: "Toque no número da linha 8 para pôr um ponto de parada." },
      validador: { tipo: "pontoDeParada", linha: 8 },
      apresentar: ["pontos-de-parada"],
      ajudas: {
        pergunta: "Onde o Chrome marca a linha em que o programa deve parar?",
        dica: "No número da linha, do lado esquerdo do código.",
        linha: { alvo: "snippet", linhas: [8], fala: "Esta linha soma cada preço com desconto." },
        solucao: { fala: "Cliquei no número 8: a etiqueta é o ponto de parada.", acoes: [{ tipo: "alternarPontoDeParada", linha: 8 }] },
      },
      falaAoConcluir: { texto: "Ponto de parada na linha 8. Agora o programa vai parar ali.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "alternarPontoDeParada", linha: 8 }],
    },
    {
      id: "pausar",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Na primeira pausa na linha 8, quanto vale total?",
        opcoes: ["0", "18", "90"],
        correta: 0,
        explicacao: "O depurador pausa ANTES de a linha rodar: a primeira soma ainda não aconteceu, então total vale 0.",
      },
      enunciado: { mouse: "Clique em Executar: o programa pausa na linha 8.", toque: "Toque em Executar: o programa pausa na linha 8." },
      validador: { tipo: "pausouNaLinha", linha: 8 },
      apresentar: ["painel-escopo"],
      ajudas: {
        pergunta: "O que faz o programa começar a rodar?",
        dica: "O botão Executar, em cima do Snippet (Ctrl+Enter).",
        linha: { alvo: "ferramenta", ferramenta: "snippet", fala: "O Executar mora aqui." },
        solucao: { fala: "Executei: ele parou na linha 8, antes de somar.", acoes: [{ tipo: "executarSnippet" }] },
      },
      falaAoConcluir: { texto: "Pausado no depurador! O Escopo e o palco mostram a memória deste momento.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "executarSnippet" }],
    },
    {
      id: "observar",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "No painel Observar, adicione a expressão total.", toque: "Na aba Observar, adicione a expressão total." },
      validador: { tipo: "observou", expressao: "total" },
      apresentar: ["painel-observar"],
      ajudas: {
        pergunta: "Onde dá para deixar uma variável sempre à vista?",
        dica: "No painel Observar: escreva total no campo e confirme.",
        linha: { alvo: "ferramenta", ferramenta: "painel-observar", fala: "Escreva aqui." },
        solucao: { fala: "Pus total no Observar.", acoes: [{ tipo: "observar", expressao: "total" }] },
      },
      falaAoConcluir: { texto: "Agora total aparece a cada pausa, sem procurar.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "observar", expressao: "total" }],
    },
    {
      id: "passar-por-cima",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Clique em Passar por cima até total mostrar 18 no Observar.", toque: "Toque em Passar por cima até total mostrar 18 no Observar." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "usouControle", controle: "passar-por-cima" },
          { tipo: "observou", expressao: "total", valor: 18 },
        ],
      },
      apresentar: ["controles-depurador"],
      ajudas: {
        pergunta: "Qual controle vai para a próxima linha sem entrar na função?",
        dica: "Passar por cima (F10).",
        linha: { alvo: "ferramenta", ferramenta: "controles-depurador", fala: "É a seta que pula a bolinha." },
        solucao: { fala: "Passei por cima: a função rodou inteira e total virou 18.", acoes: [{ tipo: "controlarDepurador", controle: "passar-por-cima" }] },
      },
      falaAoConcluir: { texto: "18: 20 menos o desconto de 2. Uma volta do laço inteira.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "controlarDepurador", controle: "passar-por-cima" }],
    },
    {
      id: "entrar",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Clique em Entrar na função e olhe a Pilha de chamadas.", toque: "Toque em Entrar na função e olhe a Pilha de chamadas." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "usouControle", controle: "entrar" },
          { tipo: "pausouNaLinha", linha: 2 },
        ],
      },
      apresentar: ["pilha-de-chamadas"],
      ajudas: {
        pergunta: "Qual controle segue para dentro da função comDesconto?",
        dica: "Entrar na função (F11).",
        linha: { alvo: "ferramenta", ferramenta: "controles-depurador", fala: "É a seta que desce." },
        solucao: { fala: "Entrei: agora a pilha tem comDesconto em cima.", acoes: [{ tipo: "controlarDepurador", controle: "entrar" }] },
      },
      falaAoConcluir: { texto: "comDesconto em cima, o código de fora embaixo: foi a linha 8 que chamou.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "controlarDepurador", controle: "entrar" }],
    },
    {
      id: "terminar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Saia da função e retome até o programa mostrar o total no Console.", toque: "Saia da função e retome até o programa mostrar o total no Console." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "usouControle", controle: "sair" },
          { tipo: "saida", contem: "90" },
        ],
      },
      ajudas: { pergunta: "Qual controle volta para quem chamou, e qual corre até o fim?", dica: "Sair da função (Shift+F11) e depois Retomar (F8), quantas vezes precisar." },
      falaAoConcluir: { texto: "90: o programa terminou e mostrou o total.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "controlarDepurador", controle: "sair" },
        { tipo: "controlarDepurador", controle: "retomar" },
      ],
    },
  ],
  conclusao: [{ texto: "Depurador testado.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar pondo pontos de parada e andando pelo programa.", expressao: "feliz" },
};

/*
 * Demonstração do ordenar passos (modelo para a zona Resolvendo problemas):
 * - `depoisDe` diz de quem cada passo depende: ferver a água e pôr o filtro
 *   não dependem um do outro, então as duas ordens valem (`ordemValida` não
 *   decora uma ordem);
 * - um cartão que sobra já começa no plano (`inicial`) e `semSobras` pede
 *   para tirar;
 * - `passoNoPlano` e `passoAntes` para objetivos menores.
 */
export const FASE_DEMO_ORDENAR: FaseOrdenarPassos = {
  id: "lab-logica-u1-f5",
  tipo: "ordenar-passos",
  unidadeId: "lab-logica-u1",
  titulo: "Demonstração do ordenar passos",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["quadro-de-passos"],
  apresentar: ["quadro-de-passos"],
  siteAlvo: SITE_DO_PROGRAMA,
  ordenar: {
    modo: "ordenar",
    problema: "Passar um café no coador",
    cartoes: [
      { id: "ferver", texto: "Ferver a água" },
      { id: "filtro", texto: "Pôr o filtro no suporte" },
      { id: "po", texto: "Pôr o pó no filtro", depoisDe: ["filtro"] },
      { id: "despejar", texto: "Despejar a água quente no pó", depoisDe: ["ferver", "po"] },
      { id: "servir", texto: "Servir na xícara", depoisDe: ["despejar"] },
      { id: "gelo", texto: "Pôr gelo na água", sobra: true },
    ],
    inicial: ["gelo"],
  },
  introducao: [{ texto: "Um programa é uma receita: passos na ordem certa. Vamos montar a do café.", expressao: "curioso" }],
  objetivos: [
    {
      id: "tirar-sobra",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Um cartão no plano não tem nada a ver com café. Tire ele (o x do cartão).", toque: "Um cartão no plano não tem nada a ver com café. Tire ele (o x do cartão)." },
      validador: { tipo: "semSobras" },
      ajudas: {
        pergunta: "Qual desses passos ninguém faz para passar café?",
        dica: "Gelo esfria a água: café passado precisa de água quente.",
        linha: { alvo: "ordenar", passo: "gelo", fala: "Este aqui." },
        solucao: { fala: "Tirei o gelo: ele sobra.", acoes: [{ tipo: "tirarPasso", passo: "gelo" }] },
      },
      falaAoConcluir: { texto: "Isso! Nem todo cartão entra no plano.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "tirarPasso", passo: "gelo" }],
    },
    {
      id: "primeiro",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Dá para pôr o filtro antes de ferver a água?",
        opcoes: ["Sim, tanto faz a ordem desses dois", "Não, a água sempre vem primeiro"],
        correta: 0,
        explicacao: "Um não depende do outro: as duas ordens funcionam. O que importa é a água estar quente antes de despejar.",
      },
      enunciado: { mouse: "Arraste Pôr o filtro no suporte para o plano.", toque: "Ponha Pôr o filtro no suporte no plano." },
      validador: { tipo: "passoNoPlano", passo: "filtro" },
      ajudas: {
        pergunta: "Como um cartão vai para o plano?",
        dica: "Arraste pela alça, ou toque nele e depois em Pôr aqui.",
        linha: { alvo: "ordenar", passo: "filtro", fala: "Este cartão." },
        solucao: { fala: "Pus o filtro no plano.", acoes: [{ tipo: "porPasso", passo: "filtro" }] },
      },
      falaAoConcluir: { texto: "Primeiro passo no plano.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }, { tipo: "porPasso", passo: "filtro" }],
    },
    {
      id: "completar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Complete o plano: cada passo depois do que ele precisa.", toque: "Complete o plano: cada passo depois do que ele precisa." },
      validador: { tipo: "ordemValida" },
      ajudas: { pergunta: "O que precisa estar pronto antes de despejar a água?", dica: "A água quente e o pó no filtro. Servir é o último." },
      falaAoConcluir: { texto: "Café passado! Repare: outras ordens também valeriam.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "po" },
        { tipo: "porPasso", passo: "ferver" },
        { tipo: "porPasso", passo: "despejar" },
        { tipo: "porPasso", passo: "servir" },
      ],
    },
  ],
  conclusao: [{ texto: "Quadro testado.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo no plano.", expressao: "feliz" },
};

/* Demonstração da variante agrupar: decompor um problema em passos grandes. */
export const FASE_DEMO_AGRUPAR: FaseOrdenarPassos = {
  id: "lab-logica-u1-f6",
  tipo: "ordenar-passos",
  unidadeId: "lab-logica-u1",
  titulo: "Demonstração do agrupar",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["quadro-de-passos"],
  siteAlvo: SITE_DO_PROGRAMA,
  ordenar: {
    modo: "agrupar",
    problema: "Organizar uma festa de aniversário",
    grupos: [
      { id: "convidar", titulo: "Convidar" },
      { id: "preparar", titulo: "Preparar" },
      { id: "festejar", titulo: "Festejar" },
    ],
    cartoes: [
      { id: "lista", texto: "Fazer a lista de convidados", grupo: "convidar" },
      { id: "mensagem", texto: "Mandar a mensagem com a data", grupo: "convidar", depoisDe: ["lista"] },
      { id: "bolo", texto: "Encomendar o bolo", grupo: "preparar" },
      { id: "enfeitar", texto: "Enfeitar a sala", grupo: "preparar" },
      { id: "parabens", texto: "Cantar parabéns", grupo: "festejar" },
      { id: "cortar", texto: "Cortar o bolo", grupo: "festejar", depoisDe: ["parabens", "bolo"] },
      { id: "imposto", texto: "Declarar o imposto de renda", sobra: true },
    ],
  },
  introducao: [{ texto: "Problema grande se resolve em pedaços: primeiro os passos grandes, depois os pequenos dentro de cada um.", expressao: "curioso" }],
  objetivos: [
    {
      id: "um-no-lugar",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Ponha Fazer a lista de convidados dentro de Convidar.", toque: "Ponha Fazer a lista de convidados dentro de Convidar." },
      validador: { tipo: "passoNoPlano", passo: "lista", grupo: "convidar" },
      ajudas: {
        pergunta: "Em qual passo grande a lista de convidados entra?",
        dica: "Antes de convidar alguém, você precisa saber quem.",
        linha: { alvo: "ordenar", passo: "lista", fala: "Este cartão." },
        solucao: { fala: "Pus a lista em Convidar.", acoes: [{ tipo: "porPasso", passo: "lista", grupo: "convidar" }] },
      },
      falaAoConcluir: { texto: "Isso: cada subpasso mora num passo grande.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "porPasso", passo: "lista", grupo: "convidar" }],
    },
    {
      id: "decompor",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Separe os outros subpassos. Um cartão não é da festa.", toque: "Separe os outros subpassos. Um cartão não é da festa." },
      validador: { tipo: "ordemValida" },
      ajudas: { pergunta: "O bolo precisa estar onde antes de ser cortado?", dica: "Encomendar é preparar; cortar é festejar, depois do parabéns." },
      falaAoConcluir: { texto: "Festa decomposta: três passos grandes, cada um com os seus pequenos.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "mensagem", grupo: "convidar" },
        { tipo: "porPasso", passo: "enfeitar", grupo: "preparar" },
        { tipo: "porPasso", passo: "bolo", grupo: "preparar" },
        { tipo: "porPasso", passo: "parabens", grupo: "festejar" },
        { tipo: "porPasso", passo: "cortar", grupo: "festejar" },
      ],
    },
  ],
  conclusao: [{ texto: "Agrupar testado.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar mexendo nos passos.", expressao: "feliz" },
};

/*
 * Demonstração do plano de código (`rodar`): os cartões são linhas, o Rodar
 * executa na ordem do plano (com a memória zerada) e os validadores de
 * código conferem o resultado; a ordem errada dá o erro de verdade.
 */
export const FASE_DEMO_ORDENAR_CODIGO: FaseOrdenarPassos = {
  id: "lab-logica-u1-f7",
  tipo: "ordenar-passos",
  unidadeId: "lab-logica-u1",
  titulo: "Demonstração do plano de código",
  conceitos: ["elemento"],
  revisa: [],
  prerequisitos: [],
  usaFerramentas: ["quadro-de-passos"],
  siteAlvo: SITE_DO_PROGRAMA,
  programa: {},
  ordenar: {
    modo: "ordenar",
    problema: "Mostrar o preço com desconto",
    rodar: true,
    cartoes: [
      { id: "preco", texto: "let preco = 20;" },
      { id: "desconto", texto: "let desconto = preco * 0.1;", depoisDe: ["preco"] },
      { id: "total", texto: "let total = preco - desconto;", depoisDe: ["preco", "desconto"] },
      { id: "mostrar", texto: "console.log(total);", depoisDe: ["total"] },
      { id: "errado", texto: "console.log(totl);", sobra: true },
    ],
    inicial: ["mostrar", "preco"],
  },
  introducao: [{ texto: "Agora os cartões são linhas de código. O Rodar executa o plano na ordem: vamos ver o que quebra.", expressao: "curioso" }],
  objetivos: [
    {
      id: "quebrar",
      tipo: "acao",
      modo: "guiado",
      enunciado: { mouse: "Clique em Rodar com o plano assim, e leia o erro.", toque: "Toque em Rodar com o plano assim, e leia o erro." },
      validador: { tipo: "erroDoTipo", nome: "ReferenceError" },
      ajudas: {
        pergunta: "Dá para mostrar o total antes de ele existir?",
        dica: "O Rodar executa de cima para baixo.",
        linha: { alvo: "ferramenta", ferramenta: "quadro-de-passos", fala: "O Rodar mora no plano." },
        solucao: { fala: "Rodei: total ainda não existia na primeira linha.", acoes: [{ tipo: "rodarPlano" }] },
      },
      falaAoConcluir: { texto: "ReferenceError: a linha 1 usou total antes de ele existir.", expressao: "curioso" },
      solucaoDeTeste: [{ tipo: "rodarPlano" }],
    },
    {
      id: "consertar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: { mouse: "Monte o plano na ordem que funciona e rode: tem que aparecer 18.", toque: "Monte o plano na ordem que funciona e rode: tem que aparecer 18." },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "ordemValida" },
          { tipo: "saida", igual: ["18"] },
        ],
      },
      ajudas: { pergunta: "O que cada linha precisa que já exista?", dica: "preco, depois desconto, depois total, e só então mostrar." },
      falaAoConcluir: { texto: "18! A mesma ideia do café: cada passo depois do que ele usa.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porPasso", passo: "preco", posicao: 0 },
        { tipo: "porPasso", passo: "desconto", posicao: 1 },
        { tipo: "porPasso", passo: "total", posicao: 2 },
        { tipo: "rodarPlano" },
      ],
    },
  ],
  conclusao: [{ texto: "Plano de código testado.", expressao: "feliz" }],
  falaFinal: { texto: "Pode continuar trocando a ordem e rodando.", expressao: "feliz" },
};

export const FASES_BANCADA_LOGICA: readonly Fase[] = [
  FASE_BANCADA_CONSOLE,
  FASE_DEMO_CIRCUITO,
  FASE_DEMO_DESAFIO_CIRCUITO,
  FASE_DEMO_DEPURADOR,
  FASE_DEMO_ORDENAR,
  FASE_DEMO_AGRUPAR,
  FASE_DEMO_ORDENAR_CODIGO,
];

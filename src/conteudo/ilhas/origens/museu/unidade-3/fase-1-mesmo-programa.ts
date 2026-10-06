/* Sala 3, fase 1: a conta da padaria em seis linguagens, lado a lado, e o coral dos antepassados. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { PADARIA, PARTES_PADARIA } from "./programas";

export const FASE_ORIGENS_U3_F1: Fase = {
  id: "origens-museu-u3-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u3",
  titulo: "O mesmo programa",
  conceitos: ["sintaxe"],
  revisa: ["linguagem-de-programacao"],
  prerequisitos: ["linguagem-de-programacao"],
  usaFerramentas: ["comparador-de-linguagens"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "A conta da padaria",
      texto: "O mesmo programa em seis linguagens, de épocas diferentes. JavaScript e Python rodam de verdade; as outras mostram a saída que elas dariam.",
    },
    falas: {
      abrir: "Uma conta. Seis linguagens. Pão, leite, bolo e um desconto. Vamos ver quem erra.",
      porEtapa: {
        "rodar-python": "Python. Roda aqui dentro, de verdade. Na primeira vez demora: ele tem que acordar inteiro.",
        "o-desconto": "Toque numa linha. A mesma ideia acende nas outras. O que muda é só a escrita.",
        "no-cobol": "COBOL. Do tempo dos cartões. Fala inglês de escritório. Ache o que mostra na tela.",
        coral: "Agora chame a família. Cada um canta na voz da sua época. Eu canto o C. Sem desafinar.",
      },
      concluir: "Seis jeitos de escrever. Uma resposta só: 35. O resto é sintaxe.",
    },
    estacoes: [{ id: "padaria", tipo: "comparador", titulo: "A conta da padaria", partes: PARTES_PADARIA, programas: PADARIA, coral: true }],
  },
  introducao: [
    { texto: "Esse é o meu avô, o terminal verde, de novo. A sala dele é a das linguagens: por que existem tantas?", expressao: "apontando" },
    { texto: "A conta da padaria escrita em seis linguagens. Vamos ver se elas concordam no total.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "rodar-js",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Rodar JavaScript e veja quanto deu a conta da padaria.",
        toque: "Toque em Rodar JavaScript e veja quanto deu a conta da padaria.",
      },
      validador: { tipo: "linguagensRodadas", estacao: "padaria", linguagens: ["javascript"] },
      apresentar: ["comparador-de-linguagens"],
      ajudas: {
        pergunta: "Cada programa tem um botão para rodar. Qual é o do JavaScript?",
        dica: "Rodar faz o computador seguir o programa e mostrar a saída embaixo.",
        linha: { alvo: "exposicao", estacao: "padaria", peca: "rodar:javascript", fala: "Este botão roda o JavaScript." },
        solucao: { fala: "Rodei o JavaScript: a conta deu 35.", acoes: [{ tipo: "rodarLinguagem", estacao: "padaria", linguagem: "javascript" }] },
      },
      falaAoConcluir: { texto: "Total: 35! Doze mais oito mais vinte dá quarenta; menos cinco de desconto, 35.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "rodarLinguagem", estacao: "padaria", linguagem: "javascript" }],
    },
    {
      id: "rodar-python",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora rode o Python. Ele roda de verdade, aqui dentro do navegador.",
        toque: "Agora rode o Python. Ele roda de verdade, aqui dentro do navegador.",
      },
      previsao: {
        pergunta: "O Python escreve a conta de outro jeito: sem let, sem ponto e vírgula. O que ele vai mostrar?",
        opcoes: ["Um erro: o navegador não entende Python", "Total: 35, igual ao JavaScript", "Outro total"],
        correta: 1,
        explicacao: "O mesmo cálculo dá o mesmo resultado. A escrita muda; a ideia, não.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linguagensRodadas", estacao: "padaria", linguagens: ["python"] },
          { tipo: "saida", contem: "Total: 35" },
        ],
      },
      ajudas: {
        pergunta: "Tem um Rodar em cada programa. Qual é o do Python?",
        dica: "Na primeira vez, o Python baixa e acorda: espere a barra encher.",
        linha: { alvo: "exposicao", estacao: "padaria", peca: "rodar:python", fala: "Este botão roda o Python." },
        solucao: { fala: "Rodei o Python: Total: 35, igualzinho.", acoes: [{ tipo: "rodarLinguagem", estacao: "padaria", linguagem: "python" }] },
      },
      falaAoConcluir: { texto: "Python de verdade, dentro do navegador! E concordou: 35.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }, { tipo: "rodarLinguagem", estacao: "padaria", linguagem: "python" }],
    },
    {
      id: "o-desconto",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na linha do desconto, em qualquer linguagem, e veja onde ele mora nas outras.",
        toque: "Toque na linha do desconto, em qualquer linguagem, e veja onde ele mora nas outras.",
      },
      validador: { tipo: "parteVista", estacao: "padaria", parte: "desconto" },
      ajudas: {
        pergunta: "Qual linha tira 5 do total?",
        dica: "No JavaScript, é total = total - 5. Tocar numa linha acende a mesma parte em todas.",
        linha: { alvo: "exposicao", estacao: "padaria", peca: "javascript:desconto", fala: "Esta linha dá o desconto." },
        solucao: { fala: "Toquei no desconto do JavaScript: ele acendeu nas seis.", acoes: [{ tipo: "tocarParte", estacao: "padaria", parte: "desconto", linguagem: "javascript" }] },
      },
      falaAoConcluir: { texto: "Acendeu em todas! Até no COBOL, que escreve SUBTRACT 5 FROM CONTA.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "tocarParte", estacao: "padaria", parte: "desconto", linguagem: "javascript" }],
    },
    {
      id: "no-cobol",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: ache, no COBOL, uma linha que mostra o resultado na tela.",
        toque: "Agora sozinho: ache, no COBOL, uma linha que mostra o resultado na tela.",
      },
      validador: { tipo: "parteVista", estacao: "padaria", parte: "mostrar", linguagens: ["cobol"] },
      ajudas: {
        pergunta: "No JavaScript é console.log. Que palavra em inglês quer dizer mostrar?",
        dica: "DISPLAY quer dizer mostrar. Toque na linha do COBOL que tem ela.",
      },
      falaAoConcluir: { texto: "DISPLAY! COBOL fala quase inglês de escritório. Foi feito para gente de negócio ler.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "tocarParte", estacao: "padaria", parte: "mostrar", linguagem: "cobol" }],
    },
    {
      id: "coral",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Chame o coral dos antepassados: cada um canta a conta na linguagem da sua época.",
        toque: "Chame o coral dos antepassados: cada um canta a conta na linguagem da sua época.",
      },
      validador: { tipo: "linguagensRodadas", estacao: "padaria" },
      ajudas: {
        pergunta: "Tem um botão que chama a família inteira. Onde?",
        dica: "O coral roda as seis linguagens, uma depois da outra.",
        linha: { alvo: "exposicao", estacao: "padaria", peca: "coral", fala: "Este botão chama o coral." },
        solucao: { fala: "Chamei o coral: a família inteira cantou a conta.", acoes: [{ tipo: "cantarCoral", estacao: "padaria" }] },
      },
      falaAoConcluir: { texto: "A família inteira cantou a mesma coisa! Cada um no seu jeito.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "cantarCoral", estacao: "padaria" }],
    },
  ],
  conclusao: [
    { texto: "Sintaxe é o jeito de escrever de cada linguagem: as palavras, os sinais, a ordem.", expressao: "apontando" },
    { texto: "O conceito é o mesmo. Quem aprende a pensar o programa aprende qualquer escrita depois.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Procure \"hello world\" na Wikipédia em inglês: o artigo mostra o mesmo programa em várias linguagens. Compare duas delas e ache o que é igual e o que muda.",
  falaFinal: { texto: "Toda linguagem que você aprender depois vai ser só um jeito novo de escrever o que você já sabe pensar.", expressao: "feliz" },
};

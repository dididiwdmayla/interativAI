/* Sala 3, desafio: o frete em quatro linguagens, os serviços e a escada, sem passo a passo. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { FRETE, PARTES_FRETE } from "./programas";

export const FASE_ORIGENS_U3_F5: Fase = {
  id: "origens-museu-u3-f5",
  tipo: "desafio",
  unidadeId: "origens-museu-u3",
  titulo: "O frete em quatro linguagens",
  conceitos: ["sintaxe", "ferramenta-certa", "alto-e-baixo-nivel"],
  revisa: ["compilador", "interpretador", "indentacao"],
  prerequisitos: ["sintaxe"],
  usaFerramentas: ["comparador-de-linguagens", "cartoes-de-ligar", "ordem-dos-cartoes"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "O frete da padaria",
      texto: "Compra acima de 30 reais tem frete grátis. Uma decisão, em quatro linguagens. E mais serviços e degraus para pôr no lugar.",
    },
    falas: {
      abrir: "Último teste da sala. Uma decisão, quatro escritas. Sem ajuda minha. Só o Rever.",
      porEtapa: {
        "decisao-java": "IF no Java. Achou. Quase igual ao JavaScript, repare.",
        "rodar-python": "Python rodou. Frete grátis. Correto.",
        servicos: "Cada problema com a sua linguagem. Bom.",
        escada: "Escada certa. Da máquina até você.",
      },
      concluir: "Sala 3 concluída. Você lê qualquer linguagem como quem lê um mapa. Pode passar.",
    },
    estacoes: [
      { id: "frete", tipo: "comparador", titulo: "O frete", partes: PARTES_FRETE, programas: FRETE },
      {
        id: "situacoes",
        tipo: "ligar",
        titulo: "Qual linguagem?",
        pergunta: "Para cada problema, a linguagem que mais combina",
        alvos: [
          { id: "javascript", nome: "JavaScript" },
          { id: "python", nome: "Python" },
          { id: "cobol", nome: "COBOL" },
          { id: "c", nome: "C" },
        ],
        cartoes: [
          { id: "botao", texto: "Um botão que muda a página na hora, no navegador", alvo: "javascript", revela: "O navegador roda JavaScript sem instalar nada." },
          { id: "planilha", texto: "Analisar uma planilha com um milhão de linhas", alvo: "python", revela: "Python tem ferramentas prontas para dados e gráficos." },
          { id: "banco", texto: "Manter o sistema antigo de um banco", alvo: "cobol", revela: "Esses sistemas rodam há décadas e alguém precisa cuidar deles." },
          { id: "micro-ondas", texto: "O programa dentro de um micro-ondas", alvo: "c", revela: "C é pequeno e rápido: cabe no chip de um aparelho." },
        ],
      },
      {
        id: "escada-js",
        tipo: "ordem",
        titulo: "A escada",
        aparencia: "escada",
        itens: [
          { id: "bits", texto: "Bits: 0010 0111", revela: "O que o processador lê." },
          { id: "assembly", texto: "Assembly: ADD", revela: "Uma palavra para cada ordem da máquina." },
          { id: "c", texto: "C: total = total + 5;", revela: "Nomes e contas, com a memória na mão." },
          { id: "javascript", texto: "JavaScript: total += 5", revela: "O navegador cuida do resto." },
        ],
        pontas: { inicio: "Perto da máquina", fim: "Perto da gente" },
      },
    ],
  },
  introducao: [
    { texto: "Desafio da sala 3! A padaria dá frete grátis acima de 30 reais. Quatro linguagens decidem isso.", expressao: "apontando" },
    { texto: "Sem passo a passo. Se travar, o Rever leva você de volta à exposição certa.", expressao: "feliz" },
  ],
  partes: [
    {
      id: "decisao-java",
      descricao: "No comparador do frete, achar a decisão no Java",
      validador: { tipo: "parteVista", estacao: "frete", parte: "decisao", linguagens: ["java"] },
      revisarEm: "origens-museu-u3-f1",
      solucaoDeTeste: [{ tipo: "tocarParte", estacao: "frete", parte: "decisao", linguagem: "java" }],
    },
    {
      id: "rodar-python",
      descricao: "Rodar o frete em Python e ver o que ele decide",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "linguagensRodadas", estacao: "frete", linguagens: ["python"] },
          { tipo: "saida", contem: "Frete grátis" },
        ],
      },
      revisarEm: "origens-museu-u3-f1",
      solucaoDeTeste: [{ tipo: "rodarLinguagem", estacao: "frete", linguagem: "python" }],
    },
    {
      id: "servicos",
      descricao: "Ligar cada problema à linguagem que mais combina",
      validador: { tipo: "cartoesLigados", estacao: "situacoes" },
      revisarEm: "origens-museu-u3-f2",
      solucaoDeTeste: [
        { tipo: "ligarCartao", estacao: "situacoes", cartao: "botao", alvo: "javascript" },
        { tipo: "ligarCartao", estacao: "situacoes", cartao: "planilha", alvo: "python" },
        { tipo: "ligarCartao", estacao: "situacoes", cartao: "banco", alvo: "cobol" },
        { tipo: "ligarCartao", estacao: "situacoes", cartao: "micro-ondas", alvo: "c" },
      ],
    },
    {
      id: "escada",
      descricao: "Montar a escada, do mais perto da máquina ao mais perto da gente",
      validador: { tipo: "ordemCerta", estacao: "escada-js" },
      revisarEm: "origens-museu-u3-f4",
      solucaoDeTeste: [
        { tipo: "porNaOrdem", estacao: "escada-js", item: "bits" },
        { tipo: "porNaOrdem", estacao: "escada-js", item: "assembly" },
        { tipo: "porNaOrdem", estacao: "escada-js", item: "c" },
        { tipo: "porNaOrdem", estacao: "escada-js", item: "javascript" },
      ],
    },
  ],
  conclusao: [
    { texto: "Você leu uma decisão em quatro linguagens, escolheu a linguagem certa para cada problema e subiu a escada.", expressao: "comemorando" },
    { texto: "Próxima sala: o tio PC bege abre o computador para a gente ver por dentro.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Escolha um problema da sua vida (a lista do mercado, o placar de um jogo) e pense: que linguagem desta sala você usaria, e por quê? Não tem resposta única: tem bom motivo.",
  falaFinal: { texto: "Bora pra sala 4! O tio bege está carregando o disquete.", expressao: "comemorando" },
};

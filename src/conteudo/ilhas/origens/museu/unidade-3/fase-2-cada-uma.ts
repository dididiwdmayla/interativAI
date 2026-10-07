/* Sala 3, fase 2: cada linguagem no seu serviço (por que existem tantas). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_ORIGENS_U3_F2: Fase = {
  id: "origens-museu-u3-f2",
  tipo: "pratica",
  unidadeId: "origens-museu-u3",
  titulo: "Cada uma no seu serviço",
  conceitos: ["ferramenta-certa"],
  revisa: ["sintaxe"],
  prerequisitos: ["sintaxe"],
  usaFerramentas: ["cartoes-de-ligar"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "terminal",
    placa: {
      titulo: "Por que tantas linguagens?",
      texto: "Cada linguagem nasceu numa época, para um tipo de problema. Muitas servem para quase tudo, mas cada uma tem o seu forte.",
    },
    falas: {
      abrir: "Martelo não aparafusa. Linguagem também tem serviço. Ligue cada uma ao dela.",
      porEtapa: {
        "as-outras": "Cinco cartões. Cinco serviços. Sem chute.",
      },
      concluir: "Correto. Não existe a melhor linguagem. Existe a certa para o serviço.",
    },
    estacoes: [
      {
        id: "usos",
        tipo: "ligar",
        titulo: "Cada uma no seu serviço",
        pergunta: "Leve cada linguagem para o serviço em que ela ficou famosa",
        alvos: [
          { id: "paginas", nome: "Páginas que reagem", descricao: "Botões, menus e animações no navegador" },
          { id: "dados", nome: "Dados e IA", descricao: "Analisar planilhas gigantes e treinar IA" },
          { id: "bancos", nome: "Bancos e empresas antigas", descricao: "Folha de pagamento, contas, saldos" },
          { id: "casa", nome: "Os computadores de casa", descricao: "Os primeiros programas feitos em casa" },
          { id: "sistemas", nome: "Sistemas e aparelhos", descricao: "O núcleo do sistema e o chip das máquinas" },
          { id: "empresas", nome: "Empresas e celulares", descricao: "Sistemas grandes e apps de Android" },
        ],
        cartoes: [
          { id: "javascript", texto: "JavaScript", alvo: "paginas", revela: "Todo navegador roda JavaScript sem instalar nada. É a linguagem da Ilha Lógica." },
          { id: "python", texto: "Python", alvo: "dados", revela: "Python virou a linguagem mais comum para analisar dados e treinar IA. É a da futura Ilha Python." },
          { id: "cobol", texto: "COBOL", alvo: "bancos", revela: "Feito no fim dos anos 1950 para negócios. Muito sistema de banco ainda roda em COBOL." },
          { id: "basic", texto: "BASIC", alvo: "casa", revela: "Nos anos 1980, muito computador de casa ligava pronto para receber BASIC." },
          { id: "c", texto: "C", alvo: "sistemas", revela: "Nasceu junto com o Unix. O núcleo do Linux é escrito quase todo em C." },
          { id: "java", texto: "Java", alvo: "empresas", revela: "Por muitos anos, os apps de Android eram escritos em Java. Hoje muitos usam Kotlin, uma prima dele." },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Se todas fazem a mesma conta, por que não existe uma linguagem só?", expressao: "curioso" },
    { texto: "Cada uma nasceu numa época, para resolver um tipo de problema. Vamos ver qual é o forte de cada uma.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "javascript",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no cartão do JavaScript e depois no serviço dele.",
        toque: "Toque no cartão do JavaScript e depois no serviço dele.",
      },
      validador: { tipo: "cartoesLigados", estacao: "usos", cartoes: ["javascript"] },
      apresentar: ["cartoes-de-ligar"],
      ajudas: {
        pergunta: "Em que lugar você já viu JavaScript rodar, desde a Ilha Lógica?",
        dica: "O JavaScript roda dentro do navegador: é ele que faz a página reagir.",
        linha: { alvo: "exposicao", estacao: "usos", peca: "paginas", fala: "Este é o serviço do JavaScript." },
        solucao: { fala: "Levei o JavaScript para as páginas que reagem.", acoes: [{ tipo: "ligarCartao", estacao: "usos", cartao: "javascript", alvo: "paginas" }] },
      },
      falaAoConcluir: { texto: "Isso! O JavaScript mora no navegador. Por isso ele é a linguagem da web.", expressao: "feliz" },
      solucaoDeTeste: [{ tipo: "ligarCartao", estacao: "usos", cartao: "javascript", alvo: "paginas" }],
    },
    {
      id: "as-outras",
      tipo: "previsao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: leve as outras cinco linguagens para o serviço de cada uma.",
        toque: "Agora sozinho: leve as outras cinco linguagens para o serviço de cada uma.",
      },
      previsao: {
        pergunta: "Antes de ligar: por que você acha que existem tantas linguagens?",
        opcoes: ["Cada computador só entende uma", "Cada uma nasceu para um tipo de problema, numa época", "Por moda: todas fazem tudo do mesmo jeito"],
        correta: 1,
        explicacao: "Todo computador entende qualquer uma (com o tradutor certo). Elas nasceram para problemas diferentes.",
      },
      validador: { tipo: "cartoesLigados", estacao: "usos" },
      ajudas: {
        pergunta: "Qual delas é a mais antiga? E qual nasceu para os computadores de casa?",
        dica: "Cartão no lugar certo mostra uma curiosidade. Se não mostrou, leve para outro serviço.",
      },
      falaAoConcluir: { texto: "Seis linguagens, seis serviços. E todas conversam com a mesma máquina lá embaixo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "ligarCartao", estacao: "usos", cartao: "python", alvo: "dados" },
        { tipo: "ligarCartao", estacao: "usos", cartao: "cobol", alvo: "bancos" },
        { tipo: "ligarCartao", estacao: "usos", cartao: "basic", alvo: "casa" },
        { tipo: "ligarCartao", estacao: "usos", cartao: "c", alvo: "sistemas" },
        { tipo: "ligarCartao", estacao: "usos", cartao: "java", alvo: "empresas" },
      ],
    },
  ],
  conclusao: [
    { texto: "Não existe a melhor linguagem: existe a certa para cada trabalho.", expressao: "apontando" },
    { texto: "E o que você aprende numa serve nas outras: variável, conta, decisão e repetição existem em todas.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pergunte para alguém que trabalha com computador (ou procure uma vaga de emprego de programação) qual linguagem a empresa usa e para quê. Compare com os serviços desta sala.",
  falaFinal: { texto: "Na trilha, você aprende JavaScript primeiro (é a do navegador) e depois Python. As duas rodam aqui no museu.", expressao: "feliz" },
};

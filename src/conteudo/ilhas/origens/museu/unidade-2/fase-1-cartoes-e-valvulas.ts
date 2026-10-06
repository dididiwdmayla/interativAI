/* Sala 2, fase 1: dos cartões às válvulas. Pôr na ordem e descobrir o que cada máquina mudou. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { eventos } from "./eventos";

export const FASE_ORIGENS_U2_F1: Fase = {
  id: "origens-museu-u2-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u2",
  titulo: "Dos cartões às válvulas",
  conceitos: ["cartao-perfurado", "historia-da-computacao", "transistor"],
  revisa: ["bit", "linguagem-de-programacao"],
  prerequisitos: [],
  usaFerramentas: ["linha-do-tempo-museu"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "engrenagens",
    placa: {
      titulo: "A Máquina Analítica",
      texto: "Projetada por Charles Babbage nos anos 1830, nunca foi construída inteira. Para ela, Ada Lovelace publicou um dos primeiros programas, em 1843.",
    },
    falas: {
      abrir: "Olá! Eu sou a sonhadora da família. Nunca me construíram inteira, mas eu lembro de todo mundo. Vamos pôr a história em ordem?",
      porEtapa: {
        "depois-do-tear": "A tecelã já está no lugar dela, lá no começo. Quem veio logo depois? Eu! E depois de mim, os cartões do censo.",
        "valvula-transistor": "Agora os mais barulhentos: o gigante de válvulas e a chavinha que veio substituir as válvulas dele.",
        "jeitos-de-programar": "Do lado, outra linha: os jeitos de dar ordens a uma máquina. Essa é com você.",
      },
      concluir: "Viu como um puxa o outro? Sem os cartões da tecelã, eu nem teria sido sonhada.",
    },
    estacoes: [
      { id: "linha-antigos", tipo: "linha-do-tempo", titulo: "Das engrenagens à eletricidade", eventos: eventos("tear", "analitica", "censo", "valvulas", "transistor"), fixos: ["tear"] },
      { id: "linha-ordens", tipo: "linha-do-tempo", titulo: "Como se davam as ordens", eventos: eventos("valvulas", "linguagens", "terminal", "ia") },
    ],
  },
  introducao: [
    { texto: "Bem-vindo à sala 2! Essa é a minha bisavó, a sonhadora de engrenagens. Ela é honesta sobre a própria história.", expressao: "apontando" },
    { texto: "Aqui a gente põe a família na ordem certa. Cada cartão no lugar certo conta o que aquela máquina mudou no mundo.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "depois-do-tear",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ponha a Máquina Analítica e os cartões do censo na linha, depois do tear, na ordem em que aconteceram.",
        toque: "Ponha a Máquina Analítica e os cartões do censo na linha, depois do tear, na ordem em que aconteceram.",
      },
      validador: { tipo: "linhaEmOrdem", estacao: "linha-antigos", eventos: ["tear", "analitica", "censo"] },
      apresentar: ["linha-do-tempo-museu"],
      ajudas: {
        pergunta: "A Máquina Analítica ia ler cartões como os do tear. Ela veio antes ou depois dele?",
        dica: "Uma invenção quase sempre aproveita a de antes. Quem usa a ideia de outra máquina vem depois dela.",
        linha: { alvo: "exposicao", estacao: "linha-antigos", peca: "analitica", fala: "Comece por este cartão: a Máquina Analítica." },
        solucao: {
          fala: "Pus a Máquina Analítica logo depois do tear, e os cartões do censo depois dela.",
          acoes: [
            { tipo: "porNaLinha", estacao: "linha-antigos", evento: "analitica", posicao: 1 },
            { tipo: "porNaLinha", estacao: "linha-antigos", evento: "censo", posicao: 2 },
          ],
        },
      },
      falaAoConcluir: { texto: "Os cartões passaram do pano para a conta! Cada cartão no lugar mostra o que mudou.", expressao: "feliz" },
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-antigos", evento: "analitica" },
        { tipo: "porNaLinha", estacao: "linha-antigos", evento: "censo" },
      ],
    },
    {
      id: "valvula-transistor",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Agora confira: ponha as válvulas e o transistor no fim da linha, na ordem certa.",
        toque: "Agora confira: ponha as válvulas e o transistor no fim da linha, na ordem certa.",
      },
      previsao: {
        pergunta: "O transistor veio antes ou depois dos computadores de válvulas?",
        opcoes: ["Antes: as válvulas copiaram o transistor", "Depois: ele veio para trocar a válvula", "Os dois nasceram no mesmo dia"],
        correta: 1,
        explicacao: "As válvulas vieram primeiro e esquentavam muito. O transistor, do fim dos anos 1940, fazia o mesmo serviço menor e mais frio.",
      },
      validador: { tipo: "linhaEmOrdem", estacao: "linha-antigos" },
      ajudas: {
        pergunta: "Qual dos dois resolveu um problema do outro: o calor e o tamanho?",
        dica: "O transistor é uma chavinha que faz o serviço da válvula. Quem conserta um problema vem depois dele.",
        linha: { alvo: "exposicao", estacao: "linha-antigos", peca: "valvulas", fala: "Os gigantes de válvulas vêm primeiro." },
        solucao: {
          fala: "Pus os gigantes de válvulas e, depois deles, o transistor.",
          acoes: [
            { tipo: "porNaLinha", estacao: "linha-antigos", evento: "valvulas", posicao: 3 },
            { tipo: "porNaLinha", estacao: "linha-antigos", evento: "transistor", posicao: 4 },
          ],
        },
      },
      falaAoConcluir: { texto: "Do tear ao transistor, em ordem! Repare: cada um resolveu um problema do anterior.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "porNaLinha", estacao: "linha-antigos", evento: "valvulas" },
        { tipo: "porNaLinha", estacao: "linha-antigos", evento: "transistor" },
      ],
    },
    {
      id: "jeitos-de-programar",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Na outra linha, ponha na ordem os jeitos de dar ordens ao computador, do mais antigo ao mais novo.",
        toque: "Na outra linha, ponha na ordem os jeitos de dar ordens ao computador, do mais antigo ao mais novo.",
      },
      validador: { tipo: "linhaEmOrdem", estacao: "linha-ordens" },
      ajudas: {
        pergunta: "Antes de existir tela, como a pessoa dava ordens para a máquina?",
        dica: "Cabos e chaves, depois palavras em cartões, depois digitar na tela, e por fim conversar.",
      },
      falaAoConcluir: { texto: "Dos cabos à conversa! Hoje você programa digitando. Amanhã, quem sabe?", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-ordens", evento: "valvulas" },
        { tipo: "porNaLinha", estacao: "linha-ordens", evento: "linguagens" },
        { tipo: "porNaLinha", estacao: "linha-ordens", evento: "terminal" },
        { tipo: "porNaLinha", estacao: "linha-ordens", evento: "ia" },
      ],
    },
  ],
  conclusao: [
    { texto: "O cartão perfurado durou mais de um século: do tear ao censo e aos primeiros programas escritos com palavras.", expressao: "apontando" },
    { texto: "E a chavinha do transistor está aqui dentro de mim, aos bilhões. Somos todos parentes!", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Procure na internet uma foto de um cartão perfurado de programa, dos anos 1950 ou 1960. Repare que cada coluna era uma letra. Um programa inteiro podia ser uma caixa cheia deles, e derrubar a caixa era um desastre!",
  falaFinal: { texto: "Na próxima, a família chega na sua casa e no seu bolso.", expressao: "feliz" },
};

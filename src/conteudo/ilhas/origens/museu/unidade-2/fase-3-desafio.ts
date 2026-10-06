/* Sala 2, desafio: a família inteira em ordem, cada um com a plaquinha do que mudou. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { eventos } from "./eventos";

export const FASE_ORIGENS_U2_F3: Fase = {
  id: "origens-museu-u2-f3",
  tipo: "desafio",
  unidadeId: "origens-museu-u2",
  titulo: "A família inteira",
  conceitos: ["historia-da-computacao", "cartao-perfurado", "computador-pessoal", "web"],
  revisa: ["transistor", "bit"],
  prerequisitos: ["historia-da-computacao"],
  usaFerramentas: ["linha-do-tempo-museu"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "engrenagens",
    placa: {
      titulo: "A árvore da família",
      texto: "Seis gerações, do tear de 1800 e pouco à IA de agora. Cada uma aproveitou o que a anterior inventou.",
    },
    falas: {
      abrir: "O último trabalho da sala: a família inteira em ordem, e cada plaquinha no dono certo. Depois, corre para o fim do corredor.",
      porEtapa: {
        antigos: "Os mais velhos estão em ordem. Eu, no meio deles, toda orgulhosa.",
        novos: "Os mais novos também! Do computador de casa até a IA.",
        mudou: "Cada um com a sua plaquinha. Que museu bonito ficou!",
      },
      concluir: "Pronto. Agora vai lá no fim do corredor. Tem um lugar esperando por você.",
    },
    estacoes: [
      { id: "linha-familia", tipo: "linha-do-tempo", titulo: "A família inteira", eventos: eventos("tear", "analitica", "valvulas", "pc", "celular", "ia"), plaquinhas: true },
    ],
  },
  introducao: [
    { texto: "Desafio da sala 2! A família inteira na linha, do mais antigo ao mais novo, e cada um com a plaquinha do que mudou.", expressao: "apontando" },
    { texto: "Sem passo a passo. Se travar, o Rever leva você de volta à exposição certa.", expressao: "feliz" },
  ],
  partes: [
    {
      id: "antigos",
      descricao: "Pôr na ordem os três mais antigos: o tear, a Máquina Analítica e os gigantes de válvulas",
      validador: { tipo: "linhaEmOrdem", estacao: "linha-familia", eventos: ["tear", "analitica", "valvulas"] },
      revisarEm: "origens-museu-u2-f1",
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "tear" },
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "analitica" },
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "valvulas" },
      ],
    },
    {
      id: "novos",
      descricao: "Pôr na ordem os três mais novos, depois dos antigos: o computador pessoal, o smartphone e a IA",
      validador: { tipo: "linhaEmOrdem", estacao: "linha-familia" },
      revisarEm: "origens-museu-u2-f2",
      solucaoDeTeste: [
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "pc" },
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "celular" },
        { tipo: "porNaLinha", estacao: "linha-familia", evento: "ia" },
      ],
    },
    {
      id: "mudou",
      descricao: "Pendurar em cada parente a plaquinha do que ele mudou",
      validador: { tipo: "plaquinhasCertas", estacao: "linha-familia" },
      revisarEm: "origens-museu-u2-f2",
      solucaoDeTeste: ["tear", "analitica", "valvulas", "pc", "celular", "ia"].map((id) => ({ tipo: "pendurarPlaquinha", estacao: "linha-familia", evento: id, plaquinha: id }) as const),
    },
  ],
  conclusao: [
    { texto: "Seis gerações em ordem, e cada uma com a sua história. Você conhece a família inteira!", expressao: "comemorando" },
    { texto: "Volta ao corredor do museu. Depois de mim, tem um lugar que estava vazio... até agora.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Conte para alguém a história da família em um minuto: do tear que lia cartões até a IA que conversa. Se a pessoa perguntar \"e o que vem depois?\", diga que é você que vai programar.",
  falaFinal: { texto: "Corre pro fim do corredor! Eu espero lá.", expressao: "comemorando" },
};

/*
 * Sala 5, fase 3: a internet carrega o pacote do aluno pelo oceano do
 * próprio mapa do jogo, pelos cabos submarinos entre as ilhas (a internet
 * é física).
 */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { cabosDoMapa, ILHAS_DO_MAPA, PONTOS_DO_MAPA } from "./dados";

const pular = (no: string) => ({ tipo: "comandoNaEstacao", estacao: "mapa", comando: `pular:${no}` }) as const;

export const FASE_ORIGENS_U5_F3: Fase = {
  id: "origens-museu-u5-f3",
  tipo: "pratica",
  unidadeId: "origens-museu-u5",
  titulo: "Um pacote pelo oceano",
  conceitos: ["pacote-de-rede", "cabo-submarino"],
  revisa: ["roteador", "front-e-back"],
  prerequisitos: ["roteador"],
  usaFerramentas: ["mapa-dos-cabos"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "internet",
    placa: {
      titulo: "A internet é física",
      texto: "Os pacotes andam por cabos de verdade: nos postes, debaixo da rua e no fundo do mar. Este é o oceano do próprio jogo, com as ilhas e os cabos entre elas.",
    },
    falas: {
      abrir: "Agora segura firme: eu vou levar o SEU pacote! Da sua casa, nas Origens, até o servidor lá na ilha Rede e Servidor!",
      porEtapa: {
        "ate-o-servidor": "Do bairro para a estação de cabo, e daí... mergulho! Os cabos passam pelo fundo do mar, entre as ilhas!",
        "outro-caminho": "Sabia que tem mais de um caminho? Se um cabo cai, eu vou por outro. Experimenta pela ilha Sites!",
      },
      concluir: "Entregue! E voltaria do mesmo jeito, em pacotinhos. Eu adoro uma viagem!",
    },
    estacoes: [
      { id: "mapa", tipo: "pacote", titulo: "O mapa dos cabos", ilhas: ILHAS_DO_MAPA, nos: PONTOS_DO_MAPA, cabos: cabosDoMapa(), origem: "casa", destino: "servidor" },
    ],
  },
  introducao: [
    { texto: "Olha! É o oceano do nosso mapa, com as ilhas. E tem cabo no fundo do mar ligando tudo!", expressao: "curioso" },
    { texto: "O pedido do clique vira pacotes. A tia vai deixar você levar um, pulo por pulo.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "primeiro-pulo",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Mande o pacote da sua casa para o roteador do bairro (o ponto que pisca).",
        toque: "Mande o pacote da sua casa para o roteador do bairro (o ponto que pisca).",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "mapa", marco: "chegou:bairro" },
      apresentar: ["mapa-dos-cabos"],
      ajudas: {
        pergunta: "Qual é o primeiro roteador por onde passa tudo o que sai da sua casa?",
        dica: "O pacote só pula para um vizinho ligado por cabo. Os vizinhos piscam.",
        linha: { alvo: "exposicao", estacao: "mapa", peca: "bairro", fala: "Este é o roteador do bairro." },
        solucao: { fala: "Mandei o pacote para o roteador do bairro.", acoes: [pular("bairro")] },
      },
      falaAoConcluir: { texto: "Primeiro pulo! O roteador do bairro olha o endereço e passa adiante.", expressao: "feliz" },
      solucaoDeTeste: [pular("bairro")],
    },
    {
      id: "ate-o-servidor",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: leve o pacote até o servidor da padaria, na ilha Rede e Servidor.",
        toque: "Agora sozinho: leve o pacote até o servidor da padaria, na ilha Rede e Servidor.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "mapa", marco: "entregue" },
      ajudas: {
        pergunta: "O servidor está do outro lado do mar. Por onde o pacote atravessa?",
        dica: "Vá até a estação de cabo da costa: dali saem os cabos submarinos para as outras ilhas.",
      },
      falaAoConcluir: { texto: "Entregue! O pacote atravessou o oceano por um cabo no fundo do mar.", expressao: "comemorando" },
      solucaoDeTeste: [pular("costa-origens"), pular("logica"), pular("costa-rede"), pular("servidor")],
    },
    {
      id: "outro-caminho",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Recomece e mande o pacote de novo, agora passando pela ilha Sites.",
        toque: "Recomece e mande o pacote de novo, agora passando pela ilha Sites.",
      },
      previsao: {
        pergunta: "Na internet de verdade, por onde passa quase todo o tráfego entre os continentes?",
        opcoes: ["Por satélites", "Por cabos no fundo do mar", "Pelo ar, como rádio"],
        correta: 1,
        explicacao: "Quase tudo passa por cabos de fibra no fundo do mar. Satélite existe, mas carrega bem menos.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "marcoNaEstacao", estacao: "mapa", marco: "entregue" },
          { tipo: "marcoNaEstacao", estacao: "mapa", marco: "chegou:sites" },
        ],
      },
      ajudas: {
        pergunta: "Da estação de cabo das Origens saem dois cabos submarinos. Qual vai para a Sites?",
        dica: "Recomeçar volta o pacote para casa. Depois, escolha o cabo que desce para a ilha Sites.",
        linha: { alvo: "exposicao", estacao: "mapa", peca: "sites", fala: "Passe por este roteador." },
        solucao: {
          fala: "Recomecei e fui pela ilha Sites: outro caminho, mesmo destino.",
          acoes: [{ tipo: "comandoNaEstacao", estacao: "mapa", comando: "recomecar" }, pular("bairro"), pular("costa-origens"), pular("sites"), pular("costa-rede"), pular("servidor")],
        },
      },
      falaAoConcluir: { texto: "Dois caminhos, o mesmo destino. Se um cabo partir, os roteadores escolhem outro sozinhos.", expressao: "apontando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "comandoNaEstacao", estacao: "mapa", comando: "recomecar" },
        pular("bairro"),
        pular("costa-origens"),
        pular("sites"),
        pular("costa-rede"),
        pular("servidor"),
      ],
    },
  ],
  conclusao: [
    { texto: "Um pedido vira pacotes, que pulam de roteador em roteador. Entre continentes, pelo fundo do mar.", expressao: "apontando" },
    { texto: "A internet não é uma nuvem: são cabos, roteadores e servidores de verdade.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Procure \"mapa de cabos submarinos\" (Submarine Cable Map) e ache os cabos que chegam ao Brasil: Fortaleza é um dos lugares com mais cabos. A sua internet pode estar passando por um deles agora.",
  falaFinal: { texto: "Da próxima vez que um vídeo carregar, lembra: ele pode ter atravessado um oceano.", expressao: "feliz" },
};

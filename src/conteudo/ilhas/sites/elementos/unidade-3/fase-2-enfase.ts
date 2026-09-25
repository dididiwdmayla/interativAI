/*
 * Unidade 3, Fase 2: "Ênfase de verdade".
 *
 * O QUE ENSINA: strong vs b (importância de verdade vs só aparência) e em
 * vs i (tom de verdade vs só itálico), atacando de frente a confusão "b e
 * strong são iguais".
 *
 * REVISÃO ESPAÇADA: a tag p (fase 1 desta unidade) volta misturada: as
 * três palavras a corrigir moram dentro de parágrafos.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, previsão: antes de trocar o b por strong, o jogador aposta se
 *    o visual muda. Não muda (os dois ficam em negrito) — só o significado.
 *    É a resposta direta à confusão do mapa curricular.
 * 2. Guiado, ação: a mesma pegadinha do lado do itálico (i vira em), agora
 *    sem previsão, só a ação e a explicação.
 * 3. Sozinho: as duas trocas juntas, num parágrafo novo, sem dizer qual é
 *    qual — o jogador decide pelo sentido de cada palavra.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_HORTA } from "./sites/blogDaHorta";

export const FASE_U3_F2: FasePratica = {
  id: "sites-elementos-u3-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u3",
  titulo: "Ênfase de verdade",
  conceitos: ["enfase-forte", "enfase-leve"],
  revisa: ["paragrafo"],
  prerequisitos: ["tag", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "renomear-tag"],
  siteAlvo: SITE_HORTA,

  introducao: [
    { texto: "O post da horta usa negrito e itálico em três lugares, mas só por estética.", expressao: "feliz" },
    { texto: "Tem duas tags que parecem gêmeas do b e do i, mas dizem 'isso é importante de verdade'.", expressao: "pensativo" },
    { texto: "Vamos destravar o significado escondido por trás da aparência.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "aviso-forte",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: se a gente trocar esse b de 'Atenção' por strong, o que muda no visual?",
        opcoes: ["Fica maior", "Nada muda no visual, só o significado", "Vira itálico"],
        correta: 1,
        explicacao:
          "Os navegadores deixam os dois em negrito do mesmo jeito. A diferença é que o strong avisa de verdade: leitor de tela e busca entendem que aquilo é importante.",
      },
      enunciado: {
        mouse: "Agora confira: troque o b de 'Atenção' (no primeiro aviso) para strong.",
        toque: "Agora confira: toque duas vezes no nome da tag e troque o b de 'Atenção' para strong.",
      },
      validador: { tipo: "tag", seletor: "#aviso .destaque-importante", nome: "strong" },
      ajudas: {
        pergunta: "Visualmente, negrito com b e negrito com strong parecem diferentes?",
        dica: "strong e b ficam com a mesma cara (negrito). A diferença é o significado: strong diz que aquilo é importante de verdade.",
        linha: {
          alvo: "arvore",
          seletor: "#aviso .destaque-importante",
          fala: "Essa é a palavra 'Atenção', ainda marcada com b. Dois cliques no nome da tag trocam para strong.",
        },
        solucao: {
          fala: "Troquei o b por strong: continua em negrito, mas agora avisa de verdade que é importante.",
          acoes: [{ tipo: "renomearTag", seletor: "#aviso .destaque-importante", novaTag: "strong" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! Mesma cara, significado diferente: agora o aviso é importante de verdade.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "renomearTag", seletor: "#aviso .destaque-importante", novaTag: "strong" },
      ],
    },
    {
      id: "curiosidade-em",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque o i de 'oito semanas' para em: é um tom diferente na frase, não só um estilo.",
        toque: "Toque duas vezes no nome da tag e troque o i de 'oito semanas' para em.",
      },
      validador: { tipo: "tag", seletor: "#curiosidade .destaque-tom", nome: "em" },
      ajudas: {
        pergunta: "Esse trecho muda o tom da frase, ou é só decoração?",
        dica: "O em marca um tom diferente, como se você falasse essa parte com outra entonação. O i só deixa itálico, sem dizer nada a mais.",
        linha: {
          alvo: "arvore",
          seletor: "#curiosidade .destaque-tom",
          fala: "Essa é a peça 'oito semanas', ainda em i. Dois cliques no nome da tag trocam para em.",
        },
        solucao: {
          fala: "Troquei o i por em: continua em itálico, mas agora sinaliza um tom diferente de verdade.",
          acoes: [{ tipo: "renomearTag", seletor: "#curiosidade .destaque-tom", novaTag: "em" }],
        },
      },
      falaAoConcluir: {
        texto: "Boa! em e i também têm essa pegadinha: mesma cara, significados diferentes.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#curiosidade .destaque-tom", novaTag: "em" }],
    },
    {
      id: "enfase-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "No último aviso, deixe as duas ênfases com a marcação certa: uma de importância, outra de tom.",
        toque: "No último aviso, deixe as duas ênfases com a marcação certa: uma de importância, outra de tom.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#extra .destaque-importante", nome: "strong" },
          { tipo: "tag", seletor: "#extra .destaque-tom", nome: "em" },
        ],
      },
      ajudas: {
        pergunta: "Qual das duas palavras é importante de verdade, e qual só muda o tom da frase?",
        dica: "strong para importância, em para tom. As duas continuam com a mesma cara visual depois de trocadas.",
      },
      falaAoConcluir: { texto: "Show! Duas ênfases certas, sem passo a passo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#extra .destaque-importante", novaTag: "strong" },
        { tipo: "renomearTag", seletor: "#extra .destaque-tom", novaTag: "em" },
      ],
    },
  ],

  conclusao: [
    { texto: "Negrito e itálico têm dois donos: um só de aparência (b, i) e um de significado (strong, em).", expressao: "comemorando" },
    { texto: "No F12 de verdade, um leitor de tela lê 'importante' quando passa por um strong. b ele ignora.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache um texto em negrito. Veja se a tag é b ou strong: será que o site usou a certa?",

  falaFinal: {
    texto: "Dica: se você apagaria a ênfase e a frase perderia sentido, é strong ou em. Se é só enfeite, use span (semana que vem!).",
    expressao: "curioso",
  },
};

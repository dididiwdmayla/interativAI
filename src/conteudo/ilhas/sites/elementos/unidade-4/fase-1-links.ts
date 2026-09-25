/*
 * Unidade 4, Fase 1: "Links que funcionam".
 *
 * O QUE ENSINA: editar um atributo pela árvore (nunca tinha sido ensinado
 * como conceito, só como mecânica da Unidade 1), o href de um link
 * (endereço ou #id da própria página) e o target="_blank" (abrir numa aba
 * nova sem sair da página atual).
 *
 * REVISÃO ESPAÇADA: nenhum conceito novo revisita ainda (é a primeira fase
 * da unidade); a "casa" (elemento pai/filho) e a árvore da Unidade 1 e 2
 * aparecem naturalmente ao localizar os links no menu.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: conserta o link do menu que não leva a lugar nenhum,
 *    trocando o href para o id certo. É o gesto mínimo de editar atributo.
 * 2. Guiado, previsão: antes de adicionar target="_blank" no link da
 *    bilheteria, o jogador aposta o que muda.
 * 3. Sozinho: as duas habilidades juntas, em dois links diferentes, sem
 *    dizer qual arrumar primeiro.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CORAL } from "./sites/coralVozesDaVila";

export const FASE_U4_F1: FasePratica = {
  id: "sites-elementos-u4-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u4",
  titulo: "Links que funcionam",
  conceitos: ["editar-atributo", "link-href", "link-ancora", "link-aba-nova"],
  revisa: ["selecionar-pela-arvore"],
  prerequisitos: ["elemento", "tag", "selecionar-pela-arvore"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique"],
  siteAlvo: SITE_CORAL,

  introducao: [
    { texto: "O site do Coral Vozes da Vila tem um link no menu que não leva a lugar nenhum!", expressao: "feliz" },
    { texto: "Todo link tem um href: o endereço para onde ele leva. Com # e um id, ele rola até um lugar da própria página.", expressao: "pensativo" },
    { texto: "Vamos consertar os links e deixar tudo levando pro lugar certo.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "consertar-link-menu",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O link 'Fale com a gente' do menu tem um href quebrado. Dois cliques no valor dele, na árvore, e troque para #rodape.",
        toque: "O link 'Fale com a gente' do menu tem um href quebrado. Dois toques no valor dele, na árvore, e troque para #rodape.",
      },
      validador: { tipo: "atributo", seletor: "#nav-contato", nome: "href", valor: "#rodape" },
      ajudas: {
        pergunta: "Esse link devia levar pra qual parte da página?",
        dica: "Um href com # e o id de um elemento rola até ele. Troque o valor pelo id certo.",
        linha: {
          alvo: "arvore",
          seletor: "#nav-contato",
          fala: "Essa é a linha do link 'Fale com a gente'. Dois cliques no valor do href trocam ele.",
        },
        solucao: {
          fala: "Troquei o href para #rodape: agora o link rola até o rodapé, que é onde ficam os contatos.",
          acoes: [{ tipo: "definirAtributo", seletor: "#nav-contato", nome: "href", valor: "#rodape" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Um link quebrado agora leva pro lugar certo, sem sair da página.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: "#nav-contato", nome: "href", valor: "#rodape" }],
    },
    {
      id: "prever-aba-nova",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: o que muda se a gente adicionar target=\"_blank\" no link da bilheteria?",
        opcoes: ["Ele some da página", "Abre numa aba nova, sem sair daqui", "Fica sublinhado"],
        correta: 1,
        explicacao: "target=\"_blank\" faz o link abrir numa aba nova. A página do coral continua aberta do jeito que estava.",
      },
      enunciado: {
        mouse: "Agora confira: adicione o atributo target com o valor _blank no link da bilheteria.",
        toque: "Agora confira: adicione o atributo target com o valor _blank no link da bilheteria.",
      },
      validador: { tipo: "atributo", seletor: "#link-ingressos", nome: "target", valor: "_blank" },
      ajudas: {
        pergunta: "Você já viu um link abrir sem fechar a página em que você estava?",
        dica: "target=\"_blank\" é o atributo que faz o link abrir numa aba nova.",
        linha: { alvo: "arvore", seletor: "#link-ingressos", fala: "Esse é o link da bilheteria. Adicione o atributo target com o valor _blank." },
        solucao: {
          fala: "Adicionei target=\"_blank\": agora o link abre numa aba nova, sem perder a página do coral.",
          acoes: [{ tipo: "definirAtributo", seletor: "#link-ingressos", nome: "target", valor: "_blank" }],
        },
      },
      falaAoConcluir: { texto: "Boa! Aba nova, sem perder o lugar onde você estava.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirAtributo", seletor: "#link-ingressos", nome: "target", valor: "_blank" },
      ],
    },
    {
      id: "links-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O menu 'Integrantes' também está quebrado, e o link do vídeo devia abrir em aba nova. Arrume os dois.",
        toque: "O menu 'Integrantes' também está quebrado, e o link do vídeo devia abrir em aba nova. Arrume os dois.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "atributo", seletor: "#nav-integrantes", nome: "href", valor: "#integrantes" },
          { tipo: "atributo", seletor: "#link-video", nome: "target", valor: "_blank" },
        ],
      },
      ajudas: {
        pergunta: "Esse menu devia levar pra qual seção? E esse link de vídeo devia abrir onde?",
        dica: "Href com # rola até um id da página; target=\"_blank\" abre em aba nova.",
      },
      falaAoConcluir: { texto: "Show! Dois links consertados de uma vez, sem passo a passo.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirAtributo", seletor: "#nav-integrantes", nome: "href", valor: "#integrantes" },
        { tipo: "definirAtributo", seletor: "#link-video", nome: "target", valor: "_blank" },
      ],
    },
  ],

  conclusao: [
    { texto: "Agora você conserta qualquer link: href é o endereço, # rola pra um id, target=\"_blank\" abre aba nova.", expressao: "comemorando" },
    { texto: "No F12 de verdade, dois cliques no valor do atributo (ou o + pra criar um novo) fazem a mesma troca.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache um link. Veja o href dele na árvore: ele leva pra onde o texto promete?",

  falaFinal: {
    texto: "Curiosidade: sem o # antes do id, o navegador acha que é OUTRO endereço, e o link não funciona.",
    expressao: "curioso",
  },
};

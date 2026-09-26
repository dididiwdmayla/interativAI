/*
 * Unidade 4, Fase 1: "Links que funcionam".
 *
 * O QUE ENSINA: editar um atributo pela árvore (nunca tinha sido ensinado
 * como conceito, só como mecânica da Unidade 1), o href de um link
 * (endereço ou #id da própria página) e o target="_blank" (abrir numa aba
 * nova sem sair da página atual).
 *
 * ATENÇÃO DE MOTOR: a árvore só deixa editar o VALOR de um atributo que já
 * existe (dois cliques nele); não existe um jeito de criar um atributo novo
 * pela árvore. Trocar um href já existente usa a árvore; ACRESCENTAR um
 * atributo que a peça não tem (como target) precisa ser pelo código.
 *
 * REVISÃO ESPAÇADA: nenhum conceito novo revisita ainda (é a primeira fase
 * da unidade); a árvore da Unidade 1 e o editor de código aparecem
 * misturados ao localizar e consertar os links do menu.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, ação: conserta o link do menu que não leva a lugar nenhum,
 *    trocando o href (que já existe) para o id certo, pela árvore.
 * 2. Guiado, previsão: antes de acrescentar target="_blank" no link da
 *    bilheteria (um atributo que ele ainda não tem), o jogador aposta o
 *    que muda, e escreve o atributo novo pelo código.
 * 3. Sozinho: as duas habilidades juntas, em dois links diferentes, sem
 *    dizer qual arrumar primeiro nem qual ferramenta usar.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_CORAL } from "./sites/coralVozesDaVila";

export const FASE_U4_F1: FasePratica = {
  id: "sites-elementos-u4-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u4",
  titulo: "Links que funcionam",
  conceitos: ["editar-atributo", "link-href", "link-ancora", "link-aba-nova"],
  revisa: ["selecionar-pela-arvore", "codigo-html"],
  prerequisitos: ["elemento", "tag", "selecionar-pela-arvore", "codigo-html"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "editar-duplo-clique", "editor", "sincronia"],
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
        pergunta: "Palpite: o que muda se a gente acrescentar target=\"_blank\" no link da bilheteria?",
        opcoes: ["Ele some da página", "Abre numa aba nova, sem sair daqui", "Fica sublinhado"],
        correta: 1,
        explicacao: "target=\"_blank\" faz o link abrir numa aba nova. A página do coral continua aberta do jeito que estava.",
      },
      enunciado: {
        mouse: "Agora confira: esse link ainda não tem target. Pelo código, escreva target=\"_blank\" dentro da tag dele.",
        toque: "Agora confira: esse link ainda não tem target. Pelo código, escreva target=\"_blank\" dentro da tag dele.",
      },
      validador: { tipo: "atributo", seletor: "#link-ingressos", nome: "target", valor: "_blank" },
      ajudas: {
        pergunta: "Esse link já tem um atributo target? Se não tem, dá pra editar pela árvore?",
        dica: "A árvore só edita atributos que já existem. Um atributo novo (como target) se escreve direto no código.",
        linha: { alvo: "editor", seletor: "#link-ingressos", fala: "Essas são as linhas do link da bilheteria. Escreva target=\"_blank\" dentro da tag, antes do >." },
        solucao: {
          fala: "Escrevi target=\"_blank\" pelo código: como o atributo ainda não existia, a árvore não tinha como criar ele.",
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
        pergunta: "Esse menu devia levar pra qual seção? E o link do vídeo já tem um target pra editar, ou precisa escrever um?",
        dica: "Href que já existe: árvore. Atributo que ainda não existe: pelo código.",
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
    { texto: "No F12 de verdade, dois cliques trocam um atributo existente; um novo nasce no 'Add attribute' da aba Elements, ou direto no HTML.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e ache um link. Veja o href dele na árvore: ele leva pra onde o texto promete?",

  falaFinal: {
    texto: "Curiosidade: sem o # antes do id, o navegador acha que é OUTRO endereço, e o link não funciona.",
    expressao: "curioso",
  },
};

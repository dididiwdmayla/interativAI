/*
 * Unidade 2, Fase 2: "Esconder ou apagar?".
 *
 * O QUE ENSINA: a diferença entre esconder (a peça fica invisível mas
 * guarda o espaço) e remover do documento (a peça sai e o resto sobe), e
 * o desfazer, que tira o medo de errar.
 *
 * REVISÃO ESPAÇADA: editar texto (Unidade 1) volta no objetivo sozinho,
 * misturado com a faxina: trocar a manchete de uma notícia.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, esconder o banner: é a ação mais "segura" (nada some de
 *    verdade) e deixa um buraco bem visível no topo, que prepara a pergunta
 *    seguinte.
 * 2. Guiado, previsão antes de apagar: com o buraco do banner ainda na
 *    tela, o jogador tem de onde tirar o palpite. O pop-up de cookies fica
 *    no meio da página (ocupa espaço), então ao apagá-lo as notícias sobem
 *    na frente dele: a previsão é conferida com os próprios olhos.
 * 3. Momento roteirizado + guiado: o computadorzinho esbarra e apaga o
 *    rodapé "sem querer". Errar é normal; o objetivo é consertar com o
 *    Desfazer. Aprender desfazer DEPOIS de apagar é de propósito: a
 *    ferramenta aparece exatamente quando faz falta.
 * 4. Sozinho: faxina sem passo a passo. Não diz qual ferramenta usar: o
 *    jogador decide entre esconder e apagar (o validador pede apagar, então
 *    esconder não basta) e ainda revisa a edição de texto.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_JORNAL } from "./sites/jornalDaVila";

export const FASE_U2_F2: FasePratica = {
  id: "sites-elementos-u2-f2",
  tipo: "pratica",
  unidadeId: "sites-elementos-u2",
  titulo: "Esconder ou apagar?",
  conceitos: ["esconder-elemento", "remover-do-documento", "desfazer"],
  revisa: ["editar-texto"],
  prerequisitos: ["elemento", "selecionar-pela-arvore"],
  usaFerramentas: [
    "painel",
    "previa",
    "me-ajuda",
    "tutor",
    "arvore",
    "inspecionar",
    "editar-duplo-clique",
    "esconder",
    "apagar",
    "desfazer",
  ],
  siteAlvo: SITE_JORNAL,

  introducao: [
    {
      texto: "O Jornal da Vila está lotado de propaganda. Hoje a gente faz uma faxina!",
      expressao: "feliz",
    },
    {
      texto: "Tem dois jeitos de tirar algo da frente: esconder e apagar. Parecem iguais, mas não são.",
      expressao: "pensativo",
    },
    {
      texto: "Vamos testar os dois e ver a diferença com os próprios olhos.",
      expressao: "curioso",
    },
  ],

  objetivos: [
    {
      id: "esconder-banner",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Esconda o banner de anúncio do topo: botão direito nele, na árvore, e Esconder. Repare no espaço.",
        toque: "Esconda o banner de anúncio do topo: toque nele na árvore e depois em Esconder. Repare no espaço.",
      },
      apresentar: ["esconder"],
      validador: { tipo: "escondido", seletor: "#banner-topo" },
      ajudas: {
        pergunta: "Se você quer que o banner suma só dos seus olhos, sem mexer no resto, o que faria?",
        dica: "Esconder deixa a peça invisível, mas ela continua no lugar, como uma cadeira reservada.",
        linha: {
          alvo: "arvore",
          seletor: "#banner-topo",
          fala: "Esse nó piscando é o banner. Use Esconder nele (no teclado, é a tecla H).",
        },
        solucao: {
          fala: "Escondi o banner: o Chrome põe nele uma classe que deixa invisível. O lugar dele ficou vazio, reservado.",
          acoes: [{ tipo: "esconder", seletor: "#banner-topo" }],
        },
      },
      falaAoConcluir: {
        texto: "Sumiu, mas olha o buraco no topo: o espaço continua lá, guardadinho.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "esconder", seletor: "#banner-topo" }],
    },
    {
      id: "apagar-popup",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: e se, em vez de esconder, a gente APAGAR o pop-up de cookies? O que acontece com o espaço?",
        opcoes: ["Fica um buraco vazio, igual ao do banner", "O conteúdo de baixo sobe e ocupa o lugar", "O site inteiro quebra"],
        correta: 1,
        explicacao: "Apagar tira a peça da página de vez. Sem ela, as notícias de baixo sobem e fecham o espaço.",
      },
      enunciado: {
        mouse: "Agora veja acontecer: apague o pop-up de cookies (botão direito nele e Apagar) e olhe as notícias.",
        toque: "Agora veja acontecer: apague o pop-up de cookies (toque nele e em Apagar) e olhe as notícias.",
      },
      // Apagar é apresentado aqui, mas só depois do palpite (o motor segura a
      // apresentação enquanto a previsão não foi respondida).
      apresentar: ["apagar"],
      validador: { tipo: "naoExiste", seletor: "#popup-cookies" },
      ajudas: {
        pergunta: "Qual das duas ferramentas tira a peça da página de vez?",
        dica: "Apagar remove o elemento do documento. O que vinha depois sobe, como numa fila quando alguém sai.",
        linha: {
          alvo: "arvore",
          seletor: "#popup-cookies",
          fala: "Esse é o pop-up de cookies. Use Apagar nele (no teclado, selecione e aperte Delete).",
        },
        solucao: {
          fala: "Apaguei o pop-up: ele saiu da página e as notícias subiram para o lugar dele.",
          acoes: [{ tipo: "apagar", seletor: "#popup-cookies" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu? Nada de buraco: as notícias subiram. Esconder guarda o lugar, apagar libera.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "apagar", seletor: "#popup-cookies" },
      ],
    },
    {
      id: "desfazer-esbarrao",
      tipo: "acao",
      modo: "guiado",
      // O computadorzinho tropeça e apaga o rodapé: um erro de verdade para consertar.
      eventoAoComecar: {
        animacao: "esbarrao",
        acoes: [{ tipo: "apagar", seletor: "#rodape" }],
        fala: {
          texto: "Ops! Tropecei no painel e apaguei o rodapé sem querer. Me ajuda a desfazer?",
          expressao: "preocupado",
        },
      },
      enunciado: {
        mouse: "Desfaça o meu esbarrão: clique em Desfazer, a setinha curva no topo do painel (ou Ctrl+Z).",
        toque: "Desfaça o meu esbarrão: toque em Desfazer, a setinha curva no topo do painel.",
      },
      apresentar: ["desfazer"],
      // Pede o evento "desfez" para o rodapé voltar pelo Desfazer (e não reescrito no código).
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "existe", seletor: "#rodape" },
          { tipo: "evento", evento: "desfez" },
        ],
      },
      ajudas: {
        pergunta: "Quando você erra algo no computador, qual é o jeito mais rápido de voltar atrás?",
        dica: "Desfazer volta a última mudança feita pelo painel. Com o painel em foco, Ctrl+Z faz o mesmo.",
        linha: {
          alvo: "ferramenta",
          ferramenta: "desfazer",
          fala: "Tá vendo a setinha curva piscando no topo do painel? É o Desfazer.",
        },
        solucao: {
          fala: "Desfiz o esbarrão: o rodapé voltou do jeitinho que estava. Desfazer volta a última mudança.",
          acoes: [{ tipo: "desfazer" }],
        },
      },
      falaAoConcluir: {
        texto: "Ufa, o rodapé voltou! Errou? Desfaz. No F12 de verdade é Ctrl+Z.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "desfazer" }],
    },
    {
      id: "faxina-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Tire de vez o anúncio lateral e troque o título de uma notícia por uma manchete sua.",
        toque: "Tire de vez o anúncio lateral e troque o título de uma notícia por uma manchete sua.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "naoExiste", seletor: "#anuncio-lateral" },
          { tipo: "textoDiferenteDoInicial", seletor: ".noticia h3" },
        ],
      },
      ajudas: {
        pergunta: "Esse anúncio precisa guardar o lugar dele ou pode sair de vez?",
        dica: "Para tirar de vez, apague. Para trocar um texto, dois cliques nele na árvore, como na padaria.",
      },
      falaAoConcluir: {
        texto: "Faxina feita: anúncio fora e manchete nova. E sem passo a passo!",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "apagar", seletor: "#anuncio-lateral" },
        { tipo: "definirTexto", seletor: "#noticia-time h3", valor: "Goleiro vira artilheiro da vila" },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Faxina completa! Esconder guarda o lugar, apagar libera o espaço, e desfazer salva o dia.",
      expressao: "comemorando",
    },
    {
      texto: "Tudo isso funciona no F12 de qualquer site, e some quando você recarrega a página.",
      expressao: "feliz",
    },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12, ache um banner na aba Elements e aperte H para esconder. Depois apague outra coisa com Delete e desfaça com Ctrl+Z. Só você vê, e tudo volta ao recarregar.",

  falaFinal: {
    texto: "Dica de quem programa: na dúvida, esconda primeiro. Se estiver tudo certo, aí você apaga.",
    expressao: "feliz",
  },
};

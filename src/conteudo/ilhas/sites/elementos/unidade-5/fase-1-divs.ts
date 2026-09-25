/*
 * Unidade 5, Fase 1: "Div: a caixa sem rosto".
 *
 * O QUE ENSINA: a div é uma caixa genérica, sem significado nem estilo
 * próprio (o visual vem todo do CSS); trocar uma div por uma tag semântica
 * (header, footer) não muda nada na tela, mas muda o significado.
 *
 * REVISÃO ESPAÇADA: selecionar pela árvore (Unidade 1) entra misturada, ao
 * localizar as divs do cabeçalho e do rodapé.
 *
 * POR QUE ESTA ORDEM:
 * 1. Guiado, previsão: antes de acrescentar uma div nova, o jogador aposta
 *    se o visual muda. Não muda: div não tem estilo próprio. Isso ataca de
 *    frente a confusão "a div faz alguma coisa visual".
 * 2. Guiado, ação: renomeia a div do cabeçalho para header. De novo, nada
 *    muda no visual — reforça que a tag certa é sobre significado, não
 *    aparência (a mesma pegadinha da Unidade 3 com os títulos).
 * 3. Sozinho: a mesma troca no rodapé (para footer), com a setinha em vez
 *    da árvore.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_OFICINA } from "./sites/oficinaRodaLivre";

export const FASE_U5_F1: FasePratica = {
  id: "sites-elementos-u5-f1",
  tipo: "pratica",
  unidadeId: "sites-elementos-u5",
  titulo: "Div: a caixa sem rosto",
  conceitos: ["div-generica", "semantica-html"],
  revisa: ["selecionar-pela-arvore"],
  prerequisitos: ["elemento", "tag", "selecionar-pela-arvore", "codigo-html"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "editor", "sincronia", "renomear-tag"],
  siteAlvo: SITE_OFICINA,

  introducao: [
    { texto: "A Oficina Roda Livre foi montada só com div: nenhuma peça tem um nome que diga o que ela é.", expressao: "feliz" },
    { texto: "Div é uma caixa sem rosto: agrupa, mas não diz nada sobre o que tem dentro.", expressao: "pensativo" },
    { texto: "Vamos trocar algumas divs por tags que contam a história certa.", expressao: "curioso" },
  ],

  objetivos: [
    {
      id: "prever-div-nova",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Palpite: se a gente adicionar uma div nova, com um aviso dentro, o visual da página muda?",
        opcoes: ["Sim, toda div vem com uma borda", "Não, div não tem estilo próprio: só o texto aparece", "Sim, fica destacada em amarelo"],
        correta: 1,
        explicacao: "A div é uma caixa neutra. Sem uma regra de CSS pra ela, o único efeito é o texto de dentro aparecer, sem nenhum estilo extra.",
      },
      enunciado: {
        mouse: "Agora confira: pelo código, no fim de .conteudo, escreva uma div com um aviso sobre feriados.",
        toque: "Agora confira: pelo código, no fim de .conteudo, escreva uma div com um aviso sobre feriados.",
      },
      validador: { tipo: "existe", seletor: ".conteudo > div#aviso-oficina" },
      ajudas: {
        pergunta: "Uma div em branco, sem CSS pensado pra ela, muda alguma coisa na tela?",
        dica: "Div é a caixa mais neutra do HTML: sem regra de estilo, ela é só um agrupamento invisível.",
        linha: { alvo: "editor", seletor: ".secao", fala: "Olha as linhas da última seção piscando. Escreva sua div nova logo depois delas." },
        solucao: {
          fala: "Acrescentei uma div com um aviso: o texto apareceu, mas sem nenhum estilo extra, porque div não traz nada sozinha.",
          acoes: [
            {
              tipo: "inserirHTML",
              seletor: ".conteudo",
              posicao: "fim",
              html: '<div id="aviso-oficina">Aberta também em feriados, mediante agendamento.</div>',
            },
          ],
        },
      },
      falaAoConcluir: { texto: "Isso! Div é neutra: quem dá o visual é sempre o CSS.", expressao: "comemorando" },
      solucaoDeTeste: [
        {
          tipo: "responderPrevisao",
          opcao: 1,
        },
        {
          tipo: "inserirHTML",
          seletor: ".conteudo",
          posicao: "fim",
          html: '<div id="aviso-oficina">Aberta também em feriados, mediante agendamento.</div>',
        },
      ],
    },
    {
      id: "topo-vira-header",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O topo da página é uma div genérica. Dois cliques no nome da tag, na árvore, e troque para header.",
        toque: "O topo da página é uma div genérica. Dois toques no nome da tag, na árvore, e troque para header.",
      },
      validador: { tipo: "tag", seletor: "#topo", nome: "header" },
      ajudas: {
        pergunta: "Essa caixa guarda o nome da oficina e o menu: que tipo de peça é essa, num site de verdade?",
        dica: "header é a tag pro cabeçalho da página. Ela não muda o visual sozinha, mas diz o que aquela caixa é.",
        linha: { alvo: "arvore", seletor: "#topo", fala: "Essa é a div do topo. Dois cliques no nome da tag trocam ela." },
        solucao: {
          fala: "Troquei a div por header: o visual continua igual, mas agora a página conta o que aquela caixa é.",
          acoes: [{ tipo: "renomearTag", seletor: "#topo", novaTag: "header" }],
        },
      },
      falaAoConcluir: { texto: "Reparou? Nada mudou na tela — e mesmo assim a troca faz diferença.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "#topo", novaTag: "header" }],
    },
    {
      id: "rodape-sozinho",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Com a setinha, ache a div do rodapé e troque ela pela tag certa.",
        toque: "Toque na div do rodapé (ou use a setinha) e troque ela pela tag certa.",
      },
      validador: {
        tipo: "todos",
        validadores: [{ tipo: "tag", seletor: "#rodape", nome: "footer" }, { tipo: "evento", evento: "inspecionou" }],
      },
      ajudas: {
        pergunta: "Essa caixa fica no fim da página, com informações de rodapé. Qual tag combina com isso?",
        dica: "footer é a tag pro rodapé, do mesmo jeito que header é pro cabeçalho.",
      },
      falaAoConcluir: { texto: "Show! Cabeçalho e rodapé agora têm nome de verdade.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: "#rodape", via: "inspecionar" },
        { tipo: "renomearTag", seletor: "#rodape", novaTag: "footer" },
      ],
    },
  ],

  conclusao: [
    { texto: "Div não é feia nem errada: ela é a caixa neutra. O problema é usar só ela, o tempo todo.", expressao: "comemorando" },
    { texto: "No F12 de verdade, header e footer aparecem com um ícone diferente na árvore, mas o visual só muda se o CSS mudar.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, aperte F12 e veja se o cabeçalho é uma div ou um header. Muitos sites antigos ainda usam só div!",

  falaFinal: {
    texto: "Curiosidade: antes de 2014 (HTML5), header e footer nem existiam. Todo mundo usava div mesmo.",
    expressao: "curioso",
  },
};

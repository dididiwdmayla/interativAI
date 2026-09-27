/*
 * L2, Fase 3: "Espaço com gap, quebra com wrap" (Livraria Página Virada).
 *
 * O QUE ENSINA: gap (espaço fixo SÓ entre os filhos, sem mexer nas
 * pontas) e flex-wrap (deixa os filhos quebrarem de linha quando não
 * cabem).
 *
 * ORDEM: previsão sobre gap (a confusão: achar que ele empurra as pontas
 * como margin faria); depois flex-wrap guiado, direto (o problema é
 * visível em 390px: os cards saem da tela); o sozinho aplica gap de novo,
 * no menu, uma situação nova.
 *
 * REVISÃO ESPAÇADA: display: flex (Fase 1) e justify-content (Fase 2)
 * citados na fala; gap reaparece no desafio.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIRADA } from "./sites/livrariaPaginaVirada";

export const FASE_L2_F3: FasePratica = {
  id: "sites-layout-u2-f3",
  tipo: "pratica",
  unidadeId: "sites-layout-u2",
  titulo: "Espaço com gap, quebra com wrap",
  conceitos: ["gap-css", "flex-wrap"],
  revisa: ["flexbox", "justify-content"],
  prerequisitos: ["flexbox"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Os livros já estão espalhados, mas ainda colados um no outro. E em telas estreitas, será que cabem todos?",
      expressao: "curioso",
    },
  ],
  siteAlvo: LIVRARIA_PAGINA_VIRADA,
  objetivos: [
    {
      id: "gap-entre-cards",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se você der gap: 16px ao .cards, o que acontece com o espaço nas PONTAS (antes do primeiro livro e depois do último)?",
        opcoes: [
          "Ganham 16px também, como um margin em cada livro",
          "Continuam sem espaço extra: gap só cria espaço ENTRE os filhos",
          "O gap não funciona dentro de um flex container",
        ],
        correta: 1,
        explicacao: "gap cria espaço só entre os filhos vizinhos, sem tocar nas pontas da fila. Para as pontas, seria padding no container.",
      },
      enunciado: {
        mouse: "Confira: dê gap: 16px ao .cards e olhe se as pontas mudaram.",
        toque: "Confira: dê gap: 16px ao .cards e olhe se as pontas mudaram.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "gap", valor: "16px" },
      ajudas: {
        pergunta: "Qual declaração cria um espaço fixo só entre os filhos de um flex, sem mexer em margin de cada um?",
        dica: "gap. Uma declaração só no container resolve o espaço de todos os filhos de uma vez.",
        linha: { alvo: "estilos", seletorRegra: ".cards", fala: "Acrescente gap: 16px nesta regra, .cards." },
        solucao: {
          fala: "Acrescentei gap: 16px em .cards: agora tem espaço entre os três livros, sem mexer no HTML nem nas pontas.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "gap", valor: "16px" }],
        },
      },
      falaAoConcluir: {
        texto: "Confirmado: as pontas continuam coladas na borda, só o espaço do meio apareceu.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "gap", valor: "16px" },
      ],
    },
    {
      id: "flex-wrap-cards",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Em telas estreitas, os três livros ficam espremidos ou saem da tela. Dê flex-wrap: wrap ao .cards para eles quebrarem de linha.",
        toque: "Em telas estreitas, os três livros ficam espremidos ou saem da tela. Dê flex-wrap: wrap ao .cards para eles quebrarem de linha.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".cards", propriedade: "flex-wrap", valor: "wrap" },
      ajudas: {
        pergunta: "Por padrão, o flexbox tenta encolher tudo numa fila só. Existe uma declaração que deixa quebrar?",
        dica: "flex-wrap: wrap. Sem espaço numa linha, os filhos que sobram vão para a linha de baixo.",
        linha: { alvo: "estilos", seletorRegra: ".cards", fala: "Acrescente flex-wrap: wrap nesta regra, .cards." },
        solucao: {
          fala: "Acrescentei flex-wrap: wrap: em telas estreitas, os livros que não cabem descem para a linha de baixo.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "flex-wrap", valor: "wrap" }],
        },
      },
      falaAoConcluir: {
        texto: "Sem flex-wrap, o padrão (nowrap) espreme tudo numa linha só. Com wrap, ninguém sai da tela.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".cards", propriedade: "flex-wrap", valor: "wrap" }],
    },
    {
      id: "gap-no-menu",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O menu também está com os itens colados. Dê gap: 24px ao ul do menu.",
        toque: "O menu também está com os itens colados. Dê gap: 24px ao ul do menu.",
      },
      validador: { tipo: "valorEfetivo", seletor: "nav ul", propriedade: "gap", valor: "24px" },
      ajudas: {
        pergunta: "Qual declaração cria espaço entre os itens do menu, sem margin em cada li?",
        dica: "gap, na regra nav ul: a mesma ideia dos cards, numa peça diferente.",
      },
      falaAoConcluir: {
        texto: "Menu com respiro entre os itens! gap funciona em qualquer flex container, não só nos cards.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "nav ul", propriedade: "gap", valor: "24px" }],
    },
  ],
  conclusao: [
    {
      texto: "gap e flex-wrap: os últimos retoques de um flexbox de verdade, prontos para qualquer tamanho de tela.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, gap substituiu muito truque antigo de margin só para separar itens de uma fila.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, diminua a janela até ficar estreita e veja se um menu ou uma fileira de cards quebra de linha (flex-wrap) ou espreme tudo.",
  falaFinal: { texto: "Hora do desafio: um brechó precisa de um layout novo!", expressao: "feliz" },
};

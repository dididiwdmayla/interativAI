/*
 * E1, Fase 2: "Tamanho, fonte e alinhamento" (a mesma Floricultura).
 *
 * O QUE ENSINA: o tamanho da letra (font-size em px), a unidade rem, a
 * família da fonte (com a reserva no fim) e o alinhamento do texto. A
 * ferramenta nova são as setas nos números (apresentada no primeiro
 * objetivo); o "+ declaração" já veio com o editar valor da Fase 1.
 *
 * ORDEM: primeiro um número com as setas (o gesto mais concreto), depois a
 * previsão do rem (a confusão de leigo é "1 é pequenininho"), depois trocar
 * uma palavra inteira (a fonte) e, por fim, ACRESCENTAR uma declaração que
 * a regra ainda não tem. O sozinho junta os dois últimos numa peça nova, o
 * rodapé, com duas declarações de uma vez.
 *
 * VALIDADORES: valorEfetivo em tudo, porque o que importa é como a peça
 * APARECE, não o caminho: o jogador pode usar as setas, digitar o número
 * ou escrever no editor CSS. O rem é conferido como rem (o motor compara o
 * valor declarado, sem converter unidades), e a fonte do body é conferida
 * no próprio body.
 *
 * REVISÃO ESPAÇADA: regra e declaração (Fase 1) em todos os objetivos; o
 * sozinho também revisa selecionar pela árvore (uma peça que ainda não foi
 * tocada).
 *
 * CONFUSÕES ATACADAS: "1rem é minúsculo" (previsão) e "a fonte some se o
 * computador não tiver" (a fala do objetivo 3 explica a reserva, serif).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { FLORICULTURA_PETALA_AZUL } from "./sites/floriculturaPetalaAzul";

export const FASE_E1_F2: FasePratica = {
  id: "sites-estilos-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-estilos-u1",
  titulo: "Tamanho, fonte e alinhamento",
  conceitos: ["tamanho-da-letra", "unidade-rem", "familia-da-fonte", "alinhamento-do-texto"],
  revisa: ["regra-e-declaracao", "selecionar-pela-arvore"],
  prerequisitos: ["regra-e-declaracao", "cor-do-texto"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "setas-numericas"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "A floricultura já tem cor. Agora vamos cuidar das letras: tamanho, desenho e onde elas ficam.",
      expressao: "feliz",
    },
    {
      texto: "Tudo continua no painel Estilos. O HTML não muda uma vírgula.",
      expressao: "curioso",
    },
  ],
  siteAlvo: FLORICULTURA_PETALA_AZUL,
  objetivos: [
    {
      id: "titulo-maior",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Deixe o nome da floricultura com 36px: clique no font-size do h1 e use as setas do teclado.",
        toque: "Deixe o nome da floricultura com 36px: toque no font-size do h1 e use os botões de seta.",
      },
      apresentar: ["setas-numericas"],
      validador: { tipo: "valorEfetivo", seletor: "h1", propriedade: "font-size", valor: "36px" },
      ajudas: {
        pergunta: "Qual declaração da regra h1 cuida do tamanho da letra?",
        dica: "font-size é o tamanho do texto. Com o valor aberto, a seta para cima soma 1 e Shift com seta soma 10.",
        linha: {
          alvo: "estilos",
          seletorRegra: "h1",
          propriedade: "font-size",
          fala: "É este font-size, na regra h1. Ele está em 28px.",
        },
        solucao: {
          fala: "Pus 36px no font-size do h1: o nome cresceu. Com as setas, eram 8 toques para cima.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "font-size", valor: "36px" }],
        },
      },
      falaAoConcluir: {
        texto: "Agora dá para ler de longe! Px são os pontinhos da tela: 36 deles de altura.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h1", propriedade: "font-size", valor: "36px" }],
    },
    {
      id: "descricao-em-rem",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A descrição dos buquês tem font-size 16px. Se trocar por 1rem, o que acontece?",
        opcoes: ["A letra fica minúscula, do tamanho de 1 pontinho", "Fica igual: 1rem é a letra da página, 16px", "A letra dobra de tamanho"],
        correta: 1,
        explicacao: "1rem é o tamanho da letra da página inteira, que é 16px se ninguém mudou. Então nada muda na tela.",
      },
      enunciado: {
        mouse: "Confira: troque o font-size da .descricao de 16px para 1rem.",
        toque: "Confira: troque o font-size da .descricao de 16px para 1rem.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".descricao", propriedade: "font-size", valor: "1rem" },
      ajudas: {
        pergunta: "Qual regra dá o tamanho das descrições?",
        dica: "Troque só o valor: o número e a unidade juntos, sem espaço, como 1rem.",
        linha: {
          alvo: "estilos",
          seletorRegra: ".descricao",
          propriedade: "font-size",
          fala: "É o font-size da regra .descricao.",
        },
        solucao: {
          fala: "Troquei 16px por 1rem: a letra ficou igualzinha, porque 1rem vale 16px aqui.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".descricao", propriedade: "font-size", valor: "1rem" }],
        },
      },
      falaAoConcluir: {
        texto: "Viu? Igual. O rem acompanha a letra da página: se alguém aumentar a letra do navegador, ele cresce junto.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ".descricao", propriedade: "font-size", valor: "1rem" },
      ],
    },
    {
      id: "fonte-da-pagina",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque a fonte da página toda: no body, ponha font-family Georgia, serif.",
        toque: "Troque a fonte da página toda: no body, ponha font-family Georgia, serif.",
      },
      validador: { tipo: "valorEfetivo", seletor: "body", propriedade: "font-family", valor: "Georgia, serif" },
      ajudas: {
        pergunta: "Se a fonte muda no body, por que o site inteiro muda junto?",
        dica: "A fonte passa de pai para filho: quem não tem font-family própria herda a do body.",
        linha: {
          alvo: "estilos",
          seletorRegra: "body",
          propriedade: "font-family",
          fala: "É o font-family da regra body. Selecione o body para ver.",
        },
        solucao: {
          fala: "Pus Georgia, serif no body. Georgia é a fonte; serif é a reserva, se o computador não tiver a Georgia.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "body", propriedade: "font-family", valor: "Georgia, serif" }],
        },
      },
      falaAoConcluir: {
        texto: "A página toda trocou de letra! E se faltar a Georgia, o serif garante uma parecida.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "body", propriedade: "font-family", valor: "Georgia, serif" }],
    },
    {
      id: "titulo-no-centro",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Centralize o Buquês da semana: na regra h2, use + declaração e escreva text-align: center.",
        toque: "Centralize o Buquês da semana: na regra h2, toque em + declaração e escreva text-align: center.",
      },
      validador: { tipo: "valorEfetivo", seletor: "h2", propriedade: "text-align", valor: "center" },
      ajudas: {
        pergunta: "A regra h2 já tem alguma declaração de alinhamento?",
        dica: "Quando a regra não tem a propriedade, você acrescenta: nome, depois o valor.",
        linha: {
          alvo: "estilos",
          seletorRegra: "h2",
          fala: "É na regra h2. O + declaração fica no fim dela.",
        },
        solucao: {
          fala: "Acrescentei text-align: center na regra h2. Como ela não tinha, entrou uma declaração nova.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h2", propriedade: "text-align", valor: "center" }],
        },
      },
      falaAoConcluir: {
        texto: "No meio! text-align alinha o texto dentro da caixa da peça.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "h2", propriedade: "text-align", valor: "center" }],
    },
    {
      id: "rodape-arrumado",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O rodapé está miudinho e torto. Deixe o texto dele centralizado e com 16px.",
        toque: "O rodapé está miudinho e torto. Deixe o texto dele centralizado e com 16px.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: "footer", propriedade: "text-align", valor: "center" },
          { tipo: "valorEfetivo", seletor: "footer", propriedade: "font-size", valor: "16px" },
        ],
      },
      ajudas: {
        pergunta: "Qual regra veste o rodapé? E ela já tem as duas propriedades?",
        dica: "Uma declaração se troca; a que falta se acrescenta. São duas: tamanho e alinhamento.",
      },
      falaAoConcluir: {
        texto: "Rodapé legível e no centro, e sem ajuda! Trocar e acrescentar já são com você.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: "footer", propriedade: "font-size", valor: "16px" },
        { tipo: "definirPropriedade", seletorRegra: "footer", propriedade: "text-align", valor: "center" },
      ],
    },
  ],
  conclusao: [
    {
      texto: "Título grande, fonte nova, letras no centro. A floricultura já parece outra!",
      expressao: "comemorando",
    },
    {
      texto: "No Chrome, o painel Styles tem as mesmas setas: clique num número e aperte seta para cima ou para baixo.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, abra o F12, selecione um parágrafo e mude o font-size dele com as setas do teclado no painel Styles. Tente Shift com a seta para pular de 10 em 10.",
  falaFinal: { texto: "Na próxima: cores com o seletor de cor e regras novas. Bora!", expressao: "feliz" },
};

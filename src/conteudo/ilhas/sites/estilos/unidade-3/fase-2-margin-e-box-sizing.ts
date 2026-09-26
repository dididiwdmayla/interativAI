/*
 * E3, Fase 2: "Margin e box-sizing" (mesma Confeitaria).
 *
 * O QUE ENSINA: margin (o espaço FORA da caixa, entre ela e as vizinhas) e
 * box-sizing (com border-box, padding e border entram DENTRO da largura
 * definida, em vez de somar a ela).
 *
 * ORDEM: 1) previsão sobre padding x margin (a confusão de leigo do mapa
 * curricular: "aumentar o padding afasta as caixas?"), depois o margin de
 * verdade separando os dois bolos; 2) sozinho, margin numa peça diferente
 * (o aviso, embaixo); 3) guiado, box-sizing: o bloco do WhatsApp tem
 * largura 100% e ainda ganha padding — sem border-box, ele estoura a
 * largura da página.
 *
 * REVISÃO ESPAÇADA: padding (Fase 1) na previsão e na explicação.
 *
 * CONFUSÃO ATACADA: "padding e margin são a mesma coisa" — a previsão do
 * objetivo 1 confere que só o margin afasta as caixas uma da outra; o
 * padding continua empurrando o conteúdo pra dentro da MESMA caixa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { CONFEITARIA_DOCE_ENCANTO } from "./sites/confeitariaDoceEncanto";

export const FASE_E3_F2: FasePratica = {
  id: "sites-estilos-u3-f2",
  tipo: "pratica",
  unidadeId: "sites-estilos-u3",
  titulo: "Margin e box-sizing",
  conceitos: ["margin-css", "box-sizing"],
  revisa: ["padding-css"],
  prerequisitos: ["modelo-de-caixa", "padding-css", "border-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "painel-calculado", "modelo-de-caixa"],
  paineisElementos: ["estilos", "calculado"],

  introducao: [
    { texto: "Os dois bolos continuam colados um no outro, mesmo com padding e border. Falta uma camada.", expressao: "curioso" },
  ],

  siteAlvo: CONFEITARIA_DOCE_ENCANTO,
  objetivos: [
    {
      id: "espaco-entre-bolos",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "As duas caixas de bolo estão coladas. Se você aumentar o padding do .bolo, o espaço ENTRE elas cresce?",
        opcoes: [
          "Não: padding só empurra o conteúdo pra dentro da mesma caixa",
          "Sim, padding e margin fazem a mesma coisa",
          "Sim, mas só quando a tela é pequena",
        ],
        correta: 0,
        explicacao: "Padding fica DENTRO da caixa. Pra afastar uma caixa da outra, por FORA, o certo é o margin.",
      },
      enunciado: {
        mouse: "Confira: acrescente margin-bottom: 16px na regra .bolo.",
        toque: "Confira: acrescente margin-bottom: 16px na regra .bolo.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".bolo", propriedade: "margin-bottom", valor: "16px" },
      ajudas: {
        pergunta: "Qual camada fica FORA da border, empurrando os vizinhos?",
        dica: "É o margin. margin-bottom empurra só o que vem embaixo da peça.",
        linha: { alvo: "estilos", seletorRegra: ".bolo", fala: "Mais uma declaração aqui: o margin-bottom." },
        solucao: {
          fala: "Acrescentei margin-bottom: 16px: agora sobra espaço entre um bolo e o outro.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "margin-bottom", valor: "16px" }],
        },
      },
      falaAoConcluir: {
        texto: "Separados! No diagrama, a camada de margin é a mais de fora, sem cor de fundo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirPropriedade", seletorRegra: ".bolo", propriedade: "margin-bottom", valor: "16px" },
      ],
    },
    {
      id: "espaco-antes-do-whatsapp",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O aviso de domingo também está colado no bloco do WhatsApp, embaixo dele. Dê um margin-bottom de 16px ao .aviso.",
        toque: "O aviso de domingo também está colado no bloco do WhatsApp, embaixo dele. Dê um margin-bottom de 16px ao .aviso.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".aviso", propriedade: "margin-bottom", valor: "16px" },
      ajudas: {
        pergunta: "Qual declaração afasta a peça de quem vem logo depois dela?",
        dica: "margin-bottom, na regra .aviso.",
      },
      falaAoConcluir: {
        texto: "Mais um respiro por fora! Margin sempre empurra os vizinhos, nunca o próprio conteúdo.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso", propriedade: "margin-bottom", valor: "16px" }],
    },
    {
      id: "whatsapp-nao-estoura",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "O bloco do WhatsApp tem largura 100% e ganhou padding: ele estoura a largura da página. Acrescente box-sizing: border-box.",
        toque: "O bloco do WhatsApp tem largura 100% e ganhou padding: ele estoura a largura da página. Acrescente box-sizing: border-box.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".chamada-whatsapp", propriedade: "box-sizing", valor: "border-box" },
      ajudas: {
        pergunta: "Existe uma declaração que faz o padding entrar DENTRO da largura, em vez de somar a ela?",
        dica: "box-sizing: border-box faz exatamente isso: padding e border passam a caber dentro do width.",
        linha: { alvo: "estilos", seletorRegra: ".chamada-whatsapp", fala: "É aqui, na regra .chamada-whatsapp." },
        solucao: {
          fala: "Acrescentei box-sizing: border-box: o padding entrou dentro dos 100%, e o bloco parou de estourar.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ".chamada-whatsapp", propriedade: "box-sizing", valor: "border-box" }],
        },
      },
      falaAoConcluir: {
        texto: "Resolvido! Sem border-box, o navegador soma padding e border ao width; com ele, tudo cabe dentro.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".chamada-whatsapp", propriedade: "box-sizing", valor: "border-box" }],
    },
  ],

  conclusao: [
    { texto: "Margin separa as caixas; box-sizing decide se o padding soma ou entra na largura. As quatro camadas são suas.", expressao: "comemorando" },
    { texto: "No F12 de verdade, um elemento com largura 100% e padding sem border-box é a causa nº 1 de barra de rolagem lateral.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache uma peça com largura 100% no F12. Veja se o CSS dela tem box-sizing: border-box e por quê.",

  falaFinal: { texto: "Agora o desafio: cards espremidos numa barbearia. Bora consertar?", expressao: "feliz" },
};

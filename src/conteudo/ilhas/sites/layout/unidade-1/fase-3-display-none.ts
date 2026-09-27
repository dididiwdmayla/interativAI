/*
 * L1, Fase 3: "None: some de vez, espaço incluso" (Papelaria Ponto de
 * Luz).
 *
 * O QUE ENSINA: display: none, revisado DIRETO contra a ferramenta
 * Esconder da U2 (visibility: hidden, que mantém o espaço). É a revisão
 * pedida no prompt desta rodada: a mesma pergunta "o que sobra na tela?"
 * respondida de dois jeitos diferentes.
 *
 * ORDEM: previsão comparando os dois (o jogador já usou Esconder na U2,
 * então a pergunta usa esse conhecimento como âncora); o sozinho aplica
 * display: none numa peça nova, sem comparação, só a habilidade.
 *
 * CONFUSÃO ATACADA (a do prompt desta rodada): "display: none e Esconder
 * são a mesma coisa". A explicação da previsão marca a diferença: Esconder
 * (visibility: hidden) mantém o lugar reservado; display: none tira a
 * peça do fluxo e fecha o espaço, como se ela nunca tivesse existido.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { PAPELARIA_PONTO_DE_LUZ } from "./sites/papelariaPontoDeLuz";

export const FASE_L1_F3: FasePratica = {
  id: "sites-layout-u1-f3",
  tipo: "pratica",
  unidadeId: "sites-layout-u1",
  titulo: "None: some de vez, espaço incluso",
  conceitos: ["display-none"],
  revisa: ["esconder-elemento"],
  prerequisitos: ["display-css"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Lá na Unidade 2 você usou Esconder (a tecla H) para deixar uma peça invisível sem tirar o lugar dela.",
      expressao: "curioso",
    },
    {
      texto: "display: none é parecido, mas tem uma diferença importante no espaço. Vamos comparar?",
      expressao: "apontando",
    },
  ],
  siteAlvo: PAPELARIA_PONTO_DE_LUZ,
  objetivos: [
    {
      id: "aviso-frete-none",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta:
          "O aviso de frete grátis (#aviso-frete) tem fundo verde. Se você usar display: none nele, em vez de Esconder, o que acontece com o espaço dele?",
        opcoes: [
          "O espaço continua reservado, só o fundo verde some",
          "O elemento e o espaço dele somem juntos; o que vem depois sobe",
          "Fica exatamente igual ao Esconder",
        ],
        correta: 1,
        explicacao:
          "Esconder (visibility: hidden) mantém o lugar reservado, como uma cadeira vazia. display: none fecha o espaço, como se a peça nunca tivesse existido.",
      },
      enunciado: {
        mouse: "Confira: mude o display de #aviso-frete para none e veja o aviso de baixo subir.",
        toque: "Confira: mude o display de #aviso-frete para none e veja o aviso de baixo subir.",
      },
      validador: { tipo: "valorEfetivo", seletor: "#aviso-frete", propriedade: "display", valor: "none" },
      ajudas: {
        pergunta: "Qual declaração faz uma peça sumir de vez, fechando o espaço dela?",
        dica: "display: none. Diferente de Esconder (visibility: hidden), ela tira a peça do fluxo da página inteira.",
        linha: { alvo: "estilos", seletorRegra: "#aviso-frete", propriedade: "display", fala: "Troque o display desta regra, #aviso-frete, para none." },
        solucao: {
          fala: "Troquei display para none em #aviso-frete: o aviso sumiu e o espaço dele fechou, então o aviso de manutenção subiu.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "#aviso-frete", propriedade: "display", valor: "none" }],
        },
      },
      falaAoConcluir: {
        texto: "Isso! Sumiu de vez, sem deixar buraco. Esconder guarda o lugar; display: none fecha ele.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: "#aviso-frete", propriedade: "display", valor: "none" },
      ],
    },
    {
      id: "aviso-manutencao-none",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O aviso de balanço mensal já passou da validade. Faça-o sumir de vez com display: none.",
        toque: "O aviso de balanço mensal já passou da validade. Faça-o sumir de vez com display: none.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".aviso-manutencao", propriedade: "display", valor: "none" },
      ajudas: {
        pergunta: "Qual valor de display tira a peça de vez, fechando o espaço dela?",
        dica: "none. Troque a declaração display da regra .aviso-manutencao.",
      },
      falaAoConcluir: {
        texto: "Sumiu certinho, sem buraco na página. A rodape voltou pra cima, colada no que restou.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso-manutencao", propriedade: "display", valor: "none" }],
    },
  ],
  conclusao: [
    {
      texto: "Agora você conhece os quatro valores de display: block, inline, inline-block e none.",
      expressao: "comemorando",
    },
    {
      texto: "No F12 de verdade, muita gente confunde display: none com visibility: hidden. Agora você sabe a diferença.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, ache algo escondido por acessibilidade (como .sr-only) e veja no Styles se é display: none ou outra técnica.",
  falaFinal: { texto: "Hora do desafio: uma oficina mecânica precisa da sua ajuda com o layout!", expressao: "feliz" },
};

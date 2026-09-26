/*
 * E1, Fase 3: "Cores e regras novas" (a mesma Floricultura).
 *
 * O QUE ENSINA: a cor em hexadecimal (#RRGGBB), o seletor de cor do painel
 * (o quadradinho ao lado de um valor de cor), o peso da fonte e a regra
 * nova, para a peça que não tem regra nenhuma. As duas ferramentas novas
 * (seletor de cor e regra nova) são apresentadas uma por objetivo.
 *
 * ORDEM: primeiro a previsão do hexadecimal (a confusão de leigo é achar
 * que é um código secreto sem lógica), depois escolher uma cor sem
 * digitar nada (o seletor), depois criar uma regra e, no sozinho, criar
 * outra regra numa peça nova, com uma cor em hexadecimal.
 *
 * VALIDADORES: o seletor de cor aceita QUALQUER cor nova, então o objetivo
 * usa `todos`: a declaração continua ligada (`declaracao`) e o valor que
 * vence não é mais o verde antigo nem o transparent de um valor inválido
 * (`nao` + `valorEfetivo`). A regra nova é
 * conferida pelo resultado (`valorEfetivo`): qualquer seletor que pegue a
 * peça vale (p.promo, que o painel sugere, ou .promo escrito à mão).
 *
 * REVISÃO ESPAÇADA: cor do texto e cor de fundo (Fase 1), dentro das
 * tarefas novas.
 *
 * CONFUSÕES ATACADAS: "hexadecimal é aleatório" (previsão) e "para mudar
 * uma peça sem regra, tenho que mexer no HTML" (a regra nova).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { FLORICULTURA_PETALA_AZUL } from "./sites/floriculturaPetalaAzul";

export const FASE_E1_F3: FasePratica = {
  id: "sites-estilos-u1-f3",
  tipo: "pratica",
  unidadeId: "sites-estilos-u1",
  titulo: "Cores e regras novas",
  conceitos: ["cor-hexadecimal", "peso-da-fonte", "regra-nova"],
  revisa: ["cor-do-texto", "cor-de-fundo"],
  prerequisitos: ["regra-e-declaracao", "cor-do-texto", "cor-de-fundo"],
  usaFerramentas: ["arvore", "painel-estilos", "editar-valor-css", "seletor-de-cor", "nova-regra"],
  paineisElementos: ["estilos"],
  introducao: [
    {
      texto: "Última parada na floricultura: cores de verdade e regras novas.",
      expressao: "feliz",
    },
    {
      texto: "Até agora você mexeu em regras que já existiam. E quando a peça não tem regra nenhuma? A gente cria uma!",
      expressao: "curioso",
    },
  ],
  siteAlvo: FLORICULTURA_PETALA_AZUL,
  objetivos: [
    {
      id: "hexadecimal",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Cor em hexadecimal é #RRGGBB: vermelho, verde e azul, de 00 a ff. Que cor é #ff0000?",
        opcoes: ["Vermelho puro", "Verde puro", "Azul puro"],
        correta: 0,
        explicacao: "ff é o máximo de vermelho, 00 é nada de verde e nada de azul. Sobra vermelho puro.",
      },
      enunciado: {
        mouse: "Confira: troque o color do h2 para #ff0000.",
        toque: "Confira: troque o color do h2 para #ff0000.",
      },
      validador: { tipo: "valorEfetivo", seletor: "h2", propriedade: "color", valor: "#ff0000" },
      ajudas: {
        pergunta: "Qual declaração da regra h2 pinta as letras?",
        dica: "É o color. Escreva o valor com o # na frente: #ff0000.",
        linha: { alvo: "estilos", seletorRegra: "h2", propriedade: "color", fala: "É o color da regra h2." },
        solucao: {
          fala: "Pus #ff0000 no color do h2: vermelho no máximo, verde e azul zerados.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "h2", propriedade: "color", valor: "#ff0000" }],
        },
      },
      falaAoConcluir: {
        texto: "Vermelhão! Cada par é uma luz: #00ff00 seria verde, #0000ff seria azul.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirPropriedade", seletorRegra: "h2", propriedade: "color", valor: "#ff0000" },
      ],
    },
    {
      id: "fundo-do-cabecalho",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Escolha uma cor nova para o fundo do cabeçalho: clique no quadradinho ao lado do background-color do header.",
        toque: "Escolha uma cor nova para o fundo do cabeçalho: toque no quadradinho ao lado do background-color do header.",
      },
      apresentar: ["seletor-de-cor"],
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "declaracao", seletorRegra: "header", propriedade: "background-color", ativa: true },
          { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: "header", propriedade: "background-color", valor: "#7a9e7e" } },
          // Valor inválido não vale: o fundo cairia no inicial (transparent).
          { tipo: "nao", validador: { tipo: "valorEfetivo", seletor: "header", propriedade: "background-color", valor: "transparent" } },
        ],
      },
      ajudas: {
        pergunta: "Onde fica a cor do fundo do cabeçalho no painel Estilos?",
        dica: "Ao lado de todo valor de cor tem um quadradinho com a cor. Ele abre o seletor de cor do computador.",
        linha: {
          alvo: "estilos",
          seletorRegra: "header",
          propriedade: "background-color",
          fala: "O quadradinho fica aqui, antes do valor.",
        },
        solucao: {
          fala: "Escolhi um azul (#2a6f97) no seletor de cor. O painel escreveu a cor em hexadecimal no CSS.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: "header", propriedade: "background-color", valor: "#2a6f97" }],
        },
      },
      falaAoConcluir: {
        texto: "Cabeçalho novo! Repare que o seletor escreveu a cor em hexadecimal, igual ao que você viu agora há pouco.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "header", propriedade: "background-color", valor: "#2a6f97" }],
    },
    {
      id: "promo-em-negrito",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "A promoção não tem regra nenhuma. Selecione ela, crie uma regra nova pelo + do painel e ponha font-weight: bold.",
        toque: "A promoção não tem regra nenhuma. Selecione ela, toque no + do painel e ponha font-weight: bold.",
      },
      apresentar: ["nova-regra"],
      validador: { tipo: "valorEfetivo", seletor: ".promo", propriedade: "font-weight", valor: "bold" },
      ajudas: {
        pergunta: "O painel Estilos mostra alguma regra do site para a promoção?",
        dica: "Sem regra, a gente cria uma: o + do painel faz a regra com o seletor da peça selecionada.",
        linha: { alvo: "arvore", seletor: ".promo", fala: "É este parágrafo, o da promoção." },
        solucao: {
          fala: "Criei a regra p.promo com font-weight: bold. O painel sugeriu o seletor: a tag e a class da peça.",
          acoes: [
            { tipo: "selecionar", seletor: ".promo" },
            { tipo: "adicionarRegra", seletorRegra: "p.promo", declaracoes: [{ propriedade: "font-weight", valor: "bold" }] },
          ],
        },
      },
      falaAoConcluir: {
        texto: "Promoção em negrito! A regra nova entrou no fim da folha, e o HTML continua igual.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".promo" },
        { tipo: "adicionarRegra", seletorRegra: "p.promo", declaracoes: [{ propriedade: "font-weight", valor: "bold" }] },
      ],
    },
    {
      id: "horario-azul",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "O horário do rodapé também não tem regra. Pinte ele de azul-marinho: #1d3557.",
        toque: "O horário do rodapé também não tem regra. Pinte ele de azul-marinho: #1d3557.",
      },
      validador: { tipo: "valorEfetivo", seletor: ".horario", propriedade: "color", valor: "#1d3557" },
      ajudas: {
        pergunta: "Se a peça não tem regra, o que o painel deixa você criar?",
        dica: "Uma regra nova com o seletor dela e a declaração da cor das letras.",
      },
      falaAoConcluir: {
        texto: "Regra criada sozinho e com cor em hexadecimal! Você já repagina um site sem tocar no HTML.",
        expressao: "comemorando",
      },
      solucaoDeTeste: [
        { tipo: "selecionar", seletor: ".horario" },
        { tipo: "adicionarRegra", seletorRegra: "p.horario", declaracoes: [{ propriedade: "color", valor: "#1d3557" }] },
      ],
    },
  ],
  conclusao: [
    {
      texto: "Hexadecimal, seletor de cor e regra nova: a caixa de ferramentas do painel Estilos está completa!",
      expressao: "comemorando",
    },
    {
      texto: "No Chrome é igual: o quadradinho abre o seletor de cor e o + do Styles cria a regra. Tudo volta ao recarregar.",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Num site de verdade, abra o F12, selecione um botão e clique no quadradinho de cor de um valor no painel Styles. Escolha outra cor e veja o valor em hexadecimal mudar.",
  falaFinal: { texto: "Agora o desafio: uma cafeteria inteira para repaginar. Bora?", expressao: "feliz" },
};

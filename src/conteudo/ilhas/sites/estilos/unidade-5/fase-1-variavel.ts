/*
 * E5, Fase 1: "Uma variável, o jogo inteiro" (o próprio jogo como
 * site-alvo).
 *
 * O QUE ENSINA: o que é uma variável CSS (`--nome: valor`, declarada no
 * `:root`) e `var(--nome)`, que qualquer regra pode usar. A ideia central:
 * mudar UMA declaração e várias peças da página mudarem juntas, porque
 * todas usam a mesma variável.
 *
 * ORDEM: 1) guiado, mudar --cor-primaria (o botão e os pontos do mapa
 * usam os dois); 2) guiado, previsão sobre QUANTOS lugares mudam (ataca a
 * confusão "cada peça tem a cor dela, mudar uma variável muda só ali"),
 * depois mudar --cor-destaque; 3) sozinho, --cor-fundo.
 *
 * SITE-ALVO: `SITE_ALVO_DO_JOGO` (E5, ver docs/GUIA-DE-CONTEUDO.md, seção
 * 15): a maquete do próprio jogo, pintada só com `var(--cor-*)`. A folha
 * editável (o `:root` com os tokens reais do tema do jogador) é montada
 * quando a fase abre.
 *
 * REVISÃO ESPAÇADA: cor hexadecimal e o seletor de cor (E1/E3), já usados
 * para trocar o valor de uma declaração comum — aqui a mesma ferramenta
 * troca o valor de uma variável.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";

export const FASE_E5_F1: FasePratica = {
  id: "sites-estilos-u5-f1",
  tipo: "pratica",
  unidadeId: "sites-estilos-u5",
  titulo: "Uma variável, o jogo inteiro",
  conceitos: ["variavel-css"],
  revisa: ["cor-hexadecimal"],
  prerequisitos: ["o-que-e-css", "regra-e-declaracao"],
  usaFerramentas: ["painel-estilos", "editar-valor-css", "seletor-de-cor"],
  paineisElementos: ["estilos"],
  siteAlvo: SITE_ALVO_DO_JOGO,
  introducao: [
    { texto: "Última unidade da zona Estilos! E o site-alvo agora é o PRÓPRIO jogo: estas cores aqui são as cores de verdade dele.", expressao: "feliz" },
    { texto: "No estilo.css tem uma regra :root com uma variável para cada cor: --cor-primaria, --cor-fundo... Mude uma, e tudo que usa ela muda.", expressao: "curioso" },
    { texto: "Bora repintar o jogo? No fim, dá para salvar como o seu tema de verdade.", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "trocar-primaria",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Selecione o :root na aba Estilos e troque o valor de --cor-primaria por outra cor.",
        toque: "Selecione o :root na aba Estilos e troque o valor de --cor-primaria por outra cor.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-primaria", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Onde ficam declaradas as variáveis de cor do jogo?",
        dica: "Na regra :root, no topo do estilo.css. --cor-primaria é a primeira: troque só o valor, depois dos dois-pontos.",
        linha: { alvo: "css", seletorRegra: ":root", propriedade: "--cor-primaria", fala: "É esta declaração, na regra :root." },
        solucao: {
          fala: "Troquei --cor-primaria. Repare no botão e nos pontos do mapa: os dois usam essa variável.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#1d5c8a" }],
        },
      },
      falaAoConcluir: { texto: "O botão e os pontos do mapa mudaram juntos! Uma variável, várias peças.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-primaria", valor: "#1d5c8a" }],
    },
    {
      id: "quantos-lugares",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Se eu mudar --cor-destaque no :root, quantos lugares da maquete mudam?",
        opcoes: ["Só um: cada peça tem a cor guardada nela mesma", "Todo lugar que tiver var(--cor-destaque) na regra dele", "Nenhum: variável só serve para o :root"],
        correta: 1,
        explicacao: "Uma variável não é de uma peça só: TODA regra que escrever var(--cor-destaque) usa o mesmo valor. Mudou no :root, mudou em todas.",
      },
      enunciado: {
        mouse: "Confira: troque --cor-destaque (a cor do quadrinho de estrelas) por outra.",
        toque: "Confira: troque --cor-destaque (a cor do quadrinho de estrelas) por outra.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-destaque", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Qual variável pinta o quadrinho de estrelas, lá em cima na barra?",
        dica: "--cor-destaque, na regra :root, junto das outras.",
        linha: { alvo: "css", seletorRegra: ":root", propriedade: "--cor-destaque", fala: "Esta é a declaração." },
        solucao: {
          fala: "Troquei --cor-destaque: o quadrinho de estrelas ficou com a cor nova.",
          acoes: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-destaque", valor: "#b8860b" }],
        },
      },
      falaAoConcluir: { texto: "Isso! Não é a peça que guarda a cor: é a variável, e qualquer regra pode pedir ela com var().", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-destaque", valor: "#b8860b" },
      ],
    },
    {
      id: "trocar-fundo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora o fundo da página: troque --cor-fundo por outra cor.",
        toque: "Agora o fundo da página: troque --cor-fundo por outra cor.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-fundo", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Qual variável do :root pinta o fundo da página inteira?",
        dica: "--cor-fundo. Troque o valor dela, como fez com as outras duas.",
      },
      falaAoConcluir: { texto: "A página inteira mudou de cara com uma variável só. É assim que um tema funciona.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-fundo", valor: "#0f172a" }],
    },
  ],
  conclusao: [
    { texto: "Três variáveis trocadas, e o jogo inteiro mudou de cara. Isso é um tema: um conjunto de variáveis.", expressao: "comemorando" },
    { texto: "Um detalhe pra guardar: var(--nome, reserva) usa a reserva quando a variável não existe. Vamos ver isso na próxima fase.", expressao: "curioso" },
  ],
  missaoDeCampo: "Abra o F12 num site de verdade, selecione o <html> na aba Elements e procure, no painel Styles, uma regra :root com variáveis (--algumacoisa). Nem todo site usa, mas muitos dos grandes usam.",
  falaFinal: { texto: "Próxima fase: variáveis que só valem numa parte da página.", expressao: "feliz" },
};

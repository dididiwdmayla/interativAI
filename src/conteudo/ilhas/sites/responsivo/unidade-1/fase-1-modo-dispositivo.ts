/*
 * R1, Fase 1: "Ver em outro tamanho" (Padaria Trigo Dourado).
 *
 * O QUE ENSINA: o modo dispositivo (botão ao lado da setinha, ou
 * Ctrl+Shift+M): ver a página como um celular, um tablet ou um notebook
 * de verdade veem ela — não é "a mesma página encolhida numa miniatura",
 * é o navegador desenhando a página NAQUELA largura (docs/GUIA-DE-CONTEUDO.md,
 * seção 16). Também apresenta girar (retrato/paisagem).
 *
 * ORDEM: 1) guiado, ligar e escolher o Celular 390; 2) guiado, previsão
 * sobre o que o modo dispositivo realmente faz (ataca a confusão "é um
 * zoom, a página é a mesma"), depois trocar para o Tablet 768; 3)
 * sozinho, o Notebook 1280 e girar.
 *
 * PRIMEIRA VEZ DE VERDADE: `modo-dispositivo` já apareceu antes só na P2
 * (Fase 1), com a nota "quando R1 existir, tire de lá" — a partir desta
 * unidade, a P2 REVISA em vez de apresentar (ver o comentário no topo de
 * `fase-1-arquivos.ts` da P2, atualizado junto com esta unidade).
 */
import type { FasePratica } from "@/conteudo/tipos";
import { PADARIA_TRIGO_DOURADO } from "./sites/padariaTrigoDourado";

export const FASE_R1_F1: FasePratica = {
  id: "sites-responsivo-u1-f1",
  tipo: "pratica",
  unidadeId: "sites-responsivo-u1",
  titulo: "Ver em outro tamanho",
  conceitos: ["modo-dispositivo", "orientacao-da-tela"],
  revisa: [],
  prerequisitos: ["estrutura-do-documento"],
  usaFerramentas: ["modo-dispositivo", "girar-dispositivo"],
  siteAlvo: PADARIA_TRIGO_DOURADO,
  introducao: [
    { texto: "Primeira fase da zona Responsivo! Até agora você só viu os sites no tamanho do computador.", expressao: "feliz" },
    { texto: "Mas quem visita um site pode estar num celular, num tablet ou num notebook. O modo dispositivo mostra cada um de verdade.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "ligar-celular",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ligue o modo dispositivo (botão ao lado da setinha, em cima da prévia) e escolha o Celular 390.",
        toque: "Ligue o modo dispositivo (botão ao lado da setinha, em cima da prévia) e escolha o Celular 390.",
      },
      apresentar: ["modo-dispositivo"],
      validador: { tipo: "dispositivo", largura: 390 },
      ajudas: {
        pergunta: "Qual botão liga a barra que deixa escolher o tamanho da tela?",
        dica: "Fica em cima da prévia, ao lado do ícone da setinha (o modo inspecionar). Ctrl+Shift+M também liga.",
        linha: { alvo: "ferramenta", ferramenta: "modo-dispositivo", fala: "Este botão." },
        solucao: { fala: "Liguei o modo dispositivo no Celular 390.", acoes: [{ tipo: "trocarDispositivo", modelo: "celular-390" }] },
      },
      falaAoConcluir: { texto: "Repare: o cabeçalho da padaria ficou bem mais apertado. Não é zoom: a página desenhou naquela largura mesmo.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "trocarDispositivo", modelo: "celular-390" }],
    },
    {
      id: "previsao-o-que-muda",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "O modo dispositivo é tipo um zoom (a MESMA imagem da página, só menor) ou o navegador desenha a página de novo, naquela largura?",
        opcoes: ["É um zoom: a imagem só encolhe", "O navegador desenha tudo de novo, naquela largura (por isso o layout muda)", "Ele abre outra versão do site, feita só pro celular"],
        correta: 1,
        explicacao: "O navegador REDESENHA a página com aquela largura de verdade: por isso o cabeçalho, os espaçamentos, tudo se ajusta — como um celular de verdade faria.",
      },
      enunciado: {
        mouse: "Confira num tamanho diferente: troque para o Tablet 768.",
        toque: "Confira num tamanho diferente: troque para o Tablet 768.",
      },
      validador: { tipo: "dispositivo", largura: 768 },
      ajudas: {
        pergunta: "Onde troco o aparelho depois que o modo dispositivo já está ligado?",
        dica: "No seletor de aparelho da barra de dispositivo: escolha Tablet 768.",
        linha: { alvo: "ferramenta", ferramenta: "modo-dispositivo", fala: "O seletor de aparelho fica na barra que apareceu." },
        solucao: { fala: "Troquei para o Tablet 768: o layout se ajustou de novo, para essa largura.", acoes: [{ tipo: "trocarDispositivo", modelo: "tablet-768" }] },
      },
      falaAoConcluir: { texto: "Isso! Três larguras, três desenhos diferentes da mesma página, do jeito que cada aparelho veria de verdade.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "trocarDispositivo", modelo: "tablet-768" },
      ],
    },
    {
      id: "tablet-deitado",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Volte para o Tablet 768 e gire a tela para paisagem.",
        toque: "Volte para o Tablet 768 e gire a tela para paisagem.",
      },
      apresentar: ["girar-dispositivo"],
      validador: { tipo: "dispositivo", largura: 1024, orientacao: "paisagem" },
      ajudas: {
        pergunta: "Depois de escolher o aparelho, qual botão deixa a tela deitada?",
        dica: "O seletor de aparelho (Tablet 768) e, do lado, o botão de girar.",
      },
      falaAoConcluir: { texto: "Deitado, o tablet fica com 1024 px de largura: a altura e a largura do aparelho trocam de lugar.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "trocarDispositivo", modelo: "tablet-768" },
        { tipo: "girarDispositivo" },
      ],
    },
  ],
  conclusao: [
    { texto: "Você já sabe olhar qualquer site com os olhos de um celular, um tablet ou um notebook.", expressao: "comemorando" },
    { texto: "Só falta uma coisa antes de ver o que quebra: por que às vezes o celular desenha a página gigante, sem nem precisar de largura estreita nenhuma.", expressao: "curioso" },
  ],
  missaoDeCampo: "No F12 de verdade, abra o modo dispositivo (Ctrl+Shift+M) num site que você usa bastante e experimente os aparelhos prontos.",
  falaFinal: { texto: "Próxima fase: o meta viewport, e por que ele importa tanto.", expressao: "feliz" },
};

/*
 * E5, Fase 3: "Salvar como Meu tema".
 *
 * O QUE ENSINA: o botão "Salvar como Meu tema" (barra de endereço da
 * prévia, ferramenta `salvar-tema`), que guarda o conjunto de variáveis
 * do :root como um tema novo, disponível no seletor de temas do jogo
 * inteiro. Antes de salvar, o jogo confere o contraste de 7 pares
 * principais e avisa (sem travar) quando algum fica abaixo de 4,5:1.
 *
 * ORDEM: 1) guiado, mudar --cor-secundaria (prepara uma cor nova de
 * verdade); 2) guiado, previsão sobre o que acontece com contraste ruim
 * (ataca a confusão "o jogo não deixa salvar se a cor for ruim") e então
 * salvar; 3) sozinho, mudar mais uma variável e salvar de novo.
 *
 * SITE-ALVO: SITE_ALVO_DO_JOGO, como as fases 1 e 2.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_ALVO_DO_JOGO } from "@/motor/siteDoJogo";

export const FASE_E5_F3: FasePratica = {
  id: "sites-estilos-u5-f3",
  tipo: "pratica",
  unidadeId: "sites-estilos-u5",
  titulo: "Salvar como Meu tema",
  conceitos: ["contraste-de-cor", "salvar-como-meu-tema"],
  revisa: ["variavel-css"],
  prerequisitos: ["escopo-de-variavel"],
  usaFerramentas: ["editar-valor-css", "seletor-de-cor", "salvar-tema"],
  paineisElementos: ["estilos"],
  siteAlvo: SITE_ALVO_DO_JOGO,
  introducao: [
    { texto: "Você já sabe mudar as variáveis. Falta guardar esse conjunto como um tema de verdade, para não perder ao trocar de fase.", expressao: "feliz" },
    { texto: "Lá em cima, na barra do endereço da prévia, tem o botão \"Salvar como Meu tema\".", expressao: "apontando" },
  ],
  objetivos: [
    {
      id: "cor-secundaria",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Primeiro, uma cor de verdade: troque --cor-secundaria (o botão \"Me ajuda\") por outra.",
        toque: "Primeiro, uma cor de verdade: troque --cor-secundaria (o botão \"Me ajuda\") por outra.",
      },
      validador: { tipo: "variavelCss", nome: "--cor-secundaria", diferenteDoInicial: true },
      ajudas: {
        pergunta: "Qual variável pinta o botão secundário (\"Me ajuda\")?",
        dica: "--cor-secundaria, no :root.",
        linha: { alvo: "css", seletorRegra: ":root", propriedade: "--cor-secundaria", fala: "É esta declaração." },
        solucao: { fala: "Troquei --cor-secundaria.", acoes: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-secundaria", valor: "#0e7490" }] },
      },
      falaAoConcluir: { texto: "Boa cor! Agora vamos guardar tudo isso.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-secundaria", valor: "#0e7490" }],
    },
    {
      id: "salvar",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Antes de salvar, o jogo confere o contraste do texto com o fundo. Se algum par ficar fraco demais para ler, o que acontece?",
        opcoes: ["Não deixa salvar de jeito nenhum", "Avisa quais pares ficaram fracos, mas deixa salvar assim mesmo, se você quiser", "Troca a cor sozinho para uma que funcione"],
        correta: 1,
        explicacao: "O jogo AVISA (não impede): você decide se ajusta a cor ou salva assim mesmo. É a mesma ideia do Lighthouse: apontar o problema, não travar o trabalho.",
      },
      enunciado: {
        mouse: "Agora salve: clique em \"Salvar como Meu tema\", na barra de endereço da prévia.",
        toque: "Agora salve: toque em \"Salvar como Meu tema\", na barra de endereço da prévia.",
      },
      apresentar: ["salvar-tema"],
      validador: { tipo: "temaSalvo" },
      ajudas: {
        pergunta: "Onde fica o botão que guarda as cores como um tema?",
        dica: "Em cima da prévia, na barra de endereço (perto do endereço de mentirinha do site).",
        linha: { alvo: "ferramenta", ferramenta: "salvar-tema", fala: "Este botão." },
        solucao: { fala: "Salvei o Meu tema: essas cores agora ficam disponíveis no seletor de temas.", acoes: [{ tipo: "salvarTema" }] },
      },
      falaAoConcluir: { texto: "Salvo! O Meu tema já aparece no seletor de temas, e vale no jogo inteiro, não só nesta fase.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }, { tipo: "salvarTema" }],
    },
    {
      id: "trocar-e-salvar-de-novo",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Troque --cor-sucesso (o ponto de unidade concluída no mapa) e salve de novo.",
        toque: "Troque --cor-sucesso (o ponto de unidade concluída no mapa) e salve de novo.",
      },
      validador: {
        tipo: "todos",
        validadores: [{ tipo: "variavelCss", nome: "--cor-sucesso", diferenteDoInicial: true }, { tipo: "temaSalvo" }],
      },
      ajudas: {
        pergunta: "Depois de mudar a cor, o Meu tema já salvo atualiza sozinho ou precisa salvar de novo?",
        dica: "Precisa salvar de novo: o botão \"Salvar como Meu tema\" guarda o estado de AGORA, não atualiza sozinho.",
      },
      falaAoConcluir: { texto: "Cada mudança de cor precisa de um salvar novo para entrar no tema. Agora ele é totalmente seu.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ":root", propriedade: "--cor-sucesso", valor: "#15803d" },
        { tipo: "salvarTema" },
      ],
    },
  ],
  conclusao: [
    { texto: "O Meu tema está pronto: cores suas, guardadas, valendo no jogo inteiro.", expressao: "comemorando" },
    { texto: "Ele continua editável depois: a oficina Meu tema (no menu do mapa) deixa mexer, salvar de novo ou voltar ao começo.", expressao: "feliz" },
  ],
  missaoDeCampo: "Escolha um site que você usa bastante e imagine as variáveis que ele teria no :root para o modo escuro. No F12, veja se ele já tem um data-theme ou class dark no <html>.",
  falaFinal: { texto: "Última parada da zona Estilos: o desafio. Vamos criar um tema do zero?", expressao: "curioso" },
};

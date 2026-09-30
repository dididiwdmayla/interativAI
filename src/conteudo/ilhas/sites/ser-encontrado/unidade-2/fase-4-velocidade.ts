/*
 * S2, Fase 4: "Uma página que abre rápido" (Estúdio Foco).
 *
 * O QUE ENSINA: velocidade da página (quem espera desiste) e a imagem
 * preguiçosa (loading="lazy": a foto só baixa quando a pessoa chega
 * perto). A capa, que aparece logo, NÃO fica preguiçosa.
 *
 * REVISA: o Lighthouse (P1, que já falava de qualidade da página) e
 * imagem responsiva (R2): a foto que cabe na tela.
 *
 * ORDEM: 1) guiado, com previsão: a foto de baixo ganha loading="lazy"
 * (Adicionar atributo); 2) sozinho, as outras duas da galeria e o cuidado
 * de deixar a capa sem lazy.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { ESTUDIO_FOCO } from "./sites/estudioFoco";

export const FASE_S2_F4: FasePratica = {
  id: "sites-ser-encontrado-u2-f4",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u2",
  titulo: "Uma página que abre rápido",
  conceitos: ["velocidade-da-pagina", "imagem-preguicosa"],
  revisa: ["auditoria-lighthouse", "imagem-responsiva"],
  prerequisitos: ["editar-atributo", "imagem-alt"],
  usaFerramentas: ["arvore", "adicionar-atributo"],
  siteAlvo: ESTUDIO_FOCO,
  introducao: [
    { texto: "Ninguém espera uma página que demora. Se a foto pesada atrasa tudo, a pessoa volta para a busca antes de ver qualquer coisa.", expressao: "pensativo" },
    { texto: "O Estúdio Foco tem quatro fotos, e quem abre só vê a de cima. As outras não precisam correr para chegar.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "foto-de-baixo-preguicosa",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "A página tem 4 fotos, mas quem abre só vê a de cima. O que faz a página abrir mais rápido?",
        opcoes: ["Nada: abre no mesmo tempo", "Trocar todas as fotos por texto", "Baixar as de baixo só quando a pessoa rolar até elas"],
        correta: 2,
        explicacao: "É a imagem preguiçosa: loading=\"lazy\" faz a foto esperar a pessoa chegar perto. A página abre mais rápido porque baixa menos de início.",
      },
      enunciado: {
        mouse: "Na primeira foto da galeria, adicione o atributo loading com o valor lazy (Adicionar atributo, no menu da tag).",
        toque: "Na primeira foto da galeria, adicione o atributo loading com o valor lazy (Adicionar atributo, no menu da tag).",
      },
      validador: { tipo: "atributo", seletor: "#foto-1", nome: "loading", valor: "lazy" },
      ajudas: {
        pergunta: "Qual atributo do navegador diz \"baixe esta foto só quando for preciso\"?",
        dica: "loading=\"lazy\" na tag img. Lazy quer dizer preguiçoso: a foto espera a pessoa rolar até perto dela.",
        linha: { alvo: "arvore", seletor: "#foto-1", fala: "Esta é a primeira foto da galeria. Adicione loading=lazy nela." },
        solucao: {
          fala: "Pus loading=lazy nesta foto: o navegador só baixa quando a pessoa rola até perto dela.",
          acoes: [{ tipo: "adicionarAtributo", seletor: "#foto-1", nome: "loading", valor: "lazy" }],
        },
      },
      falaAoConcluir: { texto: "Foto preguiçosa! No F12 de verdade, a aba Rede mostra o que baixa e o tamanho de cada coisa.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 2 },
        { tipo: "adicionarAtributo", seletor: "#foto-1", nome: "loading", valor: "lazy" },
      ],
    },
    {
      id: "galeria-toda-menos-a-capa",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Deixe as três fotos da galeria preguiçosas, mas não a capa: ela aparece logo, então precisa baixar já.",
        toque: "Deixe as três fotos da galeria preguiçosas, mas não a capa: ela aparece logo, então precisa baixar já.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: '.galeria img[loading="lazy"]', op: ">=", valor: 3 },
          { tipo: "nao", validador: { tipo: "atributo", seletor: "#capa", nome: "loading", valor: "lazy" } },
        ],
      },
      ajudas: {
        pergunta: "Qual foto a pessoa vê assim que a página abre? Ela deve esperar?",
        dica: "Lazy só nas fotos de baixo. A capa é a primeira coisa que aparece: deixar ela esperar só atrasa o que a pessoa mais quer ver.",
      },
      falaAoConcluir: { texto: "Só as de baixo esperam, e a capa aparece já. Página leve e sem susto.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#foto-2", nome: "loading", valor: "lazy" },
        { tipo: "adicionarAtributo", seletor: "#foto-3", nome: "loading", valor: "lazy" },
      ],
    },
  ],
  conclusao: [
    { texto: "Página rápida é página que baixa só o que precisa na hora. Quem espera menos fica mais.", expressao: "feliz" },
    { texto: "Agora junta tudo, numa página bonita e invisível para a busca.", expressao: "apontando" },
  ],
  missaoDeCampo:
    "Abra um site com muitas fotos, aperte F12, vá na aba Rede (Network) e recarregue a página. Olhe no rodapé da aba quanto foi baixado. Qual arquivo é o mais pesado?",
  falaFinal: { texto: "Hora do desafio da unidade!", expressao: "comemorando" },
};

/* Sala 5, fase 4: a prévia da aba Rede do F12 (a porta da Ilha Rede e Servidor). */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
import { ARQUIVOS_DA_PADARIA } from "./dados";

const comando = (texto: string) => ({ tipo: "comandoNaEstacao", estacao: "rede", comando: texto }) as const;

export const FASE_ORIGENS_U5_F4: Fase = {
  id: "origens-museu-u5-f4",
  tipo: "pratica",
  unidadeId: "origens-museu-u5",
  titulo: "A aba Rede",
  conceitos: ["aba-rede", "codigo-de-status"],
  revisa: ["pacote-de-rede", "front-e-back"],
  prerequisitos: ["front-e-back"],
  usaFerramentas: ["aba-rede-previa"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "internet",
    placa: {
      titulo: "O diário de bordo",
      texto: "A aba Rede do F12 anota cada arquivo que a página pediu: o nome, o status, o tamanho e o tempo. É a porta da Ilha Rede e Servidor.",
    },
    falas: {
      abrir: "Sabia que dá para ver tudo o que eu carrego? O F12 tem um diário de bordo: a aba Rede!",
      porEtapa: {
        "o-documento": "O primeiro da lista é sempre a página. Ela que pede o resto!",
        "o-mais-lento": "Tem um arquivo pesadão aí. Foto grande demora, viu? Acha ele!",
        "o-que-falhou": "E um não veio: o servidor procurou e não achou. 404, o número mais famoso da internet!",
      },
      concluir: "Agora você lê o meu diário! Quem faz site olha essa aba todo dia.",
    },
    estacoes: [{ id: "rede", tipo: "aba-rede", titulo: "A aba Rede", pagina: "padariadobairro.com.br", requisicoes: ARQUIVOS_DA_PADARIA }],
  },
  introducao: [
    { texto: "Uma página não vem inteira de uma vez: o navegador pede um arquivo de cada vez.", expressao: "apontando" },
    { texto: "A aba Rede do F12 mostra cada pedido. Essa aqui é uma prévia, igualzinha.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "gravar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Com a aba Rede aberta, clique em Recarregar para gravar os pedidos da página.",
        toque: "Com a aba Rede aberta, toque em Recarregar para gravar os pedidos da página.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rede", marco: "gravou" },
      apresentar: ["aba-rede-previa"],
      ajudas: {
        pergunta: "A aba só anota o que acontece depois de aberta. O que fazer para a página pedir tudo de novo?",
        dica: "Recarregue a página (no F12 de verdade, F5) com a aba Rede aberta.",
        linha: { alvo: "exposicao", estacao: "rede", peca: "gravar", fala: "Este botão recarrega a página." },
        solucao: { fala: "Recarreguei com a aba aberta: sete pedidos.", acoes: [comando("gravar")] },
      },
      falaAoConcluir: { texto: "Sete pedidos para uma página só! A página, o CSS, o JavaScript, a fonte e as imagens.", expressao: "curioso" },
      solucaoDeTeste: [comando("gravar")],
    },
    {
      id: "o-documento",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique na primeira linha, o documento: a própria página.",
        toque: "Toque na primeira linha, o documento: a própria página.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rede", marco: "escolhida:pagina" },
      ajudas: {
        pergunta: "Quem chegou primeiro, antes de todo mundo?",
        dica: "O documento (o HTML) vem primeiro. Lendo ele, o navegador descobre o que mais precisa pedir.",
        linha: { alvo: "exposicao", estacao: "rede", peca: "pagina", fala: "Esta é a linha do documento." },
        solucao: { fala: "Abri o documento: status 200, deu certo.", acoes: [comando("escolher:pagina")] },
      },
      falaAoConcluir: { texto: "Status 200: deu certo. O documento chegou primeiro e chamou o resto.", expressao: "feliz" },
      solucaoDeTeste: [comando("escolher:pagina")],
    },
    {
      id: "o-mais-lento",
      tipo: "previsao",
      modo: "sozinho",
      enunciado: {
        mouse: "Ache o arquivo que mais demorou e clique nele (dá para ordenar pela coluna Tempo).",
        toque: "Ache o arquivo que mais demorou e toque nele (dá para ordenar pela coluna Tempo).",
      },
      previsao: {
        pergunta: "Antes de olhar: qual arquivo você acha que demorou mais?",
        opcoes: ["O documento", "O CSS, pequenininho", "A foto dos pães, grandona"],
        correta: 2,
        explicacao: "Arquivo grande demora mais para viajar. 850 kB de foto pesam mais que 6 kB de CSS.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rede", marco: "escolhida:foto" },
      ajudas: {
        pergunta: "Na coluna Tempo, qual número é o maior? E a barra mais comprida da cascata?",
        dica: "Tocar em Tempo ordena do mais lento ao mais rápido.",
      },
      falaAoConcluir: { texto: "A foto! Diminuir imagem é o jeito mais fácil de deixar um site rápido.", expressao: "apontando" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }, comando("ordenar:tempo"), comando("escolher:foto")],
    },
    {
      id: "o-que-falhou",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora ache o arquivo que o servidor não encontrou (status 404) e clique nele.",
        toque: "Agora ache o arquivo que o servidor não encontrou (status 404) e toque nele.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "rede", marco: "escolhida:selo" },
      ajudas: {
        pergunta: "Qual linha está diferente das outras na coluna Status?",
        dica: "200 quer dizer que deu certo. 404 quer dizer que o servidor não achou o arquivo.",
      },
      falaAoConcluir: { texto: "Not Found! A página pediu um selo que não existe mais. Bug achado pela aba Rede.", expressao: "comemorando" },
      solucaoDeTeste: [comando("escolher:selo")],
    },
  ],
  conclusao: [
    { texto: "A aba Rede mostra cada pedido: status, tamanho e tempo. 200 é ok, 404 não achou, 500 o servidor falhou.", expressao: "apontando" },
    { texto: "Na Ilha Rede e Servidor, você vai ficar do outro lado: escrevendo o servidor que responde.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Num site qualquer, aperte F12, abra a aba Rede (Network) e recarregue (F5). Clique no cabeçalho Tempo (Time) e ache o arquivo mais lento. Era uma imagem?",
  falaFinal: { texto: "Quando um site estiver lento, você já sabe onde olhar primeiro.", expressao: "feliz" },
};

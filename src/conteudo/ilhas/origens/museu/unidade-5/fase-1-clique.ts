/* Sala 5, fase 1: o caminho de um clique, etapa por etapa, e os cenários de quebra. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

const comando = (texto: string) => ({ tipo: "comandoNaEstacao", estacao: "viagem", comando: texto }) as const;
const avancar = (vezes: number) => Array.from({ length: vezes }, () => comando("avancar"));

export const FASE_ORIGENS_U5_F1: Fase = {
  id: "origens-museu-u5-f1",
  tipo: "pratica",
  unidadeId: "origens-museu-u5",
  titulo: "O caminho de um clique",
  conceitos: ["dns", "roteador"],
  revisa: ["web"],
  prerequisitos: ["web"],
  usaFerramentas: ["caminho-do-clique"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "internet",
    placa: {
      titulo: "Do clique à página",
      texto: "Entre o clique num link e a página aparecer, um pedido atravessa a cidade (ou o mundo) e volta. Tudo em menos de um segundo, quando dá certo.",
    },
    falas: {
      abrir: "Alôôô! Que bom que você veio! Clica aí num link que eu te mostro tudo que eu faço por trás, tá?",
      porEtapa: {
        "ate-a-pagina": "Primeiro eu pergunto o endereço, depois eu levo o pedido, depois eu trago a resposta. Ufa! Vai avançando!",
        "dns-fora": "E se a lista telefônica sumir? Ninguém sabe o endereço de ninguém! Vamos ver?",
        "servidor-lento": "Agora o servidor cansado. Funciona, mas demoooora. Já viu a rodinha girando?",
      },
      concluir: "É isso! Eu sou o caminho. O DNS é a lista, os roteadores são as esquinas e o servidor cozinha a resposta.",
    },
    estacoes: [{ id: "viagem", tipo: "clique", titulo: "O caminho de um clique", site: "padariadobairro.com.br", cenarios: ["normal", "dns-fora", "servidor-lento"] }],
  },
  introducao: [
    { texto: "Essa é a minha tia, a internet discada dos anos 1990. Ela conversa com o mundo inteiro ao mesmo tempo!", expressao: "apontando" },
    { texto: "Ela vai mostrar o que acontece quando você clica num link. Spoiler: é uma viagem.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "clicar",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique no link da padaria, na janela do navegador.",
        toque: "Toque no link da padaria, na janela do navegador.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "viagem", marco: "clicou" },
      apresentar: ["caminho-do-clique"],
      ajudas: {
        pergunta: "Onde está o link azul da padaria?",
        dica: "Na janela do navegador, o resultado da busca tem o link. É ali que tudo começa.",
        linha: { alvo: "exposicao", estacao: "viagem", peca: "clicar", fala: "Este é o link." },
        solucao: { fala: "Cliquei no link: a viagem começou.", acoes: [comando("clicar")] },
      },
      falaAoConcluir: { texto: "Clicou! Mas o navegador só sabe o nome do site. Falta descobrir onde ele mora.", expressao: "curioso" },
      solucaoDeTeste: [comando("clicar")],
    },
    {
      id: "ate-a-pagina",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Clique em Próxima etapa até a página da padaria aparecer, e leia cada etapa.",
        toque: "Toque em Próxima etapa até a página da padaria aparecer, e leia cada etapa.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "viagem", marco: "pagina-montada" },
      ajudas: {
        pergunta: "Quantas paradas o pedido faz até voltar como página?",
        dica: "DNS, roteadores, servidor, a volta e a montagem. Uma etapa de cada vez, pelo Próxima etapa.",
        linha: { alvo: "exposicao", estacao: "viagem", peca: "avancar", fala: "Este botão anda uma etapa." },
        solucao: { fala: "Andei todas as etapas: a página da padaria apareceu.", acoes: avancar(6) },
      },
      falaAoConcluir: { texto: "A página apareceu! O navegador (o front) pediu, o servidor (o back) respondeu.", expressao: "comemorando" },
      solucaoDeTeste: avancar(6),
    },
    {
      id: "dns-fora",
      tipo: "previsao",
      modo: "guiado",
      enunciado: {
        mouse: "Troque o cenário para DNS fora do ar, clique no link e avance até o fim.",
        toque: "Troque o cenário para DNS fora do ar, toque no link e avance até o fim.",
      },
      previsao: {
        pergunta: "Sem o DNS, o que você acha que o navegador consegue fazer?",
        opcoes: ["Abre a página normalmente", "Abre só metade", "Não acha o servidor e mostra um erro"],
        correta: 2,
        explicacao: "Sem o DNS, o navegador não sabe o endereço do servidor: não tem nem para onde mandar o pedido.",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "viagem", marco: "viu:dns-fora" },
      ajudas: {
        pergunta: "Qual é a primeira coisa que o navegador precisa depois do clique?",
        dica: "Troque o cenário, clique no link e avance: veja onde a viagem para.",
        linha: { alvo: "exposicao", estacao: "viagem", peca: "cenario:dns-fora", fala: "Este botão tira o DNS do ar." },
        solucao: { fala: "Tirei o DNS do ar e cliquei: o navegador não achou o servidor.", acoes: [comando("cenario:dns-fora"), comando("clicar"), ...avancar(2)] },
      },
      falaAoConcluir: { texto: "\"Não é possível acessar esse site.\" O servidor estava lá, inteirinho. Faltou o endereço.", expressao: "preocupado" },
      solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }, comando("cenario:dns-fora"), comando("clicar"), ...avancar(2)],
    },
    {
      id: "servidor-lento",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: escolha o servidor lento e leve a viagem até o fim. O que muda?",
        toque: "Agora sozinho: escolha o servidor lento e leve a viagem até o fim. O que muda?",
      },
      validador: { tipo: "marcoNaEstacao", estacao: "viagem", marco: "viu:servidor-lento" },
      ajudas: {
        pergunta: "O endereço chega? E o pedido? Onde ele fica parado?",
        dica: "Troque o cenário, clique no link e avance até a página. Repare na etapa a mais.",
      },
      falaAoConcluir: { texto: "Funcionou, mas o pedido ficou na fila do servidor. A página em branco e a rodinha girando: é isso.", expressao: "apontando" },
      solucaoDeTeste: [comando("cenario:servidor-lento"), comando("clicar"), ...avancar(7)],
    },
  ],
  conclusao: [
    { texto: "O DNS troca o nome pelo endereço; os roteadores passam o pedido adiante; o servidor responde.", expressao: "apontando" },
    { texto: "Quando um site não abre, agora você sabe perguntar: foi o DNS, o caminho ou o servidor?", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Num computador, abra o terminal e digite nslookup google.com (no Windows, Mac ou Linux). A resposta mostra o endereço que o DNS devolve para esse nome.",
  falaFinal: { texto: "Cada clique seu faz essa viagem inteira. Menos de um segundo, quando está tudo bem.", expressao: "feliz" },
};

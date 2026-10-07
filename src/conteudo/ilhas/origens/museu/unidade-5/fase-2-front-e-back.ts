/* Sala 5, fase 2: prever a ordem das etapas e separar o front do back, na prática. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

const ligar = (cartao: string, alvo: string) => ({ tipo: "ligarCartao", estacao: "lados", cartao, alvo }) as const;
const por = (item: string) => ({ tipo: "porNaOrdem", estacao: "etapas", item }) as const;

export const FASE_ORIGENS_U5_F2: Fase = {
  id: "origens-museu-u5-f2",
  tipo: "pratica",
  unidadeId: "origens-museu-u5",
  titulo: "Front e back",
  conceitos: ["front-e-back"],
  revisa: ["dns", "roteador"],
  prerequisitos: ["dns"],
  usaFerramentas: ["ordem-dos-cartoes", "cartoes-de-ligar"],
  siteAlvo: SITE_DO_PROGRAMA,
  areas: ["exposicao"],
  exposicao: {
    anfitriao: "internet",
    placa: {
      titulo: "A frente e os fundos",
      texto: "Front-end é o que roda no navegador, na frente de quem usa. Back-end roda no servidor, nos fundos, como a cozinha da padaria.",
    },
    falas: {
      abrir: "Vamos ver se você decorou a viagem? Põe as etapas em ordem! Eu fico aqui narrando, claro.",
      porEtapa: {
        "o-resto": "Pensa na viagem toda: pergunta, caminho, servidor, volta, página!",
        "frente-e-fundos": "Agora a padaria por dentro: o que fica no balcão e o que fica na cozinha?",
        "o-resto-dos-lados": "Dica de tia: o que precisa ser segredo ou guardado vai para os fundos!",
      },
      concluir: "Balcão e cozinha! O front mostra e pede; o back guarda, confere e calcula.",
    },
    estacoes: [
      {
        id: "etapas",
        tipo: "ordem",
        titulo: "As etapas",
        aparencia: "etapas",
        itens: [
          { id: "clique", texto: "Você clica no link", revela: "O navegador só sabe o nome do site." },
          { id: "dns", texto: "O navegador pergunta o endereço ao DNS", revela: "A lista telefônica troca o nome pelo endereço." },
          { id: "roteadores", texto: "O pedido viaja pelos roteadores", revela: "De esquina em esquina, até o servidor." },
          { id: "servidor", texto: "O servidor prepara a resposta", revela: "O back-end busca os dados e monta o que vai voltar." },
          { id: "volta", texto: "A resposta volta em pacotes", revela: "HTML, CSS e imagens, pelo caminho de volta." },
          { id: "pagina", texto: "O navegador monta a página", revela: "O front-end põe tudo na tela." },
        ],
        pontas: { inicio: "O clique", fim: "A página na tela" },
      },
      {
        id: "lados",
        tipo: "ligar",
        titulo: "Front ou back?",
        pergunta: "Na loja online da padaria, cada coisa roda onde?",
        alvos: [
          { id: "front", nome: "Front-end", descricao: "No navegador de quem compra (o balcão)" },
          { id: "back", nome: "Back-end", descricao: "No servidor da padaria (a cozinha)" },
        ],
        cartoes: [
          { id: "botao", texto: "A cor e o formato do botão Comprar", alvo: "front", revela: "É CSS: roda no navegador, como na Ilha Sites." },
          { id: "senha", texto: "Conferir se a senha está certa", alvo: "back", revela: "Nunca só no navegador: qualquer um mexe nele pelo F12." },
          { id: "estoque", texto: "Guardar quantos pães sobraram", alvo: "back", revela: "O estoque fica num banco de dados, no servidor." },
          { id: "menu", texto: "A animação do menu abrindo", alvo: "front", revela: "Roda no navegador, perto de quem toca." },
          { id: "preco", texto: "Calcular o preço final da encomenda", alvo: "back", revela: "O navegador pode mostrar a conta, mas quem vale é a do servidor." },
          { id: "endereco", texto: "O campo onde a pessoa digita o endereço", alvo: "front", revela: "É um formulário na página. O back recebe o que foi digitado." },
        ],
      },
    ],
  },
  introducao: [
    { texto: "Duas tarefas: pôr a viagem do clique em ordem e descobrir o que é front e o que é back.", expressao: "apontando" },
    { texto: "Pensa numa padaria: o balcão é o front, a cozinha é o back.", expressao: "feliz" },
  ],
  objetivos: [
    {
      id: "o-comeco",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Ponha na fila as duas primeiras etapas: o clique e a pergunta ao DNS.",
        toque: "Ponha na fila as duas primeiras etapas: o clique e a pergunta ao DNS.",
      },
      validador: { tipo: "ordemCerta", estacao: "etapas", itens: ["clique", "dns"] },
      ajudas: {
        pergunta: "Antes de levar o pedido, o navegador precisa saber o quê?",
        dica: "Primeiro o clique; logo depois, o endereço, que vem do DNS.",
        linha: { alvo: "exposicao", estacao: "etapas", peca: "clique", fala: "Comece por este cartão." },
        solucao: { fala: "Pus o clique e, depois, a pergunta ao DNS.", acoes: [por("clique"), por("dns")] },
      },
      falaAoConcluir: { texto: "Isso: sem o endereço do DNS, o pedido nem sai de casa.", expressao: "feliz" },
      solucaoDeTeste: [por("clique"), por("dns")],
    },
    {
      id: "o-resto",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: complete a viagem, até a página na tela.",
        toque: "Agora sozinho: complete a viagem, até a página na tela.",
      },
      validador: { tipo: "ordemCerta", estacao: "etapas" },
      ajudas: {
        pergunta: "O servidor responde antes ou depois de o pedido chegar?",
        dica: "Ida pelos roteadores, servidor, volta e, por último, a página montada.",
      },
      falaAoConcluir: { texto: "A viagem inteira, na ordem! Ida, servidor, volta e página.", expressao: "comemorando" },
      solucaoDeTeste: [por("roteadores"), por("servidor"), por("volta"), por("pagina")],
    },
    {
      id: "frente-e-fundos",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Leve o botão Comprar para o front e a senha para o back.",
        toque: "Leve o botão Comprar para o front e a senha para o back.",
      },
      validador: { tipo: "cartoesLigados", estacao: "lados", cartoes: ["botao", "senha"] },
      ajudas: {
        pergunta: "O que a pessoa vê na tela? E o que precisa ficar guardado longe dela?",
        dica: "A aparência do botão é do navegador. Conferir a senha é trabalho do servidor.",
        linha: { alvo: "exposicao", estacao: "lados", peca: "front", fala: "Aqui fica o que roda no navegador." },
        solucao: { fala: "Levei o botão para o front e a senha para o back.", acoes: [ligar("botao", "front"), ligar("senha", "back")] },
      },
      falaAoConcluir: { texto: "Isso! Se a senha fosse conferida no navegador, qualquer um trocava pelo F12.", expressao: "apontando" },
      solucaoDeTeste: [ligar("botao", "front"), ligar("senha", "back")],
    },
    {
      id: "o-resto-dos-lados",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Agora sozinho: separe o resto entre front e back.",
        toque: "Agora sozinho: separe o resto entre front e back.",
      },
      validador: { tipo: "cartoesLigados", estacao: "lados" },
      ajudas: {
        pergunta: "Isso aparece na tela ou precisa ser guardado e conferido?",
        dica: "Tela, animação e formulário: front. Estoque e preço que vale: back.",
      },
      falaAoConcluir: { texto: "Front e back separadinhos. Quem faz os dois é chamado de full-stack!", expressao: "comemorando" },
      solucaoDeTeste: [ligar("estoque", "back"), ligar("menu", "front"), ligar("preco", "back"), ligar("endereco", "front")],
    },
  ],
  conclusao: [
    { texto: "Front-end roda no navegador: a tela, os botões, os formulários. Back-end roda no servidor: dados, contas, regras.", expressao: "apontando" },
    { texto: "A Ilha Sites é front. A Ilha Rede e Servidor vai ser a sua primeira cozinha.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Abra um site de compras e escolha três coisas que você vê. Para cada uma, pense: isso é front (aparece e reage na tela) ou depende do back (preço, estoque, senha)?",
  falaFinal: { texto: "Balcão e cozinha. Toda loja online, todo app, tem os dois.", expressao: "feliz" },
};

/*
 * S1, Fase 2: "A descrição que convida" (Floricultura Jardim Suspenso).
 *
 * O QUE ENSINA: a meta description como o texto embaixo do título do
 * resultado; sem ela, a busca mostra um trecho qualquer; longa demais, ela
 * é cortada.
 *
 * REVISA: o título na busca (Fase 1, o title já está bom e aparece no
 * resultado) e editar atributo pela árvore (U4), para trocar o content.
 *
 * ORDEM: 1) guiado: criar a meta description no head pelo editor (o
 * trecho que a busca mostra hoje fala do tempo de casa, não da entrega);
 * 2) guiado, com previsão: o computadorzinho empolgado escreve uma
 * descrição enorme (momento roteirizado) e a previsão pergunta o que a
 * busca faz com ela; encurtar pelo content; 3) sozinho: pôr o telefone
 * na descrição sem cortar.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { FLORICULTURA_JARDIM_SUSPENSO } from "./sites/floriculturaJardimSuspenso";

const DESCRICAO = "Buquês, cestas e arranjos com entrega no mesmo dia em Olinda e Recife.";
const DESCRICAO_ENORME =
  "Somos a Floricultura Jardim Suspenso, desde 1998 no mesmo endereço, com muito carinho e flores frescas todos os dias, buquês de rosas, girassóis e orquídeas, cestas de café da manhã, arranjos para casamento, formatura e aniversário, e entrega no mesmo dia em Olinda, Recife e região.";
const DESCRICAO_CURTA = "Buquês e cestas com entrega no mesmo dia em Olinda e Recife.";
const DESCRICAO_COM_TELEFONE = "Buquês com entrega no mesmo dia em Olinda e Recife. Peça: (81) 3000-1234.";

export const FASE_S1_F2: FasePratica = {
  id: "sites-ser-encontrado-u1-f2",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u1",
  titulo: "A descrição que convida",
  conceitos: ["descricao-na-busca"],
  revisa: ["titulo-na-busca", "editar-atributo"],
  prerequisitos: ["titulo-na-busca"],
  usaFerramentas: ["resultado-busca", "arvore", "editor", "editar-duplo-clique"],
  modoDocumento: true,
  siteAlvo: FLORICULTURA_JARDIM_SUSPENSO,
  introducao: [
    { texto: "A Floricultura Jardim Suspenso já tem um bom title. Olha o resultado dela na aba Busca.", expressao: "feliz" },
    { texto: "Embaixo do título, a busca mostra \"Desde 1998...\". Quem procura flor com entrega nem lê o resto.", expressao: "pensativo" },
  ],
  objetivos: [
    {
      id: "criar-descricao",
      tipo: "acao",
      modo: "guiado",
      enunciado: {
        mouse: "Crie uma meta description no head, pelo editor de código, que fale da entrega de flores.",
        toque: "Crie uma meta description no head, pelo Código, que fale da entrega de flores.",
      },
      validador: { tipo: "resultadoBusca", campo: "descricao", contem: "entrega" },
      ajudas: {
        pergunta: "O que a busca mostra embaixo do título quando a página não tem descrição?",
        dica: "Um trecho qualquer da página. Com <meta name=\"description\" content=\"...\"> no head, o content vira o convite.",
        linha: { alvo: "editor", seletor: "title", fala: "Escreva a meta description logo depois desta linha, ainda no head." },
        solucao: {
          fala: "Escrevi a meta description depois do title: o content dela virou o texto do resultado.",
          acoes: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: `<meta name="description" content="${DESCRICAO}">` }],
        },
      },
      falaAoConcluir: { texto: "Agora o resultado fala do que a pessoa procura: flores com entrega. Isso faz clicar.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "title", posicao: "depois", html: `<meta name="description" content="${DESCRICAO}">` }],
    },
    {
      id: "descricao-sem-corte",
      tipo: "previsao",
      modo: "guiado",
      eventoAoComecar: {
        acoes: [{ tipo: "definirAtributo", seletor: 'meta[name="description"]', nome: "content", valor: DESCRICAO_ENORME }],
        fala: { texto: "Empolguei e escrevi tudo o que a floricultura faz na descrição!", expressao: "comemorando" },
      },
      previsao: {
        pergunta: "A descrição agora tem quase 300 letras. O que a busca faz com ela?",
        opcoes: ["Corta no meio, com reticências", "Mostra inteira, em várias linhas", "Esconde o resultado"],
        correta: 0,
        explicacao: "A busca tem pouco espaço (uns 150 caracteres no computador, menos no celular) e corta o resto. O começo tem que dizer o principal.",
      },
      enunciado: {
        mouse: "Encurte a descrição (o content da meta, na árvore) até caber sem corte, ainda falando da entrega.",
        toque: "Encurte a descrição (o content da meta, na árvore) até caber sem corte, ainda falando da entrega.",
      },
      validador: { tipo: "resultadoBusca", campo: "descricao", contem: "entrega", semCorte: true },
      ajudas: {
        pergunta: "O que é mais importante quem busca ler primeiro?",
        dica: "Tire o que não ajuda a decidir (o ano, os adjetivos) e deixe o que a pessoa procura: o que vende e a entrega.",
        linha: { alvo: "arvore", seletor: 'meta[name="description"]', fala: "Dois cliques no valor do content desta meta." },
        solucao: {
          fala: "Deixei só o que ajuda a decidir: o que a floricultura vende e a entrega no mesmo dia.",
          acoes: [{ tipo: "definirAtributo", seletor: 'meta[name="description"]', nome: "content", valor: DESCRICAO_CURTA }],
        },
      },
      falaAoConcluir: { texto: "Cabe inteira! Menos texto, mais convite.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 0 },
        { tipo: "definirAtributo", seletor: 'meta[name="description"]', nome: "content", valor: DESCRICAO_CURTA },
      ],
    },
    {
      id: "descricao-com-telefone",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Muita gente liga direto da busca. Ponha o telefone (81) 3000-1234 na descrição, sem ela ser cortada.",
        toque: "Muita gente liga direto da busca. Ponha o telefone (81) 3000-1234 na descrição, sem ela ser cortada.",
      },
      validador: { tipo: "resultadoBusca", campo: "descricao", contem: "3000-1234", semCorte: true },
      ajudas: {
        pergunta: "Se o telefone entrar, o que precisa sair para caber?",
        dica: "Troque o content da meta description e confira a aba Busca: sem reticências no fim, está cabendo.",
      },
      falaAoConcluir: { texto: "Descrição com o telefone, inteira. Fez sozinho!", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirAtributo", seletor: 'meta[name="description"]', nome: "content", valor: DESCRICAO_COM_TELEFONE }],
    },
  ],
  conclusao: [
    { texto: "Título e descrição: os dois textos que a pessoa lê antes de decidir entrar no site.", expressao: "comemorando" },
    { texto: "Agora, um erro que some com o site da busca inteira, sem ninguém perceber.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Num site de verdade, aperte F12, abra o head na aba Elementos e procure a meta description. Depois busque o site no Google e compare: a descrição do resultado é a mesma, ou a busca escolheu outro trecho?",
  falaFinal: { texto: "Próxima fase: o noindex esquecido.", expressao: "feliz" },
};

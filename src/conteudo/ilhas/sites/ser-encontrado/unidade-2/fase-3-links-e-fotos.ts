/*
 * S2, Fase 3: "Links e fotos que se explicam" (Livraria Página Viva).
 *
 * O QUE ENSINA: o texto do link diz para onde ele leva ("Veja o catálogo",
 * não "clique aqui"): a busca e o leitor de tela leem os links um a um,
 * fora da frase. A auditoria do Lighthouse aponta o problema.
 *
 * REVISA: o link e seu href (U4). TREINA: o alt das imagens (U4 e P1), que
 * a busca também usa para entender a foto.
 *
 * ORDEM: 1) guiado, com previsão, trocar o texto do "clique aqui"; 2)
 * sozinho, o "saiba mais" do clube de leitura (outro link, outro
 * destino); 3) sozinho, as duas fotos sem alt, a partir da auditoria.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { LIVRARIA_PAGINA_VIVA } from "./sites/livrariaPaginaViva";

const TEXTO_CATALOGO = "Veja o catálogo completo de livros";
const TEXTO_CLUBE = "Conheça o clube de leitura de quinta";

export const FASE_S2_F3: FasePratica = {
  id: "sites-ser-encontrado-u2-f3",
  tipo: "pratica",
  unidadeId: "sites-ser-encontrado-u2",
  titulo: "Links e fotos que se explicam",
  conceitos: ["texto-de-link"],
  pratica: ["imagem-alt"],
  revisa: ["link-href"],
  prerequisitos: ["link-href", "auditoria-lighthouse"],
  usaFerramentas: ["arvore", "editar-duplo-clique", "lighthouse", "adicionar-atributo"],
  siteAlvo: LIVRARIA_PAGINA_VIVA,
  introducao: [
    { texto: "A Livraria Página Viva tem links e fotos que não dizem o que são. A busca (e o leitor de tela) leem cada um deles, sozinhos.", expressao: "pensativo" },
    { texto: "Vamos usar o Lighthouse, o mesmo da unidade de Publicar, para ver o que ele acha.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "trocar-clique-aqui",
      tipo: "previsao",
      modo: "guiado",
      previsao: {
        pergunta: "Um link diz só \"clique aqui\". Lido fora da frase, o que a busca entende dele?",
        opcoes: ["Que ele leva ao catálogo de livros", "Nada: \"clique aqui\" não diz para onde vai", "Que é um anúncio"],
        correta: 1,
        explicacao: "Fora da frase, \"clique aqui\" não diz nada. O texto do link é a melhor pista do destino, para a busca e para o leitor de tela.",
      },
      enunciado: {
        mouse: "Na aba Lighthouse, analise. Depois troque o texto do link \"clique aqui\" (dois cliques na árvore) por algo que diga o destino.",
        toque: "Na aba Lighthouse, analise. Depois troque o texto do link \"clique aqui\" (toque no texto, na árvore) por algo que diga o destino.",
      },
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#link-catalogo" },
      ajudas: {
        pergunta: "Se alguém ouvisse só a lista dos links da página, entenderia para onde cada um leva?",
        dica: "Escreva no link o destino: \"Veja o catálogo completo de livros\". O texto do link é o que a busca e o leitor de tela usam.",
        linha: { alvo: "arvore", seletor: "#link-catalogo", parte: "texto", fala: "Este link diz só \"clique aqui\". Troque o texto dele." },
        solucao: {
          fala: "Troquei \"clique aqui\" por um texto que diz o destino: agora o link se explica sozinho.",
          acoes: [{ tipo: "definirTexto", seletor: "#link-catalogo", valor: TEXTO_CATALOGO }],
        },
      },
      falaAoConcluir: { texto: "O link agora diz para onde vai. E o href é o mesmo: só o texto mudou.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "responderPrevisao", opcao: 1 },
        { tipo: "definirTexto", seletor: "#link-catalogo", valor: TEXTO_CATALOGO },
      ],
    },
    {
      id: "trocar-saiba-mais",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Sobrou um link genérico, o do clube de leitura. Troque o texto dele para o Lighthouse não reclamar mais de links.",
        toque: "Sobrou um link genérico, o do clube de leitura. Troque o texto dele para o Lighthouse não reclamar mais de links.",
      },
      validador: { tipo: "semProblema", regra: "link-generico" },
      ajudas: {
        pergunta: "O que o Lighthouse diz sobre o link que sobrou?",
        dica: "Ele acha \"saiba mais\" genérico. Escreva o que a pessoa vai encontrar ao entrar no clube.",
      },
      falaAoConcluir: { texto: "Nenhum link genérico! Cada um diz o que tem do outro lado.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#link-clube", valor: TEXTO_CLUBE }],
    },
    {
      id: "alt-nas-fotos",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "As duas fotos estão sem alt. Descreva cada uma (Adicionar atributo, no menu da tag) até o Lighthouse aprovar as imagens.",
        toque: "As duas fotos estão sem alt. Descreva cada uma (Adicionar atributo, no menu da tag) até o Lighthouse aprovar as imagens.",
      },
      validador: { tipo: "semProblema", regra: "imagem-sem-alt" },
      ajudas: {
        pergunta: "O que uma pessoa que não vê a foto precisa ouvir para entender o que ela mostra?",
        dica: "Atributo alt em cada img, descrevendo a cena: quem ou o que aparece. A busca também usa esse texto para entender a foto.",
      },
      falaAoConcluir: { texto: "Fotos descritas! O alt serve a quem usa leitor de tela e ajuda a busca a entender a imagem.", expressao: "comemorando" },
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#foto-loja", nome: "alt", valor: "Estantes de madeira cheias de livros" },
        { tipo: "adicionarAtributo", seletor: "#foto-cafe", nome: "alt", valor: "Xícara de café sobre uma mesa" },
      ],
    },
  ],
  conclusao: [
    { texto: "Link que diz o destino e foto com alt: o site fica claro para quem lê, para quem ouve e para a busca.", expressao: "feliz" },
    { texto: "Falta a velocidade: uma página lenta perde gente antes de ela ver qualquer coisa.", expressao: "curioso" },
  ],
  missaoDeCampo:
    "Abra um site, aperte F12 e, na aba Elementos, procure os links (tag a). Quantos dizem só \"clique aqui\" ou \"saiba mais\"? Como você reescreveria o texto de um deles?",
  falaFinal: { texto: "Próxima fase: a página que abre rápido.", expressao: "feliz" },
};

/*
 * S2, Desafio: "Casa de Chá Lótus" (docs/MAPA-CURRICULAR.md: "uma página
 * bonita e invisível para a busca").
 *
 * Site NOVO com um problema de cada fase: o nome que é uma div (e a oferta
 * como único h1), um texto vago no lugar do preço, enchimento de
 * palavra-chave, um link "clique aqui", fotos sem alt e todas baixando de
 * uma vez. Cada parte é avaliada ao vivo.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CASA_DE_CHA_LOTUS } from "./sites/casaDeChaLotus";

export const FASE_S2_F5: FaseDesafio = {
  id: "sites-ser-encontrado-u2-f5",
  tipo: "desafio",
  unidadeId: "sites-ser-encontrado-u2",
  titulo: "Casa de Chá Lótus",
  conceitos: ["h1-da-pagina", "texto-que-responde", "enchimento-de-palavra-chave", "texto-de-link", "imagem-preguicosa"],
  revisa: [],
  prerequisitos: ["h1-da-pagina", "texto-de-link", "imagem-preguicosa"],
  usaFerramentas: ["arvore", "renomear-tag", "editar-duplo-clique", "apagar", "lighthouse", "adicionar-atributo"],
  siteAlvo: CASA_DE_CHA_LOTUS,
  introducao: [
    { texto: "A Casa de Chá Lótus é linda, mas a busca quase não a enxerga. Tem um problema de cada fase que você fez.", expressao: "pensativo" },
    { texto: "Use o Lighthouse e a árvore, sem passo a passo. Deixe a página boa para quem busca.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada coisa foi ensinada.", expressao: "apontando" },
  ],
  partes: [
    {
      id: "h1-certo",
      descricao: "O nome da casa como único h1, e a oferta da semana como h2",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "tag", seletor: "#nome", nome: "h1" },
          { tipo: "tag", seletor: "#oferta", nome: "h2" },
          { tipo: "contagem", seletor: "h1", op: "==", valor: 1 },
        ],
      },
      revisarEm: "sites-ser-encontrado-u2-f1",
      solucaoDeTeste: [
        { tipo: "renomearTag", seletor: "#nome", novaTag: "h1" },
        { tipo: "renomearTag", seletor: "#oferta", novaTag: "h2" },
      ],
    },
    {
      id: "texto-com-preco",
      descricao: "Um texto no lugar do parágrafo vago que diga preços e o que se serve",
      validador: { tipo: "textoDiferenteDoInicial", seletor: "#preco" },
      revisarEm: "sites-ser-encontrado-u2-f2",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#preco", valor: "Bule de chá com dois docinhos por R$ 32, das 9h às 19h." }],
    },
    {
      id: "sem-enchimento",
      descricao: "Nenhum parágrafo de enchimento de palavra-chave",
      validador: { tipo: "naoExiste", seletor: ".enchimento" },
      revisarEm: "sites-ser-encontrado-u2-f2",
      solucaoDeTeste: [{ tipo: "apagar", seletor: ".enchimento" }],
    },
    {
      id: "link-que-diz-destino",
      descricao: "O link do cardápio dizendo para onde vai (nada de \"clique aqui\")",
      validador: { tipo: "semProblema", regra: "link-generico" },
      revisarEm: "sites-ser-encontrado-u2-f3",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "#link-cardapio", valor: "Veja o cardápio de chás e docinhos" }],
    },
    {
      id: "fotos-com-alt",
      descricao: "Todas as fotos com alt, descrevendo o que mostram",
      validador: { tipo: "semProblema", regra: "imagem-sem-alt" },
      revisarEm: "sites-ser-encontrado-u2-f3",
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#capa", nome: "alt", valor: "Bule de chá verde e xícaras sobre a mesa" },
        { tipo: "adicionarAtributo", seletor: "#galeria-1", nome: "alt", valor: "Prato de docinhos" },
        { tipo: "adicionarAtributo", seletor: "#galeria-2", nome: "alt", valor: "Xícara de chá de hibisco" },
        { tipo: "adicionarAtributo", seletor: "#galeria-3", nome: "alt", valor: "Bandeja de chás variados" },
      ],
    },
    {
      id: "galeria-preguicosa",
      descricao: "As três fotos da galeria preguiçosas (lazy), mas a capa não",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "contagem", seletor: '.galeria img[loading="lazy"]', op: ">=", valor: 3 },
          { tipo: "nao", validador: { tipo: "atributo", seletor: "#capa", nome: "loading", valor: "lazy" } },
        ],
      },
      revisarEm: "sites-ser-encontrado-u2-f4",
      solucaoDeTeste: [
        { tipo: "adicionarAtributo", seletor: "#galeria-1", nome: "loading", valor: "lazy" },
        { tipo: "adicionarAtributo", seletor: "#galeria-2", nome: "loading", valor: "lazy" },
        { tipo: "adicionarAtributo", seletor: "#galeria-3", nome: "loading", valor: "lazy" },
      ],
    },
  ],
  conclusao: [
    { texto: "A Lótus agora tem h1, texto que responde, link claro, fotos descritas e uma página leve. Sem truque.", expressao: "comemorando" },
    { texto: "Foi tudo coisa que o programador faz dentro da página. E é o que a busca mais agradece.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pense num negócio de bairro e abra o site dele (se tiver). Aperte F12 e confira: tem um h1 só? Os links dizem o destino? As fotos têm alt? Anote o que você melhoraria primeiro.",
  falaFinal: { texto: "Unidade concluída! A próxima da zona é o seu negócio no mapa.", expressao: "comemorando" },
};

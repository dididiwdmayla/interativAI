/*
 * S5, Desafio: "Mesma verba, mais clientes" (Pet Shop Rabo Feliz, site novo,
 * modo documento; docs/MAPA-CURRICULAR.md: "a mesma verba trazendo mais
 * clientes depois de melhorar a página").
 *
 * É uma fase do tipo simulador-campanha só de sozinho (fase só de treino:
 * `conceitos` vazio e tudo em `pratica`). Não é do tipo "desafio" porque os
 * validadores do simulador (`simulacao`) só existem neste tipo de fase; por
 * isso a unidade não tem `meta.desafioId` (sem o antes e depois da meta).
 *
 * Os números foram conferidos com o motor (src/motor/campanha.ts): com a
 * página fraca, 1º lugar e R$ 90 por dia dão 1 cliente a R$ 90; com title e
 * description a nota passa de 85, mas ainda são 4 clientes a R$ 22; só com o
 * alt da foto a conta fecha (5 clientes a R$ 17,82).
 */
import type { DadosCampanha } from "@/motor/campanha";
import type { FaseSimuladorCampanha } from "@/conteudo/tipos";
import { PET_SHOP_RABO_FELIZ } from "./sites/petShopRaboFeliz";

export const CAMPANHA_S5_F4: DadosCampanha = {
  anunciante: "Pet Shop Rabo Feliz",
  palavras: [
    { id: "banho-e-tosa", texto: "banho e tosa", buscasPorDia: 1500, cpcMedio: 1.4, concorrencia: "alta" },
    { id: "veterinario-24-horas", texto: "veterinário 24 horas", buscasPorDia: 600, cpcMedio: 2, concorrencia: "alta" },
    { id: "racao-para-cachorro", texto: "ração para cachorro", buscasPorDia: 900, cpcMedio: 0.9, concorrencia: "media" },
  ],
  concorrentes: [
    { nome: "Pet Mundo", lance: 1.8, qualidade: 7 },
    { nome: "Bicho Chique", lance: 2.5, qualidade: 5 },
    { nome: "AuAu Vet", lance: 1.4, qualidade: 8 },
  ],
  orcamentoInicial: 90,
  palavraInicial: "banho-e-tosa",
  lanceInicial: 3,
};

const TITULO_E_DESCRICAO = {
  tipo: "inserirHTML" as const,
  seletor: "meta[name=viewport]",
  posicao: "depois" as const,
  html: '<title>Pet Shop Rabo Feliz | Banho e tosa em Aracaju</title>\n<meta name="description" content="Banho e tosa, ração e veterinário em Aracaju, com leva e traz. Agende pelo WhatsApp e receba o horário na hora.">',
};

export const FASE_S5_F4: FaseSimuladorCampanha = {
  id: "sites-ser-encontrado-u5-f4",
  tipo: "simulador-campanha",
  unidadeId: "sites-ser-encontrado-u5",
  titulo: "Desafio: mesma verba, mais clientes",
  conceitos: [],
  pratica: ["pagina-de-destino", "leilao-de-anuncio", "orcamento-diario"],
  revisa: [],
  prerequisitos: ["pagina-de-destino", "leilao-de-anuncio"],
  usaFerramentas: ["simulador-campanha", "lighthouse", "resultado-busca", "arvore", "editor", "adicionar-atributo"],
  modoDocumento: true,
  siteAlvo: PET_SHOP_RABO_FELIZ,
  campanha: CAMPANHA_S5_F4,
  introducao: [
    { texto: "O Pet Shop Rabo Feliz gasta R$ 90 por dia, está em 1º lugar e traz só um cliente, a R$ 90 cada.", expressao: "pensativo" },
    { texto: "Com a mesma verba, dá para trazer bem mais. Use tudo o que você viu, sem passo a passo. Lembre: o simulador é uma simplificação.", expressao: "curioso" },
  ],
  objetivos: [
    {
      id: "melhorar-a-pagina",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Melhore a página de destino do pet shop até a nota dela passar de 85 na aba Campanha.",
        toque: "Melhore a página de destino do pet shop até a nota dela passar de 85 na aba Campanha.",
      },
      validador: { tipo: "simulacao", metrica: "notaPagina", op: ">=", valor: 85 },
      ajudas: {
        pergunta: "O que o Lighthouse e a aba Busca dizem que falta nesta página?",
        dica: "Faltam title e meta description no head. Escreva os dois falando de banho e tosa e de Aracaju, sem cortar na busca.",
      },
      falaAoConcluir: { texto: "Nota lá em cima. Mas o custo por cliente ainda não fechou. O que mais a página precisa?", expressao: "pensativo" },
      solucaoDeTeste: [TITULO_E_DESCRICAO],
    },
    {
      id: "a-conta-fecha",
      tipo: "acao",
      modo: "sozinho",
      enunciado: {
        mouse: "Com a mesma verba de R$ 90: fique em 1º lugar, com 5 clientes ou mais e custo por cliente de até R$ 18.",
        toque: "Com a mesma verba de R$ 90: fique em 1º lugar, com 5 clientes ou mais e custo por cliente de até R$ 18.",
      },
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "simulacao", metrica: "posicao", op: "==", valor: 1 },
          { tipo: "simulacao", metrica: "clientes", op: ">=", valor: 5 },
          { tipo: "simulacao", metrica: "custoPorCliente", op: "<=", valor: 18 },
        ],
      },
      ajudas: {
        pergunta: "Falta alguma coisa que o Lighthouse ainda aponta, além do title e da descrição?",
        dica: "A foto está sem alt. Uma página completa converte melhor, e o custo por cliente cai com a mesma verba.",
      },
      falaAoConcluir: { texto: "Mesma verba, mais clientes, e mais baratos. Foi a página trabalhando, não um lance maior.", expressao: "comemorando" },
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".foto", nome: "alt", valor: "Cachorro tomando banho de espuma" }],
    },
  ],
  conclusao: [
    { texto: "A verba era a mesma. Quem mudou foi a página: title, descrição e alt fizeram cada clique valer mais.", expressao: "comemorando" },
    { texto: "É isso que o programador faz por um anúncio: a página de destino rápida, clara e completa faz o dinheiro render.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pense num anúncio que você já viu e na página em que ele te levou. Ela cumpriu o que o anúncio prometeu? Escreva uma mudança que faria a pessoa virar cliente.",
  falaFinal: { texto: "Zona concluída! Você viu do HTML da página ao leilão do anúncio.", expressao: "comemorando" },
};

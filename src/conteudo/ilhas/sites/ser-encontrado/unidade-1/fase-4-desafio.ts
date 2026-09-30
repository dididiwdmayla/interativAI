/*
 * S1, Desafio: "Casa de Farinha Seu Dito" (docs/MAPA-CURRICULAR.md: "a
 * página de uma loja que não aparece direito na busca").
 *
 * Site NOVO com os três problemas das fases juntos: o noindex esquecido
 * (Fase 3), o title comprido demais, cortado na busca (Fase 1), e
 * nenhuma meta description (Fase 2). Cada parte é avaliada ao vivo.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CASA_DE_FARINHA } from "./sites/casaDeFarinha";

export const FASE_S1_F4: FaseDesafio = {
  id: "sites-ser-encontrado-u1-f4",
  tipo: "desafio",
  unidadeId: "sites-ser-encontrado-u1",
  titulo: "Casa de Farinha Seu Dito",
  conceitos: ["noindex", "titulo-na-busca", "descricao-na-busca"],
  revisa: [],
  prerequisitos: ["noindex", "titulo-na-busca", "descricao-na-busca"],
  usaFerramentas: ["resultado-busca", "arvore", "apagar", "editar-duplo-clique", "editor"],
  modoDocumento: true,
  siteAlvo: CASA_DE_FARINHA,
  introducao: [
    { texto: "A Casa de Farinha Seu Dito faz a melhor farinha da região, e a busca não mostra nada dela.", expressao: "pensativo" },
    { texto: "Três problemas, dos que você já conhece. Olhe a aba Busca e o head, sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada coisa foi ensinada.", expressao: "apontando" },
  ],
  partes: [
    {
      id: "volta-pra-busca",
      descricao: "Fazer a página voltar a aparecer na busca",
      validador: { tipo: "indexavel", valor: true },
      revisarEm: "sites-ser-encontrado-u1-f3",
      solucaoDeTeste: [{ tipo: "apagar", seletor: 'meta[name="robots"]' }],
    },
    {
      id: "titulo-inteiro",
      descricao: "Um title com o nome Seu Dito que caiba inteiro, sem corte",
      validador: { tipo: "resultadoBusca", campo: "titulo", contem: "Seu Dito", semCorte: true },
      revisarEm: "sites-ser-encontrado-u1-f1",
      solucaoDeTeste: [{ tipo: "definirTexto", seletor: "title", valor: "Casa de Farinha Seu Dito | Farinha e beiju em Garanhuns" }],
    },
    {
      id: "descricao-convite",
      descricao: "Uma meta description que fale da entrega e caiba sem corte",
      validador: { tipo: "resultadoBusca", campo: "descricao", contem: "entrega", semCorte: true },
      revisarEm: "sites-ser-encontrado-u1-f2",
      solucaoDeTeste: [
        {
          tipo: "inserirHTML",
          seletor: "title",
          posicao: "depois",
          html: '<meta name="description" content="Farinha torrada no forno de lenha e beiju, com entrega em Garanhuns às sextas.">',
        },
      ],
    },
  ],
  conclusao: [
    { texto: "Na busca, a Casa de Farinha agora aparece inteira: nome, o que vende e a entrega.", expressao: "comemorando" },
    { texto: "O que você fez aqui é o básico que todo site de negócio precisa, e muita gente esquece.", expressao: "feliz" },
  ],
  missaoDeCampo:
    "Pense num pequeno negócio perto de você. Busque o nome dele no Google e olhe o resultado: o título diz o que ele faz? A descrição convida? Se o site existir, abra o F12 e veja o title e a meta description no head.",
  falaFinal: { texto: "Unidade concluída! A próxima da zona é o SEO dentro da página.", expressao: "comemorando" },
};

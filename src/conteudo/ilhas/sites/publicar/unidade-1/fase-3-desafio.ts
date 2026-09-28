/*
 * P1, Desafio: "Livraria Capítulo Final" (docs/MAPA-CURRICULAR.md: "levar
 * um site de nota baixa a nota alta").
 *
 * Site NOVO com os quatro problemas das fases 1 e 2 juntos: imagem sem
 * alt, título pulando nível, texto de pouco contraste e um botão só com
 * ícone. A última parte confere a nota final de Acessibilidade.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { LIVRARIA_CAPITULO_FINAL } from "./sites/livrariaCapituloFinal";

export const FASE_P1_F3: FaseDesafio = {
  id: "sites-publicar-u1-f3",
  tipo: "desafio",
  unidadeId: "sites-publicar-u1",
  titulo: "Livraria Capítulo Final",
  conceitos: ["auditoria-lighthouse", "rotulo-acessivel"],
  revisa: [],
  prerequisitos: ["auditoria-lighthouse", "imagem-alt", "titulos-hierarquia", "contraste-de-cor", "rotulo-acessivel"],
  usaFerramentas: ["lighthouse", "arvore", "painel-estilos", "editar-valor-css", "renomear-tag", "adicionar-atributo"],
  paineisElementos: ["estilos"],
  siteAlvo: LIVRARIA_CAPITULO_FINAL,

  introducao: [
    { texto: "A Livraria Capítulo Final tem nota baixa de Acessibilidade: quatro problemas, dos que você já conhece.", expressao: "feliz" },
    { texto: "Analise, ache cada um e conserte, sem passo a passo desta vez.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada tipo de problema foi ensinado.", expressao: "apontando" },
  ],

  partes: [
    {
      id: "alt-da-foto",
      descricao: "Acrescentar um alt na foto da livraria",
      validador: { tipo: "semProblema", regra: "imagem-sem-alt" },
      revisarEm: "sites-publicar-u1-f1",
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".foto-livraria", nome: "alt", valor: "Estante de livros da Livraria Capítulo Final" }],
    },
    {
      id: "titulo-sem-pular",
      descricao: "Consertar o título \"Lançamentos da semana\", que pula de h1 para h3",
      validador: { tipo: "semProblema", regra: "titulos-pulando-nivel" },
      revisarEm: "sites-publicar-u1-f2",
      solucaoDeTeste: [{ tipo: "renomearTag", seletor: "h3", novaTag: "h2" }],
    },
    {
      id: "contraste-do-aviso",
      descricao: "Escurecer o aviso de promoção, que está com pouco contraste",
      validador: { tipo: "semProblema", regra: "contraste" },
      revisarEm: "sites-publicar-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso-promocao", propriedade: "color", valor: "white" }],
    },
    {
      id: "botao-comprar-com-nome",
      descricao: "Dar um nome acessível ao botão de comprar, que só tem um ícone",
      validador: { tipo: "semProblema", regra: "botao-sem-texto" },
      revisarEm: "sites-publicar-u1-f2",
      solucaoDeTeste: [{ tipo: "adicionarAtributo", seletor: ".botao-comprar", nome: "aria-label", valor: "Comprar O Farol Distante" }],
    },
    {
      id: "nota-alta",
      descricao: "Analisar de novo: Acessibilidade 90 ou mais",
      validador: { tipo: "todos", validadores: [{ tipo: "evento", evento: "auditou" }, { tipo: "notaAuditoria", categoria: "acessibilidade", minimo: 90 }] },
      revisarEm: "sites-publicar-u1-f1",
      solucaoDeTeste: [{ tipo: "analisarAuditoria" }],
    },
  ],

  conclusao: [
    { texto: "De nota baixa a Acessibilidade 90+! A livraria está pronta para qualquer visitante.", expressao: "comemorando" },
    { texto: "Zona Publicar quase completa: falta só levar um site seu de verdade pro mundo.", expressao: "feliz" },
  ],
  missaoDeCampo: "Escolha um site de uma loja pequena e rode o Lighthouse de verdade nele: quantos problemas de acessibilidade ele tem?",
  falaFinal: { texto: "Última unidade da Ilha Sites: publicar o seu próprio site de verdade.", expressao: "feliz" },
};

/*
 * R2, Desafio: "Restaurante Sabor da Vila" (docs/MAPA-CURRICULAR.md:
 * "deixar o site de um restaurante bom no celular com media queries").
 *
 * Site NOVO, escrito desktop first de propósito (como o Estúdio Passo
 * Leve da Fase 1, não como a Verde Vivo da Fase 2): o jogador acrescenta
 * a @media que falta, empilha o cabeçalho, ajusta o cardápio para uma
 * coluna e torna a foto responsiva — tudo sem passo a passo.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { RESTAURANTE_SABOR_DA_VILA } from "./sites/restauranteSaborDaVila";

export const FASE_R2_F3: FaseDesafio = {
  id: "sites-responsivo-u2-f3",
  tipo: "desafio",
  unidadeId: "sites-responsivo-u2",
  titulo: "Restaurante Sabor da Vila",
  conceitos: ["media-query", "imagem-responsiva"],
  revisa: [],
  prerequisitos: ["media-query", "breakpoint", "imagem-responsiva"],
  usaFerramentas: ["modo-dispositivo", "painel-estilos", "editar-valor-css", "editor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: RESTAURANTE_SABOR_DA_VILA,

  introducao: [
    { texto: "O Sabor da Vila está lindo no computador, mas ainda não foi pensado para o celular.", expressao: "feliz" },
    { texto: "Sem passo a passo: use tudo que você aprendeu sobre @media e imagem responsiva.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada técnica foi ensinada.", expressao: "apontando" },
  ],

  partes: [
    {
      id: "cabecalho-empilha",
      descricao: "Acrescentar uma @media: no Celular 390, o cabeçalho (.cabecalho) empilha em vez de ficar lado a lado",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "temMediaQuery", minimo: 1 },
          { tipo: "valorEfetivo", seletor: ".cabecalho", propriedade: "flex-direction", valor: "column", larguraTela: 390 },
        ],
      },
      revisarEm: "sites-responsivo-u2-f1",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cabecalho {\n    flex-direction: column;\n  }\n}\n" }],
    },
    {
      id: "cardapio-uma-coluna",
      descricao: "No Celular 390, o cardápio (.cardapio) vira uma coluna só",
      validador: { tipo: "valorEfetivo", seletor: ".cardapio", propriedade: "grid-template-columns", valor: "1fr", larguraTela: 390 },
      revisarEm: "sites-responsivo-u2-f1",
      solucaoDeTeste: [{ tipo: "editarCss", posicao: "fim", texto: "\n@media (max-width: 600px) {\n  .cardapio {\n    grid-template-columns: 1fr;\n  }\n}\n" }],
    },
    {
      id: "foto-responsiva",
      descricao: "A foto do salão (.foto-salao) nunca estoura a tela, em nenhuma largura",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "declaracao", seletorRegra: ".foto-salao", propriedade: "max-width", valor: "100%" },
          { tipo: "declaracao", seletorRegra: ".foto-salao", propriedade: "height", valor: "auto" },
        ],
      },
      revisarEm: "sites-responsivo-u2-f2",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".foto-salao", propriedade: "max-width", valor: "100%" },
        { tipo: "definirPropriedade", seletorRegra: ".foto-salao", propriedade: "height", valor: "auto" },
      ],
    },
  ],

  conclusao: [
    { texto: "O Sabor da Vila está pronto para receber visitas do celular: cabeçalho, cardápio e foto, tudo ajustado.", expressao: "comemorando" },
    { texto: "Zona Responsivo completa! Você já sabe ver, diagnosticar e consertar qualquer site para qualquer tela.", expressao: "feliz" },
  ],
  missaoDeCampo: "Escolha um restaurante de verdade e confira o site dele no modo dispositivo: o cardápio cabe bem no celular?",
  falaFinal: { texto: "Próxima parada: Acessibilidade e Lighthouse, a última zona da Ilha Sites.", expressao: "feliz" },
};

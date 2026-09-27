/*
 * L4, Desafio: "Confeitaria Doce Instante".
 *
 * O QUE PRATICA: os cinco valores de position e z-index da unidade, num
 * site NOVO (uma confeitaria, não a loja de vinil), sem passo a passo.
 *
 * PARTES: selo sobre o card (relative no pai + absolute no selo, Fases 1
 * e 2); cabeçalho fixo de verdade pedido no mapa curricular vira sticky
 * (Fase 3, o valor certo para um cabeçalho que precisa continuar no fluxo
 * até a rolagem chegar nele); botão flutuante fixed (Fase 3); e o conflito
 * de sobreposição com z-index (Fase 3).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { CONFEITARIA_DOCE_INSTANTE } from "./sites/confeitariaDoceInstante";

export const FASE_L4_F4: FaseDesafio = {
  id: "sites-layout-u4-f4",
  tipo: "desafio",
  unidadeId: "sites-layout-u4",
  titulo: "Confeitaria Doce Instante",
  conceitos: ["position-relative", "position-absolute", "position-fixed", "position-sticky", "z-index-css"],
  revisa: [],
  prerequisitos: ["position-relative", "position-absolute", "position-fixed", "position-sticky", "z-index-css"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: CONFEITARIA_DOCE_INSTANTE,

  introducao: [
    {
      texto: "Hora do desafio final da zona Layout! A Confeitaria Doce Instante quer um selo destacado e um cabeçalho que acompanha a rolagem.",
      expressao: "feliz",
    },
    {
      texto: "Tudo com position e z-index, sem passo a passo. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva para a fase onde aquilo foi ensinado. Bora terminar essa zona com chave de ouro?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "card-vira-ancora-bolo",
      descricao: "Fazer o card do bolo virar a âncora do selo, com position: relative",
      validador: { tipo: "valorEfetivo", seletor: ".card-bolo", propriedade: "position", valor: "relative" },
      revisarEm: "sites-layout-u4-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".card-bolo", propriedade: "position", valor: "relative" }],
    },
    {
      id: "selo-sobre-o-card",
      descricao: "Grudar o selo Mais vendido no canto do card com position: absolute",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".selo-bolo", propriedade: "position", valor: "absolute" },
          { tipo: "valorEfetivo", seletor: ".selo-bolo", propriedade: "top", valor: "8px" },
          { tipo: "valorEfetivo", seletor: ".selo-bolo", propriedade: "right", valor: "8px" },
        ],
      },
      revisarEm: "sites-layout-u4-f2",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".selo-bolo", propriedade: "position", valor: "absolute" },
        { tipo: "definirPropriedade", seletorRegra: ".selo-bolo", propriedade: "top", valor: "8px" },
        { tipo: "definirPropriedade", seletorRegra: ".selo-bolo", propriedade: "right", valor: "8px" },
      ],
    },
    {
      id: "selo-por-cima-da-fita-bolo",
      descricao: "Fazer o selo Mais vendido ficar por cima da fita Só hoje com z-index",
      validador: { tipo: "valorEfetivo", seletor: ".selo-bolo", propriedade: "z-index", valor: "2" },
      revisarEm: "sites-layout-u4-f3",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".selo-bolo", propriedade: "z-index", valor: "2" }],
    },
    {
      id: "cabecalho-acompanha-rolagem",
      descricao: "Fazer o cabeçalho acompanhar a rolagem, grudando no topo com position: sticky",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: "#topo-confeitaria", propriedade: "position", valor: "sticky" },
          { tipo: "valorEfetivo", seletor: "#topo-confeitaria", propriedade: "top", valor: "0" },
        ],
      },
      revisarEm: "sites-layout-u4-f3",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: "#topo-confeitaria", propriedade: "position", valor: "sticky" },
        { tipo: "definirPropriedade", seletorRegra: "#topo-confeitaria", propriedade: "top", valor: "0" },
      ],
    },
    {
      id: "botao-flutuante",
      descricao: "Deixar o botão de WhatsApp flutuando no canto da tela com position: fixed",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".whatsapp", propriedade: "position", valor: "fixed" },
          { tipo: "valorEfetivo", seletor: ".whatsapp", propriedade: "bottom", valor: "16px" },
          { tipo: "valorEfetivo", seletor: ".whatsapp", propriedade: "right", valor: "16px" },
        ],
      },
      revisarEm: "sites-layout-u4-f3",
      solucaoDeTeste: [
        { tipo: "definirPropriedade", seletorRegra: ".whatsapp", propriedade: "position", valor: "fixed" },
        { tipo: "definirPropriedade", seletorRegra: ".whatsapp", propriedade: "bottom", valor: "16px" },
        { tipo: "definirPropriedade", seletorRegra: ".whatsapp", propriedade: "right", valor: "16px" },
      ],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! A confeitaria ganhou um selo em destaque, cabeçalho grudento e um botão de WhatsApp sempre à mão.",
      expressao: "comemorando",
    },
    {
      texto: "relative, absolute, fixed, sticky e z-index: os cinco fecham a zona Layout inteira. Você já pensa em camadas como um dev de verdade!",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Escolha um site de verdade e, pelo F12, ache um botão flutuante ou um cabeçalho grudento: veja se é fixed ou sticky.",
  falaFinal: { texto: "Zona Layout completa! Próxima parada: Responsivo.", expressao: "feliz" },
};

/*
 * E3, Desafio: "Barbearia Corte Certo".
 *
 * O QUE PRATICA: as quatro camadas do modelo de caixa juntas, sem passo a
 * passo, num site NOVO (uma barbearia, não a confeitaria) — "consertar
 * cards espremidos", exatamente como o mapa curricular descreve.
 *
 * COMO AS PARTES FORAM ESCOLHIDAS: uma por camada, cada uma apontando
 * (revisarEm) pra fase onde ela foi ensinada guiada:
 * - padding nos planos: Fase 1;
 * - border nos planos: Fase 1;
 * - margin entre os planos: Fase 2;
 * - box-sizing no banner de promoção (a mesma armadilha do bloco do
 *   WhatsApp): Fase 2.
 *
 * VALIDADORES: valorEfetivo em tudo, com o atalho border conferindo as
 * três propriedades longas de uma vez.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { BARBEARIA_CORTE_CERTO } from "./sites/barbeariaCorteCerto";

export const FASE_E3_F3: FaseDesafio = {
  id: "sites-estilos-u3-f3",
  tipo: "desafio",
  unidadeId: "sites-estilos-u3",
  titulo: "Barbearia Corte Certo",
  conceitos: ["padding-css", "border-css", "margin-css", "box-sizing"],
  revisa: [],
  prerequisitos: ["modelo-de-caixa", "padding-css", "border-css", "margin-css", "box-sizing"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "inspecionar", "painel-estilos", "editar-valor-css", "painel-calculado", "modelo-de-caixa", "nova-regra"],
  paineisElementos: ["estilos", "calculado"],
  siteAlvo: BARBEARIA_CORTE_CERTO,

  introducao: [
    { texto: "Hora do desafio! Os planos da Barbearia Corte Certo estão espremidos, colados uns nos outros.", expressao: "feliz" },
    { texto: "Use as quatro camadas do modelo de caixa pra consertar tudo, sem passo a passo.", expressao: "curioso" },
    { texto: "Travou? O Rever te leva pra fase onde aquela camada foi ensinada. Bora dar um respiro nesses cards?", expressao: "apontando" },
  ],

  partes: [
    {
      id: "respiro-nos-planos",
      descricao: "Dar um padding de 16px a todos os planos",
      validador: { tipo: "valorEfetivo", seletor: ".plano", propriedade: "padding", valor: "16px" },
      revisarEm: "sites-estilos-u3-f1",
      solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ".plano", declaracoes: [{ propriedade: "padding", valor: "16px" }] }],
    },
    {
      id: "moldura-nos-planos",
      descricao: "Dar uma moldura de 2px solid #2a6f97 a todos os planos",
      validador: {
        tipo: "todos",
        validadores: [
          { tipo: "valorEfetivo", seletor: ".plano", propriedade: "border-width", valor: "2px" },
          { tipo: "valorEfetivo", seletor: ".plano", propriedade: "border-style", valor: "solid" },
          { tipo: "valorEfetivo", seletor: ".plano", propriedade: "border-color", valor: "#2a6f97" },
        ],
      },
      revisarEm: "sites-estilos-u3-f1",
      solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ".plano", declaracoes: [{ propriedade: "border", valor: "2px solid #2a6f97" }] }],
    },
    {
      id: "espaco-entre-planos",
      descricao: "Afastar os planos um do outro com um margin-bottom de 16px",
      validador: { tipo: "valorEfetivo", seletor: ".plano", propriedade: "margin-bottom", valor: "16px" },
      revisarEm: "sites-estilos-u3-f2",
      solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ".plano", declaracoes: [{ propriedade: "margin-bottom", valor: "16px" }] }],
    },
    {
      id: "banner-nao-estoura",
      descricao: "Consertar o banner de promoção (largura 100% com padding) pra não estourar a página",
      validador: { tipo: "valorEfetivo", seletor: ".banner-promocao", propriedade: "box-sizing", valor: "border-box" },
      revisarEm: "sites-estilos-u3-f2",
      solucaoDeTeste: [{ tipo: "adicionarRegra", seletorRegra: ".banner-promocao", declaracoes: [{ propriedade: "box-sizing", valor: "border-box" }] }],
    },
  ],

  conclusao: [
    { texto: "Desafio vencido! Os planos ganharam respiro e moldura, e o banner parou de estourar a página.", expressao: "comemorando" },
    { texto: "Padding, border, margin e box-sizing: agora você lê e mexe no modelo de caixa de qualquer site.", expressao: "feliz" },
  ],

  missaoDeCampo:
    "Num site de verdade, ache um card espremido no F12 e use o diagrama da aba Computed pra decidir se falta padding, border ou margin.",

  falaFinal: { texto: "Zona Estilos, três de quatro! Na próxima: por que a sua regra às vezes não pega.", expressao: "feliz" },
};

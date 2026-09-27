/*
 * L1, Desafio: "Oficina Conserta Tudo".
 *
 * O QUE PRATICA: os três valores de display ensinados, num site NOVO (uma
 * oficina mecânica, não a papelaria), sem passo a passo.
 *
 * PARTES (uma por habilidade, cada uma apontando para a fase guiada):
 * - aviso de garantia em linha própria: display: block (Fase 1);
 * - menu de serviços lado a lado: display: inline-block (Fase 2);
 * - promoção vencida sumindo de vez, sem deixar buraco: display: none
 *   (Fase 3, a mesma revisão de Esconder x none).
 *
 * VALIDADORES: valorEfetivo em tudo (o resultado, por qualquer caminho:
 * painel, editor CSS ou regra nova).
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { OFICINA_CONSERTA_TUDO } from "./sites/oficinaConsertaTudo";

export const FASE_L1_F4: FaseDesafio = {
  id: "sites-layout-u1-f4",
  tipo: "desafio",
  unidadeId: "sites-layout-u1",
  titulo: "Oficina Conserta Tudo",
  conceitos: ["display-block", "display-inline-block", "display-none"],
  revisa: ["esconder-elemento"],
  prerequisitos: ["display-block", "display-inline-block", "display-none"],
  usaFerramentas: ["painel", "previa", "me-ajuda", "tutor", "arvore", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  siteAlvo: OFICINA_CONSERTA_TUDO,

  introducao: [
    {
      texto: "Hora do desafio! A Oficina Conserta Tudo precisa de um menu horizontal e de dois avisos arrumados.",
      expressao: "feliz",
    },
    {
      texto: "Tudo pelo display, sem passo a passo. O checklist marca cada parte sozinho quando você fizer.",
      expressao: "curioso",
    },
    {
      texto: "Travou? O botão Rever te leva para a fase onde aquilo foi ensinado. Bora deixar essa oficina em ordem?",
      expressao: "apontando",
    },
  ],

  partes: [
    {
      id: "garantia-em-linha-propria",
      descricao: "Fazer o aviso de garantia (.aviso-garantia) ocupar a linha própria",
      validador: { tipo: "valorEfetivo", seletor: ".aviso-garantia", propriedade: "display", valor: "block" },
      revisarEm: "sites-layout-u1-f1",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".aviso-garantia", propriedade: "display", valor: "block" }],
    },
    {
      id: "menu-servicos-horizontal",
      descricao: "Deixar os itens do menu de serviços lado a lado",
      validador: { tipo: "valorEfetivo", seletor: "#menu-servicos li", propriedade: "display", valor: "inline-block" },
      revisarEm: "sites-layout-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: "#menu-servicos li", propriedade: "display", valor: "inline-block" }],
    },
    {
      id: "promocao-vencida-sumir",
      descricao: "Fazer a promoção vencida sumir de vez, sem deixar buraco na página",
      validador: { tipo: "valorEfetivo", seletor: ".promo-vencida", propriedade: "display", valor: "none" },
      revisarEm: "sites-layout-u1-f3",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".promo-vencida", propriedade: "display", valor: "none" }],
    },
  ],

  conclusao: [
    {
      texto: "Desafio vencido! A oficina ganhou um menu horizontal e os avisos certos, cada um com o display certo.",
      expressao: "comemorando",
    },
    {
      texto: "block, inline-block e none: as três ferramentas mais usadas de layout antes do flexbox. E ele vem já!",
      expressao: "feliz",
    },
  ],
  missaoDeCampo:
    "Escolha um site de verdade e, pelo F12, ache um menu horizontal: veja se os itens usam inline-block ou outra técnica.",
  falaFinal: { texto: "Zona Layout começou com tudo! Na próxima unidade: flexbox.", expressao: "feliz" },
};

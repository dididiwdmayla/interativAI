/*
 * R1, Desafio: "Academia Corpo em Movimento" (site novo).
 *
 * O QUE PRATICA: diagnosticar três problemas de celular sem passo a
 * passo (docs/MAPA-CURRICULAR.md: "diagnosticar três problemas no
 * celular"), com o modo dispositivo já ligado desde o início da fase.
 *
 * OS TRÊS PROBLEMAS: falta o meta viewport (Fase 2); a foto do salão com
 * largura fixa de 600px, maior que os 390px do Celular 390 (Fase 2, o
 * banner de 500px); a caixa de horários com 500px de largura, mesma
 * confusão, peça diferente.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { ACADEMIA_CORPO_EM_MOVIMENTO } from "./sites/academiaCorpoEmMovimento";

export const FASE_R1_F3: FaseDesafio = {
  id: "sites-responsivo-u1-f3",
  tipo: "desafio",
  unidadeId: "sites-responsivo-u1",
  titulo: "Academia Corpo em Movimento",
  conceitos: ["meta-viewport", "modo-dispositivo"],
  revisa: [],
  prerequisitos: ["meta-viewport", "modo-dispositivo", "simulacao-sem-viewport"],
  usaFerramentas: ["modo-dispositivo", "editor", "painel-estilos", "editar-valor-css"],
  paineisElementos: ["estilos"],
  modoDocumento: true,
  siteAlvo: ACADEMIA_CORPO_EM_MOVIMENTO,

  introducao: [
    { texto: "Desafio da Responsivo! A Academia Corpo em Movimento tem TRÊS problemas escondidos no celular.", expressao: "feliz" },
    { texto: "Ligue o modo dispositivo no Celular 390 e comece a procurar. Sem passo a passo desta vez.", expressao: "curioso" },
    { texto: "Travou? O Rever leva de volta para a fase onde cada tipo de problema foi ensinado.", expressao: "apontando" },
  ],

  partes: [
    {
      id: "meta-viewport",
      descricao: "Acrescentar o meta viewport, que está faltando",
      validador: { tipo: "existe", seletor: 'meta[name="viewport"]' },
      revisarEm: "sites-responsivo-u1-f2",
      solucaoDeTeste: [{ tipo: "inserirHTML", seletor: "head", posicao: "fim", html: '<meta name="viewport" content="width=device-width, initial-scale=1">' }],
    },
    {
      id: "foto-cabe",
      descricao: "Diminuir a foto (.foto-academia), que estoura a largura do Celular 390",
      validador: { tipo: "valorEfetivo", seletor: ".foto-academia", propriedade: "width", valor: "360px", larguraTela: 390 },
      revisarEm: "sites-responsivo-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".foto-academia", propriedade: "width", valor: "360px" }],
    },
    {
      id: "caixa-horarios-cabe",
      descricao: "Diminuir a caixa de horários (.caixa-horarios), também maior que a tela",
      validador: { tipo: "valorEfetivo", seletor: ".caixa-horarios", propriedade: "width", valor: "340px", larguraTela: 390 },
      revisarEm: "sites-responsivo-u1-f2",
      solucaoDeTeste: [{ tipo: "definirPropriedade", seletorRegra: ".caixa-horarios", propriedade: "width", valor: "340px" }],
    },
  ],

  conclusao: [
    { texto: "Três problemas achados e consertados! A academia já pode receber visitas do celular.", expressao: "comemorando" },
    { texto: "Você diagnosticou do mesmo jeito que faria num site de verdade: ligando o modo dispositivo e procurando o que estoura.", expressao: "feliz" },
  ],
  missaoDeCampo: "Escolha um site de verdade, ligue o modo dispositivo no F12 num celular e procure algo que estoure a largura da tela (rola de lado sem querer).",
  falaFinal: { texto: "Zona Responsivo, primeira unidade concluída! Na próxima: as media queries, que ajustam o layout de verdade.", expressao: "feliz" },
};

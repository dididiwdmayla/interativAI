/*
 * Revisão: cor hexadecimal (E1, Fase 3).
 *
 * Ação: escrever uma cor que não tem nome (só o #RRGGBB serve); previsão: ler os
 * canais de um hexadecimal.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_COR_HEXADECIMAL: ItemRevisao[] = [
  {
    id: "cor-hexadecimal-1",
    conceito: "cor-hexadecimal",
    tipo: "acao",
    enunciado: {
      mouse: "Pinte o selo com o verde-água #2a9d8f, escrito em hexadecimal.",
      toque: "Pinte o selo com o verde-água #2a9d8f, escrito em hexadecimal.",
    },
    siteAlvo: {
      url: "aguacristalina.exemplo",
      titulo: "Água Cristalina",
      head: HEAD_CSS,
      body: '<p class="selo">Entrega grátis</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.selo {
  font-weight: bold;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "color", valor: "#2a9d8f" },
    ajudas: {
      pergunta: "Como se escreve uma cor que não tem nome?",
      dica: "Com # e seis dígitos: #2a9d8f. Acrescente color na regra .selo.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "definirPropriedade", seletorRegra: ".selo", propriedade: "color", valor: "#2a9d8f" },
    ],
  },
  {
    id: "cor-hexadecimal-2",
    conceito: "cor-hexadecimal",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando o valor da cor.",
      toque: "Responda olhando o valor da cor.",
    },
    siteAlvo: {
      url: "papeldeparede.exemplo",
      titulo: "Papel de Parede Sol",
      head: HEAD_CSS,
      body: '<p class="faixa">Coleção nova</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.faixa {
  color: white;
  background-color: #0000ff;
}
`,
    },
    previsao: {
      pergunta: "Em #0000ff, os pares são vermelho, verde e azul. Qual está no máximo (ff)?",
      opcoes: ["O verde", "O vermelho", "O azul"],
      correta: 2,
      explicacao: "As cores vêm em três pares: vermelho, verde e azul, de 00 (nada) a ff (tudo). Só o último está cheio: azul.",
    },
    ajudas: {
      pergunta: "Em #RRGGBB, o último par é qual cor?",
      dica: "Azul: R é vermelho, G verde, B azul.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 2 }],
  },
];

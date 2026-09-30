/*
 * Revisão: position absolute (L4, Fase 2).
 *
 * Ação: colar uma etiqueta no canto da foto (o pai já é relative); previsão: em quem
 * ela se ancora.
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_POSITION_ABSOLUTE: ItemRevisao[] = [
  {
    id: "position-absolute-1",
    conceito: "position-absolute",
    tipo: "acao",
    enunciado: {
      mouse: "Cole a etiqueta no canto de cima à direita da foto: position: absolute, top: 0 e right: 0.",
      toque: "Cole a etiqueta no canto de cima à direita da foto: position: absolute, top: 0 e right: 0.",
    },
    siteAlvo: {
      url: "fotografiadaiane.exemplo",
      titulo: "Fotografia Daiane",
      head: HEAD_CSS,
      body: `<div class="foto">
  <span class="etiqueta">Novo</span>
  <p>Ensaio de família</p>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.foto {
  position: relative;
  width: 220px;
  height: 120px;
  background-color: #cbd5f5;
}

.etiqueta {
  background-color: #ffe08a;
  padding: 2px 8px;
}
`,
    },
    validador: {
      tipo: "todos",
      validadores: [
        { tipo: "valorEfetivo", seletor: ".etiqueta", propriedade: "position", valor: "absolute" },
        { tipo: "valorEfetivo", seletor: ".etiqueta", propriedade: "top", valor: "0" },
        { tipo: "valorEfetivo", seletor: ".etiqueta", propriedade: "right", valor: "0" },
      ],
    },
    ajudas: {
      pergunta: "A etiqueta precisa sair do fluxo e se ancorar na foto. Qual position faz isso?",
      dica: "absolute, com top: 0 e right: 0. A foto já é relative.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".etiqueta" },
      { tipo: "definirPropriedade", seletorRegra: ".etiqueta", propriedade: "position", valor: "absolute" },
      { tipo: "definirPropriedade", seletorRegra: ".etiqueta", propriedade: "top", valor: "0" },
      { tipo: "definirPropriedade", seletorRegra: ".etiqueta", propriedade: "right", valor: "0" },
    ],
  },
  {
    id: "position-absolute-2",
    conceito: "position-absolute",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando as duas regras.",
      toque: "Responda olhando as duas regras.",
    },
    siteAlvo: {
      url: "casadocafe.exemplo",
      titulo: "Casa do Café",
      head: HEAD_CSS,
      body: `<div class="caixa">
  <span class="selo">Novo</span>
</div>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}
.caixa {
  position: relative;
  height: 100px;
  background-color: #ffe9c7;
}

.selo {
  position: absolute;
  bottom: 0;
  left: 0;
}
`,
    },
    previsao: {
      pergunta: "O .selo é absolute com bottom: 0 e left: 0, dentro de uma .caixa relative. Onde ele fica?",
      opcoes: ["No canto de baixo à esquerda da página", "No canto de baixo à esquerda da caixa", "No lugar de sempre, no fluxo"],
      correta: 1,
      explicacao: "O absolute tira a peça do fluxo e a posiciona a partir do ancestral mais próximo com position diferente de static: aqui, a caixa.",
    },
    ajudas: {
      pergunta: "A quem o absolute se ancora?",
      dica: "Ao ancestral mais perto que tenha position diferente de static.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 1 }],
  },
];

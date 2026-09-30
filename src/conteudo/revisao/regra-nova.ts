/*
 * Revisão: regra nova (E1, Fase 3).
 *
 * Ação: criar a regra de uma peça que nenhuma regra pega; previsão: o que faz uma
 * regra pegar a peça (o seletor).
 */
import type { ItemRevisao } from "../tipos";
import { HEAD_CSS } from "./sites/estilos";

export const ITENS_REGRA_NOVA: ItemRevisao[] = [
  {
    id: "regra-nova-1",
    conceito: "regra-nova",
    tipo: "acao",
    enunciado: {
      mouse: "O .selo não tem regra. Crie uma regra .selo com color: crimson.",
      toque: "O .selo não tem regra. Crie uma regra .selo com color: crimson.",
    },
    siteAlvo: {
      url: "mercearianovaera.exemplo",
      titulo: "Mercearia Nova Era",
      head: HEAD_CSS,
      body: `<p class="selo">Produto novo</p>
<p class="aviso">Volto já</p>`,
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: gray;
}
`,
    },
    validador: { tipo: "valorEfetivo", seletor: ".selo", propriedade: "color", valor: "crimson" },
    ajudas: {
      pergunta: "O que é preciso para estilizar uma peça que nenhuma regra pega?",
      dica: "Uma regra nova com o seletor dela: .selo. No painel Estilos, use o + de regra nova.",
    },
    solucaoDeTeste: [
      { tipo: "selecionar", seletor: ".selo" },
      { tipo: "adicionarRegra", seletorRegra: ".selo", declaracoes: [{"propriedade":"color","valor":"crimson"}] },
    ],
  },
  {
    id: "regra-nova-2",
    conceito: "regra-nova",
    tipo: "previsao",
    enunciado: {
      mouse: "Responda olhando a folha.",
      toque: "Responda olhando a folha.",
    },
    siteAlvo: {
      url: "lojadapraca.exemplo",
      titulo: "Loja da Praça",
      head: HEAD_CSS,
      body: '<p class="promo">Liquidação!</p>',
      css: `body {
  font-family: system-ui, sans-serif;
  margin: 16px;
}

.aviso {
  color: gray;
}
`,
    },
    previsao: {
      pergunta: "Nenhuma regra pega o .promo. O que você faz para estilizar ele?",
      opcoes: ["Cria uma regra com o seletor .promo", "Muda a tag do HTML", "Espera o navegador estilizar"],
      correta: 0,
      explicacao: "Toda regra começa pelo seletor. Sem regra que pegue a peça, você cria uma com o seletor dela e escreve as declarações.",
    },
    ajudas: {
      pergunta: "O que numa regra diz QUEM ela pega?",
      dica: "O seletor, antes das chaves. Para o .promo, um seletor .promo.",
    },
    solucaoDeTeste: [{ tipo: "responderPrevisao", opcao: 0 }],
  },
];

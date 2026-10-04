/* Duas previsões por conceito: ItemRevisao não aceita quadro nem áreas compostas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RESOLVER_U4: ItemRevisao[] = [
  {
    "id": "casos-de-borda-1",
    "conceito": "casos-de-borda",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "function maior(a) { let m=0; for(const n of a) if(n>m)m=n; return m; } Qual quebra?",
      "opcoes": [
        "[2,8]",
        "[-8,-3]",
        "[0]"
      ],
      "correta": 1,
      "explicacao": "Começar em zero perde o maior quando todos são negativos."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Testar vazio, zero, repetido e negativo para expor regras que um caso comum não verifica."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "casos-de-borda-2",
    "conceito": "casos-de-borda",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Uma função remove repetidos. Qual entrada verifica essa regra?",
      "opcoes": [
        "[]",
        "[1,2]",
        "[2,2]"
      ],
      "correta": 2,
      "explicacao": "O caso precisa conter valores repetidos para exercitar a regra."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Testar vazio, zero, repetido e negativo para expor regras que um caso comum não verifica."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

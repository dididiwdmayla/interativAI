/* Duas previsões por conceito: ItemRevisao não aceita quadro nem áreas compostas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RESOLVER_U3: ItemRevisao[] = [
  {
    "id": "dependencias-passos-1",
    "conceito": "dependencias-passos",
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
      "pergunta": "const area = largura * altura vem antes das declarações. Resultado?",
      "opcoes": [
        "Zero",
        "Um número correto",
        "ReferenceError"
      ],
      "correta": 2,
      "explicacao": "largura e altura ainda não existem."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Executar cada passo depois dos dados de que ele precisa, aceitando ordens independentes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "dependencias-passos-2",
    "conceito": "dependencias-passos",
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
      "pergunta": "Ler largura e altura antes de multiplicar: qual leitura vem primeiro?",
      "opcoes": [
        "Ambas as ordens valem",
        "Largura sempre",
        "Altura sempre"
      ],
      "correta": 0,
      "explicacao": "Só a multiplicação depende das duas leituras."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Executar cada passo depois dos dados de que ele precisa, aceitando ordens independentes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];

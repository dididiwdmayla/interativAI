/* Duas situações novas por conceito; cenas e composição não são aceitas em ItemRevisao. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ESTRUTURAS_U2: readonly ItemRevisao[] = [
  {
    "id": "fila-js-1",
    "conceito": "fila-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Numa fila, o primeiro item que entrou sai primeiro; push entra pelo fim e shift sai pelo começo."
    },
    "previsao": {
      "pergunta": "Uma impressora recebeu [\"capa\",\"miolo\",\"contracapa\"]. Quem sai no shift?",
      "opcoes": [
        "capa",
        "contracapa",
        "miolo"
      ],
      "correta": 0,
      "explicacao": "A capa entrou primeiro."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "fila-js-2",
    "conceito": "fila-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Numa fila, o primeiro item que entrou sai primeiro; push entra pelo fim e shift sai pelo começo."
    },
    "previsao": {
      "pergunta": "Uma fila de senhas faz push(8), push(9), pop(). Qual confusão aconteceu?",
      "opcoes": [
        "Nada: FIFO",
        "Saiu 8",
        "Saiu o último, como pilha"
      ],
      "correta": 2,
      "explicacao": "pop retirou 9 pelo mesmo lado da entrada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "fila-por-indice-1",
    "conceito": "fila-por-indice",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Para atender uma lista grande, avançar um índice preserva a ordem sem deslocar todos os vagões a cada shift."
    },
    "previsao": {
      "pergunta": "Um caixa atende 1.000 pedidos com shift. Além da linha escrita, o que trabalha?",
      "opcoes": [
        "Só o último pedido",
        "Os itens que deslizam a cada retirada",
        "Nada"
      ],
      "correta": 1,
      "explicacao": "O trabalho escondido inclui mover os itens restantes."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "fila-por-indice-2",
    "conceito": "fila-por-indice",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado neste novo contexto.",
      "toque": "Preveja o resultado neste novo contexto."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "Qual regra decide a resposta?",
      "dica": "Para atender uma lista grande, avançar um índice preserva a ordem sem deslocar todos os vagões a cada shift."
    },
    "previsao": {
      "pergunta": "Um atendente lê lista[inicio] e faz inicio++. O que mudou na lista?",
      "opcoes": [
        "Os vagões ficaram; mudou o índice",
        "Todos deslizaram",
        "O último sumiu"
      ],
      "correta": 0,
      "explicacao": "O índice avança sem remover os vagões; a lista ainda ocupa memória."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];

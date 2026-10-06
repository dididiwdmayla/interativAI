/* Duas situações por conceito. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U1: readonly ItemRevisao[] = [
  {
    "id": "dicionario-de-erros-1",
    "conceito": "dicionario-de-erros",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Falta fechar o parêntese: a escrita é inválida."
    },
    "previsao": {
      "pergunta": "const x = (7 * 2; Que erro impede a execução?",
      "opcoes": [
        "TypeError",
        "ReferenceError",
        "SyntaxError"
      ],
      "correta": 2,
      "explicacao": "Falta fechar o parêntese: a escrita é inválida."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "dicionario-de-erros-2",
    "conceito": "dicionario-de-erros",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "O nome troco não está disponível."
    },
    "previsao": {
      "pergunta": "console.log(troco) sem declarar troco gera qual erro?",
      "opcoes": [
        "ReferenceError",
        "SyntaxError",
        "TypeError"
      ],
      "correta": 0,
      "explicacao": "O nome troco não está disponível."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "causa-do-erro-1",
    "conceito": "causa-do-erro",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Na última volta, nomes[i] é undefined; o limite permite ir além do fim."
    },
    "previsao": {
      "pergunta": "for (let i=0; i<=nomes.length; i++) nomes[i].toUpperCase(); Onde investigar primeiro?",
      "opcoes": [
        "O texto de cada nome",
        "O limite do laço",
        "O teclado"
      ],
      "correta": 1,
      "explicacao": "Na última volta, nomes[i] é undefined; o limite permite ir além do fim."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "causa-do-erro-2",
    "conceito": "causa-do-erro",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "codigo só existe dentro do bloco; a leitura de fora revela essa causa."
    },
    "previsao": {
      "pergunta": "if (true) { let codigo=9; } console.log(codigo); Onde está a causa?",
      "opcoes": [
        "No console.log sempre",
        "No número 9",
        "No alcance da declaração"
      ],
      "correta": 2,
      "explicacao": "codigo só existe dentro do bloco; a leitura de fora revela essa causa."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

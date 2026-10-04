/* Duas previsões por conceito em situações próprias; não exigem ferramentas além do Console. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_ALGORITMOS_U1: readonly ItemRevisao[] = [
  {
    "id": "busca-linear-1",
    "conceito": "busca-linear",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Olhar um item por vez até achar o alvo ou chegar ao fim da lista."
    },
    "previsao": {
      "pergunta": "Uma agenda tem [5, 2, 8]. Olhando desde o início, quantas comparações até o 8?",
      "opcoes": [
        "1",
        "3",
        "2"
      ],
      "correta": 1,
      "explicacao": "São três leituras: 5, 2 e 8."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "busca-linear-2",
    "conceito": "busca-linear",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Olhar um item por vez até achar o alvo ou chegar ao fim da lista."
    },
    "previsao": {
      "pergunta": "Na lista de senhas [6,6,4], a busca linear que retorna o primeiro índice acha 6 onde?",
      "opcoes": [
        "0",
        "1",
        "-1"
      ],
      "correta": 0,
      "explicacao": "Ela para na primeira posição, índice 0."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "busca-binaria-1",
    "conceito": "busca-binaria",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Numa lista ordenada, comparar o meio e descartar a metade que não pode conter o alvo."
    },
    "previsao": {
      "pergunta": "Num catálogo ordenado [1,3,5,7,9], o alvo é 9 e o meio é 5. Qual lado pode ser descartado?",
      "opcoes": [
        "Direita",
        "Nenhum",
        "Esquerda e o meio"
      ],
      "correta": 2,
      "explicacao": "Todos os valores à esquerda são menores que 9."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "busca-binaria-2",
    "conceito": "busca-binaria",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Numa lista ordenada, comparar o meio e descartar a metade que não pode conter o alvo."
    },
    "previsao": {
      "pergunta": "Uma reserva ordenada tem um único código 12. Qual busca por 12 termina após uma comparação?",
      "opcoes": [
        "Apenas linear",
        "Ambas",
        "Nenhuma"
      ],
      "correta": 1,
      "explicacao": "No único vagão, o meio também é o começo."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "lista-ordenada-1",
    "conceito": "lista-ordenada",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Manter os valores em ordem para que a busca binária possa descartar uma metade com segurança."
    },
    "previsao": {
      "pergunta": "As etiquetas são [40,10,30]. A busca binária por 40 descarta a esquerda ao ler 10. O que faltou?",
      "opcoes": [
        "Ordenar antes",
        "Usar texto",
        "Mais memória"
      ],
      "correta": 0,
      "explicacao": "40 está à esquerda do meio: a lista sem ordem quebra a regra."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "lista-ordenada-2",
    "conceito": "lista-ordenada",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia o caso e escolha sua previsão.",
      "toque": "Leia o caso e escolha sua previsão."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que muda com essa entrada?",
      "dica": "Manter os valores em ordem para que a busca binária possa descartar uma metade com segurança."
    },
    "previsao": {
      "pergunta": "As poltronas têm [2,2,5,8]. Repetidos impedem a busca binária?",
      "opcoes": [
        "Sim, sempre",
        "Só se forem números",
        "Não, a ordem crescente continua"
      ],
      "correta": 2,
      "explicacao": "Repetidos são permitidos; a sequência não diminui."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U2_F2: Fase = {
  "id": "logica-algoritmos-essenciais-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u2",
  "titulo": "Vizinhos fora de ordem",
  "conceitos": [
    "ordenacao-bolha"
  ],
  "revisa": [
    "ordenacao-selecao",
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
    "ordenacao-selecao",
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "algoritmo.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "A bolha compara vizinhos: se o da esquerda for maior, troca. Uma passada leva o maior ao fim.",
      "expressao": "apontando"
    },
    {
      "texto": "bolha(lista) também altera e devolve a lista recebida. Repita passadas encurtando o fim.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "bolha-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Faça uma passada comparando vizinhos. bolha([3,2]) deve devolver [2,3].",
        "toque": "Faça uma passada comparando vizinhos. bolha([3,2]) deve devolver [2,3]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "bolha",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": []
              },
              {
                "args": [
                  [
                    3,
                    2
                  ]
                ],
                "esperado": [
                  2,
                  3
                ]
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "desestruturacao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Compare lista[j] com lista[j+1] e troque se a esquerda for maior.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Compare lista[j] com lista[j+1] e troque se a esquerda for maior."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function bolha(lista) {\n  for (let j = 0; j < lista.length - 1; j++) {\n    if (lista[j] > lista[j + 1]) [lista[j], lista[j + 1]] = [lista[j + 1], lista[j]];\n  }\n  return lista;\n}\nconst pesos = [3,2];\nbolha(pesos);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function bolha(lista) {\n  for (let j = 0; j < lista.length - 1; j++) {\n    if (lista[j] > lista[j + 1]) [lista[j], lista[j + 1]] = [lista[j + 1], lista[j]];\n  }\n  return lista;\n}\nconst pesos = [3,2];\nbolha(pesos);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "bolha-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Complete as passadas: [3,2,1] vira [1,2,3]. Trate vazio, repetidos e lista já ordenada.",
        "toque": "Complete as passadas: [3,2,1] vira [1,2,3]. Trate vazio, repetidos e lista já ordenada."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "bolha",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": []
              },
              {
                "args": [
                  [
                    7
                  ]
                ],
                "esperado": [
                  7
                ]
              },
              {
                "args": [
                  [
                    3,
                    1,
                    3
                  ]
                ],
                "esperado": [
                  1,
                  3,
                  3
                ]
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                "esperado": [
                  1,
                  2,
                  3
                ]
              },
              {
                "args": [
                  [
                    10,
                    9,
                    1
                  ]
                ],
                "esperado": [
                  1,
                  9,
                  10
                ]
              },
              {
                "args": [
                  [
                    -2,
                    0,
                    -5
                  ]
                ],
                "esperado": [
                  -5,
                  -2,
                  0
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "pesos",
            "valor": [
              1,
              2,
              3
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Depois de uma passada, o maior está no fim; faça outra sem revisitá-lo."
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function bolha(lista) {\n  for (let fim = lista.length - 1; fim > 0; fim--) {\n    for (let j = 0; j < fim; j++) {\n      if (lista[j] > lista[j + 1]) [lista[j], lista[j + 1]] = [lista[j + 1], lista[j]];\n    }\n  }\n  return lista;\n}\nconst pesos = [3,2,1];\nbolha(pesos);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Uma única passada da esquerda para a direita em [3,2,1] termina como?",
        "opcoes": [
          "[2,1,3]",
          "[1,2,3]",
          "[3,1,2]"
        ],
        "correta": 0,
        "explicacao": "Troca 3 com 2, depois 3 com 1. O 3 chega ao fim; ainda falta trocar 2 com 1."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "O mesmo JavaScript funciona no Console real. Aqui o palco deixa acompanhar cada passo.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, rode [10, 9, 1].sort(); depois [10, 9, 1].sort((a, b) => a - b). Compare as duas ordens.",
  "falaFinal": {
    "texto": "Experimente outra entrada e confira o caminho.",
    "expressao": "feliz"
  }
};

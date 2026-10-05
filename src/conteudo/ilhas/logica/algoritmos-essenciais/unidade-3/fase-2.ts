/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U3_F2: Fase = {
  "id": "logica-algoritmos-essenciais-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u3",
  "titulo": "Avançar pela lista",
  "conceitos": [
    "problema-menor-recursao"
  ],
  "revisa": [
    "recursao-js",
    "caso-base-recursao",
    "array-js",
    "indice-lista-js",
    "return-js",
    "funcao-js"
  ],
  "prerequisitos": [
    "recursao-js",
    "caso-base-recursao",
    "array-js",
    "indice-lista-js",
    "return-js",
    "funcao-js"
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
      "texto": "somaRec(lista, indice=0) soma números. O índice começa em 0; a próxima chamada avança uma posição.",
      "expressao": "apontando"
    },
    {
      "texto": "Quando indice chega a length, devolva 0. Sem avançar o índice, até uma lista de um item recorre para sempre.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "lista-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Comece somaRec com indice=0: em [] devolva 0; em [6] devolva 6.",
        "toque": "Comece somaRec com indice=0: em [] devolva 0; em [6] devolva 6."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "somaRec",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    6
                  ]
                ],
                "esperado": 6
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "O caso de parada verifica indice>=lista.length antes de ler o vagão.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O caso de parada verifica indice>=lista.length antes de ler o vagão."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function somaRec(lista, indice = 0) {\n  if (indice >= lista.length) return 0;\n  return lista[indice];\n}\nconst pontos = [6];\nconst soma = somaRec(pontos);"
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
          "codigo": "function somaRec(lista, indice = 0) {\n  if (indice >= lista.length) return 0;\n  return lista[indice];\n}\nconst pontos = [6];\nconst soma = somaRec(pontos);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "lista-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Some o item atual com a chamada do próximo índice. Confira vazio, um item, repetidos e negativos.",
        "toque": "Some o item atual com a chamada do próximo índice. Confira vazio, um item, repetidos e negativos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "somaRec",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    6
                  ]
                ],
                "esperado": 6
              },
              {
                "args": [
                  [
                    2,
                    2,
                    5
                  ]
                ],
                "esperado": 9
              },
              {
                "args": [
                  [
                    -3,
                    0,
                    4
                  ]
                ],
                "esperado": 1
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 9
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Devolva lista[indice] + somaRec(lista,indice+1)."
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
          "codigo": "function somaRec(lista, indice = 0) {\n  if (indice >= lista.length) return 0;\n  return lista[indice] + somaRec(lista, indice + 1);\n}\nconst pontos = [2,2,5];\nconst soma = somaRec(pontos);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Se a chamada usar indice em vez de indice+1, o que acontece em [6]?",
        "opcoes": [
          "Lê o mesmo item sem chegar à parada",
          "Devolve 6 uma vez",
          "Pula o item"
        ],
        "correta": 0,
        "explicacao": "O índice não avança; o problema não fica menor e a proteção corta."
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

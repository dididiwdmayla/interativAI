/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U2_F3: Fase = {
  "id": "logica-algoritmos-essenciais-u2-f3",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u2",
  "titulo": "O sort compara texto",
  "conceitos": [
    "sort-numerico"
  ],
  "revisa": [
    "ordenacao-selecao",
    "ordenacao-bolha",
    "arrow-js",
    "array-js",
    "return-js"
  ],
  "prerequisitos": [
    "ordenacao-selecao",
    "ordenacao-bolha",
    "arrow-js",
    "array-js",
    "return-js"
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
      "texto": "No JavaScript real, sort() sem comparador trata números como textos. \"10\" vem antes de \"9\".",
      "expressao": "apontando"
    },
    {
      "texto": "O comparador (a,b) => a-b é negativo quando a deve vir antes de b. Use uma cópia se não quiser mudar a original.",
      "expressao": "apontando"
    },
    {
      "texto": "Por que aprender seleção e bolha? Para entender o custo e escolher quando usar o sort pronto. Ele não custa zero passos.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "sort-padrao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Preveja e rode no Console: const errado = [10,9,1].sort().",
        "toque": "Preveja e rode no Console: const errado = [10,9,1].sort()."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "errado",
            "valor": [
              1,
              10,
              9
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:sort"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Rode sort sem argumentos e olhe a ordem dos vagões.",
        "linha": {
          "alvo": "console",
          "fala": "Escreva o comando no Console."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "const errado = [10,9,1].sort();"
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
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "const errado = [10,9,1].sort();"
        }
      ],
      "previsao": {
        "pergunta": "Qual lista [10,9,1].sort() devolve?",
        "opcoes": [
          "[10,9,1]",
          "[1,9,10]",
          "[1,10,9]"
        ],
        "correta": 2,
        "explicacao": "Sem comparador, a ordem é de texto: \"1\", \"10\", \"9\"."
      }
    },
    {
      "id": "sort-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie numerica(lista): devolva uma cópia ordenada com sort e comparador. A original [20,3,11] deve continuar igual.",
        "toque": "Crie numerica(lista): devolva uma cópia ordenada com sort e comparador. A original [20,3,11] deve continuar igual."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "numerica",
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
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:sort"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "valorVariavel",
            "nome": "original",
            "valor": [
              20,
              3,
              11
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "ordenada",
            "valor": [
              3,
              11,
              20
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Copie com [...lista] e passe (a,b) => a-b para sort."
      },
      "falaAoConcluir": {
        "texto": "O sort pronto é útil; entender as trocas ajuda a avaliar o trabalho que fica escondido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function numerica(lista) {\n  return [...lista].sort((a, b) => a - b);\n}\nconst original = [20,3,11];\nconst ordenada = numerica(original);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
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

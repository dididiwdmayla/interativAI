/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U2_F1: Fase = {
  "id": "logica-algoritmos-essenciais-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u2",
  "titulo": "A vitrine por preço",
  "conceitos": [
    "ordenacao-selecao"
  ],
  "revisa": [
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
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
    "linha-do-tempo",
    "cena",
    "ficha-dispositivo",
    "velocidade-simulacao"
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
      "texto": "Na vitrine da feira, organize os preços em ordem crescente. selecao(lista) muda a lista recebida e devolve essa mesma lista.",
      "expressao": "apontando"
    },
    {
      "texto": "A seleção acha o menor do trecho restante, troca com o início dele e avança uma posição.",
      "expressao": "apontando"
    },
    {
      "texto": "Na linha do tempo, a leitura acende o vagão. A troca [lista[i],lista[j]] = [lista[j],lista[i]] acende os dois.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "selecao-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ache o menor e troque com o primeiro. Ordene [9,1]; mostre MENOR 1 no painel.",
        "toque": "Ache o menor e troque com o primeiro. Ordene [9,1]; mostre MENOR 1 no painel."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "selecao",
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
                    9,
                    1
                  ]
                ],
                "esperado": [
                  1,
                  9
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
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "MENOR 1"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Guarde o índice do menor em menor; depois troque os dois vagões.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Guarde o índice do menor em menor; depois troque os dois vagões."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function selecao(lista) {\n  if (lista.length < 2) return lista;\n  let menor = 0;\n  for (let j = 1; j < lista.length; j++) {\n    if (lista[j] < lista[menor]) menor = j;\n  }\n  [lista[0], lista[menor]] = [lista[menor], lista[0]];\n  return lista;\n}\nconst precos = [9,1];\nselecao(precos);\npainel.mostrar(\"MENOR \" + precos[0]);"
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
          "codigo": "function selecao(lista) {\n  if (lista.length < 2) return lista;\n  let menor = 0;\n  for (let j = 1; j < lista.length; j++) {\n    if (lista[j] < lista[menor]) menor = j;\n  }\n  [lista[0], lista[menor]] = [lista[menor], lista[0]];\n  return lista;\n}\nconst precos = [9,1];\nselecao(precos);\npainel.mostrar(\"MENOR \" + precos[0]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "selecao-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Repita a seleção para cada posição. Ordene [10,9,1]; mostre MENOR 1, inclusive com bordas passando.",
        "toque": "Repita a seleção para cada posição. Ordene [10,9,1]; mostre MENOR 1, inclusive com bordas passando."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "selecao",
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
            "nome": "precos",
            "valor": [
              1,
              9,
              10
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "MENOR 1"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "O laço externo fixa i; o interno busca o menor entre i+1 e o fim."
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function selecao(lista) {\n  for (let i = 0; i < lista.length - 1; i++) {\n    let menor = i;\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[j] < lista[menor]) menor = j;\n    }\n    if (menor !== i) [lista[i], lista[menor]] = [lista[menor], lista[i]];\n  }\n  return lista;\n}\nconst precos = [10,9,1];\nselecao(precos);\npainel.mostrar(\"MENOR \" + precos[0]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Após só a primeira troca da seleção em [10,9,1], qual é a lista?",
        "opcoes": [
          "[1,10,9]",
          "[1,9,10]",
          "[10,1,9]"
        ],
        "correta": 1,
        "explicacao": "O menor é 1 no índice 2. Troca com o 10; o restante ainda precisa de seleção."
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
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "cena": {
    "id": "algoritmos-cena-u2",
    "titulo": "Vitrine da feira",
    "ambiente": "feira",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "parede",
        "x": 0,
        "y": 0
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150,
        "variante": "madeira"
      },
      {
        "peca": "balcao",
        "x": 35,
        "y": 100
      },
      {
        "peca": "planta",
        "x": 275,
        "y": 115
      },
      {
        "peca": "prateleira",
        "x": 48,
        "y": 73,
        "variante": "potes"
      },
      {
        "peca": "vitrine",
        "x": 24,
        "y": 65
      }
    ],
    "dispositivos": [
      {
        "id": "painel",
        "nome": "Painel do resultado",
        "tipo": "letreiro",
        "x": 170,
        "y": 35
      }
    ],
    "linhaDoTempo": []
  }
};

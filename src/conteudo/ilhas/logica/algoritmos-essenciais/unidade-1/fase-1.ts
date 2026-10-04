/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U1_F1: Fase = {
  "id": "logica-algoritmos-essenciais-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u1",
  "titulo": "A encomenda na prateleira",
  "conceitos": [
    "busca-linear"
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
    "velocidade-simulacao",
    "contador-passos"
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
      "texto": "A prateleira guarda códigos na ordem de chegada. localizar(lista, alvo) devolve o primeiro índice; se não achar, -1.",
      "expressao": "apontando"
    },
    {
      "texto": "Cada leitura lista[i] acende um vagão no palco. Volte pela linha do tempo para ver a busca.",
      "expressao": "apontando"
    },
    {
      "texto": "O painel recebe texto com painel.mostrar(texto); ele anuncia a posição da encomenda.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "ficha",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Abra a ficha do painel e descubra mostrar(texto).",
        "toque": "Abra a ficha do painel e descubra mostrar(texto)."
      },
      "validador": {
        "tipo": "evento",
        "evento": "abriuFicha"
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Toque no painel da cena para ler os comandos.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "ficha-dispositivo",
          "fala": "O painel fica acima da prateleira."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "abrirFicha",
              "dispositivo": "painel"
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
          "tipo": "abrirFicha",
          "dispositivo": "painel"
        }
      ],
      "apresentar": [
        "ficha-dispositivo"
      ]
    },
    {
      "id": "linear-guiado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Preveja; escreva localizar com for e return. Ache o 7 e mostre POS 2 no painel.",
        "toque": "Preveja; escreva localizar com for e return. Ache o 7 e mostre POS 2 no painel."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "localizar",
            "casos": [
              {
                "args": [
                  [
                    2,
                    4,
                    7,
                    9
                  ],
                  7
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    8
                  ],
                  8
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "POS 2"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Compare lista[i] com alvo; se forem iguais, devolva i.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Compare lista[i] com alvo; se forem iguais, devolva i."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return 0;\n}\nconst encomendas = [2, 4, 7, 9];\nconst posicao = localizar(encomendas, 7);\npainel.mostrar(\"POS \" + posicao);"
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
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return 0;\n}\nconst encomendas = [2, 4, 7, 9];\nconst posicao = localizar(encomendas, 7);\npainel.mostrar(\"POS \" + posicao);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Quantas comparações até o 7 em [2, 4, 7, 9], parando ao achar?",
        "opcoes": [
          "1",
          "4",
          "3"
        ],
        "correta": 2,
        "explicacao": "Você olha 2, 4 e 7. O contador do jogo conta linhas, não só comparações."
      },
      "apresentar": [
        "contador-passos"
      ]
    },
    {
      "id": "linear-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Agora devolva -1 se não achar, inclusive em []. Em [9,2,9,7], ache o primeiro 9 e mostre POS 0.",
        "toque": "Agora devolva -1 se não achar, inclusive em []. Em [9,2,9,7], ache o primeiro 9 e mostre POS 0."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "localizar",
            "casos": [
              {
                "args": [
                  [],
                  7
                ],
                "esperado": -1
              },
              {
                "args": [
                  [
                    9
                  ],
                  9
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    9,
                    2,
                    9,
                    7
                  ],
                  9
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ],
                  8
                ],
                "esperado": -1
              }
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "POS 0"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "A ausência só está confirmada depois do laço. O primeiro return encerra a função."
      },
      "falaAoConcluir": {
        "texto": "A busca linear aceita qualquer ordem e para no primeiro encontro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return -1;\n}\nconst encomendas = [9, 2, 9, 7];\nconst posicao = localizar(encomendas, 9);\nconst ausente = localizar(encomendas, 5);\npainel.mostrar(\"POS \" + posicao);"
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
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "cena": {
    "id": "algoritmos-cena-u1",
    "titulo": "Retirada de encomendas",
    "ambiente": "deposito",
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
        "peca": "prateleira",
        "x": 35,
        "y": 100
      },
      {
        "peca": "planta",
        "x": 275,
        "y": 115
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
  },
  "apresentar": [
    "cena",
    "velocidade-simulacao"
  ]
};

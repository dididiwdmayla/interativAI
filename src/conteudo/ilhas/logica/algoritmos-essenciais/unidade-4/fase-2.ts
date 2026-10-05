/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U4_F2: Fase = {
  "id": "logica-algoritmos-essenciais-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u4",
  "titulo": "Pares que não precisam voltar",
  "conceitos": [
    "evitar-trabalho-repetido"
  ],
  "revisa": [
    "crescimento-dos-passos",
    "custo-em-passos",
    "busca-binaria",
    "lista-ordenada",
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
    "crescimento-dos-passos",
    "custo-em-passos",
    "busca-binaria",
    "lista-ordenada",
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
    "contador-passos",
    "grafico-passos"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "algoritmo.js",
      "codigoInicial": ""
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "lento"
        },
        {
          "nome": "conferir"
        }
      ],
      "tamanhos": [
        10,
        100,
        1000
      ],
      "lista": "crescente"
    }
  },
  "introducao": [
    {
      "texto": "Os códigos continuam ordenados. conferir(lista) deve encontrar repetidos sem comparar cada par.",
      "expressao": "apontando"
    },
    {
      "texto": "Comece pelos dois primeiros; depois avance comparando vizinhos. Com 1.000 códigos, caiba em 20.000 passos.",
      "expressao": "apontando"
    },
    {
      "texto": "O jogo limita cada execução a 100 mil passos ou 1,5 s. Esse freio mantém a aba viva; você vai melhorar o algoritmo.",
      "expressao": "apontando"
    },
    {
      "texto": "O gráfico conta código instrumentado. Métodos nativos escondem trabalho interno; não conclua que sort custa zero só pelo contador.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "limite-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode uma contagem até 200.000 e observe o freio do jogo.",
        "toque": "Rode uma contagem até 200.000 e observe o freio do jogo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "erroDoTipo",
            "nome": "Parada do jogo"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Mesmo tendo um fim, a contagem passa do limite de trabalho do jogo.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Mesmo tendo um fim, a contagem passa do limite de trabalho do jogo."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let voltas = 0;\nwhile (voltas < 200000) {\n  voltas++;\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O jogo cortou a execução. Ter um fim não garante que o trabalho caiba no limite.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let voltas = 0;\nwhile (voltas < 200000) {\n  voltas++;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "vizinho-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie conferir: em [] false; em [4,4] true. Compare os dois primeiros vizinhos.",
        "toque": "Crie conferir: em [] false; em [4,4] true. Compare os dois primeiros vizinhos."
      },
      "validador": {
        "tipo": "funcaoPassa",
        "nome": "conferir",
        "casos": [
          {
            "args": [
              []
            ],
            "esperado": false
          },
          {
            "args": [
              [
                4,
                4
              ]
            ],
            "esperado": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Se length<2 não há par; senão compare as posições 0 e 1.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Se length<2 não há par; senão compare as posições 0 e 1."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function lento(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[i] === lista[j]) return true;\n    }\n  }\n  return false;\n}\nfunction conferir(lista) {\n  if (lista.length < 2) return false;\n  return lista[0] === lista[1];\n}\nconst repetido = conferir([4,4]);"
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
          "codigo": "function lento(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[i] === lista[j]) return true;\n    }\n  }\n  return false;\n}\nfunction conferir(lista) {\n  if (lista.length < 2) return false;\n  return lista[0] === lista[1];\n}\nconst repetido = conferir([4,4]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "eficiente-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Complete todos os vizinhos. Trate as bordas e caiba em 20.000 passos com 1.000 códigos ordenados.",
        "toque": "Complete todos os vizinhos. Trate as bordas e caiba em 20.000 passos com 1.000 códigos ordenados."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "conferir",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    8
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    2,
                    2,
                    3
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8,
                    8
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    -2,
                    -2,
                    0
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    1,
                    1
                  ]
                ],
                "esperado": true
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "passosNoMaximo",
            "valor": 20000,
            "tamanho": 1000,
            "funcao": "conferir"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Comece i em 1, compare com i-1 e pare ao encontrar iguais."
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
          "codigo": "function lento(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[i] === lista[j]) return true;\n    }\n  }\n  return false;\n}\nfunction conferir(lista) {\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] === lista[i - 1]) return true;\n  }\n  return false;\n}\nconst repetido = conferir([1,3,8,8]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Por que comparar apenas vizinhos é seguro aqui?",
        "opcoes": [
          "Porque há poucos pedidos",
          "Porque a lista já está ordenada",
          "Porque todo número é positivo"
        ],
        "correta": 1,
        "explicacao": "Na lista ordenada, valores iguais ficam juntos. Sem essa garantia, precisaria de outro jeito."
      }
    },
    {
      "id": "comparar-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Use Medir outra vez e compare conferir com lento.",
        "toque": "Use Medir outra vez e compare conferir com lento."
      },
      "validador": {
        "tipo": "evento",
        "evento": "mediuDesempenho"
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "As duas funções recebem listas de 10, 100 e 1.000 valores distintos."
      },
      "falaAoConcluir": {
        "texto": "Menos passos não bastam: o resultado precisa passar nos casos de borda também.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "medirDesempenho"
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

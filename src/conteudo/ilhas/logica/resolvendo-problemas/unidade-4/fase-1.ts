/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U4_F1: Fase = {
  "id": "logica-resolvendo-problemas-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-resolvendo-problemas-u4",
  "titulo": "Maior venda do dia",
  "conceitos": [
    "casos-de-borda"
  ],
  "revisa": [
    "funcao-js",
    "return-js",
    "array-js",
    "objeto-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
  ],
  "prerequisitos": [
    "funcao-js",
    "return-js",
    "array-js",
    "objeto-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
  ],
  "usaFerramentas": [
    "quadro-de-passos",
    "plano-no-codigo",
    "snippet",
    "console",
    "palco-memoria",
    "linha-do-tempo",
    "casos-de-teste"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "introducao": [
    {
      "texto": "vendas é uma lista de valores, incluindo estornos negativos. Devolva o maior; sem vendas devolva 0. [-5, -2] dá -2; [4, 4] dá 4.",
      "expressao": "apontando"
    },
    {
      "texto": "Defina os dados e a resposta. Monte o plano, leve os comentários ao código e confira seus próprios exemplos.",
      "expressao": "apontando"
    }
  ],
  "conclusao": [
    {
      "texto": "Entender, decompor, planejar, programar e testar: guarde esse caminho.",
      "expressao": "apontando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, some gastos: defina entrada/saída, agrupe, escreva o plano em comentários, faça a função e teste [], [0] e [3, 3].",
  "falaFinal": {
    "texto": "Confira as bordas antes de seguir.",
    "expressao": "apontando"
  },
  "areas": [
    "plano",
    "snippet",
    "palco",
    "testes"
  ],
  "plano": {
    "modo": "ordenar",
    "problema": "Maior venda do dia",
    "cartoes": [
      {
        "id": "vazia",
        "texto": "Se a lista estiver vazia, devolver zero"
      },
      {
        "id": "primeira",
        "texto": "Começar com a primeira venda",
        "depoisDe": [
          "vazia"
        ]
      },
      {
        "id": "olhar",
        "texto": "Comparar cada venda com a maior",
        "depoisDe": [
          "primeira"
        ]
      },
      {
        "id": "atualizar",
        "texto": "Se for maior, guardar a venda",
        "depoisDe": [
          "olhar"
        ]
      },
      {
        "id": "devolver",
        "texto": "Devolver a maior venda",
        "depoisDe": [
          "atualizar"
        ]
      },
      {
        "id": "sobra",
        "texto": "Começar o código sem conferir a pergunta",
        "sobra": true
      }
    ]
  },
  "testes": {
    "funcao": "maiorVenda",
    "parametros": [
      "vendas"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "maiorVenda.js",
      "codigoInicial": ""
    }
  },
  "objetivos": [
    {
      "id": "plano-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha o primeiro passo no plano.",
        "toque": "Ponha o primeiro passo no plano."
      },
      "validador": {
        "tipo": "passoNoPlano",
        "passo": "vazia"
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa.",
        "linha": {
          "alvo": "ordenar",
          "fala": "Resolva uma parte por vez e confira o que ela usa."
        },
        "solucao": {
          "fala": "Uma parte resolvida; agora confira a próxima.",
          "acoes": [
            {
              "tipo": "porPasso",
              "passo": "vazia"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "vazia"
        }
      ]
    },
    {
      "id": "plano-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Complete o plano pelas dependências. Deixe a distração fora.",
        "toque": "Complete o plano pelas dependências. Deixe a distração fora."
      },
      "validador": {
        "tipo": "ordemValida"
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa."
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "primeira"
        },
        {
          "tipo": "porPasso",
          "passo": "olhar"
        },
        {
          "tipo": "porPasso",
          "passo": "atualizar"
        },
        {
          "tipo": "porPasso",
          "passo": "devolver"
        }
      ]
    },
    {
      "id": "levar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Use Levar pro código para guardar o plano como comentários.",
        "toque": "Use Levar pro código para guardar o plano como comentários."
      },
      "validador": {
        "tipo": "planoComentado"
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa.",
        "linha": {
          "alvo": "ordenar",
          "fala": "Resolva uma parte por vez e confira o que ela usa."
        },
        "solucao": {
          "fala": "Uma parte resolvida; agora confira a próxima.",
          "acoes": [
            {
              "tipo": "levarPlanoProCodigo"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode uma primeira versão com maior = 0. [8,3] dá 8. Vamos procurar uma entrada que quebre.",
        "toque": "Rode uma primeira versão com maior = 0. [8,3] dá 8. Vamos procurar uma entrada que quebre."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "maiorVenda",
            "casos": [
              {
                "args": [
                  [
                    8,
                    3
                  ]
                ],
                "esperado": 8
              },
              {
                "args": [
                  [
                    0
                  ]
                ],
                "esperado": 0
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "A comparação depende do valor inicial. Procure um exemplo que exponha uma regra ainda não atendida.",
        "linha": {
          "alvo": "snippet",
          "fala": "Escreva a função aqui, abaixo dos comentários do plano.",
          "linhas": [
            1
          ]
        },
        "solucao": {
          "fala": "Uma versão curta ajuda a conferir uma parte; ainda faltam regras.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "// Plano: Maior venda do dia\n// 1. Se a lista estiver vazia, devolver zero\n// 2. Começar com a primeira venda\n// 3. Comparar cada venda com a maior\n// 4. Se for maior, guardar a venda\n// 5. Devolver a maior venda\n\nfunction maiorVenda(vendas) {\n if (vendas.length === 0) return 0;\n let maior = 0;\n for (const v of vendas) if (v > maior) maior = v;\n return maior;\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma versão curta ajuda a conferir uma parte; ainda faltam regras.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Maior venda do dia\n// 1. Se a lista estiver vazia, devolver zero\n// 2. Começar com a primeira venda\n// 3. Comparar cada venda com a maior\n// 4. Se for maior, guardar a venda\n// 5. Devolver a maior venda\n\nfunction maiorVenda(vendas) {\n if (vendas.length === 0) return 0;\n let maior = 0;\n for (const v of vendas) if (v > maior) maior = v;\n return maior;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "codigo-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Preveja e complete maiorVenda conforme o pedido, incluindo a borda. Preserve o plano.",
        "toque": "Preveja e complete maiorVenda conforme o pedido, incluindo a borda. Preserve o plano."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "maiorVenda",
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
                    -5,
                    -2
                  ]
                ],
                "esperado": -2
              },
              {
                "args": [
                  [
                    0
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    4,
                    4
                  ]
                ],
                "esperado": 4
              },
              {
                "args": [
                  [
                    8,
                    3
                  ]
                ],
                "esperado": 8
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa."
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Maior venda do dia\n// 1. Se a lista estiver vazia, devolver zero\n// 2. Começar com a primeira venda\n// 3. Comparar cada venda com a maior\n// 4. Se for maior, guardar a venda\n// 5. Devolver a maior venda\n\nfunction maiorVenda(vendas) {\n if (vendas.length === 0) return 0;\n let maior = vendas[0];\n for (const v of vendas) if (v > maior) maior = v;\n return maior;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual caso quebra a primeira versão do código?",
        "opcoes": [
          "[8,3]",
          "[0]",
          "[-5,-2]"
        ],
        "correta": 2,
        "explicacao": "O caso expõe a regra que faltou: quantidade, reserva vazia, despesa ou valor negativo."
      }
    },
    {
      "id": "teste-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva o caso [8,3] com saída 8 e rode os casos.",
        "toque": "Escreva o caso [8,3] com saída 8 e rode os casos."
      },
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 1,
        "passando": true
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "A entrada são os argumentos; a saída é o que você calculou sem executar.",
        "linha": {
          "alvo": "snippet",
          "fala": "A entrada são os argumentos; a saída é o que você calculou sem executar.",
          "linhas": [
            1
          ]
        },
        "solucao": {
          "fala": "Uma parte resolvida; agora confira a próxima.",
          "acoes": [
            {
              "tipo": "escreverCaso",
              "entrada": "[8,3]",
              "esperado": "8"
            },
            {
              "tipo": "rodarCasos"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[8,3]",
          "esperado": "8"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    },
    {
      "id": "teste-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Escreva ao menos 5 casos passando: vazio, zero ou sem vendas e valor repetido quando houver.",
        "toque": "Escreva ao menos 5 casos passando: vazio, zero ou sem vendas e valor repetido quando houver."
      },
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 5,
        "incluir": [
          {
            "args": [
              []
            ],
            "rotulo": "a borda de entrada vazia"
          },
          {
            "args": [
              [
                -5,
                -2
              ]
            ],
            "rotulo": "estornos negativos"
          },
          {
            "args": [
              [
                4,
                4
              ]
            ],
            "rotulo": "valor repetido"
          },
          {
            "args": [
              [
                0
              ]
            ],
            "rotulo": "venda zero"
          }
        ],
        "passando": true
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa."
      },
      "falaAoConcluir": {
        "texto": "Uma parte resolvida; agora confira a próxima.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[]",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[-5,-2]",
          "esperado": "-2"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[4,4]",
          "esperado": "4"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[0]",
          "esperado": "0"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

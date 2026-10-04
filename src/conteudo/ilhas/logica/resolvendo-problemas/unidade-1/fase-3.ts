/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U1_F3: Fase = {
  "id": "logica-resolvendo-problemas-u1-f3",
  "tipo": "pratica",
  "unidadeId": "logica-resolvendo-problemas-u1",
  "titulo": "Total do pedido da festa",
  "conceitos": [
    "plano-comentado",
    "exemplos-de-teste"
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
      "texto": "itens é uma lista de fichas com preco e quantidade; devolva o total. [] vale 0. Duas fichas de preço 3 e quantidade 2 dão 12.",
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
    "problema": "Total do pedido da festa",
    "cartoes": [
      {
        "id": "zerar",
        "texto": "Começar o total em zero"
      },
      {
        "id": "ler",
        "texto": "Ler preço e quantidade de cada ficha",
        "depoisDe": [
          "zerar"
        ]
      },
      {
        "id": "somar",
        "texto": "Somar preço vezes quantidade ao total",
        "depoisDe": [
          "ler"
        ]
      },
      {
        "id": "devolver",
        "texto": "Devolver o total",
        "depoisDe": [
          "somar"
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
    "funcao": "totalFesta",
    "parametros": [
      "itens"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "totalFesta.js",
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
        "passo": "zerar"
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
              "passo": "zerar"
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
          "passo": "zerar"
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
          "passo": "ler"
        },
        {
          "tipo": "porPasso",
          "passo": "somar"
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
      ],
      "apresentar": [
        "plano-no-codigo"
      ]
    },
    {
      "id": "codigo-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Com quantidade 1, some cada preço: totalFesta deve devolver 3 para [{preco:3,quantidade:1}].",
        "toque": "Com quantidade 1, some cada preço: totalFesta deve devolver 3 para [{preco:3,quantidade:1}]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "totalFesta",
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
                    {
                      "preco": 3,
                      "quantidade": 1
                    }
                  ]
                ],
                "esperado": 3
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Um acumulador começa em zero e recebe cada parcela. Pense em como a quantidade muda o custo de cada ficha.",
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
              "codigo": "// Plano: Total do pedido da festa\n// 1. Começar o total em zero\n// 2. Ler preço e quantidade de cada ficha\n// 3. Somar preço vezes quantidade ao total\n// 4. Devolver o total\n\nfunction totalFesta(itens) {\n let total = 0;\n for (const item of itens) total += item.preco;\n return total;\n}"
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
          "codigo": "// Plano: Total do pedido da festa\n// 1. Começar o total em zero\n// 2. Ler preço e quantidade de cada ficha\n// 3. Somar preço vezes quantidade ao total\n// 4. Devolver o total\n\nfunction totalFesta(itens) {\n let total = 0;\n for (const item of itens) total += item.preco;\n return total;\n}"
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
        "mouse": "Preveja e complete totalFesta conforme o pedido, incluindo a borda. Preserve o plano.",
        "toque": "Preveja e complete totalFesta conforme o pedido, incluindo a borda. Preserve o plano."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "totalFesta",
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
                    {
                      "preco": 3,
                      "quantidade": 2
                    },
                    {
                      "preco": 3,
                      "quantidade": 2
                    }
                  ]
                ],
                "esperado": 12
              },
              {
                "args": [
                  [
                    {
                      "preco": 9,
                      "quantidade": 0
                    }
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    {
                      "preco": 2.5,
                      "quantidade": 3
                    }
                  ]
                ],
                "esperado": 7.5
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
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Total do pedido da festa\n// 1. Começar o total em zero\n// 2. Ler preço e quantidade de cada ficha\n// 3. Somar preço vezes quantidade ao total\n// 4. Devolver o total\n\nfunction totalFesta(itens) {\n let total = 0;\n for (const item of itens) total += item.preco * item.quantidade;\n return total;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual caso quebra a primeira versão do código?",
        "opcoes": [
          "[{preco:3,quantidade:2}]",
          "[{preco:3,quantidade:1}]",
          "[]"
        ],
        "correta": 0,
        "explicacao": "O caso expõe a regra que faltou: quantidade, reserva vazia, despesa ou valor negativo."
      }
    },
    {
      "id": "teste-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva [{preco:3,quantidade:2}] com saída 6 e rode os casos.",
        "toque": "Escreva [{preco:3,quantidade:2}] com saída 6 e rode os casos."
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
              "entrada": "[{preco:3,quantidade:2}]",
              "esperado": "6"
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
          "entrada": "[{preco:3,quantidade:2}]",
          "esperado": "6"
        },
        {
          "tipo": "rodarCasos"
        }
      ],
      "apresentar": [
        "casos-de-teste"
      ]
    },
    {
      "id": "teste-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Escreva ao menos 4 casos passando: vazio, zero ou sem vendas e valor repetido quando houver.",
        "toque": "Escreva ao menos 4 casos passando: vazio, zero ou sem vendas e valor repetido quando houver."
      },
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 4,
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
                {
                  "preco": 9,
                  "quantidade": 0
                }
              ]
            ],
            "rotulo": "a entrada zero ou sem vendas"
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
          "entrada": "[{preco:9,quantidade:0}]",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[{preco:3,quantidade:2},{preco:3,quantidade:2}]",
          "esperado": "12"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

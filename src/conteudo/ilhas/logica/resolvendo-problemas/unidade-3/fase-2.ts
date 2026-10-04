/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U3_F2: Fase = {
  "id": "logica-resolvendo-problemas-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-resolvendo-problemas-u3",
  "titulo": "Fechar o caixa da loja",
  "conceitos": [
    "dependencias-passos"
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
      "texto": "Receba vendas e despesas como listas de números. Devolva vendas menos despesas. saldo([10, 10], [4]) dá 16; duas listas vazias dão 0.",
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
    "problema": "Fechar o caixa da loja",
    "cartoes": [
      {
        "id": "receita",
        "texto": "Começar receita em zero"
      },
      {
        "id": "custo",
        "texto": "Começar custo em zero"
      },
      {
        "id": "vendas",
        "texto": "Somar as vendas à receita",
        "depoisDe": [
          "receita"
        ]
      },
      {
        "id": "despesas",
        "texto": "Somar as despesas ao custo",
        "depoisDe": [
          "custo"
        ]
      },
      {
        "id": "devolver",
        "texto": "Devolver receita menos custo",
        "depoisDe": [
          "vendas",
          "despesas"
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
    "funcao": "saldo",
    "parametros": [
      "vendas",
      "despesas"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "saldo.js",
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
        "passo": "receita"
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
              "passo": "receita"
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
          "passo": "receita"
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
          "passo": "custo"
        },
        {
          "tipo": "porPasso",
          "passo": "vendas"
        },
        {
          "tipo": "porPasso",
          "passo": "despesas"
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
        "mouse": "Comece só pela receita: some vendas com for...of. saldo([10],[0]) deve devolver 10.",
        "toque": "Comece só pela receita: some vendas com for...of. saldo([10],[0]) deve devolver 10."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "saldo",
            "casos": [
              {
                "args": [
                  [],
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    10
                  ],
                  [
                    0
                  ]
                ],
                "esperado": 10
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Um acumulador começa em zero e recebe cada valor das vendas. return entrega a soma para quem chamou.",
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
              "codigo": "// Plano: Fechar o caixa da loja\n// 1. Começar receita em zero\n// 2. Começar custo em zero\n// 3. Somar as vendas à receita\n// 4. Somar as despesas ao custo\n// 5. Devolver receita menos custo\n\nfunction saldo(vendas, despesas) {\n let receita = 0, custo = 0;\n for (const v of vendas) receita += v;\n for (const d of despesas) custo += d;\n return receita;\n}"
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
          "codigo": "// Plano: Fechar o caixa da loja\n// 1. Começar receita em zero\n// 2. Começar custo em zero\n// 3. Somar as vendas à receita\n// 4. Somar as despesas ao custo\n// 5. Devolver receita menos custo\n\nfunction saldo(vendas, despesas) {\n let receita = 0, custo = 0;\n for (const v of vendas) receita += v;\n for (const d of despesas) custo += d;\n return receita;\n}"
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
        "mouse": "Preveja e complete saldo conforme o pedido, incluindo a borda. Preserve o plano.",
        "toque": "Preveja e complete saldo conforme o pedido, incluindo a borda. Preserve o plano."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "saldo",
            "casos": [
              {
                "args": [
                  [],
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    10,
                    10
                  ],
                  [
                    4
                  ]
                ],
                "esperado": 16
              },
              {
                "args": [
                  [],
                  [
                    4
                  ]
                ],
                "esperado": -4
              },
              {
                "args": [
                  [
                    0
                  ],
                  [
                    0
                  ]
                ],
                "esperado": 0
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
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Fechar o caixa da loja\n// 1. Começar receita em zero\n// 2. Começar custo em zero\n// 3. Somar as vendas à receita\n// 4. Somar as despesas ao custo\n// 5. Devolver receita menos custo\n\nfunction saldo(vendas, despesas) {\n let receita = 0, custo = 0;\n for (const v of vendas) receita += v;\n for (const d of despesas) custo += d;\n return receita - custo;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual caso quebra a primeira versão do código?",
        "opcoes": [
          "[], []",
          "[10], [4]",
          "[10], [0]"
        ],
        "correta": 1,
        "explicacao": "O caso expõe a regra que faltou: quantidade, reserva vazia, despesa ou valor negativo."
      }
    },
    {
      "id": "teste-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva o caso [10,10], [4] com saída 16 e rode os casos.",
        "toque": "Escreva o caso [10,10], [4] com saída 16 e rode os casos."
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
              "entrada": "[10,10], [4]",
              "esperado": "16"
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
          "entrada": "[10,10], [4]",
          "esperado": "16"
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
        "mouse": "Escreva ao menos 4 casos passando: vazio, zero ou sem vendas e valor repetido quando houver.",
        "toque": "Escreva ao menos 4 casos passando: vazio, zero ou sem vendas e valor repetido quando houver."
      },
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 4,
        "incluir": [
          {
            "args": [
              [],
              []
            ],
            "rotulo": "a borda de entrada vazia"
          },
          {
            "args": [
              [],
              [
                4
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
          "entrada": "[], []",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[], [4]",
          "esperado": "-4"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[0], [0]",
          "esperado": "0"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

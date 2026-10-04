/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U2_F2: Fase = {
  "id": "logica-resolvendo-problemas-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-resolvendo-problemas-u2",
  "titulo": "Reservas da agenda",
  "conceitos": [
    "pseudocodigo"
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
      "texto": "pessoas contém quantidades de pessoas por reserva. Conte reservas com mais de 0 pessoas, não pessoas. [2, 0, 2] dá 2; [] dá 0.",
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
    "problema": "Reservas da agenda",
    "cartoes": [
      {
        "id": "zerar",
        "texto": "Começa sem reservas contadas"
      },
      {
        "id": "ler",
        "texto": "Olha cada quantidade",
        "depoisDe": [
          "zerar"
        ]
      },
      {
        "id": "somar",
        "texto": "Se tiver pessoas, conta mais uma reserva",
        "depoisDe": [
          "ler"
        ]
      },
      {
        "id": "devolver",
        "texto": "Entrega quantas reservas têm pessoas",
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
    "funcao": "reservas",
    "parametros": [
      "pessoas"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "reservas.js",
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
      ]
    },
    {
      "id": "codigo-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Primeiro conte todas as reservas: use for...of e total++. reservas([2,3]) deve devolver 2.",
        "toque": "Primeiro conte todas as reservas: use for...of e total++. reservas([2,3]) deve devolver 2."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "reservas",
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
                    2,
                    3
                  ]
                ],
                "esperado": 2
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Um contador começa em zero; cada reserva que passa pela regra acrescenta um. Devolver não é imprimir.",
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
              "codigo": "// Plano: Reservas da agenda\n// 1. Começa sem reservas contadas\n// 2. Olha cada quantidade\n// 3. Se tiver pessoas, conta mais uma reserva\n// 4. Entrega quantas reservas têm pessoas\n\nfunction reservas(pessoas) {\n let total = 0;\n for (const n of pessoas) total++;\n return total;\n}"
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
          "codigo": "// Plano: Reservas da agenda\n// 1. Começa sem reservas contadas\n// 2. Olha cada quantidade\n// 3. Se tiver pessoas, conta mais uma reserva\n// 4. Entrega quantas reservas têm pessoas\n\nfunction reservas(pessoas) {\n let total = 0;\n for (const n of pessoas) total++;\n return total;\n}"
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
        "mouse": "Preveja e complete reservas conforme o pedido, incluindo a borda. Preserve o plano.",
        "toque": "Preveja e complete reservas conforme o pedido, incluindo a borda. Preserve o plano."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "planoComentado"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "reservas",
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
                    2,
                    0,
                    2
                  ]
                ],
                "esperado": 2
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
                    1,
                    3,
                    1
                  ]
                ],
                "esperado": 3
              },
              {
                "args": [
                  [
                    -1,
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
          "codigo": "// Plano: Reservas da agenda\n// 1. Começa sem reservas contadas\n// 2. Olha cada quantidade\n// 3. Se tiver pessoas, conta mais uma reserva\n// 4. Entrega quantas reservas têm pessoas\n\nfunction reservas(pessoas) {\n let total = 0;\n for (const n of pessoas) if (n > 0) total++;\n return total;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual caso quebra a primeira versão do código?",
        "opcoes": [
          "[2,3]",
          "[0]",
          "[]"
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
        "mouse": "Escreva o caso [2,0] com saída 1 e rode os casos.",
        "toque": "Escreva o caso [2,0] com saída 1 e rode os casos."
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
              "entrada": "[2,0]",
              "esperado": "1"
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
          "entrada": "[2,0]",
          "esperado": "1"
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
              []
            ],
            "rotulo": "a borda de entrada vazia"
          },
          {
            "args": [
              [
                0
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
          "entrada": "[0]",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[2,2]",
          "esperado": "2"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

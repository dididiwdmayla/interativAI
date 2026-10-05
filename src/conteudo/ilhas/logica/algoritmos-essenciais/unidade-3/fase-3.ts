/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U3_F3: Fase = {
  "id": "logica-algoritmos-essenciais-u3-f3",
  "tipo": "desafio",
  "unidadeId": "logica-algoritmos-essenciais-u3",
  "titulo": "As caixas da biblioteca",
  "conceitos": [],
  "revisa": [
    "recursao-js",
    "caso-base-recursao",
    "problema-menor-recursao",
    "objeto-js",
    "acesso-objeto-js",
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
    "recursao-js",
    "caso-base-recursao",
    "problema-menor-recursao",
    "objeto-js",
    "acesso-objeto-js",
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
    "quadro-de-passos",
    "plano-no-codigo",
    "casos-de-teste"
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
      "texto": "A biblioteca recebe fichas de caixas: {quantidade: 3}. volumes(caixas) devolve a soma das quantidades, usando recursão.",
      "expressao": "apontando"
    },
    {
      "texto": "As quantidades são inteiros não negativos. Planeje e teste [], uma caixa, repetidos e uma caixa com zero.",
      "expressao": "apontando"
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
    "plano",
    "snippet",
    "palco",
    "testes"
  ],
  "plano": {
    "modo": "ordenar",
    "problema": "As caixas da biblioteca",
    "cartoes": [
      {
        "id": "p1",
        "texto": "Parar com zero quando o índice alcançar o fim"
      },
      {
        "id": "p2",
        "texto": "Ler a quantidade da caixa atual",
        "depoisDe": [
          "p1"
        ]
      },
      {
        "id": "p3",
        "texto": "Somar com a chamada do próximo índice",
        "depoisDe": [
          "p2"
        ]
      },
      {
        "id": "p4",
        "texto": "Devolver o total das chamadas",
        "depoisDe": [
          "p3"
        ]
      },
      {
        "id": "sobra",
        "texto": "Devolver sempre a mesma resposta",
        "sobra": true
      }
    ]
  },
  "testes": {
    "funcao": "volumes",
    "parametros": [
      "caixas"
    ]
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Planeje por dependências, sem a distração.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-algoritmos-essenciais-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "p1"
        },
        {
          "tipo": "porPasso",
          "passo": "p2"
        },
        {
          "tipo": "porPasso",
          "passo": "p3"
        },
        {
          "tipo": "porPasso",
          "passo": "p4"
        }
      ]
    },
    {
      "id": "comentarios",
      "descricao": "Leve o plano ao código como comentários.",
      "validador": {
        "tipo": "planoComentado"
      },
      "revisarEm": "logica-algoritmos-essenciais-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo",
      "descricao": "Execute a função com as entradas e a saída pedidas.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "volumes",
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
                      "quantidade": 4
                    }
                  ]
                ],
                "esperado": 4
              },
              {
                "args": [
                  [
                    {
                      "quantidade": 2
                    },
                    {
                      "quantidade": 2
                    }
                  ]
                ],
                "esperado": 4
              },
              {
                "args": [
                  [
                    {
                      "quantidade": 0
                    },
                    {
                      "quantidade": 3
                    }
                  ]
                ],
                "esperado": 3
              },
              {
                "args": [
                  [
                    {
                      "quantidade": 1
                    },
                    {
                      "quantidade": 5
                    },
                    {
                      "quantidade": 2
                    }
                  ]
                ],
                "esperado": 8
              }
            ]
          },
          {
            "tipo": "semErro"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "return"
          }
        ]
      },
      "revisarEm": "logica-algoritmos-essenciais-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: As caixas da biblioteca\n// 1. Parar com zero quando o índice alcançar o fim\n// 2. Ler a quantidade da caixa atual\n// 3. Somar com a chamada do próximo índice\n// 4. Devolver o total das chamadas\n\nfunction volumes(caixas, indice = 0) {\n  if (indice >= caixas.length) return 0;\n  return caixas[indice].quantidade + volumes(caixas, indice + 1);\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "testes",
      "descricao": "Crie e rode os casos: vazio, um item e repetidos.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 3,
        "incluir": [
          {
            "args": [
              []
            ],
            "rotulo": "borda 1"
          },
          {
            "args": [
              [
                {
                  "quantidade": 4
                }
              ]
            ],
            "rotulo": "borda 2"
          },
          {
            "args": [
              [
                {
                  "quantidade": 2
                },
                {
                  "quantidade": 2
                }
              ]
            ],
            "rotulo": "borda 3"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-algoritmos-essenciais-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[]",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[{\"quantidade\": 4}]",
          "esperado": "4"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[{\"quantidade\": 2}, {\"quantidade\": 2}]",
          "esperado": "4"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U2_F4: Fase = {
  "id": "logica-algoritmos-essenciais-u2-f4",
  "tipo": "desafio",
  "unidadeId": "logica-algoritmos-essenciais-u2",
  "titulo": "As distâncias do passeio",
  "conceitos": [],
  "revisa": [
    "sort-numerico",
    "ordenacao-selecao",
    "ordenacao-bolha",
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
    "sort-numerico",
    "ordenacao-selecao",
    "ordenacao-bolha",
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
      "texto": "Uma guia turística recebe distâncias numéricas. roteiro(distancias) devolve uma cópia em ordem crescente.",
      "expressao": "apontando"
    },
    {
      "texto": "Planeje e teste [] e [12] e [12,2,12]. Confira também negativos e [10,9,1]. Use sort com comparador numérico.",
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
    "problema": "As distâncias do passeio",
    "cartoes": [
      {
        "id": "p1",
        "texto": "Receber as distâncias do passeio"
      },
      {
        "id": "p2",
        "texto": "Copiar a lista para preservar a entrada",
        "depoisDe": [
          "p1"
        ]
      },
      {
        "id": "p3",
        "texto": "Ordenar os números com comparador",
        "depoisDe": [
          "p2"
        ]
      },
      {
        "id": "p4",
        "texto": "Devolver a cópia ordenada",
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
    "funcao": "roteiro",
    "parametros": [
      "distancias"
    ]
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Planeje por dependências, sem a distração.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-algoritmos-essenciais-u2-f3",
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
      "revisarEm": "logica-algoritmos-essenciais-u2-f3",
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
            "nome": "roteiro",
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
                    12
                  ]
                ],
                "esperado": [
                  12
                ]
              },
              {
                "args": [
                  [
                    12,
                    2,
                    12
                  ]
                ],
                "esperado": [
                  2,
                  12,
                  12
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
                    -1,
                    0,
                    -3
                  ]
                ],
                "esperado": [
                  -3,
                  -1,
                  0
                ]
              }
            ]
          },
          {
            "tipo": "semErro"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:sort"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          }
        ]
      },
      "revisarEm": "logica-algoritmos-essenciais-u2-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: As distâncias do passeio\n// 1. Receber as distâncias do passeio\n// 2. Copiar a lista para preservar a entrada\n// 3. Ordenar os números com comparador\n// 4. Devolver a cópia ordenada\n\nfunction roteiro(lista) {\n  return [...lista].sort((a, b) => a - b);\n}"
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
                12
              ]
            ],
            "rotulo": "borda 2"
          },
          {
            "args": [
              [
                12,
                2,
                12
              ]
            ],
            "rotulo": "borda 3"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-algoritmos-essenciais-u2-f3",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[]",
          "esperado": "[]"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[12]",
          "esperado": "[12]"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[12, 2, 12]",
          "esperado": "[2, 12, 12]"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

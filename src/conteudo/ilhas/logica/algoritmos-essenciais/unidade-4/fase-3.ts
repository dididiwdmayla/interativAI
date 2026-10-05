/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U4_F3: Fase = {
  "id": "logica-algoritmos-essenciais-u4-f3",
  "tipo": "desafio",
  "unidadeId": "logica-algoritmos-essenciais-u4",
  "titulo": "Os registros do observatório",
  "conceitos": [],
  "revisa": [
    "evitar-trabalho-repetido",
    "crescimento-dos-passos",
    "custo-em-passos",
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
    "evitar-trabalho-repetido",
    "crescimento-dos-passos",
    "custo-em-passos",
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
    "grafico-passos",
    "quadro-de-passos",
    "plano-no-codigo",
    "casos-de-teste"
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
          "nome": "repetiu"
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
      "texto": "O observatório recebe códigos de amostras, já em ordem crescente. repetiu(codigos) devolve true se algum código aparece mais de uma vez.",
      "expressao": "apontando"
    },
    {
      "texto": "Planeje, trate vazio, um código e repetidos; até 20.000 passos com 1.000 códigos. Compare vizinhos sem ordenar novamente.",
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
    "problema": "Os registros do observatório",
    "cartoes": [
      {
        "id": "p1",
        "texto": "Receber os códigos já ordenados"
      },
      {
        "id": "p2",
        "texto": "Percorrer comparando cada código com o anterior",
        "depoisDe": [
          "p1"
        ]
      },
      {
        "id": "p3",
        "texto": "Devolver true ao encontrar vizinhos iguais",
        "depoisDe": [
          "p2"
        ]
      },
      {
        "id": "p4",
        "texto": "Devolver false ao chegar ao fim",
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
    "funcao": "repetiu",
    "parametros": [
      "codigos"
    ]
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Planeje por dependências, sem a distração.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-algoritmos-essenciais-u4-f2",
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
      "revisarEm": "logica-algoritmos-essenciais-u4-f2",
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
            "nome": "repetiu",
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
            "tipo": "semErro"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "passosNoMaximo",
            "valor": 20000,
            "tamanho": 1000,
            "funcao": "repetiu"
          }
        ]
      },
      "revisarEm": "logica-algoritmos-essenciais-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Os registros do observatório\n// 1. Receber os códigos já ordenados\n// 2. Percorrer comparando cada código com o anterior\n// 3. Devolver true ao encontrar vizinhos iguais\n// 4. Devolver false ao chegar ao fim\n\nfunction repetiu(lista) {\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] === lista[i - 1]) return true;\n  }\n  return false;\n}"
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
                8
              ]
            ],
            "rotulo": "borda 2"
          },
          {
            "args": [
              [
                2,
                2,
                3
              ]
            ],
            "rotulo": "borda 3"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-algoritmos-essenciais-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[]",
          "esperado": "false"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[8]",
          "esperado": "false"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[2, 2, 3]",
          "esperado": "true"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

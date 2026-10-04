/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U1_F3: Fase = {
  "id": "logica-algoritmos-essenciais-u1-f3",
  "tipo": "desafio",
  "unidadeId": "logica-algoritmos-essenciais-u1",
  "titulo": "Ingresso na lista do museu",
  "conceitos": [],
  "revisa": [
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
          "nome": "ingresso",
          "args": [
            "$lista",
            "$tamanho"
          ]
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
      "texto": "O museu tem códigos de ingresso em ordem crescente. ingresso(codigos, numero) deve devolver true ou false.",
      "expressao": "apontando"
    },
    {
      "texto": "Use busca binária sem ordenar de novo. Planeje, teste vazio, um ingresso, repetidos e ausente; caiba em 130 passos com 1.000 itens.",
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
    "problema": "Ingresso na lista do museu",
    "cartoes": [
      {
        "id": "p1",
        "texto": "Definir os limites da lista ordenada"
      },
      {
        "id": "p2",
        "texto": "Comparar o meio com o ingresso",
        "depoisDe": [
          "p1"
        ]
      },
      {
        "id": "p3",
        "texto": "Descartar a metade sem o alvo e repetir",
        "depoisDe": [
          "p2"
        ]
      },
      {
        "id": "p4",
        "texto": "Devolver false se os limites se cruzarem",
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
    "funcao": "ingresso",
    "parametros": [
      "codigos",
      "numero"
    ]
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Planeje por dependências, sem a distração.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-algoritmos-essenciais-u1-f2",
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
      "revisarEm": "logica-algoritmos-essenciais-u1-f2",
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
            "nome": "ingresso",
            "casos": [
              {
                "args": [
                  [],
                  7
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    7
                  ],
                  7
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    7,
                    7,
                    9
                  ],
                  7
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8
                  ],
                  2
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8
                  ],
                  8
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8
                  ],
                  1
                ],
                "esperado": true
              }
            ]
          },
          {
            "tipo": "semErro"
          },
          {
            "tipo": "passosNoMaximo",
            "valor": 130,
            "tamanho": 1000,
            "funcao": "ingresso"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "revisarEm": "logica-algoritmos-essenciais-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Ingresso na lista do museu\n// 1. Definir os limites da lista ordenada\n// 2. Comparar o meio com o ingresso\n// 3. Descartar a metade sem o alvo e repetir\n// 4. Devolver false se os limites se cruzarem\n\nfunction ingresso(lista, alvo) {\n  let esquerda = 0;\n  let direita = lista.length - 1;\n  while (esquerda <= direita) {\n    const meio = Math.floor((esquerda + direita) / 2);\n    const atual = lista[meio];\n    if (atual === alvo) return true;\n    if (atual < alvo) esquerda = meio + 1;\n    else direita = meio - 1;\n  }\n  return false;\n}"
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
              [],
              7
            ],
            "rotulo": "borda 1"
          },
          {
            "args": [
              [
                7
              ],
              7
            ],
            "rotulo": "borda 2"
          },
          {
            "args": [
              [
                1,
                7,
                7,
                9
              ],
              7
            ],
            "rotulo": "borda 3"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-algoritmos-essenciais-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[], 7",
          "esperado": "false"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[7], 7",
          "esperado": "true"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[1, 7, 7, 9], 7",
          "esperado": "true"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

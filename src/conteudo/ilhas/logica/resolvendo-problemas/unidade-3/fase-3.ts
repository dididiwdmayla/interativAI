/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U3_F3: Fase = {
  "id": "logica-resolvendo-problemas-u3-f3",
  "tipo": "desafio",
  "unidadeId": "logica-resolvendo-problemas-u3",
  "titulo": "O material da costureira",
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
      "texto": "Receba pedido e estoque, números não negativos. Devolva quantas peças faltam, ou 0 se houver estoque suficiente. faltam(8,3) dá 5.",
      "expressao": "apontando"
    },
    {
      "texto": "Outro negócio, o problema inteiro: entenda entrada, saída e exemplos; planeje, programe e teste suas bordas.",
      "expressao": "apontando"
    },
    {
      "texto": "Teste (0,0), (4,4) e (3,8), além do caso comum (8,3).",
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
    "problema": "O material da costureira",
    "cartoes": [
      {
        "id": "receber",
        "texto": "Receber o tamanho do pedido"
      },
      {
        "id": "estoque",
        "texto": "Receber as peças em estoque"
      },
      {
        "id": "calcular",
        "texto": "Calcular pedido menos estoque",
        "depoisDe": [
          "receber",
          "estoque"
        ]
      },
      {
        "id": "limitar",
        "texto": "Se a diferença for negativa, devolver zero",
        "depoisDe": [
          "calcular"
        ]
      },
      {
        "id": "devolver",
        "texto": "Senão, devolver a diferença",
        "depoisDe": [
          "limitar"
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
    "funcao": "faltam",
    "parametros": [
      "pedido",
      "estoque"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "faltam.js",
      "codigoInicial": ""
    }
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Monte o plano por dependências, sem distrações.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-resolvendo-problemas-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "receber"
        },
        {
          "tipo": "porPasso",
          "passo": "estoque"
        },
        {
          "tipo": "porPasso",
          "passo": "calcular"
        },
        {
          "tipo": "porPasso",
          "passo": "limitar"
        },
        {
          "tipo": "porPasso",
          "passo": "devolver"
        }
      ]
    },
    {
      "id": "comentarios",
      "descricao": "Leve o plano ao código como comentários.",
      "validador": {
        "tipo": "planoComentado"
      },
      "revisarEm": "logica-resolvendo-problemas-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo",
      "descricao": "Escreva faltam com as entradas e a saída pedidas; execute.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "faltam",
            "casos": [
              {
                "args": [
                  8,
                  3
                ],
                "esperado": 5
              },
              {
                "args": [
                  0,
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  3,
                  8
                ],
                "esperado": 0
              },
              {
                "args": [
                  4,
                  4
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
      "revisarEm": "logica-resolvendo-problemas-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: O material da costureira\n// 1. Receber o tamanho do pedido\n// 2. Receber as peças em estoque\n// 3. Calcular pedido menos estoque\n// 4. Se a diferença for negativa, devolver zero\n// 5. Senão, devolver a diferença\n\nfunction faltam(pedido, estoque) {\n const diferenca = pedido - estoque;\n if (diferenca < 0) return 0;\n return diferenca;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "testes",
      "descricao": "Escreva seus casos: comum e todas as bordas pedidas, e rode.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 4,
        "incluir": [
          {
            "args": [
              0,
              0
            ],
            "rotulo": "pedido zero"
          },
          {
            "args": [
              4,
              4
            ],
            "rotulo": "estoque igual ao pedido"
          },
          {
            "args": [
              3,
              8
            ],
            "rotulo": "estoque maior"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-resolvendo-problemas-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "8, 3",
          "esperado": "5"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "0, 0",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "3, 8",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "4, 4",
          "esperado": "0"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

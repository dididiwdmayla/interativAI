/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U4_F2: Fase = {
  "id": "logica-resolvendo-problemas-u4-f2",
  "tipo": "desafio",
  "unidadeId": "logica-resolvendo-problemas-u4",
  "titulo": "Troco da cantina",
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
      "texto": "Receba preco e pago, valores em reais não negativos. Devolva pago - preco: negativo significa quanto ainda falta pagar. troco(7,10) dá 3.",
      "expressao": "apontando"
    },
    {
      "texto": "Outro negócio, o problema inteiro: entenda entrada, saída e exemplos; planeje, programe e teste suas bordas.",
      "expressao": "apontando"
    },
    {
      "texto": "Teste (0,0), (5,5) e (9,4), além do caso comum (7,10).",
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
    "problema": "Troco da cantina",
    "cartoes": [
      {
        "id": "preco",
        "texto": "Receber o preço em reais"
      },
      {
        "id": "pago",
        "texto": "Receber o valor pago em reais"
      },
      {
        "id": "subtrair",
        "texto": "Calcular valor pago menos preço",
        "depoisDe": [
          "preco",
          "pago"
        ]
      },
      {
        "id": "devolver",
        "texto": "Devolver a diferença, inclusive se negativa",
        "depoisDe": [
          "subtrair"
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
    "funcao": "troco",
    "parametros": [
      "preco",
      "pago"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "troco.js",
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
      "revisarEm": "logica-resolvendo-problemas-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "preco"
        },
        {
          "tipo": "porPasso",
          "passo": "pago"
        },
        {
          "tipo": "porPasso",
          "passo": "subtrair"
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
      "revisarEm": "logica-resolvendo-problemas-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo",
      "descricao": "Escreva troco com as entradas e a saída pedidas; execute.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "troco",
            "casos": [
              {
                "args": [
                  7,
                  10
                ],
                "esperado": 3
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
                  5,
                  5
                ],
                "esperado": 0
              },
              {
                "args": [
                  9,
                  4
                ],
                "esperado": -5
              },
              {
                "args": [
                  2.5,
                  5
                ],
                "esperado": 2.5
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-resolvendo-problemas-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Troco da cantina\n// 1. Receber o preço em reais\n// 2. Receber o valor pago em reais\n// 3. Calcular valor pago menos preço\n// 4. Devolver a diferença, inclusive se negativa\n\nfunction troco(preco, pago) {\n return pago - preco;\n}"
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
            "rotulo": "zero"
          },
          {
            "args": [
              5,
              5
            ],
            "rotulo": "pagamento exato"
          },
          {
            "args": [
              9,
              4
            ],
            "rotulo": "pagamento insuficiente"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-resolvendo-problemas-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "7, 10",
          "esperado": "3"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "0, 0",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "5, 5",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "9, 4",
          "esperado": "-5"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

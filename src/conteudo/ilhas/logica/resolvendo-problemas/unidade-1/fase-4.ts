/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U1_F4: Fase = {
  "id": "logica-resolvendo-problemas-u1-f4",
  "tipo": "desafio",
  "unidadeId": "logica-resolvendo-problemas-u1",
  "titulo": "As entregas da loja",
  "conceitos": [
    "entender-problema",
    "decompor-problema",
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
      "texto": "Uma loja cobra 2 reais por quilômetro de cada entrega. distancias é a lista de quilômetros. [3,3] custa 12; [] custa 0.",
      "expressao": "apontando"
    },
    {
      "texto": "Outro negócio, o problema inteiro: entenda entrada, saída e exemplos; planeje, programe e teste suas bordas.",
      "expressao": "apontando"
    },
    {
      "texto": "Teste lista vazia, distância zero e distâncias repetidas [3,3].",
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
    "problema": "As entregas da loja",
    "cartoes": [
      {
        "id": "zerar",
        "texto": "Começar o total em zero"
      },
      {
        "id": "ler",
        "texto": "Ler os quilômetros de cada entrega",
        "depoisDe": [
          "zerar"
        ]
      },
      {
        "id": "somar",
        "texto": "Somar duas vezes os quilômetros",
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
    "funcao": "freteTotal",
    "parametros": [
      "distancias"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "freteTotal.js",
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
      "revisarEm": "logica-resolvendo-problemas-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "zerar"
        },
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
      "id": "comentarios",
      "descricao": "Leve o plano ao código como comentários.",
      "validador": {
        "tipo": "planoComentado"
      },
      "revisarEm": "logica-resolvendo-problemas-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo",
      "descricao": "Escreva freteTotal com as entradas e a saída pedidas; execute.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "freteTotal",
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
                    3,
                    3
                  ]
                ],
                "esperado": 12
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
                    1.5
                  ]
                ],
                "esperado": 3
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-resolvendo-problemas-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: As entregas da loja\n// 1. Começar o total em zero\n// 2. Ler os quilômetros de cada entrega\n// 3. Somar duas vezes os quilômetros\n// 4. Devolver o total\n\nfunction freteTotal(distancias) {\n let total = 0;\n for (const km of distancias) total += km * 2;\n return total;\n}"
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
        "minimo": 3,
        "incluir": [
          {
            "args": [
              []
            ],
            "rotulo": "lista vazia"
          },
          {
            "args": [
              [
                0
              ]
            ],
            "rotulo": "distância zero"
          },
          {
            "args": [
              [
                3,
                3
              ]
            ],
            "rotulo": "distância repetida"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-resolvendo-problemas-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[3,3]",
          "esperado": "12"
        },
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
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

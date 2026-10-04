/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U3_F1: Fase = {
  "id": "logica-resolvendo-problemas-u3-f1",
  "tipo": "ordenar-passos",
  "unidadeId": "logica-resolvendo-problemas-u3",
  "titulo": "A ordem faz diferença",
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
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "introducao": [
    {
      "texto": "Usar total antes de criá-lo quebra de verdade. preço e quantidade podem trocar de ordem; multiplicar precisa dos dois.",
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
  "ordenar": {
    "modo": "ordenar",
    "problema": "O caixa precisa das duas entradas",
    "cartoes": [
      {
        "id": "preco",
        "texto": "const preco = 4;"
      },
      {
        "id": "quantidade",
        "texto": "const quantidade = 3;"
      },
      {
        "id": "total",
        "texto": "const total = preco * quantidade;",
        "depoisDe": [
          "preco",
          "quantidade"
        ]
      },
      {
        "id": "mostrar",
        "texto": "console.log(total);",
        "depoisDe": [
          "total"
        ]
      },
      {
        "id": "sobra",
        "texto": "Começar o código sem conferir a pergunta",
        "sobra": true
      }
    ],
    "rodar": true
  },
  "programa": {},
  "objetivos": [
    {
      "id": "preparar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Monte os dois passos de preparação: declarar preco e quantidade.",
        "toque": "Monte os dois passos de preparação: declarar preco e quantidade."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "passoNoPlano",
            "passo": "preco"
          },
          {
            "tipo": "passoNoPlano",
            "passo": "quantidade"
          }
        ]
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
              "passo": "preco"
            },
            {
              "tipo": "porPasso",
              "passo": "quantidade"
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
          "passo": "preco"
        },
        {
          "tipo": "porPasso",
          "passo": "quantidade"
        }
      ]
    },
    {
      "id": "prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha console.log(total) no fim e rode para ler o erro.",
        "toque": "Ponha console.log(total) no fim e rode para ler o erro."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "ReferenceError"
      },
      "ajudas": {
        "pergunta": "Qual entrada você recebe e qual saída precisa entregar?",
        "dica": "Resolva uma parte por vez e confira o que ela usa.",
        "linha": {
          "alvo": "ordenar",
          "fala": "Resolva uma parte por vez e confira o que ela usa."
        },
        "solucao": {
          "fala": "Agora você viu o motivo: passos dependem de outros, não de uma ordem decorada.",
          "acoes": [
            {
              "tipo": "porPasso",
              "passo": "mostrar"
            },
            {
              "tipo": "rodarPlano"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Agora você viu o motivo: passos dependem de outros, não de uma ordem decorada.",
        "expressao": "apontando"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "porPasso",
          "passo": "mostrar"
        },
        {
          "tipo": "rodarPlano"
        }
      ],
      "previsao": {
        "pergunta": "Se mostrar total antes de declará-lo, qual caso quebra?",
        "opcoes": [
          "Só quantidade zero",
          "Só preço repetido",
          "Qualquer entrada"
        ],
        "correta": 2,
        "explicacao": "O problema é a dependência, não o valor: total ainda não existe."
      }
    },
    {
      "id": "completar",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Tire console.log, ponha total, depois console.log; rode. A saída deve ser 12.",
        "toque": "Tire console.log, ponha total, depois console.log; rode. A saída deve ser 12."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "ordemValida"
          },
          {
            "tipo": "saida",
            "igual": [
              "12"
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
          "tipo": "tirarPasso",
          "passo": "mostrar"
        },
        {
          "tipo": "porPasso",
          "passo": "total"
        },
        {
          "tipo": "porPasso",
          "passo": "mostrar"
        },
        {
          "tipo": "rodarPlano"
        }
      ]
    }
  ]
};

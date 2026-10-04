/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U1_F2: Fase = {
  "id": "logica-resolvendo-problemas-u1-f2",
  "tipo": "ordenar-passos",
  "unidadeId": "logica-resolvendo-problemas-u1",
  "titulo": "Partes menores",
  "conceitos": [
    "entender-problema",
    "decompor-problema"
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
    "quadro-de-passos"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "introducao": [
    {
      "texto": "Não tente resolver tudo junto: quantidade de pães é uma parte, preço é outra. Só o total precisa das duas.",
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
    "problema": "Dividir o pedido em partes",
    "cartoes": [
      {
        "id": "pessoas",
        "texto": "Ler quantas pessoas vão à festa"
      },
      {
        "id": "preco",
        "texto": "Ler o preço de um pão"
      },
      {
        "id": "paes",
        "texto": "Calcular dois pães por pessoa",
        "depoisDe": [
          "pessoas"
        ]
      },
      {
        "id": "total",
        "texto": "Multiplicar pães pelo preço",
        "depoisDe": [
          "paes",
          "preco"
        ]
      },
      {
        "id": "sobra",
        "texto": "Começar o código sem conferir a pergunta",
        "sobra": true
      }
    ]
  },
  "objetivos": [
    {
      "id": "preparar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Monte os dois passos de preparação: pessoas e preço.",
        "toque": "Monte os dois passos de preparação: pessoas e preço."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "passoNoPlano",
            "passo": "pessoas"
          },
          {
            "tipo": "passoNoPlano",
            "passo": "preco"
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
              "passo": "pessoas"
            },
            {
              "tipo": "porPasso",
              "passo": "preco"
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
          "passo": "pessoas"
        },
        {
          "tipo": "porPasso",
          "passo": "preco"
        }
      ]
    },
    {
      "id": "prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque preço para antes de pessoas.",
        "toque": "Troque preço para antes de pessoas."
      },
      "validador": {
        "tipo": "passoAntes",
        "passo": "preco",
        "antesDe": "pessoas"
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
              "passo": "preco",
              "posicao": 0
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
          "passo": "preco",
          "posicao": 0
        }
      ],
      "previsao": {
        "pergunta": "Ler pessoas e preço: qual precisa vir primeiro?",
        "opcoes": [
          "Pessoas sempre",
          "Preço sempre",
          "Qualquer um dos dois"
        ],
        "correta": 2,
        "explicacao": "Essas leituras são independentes. O total é que precisa de ambas."
      }
    },
    {
      "id": "completar",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Complete o plano sem a distração.",
        "toque": "Complete o plano sem a distração."
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
          "passo": "paes"
        },
        {
          "tipo": "porPasso",
          "passo": "total"
        }
      ]
    }
  ]
};

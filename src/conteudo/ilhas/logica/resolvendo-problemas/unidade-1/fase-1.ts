/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U1_F1: Fase = {
  "id": "logica-resolvendo-problemas-u1-f1",
  "tipo": "ordenar-passos",
  "unidadeId": "logica-resolvendo-problemas-u1",
  "titulo": "O que a padaria precisa?",
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
      "texto": "Antes de programar, entenda o pedido: a padaria recebe preços e quantidades e precisa do total em reais.",
      "expressao": "apontando"
    },
    {
      "texto": "Programador não sabe tudo de saída. Separe o que chega, o que entregar e os exemplos; resolva cada parte.",
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
    "modo": "agrupar",
    "problema": "Entender o pedido da festa",
    "cartoes": [
      {
        "id": "precos",
        "texto": "Receber preços dos produtos",
        "grupo": "entrada"
      },
      {
        "id": "quantidades",
        "texto": "Receber quantidades pedidas",
        "grupo": "entrada"
      },
      {
        "id": "total",
        "texto": "Entregar o total em reais",
        "grupo": "saida"
      },
      {
        "id": "vazio",
        "texto": "Pedido vazio custa zero",
        "grupo": "exemplos"
      },
      {
        "id": "repetido",
        "texto": "Duas fichas iguais de 3 reais com 2 unidades custam 12",
        "grupo": "exemplos"
      },
      {
        "id": "sobra",
        "texto": "Começar o código sem conferir a pergunta",
        "sobra": true
      }
    ],
    "grupos": [
      {
        "id": "entrada",
        "titulo": "O que chega"
      },
      {
        "id": "saida",
        "titulo": "O que entregar"
      },
      {
        "id": "exemplos",
        "titulo": "Conferir exemplos"
      }
    ]
  },
  "objetivos": [
    {
      "id": "entradas",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha preços e quantidades em O que chega.",
        "toque": "Ponha preços e quantidades em O que chega."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "passoNoPlano",
            "passo": "precos",
            "grupo": "entrada"
          },
          {
            "tipo": "passoNoPlano",
            "passo": "quantidades",
            "grupo": "entrada"
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
              "passo": "precos",
              "grupo": "entrada"
            },
            {
              "tipo": "porPasso",
              "passo": "quantidades",
              "grupo": "entrada"
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
          "passo": "precos",
          "grupo": "entrada"
        },
        {
          "tipo": "porPasso",
          "passo": "quantidades",
          "grupo": "entrada"
        }
      ],
      "apresentar": [
        "quadro-de-passos"
      ]
    },
    {
      "id": "entender-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Sem começar o código: agrupe a saída e os dois exemplos. Deixe a distração fora.",
        "toque": "Sem começar o código: agrupe a saída e os dois exemplos. Deixe a distração fora."
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
          "passo": "total",
          "grupo": "saida"
        },
        {
          "tipo": "porPasso",
          "passo": "vazio",
          "grupo": "exemplos"
        },
        {
          "tipo": "porPasso",
          "passo": "repetido",
          "grupo": "exemplos"
        }
      ]
    }
  ]
};

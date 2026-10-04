/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U2_F1: Fase = {
  "id": "logica-resolvendo-problemas-u2-f1",
  "tipo": "ordenar-passos",
  "unidadeId": "logica-resolvendo-problemas-u2",
  "titulo": "Plano em português",
  "conceitos": [
    "pseudocodigo"
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
      "texto": "Pseudocódigo é para pensar, não para rodar. “Começa sem reservas” e “zera a contagem” dizem a mesma ideia, sem sintaxe obrigatória.",
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
    "problema": "Pensar em português",
    "cartoes": [
      {
        "id": "receber",
        "texto": "Recebe a lista de pessoas por reserva",
        "grupo": "entrada"
      },
      {
        "id": "zerar",
        "texto": "Começa a contagem em zero",
        "grupo": "entrada"
      },
      {
        "id": "olhar",
        "texto": "Olha cada quantidade da lista",
        "grupo": "saida"
      },
      {
        "id": "contar",
        "texto": "Se tiver pessoas, conta uma reserva",
        "depoisDe": [
          "olhar"
        ],
        "grupo": "saida"
      },
      {
        "id": "devolver",
        "texto": "Entrega a contagem",
        "depoisDe": [
          "contar"
        ],
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
        "titulo": "Preparar"
      },
      {
        "id": "saida",
        "titulo": "Contar"
      },
      {
        "id": "exemplos",
        "titulo": "Entregar"
      }
    ]
  },
  "objetivos": [
    {
      "id": "preparar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Monte os dois passos de preparação: receber a lista e começar a contagem.",
        "toque": "Monte os dois passos de preparação: receber a lista e começar a contagem."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "passoNoPlano",
            "passo": "receber",
            "grupo": "entrada"
          },
          {
            "tipo": "passoNoPlano",
            "passo": "zerar",
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
              "passo": "receber",
              "grupo": "entrada"
            },
            {
              "tipo": "porPasso",
              "passo": "zerar",
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
          "passo": "receber",
          "grupo": "entrada"
        },
        {
          "tipo": "porPasso",
          "passo": "zerar",
          "grupo": "entrada"
        }
      ]
    },
    {
      "id": "prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha Olha cada quantidade dentro de Contar.",
        "toque": "Ponha Olha cada quantidade dentro de Contar."
      },
      "validador": {
        "tipo": "passoNoPlano",
        "passo": "olhar",
        "grupo": "saida"
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
              "passo": "olhar",
              "grupo": "saida"
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
          "opcao": 0
        },
        {
          "tipo": "porPasso",
          "passo": "olhar",
          "grupo": "saida"
        }
      ],
      "previsao": {
        "pergunta": "O pseudocódigo precisa de ponto e vírgula?",
        "opcoes": [
          "Não: precisa ser claro",
          "Sim, igual ao JavaScript",
          "Só quando há lista"
        ],
        "correta": 0,
        "explicacao": "É um plano em português. Sintaxe certa só é necessária ao transformar em código."
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
          "passo": "contar",
          "grupo": "saida"
        },
        {
          "tipo": "porPasso",
          "passo": "devolver",
          "grupo": "exemplos"
        }
      ]
    }
  ]
};

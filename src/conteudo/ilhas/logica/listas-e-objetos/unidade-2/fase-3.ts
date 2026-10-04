/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U2_F3: FasePratica = {
  "id": "logica-listas-e-objetos-u2-f3",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u2",
  "titulo": "A lista dos baratos",
  "conceitos": [
    "filter-lista-js"
  ],
  "revisa": [
    "map-lista-js",
    "arrow-js",
    "if-js"
  ],
  "prerequisitos": [
    "map-lista-js",
    "arrow-js",
    "if-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "A lista dos baratos",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "filter recebe uma função de decisão: true mantém o item, false descarta. O resultado é sempre uma lista, até quando fica vazia.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f3-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie precos = [3, 8, 5]; use filter para criar baratos com preços < 6 e guarde quantidade.",
        "toque": "Crie precos = [3, 8, 5]; use filter para criar baratos com preços < 6 e guarde quantidade."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "precos",
            "valor": [
              3,
              8,
              5
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "baratos",
            "valor": [
              3,
              5
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidade",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "A arrow devolve a condição preco < 6. Volte pelas três chamadas.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A arrow devolve a condição preco < 6. Volte pelas três chamadas."
        },
        "solucao": {
          "fala": "Passaram 3 e 5; 8 não passou. A original ainda tem os três preços.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const precos = [3, 8, 5]\nconst baratos = precos.filter(preco => preco < 6)\nlet quantidade = baratos.length"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Passaram 3 e 5; 8 não passou. A original ainda tem os três preços.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const precos = [3, 8, 5]\nconst baratos = precos.filter(preco => preco < 6)\nlet quantidade = baratos.length"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f3-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie nenhum = precos.filter(preco => preco > 20) e guarde tamanho = nenhum.length.",
        "toque": "Crie nenhum = precos.filter(preco => preco > 20) e guarde tamanho = nenhum.length."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "nenhum",
            "valor": []
          },
          {
            "tipo": "valorVariavel",
            "nome": "tamanho",
            "valor": 0
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Sem aprovação, a lista nova fica vazia.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Sem aprovação, a lista nova fica vazia."
        },
        "solucao": {
          "fala": "filter devolveu [], cujo length é 0.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const nenhum = precos.filter(preco => preco > 20)\nlet tamanho = nenhum.length"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "filter devolveu [], cujo length é 0.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const nenhum = precos.filter(preco => preco > 20)\nlet tamanho = nenhum.length"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Nenhum preço é maior que 20. O resultado de filter será qual?",
        "opcoes": [
          "[]",
          "undefined",
          "false"
        ],
        "correta": 0,
        "explicacao": "filter devolve lista, mesmo sem itens."
      }
    },
    {
      "id": "f3-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie ateCinco(lista) usando filter e arrow para devolver valores <= 5. Guarde escolhidos para [5, 6, 0].",
        "toque": "Crie ateCinco(lista) usando filter e arrow para devolver valores <= 5. Guarde escolhidos para [5, 6, 0]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "ateCinco",
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
                    5,
                    6,
                    0
                  ]
                ],
                "esperado": [
                  5,
                  0
                ]
              },
              {
                "args": [
                  [
                    6,
                    8
                  ]
                ],
                "esperado": []
              },
              {
                "args": [
                  [
                    4,
                    5.1
                  ]
                ],
                "esperado": [
                  4
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "escolhidos",
            "valor": [
              5,
              0
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O valor exatamente 5 também deve passar."
      },
      "falaAoConcluir": {
        "texto": "A fronteira 5 passa; 6 e 5.1 ficam de fora.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const ateCinco = (lista) => lista.filter(n => n <= 5)\nlet escolhidos = ateCinco([5, 6, 0])"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "No Console real os dados funcionam igual. Aqui, volte pela linha do tempo para acompanhar cada mudança.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [2, 8, 15]; use compras.push(20). Filtre preços > 10 e confira length: 2.",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

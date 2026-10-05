/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U2_F2: Fase = {
  "id": "logica-estruturas-de-dados-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u2",
  "titulo": "O trem inteiro trabalha",
  "conceitos": [
    "fila-por-indice"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "fila-js",
    "custo-em-passos",
    "crescimento-dos-passos"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "fila-js",
    "custo-em-passos",
    "crescimento-dos-passos"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "contador-passos",
    "grafico-passos"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "estrutura.js",
      "codigoInicial": ""
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "comShift"
        },
        {
          "nome": "porIndice"
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
      "texto": "Como em Algoritmos essenciais, compare trabalho x tamanho. comShift soma removendo; porIndice soma em ordem sem remover.",
      "expressao": "apontando"
    },
    {
      "texto": "shift numa lista enorme move os vagões a cada retirada. O gráfico soma linhas e trabalho escondido: este é um modelo, não milissegundos.",
      "expressao": "apontando"
    },
    {
      "texto": "O índice evita deslizar; a lista ainda guarda os itens atendidos. Para esta tarefa finita, basta avançar inicio.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "indice-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva comShift e porIndice para somar os pedidos. Execute [2,5,8] e meça as duas curvas.",
        "toque": "Escreva comShift e porIndice para somar os pedidos. Execute [2,5,8] e meça as duas curvas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "porIndice",
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
                    7
                  ]
                ],
                "esperado": 7
              },
              {
                "args": [
                  [
                    2,
                    5,
                    8
                  ]
                ],
                "esperado": 15
              },
              {
                "args": [
                  [
                    -2,
                    2
                  ]
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 15
          },
          {
            "tipo": "evento",
            "evento": "mediuDesempenho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Na versão por índice, leia lista[inicio], some e avance inicio até length.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Na versão por índice, leia lista[inicio], some e avance inicio até length."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function comShift(lista) {\n  let soma = 0;\n  while (lista.length > 0) soma += lista.shift();\n  return soma;\n}\nfunction porIndice(lista) {\n  let soma = 0;\n  let inicio = 0;\n  while (inicio < lista.length) {\n    const item = lista[inicio];\n    soma += item;\n    inicio++;\n  }\n  return soma;\n}\nconst total = porIndice([2, 5, 8]);"
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "medirDesempenho"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O gráfico inclui todo o trabalho escondido de shift.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function comShift(lista) {\n  let soma = 0;\n  while (lista.length > 0) soma += lista.shift();\n  return soma;\n}\nfunction porIndice(lista) {\n  let soma = 0;\n  let inicio = 0;\n  while (inicio < lista.length) {\n    const item = lista[inicio];\n    soma += item;\n    inicio++;\n  }\n  return soma;\n}\nconst total = porIndice([2, 5, 8]);"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "medirDesempenho"
        }
      ]
    },
    {
      "id": "indice-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Troque a chamada para [3,7,9]. Guarde total e mantenha porIndice dentro de 20.000 passos em 1.000 itens.",
        "toque": "Troque a chamada para [3,7,9]. Guarde total e mantenha porIndice dentro de 20.000 passos em 1.000 itens."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "porIndice",
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
                    7
                  ]
                ],
                "esperado": 7
              },
              {
                "args": [
                  [
                    2,
                    5,
                    8
                  ]
                ],
                "esperado": 15
              },
              {
                "args": [
                  [
                    -2,
                    2
                  ]
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 19
          },
          {
            "tipo": "passosNoMaximo",
            "funcao": "porIndice",
            "tamanho": 1000,
            "valor": 20000
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Faça o início avançar, sem shift na função medida."
      },
      "falaAoConcluir": {
        "texto": "Mesma ordem de atendimento com uma curva que cresce junto com a entrada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function comShift(lista) {\n  let soma = 0;\n  while (lista.length > 0) soma += lista.shift();\n  return soma;\n}\nfunction porIndice(lista) {\n  let soma = 0;\n  let inicio = 0;\n  while (inicio < lista.length) {\n    const item = lista[inicio];\n    soma += item;\n    inicio++;\n  }\n  return soma;\n}\nconst total = porIndice([3, 7, 9]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Consumir 1.000 itens: qual faz mais trabalho total?",
        "opcoes": [
          "porIndice",
          "Empatam",
          "comShift"
        ],
        "correta": 2,
        "explicacao": "Cada shift move a lista restante; o gráfico mostra esse trabalho."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Rebobine para ver por onde cada item passou e qual regra decidiu a ordem.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "Troque os dados e teste também a estrutura vazia.",
    "expressao": "curioso"
  },
  "missaoDeCampo": "No Console de qualquer site: let p=[]; p.push(\"A\",\"B\"); p.pop(); let f=[]; f.push(\"A\",\"B\"); f.shift(); Compare quem saiu e o que ficou.",
  "apresentar": [
    "contador-passos",
    "grafico-passos"
  ]
};

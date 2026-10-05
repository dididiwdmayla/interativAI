/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U1_F2: Fase = {
  "id": "logica-algoritmos-essenciais-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u1",
  "titulo": "Descartar metade com segurança",
  "conceitos": [
    "busca-binaria",
    "lista-ordenada"
  ],
  "revisa": [
    "array-js",
    "funcao-js",
    "return-js",
    "for-js",
    "while-js",
    "plano-comentado",
    "casos-de-borda"
  ],
  "prerequisitos": [
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
    "grafico-passos"
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
          "nome": "localizar",
          "args": [
            "$lista",
            "$tamanho"
          ]
        },
        {
          "nome": "binaria",
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
      "texto": "A busca binária exige números em ordem crescente. Compare o meio; alvo maior fica à direita, menor à esquerda.",
      "expressao": "apontando"
    },
    {
      "texto": "binaria(lista, alvo) devolve true ou false. Atualize os limites passando do meio, para a busca avançar.",
      "expressao": "apontando"
    },
    {
      "texto": "A aba Desempenho mede linhas executadas nesta simulação. No Chrome real ela mede tempo.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "meio-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva binaria: trate [], compare o meio de [1,2,3,4,5,6,7] com 4 e guarde achou.",
        "toque": "Escreva binaria: trate [], compare o meio de [1,2,3,4,5,6,7] com 4 e guarde achou."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "binaria",
            "casos": [
              {
                "args": [
                  [],
                  4
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                  ],
                  4
                ],
                "esperado": true
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "achou",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "O índice do meio é Math.floor((esquerda + direita) / 2).",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O índice do meio é Math.floor((esquerda + direita) / 2)."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return -1;\n}\nfunction binaria(lista, alvo) {\n  if (lista.length === 0) return false;\n  const meio = Math.floor((lista.length - 1) / 2);\n  return lista[meio] === alvo;\n}\nconst achou = binaria([1,2,3,4,5,6,7],4);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return -1;\n}\nfunction binaria(lista, alvo) {\n  if (lista.length === 0) return false;\n  const meio = Math.floor((lista.length - 1) / 2);\n  return lista[meio] === alvo;\n}\nconst achou = binaria([1,2,3,4,5,6,7],4);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "binaria-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Complete a busca com while: true se existe, false se não. Cabe em 500 passos com 5.000 itens.",
        "toque": "Complete a busca com while: true se existe, false se não. Cabe em 500 passos com 5.000 itens."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "binaria",
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
                    7
                  ],
                  6
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    3,
                    3,
                    5
                  ],
                  3
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
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
                    2,
                    3
                  ],
                  0
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ],
                  4
                ],
                "esperado": false
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          },
          {
            "tipo": "passosNoMaximo",
            "valor": 500,
            "tamanho": 5000,
            "funcao": "binaria"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Comece com esquerda=0 e direita=length-1; atualize um limite com meio+1 ou meio-1."
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return -1;\n}\nfunction binaria(lista, alvo) {\n  let esquerda = 0;\n  let direita = lista.length - 1;\n  while (esquerda <= direita) {\n    const meio = Math.floor((esquerda + direita) / 2);\n    const atual = lista[meio];\n    if (atual === alvo) return true;\n    if (atual < alvo) esquerda = meio + 1;\n    else direita = meio - 1;\n  }\n  return false;\n}\nconst achou = binaria([1,2,3,4,5,6,7],7);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Em [8, 2, 6], dá para descartar metade com segurança usando a binária?",
        "opcoes": [
          "Não: a lista precisa estar ordenada",
          "Sim: qualquer ordem serve",
          "Sim: basta trocar o alvo"
        ],
        "correta": 0,
        "explicacao": "Sem ordem, um alvo maior que o meio também pode estar à esquerda. Use linear ou ordene antes."
      }
    },
    {
      "id": "medir-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Na aba Desempenho, use Medir para comparar as duas buscas de 10 a 1.000 itens.",
        "toque": "Na aba Desempenho, use Medir para comparar as duas buscas de 10 a 1.000 itens."
      },
      "validador": {
        "tipo": "evento",
        "evento": "mediuDesempenho"
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Abra Desempenho e use Medir.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "grafico-passos",
          "fala": "Aqui as funções recebem listas crescentes e buscam o último valor."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "medirDesempenho"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "medirDesempenho"
        }
      ],
      "apresentar": [
        "grafico-passos"
      ]
    },
    {
      "id": "medir-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Mude a chamada do Snippet para buscar o 6, execute e meça novamente.",
        "toque": "Mude a chamada do Snippet para buscar o 6, execute e meça novamente."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "achou",
            "valor": true
          },
          {
            "tipo": "evento",
            "evento": "mediuDesempenho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Mantenha as funções e mude a lista da chamada; depois use Medir de novo."
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function localizar(lista, alvo) {\n  for (let i = 0; i < lista.length; i++) {\n    const atual = lista[i];\n    if (atual === alvo) return i;\n  }\n  return -1;\n}\nfunction binaria(lista, alvo) {\n  let esquerda = 0;\n  let direita = lista.length - 1;\n  while (esquerda <= direita) {\n    const meio = Math.floor((esquerda + direita) / 2);\n    const atual = lista[meio];\n    if (atual === alvo) return true;\n    if (atual < alvo) esquerda = meio + 1;\n    else direita = meio - 1;\n  }\n  return false;\n}\nconst achou = binaria([1,2,3,4,5,6],6);"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "medirDesempenho"
        }
      ]
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
  }
};

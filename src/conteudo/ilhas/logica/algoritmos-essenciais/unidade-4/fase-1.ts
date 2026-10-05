/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U4_F1: Fase = {
  "id": "logica-algoritmos-essenciais-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u4",
  "titulo": "A fila dobra de tamanho",
  "conceitos": [
    "custo-em-passos",
    "crescimento-dos-passos"
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
    "cena",
    "ficha-dispositivo",
    "velocidade-simulacao",
    "contador-passos",
    "grafico-passos"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "algoritmo.js",
      "codigoInicial": "function lento(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[i] === lista[j]) return true;\n    }\n  }\n  return false;\n}\nfunction rapido(lista) {\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] === lista[i - 1]) return true;\n  }\n  return false;\n}\nconst pedidos = [1,2,3];\nconsole.log(lento(pedidos), rapido(pedidos));\npainel.mostrar(\"SEM DUPLICADO\");"
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "lento"
        },
        {
          "nome": "rapido"
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
      "texto": "A fila usa códigos numéricos em ordem crescente. As duas funções dizem se há repetidos: true ou false.",
      "expressao": "apontando"
    },
    {
      "texto": "lento compara cada par; rapido compara vizinhos. Só a lista ordenada garante que os iguais sejam vizinhos.",
      "expressao": "apontando"
    },
    {
      "texto": "Rodou rápido no meu computador não prova que cresce bem. Veja 10, 100 e 1.000 itens; imagine o mesmo trabalho com um milhão.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "contar-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Execute os dois jeitos com [1,2,3]; confira false false e o contador. O painel deve dizer SEM DUPLICADO.",
        "toque": "Execute os dois jeitos com [1,2,3]; confira false false e o contador. O painel deve dizer SEM DUPLICADO."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "false false"
            ]
          },
          {
            "tipo": "passosNoMaximo",
            "valor": 200
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "SEM DUPLICADO"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Execute o Snippet. O contador mostra linhas executadas nesta simulação.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Execute o Snippet. O contador mostra linhas executadas nesta simulação."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Com três pedidos, ambos cabem. Isso ainda não diz como vão crescer.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "grafico-guiado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Preveja; na aba Desempenho, use Medir para testar 10, 100 e 1.000 itens.",
        "toque": "Preveja; na aba Desempenho, use Medir para testar 10, 100 e 1.000 itens."
      },
      "validador": {
        "tipo": "evento",
        "evento": "mediuDesempenho"
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Abra Desempenho e use Medir; acompanhe as duas linhas.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "grafico-passos",
          "fala": "Os tamanhos usam o mesmo tipo de lista, sem duplicados."
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
        "texto": "O gráfico testa esta distribuição de dados. Mais tamanhos ajudam a ver a tendência, sem medir tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "medirDesempenho"
        }
      ],
      "previsao": {
        "pergunta": "Ao crescer de 10 para 1.000 pedidos distintos, qual linha dispara mais?",
        "opcoes": [
          "rapido: só vizinhos",
          "As duas ficam iguais",
          "lento: cada par"
        ],
        "correta": 2,
        "explicacao": "Na lenta, cada item novo tem muitos pares novos. Na rápida, ele acrescenta só mais um vizinho."
      }
    },
    {
      "id": "contar-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Troque a fila para [1,2,2,3], mostre DUPLICADO no painel e meça de novo. Ambos devem responder true.",
        "toque": "Troque a fila para [1,2,2,3], mostre DUPLICADO no painel e meça de novo. Ambos devem responder true."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "lento",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    8
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    2,
                    2,
                    3
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8,
                    8
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    -2,
                    -2,
                    0
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    1,
                    1
                  ]
                ],
                "esperado": true
              }
            ]
          },
          {
            "tipo": "funcaoPassa",
            "nome": "rapido",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    8
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    2,
                    2,
                    3
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    2,
                    3
                  ]
                ],
                "esperado": false
              },
              {
                "args": [
                  [
                    1,
                    3,
                    8,
                    8
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    -2,
                    -2,
                    0
                  ]
                ],
                "esperado": true
              },
              {
                "args": [
                  [
                    1,
                    1,
                    1
                  ]
                ],
                "esperado": true
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedidos",
            "valor": [
              1,
              2,
              2,
              3
            ]
          },
          {
            "tipo": "saida",
            "igual": [
              "true true"
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "DUPLICADO"
          },
          {
            "tipo": "evento",
            "evento": "mediuDesempenho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Mude a lista da chamada; preserve as funções que o gráfico mede."
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
          "codigo": "function lento(lista) {\n  for (let i = 0; i < lista.length; i++) {\n    for (let j = i + 1; j < lista.length; j++) {\n      if (lista[i] === lista[j]) return true;\n    }\n  }\n  return false;\n}\nfunction rapido(lista) {\n  for (let i = 1; i < lista.length; i++) {\n    if (lista[i] === lista[i - 1]) return true;\n  }\n  return false;\n}\nconst pedidos = [1,2,2,3];\nconsole.log(lento(pedidos), rapido(pedidos));\npainel.mostrar(\"DUPLICADO\");"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "medirDesempenho"
        }
      ],
      "previsao": {
        "pergunta": "Deu rápido com quatro pedidos. Isso garante que um milhão também vai dar?",
        "opcoes": [
          "Não: veja como os passos crescem",
          "Sim: a máquina decide tudo",
          "Sim: true é uma resposta curta"
        ],
        "correta": 0,
        "explicacao": "O tamanho da resposta não mede o trabalho feito para encontrá-la. Compare o crescimento."
      }
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
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "cena": {
    "id": "algoritmos-cena-u4",
    "titulo": "Fila de pedidos",
    "ambiente": "central-pedidos",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "parede",
        "x": 0,
        "y": 0
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150,
        "variante": "madeira"
      },
      {
        "peca": "balcao",
        "x": 35,
        "y": 100
      },
      {
        "peca": "planta",
        "x": 275,
        "y": 115
      },
      {
        "peca": "janela",
        "x": 40,
        "y": 30
      },
      {
        "peca": "quadro",
        "x": 236,
        "y": 92
      }
    ],
    "dispositivos": [
      {
        "id": "painel",
        "nome": "Painel do resultado",
        "tipo": "letreiro",
        "x": 170,
        "y": 35
      }
    ],
    "linhaDoTempo": []
  }
};

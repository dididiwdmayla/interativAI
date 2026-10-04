/* Habilidade guiada, treino sozinho e bordas no executor; cena e palco tornam o algoritmo visível. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_ALGORITMOS_U3_F1: Fase = {
  "id": "logica-algoritmos-essenciais-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-algoritmos-essenciais-u3",
  "titulo": "Volumes na expedição",
  "conceitos": [
    "recursao-js",
    "caso-base-recursao"
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
    "velocidade-simulacao"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "algoritmo.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "A expedição conta volumes. contar(n) devolve n para inteiros positivos e 0 se n for zero ou negativo.",
      "expressao": "apontando"
    },
    {
      "texto": "Recursão é a função chamar ela mesma. Cada chamada precisa de um problema menor e de um caso de parada.",
      "expressao": "apontando"
    },
    {
      "texto": "Sem caso de parada ela nunca chega ao fim. O JavaScript interrompe com RangeError, e o jogo explica sem travar.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "sem-parada",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Execute function semFim(n) { return semFim(n); } e semFim(1). Observe a proteção.",
        "toque": "Execute function semFim(n) { return semFim(n); } e semFim(1). Observe a proteção."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "RangeError"
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "A chamada não diminui n e não tem um return que pare de chamar.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A chamada não diminui n e não tem um return que pare de chamar."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function semFim(n) {\n  return semFim(n);\n}\nsemFim(1);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A pilha de chamadas encheu: RangeError. A proteção cortou; essa função não terminou o trabalho.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function semFim(n) {\n  return semFim(n);\n}\nsemFim(1);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "recursao-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie contar com base n===0 e chamada contar(n-1). Conte 2 volumes e mostre TOTAL 2 no painel.",
        "toque": "Crie contar com base n===0 e chamada contar(n-1). Conte 2 volumes e mostre TOTAL 2 no painel."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "contar",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  2
                ],
                "esperado": 2
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "return"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "TOTAL 2"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Quando n é zero, devolva 0. Senão devolva 1 mais contar(n-1).",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Quando n é zero, devolva 0. Senão devolva 1 mais contar(n-1)."
        },
        "solucao": {
          "fala": "Uma versão para você comparar com a sua.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function contar(n) {\n  if (n === 0) return 0;\n  return 1 + contar(n - 1);\n}\nconst total = contar(2);\npainel.mostrar(\"TOTAL \" + total);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O caso base devolve sem chamar. As outras molduras voltam somando um.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function contar(n) {\n  if (n === 0) return 0;\n  return 1 + contar(n - 1);\n}\nconst total = contar(2);\npainel.mostrar(\"TOTAL \" + total);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "recursao-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Inclua negativos na parada. Conte 4 volumes; mostre TOTAL 4 e reveja as molduras no palco.",
        "toque": "Inclua negativos na parada. Conte 4 volumes; mostre TOTAL 4 e reveja as molduras no palco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "contar",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  -1
                ],
                "esperado": 0
              },
              {
                "args": [
                  1
                ],
                "esperado": 1
              },
              {
                "args": [
                  4
                ],
                "esperado": 4
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 4
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "TOTAL 4"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caso faz esse caminho falhar?",
        "dica": "Use n<=0; um n negativo também precisa parar."
      },
      "falaAoConcluir": {
        "texto": "Confira o resultado e percorra a linha do tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function contar(n) {\n  if (n <= 0) return 0;\n  return 1 + contar(n - 1);\n}\nconst total = contar(4);\npainel.mostrar(\"TOTAL \" + total);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Na versão com n===0, chamar contar(-1) chega à parada ao subtrair 1?",
        "opcoes": [
          "Sim, na próxima chamada",
          "Não: fica cada vez mais negativo",
          "Sim, após duas chamadas"
        ],
        "correta": 1,
        "explicacao": "-1 vira -2, depois -3. O caso de parada precisa ser alcançável."
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
    "id": "algoritmos-cena-u3",
    "titulo": "Volumes da expedição",
    "ambiente": "expedicao",
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
        "peca": "mesa",
        "x": 35,
        "y": 100
      },
      {
        "peca": "planta",
        "x": 275,
        "y": 115
      },
      {
        "peca": "prateleira",
        "x": 42,
        "y": 53,
        "variante": "potes"
      },
      {
        "peca": "porta",
        "x": 245,
        "y": 65
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

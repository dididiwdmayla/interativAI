/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U2_F2: FasePratica = {
  "id": "logica-funcoes-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u2",
  "titulo": "Mostrar não é devolver",
  "conceitos": [
    "mostrar-ou-devolver"
  ],
  "revisa": [
    "parametro-argumento",
    "return-js",
    "console-log",
    "undefined-js"
  ],
  "prerequisitos": [
    "parametro-argumento",
    "return-js",
    "console-log",
    "undefined-js"
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
      "nome": "Mostrar não é devolver",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "console.log mostra uma mensagem; return entrega um valor para outra conta. Se a função termina sem return, devolve undefined.",
      "expressao": "apontando"
    },
    {
      "texto": "No balcão, somar só mostra a soma. Guarde o resultado da chamada e veja undefined no palco: a mensagem 5 não entrou na caixinha total.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode somar(a,b) só com console.log(a+b). Guarde total = somar(2,3) e semRetorno = typeof total === \"undefined\".",
        "toque": "Rode somar(a,b) só com console.log(a+b). Guarde total = somar(2,3) e semRetorno = typeof total === \"undefined\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "saida",
                "igual": [
                  "5"
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "semRetorno",
                "valor": true
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "funcao"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que foi mostrado e o que foi entregue?",
        "dica": "Veja total no palco; console.log não coloca sua mensagem no retorno.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Veja total no palco; console.log não coloca sua mensagem no retorno."
        },
        "solucao": {
          "fala": "Mostrou 5, devolveu undefined. A caixinha total deixa a diferença visível.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function somar(a, b) {\n  console.log(a + b)\n}\nlet total = somar(2, 3)\nlet semRetorno = typeof total === \"undefined\""
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Mostrou 5, devolveu undefined. A caixinha total deixa a diferença visível.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(a, b) {\n  console.log(a + b)\n}\nlet total = somar(2, 3)\nlet semRetorno = typeof total === \"undefined\""
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f2-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque console.log por return em somar e guarde total = somar(2,3).",
        "toque": "Troque console.log por return em somar e guarde total = somar(2,3)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "somar",
                "casos": [
                  {
                    "args": [
                      2,
                      3
                    ],
                    "esperado": 5
                  },
                  {
                    "args": [
                      0,
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      -3,
                      1
                    ],
                    "esperado": -2
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 5
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A variável total recebe a saída impressa?",
        "dica": "Para entregar o valor, use return.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Para entregar o valor, use return."
        },
        "solucao": {
          "fala": "Agora total vale 5. Nenhuma mensagem é necessária para devolver.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function somar(a, b) {\n  return a + b\n}\nlet total = somar(2, 3)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Agora total vale 5. Nenhuma mensagem é necessária para devolver.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(a, b) {\n  return a + b\n}\nlet total = somar(2, 3)"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Se somar só faz console.log(a+b), o que total = somar(2,3) guarda?",
        "opcoes": [
          "5",
          "\"5\"",
          "undefined"
        ],
        "correta": 2,
        "explicacao": "A mensagem é 5, mas a função sem return devolve undefined."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No estacionamento, conserte dobro(horas): devolva o dobro e guarde custo = dobro(4), sem depender da mensagem.",
        "toque": "No estacionamento, conserte dobro(horas): devolva o dobro e guarde custo = dobro(4), sem depender da mensagem."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "dobro",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      4
                    ],
                    "esperado": 8
                  },
                  {
                    "args": [
                      1.5
                    ],
                    "esperado": 3
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "custo",
                "valor": 8
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Imprimir 8 é suficiente para custo receber 8?",
        "dica": "O valor de uma chamada vem do return."
      },
      "falaAoConcluir": {
        "texto": "custo recebeu 8; a função também funciona com zero e meia hora.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function dobro(horas) {\n  return horas * 2\n}\nlet custo = dobro(4)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Volte pela linha do tempo: veja a entrada na moldura, as instruções do corpo e a volta para quem chamou.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie function dobro(n) { return n * 2 } e chame dobro(0), dobro(3) e dobro(7).",
  "falaFinal": {
    "texto": "Criar e chamar funções no Console real funciona como aqui; o palco é a ajuda visual do jogo.",
    "expressao": "feliz"
  }
};

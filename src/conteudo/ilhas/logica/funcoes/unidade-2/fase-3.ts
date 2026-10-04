/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U2_F3: FasePratica = {
  "id": "logica-funcoes-u2-f3",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u2",
  "titulo": "Devolver encerra a chamada",
  "conceitos": [
    "return-encerra"
  ],
  "revisa": [
    "if-js",
    "for-js",
    "acumulador-js",
    "return-js"
  ],
  "prerequisitos": [
    "if-js",
    "for-js",
    "acumulador-js",
    "return-js"
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
      "nome": "Devolver encerra a chamada",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "return encerra aquela chamada imediatamente. Um if pode devolver cedo; as linhas depois daquele return não rodam.",
      "expressao": "apontando"
    },
    {
      "texto": "Você pode repetir dentro de uma função. Guarde o acumulador antes do for e devolva o resultado depois das voltas; não use listas ainda.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f3-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie frete(preco): se preco >= 100, devolva 0; senão, 12. Guarde entrega = frete(100).",
        "toque": "Crie frete(preco): se preco >= 100, devolva 0; senão, 12. Guarde entrega = frete(100)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "frete",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 12
                  },
                  {
                    "args": [
                      99
                    ],
                    "esperado": 12
                  },
                  {
                    "args": [
                      100
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      101
                    ],
                    "esperado": 0
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "entrega",
                "valor": 0
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "if"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Depois do return 0, chega ao return 12?",
        "dica": "Um return já encerrou a chamada; o outro só roda se o if não passar.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Um return já encerrou a chamada; o outro só roda se o if não passar."
        },
        "solucao": {
          "fala": "No limite 100 o frete é zero; 99 ainda paga 12.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function frete(preco) {\n  if (preco >= 100) { return 0 }\n  return 12\n}\nlet entrega = frete(100)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "No limite 100 o frete é zero; 99 ainda paga 12.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function frete(preco) {\n  if (preco >= 100) { return 0 }\n  return 12\n}\nlet entrega = frete(100)"
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
        "mouse": "Chame frete(99) e guarde entrega.",
        "toque": "Chame frete(99) e guarde entrega."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "entrega",
            "valor": 12
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "99 passa pela condição do frete grátis?",
        "dica": "Confira a fronteira >= 100.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Confira a fronteira >= 100."
        },
        "solucao": {
          "fala": "O if não passou; executou o return 12.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let entrega = frete(99)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O if não passou; executou o return 12.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let entrega = frete(99)"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "frete(99) devolve quanto se a gratuidade começa em 100?",
        "opcoes": [
          "0",
          "12",
          "undefined"
        ],
        "correta": 1,
        "explicacao": "99 é menor que 100, então chega ao segundo return."
      }
    },
    {
      "id": "f3-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No clube, crie somarAte(n): some de 1 até n com for e devolva a soma. Guarde pontos = somarAte(4).",
        "toque": "No clube, crie somarAte(n): some de 1 até n com for e devolva a soma. Guarde pontos = somarAte(4)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "somarAte",
                "casos": [
                  {
                    "args": [
                      0
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
                    "esperado": 10
                  },
                  {
                    "args": [
                      5
                    ],
                    "esperado": 15
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "pontos",
                "valor": 10
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "for"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Em que momento a soma está completa?",
        "dica": "O return fica depois do loop; antes dele a função ainda está acumulando."
      },
      "falaAoConcluir": {
        "texto": "Quatro voltas, retorno 10; para zero não há voltas e devolve 0.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function somarAte(n) {\n  let soma = 0\n  for (let i = 1; i <= n; i++) {\n    soma += i\n  }\n  return soma\n}\nlet pontos = somarAte(4)"
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

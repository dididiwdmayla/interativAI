/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U4_F2: FasePratica = {
  "id": "logica-funcoes-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u4",
  "titulo": "Com chaves precisa devolver",
  "conceitos": [
    "arrow-com-bloco"
  ],
  "revisa": [
    "arrow-js",
    "retorno-implicito",
    "if-js",
    "for-js"
  ],
  "prerequisitos": [
    "arrow-js",
    "retorno-implicito",
    "if-js",
    "for-js"
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
      "nome": "Com chaves precisa devolver",
      "codigoInicial": "const dobro = (n) => {\n  n * 2\n}\nlet total = dobro(4)"
    }
  },
  "introducao": [
    {
      "texto": "Com chaves depois da seta, você escreveu um bloco de instruções. Agora precisa de return: const dobro = (n) => { n * 2 } devolve undefined.",
      "expressao": "apontando"
    },
    {
      "texto": "Use bloco quando precisar de if, de um laço ou de uma variável local. A faixa de retorno só aparece com o valor devolvido pela chamada.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Conserte const dobro = (n) => { n * 2 }: acrescente return e guarde total = dobro(4).",
        "toque": "Conserte const dobro = (n) => { n * 2 }: acrescente return e guarde total = dobro(4)."
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
                      -1
                    ],
                    "esperado": -2
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 8
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "arrow"
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "return"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Chaves são uma expressão ou um bloco?",
        "dica": "Dentro do bloco escreva return para entregar o valor.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Dentro do bloco escreva return para entregar o valor."
        },
        "solucao": {
          "fala": "Com chaves e return, total recebeu 8.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const dobro = (n) => {\n  return n * 2\n}\nlet total = dobro(4)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Com chaves e return, total recebeu 8.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const dobro = (n) => {\n  return n * 2\n}\nlet total = dobro(4)"
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
        "mouse": "Rode const teste = (n) => { n * 2 }; guarde total = teste(4) e faltou = typeof total === \"undefined\".",
        "toque": "Rode const teste = (n) => { n * 2 }; guarde total = teste(4) e faltou = typeof total === \"undefined\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "valorVariavel",
                "nome": "faltou",
                "valor": true
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "arrow"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Calcular dentro já entrega o valor?",
        "dica": "Sem return, o bloco termina sem devolver o resultado da conta.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Sem return, o bloco termina sem devolver o resultado da conta."
        },
        "solucao": {
          "fala": "A conta aconteceu, mas total recebeu undefined.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const teste = (n) => {\n  n * 2\n}\nlet total = teste(4)\nlet faltou = typeof total === \"undefined\""
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A conta aconteceu, mas total recebeu undefined.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const teste = (n) => {\n  n * 2\n}\nlet total = teste(4)\nlet faltou = typeof total === \"undefined\""
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "const teste = (n) => { n * 2 }; teste(4) devolve o quê?",
        "opcoes": [
          "undefined",
          "8",
          "4"
        ],
        "correta": 0,
        "explicacao": "O bloco não tem return; devolve undefined."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No café, crie porcoes(n) com arrow e bloco: some de 1 até n com for, devolva soma e guarde total = porcoes(3).",
        "toque": "No café, crie porcoes(n) com arrow e bloco: some de 1 até n com for, devolva soma e guarde total = porcoes(3)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "porcoes",
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
                      3
                    ],
                    "esperado": 6
                  },
                  {
                    "args": [
                      4
                    ],
                    "esperado": 10
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 6
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "arrow"
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
        "pergunta": "Quando as voltas terminaram, qual valor deve sair?",
        "dica": "Acumule no bloco e use return depois do for."
      },
      "falaAoConcluir": {
        "texto": "A arrow usou laço e variável local; devolveu 6 depois das voltas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const porcoes = (n) => {\n  let soma = 0\n  for (let i = 1; i <= n; i++) {\n    soma += i\n  }\n  return soma\n}\nlet total = porcoes(3)"
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

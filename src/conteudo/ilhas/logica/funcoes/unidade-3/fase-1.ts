/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U3_F1: FasePratica = {
  "id": "logica-funcoes-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u3",
  "titulo": "A caixinha tem endereço",
  "conceitos": [
    "escopo-global-js",
    "escopo-funcao-js"
  ],
  "revisa": [
    "parametro-argumento",
    "return-js",
    "ler-mensagem-de-erro"
  ],
  "prerequisitos": [
    "parametro-argumento",
    "return-js",
    "ler-mensagem-de-erro"
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
      "nome": "A caixinha tem endereço",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "Escopo é onde um nome existe. No topo ele é global; dentro da função é local. A caixinha local só pertence à moldura daquela chamada.",
      "expressao": "apontando"
    },
    {
      "texto": "let taxa = 10 fora e let taxa = 2 dentro são duas caixinhas. A função vê a local; fora continua 10. Leia as duas ao rebobinar.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie calcular(valor) com taxa = 2 dentro e return valor + taxa. Fora, taxa = 10; guarde total = calcular(5).",
        "toque": "Crie calcular(valor) com taxa = 2 dentro e return valor + taxa. Fora, taxa = 10; guarde total = calcular(5)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "calcular",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 2
                  },
                  {
                    "args": [
                      5
                    ],
                    "esperado": 7
                  },
                  {
                    "args": [
                      -2
                    ],
                    "esperado": 0
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "taxa",
                "valor": 10
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 7
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Trocar a caixinha local muda a de fora?",
        "dica": "O nome é igual, mas a moldura separa as duas variáveis.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O nome é igual, mas a moldura separa as duas variáveis."
        },
        "solucao": {
          "fala": "Dentro taxa vale 2; fora continua 10. total recebeu o retorno 7.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let taxa = 10\nfunction calcular(valor) {\n  let taxa = 2\n  return valor + taxa\n}\nlet total = calcular(5)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Dentro taxa vale 2; fora continua 10. total recebeu o retorno 7.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let taxa = 10\nfunction calcular(valor) {\n  let taxa = 2\n  return valor + taxa\n}\nlet total = calcular(5)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f1-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie segredo() com let codigo = 42 dentro. Chame e tente ler codigo fora no Console.",
        "toque": "Crie segredo() com let codigo = 42 dentro. Chame e tente ler codigo fora no Console."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "ReferenceError"
      },
      "ajudas": {
        "pergunta": "A moldura de segredo ainda existe ao ler codigo?",
        "dica": "A variável local só existe na chamada, não no Global.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A variável local só existe na chamada, não no Global."
        },
        "solucao": {
          "fala": "ReferenceError: codigo não existe fora. A moldura já terminou.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function segredo() {\n  let codigo = 42\n}\nsegredo()\ncodigo"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "ReferenceError: codigo não existe fora. A moldura já terminou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function segredo() {\n  let codigo = 42\n}\nsegredo()\ncodigo"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Depois de segredo() terminar, ler codigo fora faz o quê?",
        "opcoes": [
          "Responde 42",
          "Responde undefined",
          "Dá ReferenceError"
        ],
        "correta": 2,
        "explicacao": "Não há uma variável global codigo; tentar lê-la dá ReferenceError."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Na bilheteria, crie acrescer(base) com ajuste = 3 dentro; fora ajuste = 20. Guarde total = acrescer(8).",
        "toque": "Na bilheteria, crie acrescer(base) com ajuste = 3 dentro; fora ajuste = 20. Guarde total = acrescer(8)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "acrescer",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 3
                  },
                  {
                    "args": [
                      8
                    ],
                    "esperado": 11
                  },
                  {
                    "args": [
                      -3
                    ],
                    "esperado": 0
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "ajuste",
                "valor": 20
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 11
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual ajuste entra na conta de dentro?",
        "dica": "A variável dentro da função tem prioridade ali."
      },
      "falaAoConcluir": {
        "texto": "Dentro usou 3; a global continuou 20.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let ajuste = 20\nfunction acrescer(base) {\n  let ajuste = 3\n  return base + ajuste\n}\nlet total = acrescer(8)"
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

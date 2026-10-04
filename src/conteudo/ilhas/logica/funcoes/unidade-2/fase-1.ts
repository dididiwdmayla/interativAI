/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U2_F1: FasePratica = {
  "id": "logica-funcoes-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u2",
  "titulo": "O nome de dentro e o valor de fora",
  "conceitos": [
    "parametro-argumento",
    "return-js"
  ],
  "revisa": [
    "funcao-js",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "funcao-js",
    "operacoes-aritmeticas"
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
      "nome": "O nome de dentro e o valor de fora",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "O parâmetro preco é o nome usado dentro da função. O argumento é o valor entregue na chamada: precoComDesconto(100) entrega 100 para preco.",
      "expressao": "apontando"
    },
    {
      "texto": "return devolve o resultado a quem chamou e encerra a função. Rebobine: preco entra na moldura; a faixa \"devolve\" mostra o valor que sai.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie precoComDesconto(preco) devolvendo preco * 0.9. Chame com 100 e guarde total.",
        "toque": "Crie precoComDesconto(preco) devolvendo preco * 0.9. Chame com 100 e guarde total."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "precoComDesconto",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      100
                    ],
                    "esperado": 90
                  },
                  {
                    "args": [
                      50
                    ],
                    "esperado": 45
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 90
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
        "pergunta": "Qual nome existe dentro e qual valor entra?",
        "dica": "Escreva preco nos parênteses da declaração e 100 nos da chamada.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Escreva preco nos parênteses da declaração e 100 nos da chamada."
        },
        "solucao": {
          "fala": "100 é argumento; preco é parâmetro. O retorno 90 foi guardado em total.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function precoComDesconto(preco) {\n  return preco * 0.9\n}\nlet total = precoComDesconto(100)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "100 é argumento; preco é parâmetro. O retorno 90 foi guardado em total.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function precoComDesconto(preco) {\n  return preco * 0.9\n}\nlet total = precoComDesconto(100)"
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
        "mouse": "Chame a mesma função com um valor guardado em etiqueta = 50. Guarde total.",
        "toque": "Chame a mesma função com um valor guardado em etiqueta = 50. Guarde total."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 45
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O nome de fora precisa ser preco?",
        "dica": "A chamada entrega o valor da variável, não seu nome.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A chamada entrega o valor da variável, não seu nome."
        },
        "solucao": {
          "fala": "etiqueta entregou 50 para preco; nomes diferentes, valor transferido.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let etiqueta = 50\nlet total = precoComDesconto(etiqueta)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "etiqueta entregou 50 para preco; nomes diferentes, valor transferido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let etiqueta = 50\nlet total = precoComDesconto(etiqueta)"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "precoComDesconto(50) devolve quanto, usando return preco * 0.9?",
        "opcoes": [
          "45",
          "50",
          "undefined"
        ],
        "correta": 0,
        "explicacao": "O parâmetro recebe 50 e return devolve 45."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No cinema, crie somar(a, b) e guarde total = somar(7, 5). Deve funcionar também com zero e negativos.",
        "toque": "No cinema, crie somar(a, b) e guarde total = somar(7, 5). Deve funcionar também com zero e negativos."
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
                      0,
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      7,
                      5
                    ],
                    "esperado": 12
                  },
                  {
                    "args": [
                      -2,
                      5
                    ],
                    "esperado": 3
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 12
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
        "pergunta": "A ordem dos argumentos corresponde a quais nomes?",
        "dica": "Cada posição entrega um valor ao parâmetro da mesma posição."
      },
      "falaAoConcluir": {
        "texto": "a recebeu 7 e b recebeu 5; total recebeu o retorno 12.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(a, b) {\n  return a + b\n}\nlet total = somar(7, 5)"
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

/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U1_F2: Fase = {
  "id": "logica-depuracao-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u1",
  "titulo": "A linha da pista e a causa",
  "conceitos": [
    "causa-do-erro"
  ],
  "revisa": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "investigacao.js",
      "codigoInicial": "const pedidos = [{nome: \"chá\"}];\nfor (let i = 0; i <= pedidos.length; i++) {\n  console.log(pedidos[i].nome);\n}"
    }
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "A linha 3 lê .nome de undefined. Hipótese: o índice passa do fim. A causa pode estar na condição da linha 2.",
      "expressao": "curioso"
    },
    {
      "texto": "Leia o índice, o tamanho e a mensagem. Mexer no chute costuma criar outros bugs.",
      "expressao": "curioso"
    }
  ],
  "conclusao": [
    {
      "texto": "Você reproduziu, comparou pistas com uma hipótese e testou o conserto. Investigar com método evita criar bugs novos.",
      "expressao": "curioso"
    }
  ],
  "falaFinal": {
    "texto": "Um resultado sem erro também pode estar errado. Confira exemplos e bordas antes de encerrar.",
    "expressao": "curioso"
  },
  "objetivos": [
    {
      "id": "limite-guiado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Execute o programa e leia a falha na linha 3.",
        "toque": "Execute o programa e leia a falha na linha 3."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "TypeError"
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Na última volta, i vale length e não aponta nenhum item.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Na última volta, i vale length e não aponta nenhum item."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A lista termina em length - 1. A linha indicada é onde o problema apareceu.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual linha pode causar a leitura inválida da linha 3?",
        "opcoes": [
          "A linha 2, com <=",
          "Só a linha 3",
          "A chamada console.log"
        ],
        "correta": 0,
        "explicacao": "O <= permite i igual ao tamanho, fora dos índices válidos."
      }
    },
    {
      "id": "limite-conserto",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Teste a hipótese corrigindo o limite do laço.",
        "toque": "Teste a hipótese corrigindo o limite do laço."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "saida",
            "igual": [
              "chá"
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Use < no limite; não esconda o erro removendo o console.log.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use < no limite; não esconda o erro removendo o console.log."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const pedidos = [{nome: \"chá\"}];\nfor (let i = 0; i < pedidos.length; i++) {\n  console.log(pedidos[i].nome);\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Você corrigiu a causa, mantendo o pedido de mostrar todos os nomes.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const pedidos = [{nome: \"chá\"}];\nfor (let i = 0; i < pedidos.length; i++) {\n  console.log(pedidos[i].nome);\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "nome-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Troque o programa por console.log(saldo); execute e leia a mensagem.",
        "toque": "Troque o programa por console.log(saldo); execute e leia a mensagem."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "ReferenceError"
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Um nome existe só depois da declaração e no alcance dela."
      },
      "falaAoConcluir": {
        "texto": "ReferenceError: procure declaração, grafia e escopo.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "console.log(saldo);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "nome-conserto",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Declare saldo com 0 antes de mostrar e teste novamente.",
        "toque": "Declare saldo com 0 antes de mostrar e teste novamente."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "saida",
            "igual": [
              "0"
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Onde saldo precisa existir antes de ser lido?"
      },
      "falaAoConcluir": {
        "texto": "Sem chute: a declaração resolveu a indisponibilidade.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const saldo = 0;\nconsole.log(saldo);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "sintaxe-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Execute const soma = (2 + 3; e leia o erro de escrita.",
        "toque": "Execute const soma = (2 + 3; e leia o erro de escrita."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "SyntaxError"
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Compare os parênteses que abrem e fecham."
      },
      "falaAoConcluir": {
        "texto": "SyntaxError acontece antes de executar as linhas.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const soma = (2 + 3;"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "sintaxe-conserto",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Feche a conta e mostre soma no Console.",
        "toque": "Feche a conta e mostre soma no Console."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 5
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Um parêntese aberto precisa de seu fechamento."
      },
      "falaAoConcluir": {
        "texto": "A escrita e o resultado foram conferidos.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const soma = (2 + 3);\nconsole.log(soma);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ]
};

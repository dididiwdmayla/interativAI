/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U4_F2: Fase = {
  "id": "logica-depuracao-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u4",
  "titulo": "Tipo e alcance na pausa",
  "conceitos": [
    "escopo-na-pausa"
  ],
  "revisa": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso",
    "passar-por-cima",
    "entrar-e-sair",
    "retorno-no-depurador",
    "observar-expressoes"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso",
    "passar-por-cima",
    "entrar-e-sair",
    "retorno-no-depurador",
    "observar-expressoes"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "pontos-de-parada",
    "controles-depurador",
    "painel-escopo",
    "painel-observar",
    "pilha-de-chamadas"
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
      "codigoInicial": "function liberar(codigo) {\n  return codigo === 7;\n}\nconst acesso = liberar(\"7\");\nconsole.log(acesso);"
    }
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "A mesma aparência pode esconder tipos diferentes: \"7\" é texto e 7 é número. Observe typeof junto com a comparação.",
      "expressao": "curioso"
    },
    {
      "texto": "No Escopo, Local e Script podem ter nomes iguais. O mais próximo é o lido naquela função; alterar a cópia local não altera a de fora.",
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
      "id": "tipo-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pause no return de liberar e observe typeof codigo e codigo === 7.",
        "toque": "Pause no return de liberar e observe typeof codigo e codigo === 7."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 2
          },
          {
            "tipo": "observou",
            "expressao": "typeof codigo",
            "valor": "string"
          },
          {
            "tipo": "observou",
            "expressao": "codigo === 7",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "O parâmetro aparece em Local; observe o tipo antes de decidir converter.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O parâmetro aparece em Local; observe o tipo antes de decidir converter."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "alternarPontoDeParada",
              "linha": 2
            },
            {
              "tipo": "observar",
              "expressao": "typeof codigo"
            },
            {
              "tipo": "observar",
              "expressao": "codigo === 7"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O texto \"7\" falha na igualdade estrita com o número 7.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 2
        },
        {
          "tipo": "observar",
          "expressao": "typeof codigo"
        },
        {
          "tipo": "observar",
          "expressao": "codigo === 7"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "tipo-conserto",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome, retire o ponto e aceite códigos numéricos em texto ou número.",
        "toque": "Retome, retire o ponto e aceite códigos numéricos em texto ou número."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "liberar",
            "casos": [
              {
                "args": [
                  "7"
                ],
                "esperado": true
              },
              {
                "args": [
                  7
                ],
                "esperado": true
              },
              {
                "args": [
                  "8"
                ],
                "esperado": false
              },
              {
                "args": [
                  ""
                ],
                "esperado": false
              },
              {
                "args": [
                  "007"
                ],
                "esperado": true
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Converta explicitamente com Number antes de comparar.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Converta explicitamente com Number antes de comparar."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "controlarDepurador",
              "controle": "retomar"
            },
            {
              "tipo": "alternarPontoDeParada",
              "linha": 2
            },
            {
              "tipo": "definirSnippet",
              "codigo": "function liberar(codigo) {\n  return Number(codigo) === 7;\n}\nconst acesso = liberar(\"7\");\nconsole.log(acesso);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A intenção foi preservada sem trocar === por uma comparação ambígua.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function liberar(codigo) {\n  return Number(codigo) === 7;\n}\nconst acesso = liberar(\"7\");\nconsole.log(acesso);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "escopo-guiado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Investigue creditar: pause na linha 5 e observe saldo local e valor.",
        "toque": "Investigue creditar: pause na linha 5 e observe saldo local e valor."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 5
          },
          {
            "tipo": "observou",
            "expressao": "saldo",
            "valor": 5
          },
          {
            "tipo": "observou",
            "expressao": "valor",
            "valor": 5
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Compare saldo em Local com saldo em Script no painel Escopo.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Compare saldo em Local com saldo em Script no painel Escopo."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  let saldo = 0;\n  saldo += valor;\n  return saldo;\n}\ncreditar(5);\nconsole.log(saldo);"
            },
            {
              "tipo": "alternarPontoDeParada",
              "linha": 5
            },
            {
              "tipo": "observar",
              "expressao": "saldo"
            },
            {
              "tipo": "observar",
              "expressao": "valor"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Local tem saldo=5; Script tem saldo=0. O nome duplicado escondeu a caixinha externa.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  let saldo = 0;\n  saldo += valor;\n  return saldo;\n}\ncreditar(5);\nconsole.log(saldo);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "observar",
          "expressao": "saldo"
        },
        {
          "tipo": "observar",
          "expressao": "valor"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Dentro de creditar, qual saldo será lido na linha 5?",
        "opcoes": [
          "Só o de Script, que vale 0",
          "O Local, que vale 5",
          "Os dois somados"
        ],
        "correta": 1,
        "explicacao": "O nome local esconde o de fora; o Escopo separa as duas caixinhas."
      }
    },
    {
      "id": "escopo-conserto",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome e remova a declaração local que esconde o saldo externo; execute.",
        "toque": "Retome e remova a declaração local que esconde o saldo externo; execute."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "valorVariavel",
            "nome": "saldo",
            "valor": 5
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "A função deve atualizar a variável de fora, sem criar outra com o mesmo nome.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A função deve atualizar a variável de fora, sem criar outra com o mesmo nome."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "controlarDepurador",
              "controle": "retomar"
            },
            {
              "tipo": "alternarPontoDeParada",
              "linha": 5
            },
            {
              "tipo": "definirSnippet",
              "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  saldo += valor;\n  return saldo;\n}\ncreditar(5);\nconsole.log(saldo);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A causa estava na declaração, não na linha que imprimia 0.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  saldo += valor;\n  return saldo;\n}\ncreditar(5);\nconsole.log(saldo);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "escopo-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue o crédito de 9: compare saldo e valor no momento antes do return.",
        "toque": "Investigue o crédito de 9: compare saldo e valor no momento antes do return."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 5
          },
          {
            "tipo": "observou",
            "expressao": "saldo",
            "valor": 9
          },
          {
            "tipo": "observou",
            "expressao": "valor",
            "valor": 9
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Os nomes observados permanecem. Confira Local e Script com a nova entrada."
      },
      "falaAoConcluir": {
        "texto": "O saldo de fora continuaria 0; a evidência se repete.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  let saldo = 0;\n  saldo += valor;\n  return saldo;\n}\ncreditar(9);\nconsole.log(saldo);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "escopo-sozinho-conserto",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Retome e faça o crédito atualizar saldo de fora para 9.",
        "toque": "Retome e faça o crédito atualizar saldo de fora para 9."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "valorVariavel",
            "nome": "saldo",
            "valor": 9
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Remova só a declaração que esconde a variável necessária."
      },
      "falaAoConcluir": {
        "texto": "Um ajuste específico, apoiado pela hipótese, evita mudar outras regras.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let saldo = 0;\nfunction creditar(valor) {\n  saldo += valor;\n  return saldo;\n}\ncreditar(9);\nconsole.log(saldo);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "tipo-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue liberar(\"007\"): compare tipo e igualdade antes de editar.",
        "toque": "Investigue liberar(\"007\"): compare tipo e igualdade antes de editar."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 2
          },
          {
            "tipo": "observou",
            "expressao": "typeof codigo",
            "valor": "string"
          },
          {
            "tipo": "observou",
            "expressao": "codigo === 7",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "O programa de teste voltou ao defeito; as expressões ainda estão no Observar."
      },
      "falaAoConcluir": {
        "texto": "A hipótese de diferença de tipo foi confirmada novamente.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function liberar(codigo) {\n  return codigo === 7;\n}\nconst acesso = liberar(\"007\");\nconsole.log(acesso);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 2
        },
        {
          "tipo": "observar",
          "expressao": "typeof codigo"
        },
        {
          "tipo": "observar",
          "expressao": "codigo === 7"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "tipo-sozinho-conserto",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Corrija liberar e confirme entradas válidas, inválidas e vazias.",
        "toque": "Corrija liberar e confirme entradas válidas, inválidas e vazias."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "liberar",
            "casos": [
              {
                "args": [
                  "7"
                ],
                "esperado": true
              },
              {
                "args": [
                  7
                ],
                "esperado": true
              },
              {
                "args": [
                  "sete"
                ],
                "esperado": false
              },
              {
                "args": [
                  ""
                ],
                "esperado": false
              },
              {
                "args": [
                  "007"
                ],
                "esperado": true
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Conversão explícita e casos diferentes confirmam o conserto."
      },
      "falaAoConcluir": {
        "texto": "Você comparou valor, tipo e alcance em vez de mexer no chute.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function liberar(codigo) {\n  return Number(codigo) === 7;\n}\nconst acesso = liberar(\"007\");\nconsole.log(acesso);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ]
};

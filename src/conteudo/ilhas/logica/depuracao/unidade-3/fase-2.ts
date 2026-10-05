/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U3_F2: Fase = {
  "id": "logica-depuracao-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u3",
  "titulo": "Imprimir não devolve",
  "conceitos": [
    "retorno-no-depurador"
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
    "entrar-e-sair"
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
    "entrar-e-sair"
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
      "codigoInicial": "function dobro(n) {\n  const resultado = n * 2;\n  console.log(resultado);\n}\nconst entrega = dobro(3);\nconsole.log(entrega);"
    }
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "dobro mostra 6, mas entrega fica undefined. Hipótese: a função calcula e imprime, sem devolver.",
      "expressao": "curioso"
    },
    {
      "texto": "O Escopo Local mostra resultado dentro da chamada. Depois de Sair, essa variável some; só o return entrega algo a quem chamou.",
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
      "id": "retorno-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Entre em dobro, avance e observe resultado. Saia e confira entrega === undefined.",
        "toque": "Entre em dobro, avance e observe resultado. Saia e confira entrega === undefined."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "usouControle",
            "controle": "entrar"
          },
          {
            "tipo": "observou",
            "expressao": "resultado",
            "valor": 6
          },
          {
            "tipo": "usouControle",
            "controle": "sair"
          },
          {
            "tipo": "observou",
            "expressao": "entrega === undefined",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Pare na linha 5; entre e avance. Compare o valor local com a entrega depois de Sair.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Pare na linha 5; entre e avance. Compare o valor local com a entrega depois de Sair."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "alternarPontoDeParada",
              "linha": 5
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "entrar"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "passar-por-cima"
            },
            {
              "tipo": "observar",
              "expressao": "resultado"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "sair"
            },
            {
              "tipo": "observar",
              "expressao": "entrega === undefined"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O cálculo existe na função, mas não foi devolvido.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "entrar"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "passar-por-cima"
        },
        {
          "tipo": "observar",
          "expressao": "resultado"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "sair"
        },
        {
          "tipo": "observar",
          "expressao": "entrega === undefined"
        }
      ]
    },
    {
      "id": "return-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome, tire o ponto e conserte a devolução de dobro.",
        "toque": "Retome, tire o ponto e conserte a devolução de dobro."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
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
                  3
                ],
                "esperado": 6
              },
              {
                "args": [
                  -4
                ],
                "esperado": -8
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "return faz o valor atravessar a fronteira da função.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "return faz o valor atravessar a fronteira da função."
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
              "codigo": "function dobro(n) {\n  const resultado = n * 2;\n  return resultado;\n}\nconst entrega = dobro(3);\nconsole.log(entrega);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A função agora entrega valores; imprimir era só mostrar.",
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
          "codigo": "function dobro(n) {\n  const resultado = n * 2;\n  return resultado;\n}\nconst entrega = dobro(3);\nconsole.log(entrega);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "retorno-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue a mesma falha com n = -4. Observe o valor local e a entrega.",
        "toque": "Investigue a mesma falha com n = -4. Observe o valor local e a entrega."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "usouControle",
            "controle": "entrar"
          },
          {
            "tipo": "observou",
            "expressao": "resultado",
            "valor": -8
          },
          {
            "tipo": "usouControle",
            "controle": "sair"
          },
          {
            "tipo": "observou",
            "expressao": "entrega === undefined",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "A observação permanece; procure a fronteira entre cálculo e devolução."
      },
      "falaAoConcluir": {
        "texto": "A pista se repetiu com negativo; a hipótese continua válida.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function dobro(n) {\n  const resultado = n * 2;\n  console.log(resultado);\n}\nconst entrega = dobro(-4);\nconsole.log(entrega);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "entrar"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "passar-por-cima"
        },
        {
          "tipo": "observar",
          "expressao": "resultado"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "sair"
        },
        {
          "tipo": "observar",
          "expressao": "entrega === undefined"
        }
      ]
    },
    {
      "id": "return-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Retome e conserte a entrega; teste zero e negativos.",
        "toque": "Retome e conserte a entrega; teste zero e negativos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
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
                  -4
                ],
                "esperado": -8
              },
              {
                "args": [
                  7
                ],
                "esperado": 14
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Não declare uma global no lugar de devolver: cada chamada precisa de sua resposta."
      },
      "falaAoConcluir": {
        "texto": "Cada chamada tem seus locais e sua devolução, como no JavaScript real.",
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
          "codigo": "function dobro(n) {\n  const resultado = n * 2;\n  return resultado;\n}\nconst entrega = dobro(-4);\nconsole.log(entrega);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ]
};

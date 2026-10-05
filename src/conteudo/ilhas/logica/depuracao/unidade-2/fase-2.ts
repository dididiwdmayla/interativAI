/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U2_F2: Fase = {
  "id": "logica-depuracao-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u2",
  "titulo": "O índice ultrapassa a lista",
  "conceitos": [
    "bug-silencioso"
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
    "hipotese-de-bug"
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
    "hipotese-de-bug"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "pontos-de-parada",
    "controles-depurador",
    "painel-escopo",
    "painel-observar"
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
      "codigoInicial": "function somar(valores) {\n  let total = 0;\n  for (let i = 0; i <= valores.length; i++) {\n    total += valores[i];\n  }\n  return total;\n}\nconst resultado = somar([4, 6]);"
    }
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "somar([4, 6]) deveria dar 10. Não aparece erro vermelho, mas o resultado é NaN. Hipótese: o laço lê além do fim.",
      "expressao": "curioso"
    },
    {
      "texto": "Código que roda sem erro pode produzir uma resposta errada. Retomar vai ao próximo ponto, inclusive na próxima volta do laço.",
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
      "id": "indice-guiado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pause na soma e retome até i valer o tamanho da lista. Observe i e valores.length.",
        "toque": "Pause na soma e retome até i valer o tamanho da lista. Observe i e valores.length."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pontoDeParada",
            "linha": 4
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 4
          },
          {
            "tipo": "observou",
            "expressao": "i",
            "valor": 2
          },
          {
            "tipo": "observou",
            "expressao": "valores.length",
            "valor": 2
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Ponto na linha 4. Observe os dois valores e retome duas vezes.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Ponto na linha 4. Observe os dois valores e retome duas vezes."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "alternarPontoDeParada",
              "linha": 4
            },
            {
              "tipo": "observar",
              "expressao": "i"
            },
            {
              "tipo": "observar",
              "expressao": "valores.length"
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "retomar"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "retomar"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "i e length valem 2; os índices válidos eram 0 e 1.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "observar",
          "expressao": "i"
        },
        {
          "tipo": "observar",
          "expressao": "valores.length"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        }
      ],
      "previsao": {
        "pergunta": "Antes de somar na terceira pausa, qual índice aparece?",
        "opcoes": [
          "2, fora da lista",
          "1, o último válido",
          "0, sempre reinicia"
        ],
        "correta": 0,
        "explicacao": "O <= deixa i chegar a 2; esse item não existe."
      }
    },
    {
      "id": "soma-guiada",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome, retire o ponto e conserte somar. Confirme vazio e entradas diferentes.",
        "toque": "Retome, retire o ponto e conserte somar. Confirme vazio e entradas diferentes."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "somar",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    4,
                    6
                  ]
                ],
                "esperado": 10
              },
              {
                "args": [
                  [
                    -2,
                    2
                  ]
                ],
                "esperado": 0
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Use < para não ler valores[length].",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use < para não ler valores[length]."
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
              "linha": 4
            },
            {
              "tipo": "definirSnippet",
              "codigo": "function somar(valores) {\n  let total = 0;\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n  return total;\n}\nconst resultado = somar([4, 6]);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Não basta sumir o vermelho: a função devolve os totais esperados.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(valores) {\n  let total = 0;\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n  return total;\n}\nconst resultado = somar([4, 6]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "indice-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Repita a investigação com [7]: compare i e length na volta que não deveria acontecer.",
        "toque": "Repita a investigação com [7]: compare i e length na volta que não deveria acontecer."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pontoDeParada",
            "linha": 4
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 4
          },
          {
            "tipo": "observou",
            "expressao": "i",
            "valor": 1
          },
          {
            "tipo": "observou",
            "expressao": "valores.length",
            "valor": 1
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Reutilize as observações; um item só tem índice 0."
      },
      "falaAoConcluir": {
        "texto": "A borda de um item confirma a mesma causa.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(valores) {\n  let total = 0;\n  for (let i = 0; i <= valores.length; i++) {\n    total += valores[i];\n  }\n  return total;\n}\nconst resultado = somar([7]);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        }
      ]
    },
    {
      "id": "soma-sozinha",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conserte e teste somar com vazio, um item e negativos.",
        "toque": "Conserte e teste somar com vazio, um item e negativos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "somar",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    7
                  ]
                ],
                "esperado": 7
              },
              {
                "args": [
                  [
                    -3,
                    8
                  ]
                ],
                "esperado": 5
              }
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Retome até terminar; depois edite e execute de novo."
      },
      "falaAoConcluir": {
        "texto": "A hipótese resolveu casos diferentes, sem uma resposta fixa.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function somar(valores) {\n  let total = 0;\n  for (let i = 0; i < valores.length; i++) {\n    total += valores[i];\n  }\n  return total;\n}\nconst resultado = somar([7]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ]
};

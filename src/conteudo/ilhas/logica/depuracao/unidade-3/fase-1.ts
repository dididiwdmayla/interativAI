/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U3_F1: Fase = {
  "id": "logica-depuracao-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u3",
  "titulo": "Entre na troca de cor",
  "conceitos": [
    "passar-por-cima",
    "entrar-e-sair"
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
    "bug-silencioso"
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
    "bug-silencioso"
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
    "pilha-de-chamadas",
    "cena",
    "ficha-dispositivo",
    "velocidade-simulacao"
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
      "codigoInicial": "function proxima(cor) {\n  const ordem = [\"verde\", \"amarelo\", \"vermelho\"];\n  const i = ordem.indexOf(cor);\n  return ordem[(i + 2) % ordem.length];\n}\nconst cor = proxima(\"verde\");\nsinal.mudar(cor);\nesperar(1000);"
    }
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "O sinal deveria ir de verde a amarelo, mas pula direto ao vermelho. Hipótese: a função avança posições demais.",
      "expressao": "curioso"
    },
    {
      "texto": "Passar por cima roda a chamada inteira; Entrar mostra as linhas da função; Sair volta para quem chamou. A Pilha de chamadas mostra esse caminho.",
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
      "id": "chamada-guiada",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pause na chamada da linha 6 e passe por cima; observe cor ao voltar.",
        "toque": "Pause na chamada da linha 6 e passe por cima; observe cor ao voltar."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "usouControle",
            "controle": "passar-por-cima"
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 7
          },
          {
            "tipo": "observou",
            "expressao": "cor",
            "valor": "vermelho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Passar por cima roda proxima inteira e volta à próxima linha de fora.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Passar por cima roda proxima inteira e volta à próxima linha de fora."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "alternarPontoDeParada",
              "linha": 6
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "passar-por-cima"
            },
            {
              "tipo": "observar",
              "expressao": "cor"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A chamada terminou sem mostrar seu cálculo. Agora vamos investigar por dentro.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "passar-por-cima"
        },
        {
          "tipo": "observar",
          "expressao": "cor"
        }
      ],
      "previsao": {
        "pergunta": "Onde pôr o ponto para escolher como seguir a chamada?",
        "opcoes": [
          "Na linha 6, antes da chamada",
          "Só depois da linha 8",
          "No fim da execução"
        ],
        "correta": 0,
        "explicacao": "Na linha 6 você pode escolher Passar por cima ou Entrar antes de a chamada rodar."
      }
    },
    {
      "id": "passos-guiados",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pause na linha 6; entre, avance duas linhas e observe i. Saia e observe cor.",
        "toque": "Pause na linha 6; entre, avance duas linhas e observe i. Saia e observe cor."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 2
          },
          {
            "tipo": "usouControle",
            "controle": "entrar"
          },
          {
            "tipo": "usouControle",
            "controle": "passar-por-cima"
          },
          {
            "tipo": "observou",
            "expressao": "i",
            "valor": 0
          },
          {
            "tipo": "usouControle",
            "controle": "sair"
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 7
          },
          {
            "tipo": "observou",
            "expressao": "cor",
            "valor": "vermelho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Use Entrar, duas vezes Passar por cima e Sair; observe i antes do return e cor ao voltar.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use Entrar, duas vezes Passar por cima e Sair; observe i antes do return e cor ao voltar."
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
              "linha": 6
            },
            {
              "tipo": "alternarPontoDeParada",
              "linha": 6
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
              "tipo": "controlarDepurador",
              "controle": "passar-por-cima"
            },
            {
              "tipo": "observar",
              "expressao": "i"
            },
            {
              "tipo": "controlarDepurador",
              "controle": "sair"
            },
            {
              "tipo": "observar",
              "expressao": "cor"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "i era 0 e a função devolveu vermelho. +2 pulou a posição do amarelo.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
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
          "tipo": "controlarDepurador",
          "controle": "passar-por-cima"
        },
        {
          "tipo": "observar",
          "expressao": "i"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "sair"
        },
        {
          "tipo": "observar",
          "expressao": "cor"
        }
      ],
      "previsao": {
        "pergunta": "Se passar por cima da linha 6, onde a função fica visível?",
        "opcoes": [
          "Linha 2, dentro dela",
          "Em nenhuma chamada",
          "Na linha 7, já terminou"
        ],
        "correta": 2,
        "explicacao": "Passar por cima executa toda proxima e pausa na próxima linha de fora."
      },
      "apresentar": [
        "pilha-de-chamadas"
      ]
    },
    {
      "id": "cor-guiada",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome, retire o ponto e conserte a função; o sinal deve mostrar amarelo.",
        "toque": "Retome, retire o ponto e conserte a função; o sinal deve mostrar amarelo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "proxima",
            "casos": [
              {
                "args": [
                  "verde"
                ],
                "esperado": "amarelo"
              },
              {
                "args": [
                  "amarelo"
                ],
                "esperado": "vermelho"
              },
              {
                "args": [
                  "vermelho"
                ],
                "esperado": "verde"
              }
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "sinal",
            "propriedade": "cor",
            "valor": "amarelo",
            "noTempo": 500
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Uma posição adiante usa i + 1; confirme as três transições.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Uma posição adiante usa i + 1; confirme as três transições."
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
              "linha": 6
            },
            {
              "tipo": "definirSnippet",
              "codigo": "function proxima(cor) {\n  const ordem = [\"verde\", \"amarelo\", \"vermelho\"];\n  const i = ordem.indexOf(cor);\n  return ordem[(i + 1) % ordem.length];\n}\nconst cor = proxima(\"verde\");\nsinal.mudar(cor);\nesperar(1000);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A cena e os casos conferem a mesma regra.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function proxima(cor) {\n  const ordem = [\"verde\", \"amarelo\", \"vermelho\"];\n  const i = ordem.indexOf(cor);\n  return ordem[(i + 1) % ordem.length];\n}\nconst cor = proxima(\"verde\");\nsinal.mudar(cor);\nesperar(1000);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "passos-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue o salto partindo de amarelo. Entre, avance, observe o índice e saia para conferir cor.",
        "toque": "Investigue o salto partindo de amarelo. Entre, avance, observe o índice e saia para conferir cor."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pausouNaLinha",
            "linha": 2
          },
          {
            "tipo": "usouControle",
            "controle": "entrar"
          },
          {
            "tipo": "usouControle",
            "controle": "passar-por-cima"
          },
          {
            "tipo": "observou",
            "expressao": "i",
            "valor": 1
          },
          {
            "tipo": "usouControle",
            "controle": "sair"
          },
          {
            "tipo": "observou",
            "expressao": "cor",
            "valor": "verde"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Siga a chamada até sua devolução. Qual cor deveria vir após amarelo?"
      },
      "falaAoConcluir": {
        "texto": "O mesmo salto aparece em outra entrada; não é só um desenho errado.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function proxima(cor) {\n  const ordem = [\"verde\", \"amarelo\", \"vermelho\"];\n  const i = ordem.indexOf(cor);\n  return ordem[(i + 2) % ordem.length];\n}\nconst cor = proxima(\"amarelo\");\nsinal.mudar(cor);\nesperar(1000);"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
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
          "tipo": "controlarDepurador",
          "controle": "passar-por-cima"
        },
        {
          "tipo": "observar",
          "expressao": "i"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "sair"
        },
        {
          "tipo": "observar",
          "expressao": "cor"
        }
      ]
    },
    {
      "id": "cor-sozinha",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conserte a transição de amarelo a vermelho e teste as demais cores.",
        "toque": "Conserte a transição de amarelo a vermelho e teste as demais cores."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "proxima",
            "casos": [
              {
                "args": [
                  "verde"
                ],
                "esperado": "amarelo"
              },
              {
                "args": [
                  "amarelo"
                ],
                "esperado": "vermelho"
              },
              {
                "args": [
                  "vermelho"
                ],
                "esperado": "verde"
              }
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "sinal",
            "propriedade": "cor",
            "valor": "vermelho",
            "noTempo": 500
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Confira a função por entradas distintas, não só a cor final."
      },
      "falaAoConcluir": {
        "texto": "Você seguiu o valor até o instante do defeito e confirmou o ajuste.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 6
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function proxima(cor) {\n  const ordem = [\"verde\", \"amarelo\", \"vermelho\"];\n  const i = ordem.indexOf(cor);\n  return ordem[(i + 1) % ordem.length];\n}\nconst cor = proxima(\"amarelo\");\nsinal.mudar(cor);\nesperar(1000);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "cena": {
    "id": "depuracao-esquina",
    "titulo": "O amarelo foi pulado",
    "ambiente": "esquina",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "ceu",
        "x": 0,
        "y": 0,
        "altura": 110
      },
      {
        "peca": "parede",
        "x": 5,
        "y": 27,
        "largura": 74,
        "altura": 90,
        "variante": "tijolos"
      },
      {
        "peca": "janela",
        "x": 17,
        "y": 40,
        "largura": 26,
        "altura": 32
      },
      {
        "peca": "parede",
        "x": 226,
        "y": 10,
        "largura": 87,
        "altura": 107
      },
      {
        "peca": "rua",
        "x": 0,
        "y": 103,
        "largura": 320,
        "altura": 97
      }
    ],
    "dispositivos": [
      {
        "id": "sinal",
        "tipo": "semaforo",
        "x": 155,
        "y": 20
      }
    ],
    "linhaDoTempo": []
  }
};

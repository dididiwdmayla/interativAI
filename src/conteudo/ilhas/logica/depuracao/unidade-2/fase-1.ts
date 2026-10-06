/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U2_F1: Fase = {
  "id": "logica-depuracao-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u2",
  "titulo": "O portão ficou aberto",
  "conceitos": [
    "ponto-de-parada",
    "hipotese-de-bug"
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
    "causa-do-erro"
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
    "causa-do-erro"
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
      "codigoInicial": "let deveFechar = true;\nportao.abrir();\nesperar(1000);\nif (deveFechar = false) {\n  portao.fechar();\n}\nconsole.log(deveFechar);"
    }
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "introducao": [
    {
      "texto": "O portão abre e nunca fecha. Hipótese: a decisão de fechar foi alterada. Pause e compare o valor com o true declarado.",
      "expressao": "curioso"
    },
    {
      "texto": "Um ponto para ANTES da linha. Escopo mostra valores; Observar guarda expressões. console.log ajuda, mas o depurador dispensa mudar o código.",
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
      "id": "pausa-guiada",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Marque a linha 7, adicione deveFechar em Observar e execute.",
        "toque": "Marque a linha 7, adicione deveFechar em Observar e execute."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pontoDeParada",
            "linha": 7
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 7
          },
          {
            "tipo": "observou",
            "expressao": "deveFechar",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Clique ou toque no número 7. Em Observar adicione deveFechar; execute.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Clique ou toque no número 7. Em Observar adicione deveFechar; execute."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "alternarPontoDeParada",
              "linha": 7
            },
            {
              "tipo": "observar",
              "expressao": "deveFechar"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "deveFechar virou false: = atribui, não compara. A pista confirma que a decisão mudou.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 7
        },
        {
          "tipo": "observar",
          "expressao": "deveFechar"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Para olhar o valor antes de console.log, onde pôr o ponto?",
        "opcoes": [
          "Linha 1, antes de declarar",
          "Linha 7, antes de mostrar",
          "Depois do programa"
        ],
        "correta": 1,
        "explicacao": "O ponto na linha 7 pausa antes de console.log, com o valor já alterado."
      },
      "apresentar": [
        "pontos-de-parada",
        "controles-depurador",
        "painel-escopo",
        "painel-observar"
      ]
    },
    {
      "id": "corrigir-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Retome, tire o ponto e corrija a comparação; o portão deve fechar após 1 segundo.",
        "toque": "Retome, tire o ponto e corrija a comparação; o portão deve fechar após 1 segundo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "portao",
            "propriedade": "aberto",
            "valor": false,
            "noTempo": 1100
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Retome antes de editar. Pergunte se deveFechar === true.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Retome antes de editar. Pergunte se deveFechar === true."
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
              "linha": 7
            },
            {
              "tipo": "definirSnippet",
              "codigo": "let deveFechar = true;\nportao.abrir();\nesperar(1000);\nif (deveFechar === true) {\n  portao.fechar();\n}\nconsole.log(deveFechar);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Conserto confirmado: o portão abriu e depois fechou.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 7
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let deveFechar = true;\nportao.abrir();\nesperar(1000);\nif (deveFechar === true) {\n  portao.fechar();\n}\nconsole.log(deveFechar);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "pausa-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue um pedido de fechar após 2 segundos: pause e compare a decisão.",
        "toque": "Investigue um pedido de fechar após 2 segundos: pause e compare a decisão."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pontoDeParada",
            "linha": 7
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 7
          },
          {
            "tipo": "observou",
            "expressao": "deveFechar",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Escolha um instante depois da decisão e compare o que foi declarado com o que ficou."
      },
      "falaAoConcluir": {
        "texto": "A investigação é reproduzível; não depende de um palpite novo a cada tentativa.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let deveFechar = true;\nportao.abrir();\nesperar(2000);\nif (deveFechar = false) {\n  portao.fechar();\n}\nconsole.log(deveFechar);"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 7
        },
        {
          "tipo": "observar",
          "expressao": "deveFechar"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "corrigir-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Retome e conserte o pedido, verificando que abriu e fechou nos instantes certos.",
        "toque": "Retome e conserte o pedido, verificando que abriu e fechou nos instantes certos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "portao",
            "propriedade": "aberto",
            "valor": true,
            "noTempo": 500
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "portao",
            "propriedade": "aberto",
            "valor": false,
            "noTempo": 2500
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "A condição precisa comparar sem mudar a caixinha."
      },
      "falaAoConcluir": {
        "texto": "Testar só o fim não prova a abertura; os dois instantes confirmam o pedido.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        },
        {
          "tipo": "alternarPontoDeParada",
          "linha": 7
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let deveFechar = true;\nportao.abrir();\nesperar(2000);\nif (deveFechar === true) {\n  portao.fechar();\n}\nconsole.log(deveFechar);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "cena": {
    "id": "depuracao-garagem",
    "titulo": "O portão não fecha",
    "ambiente": "garagem",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "parede",
        "x": 0,
        "y": 0
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150
      }
    ],
    "dispositivos": [
      {
        "id": "portao",
        "tipo": "portao",
        "x": 50,
        "y": 65
      }
    ],
    "linhaDoTempo": []
  }
};

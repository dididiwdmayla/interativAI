/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U1_F1: Fase = {
  "id": "logica-depuracao-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-depuracao-u1",
  "titulo": "O vermelho é uma pista",
  "conceitos": [
    "dicionario-de-erros"
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
    "linha-do-tempo",
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
      "codigoInicial": "const pedido = true;\nif (pedido) luz.ligada = true;"
    }
  },
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "apresentar": ["cena", "ficha-dispositivo", "velocidade-simulacao"],
  "introducao": [
    {
      "texto": "Programadores passam muito tempo consertando. Reproduza, forme uma hipótese, olhe as pistas, confirme ou descarte e teste de novo.",
      "expressao": "curioso"
    },
    {
      "texto": "Dicionário: SyntaxError indica escrita inválida; ReferenceError, nome indisponível; TypeError, operação incompatível com o valor.",
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
      "id": "reproduzir",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Execute e leia tipo, mensagem e linha do erro antes de mudar o código.",
        "toque": "Execute e leia tipo, mensagem e linha do erro antes de mudar o código."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "TypeError"
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "TypeError: ligada é somente leitura; a ficha mostra o comando ligar().",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "TypeError: ligada é somente leitura; a ficha mostra o comando ligar()."
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
        "texto": "Erro é pista, não fracasso. O programa parou; você não estragou o computador.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "consertar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confirme a hipótese: use o comando da luz e execute de novo.",
        "toque": "Confirme a hipótese: use o comando da luz e execute de novo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luz",
            "propriedade": "ligada",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Troque a escrita em ligada pelo comando ligar().",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Troque a escrita em ligada pelo comando ligar()."
        },
        "solucao": {
          "fala": "Compare a pista com sua hipótese e teste de novo.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const pedido = true;\nif (pedido) luz.ligar();"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A mensagem mostrou a operação inválida. A luz agora responde ao pedido.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const pedido = true;\nif (pedido) luz.ligar();"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "outro-erro",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Investigue forno.ligado = true: execute antes de consertar.",
        "toque": "Investigue forno.ligado = true: execute antes de consertar."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "TypeError"
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Leia a propriedade e procure o comando na ficha."
      },
      "falaAoConcluir": {
        "texto": "Mesma categoria em outro aparelho; procure o motivo, não decore a linha.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "forno.ligado = true;"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "outro-conserto",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conserte o pedido de ligar o forno e teste de novo.",
        "toque": "Conserte o pedido de ligar o forno e teste de novo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "forno",
            "propriedade": "ligado",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que hipótese esses valores permitem confirmar ou descartar?",
        "dica": "Qual comando muda ligado sem escrever nessa propriedade?"
      },
      "falaAoConcluir": {
        "texto": "A hipótese foi confirmada por um teste.",
        "expressao": "curioso"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "forno.ligar();"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "O que a mensagem TypeError permite concluir?",
        "opcoes": [
          "O computador quebrou",
          "Uma operação não combina com o valor",
          "Todo o programa está errado"
        ],
        "correta": 1,
        "explicacao": "Ela descreve uma operação inválida, como escrever numa propriedade somente leitura."
      }
    }
  ],
  "cena": {
    "id": "depuracao-cozinha",
    "titulo": "A luz não acende",
    "ambiente": "cozinha",
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
        "id": "luz",
        "tipo": "lampada",
        "x": 110,
        "y": 40
      },
      {
        "id": "forno",
        "tipo": "forno",
        "x": 200,
        "y": 100
      }
    ],
    "linhaDoTempo": []
  }
};

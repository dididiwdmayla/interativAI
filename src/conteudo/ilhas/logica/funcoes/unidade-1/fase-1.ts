/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U1_F1: FasePratica = {
  "id": "logica-funcoes-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u1",
  "titulo": "Guardar não é executar",
  "conceitos": [
    "funcao-js",
    "chamada-funcao"
  ],
  "revisa": [
    "console-log",
    "string-js"
  ],
  "prerequisitos": [
    "console-log",
    "string-js"
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
      "nome": "Guardar não é executar",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "function saudar() { } guarda instruções com um nome. Escrever a função não executa seu corpo: a chamada saudar() é que manda executar.",
      "expressao": "apontando"
    },
    {
      "texto": "saudar sem parênteses é a própria função. saudar() executa as instruções. No Console de um site, essa diferença é a mesma.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie saudar() para mostrar \"Bom dia\". Chame duas vezes no Snippet.",
        "toque": "Crie saudar() para mostrar \"Bom dia\". Chame duas vezes no Snippet."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Bom dia",
              "Bom dia"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual parte guarda e qual parte executa?",
        "dica": "Use function para guardar e o nome com () para executar.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use function para guardar e o nome com () para executar."
        },
        "solucao": {
          "fala": "Duas chamadas, duas mensagens. A declaração sozinha não mostrou nada.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function saudar() {\n  console.log(\"Bom dia\")\n}\nsaudar()\nsaudar()"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Duas chamadas, duas mensagens. A declaração sozinha não mostrou nada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function saudar() {\n  console.log(\"Bom dia\")\n}\nsaudar()\nsaudar()"
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
        "mouse": "Declare avisar() com console.log(\"Olá\"), mas rode só avisar sem (). Confira criada = typeof avisar === \"function\".",
        "toque": "Declare avisar() com console.log(\"Olá\"), mas rode só avisar sem (). Confira criada = typeof avisar === \"function\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "criada",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          },
          {
            "tipo": "saida",
            "igual": []
          }
        ]
      },
      "ajudas": {
        "pergunta": "O corpo roda quando só se lê o nome?",
        "dica": "Sem (), você obtém a função, sem executar seu corpo.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Sem (), você obtém a função, sem executar seu corpo."
        },
        "solucao": {
          "fala": "Nenhuma mensagem: avisar é a função; avisar() seria uma chamada.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function avisar() {\n  console.log(\"Olá\")\n}\navisar\nlet criada = typeof avisar === \"function\""
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Nenhuma mensagem: avisar é a função; avisar() seria uma chamada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function avisar() {\n  console.log(\"Olá\")\n}\navisar\nlet criada = typeof avisar === \"function\""
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "O que aparece de console.log ao declarar avisar() e escrever só avisar?",
        "opcoes": [
          "Olá",
          "Nenhuma mensagem",
          "Duas mensagens"
        ],
        "correta": 1,
        "explicacao": "Declarar guarda o corpo; ler o nome sem () não o executa."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No Ateliê Lua, crie despedir() mostrando \"Até amanhã\" e chame três vezes.",
        "toque": "No Ateliê Lua, crie despedir() mostrando \"Até amanhã\" e chame três vezes."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Até amanhã",
              "Até amanhã",
              "Até amanhã"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quem escolhe quantas vezes o corpo roda?",
        "dica": "Cada chamada executa o corpo uma vez."
      },
      "falaAoConcluir": {
        "texto": "Três chamadas reutilizaram as mesmas instruções.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function despedir() {\n  console.log(\"Até amanhã\")\n}\ndespedir()\ndespedir()\ndespedir()"
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
  "missaoDeCampo": "No Console de qualquer site, crie function saudar() { console.log('Olá') } e chame saudar() duas vezes.",
  "falaFinal": {
    "texto": "Criar e chamar funções no Console real funciona como aqui; o palco é a ajuda visual do jogo.",
    "expressao": "feliz"
  }
};

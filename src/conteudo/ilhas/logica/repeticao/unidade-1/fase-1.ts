/* Repetição U1: O forno repete. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U1_F1: FasePratica = {
  "id": "logica-repeticao-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u1",
  "titulo": "O forno repete",
  "conceitos": [
    "while-js",
    "condicao-de-parada"
  ],
  "revisa": [
    "comparacao-js",
    "variavel-let",
    "console-log"
  ],
  "prerequisitos": [
    "comparacao-js",
    "variavel-let",
    "console-log"
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
      "nome": "O forno repete",
      "codigoInicial": "let minutos = 3\n// Repita o aviso até zerar os minutos."
    }
  },
  "introducao": [
    {
      "texto": "No forno, enquanto os minutos forem maiores que zero, uma volta repete só o bloco do while. A condição é testada de novo antes de cada volta.",
      "expressao": "apontando"
    },
    {
      "texto": "Vamos usar Fontes > Snippets para o programa inteiro. No Console, ao digitar {, ele fecha } sozinho, como o Chrome; digitar } passa por cima dela.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "forno-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "No Snippet, conte 3 minutos até 0: mostre \"Ligar forno\", três \"assando\" e \"Pronto\".",
        "toque": "No Snippet, conte 3 minutos até 0: mostre \"Ligar forno\", três \"assando\" e \"Pronto\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "minutos",
            "valor": 0
          },
          {
            "tipo": "saida",
            "igual": [
              "Ligar forno",
              "assando",
              "assando",
              "assando",
              "Pronto"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Crie minutos = 3; enquanto minutos > 0, mostre assando e tire 1 de minutos.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Crie minutos = 3; enquanto minutos > 0, mostre assando e tire 1 de minutos."
        },
        "solucao": {
          "fala": "Rebobine: minutos muda 3, 2, 1, 0. Ligar forno aparece só uma vez: o laço não volta ao início do programa.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let minutos = 3\nconsole.log(\"Ligar forno\")\nwhile (minutos > 0) {\n  console.log(\"assando\")\n  minutos = minutos - 1\n}\nconsole.log(\"Pronto\")"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Rebobine: minutos muda 3, 2, 1, 0. Ligar forno aparece só uma vez: o laço não volta ao início do programa.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let minutos = 3\nconsole.log(\"Ligar forno\")\nwhile (minutos > 0) {\n  console.log(\"assando\")\n  minutos = minutos - 1\n}\nconsole.log(\"Pronto\")"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "apresentar": [
        "snippet"
      ]
    },
    {
      "id": "forno-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Mude o início para 5 minutos e execute no Snippet para conferir.",
        "toque": "Mude o início para 5 minutos e execute no Snippet para conferir."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "minutos",
            "valor": 0
          },
          {
            "tipo": "saida",
            "igual": [
              "Ligar forno",
              "assando",
              "assando",
              "assando",
              "assando",
              "assando",
              "Pronto"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "A condição é testada antes de cada volta: 5, 4, 3, 2 e 1 entram; 0 não entra.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "A condição é testada antes de cada volta: 5, 4, 3, 2 e 1 entram; 0 não entra."
        },
        "solucao": {
          "fala": "Cinco voltas. O passo mostra a memória antes da linha acesa rodar.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let minutos = 5\nconsole.log(\"Ligar forno\")\nwhile (minutos > 0) {\n  console.log(\"assando\")\n  minutos = minutos - 1\n}\nconsole.log(\"Pronto\")"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Cinco voltas. O passo mostra a memória antes da linha acesa rodar.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let minutos = 5\nconsole.log(\"Ligar forno\")\nwhile (minutos > 0) {\n  console.log(\"assando\")\n  minutos = minutos - 1\n}\nconsole.log(\"Pronto\")"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Começando em 5, quantas vezes aparece assando?",
        "opcoes": [
          "4",
          "5",
          "6"
        ],
        "correta": 1,
        "explicacao": "Cada volta tira um minuto; em zero a condição é false."
      }
    },
    {
      "id": "forno-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Agora conte 2 minutos no Snippet, com a mesma abertura e fechamento.",
        "toque": "Agora conte 2 minutos no Snippet, com a mesma abertura e fechamento."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "minutos",
            "valor": 0
          },
          {
            "tipo": "saida",
            "igual": [
              "Ligar forno",
              "assando",
              "assando",
              "Pronto"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Use outro valor inicial e mantenha a condição minutos > 0."
      },
      "falaAoConcluir": {
        "texto": "Duas voltas; só o bloco repetiu.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let minutos = 2\nconsole.log(\"Ligar forno\")\nwhile (minutos > 0) {\n  console.log(\"assando\")\n  minutos = minutos - 1\n}\nconsole.log(\"Pronto\")"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Compare a saída com as caixinhas na linha do tempo. Cada passo mostra a memória antes da linha marcada rodar.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, conte de 1 a 10 com um laço finito. Confira as dez linhas.",
  "falaFinal": {
    "texto": "Use só laços que terminam no Console real; a proteção de passos pertence ao jogo.",
    "expressao": "feliz"
  }
};

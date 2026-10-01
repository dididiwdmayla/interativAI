/* Repetição U2: Uma letra por volta. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U2_F2: FasePratica = {
  "id": "logica-repeticao-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u2",
  "titulo": "Uma letra por volta",
  "conceitos": [
    "for-of-js"
  ],
  "revisa": [
    "string-js",
    "length-texto",
    "console-log"
  ],
  "prerequisitos": [
    "string-js",
    "length-texto",
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
      "nome": "Uma letra por volta",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "O for...of percorre um texto: em cada volta letra guarda a próxima letra. Não precisa escrever o índice nem incrementar letra.",
      "expressao": "apontando"
    },
    {
      "texto": "Nesta zona vamos percorrer palavras, sem listas. Volte o rastro para ver a caixinha letra; voltas registra quantas letras já passaram.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "letras-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Percorra \"LUA\" com for...of, mostre cada letra e conte voltas, começando em 0.",
        "toque": "Percorra \"LUA\" com for...of, mostre cada letra e conte voltas, começando em 0."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "L",
              "U",
              "A"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "voltas",
            "valor": 3
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "for (let letra of \"LUA\") entrega uma letra por volta. Aumente voltas dentro do bloco.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "for (let letra of \"LUA\") entrega uma letra por volta. Aumente voltas dentro do bloco."
        },
        "solucao": {
          "fala": "O palco no rastro mostra letra como L, U e A; voltas chega a 3.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let voltas = 0\nfor (let letra of \"LUA\") {\n  console.log(letra)\n  voltas++\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O palco no rastro mostra letra como L, U e A; voltas chega a 3.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let voltas = 0\nfor (let letra of \"LUA\") {\n  console.log(letra)\n  voltas++\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "letras-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Percorra \"RIO\" com for...of e mostre as três letras.",
        "toque": "Percorra \"RIO\" com for...of e mostre as três letras."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "R",
              "I",
              "O"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "A ordem do texto é preservada. A primeira letra é R; a segunda I; a terceira O.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "A ordem do texto é preservada. A primeira letra é R; a segunda I; a terceira O."
        },
        "solucao": {
          "fala": "Na terceira volta aparece O, não o número 3.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "for (let letra of \"RIO\") {\n  console.log(letra)\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Na terceira volta aparece O, não o número 3.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "for (let letra of \"RIO\") {\n  console.log(letra)\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Ao percorrer RIO, o que aparece na terceira volta?",
        "opcoes": [
          "O",
          "I",
          "3"
        ],
        "correta": 0,
        "explicacao": "Cada volta entrega uma letra na ordem do texto."
      }
    },
    {
      "id": "letras-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Percorra \"SOL\" com for...of. Mostre cada letra e guarde 3 em voltas ao terminar.",
        "toque": "Percorra \"SOL\" com for...of. Mostre cada letra e guarde 3 em voltas ao terminar."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "S",
              "O",
              "L"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "voltas",
            "valor": 3
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Reinicie voltas antes do laço; ela é a contagem, letra é o texto da vez."
      },
      "falaAoConcluir": {
        "texto": "Mesmo mecanismo, outra palavra. O laço para quando acaba o texto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let voltas = 0\nfor (let letra of \"SOL\") {\n  console.log(letra)\n  voltas++\n}"
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

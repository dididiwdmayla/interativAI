/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U3_F3: FasePratica = {
  "id": "logica-funcoes-u3-f3",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u3",
  "titulo": "O contador que esquecia",
  "conceitos": [
    "estado-entre-chamadas"
  ],
  "revisa": [
    "escopo-global-js",
    "escopo-funcao-js",
    "for-js"
  ],
  "prerequisitos": [
    "escopo-global-js",
    "escopo-funcao-js",
    "for-js"
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
      "nome": "O contador que esquecia",
      "codigoInicial": "function registrar() {\n  let visitas = 0\n  visitas++\n  return visitas\n}\nlet primeira = registrar()\nlet segunda = registrar()"
    }
  },
  "introducao": [
    {
      "texto": "Uma variável criada dentro nasce de novo em cada chamada. Para contar visitas entre chamadas, a caixinha precisa continuar existindo fora.",
      "expressao": "apontando"
    },
    {
      "texto": "O balcão tinha visitas = 0 dentro de registrar(): sempre devolvia 1. Mova o contador para Global; a função só aumenta e devolve.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f3-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Conserte registrar(): visitas começa em 0 fora; a função aumenta e devolve. Chame duas vezes e guarde primeira e segunda.",
        "toque": "Conserte registrar(): visitas começa em 0 fora; a função aumenta e devolve. Chame duas vezes e guarde primeira e segunda."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "valorVariavel",
                "nome": "visitas",
                "valor": 2
              },
              {
                "tipo": "valorVariavel",
                "nome": "primeira",
                "valor": 1
              },
              {
                "tipo": "valorVariavel",
                "nome": "segunda",
                "valor": 2
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "funcao"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha sobrevive à chamada?",
        "dica": "O contador precisa estar fora; dentro apenas aumenta.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O contador precisa estar fora; dentro apenas aumenta."
        },
        "solucao": {
          "fala": "A segunda chamada encontrou visitas em 1 e devolveu 2.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let visitas = 0\nfunction registrar() {\n  visitas++\n  return visitas\n}\nlet primeira = registrar()\nlet segunda = registrar()"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A segunda chamada encontrou visitas em 1 e devolveu 2.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let visitas = 0\nfunction registrar() {\n  visitas++\n  return visitas\n}\nlet primeira = registrar()\nlet segunda = registrar()"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f3-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Reinicie visitas = 0 e chame registrar três vezes com for. Guarde ultima.",
        "toque": "Reinicie visitas = 0 e chame registrar três vezes com for. Guarde ultima."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "valorVariavel",
                "nome": "visitas",
                "valor": 3
              },
              {
                "tipo": "valorVariavel",
                "nome": "ultima",
                "valor": 3
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "for"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A cada chamada se cria visitas de novo?",
        "dica": "O contador global continua entre as voltas.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O contador global continua entre as voltas."
        },
        "solucao": {
          "fala": "Três molduras terminaram; a caixinha global guardou a contagem.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let visitas = 0\nlet ultima = 0\nfor (let i = 0; i < 3; i++) {\n  ultima = registrar()\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Três molduras terminaram; a caixinha global guardou a contagem.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let visitas = 0\nlet ultima = 0\nfor (let i = 0; i < 3; i++) {\n  ultima = registrar()\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Com visitas = 0 fora, o terceiro registrar() devolve quanto?",
        "opcoes": [
          "1",
          "3",
          "0"
        ],
        "correta": 1,
        "explicacao": "O contador sobrevive e aumenta uma vez por chamada."
      }
    },
    {
      "id": "f3-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No laboratório, conte coletas: crie coletas = 0 fora e coletar() aumentando e devolvendo. Chame quatro vezes com for.",
        "toque": "No laboratório, conte coletas: crie coletas = 0 fora e coletar() aumentando e devolvendo. Chame quatro vezes com for."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "valorVariavel",
                "nome": "coletas",
                "valor": 4
              },
              {
                "tipo": "valorVariavel",
                "nome": "ultima",
                "valor": 4
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "for"
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "funcao"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Por que criar coletas dentro perderia as anteriores?",
        "dica": "Uma local nasce em cada chamada; a global continua."
      },
      "falaAoConcluir": {
        "texto": "As quatro chamadas compartilharam a caixinha global, que ficou em 4.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let coletas = 0\nfunction coletar() {\n  coletas++\n  return coletas\n}\nlet ultima = 0\nfor (let i = 0; i < 4; i++) {\n  ultima = coletar()\n}"
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
  "missaoDeCampo": "No Console de qualquer site, crie function dobro(n) { return n * 2 } e chame dobro(0), dobro(3) e dobro(7).",
  "falaFinal": {
    "texto": "Criar e chamar funções no Console real funciona como aqui; o palco é a ajuda visual do jogo.",
    "expressao": "feliz"
  }
};

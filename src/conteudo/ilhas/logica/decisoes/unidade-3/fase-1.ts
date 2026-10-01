/*
 * Decisões U3, Fase 1: Se... então.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U3_F1: FasePratica = {
  "id": "logica-decisoes-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u3",
  "titulo": "Se... então",
  "conceitos": [
    "if-js",
    "bloco-js"
  ],
  "revisa": [
    "booleano-js",
    "comparacao-js",
    "console-log"
  ],
  "prerequisitos": [
    "booleano-js",
    "comparacao-js",
    "console-log",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let lojaAberta = true\nlet estoque = 0"
  },
  "introducao": [
    {
      "texto": "Até aqui o Console só respondeu perguntas. Com o if, o programa escolhe o que fazer: o que está entre chaves só roda se a condição for true.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "if-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Escreva um if que mostre \"Aberto!\" quando lojaAberta for true.",
        "toque": "Escreva um if que mostre \"Aberto!\" quando lojaAberta for true."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Aberto!"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual palavra faz o programa decidir se roda um trecho?",
        "dica": "if (condição) { ... }: o que está entre as chaves só roda se a condição for true.",
        "linha": {
          "alvo": "console",
          "fala": "if (condição) { ... }: o que está entre as chaves só roda se a condição for true."
        },
        "solucao": {
          "fala": "A condição lojaAberta é true, então o bloco rodou e mostrou Aberto!.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (lojaAberta) {\n  console.log(\"Aberto!\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Aberto! A condição era true, por isso o bloco rodou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (lojaAberta) {\n  console.log(\"Aberto!\")\n}"
        }
      ]
    },
    {
      "id": "if-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque lojaAberta para false e rode o mesmo if de novo.",
        "toque": "Troque lojaAberta para false e rode o mesmo if de novo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "lojaAberta",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que o programa faz com o bloco quando a condição é false?",
        "dica": "Ele pula o bloco. Sem else, não há plano B: nada acontece.",
        "linha": {
          "alvo": "console",
          "fala": "Ele pula o bloco. Sem else, não há plano B: nada acontece."
        },
        "solucao": {
          "fala": "Nada apareceu: a condição virou false e o bloco foi pulado.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "lojaAberta = false\nif (lojaAberta) {\n  console.log(\"Aberto!\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Nada! O bloco foi pulado, e o programa seguiu em frente sem erro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "lojaAberta = false\nif (lojaAberta) {\n  console.log(\"Aberto!\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com lojaAberta = false, o que o mesmo if mostra?",
        "opcoes": [
          "Aberto!",
          "Nada",
          "Um erro"
        ],
        "correta": 1,
        "explicacao": "Com a condição false, o bloco inteiro é pulado: nada aparece, e também não dá erro."
      }
    },
    {
      "id": "bloco-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Se estoque for 0, mostre duas linhas dentro do mesmo if: \"Sem estoque\" e \"Volte amanhã\".",
        "toque": "Se estoque for 0, mostre duas linhas dentro do mesmo if: \"Sem estoque\" e \"Volte amanhã\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Sem estoque",
              "Volte amanhã"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como colocar várias linhas dentro de um mesmo if?",
        "dica": "Tudo o que está entre { e } roda junto. Escreva uma linha por comando.",
        "linha": {
          "alvo": "console",
          "fala": "Tudo o que está entre { e } roda junto. Escreva uma linha por comando."
        },
        "solucao": {
          "fala": "As duas linhas estão dentro das chaves, então rodam juntas.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (estoque === 0) {\n  console.log(\"Sem estoque\")\n  console.log(\"Volte amanhã\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "As duas linhas apareceram: o bloco entre chaves roda inteiro ou nada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (estoque === 0) {\n  console.log(\"Sem estoque\")\n  console.log(\"Volte amanhã\")\n}"
        }
      ]
    },
    {
      "id": "if-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com lojaAberta false, escreva um if que mostre \"Fechado\".",
        "toque": "Com lojaAberta false, escreva um if que mostre \"Fechado\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Fechado"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual condição é true quando a loja está fechada?",
        "dica": "if (!lojaAberta) { ... } ou if (lojaAberta === false) { ... }: o ! inverte o booleano."
      },
      "falaAoConcluir": {
        "texto": "Fechado! Agora o if foi escrito do zero, por você.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (!lojaAberta) {\n  console.log(\"Fechado\")\n}"
        }
      ]
    },
    {
      "id": "bloco-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com estoque 0, mostre \"Esgotado\" e \"Reposição na sexta\" dentro de um único if.",
        "toque": "Com estoque 0, mostre \"Esgotado\" e \"Reposição na sexta\" dentro de um único if."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Esgotado",
              "Reposição na sexta"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quantos if você precisa para rodar as duas linhas juntas?",
        "dica": "Um só: as duas linhas ficam entre as chaves do mesmo bloco."
      },
      "falaAoConcluir": {
        "texto": "Duas linhas num bloco só. A condição manda no bloco inteiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (estoque === 0) {\n  console.log(\"Esgotado\")\n  console.log(\"Reposição na sexta\")\n}"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado. Cada resposta veio da regra, não de sorte.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e rode: if (document.title.length > 0) { console.log('Esta página tem título: ' + document.title) }. Anote o título que apareceu.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

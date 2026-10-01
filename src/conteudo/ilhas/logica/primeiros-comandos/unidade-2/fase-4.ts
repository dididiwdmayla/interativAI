/*
 * Lógica U2, Fase 4. length e console.log têm pares guiado/sozinho; revisão de undefined com saída real.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U2_F4: FasePratica = {
  "id": "logica-primeiros-comandos-u2-f4",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u2",
  "titulo": "Contar e mostrar o texto",
  "conceitos": [
    "length-texto",
    "console-log"
  ],
  "revisa": [
    "string-js",
    "undefined-js"
  ],
  "prerequisitos": [
    "console-js",
    "string-js",
    "undefined-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {},
  "introducao": [
    {
      "texto": "O balcão quer uma etiqueta curta e uma mensagem visível. Vamos contar caracteres e mostrar texto.",
      "expressao": "curioso"
    },
    {
      "texto": "Nestes textos simples, .length conta letras e espaços. console.log mostra algo, mas a chamada responde undefined.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "tamanho-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte ao Console o tamanho de \"Lia Costa\", incluindo o espaço.",
        "toque": "Pergunte ao Console o tamanho de \"Lia Costa\", incluindo o espaço."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 9
      },
      "ajudas": {
        "pergunta": "O espaço também ocupa uma posição no texto?",
        "dica": "Escreva \"Lia Costa\".length; length não leva parênteses.",
        "linha": {
          "alvo": "console",
          "fala": "Escreva \"Lia Costa\".length; length não leva parênteses."
        },
        "solucao": {
          "fala": "9: três letras, um espaço e cinco letras. O espaço conta.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "\"Lia Costa\".length"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "9: três letras, um espaço e cinco letras. O espaço conta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"Lia Costa\".length"
        }
      ]
    },
    {
      "id": "tamanho-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em let tamanhoEtiqueta o tamanho de \"Pizza pronta\".",
        "toque": "Guarde em let tamanhoEtiqueta o tamanho de \"Pizza pronta\"."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "tamanhoEtiqueta",
        "valor": 12
      },
      "ajudas": {
        "pergunta": "Como perguntar o tamanho de outro texto e guardar a resposta?",
        "dica": "Use .length depois do texto e guarde o número numa caixinha."
      },
      "falaAoConcluir": {
        "texto": "12 caracteres, contando o espaço. O palco distingue o texto e o número do tamanho.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let tamanhoEtiqueta = \"Pizza pronta\".length"
        }
      ]
    },
    {
      "id": "log-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Mostre \"Pedido recebido\" com console.log.",
        "toque": "Mostre \"Pedido recebido\" com console.log."
      },
      "validador": {
        "tipo": "saida",
        "igual": [
          "Pedido recebido"
        ]
      },
      "ajudas": {
        "pergunta": "Qual comando mostra uma mensagem durante a execução?",
        "dica": "Rode console.log(\"Pedido recebido\").",
        "linha": {
          "alvo": "console",
          "fala": "Rode console.log(\"Pedido recebido\")."
        },
        "solucao": {
          "fala": "A linha de mensagem veio de console.log; ela é diferente da resposta do Console.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "console.log(\"Pedido recebido\")"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A linha de mensagem veio de console.log; ela é diferente da resposta do Console.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "console.log(\"Pedido recebido\")"
        }
      ]
    },
    {
      "id": "log-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira: console.log(\"Saiu para entrega\").",
        "toque": "Confira: console.log(\"Saiu para entrega\")."
      },
      "validador": {
        "tipo": "saida",
        "igual": [
          "Saiu para entrega"
        ]
      },
      "ajudas": {
        "pergunta": "A mensagem mostrada é também o valor devolvido pela chamada?",
        "dica": "console.log mostra o texto e devolve undefined.",
        "linha": {
          "alvo": "console",
          "fala": "console.log mostra o texto e devolve undefined."
        },
        "solucao": {
          "fala": "O texto aparece numa linha de saída; abaixo, a resposta da chamada é undefined.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "console.log(\"Saiu para entrega\")"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O texto aparece numa linha de saída; abaixo, a resposta da chamada é undefined.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "console.log(\"Saiu para entrega\")"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde depois que console.log(\"Saiu para entrega\") mostra a mensagem?",
        "opcoes": [
          "A quantidade de letras",
          "undefined",
          "O próprio texto"
        ],
        "correta": 1,
        "explicacao": "console.log mostra a mensagem, mas não devolve um valor; a resposta é undefined."
      }
    },
    {
      "id": "log-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Mostre \"Retirada liberada\" com console.log.",
        "toque": "Mostre \"Retirada liberada\" com console.log."
      },
      "validador": {
        "tipo": "saida",
        "igual": [
          "Retirada liberada"
        ]
      },
      "ajudas": {
        "pergunta": "Como mostrar outra mensagem sem confundir saída e resposta?",
        "dica": "Passe o texto para console.log, entre parênteses."
      },
      "falaAoConcluir": {
        "texto": "Mensagem mostrada, chamada concluída: saída e resposta são coisas diferentes.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "console.log(\"Retirada liberada\")"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado no Console e no palco.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e monte uma frase com seu nome entre aspas, junte um espaço e confira o tamanho com .length.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

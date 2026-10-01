/*
 * Decisões U1, Fase 5: O == que disfarça.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F5: FasePratica = {
  "id": "logica-decisoes-u1-f5",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "O == que disfarça",
  "conceitos": [
    "igualdade-solta"
  ],
  "revisa": [
    "igualdade-estrita",
    "tipo-js",
    "coercao-js"
  ],
  "prerequisitos": [
    "igualdade-estrita",
    "tipo-js",
    "coercao-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let quantidade = \"10\""
  },
  "introducao": [
    {
      "texto": "Existe um irmão do === com dois sinais só. Ele funciona, mas converte os tipos sem avisar. Vamos ver por que quase todo mundo evita.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "solto-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte quantidade == 10, com dois sinais.",
        "toque": "Pergunte quantidade == 10, com dois sinais."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-solta"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O == olha o tipo ou converte antes de comparar?",
        "dica": "O == converte o texto \"10\" em número antes de comparar.",
        "linha": {
          "alvo": "console",
          "fala": "O == converte o texto \"10\" em número antes de comparar."
        },
        "solucao": {
          "fala": "true: o == transformou o texto em número e achou iguais.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "quantidade == 10"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true: o == converte tipos escondido. Prático, mas traiçoeiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "quantidade == 10"
        }
      ]
    },
    {
      "id": "solto-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte \"7\" == 7 no Console.",
        "toque": "Pergunte \"7\" == 7 no Console."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-solta"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que o == faz com um texto e um número?",
        "dica": "Dois sinais comparam depois de converter: \"7\" == 7 dá true."
      },
      "falaAoConcluir": {
        "texto": "true: de novo a conversão escondida.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"7\" == 7"
        }
      ]
    },
    {
      "id": "solto-esquisito",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira '' == 0 e veja a resposta.",
        "toque": "Confira '' == 0 e veja a resposta."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-solta"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Um texto vazio é a mesma coisa que o número zero?",
        "dica": "O == converte tudo antes. O texto vazio vira 0.",
        "linha": {
          "alvo": "console",
          "fala": "O == converte tudo antes. O texto vazio vira 0."
        },
        "solucao": {
          "fala": "true: texto vazio e zero ficam 'iguais' no ==. Estranho, né?",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "'' == 0"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true! Esse é o tipo de surpresa que o === evita.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "'' == 0"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para '' == 0 (texto vazio contra zero)?",
        "opcoes": [
          "true",
          "false",
          "erro"
        ],
        "correta": 0,
        "explicacao": "O == converte o texto vazio em 0 e acha os dois iguais: um dos motivos de evitá-lo."
      }
    },
    {
      "id": "estrito-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Agora pergunte quantidade === 10, com três sinais.",
        "toque": "Agora pergunte quantidade === 10, com três sinais."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "E se a comparação não converter nada?",
        "dica": "O === não converte: texto \"10\" e número 10 são diferentes.",
        "linha": {
          "alvo": "console",
          "fala": "O === não converte: texto \"10\" e número 10 são diferentes."
        },
        "solucao": {
          "fala": "false: o === não converte, e texto não é número.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "quantidade === 10"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: o === diz a verdade sobre os tipos. Por isso é o padrão.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "quantidade === 10"
        }
      ]
    },
    {
      "id": "estrito-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte se quantidade é igual ao texto \"10\" usando ===.",
        "toque": "Pergunte se quantidade é igual ao texto \"10\" usando ===."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual valor tem o mesmo tipo que a caixinha quantidade?",
        "dica": "quantidade guarda texto, então compare com o texto \"10\" entre aspas."
      },
      "falaAoConcluir": {
        "texto": "true: mesmo valor e mesmo tipo, sem conversão escondida.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "quantidade === \"10\""
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
  "missaoDeCampo": "Abra o Console de qualquer site e compare '10' == 10 e '10' === 10. Depois explique para alguém qual dos dois você usaria e por quê.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

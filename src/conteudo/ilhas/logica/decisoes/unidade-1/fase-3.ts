/*
 * Decisões U1, Fase 3: Igual ou diferente?.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F3: FasePratica = {
  "id": "logica-decisoes-u1-f3",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "Igual ou diferente?",
  "conceitos": [
    "diferente-estrito"
  ],
  "revisa": [
    "igualdade-estrita",
    "string-js",
    "tipo-js"
  ],
  "prerequisitos": [
    "igualdade-estrita",
    "booleano-js",
    "string-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let senha = \"1234\"\nlet digitado = \"1234\""
  },
  "introducao": [
    {
      "texto": "Num cadastro, o programa compara o que você digitou com o que está guardado. Dois sinais de pergunta: igual e diferente.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "igual-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte digitado === senha.",
        "toque": "Pergunte digitado === senha."
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
        "pergunta": "O texto digitado é o mesmo que a senha guardada?",
        "dica": "=== compara valor e tipo e responde true ou false, sem mudar nada.",
        "linha": {
          "alvo": "console",
          "fala": "=== compara valor e tipo e responde true ou false, sem mudar nada."
        },
        "solucao": {
          "fala": "true: os dois guardam o texto \"1234\".",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "digitado === senha"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true! Mesmo valor, mesmo tipo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "digitado === senha"
        }
      ]
    },
    {
      "id": "diferente-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Agora pergunte digitado !== senha: eles são diferentes?",
        "toque": "Agora pergunte digitado !== senha: eles são diferentes?"
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
        "pergunta": "Se os dois textos são iguais, a pergunta 'são diferentes?' recebe sim ou não?",
        "dica": "!== pergunta 'é diferente?'. Iguais, ele responde false.",
        "linha": {
          "alvo": "console",
          "fala": "!== pergunta 'é diferente?'. Iguais, ele responde false."
        },
        "solucao": {
          "fala": "false: eles não são diferentes. O !== é o contrário do ===.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "digitado !== senha"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: !== é o contrário do ===. Se um dá true, o outro dá false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "digitado !== senha"
        }
      ]
    },
    {
      "id": "texto-contra-numero",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira '10' === 10 e veja a resposta.",
        "toque": "Confira '10' === 10 e veja a resposta."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": false
      },
      "ajudas": {
        "pergunta": "O texto '10' e o número 10 são o mesmo tipo de valor?",
        "dica": "O === confere valor E tipo. Texto e número são tipos diferentes.",
        "linha": {
          "alvo": "console",
          "fala": "O === confere valor E tipo. Texto e número são tipos diferentes."
        },
        "solucao": {
          "fala": "false: um é texto e o outro é número.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "'10' === 10"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: aspas viram texto, e texto não é número para o ===.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "'10' === 10"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para '10' === 10?",
        "opcoes": [
          "true",
          "false",
          "10"
        ],
        "correta": 1,
        "explicacao": "O texto '10' e o número 10 têm tipos diferentes, e o === confere o tipo também."
      }
    },
    {
      "id": "diferente-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte se o texto \"10\" é diferente (!==) do número 10.",
        "toque": "Pergunte se o texto \"10\" é diferente (!==) do número 10."
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
        "pergunta": "Texto e número com o mesmo desenho são iguais para o ===?",
        "dica": "\"10\" !== 10 responde true, porque o tipo é diferente."
      },
      "falaAoConcluir": {
        "texto": "true: diferentes no tipo. O !== também olha o tipo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"10\" !== 10"
        }
      ]
    },
    {
      "id": "maiuscula-conta",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Compare \"Sim\" === \"sim\": a letra maiúscula também conta.",
        "toque": "Compare \"Sim\" === \"sim\": a letra maiúscula também conta."
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
        "pergunta": "'Sim' e 'sim' têm exatamente as mesmas letras?",
        "dica": "Para o computador, S e s são caracteres diferentes. O === confere tudo."
      },
      "falaAoConcluir": {
        "texto": "false: maiúscula e minúscula são letras diferentes. Por isso login pede atenção.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"Sim\" === \"sim\""
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
  "missaoDeCampo": "Abra o Console de qualquer site e pergunte 'a' === 'a', 'a' !== 'A' e 5 === '5'. Anote por que cada resposta saiu assim.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

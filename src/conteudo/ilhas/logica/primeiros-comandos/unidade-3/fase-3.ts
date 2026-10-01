/*
 * Lógica U3, Fase 3. Pares para + textual e coerção numérica; previsão de subtração solicitada no currículo.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F3: FasePratica = {
  "id": "logica-primeiros-comandos-u3-f3",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "Quando o mais junta",
  "conceitos": [
    "coercao-js"
  ],
  "revisa": [
    "concatenacao-js",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "console-js",
    "concatenacao-js",
    "operacoes-aritmeticas"
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
      "texto": "O preço chegou como texto. Se um lado do + é texto, o JavaScript junta em vez de somar.",
      "expressao": "curioso"
    },
    {
      "texto": "Já * e - tentam transformar o texto numérico em número. Não confie no desenho dos algarismos; pergunte o tipo.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "mais-texto",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Compare no Console: \"2\" + 2.",
        "toque": "Compare no Console: \"2\" + 2."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "22"
      },
      "ajudas": {
        "pergunta": "Um dos lados é texto; o + vai juntar ou somar?",
        "dica": "Rode \"2\" + 2. O número vira texto para a junção.",
        "linha": {
          "alvo": "console",
          "fala": "Rode \"2\" + 2. O número vira texto para a junção."
        },
        "solucao": {
          "fala": "\"22\", texto. É junção de caracteres, não a conta 2 + 2.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "\"2\" + 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "\"22\", texto. É junção de caracteres, não a conta 2 + 2.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"2\" + 2"
        }
      ]
    },
    {
      "id": "mais-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "O ticket veio como \"10\" e a taxa é 3. Rode \"10\" + 3 e confira o resultado.",
        "toque": "O ticket veio como \"10\" e a taxa é 3. Rode \"10\" + 3 e confira o resultado."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "103"
      },
      "ajudas": {
        "pergunta": "O ticket está entre aspas?",
        "dica": "Com texto num lado, + junta os dois pedaços."
      },
      "falaAoConcluir": {
        "texto": "\"103\", texto. A aparência de número não garante que a conta some.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"10\" + 3"
        }
      ]
    },
    {
      "id": "vezes-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Agora rode \"2\" * 2.",
        "toque": "Agora rode \"2\" * 2."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 4
      },
      "ajudas": {
        "pergunta": "Multiplicação também serve para juntar palavras?",
        "dica": "O * tenta converter o texto numérico: rode \"2\" * 2.",
        "linha": {
          "alvo": "console",
          "fala": "O * tenta converter o texto numérico: rode \"2\" * 2."
        },
        "solucao": {
          "fala": "4, número. Multiplicar não junta texto; tenta trabalhar com números.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "\"2\" * 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "4, número. Multiplicar não junta texto; tenta trabalhar com números.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"2\" * 2"
        }
      ]
    },
    {
      "id": "menos-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira no Console: '5' - 2.",
        "toque": "Confira no Console: '5' - 2."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 3
      },
      "ajudas": {
        "pergunta": "O sinal de menos tem uma operação de juntar textos?",
        "dica": "O - tenta usar números; o texto \"5\" pode ser convertido.",
        "linha": {
          "alvo": "console",
          "fala": "O - tenta usar números; o texto \"5\" pode ser convertido."
        },
        "solucao": {
          "fala": "3, número. A conversão foi automática; com + seria outro resultado.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "'5' - 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "3, número. A conversão foi automática; com + seria outro resultado.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "'5' - 2"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde se você roda '5' - 2?",
        "opcoes": [
          "'52'",
          "Erro",
          "3"
        ],
        "correta": 2,
        "explicacao": "O - converte o texto numérico e faz 5 - 2; responde o número 3."
      }
    },
    {
      "id": "vezes-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Uma diária veio como \"7\". Calcule \"7\" * 3.",
        "toque": "Uma diária veio como \"7\". Calcule \"7\" * 3."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 21
      },
      "ajudas": {
        "pergunta": "Que operação tenta usar os valores como números?",
        "dica": "Multiplicar tenta converter o texto numérico antes da conta."
      },
      "falaAoConcluir": {
        "texto": "21, número. Para somar certo também, a próxima fase converte de propósito.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"7\" * 3"
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
  "missaoDeCampo": "Abra o Console de qualquer site e guarde a conta da feira (3 * 4.5 + 2 * 7) em let totalFeira e pergunte typeof totalFeira.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

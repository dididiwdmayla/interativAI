/*
 * Lógica U3, Fase 4. Valida estados e tipos por valor. Conversão não altera o texto de origem; negativas na jornada.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F4: FasePratica = {
  "id": "logica-primeiros-comandos-u3-f4",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "Converter de propósito",
  "conceitos": [
    "conversao-number",
    "conversao-string"
  ],
  "revisa": [
    "typeof-js",
    "concatenacao-js",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "console-js",
    "typeof-js",
    "concatenacao-js",
    "operacoes-aritmeticas"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let precoTexto = \"12\"\nlet taxa = 2\nlet valorTexto = \"25\"\nlet extra = 4"
  },
  "introducao": [
    {
      "texto": "O Estacionamento cobra 2 de taxa. Vamos converter o preço recebido em texto antes de somar.",
      "expressao": "curioso"
    },
    {
      "texto": "Number transforma texto numérico em número. String faz o caminho para texto; o palco mostra o tipo novo.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "total-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde em total: Number(precoTexto) + taxa.",
        "toque": "Guarde em total: Number(precoTexto) + taxa."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "total",
        "valor": 14
      },
      "ajudas": {
        "pergunta": "Como tirar o texto da conta antes de usar o +?",
        "dica": "Use Number(precoTexto) + taxa e guarde em let total.",
        "linha": {
          "alvo": "console",
          "fala": "Use Number(precoTexto) + taxa e guarde em let total."
        },
        "solucao": {
          "fala": "14, número. precoTexto continua texto: converter produz outro valor, sem mudar a origem.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let total = Number(precoTexto) + taxa"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "14, número. precoTexto continua texto: converter produz outro valor, sem mudar a origem.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let total = Number(precoTexto) + taxa"
        }
      ]
    },
    {
      "id": "total-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Outro cliente tem valorTexto = \"25\" e extra = 4. Guarde a soma correta em outroTotal.",
        "toque": "Outro cliente tem valorTexto = \"25\" e extra = 4. Guarde a soma correta em outroTotal."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "outroTotal",
        "valor": 29
      },
      "ajudas": {
        "pergunta": "Qual lado precisa virar número antes de somar?",
        "dica": "Converta o texto com Number e só então some."
      },
      "falaAoConcluir": {
        "texto": "29, número, em vez de \"254\". Você consertou outra conta sem receita.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let outroTotal = Number(valorTexto) + extra"
        }
      ]
    },
    {
      "id": "string-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Transforme total em texto e guarde em totalTexto.",
        "toque": "Transforme total em texto e guarde em totalTexto."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "totalTexto",
        "valor": "14"
      },
      "ajudas": {
        "pergunta": "Como fazer o caminho contrário, do número para texto?",
        "dica": "Use String(total) e guarde o resultado em let totalTexto.",
        "linha": {
          "alvo": "console",
          "fala": "Use String(total) e guarde o resultado em let totalTexto."
        },
        "solucao": {
          "fala": "totalTexto guarda \"14\". total continua número: as duas caixinhas coexistem.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let totalTexto = String(total)"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "totalTexto guarda \"14\". total continua número: as duas caixinhas coexistem.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let totalTexto = String(total)"
        }
      ]
    },
    {
      "id": "string-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira typeof String(8).",
        "toque": "Confira typeof String(8)."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "string"
      },
      "ajudas": {
        "pergunta": "O resultado da conversão preserva o tipo do número?",
        "dica": "String converte para texto; typeof revela o tipo que saiu.",
        "linha": {
          "alvo": "console",
          "fala": "String converte para texto; typeof revela o tipo que saiu."
        },
        "solucao": {
          "fala": "\"string\": o tipo depende do valor, não da aparência de seus algarismos.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "typeof String(8)"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "\"string\": o tipo depende do valor, não da aparência de seus algarismos.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof String(8)"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para typeof String(8)?",
        "opcoes": [
          "'number'",
          "'string'",
          "8"
        ],
        "correta": 1,
        "explicacao": "String(8) produz texto. typeof desse resultado responde \"string\"."
      }
    },
    {
      "id": "string-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Converta outroTotal em texto e guarde em reciboTexto.",
        "toque": "Converta outroTotal em texto e guarde em reciboTexto."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "reciboTexto",
        "valor": "29"
      },
      "ajudas": {
        "pergunta": "Qual conversão produz texto a partir do total numérico?",
        "dica": "Use String com o valor a converter entre parênteses."
      },
      "falaAoConcluir": {
        "texto": "O recibo é texto, e o total da conta continua número.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let reciboTexto = String(outroTotal)"
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

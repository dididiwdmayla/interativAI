/*
 * Decisões U1, Fase 1: Perguntas de sim ou não.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F1: FasePratica = {
  "id": "logica-decisoes-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "Perguntas de sim ou não",
  "conceitos": [
    "booleano-js",
    "comparacao-js"
  ],
  "revisa": [
    "variavel-let",
    "typeof-js"
  ],
  "prerequisitos": [
    "console-js",
    "variavel-let",
    "tipo-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let idade = 15\nlet idadeMinima = 12"
  },
  "introducao": [
    {
      "texto": "Na Lanchonete do Zeca, o combo radical tem idade mínima. O computador responde a perguntas assim com true (sim) ou false (não).",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "maior-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte ao Console se idade > idadeMinima.",
        "toque": "Pergunte ao Console se idade > idadeMinima."
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
            "sintaxe": "comparacao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A idade é maior que a idade mínima? Como o Console responde uma pergunta de sim ou não?",
        "dica": "O sinal > pergunta 'é maior que?'. A resposta é true ou false.",
        "linha": {
          "alvo": "console",
          "fala": "O sinal > pergunta 'é maior que?'. A resposta é true ou false."
        },
        "solucao": {
          "fala": "true: 15 é maior que 12. O Console respondeu a pergunta, sem guardar nada.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade > idadeMinima"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true! Comparar não guarda nada: a resposta é um valor chamado booleano.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idade > idadeMinima"
        }
      ]
    },
    {
      "id": "menor-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira idade < idadeMinima e veja a resposta.",
        "toque": "Confira idade < idadeMinima e veja a resposta."
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
            "sintaxe": "comparacao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Se 15 é maior que 12, ele também pode ser menor?",
        "dica": "O sinal < pergunta 'é menor que?'. A resposta é sempre true ou false.",
        "linha": {
          "alvo": "console",
          "fala": "O sinal < pergunta 'é menor que?'. A resposta é sempre true ou false."
        },
        "solucao": {
          "fala": "false: 15 não é menor que 12.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade < idadeMinima"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: o contrário também vale. Cada pergunta dá uma resposta só.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade < idadeMinima"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para idade < idadeMinima?",
        "opcoes": [
          "true",
          "false",
          "15"
        ],
        "correta": 1,
        "explicacao": "15 não é menor que 12, então a pergunta recebe false."
      }
    },
    {
      "id": "guardar-resposta",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em podeComprar o resultado de idade > idadeMinima.",
        "toque": "Guarde em podeComprar o resultado de idade > idadeMinima."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "podeComprar",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "let"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comparacao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como guardar o resultado de uma pergunta numa caixinha?",
        "dica": "let podeComprar = idade > idadeMinima: a caixinha passa a guardar true ou false."
      },
      "falaAoConcluir": {
        "texto": "A caixinha podeComprar guarda true. Ela é um booleano, como o palco mostra.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let podeComprar = idade > idadeMinima"
        }
      ]
    },
    {
      "id": "tipo-da-resposta",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte o typeof de podeComprar.",
        "toque": "Pergunte o typeof de podeComprar."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "boolean"
      },
      "ajudas": {
        "pergunta": "Que tipo de valor uma comparação devolve?",
        "dica": "typeof diz o tipo: o resultado de uma comparação é um booleano."
      },
      "falaAoConcluir": {
        "texto": "boolean: só tem dois valores possíveis, true e false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof podeComprar"
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
  "missaoDeCampo": "Abra o Console de qualquer site e pergunte 10 > 9, '10' === 10 e '10' == 10. Anote as três respostas e explique a diferença entre === e == para alguém.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

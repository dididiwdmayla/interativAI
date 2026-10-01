/*
 * Lógica U3, Fase 2. Antecipação mínima de === para atacar a confusão pedida; decisões e if ficam na próxima zona.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F2: FasePratica = {
  "id": "logica-primeiros-comandos-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "Guardar ou comparar?",
  "conceitos": [
    "igualdade-estrita"
  ],
  "revisa": [
    "tipo-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "console-js",
    "tipo-js",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let codigo = \"2\""
  },
  "introducao": [
    {
      "texto": "O = guarda um valor. O === faz uma pergunta: os valores e os tipos são iguais? A resposta é um booleano.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "comparar-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Compare codigo === 2. Confira se comparar altera codigo.",
        "toque": "Compare codigo === 2. Confira se comparar altera codigo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "valorVariavel",
            "nome": "codigo",
            "valor": "2"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Texto \"2\" e número 2 têm o mesmo tipo?",
        "dica": "Rode codigo === 2; três sinais de igual comparam sem guardar.",
        "linha": {
          "alvo": "console",
          "fala": "Rode codigo === 2; três sinais de igual comparam sem guardar."
        },
        "solucao": {
          "fala": "false: o texto \"2\" não é o número 2. codigo continua texto no palco.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "codigo === 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: o texto \"2\" não é o número 2. codigo continua texto no palco.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "codigo === 2"
        }
      ]
    },
    {
      "id": "comparar-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Compare codigo === \"2\". O texto deve continuar guardado em codigo.",
        "toque": "Compare codigo === \"2\". O texto deve continuar guardado em codigo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "valorVariavel",
            "nome": "codigo",
            "valor": "2"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Agora os dois lados têm o mesmo valor e o mesmo tipo?",
        "dica": "O === confere valor e tipo. Aspas fazem diferença."
      },
      "falaAoConcluir": {
        "texto": "true: agora os dois lados são o texto \"2\". Nenhuma caixinha mudou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "codigo === \"2\""
        }
      ]
    },
    {
      "id": "guardar-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira codigo = 2 e veja a etiqueta mudar no palco.",
        "toque": "Confira codigo = 2 e veja a etiqueta mudar no palco."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "codigo",
        "valor": 2
      },
      "ajudas": {
        "pergunta": "Um único sinal de igual pergunta ou guarda?",
        "dica": "O = substitui o valor. Olhe a caixinha antes e depois.",
        "linha": {
          "alvo": "console",
          "fala": "O = substitui o valor. Olhe a caixinha antes e depois."
        },
        "solucao": {
          "fala": "Agora codigo guarda número. O = alterou a caixinha; o === dos passos anteriores só comparou.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "codigo = 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Agora codigo guarda número. O = alterou a caixinha; o === dos passos anteriores só comparou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "codigo = 2"
        }
      ],
      "previsao": {
        "pergunta": "Com codigo = \"2\", o que o Console responde se você roda codigo = 2?",
        "opcoes": [
          "2, e codigo passa a guardar número",
          "false, sem alterar codigo",
          "true, sem alterar codigo"
        ],
        "correta": 0,
        "explicacao": "Um = guarda o número 2 em codigo e a atribuição responde 2; === seria uma comparação."
      }
    },
    {
      "id": "comparar-apos-troca",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Depois da troca, compare codigo === \"2\" outra vez.",
        "toque": "Depois da troca, compare codigo === \"2\" outra vez."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "valorVariavel",
            "nome": "codigo",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual tipo ficou na caixinha depois do último comando?",
        "dica": "Compare valor e tipo de novo; o palco mostra o que está guardado agora."
      },
      "falaAoConcluir": {
        "texto": "false: agora a caixinha guarda número e o outro lado é texto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "codigo === \"2\""
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

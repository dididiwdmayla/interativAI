/*
 * Decisões U1, Fase 2: Na fronteira: > ou >=?.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F2: FasePratica = {
  "id": "logica-decisoes-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "Na fronteira: > ou >=?",
  "conceitos": [
    "limite-da-comparacao"
  ],
  "revisa": [
    "comparacao-js",
    "booleano-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "comparacao-js",
    "booleano-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let idade = 12\nlet idadeMinima = 12"
  },
  "introducao": [
    {
      "texto": "Quem tem exatamente 12 anos entra no combo? Depende do sinal. Vamos ver o que cada pergunta responde na fronteira.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "maior-na-fronteira",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte idade > idadeMinima com 12 e 12.",
        "toque": "Pergunte idade > idadeMinima com 12 e 12."
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
        "pergunta": "12 é maior que 12?",
        "dica": "O > não aceita igual: quem está exatamente no limite fica de fora.",
        "linha": {
          "alvo": "console",
          "fala": "O > não aceita igual: quem está exatamente no limite fica de fora."
        },
        "solucao": {
          "fala": "false: 12 não é maior que 12. O > deixa a fronteira de fora.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade > idadeMinima"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false! Quem tem exatamente 12 não passa no >.",
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
      "id": "maior-ou-igual",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Agora pergunte idade >= idadeMinima.",
        "toque": "Agora pergunte idade >= idadeMinima."
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
        "pergunta": "Qual sinal diz 'maior ou igual'?",
        "dica": ">= é 'maior ou igual': a fronteira também conta.",
        "linha": {
          "alvo": "console",
          "fala": ">= é 'maior ou igual': a fronteira também conta."
        },
        "solucao": {
          "fala": "true: 12 é igual a 12, e o >= aceita igual.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade >= idadeMinima"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true! O >= inclui o limite. Trocar um sinal muda quem entra.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idade >= idadeMinima"
        }
      ]
    },
    {
      "id": "menor-ou-igual-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira idade <= 12 e veja a resposta.",
        "toque": "Confira idade <= 12 e veja a resposta."
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
        "pergunta": "O <= também aceita igual?",
        "dica": "<= é 'menor ou igual'. Igual ao limite conta como sim.",
        "linha": {
          "alvo": "console",
          "fala": "<= é 'menor ou igual'. Igual ao limite conta como sim."
        },
        "solucao": {
          "fala": "true: o <= aceita 12.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade <= 12"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true: <= e >= incluem o limite; < e > não.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade <= 12"
        }
      ],
      "previsao": {
        "pergunta": "Com idade = 12, o que o Console responde para idade <= 12?",
        "opcoes": [
          "true",
          "false",
          "12"
        ],
        "correta": 0,
        "explicacao": "<= quer dizer menor ou igual, e 12 é igual a 12."
      }
    },
    {
      "id": "guardar-entrada",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em entraNoCombo o resultado de idade >= idadeMinima.",
        "toque": "Guarde em entraNoCombo o resultado de idade >= idadeMinima."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "entraNoCombo",
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
        "pergunta": "Qual sinal inclui quem tem exatamente a idade mínima?",
        "dica": "let entraNoCombo = idade >= idadeMinima guarda true."
      },
      "falaAoConcluir": {
        "texto": "entraNoCombo vale true: quem tem 12 anos entra.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let entraNoCombo = idade >= idadeMinima"
        }
      ]
    },
    {
      "id": "mudar-o-limite",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Mude idadeMinima para 13 (sem let) e pergunte de novo idade >= idadeMinima.",
        "toque": "Mude idadeMinima para 13 (sem let) e pergunte de novo idade >= idadeMinima."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "idadeMinima",
            "valor": 13
          },
          {
            "tipo": "respostaDoConsole",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como trocar o valor de uma caixinha que já existe?",
        "dica": "idadeMinima = 13 troca o valor; depois pergunte idade >= idadeMinima."
      },
      "falaAoConcluir": {
        "texto": "false: com o limite em 13, quem tem 12 fica de fora. O limite manda.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idadeMinima = 13"
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade >= idadeMinima"
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
  "missaoDeCampo": "Abra o Console de qualquer site e pergunte 18 > 18 e 18 >= 18. Depois invente uma idade mínima de um jogo e teste quem entra na fronteira.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

/* Repetição U1: Quando nada muda. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U1_F3: FasePratica = {
  "id": "logica-repeticao-u1-f3",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u1",
  "titulo": "Quando nada muda",
  "conceitos": [
    "loop-infinito"
  ],
  "revisa": [
    "ler-mensagem-de-erro",
    "comparacao-js",
    "if-js"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "comparacao-js",
    "if-js"
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
      "nome": "Quando nada muda",
      "codigoInicial": "let i = 0\nwhile (i < 3) {\n  i = i\n}"
    }
  },
  "introducao": [
    {
      "texto": "Um while não para sozinho: algo precisa mudar para sua condição ficar falsa. Aqui vamos provocar o bug só no jogo.",
      "expressao": "apontando"
    },
    {
      "texto": "O jogo corta a execução em 100 mil passos ou 1,5 segundo. Isso protege a aba; não corrige o programa. No Console real, um laço infinito pode travar a aba.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "protecao-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Execute o Snippet sem mudar i. Leia a parada do jogo.",
        "toque": "Execute o Snippet sem mudar i. Leia a parada do jogo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "erroDoTipo",
            "nome": "Parada do jogo"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "i = i deixa i em zero para sempre; a condição i < 3 nunca vira false.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "i = i deixa i em zero para sempre; a condição i < 3 nunca vira false."
        },
        "solucao": {
          "fala": "Leia a proteção: o jogo interrompeu o programa. Rebobine e veja i ficar 0 em todas as voltas.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let i = 0\nwhile (i < 3) {\n  i = i\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Leia a proteção: o jogo interrompeu o programa. Rebobine e veja i ficar 0 em todas as voltas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 0\nwhile (i < 3) {\n  i = i\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "protecao-consertar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque i = i por i++ e mostre i depois do laço.",
        "toque": "Troque i = i por i++ e mostre i depois do laço."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 3
          },
          {
            "tipo": "saida",
            "igual": [
              "3"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Atualize i dentro das chaves, antes da próxima pergunta.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Atualize i dentro das chaves, antes da próxima pergunta."
        },
        "solucao": {
          "fala": "Agora i chega a 3 e o laço termina pelo próprio código.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let i = 0\nwhile (i < 3) {\n  i++\n}\nconsole.log(i)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Agora i chega a 3 e o laço termina pelo próprio código.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 0\nwhile (i < 3) {\n  i++\n}\nconsole.log(i)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "protecao-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Use o Console para testar rapidamente 3 < 3.",
        "toque": "Use o Console para testar rapidamente 3 < 3."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": false
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Com i igual a 3, a pergunta i < 3 responde false.",
        "linha": {
          "alvo": "console",
          "fala": "Com i igual a 3, a pergunta i < 3 responde false."
        },
        "solucao": {
          "fala": "O while testa antes de entrar; se começa false, há zero voltas.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "3 < 3"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O while testa antes de entrar; se começa false, há zero voltas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "3 < 3"
        }
      ],
      "previsao": {
        "pergunta": "Com i começando em 3, while (i < 3) roda quantas vezes?",
        "opcoes": [
          "3",
          "1",
          "0"
        ],
        "correta": 2,
        "explicacao": "A condição já começa falsa, então o corpo nem roda."
      }
    },
    {
      "id": "protecao-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conserte: segundos começa em 2; enquanto for > 0, tire 1. Mostre \"Pronto\" com if no fim.",
        "toque": "Conserte: segundos começa em 2; enquanto for > 0, tire 1. Mostre \"Pronto\" com if no fim."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "segundos",
            "valor": 0
          },
          {
            "tipo": "saida",
            "igual": [
              "Pronto"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
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
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Se conta para baixo, segundos-- tira um. A condição precisa chegar a false."
      },
      "falaAoConcluir": {
        "texto": "O laço corrigido para; a proteção já não precisa intervir.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let segundos = 2\nwhile (segundos > 0) {\n  segundos--\n}\nif (segundos === 0) { console.log(\"Pronto\") }"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Compare a saída com as caixinhas na linha do tempo. Cada passo mostra a memória antes da linha marcada rodar.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, conte de 1 a 10 com um laço finito. Confira as dez linhas.",
  "falaFinal": {
    "texto": "Use só laços que terminam no Console real; a proteção de passos pertence ao jogo.",
    "expressao": "feliz"
  }
};

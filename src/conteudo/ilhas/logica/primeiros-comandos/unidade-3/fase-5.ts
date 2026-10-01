/*
 * Lógica U3, Fase 5. Comentário explicativo contra desativar código; ambos delimitadores guiados, bloco sozinho; linha do tempo útil.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F5: FasePratica = {
  "id": "logica-primeiros-comandos-u3-f5",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "O computador pula comentários",
  "conceitos": [
    "comentario-js"
  ],
  "revisa": [
    "variavel-let",
    "operacoes-aritmeticas",
    "console-log"
  ],
  "prerequisitos": [
    "console-js",
    "variavel-let",
    "operacoes-aritmeticas",
    "console-log"
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
      "texto": "// comenta até o fim da linha. /* e */ cercam um bloco. Só o trecho comentado é ignorado.",
      "expressao": "curioso"
    },
    {
      "texto": "Explicar uma linha não muda a conta. Comentar a própria linha executável pode mudar o resultado, porque ela deixa de rodar.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "comentario-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Em várias linhas, crie saldo = 10. Comente saldo = 999 com //; depois some 2 ao saldo.",
        "toque": "Em várias linhas, crie saldo = 10. Comente saldo = 999 com //; depois some 2 ao saldo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "saldo",
            "valor": 12
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comentario"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual linha deve ficar fora da execução?",
        "dica": "Escreva // antes de saldo = 999; a soma fica na linha seguinte.",
        "linha": {
          "alvo": "console",
          "fala": "Escreva // antes de saldo = 999; a soma fica na linha seguinte."
        },
        "solucao": {
          "fala": "saldo foi de 10 a 12. Volte na linha do tempo: a linha comentada não ganhou passo de execução.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let saldo = 10\n// saldo = 999\nsaldo = saldo + 2"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "saldo foi de 10 a 12. Volte na linha do tempo: a linha comentada não ganhou passo de execução.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let saldo = 10\n// saldo = 999\nsaldo = saldo + 2"
        }
      ]
    },
    {
      "id": "comentario-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira: 3 + 4 // conta das vagas",
        "toque": "Confira: 3 + 4 // conta das vagas"
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 7
      },
      "ajudas": {
        "pergunta": "O trecho depois de // participa da soma?",
        "dica": "// só ignora o resto daquela linha. A expressão anterior continua valendo.",
        "linha": {
          "alvo": "console",
          "fala": "// só ignora o resto daquela linha. A expressão anterior continua valendo."
        },
        "solucao": {
          "fala": "7: escrever uma explicação depois da conta não altera o que ela calcula.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "3 + 4 // conta das vagas"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "7: escrever uma explicação depois da conta não altera o que ela calcula.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "3 + 4 // conta das vagas"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para 3 + 4 // conta das vagas?",
        "opcoes": [
          "7",
          "undefined",
          "Erro"
        ],
        "correta": 0,
        "explicacao": "A conta roda; só o trecho depois de // é ignorado."
      }
    },
    {
      "id": "bloco-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie caixa = 6; cerque caixa = 900 com /* */ e depois some 1.",
        "toque": "Crie caixa = 6; cerque caixa = 900 com /* */ e depois some 1."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "caixa",
            "valor": 7
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comentario"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como cercar um trecho inteiro para o computador pular?",
        "dica": "Use /* antes e */ depois de caixa = 900.",
        "linha": {
          "alvo": "console",
          "fala": "Use /* antes e */ depois de caixa = 900."
        },
        "solucao": {
          "fala": "7: o bloco com a troca para 900 foi ignorado; a soma de 1 rodou.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let caixa = 6\n/* caixa = 900 */\ncaixa = caixa + 1"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "7: o bloco com a troca para 900 foi ignorado; a soma de 1 rodou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let caixa = 6\n/* caixa = 900 */\ncaixa = caixa + 1"
        }
      ]
    },
    {
      "id": "comentario-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie estoque = 8; comente a troca para 500 usando /* */ em várias linhas. Depois some 3 ao estoque.",
        "toque": "Crie estoque = 8; comente a troca para 500 usando /* */ em várias linhas. Depois some 3 ao estoque."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "estoque",
            "valor": 11
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comentario"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que trecho deve ser ignorado e qual comando precisa continuar rodando?",
        "dica": "Cerque só a troca indesejada; a soma fica fora do comentário."
      },
      "falaAoConcluir": {
        "texto": "11. Volte um passo: estoque era 8 antes da soma. Comentários não executam; o código fora deles executa.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let estoque = 8\n/*\nestoque = 500\n*/\nestoque = estoque + 3"
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

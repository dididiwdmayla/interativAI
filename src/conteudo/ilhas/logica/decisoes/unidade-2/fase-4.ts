/*
 * Decisões U2, Fase 4: Do circuito ao Console.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F4: FasePratica = {
  "id": "logica-decisoes-u2-f4",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "Do circuito ao Console",
  "conceitos": [
    "operadores-logicos"
  ],
  "revisa": [
    "portao-e",
    "portao-ou",
    "portao-nao",
    "comparacao-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "portao-e",
    "portao-ou",
    "portao-nao",
    "booleano-js",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let temCliente = true\nlet lojaAberta = false\nlet janelaAberta = false\nlet portaAberta = true\nlet idade = 20"
  },
  "introducao": [
    {
      "texto": "O botão Ver como código mostrou a decisão escrita. Agora é você quem escreve no Console: && é o E, || é o OU e ! é o NÃO.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "e-no-console",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "No Console, escreva a decisão da porta da padaria: temCliente && lojaAberta.",
        "toque": "No Console, escreva a decisão da porta da padaria: temCliente && lojaAberta."
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
            "sintaxe": "e-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual sinal do código faz o papel do portão E?",
        "dica": "O E é && : temCliente && lojaAberta. Só é true se as duas forem true.",
        "linha": {
          "alvo": "console",
          "fala": "O E é && : temCliente && lojaAberta. Só é true se as duas forem true."
        },
        "solucao": {
          "fala": "false: tem cliente, mas a loja está fechada. O && precisa das duas.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "temCliente && lojaAberta"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false: o mesmo resultado do circuito, escrito em código.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "temCliente && lojaAberta"
        }
      ]
    },
    {
      "id": "ou-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira temCliente || lojaAberta e veja a resposta.",
        "toque": "Confira temCliente || lojaAberta e veja a resposta."
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
            "sintaxe": "ou-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O OU acende com só uma entrada ligada?",
        "dica": "O OU é || : true se pelo menos uma for true.",
        "linha": {
          "alvo": "console",
          "fala": "O OU é || : true se pelo menos uma for true."
        },
        "solucao": {
          "fala": "true: uma das duas basta para o ||.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "temCliente || lojaAberta"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true: o || é o OU do circuito.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "temCliente || lojaAberta"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para temCliente || lojaAberta?",
        "opcoes": [
          "true",
          "false",
          "undefined"
        ],
        "correta": 0,
        "explicacao": "O || basta uma das duas ser true, e temCliente é true."
      }
    },
    {
      "id": "nao-no-console",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte !lojaAberta, o contrário da loja aberta.",
        "toque": "Pergunte !lojaAberta, o contrário da loja aberta."
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
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual sinal do código faz o papel do NÃO?",
        "dica": "O ponto de exclamação inverte: !false vira true.",
        "linha": {
          "alvo": "console",
          "fala": "O ponto de exclamação inverte: !false vira true."
        },
        "solucao": {
          "fala": "true: a loja está fechada (false), e o ! inverte.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "!lojaAberta"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true: o ! entregou o contrário de false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "!lojaAberta"
        }
      ]
    },
    {
      "id": "e-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em podeComprar: tem cliente E idade maior ou igual a 18.",
        "toque": "Guarde em podeComprar: tem cliente E idade maior ou igual a 18."
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
            "sintaxe": "e-logico"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comparacao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como juntar uma caixinha booleana e uma comparação no mesmo E?",
        "dica": "let podeComprar = temCliente && idade >= 18: a comparação vira true ou false e entra no &&."
      },
      "falaAoConcluir": {
        "texto": "true: comparação e booleano trabalham juntos no &&.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let podeComprar = temCliente && idade >= 18"
        }
      ]
    },
    {
      "id": "ou-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em alarmeToca: janelaAberta OU portaAberta.",
        "toque": "Guarde em alarmeToca: janelaAberta OU portaAberta."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "alarmeToca",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "let"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual sinal faz o papel do OU?",
        "dica": "let alarmeToca = janelaAberta || portaAberta guarda true."
      },
      "falaAoConcluir": {
        "texto": "alarmeToca vale true: a porta aberta basta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let alarmeToca = janelaAberta || portaAberta"
        }
      ]
    },
    {
      "id": "nao-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em lojaFechada o contrário de lojaAberta.",
        "toque": "Guarde em lojaFechada o contrário de lojaAberta."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "lojaFechada",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "let"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual sinal inverte um booleano?",
        "dica": "let lojaFechada = !lojaAberta guarda true."
      },
      "falaAoConcluir": {
        "texto": "lojaFechada vale true: o ! inverteu o false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let lojaFechada = !lojaAberta"
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
  "missaoDeCampo": "Abra o Console de qualquer site e guarde let logado = true e let admin = false. Escreva logado && admin, logado || admin e !admin e confira cada resposta.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

/*
 * Decisões U2, Fase 1: A porta da padaria (E).
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseCircuitoLogico } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F1: FaseCircuitoLogico = {
  "id": "logica-decisoes-u2-f1",
  "tipo": "circuito-logico",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "A porta da padaria (E)",
  "conceitos": [
    "portao-e",
    "tabela-verdade"
  ],
  "revisa": [
    "booleano-js"
  ],
  "prerequisitos": [
    "booleano-js"
  ],
  "usaFerramentas": [
    "circuito",
    "tabela-verdade"
  ],
  "apresentar": [
    "circuito",
    "tabela-verdade"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "circuito": {
    "paleta": [
      "e",
      "ou",
      "nao"
    ],
    "inicial": {
      "pecas": [
        {
          "id": "cliente",
          "tipo": "entrada",
          "nome": "temCliente",
          "rotulo": "tem cliente",
          "x": 24,
          "y": 30,
          "fixa": true
        },
        {
          "id": "aberta",
          "tipo": "entrada",
          "nome": "lojaAberta",
          "rotulo": "loja aberta",
          "x": 24,
          "y": 150,
          "fixa": true
        },
        {
          "id": "troco",
          "tipo": "entrada",
          "nome": "temTroco",
          "rotulo": "tem troco",
          "x": 24,
          "y": 270,
          "fixa": true
        },
        {
          "id": "porta",
          "tipo": "saida",
          "nome": "portaAbre",
          "rotulo": "porta abre",
          "forma": "porta",
          "x": 520,
          "y": 60,
          "fixa": true
        },
        {
          "id": "caixa",
          "tipo": "saida",
          "nome": "caixaAtende",
          "rotulo": "caixa atende",
          "forma": "lampada",
          "x": 520,
          "y": 230,
          "fixa": true
        }
      ],
      "fios": []
    }
  },
  "introducao": [
    {
      "texto": "Antes de escrever uma decisão, vamos ver ela funcionar. A porta da padaria só abre se tiver cliente E a loja estiver aberta.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "porta-com-e",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha um portão E: as chaves tem cliente e loja aberta entram nele, e a saída dele vai na porta.",
        "toque": "Ponha um portão E: as chaves tem cliente e loja aberta entram nele, e a saída dele vai na porta."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": false,
                  "temTroco": false
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": false,
                  "temTroco": true
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": true,
                  "temTroco": false
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": true,
                  "temTroco": true
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": false,
                  "temTroco": false
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": false,
                  "temTroco": true
                },
                "saida": {
                  "portaAbre": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": true,
                  "temTroco": false
                },
                "saida": {
                  "portaAbre": true
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": true,
                  "temTroco": true
                },
                "saida": {
                  "portaAbre": true
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "e"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual portão só deixa passar quando as DUAS coisas são verdade?",
        "dica": "O E. Cada chave vai numa bolinha da esquerda dele, e a bolinha da direita vai na porta.",
        "linha": {
          "alvo": "circuito",
          "fala": "Os portões moram aqui, na paleta."
        },
        "solucao": {
          "fala": "Pus um E: as duas chaves entram nele, e ele manda na porta.",
          "acoes": [
            {
              "tipo": "adicionarPortao",
              "portao": "e",
              "id": "e1",
              "x": 260,
              "y": 60
            },
            {
              "tipo": "ligarFio",
              "de": "cliente",
              "para": "e1",
              "porta": 0
            },
            {
              "tipo": "ligarFio",
              "de": "aberta",
              "para": "e1",
              "porta": 1
            },
            {
              "tipo": "ligarFio",
              "de": "e1",
              "para": "porta"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Montado! Agora a porta obedece às duas chaves ao mesmo tempo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "e",
          "id": "e1",
          "x": 260,
          "y": 60
        },
        {
          "tipo": "ligarFio",
          "de": "cliente",
          "para": "e1",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "aberta",
          "para": "e1",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "e1",
          "para": "porta"
        }
      ]
    },
    {
      "id": "testar-e",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ligue só a chave loja aberta e veja a porta.",
        "toque": "Ligue só a chave loja aberta e veja a porta."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "Como se liga uma chave?",
        "dica": "Clicando nela (no celular, tocando).",
        "linha": {
          "alvo": "circuito",
          "peca": "aberta",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Liguei a loja aberta: sem cliente, a porta continua fechada.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "aberta",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Viu a linha acender na tabela? Cada combinação testada fica marcada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "aberta",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Com só a loja aberta (sem cliente), a porta abre?",
        "opcoes": [
          "Abre",
          "Não abre"
        ],
        "correta": 1,
        "explicacao": "O E precisa das duas: sem cliente, a porta fica fechada."
      }
    },
    {
      "id": "ver-codigo-e",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Aperte Ver como código.",
        "toque": "Aperte Ver como código."
      },
      "validador": {
        "tipo": "evento",
        "evento": "viuCodigoDoCircuito"
      },
      "ajudas": {
        "pergunta": "Onde a tabela mostra o circuito escrito em JavaScript?",
        "dica": "No botão Ver como código, em cima da tabela.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "tabela-verdade",
          "fala": "Aqui, na tabela verdade."
        },
        "solucao": {
          "fala": "O E virou &&: temCliente && lojaAberta.",
          "acoes": [
            {
              "tipo": "verComoCodigo"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "temCliente && lojaAberta: o mesmo circuito, em código. O E se escreve &&.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "verComoCodigo"
        }
      ]
    },
    {
      "id": "caixa-com-e",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "O caixa só atende se a loja estiver aberta E tiver troco. Monte esse E na saída caixa atende.",
        "toque": "O caixa só atende se a loja estiver aberta E tiver troco. Monte esse E na saída caixa atende."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": false,
                  "temTroco": false
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": false,
                  "temTroco": true
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": true,
                  "temTroco": false
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": false,
                  "lojaAberta": true,
                  "temTroco": true
                },
                "saida": {
                  "caixaAtende": true
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": false,
                  "temTroco": false
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": false,
                  "temTroco": true
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": true,
                  "temTroco": false
                },
                "saida": {
                  "caixaAtende": false
                }
              },
              {
                "entradas": {
                  "temCliente": true,
                  "lojaAberta": true,
                  "temTroco": true
                },
                "saida": {
                  "caixaAtende": true
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "e",
            "minimo": 2
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quais duas chaves precisam estar ligadas ao mesmo tempo?",
        "dica": "Outro portão E: loja aberta e tem troco entram nele, e a saída vai no caixa atende."
      },
      "falaAoConcluir": {
        "texto": "Dois E no mesmo circuito, cada um com a sua regra. A tabela confirma.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "e",
          "id": "e2",
          "x": 260,
          "y": 230
        },
        {
          "tipo": "ligarFio",
          "de": "aberta",
          "para": "e2",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "troco",
          "para": "e2",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "e2",
          "para": "caixa"
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
  "missaoDeCampo": "Abra o Console de qualquer site e escreva true && true, true && false e false && false. Só uma das três responde true: qual?",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

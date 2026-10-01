/*
 * Decisões U2, Fase 3: A luz da rua (NÃO).
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseCircuitoLogico } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F3: FaseCircuitoLogico = {
  "id": "logica-decisoes-u2-f3",
  "tipo": "circuito-logico",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "A luz da rua (NÃO)",
  "conceitos": [
    "portao-nao"
  ],
  "revisa": [
    "portao-e",
    "portao-ou"
  ],
  "prerequisitos": [
    "portao-e",
    "portao-ou",
    "tabela-verdade"
  ],
  "usaFerramentas": [
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
          "id": "sol",
          "tipo": "entrada",
          "nome": "temSol",
          "rotulo": "tem sol",
          "x": 24,
          "y": 30,
          "fixa": true
        },
        {
          "id": "fechada",
          "tipo": "entrada",
          "nome": "portaFechada",
          "rotulo": "porta fechada",
          "x": 24,
          "y": 150,
          "fixa": true
        },
        {
          "id": "gente",
          "tipo": "entrada",
          "nome": "temGente",
          "rotulo": "tem gente",
          "x": 24,
          "y": 270,
          "fixa": true
        },
        {
          "id": "rua",
          "tipo": "saida",
          "nome": "luzDaRua",
          "rotulo": "luz da rua",
          "forma": "lampada",
          "x": 520,
          "y": 30,
          "fixa": true
        },
        {
          "id": "avisoPorta",
          "tipo": "saida",
          "nome": "avisoPorta",
          "rotulo": "aviso da porta",
          "forma": "alarme",
          "x": 520,
          "y": 150,
          "fixa": true
        },
        {
          "id": "salao",
          "tipo": "saida",
          "nome": "luzDoSalao",
          "rotulo": "luz do salão",
          "forma": "lampada",
          "x": 520,
          "y": 270,
          "fixa": true
        }
      ],
      "fios": []
    }
  },
  "introducao": [
    {
      "texto": "A luz da rua acende quando NÃO tem sol. O portão NÃO vira o sim em não e o não em sim: onde a chave liga, ele desliga.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "luz-com-nao",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha um portão NÃO entre a chave tem sol e a luz da rua.",
        "toque": "Ponha um portão NÃO entre a chave tem sol e a luz da rua."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "luzDaRua": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "luzDaRua": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "luzDaRua": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "luzDaRua": true
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "luzDaRua": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "luzDaRua": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "luzDaRua": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "luzDaRua": false
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "nao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual portão inverte: o que era sim vira não?",
        "dica": "O NÃO tem uma entrada só: ligue tem sol nele e a saída dele na luz da rua.",
        "linha": {
          "alvo": "circuito",
          "fala": "O NÃO mora na paleta."
        },
        "solucao": {
          "fala": "Pus um NÃO: com sol, a luz apaga; sem sol, acende.",
          "acoes": [
            {
              "tipo": "adicionarPortao",
              "portao": "nao",
              "id": "n1",
              "x": 200,
              "y": 30
            },
            {
              "tipo": "ligarFio",
              "de": "sol",
              "para": "n1"
            },
            {
              "tipo": "ligarFio",
              "de": "n1",
              "para": "rua"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Sem sol, a luz acende. O NÃO inverteu a chave.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "nao",
          "id": "n1",
          "x": 200,
          "y": 30
        },
        {
          "tipo": "ligarFio",
          "de": "sol",
          "para": "n1"
        },
        {
          "tipo": "ligarFio",
          "de": "n1",
          "para": "rua"
        }
      ]
    },
    {
      "id": "testar-nao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ligue a chave tem sol e veja a luz da rua.",
        "toque": "Ligue a chave tem sol e veja a luz da rua."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "O que o NÃO faz com uma chave ligada?",
        "dica": "Ele entrega o contrário: ligada vira desligada, desligada vira ligada.",
        "linha": {
          "alvo": "circuito",
          "peca": "sol",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Liguei o sol: a luz da rua apagou.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "sol",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Apagou! Com sol, nada de luz. Sem sol, a luz volta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "sol",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Com sol (chave ligada), a luz da rua acende?",
        "opcoes": [
          "Acende",
          "Não acende"
        ],
        "correta": 1,
        "explicacao": "O NÃO inverte: sol ligado vira não ligado, e a luz fica apagada."
      }
    },
    {
      "id": "ver-codigo-nao",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Aperte Ver como código e procure o ponto de exclamação.",
        "toque": "Aperte Ver como código e procure o ponto de exclamação."
      },
      "validador": {
        "tipo": "evento",
        "evento": "viuCodigoDoCircuito"
      },
      "ajudas": {
        "pergunta": "Qual sinal do código faz o papel do NÃO?",
        "dica": "O ponto de exclamação na frente do nome: !temSol.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "tabela-verdade",
          "fala": "Aqui, na tabela verdade."
        },
        "solucao": {
          "fala": "O NÃO virou o ponto de exclamação: !temSol.",
          "acoes": [
            {
              "tipo": "verComoCodigo"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "!temSol: o NÃO se escreve com um ponto de exclamação na frente.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "verComoCodigo"
        }
      ]
    },
    {
      "id": "aviso-com-nao",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "O aviso da porta toca quando a porta NÃO está fechada. Monte isso na saída aviso da porta.",
        "toque": "O aviso da porta toca quando a porta NÃO está fechada. Monte isso na saída aviso da porta."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "avisoPorta": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "avisoPorta": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "avisoPorta": false
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "avisoPorta": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "avisoPorta": true
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "avisoPorta": true
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "avisoPorta": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "avisoPorta": false
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "nao",
            "minimo": 2
          }
        ]
      },
      "ajudas": {
        "pergunta": "O aviso toca com a porta fechada ou com ela aberta?",
        "dica": "Outro NÃO: porta fechada entra nele, e a saída dele vai no aviso da porta."
      },
      "falaAoConcluir": {
        "texto": "Porta fechada, aviso quieto. Porta aberta, aviso tocando: um NÃO resolve.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "nao",
          "id": "n2",
          "x": 200,
          "y": 150
        },
        {
          "tipo": "ligarFio",
          "de": "fechada",
          "para": "n2"
        },
        {
          "tipo": "ligarFio",
          "de": "n2",
          "para": "avisoPorta"
        }
      ]
    },
    {
      "id": "salao-com-e-nao",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "A luz do salão acende se tem gente E NÃO tem sol. Combine um E com um NÃO.",
        "toque": "A luz do salão acende se tem gente E NÃO tem sol. Combine um E com um NÃO."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "luzDoSalao": false
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "luzDoSalao": true
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "luzDoSalao": false
                }
              },
              {
                "entradas": {
                  "temSol": false,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "luzDoSalao": true
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": false
                },
                "saida": {
                  "luzDoSalao": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": false,
                  "temGente": true
                },
                "saida": {
                  "luzDoSalao": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": false
                },
                "saida": {
                  "luzDoSalao": false
                }
              },
              {
                "entradas": {
                  "temSol": true,
                  "portaFechada": true,
                  "temGente": true
                },
                "saida": {
                  "luzDoSalao": false
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
        "pergunta": "O E recebe quais duas coisas: a chave tem gente e o quê?",
        "dica": "O E recebe tem gente numa entrada e, na outra, o NÃO que inverte o sol. A saída do E vai na luz do salão."
      },
      "falaAoConcluir": {
        "texto": "E com NÃO juntos: gente presente e sol ausente. No código: temGente && !temSol.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "nao",
          "id": "n3",
          "x": 200,
          "y": 220
        },
        {
          "tipo": "ligarFio",
          "de": "sol",
          "para": "n3"
        },
        {
          "tipo": "adicionarPortao",
          "portao": "e",
          "id": "e1",
          "x": 360,
          "y": 270
        },
        {
          "tipo": "ligarFio",
          "de": "gente",
          "para": "e1",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "n3",
          "para": "e1",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "e1",
          "para": "salao"
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
  "missaoDeCampo": "Abra o Console de qualquer site e escreva !true, !false e !!true. Antes de apertar Enter, tente adivinhar as três respostas.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

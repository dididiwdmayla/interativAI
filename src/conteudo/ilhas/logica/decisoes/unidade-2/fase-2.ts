/*
 * Decisões U2, Fase 2: O alarme (OU).
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseCircuitoLogico } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F2: FaseCircuitoLogico = {
  "id": "logica-decisoes-u2-f2",
  "tipo": "circuito-logico",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "O alarme (OU)",
  "conceitos": [
    "portao-ou"
  ],
  "revisa": [
    "portao-e",
    "tabela-verdade"
  ],
  "prerequisitos": [
    "portao-e",
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
          "id": "janela",
          "tipo": "entrada",
          "nome": "janelaAberta",
          "rotulo": "janela aberta",
          "x": 24,
          "y": 30,
          "fixa": true
        },
        {
          "id": "porta",
          "tipo": "entrada",
          "nome": "portaAberta",
          "rotulo": "porta aberta",
          "x": 24,
          "y": 150,
          "fixa": true
        },
        {
          "id": "fundos",
          "tipo": "entrada",
          "nome": "portaDosFundos",
          "rotulo": "porta dos fundos",
          "x": 24,
          "y": 270,
          "fixa": true
        },
        {
          "id": "alarme",
          "tipo": "saida",
          "nome": "alarmeToca",
          "rotulo": "alarme toca",
          "forma": "alarme",
          "x": 520,
          "y": 60,
          "fixa": true
        },
        {
          "id": "aviso",
          "tipo": "saida",
          "nome": "luzAviso",
          "rotulo": "luz de aviso",
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
      "texto": "O alarme da loja toca se a janela OU a porta abrir. Um basta: o portão OU acende quando pelo menos uma entrada está ligada.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "alarme-com-ou",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ponha um portão OU: janela aberta e porta aberta entram nele, e a saída dele vai no alarme.",
        "toque": "Ponha um portão OU: janela aberta e porta aberta entram nele, e a saída dele vai no alarme."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": false,
                  "portaDosFundos": false
                },
                "saida": {
                  "alarmeToca": false
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": false,
                  "portaDosFundos": true
                },
                "saida": {
                  "alarmeToca": false
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": true,
                  "portaDosFundos": false
                },
                "saida": {
                  "alarmeToca": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": true,
                  "portaDosFundos": true
                },
                "saida": {
                  "alarmeToca": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": false,
                  "portaDosFundos": false
                },
                "saida": {
                  "alarmeToca": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": false,
                  "portaDosFundos": true
                },
                "saida": {
                  "alarmeToca": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": true,
                  "portaDosFundos": false
                },
                "saida": {
                  "alarmeToca": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": true,
                  "portaDosFundos": true
                },
                "saida": {
                  "alarmeToca": true
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "ou"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual portão acende quando UMA das entradas basta?",
        "dica": "O OU. As duas chaves entram nele e a saída dele vai no alarme.",
        "linha": {
          "alvo": "circuito",
          "fala": "O OU mora na paleta, junto do E."
        },
        "solucao": {
          "fala": "Pus um OU: qualquer uma das duas chaves já faz o alarme tocar.",
          "acoes": [
            {
              "tipo": "adicionarPortao",
              "portao": "ou",
              "id": "ou1",
              "x": 260,
              "y": 60
            },
            {
              "tipo": "ligarFio",
              "de": "janela",
              "para": "ou1",
              "porta": 0
            },
            {
              "tipo": "ligarFio",
              "de": "porta",
              "para": "ou1",
              "porta": 1
            },
            {
              "tipo": "ligarFio",
              "de": "ou1",
              "para": "alarme"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Montado! Com uma chave ligada, o alarme já toca.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "ou",
          "id": "ou1",
          "x": 260,
          "y": 60
        },
        {
          "tipo": "ligarFio",
          "de": "janela",
          "para": "ou1",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "porta",
          "para": "ou1",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "ou1",
          "para": "alarme"
        }
      ]
    },
    {
      "id": "testar-ou-desligado",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Deixe tudo desligado, ligue e desligue uma chave e veja o alarme.",
        "toque": "Deixe tudo desligado, ligue e desligue uma chave e veja o alarme."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "O OU acende quando nenhuma entrada está ligada?",
        "dica": "Clique numa chave para ligar e outra vez para desligar; olhe o alarme.",
        "linha": {
          "alvo": "circuito",
          "peca": "janela",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Liguei a janela: o alarme tocou. Nenhuma ligada, nada toca.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "janela",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Certo: precisa de pelo menos uma. Com todas desligadas, o alarme fica quieto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "janela",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Com as duas chaves desligadas, o OU acende?",
        "opcoes": [
          "Acende",
          "Não acende"
        ],
        "correta": 1,
        "explicacao": "O OU só acende se pelo menos uma entrada estiver ligada. Nenhuma ligada, nada acende."
      }
    },
    {
      "id": "testar-ou-duas",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ligue a janela e a porta juntas e veja o alarme.",
        "toque": "Ligue a janela e a porta juntas e veja o alarme."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "'Um ou outro' exclui o caso das duas ligadas?",
        "dica": "No código, o OU também aceita os dois: pelo menos uma entrada ligada basta.",
        "linha": {
          "alvo": "circuito",
          "peca": "porta",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Com as duas ligadas, o alarme continua tocando.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "porta",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Toca! O OU do código não é 'um ou outro': as duas ligadas também valem.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "porta",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Com a janela E a porta abertas ao mesmo tempo, o alarme toca?",
        "opcoes": [
          "Toca",
          "Não toca: só vale uma"
        ],
        "correta": 0,
        "explicacao": "O OU aceita uma OU as duas. 'Pelo menos uma' inclui o caso das duas ligadas."
      }
    },
    {
      "id": "aviso-com-ou",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "A luz de aviso acende se a porta dos fundos OU a janela estiver aberta. Monte esse OU.",
        "toque": "A luz de aviso acende se a porta dos fundos OU a janela estiver aberta. Monte esse OU."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": false,
                  "portaDosFundos": false
                },
                "saida": {
                  "luzAviso": false
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": false,
                  "portaDosFundos": true
                },
                "saida": {
                  "luzAviso": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": true,
                  "portaDosFundos": false
                },
                "saida": {
                  "luzAviso": false
                }
              },
              {
                "entradas": {
                  "janelaAberta": false,
                  "portaAberta": true,
                  "portaDosFundos": true
                },
                "saida": {
                  "luzAviso": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": false,
                  "portaDosFundos": false
                },
                "saida": {
                  "luzAviso": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": false,
                  "portaDosFundos": true
                },
                "saida": {
                  "luzAviso": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": true,
                  "portaDosFundos": false
                },
                "saida": {
                  "luzAviso": true
                }
              },
              {
                "entradas": {
                  "janelaAberta": true,
                  "portaAberta": true,
                  "portaDosFundos": true
                },
                "saida": {
                  "luzAviso": true
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "ou",
            "minimo": 2
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quais duas chaves podem, sozinhas, acender a luz?",
        "dica": "Outro portão OU: porta dos fundos e janela aberta entram nele, e a saída vai na luz de aviso."
      },
      "falaAoConcluir": {
        "texto": "Dois OU no circuito: cada saída tem a sua regra, mas as chaves podem ser as mesmas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "ou",
          "id": "ou2",
          "x": 260,
          "y": 230
        },
        {
          "tipo": "ligarFio",
          "de": "fundos",
          "para": "ou2",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "janela",
          "para": "ou2",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "ou2",
          "para": "aviso"
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
  "missaoDeCampo": "Abra o Console de qualquer site e escreva false || false, true || false e true || true. Só uma das três responde false: qual?",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

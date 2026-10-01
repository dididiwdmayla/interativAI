/*
 * Decisões U2, Fase 5: A catraca do metrô.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseCircuitoLogico } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F5: FaseCircuitoLogico = {
  "id": "logica-decisoes-u2-f5",
  "tipo": "circuito-logico",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "A catraca do metrô",
  "conceitos": [
    "ordem-e-ou"
  ],
  "revisa": [
    "portao-e",
    "portao-ou",
    "portao-nao",
    "operadores-logicos"
  ],
  "prerequisitos": [
    "portao-e",
    "portao-ou",
    "portao-nao",
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
          "id": "bilhete",
          "tipo": "entrada",
          "nome": "temBilhete",
          "rotulo": "tem bilhete",
          "x": 24,
          "y": 30,
          "fixa": true
        },
        {
          "id": "idoso",
          "tipo": "entrada",
          "nome": "ehIdoso",
          "rotulo": "é idoso",
          "x": 24,
          "y": 150,
          "fixa": true
        },
        {
          "id": "bloqueado",
          "tipo": "entrada",
          "nome": "bilheteBloqueado",
          "rotulo": "bilhete bloqueado",
          "x": 24,
          "y": 270,
          "fixa": true
        },
        {
          "id": "catraca",
          "tipo": "saida",
          "nome": "catracaLibera",
          "rotulo": "catraca libera",
          "forma": "porta",
          "x": 540,
          "y": 70,
          "fixa": true
        },
        {
          "id": "fila",
          "tipo": "saida",
          "nome": "entraNaFila",
          "rotulo": "entra na fila",
          "forma": "porta",
          "x": 540,
          "y": 230,
          "fixa": true
        }
      ],
      "fios": []
    }
  },
  "introducao": [
    {
      "texto": "Na catraca do metrô, bilhete bloqueado nunca passa. Quando juntamos E e OU, a ordem dos portões muda o resultado. Vamos ver isso.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "catraca-simples",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Monte: a catraca libera se tem bilhete E o bilhete NÃO está bloqueado.",
        "toque": "Monte: a catraca libera se tem bilhete E o bilhete NÃO está bloqueado."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "e"
          },
          {
            "tipo": "usouPortao",
            "portao": "nao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A catraca precisa de um NÃO e de um E. Quem entra em quem?",
        "dica": "O bilhete bloqueado entra num NÃO; a saída do NÃO e o tem bilhete entram no E; o E vai na catraca.",
        "linha": {
          "alvo": "circuito",
          "fala": "Os portões moram aqui, na paleta."
        },
        "solucao": {
          "fala": "NÃO inverte o bloqueio, e o E junta com o bilhete.",
          "acoes": [
            {
              "tipo": "adicionarPortao",
              "portao": "nao",
              "id": "n1",
              "x": 160,
              "y": 270
            },
            {
              "tipo": "ligarFio",
              "de": "bloqueado",
              "para": "n1"
            },
            {
              "tipo": "adicionarPortao",
              "portao": "e",
              "id": "e1",
              "x": 330,
              "y": 130
            },
            {
              "tipo": "ligarFio",
              "de": "bilhete",
              "para": "e1",
              "porta": 0
            },
            {
              "tipo": "ligarFio",
              "de": "n1",
              "para": "e1",
              "porta": 1
            },
            {
              "tipo": "ligarFio",
              "de": "e1",
              "para": "catraca"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Montado: temBilhete && !bilheteBloqueado.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "nao",
          "id": "n1",
          "x": 160,
          "y": 270
        },
        {
          "tipo": "ligarFio",
          "de": "bloqueado",
          "para": "n1"
        },
        {
          "tipo": "adicionarPortao",
          "portao": "e",
          "id": "e1",
          "x": 330,
          "y": 130
        },
        {
          "tipo": "ligarFio",
          "de": "bilhete",
          "para": "e1",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "n1",
          "para": "e1",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "e1",
          "para": "catraca"
        }
      ]
    },
    {
      "id": "codigo-catraca",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Aperte Ver como código e leia a expressão da catraca.",
        "toque": "Aperte Ver como código e leia a expressão da catraca."
      },
      "validador": {
        "tipo": "evento",
        "evento": "viuCodigoDoCircuito"
      },
      "ajudas": {
        "pergunta": "Os portões ligados viram qual expressão?",
        "dica": "No botão Ver como código: o E vira && e o NÃO vira !.",
        "linha": {
          "alvo": "ferramenta",
          "ferramenta": "tabela-verdade",
          "fala": "Aqui, na tabela verdade."
        },
        "solucao": {
          "fala": "temBilhete && !bilheteBloqueado: cada portão virou um operador.",
          "acoes": [
            {
              "tipo": "verComoCodigo"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Cada portão vira um operador, na mesma ordem da fiação.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "verComoCodigo"
        }
      ]
    },
    {
      "id": "idoso-sem-bilhete",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ligue só a chave é idoso e veja a catraca.",
        "toque": "Ligue só a chave é idoso e veja a catraca."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "A chave é idoso está ligada em algum portão?",
        "dica": "Ainda não: a catraca só olha o bilhete e o bloqueio.",
        "linha": {
          "alvo": "circuito",
          "peca": "idoso",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Ligar é idoso não muda nada: ela ainda não está ligada em nenhum portão.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "idoso",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Não libera. Para valer a regra do idoso, falta um OU.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "idoso",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Uma pessoa idosa, sem bilhete: a catraca libera neste circuito?",
        "opcoes": [
          "Libera",
          "Não libera"
        ],
        "correta": 1,
        "explicacao": "Este circuito só pergunta pelo bilhete. A chave é idoso ainda não manda em nada."
      }
    },
    {
      "id": "ou-antes-do-e",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Agora, a catraca libera se (tem bilhete OU é idoso) E o bilhete NÃO está bloqueado. Ponha o OU antes do E.",
        "toque": "Agora, a catraca libera se (tem bilhete OU é idoso) E o bilhete NÃO está bloqueado. Ponha o OU antes do E."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": true
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "catracaLibera": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "catracaLibera": false
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
        "pergunta": "Qual portão entra primeiro, o OU ou o E?",
        "dica": "O OU junta tem bilhete e é idoso; a saída dele entra no E, no lugar do tem bilhete.",
        "linha": {
          "alvo": "circuito",
          "fala": "O OU junta tem bilhete e é idoso; a saída dele entra no E, no lugar do tem bilhete."
        },
        "solucao": {
          "fala": "O OU fica antes e entrega o resultado dele ao E.",
          "acoes": [
            {
              "tipo": "adicionarPortao",
              "portao": "ou",
              "id": "ou1",
              "x": 160,
              "y": 80
            },
            {
              "tipo": "ligarFio",
              "de": "bilhete",
              "para": "ou1",
              "porta": 0
            },
            {
              "tipo": "ligarFio",
              "de": "idoso",
              "para": "ou1",
              "porta": 1
            },
            {
              "tipo": "ligarFio",
              "de": "ou1",
              "para": "e1",
              "porta": 0
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Montado: (temBilhete || ehIdoso) && !bilheteBloqueado. Os parênteses mostram quem vai primeiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "ou",
          "id": "ou1",
          "x": 160,
          "y": 80
        },
        {
          "tipo": "ligarFio",
          "de": "bilhete",
          "para": "ou1",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "idoso",
          "para": "ou1",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "ou1",
          "para": "e1",
          "porta": 0
        }
      ]
    },
    {
      "id": "e-antes-do-ou",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Na saída entra na fila: é idoso OU (tem bilhete E NÃO bloqueado). Agora o E vem antes do OU.",
        "toque": "Na saída entra na fila: é idoso OU (tem bilhete E NÃO bloqueado). Agora o E vem antes do OU."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "circuitoTabela",
            "esperado": [
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "entraNaFila": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "entraNaFila": false
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "entraNaFila": true
                }
              },
              {
                "entradas": {
                  "temBilhete": false,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "entraNaFila": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "entraNaFila": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": false,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "entraNaFila": false
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": false
                },
                "saida": {
                  "entraNaFila": true
                }
              },
              {
                "entradas": {
                  "temBilhete": true,
                  "ehIdoso": true,
                  "bilheteBloqueado": true
                },
                "saida": {
                  "entraNaFila": true
                }
              }
            ]
          },
          {
            "tipo": "usouPortao",
            "portao": "e",
            "minimo": 2
          },
          {
            "tipo": "usouPortao",
            "portao": "ou",
            "minimo": 2
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quem fica de fora dos parênteses agora: o idoso ou o bilhete?",
        "dica": "Um segundo E junta tem bilhete e o NÃO do bloqueio; a saída dele entra num segundo OU, junto de é idoso; o OU vai na fila."
      },
      "falaAoConcluir": {
        "texto": "Montado: ehIdoso || (temBilhete && !bilheteBloqueado). Mesmos portões, ordem diferente.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "adicionarPortao",
          "portao": "e",
          "id": "e2",
          "x": 330,
          "y": 250
        },
        {
          "tipo": "ligarFio",
          "de": "bilhete",
          "para": "e2",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "n1",
          "para": "e2",
          "porta": 1
        },
        {
          "tipo": "adicionarPortao",
          "portao": "ou",
          "id": "ou2",
          "x": 450,
          "y": 250
        },
        {
          "tipo": "ligarFio",
          "de": "idoso",
          "para": "ou2",
          "porta": 0
        },
        {
          "tipo": "ligarFio",
          "de": "e2",
          "para": "ou2",
          "porta": 1
        },
        {
          "tipo": "ligarFio",
          "de": "ou2",
          "para": "fila"
        }
      ]
    },
    {
      "id": "ordem-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Ligue é idoso e bilhete bloqueado, e compare as duas saídas.",
        "toque": "Ligue é idoso e bilhete bloqueado, e compare as duas saídas."
      },
      "validador": {
        "tipo": "evento",
        "evento": "alternouEntrada"
      },
      "ajudas": {
        "pergunta": "O E e o OU, em ordem diferente, dão a mesma tabela?",
        "dica": "Teste: é idoso ligado e bilhete bloqueado ligado. A fiação diferente decide quem vence.",
        "linha": {
          "alvo": "circuito",
          "peca": "bloqueado",
          "fala": "Esta chave."
        },
        "solucao": {
          "fala": "Com idoso e bloqueio ligados, só a fila acende: a ordem dos portões mudou a regra.",
          "acoes": [
            {
              "tipo": "alternarEntrada",
              "entrada": "idoso",
              "ligada": true
            },
            {
              "tipo": "alternarEntrada",
              "entrada": "bloqueado",
              "ligada": true
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A ordem muda o resultado! No código isso é questão de parênteses.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "idoso",
          "ligada": true
        },
        {
          "tipo": "alternarEntrada",
          "entrada": "bloqueado",
          "ligada": true
        }
      ],
      "previsao": {
        "pergunta": "Idoso com bilhete bloqueado: quais saídas acendem?",
        "opcoes": [
          "Só catraca libera",
          "Só entra na fila",
          "As duas",
          "Nenhuma"
        ],
        "correta": 1,
        "explicacao": "No segundo circuito o idoso entra na fila por conta própria (E antes do OU); na catraca, o bloqueio vence."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado. Cada resposta veio da regra, não de sorte.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e compare true || false && false com (true || false) && false. As respostas são diferentes: explique qual operador foi calculado antes.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

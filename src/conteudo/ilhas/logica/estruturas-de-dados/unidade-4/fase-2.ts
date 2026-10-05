/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U4_F2: Fase = {
  "id": "logica-estruturas-de-dados-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u4",
  "titulo": "Visitar cada ramo",
  "conceitos": [
    "percorrer-arvore"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "arvore-de-dados",
    "recursao-js",
    "caso-base-recursao",
    "problema-menor-recursao"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "arvore-de-dados",
    "recursao-js",
    "caso-base-recursao",
    "problema-menor-recursao"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "arvore-palco",
    "cena",
    "ficha-dispositivo",
    "velocidade-simulacao"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "estrutura.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "Revise a recursão de Algoritmos: luzes(no) trata null, visita o nó e chama luzes para cada filho. Uma folha não tem mais chamadas.",
      "expressao": "apontando"
    },
    {
      "texto": "Devolva nomes das lâmpadas na ordem de visita, da esquerda para a direita. Depois use aparelhos[nome].ligar() para acender cada nome encontrado.",
      "expressao": "apontando"
    },
    {
      "texto": "Dois laços fixos só alcançam dois níveis. A recursão chega também a um cômodo dentro de outro, sem mudar a função.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "percurso-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie luzes(no), devolvendo nomes de lâmpadas. Percorra casa e acenda Sala e Cozinha com aparelhos[nome].ligar().",
        "toque": "Crie luzes(no), devolvendo nomes de lâmpadas. Percorra casa e acenda Sala e Cozinha com aparelhos[nome].ligar()."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "luzes",
            "casos": [
              {
                "args": [
                  null
                ],
                "esperado": []
              },
              {
                "args": [
                  {
                    "nome": "Vazia",
                    "filhos": []
                  }
                ],
                "esperado": []
              },
              {
                "args": [
                  {
                    "nome": "x",
                    "lampada": true,
                    "filhos": []
                  }
                ],
                "esperado": [
                  "x"
                ]
              },
              {
                "args": [
                  {
                    "nome": "Casa",
                    "filhos": [
                      {
                        "nome": "Sala",
                        "filhos": [
                          {
                            "nome": "luzSala",
                            "lampada": true,
                            "filhos": []
                          }
                        ]
                      },
                      {
                        "nome": "Cozinha",
                        "filhos": [
                          {
                            "nome": "luzCozinha",
                            "lampada": true,
                            "filhos": []
                          }
                        ]
                      }
                    ]
                  }
                ],
                "esperado": [
                  "luzSala",
                  "luzCozinha"
                ]
              },
              {
                "args": [
                  {
                    "nome": "Raiz",
                    "filhos": [
                      {
                        "nome": "A",
                        "filhos": [
                          {
                            "nome": "B",
                            "filhos": [
                              {
                                "nome": "x",
                                "lampada": true,
                                "filhos": []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ],
                "esperado": [
                  "x"
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "nomes",
            "valor": [
              "luzSala",
              "luzCozinha"
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzSala",
            "propriedade": "ligada",
            "valor": true
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzCozinha",
            "propriedade": "ligada",
            "valor": true
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzCorredor",
            "propriedade": "ligada",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Em null devolva []; visite a lâmpada atual e junte os nomes de luzes(filho) para cada filho.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Em null devolva []; visite a lâmpada atual e junte os nomes de luzes(filho) para cada filho."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function luzes(no) {\n  if (no === null) return [];\n  const nomes = [];\n  if (no.lampada === true) nomes.push(no.nome);\n  for (const filho of no.filhos) {\n    const abaixo = luzes(filho);\n    for (const nome of abaixo) nomes.push(nome);\n  }\n  return nomes;\n}\nconst casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};\nconst aparelhos = {luzSala, luzCozinha, luzCorredor};\nconst nomes = luzes(casa);\nfor (const nome of nomes) aparelhos[nome].ligar();"
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "verComoArvore",
              "nome": "casa"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A folha encerra seu ramo; as molduras voltam com os nomes.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function luzes(no) {\n  if (no === null) return [];\n  const nomes = [];\n  if (no.lampada === true) nomes.push(no.nome);\n  for (const filho of no.filhos) {\n    const abaixo = luzes(filho);\n    for (const nome of abaixo) nomes.push(nome);\n  }\n  return nomes;\n}\nconst casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};\nconst aparelhos = {luzSala, luzCozinha, luzCorredor};\nconst nomes = luzes(casa);\nfor (const nome of nomes) aparelhos[nome].ligar();"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "verComoArvore",
          "nome": "casa"
        }
      ]
    },
    {
      "id": "percurso-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Acrescente Corredor e luzCorredor. Sem mudar luzes, acenda as três lâmpadas e confira nomes no palco.",
        "toque": "Acrescente Corredor e luzCorredor. Sem mudar luzes, acenda as três lâmpadas e confira nomes no palco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "luzes",
            "casos": [
              {
                "args": [
                  null
                ],
                "esperado": []
              },
              {
                "args": [
                  {
                    "nome": "Vazia",
                    "filhos": []
                  }
                ],
                "esperado": []
              },
              {
                "args": [
                  {
                    "nome": "x",
                    "lampada": true,
                    "filhos": []
                  }
                ],
                "esperado": [
                  "x"
                ]
              },
              {
                "args": [
                  {
                    "nome": "Casa",
                    "filhos": [
                      {
                        "nome": "Sala",
                        "filhos": [
                          {
                            "nome": "luzSala",
                            "lampada": true,
                            "filhos": []
                          }
                        ]
                      },
                      {
                        "nome": "Cozinha",
                        "filhos": [
                          {
                            "nome": "luzCozinha",
                            "lampada": true,
                            "filhos": []
                          }
                        ]
                      }
                    ]
                  }
                ],
                "esperado": [
                  "luzSala",
                  "luzCozinha"
                ]
              },
              {
                "args": [
                  {
                    "nome": "Raiz",
                    "filhos": [
                      {
                        "nome": "A",
                        "filhos": [
                          {
                            "nome": "B",
                            "filhos": [
                              {
                                "nome": "x",
                                "lampada": true,
                                "filhos": []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ],
                "esperado": [
                  "x"
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "nomes",
            "valor": [
              "luzSala",
              "luzCozinha",
              "luzCorredor"
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzSala",
            "propriedade": "ligada",
            "valor": true
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzCozinha",
            "propriedade": "ligada",
            "valor": true
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luzCorredor",
            "propriedade": "ligada",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "O novo ramo deve ser percorrido pela mesma chamada recursiva."
      },
      "falaAoConcluir": {
        "texto": "Percorrer o DOM segue essa ideia: visitar um elemento, depois seus filhos.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function luzes(no) {\n  if (no === null) return [];\n  const nomes = [];\n  if (no.lampada === true) nomes.push(no.nome);\n  for (const filho of no.filhos) {\n    const abaixo = luzes(filho);\n    for (const nome of abaixo) nomes.push(nome);\n  }\n  return nomes;\n}\nconst casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};\ncasa.filhos.push({\"nome\": \"Corredor\", \"filhos\": [{\"nome\": \"luzCorredor\", \"lampada\": true, \"filhos\": []}]});\nconst aparelhos = {luzSala, luzCozinha, luzCorredor};\nconst nomes = luzes(casa);\nfor (const nome of nomes) aparelhos[nome].ligar();"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "verComoArvore",
          "nome": "casa"
        }
      ],
      "previsao": {
        "pergunta": "Se Cozinha ganhar um cômodo filho com outra lâmpada, a função recursiva precisa de mais um laço fixo?",
        "opcoes": [
          "Não: ela visita cada filho recursivamente",
          "Sim, um laço para cada nível",
          "Só se usar Map"
        ],
        "correta": 0,
        "explicacao": "Cada filho vira uma árvore menor; folhas terminam a chamada."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Rebobine para ver por onde cada item passou e qual regra decidiu a ordem.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "Troque os dados e teste também a estrutura vazia.",
    "expressao": "curioso"
  },
  "missaoDeCampo": "No Console de qualquer site: let p=[]; p.push(\"A\",\"B\"); p.pop(); let f=[]; f.push(\"A\",\"B\"); f.shift(); Compare quem saiu e o que ficou.",
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "cena": {
    "id": "arvore-casa",
    "titulo": "Acender a casa inteira",
    "ambiente": "casa",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "parede",
        "x": 0,
        "y": 0
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150,
        "variante": "madeira"
      },
      {
        "peca": "mesa",
        "x": 20,
        "y": 115
      },
      {
        "peca": "cozinha",
        "x": 110,
        "y": 60,
        "largura": 125,
        "altura": 90
      },
      {
        "peca": "porta",
        "x": 265,
        "y": 68
      }
    ],
    "dispositivos": [
      {
        "id": "luzSala",
        "tipo": "lampada",
        "x": 55,
        "y": 30
      },
      {
        "id": "luzCozinha",
        "tipo": "lampada",
        "x": 172,
        "y": 30
      },
      {
        "id": "luzCorredor",
        "tipo": "lampada",
        "x": 277,
        "y": 30
      }
    ],
    "linhaDoTempo": []
  }
};

/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U4_F3: Fase = {
  "id": "logica-estruturas-de-dados-u4-f3",
  "tipo": "desafio",
  "unidadeId": "logica-estruturas-de-dados-u4",
  "titulo": "As luzes do centro cultural",
  "conceitos": [],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "arvore-de-dados",
    "percorrer-arvore",
    "recursao-js"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "arvore-de-dados",
    "percorrer-arvore",
    "recursao-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "arvore-palco"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "areas": [
    "snippet",
    "palco"
  ],
  "programa": {
    "snippet": {
      "nome": "desafio.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "Crie coletar(no): devolva nomes das lâmpadas de todos os níveis em ordem; null e ramos sem lâmpadas viram [].",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "codigo",
      "descricao": "Crie coletar(no): devolva nomes das lâmpadas de todos os níveis em ordem; null e ramos sem lâmpadas viram [].",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "coletar",
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
              },
              {
                "args": [
                  {
                    "nome": "Centro cultural",
                    "filhos": [
                      {
                        "nome": "Palco",
                        "lampada": true,
                        "filhos": []
                      },
                      {
                        "nome": "Anexo",
                        "filhos": [
                          {
                            "nome": "Oficina",
                            "filhos": [
                              {
                                "nome": "Bancada",
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
                  "Palco",
                  "Bancada"
                ]
              }
            ]
          },
          {
            "tipo": "formaDaEstrutura",
            "nome": "predio",
            "forma": "arvore"
          },
          {
            "tipo": "valorVariavel",
            "nome": "nomes",
            "valor": [
              "Palco",
              "Bancada"
            ]
          }
        ]
      },
      "revisarEm": "logica-estruturas-de-dados-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function coletar(no) {\n  if (no === null) return [];\n  const nomes = [];\n  if (no.lampada === true) nomes.push(no.nome);\n  for (const filho of no.filhos) {\n    const abaixo = coletar(filho);\n    for (const nome of abaixo) nomes.push(nome);\n  }\n  return nomes;\n}\nconst predio = {\"nome\": \"Centro cultural\", \"filhos\": [{\"nome\": \"Palco\", \"lampada\": true, \"filhos\": []}, {\"nome\": \"Anexo\", \"filhos\": [{\"nome\": \"Oficina\", \"filhos\": [{\"nome\": \"Bancada\", \"lampada\": true, \"filhos\": []}]}]}]};\nconst nomes = coletar(predio);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "A regra funcionou com vazio, um item e caminhos diferentes. Sua estrutura atende o novo pedido.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "No Console real, compare push/pop e push/shift com os mesmos itens.",
    "expressao": "feliz"
  },
  "missaoDeCampo": "No Console de qualquer site, use uma lista como pilha com push/pop e outra como fila com push/shift. Veja quem sai primeiro."
};

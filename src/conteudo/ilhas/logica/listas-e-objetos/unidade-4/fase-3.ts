/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U4_F3: FasePratica = {
  "id": "logica-listas-e-objetos-u4-f3",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u4",
  "titulo": "Opções sem glúten",
  "conceitos": [
    "filtrar-campo-js"
  ],
  "revisa": [
    "filter-lista-js",
    "find-lista-js",
    "map-lista-js",
    "arrow-js",
    "acesso-objeto-js"
  ],
  "prerequisitos": [
    "filter-lista-js",
    "find-lista-js",
    "map-lista-js",
    "arrow-js",
    "acesso-objeto-js"
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
      "nome": "Opções sem glúten",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    },
    "preparo": "const cardapio = [{\"nome\": \"Broa\", \"preco\": 5, \"semGluten\": false}, {\"nome\": \"Tapioca\", \"preco\": 8, \"semGluten\": true}, {\"nome\": \"Bolo\", \"preco\": 12, \"semGluten\": false}]"
  },
  "introducao": [
    {
      "texto": "filter(item => item.semGluten) testa o booleano de cada ficha. map(item => item.nome) depois extrai os nomes das aprovadas.",
      "expressao": "apontando"
    },
    {
      "texto": "A lista do filter é nova, mas suas fichas são as mesmas da original. Mudar um campo de uma ficha filtrada também muda a original.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f3-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Filtre semGluten em opcoes; use map para nomes; use find para primeira. Observe lista contra uma ficha.",
        "toque": "Filtre semGluten em opcoes; use map para nomes; use find para primeira. Observe lista contra uma ficha."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "opcoes",
            "valor": [
              {
                "nome": "Tapioca",
                "preco": 8,
                "semGluten": true
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "nomes",
            "valor": [
              "Tapioca"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeira",
            "valor": {
              "nome": "Tapioca",
              "preco": 8,
              "semGluten": true
            }
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:map"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:find"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "A condição lê item.semGluten. find entrega uma ficha, filter entrega vagões.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A condição lê item.semGluten. find entrega uma ficha, filter entrega vagões."
        },
        "solucao": {
          "fala": "Uma opção: Tapioca. primeira é uma ficha; opcoes é uma lista.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const opcoes = cardapio.filter(item => item.semGluten)\nconst nomes = opcoes.map(item => item.nome)\nlet primeira = cardapio.find(item => item.semGluten)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma opção: Tapioca. primeira é uma ficha; opcoes é uma lista.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const opcoes = cardapio.filter(item => item.semGluten)\nconst nomes = opcoes.map(item => item.nome)\nlet primeira = cardapio.find(item => item.semGluten)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f3-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Mude opcoes[0].preco para 9 e guarde compartilhado = cardapio[1].preco.",
        "toque": "Mude opcoes[0].preco para 9 e guarde compartilhado = cardapio[1].preco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "compartilhado",
            "valor": 9
          },
          {
            "tipo": "valorVariavel",
            "nome": "opcoes",
            "valor": [
              {
                "nome": "Tapioca",
                "preco": 9,
                "semGluten": true
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeira",
            "valor": {
              "nome": "Tapioca",
              "preco": 9,
              "semGluten": true
            }
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "filter cria outra lista, sem duplicar as fichas.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "filter cria outra lista, sem duplicar as fichas."
        },
        "solucao": {
          "fala": "A ficha da Tapioca é compartilhada: o preço também mudou no cardápio.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "opcoes[0].preco = 9\nlet compartilhado = cardapio[1].preco"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A ficha da Tapioca é compartilhada: o preço também mudou no cardápio.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "opcoes[0].preco = 9\nlet compartilhado = cardapio[1].preco"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "opcoes veio de filter. Alterar opcoes[0].preco muda a Tapioca no cardapio?",
        "opcoes": [
          "Não, filter copia tudo",
          "Sim, é a mesma ficha",
          "Só muda o nome"
        ],
        "correta": 1,
        "explicacao": "A fileira é nova; os objetos dentro continuam compartilhados."
      }
    },
    {
      "id": "f3-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie baratos(lista) com filter e arrow para fichas preco <= 6. Guarde achados para Broa 5 e Bolo 12.",
        "toque": "Crie baratos(lista) com filter e arrow para fichas preco <= 6. Guarde achados para Broa 5 e Bolo 12."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "baratos",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": []
              },
              {
                "args": [
                  [
                    {
                      "nome": "A",
                      "preco": 6
                    },
                    {
                      "nome": "B",
                      "preco": 7
                    }
                  ]
                ],
                "esperado": [
                  {
                    "nome": "A",
                    "preco": 6
                  }
                ]
              },
              {
                "args": [
                  [
                    {
                      "nome": "C",
                      "preco": 8
                    }
                  ]
                ],
                "esperado": []
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "achados",
            "valor": [
              {
                "nome": "Broa",
                "preco": 5
              }
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Cada condição usa o preço da ficha da vez, incluindo a fronteira 6."
      },
      "falaAoConcluir": {
        "texto": "A função devolve fichas aprovadas, sem perder seus nomes.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const baratos = (lista) => lista.filter(item => item.preco <= 6)\nlet achados = baratos([{nome: \"Broa\", preco: 5}, {nome: \"Bolo\", preco: 12}])"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "No Console real os dados funcionam igual. Aqui, volte pela linha do tempo para acompanhar cada mudança.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie compras = [{nome: \"pão\", preco: 4}, {nome: \"bolo\", preco: 12}]; filtre item.preco > 10 e confira length: 1.",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

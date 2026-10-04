/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U4_F2: FasePratica = {
  "id": "logica-listas-e-objetos-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u4",
  "titulo": "Total e maior preço",
  "conceitos": [
    "somar-campo-js",
    "desestruturacao-objeto-js"
  ],
  "revisa": [
    "lista-objetos-js",
    "for-of-js",
    "acumulador-js",
    "if-js",
    "return-js"
  ],
  "prerequisitos": [
    "lista-objetos-js",
    "for-of-js",
    "acumulador-js",
    "if-js",
    "return-js"
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
      "nome": "Total e maior preço",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    },
    "preparo": "const cardapio = [{\"nome\": \"Broa\", \"preco\": 5, \"semGluten\": false}, {\"nome\": \"Tapioca\", \"preco\": 8, \"semGluten\": true}, {\"nome\": \"Bolo\", \"preco\": 12, \"semGluten\": false}]"
  },
  "introducao": [
    {
      "texto": "const { nome, preco } = item lê dois campos e cria variáveis. No laço, elas aparecem dentro do bloco, sem apagar a ficha.",
      "expressao": "apontando"
    },
    {
      "texto": "Para somar, comece total em zero. Para achar o mais caro, compare preco com o maior até agora em cada volta.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Percorra cardapio, desestruture nome e preco. Some total, guarde maiorPreco e maisCaro, e mostre os nomes.",
        "toque": "Percorra cardapio, desestruture nome e preco. Some total, guarde maiorPreco e maisCaro, e mostre os nomes."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 25
          },
          {
            "tipo": "valorVariavel",
            "nome": "maiorPreco",
            "valor": 12
          },
          {
            "tipo": "valorVariavel",
            "nome": "maisCaro",
            "valor": "Bolo"
          },
          {
            "tipo": "saida",
            "igual": [
              "Broa",
              "Tapioca",
              "Bolo"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "desestruturacao"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
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
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Dentro do for...of use const { nome, preco } = item. Compare preco com maiorPreco.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Dentro do for...of use const { nome, preco } = item. Compare preco com maiorPreco."
        },
        "solucao": {
          "fala": "Total 25; Bolo é o mais caro. O bloco tem nome e preco em cada volta.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let total = 0\nlet maiorPreco = 0\nlet maisCaro = \"\"\nfor (let item of cardapio) {\n const { nome, preco } = item\n total += preco\n if (preco > maiorPreco) { maiorPreco = preco; maisCaro = nome }\n console.log(nome)\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Total 25; Bolo é o mais caro. O bloco tem nome e preco em cada volta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let total = 0\nlet maiorPreco = 0\nlet maisCaro = \"\"\nfor (let item of cardapio) {\n const { nome, preco } = item\n total += preco\n if (preco > maiorPreco) { maiorPreco = preco; maisCaro = nome }\n console.log(nome)\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f2-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde original = cardapio[0].nome depois do laço.",
        "toque": "Guarde original = cardapio[0].nome depois do laço."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "original",
            "valor": "Broa"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Ler campos em variáveis não apaga a ficha.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Ler campos em variáveis não apaga a ficha."
        },
        "solucao": {
          "fala": "A ficha original continua guardando nome e preco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let original = cardapio[0].nome"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A ficha original continua guardando nome e preco.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let original = cardapio[0].nome"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Depois de const {nome, preco} = item, a ficha item perde os campos?",
        "opcoes": [
          "Não, continua igual",
          "Sim, fica vazia",
          "Vira uma lista"
        ],
        "correta": 0,
        "explicacao": "A desestruturação lê campos e cria variáveis."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie somaPedidos(lista) com for...of e const {total} = pedido; devolva a soma. Guarde soma para totais 0, 6 e 9.",
        "toque": "Crie somaPedidos(lista) com for...of e const {total} = pedido; devolva a soma. Guarde soma para totais 0, 6 e 9."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "somaPedidos",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    {
                      "total": 0
                    },
                    {
                      "total": 6
                    },
                    {
                      "total": 9
                    }
                  ]
                ],
                "esperado": 15
              },
              {
                "args": [
                  [
                    {
                      "total": 2.5
                    },
                    {
                      "total": 1.5
                    }
                  ]
                ],
                "esperado": 4
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 15
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "desestruturacao"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O acumulador começa em zero dentro da função e return entrega a soma."
      },
      "falaAoConcluir": {
        "texto": "A lista vazia soma zero; cada pedido contribui com seu campo total.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function somaPedidos(lista) {\n let soma = 0\n for (let pedido of lista) {\n  const { total } = pedido\n  soma += total\n }\n return soma\n}\nlet soma = somaPedidos([{total: 0}, {total: 6}, {total: 9}])"
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

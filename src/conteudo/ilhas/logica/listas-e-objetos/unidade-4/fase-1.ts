/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U4_F1: FasePratica = {
  "id": "logica-listas-e-objetos-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u4",
  "titulo": "O cardápio vira dados",
  "conceitos": [
    "lista-objetos-js"
  ],
  "revisa": [
    "objeto-js",
    "acesso-objeto-js",
    "referencia-lista-js",
    "map-lista-js"
  ],
  "prerequisitos": [
    "objeto-js",
    "acesso-objeto-js",
    "referencia-lista-js",
    "map-lista-js"
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
      "nome": "O cardápio vira dados",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    },
    "preparo": "const cardapio = [{\"nome\": \"Broa\", \"preco\": 5, \"semGluten\": false}, {\"nome\": \"Tapioca\", \"preco\": 8, \"semGluten\": true}, {\"nome\": \"Bolo\", \"preco\": 12, \"semGluten\": false}]"
  },
  "introducao": [
    {
      "texto": "O cardápio da Padaria Pão de Mel, da Ilha Sites, agora é uma lista de fichas. Cada vagão guarda nome, preco e semGluten.",
      "expressao": "apontando"
    },
    {
      "texto": "cardapio[1] escolhe a Tapioca; cardapio[1].preco lê só o preço dela. let item = cardapio[1] compartilha essa ficha.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Leia primeiroNome. Crie item = cardapio[1], mude item.preco para 9 e guarde outroPreco = cardapio[0].preco.",
        "toque": "Leia primeiroNome. Crie item = cardapio[1], mude item.preco para 9 e guarde outroPreco = cardapio[0].preco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "primeiroNome",
            "valor": "Broa"
          },
          {
            "tipo": "valorVariavel",
            "nome": "cardapio",
            "valor": [
              {
                "nome": "Broa",
                "preco": 5,
                "semGluten": false
              },
              {
                "nome": "Tapioca",
                "preco": 9,
                "semGluten": true
              },
              {
                "nome": "Bolo",
                "preco": 12,
                "semGluten": false
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "outroPreco",
            "valor": 5
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "item aponta só à ficha da Tapioca; a Broa é outra ficha.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "item aponta só à ficha da Tapioca; a Broa é outra ficha."
        },
        "solucao": {
          "fala": "Só a Tapioca passou a 9. A seta de item chega à ficha no vagão 1.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let primeiroNome = cardapio[0].nome\nlet item = cardapio[1]\nitem.preco = 9\nlet outroPreco = cardapio[0].preco"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Só a Tapioca passou a 9. A seta de item chega à ficha no vagão 1.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let primeiroNome = cardapio[0].nome\nlet item = cardapio[1]\nitem.preco = 9\nlet outroPreco = cardapio[0].preco"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f1-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Mude item.preco para 10 e guarde precoBolo = cardapio[2].preco.",
        "toque": "Mude item.preco para 10 e guarde precoBolo = cardapio[2].preco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "precoBolo",
            "valor": 12
          },
          {
            "tipo": "valorVariavel",
            "nome": "cardapio",
            "valor": [
              {
                "nome": "Broa",
                "preco": 5,
                "semGluten": false
              },
              {
                "nome": "Tapioca",
                "preco": 10,
                "semGluten": true
              },
              {
                "nome": "Bolo",
                "preco": 12,
                "semGluten": false
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Cada produto é uma ficha diferente.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Cada produto é uma ficha diferente."
        },
        "solucao": {
          "fala": "Bolo continua 12: item não representa o cardápio inteiro.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "item.preco = 10\nlet precoBolo = cardapio[2].preco"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Bolo continua 12: item não representa o cardápio inteiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "item.preco = 10\nlet precoBolo = cardapio[2].preco"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "item aponta à Tapioca. item.preco = 10 muda também o Bolo?",
        "opcoes": [
          "Sim, vira 10",
          "Sim, vira undefined",
          "Não, fica 12"
        ],
        "correta": 2,
        "explicacao": "Só a ficha apontada foi alterada."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie pedidos com Ana (total 8) e Rui (total 15). Mude só Rui para 17 e guarde totais usando map.",
        "toque": "Crie pedidos com Ana (total 8) e Rui (total 15). Mude só Rui para 17 e guarde totais usando map."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "pedidos",
            "valor": [
              {
                "cliente": "Ana",
                "total": 8
              },
              {
                "cliente": "Rui",
                "total": 17
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "totais",
            "valor": [
              8,
              17
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:map"
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
        "dica": "Escolha o vagão antes do campo."
      },
      "falaAoConcluir": {
        "texto": "O pedido de Ana ficou 8; a lista de totais lê cada ficha.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const pedidos = [{ cliente: \"Ana\", total: 8 }, { cliente: \"Rui\", total: 15 }]\npedidos[1].total = 17\nconst totais = pedidos.map(pedido => pedido.total)"
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

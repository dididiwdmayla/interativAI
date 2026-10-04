/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U4_F4: FaseDesafio = {
  "id": "logica-listas-e-objetos-u4-f4",
  "tipo": "desafio",
  "unidadeId": "logica-listas-e-objetos-u4",
  "titulo": "O pedido da pizzaria",
  "conceitos": [
    "lista-objetos-js",
    "somar-campo-js",
    "filtrar-campo-js",
    "desestruturacao-objeto-js"
  ],
  "revisa": [
    "arrow-js",
    "filter-lista-js",
    "map-lista-js",
    "if-js"
  ],
  "prerequisitos": [
    "lista-objetos-js",
    "somar-campo-js",
    "filtrar-campo-js",
    "desestruturacao-objeto-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "const pedido = [{ nome: \"Marguerita\", preco: 30, quantidade: 2, vegetariana: true }, { nome: \"Calabresa\", preco: 35, quantidade: 1, vegetariana: false }]",
    "snippet": {
      "nome": "O pedido da pizzaria",
      "codigoInicial": "const pedido = [{ nome: \"Marguerita\", preco: 30, quantidade: 2, vegetariana: true }, { nome: \"Calabresa\", preco: 35, quantidade: 1, vegetariana: false }]"
    }
  },
  "introducao": [
    {
      "texto": "Agora use os dados em outro contexto. Resolva as partes e confira o antes e depois no palco.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "total",
      "descricao": "Crie totalPedido(lista), somando preco * quantidade com for...of e desestruturação. Guarde total = totalPedido(pedido).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "totalPedido",
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
                      "preco": 30,
                      "quantidade": 2
                    },
                    {
                      "preco": 35,
                      "quantidade": 1
                    }
                  ]
                ],
                "esperado": 95
              },
              {
                "args": [
                  [
                    {
                      "preco": 10,
                      "quantidade": 0
                    }
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    {
                      "preco": 2.5,
                      "quantidade": 3
                    }
                  ]
                ],
                "esperado": 7.5
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 95
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
      "revisarEm": "logica-listas-e-objetos-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function totalPedido(lista) {\n let soma = 0\n for (let item of lista) {\n  const { preco, quantidade } = item\n  soma += preco * quantidade\n }\n return soma\n}\nlet total = totalPedido(pedido)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "filtrar",
      "descricao": "Filtre vegetarianas pelo campo vegetariana; extraia nomes com map. Preserve as fichas do pedido.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "vegetarianas",
            "valor": [
              {
                "nome": "Marguerita",
                "preco": 30,
                "quantidade": 2,
                "vegetariana": true
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "nomes",
            "valor": [
              "Marguerita"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": [
              {
                "nome": "Marguerita",
                "preco": 30,
                "quantidade": 2,
                "vegetariana": true
              },
              {
                "nome": "Calabresa",
                "preco": 35,
                "quantidade": 1,
                "vegetariana": false
              }
            ]
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
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u4-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const vegetarianas = pedido.filter(item => item.vegetariana)\nconst nomes = vegetarianas.map(item => item.nome)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você usou os dados para responder perguntas reais. Confira o resultado e a lista original.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie compras = [{nome: \"pão\", preco: 4}, {nome: \"bolo\", preco: 12}]; filtre item.preco > 10 e confira length: 1.",
  "falaFinal": {
    "texto": "Leve uma lista pequena para o Console real e confira suas previsões.",
    "expressao": "feliz"
  }
};

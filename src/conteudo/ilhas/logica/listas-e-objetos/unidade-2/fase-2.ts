/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U2_F2: FasePratica = {
  "id": "logica-listas-e-objetos-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u2",
  "titulo": "Preços novos, original intacta",
  "conceitos": [
    "map-lista-js"
  ],
  "revisa": [
    "arrow-js",
    "return-js",
    "array-js",
    "for-of-js"
  ],
  "prerequisitos": [
    "arrow-js",
    "return-js",
    "array-js",
    "for-of-js"
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
      "nome": "Preços novos, original intacta",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "map passa cada vagão para uma função e guarda o retorno em uma lista nova. A arrow preco => preco + 2 recebe um preço por chamada.",
      "expressao": "apontando"
    },
    {
      "texto": "Volte pela linha do tempo: na moldura, preco muda em cada chamada. A lista original mantém os preços e a nova recebe os resultados.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie precos = [3, 8, 5]; use map e arrow para criar aumentados com +2. Mostre os primeiros preços.",
        "toque": "Crie precos = [3, 8, 5]; use map e arrow para criar aumentados com +2. Mostre os primeiros preços."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "precos",
            "valor": [
              3,
              8,
              5
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "aumentados",
            "valor": [
              5,
              10,
              7
            ]
          },
          {
            "tipo": "saida",
            "igual": [
              "3 5"
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
        "dica": "A arrow devolve preco + 2. map guarda os retornos em aumentados.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A arrow devolve preco + 2. map guarda os retornos em aumentados."
        },
        "solucao": {
          "fala": "Original: 3, 8, 5. Nova: 5, 10, 7. Veja preco passando pelas três chamadas.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const precos = [3, 8, 5]\nconst aumentados = precos.map(preco => preco + 2)\nconsole.log(precos[0], aumentados[0])"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Original: 3, 8, 5. Nova: 5, 10, 7. Veja preco passando pelas três chamadas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const precos = [3, 8, 5]\nconst aumentados = precos.map(preco => preco + 2)\nconsole.log(precos[0], aumentados[0])"
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
        "mouse": "Troque aumentados[0] por 99 e guarde preservado = precos[0].",
        "toque": "Troque aumentados[0] por 99 e guarde preservado = precos[0]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "precos",
            "valor": [
              3,
              8,
              5
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "aumentados",
            "valor": [
              99,
              10,
              7
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "preservado",
            "valor": 3
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Aqui os itens são números: map criou outra fileira.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Aqui os itens são números: map criou outra fileira."
        },
        "solucao": {
          "fala": "Alterar a nova lista de números deixou a original intacta.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "aumentados[0] = 99\nlet preservado = precos[0]"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Alterar a nova lista de números deixou a original intacta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "aumentados[0] = 99\nlet preservado = precos[0]"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "aumentados veio de map. Mudar aumentados[0] para 99 deixa precos[0] como?",
        "opcoes": [
          "99",
          "undefined",
          "3"
        ],
        "correta": 2,
        "explicacao": "São listas diferentes, com números independentes."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie descontos(lista) com map e arrow, devolvendo cada preço menos 1. Guarde ofertas = descontos([2, 6, 10]).",
        "toque": "Crie descontos(lista) com map e arrow, devolvendo cada preço menos 1. Guarde ofertas = descontos([2, 6, 10])."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "descontos",
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
                    2,
                    6,
                    10
                  ]
                ],
                "esperado": [
                  1,
                  5,
                  9
                ]
              },
              {
                "args": [
                  [
                    1.5,
                    0
                  ]
                ],
                "esperado": [
                  0.5,
                  -1
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "ofertas",
            "valor": [
              1,
              5,
              9
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
        "dica": "A função externa devolve a lista nova que map produz."
      },
      "falaAoConcluir": {
        "texto": "A função transforma cada item, inclusive zero e decimais.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const descontos = (lista) => lista.map(preco => preco - 1)\nlet ofertas = descontos([2, 6, 10])"
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
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [2, 8, 15]; use compras.push(20). Filtre preços > 10 e confira length: 2.",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

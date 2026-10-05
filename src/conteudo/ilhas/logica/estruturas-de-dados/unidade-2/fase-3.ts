/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U2_F3: Fase = {
  "id": "logica-estruturas-de-dados-u2-f3",
  "tipo": "desafio",
  "unidadeId": "logica-estruturas-de-dados-u2",
  "titulo": "A central de entregas",
  "conceitos": [],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "fila-js",
    "fila-por-indice"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "fila-js",
    "fila-por-indice"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "contador-passos",
    "grafico-passos"
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
    },
    "desempenho": {
      "funcoes": [
        {
          "nome": "atender"
        }
      ],
      "tamanhos": [
        10,
        100,
        1000
      ],
      "lista": "crescente"
    }
  },
  "introducao": [
    {
      "texto": "Crie atender(lista): devolva \"Entregar \" + pedido na ordem de chegada, preservando repetidos. Evite deslizar os vagões.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "codigo",
      "descricao": "Crie atender(lista): devolva \"Entregar \" + pedido na ordem de chegada, preservando repetidos. Evite deslizar os vagões.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "atender",
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
                    "x"
                  ]
                ],
                "esperado": [
                  "Entregar x"
                ]
              },
              {
                "args": [
                  [
                    "mesa 3",
                    "mesa 1",
                    "mesa 3"
                  ]
                ],
                "esperado": [
                  "Entregar mesa 3",
                  "Entregar mesa 1",
                  "Entregar mesa 3"
                ]
              },
              {
                "args": [
                  [
                    8,
                    1,
                    5
                  ]
                ],
                "esperado": [
                  "Entregar 8",
                  "Entregar 1",
                  "Entregar 5"
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "entregas",
            "valor": [
              "Entregar mesa 3",
              "Entregar mesa 1",
              "Entregar mesa 3"
            ]
          },
          {
            "tipo": "passosNoMaximo",
            "funcao": "atender",
            "tamanho": 1000,
            "valor": 20000
          }
        ]
      },
      "revisarEm": "logica-estruturas-de-dados-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function atender(lista) {\n  const resposta = [];\n  let inicio = 0;\n  while (inicio < lista.length) {\n    const pedido = lista[inicio];\n    resposta.push(\"Entregar \" + pedido);\n    inicio++;\n  }\n  return resposta;\n}\nconst entregas = atender([\"mesa 3\", \"mesa 1\", \"mesa 3\"]);"
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

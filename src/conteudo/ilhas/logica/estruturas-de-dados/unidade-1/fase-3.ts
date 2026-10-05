/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U1_F3: Fase = {
  "id": "logica-estruturas-de-dados-u1-f3",
  "tipo": "desafio",
  "unidadeId": "logica-estruturas-de-dados-u1",
  "titulo": "A volta do passeio",
  "conceitos": [],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js",
    "pilha-vazia"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js",
    "pilha-vazia"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
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
      "texto": "Crie inverter(lista): devolva os pontos na ordem de volta, sem perder repetidos; vazio vira [].",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "codigo",
      "descricao": "Crie inverter(lista): devolva os pontos na ordem de volta, sem perder repetidos; vazio vira [].",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "inverter",
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
                    "ponte"
                  ]
                ],
                "esperado": [
                  "ponte"
                ]
              },
              {
                "args": [
                  [
                    "a",
                    "b",
                    "a"
                  ]
                ],
                "esperado": [
                  "a",
                  "b",
                  "a"
                ]
              },
              {
                "args": [
                  [
                    "praça",
                    "ponte",
                    "museu"
                  ]
                ],
                "esperado": [
                  "museu",
                  "ponte",
                  "praça"
                ]
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "rota",
            "valor": [
              "museu",
              "ponte",
              "praça"
            ]
          }
        ]
      },
      "revisarEm": "logica-estruturas-de-dados-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function inverter(lista) {\n  const pilha = [];\n  for (const item of lista) pilha.push(item);\n  const resposta = [];\n  while (pilha.length > 0) resposta.push(pilha.pop());\n  return resposta;\n}\nconst rota = inverter([\"praça\", \"ponte\", \"museu\"]);"
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

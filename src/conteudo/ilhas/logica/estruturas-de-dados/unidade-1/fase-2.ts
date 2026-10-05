/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U1_F2: Fase = {
  "id": "logica-estruturas-de-dados-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u1",
  "titulo": "Desfazer sem histórico",
  "conceitos": [
    "pilha-vazia"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js"
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
  "programa": {
    "snippet": {
      "nome": "estrutura.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "pop em [] devolve undefined. Nosso editor combina outra resposta: desfazer(lista) devolve null se estiver vazia.",
      "expressao": "apontando"
    },
    {
      "texto": "O if vem antes do pop. Um item ainda pode sair normalmente; a função devolve o que retirou.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "vazio-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie desfazer(lista): null no vazio, último item nas outras listas. Chame com [\"pintar\"].",
        "toque": "Crie desfazer(lista): null no vazio, último item nas outras listas. Chame com [\"pintar\"]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "desfazer",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": null
              },
              {
                "args": [
                  [
                    "pintar"
                  ]
                ],
                "esperado": "pintar"
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "r",
            "valor": "pintar"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Teste length===0 e devolva null; caso contrário devolva lista.pop().",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Teste length===0 e devolva null; caso contrário devolva lista.pop()."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function desfazer(lista) {\n  if (lista.length === 0) return null;\n  return lista.pop();\n}\nconst r = desfazer([\"pintar\"]);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Vazio é uma borda, não um erro do editor.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function desfazer(lista) {\n  if (lista.length === 0) return null;\n  return lista.pop();\n}\nconst r = desfazer([\"pintar\"]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "vazio-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Teste desfazer com [\"mover\", \"apagar\"]. Guarde o retorno em r e confira também vazio e um item.",
        "toque": "Teste desfazer com [\"mover\", \"apagar\"]. Guarde o retorno em r e confira também vazio e um item."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "desfazer",
            "casos": [
              {
                "args": [
                  []
                ],
                "esperado": null
              },
              {
                "args": [
                  [
                    "x"
                  ]
                ],
                "esperado": "x"
              },
              {
                "args": [
                  [
                    "mover",
                    "apagar"
                  ]
                ],
                "esperado": "apagar"
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "r",
            "valor": "apagar"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Retire pelo fim e devolva o valor retirado."
      },
      "falaAoConcluir": {
        "texto": "O contrato da função cobre vazio, um e vários itens.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function desfazer(lista) {\n  if (lista.length === 0) return null;\n  return lista.pop();\n}\nconst r = desfazer([\"mover\", \"apagar\"]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "desfazer([]) com o if do editor deve devolver o quê?",
        "opcoes": [
          "null",
          "undefined",
          "Uma lista com null"
        ],
        "correta": 0,
        "explicacao": "null é a resposta combinada pelo editor."
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
  "missaoDeCampo": "No Console de qualquer site: let p=[]; p.push(\"A\",\"B\"); p.pop(); let f=[]; f.push(\"A\",\"B\"); f.shift(); Compare quem saiu e o que ficou."
};

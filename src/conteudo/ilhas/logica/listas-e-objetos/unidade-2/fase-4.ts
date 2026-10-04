/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U2_F4: FasePratica = {
  "id": "logica-listas-e-objetos-u2-f4",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u2",
  "titulo": "Um item ou uma lista?",
  "conceitos": [
    "find-lista-js"
  ],
  "revisa": [
    "filter-lista-js",
    "arrow-js",
    "undefined-js"
  ],
  "prerequisitos": [
    "filter-lista-js",
    "arrow-js",
    "undefined-js"
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
      "nome": "Um item ou uma lista?",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "find devolve só o primeiro item que passa. filter devolve todos numa lista. Se nenhum passa: find dá undefined e filter dá [].",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f4-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Use estoque = [4, 0, 0, 2]. Guarde primeiroZero com find e zeros com filter, usando n => n === 0.",
        "toque": "Use estoque = [4, 0, 0, 2]. Guarde primeiroZero com find e zeros com filter, usando n => n === 0."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "primeiroZero",
            "valor": 0
          },
          {
            "tipo": "valorVariavel",
            "nome": "zeros",
            "valor": [
              0,
              0
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:find"
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
        "dica": "Observe o tipo das caixinhas: um número contra uma lista.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Observe o tipo das caixinhas: um número contra uma lista."
        },
        "solucao": {
          "fala": "find devolveu 0, que é um item válido; filter devolveu [0, 0].",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const estoque = [4, 0, 0, 2]\nlet primeiroZero = estoque.find(n => n === 0)\nconst zeros = estoque.filter(n => n === 0)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "find devolveu 0, que é um item válido; filter devolveu [0, 0].",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const estoque = [4, 0, 0, 2]\nlet primeiroZero = estoque.find(n => n === 0)\nconst zeros = estoque.filter(n => n === 0)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f4-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde ausente = estoque.find(n => n < 0) e tipoAusente = typeof ausente.",
        "toque": "Guarde ausente = estoque.find(n => n < 0) e tipoAusente = typeof ausente."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "tipoAusente",
            "valor": "undefined"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:find"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Não há número negativo no estoque.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Não há número negativo no estoque."
        },
        "solucao": {
          "fala": "A busca terminou sem item: undefined, sem erro.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let ausente = estoque.find(n => n < 0)\nlet tipoAusente = typeof ausente"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A busca terminou sem item: undefined, sem erro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let ausente = estoque.find(n => n < 0)\nlet tipoAusente = typeof ausente"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "estoque não tem negativos. find(n => n < 0) devolve o quê?",
        "opcoes": [
          "[]",
          "undefined",
          "0"
        ],
        "correta": 1,
        "explicacao": "find devolve um item ou undefined, nunca uma lista de resultados."
      }
    },
    {
      "id": "f4-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie primeiroAlto(lista) com find e arrow para devolver o primeiro valor > 10; guarde achado para [8, 12, 15].",
        "toque": "Crie primeiroAlto(lista) com find e arrow para devolver o primeiro valor > 10; guarde achado para [8, 12, 15]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "primeiroAlto",
            "casos": [
              {
                "args": [
                  [
                    8,
                    12,
                    15
                  ]
                ],
                "esperado": 12
              },
              {
                "args": [
                  [
                    10,
                    11
                  ]
                ],
                "esperado": 11
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "achado",
            "valor": 12
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
        "dica": "find encerra no primeiro que passa, não no maior."
      },
      "falaAoConcluir": {
        "texto": "12 é o primeiro aprovado; 15 não é o resultado.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const primeiroAlto = (lista) => lista.find(n => n > 10)\nlet achado = primeiroAlto([8, 12, 15])"
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

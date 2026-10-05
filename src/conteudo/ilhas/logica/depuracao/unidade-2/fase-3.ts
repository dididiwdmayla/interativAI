/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U2_F3: Fase = {
  "id": "logica-depuracao-u2-f3",
  "tipo": "desafio",
  "unidadeId": "logica-depuracao-u2",
  "titulo": "A carga do depósito",
  "conceitos": [],
  "revisa": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "pontos-de-parada",
    "controles-depurador",
    "painel-escopo",
    "painel-observar",
    "casos-de-teste"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "investigacao.js",
      "codigoInicial": "function contarCaixas(caixas) {\n  let total = 0;\n  for (let i = 1; i < caixas.length; i++) {\n    total += caixas[i];\n  }\n  return total;\n}\nconst carga = contarCaixas([3, 5]);"
    }
  },
  "areas": [
    "snippet",
    "palco",
    "testes"
  ],
  "introducao": [
    {
      "texto": "contarCaixas(caixas) deve devolver a soma de todas as caixas, incluindo a primeira; vazio dá 0. A carga [3, 5] saiu errada.",
      "expressao": "curioso"
    },
    {
      "texto": "Escolha uma hipótese e um ponto, registre o valor que encontrou e conserte. Use os testes para confirmar.",
      "expressao": "curioso"
    }
  ],
  "conclusao": [
    {
      "texto": "Você reproduziu, comparou pistas com uma hipótese e testou o conserto. Investigar com método evita criar bugs novos.",
      "expressao": "curioso"
    }
  ],
  "falaFinal": {
    "texto": "Um resultado sem erro também pode estar errado. Confira exemplos e bordas antes de encerrar.",
    "expressao": "curioso"
  },
  "partes": [
    {
      "id": "investigar",
      "descricao": "Investigue no depurador e registre uma evidência do defeito.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "pontoDeParada",
            "linha": 4
          },
          {
            "tipo": "pausouNaLinha",
            "linha": 4
          },
          {
            "tipo": "observou",
            "expressao": "i",
            "valor": 1
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "observar",
          "expressao": "i"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        }
      ],
      "revisarEm": "logica-depuracao-u2-f2"
    },
    {
      "id": "codigo",
      "descricao": "Entregue a soma correta de todas as caixas, inclusive vazio e uma caixa.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "contarCaixas",
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
                    9
                  ]
                ],
                "esperado": 9
              },
              {
                "args": [
                  [
                    2,
                    2,
                    4
                  ]
                ],
                "esperado": 8
              },
              {
                "args": [
                  [
                    0,
                    7
                  ]
                ],
                "esperado": 7
              }
            ]
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 4
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function contarCaixas(caixas) {\n  let total = 0;\n  for (let i = 0; i < caixas.length; i++) {\n    total += caixas[i];\n  }\n  return total;\n}\nconst carga = contarCaixas([3, 5]);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "revisarEm": "logica-depuracao-u2-f2"
    },
    {
      "id": "testes",
      "descricao": "Rode os casos e confirme também uma caixa só.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 3,
        "passando": true,
        "incluir": [
          {
            "args": [
              [
                9
              ]
            ],
            "esperado": 9
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[9]",
          "esperado": "9"
        },
        {
          "tipo": "rodarCasos"
        }
      ],
      "revisarEm": "logica-depuracao-u2-f2"
    }
  ],
  "missaoDeCampo": "No Chrome, abra DevTools > Sources > Snippets, crie um Snippet curto e execute. Marque um ponto no número da linha; use F10, F11 e Shift+F11 e confira Scope e Watch.",
  "testes": {
    "funcao": "contarCaixas",
    "parametros": [
      "caixas"
    ],
    "inicial": [
      {
        "entrada": "[]",
        "esperado": "0"
      },
      {
        "entrada": "[3, 5]",
        "esperado": "8"
      }
    ]
  }
};

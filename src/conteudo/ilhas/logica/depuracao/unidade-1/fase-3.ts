/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U1_F3: Fase = {
  "id": "logica-depuracao-u1-f3",
  "tipo": "desafio",
  "unidadeId": "logica-depuracao-u1",
  "titulo": "As etiquetas da viagem",
  "conceitos": [],
  "revisa": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
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
      "codigoInicial": "function etiquetas(itens {\n  const nomes = [];\n  for (let i = 0; i <= itens.length; i++) {\n    nomes.push(item[i].nome);\n  }\n  return nomes;\n}\nconsole.log(etiquetas([{nome: \"mala\"}]));"
    }
  },
  "areas": [
    "snippet",
    "palco",
    "testes"
  ],
  "introducao": [
    {
      "texto": "A equipe precisa de etiquetas(itens): devolva os nomes na mesma ordem, inclusive repetidos. Lista vazia vira []. Há três defeitos.",
      "expressao": "curioso"
    },
    {
      "texto": "Execute e trate os erros na ordem em que aparecem. Depois confira os casos comuns e as bordas.",
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
      "id": "escrita",
      "descricao": "Reproduza e resolva o erro de escrita; execute até aparecer o próximo erro.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "erroDoTipo",
            "nome": "SyntaxError"
          },
          {
            "tipo": "erroDoTipo",
            "nome": "ReferenceError"
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function etiquetas(itens) {\n  const nomes = [];\n  for (let i = 0; i <= itens.length; i++) {\n    nomes.push(item[i].nome);\n  }\n  return nomes;\n}\nconsole.log(etiquetas([{nome: \"mala\"}]));"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "revisarEm": "logica-depuracao-u1-f2"
    },
    {
      "id": "nome",
      "descricao": "Resolva o nome indisponível e reproduza o erro seguinte.",
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "TypeError"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function etiquetas(itens) {\n  const nomes = [];\n  for (let i = 0; i <= itens.length; i++) {\n    nomes.push(itens[i].nome);\n  }\n  return nomes;\n}\nconsole.log(etiquetas([{nome: \"mala\"}]));"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "revisarEm": "logica-depuracao-u1-f2"
    },
    {
      "id": "codigo",
      "descricao": "Entregue etiquetas com vazio, um item e nomes repetidos, sem erro.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "etiquetas",
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
                      "nome": "x"
                    }
                  ]
                ],
                "esperado": [
                  "x"
                ]
              },
              {
                "args": [
                  [
                    {
                      "nome": "a"
                    },
                    {
                      "nome": "b"
                    },
                    {
                      "nome": "a"
                    }
                  ]
                ],
                "esperado": [
                  "a",
                  "b",
                  "a"
                ]
              }
            ]
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function etiquetas(itens) {\n  const nomes = [];\n  for (let i = 0; i < itens.length; i++) {\n    nomes.push(itens[i].nome);\n  }\n  return nomes;\n}\nconsole.log(etiquetas([{nome: \"mala\"}]));"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "revisarEm": "logica-depuracao-u1-f2"
    },
    {
      "id": "testes",
      "descricao": "Rode os casos visíveis e confirme o conserto.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 2,
        "passando": true
      },
      "solucaoDeTeste": [
        {
          "tipo": "rodarCasos"
        }
      ],
      "revisarEm": "logica-depuracao-u1-f2"
    }
  ],
  "missaoDeCampo": "No Chrome, abra DevTools > Sources > Snippets, crie um Snippet curto e execute. Marque um ponto no número da linha; use F10, F11 e Shift+F11 e confira Scope e Watch.",
  "testes": {
    "funcao": "etiquetas",
    "parametros": [
      "itens"
    ],
    "inicial": [
      {
        "entrada": "[]",
        "esperado": "[]"
      },
      {
        "entrada": "[{nome: \"mala\"}]",
        "esperado": "[\"mala\"]"
      }
    ]
  }
};

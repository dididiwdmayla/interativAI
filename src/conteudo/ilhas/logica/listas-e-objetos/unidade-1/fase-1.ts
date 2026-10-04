/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U1_F1: FasePratica = {
  "id": "logica-listas-e-objetos-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u1",
  "titulo": "A fila tem posição",
  "conceitos": [
    "array-js",
    "indice-lista-js",
    "length-lista-js"
  ],
  "revisa": [
    "variavel-const",
    "length-texto"
  ],
  "prerequisitos": [
    "variavel-const",
    "length-texto"
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
      "nome": "A fila tem posição",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "A Padaria Pão de Mel guarda a fila em uma lista: [\"Ana\", \"Bia\", \"Caio\"]. No palco cada nome vira um vagão numerado.",
      "expressao": "apontando"
    },
    {
      "texto": "O primeiro índice é 0. length conta itens: com três itens, o último índice é 2, ou length - 1.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie fila com Ana, Bia e Caio. Guarde primeiro, ultimo e tamanho usando índices e length.",
        "toque": "Crie fila com Ana, Bia e Caio. Guarde primeiro, ultimo e tamanho usando índices e length."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "fila",
            "valor": [
              "Ana",
              "Bia",
              "Caio"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeiro",
            "valor": "Ana"
          },
          {
            "tipo": "valorVariavel",
            "nome": "ultimo",
            "valor": "Caio"
          },
          {
            "tipo": "valorVariavel",
            "nome": "tamanho",
            "valor": 3
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "array"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Use fila[0] e fila[fila.length - 1]. Observe os números sob os vagões.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use fila[0] e fila[fila.length - 1]. Observe os números sob os vagões."
        },
        "solucao": {
          "fala": "Primeiro: Ana; último: Caio. length é 3, mas o último índice é 2.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const fila = [\"Ana\", \"Bia\", \"Caio\"]\nlet primeiro = fila[0]\nlet ultimo = fila[fila.length - 1]\nlet tamanho = fila.length"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Primeiro: Ana; último: Caio. length é 3, mas o último índice é 2.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const fila = [\"Ana\", \"Bia\", \"Caio\"]\nlet primeiro = fila[0]\nlet ultimo = fila[fila.length - 1]\nlet tamanho = fila.length"
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
        "mouse": "Guarde fora = fila[3] e tipoFora = typeof fora. Execute e confira que não houve erro.",
        "toque": "Guarde fora = fila[3] e tipoFora = typeof fora. Execute e confira que não houve erro."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "tipoFora",
            "valor": "undefined"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O tamanho não é um índice existente. typeof permite conferir undefined.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O tamanho não é um índice existente. typeof permite conferir undefined."
        },
        "solucao": {
          "fala": "fora é undefined, não um erro. Nenhum quarto vagão existe.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let fora = fila[3]\nlet tipoFora = typeof fora"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "fora é undefined, não um erro. Nenhum quarto vagão existe.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let fora = fila[3]\nlet tipoFora = typeof fora"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "fila tem Ana, Bia e Caio. O que fila[3] devolve?",
        "opcoes": [
          "Caio",
          "undefined",
          "ReferenceError"
        ],
        "correta": 1,
        "explicacao": "Existem as posições 0, 1 e 2."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie entregas com Lia e Rui. Guarde inicio, fim e quantidade usando índices e length.",
        "toque": "Crie entregas com Lia e Rui. Guarde inicio, fim e quantidade usando índices e length."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "entregas",
            "valor": [
              "Lia",
              "Rui"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "inicio",
            "valor": "Lia"
          },
          {
            "tipo": "valorVariavel",
            "nome": "fim",
            "valor": "Rui"
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidade",
            "valor": 2
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O último índice depende da quantidade de itens."
      },
      "falaAoConcluir": {
        "texto": "Dois itens ocupam as posições 0 e 1.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const entregas = [\"Lia\", \"Rui\"]\nlet inicio = entregas[0]\nlet fim = entregas[entregas.length - 1]\nlet quantidade = entregas.length"
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
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [\"pão\", \"leite\"]; use compras.push(\"fruta\") e confira length: 3. Leia compras[2].",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

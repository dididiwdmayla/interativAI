/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U1_F3: FasePratica = {
  "id": "logica-listas-e-objetos-u1-f3",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u1",
  "titulo": "Uma lista, duas variáveis",
  "conceitos": [
    "referencia-lista-js"
  ],
  "revisa": [
    "array-js",
    "const-lista-js",
    "for-of-js"
  ],
  "prerequisitos": [
    "array-js",
    "const-lista-js",
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
      "nome": "Uma lista, duas variáveis",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "let copia = fila não copia os vagões. No palco, copia ganha uma seta até a lista de fila. As duas apontam ao mesmo dado.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f3-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie fila com Ana e Bia; let copia = fila. Mude copia[0] para Duda e percorra fila com for...of.",
        "toque": "Crie fila com Ana e Bia; let copia = fila. Mude copia[0] para Duda e percorra fila com for...of."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "fila",
            "valor": [
              "Duda",
              "Bia"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "copia",
            "valor": [
              "Duda",
              "Bia"
            ]
          },
          {
            "tipo": "saida",
            "igual": [
              "Duda",
              "Bia"
            ]
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
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "A mudança via copia aparece em fila. Percorra fila para conferir.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A mudança via copia aparece em fila. Percorra fila para conferir."
        },
        "solucao": {
          "fala": "As duas mostram Duda e Bia: veja a seta, não uma segunda fileira.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const fila = [\"Ana\", \"Bia\"]\nlet copia = fila\ncopia[0] = \"Duda\"\nfor (let pessoa of fila) { console.log(pessoa) }"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "As duas mostram Duda e Bia: veja a seta, não uma segunda fileira.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const fila = [\"Ana\", \"Bia\"]\nlet copia = fila\ncopia[0] = \"Duda\"\nfor (let pessoa of fila) { console.log(pessoa) }"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f3-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Faça copia.push(\"Eli\"); guarde quantidadeFila = fila.length.",
        "toque": "Faça copia.push(\"Eli\"); guarde quantidadeFila = fila.length."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "fila",
            "valor": [
              "Duda",
              "Bia",
              "Eli"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "copia",
            "valor": [
              "Duda",
              "Bia",
              "Eli"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidadeFila",
            "valor": 3
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "As duas setas levam aos mesmos vagões.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "As duas setas levam aos mesmos vagões."
        },
        "solucao": {
          "fala": "A mudança aparece pelas duas variáveis. Nenhuma cópia independente foi criada.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "copia.push(\"Eli\")\nlet quantidadeFila = fila.length"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A mudança aparece pelas duas variáveis. Nenhuma cópia independente foi criada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "copia.push(\"Eli\")\nlet quantidadeFila = fila.length"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "copia aponta para fila. copia.push(\"Eli\") faz fila.length virar quanto?",
        "opcoes": [
          "2",
          "undefined",
          "3"
        ],
        "correta": 2,
        "explicacao": "O novo vagão entrou na lista compartilhada."
      }
    },
    {
      "id": "f3-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie retirada com Rui e Lia. aConferir = retirada; troque aConferir[1] por Sol e mostre retirada com for...of.",
        "toque": "Crie retirada com Rui e Lia. aConferir = retirada; troque aConferir[1] por Sol e mostre retirada com for...of."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "retirada",
            "valor": [
              "Rui",
              "Sol"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "aConferir",
            "valor": [
              "Rui",
              "Sol"
            ]
          },
          {
            "tipo": "saida",
            "igual": [
              "Rui",
              "Sol"
            ]
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
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Compartilhar não é copiar os itens."
      },
      "falaAoConcluir": {
        "texto": "A seta e a saída confirmam a mesma mudança.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const retirada = [\"Rui\", \"Lia\"]\nlet aConferir = retirada\naConferir[1] = \"Sol\"\nfor (let nome of retirada) { console.log(nome) }"
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

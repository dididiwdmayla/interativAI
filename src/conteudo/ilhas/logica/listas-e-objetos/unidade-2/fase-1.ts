/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U2_F1: FasePratica = {
  "id": "logica-listas-e-objetos-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u2",
  "titulo": "Cada preço passa pelo laço",
  "conceitos": ["percorrer-lista-js"],
  "revisa": [
    "array-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
  ],
  "prerequisitos": [
    "array-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
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
      "nome": "Cada preço passa pelo laço",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "A padaria precisa somar preços e contar os menores que 6. for...of entrega cada valor da lista, não seu índice.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Percorra precos = [3, 8, 5] com for...of; some em total e conte preços < 6 em baratos.",
        "toque": "Percorra precos = [3, 8, 5] com for...of; some em total e conte preços < 6 em baratos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 16
          },
          {
            "tipo": "valorVariavel",
            "nome": "baratos",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Comece total e baratos em zero; a decisão fica dentro do laço.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Comece total e baratos em zero; a decisão fica dentro do laço."
        },
        "solucao": {
          "fala": "Cada volta viu um preço; total é 16 e dois preços são menores que 6.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const precos = [3, 8, 5]\nlet total = 0\nlet baratos = 0\nfor (let preco of precos) {\n total += preco\n if (preco < 6) { baratos++ }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Cada volta viu um preço; total é 16 e dois preços são menores que 6.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const precos = [3, 8, 5]\nlet total = 0\nlet baratos = 0\nfor (let preco of precos) {\n total += preco\n if (preco < 6) { baratos++ }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Some [4, 9, 2, 1] em soma usando for e índices; guarde quantidade = 4.",
        "toque": "Some [4, 9, 2, 1] em soma usando for e índices; guarde quantidade = 4."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 16
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidade",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O índice vai de zero até antes de length."
      },
      "falaAoConcluir": {
        "texto": "for percorreu as quatro posições sem incluir uma posição ausente.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const valores = [4, 9, 2, 1]\nlet soma = 0\nfor (let i = 0; i < valores.length; i++) { soma += valores[i] }\nlet quantidade = valores.length"
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

/* Repetição U3: Guardar o maior e o menor. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U3_F3: FasePratica = {
  "id": "logica-repeticao-u3-f3",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u3",
  "titulo": "Guardar o maior e o menor",
  "conceitos": [
    "maior-menor-js"
  ],
  "revisa": [
    "if-js",
    "limite-da-comparacao",
    "variavel-let"
  ],
  "prerequisitos": [
    "if-js",
    "limite-da-comparacao",
    "variavel-let"
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
      "nome": "Guardar o maior e o menor",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "Vendas de R$ 60, R$ 40 e R$ 20: comece maior e menor com a primeira venda real, 60. Compare cada preço e só troque se achar um maior ou menor.",
      "expressao": "apontando"
    },
    {
      "texto": "Começar menor em 0 daria uma venda mínima inventada: nenhum dos preços positivos seria menor que zero. Não precisa ordenar nada.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "extremos-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Com preco = 80 - pedido * 20 (60, 40, 20), encontre maior e menor usando dois if dentro do for.",
        "toque": "Com preco = 80 - pedido * 20 (60, 40, 20), encontre maior e menor usando dois if dentro do for."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "maior",
            "valor": 60
          },
          {
            "tipo": "valorVariavel",
            "nome": "menor",
            "valor": 20
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual referência real você já tem para os extremos?",
        "dica": "Inicie as duas caixinhas em 60, a primeira venda. Atualize cada uma só quando o preço superar seu extremo.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Inicie as duas caixinhas em 60, a primeira venda. Atualize cada uma só quando o preço superar seu extremo."
        },
        "solucao": {
          "fala": "maior ficou 60; menor mudou de 60 para 40 e para 20. Rebobine para conferir.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let maior = 60\nlet menor = 60\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = 80 - pedido * 20\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "maior ficou 60; menor mudou de 60 para 40 e para 20. Rebobine para conferir.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let maior = 60\nlet menor = 60\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = 80 - pedido * 20\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "extremos-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Teste o bug: comece menor em 0, mantendo maior em 60. Confira o mínimo falso.",
        "toque": "Teste o bug: comece menor em 0, mantendo maior em 60. Confira o mínimo falso."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "menor",
            "valor": 0
          },
          {
            "tipo": "valorVariavel",
            "nome": "maior",
            "valor": 60
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Zero apareceu em alguma venda?",
        "dica": "O primeiro preço real é a referência inicial. Os outros podem diminuir menor.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "O primeiro preço real é a referência inicial. Os outros podem diminuir menor."
        },
        "solucao": {
          "fala": "O bug deixou menor em 0. Esse zero não foi vendido; resta consertar o início.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let maior = 60\nlet menor = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = 80 - pedido * 20\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O bug deixou menor em 0. Esse zero não foi vendido; resta consertar o início.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let maior = 60\nlet menor = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = 80 - pedido * 20\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Se menor começasse em 0 e só mudasse quando preco < menor, o que ficaria?",
        "opcoes": [
          "20",
          "0",
          "60"
        ],
        "correta": 1,
        "explicacao": "Nenhuma venda positiva é menor que zero: seria um mínimo falso."
      }
    },
    {
      "id": "extremos-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Outras vendas: 15, 30 e 45. Comece maior e menor em 15 e ache os extremos com for e if.",
        "toque": "Outras vendas: 15, 30 e 45. Comece maior e menor em 15 e ache os extremos com for e if."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "maior",
            "valor": 45
          },
          {
            "tipo": "valorVariavel",
            "nome": "menor",
            "valor": 15
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual preço deve trocar maior, e qual deve trocar menor?",
        "dica": "Use a primeira venda real como início; compare cada novo preço com os extremos guardados."
      },
      "falaAoConcluir": {
        "texto": "Os extremos mudam conforme os preços, não conforme o número da volta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let maior = 15\nlet menor = 15\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 15\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Compare a saída com as caixinhas na linha do tempo. Cada passo mostra a memória antes da linha marcada rodar.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, conte de 1 a 10 com um laço finito. Confira as dez linhas.",
  "falaFinal": {
    "texto": "Use só laços que terminam no Console real; a proteção de passos pertence ao jogo.",
    "expressao": "feliz"
  }
};

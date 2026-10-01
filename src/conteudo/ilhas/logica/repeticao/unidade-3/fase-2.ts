/* Repetição U3: Contar só quem passa. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U3_F2: FasePratica = {
  "id": "logica-repeticao-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u3",
  "titulo": "Contar só quem passa",
  "conceitos": [
    "contador-condicional"
  ],
  "revisa": [
    "if-js",
    "comparacao-js",
    "contador-js"
  ],
  "prerequisitos": [
    "if-js",
    "comparacao-js",
    "contador-js"
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
      "nome": "Contar só quem passa",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "Agora a pergunta não é quanto dinheiro entrou: é quantos pedidos passaram de R$ 50. O for visita todos; o if decide se aumenta a contagem.",
      "expressao": "apontando"
    },
    {
      "texto": "A linha do tempo mostra pedido mudando a cada volta e acimaDe50 mudando só quando o preço passa no teste.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "contar-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Nas vendas 20, 40 e 60, conte em acimaDe50 só os pedidos com preco > 50.",
        "toque": "Nas vendas 20, 40 e 60, conte em acimaDe50 só os pedidos com preco > 50."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "acimaDe50",
            "valor": 1
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": 4
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
        "pergunta": "Qual condição decide se o pedido entra na contagem?",
        "dica": "Deixe acimaDe50++ dentro do if, não em toda volta.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Deixe acimaDe50++ dentro do if, não em toda volta."
        },
        "solucao": {
          "fala": "Três pedidos visitados; um passou de 50. A contagem ficou em 1.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let acimaDe50 = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  if (preco > 50) { acimaDe50++ }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Três pedidos visitados; um passou de 50. A contagem ficou em 1.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let acimaDe50 = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  if (preco > 50) { acimaDe50++ }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "contar-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Teste no Snippet os preços 30, 60 e 90: use preco = pedido * 30.",
        "toque": "Teste no Snippet os preços 30, 60 e 90: use preco = pedido * 30."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "acimaDe50",
            "valor": 2
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
        "pergunta": "Todo pedido passa do limite?",
        "dica": "Só 60 e 90 são maiores que 50.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Só 60 e 90 são maiores que 50."
        },
        "solucao": {
          "fala": "Duas vendas passaram no if; pedido ainda percorreu as três.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let acimaDe50 = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 30\n  if (preco > 50) { acimaDe50++ }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Duas vendas passaram no if; pedido ainda percorreu as três.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let acimaDe50 = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 30\n  if (preco > 50) { acimaDe50++ }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Preços 30, 60 e 90: quantas vendas são > 50?",
        "opcoes": [
          "2",
          "3",
          "1"
        ],
        "correta": 0,
        "explicacao": "O contador condicional aumenta só para 60 e 90."
      }
    },
    {
      "id": "contar-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Agora as vendas são 25, 50 e 75. Conte em acimaDe50 só as maiores que 50.",
        "toque": "Agora as vendas são 25, 50 e 75. Conte em acimaDe50 só as maiores que 50."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "acimaDe50",
            "valor": 1
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": 4
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
        "pergunta": "Um preço igual a 50 é maior que 50?",
        "dica": "50 não passa em > 50; não troque por >=."
      },
      "falaAoConcluir": {
        "texto": "Só 75 contou. Igual ao limite fica fora.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let acimaDe50 = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 25\n  if (preco > 50) { acimaDe50++ }\n}"
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

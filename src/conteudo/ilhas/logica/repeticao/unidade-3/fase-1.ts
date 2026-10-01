/* Repetição U3: O total não é a volta. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U3_F1: FasePratica = {
  "id": "logica-repeticao-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u3",
  "titulo": "O total não é a volta",
  "conceitos": [
    "acumulador-js"
  ],
  "revisa": [
    "for-js",
    "variavel-let",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "for-js",
    "variavel-let",
    "operacoes-aritmeticas"
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
      "nome": "O total não é a volta",
      "codigoInicial": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let soma = 0\n  soma += pedido * 20\n}"
    }
  },
  "introducao": [
    {
      "texto": "Na Cantina Sol, três vendas de R$ 20, R$ 40 e R$ 60: pedido é o contador da volta; soma acumula os valores. São caixinhas com trabalhos diferentes.",
      "expressao": "apontando"
    },
    {
      "texto": "soma += preco abrevia soma = soma + preco. Crie soma antes do loop: declarar let soma = 0 dentro cria outra caixinha, zerada em cada volta.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "soma-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Some as vendas 20, 40 e 60 no Snippet. Use soma = 0 antes do for e preco = pedido * 20 dentro.",
        "toque": "Some as vendas 20, 40 e 60 no Snippet. Use soma = 0 antes do for e preco = pedido * 20 dentro."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 120
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Por que soma precisa nascer antes das voltas?",
        "dica": "Comece soma em 0 e some preco em cada volta: soma += preco.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Comece soma em 0 e some preco em cada volta: soma += preco."
        },
        "solucao": {
          "fala": "No rastro soma vai 0, 20, 60, 120; pedido vai 1, 2, 3, 4. Somar não é contar.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "No rastro soma vai 0, 20, 60, 120; pedido vai 1, 2, 3, 4. Somar não é contar.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "soma-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode de novo as três vendas e confira o total previsto.",
        "toque": "Rode de novo as três vendas e confira o total previsto."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 120
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Soma é quantidade de pedidos ou dinheiro acumulado?",
        "dica": "A segunda venda se soma à primeira: 20 + 40. Depois acrescenta 60.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "A segunda venda se soma à primeira: 20 + 40. Depois acrescenta 60."
        },
        "solucao": {
          "fala": "soma termina em 120. Se começasse em 1, somaria um valor que não foi vendido.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "soma termina em 120. Se começasse em 1, somaria um valor que não foi vendido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Somando 20, 40 e 60 a partir de zero, quanto vale soma no fim?",
        "opcoes": [
          "3",
          "60",
          "120"
        ],
        "correta": 2,
        "explicacao": "São valores acumulados: 20 + 40 + 60 = 120; três é a quantidade de vendas."
      }
    },
    {
      "id": "soma-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Outra loja: quatro vendas de 10, 20, 30 e 40. Guarde o total em soma e confira pedido no fim.",
        "toque": "Outra loja: quatro vendas de 10, 20, 30 e 40. Guarde o total em soma e confira pedido no fim."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "soma",
            "valor": 100
          },
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": 5
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Se soma zerar a cada volta, o que se perde?",
        "dica": "Reinicie soma antes do for; dentro só acrescente o preço da vez."
      },
      "falaAoConcluir": {
        "texto": "soma vale 100, pedido vale 5; um é dinheiro, o outro já passou da última volta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let soma = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 4; pedido++) {\n  let preco = pedido * 10\n  soma += preco\n}"
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

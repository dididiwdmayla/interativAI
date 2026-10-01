/* Repetição U3: Dividir pela quantidade. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U3_F4: FasePratica = {
  "id": "logica-repeticao-u3-f4",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u3",
  "titulo": "Dividir pela quantidade",
  "conceitos": [
    "media-js"
  ],
  "revisa": [
    "operacoes-aritmeticas",
    "if-js",
    "contador-js"
  ],
  "prerequisitos": [
    "operacoes-aritmeticas",
    "if-js",
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
      "nome": "Dividir pela quantidade",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "A média é a soma dividida pela quantidade de vendas. quantidade começa em 0 e cresce a cada venda; pedido identifica a volta e passa do limite no fim.",
      "expressao": "apontando"
    },
    {
      "texto": "Não divida por pedido no fim: ele vale 4 depois de visitar três vendas. Divida por quantidade, que vale 3.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "media-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Some 20, 40 e 60, conte quantidade e calcule media depois do for.",
        "toque": "Some 20, 40 e 60, conte quantidade e calcule media depois do for."
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
            "nome": "quantidade",
            "valor": 3
          },
          {
            "tipo": "valorVariavel",
            "nome": "media",
            "valor": 40
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quais duas caixinhas você precisa para obter a média?",
        "dica": "Guarde soma e quantidade fora do loop. media = soma / quantidade fica depois das chaves.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Guarde soma e quantidade fora do loop. media = soma / quantidade fica depois das chaves."
        },
        "solucao": {
          "fala": "120 / 3 = 40. No palco, quantidade é 3 e pedido já vale 4.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let soma = 0\nlet quantidade = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n  quantidade++\n}\nlet media = soma / quantidade"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "120 / 3 = 40. No palco, quantidade é 3 e pedido já vale 4.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let soma = 0\nlet quantidade = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 20\n  soma += preco\n  quantidade++\n}\nlet media = soma / quantidade"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "media-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Teste rapidamente 120 / 3 no Console.",
        "toque": "Teste rapidamente 120 / 3 no Console."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": 40
      },
      "ajudas": {
        "pergunta": "Você divide pelo último contador ou pela quantidade real?",
        "dica": "São três vendas. O contador da volta passou do último pedido.",
        "linha": {
          "alvo": "console",
          "fala": "São três vendas. O contador da volta passou do último pedido."
        },
        "solucao": {
          "fala": "40 é a média; usar o contador final 4 daria 30, uma conta com quantidade errada.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "120 / 3"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "40 é a média; usar o contador final 4 daria 30, uma conta com quantidade errada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 3
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "120 / 3"
        }
      ],
      "previsao": {
        "pergunta": "Com soma 120, quantidade 3 e pedido 4 no fim, qual a média?",
        "opcoes": [
          "30",
          "120",
          "3",
          "40"
        ],
        "correta": 3,
        "explicacao": "A divisão usa quantidade, não o contador que já passou da última volta."
      }
    },
    {
      "id": "media-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Quatro vendas de 10, 20, 30 e 40: calcule soma, quantidade e media; mostre \"Fechado\" com if no fim.",
        "toque": "Quatro vendas de 10, 20, 30 e 40: calcule soma, quantidade e media; mostre \"Fechado\" com if no fim."
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
            "nome": "quantidade",
            "valor": 4
          },
          {
            "tipo": "valorVariavel",
            "nome": "media",
            "valor": 25
          },
          {
            "tipo": "saida",
            "igual": [
              "Fechado"
            ]
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
        "pergunta": "Depois das quatro vendas, quantas foram contadas?",
        "dica": "Conte uma venda por volta e divida depois. Use if para conferir as quatro vendas no encerramento."
      },
      "falaAoConcluir": {
        "texto": "100 / 4 = 25; você juntou acumular, contar e decidir.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let soma = 0\nlet quantidade = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 4; pedido++) {\n  let preco = pedido * 10\n  soma += preco\n  quantidade++\n}\nlet media = soma / quantidade\nif (quantidade === 4) { console.log(\"Fechado\") }"
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

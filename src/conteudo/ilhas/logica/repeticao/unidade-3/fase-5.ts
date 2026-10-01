/* Repetição U3: O caixa da sorveteria. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U3_F5: FaseDesafio = {
  "id": "logica-repeticao-u3-f5",
  "tipo": "desafio",
  "unidadeId": "logica-repeticao-u3",
  "titulo": "O caixa da sorveteria",
  "conceitos": [
    "acumulador-js",
    "contador-condicional",
    "maior-menor-js",
    "media-js"
  ],
  "revisa": [
    "for-js",
    "if-js",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "acumulador-js",
    "contador-condicional",
    "maior-menor-js",
    "media-js"
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
      "nome": "O caixa da sorveteria",
      "codigoInicial": "// Monte o programa e confira o palco."
    }
  },
  "introducao": [
    {
      "texto": "Sorveteria Nuvem: pedidos de R$ 12, R$ 24 e R$ 36. Use preco = pedido * 12. Ache total, pedidos > 20, extremos e média.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "total",
      "descricao": "Some as três vendas com for: total deve ficar em 72.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 72
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u3-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let total = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 12\n  total += preco\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "grandes",
      "descricao": "Com for e if, conte os pedidos com preco > 20: grandes deve ficar em 2.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "grandes",
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
      "revisarEm": "logica-repeticao-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let grandes = 0\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 12\n  if (preco > 20) { grandes++ }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "extremos",
      "descricao": "Com for e if, guarde maior = 36 e menor = 12. Inicie ambos na primeira venda, 12.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "maior",
            "valor": 36
          },
          {
            "tipo": "valorVariavel",
            "nome": "menor",
            "valor": 12
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
      "revisarEm": "logica-repeticao-u3-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let maior = 12\nlet menor = 12\nlet pedido = 0\nfor (pedido = 1; pedido <= 3; pedido++) {\n  let preco = pedido * 12\n  if (preco > maior) { maior = preco }\n  if (preco < menor) { menor = preco }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "media",
      "descricao": "São três pedidos: use o total para calcular media = 24 e mostre \"Caixa fechado\".",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "media",
            "valor": 24
          },
          {
            "tipo": "saida",
            "igual": [
              "Caixa fechado"
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let media = total / 3\nconsole.log(\"Caixa fechado\")"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você resolveu um caso novo. Rebobine a linha do tempo e confira como cada caixinha chegou ao resultado.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie soma = 0 e some de 1 a 10 com for. Confira que soma termina em 55; a média desses dez números é 5.5.",
  "falaFinal": {
    "texto": "Esse mesmo JavaScript funciona no Console de qualquer site.",
    "expressao": "feliz"
  }
};

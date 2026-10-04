/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U2_F4: FaseDesafio = {
  "id": "logica-funcoes-u2-f4",
  "tipo": "desafio",
  "unidadeId": "logica-funcoes-u2",
  "titulo": "O frete da loja",
  "conceitos": [
    "parametro-argumento",
    "return-js",
    "mostrar-ou-devolver",
    "return-encerra"
  ],
  "revisa": [
    "if-js",
    "for-js",
    "console-log"
  ],
  "prerequisitos": [
    "parametro-argumento",
    "return-js",
    "mostrar-ou-devolver",
    "return-encerra"
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
      "nome": "O frete da loja",
      "codigoInicial": "// Crie e chame as funções do desafio."
    }
  },
  "introducao": [
    {
      "texto": "Loja Rota: duas funções da calculadora devem devolver resultados para pedidos diferentes.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "frete",
      "descricao": "Crie calcularFrete(preco): 0 a partir de 200; abaixo disso, 18. Guarde entrega = calcularFrete(200).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "calcularFrete",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": 18
              },
              {
                "args": [
                  199
                ],
                "esperado": 18
              },
              {
                "args": [
                  200
                ],
                "esperado": 0
              },
              {
                "args": [
                  300
                ],
                "esperado": 0
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "entrega",
            "valor": 0
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u2-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function calcularFrete(preco) {\n  if (preco >= 200) { return 0 }\n  return 18\n}\nlet entrega = calcularFrete(200)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "total",
      "descricao": "Crie totalPedido(preco, entrega) devolvendo a soma. Guarde total = totalPedido(80, calcularFrete(80)).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "totalPedido",
            "casos": [
              {
                "args": [
                  0,
                  18
                ],
                "esperado": 18
              },
              {
                "args": [
                  80,
                  18
                ],
                "esperado": 98
              },
              {
                "args": [
                  200,
                  0
                ],
                "esperado": 200
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 98
          }
        ]
      },
      "revisarEm": "logica-funcoes-u2-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function totalPedido(preco, entrega) {\n  return preco + entrega\n}\nlet total = totalPedido(80, calcularFrete(80))"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você criou funções em outro contexto. Confira a chamada e o resultado no palco, voltando pela linha do tempo.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie e chame uma função com um parâmetro e return. Teste três valores, incluindo zero.",
  "falaFinal": {
    "texto": "As molduras ajudam aqui; no mundo real o Console executa o mesmo JavaScript.",
    "expressao": "feliz"
  }
};

/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U4_F3: FaseDesafio = {
  "id": "logica-funcoes-u4-f3",
  "tipo": "desafio",
  "unidadeId": "logica-funcoes-u4",
  "titulo": "A receita em outra medida",
  "conceitos": [
    "arrow-js",
    "retorno-implicito",
    "arrow-com-bloco"
  ],
  "revisa": [
    "if-js",
    "for-js",
    "console-log"
  ],
  "prerequisitos": [
    "arrow-js",
    "retorno-implicito",
    "arrow-com-bloco"
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
      "nome": "A receita em outra medida",
      "codigoInicial": "// Crie e chame as funções do desafio."
    }
  },
  "introducao": [
    {
      "texto": "Cozinha Aurora: converta xícaras para mililitros e colheres para gramas, escrevendo duas arrows.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "xicaras",
      "descricao": "Crie ml(xicaras) como arrow sem chaves: cada xícara vale 240 ml. Guarde leite = ml(1.5).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "ml",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  1
                ],
                "esperado": 240
              },
              {
                "args": [
                  1.5
                ],
                "esperado": 360
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "leite",
            "valor": 360
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const ml = (xicaras) => xicaras * 240\nlet leite = ml(1.5)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "colheres",
      "descricao": "Crie gramas(colheres) com arrow e bloco: se colheres <= 0 devolva 0; senão devolva colheres * 15. Guarde farinha.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "gramas",
            "casos": [
              {
                "args": [
                  -1
                ],
                "esperado": 0
              },
              {
                "args": [
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  2
                ],
                "esperado": 30
              },
              {
                "args": [
                  0.5
                ],
                "esperado": 7.5
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "farinha",
            "valor": 30
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "return"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const gramas = (colheres) => {\n  if (colheres <= 0) { return 0 }\n  return colheres * 15\n}\nlet farinha = gramas(2)"
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

/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U3_F4: FaseDesafio = {
  "id": "logica-funcoes-u3-f4",
  "tipo": "desafio",
  "unidadeId": "logica-funcoes-u3",
  "titulo": "As visitas da exposição",
  "conceitos": [
    "escopo-global-js",
    "escopo-funcao-js",
    "escopo-bloco-js",
    "estado-entre-chamadas"
  ],
  "revisa": [
    "if-js",
    "for-js",
    "console-log"
  ],
  "prerequisitos": [
    "escopo-global-js",
    "escopo-funcao-js",
    "escopo-bloco-js",
    "estado-entre-chamadas"
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
      "nome": "As visitas da exposição",
      "codigoInicial": "function visitar() {\n  let visitas = 0\n  visitas++\n  return visitas\n}\nlet primeira = visitar()\nlet segunda = visitar()"
    },
    "preparo": "function visitar() {\n  let visitas = 0\n  visitas++\n  return visitas\n}\nlet primeira = visitar()\nlet segunda = visitar()"
  },
  "introducao": [
    {
      "texto": "Exposição Marés: o contador zera a cada visita. Conserte e separe o resultado da mensagem.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "contador",
      "descricao": "Crie visitas = 0 fora e visitar() aumentando e devolvendo. Guarde primeira = visitar() e segunda = visitar().",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "visitas",
            "valor": 2
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeira",
            "valor": 1
          },
          {
            "tipo": "valorVariavel",
            "nome": "segunda",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u3-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let visitas = 0\nfunction visitar() {\n  visitas++\n  return visitas\n}\nlet primeira = visitar()\nlet segunda = visitar()"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "rotulo",
      "descricao": "Crie rotulo(n): use let texto local e devolva \"Visita \" + n; guarde mensagem = rotulo(segunda).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "rotulo",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": "Visita 0"
              },
              {
                "args": [
                  2
                ],
                "esperado": "Visita 2"
              },
              {
                "args": [
                  10
                ],
                "esperado": "Visita 10"
              }
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "mensagem",
            "valor": "Visita 2"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u3-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function rotulo(n) {\n  let texto = \"Visita \" + n\n  return texto\n}\nlet mensagem = rotulo(segunda)"
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

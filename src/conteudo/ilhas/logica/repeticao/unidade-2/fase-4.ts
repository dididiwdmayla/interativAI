/* Repetição U2: Etiquetas na gráfica. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U2_F4: FaseDesafio = {
  "id": "logica-repeticao-u2-f4",
  "tipo": "desafio",
  "unidadeId": "logica-repeticao-u2",
  "titulo": "Etiquetas na gráfica",
  "conceitos": [
    "for-js",
    "for-of-js",
    "break-js"
  ],
  "revisa": [
    "concatenacao-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "for-js",
    "for-of-js",
    "break-js"
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
      "nome": "Etiquetas na gráfica",
      "codigoInicial": "// Monte o programa e confira o palco."
    }
  },
  "introducao": [
    {
      "texto": "A Gráfica Ponto Impresso precisa de quatro etiquetas numeradas e da primeira letra de GRAFICA. Faça um programa por parte e confira o rastro.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "etiquetas",
      "descricao": "Use for para mostrar Etiqueta 1 até Etiqueta 4, em ordem; etiqueta termina em 5.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Etiqueta 1",
              "Etiqueta 2",
              "Etiqueta 3",
              "Etiqueta 4"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "etiqueta",
            "valor": 5
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u2-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let etiqueta = 0\nfor (etiqueta = 1; etiqueta <= 4; etiqueta++) {\n  console.log(\"Etiqueta \" + etiqueta)\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "inicial",
      "descricao": "Com for...of e break, pegue só a primeira letra de GRAFICA: inicial = \"G\" e saída \"Inicial G\".",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "inicial",
            "valor": "G"
          },
          {
            "tipo": "saida",
            "igual": [
              "Inicial G"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "break"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u2-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let inicial = \"\"\nfor (let letra of \"GRAFICA\") {\n  inicial = letra\n  console.log(\"Inicial \" + letra)\n  break\n}"
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
  "missaoDeCampo": "No Console de qualquer site, escreva for (let i = 1; i <= 10; i++) { console.log(7 * i) }. Confira os dez resultados, de 7 a 70.",
  "falaFinal": {
    "texto": "Esse mesmo JavaScript funciona no Console de qualquer site.",
    "expressao": "feliz"
  }
};

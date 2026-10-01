/* Repetição U2: Três partes, uma tabuada. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U2_F1: FasePratica = {
  "id": "logica-repeticao-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u2",
  "titulo": "Três partes, uma tabuada",
  "conceitos": [
    "for-js"
  ],
  "revisa": [
    "while-js",
    "limite-da-comparacao",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "while-js",
    "limite-da-comparacao",
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
      "nome": "Três partes, uma tabuada",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "O for reúne início, condição e atualização no cabeçalho: for (let i = 1; i <= 3; i++). Só o bloco se repete; a atualização acontece depois de cada volta.",
      "expressao": "apontando"
    },
    {
      "texto": "Declaramos i fora para ela ficar visível no palco também no fim; o início i = 1 continua no cabeçalho do for.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "tabuada-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie i antes do for; inicie em 1 no cabeçalho. No Snippet, mostre a tabuada do 7 de 1 a 3.",
        "toque": "Crie i antes do for; inicie em 1 no cabeçalho. No Snippet, mostre a tabuada do 7 de 1 a 3."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "7",
              "14",
              "21"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "for (i = 1; i <= 3; i++) faz três voltas. Mostre 7 * i dentro das chaves.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "for (i = 1; i <= 3; i++) faz três voltas. Mostre 7 * i dentro das chaves."
        },
        "solucao": {
          "fala": "Na terceira volta i é 3: aparece 21. No fim a atualização deixou i em 4.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let i = 0\nfor (i = 1; i <= 3; i++) {\n  console.log(7 * i)\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Na terceira volta i é 3: aparece 21. No fim a atualização deixou i em 4.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 0\nfor (i = 1; i <= 3; i++) {\n  console.log(7 * i)\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "for-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Teste o for completo: let i = 0 no cabeçalho, i < 3, i++. Mostre i.",
        "toque": "Teste o for completo: let i = 0 no cabeçalho, i < 3, i++. Mostre i."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "0",
              "1",
              "2"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Os dois pontos e vírgulas separam criar, testar e atualizar. 0, 1 e 2 entram; 3 não.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Os dois pontos e vírgulas separam criar, testar e atualizar. 0, 1 e 2 entram; 3 não."
        },
        "solucao": {
          "fala": "Três voltas mesmo começando em 0. No rastro i existe dentro do for; depois esse i local some.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "for (let i = 0; i < 3; i++) {\n  console.log(i)\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Três voltas mesmo começando em 0. No rastro i existe dentro do for; depois esse i local some.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "for (let i = 0; i < 3; i++) {\n  console.log(i)\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "for (let i = 0; i < 3; i++) faz quantas voltas?",
        "opcoes": [
          "2",
          "4",
          "3"
        ],
        "correta": 2,
        "explicacao": "As voltas usam 0, 1 e 2: três valores menores que 3."
      }
    },
    {
      "id": "tabuada-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No Snippet, mostre a tabuada do 9 de 1 a 4. Deixe i fora do cabeçalho para conferir o fim.",
        "toque": "No Snippet, mostre a tabuada do 9 de 1 a 4. Deixe i fora do cabeçalho para conferir o fim."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "9",
              "18",
              "27",
              "36"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 5
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Inclua o 4 com <=, multiplique 9 por i e atualize no cabeçalho."
      },
      "falaAoConcluir": {
        "texto": "Quatro produtos, i termina em 5. Trocar <= por < perderia o último.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 0\nfor (i = 1; i <= 4; i++) {\n  console.log(9 * i)\n}"
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

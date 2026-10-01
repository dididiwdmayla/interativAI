/* Repetição U1: O contador e a fronteira. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U1_F2: FasePratica = {
  "id": "logica-repeticao-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u1",
  "titulo": "O contador e a fronteira",
  "conceitos": [
    "contador-js"
  ],
  "revisa": [
    "limite-da-comparacao",
    "if-js",
    "operacoes-aritmeticas"
  ],
  "prerequisitos": [
    "limite-da-comparacao",
    "if-js",
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
      "nome": "O contador e a fronteira",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "i = i + 1 e i++ aumentam o contador em um. O nome i não obriga começar em 1: você escolhe o início.",
      "expressao": "apontando"
    },
    {
      "texto": "Compare < com <= na linha do tempo: a igualdade deixa entrar mais uma volta.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "contador-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "No Snippet, conte i de 1 a 3 com i = i + 1 e mostre cada valor.",
        "toque": "No Snippet, conte i de 1 a 3 com i = i + 1 e mostre cada valor."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "1",
              "2",
              "3"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "i <= 3 inclui o 3; depois do incremento, i vale 4 e sai.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "i <= 3 inclui o 3; depois do incremento, i vale 4 e sai."
        },
        "solucao": {
          "fala": "No fim i vale 4; o último valor mostrado foi 3. São coisas diferentes.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let i = 1\nwhile (i <= 3) {\n  console.log(i)\n  i = i + 1\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "No fim i vale 4; o último valor mostrado foi 3. São coisas diferentes.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 1\nwhile (i <= 3) {\n  console.log(i)\n  i = i + 1\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "contador-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Use i++ e i < 3, começando em 1. Execute e confira.",
        "toque": "Use i++ e i < 3, começando em 1. Execute e confira."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "1",
              "2"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 3
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "1 e 2 são menores que 3. Com i igual a 3, o bloco não entra.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "1 e 2 são menores que 3. Com i igual a 3, o bloco não entra."
        },
        "solucao": {
          "fala": "< fez duas voltas; <= fez três. i++ é o mesmo aumento de um.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let i = 1\nwhile (i < 3) {\n  console.log(i)\n  i++\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "< fez duas voltas; <= fez três. i++ é o mesmo aumento de um.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 1\nwhile (i < 3) {\n  console.log(i)\n  i++\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Com i = 1 e i < 3, quantas voltas entram?",
        "opcoes": [
          "2",
          "3",
          "4"
        ],
        "correta": 0,
        "explicacao": "O valor 3 fica fora porque < não inclui igualdade."
      }
    },
    {
      "id": "contador-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conte de 0 a 3 com while e i++. Mostre \"fim\" só quando i for 3, usando if.",
        "toque": "Conte de 0 a 3 com while e i++. Mostre \"fim\" só quando i for 3, usando if."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "0",
              "1",
              "2",
              "3",
              "fim"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "i",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Começar em 0 dá quatro voltas até 3; o if roda só na última."
      },
      "falaAoConcluir": {
        "texto": "Você escolheu o início, atualizou o contador e revisou o if dentro do laço.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let i = 0\nwhile (i <= 3) {\n  console.log(i)\n  if (i === 3) { console.log(\"fim\") }\n  i++\n}"
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

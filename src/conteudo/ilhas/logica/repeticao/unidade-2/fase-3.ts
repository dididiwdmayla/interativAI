/* Repetição U2: Uma saída antecipada. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U2_F3: FasePratica = {
  "id": "logica-repeticao-u2-f3",
  "tipo": "pratica",
  "unidadeId": "logica-repeticao-u2",
  "titulo": "Uma saída antecipada",
  "conceitos": [
    "break-js"
  ],
  "revisa": [
    "if-js",
    "igualdade-estrita",
    "console-log"
  ],
  "prerequisitos": [
    "if-js",
    "igualdade-estrita",
    "console-log"
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
      "nome": "Uma saída antecipada",
      "codigoInicial": "// Escreva seu programa aqui."
    }
  },
  "introducao": [
    {
      "texto": "break sai imediatamente do laço atual. O programa continua depois das chaves: ele não volta ao começo e não encerra o programa inteiro.",
      "expressao": "apontando"
    },
    {
      "texto": "É uma primeira apresentação: procure uma letra e pare ao encontrá-la. O if decide quando sair.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "break-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Em \"MARTE\", pare antes de mostrar R: mostre M, A e \"Busca encerrada\"; conte voltas.",
        "toque": "Em \"MARTE\", pare antes de mostrar R: mostre M, A e \"Busca encerrada\"; conte voltas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "M",
              "A",
              "Busca encerrada"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "voltas",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "break"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Teste letra === \"R\" antes do console.log e use break nesse if.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Teste letra === \"R\" antes do console.log e use break nesse if."
        },
        "solucao": {
          "fala": "O break pulou R, T e E; o aviso depois do laço apareceu.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let voltas = 0\nfor (let letra of \"MARTE\") {\n  if (letra === \"R\") { break }\n  console.log(letra)\n  voltas++\n}\nconsole.log(\"Busca encerrada\")"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O break pulou R, T e E; o aviso depois do laço apareceu.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let voltas = 0\nfor (let letra of \"MARTE\") {\n  if (letra === \"R\") { break }\n  console.log(letra)\n  voltas++\n}\nconsole.log(\"Busca encerrada\")"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "break-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "No Snippet, percorra \"VIDA\", mostrando a letra e parando depois de I.",
        "toque": "No Snippet, percorra \"VIDA\", mostrando a letra e parando depois de I."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "V",
              "I"
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
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Desta vez o console.log vem antes do if: a letra I é mostrada antes de sair.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1,
            2
          ],
          "fala": "Desta vez o console.log vem antes do if: a letra I é mostrada antes de sair."
        },
        "solucao": {
          "fala": "V e I. A posição do break em relação ao console.log muda a saída.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "for (let letra of \"VIDA\") {\n  console.log(letra)\n  if (letra === \"I\") { break }\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "V e I. A posição do break em relação ao console.log muda a saída.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "for (let letra of \"VIDA\") {\n  console.log(letra)\n  if (letra === \"I\") { break }\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Mostrando antes do break em I, o que sai ao percorrer VIDA?",
        "opcoes": [
          "Só V",
          "V e I",
          "V, I, D e A"
        ],
        "correta": 1,
        "explicacao": "I é mostrada e só depois o break sai do laço."
      }
    },
    {
      "id": "break-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Em \"CASA\", pare antes de S. Mostre C, A e \"Busca encerrada\", contando voltas.",
        "toque": "Em \"CASA\", pare antes de S. Mostre C, A e \"Busca encerrada\", contando voltas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "C",
              "A",
              "Busca encerrada"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "voltas",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "break"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha muda em cada volta, e quando a condição fica falsa?",
        "dica": "Compare com S antes de mostrar a letra; mantenha o aviso final fora do laço."
      },
      "falaAoConcluir": {
        "texto": "O if interrompeu a busca; o restante do programa continuou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let voltas = 0\nfor (let letra of \"CASA\") {\n  if (letra === \"S\") { break }\n  console.log(letra)\n  voltas++\n}\nconsole.log(\"Busca encerrada\")"
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

/*
 * Lógica U2, Fase 2. Mesmo gesto de concatenar, primeiro nome guiado e depois etiqueta sozinha; espaço explícito.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U2_F2: FasePratica = {
  "id": "logica-primeiros-comandos-u2-f2",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u2",
  "titulo": "Juntar sem perder o espaço",
  "conceitos": [
    "concatenacao-js"
  ],
  "revisa": [
    "string-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "console-js",
    "string-js",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let cliente = \"Lia\"\nlet sobrenome = \"Costa\""
  },
  "introducao": [
    {
      "texto": "O nome chega em duas partes. O + junta textos, mas não adivinha o espaço entre as palavras.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "juntar-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode \"Lia\" + \"Costa\" e veja o que falta.",
        "toque": "Rode \"Lia\" + \"Costa\" e veja o que falta."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "LiaCosta"
      },
      "ajudas": {
        "pergunta": "O + coloca um espaço por conta própria?",
        "dica": "Rode \"Lia\" + \"Costa\"; cada caractere entra exatamente como foi escrito.",
        "linha": {
          "alvo": "console",
          "fala": "Rode \"Lia\" + \"Costa\"; cada caractere entra exatamente como foi escrito."
        },
        "solucao": {
          "fala": "LiaCosta: o + junta, sem acrescentar nenhum espaço.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "\"Lia\" + \"Costa\""
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "LiaCosta: o + junta, sem acrescentar nenhum espaço.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "\"Lia\" + \"Costa\""
        }
      ]
    },
    {
      "id": "prever-juncao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira no Console: 'oi' + 'tchau'.",
        "toque": "Confira no Console: 'oi' + 'tchau'."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "oitchau"
      },
      "ajudas": {
        "pergunta": "Há espaço dentro de algum dos dois textos?",
        "dica": "O + entre textos cola o fim do primeiro no começo do segundo.",
        "linha": {
          "alvo": "console",
          "fala": "O + entre textos cola o fim do primeiro no começo do segundo."
        },
        "solucao": {
          "fala": "oitchau, tudo junto. O + não significa soma quando trabalha com textos.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "'oi' + 'tchau'"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "oitchau, tudo junto. O + não significa soma quando trabalha com textos.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "'oi' + 'tchau'"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde se você roda 'oi' + 'tchau'?",
        "opcoes": [
          "'oitchau'",
          "'oi tchau'",
          "Erro: texto não soma"
        ],
        "correta": 0,
        "explicacao": "O + junta os caracteres; não inventa espaços."
      }
    },
    {
      "id": "espaco-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Monte let nomeCompleto com cliente, um espaço e sobrenome.",
        "toque": "Monte let nomeCompleto com cliente, um espaço e sobrenome."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "nomeCompleto",
        "valor": "Lia Costa"
      },
      "ajudas": {
        "pergunta": "Onde guardar o espaço que separa as duas palavras?",
        "dica": "O espaço também é texto: cliente + \" \" + sobrenome.",
        "linha": {
          "alvo": "console",
          "fala": "O espaço também é texto: cliente + \" \" + sobrenome."
        },
        "solucao": {
          "fala": "O palco mostra Lia Costa. O espaço entrou porque estava entre aspas.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let nomeCompleto = cliente + \" \" + sobrenome"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O palco mostra Lia Costa. O espaço entrou porque estava entre aspas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let nomeCompleto = cliente + \" \" + sobrenome"
        }
      ]
    },
    {
      "id": "juntar-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Monte let etiqueta com \"Pedido: \", nomeCompleto e \" - retirada\".",
        "toque": "Monte let etiqueta com \"Pedido: \", nomeCompleto e \" - retirada\"."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "etiqueta",
        "valor": "Pedido: Lia Costa - retirada"
      },
      "ajudas": {
        "pergunta": "Quais pedaços já têm os espaços que a frase precisa?",
        "dica": "Junte os textos e a variável na ordem da etiqueta; os espaços ficam dentro das aspas."
      },
      "falaAoConcluir": {
        "texto": "Etiqueta pronta: texto, valor da variável e outro texto, unidos pelo +.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let etiqueta = \"Pedido: \" + nomeCompleto + \" - retirada\""
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado no Console e no palco.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e monte uma frase com seu nome entre aspas, junte um espaço e confira o tamanho com .length.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

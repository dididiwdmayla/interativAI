/*
 * Lógica U3, Fase 1. Cinco tipos no palco; typeof null é tratado explicitamente, sem chamar null de objeto.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F1: FasePratica = {
  "id": "logica-primeiros-comandos-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "Cada valor tem um tipo",
  "conceitos": [
    "tipo-js",
    "typeof-js"
  ],
  "revisa": [
    "string-js",
    "undefined-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "console-js",
    "string-js",
    "undefined-js",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let numero = 2\nlet codigo = \"2\"\nlet aberta = true\nlet pendente\nlet reserva = null"
  },
  "introducao": [
    {
      "texto": "No Estacionamento Vaga Certa, olhe as etiquetas e cores no palco: número, texto, booleano, undefined e null.",
      "expressao": "curioso"
    },
    {
      "texto": "numero vale 2; codigo vale \"2\"; aberta vale true. pendente ainda não recebeu valor; reserva vale null, vazio intencional.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "tipo-numero",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte typeof numero no Console.",
        "toque": "Pergunte typeof numero no Console."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "number"
      },
      "ajudas": {
        "pergunta": "A caixinha guarda algarismos para uma conta ou texto?",
        "dica": "Rode typeof numero; a resposta é o nome do tipo em inglês.",
        "linha": {
          "alvo": "console",
          "fala": "Rode typeof numero; a resposta é o nome do tipo em inglês."
        },
        "solucao": {
          "fala": "number significa número. A cor e a etiqueta do palco mostram a mesma distinção.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "typeof numero"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "number significa número. A cor e a etiqueta do palco mostram a mesma distinção.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof numero"
        }
      ]
    },
    {
      "id": "tipo-texto",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Agora pergunte o tipo da caixinha codigo, que guarda \"2\".",
        "toque": "Agora pergunte o tipo da caixinha codigo, que guarda \"2\"."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "string"
      },
      "ajudas": {
        "pergunta": "O valor foi escrito entre aspas?",
        "dica": "typeof pergunta o tipo do valor guardado, não o tipo do nome da caixinha."
      },
      "falaAoConcluir": {
        "texto": "string significa texto: \"2\" e 2 têm tipos diferentes, apesar da aparência.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof codigo"
        }
      ]
    },
    {
      "id": "tipo-booleano",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte o tipo de aberta, que guarda true.",
        "toque": "Pergunte o tipo de aberta, que guarda true."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "boolean"
      },
      "ajudas": {
        "pergunta": "True representa texto, número ou uma resposta de sim/não?",
        "dica": "O nome do tipo vem em inglês; true não está entre aspas."
      },
      "falaAoConcluir": {
        "texto": "boolean significa booleano: só true (verdadeiro) ou false (falso), sem aspas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof aberta"
        }
      ]
    },
    {
      "id": "tipo-undefined",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte typeof pendente; ela foi criada com let, sem valor.",
        "toque": "Pergunte typeof pendente; ela foi criada com let, sem valor."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "undefined"
      },
      "ajudas": {
        "pergunta": "Criar uma caixinha sem preencher é a mesma coisa que declarar null?",
        "dica": "let pendente existe, mas ainda não recebeu valor: o tipo é undefined."
      },
      "falaAoConcluir": {
        "texto": "undefined aqui é o próprio valor guardado, além de ser a resposta de uma declaração.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof pendente"
        }
      ]
    },
    {
      "id": "null-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira typeof reserva, que guarda null.",
        "toque": "Confira typeof reserva, que guarda null."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "object"
      },
      "ajudas": {
        "pergunta": "Null é uma ausência escolhida. O typeof dele tem uma peculiaridade antiga.",
        "dica": "Rode typeof reserva; o JavaScript conserva essa resposta histórica.",
        "linha": {
          "alvo": "console",
          "fala": "Rode typeof reserva; o JavaScript conserva essa resposta histórica."
        },
        "solucao": {
          "fala": "typeof null dá \"object\", por um detalhe histórico. null continua sendo vazio intencional, não uma ficha de objeto.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "typeof reserva"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "typeof null dá \"object\", por um detalhe histórico. null continua sendo vazio intencional, não uma ficha de objeto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof reserva"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para typeof null?",
        "opcoes": [
          "'undefined'",
          "'object'",
          "'null'"
        ],
        "correta": 1,
        "explicacao": "É \"object\", uma peculiaridade antiga do JavaScript. No palco, null aparece como null."
      }
    },
    {
      "id": "tipo-proprio",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie let vagas = 12 e guarde typeof vagas em let tipoVagas.",
        "toque": "Crie let vagas = 12 e guarde typeof vagas em let tipoVagas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "vagas",
            "valor": 12
          },
          {
            "tipo": "valorVariavel",
            "nome": "tipoVagas",
            "valor": "number"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual é o tipo do valor guardado? E qual é o tipo da resposta de typeof?",
        "dica": "A resposta de typeof é um texto; você pode guardá-la em outra variável."
      },
      "falaAoConcluir": {
        "texto": "vagas guarda um número; tipoVagas guarda o texto \"number\". Duas etiquetas diferentes no palco.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let vagas = 12\nlet tipoVagas = typeof vagas"
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
  "missaoDeCampo": "Abra o Console de qualquer site e guarde a conta da feira (3 * 4.5 + 2 * 7) em let totalFeira e pergunte typeof totalFeira.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

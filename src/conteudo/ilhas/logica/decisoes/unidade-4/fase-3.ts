/*
 * Decisões U4, Fase 3: !!valor: a resposta direta.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U4_F3: FasePratica = {
  "id": "logica-decisoes-u4-f3",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u4",
  "titulo": "!!valor: a resposta direta",
  "conceitos": [
    "dupla-negacao"
  ],
  "revisa": [
    "falsy-js",
    "truthy-js",
    "operadores-logicos",
    "typeof-js"
  ],
  "prerequisitos": [
    "falsy-js",
    "truthy-js",
    "operadores-logicos"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let nome = \"\"\nlet codigo = \"0\"\nlet lista = []\nlet pontos = 0"
  },
  "introducao": [
    {
      "texto": "Em vez de adivinhar, dá para perguntar ao Console: dois pontos de exclamação transformam qualquer valor em true ou false, do jeito que o if o enxerga.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "dupla-falso",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte !!nome para ver se o texto vazio vira false.",
        "toque": "Pergunte !!nome para ver se o texto vazio vira false."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O primeiro ! vira o valor em booleano e inverte; o segundo ! inverte de volta. O que sobra?",
        "dica": "!!nome: o primeiro ! dá true (vazio é falso, invertido), o segundo volta para false.",
        "linha": {
          "alvo": "console",
          "fala": "!!nome: o primeiro ! dá true (vazio é falso, invertido), o segundo volta para false."
        },
        "solucao": {
          "fala": "false: o texto vazio é falso. O !! mostra como o if enxerga o valor.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "!!nome"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false! O !! revela se um valor conta como falso.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "!!nome"
        }
      ]
    },
    {
      "id": "dupla-verdadeiro",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte !!codigo, que guarda o texto \"0\".",
        "toque": "Pergunte !!codigo, que guarda o texto \"0\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O texto \"0\" tem caractere?",
        "dica": "!!codigo responde true: texto com qualquer caractere é verdadeiro.",
        "linha": {
          "alvo": "console",
          "fala": "!!codigo responde true: texto com qualquer caractere é verdadeiro."
        },
        "solucao": {
          "fala": "true: o texto \"0\" é verdadeiro.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "!!codigo"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true! O texto \"0\" engana, mas o !! mostra a verdade.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "!!codigo"
        }
      ]
    },
    {
      "id": "dupla-lista",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Pergunte !!lista, que guarda uma lista vazia.",
        "toque": "Pergunte !!lista, que guarda uma lista vazia."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A lista vazia é verdadeira ou falsa?",
        "dica": "Verdadeira, mesmo vazia.",
        "linha": {
          "alvo": "console",
          "fala": "Verdadeira, mesmo vazia."
        },
        "solucao": {
          "fala": "true: a lista vazia é verdadeira.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "!!lista"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "true: lista vazia continua verdadeira.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "!!lista"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde para !!lista, com lista = []?",
        "opcoes": [
          "false",
          "true",
          "[]"
        ],
        "correta": 1,
        "explicacao": "A lista vazia conta como verdadeira, então !!lista é true."
      }
    },
    {
      "id": "guardar-booleano",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde em temPontos o booleano de pontos (que vale 0), usando !!.",
        "toque": "Guarde em temPontos o booleano de pontos (que vale 0), usando !!."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "temPontos",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "let"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como transformar pontos em true ou false de uma vez?",
        "dica": "let temPontos = !!pontos: o 0 é falso, então a caixinha guarda false."
      },
      "falaAoConcluir": {
        "texto": "temPontos vale false: o 0 é falso.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let temPontos = !!pontos"
        }
      ]
    },
    {
      "id": "tipo-do-dupla",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte typeof !!pontos para confirmar que o resultado é booleano.",
        "toque": "Pergunte typeof !!pontos para confirmar que o resultado é booleano."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "boolean"
      },
      "ajudas": {
        "pergunta": "Qual tipo o !! devolve, sempre?",
        "dica": "O !! sempre devolve um booleano: true ou false."
      },
      "falaAoConcluir": {
        "texto": "boolean: o !! converte qualquer valor em true ou false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof !!pontos"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado. Cada resposta veio da regra, não de sorte.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e rode !!'' , !!'0' e !![] e anote as três respostas. Dica: nenhuma delas é um texto, é sempre true ou false.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

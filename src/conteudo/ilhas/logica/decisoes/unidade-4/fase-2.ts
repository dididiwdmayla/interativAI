/*
 * Decisões U4, Fase 2: Todo o resto é verdadeiro.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U4_F2: FasePratica = {
  "id": "logica-decisoes-u4-f2",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u4",
  "titulo": "Todo o resto é verdadeiro",
  "conceitos": [
    "truthy-js"
  ],
  "revisa": [
    "falsy-js",
    "if-js",
    "else-js"
  ],
  "prerequisitos": [
    "falsy-js",
    "if-js",
    "else-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let quantidade = \"0\"\nlet carrinho = []\nlet aviso = \"false\""
  },
  "introducao": [
    {
      "texto": "O que não é falso é verdadeiro, mesmo quando parece o contrário: o texto \"0\", o texto \"false\" e a lista vazia contam como verdadeiros.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "zero-texto",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode o if com quantidade, que guarda o texto \"0\".",
        "toque": "Rode o if com quantidade, que guarda o texto \"0\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Entrou"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O texto '0' é a mesma coisa que o número 0 no if?",
        "dica": "Não: texto com qualquer caractere é verdadeiro. Só o texto vazio é falso.",
        "linha": {
          "alvo": "console",
          "fala": "Não: texto com qualquer caractere é verdadeiro. Só o texto vazio é falso."
        },
        "solucao": {
          "fala": "Entrou: o texto '0' é verdadeiro, mesmo parecendo zero.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (quantidade) {\n  console.log(\"Entrou\")\n} else {\n  console.log(\"Não entrou\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Entrou! Aspas viram texto, e texto com caractere é verdadeiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "if (quantidade) {\n  console.log(\"Entrou\")\n} else {\n  console.log(\"Não entrou\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "quantidade é o texto '0'. O que mostra if (quantidade) { 'Entrou' } else { 'Não entrou' }?",
        "opcoes": [
          "Não entrou",
          "Entrou",
          "Dá erro"
        ],
        "correta": 1,
        "explicacao": "Só o NÚMERO 0 é falso. O texto '0' tem um caractere e conta como verdadeiro."
      }
    },
    {
      "id": "lista-vazia",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode o if com carrinho, que guarda uma lista vazia.",
        "toque": "Rode o if com carrinho, que guarda uma lista vazia."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Tem carrinho"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Uma lista vazia conta como falsa?",
        "dica": "A lista [] é um objeto e conta como verdadeira, mesmo vazia.",
        "linha": {
          "alvo": "console",
          "fala": "A lista [] é um objeto e conta como verdadeira, mesmo vazia."
        },
        "solucao": {
          "fala": "Tem carrinho: a lista vazia ainda é verdadeira.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (carrinho) {\n  console.log(\"Tem carrinho\")\n} else {\n  console.log(\"Sem carrinho\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Tem carrinho! Mesmo vazia, a lista conta como verdadeira.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (carrinho) {\n  console.log(\"Tem carrinho\")\n} else {\n  console.log(\"Sem carrinho\")\n}"
        }
      ]
    },
    {
      "id": "texto-false",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Rode um if com aviso, que guarda o texto \"false\": mostre \"Verdadeiro\" ou \"Falso\".",
        "toque": "Rode um if com aviso, que guarda o texto \"false\": mostre \"Verdadeiro\" ou \"Falso\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Verdadeiro"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "else"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O texto \"false\" é igual ao booleano false?",
        "dica": "Não: é um texto com letras. Texto com caractere é verdadeiro."
      },
      "falaAoConcluir": {
        "texto": "Verdadeiro! Quem escreve \"false\" entre aspas cria um texto, não um booleano.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (aviso) {\n  console.log(\"Verdadeiro\")\n} else {\n  console.log(\"Falso\")\n}"
        }
      ]
    },
    {
      "id": "lista-length",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Mostre \"Carrinho vazio\" ou \"Tem itens\" olhando carrinho.length, não só o carrinho.",
        "toque": "Mostre \"Carrinho vazio\" ou \"Tem itens\" olhando carrinho.length, não só o carrinho."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Carrinho vazio"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "else"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual propriedade diz quantos itens a lista tem?",
        "dica": "if (carrinho.length > 0) { ... } else { ... }: 0 itens dá false."
      },
      "falaAoConcluir": {
        "texto": "Carrinho vazio! Para saber se a lista tem itens, olhe o length.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (carrinho.length > 0) {\n  console.log(\"Tem itens\")\n} else {\n  console.log(\"Carrinho vazio\")\n}"
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
  "missaoDeCampo": "Abra o Console de qualquer site e rode: if ('0') console.log('texto 0 é verdadeiro') e if ([]) console.log('lista vazia é verdadeira'). Conte quantas linhas apareceram.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

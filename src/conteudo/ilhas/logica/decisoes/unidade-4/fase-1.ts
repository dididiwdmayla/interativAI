/*
 * Decisões U4, Fase 1: Quem conta como falso.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U4_F1: FasePratica = {
  "id": "logica-decisoes-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u4",
  "titulo": "Quem conta como falso",
  "conceitos": [
    "falsy-js"
  ],
  "revisa": [
    "if-js",
    "else-js",
    "tipo-js"
  ],
  "prerequisitos": [
    "if-js",
    "else-js",
    "tipo-js",
    "booleano-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let nome = \"\"\nlet estoque = 0\nlet cupom = null\nlet endereco = undefined\nlet conta = Number(\"abc\")"
  },
  "introducao": [
    {
      "texto": "O if aceita qualquer valor, não só true e false. Alguns valores contam como falsos mesmo sem serem false: texto vazio, 0, null, undefined e NaN.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "vazio-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Com nome vazio, mostre \"Olá\" se nome tiver algo e \"Preencha o nome\" se não.",
        "toque": "Com nome vazio, mostre \"Olá\" se nome tiver algo e \"Preencha o nome\" se não."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Preencha o nome"
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
        "pergunta": "Um texto vazio conta como verdadeiro ou falso dentro do if?",
        "dica": "Texto vazio é um dos valores falsos: if (nome) { ... } vai para o else.",
        "linha": {
          "alvo": "console",
          "fala": "Texto vazio é um dos valores falsos: if (nome) { ... } vai para o else."
        },
        "solucao": {
          "fala": "O texto vazio conta como falso: o if foi pulado e o else rodou.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (nome) {\n  console.log(\"Olá\")\n} else {\n  console.log(\"Preencha o nome\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Preencha o nome! O texto vazio é falso, sem ser false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (nome) {\n  console.log(\"Olá\")\n} else {\n  console.log(\"Preencha o nome\")\n}"
        }
      ]
    },
    {
      "id": "zero-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode o if com estoque e veja a mensagem.",
        "toque": "Rode o if com estoque e veja a mensagem."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Acabou"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O número 0 conta como verdadeiro ou falso?",
        "dica": "0 é falso. Qualquer outro número, como 3 ou -1, conta como verdadeiro.",
        "linha": {
          "alvo": "console",
          "fala": "0 é falso. Qualquer outro número, como 3 ou -1, conta como verdadeiro."
        },
        "solucao": {
          "fala": "Acabou: o 0 é falso, e o estoque zero 'some' do if.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (estoque) {\n  console.log(\"Tem\")\n} else {\n  console.log(\"Acabou\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Acabou! O estoque zero some do if: cuidado se o 0 for um valor válido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "if (estoque) {\n  console.log(\"Tem\")\n} else {\n  console.log(\"Acabou\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com estoque = 0, o que mostra if (estoque) { 'Tem' } else { 'Acabou' }?",
        "opcoes": [
          "Tem",
          "Acabou",
          "Dá erro"
        ],
        "correta": 1,
        "explicacao": "O número 0 conta como falso: o if é pulado e o else mostra Acabou."
      }
    },
    {
      "id": "null-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com cupom null, mostre \"Tem cupom\" ou \"Sem cupom\" usando if (cupom).",
        "toque": "Com cupom null, mostre \"Tem cupom\" ou \"Sem cupom\" usando if (cupom)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Sem cupom"
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
        "pergunta": "O null conta como verdadeiro ou falso?",
        "dica": "null é falso: if (cupom) { ... } else { ... } cai no else."
      },
      "falaAoConcluir": {
        "texto": "Sem cupom! O null é falso.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (cupom) {\n  console.log(\"Tem cupom\")\n} else {\n  console.log(\"Sem cupom\")\n}"
        }
      ]
    },
    {
      "id": "undefined-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com endereco undefined, mostre \"Com endereço\" ou \"Sem endereço\" usando if (endereco).",
        "toque": "Com endereco undefined, mostre \"Com endereço\" ou \"Sem endereço\" usando if (endereco)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Sem endereço"
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
        "pergunta": "E o undefined, que é a caixinha sem valor?",
        "dica": "undefined também é falso: if (endereco) { ... } else { ... } cai no else."
      },
      "falaAoConcluir": {
        "texto": "Sem endereço! O undefined é falso.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (endereco) {\n  console.log(\"Com endereço\")\n} else {\n  console.log(\"Sem endereço\")\n}"
        }
      ]
    },
    {
      "id": "nan-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode o if com conta, que guarda NaN (Number(\"abc\")), e veja a mensagem.",
        "toque": "Rode o if com conta, que guarda NaN (Number(\"abc\")), e veja a mensagem."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Sem valor"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "NaN é um número de verdade?",
        "dica": "NaN (not a number) é o sexto valor falso. Os seis: false, 0, '', null, undefined e NaN.",
        "linha": {
          "alvo": "console",
          "fala": "NaN (not a number) é o sexto valor falso. Os seis: false, 0, '', null, undefined e NaN."
        },
        "solucao": {
          "fala": "Sem valor: o NaN é falso.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (conta) {\n  console.log(\"Valor\")\n} else {\n  console.log(\"Sem valor\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Sem valor! Os falsos: false, 0, texto vazio, null, undefined e NaN.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "if (conta) {\n  console.log(\"Valor\")\n} else {\n  console.log(\"Sem valor\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "conta vale NaN. O que mostra if (conta) { 'Valor' } else { 'Sem valor' }?",
        "opcoes": [
          "Sem valor",
          "Valor",
          "Dá erro"
        ],
        "correta": 0,
        "explicacao": "NaN significa 'não é um número' e conta como falso."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Você previu, executou e conferiu o resultado. Cada resposta veio da regra, não de sorte.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e rode: if (document.title) { console.log('Tem título') } else { console.log('Sem título') }. Depois rode Number('abc') e veja o NaN.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

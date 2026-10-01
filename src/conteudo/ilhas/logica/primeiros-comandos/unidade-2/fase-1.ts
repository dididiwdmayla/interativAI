/*
 * Lógica U2, Fase 1. Aspas esquecidas causam um erro real; guiado/sozinho cobrem texto e crases.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U2_F1: FasePratica = {
  "id": "logica-primeiros-comandos-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u2",
  "titulo": "Texto precisa de aspas",
  "conceitos": [
    "string-js",
    "aspas-js"
  ],
  "revisa": [
    "variavel-let",
    "ler-mensagem-de-erro"
  ],
  "prerequisitos": [
    "console-js",
    "variavel-let",
    "ler-mensagem-de-erro"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {},
  "introducao": [
    {
      "texto": "Na Pizzaria Fatia Feliz, vamos guardar os nomes dos clientes. Texto precisa de limites: aspas simples, duplas ou crases.",
      "expressao": "curioso"
    },
    {
      "texto": "Sem aspas, o JavaScript procura uma variável com aquele nome. Se ela não existe, dá ReferenceError.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "nome-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde o nome: let cliente = \"Lia\". Veja o texto no palco.",
        "toque": "Guarde o nome: let cliente = \"Lia\". Veja o texto no palco."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "cliente",
        "valor": "Lia"
      },
      "ajudas": {
        "pergunta": "Como indicar que Lia é o texto, e não uma variável?",
        "dica": "Use aspas ao redor do valor: let cliente = \"Lia\".",
        "linha": {
          "alvo": "console",
          "fala": "Use aspas ao redor do valor: let cliente = \"Lia\"."
        },
        "solucao": {
          "fala": "O palco mostra cliente como texto. As aspas delimitam o valor; não fazem parte dele.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let cliente = \"Lia\""
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O palco mostra cliente como texto. As aspas delimitam o valor; não fazem parte dele.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let cliente = \"Lia\""
        }
      ]
    },
    {
      "id": "aspas-esquecidas",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Preveja e confira: rode Visitante, sem aspas.",
        "toque": "Preveja e confira: rode Visitante, sem aspas."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "ReferenceError"
      },
      "ajudas": {
        "pergunta": "Existe alguma variável chamada Visitante?",
        "dica": "Sem aspas, a palavra vira um nome que o computador tenta procurar.",
        "linha": {
          "alvo": "console",
          "fala": "Sem aspas, a palavra vira um nome que o computador tenta procurar."
        },
        "solucao": {
          "fala": "ReferenceError: Visitante is not defined. Faltou declarar esse nome ou colocar aspas no texto.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "Visitante"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "ReferenceError: Visitante is not defined. Faltou declarar esse nome ou colocar aspas no texto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "Visitante"
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde se você escreve Visitante sem ter criado esse nome?",
        "opcoes": [
          "Mostra o texto Visitante",
          "ReferenceError",
          "undefined"
        ],
        "correta": 1,
        "explicacao": "Sem aspas, Visitante é nome de variável. Como ela não existe, a leitura dá ReferenceError."
      }
    },
    {
      "id": "corrigir-aspas",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Corrija: guarde o texto Visitante em let apelido, usando aspas simples.",
        "toque": "Corrija: guarde o texto Visitante em let apelido, usando aspas simples."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "apelido",
        "valor": "Visitante"
      },
      "ajudas": {
        "pergunta": "O texto deve ser procurado na memória ou guardado como está?",
        "dica": "Um par de aspas simples delimita texto, como um par de aspas duplas."
      },
      "falaAoConcluir": {
        "texto": "Agora roda: aspas simples e duplas guardam texto do mesmo jeito.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let apelido = 'Visitante'"
        }
      ]
    },
    {
      "id": "crase-simples",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde a palavra entrega em let modalidade, usando crases.",
        "toque": "Guarde a palavra entrega em let modalidade, usando crases."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "modalidade",
            "valor": "entrega"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "template"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que terceiro delimitador também escreve texto?",
        "dica": "Use crases: let modalidade = `entrega`.",
        "linha": {
          "alvo": "console",
          "fala": "Use crases: let modalidade = `entrega`."
        },
        "solucao": {
          "fala": "Crases também delimitam texto e depois vão permitir encaixar variáveis.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let modalidade = `entrega`"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Crases também delimitam texto e depois vão permitir encaixar variáveis.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let modalidade = `entrega`"
        }
      ]
    },
    {
      "id": "crase-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde retirada em let outraModalidade, usando crases.",
        "toque": "Guarde retirada em let outraModalidade, usando crases."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "outraModalidade",
            "valor": "retirada"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "template"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual delimitador você acabou de experimentar?",
        "dica": "Crases vêm em par; o texto fica entre elas."
      },
      "falaAoConcluir": {
        "texto": "Dois textos diferentes, com o mesmo tipo no palco.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let outraModalidade = `retirada`"
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

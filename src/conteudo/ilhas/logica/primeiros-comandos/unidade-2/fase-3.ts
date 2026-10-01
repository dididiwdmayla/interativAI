/*
 * Lógica U2, Fase 3. Template é exigido porque aqui a forma é a habilidade; compara crases contra aspas duplas.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U2_F3: FasePratica = {
  "id": "logica-primeiros-comandos-u2-f3",
  "tipo": "pratica",
  "unidadeId": "logica-primeiros-comandos-u2",
  "titulo": "Uma frase com valores dentro",
  "conceitos": [
    "template-literal"
  ],
  "revisa": [
    "concatenacao-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "console-js",
    "concatenacao-js",
    "variavel-let"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let cliente = \"Lia\"\nlet quantidade = 2\nlet minutos = 30"
  },
  "introducao": [
    {
      "texto": "O pedido muda a cada cliente. Entre crases, ${nome} encaixa o valor da caixinha no meio da frase.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "template-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie mensagem: `Olá, ${cliente}! Seu pedido tem ${quantidade} pizzas.`",
        "toque": "Crie mensagem: `Olá, ${cliente}! Seu pedido tem ${quantidade} pizzas.`"
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "mensagem",
            "valor": "Olá, Lia! Seu pedido tem 2 pizzas."
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "template"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como colocar o valor de cliente dentro da frase?",
        "dica": "Use crases e ${cliente}; escreva ${quantidade} onde entra a quantidade.",
        "linha": {
          "alvo": "console",
          "fala": "Use crases e ${cliente}; escreva ${quantidade} onde entra a quantidade."
        },
        "solucao": {
          "fala": "As caixinhas continuam separadas; mensagem guarda a frase que foi montada naquele momento.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let mensagem = `Olá, ${cliente}! Seu pedido tem ${quantidade} pizzas.`"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "As caixinhas continuam separadas; mensagem guarda a frase que foi montada naquele momento.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let mensagem = `Olá, ${cliente}! Seu pedido tem ${quantidade} pizzas.`"
        }
      ]
    },
    {
      "id": "aspas-nao-interpolam",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Confira: \"Olá, ${cliente}\" com aspas duplas.",
        "toque": "Confira: \"Olá, ${cliente}\" com aspas duplas."
      },
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "Olá, ${cliente}"
      },
      "ajudas": {
        "pergunta": "Aspas duplas reconhecem o encaixe ${...}?",
        "dica": "Só as crases fazem esse encaixe; nas aspas duplas, os símbolos viram parte do texto.",
        "linha": {
          "alvo": "console",
          "fala": "Só as crases fazem esse encaixe; nas aspas duplas, os símbolos viram parte do texto."
        },
        "solucao": {
          "fala": "As aspas duplas mostraram ${cliente} literalmente: para encaixar o valor, use crases.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "\"Olá, ${cliente}\""
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "As aspas duplas mostraram ${cliente} literalmente: para encaixar o valor, use crases.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "\"Olá, ${cliente}\""
        }
      ],
      "previsao": {
        "pergunta": "O que o Console responde se você roda \"Olá, ${cliente}\" com cliente valendo \"Lia\"?",
        "opcoes": [
          "'Olá, Lia'",
          "ReferenceError",
          "'Olá, ${cliente}'"
        ],
        "correta": 2,
        "explicacao": "Aspas duplas não encaixam variáveis; só as crases interpretam ${cliente}."
      }
    },
    {
      "id": "template-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie aviso com template: \"Lia, retirada em 30 minutos.\" Use cliente e minutos.",
        "toque": "Crie aviso com template: \"Lia, retirada em 30 minutos.\" Use cliente e minutos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "aviso",
            "valor": "Lia, retirada em 30 minutos."
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "template"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quais partes são texto fixo e quais vêm da memória?",
        "dica": "Use crases para a frase e ${...} nos dois lugares que recebem valores."
      },
      "falaAoConcluir": {
        "texto": "Você montou outra frase com valores, sem colar pedaços com +.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let aviso = `${cliente}, retirada em ${minutos} minutos.`"
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

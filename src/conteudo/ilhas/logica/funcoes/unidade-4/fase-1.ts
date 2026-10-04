/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U4_F1: FasePratica = {
  "id": "logica-funcoes-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u4",
  "titulo": "Outra escrita, ainda função",
  "conceitos": [
    "arrow-js",
    "retorno-implicito"
  ],
  "revisa": [
    "parametro-argumento",
    "return-js",
    "variavel-const"
  ],
  "prerequisitos": [
    "parametro-argumento",
    "return-js",
    "variavel-const"
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
      "nome": "Outra escrita, ainda função",
      "codigoInicial": "function dobro(n) {\n  return n * 2\n}"
    }
  },
  "introducao": [
    {
      "texto": "const dobro = (n) => n * 2 cria uma função com seta, ou arrow. n continua sendo parâmetro e dobro(3) continua sendo uma chamada.",
      "expressao": "apontando"
    },
    {
      "texto": "Sem chaves, a expressão depois de => é devolvida automaticamente: retorno implícito. No palco a arrow também ganha uma moldura.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Reescreva dobro(n) como const dobro = (n) => n * 2. Guarde total = dobro(3).",
        "toque": "Reescreva dobro(n) como const dobro = (n) => n * 2. Guarde total = dobro(3)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "dobro",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      3
                    ],
                    "esperado": 6
                  },
                  {
                    "args": [
                      -2
                    ],
                    "esperado": -4
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 6
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "arrow"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que mudou: o trabalho ou a escrita?",
        "dica": "Sem chaves, a expressão depois da seta já é o retorno.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Sem chaves, a expressão depois da seta já é o retorno."
        },
        "solucao": {
          "fala": "A função continua dobrando; só a escrita ficou curta.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const dobro = (n) => n * 2\nlet total = dobro(3)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A função continua dobrando; só a escrita ficou curta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const dobro = (n) => n * 2\nlet total = dobro(3)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f1-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Chame dobro(0) e guarde total.",
        "toque": "Chame dobro(0) e guarde total."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "total",
            "valor": 0
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Existe um caso especial para zero?",
        "dica": "A expressão n * 2 também funciona para zero.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A expressão n * 2 também funciona para zero."
        },
        "solucao": {
          "fala": "Zero vezes dois é zero; a arrow devolveu automaticamente.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let total = dobro(0)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Zero vezes dois é zero; a arrow devolveu automaticamente.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let total = dobro(0)"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "const dobro = (n) => n * 2; dobro(0) devolve o quê?",
        "opcoes": [
          "undefined",
          "2",
          "0"
        ],
        "correta": 2,
        "explicacao": "A expressão é devolvida sem escrever return."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Na padaria, crie const triplo = (gramas) => gramas * 3 e guarde total = triplo(20).",
        "toque": "Na padaria, crie const triplo = (gramas) => gramas * 3 e guarde total = triplo(20)."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "triplo",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      20
                    ],
                    "esperado": 60
                  },
                  {
                    "args": [
                      0.5
                    ],
                    "esperado": 1.5
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 60
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "arrow"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Seta muda os argumentos entregues?",
        "dica": "O parâmetro recebe o valor; a expressão devolve o triplo."
      },
      "falaAoConcluir": {
        "texto": "A mesma mecânica de chamada e retorno vale para as duas escritas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const triplo = (gramas) => gramas * 3\nlet total = triplo(20)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Volte pela linha do tempo: veja a entrada na moldura, as instruções do corpo e a volta para quem chamou.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie function dobro(n) { return n * 2 } e chame dobro(0), dobro(3) e dobro(7).",
  "falaFinal": {
    "texto": "Criar e chamar funções no Console real funciona como aqui; o palco é a ajuda visual do jogo.",
    "expressao": "feliz"
  }
};

/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U3_F2: FasePratica = {
  "id": "logica-funcoes-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u3",
  "titulo": "Um bloco dentro da moldura",
  "conceitos": [
    "escopo-bloco-js"
  ],
  "revisa": [
    "if-js",
    "escopo-funcao-js",
    "return-js"
  ],
  "prerequisitos": [
    "if-js",
    "escopo-funcao-js",
    "return-js"
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
      "nome": "Um bloco dentro da moldura",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "let dentro de um if pertence só ao bloco entre chaves. Mesmo dentro da função, esse nome não existe depois do bloco.",
      "expressao": "apontando"
    },
    {
      "texto": "Rebobine e veja a caixa tracejada dentro da moldura. Ela desaparece ao sair do if; a caixinha criada antes do if continua na função.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie desconto(preco): let final = preco antes do if; se preco >= 50, let abatimento = 5 e final -= abatimento. Devolva final.",
        "toque": "Crie desconto(preco): let final = preco antes do if; se preco >= 50, let abatimento = 5 e final -= abatimento. Devolva final."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "desconto",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 0
                  },
                  {
                    "args": [
                      49
                    ],
                    "esperado": 49
                  },
                  {
                    "args": [
                      50
                    ],
                    "esperado": 45
                  },
                  {
                    "args": [
                      60
                    ],
                    "esperado": 55
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 55
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "if"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual caixinha precisa continuar depois do if?",
        "dica": "Crie final antes do bloco e altere-a dentro.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Crie final antes do bloco e altere-a dentro."
        },
        "solucao": {
          "fala": "abatimento ficou no bloco; final permaneceu na função e foi devolvido.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function desconto(preco) {\n  let final = preco\n  if (preco >= 50) {\n    let abatimento = 5\n    final -= abatimento\n  }\n  return final\n}\nlet total = desconto(60)"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "abatimento ficou no bloco; final permaneceu na função e foi devolvido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function desconto(preco) {\n  let final = preco\n  if (preco >= 50) {\n    let abatimento = 5\n    final -= abatimento\n  }\n  return final\n}\nlet total = desconto(60)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f2-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie testar() com let aviso = \"OK\" dentro de if(true), e tente return aviso depois do bloco. Chame testar().",
        "toque": "Crie testar() com let aviso = \"OK\" dentro de if(true), e tente return aviso depois do bloco. Chame testar()."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "ReferenceError"
      },
      "ajudas": {
        "pergunta": "O nome aviso pertence ao if ou à função inteira?",
        "dica": "As chaves do if encerram o alcance do let aviso.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "As chaves do if encerram o alcance do let aviso."
        },
        "solucao": {
          "fala": "ReferenceError mesmo dentro da função: aviso só existia no bloco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function testar() {\n  if (true) {\n    let aviso = \"OK\"\n  }\n  return aviso\n}\ntestar()"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "ReferenceError mesmo dentro da função: aviso só existia no bloco.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function testar() {\n  if (true) {\n    let aviso = \"OK\"\n  }\n  return aviso\n}\ntestar()"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "let aviso nasce dentro do if. Ler aviso depois das chaves dá o quê?",
        "opcoes": [
          "ReferenceError",
          "\"OK\"",
          "undefined"
        ],
        "correta": 0,
        "explicacao": "let é de bloco; depois dele o nome aviso não existe."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "No museu, crie ingresso(idade): preco = 20 antes do if; para idade < 12 use desconto = 8 dentro e subtraia. Devolva preco.",
        "toque": "No museu, crie ingresso(idade): preco = 20 antes do if; para idade < 12 use desconto = 8 dentro e subtraia. Devolva preco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "todos",
            "validadores": [
              {
                "tipo": "funcaoPassa",
                "nome": "ingresso",
                "casos": [
                  {
                    "args": [
                      0
                    ],
                    "esperado": 12
                  },
                  {
                    "args": [
                      11
                    ],
                    "esperado": 12
                  },
                  {
                    "args": [
                      12
                    ],
                    "esperado": 20
                  },
                  {
                    "args": [
                      30
                    ],
                    "esperado": 20
                  }
                ]
              },
              {
                "tipo": "valorVariavel",
                "nome": "total",
                "valor": 12
              },
              {
                "tipo": "usouSintaxe",
                "sintaxe": "if"
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual valor deve sair do bloco e qual pode sumir?",
        "dica": "preco pertence à função; desconto só ao if."
      },
      "falaAoConcluir": {
        "texto": "Na fronteira 12 o ingresso custa 20; a variável do bloco não escapou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function ingresso(idade) {\n  let preco = 20\n  if (idade < 12) {\n    let desconto = 8\n    preco -= desconto\n  }\n  return preco\n}\nlet total = ingresso(11)"
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

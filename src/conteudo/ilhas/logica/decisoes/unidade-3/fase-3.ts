/*
 * Decisões U3, Fase 3: Else if: a ordem importa.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U3_F3: FasePratica = {
  "id": "logica-decisoes-u3-f3",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u3",
  "titulo": "Else if: a ordem importa",
  "conceitos": [
    "else-if-js"
  ],
  "revisa": [
    "else-js",
    "comparacao-js",
    "limite-da-comparacao"
  ],
  "prerequisitos": [
    "if-js",
    "else-js",
    "limite-da-comparacao"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let nota = 9\nlet valorCompra = 150"
  },
  "introducao": [
    {
      "texto": "Com mais de duas opções, o else if encadeia perguntas. O programa para na primeira verdadeira: a ordem delas decide o resultado.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "faixas-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Com nota 9, mostre \"Excelente\" (9 ou mais), \"Bom\" (7 ou mais) ou \"Recuperação\".",
        "toque": "Com nota 9, mostre \"Excelente\" (9 ou mais), \"Bom\" (7 ou mais) ou \"Recuperação\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Excelente"
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
        "pergunta": "Como perguntar a segunda faixa depois da primeira?",
        "dica": "if (...) { } else if (...) { } else { }: cada else if é a próxima pergunta, e só roda se as anteriores deram false.",
        "linha": {
          "alvo": "console",
          "fala": "if (...) { } else if (...) { } else { }: cada else if é a próxima pergunta, e só roda se as anteriores deram false."
        },
        "solucao": {
          "fala": "A primeira condição já era true: só Excelente apareceu.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (nota >= 9) {\n  console.log(\"Excelente\")\n} else if (nota >= 7) {\n  console.log(\"Bom\")\n} else {\n  console.log(\"Recuperação\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Excelente! O resto da cadeia nem foi testado.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (nota >= 9) {\n  console.log(\"Excelente\")\n} else if (nota >= 7) {\n  console.log(\"Bom\")\n} else {\n  console.log(\"Recuperação\")\n}"
        }
      ]
    },
    {
      "id": "nota-sete",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque nota para 7 e rode a mesma cadeia.",
        "toque": "Troque nota para 7 e rode a mesma cadeia."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "nota",
            "valor": 7
          },
          {
            "tipo": "saida",
            "igual": [
              "Bom"
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quais perguntas dão false e qual dá true com nota 7?",
        "dica": "nota >= 9 é false; nota >= 7 é true. O programa para aí.",
        "linha": {
          "alvo": "console",
          "fala": "nota >= 9 é false; nota >= 7 é true. O programa para aí."
        },
        "solucao": {
          "fala": "Bom: a primeira pergunta deu false, a segunda deu true.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "nota = 7\nif (nota >= 9) {\n  console.log(\"Excelente\")\n} else if (nota >= 7) {\n  console.log(\"Bom\")\n} else {\n  console.log(\"Recuperação\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Bom! Passou pela primeira pergunta e parou na segunda.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "nota = 7\nif (nota >= 9) {\n  console.log(\"Excelente\")\n} else if (nota >= 7) {\n  console.log(\"Bom\")\n} else {\n  console.log(\"Recuperação\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com nota = 7, qual mensagem a cadeia mostra?",
        "opcoes": [
          "Excelente",
          "Recuperação",
          "Bom"
        ],
        "correta": 2,
        "explicacao": "7 não é maior ou igual a 9, mas é maior ou igual a 7: cai no else if e mostra Bom."
      }
    },
    {
      "id": "ordem-trocada",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode a cadeia com as perguntas na ordem errada, com nota = 9, e veja o que aparece.",
        "toque": "Rode a cadeia com as perguntas na ordem errada, com nota = 9, e veja o que aparece."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "nota",
            "valor": 9
          },
          {
            "tipo": "saida",
            "igual": [
              "Regular"
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "O else if testa todas as perguntas ou para na primeira true?",
        "dica": "Para na primeira true. Por isso a pergunta mais difícil vem antes.",
        "linha": {
          "alvo": "console",
          "fala": "Para na primeira true. Por isso a pergunta mais difícil vem antes."
        },
        "solucao": {
          "fala": "Regular: a pergunta fácil veio primeiro e o 9 nunca chegou na outra.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "nota = 9\nif (nota >= 5) {\n  console.log(\"Regular\")\n} else if (nota >= 9) {\n  console.log(\"Excelente\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Regular! Esse é o bug da ordem: pergunte da mais difícil para a mais fácil.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "nota = 9\nif (nota >= 5) {\n  console.log(\"Regular\")\n} else if (nota >= 9) {\n  console.log(\"Excelente\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com nota = 9, a pergunta nota >= 5 vem primeiro. Qual mensagem aparece?",
        "opcoes": [
          "As duas",
          "Excelente",
          "Regular"
        ],
        "correta": 2,
        "explicacao": "O else if para na primeira condição true. 9 >= 5 já é true, então só Regular aparece."
      }
    },
    {
      "id": "ordem-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Conserte a ordem: com nota 9, escreva as faixas (9, 7, 5) para mostrar \"Excelente\".",
        "toque": "Conserte a ordem: com nota 9, escreva as faixas (9, 7, 5) para mostrar \"Excelente\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Excelente"
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
        "pergunta": "Qual pergunta tem que vir primeiro: a mais fácil ou a mais difícil?",
        "dica": "A mais difícil primeiro: nota >= 9, depois nota >= 7, depois nota >= 5, e um else no fim."
      },
      "falaAoConcluir": {
        "texto": "Excelente! Perguntas da mais difícil para a mais fácil.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (nota >= 9) {\n  console.log(\"Excelente\")\n} else if (nota >= 7) {\n  console.log(\"Bom\")\n} else if (nota >= 5) {\n  console.log(\"Regular\")\n} else {\n  console.log(\"Recuperação\")\n}"
        }
      ]
    },
    {
      "id": "frete-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com valorCompra 150: \"Frete grátis\" a partir de 200, \"Frete 10\" a partir de 100, senão \"Frete 20\".",
        "toque": "Com valorCompra 150: \"Frete grátis\" a partir de 200, \"Frete 10\" a partir de 100, senão \"Frete 20\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Frete 10"
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
        "pergunta": "Qual faixa vem primeiro, a de 200 ou a de 100?",
        "dica": "A de 200 primeiro. Com 150, a primeira dá false e a segunda dá true."
      },
      "falaAoConcluir": {
        "texto": "Frete 10! Mesma lógica, outro assunto.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (valorCompra >= 200) {\n  console.log(\"Frete grátis\")\n} else if (valorCompra >= 100) {\n  console.log(\"Frete 10\")\n} else {\n  console.log(\"Frete 20\")\n}"
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
  "missaoDeCampo": "Abra o Console de qualquer site, guarde let largura = window.innerWidth e faça if / else if / else: menos de 600 mostra 'celular', menos de 1000 'tablet' e o resto 'computador'.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

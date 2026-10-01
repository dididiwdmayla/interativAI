/*
 * Decisões U3, Fase 4: Mais de uma condição.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U3_F4: FasePratica = {
  "id": "logica-decisoes-u3-f4",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u3",
  "titulo": "Mais de uma condição",
  "conceitos": [
    "condicao-composta"
  ],
  "revisa": [
    "portao-e",
    "portao-ou",
    "operadores-logicos",
    "ordem-e-ou"
  ],
  "prerequisitos": [
    "if-js",
    "else-js",
    "operadores-logicos",
    "ordem-e-ou"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let temCarteirinha = true\nlet livroDisponivel = false\nlet idade = 15\nlet diasAtraso = 0\nlet livroDanificado = false"
  },
  "introducao": [
    {
      "texto": "Os portões do circuito agora moram dentro do if. Na biblioteca, uma decisão pode juntar várias condições com && (E) e || (OU).",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "e-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Empreste só se temCarteirinha E livroDisponivel: mostre \"Emprestado\" ou \"Indisponível\".",
        "toque": "Empreste só se temCarteirinha E livroDisponivel: mostre \"Emprestado\" ou \"Indisponível\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Indisponível"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual portão exige as duas condições ao mesmo tempo?",
        "dica": "O E: if (temCarteirinha && livroDisponivel) { ... } else { ... }. Com uma delas false, vai para o else.",
        "linha": {
          "alvo": "console",
          "fala": "O E: if (temCarteirinha && livroDisponivel) { ... } else { ... }. Com uma delas false, vai para o else."
        },
        "solucao": {
          "fala": "O livro não está disponível: o && deu false e rodou o else.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (temCarteirinha && livroDisponivel) {\n  console.log(\"Emprestado\")\n} else {\n  console.log(\"Indisponível\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Indisponível: com o &&, uma condição false já basta para recusar.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (temCarteirinha && livroDisponivel) {\n  console.log(\"Emprestado\")\n} else {\n  console.log(\"Indisponível\")\n}"
        }
      ]
    },
    {
      "id": "e-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque livroDisponivel para true e rode o mesmo if de novo.",
        "toque": "Troque livroDisponivel para true e rode o mesmo if de novo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "livroDisponivel",
            "valor": true
          },
          {
            "tipo": "saida",
            "igual": [
              "Emprestado"
            ]
          }
        ]
      },
      "ajudas": {
        "pergunta": "Agora as duas condições são true?",
        "dica": "true && true é true: o bloco do if roda.",
        "linha": {
          "alvo": "console",
          "fala": "true && true é true: o bloco do if roda."
        },
        "solucao": {
          "fala": "Emprestado: as duas condições valem.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "livroDisponivel = true\nif (temCarteirinha && livroDisponivel) {\n  console.log(\"Emprestado\")\n} else {\n  console.log(\"Indisponível\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Emprestado! Duas condições true formam um &&.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "livroDisponivel = true\nif (temCarteirinha && livroDisponivel) {\n  console.log(\"Emprestado\")\n} else {\n  console.log(\"Indisponível\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com temCarteirinha e livroDisponivel true, qual mensagem aparece?",
        "opcoes": [
          "Emprestado",
          "Indisponível",
          "Nada"
        ],
        "correta": 0,
        "explicacao": "As duas condições são true, então o && é true e roda o bloco do if."
      }
    },
    {
      "id": "ou-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Com idade 70, dê \"Desconto\" se idade < 12 OU idade >= 60; senão \"Preço normal\".",
        "toque": "Com idade 70, dê \"Desconto\" se idade < 12 OU idade >= 60; senão \"Preço normal\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Desconto"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual portão aceita uma condição OU a outra?",
        "dica": "O OU: if (idade < 12 || idade >= 60) { ... } else { ... }. Basta uma ser true.",
        "linha": {
          "alvo": "console",
          "fala": "O OU: if (idade < 12 || idade >= 60) { ... } else { ... }. Basta uma ser true."
        },
        "solucao": {
          "fala": "70 >= 60 é true, e uma condição true basta para o ||.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade = 70\nif (idade < 12 || idade >= 60) {\n  console.log(\"Desconto\")\n} else {\n  console.log(\"Preço normal\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Desconto! Com o ||, uma condição true já resolve.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idade = 70\nif (idade < 12 || idade >= 60) {\n  console.log(\"Desconto\")\n} else {\n  console.log(\"Preço normal\")\n}"
        }
      ]
    },
    {
      "id": "ou-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com diasAtraso = 3, mostre \"Cobrar taxa\" se diasAtraso > 0 OU livroDanificado.",
        "toque": "Com diasAtraso = 3, mostre \"Cobrar taxa\" se diasAtraso > 0 OU livroDanificado."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Cobrar taxa"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual condição vale pelo atraso e qual vale pelo dano?",
        "dica": "if (diasAtraso > 0 || livroDanificado) { ... }. O atraso sozinho já basta."
      },
      "falaAoConcluir": {
        "texto": "Cobrar taxa! O atraso bastou, mesmo com o livro inteiro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "diasAtraso = 3\nif (diasAtraso > 0 || livroDanificado) {\n  console.log(\"Cobrar taxa\")\n}"
        }
      ]
    },
    {
      "id": "ordem-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode o if com socio || convidado && pagou, sem parênteses, e veja a mensagem.",
        "toque": "Rode o if com socio || convidado && pagou, sem parênteses, e veja a mensagem."
      },
      "validador": {
        "tipo": "saida",
        "igual": [
          "Entra"
        ]
      },
      "ajudas": {
        "pergunta": "Qual operador o computador calcula primeiro, && ou ||?",
        "dica": "O && vem antes do ||, como a multiplicação vem antes da soma.",
        "linha": {
          "alvo": "console",
          "fala": "O && vem antes do ||, como a multiplicação vem antes da soma."
        },
        "solucao": {
          "fala": "Entra: convidado && pagou foi calculado primeiro e deu false; depois true || false deu true.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "let socio = true\nlet convidado = false\nlet pagou = false\nif (socio || convidado && pagou) {\n  console.log(\"Entra\")\n} else {\n  console.log(\"Não entra\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Entra! O && manda antes do ||. Quem quer outra ordem usa parênteses.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "let socio = true\nlet convidado = false\nlet pagou = false\nif (socio || convidado && pagou) {\n  console.log(\"Entra\")\n} else {\n  console.log(\"Não entra\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com socio true, convidado false e pagou false, o que aparece em if (socio || convidado && pagou)?",
        "opcoes": [
          "Entra",
          "Não entra"
        ],
        "correta": 0,
        "explicacao": "O && é calculado antes do ||: false && false é false, e true || false é true. Entra."
      }
    },
    {
      "id": "parenteses-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Agora só entra quem pagou: escreva (socio || convidado) && pagou, com parênteses, e mostre a mensagem.",
        "toque": "Agora só entra quem pagou: escreva (socio || convidado) && pagou, com parênteses, e mostre a mensagem."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Não entra"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que os parênteses mudam na ordem do cálculo?",
        "dica": "Entre parênteses vai primeiro: (true || false) é true, e true && false é false. Entra \"Não entra\"."
      },
      "falaAoConcluir": {
        "texto": "Não entra! Os parênteses mudaram quem vai primeiro, e o resultado.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if ((socio || convidado) && pagou) {\n  console.log(\"Entra\")\n} else {\n  console.log(\"Não entra\")\n}"
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
  "missaoDeCampo": "Abra o Console de qualquer site e rode: if (navigator.onLine && document.title.length > 0) { console.log('Pronto') } else { console.log('Algo falhou') }. Leia as duas condições.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

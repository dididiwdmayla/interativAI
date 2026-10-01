/*
 * Decisões U3, Fase 2: Senão, outro caminho.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U3_F2: FasePratica = {
  "id": "logica-decisoes-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u3",
  "titulo": "Senão, outro caminho",
  "conceitos": [
    "else-js"
  ],
  "revisa": [
    "if-js",
    "bloco-js",
    "comparacao-js"
  ],
  "prerequisitos": [
    "if-js",
    "bloco-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let lojaAberta = true\nlet estoque = 30\nlet avisos = 0"
  },
  "introducao": [
    {
      "texto": "O else é o plano B do if: se a condição for false, roda o que está no else. Um caminho ou o outro, nunca os dois.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "else-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Mostre \"Aberto!\" se lojaAberta for true e \"Fechado\" se não for.",
        "toque": "Mostre \"Aberto!\" se lojaAberta for true e \"Fechado\" se não for."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Aberto!"
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
        "pergunta": "O que o programa faz quando a condição é false e existe um else?",
        "dica": "if (condição) { ... } else { ... }: roda o bloco do if OU o do else.",
        "linha": {
          "alvo": "console",
          "fala": "if (condição) { ... } else { ... }: roda o bloco do if OU o do else."
        },
        "solucao": {
          "fala": "A condição era true: rodou só o primeiro bloco.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (lojaAberta) {\n  console.log(\"Aberto!\")\n} else {\n  console.log(\"Fechado\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Aberto! O else ficou de fora porque o if já rodou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (lojaAberta) {\n  console.log(\"Aberto!\")\n} else {\n  console.log(\"Fechado\")\n}"
        }
      ]
    },
    {
      "id": "else-previsao",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Troque lojaAberta para false e rode o if com else de novo.",
        "toque": "Troque lojaAberta para false e rode o if com else de novo."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Fechado"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "else"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Roda um bloco só ou os dois?",
        "dica": "Só um: false pula o if e vai direto ao else.",
        "linha": {
          "alvo": "console",
          "fala": "Só um: false pula o if e vai direto ao else."
        },
        "solucao": {
          "fala": "Fechado: o else assumiu quando a condição foi false.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "lojaAberta = false\nif (lojaAberta) {\n  console.log(\"Aberto!\")\n} else {\n  console.log(\"Fechado\")\n}"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Fechado! Um caminho ou outro, nunca os dois.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "lojaAberta = false\nif (lojaAberta) {\n  console.log(\"Aberto!\")\n} else {\n  console.log(\"Fechado\")\n}"
        }
      ],
      "previsao": {
        "pergunta": "Com lojaAberta = false, qual mensagem aparece?",
        "opcoes": [
          "Aberto!",
          "Fechado",
          "As duas"
        ],
        "correta": 1,
        "explicacao": "A condição é false: o bloco do if é pulado e roda só o else."
      }
    },
    {
      "id": "else-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Com estoque 30, mostre \"Tem estoque\" se estoque > 0 e \"Sem estoque\" se não.",
        "toque": "Com estoque 30, mostre \"Tem estoque\" se estoque > 0 e \"Sem estoque\" se não."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Tem estoque"
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
        "pergunta": "Qual condição diz que ainda há estoque?",
        "dica": "if (estoque > 0) { ... } else { ... }. Cada caminho mostra uma mensagem."
      },
      "falaAoConcluir": {
        "texto": "Tem estoque! Você escreveu os dois caminhos sozinho.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (estoque > 0) {\n  console.log(\"Tem estoque\")\n} else {\n  console.log(\"Sem estoque\")\n}"
        }
      ]
    },
    {
      "id": "ponto-e-virgula",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode: if (estoque < 5); { avisos = avisos + 1 } e olhe a caixinha avisos.",
        "toque": "Rode: if (estoque < 5); { avisos = avisos + 1 } e olhe a caixinha avisos."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "avisos",
        "valor": 1
      },
      "ajudas": {
        "pergunta": "Um ponto e vírgula logo depois do if (...) muda o que o if controla?",
        "dica": "Sim: ele termina o if. O bloco seguinte passa a rodar sempre, mesmo com a condição false.",
        "linha": {
          "alvo": "console",
          "fala": "Sim: ele termina o if. O bloco seguinte passa a rodar sempre, mesmo com a condição false."
        },
        "solucao": {
          "fala": "avisos virou 1 mesmo com estoque 30: o ; encerrou o if e o bloco rodou sempre.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "if (estoque < 5); { avisos = avisos + 1 }"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "avisos virou 1! O ponto e vírgula depois do if é um bug clássico.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "if (estoque < 5); { avisos = avisos + 1 }"
        }
      ],
      "previsao": {
        "pergunta": "Com estoque = 30, quanto vale avisos depois de if (estoque < 5); { avisos = avisos + 1 }?",
        "opcoes": [
          "0",
          "1",
          "Dá erro"
        ],
        "correta": 1,
        "explicacao": "O ponto e vírgula fecha o if sem nada dentro. O bloco depois dele vira um bloco solto e roda sempre."
      }
    },
    {
      "id": "consertar-ponto-e-virgula",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Zere avisos e rode o if certo, sem ponto e vírgula: com estoque 30, avisos deve ficar 0.",
        "toque": "Zere avisos e rode o if certo, sem ponto e vírgula: com estoque 30, avisos deve ficar 0."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "avisos",
            "valor": 0
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "ajudas": {
        "pergunta": "O que você precisa apagar para o if controlar o bloco?",
        "dica": "Zere avisos e escreva if (estoque < 5) { avisos = avisos + 1 } sem o ponto e vírgula."
      },
      "falaAoConcluir": {
        "texto": "avisos continua 0: agora o bloco só roda quando estoque < 5.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "avisos = 0\nif (estoque < 5) {\n  avisos = avisos + 1\n}"
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
  "missaoDeCampo": "Abra o Console de qualquer site e rode: if (location.protocol === 'https:') { console.log('Conexão segura') } else { console.log('Sem cadeado') }. Qual mensagem apareceu?",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

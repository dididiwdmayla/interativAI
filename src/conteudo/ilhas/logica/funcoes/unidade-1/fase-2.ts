/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U1_F2: FasePratica = {
  "id": "logica-funcoes-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-funcoes-u1",
  "titulo": "Uma moldura por chamada",
  "conceitos": [
    "moldura-funcao"
  ],
  "revisa": [
    "chamada-funcao",
    "for-js",
    "if-js"
  ],
  "prerequisitos": [
    "chamada-funcao",
    "for-js",
    "if-js"
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
      "nome": "Uma moldura por chamada",
      "codigoInicial": "// Escreva a função e depois a chamada."
    }
  },
  "introducao": [
    {
      "texto": "Cada chamada abre sua moldura no palco. Volte pela linha do tempo: entre no corpo, execute e veja a moldura sumir ao terminar.",
      "expressao": "apontando"
    },
    {
      "texto": "Na oficina, sinalizar() mostra uma mensagem. Um for chama duas vezes; um if escolhe se a oficina está aberta. Funções podem usar o que você já sabe.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie sinalizar() mostrando \"Oficina aberta\" e chame duas vezes com for. Rebobine para ver cada moldura.",
        "toque": "Crie sinalizar() mostrando \"Oficina aberta\" e chame duas vezes com for. Rebobine para ver cada moldura."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Oficina aberta",
              "Oficina aberta"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "ajudas": {
        "pergunta": "São duas funções ou duas chamadas da mesma função?",
        "dica": "No rastro, procure sinalizar() e a linha do console.log dentro da moldura.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "No rastro, procure sinalizar() e a linha do console.log dentro da moldura."
        },
        "solucao": {
          "fala": "A mesma função teve uma moldura por chamada; no fim fica só o quadro Global.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function sinalizar() {\n  console.log(\"Oficina aberta\")\n}\nfor (let i = 0; i < 2; i++) {\n  sinalizar()\n}"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A mesma função teve uma moldura por chamada; no fim fica só o quadro Global.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function sinalizar() {\n  console.log(\"Oficina aberta\")\n}\nfor (let i = 0; i < 2; i++) {\n  sinalizar()\n}"
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
        "mouse": "Rode o mesmo programa e confira fim = \"fora\" depois do for.",
        "toque": "Rode o mesmo programa e confira fim = \"fora\" depois do for."
      },
      "validador": {
        "tipo": "valorVariavel",
        "nome": "fim",
        "valor": "fora"
      },
      "ajudas": {
        "pergunta": "A moldura precisa continuar depois da chamada?",
        "dica": "O rastro chega novamente à linha de fora.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "O rastro chega novamente à linha de fora."
        },
        "solucao": {
          "fala": "Terminada a chamada, a execução volta para o programa que chamou.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "function sinalizar() {\n  console.log(\"Oficina aberta\")\n}\nfor (let i = 0; i < 2; i++) {\n  sinalizar()\n}\nlet fim = \"fora\""
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Terminada a chamada, a execução volta para o programa que chamou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function sinalizar() {\n  console.log(\"Oficina aberta\")\n}\nfor (let i = 0; i < 2; i++) {\n  sinalizar()\n}\nlet fim = \"fora\""
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Depois das duas chamadas, quantas molduras de sinalizar ficam no palco?",
        "opcoes": [
          "Uma",
          "Duas",
          "Nenhuma"
        ],
        "correta": 2,
        "explicacao": "Cada chamada termina e sua moldura some; Global permanece."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Na Biblioteca Horizonte, crie encerrar() mostrando \"Fechada\". Chame só se aberta for falso; guarde fim = \"biblioteca\".",
        "toque": "Na Biblioteca Horizonte, crie encerrar() mostrando \"Fechada\". Chame só se aberta for falso; guarde fim = \"biblioteca\"."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Fechada"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "fim",
            "valor": "biblioteca"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "ajudas": {
        "pergunta": "A condição chama a função em qual caso?",
        "dica": "O if decide; o corpo só roda quando a chamada acontece."
      },
      "falaAoConcluir": {
        "texto": "O if chamou encerrar e voltou para a linha que cria fim.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function encerrar() {\n  console.log(\"Fechada\")\n}\nlet aberta = false\nif (!aberta) {\n  encerrar()\n}\nlet fim = \"biblioteca\""
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
  "missaoDeCampo": "No Console de qualquer site, crie function saudar() { console.log('Olá') } e chame saudar() duas vezes.",
  "falaFinal": {
    "texto": "Criar e chamar funções no Console real funciona como aqui; o palco é a ajuda visual do jogo.",
    "expressao": "feliz"
  }
};

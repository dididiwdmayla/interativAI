/*
 * Decisões U1, Fase 4: Um sinal guarda, três comparam.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F4: FasePratica = {
  "id": "logica-decisoes-u1-f4",
  "tipo": "pratica",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "Um sinal guarda, três comparam",
  "conceitos": [
    "atribuir-ou-comparar"
  ],
  "revisa": [
    "igualdade-estrita",
    "variavel-let",
    "comparacao-js"
  ],
  "prerequisitos": [
    "igualdade-estrita",
    "variavel-let",
    "comparacao-js"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let idade = 17\nlet idadeMinima = 18"
  },
  "introducao": [
    {
      "texto": "O bug mais comum de quem começa: escrever um sinal de igual onde precisava de três. Vamos provocar o bug de propósito e ver o palco.",
      "expressao": "curioso"
    }
  ],
  "objetivos": [
    {
      "id": "igual-guarda",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Rode idade = 18 e veja o que acontece com a caixinha idade.",
        "toque": "Rode idade = 18 e veja o que acontece com a caixinha idade."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "idade",
            "valor": 18
          },
          {
            "tipo": "respostaDoConsole",
            "valor": 18
          }
        ]
      },
      "ajudas": {
        "pergunta": "Um único = pergunta ou guarda?",
        "dica": "Um = guarda o valor na caixinha. Olhe o palco: idade mudou.",
        "linha": {
          "alvo": "console",
          "fala": "Um = guarda o valor na caixinha. Olhe o palco: idade mudou."
        },
        "solucao": {
          "fala": "idade agora vale 18! O = trocou a caixinha em vez de perguntar.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade = 18"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "idade virou 18. Esse é o bug clássico: = guarda, === pergunta.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade = 18"
        }
      ],
      "previsao": {
        "pergunta": "Você quis perguntar se idade é 18 e escreveu idade = 18. O que acontece?",
        "opcoes": [
          "Responde false e nada muda",
          "Dá erro no Console",
          "Guarda 18 em idade e responde 18"
        ],
        "correta": 2,
        "explicacao": "Um = guarda: idade passou a valer 18, e a atribuição respondeu 18. Ninguém perguntou nada."
      }
    },
    {
      "id": "consertar",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Volte idade para 17 e pergunte idade === 18, com três sinais.",
        "toque": "Volte idade para 17 e pergunte idade === 18, com três sinais."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "idade",
            "valor": 17
          },
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Como voltar idade ao que era e depois só perguntar?",
        "dica": "Primeiro idade = 17 (guarda). Depois idade === 18 (pergunta): responde false.",
        "linha": {
          "alvo": "console",
          "fala": "Primeiro idade = 17 (guarda). Depois idade === 18 (pergunta): responde false."
        },
        "solucao": {
          "fala": "Guardei 17 com um = e perguntei com três: false, e idade segue 17.",
          "acoes": [
            {
              "tipo": "executarNoConsole",
              "codigo": "idade = 17"
            },
            {
              "tipo": "executarNoConsole",
              "codigo": "idade === 18"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "false, e idade continua 17. Três sinais perguntam sem mudar nada.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idade = 17"
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade === 18"
        }
      ]
    },
    {
      "id": "perguntar-sem-mudar",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Pergunte se idade é igual a idadeMinima sem mudar nenhuma das duas caixinhas.",
        "toque": "Pergunte se idade é igual a idadeMinima sem mudar nenhuma das duas caixinhas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "respostaDoConsole",
            "valor": false
          },
          {
            "tipo": "valorVariavel",
            "nome": "idade",
            "valor": 17
          },
          {
            "tipo": "valorVariavel",
            "nome": "idadeMinima",
            "valor": 18
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual sinal pergunta sem alterar as caixinhas?",
        "dica": "idade === idadeMinima compara. Se você usar um =, uma caixinha muda."
      },
      "falaAoConcluir": {
        "texto": "false, e as duas caixinhas seguem intactas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idade === idadeMinima"
        }
      ]
    },
    {
      "id": "guardar-de-proposito",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde 21 em idadeMinima (um sinal) e pergunte idade >= idadeMinima.",
        "toque": "Guarde 21 em idadeMinima (um sinal) e pergunte idade >= idadeMinima."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "idadeMinima",
            "valor": 21
          },
          {
            "tipo": "respostaDoConsole",
            "valor": false
          }
        ]
      },
      "ajudas": {
        "pergunta": "Quando o = é o sinal certo?",
        "dica": "Para mudar uma caixinha: idadeMinima = 21. Para perguntar: idade >= idadeMinima."
      },
      "falaAoConcluir": {
        "texto": "Dessa vez o = foi de propósito: guardou o 21, e a pergunta deu false.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "idadeMinima = 21"
        },
        {
          "tipo": "executarNoConsole",
          "codigo": "idade >= idadeMinima"
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
  "missaoDeCampo": "Abra o Console de qualquer site, crie let nivel = 1 e rode nivel = 2 (guarda). Depois rode nivel === 2 (pergunta) e veja a diferença nas respostas.",
  "falaFinal": {
    "texto": "O mesmo código funciona no Console real. Recarregar a página limpa essas variáveis.",
    "expressao": "feliz"
  }
};

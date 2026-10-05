/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U1_F1: Fase = {
  "id": "logica-estruturas-de-dados-u1-f1",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u1",
  "titulo": "O último desfaz primeiro",
  "conceitos": [
    "pilha-js"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "cena",
    "ficha-dispositivo",
    "velocidade-simulacao"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "estrutura.js",
      "codigoInicial": ""
    }
  },
  "introducao": [
    {
      "texto": "A cozinha guarda ajustes de brilho no histórico. push põe no fim; pop retira pelo mesmo lado: o direito no palco.",
      "expressao": "apontando"
    },
    {
      "texto": "Pilha: último a entrar, primeiro a sair. Fila: primeiro a entrar, primeiro a sair. O desfazer usa pilha.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "pilha-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde 20 e 80 com push no historico vazio. Retire com pop, acenda luz com o brilho retirado.",
        "toque": "Guarde 20 e 80 com push no historico vazio. Retire com pop, acenda luz com o brilho retirado."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "historico",
            "forma": "pilha"
          },
          {
            "tipo": "valorVariavel",
            "nome": "historico",
            "valor": [
              20
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "saiu",
            "valor": 80
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luz",
            "propriedade": "brilho",
            "valor": 80
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luz",
            "propriedade": "ligada",
            "valor": true
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Declare [], faça dois push e guarde o retorno de pop. luz.brilho recebe esse número.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Declare [], faça dois push e guarde o retorno de pop. luz.brilho recebe esse número."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const historico = [];\nhistorico.push(20);\nhistorico.push(80);\nconst saiu = historico.pop();\nluz.brilho = saiu;\nluz.ligar();"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Os vagões entraram e saíram à direita. pop devolveu o último: 80.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const historico = [];\nhistorico.push(20);\nhistorico.push(80);\nconst saiu = historico.pop();\nluz.brilho = saiu;\nluz.ligar();"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "pilha-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Guarde 15, 40 e 90; retire duas vezes. Acenda a luz com o segundo brilho retirado.",
        "toque": "Guarde 15, 40 e 90; retire duas vezes. Acenda a luz com o segundo brilho retirado."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "historico",
            "forma": "pilha"
          },
          {
            "tipo": "valorVariavel",
            "nome": "historico",
            "valor": [
              15
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "saiu",
            "valor": 90
          },
          {
            "tipo": "valorVariavel",
            "nome": "anterior",
            "valor": 40
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "luz",
            "propriedade": "brilho",
            "valor": 40
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "A primeira retirada desfaz 90; a segunda chega ao ajuste anterior."
      },
      "falaAoConcluir": {
        "texto": "O primeiro ajuste fica no fundo da pilha.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const historico = [];\nhistorico.push(15);\nhistorico.push(40);\nhistorico.push(90);\nconst saiu = historico.pop();\nconst anterior = historico.pop();\nluz.brilho = anterior;\nluz.ligar();"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Qual vagão sai do primeiro pop após push(15), push(40), push(90)?",
        "opcoes": [
          "15",
          "40",
          "90"
        ],
        "correta": 2,
        "explicacao": "Sai 90: entrou por último."
      }
    }
  ],
  "conclusao": [
    {
      "texto": "Rebobine para ver por onde cada item passou e qual regra decidiu a ordem.",
      "expressao": "comemorando"
    }
  ],
  "falaFinal": {
    "texto": "Troque os dados e teste também a estrutura vazia.",
    "expressao": "curioso"
  },
  "missaoDeCampo": "No Console de qualquer site: let p=[]; p.push(\"A\",\"B\"); p.pop(); let f=[]; f.push(\"A\",\"B\"); f.shift(); Compare quem saiu e o que ficou.",
  "areas": [
    "cena",
    "snippet",
    "palco"
  ],
  "cena": {
    "id": "pilha-cozinha",
    "titulo": "Desfazer a luz da cozinha",
    "ambiente": "cozinha",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "parede",
        "x": 0,
        "y": 0
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150,
        "variante": "madeira"
      },
      {
        "peca": "cozinha",
        "x": 80,
        "y": 45
      },
      {
        "peca": "janela",
        "x": 240,
        "y": 25
      }
    ],
    "dispositivos": [
      {
        "id": "luz",
        "tipo": "lampada",
        "x": 160,
        "y": 25
      }
    ],
    "linhaDoTempo": []
  }
};

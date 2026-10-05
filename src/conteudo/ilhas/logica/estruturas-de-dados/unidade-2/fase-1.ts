/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U2_F1: Fase = {
  "id": "logica-estruturas-de-dados-u2-f1",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u2",
  "titulo": "Primeiro a chegar, primeiro a sair",
  "conceitos": [
    "fila-js"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "pilha-js"
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
      "texto": "Na esquina, o vermelho dos carros libera o pedestre. O painel chama os nomes na ordem de chegada; a pessoa desenhada representa a travessia.",
      "expressao": "apontando"
    },
    {
      "texto": "push entra pela direita; shift sai pela esquerda. Os outros vagões deslizam. pop chamaria o último: isso seria pilha.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "fila-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Em fila vazia, use push para Ana e Beto. Retire primeiro com shift; libere o pedestre e mostre o nome no painel.",
        "toque": "Em fila vazia, use push para Ana e Beto. Retire primeiro com shift; libere o pedestre e mostre o nome no painel."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "fila",
            "forma": "fila"
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeiro",
            "valor": "Ana"
          },
          {
            "tipo": "valorVariavel",
            "nome": "fila",
            "valor": [
              "Beto"
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "semaforo",
            "propriedade": "cor",
            "valor": "vermelho"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "Ana"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Use fila.push, fila.shift, semaforo.mudar(\"vermelho\") e painel.mostrar(primeiro).",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use fila.push, fila.shift, semaforo.mudar(\"vermelho\") e painel.mostrar(primeiro)."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const fila = [];\nfila.push(\"Ana\");\nfila.push(\"Beto\");\nconst primeiro = fila.shift();\nsemaforo.mudar(\"vermelho\");\npainel.mostrar(primeiro);"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Ana saiu pelo começo; Beto deslizou para a primeira posição.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const fila = [];\nfila.push(\"Ana\");\nfila.push(\"Beto\");\nconst primeiro = fila.shift();\nsemaforo.mudar(\"vermelho\");\npainel.mostrar(primeiro);"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "fila-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Enfileire Ana, Beto e Cris. Retire duas pessoas em ordem; mostre segundo no painel e libere a travessia.",
        "toque": "Enfileire Ana, Beto e Cris. Retire duas pessoas em ordem; mostre segundo no painel e libere a travessia."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "fila",
            "forma": "fila"
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeiro",
            "valor": "Ana"
          },
          {
            "tipo": "valorVariavel",
            "nome": "segundo",
            "valor": "Beto"
          },
          {
            "tipo": "valorVariavel",
            "nome": "fila",
            "valor": [
              "Cris"
            ]
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "painel",
            "propriedade": "texto",
            "valor": "Beto"
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "semaforo",
            "propriedade": "cor",
            "valor": "vermelho"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "A segunda retirada deve chamar quem chegou depois de Ana."
      },
      "falaAoConcluir": {
        "texto": "FIFO significa primeiro a entrar, primeiro a sair.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const fila = [];\nfila.push(\"Ana\");\nfila.push(\"Beto\");\nfila.push(\"Cris\");\nconst primeiro = fila.shift();\nconst segundo = fila.shift();\nsemaforo.mudar(\"vermelho\");\npainel.mostrar(segundo);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Quem sai primeiro da fila após Ana, Beto e Cris entrarem com push?",
        "opcoes": [
          "Cris",
          "Ana",
          "Beto"
        ],
        "correta": 1,
        "explicacao": "shift retira Ana, que entrou primeiro."
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
    "id": "fila-esquina",
    "titulo": "A ordem na travessia",
    "ambiente": "esquina",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "ceu",
        "x": 0,
        "y": 0,
        "altura": 110
      },
      {
        "peca": "rua",
        "x": 0,
        "y": 103
      },
      {
        "peca": "parede",
        "x": 230,
        "y": 15,
        "largura": 80,
        "altura": 90
      }
    ],
    "dispositivos": [
      {
        "id": "semaforo",
        "tipo": "semaforo",
        "x": 75,
        "y": 15
      },
      {
        "id": "painel",
        "tipo": "letreiro",
        "x": 210,
        "y": 32
      }
    ],
    "linhaDoTempo": [],
    "atores": [
      {
        "id": "pedestre",
        "desenho": "pessoa",
        "x": 145,
        "y": 119,
        "escala": 0.65,
        "acoes": {
          "atravessar": {
            "duracaoMs": 2200,
            "destino": {
              "x": 176,
              "y": 193
            }
          }
        }
      }
    ],
    "reacoes": [
      {
        "quando": {
          "dispositivo": "semaforo",
          "propriedade": "cor",
          "valor": "vermelho"
        },
        "entao": {
          "ator": "pedestre",
          "acao": "atravessar"
        }
      }
    ]
  }
};

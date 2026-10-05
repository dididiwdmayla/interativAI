/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U4_F1: Fase = {
  "id": "logica-estruturas-de-dados-u4-f1",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u4",
  "titulo": "Casa, cômodos e lâmpadas",
  "conceitos": [
    "arvore-de-dados"
  ],
  "revisa": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "recursao-js",
    "caso-base-recursao"
  ],
  "prerequisitos": [
    "array-js",
    "objeto-js",
    "funcao-js",
    "return-js",
    "for-of-js",
    "recursao-js",
    "caso-base-recursao"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "arvore-palco"
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
      "texto": "Casa é a raiz; os cômodos são seus filhos e as lâmpadas são folhas. Uma lista plana não expressa esses pais e filhos.",
      "expressao": "apontando"
    },
    {
      "texto": "Use objetos com nome e filhos. O botão Ver como árvore desenha a relação no palco, sem mudar os dados.",
      "expressao": "apontando"
    },
    {
      "texto": "A árvore de Elementos da Ilha Sites é uma árvore de verdade: o DOM guarda nós com pais e filhos. Aqui o desenho conta a mesma relação.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "arvore-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie casa com Sala e Cozinha; cada cômodo tem sua lâmpada como folha. Use Ver como árvore no palco.",
        "toque": "Crie casa com Sala e Cozinha; cada cômodo tem sua lâmpada como folha. Use Ver como árvore no palco."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "casa",
            "forma": "arvore"
          },
          {
            "tipo": "valorVariavel",
            "nome": "casa",
            "valor": {
              "nome": "Casa",
              "filhos": [
                {
                  "nome": "Sala",
                  "filhos": [
                    {
                      "nome": "luzSala",
                      "lampada": true,
                      "filhos": []
                    }
                  ]
                },
                {
                  "nome": "Cozinha",
                  "filhos": [
                    {
                      "nome": "luzCozinha",
                      "lampada": true,
                      "filhos": []
                    }
                  ]
                }
              ]
            }
          },
          {
            "tipo": "evento",
            "evento": "viuComoArvore"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Cada nó é {nome, filhos:[]}; coloque os nós-filhos dentro dessa lista.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Cada nó é {nome, filhos:[]}; coloque os nós-filhos dentro dessa lista."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};"
            },
            {
              "tipo": "executarSnippet"
            },
            {
              "tipo": "verComoArvore",
              "nome": "casa"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "A raiz liga os cômodos; cada lâmpada é folha.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "verComoArvore",
          "nome": "casa"
        }
      ]
    },
    {
      "id": "arvore-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Acrescente Corredor com luzCorredor como folha em casa.filhos. Veja a árvore com os três cômodos.",
        "toque": "Acrescente Corredor com luzCorredor como folha em casa.filhos. Veja a árvore com os três cômodos."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "formaDaEstrutura",
            "nome": "casa",
            "forma": "arvore"
          },
          {
            "tipo": "valorVariavel",
            "nome": "casa",
            "valor": {
              "nome": "Casa",
              "filhos": [
                {
                  "nome": "Sala",
                  "filhos": [
                    {
                      "nome": "luzSala",
                      "lampada": true,
                      "filhos": []
                    }
                  ]
                },
                {
                  "nome": "Cozinha",
                  "filhos": [
                    {
                      "nome": "luzCozinha",
                      "lampada": true,
                      "filhos": []
                    }
                  ]
                },
                {
                  "nome": "Corredor",
                  "filhos": [
                    {
                      "nome": "luzCorredor",
                      "lampada": true,
                      "filhos": []
                    }
                  ]
                }
              ]
            }
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Acrescente um objeto de cômodo; sua lâmpada fica nos filhos dele."
      },
      "falaAoConcluir": {
        "texto": "O DOM também cresce acrescentando um filho ao pai certo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const casa = {\"nome\": \"Casa\", \"filhos\": [{\"nome\": \"Sala\", \"filhos\": [{\"nome\": \"luzSala\", \"lampada\": true, \"filhos\": []}]}, {\"nome\": \"Cozinha\", \"filhos\": [{\"nome\": \"luzCozinha\", \"lampada\": true, \"filhos\": []}]}]};\ncasa.filhos.push({\"nome\": \"Corredor\", \"filhos\": [{\"nome\": \"luzCorredor\", \"lampada\": true, \"filhos\": []}]});"
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "verComoArvore",
          "nome": "casa"
        }
      ],
      "previsao": {
        "pergunta": "No DOM, body contém main e main contém button. Quem é o pai direto de button?",
        "opcoes": [
          "body",
          "button",
          "main"
        ],
        "correta": 2,
        "explicacao": "main é o pai direto; body é um ancestral."
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
  "apresentar": [
    "arvore-palco"
  ]
};

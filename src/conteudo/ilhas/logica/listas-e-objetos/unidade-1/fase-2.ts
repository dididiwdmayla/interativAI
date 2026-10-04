/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U1_F2: FasePratica = {
  "id": "logica-listas-e-objetos-u1-f2",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u1",
  "titulo": "A fila muda, a const fica",
  "conceitos": [
    "push-pop-js",
    "const-lista-js"
  ],
  "revisa": [
    "array-js",
    "indice-lista-js",
    "variavel-const"
  ],
  "prerequisitos": [
    "array-js",
    "indice-lista-js",
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
      "nome": "A fila muda, a const fica",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "push põe um item no fim e pop tira o último, devolvendo o valor retirado. Observe os vagões entrando e saindo.",
      "expressao": "apontando"
    },
    {
      "texto": "const fila fixa a ligação com a lista. fila[0] = outroNome muda o conteúdo; fila = outraLista troca a ligação e dá TypeError.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie pedidos com pão e bolo; push suco, pop em saiu e troque o primeiro por broa.",
        "toque": "Crie pedidos com pão e bolo; push suco, pop em saiu e troque o primeiro por broa."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "pedidos",
            "valor": [
              "broa",
              "bolo"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "saiu",
            "valor": "suco"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "const"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:push"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:pop"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Use pedidos.push(\"suco\"), pedidos.pop() e pedidos[0] = \"broa\".",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use pedidos.push(\"suco\"), pedidos.pop() e pedidos[0] = \"broa\"."
        },
        "solucao": {
          "fala": "saiu guarda suco. A mesma lista agora contém broa e bolo.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const pedidos = [\"pão\", \"bolo\"]\npedidos.push(\"suco\")\nlet saiu = pedidos.pop()\npedidos[0] = \"broa\""
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "saiu guarda suco. A mesma lista agora contém broa e bolo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const pedidos = [\"pão\", \"bolo\"]\npedidos.push(\"suco\")\nlet saiu = pedidos.pop()\npedidos[0] = \"broa\""
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
        "mouse": "Tente pedidos = [\"café\"]. Leia o TypeError, depois siga para criar outra lista.",
        "toque": "Tente pedidos = [\"café\"]. Leia o TypeError, depois siga para criar outra lista."
      },
      "validador": {
        "tipo": "erroDoTipo",
        "nome": "TypeError"
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "A atribuição tenta trocar a lista inteira de uma const.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A atribuição tenta trocar a lista inteira de uma const."
        },
        "solucao": {
          "fala": "TypeError: a ligação é constante. Alterar um item era permitido.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "pedidos = [\"café\"]"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "TypeError: a ligação é constante. Alterar um item era permitido.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "pedidos = [\"café\"]"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "pedidos foi criada com const. pedidos = [\"café\"] faz o quê?",
        "opcoes": [
          "TypeError",
          "Troca os itens",
          "Adiciona café"
        ],
        "correta": 0,
        "explicacao": "const impede atribuir outra lista à variável."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie const reservas = [\"Ivo\", \"Eva\"]; push Noa, pop em cancelada e troque Ivo por Luz.",
        "toque": "Crie const reservas = [\"Ivo\", \"Eva\"]; push Noa, pop em cancelada e troque Ivo por Luz."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "reservas",
            "valor": [
              "Luz",
              "Eva"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "cancelada",
            "valor": "Noa"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "const"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:push"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:pop"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Mude a primeira posição, sem reatribuir reservas."
      },
      "falaAoConcluir": {
        "texto": "A lista continua ligada à const; seu conteúdo mudou.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const reservas = [\"Ivo\", \"Eva\"]\nreservas.push(\"Noa\")\nlet cancelada = reservas.pop()\nreservas[0] = \"Luz\""
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "No Console real os dados funcionam igual. Aqui, volte pela linha do tempo para acompanhar cada mudança.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [\"pão\", \"leite\"]; use compras.push(\"fruta\") e confira length: 3. Leia compras[2].",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

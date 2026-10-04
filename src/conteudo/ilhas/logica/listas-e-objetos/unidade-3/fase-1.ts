/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U3_F1: FasePratica = {
  "id": "logica-listas-e-objetos-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u3",
  "titulo": "Uma ficha, várias chaves",
  "conceitos": [
    "objeto-js",
    "acesso-objeto-js"
  ],
  "revisa": [
    "array-js",
    "undefined-js",
    "variavel-const"
  ],
  "prerequisitos": [
    "array-js",
    "undefined-js",
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
      "nome": "Uma ficha, várias chaves",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "O produto da padaria vira uma ficha: { nome: \"Broa\", preco: 5, disponivel: true }. As chaves nomeiam dados; não são índices de lista.",
      "expressao": "apontando"
    },
    {
      "texto": "pedido.total e pedido[\"total\"] leem o mesmo campo. Nos colchetes a chave literal tem aspas; pedido[total] procura uma variável chamada total.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f1-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie pedido com produto Broa, total 5 e pago false. Leia total em peloPonto e pelosColchetes das duas formas.",
        "toque": "Crie pedido com produto Broa, total 5 e pago false. Leia total em peloPonto e pelosColchetes das duas formas."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "pedido",
            "valor": {
              "produto": "Broa",
              "total": 5,
              "pago": false
            }
          },
          {
            "tipo": "valorVariavel",
            "nome": "peloPonto",
            "valor": 5
          },
          {
            "tipo": "valorVariavel",
            "nome": "pelosColchetes",
            "valor": 5
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "objeto"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Use pedido.total e pedido[\"total\"]. A ficha mostra chave e valor.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use pedido.total e pedido[\"total\"]. A ficha mostra chave e valor."
        },
        "solucao": {
          "fala": "As duas leituras deram 5. Um objeto usa chaves; uma lista usa índices.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const pedido = { produto: \"Broa\", total: 5, pago: false }\nlet peloPonto = pedido.total\nlet pelosColchetes = pedido[\"total\"]"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "As duas leituras deram 5. Um objeto usa chaves; uma lista usa índices.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const pedido = { produto: \"Broa\", total: 5, pago: false }\nlet peloPonto = pedido.total\nlet pelosColchetes = pedido[\"total\"]"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "f1-prever",
      "tipo": "previsao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Guarde ausente = pedido.entrega e tipoAusente = typeof ausente.",
        "toque": "Guarde ausente = pedido.entrega e tipoAusente = typeof ausente."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "tipoAusente",
            "valor": "undefined"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "A ficha não tem a chave entrega.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "A ficha não tem a chave entrega."
        },
        "solucao": {
          "fala": "Uma propriedade ausente dá undefined, sem erro.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "let ausente = pedido.entrega\nlet tipoAusente = typeof ausente"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Uma propriedade ausente dá undefined, sem erro.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 0
        },
        {
          "tipo": "definirSnippet",
          "codigo": "let ausente = pedido.entrega\nlet tipoAusente = typeof ausente"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "pedido só tem produto, total e pago. pedido.entrega devolve o quê?",
        "opcoes": [
          "undefined",
          "false",
          "TypeError"
        ],
        "correta": 0,
        "explicacao": "A chave não existe na ficha."
      }
    },
    {
      "id": "f1-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie produto com nome Bolo, preco 12 e estoque 4. Leia preco em a pelo ponto e em b pelos colchetes.",
        "toque": "Crie produto com nome Bolo, preco 12 e estoque 4. Leia preco em a pelo ponto e em b pelos colchetes."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "produto",
            "valor": {
              "nome": "Bolo",
              "preco": 12,
              "estoque": 4
            }
          },
          {
            "tipo": "valorVariavel",
            "nome": "a",
            "valor": 12
          },
          {
            "tipo": "valorVariavel",
            "nome": "b",
            "valor": 12
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "objeto"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "O nome entre aspas é a chave literal."
      },
      "falaAoConcluir": {
        "texto": "O mesmo preço foi lido pelas duas escritas.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const produto = { nome: \"Bolo\", preco: 12, estoque: 4 }\nlet a = produto.preco\nlet b = produto[\"preco\"]"
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
  "missaoDeCampo": "No Console de qualquer site, crie const compra = { item: \"pão\", total: 5 }; leia compra.total e compra[\"total\"]. Acrescente compra.pago = true.",
  "falaFinal": {
    "texto": "Confira os valores no palco antes de seguir.",
    "expressao": "feliz"
  }
};

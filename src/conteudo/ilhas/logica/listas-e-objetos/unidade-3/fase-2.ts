/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FasePratica } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U3_F2: FasePratica = {
  "id": "logica-listas-e-objetos-u3-f2",
  "tipo": "pratica",
  "unidadeId": "logica-listas-e-objetos-u3",
  "titulo": "Atualizar a ficha",
  "conceitos": [
    "mudar-campo-js"
  ],
  "revisa": [
    "objeto-js",
    "acesso-objeto-js",
    "if-js",
    "array-js"
  ],
  "prerequisitos": [
    "objeto-js",
    "acesso-objeto-js",
    "if-js",
    "array-js"
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
      "nome": "Atualizar a ficha",
      "codigoInicial": "// Escreva e execute o programa da padaria."
    }
  },
  "introducao": [
    {
      "texto": "A padaria recebeu reposição. produto.estoque = 6 muda o estoque; produto.categoria = \"doce\" acrescenta uma chave nova.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "f2-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie produto Bolo (preco 12, estoque 0). Mude para 14 e 6, acrescente categoria doce e decida status pelo estoque.",
        "toque": "Crie produto Bolo (preco 12, estoque 0). Mude para 14 e 6, acrescente categoria doce e decida status pelo estoque."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "produto",
            "valor": {
              "nome": "Bolo",
              "preco": 14,
              "estoque": 6,
              "categoria": "doce"
            }
          },
          {
            "tipo": "valorVariavel",
            "nome": "status",
            "valor": "disponível"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Altere cada campo pela chave; o if consulta estoque > 0.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Altere cada campo pela chave; o if consulta estoque > 0."
        },
        "solucao": {
          "fala": "Só os campos escolhidos mudaram; nome continua Bolo.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const produto = { nome: \"Bolo\", preco: 12, estoque: 0 }\nproduto.preco = 14\nproduto[\"estoque\"] = 6\nproduto.categoria = \"doce\"\nlet status = \"esgotado\"\nif (produto.estoque > 0) { status = \"disponível\" }"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Só os campos escolhidos mudaram; nome continua Bolo.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const produto = { nome: \"Bolo\", preco: 12, estoque: 0 }\nproduto.preco = 14\nproduto[\"estoque\"] = 6\nproduto.categoria = \"doce\"\nlet status = \"esgotado\"\nif (produto.estoque > 0) { status = \"disponível\" }"
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
        "mouse": "Mude produto.preco para 15 e guarde nomeDepois = produto.nome.",
        "toque": "Mude produto.preco para 15 e guarde nomeDepois = produto.nome."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "nomeDepois",
            "valor": "Bolo"
          },
          {
            "tipo": "valorVariavel",
            "nome": "produto",
            "valor": {
              "nome": "Bolo",
              "preco": 15,
              "estoque": 6,
              "categoria": "doce"
            }
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Um campo alterado não substitui a ficha inteira.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Um campo alterado não substitui a ficha inteira."
        },
        "solucao": {
          "fala": "O nome continua Bolo; só o preço passou a 15.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "produto.preco = 15\nlet nomeDepois = produto.nome"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O nome continua Bolo; só o preço passou a 15.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "produto.preco = 15\nlet nomeDepois = produto.nome"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "produto.preco = 15 também muda produto.nome?",
        "opcoes": [
          "Sim, para 15",
          "Não, fica Bolo",
          "Apaga o nome"
        ],
        "correta": 1,
        "explicacao": "A atribuição usa apenas a chave preco."
      }
    },
    {
      "id": "f2-sozinho",
      "tipo": "acao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Crie entrega = { bairro: \"Centro\", taxa: 3 }; mude taxa para 4 e acrescente itens = [\"pão\", \"suco\"].",
        "toque": "Crie entrega = { bairro: \"Centro\", taxa: 3 }; mude taxa para 4 e acrescente itens = [\"pão\", \"suco\"]."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "entrega",
            "valor": {
              "bairro": "Centro",
              "taxa": 4,
              "itens": [
                "pão",
                "suco"
              ]
            }
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Qual dado você espera ver no palco depois de executar?",
        "dica": "Um valor de campo pode ser uma lista."
      },
      "falaAoConcluir": {
        "texto": "A ficha guarda texto, número e uma lista, cada qual na sua chave.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const entrega = { bairro: \"Centro\", taxa: 3 }\nentrega.taxa = 4\nentrega.itens = [\"pão\", \"suco\"]"
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

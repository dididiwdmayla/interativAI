/* Ação em contexto novo e previsão autossuficiente: duas revisões por conceito. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_LISTAS_U3: ItemRevisao[] = [
  {
    "id": "objeto-js-1",
    "conceito": "objeto-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const filme = { titulo: \"Lua\", duracao: 90 } e guarde minutos = filme.duracao.",
      "toque": "Crie const filme = { titulo: \"Lua\", duracao: 90 } e guarde minutos = filme.duracao."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "filme",
          "valor": {
            "titulo": "Lua",
            "duracao": 90
          }
        },
        {
          "tipo": "valorVariavel",
          "nome": "minutos",
          "valor": 90
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
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Um objeto reúne campos nomeados: cada chave guarda um valor, não uma posição numerada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const filme = { titulo: \"Lua\", duracao: 90 }; let minutos = filme.duracao"
      }
    ]
  },
  {
    "id": "objeto-js-2",
    "conceito": "objeto-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "Um objeto reúne campos nomeados: cada chave guarda um valor, não uma posição numerada."
    },
    "previsao": {
      "pergunta": "const cidade = { nome: \"Rio\", habitantes: 10 }; qual é uma chave?",
      "opcoes": [
        "\"Rio\"",
        "nome",
        "10"
      ],
      "correta": 1,
      "explicacao": "nome é a chave; Rio é seu valor."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "acesso-objeto-js-1",
    "conceito": "acesso-objeto-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie caixa = { saldo: 20 }; guarde a = caixa.saldo, b = caixa[\"saldo\"] e tipo = typeof caixa.inexistente.",
      "toque": "Crie caixa = { saldo: 20 }; guarde a = caixa.saldo, b = caixa[\"saldo\"] e tipo = typeof caixa.inexistente."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "a",
          "valor": 20
        },
        {
          "tipo": "valorVariavel",
          "nome": "b",
          "valor": 20
        },
        {
          "tipo": "valorVariavel",
          "nome": "tipo",
          "valor": "undefined"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "obj.total e obj[\"total\"] leem a mesma chave; chave ausente dá undefined."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const caixa = { saldo: 20 }; let a = caixa.saldo; let b = caixa[\"saldo\"]; let tipo = typeof caixa.inexistente"
      }
    ]
  },
  {
    "id": "acesso-objeto-js-2",
    "conceito": "acesso-objeto-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "obj.total e obj[\"total\"] leem a mesma chave; chave ausente dá undefined."
    },
    "previsao": {
      "pergunta": "const ficha = { nome: \"Lua\" }; ficha.idade vale o quê?",
      "opcoes": [
        "0",
        "ReferenceError",
        "undefined"
      ],
      "correta": 2,
      "explicacao": "Ler uma chave ausente devolve undefined."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "mudar-campo-js-1",
    "conceito": "mudar-campo-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const ingresso = { preco: 12 }; mude preco para 15 e acrescente usado: false.",
      "toque": "Crie const ingresso = { preco: 12 }; mude preco para 15 e acrescente usado: false."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "valorVariavel",
          "nome": "ingresso",
          "valor": {
            "preco": 15,
            "usado": false
          }
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Atribuir obj.chave muda só esse campo; uma chave nova acrescenta um campo à ficha."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const ingresso = { preco: 12 }; ingresso.preco = 15; ingresso.usado = false"
      }
    ]
  },
  {
    "id": "mudar-campo-js-2",
    "conceito": "mudar-campo-js",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Preveja o resultado do código descrito.",
      "toque": "Preveja o resultado do código descrito."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O código cria, altera ou consulta qual dado?",
      "dica": "Atribuir obj.chave muda só esse campo; uma chave nova acrescenta um campo à ficha."
    },
    "previsao": {
      "pergunta": "const item = { nome: \"Lápis\", preco: 2 }; item.preco = 3; como fica nome?",
      "opcoes": [
        "\"Lápis\"",
        "3",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "Só o campo preco foi alterado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];

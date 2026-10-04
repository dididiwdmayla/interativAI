/* Ação em contexto novo e previsão autossuficiente: duas revisões por conceito. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_LISTAS_U4: ItemRevisao[] = [
  {
    "id": "lista-objetos-js-1",
    "conceito": "lista-objetos-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const atletas = [{ nome: \"Ivo\", pontos: 7 }, { nome: \"Sol\", pontos: 9 }]; guarde lider = atletas[1].nome.",
      "toque": "Crie const atletas = [{ nome: \"Ivo\", pontos: 7 }, { nome: \"Sol\", pontos: 9 }]; guarde lider = atletas[1].nome."
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
          "nome": "lider",
          "valor": "Sol"
        },
        {
          "tipo": "valorVariavel",
          "nome": "atletas",
          "valor": [
            {
              "nome": "Ivo",
              "pontos": 7
            },
            {
              "nome": "Sol",
              "pontos": 9
            }
          ]
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Uma lista pode guardar objetos: lista[0] escolhe uma ficha e lista[0].nome lê um campo dela."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const atletas = [{ nome: \"Ivo\", pontos: 7 }, { nome: \"Sol\", pontos: 9 }]; let lider = atletas[1].nome"
      }
    ]
  },
  {
    "id": "lista-objetos-js-2",
    "conceito": "lista-objetos-js",
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
      "dica": "Uma lista pode guardar objetos: lista[0] escolhe uma ficha e lista[0].nome lê um campo dela."
    },
    "previsao": {
      "pergunta": "const l = [{ preco: 2 }, { preco: 7 }]; l[1].preco vale quanto?",
      "opcoes": [
        "2",
        "7",
        "undefined"
      ],
      "correta": 1,
      "explicacao": "O índice 1 escolhe a segunda ficha."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "somar-campo-js-1",
    "conceito": "somar-campo-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie somaPontos(lista) com for...of para somar pontos. Guarde total para [{pontos: 2}, {pontos: 5}].",
      "toque": "Crie somaPontos(lista) com for...of para somar pontos. Guarde total para [{pontos: 2}, {pontos: 5}]."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "validador": {
      "tipo": "todos",
      "validadores": [
        {
          "tipo": "funcaoPassa",
          "nome": "somaPontos",
          "casos": [
            {
              "args": [
                []
              ],
              "esperado": 0
            },
            {
              "args": [
                [
                  {
                    "pontos": 2
                  },
                  {
                    "pontos": 5
                  }
                ]
              ],
              "esperado": 7
            }
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "total",
          "valor": 7
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "for-of"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Percorra as fichas e acrescente o campo numérico de cada item ao acumulador."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "function somaPontos(lista) { let total = 0; for (let item of lista) { total += item.pontos } return total } let total = somaPontos([{pontos: 2}, {pontos: 5}])"
      }
    ]
  },
  {
    "id": "somar-campo-js-2",
    "conceito": "somar-campo-js",
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
      "dica": "Percorra as fichas e acrescente o campo numérico de cada item ao acumulador."
    },
    "previsao": {
      "pergunta": "let total = 0; for (let i of [{preco: 3}, {preco: 4}]) { total += i.preco }; total?",
      "opcoes": [
        "[3, 4]",
        "4",
        "7"
      ],
      "correta": 2,
      "explicacao": "O acumulador guarda 3 + 4, não as fichas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "filtrar-campo-js-1",
    "conceito": "filtrar-campo-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const alunos = [{nome: \"Ana\", nota: 4}, {nome: \"Bia\", nota: 8}]; filtre nota >= 6 em aprovados.",
      "toque": "Crie const alunos = [{nome: \"Ana\", nota: 4}, {nome: \"Bia\", nota: 8}]; filtre nota >= 6 em aprovados."
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
          "nome": "aprovados",
          "valor": [
            {
              "nome": "Bia",
              "nota": 8
            }
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "metodo:filter"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "arrow"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "A condição do filter pode ler um campo da ficha; o resultado guarda as fichas aprovadas."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const alunos = [{nome: \"Ana\", nota: 4}, {nome: \"Bia\", nota: 8}]; const aprovados = alunos.filter(item => item.nota >= 6)"
      }
    ]
  },
  {
    "id": "filtrar-campo-js-2",
    "conceito": "filtrar-campo-js",
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
      "dica": "A condição do filter pode ler um campo da ficha; o resultado guarda as fichas aprovadas."
    },
    "previsao": {
      "pergunta": "const l = [{ok: false}, {ok: true}]; l.filter(item => item.ok).length vale quanto?",
      "opcoes": [
        "1",
        "2",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "Só a segunda ficha passa."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "desestruturacao-objeto-js-1",
    "conceito": "desestruturacao-objeto-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie ficha = { titulo: \"Sol\", paginas: 40 }; use const { titulo, paginas } = ficha e guarde resumo = titulo.",
      "toque": "Crie ficha = { titulo: \"Sol\", paginas: 40 }; use const { titulo, paginas } = ficha e guarde resumo = titulo."
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
          "nome": "titulo",
          "valor": "Sol"
        },
        {
          "tipo": "valorVariavel",
          "nome": "paginas",
          "valor": 40
        },
        {
          "tipo": "valorVariavel",
          "nome": "resumo",
          "valor": "Sol"
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "desestruturacao"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "const { nome, preco } = item lê esses campos e cria variáveis locais com seus valores."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const ficha = { titulo: \"Sol\", paginas: 40 }; const { titulo, paginas } = ficha; let resumo = titulo"
      }
    ]
  },
  {
    "id": "desestruturacao-objeto-js-2",
    "conceito": "desestruturacao-objeto-js",
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
      "dica": "const { nome, preco } = item lê esses campos e cria variáveis locais com seus valores."
    },
    "previsao": {
      "pergunta": "const p = {nome: \"Eva\", idade: 6}; const {nome} = p; nome vale o quê?",
      "opcoes": [
        "p inteiro",
        "\"Eva\"",
        "undefined"
      ],
      "correta": 1,
      "explicacao": "Desestruturar lê o campo nome, sem apagar a ficha."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  }
];

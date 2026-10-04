/* Ação em contexto novo e previsão autossuficiente: duas revisões por conceito. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_LISTAS_U1: ItemRevisao[] = [
  {
    "id": "array-js-1",
    "conceito": "array-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const notas = [6, 9] e guarde quantidade = notas.length.",
      "toque": "Crie const notas = [6, 9] e guarde quantidade = notas.length."
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
          "nome": "notas",
          "valor": [
            6,
            9
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "quantidade",
          "valor": 2
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "array"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Uma lista guarda vários valores em vagões numerados, na ordem escrita."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const notas = [6, 9]; let quantidade = notas.length"
      }
    ]
  },
  {
    "id": "array-js-2",
    "conceito": "array-js",
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
      "dica": "Uma lista guarda vários valores em vagões numerados, na ordem escrita."
    },
    "previsao": {
      "pergunta": "const cores = [\"azul\", \"verde\"]; quantos valores há?",
      "opcoes": [
        "1",
        "2",
        "3"
      ],
      "correta": 1,
      "explicacao": "Cada valor ocupa um vagão: são dois."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "indice-lista-js-1",
    "conceito": "indice-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie pontos = [7, 4]; guarde primeiro = pontos[0] e ausente = typeof pontos[2].",
      "toque": "Crie pontos = [7, 4]; guarde primeiro = pontos[0] e ausente = typeof pontos[2]."
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
          "nome": "primeiro",
          "valor": 7
        },
        {
          "tipo": "valorVariavel",
          "nome": "ausente",
          "valor": "undefined"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "O primeiro índice é 0. Ler uma posição ausente devolve undefined, sem erro."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const pontos = [7, 4]; let primeiro = pontos[0]; let ausente = typeof pontos[2]"
      }
    ]
  },
  {
    "id": "indice-lista-js-2",
    "conceito": "indice-lista-js",
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
      "dica": "O primeiro índice é 0. Ler uma posição ausente devolve undefined, sem erro."
    },
    "previsao": {
      "pergunta": "const fila = [\"Bia\", \"Leo\", \"Ana\"]; fila[3] vale o quê?",
      "opcoes": [
        "\"Ana\"",
        "Um erro",
        "undefined"
      ],
      "correta": 2,
      "explicacao": "Os índices existentes são 0, 1 e 2."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "length-lista-js-1",
    "conceito": "length-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie etapas = [2, 4, 8, 16]; guarde ultimo = etapas[etapas.length - 1].",
      "toque": "Crie etapas = [2, 4, 8, 16]; guarde ultimo = etapas[etapas.length - 1]."
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
          "nome": "ultimo",
          "valor": 16
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "length conta os itens; o último índice de uma lista não vazia é length - 1."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const etapas = [2, 4, 8, 16]; let ultimo = etapas[etapas.length - 1]"
      }
    ]
  },
  {
    "id": "length-lista-js-2",
    "conceito": "length-lista-js",
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
      "dica": "length conta os itens; o último índice de uma lista não vazia é length - 1."
    },
    "previsao": {
      "pergunta": "Uma lista tem length 4. Qual é o último índice?",
      "opcoes": [
        "3",
        "4",
        "5"
      ],
      "correta": 0,
      "explicacao": "Contamos quatro itens, numerados de 0 a 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "push-pop-js-1",
    "conceito": "push-pop-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie livros = [\"A\", \"B\"]; acrescente \"C\" com push e guarde retirado = livros.pop().",
      "toque": "Crie livros = [\"A\", \"B\"]; acrescente \"C\" com push e guarde retirado = livros.pop()."
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
          "nome": "livros",
          "valor": [
            "A",
            "B"
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "retirado",
          "valor": "C"
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
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "push acrescenta ao fim; pop tira e devolve o último item da lista."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const livros = [\"A\", \"B\"]; livros.push(\"C\"); let retirado = livros.pop()"
      }
    ]
  },
  {
    "id": "push-pop-js-2",
    "conceito": "push-pop-js",
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
      "dica": "push acrescenta ao fim; pop tira e devolve o último item da lista."
    },
    "previsao": {
      "pergunta": "const pilha = [1, 2]; pilha.push(3); pilha.pop(); como fica pilha?",
      "opcoes": [
        "[1, 2, 3]",
        "[1, 2]",
        "[1]"
      ],
      "correta": 1,
      "explicacao": "Entrou 3 e saiu o último: 3."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "const-lista-js-1",
    "conceito": "const-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const vagas = [3, 5] e troque vagas[0] por 4.",
      "toque": "Crie const vagas = [3, 5] e troque vagas[0] por 4."
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
          "nome": "vagas",
          "valor": [
            4,
            5
          ]
        },
        {
          "tipo": "usouSintaxe",
          "sintaxe": "const"
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "const impede trocar a lista inteira, mas permite alterar seus itens."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const vagas = [3, 5]; vagas[0] = 4"
      }
    ]
  },
  {
    "id": "const-lista-js-2",
    "conceito": "const-lista-js",
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
      "dica": "const impede trocar a lista inteira, mas permite alterar seus itens."
    },
    "previsao": {
      "pergunta": "const idades = [10]; idades[0] = 11; o que acontece?",
      "opcoes": [
        "TypeError",
        "A lista fica [10]",
        "A lista fica [11]"
      ],
      "correta": 2,
      "explicacao": "A variável continua apontando à mesma lista; seu conteúdo mudou."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "referencia-lista-js-1",
    "conceito": "referencia-lista-js",
    "tipo": "acao",
    "enunciado": {
      "mouse": "Crie const tarefas = [\"ler\"]; let outra = tarefas; outra.push(\"treinar\").",
      "toque": "Crie const tarefas = [\"ler\"]; let outra = tarefas; outra.push(\"treinar\")."
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
          "nome": "tarefas",
          "valor": [
            "ler",
            "treinar"
          ]
        },
        {
          "tipo": "valorVariavel",
          "nome": "outra",
          "valor": [
            "ler",
            "treinar"
          ]
        },
        {
          "tipo": "semErro"
        }
      ]
    },
    "ajudas": {
      "pergunta": "Qual valor ou relação precisa aparecer ao terminar?",
      "dica": "Atribuir uma lista a outra variável compartilha a lista; não copia os vagões."
    },
    "solucaoDeTeste": [
      {
        "tipo": "executarNoConsole",
        "codigo": "const tarefas = [\"ler\"]; let outra = tarefas; outra.push(\"treinar\")"
      }
    ]
  },
  {
    "id": "referencia-lista-js-2",
    "conceito": "referencia-lista-js",
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
      "dica": "Atribuir uma lista a outra variável compartilha a lista; não copia os vagões."
    },
    "previsao": {
      "pergunta": "let a = [2]; let b = a; b[0] = 9; a[0] vale quanto?",
      "opcoes": [
        "9",
        "2",
        "undefined"
      ],
      "correta": 0,
      "explicacao": "As duas variáveis apontam para a mesma lista."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];

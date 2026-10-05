/* Estrutura no palco, bordas reais e treino da mesma habilidade em contexto distinto. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_ESTRUTURAS_U3_F1: Fase = {
  "id": "logica-estruturas-de-dados-u3-f1",
  "tipo": "pratica",
  "unidadeId": "logica-estruturas-de-dados-u3",
  "titulo": "Cada canteiro tem uma chave",
  "conceitos": [
    "dicionario-map",
    "objeto-ou-map"
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
      "texto": "Uma ficha com nome e preço conhecidos cabe em objeto. Um cadastro que ganha e perde chaves usa Map; chaves podem ser números ou objetos.",
      "expressao": "apontando"
    },
    {
      "texto": "Na estufa, cada nome de canteiro aponta sua umidade: set grava, get lê, has verifica. set na mesma chave troca o valor, sem criar outro par.",
      "expressao": "apontando"
    },
    {
      "texto": "get de chave ausente devolve undefined. has é a pergunta certa sobre existência: umidade 0 existe e também pede água.",
      "expressao": "apontando"
    }
  ],
  "objetivos": [
    {
      "id": "map-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Crie umidade com Map; guarde as leituras de ervas e tomates. Leia ervas, confira has e regue se abaixo de 30.",
        "toque": "Crie umidade com Map; guarde as leituras de ervas e tomates. Leia ervas, confira has e regue se abaixo de 30."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "leitura",
            "valor": 20
          },
          {
            "tipo": "valorVariavel",
            "nome": "existe",
            "valor": true
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "agua",
            "propriedade": "ligado",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:set"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:get"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:has"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Use new Map(), set(nome, valor), get(\"ervas\") e has(\"ervas\").",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use new Map(), set(nome, valor), get(\"ervas\") e has(\"ervas\")."
        },
        "solucao": {
          "fala": "Compare a regra e o resultado no palco.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const umidade = new Map();\numidade.set(\"ervas\", sensorErvas.valor);\numidade.set(\"tomates\", sensorTomates.valor);\nconst leitura = umidade.get(\"ervas\");\nconst existe = umidade.has(\"ervas\");\nif (existe && leitura < 30) agua.ligar();"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "O nome é a chave; a leitura é o valor. A água usa o que get devolveu.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const umidade = new Map();\numidade.set(\"ervas\", sensorErvas.valor);\numidade.set(\"tomates\", sensorTomates.valor);\nconst leitura = umidade.get(\"ervas\");\nconst existe = umidade.has(\"ervas\");\nif (existe && leitura < 30) agua.ligar();"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "map-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Espere 2.000 ms e atualize ervas com a nova leitura do sensor. Leia de novo, desligue a água e confira has(\"flores\").",
        "toque": "Espere 2.000 ms e atualize ervas com a nova leitura do sensor. Leia de novo, desligue a água e confira has(\"flores\")."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "leitura",
            "valor": 55
          },
          {
            "tipo": "valorVariavel",
            "nome": "existe",
            "valor": true
          },
          {
            "tipo": "valorVariavel",
            "nome": "faltou",
            "valor": false
          },
          {
            "tipo": "estadoNaCena",
            "dispositivo": "agua",
            "propriedade": "ligado",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:set"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:get"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:has"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Que item é lido ou retirado agora? E se a estrutura estiver vazia?",
        "dica": "Use esperar(2000), depois set(\"ervas\", sensorErvas.valor). A mesma chave ganha a leitura nova."
      },
      "falaAoConcluir": {
        "texto": "Objeto descreve o sensor; Map relaciona nomes aos valores de muitos canteiros.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 1
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const umidade = new Map();\numidade.set(\"ervas\", sensorErvas.valor);\numidade.set(\"tomates\", sensorTomates.valor);\nesperar(2000);\numidade.set(\"ervas\", sensorErvas.valor);\nconst leitura = umidade.get(\"ervas\");\nconst existe = umidade.has(\"ervas\");\nif (existe && leitura < 30) agua.ligar();\nelse agua.desligar();\nconst faltou = umidade.has(\"flores\");"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Após set(\"ervas\",20) e set(\"ervas\",55), quanto get(\"ervas\") devolve?",
        "opcoes": [
          "20",
          "55",
          "[20,55]"
        ],
        "correta": 1,
        "explicacao": "A chave é a mesma: o valor passa a 55."
      }
    },
    {
      "id": "escolha-guiado",
      "tipo": "acao",
      "modo": "guiado",
      "enunciado": {
        "mouse": "Descreva ficha com nome Ervas e limite 30. Em pares, guarde 1 como \"número\" e \"1\" como \"texto\"; consulte cada chave.",
        "toque": "Descreva ficha com nome Ervas e limite 30. Em pares, guarde 1 como \"número\" e \"1\" como \"texto\"; consulte cada chave."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "ficha",
            "valor": {
              "nome": "Ervas",
              "limite": 30
            }
          },
          {
            "tipo": "valorVariavel",
            "nome": "numerica",
            "valor": "número"
          },
          {
            "tipo": "valorVariavel",
            "nome": "textual",
            "valor": "texto"
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantas",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:set"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:get"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Você descreve uma coisa com campos conhecidos ou registra pares por chaves?",
        "dica": "Crie ficha como objeto; crie pares com Map. O número e o texto são chaves distintas.",
        "linha": {
          "alvo": "snippet",
          "linhas": [
            1
          ],
          "fala": "Use {nome:\"Ervas\",limite:30} para a ficha e set para os pares."
        },
        "solucao": {
          "fala": "Compare o objeto com os pares do Map.",
          "acoes": [
            {
              "tipo": "definirSnippet",
              "codigo": "const ficha = {nome:\"Ervas\", limite:30};\nconst pares = new Map();\npares.set(1, \"número\");\npares.set(\"1\", \"texto\");\nconst numerica = pares.get(1);\nconst textual = pares.get(\"1\");\nconst quantas = pares.size;"
            },
            {
              "tipo": "executarSnippet"
            }
          ]
        }
      },
      "falaAoConcluir": {
        "texto": "Objeto reúne os campos de uma ficha. Map guarda pares por chave, preservando o tipo de cada chave.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const ficha = {nome:\"Ervas\", limite:30};\nconst pares = new Map();\npares.set(1, \"número\");\npares.set(\"1\", \"texto\");\nconst numerica = pares.get(1);\nconst textual = pares.get(\"1\");\nconst quantas = pares.size;"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "escolha-sozinho",
      "tipo": "previsao",
      "modo": "sozinho",
      "enunciado": {
        "mouse": "Mantenha ficha como objeto; em pares, guarde 2 como \"canteiro A\" e \"2\" como \"canteiro B\". Consulte cada chave.",
        "toque": "Mantenha ficha como objeto; em pares, guarde 2 como \"canteiro A\" e \"2\" como \"canteiro B\". Consulte cada chave."
      },
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "ficha",
            "valor": {
              "nome": "Ervas",
              "limite": 30
            }
          },
          {
            "tipo": "valorVariavel",
            "nome": "numerica",
            "valor": "canteiro A"
          },
          {
            "tipo": "valorVariavel",
            "nome": "textual",
            "valor": "canteiro B"
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantas",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:set"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:get"
          }
        ]
      },
      "ajudas": {
        "pergunta": "Você descreve uma coisa com campos conhecidos ou registra pares por chaves?",
        "dica": "Crie ficha como objeto; crie pares com Map. O número e o texto são chaves distintas."
      },
      "falaAoConcluir": {
        "texto": "Objeto reúne os campos de uma ficha. Map guarda pares por chave, preservando o tipo de cada chave.",
        "expressao": "feliz"
      },
      "solucaoDeTeste": [
        {
          "tipo": "responderPrevisao",
          "opcao": 2
        },
        {
          "tipo": "definirSnippet",
          "codigo": "const ficha = {nome:\"Ervas\", limite:30};\nconst pares = new Map();\npares.set(2, \"canteiro A\");\npares.set(\"2\", \"canteiro B\");\nconst numerica = pares.get(2);\nconst textual = pares.get(\"2\");\nconst quantas = pares.size;"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "previsao": {
        "pergunta": "Um canteiro tem nome e limite fixos; uma tabela associa códigos variados às leituras. Qual escolha combina?",
        "opcoes": [
          "Map para tudo, sempre",
          "Só listas",
          "Objeto para a ficha; Map para os pares"
        ],
        "correta": 2,
        "explicacao": "A ficha descreve uma coisa; o Map relaciona chaves e valores que entram e saem."
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
    "id": "map-estufa",
    "titulo": "Umidade por canteiro",
    "ambiente": "estufa",
    "periodo": "dia",
    "duracaoMs": 4000,
    "cenario": [
      {
        "peca": "ceu",
        "x": 0,
        "y": 0
      },
      {
        "peca": "estufa",
        "x": 17,
        "y": 10
      },
      {
        "peca": "piso",
        "x": 0,
        "y": 150
      },
      {
        "peca": "canteiro",
        "x": 28,
        "y": 125
      },
      {
        "peca": "canteiro",
        "x": 178,
        "y": 125,
        "variante": "tomates"
      }
    ],
    "dispositivos": [
      {
        "id": "sensorErvas",
        "tipo": "sensorUmidade",
        "x": 85,
        "y": 122,
        "inicial": {
          "valor": 20
        }
      },
      {
        "id": "sensorTomates",
        "tipo": "sensorUmidade",
        "x": 238,
        "y": 122,
        "inicial": {
          "valor": 60
        }
      },
      {
        "id": "agua",
        "tipo": "aspersor",
        "x": 145,
        "y": 115
      }
    ],
    "linhaDoTempo": [
      {
        "em": 2000,
        "dispositivo": "sensorErvas",
        "propriedade": "valor",
        "valor": 55
      }
    ]
  }
};

/* Caça ao bug: reproduzir, hipótese, evidência e conserto com bordas. */
import type { Fase } from "@/conteudo/tipos";
export const FASE_DEPURACAO_U3_F3: Fase = {
  "id": "logica-depuracao-u3-f3",
  "tipo": "desafio",
  "unidadeId": "logica-depuracao-u3",
  "titulo": "O recibo do cinema",
  "conceitos": [],
  "revisa": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso",
    "passar-por-cima",
    "entrar-e-sair",
    "retorno-no-depurador"
  ],
  "prerequisitos": [
    "ler-mensagem-de-erro",
    "funcao-js",
    "return-js",
    "escopo-bloco-js",
    "array-js",
    "for-js",
    "igualdade-estrita",
    "dicionario-de-erros",
    "causa-do-erro",
    "ponto-de-parada",
    "hipotese-de-bug",
    "bug-silencioso",
    "passar-por-cima",
    "entrar-e-sair",
    "retorno-no-depurador"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo",
    "pontos-de-parada",
    "controles-depurador",
    "painel-escopo",
    "painel-observar",
    "pilha-de-chamadas",
    "casos-de-teste"
  ],
  "siteAlvo": {
    "url": "console",
    "titulo": "Palco da memória",
    "head": "",
    "body": ""
  },
  "programa": {
    "snippet": {
      "nome": "investigacao.js",
      "codigoInicial": "function desconto(preco) {\n  const valor = preco * 0.2;\n  console.log(preco - valor);\n}\nconst pago = desconto(50);\nconsole.log(pago);"
    }
  },
  "areas": [
    "snippet",
    "palco",
    "testes"
  ],
  "introducao": [
    {
      "texto": "desconto(preco) deve devolver o preço com 20% de desconto. O recibo de 50 precisa mostrar 40, mas o valor recebido está errado.",
      "expressao": "curioso"
    },
    {
      "texto": "Investigue uma chamada com os controles, compare os valores e confirme o conserto pelos testes.",
      "expressao": "curioso"
    }
  ],
  "conclusao": [
    {
      "texto": "Você reproduziu, comparou pistas com uma hipótese e testou o conserto. Investigar com método evita criar bugs novos.",
      "expressao": "curioso"
    }
  ],
  "falaFinal": {
    "texto": "Um resultado sem erro também pode estar errado. Confira exemplos e bordas antes de encerrar.",
    "expressao": "curioso"
  },
  "partes": [
    {
      "id": "investigar",
      "descricao": "Siga uma chamada e registre a evidência antes de editar.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "usouControle",
            "controle": "entrar"
          },
          {
            "tipo": "usouControle",
            "controle": "sair"
          },
          {
            "tipo": "observou",
            "expressao": "pago === undefined",
            "valor": true
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "executarSnippet"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "entrar"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "sair"
        },
        {
          "tipo": "observar",
          "expressao": "pago === undefined"
        },
        {
          "tipo": "controlarDepurador",
          "controle": "retomar"
        }
      ],
      "revisarEm": "logica-depuracao-u3-f2"
    },
    {
      "id": "codigo",
      "descricao": "Entregue desconto correto para zero, preços pequenos e grandes.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "semErro"
          },
          {
            "tipo": "funcaoPassa",
            "nome": "desconto",
            "casos": [
              {
                "args": [
                  0
                ],
                "esperado": 0
              },
              {
                "args": [
                  5
                ],
                "esperado": 4
              },
              {
                "args": [
                  125
                ],
                "esperado": 100
              }
            ]
          }
        ]
      },
      "solucaoDeTeste": [
        {
          "tipo": "alternarPontoDeParada",
          "linha": 5
        },
        {
          "tipo": "definirSnippet",
          "codigo": "function desconto(preco) {\n  const valor = preco * 0.2;\n  return preco - valor;\n}\nconst pago = desconto(50);\nconsole.log(pago);"
        },
        {
          "tipo": "executarSnippet"
        }
      ],
      "revisarEm": "logica-depuracao-u3-f2"
    },
    {
      "id": "testes",
      "descricao": "Rode os casos visíveis e um preço novo escolhido por você.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 3,
        "passando": true
      },
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "125",
          "esperado": "100"
        },
        {
          "tipo": "rodarCasos"
        }
      ],
      "revisarEm": "logica-depuracao-u3-f2"
    }
  ],
  "missaoDeCampo": "No Chrome, abra DevTools > Sources > Snippets, crie um Snippet curto e execute. Marque um ponto no número da linha; use F10, F11 e Shift+F11 e confira Scope e Watch.",
  "testes": {
    "funcao": "desconto",
    "parametros": [
      "preco"
    ],
    "inicial": [
      {
        "entrada": "0",
        "esperado": "0"
      },
      {
        "entrada": "50",
        "esperado": "40"
      }
    ]
  }
};

/* Cinco passos: entender, decompor, planejar, programar e testar; dependências mínimas. */
import type { Fase } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_RESOLVER_U2_F3: Fase = {
  "id": "logica-resolvendo-problemas-u2-f3",
  "tipo": "desafio",
  "unidadeId": "logica-resolvendo-problemas-u2",
  "titulo": "Os horários da oficina",
  "conceitos": [
    "pseudocodigo"
  ],
  "revisa": [
    "funcao-js",
    "return-js",
    "array-js",
    "objeto-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
  ],
  "prerequisitos": [
    "funcao-js",
    "return-js",
    "array-js",
    "objeto-js",
    "for-of-js",
    "acumulador-js",
    "if-js"
  ],
  "usaFerramentas": [
    "quadro-de-passos",
    "plano-no-codigo",
    "snippet",
    "console",
    "palco-memoria",
    "linha-do-tempo",
    "casos-de-teste"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "introducao": [
    {
      "texto": "horarios é uma lista de fichas {ocupado: true ou false}. Devolva quantos horários estão livres. [] dá 0; duas fichas livres dão 2.",
      "expressao": "apontando"
    },
    {
      "texto": "Outro negócio, o problema inteiro: entenda entrada, saída e exemplos; planeje, programe e teste suas bordas.",
      "expressao": "apontando"
    },
    {
      "texto": "Teste agenda vazia, tudo ocupado e duas fichas livres.",
      "expressao": "apontando"
    }
  ],
  "conclusao": [
    {
      "texto": "Entender, decompor, planejar, programar e testar: guarde esse caminho.",
      "expressao": "apontando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, some gastos: defina entrada/saída, agrupe, escreva o plano em comentários, faça a função e teste [], [0] e [3, 3].",
  "falaFinal": {
    "texto": "Confira as bordas antes de seguir.",
    "expressao": "apontando"
  },
  "areas": [
    "plano",
    "snippet",
    "palco",
    "testes"
  ],
  "plano": {
    "modo": "ordenar",
    "problema": "Os horários da oficina",
    "cartoes": [
      {
        "id": "zerar",
        "texto": "Começa sem horários livres contados"
      },
      {
        "id": "ler",
        "texto": "Olha cada horário",
        "depoisDe": [
          "zerar"
        ]
      },
      {
        "id": "somar",
        "texto": "Se não estiver ocupado, conta mais um",
        "depoisDe": [
          "ler"
        ]
      },
      {
        "id": "devolver",
        "texto": "Entrega quantos estão livres",
        "depoisDe": [
          "somar"
        ]
      },
      {
        "id": "sobra",
        "texto": "Começar o código sem conferir a pergunta",
        "sobra": true
      }
    ]
  },
  "testes": {
    "funcao": "livres",
    "parametros": [
      "horarios"
    ]
  },
  "programa": {
    "snippet": {
      "nome": "livres.js",
      "codigoInicial": ""
    }
  },
  "partes": [
    {
      "id": "plano",
      "descricao": "Monte o plano por dependências, sem distrações.",
      "validador": {
        "tipo": "ordemValida"
      },
      "revisarEm": "logica-resolvendo-problemas-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "porPasso",
          "passo": "zerar"
        },
        {
          "tipo": "porPasso",
          "passo": "ler"
        },
        {
          "tipo": "porPasso",
          "passo": "somar"
        },
        {
          "tipo": "porPasso",
          "passo": "devolver"
        }
      ]
    },
    {
      "id": "comentarios",
      "descricao": "Leve o plano ao código como comentários.",
      "validador": {
        "tipo": "planoComentado"
      },
      "revisarEm": "logica-resolvendo-problemas-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "levarPlanoProCodigo"
        }
      ]
    },
    {
      "id": "codigo",
      "descricao": "Escreva livres com as entradas e a saída pedidas; execute.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "funcaoPassa",
            "nome": "livres",
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
                      "ocupado": false
                    },
                    {
                      "ocupado": false
                    }
                  ]
                ],
                "esperado": 2
              },
              {
                "args": [
                  [
                    {
                      "ocupado": true
                    }
                  ]
                ],
                "esperado": 0
              },
              {
                "args": [
                  [
                    {
                      "ocupado": true
                    },
                    {
                      "ocupado": false
                    }
                  ]
                ],
                "esperado": 1
              }
            ]
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-resolvendo-problemas-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "// Plano: Os horários da oficina\n// 1. Começa sem horários livres contados\n// 2. Olha cada horário\n// 3. Se não estiver ocupado, conta mais um\n// 4. Entrega quantos estão livres\n\nfunction livres(horarios) {\n let total = 0;\n for (const h of horarios) if (!h.ocupado) total++;\n return total;\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "testes",
      "descricao": "Escreva seus casos: comum e todas as bordas pedidas, e rode.",
      "validador": {
        "tipo": "casosDoAluno",
        "minimo": 3,
        "incluir": [
          {
            "args": [
              []
            ],
            "rotulo": "agenda vazia"
          },
          {
            "args": [
              [
                {
                  "ocupado": true
                }
              ]
            ],
            "rotulo": "nenhum horário livre"
          }
        ],
        "passando": true
      },
      "revisarEm": "logica-resolvendo-problemas-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "escreverCaso",
          "entrada": "[{ocupado:false},{ocupado:false}]",
          "esperado": "2"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[]",
          "esperado": "0"
        },
        {
          "tipo": "escreverCaso",
          "entrada": "[{ocupado:true}]",
          "esperado": "0"
        },
        {
          "tipo": "rodarCasos"
        }
      ]
    }
  ]
};

/*
 * Decisões U3, Fase 5: Classificador de pedidos.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U3_F5: FaseDesafio = {
  "id": "logica-decisoes-u3-f5",
  "tipo": "desafio",
  "unidadeId": "logica-decisoes-u3",
  "titulo": "Classificador de pedidos",
  "conceitos": [
    "if-js",
    "bloco-js",
    "else-js",
    "else-if-js",
    "condicao-composta"
  ],
  "revisa": [
    "comparacao-js",
    "console-log"
  ],
  "prerequisitos": [
    "if-js",
    "else-js",
    "else-if-js",
    "condicao-composta"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {},
  "introducao": [
    {
      "texto": "Na Lanchonete Boca Cheia, cada pedido é classificado pelo número de itens. Escreva a decisão sem passo a passo e teste cada faixa.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "pequeno",
      "descricao": "Com itens = 2, mostre \"Pequeno\" (1 ou 2 itens) com uma cadeia if / else if / else.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Pequeno"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u3-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let itens = 2\nif (itens <= 0 || itens > 20) {\n  console.log(\"Pedido inválido\")\n} else if (itens <= 2) {\n  console.log(\"Pequeno\")\n} else if (itens <= 5) {\n  console.log(\"Médio\")\n} else if (itens >= 6 && itens <= 20) {\n  console.log(\"Grande\")\n}"
        }
      ]
    },
    {
      "id": "medio",
      "descricao": "Com itens = 4, mostre \"Médio\" (3 a 5 itens).",
      "validador": {
        "tipo": "saida",
        "igual": [
          "Médio"
        ]
      },
      "revisarEm": "logica-decisoes-u3-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let itens = 4\nif (itens <= 0 || itens > 20) {\n  console.log(\"Pedido inválido\")\n} else if (itens <= 2) {\n  console.log(\"Pequeno\")\n} else if (itens <= 5) {\n  console.log(\"Médio\")\n} else if (itens >= 6 && itens <= 20) {\n  console.log(\"Grande\")\n}"
        }
      ]
    },
    {
      "id": "grande",
      "descricao": "Com itens = 8, mostre \"Grande\" (6 a 20 itens): use && para dizer 6 ou mais E 20 ou menos.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Grande"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let itens = 8\nif (itens <= 0 || itens > 20) {\n  console.log(\"Pedido inválido\")\n} else if (itens <= 2) {\n  console.log(\"Pequeno\")\n} else if (itens <= 5) {\n  console.log(\"Médio\")\n} else if (itens >= 6 && itens <= 20) {\n  console.log(\"Grande\")\n}"
        }
      ]
    },
    {
      "id": "invalido",
      "descricao": "Com itens = 0, mostre \"Pedido inválido\": zero ou menos OU mais de 20 (use ||).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Pedido inválido"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let itens = 0\nif (itens <= 0 || itens > 20) {\n  console.log(\"Pedido inválido\")\n} else if (itens <= 2) {\n  console.log(\"Pequeno\")\n} else if (itens <= 5) {\n  console.log(\"Médio\")\n} else if (itens >= 6 && itens <= 20) {\n  console.log(\"Grande\")\n}"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você escreveu um programa que escolhe caminhos, num contexto novo e sem receita pronta.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site, crie let itens = 7 e escreva um if / else if / else que classifique em 'Pequeno', 'Médio' ou 'Grande'. Troque itens e confira as faixas.",
  "falaFinal": {
    "texto": "Leve o if para o Console de verdade: todo programa que escolhe um caminho usa essa estrutura.",
    "expressao": "feliz"
  }
};

/*
 * Decisões U1, Fase 6: Frete grátis na papelaria.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U1_F6: FaseDesafio = {
  "id": "logica-decisoes-u1-f6",
  "tipo": "desafio",
  "unidadeId": "logica-decisoes-u1",
  "titulo": "Frete grátis na papelaria",
  "conceitos": [
    "booleano-js",
    "comparacao-js",
    "limite-da-comparacao",
    "atribuir-ou-comparar"
  ],
  "revisa": [
    "igualdade-estrita",
    "igualdade-solta"
  ],
  "prerequisitos": [
    "booleano-js",
    "comparacao-js",
    "limite-da-comparacao",
    "atribuir-ou-comparar"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let valorCompra = 120\nlet cupom = \"FRETE10\"\nlet pedido = 3\nlet estoque = 5\nlet quantidadeTexto = \"3\""
  },
  "introducao": [
    {
      "texto": "Na loja virtual Lápis de Cor, o frete e o cupom viram perguntas de sim ou não. Sem passo a passo: use o que você já sabe.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "frete",
      "descricao": "Guarde em freteGratis se valorCompra é maior ou igual a 100.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "freteGratis",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comparacao"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let freteGratis = valorCompra >= 100"
        }
      ]
    },
    {
      "id": "cupom",
      "descricao": "Guarde em cupomValido se cupom é igual a \"FRETE10\" (use ===).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "cupomValido",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let cupomValido = cupom === \"FRETE10\""
        }
      ]
    },
    {
      "id": "estoque",
      "descricao": "Guarde em temEstoque se estoque é maior ou igual a pedido.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "temEstoque",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comparacao"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let temEstoque = estoque >= pedido"
        }
      ]
    },
    {
      "id": "exato",
      "descricao": "Guarde em ehExato se valorCompra é exatamente 100, sem mudar valorCompra.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "ehExato",
            "valor": false
          },
          {
            "tipo": "valorVariavel",
            "nome": "valorCompra",
            "valor": 120
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u1-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let ehExato = valorCompra === 100"
        }
      ]
    },
    {
      "id": "tipo",
      "descricao": "Pergunte o typeof de freteGratis no Console.",
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "boolean"
      },
      "revisarEm": "logica-decisoes-u1-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof freteGratis"
        }
      ]
    },
    {
      "id": "texto",
      "descricao": "Guarde em mesmoTipo se quantidadeTexto é igual a pedido com ===.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "mesmoTipo",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "igualdade-estrita"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u1-f5",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let mesmoTipo = quantidadeTexto === pedido"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você transformou regras de loja em perguntas de sim ou não, sem receita pronta.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e invente a regra de frete de uma loja: let total = 150 e let gratis = total >= 100. Troque o total e veja o booleano mudar.",
  "falaFinal": {
    "texto": "Leve as perguntas de sim ou não para o Console de verdade: toda decisão de um programa começa assim.",
    "expressao": "feliz"
  }
};

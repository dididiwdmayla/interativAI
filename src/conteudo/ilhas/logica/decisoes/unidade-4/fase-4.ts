/*
 * Decisões U4, Fase 4: Cadastro da academia.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U4_F4: FaseDesafio = {
  "id": "logica-decisoes-u4-f4",
  "tipo": "desafio",
  "unidadeId": "logica-decisoes-u4",
  "titulo": "Cadastro da academia",
  "conceitos": [
    "falsy-js",
    "truthy-js",
    "dupla-negacao"
  ],
  "revisa": [
    "if-js",
    "else-js",
    "comparacao-js"
  ],
  "prerequisitos": [
    "falsy-js",
    "truthy-js",
    "dupla-negacao"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let nome = \"Rafa\"\nlet telefone = \"\"\nlet plano = \"0\"\nlet modalidades = []\nlet idade = 0"
  },
  "introducao": [
    {
      "texto": "Na Academia Vitalidade, o formulário de cadastro precisa conferir cada campo. Cuidado com os valores que enganam. Sem passo a passo.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "nome-ok",
      "descricao": "Guarde em nomeOk o booleano de nome, usando !!.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "nomeOk",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let nomeOk = !!nome"
        }
      ]
    },
    {
      "id": "telefone-ok",
      "descricao": "Guarde em telefoneOk o booleano de telefone (vazio), usando !!.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "telefoneOk",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let telefoneOk = !!telefone"
        }
      ]
    },
    {
      "id": "plano-ok",
      "descricao": "Guarde em planoOk o booleano de plano, que guarda o texto \"0\".",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "planoOk",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let planoOk = !!plano"
        }
      ]
    },
    {
      "id": "modalidade",
      "descricao": "Guarde em escolheuModalidade se a lista modalidades tem itens (olhe o length).",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "escolheuModalidade",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "comparacao"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f2",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let escolheuModalidade = modalidades.length > 0"
        }
      ]
    },
    {
      "id": "telefone-obrigatorio",
      "descricao": "Mostre \"Telefone obrigatório\" com um if, porque telefone está vazio.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Telefone obrigatório"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (!telefone) {\n  console.log(\"Telefone obrigatório\")\n}"
        }
      ]
    },
    {
      "id": "idade-invalida",
      "descricao": "Mostre \"Idade inválida\" com um if, porque idade vale 0.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Idade inválida"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u4-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "if (!idade) {\n  console.log(\"Idade inválida\")\n}"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você validou um formulário com valores que enganam, sem receita pronta.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site, crie let campo = '' e confira com if (!campo) { console.log('Campo obrigatório') }. Depois teste com '0' e com [] e veja o que muda.",
  "falaFinal": {
    "texto": "Leve os valores falsos e verdadeiros para o Console de verdade: todo formulário usa essas regras.",
    "expressao": "feliz"
  }
};

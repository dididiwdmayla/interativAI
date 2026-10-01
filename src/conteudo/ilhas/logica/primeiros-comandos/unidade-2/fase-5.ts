/*
 * Lógica U2, Fase 5. Contexto novo: floricultura. Partes coexistem; a meta usa as caixinhas de dados e mensagem.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U2_F5: FaseDesafio = {
  "id": "logica-primeiros-comandos-u2-f5",
  "tipo": "desafio",
  "unidadeId": "logica-primeiros-comandos-u2",
  "titulo": "Confirmação na floricultura",
  "conceitos": [
    "string-js",
    "template-literal",
    "length-texto",
    "console-log"
  ],
  "revisa": [],
  "prerequisitos": [
    "string-js",
    "template-literal",
    "length-texto",
    "console-log"
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
      "texto": "A Floricultura Jardim da Ana recebe um pedido de Bia: 3 vasos. A entrega demora 40 minutos.",
      "expressao": "curioso"
    },
    {
      "texto": "Prepare a confirmação, confira seu tamanho e mostre a mensagem no Console.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "dados",
      "descricao": "Guarde cliente = \"Bia\", quantidade = 3 e minutos = 40 em variáveis.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "cliente",
            "valor": "Bia"
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidade",
            "valor": 3
          },
          {
            "tipo": "valorVariavel",
            "nome": "minutos",
            "valor": 40
          }
        ]
      },
      "revisarEm": "logica-primeiros-comandos-u2-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let cliente = \"Bia\"\nlet quantidade = 3\nlet minutos = 40"
        }
      ]
    },
    {
      "id": "confirmacao",
      "descricao": "Com template e os dados, guarde mensagem: \"Bia, seus 3 vasos chegam em 40 minutos.\"",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "mensagem",
            "valor": "Bia, seus 3 vasos chegam em 40 minutos."
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "template"
          }
        ]
      },
      "revisarEm": "logica-primeiros-comandos-u2-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let mensagem = `${cliente}, seus ${quantidade} vasos chegam em ${minutos} minutos.`"
        }
      ]
    },
    {
      "id": "tamanho",
      "descricao": "Guarde em tamanhoMensagem o tamanho da mensagem.",
      "validador": {
        "tipo": "valorVariavel",
        "nome": "tamanhoMensagem",
        "valor": 39
      },
      "revisarEm": "logica-primeiros-comandos-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let tamanhoMensagem = mensagem.length"
        }
      ]
    },
    {
      "id": "mostrar",
      "descricao": "Mostre a mensagem completa com console.log.",
      "validador": {
        "tipo": "saida",
        "igual": [
          "Bia, seus 3 vasos chegam em 40 minutos."
        ]
      },
      "revisarEm": "logica-primeiros-comandos-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "console.log(mensagem)"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você resolveu um pedido novo usando o que aprendeu, sem receita pronta.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e monte uma confirmação de pedido com template, conte os caracteres e mostre com console.log.",
  "falaFinal": {
    "texto": "Leve a habilidade para o Console de verdade: você já consegue conferir o que cada valor significa.",
    "expressao": "feliz"
  }
};

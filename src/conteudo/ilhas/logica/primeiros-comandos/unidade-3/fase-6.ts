/*
 * Lógica U3, Fase 6. Contexto novo: café e gorjeta. Taxa percentual revisa aritmética; saída e variáveis coexistem.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_LOGICA_U3_F6: FaseDesafio = {
  "id": "logica-primeiros-comandos-u3-f6",
  "tipo": "desafio",
  "unidadeId": "logica-primeiros-comandos-u3",
  "titulo": "Gorjeta sem juntar algarismos",
  "conceitos": [
    "tipo-js",
    "typeof-js",
    "conversao-number",
    "conversao-string",
    "coercao-js"
  ],
  "revisa": [],
  "prerequisitos": [
    "tipo-js",
    "typeof-js",
    "conversao-number",
    "conversao-string",
    "coercao-js"
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
      "texto": "No Café da Praça, a conta veio como texto: \"80\". A gorjeta é 10% do valor, e o total precisa somar números.",
      "expressao": "curioso"
    },
    {
      "texto": "Guarde o valor original, calcule a gorjeta e prepare a mensagem do recibo.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "entrada",
      "descricao": "Guarde contaTexto = \"80\" e percentual = 10 em variáveis.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "contaTexto",
            "valor": "80"
          },
          {
            "tipo": "valorVariavel",
            "nome": "percentual",
            "valor": 10
          }
        ]
      },
      "revisarEm": "logica-primeiros-comandos-u3-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let contaTexto = \"80\"\nlet percentual = 10"
        }
      ]
    },
    {
      "id": "converter",
      "descricao": "Converta contaTexto para número e guarde em conta.",
      "validador": {
        "tipo": "valorVariavel",
        "nome": "conta",
        "valor": 80
      },
      "revisarEm": "logica-primeiros-comandos-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let conta = Number(contaTexto)"
        }
      ]
    },
    {
      "id": "gorjeta",
      "descricao": "Guarde gorjeta: 10% da conta, usando conta e percentual.",
      "validador": {
        "tipo": "valorVariavel",
        "nome": "gorjeta",
        "valor": 8
      },
      "revisarEm": "logica-primeiros-comandos-u3-f3",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let gorjeta = conta * percentual / 100"
        }
      ]
    },
    {
      "id": "total",
      "descricao": "Guarde em total a conta mais a gorjeta. O resultado precisa ser numérico.",
      "validador": {
        "tipo": "valorVariavel",
        "nome": "total",
        "valor": 88
      },
      "revisarEm": "logica-primeiros-comandos-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let total = conta + gorjeta"
        }
      ]
    },
    {
      "id": "tipo",
      "descricao": "Pergunte typeof total no Console.",
      "validador": {
        "tipo": "respostaDoConsole",
        "valor": "number"
      },
      "revisarEm": "logica-primeiros-comandos-u3-f1",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "typeof total"
        }
      ]
    },
    {
      "id": "recibo",
      "descricao": "Converta total com String, guarde em totalTexto e mostre \"Total: R$ 88\" com console.log.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "totalTexto",
            "valor": "88"
          },
          {
            "tipo": "saida",
            "igual": [
              "Total: R$ 88"
            ]
          }
        ]
      },
      "revisarEm": "logica-primeiros-comandos-u3-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let totalTexto = String(total)\nconsole.log(\"Total: R$ \" + totalTexto)"
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
  "missaoDeCampo": "Abra o Console de qualquer site e compare \"2\" + 2 com Number(\"2\") + 2, confira os tipos e calcule a gorjeta de uma conta sua.",
  "falaFinal": {
    "texto": "Leve a habilidade para o Console de verdade: você já consegue conferir o que cada valor significa.",
    "expressao": "feliz"
  }
};

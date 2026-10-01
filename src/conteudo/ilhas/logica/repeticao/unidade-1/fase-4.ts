/* Repetição U1: A fila da farmácia. Snippet para o laço; palco e rastro para entender cada volta. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_REPETICAO_U1_F4: FaseDesafio = {
  "id": "logica-repeticao-u1-f4",
  "tipo": "desafio",
  "unidadeId": "logica-repeticao-u1",
  "titulo": "A fila da farmácia",
  "conceitos": [
    "while-js",
    "condicao-de-parada",
    "contador-js",
    "loop-infinito"
  ],
  "revisa": [
    "if-js",
    "concatenacao-js"
  ],
  "prerequisitos": [
    "while-js",
    "condicao-de-parada",
    "contador-js",
    "loop-infinito"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "snippet": {
      "nome": "A fila da farmácia",
      "codigoInicial": "// Monte o programa e confira o palco."
    }
  },
  "introducao": [
    {
      "texto": "Na Farmácia Boa Hora há três pessoas. Chame as senhas 1, 2 e 3; diminua restantes e encerre a fila quando zerar. Confira cada volta no palco.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "senhas",
      "descricao": "Com while, mostre Senha 1, Senha 2 e Senha 3, nessa ordem.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Senha 1",
              "Senha 2",
              "Senha 3"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "while"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u1-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let senha = 1\nlet restantes = 3\nwhile (restantes > 0) {\n  console.log(\"Senha \" + senha)\n  senha++\n  restantes--\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "fila-zerada",
      "descricao": "restantes deve acabar em 0 e senha em 4; use if para o aviso final.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "restantes",
            "valor": 0
          },
          {
            "tipo": "valorVariavel",
            "nome": "senha",
            "valor": 4
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "if"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-repeticao-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let senha = 1\nlet restantes = 3\nwhile (restantes > 0) {\n  console.log(\"Senha \" + senha)\n  senha++\n  restantes--\n}\nif (restantes === 0) { console.log(\"Fila encerrada\") }"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você resolveu um caso novo. Rebobine a linha do tempo e confira como cada caixinha chegou ao resultado.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, conte de 1 a 10 com while, sempre atualizando o contador. Confira que aparecem exatamente dez números; não rode o exemplo infinito fora do jogo.",
  "falaFinal": {
    "texto": "Esse mesmo JavaScript funciona no Console de qualquer site.",
    "expressao": "feliz"
  }
};

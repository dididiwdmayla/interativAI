/* Funções: dados declarativos; ação e previsão em contextos próprios. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_FUNCOES_U1_F3: FaseDesafio = {
  "id": "logica-funcoes-u1-f3",
  "tipo": "desafio",
  "unidadeId": "logica-funcoes-u1",
  "titulo": "As portas da loja",
  "conceitos": [
    "funcao-js",
    "chamada-funcao",
    "moldura-funcao"
  ],
  "revisa": [
    "if-js",
    "for-js",
    "console-log"
  ],
  "prerequisitos": [
    "funcao-js",
    "chamada-funcao",
    "moldura-funcao"
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
      "nome": "As portas da loja",
      "codigoInicial": "// Crie e chame as funções do desafio."
    }
  },
  "introducao": [
    {
      "texto": "Loja Girassol: crie abrir() e fechar() para mostrar as mensagens da loja quando forem chamadas.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "abrir",
      "descricao": "Crie abrir() e chame para mostrar \"Loja aberta\".",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Loja aberta"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u1-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function abrir() {\n  console.log(\"Loja aberta\")\n}\nabrir()"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "fechar",
      "descricao": "Crie fechar() e chame duas vezes com for para mostrar \"Até amanhã\" duas vezes.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Até amanhã",
              "Até amanhã"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "funcao"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for"
          }
        ]
      },
      "revisarEm": "logica-funcoes-u1-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "function fechar() {\n  console.log(\"Até amanhã\")\n}\nfor (let i = 0; i < 2; i++) {\n  fechar()\n}"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você criou funções em outro contexto. Confira a chamada e o resultado no palco, voltando pela linha do tempo.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie function saudar() { console.log('Olá') } e chame saudar() duas vezes.",
  "falaFinal": {
    "texto": "As molduras ajudam aqui; no mundo real o Console executa o mesmo JavaScript.",
    "expressao": "feliz"
  }
};

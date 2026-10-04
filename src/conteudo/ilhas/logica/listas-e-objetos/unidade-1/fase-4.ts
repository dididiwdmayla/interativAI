/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U1_F4: FaseDesafio = {
  "id": "logica-listas-e-objetos-u1-f4",
  "tipo": "desafio",
  "unidadeId": "logica-listas-e-objetos-u1",
  "titulo": "Playlist da festa",
  "conceitos": [
    "array-js",
    "indice-lista-js",
    "length-lista-js",
    "push-pop-js",
    "const-lista-js",
    "referencia-lista-js"
  ],
  "revisa": [
    "for-of-js",
    "console-log"
  ],
  "prerequisitos": [
    "array-js",
    "indice-lista-js",
    "length-lista-js",
    "push-pop-js",
    "const-lista-js",
    "referencia-lista-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "const playlist = [\"Calma\", \"Dança\", \"Final\"]",
    "snippet": {
      "nome": "Playlist da festa",
      "codigoInicial": "const playlist = [\"Calma\", \"Dança\", \"Final\"]"
    }
  },
  "introducao": [
    {
      "texto": "Agora use os dados em outro contexto. Resolva as partes e confira o antes e depois no palco.",
      "expressao": "apontando"
    }
  ],
  "partes": [
    {
      "id": "posicoes",
      "descricao": "Guarde abertura = playlist[0] e encerramento usando length - 1.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "abertura",
            "valor": "Calma"
          },
          {
            "tipo": "valorVariavel",
            "nome": "encerramento",
            "valor": "Final"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u1-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let abertura = playlist[0]\nlet encerramento = playlist[playlist.length - 1]"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "editar",
      "descricao": "Use pop para guardar removida. Depois push \"Bis\" e crie espelho = playlist; troque espelho[0] por \"Festa\".",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "removida",
            "valor": "Final"
          },
          {
            "tipo": "valorVariavel",
            "nome": "playlist",
            "valor": [
              "Festa",
              "Dança",
              "Bis"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "espelho",
            "valor": [
              "Festa",
              "Dança",
              "Bis"
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:push"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:pop"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let removida = playlist.pop()\nplaylist.push(\"Bis\")\nlet espelho = playlist\nespelho[0] = \"Festa\""
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "mostrar",
      "descricao": "Mostre cada música com for...of e guarde totalMusicas = playlist.length.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "saida",
            "igual": [
              "Festa",
              "Dança",
              "Bis"
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "totalMusicas",
            "valor": 3
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "for-of"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u1-f3",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "for (let musica of playlist) { console.log(musica) }\nlet totalMusicas = playlist.length"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você usou os dados para responder perguntas reais. Confira o resultado e a lista original.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [\"pão\", \"leite\"]; use compras.push(\"fruta\") e confira length: 3. Leia compras[2].",
  "falaFinal": {
    "texto": "Leve uma lista pequena para o Console real e confira suas previsões.",
    "expressao": "feliz"
  }
};

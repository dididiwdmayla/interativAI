/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U2_F5: FaseDesafio = {
  "id": "logica-listas-e-objetos-u2-f5",
  "tipo": "desafio",
  "unidadeId": "logica-listas-e-objetos-u2",
  "titulo": "Votação da turma",
  "conceitos": [
    "percorrer-lista-js",
    "map-lista-js",
    "filter-lista-js",
    "find-lista-js"
  ],
  "revisa": [
    "for-of-js",
    "if-js",
    "arrow-js"
  ],
  "prerequisitos": [
    "map-lista-js",
    "filter-lista-js",
    "find-lista-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "const votos = [4, 9, 2, 9]",
    "snippet": {
      "nome": "Votação da turma",
      "codigoInicial": "const votos = [4, 9, 2, 9]"
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
      "id": "somar",
      "descricao": "Some os votos em totalVotos com for...of.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "totalVotos",
            "valor": 24
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
      "revisarEm": "logica-listas-e-objetos-u2-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let totalVotos = 0\nfor (let quantidade of votos) { totalVotos += quantidade }"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "transformar",
      "descricao": "Use map e arrow para criar projetados, dobrando cada votação. Preserve votos.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "projetados",
            "valor": [
              8,
              18,
              4,
              18
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "votos",
            "valor": [
              4,
              9,
              2,
              9
            ]
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:map"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u2-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const projetados = votos.map(n => n * 2)"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "selecionar",
      "descricao": "Use filter para aprovados (votos >= 5) e find para primeiroAprovado. Guarde quantidadeAprovados.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "aprovados",
            "valor": [
              9,
              9
            ]
          },
          {
            "tipo": "valorVariavel",
            "nome": "primeiroAprovado",
            "valor": 9
          },
          {
            "tipo": "valorVariavel",
            "nome": "quantidadeAprovados",
            "valor": 2
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:filter"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "metodo:find"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "arrow"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "const aprovados = votos.filter(n => n >= 5)\nlet primeiroAprovado = votos.find(n => n >= 5)\nlet quantidadeAprovados = aprovados.length"
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
  "missaoDeCampo": "No Console de qualquer site, crie const compras = [2, 8, 15]; use compras.push(20). Filtre preços > 10 e confira length: 2.",
  "falaFinal": {
    "texto": "Leve uma lista pequena para o Console real e confira suas previsões.",
    "expressao": "feliz"
  }
};

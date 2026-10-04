/* Listas e objetos: palco, previsão e prática da mesma habilidade; desafio em contexto novo. */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";
export const FASE_LISTAS_U3_F3: FaseDesafio = {
  "id": "logica-listas-e-objetos-u3-f3",
  "tipo": "desafio",
  "unidadeId": "logica-listas-e-objetos-u3",
  "titulo": "Cadastro no pet shop",
  "conceitos": [
    "objeto-js",
    "acesso-objeto-js",
    "mudar-campo-js"
  ],
  "revisa": [
    "if-js",
    "array-js"
  ],
  "prerequisitos": [
    "objeto-js",
    "acesso-objeto-js",
    "mudar-campo-js"
  ],
  "usaFerramentas": [
    "console",
    "snippet",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "const pet = { nome: \"Luna\", especie: \"gato\", idade: 2 }",
    "snippet": {
      "nome": "Cadastro no pet shop",
      "codigoInicial": "const pet = { nome: \"Luna\", especie: \"gato\", idade: 2 }"
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
      "id": "ler",
      "descricao": "Leia especie das duas formas em especiePonto e especieChave; guarde tipoAusente = typeof pet.peso.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "especiePonto",
            "valor": "gato"
          },
          {
            "tipo": "valorVariavel",
            "nome": "especieChave",
            "valor": "gato"
          },
          {
            "tipo": "valorVariavel",
            "nome": "tipoAusente",
            "valor": "undefined"
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u3-f1",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "let especiePonto = pet.especie\nlet especieChave = pet[\"especie\"]\nlet tipoAusente = typeof pet.peso"
        },
        {
          "tipo": "executarSnippet"
        }
      ]
    },
    {
      "id": "atualizar",
      "descricao": "Atualize idade para 3; acrescente vacinado true e servicos = [\"banho\", \"consulta\"], preservando nome e especie.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "pet",
            "valor": {
              "nome": "Luna",
              "especie": "gato",
              "idade": 3,
              "vacinado": true,
              "servicos": [
                "banho",
                "consulta"
              ]
            }
          },
          {
            "tipo": "semErro"
          }
        ]
      },
      "revisarEm": "logica-listas-e-objetos-u3-f2",
      "solucaoDeTeste": [
        {
          "tipo": "definirSnippet",
          "codigo": "pet.idade = 3\npet.vacinado = true\npet.servicos = [\"banho\", \"consulta\"]"
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
  "missaoDeCampo": "No Console de qualquer site, crie const compra = { item: \"pão\", total: 5 }; leia compra.total e compra[\"total\"]. Acrescente compra.pago = true.",
  "falaFinal": {
    "texto": "Leve uma lista pequena para o Console real e confira suas previsões.",
    "expressao": "feliz"
  }
};

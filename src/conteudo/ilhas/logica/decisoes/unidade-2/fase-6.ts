/*
 * Decisões U2, Fase 6: A catraca da academia.
 * Guiado e sozinho da mesma habilidade ficam juntos. A previsão vem antes
 * da execução; o resultado, não o texto digitado, valida a aprendizagem.
 * revisa traz conceitos anteriores misturados na tarefa.
 */
import type { FaseDesafio } from "@/conteudo/tipos";
import { SITE_DO_PROGRAMA } from "@/motor/programa";

export const FASE_DECISOES_U2_F6: FaseDesafio = {
  "id": "logica-decisoes-u2-f6",
  "tipo": "desafio",
  "unidadeId": "logica-decisoes-u2",
  "titulo": "A catraca da academia",
  "conceitos": [
    "portao-e",
    "portao-ou",
    "portao-nao",
    "operadores-logicos",
    "ordem-e-ou"
  ],
  "revisa": [
    "booleano-js",
    "variavel-let"
  ],
  "prerequisitos": [
    "portao-e",
    "portao-ou",
    "portao-nao",
    "operadores-logicos"
  ],
  "usaFerramentas": [
    "console",
    "palco-memoria",
    "linha-do-tempo"
  ],
  "siteAlvo": SITE_DO_PROGRAMA,
  "programa": {
    "preparo": "let planoAtivo = true\nlet exameEmDia = false\nlet ehVisitante = false\nlet horarioPermitido = true"
  },
  "introducao": [
    {
      "texto": "Na Academia Corpo em Movimento, a catraca segue regras com E, OU e NÃO. Agora é no Console, sem circuito e sem passo a passo.",
      "expressao": "curioso"
    }
  ],
  "partes": [
    {
      "id": "pode-entrar",
      "descricao": "Guarde em podeEntrar: planoAtivo E exameEmDia.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "podeEntrar",
            "valor": false
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let podeEntrar = planoAtivo && exameEmDia"
        }
      ]
    },
    {
      "id": "liberada",
      "descricao": "Guarde em entradaLiberada: ehVisitante OU planoAtivo.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "entradaLiberada",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let entradaLiberada = ehVisitante || planoAtivo"
        }
      ]
    },
    {
      "id": "sem-exame",
      "descricao": "Guarde em semExame o contrário de exameEmDia.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "semExame",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u2-f4",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let semExame = !exameEmDia"
        }
      ]
    },
    {
      "id": "catraca",
      "descricao": "Guarde em catraca: (planoAtivo OU ehVisitante) E horarioPermitido, com parênteses.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "catraca",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u2-f5",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let catraca = (planoAtivo || ehVisitante) && horarioPermitido"
        }
      ]
    },
    {
      "id": "sem-parenteses",
      "descricao": "Guarde em liberou: planoAtivo || ehVisitante && !horarioPermitido, sem parênteses.",
      "validador": {
        "tipo": "todos",
        "validadores": [
          {
            "tipo": "valorVariavel",
            "nome": "liberou",
            "valor": true
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "e-logico"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "ou-logico"
          },
          {
            "tipo": "usouSintaxe",
            "sintaxe": "nao-logico"
          }
        ]
      },
      "revisarEm": "logica-decisoes-u2-f5",
      "solucaoDeTeste": [
        {
          "tipo": "executarNoConsole",
          "codigo": "let liberou = planoAtivo || ehVisitante && !horarioPermitido"
        }
      ]
    }
  ],
  "conclusao": [
    {
      "texto": "Você montou, leu e escreveu decisões com E, OU e NÃO, num contexto novo.",
      "expressao": "comemorando"
    }
  ],
  "missaoDeCampo": "Abra o Console de qualquer site e invente a regra da sua catraca: let pagou = true, let bloqueado = false e let entra = pagou && !bloqueado. Troque os valores e confira.",
  "falaFinal": {
    "texto": "Leve && , || e ! para o Console de verdade: todo if de todo programa usa essas três peças.",
    "expressao": "feliz"
  }
};

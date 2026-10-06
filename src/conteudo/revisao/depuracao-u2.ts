/* Duas situações por conceito. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U2: readonly ItemRevisao[] = [
  {
    "id": "ponto-de-parada-1",
    "conceito": "ponto-de-parada",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "O ponto pausa antes da linha; a soma ainda não aconteceu."
    },
    "previsao": {
      "pergunta": "let n=2; na próxima linha n+=5. Parando antes dessa soma, quanto vale n?",
      "opcoes": [
        "7",
        "2",
        "undefined"
      ],
      "correta": 1,
      "explicacao": "O ponto pausa antes da linha; a soma ainda não aconteceu."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "ponto-de-parada-2",
    "conceito": "ponto-de-parada",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Pause quando o saldo já existe, antes da chamada que vai usá-lo."
    },
    "previsao": {
      "pergunta": "Para conferir o saldo usado por sacar(saldo), onde pausar?",
      "opcoes": [
        "Antes da chamada",
        "Só depois de fechar a aba",
        "Antes de declarar saldo"
      ],
      "correta": 0,
      "explicacao": "Pause quando o saldo já existe, antes da chamada que vai usá-lo."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "hipotese-de-bug-1",
    "conceito": "hipotese-de-bug",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Valores permitem confirmar ou descartar o divisor errado."
    },
    "previsao": {
      "pergunta": "A média deu 20 em vez de 10. Você suspeita do divisor. Próxima ação?",
      "opcoes": [
        "Trocar todos os nomes",
        "Apagar a função",
        "Pausar e conferir soma e quantidade"
      ],
      "correta": 2,
      "explicacao": "Valores permitem confirmar ou descartar o divisor errado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "hipotese-de-bug-2",
    "conceito": "hipotese-de-bug",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "A evidência contradiz a hipótese; ela deve ser descartada."
    },
    "previsao": {
      "pergunta": "Você suspeita que desconto vale 0. Pausado, ele vale 5. O que fazer?",
      "opcoes": [
        "Descartar a hipótese e procurar outra",
        "Forçar desconto para 0",
        "Mudar tudo no chute"
      ],
      "correta": 0,
      "explicacao": "A evidência contradiz a hipótese; ela deve ser descartada."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "bug-silencioso-1",
    "conceito": "bug-silencioso",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Ausência de erro não garante resultado correto."
    },
    "previsao": {
      "pergunta": "A função devolve 8 para 3+5, mas 8 para 2+2. Está correta?",
      "opcoes": [
        "Sim, não há vermelho",
        "Não, o segundo caso falhou",
        "Sim, sempre imprime"
      ],
      "correta": 1,
      "explicacao": "Ausência de erro não garante resultado correto."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "bug-silencioso-2",
    "conceito": "bug-silencioso",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Leia as pistas e preveja antes de editar.",
      "toque": "Leia as pistas e preveja antes de editar."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O que a evidência mostra antes desta linha?",
      "dica": "Entradas distintas impedem aceitar uma constante como solução."
    },
    "previsao": {
      "pergunta": "Qual teste revela uma função que sempre devolve 10?",
      "opcoes": [
        "Só uma soma que dá 10",
        "Só imprimir 10",
        "Uma entrada cuja soma não é 10"
      ],
      "correta": 2,
      "explicacao": "Entradas distintas impedem aceitar uma constante como solução."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

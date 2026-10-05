/* Duas situações por conceito. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U3: readonly ItemRevisao[] = [
  {
    "id": "passar-por-cima-1",
    "conceito": "passar-por-cima",
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
      "dica": "A chamada da linha roda inteira e a próxima pausa é do mesmo nível."
    },
    "previsao": {
      "pergunta": "const x = triplo(4); Depois de Passar por cima, o que já aconteceu?",
      "opcoes": [
        "Só abriu triplo",
        "A função terminou e x recebeu 12",
        "Nada foi executado"
      ],
      "correta": 1,
      "explicacao": "A chamada da linha roda inteira e a próxima pausa é do mesmo nível."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "passar-por-cima-2",
    "conceito": "passar-por-cima",
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
      "dica": "O controle executa a linha atual e avança; total vira 7."
    },
    "previsao": {
      "pergunta": "Pausado em total += 2 com total=5: depois de Passar por cima, quanto vale total?",
      "opcoes": [
        "7",
        "5",
        "2"
      ],
      "correta": 0,
      "explicacao": "O controle executa a linha atual e avança; total vira 7."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "entrar-e-sair-1",
    "conceito": "entrar-e-sair",
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
      "dica": "Entrar segue a chamada e mostra seu Escopo Local."
    },
    "previsao": {
      "pergunta": "Você suspeita do cálculo dentro de frete(peso). Qual controle mostra suas linhas?",
      "opcoes": [
        "Retomar até o fim",
        "Fechar o navegador",
        "Entrar na função"
      ],
      "correta": 2,
      "explicacao": "Entrar segue a chamada e mostra seu Escopo Local."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "entrar-e-sair-2",
    "conceito": "entrar-e-sair",
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
      "dica": "Sair executa até voltar para quem chamou; os locais dessa chamada deixam de existir."
    },
    "previsao": {
      "pergunta": "Pausado dentro de uma função, qual controle termina a chamada e volta ao chamador?",
      "opcoes": [
        "Sair da função",
        "Entrar de novo",
        "Apagar o ponto"
      ],
      "correta": 0,
      "explicacao": "Sair executa até voltar para quem chamou; os locais dessa chamada deixam de existir."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "retorno-no-depurador-1",
    "conceito": "retorno-no-depurador",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Compare o valor local com o que chegou ao chamador.",
      "toque": "Compare o valor local com o que chegou ao chamador."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O valor atravessou a fronteira da função?",
      "dica": "Imprimir mostra o texto; só return o devolve a quem chamou."
    },
    "previsao": {
      "pergunta": "rotulo(7) imprime \"Caixa 7\", mas a chamada recebe undefined. O que investigar?",
      "opcoes": [
        "O teclado",
        "Se o texto foi devolvido com return",
        "A cor do Console"
      ],
      "correta": 1,
      "explicacao": "Imprimir mostra o texto; só return o devolve a quem chamou."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "retorno-no-depurador-2",
    "conceito": "retorno-no-depurador",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Compare o valor local com o que chegou ao chamador.",
      "toque": "Compare o valor local com o que chegou ao chamador."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "ajudas": {
      "pergunta": "O valor atravessou a fronteira da função?",
      "dica": "A função pode calcular corretamente e terminar sem devolver esse valor."
    },
    "previsao": {
      "pergunta": "Na função frete, calculado vale 12; após Sair, recebido vale undefined. Qual hipótese testar?",
      "opcoes": [
        "O return está ausente",
        "Todo cálculo é errado",
        "Sair apagou o programa"
      ],
      "correta": 0,
      "explicacao": "A função pode calcular corretamente e terminar sem devolver esse valor."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  }
];

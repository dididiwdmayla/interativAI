/* Duas situações por conceito. A revisão não aceita cenas; as previsões transferem o método a outros programas. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_DEPURACAO_U4: readonly ItemRevisao[] = [
  {
    "id": "observar-expressoes-1",
    "conceito": "observar-expressoes",
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
      "dica": "O tipo texto explica por que === não aceita o número 18."
    },
    "previsao": {
      "pergunta": "Watch mostra typeof idade = \"string\" e idade === 18 = false. Qual hipótese faz sentido?",
      "opcoes": [
        "O computador falhou",
        "O número é 0",
        "A entrada chegou como texto"
      ],
      "correta": 2,
      "explicacao": "O tipo texto explica por que === não aceita o número 18."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "observar-expressoes-2",
    "conceito": "observar-expressoes",
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
      "dica": "Modificar a lista durante o percurso pode deslocar um item para o índice já visitado."
    },
    "previsao": {
      "pergunta": "Após remover um item, lista.length diminuiu e i avançou. O que conferir?",
      "opcoes": [
        "Se um item foi pulado",
        "Se a tela apagou",
        "Só o nome da lista"
      ],
      "correta": 0,
      "explicacao": "Modificar a lista durante o percurso pode deslocar um item para o índice já visitado."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "escopo-na-pausa-1",
    "conceito": "escopo-na-pausa",
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
      "dica": "O nome local esconde o de fora naquela função."
    },
    "previsao": {
      "pergunta": "Local tem total=9 e Script tem total=0. Dentro da função, qual total é lido?",
      "opcoes": [
        "Sempre o de fora",
        "O Local, mais próximo",
        "Os dois somados"
      ],
      "correta": 1,
      "explicacao": "O nome local esconde o de fora naquela função."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "escopo-na-pausa-2",
    "conceito": "escopo-na-pausa",
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
      "dica": "Variável de bloco só existe enquanto aquele bloco está ativo."
    },
    "previsao": {
      "pergunta": "O i de um for com let some ao sair do bloco. Isso significa?",
      "opcoes": [
        "O navegador perdeu memória",
        "O programa falhou",
        "O alcance do i acabou"
      ],
      "correta": 2,
      "explicacao": "Variável de bloco só existe enquanto aquele bloco está ativo."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

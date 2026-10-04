/* Duas previsões em situações próprias por conceito: ItemRevisao ainda não aceita
 * quadro ou áreas compostas; aqui se revisam as decisões, sem simular gestos ausentes. */
import type { ItemRevisao } from "@/conteudo/tipos";
export const ITENS_RESOLVER_U1: ItemRevisao[] = [
  {
    "id": "entender-problema-1",
    "conceito": "entender-problema",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Uma lavanderia pede o total de quilos. O primeiro passo é?",
      "opcoes": [
        "Escrever um for",
        "Identificar entradas, saída e exemplos",
        "Escolher uma cor"
      ],
      "correta": 1,
      "explicacao": "Sem definir a pergunta, o código pode responder outra coisa."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Separar os dados de entrada, a resposta pedida e exemplos antes de programar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "entender-problema-2",
    "conceito": "entender-problema",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Uma viagem recebe quilômetros e litros; pede km por litro. A saída é?",
      "opcoes": [
        "Uma lista de litros",
        "Os quilômetros",
        "Um número: quilômetros divididos por litros"
      ],
      "correta": 2,
      "explicacao": "A saída deve responder exatamente ao pedido."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Separar os dados de entrada, a resposta pedida e exemplos antes de programar."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "decompor-problema-1",
    "conceito": "decompor-problema",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Uma biblioteca precisa de multas e livros disponíveis. Como começar?",
      "opcoes": [
        "Resolver cada parte e depois juntar",
        "Escrever tudo num único passo",
        "Copiar qualquer programa"
      ],
      "correta": 0,
      "explicacao": "Cada pergunta pode ser resolvida separadamente."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Dividir um pedido grande em partes pequenas que dá para resolver separadamente."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "decompor-problema-2",
    "conceito": "decompor-problema",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Preparar uma entrega tem endereço e embalagem. Ler endereço depende de embalar?",
      "opcoes": [
        "Sim, sempre",
        "Não; só entregar depende das duas",
        "Depende do nome da rua"
      ],
      "correta": 1,
      "explicacao": "Dependências vêm da tarefa, não de uma lista decorada."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Dividir um pedido grande em partes pequenas que dá para resolver separadamente."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "plano-comentado-1",
    "conceito": "plano-comentado",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "No Console, // conferir o peso vira uma conta?",
      "opcoes": [
        "Sim",
        "Só se tiver número",
        "Não: comentário é um lembrete"
      ],
      "correta": 2,
      "explicacao": "O plano não roda; o código é que realiza os passos."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Guardar o plano em comentários para conferir qual ideia cada linha realiza."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  },
  {
    "id": "plano-comentado-2",
    "conceito": "plano-comentado",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "O plano diz somar os pontos; o código devolve sempre 10. Está completo?",
      "opcoes": [
        "Não: o código precisa realizar o plano",
        "Sim: o comentário basta",
        "Sim: todo teste passa"
      ],
      "correta": 0,
      "explicacao": "Comentários não garantem que a função funciona: teste outras entradas."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Guardar o plano em comentários para conferir qual ideia cada linha realiza."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 0
      }
    ]
  },
  {
    "id": "exemplos-de-teste-1",
    "conceito": "exemplos-de-teste",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "dobro(3) deve dar 6. Quando decidir essa saída esperada?",
      "opcoes": [
        "Copiando o resultado da função",
        "Antes de rodar, pela regra",
        "Depois de apagar o teste"
      ],
      "correta": 1,
      "explicacao": "Se copiar o resultado errado, o teste não detecta o erro."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Escrever entradas e saídas esperadas antes de conferir a função."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 1
      }
    ]
  },
  {
    "id": "exemplos-de-teste-2",
    "conceito": "exemplos-de-teste",
    "tipo": "previsao",
    "enunciado": {
      "mouse": "Pense na situação e escolha a resposta.",
      "toque": "Pense na situação e escolha a resposta."
    },
    "siteAlvo": {
      "body": ""
    },
    "programa": {},
    "previsao": {
      "pergunta": "Uma função de soma passa em [1,2]. O que testar a seguir?",
      "opcoes": [
        "Só [1,2] de novo",
        "Só mudar o nome da função",
        "Uma lista vazia e números diferentes"
      ],
      "correta": 2,
      "explicacao": "Outras entradas verificam regras ainda não exercitadas."
    },
    "ajudas": {
      "pergunta": "Qual regra precisa ser verificada?",
      "dica": "Escrever entradas e saídas esperadas antes de conferir a função."
    },
    "solucaoDeTeste": [
      {
        "tipo": "responderPrevisao",
        "opcao": 2
      }
    ]
  }
];

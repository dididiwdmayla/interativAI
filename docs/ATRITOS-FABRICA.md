# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-11.md`.

## Rodada 12: zona Listas e objetos

- valorVariavel e funcaoPassa comparam listas e objetos por conteúdo, recursivamente. Nenhuma capacidade de motor faltou; as funções recebem casos vazios, fronteiras e decimais quando aplicáveis.
- Leitura de índice/propriedade ausente é observada no palco e conferida por typeof, como nas unidades anteriores: undefined não vira uma mensagem impressa nem um erro.
- Aplicar for...of e for aos vagões ganhou um conceito próprio, Percorrer os vagões, com duas revisões; uma fase guiada precisa ensinar um conceito, além de revisar os laços já aprendidos.
- map e filter são acompanhados pelas molduras das arrows na linha do tempo. As jornadas leem cada preço e cada referência de ficha, além dos vagões, campos e setas da UI.
- filter cria outra fileira, mas compartilha as fichas: uma previsão com mudança de preço evita transformar "lista nova" em "cópia profunda". No map de números, mudar a nova lista mantém a original intacta.
- O desafio continua em outro contexto: playlist, votação, pet shop e pizzaria. As revisões são ações e previsões autossuficientes em situações próprias.
- Um teste antigo das demonstrações de estruturas excedeu o timeout com build concorrente; repetido isoladamente e na rodada final, ficou verde. Motor, dependências e conteúdo previamente publicado não mudaram.

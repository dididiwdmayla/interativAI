# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-11.md`.

## Rodada 29 (motor): o formato contrato

- Sem bloqueio para os próximos contratos: é um desafio com o campo
  `contrato` (guia, seção 31). O modelo é `logica-programa-de-verdade-u1`.
- Uma fase antes do contrato apresenta as ferramentas e os aparelhos novos
  (o desafio não apresenta nada). Na Lógica, ela também é a primeira fase
  com cena publicada.
- Soluções de código em camadas: cada parte traz o código inteiro até ali,
  com o bloco do plano no topo (senão o plano desmarca e a jogada acusa).
- O que muda de um dia de teste para o outro vai em `porLinha`; os
  instantes conferidos ficam longe das trocas (mais de meia hora da cena).
- A jornada de navegador lê as soluções de um JSON
  (`testes/contrato-jornadas.json`), conferido contra o TS no
  `testar:conteudo`.

## Rodada 27: zona Resolvendo problemas

- Sem bloqueio novo de motor. Quadros separados treinam entendimento,
  decomposição e dependências; uma ponte guiada apresenta as ferramentas
  compostas antes do primeiro desafio (que não pode apresentar ferramentas).
  A U4 e todos os desafios cobram o problema inteiro na composição.
- `ordemValida` usa dependências mínimas: ler pessoas e preço aceita duas
  ordens; `rodar` deixa observar o erro real de usar antes de declarar.
- `planoComentado`, função com bordas escondidas e casos do aluno passando
  conferem partes diferentes. Um caso feliz ou uma função constante não
  encerra o problema. Zero, vazio, repetido e negativo aparecem no percurso.
- ItemRevisao não aceita o quadro nem áreas compostas: duas previsões em
  situações próprias por conceito, sem fabricar uma revisão de cartões.
- Teste antigo proibia composição em qualquer fase do currículo. Agora
  protege apenas as unidades anteriores à zona, pela ordem do registro.
- No teste móvel, checklist do retrato abre na barra; em paisagem, no
  balão. Conclusão precisa esperar o modal assentar antes de avançar.

## Rodada 26 (motor): bloqueio de Resolvendo problemas retirado

- A tela composta (guia, seção 29) junta plano, código, palco e casos de
  teste do aluno na mesma fase, inclusive no desafio, com `planoComentado` e
  `casosDoAluno`. Modelo pronto em `lab-resolver-u1` (prática e desafio).
- Para produzir: as fases só de quadro continuam `ordenar-passos`; a U4 e
  os desafios que cobram plano, código e testes usam `areas`.

## Rodada 13: Resolvendo problemas (produção bloqueada)

- As demonstrações f5 a f7 validam ordenar, agrupar e executar cartões,
  mas isso não libera o mesmo quadro no checklist de um desafio. A fábrica,
  a UI e a simulação restringem o quadro ao tipo `ordenar-passos`.
- `rodar` executa código fornecido nos cartões; não oferece o Snippet para
  o aluno transformar o plano em código autoral. A checagem rejeita essa
  combinação. Substituir o desafio inteiro por prática sequencial ou por
  cartões de código prontos enfraqueceria o requisito da rodada.
- A regra de parada foi aplicada antes da U1. Capacidade faltante e
  critérios para desbloqueá-la registrados em Pendências do ROADMAP;
  nenhuma unidade incompleta foi publicada. Os testes existentes de
  estruturas passaram sem timeout, sem necessidade de repetição.

## Rodada 12: zona Listas e objetos

- valorVariavel e funcaoPassa comparam listas e objetos por conteúdo, recursivamente. Nenhuma capacidade de motor faltou; as funções recebem casos vazios, fronteiras e decimais quando aplicáveis.
- Leitura de índice/propriedade ausente é observada no palco e conferida por typeof, como nas unidades anteriores: undefined não vira uma mensagem impressa nem um erro.
- Aplicar for...of e for aos vagões ganhou um conceito próprio, Percorrer os vagões, com duas revisões; uma fase guiada precisa ensinar um conceito, além de revisar os laços já aprendidos.
- map e filter são acompanhados pelas molduras das arrows na linha do tempo. As jornadas leem cada preço e cada referência de ficha, além dos vagões, campos e setas da UI.
- filter cria outra fileira, mas compartilha as fichas: uma previsão com mudança de preço evita transformar "lista nova" em "cópia profunda". No map de números, mudar a nova lista mantém a original intacta.
- O desafio continua em outro contexto: playlist, votação, pet shop e pizzaria. As revisões são ações e previsões autossuficientes em situações próprias.
- Um teste antigo das demonstrações de estruturas excedeu o timeout com build concorrente; repetido isoladamente e na rodada final, ficou verde. Motor, dependências e conteúdo previamente publicado não mudaram.

# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-23.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 25: diagnóstico da zona Resolvendo problemas

- Branch `conteudo/resolvendo-problemas`, criada a partir de
  `claude/intelligent-pascal-5va93x`. Leitura das instruções, Status e
  Pendências, guia (25 a 28, revisão e temas), currículo e modelos do
  `/lab` e de Listas e objetos.
- A produção parou antes da U1, pela regra explícita do prompt: falta o
  desafio que permita agrupar/decompor, ordenar o plano e escrever o código
  testado, no mesmo contexto, com checklist e Rever. O quadro atual só
  existe em fases com objetivos sequenciais; não equivale ao desafio pedido.
- Evidência: `FaseDesafio` em `src/conteudo/tipos.ts` só oferece o campo
  adicional `circuito`. `useOrdenar` e `criarSimulacao` só carregam `ordenar`
  quando `fase.tipo === "ordenar-passos"`. A regra `ordenar-passos` da
  fábrica recusa validadores e ações de plano num desafio e recusa Snippet
  numa fase de quadro. Não é só uma limitação de TypeScript.
- Reprodução temporária pela própria regra da fábrica, removida após o
  diagnóstico: um desafio com `ordemValida` e `porPasso` devolveu
  `parte "plano": o validador ordemValida só vale numa fase ordenar-passos`
  e `parte "plano" solucaoDeTeste: a ação porPasso só vale numa fase ordenar-passos`.
  Acrescentar Snippet à demonstração de plano executável devolveu
  `fase de ordenar passos não tem Snippet (o plano é o programa)`.
  Os dois diagnósticos e os oito testes existentes de ordenar passaram.
- `testar:conteudo`: 14.822 testes verdes, inclusive estruturas, sem timeout.
  Build e lint verdes. `bateria:conteudo` em produção verde: mapa,
  exploração, publicação e revisão, no desktop.
  Nenhuma unidade nova, conceito, revisão ou publicação; nenhum motor,
  dependência ou conteúdo congelado alterado. Jornadas de unidades novas
  e `publicar:conteudo` não se aplicam porque a produção foi interrompida.
- Próximo passo: implementar a capacidade listada em Pendências antes de
  retomar U1 Decompor um problema, U2 Pseudocódigo, U3 Ordenar os passos e
  U4 Testar com exemplos, uma por commit. Algoritmos essenciais vem depois
  da conclusão da zona, não antes.

## Rodada 24: zona Listas e objetos

### Etapa 1: Listas

- Quatro fases: índices e length, push/pop e const, referência compartilhada, desafio na playlist de uma festa. Seis conceitos com temas Lógica e Dados, doze revisões em contextos novos.
- Leitura ausente observada no palco e por typeof; tentativa de trocar a const gera TypeError. Duas variáveis compartilham a mesma lista, com mudanças e setas conferidas na UI.
- Verificado: 14.006 testes de conteúdo verdes, jornada pelo mapa nos três layouts com negativa de índice errado, vagões numerados e setas visíveis; publicar:conteudo, build e lint verdes. Chromium 133 temporário, sem alteração de dependências do projeto.

### Etapa 2: Percorrer listas

- Cinco fases: for...of e for por índice sobre listas, map, filter, find e desafio na votação da turma. Quatro conceitos com temas Lógica e Dados, oito revisões.
- map e filter acompanhados chamada por chamada na linha do tempo; listas originais preservadas e find contrastado com filter, inclusive item zero e busca sem resultado.
- Funções validadas com listas por conteúdo, incluindo vazias, fronteiras e decimais; a negativa recusa uma lista original alterada no lugar do map.
- Verificado: 14.318 testes de conteúdo verdes; jornada pelo mapa nos três layouts, com os parâmetros 3, 8 e 5 de map e filter lidos na linha do tempo, fileiras distintas e negativa; publicar:conteudo, build e lint verdes.

### Etapa 3: Objetos

- Três fases: fichas e leitura por ponto/colchetes, alteração/acréscimo de campos e desafio no cadastro de um pet. Três conceitos com temas Lógica e Dados, seis revisões.
- Propriedade ausente devolve undefined; objeto não usa posição numerada como lista. A alteração de preço preserva nome; os campos incluem texto, número, booleano e lista.
- Verificado: 14.534 testes de conteúdo verdes; jornada pelo mapa nos três layouts com fichas de chave/valor, negativa de índice numérico, meta antes/depois e desafio; publicar:conteudo, build e lint verdes.

### Etapa 4: Listas de objetos

- Quatro fases: cardápio/fichas e referências, total/mais caro e desestruturação, seleção por campo, desafio no pedido da pizzaria. Quatro conceitos com temas Lógica e Dados, oito revisões.
- O cardápio da Padaria Pão de Mel e os pedidos viram dados. Alterar item.preco muda só a ficha apontada; filter cria outra fileira e compartilha as fichas. A missão de campo filtra uma lista de compras por preço no Console real.
- totalPedido e filtros conferidos por funcaoPassa, com objetos/listas por conteúdo, casos vazios, quantidade zero, fronteiras e decimais.
- Verificado: 14.822 testes de conteúdo verdes; jornada pelo mapa nos três layouts com referência até cardapio[1], preços 5/8/12 no laço, callbacks passando pelas três fichas, negativas de mutação em todas as fichas e função que não filtra; publicar:conteudo, build e lint verdes.
- Um teste antigo das demonstrações de estruturas excedeu 5 s enquanto o build rodava; os 16 testes do arquivo passaram isolados, e testar:conteudo voltou verde sem mudança no motor.

### Etapa 5: fechamento

- Zona completa: U1 Listas, U2 Percorrer listas, U3 Objetos e U4 Listas de objetos, na ordem curricular e em quatro commits próprios; 16 fases, 17 conceitos e 34 revisões (424 itens no registro).
- Todas as unidades publicadas, com jornadas pelo mapa nos três layouts, meta, desafios, negativas, vagões, fichas, setas e linha do tempo. Os validadores existentes comparam listas/objetos pelo conteúdo; não houve falta de motor nem alteração de dependências ou de unidades previamente publicadas.
- Final: 14.822 testes de conteúdo, build e lint verdes; npm run bateria:conteudo em produção verde (mapa, explorar, publicar, revisão). Documentos de Status, currículo, progresso e atritos atualizados; a próxima zona é Resolvendo problemas.
- Decisões a conferir: conceito próprio para percorrer listas com os laços já aprendidos; comparação entre listas novas e fichas compartilhadas no filter; undefined conferido por typeof e pelo palco, seguindo o modelo anterior.
- Limite da verificação: Chromium 133 headless nos três layouts, sem Safari nem dispositivo físico. Sem pendência nova de motor.

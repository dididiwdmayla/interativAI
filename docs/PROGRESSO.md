# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-23.md`. Status consolidado: `docs/ROADMAP.md`.

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

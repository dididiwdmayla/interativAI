# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-29.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 30: zona Algoritmos essenciais

Branch `conteudo/algoritmos-essenciais`, a partir de
`claude/intelligent-pascal-5va93x` (`ebfd7b0`). Um commit por unidade e um
commit de fechamento. O motor e as unidades publicadas antes desta rodada
não mudaram.

- 13 fases em quatro unidades, na ordem do mapa; guiado e sozinho juntos,
  previsões, revisão de Listas, Funções, Repetição e Resolvendo problemas.
- Quatro cenas: retirada de encomendas, vitrine da feira, volumes na
  expedição e fila de pedidos. Kit existente; resultado no painel, vagões
  acesos em comparações/trocas e molduras recursivas na linha do tempo.
- Desafios compostos: ingressos do museu, distâncias do passeio, caixas da
  biblioteca e registros do observatório, com plano, código e casos do
  aluno; casos escondidos vazios, unitários, repetidos e já ordenados.
- 12 conceitos com temas (incluindo Desempenho); duas revisões por conceito
  em situações próprias (24 itens). Missão no Console real: sort padrão
  de [10,9,1] e correção pelo comparador numérico.
- Gráfico com 10, 100 e 1.000 itens; comparação de pares contra vizinhos;
  confusão de máquina rápida contra crescimento, garantia de ordem e
  freio do jogo em contagem finita longa. Limites escolhidos: binária 130
  passos e vizinhos 4.500, com medição independente em 1.000 itens.
- Provas de eficiência: resultado correto sozinho não basta; os dois
  caminhos lentos são rejeitados pelos orçamentos. Jornada confere luz dos
  vagões, trocas e molduras, além de concluir e salvar pelo mapa.

## Zona Algoritmos essenciais: U1 — Buscar

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.048 verificações), duas provas específicas verdes; jornada pelo mapa em desktop, retrato e paisagem, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U2 — Ordenar

- 4 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.310 verificações); jornada pelo mapa nos três layouts com comparações e trocas visíveis, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U3 — Recursão

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.544 verificações); jornada pelo mapa nos três layouts com RangeError e molduras recursivas no palco, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U4 — Por que isso trava?

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.779 verificações); jornada pelo mapa nos três layouts com gráfico, proteção de passos e bordas, publicar:conteudo, build e lint verdes.

## Fechamento

- `npm run bateria:conteudo`, uma vez no build de produção: mapa (16 s),
  explorar (15 s), publicar (32 s) e revisão (12 s), todos verdes.
- Verificação final do conteúdo: 17.779 testes em 43 arquivos; as jornadas
  das quatro unidades concluíram nos três layouts com console limpo.
  Publicação, build e lint verdes em cada unidade.
- ROADMAP: Algoritmos essenciais em Feito; Estruturas de dados em Próximo,
  seguida de Depuração. Atritos da rodada registrados; rodada 29 arquivada.
- Decisões a conferir: orçamentos de 130 e 4.500 passos; medições até 1.000
  itens; cenas com o kit já disponível. Nenhum bloqueio de motor encontrado.
- GitHub: os commits foram enviados pelo plugin (o git local não possui
  credencial de push), mantendo as árvores idênticas às validadas. A branch
  principal recebe as mudanças somente pelo pull request.

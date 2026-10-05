# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-32.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 33: zona Estruturas de dados

Branch `codex/estruturas-dados`, a partir de `22a4b9f` da principal,
após o merge do custo escondido (PR #33). Sem mudança no motor.

### Etapa 1 — Pilha

- U1 separada da fila no mapa, sem ids anteriores publicados na zona.
- Histórico do brilho da cozinha com push/pop pelo mesmo lado, previsão
  do último vagão, função desfazer com null no vazio e bordas de um e
  vários itens. Desafio da rota de volta em tela composta.
- Dois conceitos com temas Dados e Lógica; quatro revisões próprias e
  missão no Console real comparando pilha e fila.
- Jornada pelo mapa ligada ao JSON das ações do conteúdo, negativas de
  função constante e shift no lugar de pop; rastro confere os dois lados.

- Verificação: 18.006 testes de conteúdo e duas provas específicas verdes;
  jornada pelo mapa nos três layouts, publicação, build e lint verdes.

### Etapa 2 — Fila

- Esquina com semáforo, pedestre e painel de chamada; push entra pelo fim,
  shift retira pelo começo, e os vagões restantes deslizam.
- Comparação comShift x porIndice: o gráfico soma o trabalho escondido,
  com ligação explícita a Algoritmos essenciais. O índice preserva os
  itens na memória, limitação explicada ao aluno.
- Dois conceitos e quatro revisões. Desafio das instruções de entrega
  em ordem de chegada, preservando pedidos repetidos e cobrando vazio e
  um item, em tela composta.
- Orçamento de 20.000 passos em 1.000 itens, tanto no treino como no
  desafio; prova automática de folga mínima de três vezes para a solução
  com variáveis intermediárias e dez vezes abaixo da ingênua. As
  sabotagens com shift acertam as bordas e falham no orçamento total.

- Verificação: 18.191 testes verdes; jornada nos três layouts, publicação,
  build e lint verdes.

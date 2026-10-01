# Progresso

Esta rodada guarda o detalhe mais recente. Rodada anterior: `docs/arquivo/PROGRESSO-rodada-20.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 21: zona Repetição

### U1: Enquanto for verdade

- Quatro fases: forno com while e condição de parada; contador e fronteira < / <=; loop infinito provocado no jogo, proteção e conserto; desafio da fila da farmácia.
- Snippet apresentado no primeiro objetivo. Fala curta explica as chaves automáticas do Console e o avanço por cima do fechamento. Console usado para a comparação rápida.
- Quatro conceitos com temas e oito itens de revisão. Guiado/sozinho na mesma fase; if dentro do loop e no encerramento. Palco e linha do tempo em todas as fases.
- Os testes de jornada percorrem o rastro pelos botões reais, conferindo os valores do contador. Negativas: fronteira errada e loop ainda sem incremento.
- Verificado: 10.568 testes (checagem afetada refeita após separar as partes), jornada pelo mapa em desktop/retrato/paisagem com console limpo; publicar:conteudo, build e lint verdes.

### U2: for e for...of

- Quatro fases: três partes do for na tabuada; uma letra por volta no for...of; primeira apresentação do break com if; desafio das etiquetas de uma gráfica.
- Só textos no for...of, sem arrays nem funções. Contador no topo na tabuada; letra local conferida no rastro durante as voltas.
- Três conceitos com temas e seis itens de revisão. Previsões sobre número de voltas, terceira letra e posição do break.
- Verificado: 10.778 testes (checagem afetada refeita após encurtar a fala do desafio), jornada pelo mapa nos três layouts com console limpo, negativas e rastro; publicar:conteudo, build e lint verdes, sem avisos.

### U3: Contar e somar

- Cinco fases: acumulador (Cantina Sol), contador condicional, maior/menor, média e fechamento do caixa da Sorveteria Nuvem.
- Sem arrays nem funções: preços gerados pelo número do pedido. if dentro do loop revisa Decisões; contas e caixinhas revisam Primeiros comandos.
- Bugs explícitos: declarar soma dentro reinicia a caixinha; menor começando em 0 inventa um mínimo; pedido passa da última volta e não serve como quantidade na média.
- Quatro conceitos com temas e oito itens de revisão. Guiado/sozinho por habilidade; palco e linha do tempo nas cinco fases.
- Verificado: 11.051 testes, jornada pelo mapa nos três layouts com console limpo, rastro de soma/contagem/mínimo/quantidade e negativas dos quatro bugs; publicar:conteudo, build e lint verdes.

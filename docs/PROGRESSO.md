# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-26.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 27: zona Resolvendo problemas

Branch `conteudo/resolvendo-problemas`, a partir de
`claude/intelligent-pascal-5va93x`. Um commit por unidade.

### U1: Decompor um problema

- Entrada, saída e exemplos do pedido da festa classificados por agrupar;
  decomposição em passos pequenos e troca entre duas leituras independentes.
- Prática composta: total das fichas com preço e quantidade; desafio em
  outro contexto, o frete das entregas da loja. Plano, comentários, função
  autoral e casos do aluno, com vazio, zero e repetidos.
- Quatro conceitos com temas e oito revisões. As revisões são previsões
  em contextos próprios: ItemRevisao não aceita quadro/áreas compostas.
- Teste legado de composição limitado às zonas anteriores: essas telas
  publicadas continuam protegidas; as novas podem declarar áreas.
- Jornada `testes/resolvendo.mjs`: mapa, meta, UI real dos cartões,
  Snippet, previsões, casos, desafio e unidade concluída. Negativas:
  função constante e apenas um caso passando não cumprem o percurso.
- Verificação: `testar:conteudo` verde (15.743 testes), jornadas da U1
  em desktop/retrato/paisagem e `publicar:conteudo` verdes.

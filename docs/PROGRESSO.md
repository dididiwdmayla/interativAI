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

### U2: Pseudocódigo

- Cartões em português agrupados em Preparar, Contar e Entregar; plano
  sem sintaxe obrigatória, seguido da tradução em função curta.
- Prática na agenda de reservas: contar reservas positivas, não somar
  pessoas nem incluir uma reserva de zero pessoas. Desafio dos horários
  livres da oficina, com fichas e condição invertida.
- Um conceito com tema Lógica e duas revisões em outros contextos.
- `testar:conteudo`: 15.868 testes verdes.
- Jornadas U2 verdes nos três layouts; publicação, build e lint por unidade.

### U3: Ordenar os passos

- Quadro com `rodar`: mostrar total antes de criá-lo produz ReferenceError;
  a ordem válida imprime 12. As duas declarações são independentes.
- Composição no caixa da loja: primeiro receita, depois vendas menos
  despesas. Um caso com despesas descobre o código incompleto.
- Desafio do material da costureira: pedido e estoque antes da diferença,
  com zero, igualdade e excesso de estoque. Programas de até cinco linhas.
- Dependências dos passos com tema e duas revisões próprias.
- `testar:conteudo`: 15.993 testes verdes, incluindo estruturas sem timeout.
- Jornadas U3 verdes nos três layouts. A proteção das telas antigas usa
  a ordem curricular, sem impedir composições em zonas futuras; 17 testes
  de composição verdes após esse ajuste.

### U4: Testar com exemplos

- Prática integral na tela composta: maior venda do dia, incluindo
  estornos negativos. Começar o maior em zero passa nos casos positivos,
  mas quebra em [-5, -2]. O aluno corrige a função e escreve seus casos.
- Exige cinco exemplos passando, incluindo vazio, zero, repetido e
  negativo; `funcaoPassa` também testa essas bordas de forma escondida.
- Desafio da cantina: troco(preco, pago), pagamento exato, (0,0) e pago
  menor que preço. Diferença negativa significa quanto ainda falta pagar;
  regra explicitada no enunciado, decisão a conferir.
- Casos de borda com temas Lógica e Ferramentas e duas revisões próprias.
- `testar:conteudo`: 16.093 testes verdes, sem falha de estruturas por tempo.
- Jornadas U4 verdes nos três layouts; publicação, build e lint por unidade.

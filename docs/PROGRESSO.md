# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-25.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 26: motor de resolução de problemas (tela composta)

Branch `ccr-d9b21b6e-j9p06v`, criada a partir de
`claude/intelligent-pascal-5va93x`. Destrava o bloqueio da rodada 25.

### Etapa 1: composição de áreas

- A prática e o desafio declaram `areas` (`plano`, `snippet`, `palco`) e o
  motor monta a tela (`src/motor/composicao.ts`, `TelaComposta`). O quadro
  vem de `quadroDaFase` (ordenar-passos ou área plano), usado pela tela, pela
  simulação e pelas checagens. Regra nova `composicao`.
- Os tipos publicados não passaram a usar a composição por baixo (detalhes
  de tela publicados e seletores de testes; o porquê no `PROJETO.md`).
  Nenhuma fase publicada declara áreas (teste que confere).
- Verificado: testar:conteudo, `ordenar.mjs` e `palco.mjs` nos três layouts.

### Etapa 2: plano junto do código

- "Levar pro código" escreve o plano como comentários numerados no topo do
  Snippet, sem apagar código; mexer no quadro reescreve só esse bloco
  (`src/motor/plano/comentarios.ts`). Tocar num passo acende o comentário
  (ação `verPassoNoCodigo`, evento `apontouPasso`), com o selo `//` nos
  cartões e o rodapé da linha. Validador `planoComentado` (os comentários
  lidos de volta, conferidos pelas dependências).
- A linha acesa do passo continua depois da limpeza das ajudas do objetivo
  e apaga quando o bloco muda de lugar.

### Etapa 3: casos de teste

- Área `testes`: o aluno escreve a entrada e a saída esperada (lidas pela
  árvore do acorn, sem rodar nada), roda contra a própria função (o Snippet
  roda antes) e vê passou/falhou e o que veio. Validador `casosDoAluno`
  (`minimo`, `incluir` com argumentos e/ou saída, `passando`). Casos e
  resultados salvos no progresso; tutor recebe plano, casos e código.
- Ferramenta `casos-de-teste` (a apresentação fala dos testes
  automatizados do Ofício) e `plano-no-codigo`.

### Etapa 4: desafio composto

- O desafio aceita as áreas; partes de plano, `planoComentado`, código
  (`funcaoPassa` com bordas escondidas) e testes. A meta mostra o antes e o
  depois das áreas (`composicaoDoDesafio`, `MiniComposicao`).
- `/lab/fases?modo=jogo` joga uma bancada como no jogo (meta, salvamento,
  Rever com volta), sem entrar na Revisão do dia; `JogoFase` acha as fases
  do lab por `buscarFase`.

### Etapa 5: layouts, apresentações e demonstração

- Em pé, o palco começa recolhido e há folga para o computadorzinho; o caso
  novo se escreve no topo da área; abas do DevTools e o seletor Snippet |
  Console com 44 px no toque só na tela composta. A miniatura da meta não
  estoura o modal em pé.
- Demonstração `lab-resolver-u1`: a média das notas (plano, levar, acender,
  reordenar com previsão, função, casos) e o desafio de quantos passaram.
- Jogado nos três layouts (capturas): o que ficou apertado está em
  Pendências no ROADMAP (código deitado, palco recolhido em pé, casos em
  1024 x 768).

### Etapa 6: documentação e bateria

- Guia (seção 29 e referências nas 25 e 27), `PROJETO.md`, mapa curricular,
  ROADMAP (bloqueio retirado; Próximo: a zona e depois Algoritmos
  essenciais) e este arquivo.
- Testes: `testes/conteudo/composicao.test.ts` e `casos.test.ts`;
  `testes/resolver.mjs` (na bateria, três layouts);
  `apresentacoes-logica.mjs` com a tela composta.

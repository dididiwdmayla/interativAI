# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodadas-30-e-31.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 32: custo escondido dos métodos nativos

Branch `claude/hidden-cost-native-methods-ahr2wf`, a partir de `e9a6ec0`
da principal. Desbloqueia a zona Estruturas de dados (Pendências da
rodada 31): o contador contava só o código do aluno, e consumir 1.000
itens com `shift` (1.001 passos) parecia mais barato que por índice (2.002).

### Etapa 1 — motor, contador, gráfico e palco

- `src/motor/executor/custoNativo.ts`: a tabela de custo de cada método
  nativo do reino (shift/unshift, splice, indexOf/includes/lastIndexOf,
  slice/concat/join/reverse/fill, espalhar, Array.from, Object.keys/values/
  entries, new Set/new Map com iterável, sort sem comparador n x log2(n),
  callbacks um por item visitado, textos). push, pop, Map, Set, índice e
  chave: sem custo escondido.
- Instrumentação: `lista.shift()` vira `__r.m(lista,"lista").shift()`. O
  `__r.m` devolve um porteiro cujos getters leem o método na hora (antes
  dos argumentos, como o original) e chamam com o this certo; só o método
  nativo do reino soma custo (uma classe Fila com shift próprio não).
  O espalhar e o primeiro argumento de `new Set`/`new Map` passam por
  `__r.e`. Só chamadas escritas no código do aluno contam; cadeia
  opcional e `super` ficam de fora. A mensagem "x.shift is not a function"
  e o TypeError de null/undefined continuam os do navegador.
- `ResultadoExecucao` ganhou `passosEscondidos` e `escondidosPorMetodo`;
  `MedicaoPassos.passos` passou a ser o total, com `escondidos` à parte.
  Os escondidos não criam fotos (linha do tempo e depurador) nem contam
  para o limite de 100 mil passos da execução; na medição do gráfico,
  contam para o limite de 2 milhões ("travaria").
- `passosNoMaximo` conta o total; `contarEscondidos: false` conta só o
  código (o ponto que travaria reprova mesmo assim). O detalhe diz
  "N passos (M do código + K escondidos)".
- Contador: "8 passos + 15 escondidos em `shift`" (os dois métodos que
  mais pesaram). Gráfico: legenda "cada ponto é o total..."; detalhe e
  tabela com os escondidos entre parênteses.
- Palco: `movimentoDaLista` detecta o splice no meio (`meio`, sem mudar as
  contagens de pilha/fila). Depois de shift, unshift e splice, cada vagão
  que mudou de posição desliza do lugar antigo para o novo, em sequência
  (classe `palco-deslizar`, `--deslize`); o vagão que sai pelo começo não
  ocupa lugar enquanto some.

### Etapa 2 — demonstrações, conteúdo publicado e guia

- `/lab`: `lab-logica-u1-f10` (fila.js: consumirComShift x
  consumirPorIndice) e `f11` (estoque.js: procurarNaLista com includes x
  procurarNoMapa com Map.has). Medições em 1.000 itens: shift 501.501
  (500.500 escondidos) x índice 2.002; includes 502.503 x Map 3.005.
  Orçamentos do objetivo "melhorar": 10.000 e 20.000 passos (pelo menos 3
  vezes a eficiente e 10 vezes abaixo da ingênua).
- Conteúdo publicado: as cinco fases com `passosNoMaximo`
  (algoritmos-essenciais u1-f2, u1-f3, u4-f1, u4-f2, u4-f3) rodadas com as
  soluções de teste: 67, 67, 15, 1.001 e 1.001 passos, nenhum escondido
  (as soluções não usam métodos nativos com custo). Nenhum orçamento
  mudou; ids e ordem intactos.
- Testes: `testes/conteudo/custoNativo.test.ts` (custo de cada método,
  classe própria, mensagens de erro, rastro, medição, demonstrações e
  sabotagem); `testes/estruturas.mjs` cobre f10 e f11 (contador, trem
  deslizando, gráfico com a diferença certa e a legenda) nos três layouts.
- Guia: seção 28.1 (o modelo, onde aparece, orçamento e quando usar
  `contarEscondidos: false`).

### Verificação

- `npm run testar:conteudo`: 17.824 testes em 46 arquivos, verdes. Build e
  lint verdes.
- `testes/estruturas.mjs` (com f10 e f11) verde nos três layouts no
  desenvolvimento.
- Bateria completa (`PARALELO=2 npm run bateria`, 166 execuções, build de
  produção) uma vez, verde ("Tudo certo"), com console limpo; inclui as
  jornadas das quatro unidades de Algoritmos essenciais nos três layouts.

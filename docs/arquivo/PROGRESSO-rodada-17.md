# Progresso: rodada 17

## Rodada 17: Ilha Lógica, parte A (Console, execução, palco da memória, circuito lógico)

Um commit por etapa. Prompt de motor: bateria completa uma vez, no fim.

### Etapa 1: currículo detalhado da Lógica

- `src/curriculo/curriculo.ts`: a ilha com 10 zonas e 33 unidades. Ordem
  ajustada (o porquê no `MAPA-CURRICULAR.md`): Resolvendo problemas foi para
  depois de Listas e objetos; Depuração para antes de Algoritmos; zona nova
  **Programa de verdade** (projeto-ponte: snippet no Chrome de verdade, sem
  Node). Ids antigos mantidos (nenhum publicado); títulos e metas das u1
  refeitos.
- `requerMotor` por unidade para a parte B: `ordenar-passos` (Resolvendo
  problemas u1 a u3), `depurador-fontes` (Depuração u2 e u3),
  `visualizador-arvore` (Estruturas u3) e `projeto-ponte-js`; fichas novas em
  `src/curriculo/motores.ts`. As zonas seguem com o `requerMotor` da parte A
  até a etapa 6.
- `docs/MAPA-CURRICULAR.md`: princípio da ilha (palco da memória), missão de
  campo por zona e as unidades com meta, conceitos, micro-passos, desafio,
  revisa e confusões.

### Etapa 2: executor instrumentado

- `src/motor/executor/`: `instrumentar.ts` (acorn, ganchos no texto, sem
  mudar as linhas; `sintaxesUsadas` para o validador `usouSintaxe`),
  `nucleo.ts` (ganchos, rastro, memória com referências, console, teste de
  funções), `formatar.ts` (texto no formato do Chrome), `erros.ts`
  (dicionário de erros de iniciante), `node.ts` (vm) e
  `executor.worker.ts` + `sessaoNavegador.ts` (Web Worker com reserva de
  tempo). Decisão e detalhes no `PROJETO.md`, "Executor de JavaScript".
- Dependência nova: `acorn` (o astring foi avaliado e ficou de fora).
- Testes: `testes/conteudo/executor.test.ts`, 59 casos.

### Etapa 3: Console, Snippet, declarativo e tutor

- Fase de programa (`programa` na fase), abas Console e Fontes liberadas por
  fase, o palco no lugar da prévia (versão simples; a completa é a etapa 4).
- `usePrograma`, `PainelConsole`, `PainelFontes`, `EntradaConsole`,
  `ValorConsole`, `BarraSimbolos`; `EditorCodigo` com JavaScript.
- Validadores `valorVariavel`, `respostaDoConsole`, `saida`, `semErro`,
  `erroDoTipo`, `usouSintaxe`, `funcaoPassa`; ações `executarNoConsole`,
  `definirSnippet`, `executarSnippet`; evento `executouCodigo`; regra
  `fase-de-programa`; progresso com o programa salvo; tutor com o código.
- Ferramentas `console` e `snippet` (e já registradas `palco-memoria` e
  `linha-do-tempo`). Tokens `--cor-js-*` e do circuito nos três temas.
- Os conceitos da Lógica ficam fora do catálogo até a unidade que os ensina
  (o glossário exige onde aprender).
- Testes: `programa.test.ts` (12), tutor e progresso;
  `testes/console.mjs` nos três layouts (verde, também no build de produção).

### Etapa 4: palco da memória e linha do tempo

- `src/motor/palco.ts` (plano puro: caixinhas, vagões, fichas, ponteiros com
  seta, molduras, o que surge e o que muda) e `componentes/palco/`
  (`PalcoMemoria`, `QuadroPalco`, `CaixinhaPalco`, `ValorPalco`,
  `LinhaDoTempo`). Animações `palco-surgir` e `palco-piscar`.
- Linha do tempo no `JogoFase` (o passo escolhido vale só para aquela
  execução), com a linha acesa no Snippet.
- Testes: `palco.test.ts` (6) e `testes/palco.mjs` nos três layouts.

### Etapa 5: circuito lógico e a demonstração no /lab

- `src/motor/circuito/modelo.ts` (independente da ilha, com realimentação),
  tipo de fase `circuito-logico`, `useCircuito`, `BancadaCircuito`,
  `PecaCircuito`, `PainelTabelaVerdade`; validadores `circuitoTabela` e
  `usouPortao`, ações, eventos, regra `circuito-logico`, progresso com o
  circuito, tutor com o circuito como código; ferramentas `circuito` e
  `tabela-verdade`.
- Currículo: o `circuito-logico` saiu de `MOTORES_PLANEJADOS`; a Decisões u2
  perdeu o `requerMotor` próprio (a zona ainda espera a etapa 6) e a sala
  "Por baixo do capô" espera só as atividades do museu.
- Demonstração `lab-logica-u1-f2` (modelo para o Sonnet).
- Testes: `circuito.test.ts` (9: simulação, De Morgan, memória, código
  batendo com a tabela, sabotagens) e `testes/circuito.mjs` nos três layouts.

### Etapa 6: unidade-modelo, guia, liberações e bateria

- Unidade `logica-primeiros-comandos-u1` "O Console calcula": F1 contas no
  Console (previsão da ordem das operações, parênteses), F2 `let` e o
  `undefined` do Console (previsão), F3 `const`, ler o TypeError, nomes
  bons e programa de três linhas com a linha do tempo, F4 desafio
  Mercadinho do Seu Zé (contexto novo, 4 partes). 8 conceitos de volta ao
  catálogo; 16 itens de revisão de programa (`ItemRevisao.programa`).
- Meta de desafio de programa com mini-palcos antes e depois
  (`memoriasDoDesafio`).
- Currículo: as 10 zonas sem `requerMotor`; a Ilha Lógica abre com a Sites
  completa. `faseLiberada`: a primeira fase de uma unidade segue o estado
  da unidade no mapa (antes dependia da última fase global anterior, que
  era da zona opcional S5 e trancava a Lógica).
- Guia, seção 25 (executor, Console e Snippet, validadores de código com
  `funcaoPassa`, ações, palco e linha do tempo, itens de revisão de
  programa, circuito, a unidade-modelo). MAPA, PROJETO e ROADMAP.
- Teste `testes/logica.mjs` (mundo, ilha, meta, apresentações, todos os
  objetivos, recarga no meio da F2, linha do tempo, desafio, unidade
  concluída) nos três layouts; entrou no `todos.mjs`.
- Bateria completa: além da Lógica, quebras antigas consertadas nos
  testes. `unidades.mjs` e `layout.mjs` clicavam em posições fixas das
  previsões giradas na rodada 16 (que só rodou a bateria de conteúdo).
  `audio.mjs` entrava na Lógica como ilha em construção; agora entra em
  Páginas vivas. `ferramentas-novas.mjs` tocava a árvore com o cartão da
  apresentação ainda deslizando; `passarApresentacao` agora espera o
  cartão parar.


# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/`. Status consolidado: `docs/ROADMAP.md`
(fonte única).

**Resumo das rodadas 1 a 16:** a fábrica de conteúdo declarativo e o
`testar:conteudo`; o congelamento (`publicar:conteudo`); o painel Estilos
dentro de Elementos com o motor de cascata próprio (especificidade,
`!important`, herança, atalhos, variáveis CSS e `@media`); o modo
documento; a camada de trilhas, temas, profissões, glossário e áudio; a
estabilidade da bateria nos três layouts; as zonas Elementos (U1 a U6),
Estilos E1 a E4 e Layout (L1 a L4) completas; e os motores que faltavam
para fechar a Ilha Sites (E5/Meu tema, modo dispositivo, painel
Lighthouse, projeto-ponte, Levar pro mundo) com a P2 como unidade-modelo;
a Ilha Sites completa (E5, R1, R2 e P1); e a Revisão do dia com a zona
opcional Ser encontrado (S1), a aba Busca, a Medição e o simulador de
campanha; os itens de revisão de U3 a P2 (174 itens) com a `bateria:conteudo`; e a zona Ser encontrado (S2 a S5) com o `/lab/revisao`. Detalhe em
`docs/arquivo/PROGRESSO-rodadas-1-a-11.md`,
`docs/arquivo/PROGRESSO-rodada-12.md`,
`docs/arquivo/PROGRESSO-rodada-13.md`,
`docs/arquivo/PROGRESSO-rodada-14.md`,
`docs/arquivo/PROGRESSO-rodada-15.md` e
`docs/arquivo/PROGRESSO-rodada-16.md`.

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

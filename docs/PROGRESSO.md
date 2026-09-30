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

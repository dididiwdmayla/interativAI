# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/`. Status consolidado: `docs/ROADMAP.md`
(fonte única).

**Resumo das rodadas 1 a 19:** a fábrica de conteúdo declarativo e o
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
campanha; os itens de revisão de U3 a P2 (174 itens) com a
`bateria:conteudo`; e a zona Ser encontrado (S2 a S5) com o `/lab/revisao`;
o executor, Console, palco da memória, circuito
lógico e a unidade-modelo da Ilha Lógica; as correções de Console, relógio, sorteio, apresentação, circuito e jornadas da rodada 18; e a zona Primeiros comandos (U2 Textos e U3 Tipos, rodada 19). Detalhe em
`docs/arquivo/PROGRESSO-rodadas-1-a-11.md`,
`docs/arquivo/PROGRESSO-rodada-12.md`,
`docs/arquivo/PROGRESSO-rodada-13.md`,
`docs/arquivo/PROGRESSO-rodada-14.md`,
`docs/arquivo/PROGRESSO-rodada-15.md`,
`docs/arquivo/PROGRESSO-rodada-16.md` e
`docs/arquivo/PROGRESSO-rodada-17.md`,
`docs/arquivo/PROGRESSO-rodada-18.md` e
`docs/arquivo/PROGRESSO-rodada-19.md`.

## Rodada 20: zona Decisões

### Etapa 0

- Base: `claude/intelligent-pascal-5va93x` (`627d6a3`, merge da zona Primeiros comandos); branch de trabalho `ccr-75a17a2f-rz2lkf`.
- Rodada 19 arquivada; ATRITOS arquivado e reaberto com a rodada 9.

### U1: Verdadeiro ou falso

- Seis fases: perguntas de sim ou não (`>` e `<`, booleano no palco); fronteira `>`/`>=`; `===` e `!==` (inclui `'10' === 10` e maiúscula); `=` contra `===` (bug provocado de propósito e consertado); `==` que converte; desafio do frete grátis na papelaria virtual.
- Seis conceitos novos com temas e doze itens de revisão (ação e previsão, situações próprias). `igualdade-estrita`, `variavel-let`, `typeof-js`, `tipo-js`, `coercao-js` entram em `revisa`.
- Guiado e sozinho da mesma habilidade na mesma fase; uma previsão por fase (opção certa varia de posição); `usouSintaxe` só como reforço (`comparacao`, `igualdade-estrita`, `igualdade-solta`).
- Negativas de jornada: `>` no lugar de `>=`, `=` no lugar de `===` e `===` no lugar de `==` não concluem o objetivo.
- `testar:conteudo` verde (33 arquivos, 9.413 testes). Jornada pelo mapa verde em desktop, retrato e paisagem (`testes/decisoes.mjs`, passos em `testes/decisoes-jornadas.json`); console limpo. `publicar:conteudo`, build e lint verdes.

### U2: Portões lógicos (a ponte circuito → código)

- Seis fases: E (porta da padaria), OU (alarme), NÃO (luz da rua), "Do circuito ao Console" (`&&`, `||`, `!` no Console, misturando comparações da U1), catraca do metrô (ordem do E e do OU, com os mesmos portões em ordens diferentes) e desafio da catraca da academia, só no Console.
- Cada fase de circuito traz 3 chaves e 2 ou 3 saídas: o guiado monta a primeira saída, o sozinho monta a seguinte (outras chaves, mesma habilidade). `circuitoTabela` confere todas as 8 linhas; `usouPortao` com `minimo` garante o portão pedido.
- "Ver como código" vem depois de montar (o circuito mostra o código `temCliente && lojaAberta`) e só então a decisão é escrita no Console, na fase 4.
- Confusões atacadas: OU aceita as duas ligadas (previsão), OU com tudo desligado, ordem do E e do OU (parênteses mudam o resultado) e `!`.
- Seis conceitos novos (portao-e, tabela-verdade, portao-ou, portao-nao, operadores-logicos, ordem-e-ou) com temas e doze itens de revisão (em Console; o item de tabela verdade é só de previsão).
- `testar:conteudo` verde (9.791 testes). Jornada pelo mapa verde em desktop, retrato e paisagem, com toque real no circuito (zoom e arrasto com dois dedos), apresentação de circuito e tabela verdade, negativas e console limpo.

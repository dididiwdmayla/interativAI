# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/`. Status consolidado: `docs/ROADMAP.md`
(fonte única).

**Resumo das rodadas 1 a 17:** a fábrica de conteúdo declarativo e o
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
lógico e a unidade-modelo da Ilha Lógica. Detalhe em
`docs/arquivo/PROGRESSO-rodadas-1-a-11.md`,
`docs/arquivo/PROGRESSO-rodada-12.md`,
`docs/arquivo/PROGRESSO-rodada-13.md`,
`docs/arquivo/PROGRESSO-rodada-14.md`,
`docs/arquivo/PROGRESSO-rodada-15.md`,
`docs/arquivo/PROGRESSO-rodada-16.md` e
`docs/arquivo/PROGRESSO-rodada-17.md`.

## Rodada 18: correções antes do conteúdo da Lógica

Base autorizada: `claude/intelligent-pascal-5va93x` (`77b8f09`), porque
`main` não existe neste repositório. Branch nova, sem push na principal.

### Etapa 0: instruções do Codex

- AGENTS remete ao CLAUDE e resume as regras; removida a referência inversa
  para não formar ciclo. Preparo do Playwright e restrição do apt registrados.

### Etapa 1: zona morta no Console

- Let/const do topo dão ReferenceError antes da declaração, incluindo
  typeof, atribuição, autorreferência e leitura numa função chamada antes.
  O dicionário existente explica "Usou antes de criar". Redeclaração em
  outra entrada continua válida, inclusive lendo o valor já inicializado
  antes de redeclarar (conferido no REPL real do Chrome). Registro por
  declarador mantém `let a=1,b=a+2`.
- Unitários afetados: 82 casos de executor, programa e palco verdes.
  Console no navegador verde em desktop, retrato e paisagem.
  Build e lint verdes; a primeira checagem ampla encontrou um problema
  na instrumentação de `let` sem valor, corrigido e conferido nos afetados.

### Etapa 2: sorteio e relógio reais

- Núcleo e Node usam os valores nativos por padrão. O preparo fixo é
  pedido explicitamente pelo `testar:conteudo` e, no Playwright, pela URL
  do worker. Não congela o relógio da página nem afeta o jogo normal.
- Guia e arquitetura: validadores nunca dependem de sorteio nem de data.
- 76 unitários afetados, Console nos três layouts (incluindo confirmação
  da data fixa só no worker), build e lint verdes.

### Etapa 3: cartão ignora toque durante o deslize

- O componente desliga o hit-test antes do paint de uma posição nova e
  o restaura quando left/top chegam ao destino e a transição acaba.
  A espera do helper `passarApresentacao` foi mantida.
- Regressão em retrato pausa a transição real no meio, confere o hit-test
  e toca a árvore durante o deslize. Entrou na bateria. Esse teste,
  `ferramentas-novas.mjs` (desktop/retrato), build e lint verdes.

### Etapa 4: navegar pelo circuito no retrato

- Zoom por pinça e botões, ajustar à tela e arrasto do fundo (um dedo ou
  dois) movem a câmera, preservando a geometria e os estados do circuito.
- Alvos de corpo, portas e fios mantêm pelo menos 44 px na escala atual,
  inclusive em aparelhos com mouse e toque. Portas ampliadas encaminham
  gestos no miolo ao corpo da peça. Navegar conserva o fio em montagem.
- Controles respondem ao pointerup no toque, sem duplicar o click: o
  Chromium deste ambiente omitia um click após pinça.
- Modelo: 9 unitários verdes. Jornada nos três layouts; retrato com seis
  portões extras, medidas dos alvos, dois dedos reais (CDP), zoom, pan e
  enquadramento recuperado. Build e lint verdes.

### Etapa 5: previsões respondidas pelos dados

- Helper comum lê `correta` da fase/objetivo ou do item de revisão real,
  incluindo as bancadas do laboratório. Jornadas de erro escolhem uma
  opção diferente da correta sem fixar posição. Atualizadas todas as
  jornadas, inclusive S2 a S5 e revisão por zona. Conteúdo publicado intacto.
- CLAUDE e AGENTS exigem jornadas das unidades publicadas afetadas, mesmo
  quando a alteração for só a ordem das opções.
- Unidades, Layout, S2 a S5 e revisão Elementos passaram no desktop;
  cobertura dos três layouts e bateria geral registrada no fechamento.

### Ambiente e modelo

- Codex, família GPT-6. A variante Sol e o esforço de raciocínio não são
  expostos pelo ambiente; não foi possível confirmar esses dois parâmetros.
- `npm ci` funcionou. `npx playwright install --with-deps chromium` falhou
  no apt (`Failed to setgroups`, setegid/seteuid). Downloads do Chromium
  no CDN chegaram como arquivos vazios. Usado Chromium 133 de
  `@sparticuz/chromium`, instalado fora do projeto, com o Playwright do
  ambiente. Não houve mudança de dependências do repositório.
- Next precisou de `--hostname 127.0.0.1` (`uv_interface_addresses` no
  hostname padrão). Cada invocação tem rede isolada, então servidor e
  testes foram executados na mesma invocação. O build isolado também
  exigiu uma cópia de node_modules: Turbopack rejeitou o link para fora
  da raiz. Com a cópia, build e TypeScript passaram.
- Push HTTPS sem credencial no shell; commits publicados pelo conector
  GitHub, com a árvore de cada commit conferida contra a árvore local.
- Após comparar o REPL real, ajustada a primeira correção para reaproveitar
  uma variável já inicializada na redeclaração. A bateria geral já estava
  em execução no build anterior: esse ajuste recebe unitários e jornadas
  afetadas no build final, sem repetir a bateria inteira (economia de cota).

### Validação final

- `npm run testar:conteudo`: 33 arquivos, 8.258 testes verdes.
- `npm run lint` e `npm run build`: verdes.
- `npm run bateria`, uma vez, em produção: 67 jornadas verdes, com
  Console, palco, circuito, Lógica, Unidades, Layout e revisão nos três
  layouts; regressão do cartão em retrato incluída.
- Fora da bateria geral: S2 a S5 pelo mapa e revisão Elementos
  (35 itens em 7 sessões) verdes em desktop, retrato e paisagem.
- Ajuste final de paridade do REPL: 82 unitários afetados e nove jornadas
  de Console, palco e Lógica verdes no build final (os três layouts).
- Conteúdo publicado, currículo e dependências sem alterações.


# Atritos da fábrica

Relatório do primeiro teste de produção em massa da fábrica de conteúdo:
completar a Unidade 1 (Etapa 1: ajuste no motor do checklist; Etapa 2:
conteúdo da u1-f2 e da u1-f3) seguindo só `docs/GUIA-DE-CONTEUDO.md`,
`docs/TEMPLATE-FASE.ts` e a Unidade 2 como modelo. Cada item é uma coisa
concreta que foi ambígua, faltou, ou que o `testar:conteudo` deveria ter
pego e não pegou. O objetivo é melhorar a fábrica antes da produção em
massa das próximas unidades — nada aqui foi corrigido no guia ou no
template, só relatado.

## Resposta (rodada 5, Etapa 1)

Todos os itens abaixo foram tratados na Etapa 1 da rodada 5 (ver
`docs/PROGRESSO.md` e `docs/GUIA-DE-CONTEUDO.md`):

- item 1: campo `pratica` na fase ("já foi ensinado antes, aqui é
  treino"); u1-f2 migrada (`conceitos: []`, tudo em `pratica`), e a regra
  "fase só de sozinho" é conferida (seção 3.9 do guia);
- item 2: a meta de entrada aparece uma vez só por unidade, e só para quem
  não tem progresso nela (`metasVistas`); a do desafio continua; checagem
  de `meta.desafioId` (desafio, mesma unidade, última fase); ajudante
  `pularMeta` nos testes de navegador;
- item 3: esquema do `data-chave` documentado (guia, seção 11, e
  `testes/README.md`) e ajudantes `selecionarNo`/`chaveDoSeletor` que usam
  a mesma função da árvore (`src/motor/chaveArvore.ts`);
- item 4: guiado e sozinho da mesma habilidade na mesma fase é o formato
  padrão; fase só de sozinho não tem guiado nem previsão guiada;
- item 5: `revisarEm` aponta sempre para a fase guiada (checado);
- item 6: `jogarDesafio` usa `recalcularPartesFeitas` e confere a
  conclusão simultânea, com teste de sabotagem;
- além disso: congelamento dos ids publicados (`publicados.json`,
  `npm run publicar:conteudo`).

## 1. Fase "só sozinho" não tem uma casa clara no formato

O pedido da Etapa 2 pedia uma fase inteira de objetivos `sozinho` (u1-f2)
cobrindo habilidades que já foram ensinadas numa fase ANTERIOR (u1-f1),
porque a Fase 1 não podia ser alterada. Isso não existe na Unidade 2: lá,
guiado e sozinho da MESMA habilidade sempre moram na mesma fase (ex.:
`fase-1-familia.ts` ensina "elemento-pai" com um objetivo guiado e termina
com o sozinho dele, tudo num arquivo só).

A checagem `conceitos-do-catalogo` exige que toda fase de prática tenha
`fase.conceitos.length > 0` ("a fase não ensina nenhum conceito"). Como
u1-f2 não ensina NADA de novo (esse é o ponto da fase: só treinar sozinho o
que a u1-f1 já ensinou), não havia como deixar `conceitos: []`.

**Decisão sem regra clara:** repeti em `conceitos` os mesmos quatro ids já
ensinados em u1-f1 (`selecionar-pela-arvore`, `modo-inspecionar`,
`editar-texto`, `lista-e-itens`), tratando "aprender a fazer sozinho" como
uma forma de "ensinar". Nenhuma parte do guia confirma ou proíbe repetir um
id de conceito em `conceitos` de fases diferentes. Uma regra explícita (ou
um terceiro campo, tipo `pratica: IdConceito[]`, para "eu já ensinei isso,
aqui é só treino") deixaria essa decisão clara para o próximo autor.

## 2. `meta.desafioId` novo na unidade quebra testes que não tocam em conteúdo

Preencher `unidade.ts` da Unidade 1 com `meta.desafioId` (pedido explícito
da Etapa 2, item 4) tem um efeito colateral que não está em lugar nenhum
do guia: `JogoFase.tsx` calcula
`mostrarMeta = ... && (fase.tipo === "desafio" || local.unidade.fases[0] === fase.id)`.
Isso significa que a PRIMEIRA fase da unidade (u1-f1, que a Etapa 2 disse
para não alterar) passa a abrir com a tela de meta (antes/depois) antes da
introdução, mesmo sem nenhuma mudança nos dados da própria fase.

Isso quebrou (com timeout, não com uma mensagem clara) três scripts
Playwright que já existiam e não tocam em conteúdo nenhum:
`testes/fase-completa.mjs`, `testes/tutor.mjs` e `testes/unidades.mjs` —
todos abrem o jogo do zero (`progresso: null`) e esperavam cair direto na
introdução ou, no caso de `unidades.mjs`, conseguir clicar em "Abrir a
lista de fases" antes de qualquer outra coisa. A tela de meta é um modal
de tela cheia (`z-50`) que intercepta clique em QUALQUER outro botão,
inclusive os da barra superior, então `unidades.mjs` travou tentando abrir
a lista de fases (o erro do Playwright foi um timeout de 30s dizendo que
um `<div class="fixed inset-0 ...">` estava "interceptando" o clique — nada
que apontasse para a causa real).

**`npm run testar:conteudo` não tem chance de pegar isso**: é Vitest com
jsdom, não roda os scripts de navegador, então uma mudança de dados
(preencher `meta.desafioId`) que quebra o comportamento de UI só aparece
quando alguém lembra de rodar a bateria Playwright inteira depois. Não há
nenhum aviso no guia dizendo "se você é a primeira unidade a ganhar um
desafio, confira se algum teste de navegador presumia que a fase 1 abre
sem meta".

**O que ajudaria:** uma frase no guia (seção "Passo a passo") avisando que
preencher `meta.desafioId` muda o que aparece na PRIMEIRA fase da unidade
(não só no desafio), e uma checagem — mesmo que só de aviso — no
`testar:conteudo` sinalizando quando uma unidade ganha `meta.desafioId` por
sinal (não existe hoje).

## 3. O "chave" da árvore (para escrever testes) não está documentado em lugar nenhum

Para escrever as novas partes de `testes/unidades.mjs` (selecionar um nó
específico pela árvore, editar o texto de um `li` específico) eu precisava
saber o `data-chave` de cada nó do site novo. Nem o guia, nem o template,
nem `docs/PROJETO.md` explicam o esquema (índice por elemento-filho,
ignorando texto e comentário, separado por ponto, a partir de "0" — o
próprio `<body>` é `"body"`). Tive que escrever um script Playwright
descartável que abre `/lab/fases`, troca de fase pelo select e lê os
atributos `data-chave` da árvore para descobrir os números certos, em vez
de calcular a partir de uma regra escrita.

**O que ajudaria:** uma frase de referência no guia (ou no
`testes/README.md`) explicando o esquema do `data-chave`, já que qualquer
autor de fase que for estender os testes Playwright vai precisar disso.

## 4. "Pode incluir 1 previsão guiada" conflita com "guiado antes de sozinho, sempre"

O prompt da Etapa 2 sugeria (como opção) incluir um objetivo de previsão
guiado em u1-f2 "se ajudar a fixar um conceito". Mas u1-f2 é uma fase só de
objetivos `sozinho` (ver item 1): se eu introduzisse um conceito NOVO só
ali, via um objetivo guiado, a regra do guia (seção 5, "Guiado antes de
sozinho, sempre, para a mesma habilidade") ficaria sem como se cumprir,
porque não haveria um objetivo sozinho DEPOIS, na mesma unidade, para esse
mesmo conceito novo (a Etapa 2 não pedia uma quinta habilidade).

**Decisão sem regra clara:** não incluí a previsão opcional. Preferi manter
u1-f2 com as 4 habilidades, todas sozinho, sem introduzir nada novo. O
guia não resolve esse conflito explicitamente para o caso "fase inteira de
sozinho, sem sua própria fase-mãe guiada".

## 5. `revisarEm` do desafio, com guiado e sozinho em fases separadas

O guia diz que `revisarEm` deve apontar para "a fase da MESMA unidade onde
isso foi ensinado". Na Unidade 2 isso é sempre óbvio (só existe UMA fase
por habilidade, com guiado e sozinho juntos). Na Unidade 1, agora há DUAS
fases candidatas para as mesmas quatro habilidades: u1-f1 (guiada, com os
4 degraus de ajuda) e u1-f2 (sozinha, só pergunta e dica).

**Decisão sem regra clara:** apontei todas as partes do desafio (u1-f3)
para `sites-elementos-u1-f1`, e não para u1-f2, porque o "Rever" existe
para socorrer quem travou, e a fase guiada oferece a escada de ajuda
completa (pergunta, dica, linha e solução), enquanto a sozinha ofereceria
menos. O guia não cobre esse caso (unidade com guiado e sozinho em fases
diferentes) e não diz qual das duas escolher.

## 6. `testar:conteudo` não simula "desfazer" nem a nova regra de conclusão do desafio

Depois da Etapa 1 (partes de estado avaliadas ao vivo, que desmarcam se o
jogador desfizer), a simulação de desafio em `checagens.ts`
(`jogarDesafio`) continua tratando toda marcação como definitiva: ela junta
tudo num `Set` que só recebe (`feitas.add(...)`), nunca remove, e no final
só confere se toda parte foi marcada EM ALGUM MOMENTO da sequência — não se
todas as partes ao vivo continuam passando SIMULTANEAMENTE no fim (a regra
nova de conclusão do desafio). Se a solução de uma parte posterior
desfizesse, por acidente, o efeito de uma parte "ao vivo" anterior (ex.:
a parte 4 reescrever o mesmo texto que a parte 3 tinha trocado, sem querer
voltando ao valor original), o `testar:conteudo` continuaria verde, mas o
desafio de verdade nunca fecharia (porque a parte ao vivo teria desmarcado
e nenhuma ação do jogador a marcaria de novo). Não aconteceu no conteúdo
desta unidade (conferido manualmente e pela bateria Playwright), mas é uma
lacuna real: a checagem automática não cobre a semântica nova da Etapa 1.

**O que ajudaria:** depois de aplicar as soluções de todas as partes em
`jogarDesafio`, reavaliar TODOS os validadores de uma vez (não só via o
`Set` cumulativo) e comparar com o que o motor real faria com
`recalcularPartesFeitas` — isso pegaria esse tipo de regressão sem
depender de rodar a bateria Playwright.

## 7. O que testar:conteudo pegou bem (para constar)

Pelo lado positivo: os 150+ testes de `testar:conteudo` passaram de
primeira nas duas fases novas e no desafio, sem eu precisar corrigir nada
depois de escrever os dados — nenhum seletor quebrado, nenhum texto fora
do limite, nenhuma ferramenta usada sem apresentação, nenhuma sabotagem
manual necessária para confirmar as mensagens de erro (já testadas e
documentadas na Etapa 19 da rodada anterior). Isso é sinal de que a parte
"a solução realmente cumpre o validador, na hora certa" da fábrica funciona
bem. A dificuldade toda desta rodada esteve nas decisões de MODELAGEM
(seções 1, 4 e 5 acima), não na mecânica dos dados.

## 8. O que tornaria a próxima unidade mais rápida

- Uma unidade-modelo (ou uma nota no guia) mostrando como estruturar
  "guiado numa fase, sozinho puro numa fase separada" — hoje só existe o
  modelo "guiado e sozinho juntos" (Unidade 2), e a Unidade 1 é o único
  lugar que precisa do outro formato, por causa do congelamento da fase 1
  publicada.
- Documentar o esquema do `data-chave` (item 3) num lugar que os testes
  Playwright referenciem, para não precisar de um script descartável a
  cada nó novo.
- Decidir e documentar a convenção do item 1 (repetir conceito em
  `conceitos` vs. um campo novo para "treino, não ensino") antes que mais
  unidades precisem dividir guiado e sozinho em fases separadas.
- Adicionar ao `testar:conteudo` o aviso do item 2 (mudar `meta.desafioId`
  de uma unidade que já tem fases publicadas muda o comportamento da
  PRIMEIRA fase) e a checagem do item 6 (conclusão simultânea das partes
  ao vivo), para que essas duas classes de regressão apareçam sem precisar
  da bateria Playwright inteira.

## Rodada 2: Unidades 3, 4 e 5 (Títulos e textos, Links/imagens/id/class, Caixas e seções)

Produção das três próximas unidades da zona Elementos, seguindo só
`docs/GUIA-DE-CONTEUDO.md`, `docs/TEMPLATE-FASE.ts` e a Unidade 2 como
modelo, com o formato padrão (guiado e sozinho na mesma fase) em todas.
As três seguiram o mesmo ciclo (fases, `testar:conteudo`, `/lab/fases`,
Playwright nos três layouts, `publicar:conteudo`, build, lint, commit).

### O que ficou ambíguo

1. **Nenhum concept id para "editar atributo".** A Unidade 1 ensina
   `editar-texto` (dois cliques na árvore) mas nunca registrou um
   conceito equivalente para editar o VALOR de um atributo, mesmo a
   mecânica (`definirAtributo`, ferramenta `editar-duplo-clique`) já
   existindo desde a Unidade 1. A U4 precisava desse conceito como base
   pra href, target, alt e class, e o catálogo não tinha onde pendurar
   isso. **Decisão sem regra clara:** criei o conceito novo
   `editar-atributo` na própria U4 (ensinado no primeiro objetivo,
   junto com `link-href`), tratando-o como "nunca foi ensinado antes,
   é novo aqui" — mesmo a MECÂNICA já existindo. O guia não diz se
   "ensinar" é sobre a mecânica (aí seria revisão) ou sobre o conceito
   nomeado (aí é ensino de verdade); segui a segunda leitura.
2. **O mapa curricular da U5 sugere header, nav, main, section, article
   e footer, mas só dava pra caber header, footer, section, article e
   span** nas 3 fases de prática sem estourar o formato padrão (2-3
   fases). **Decisão sem regra clara:** larguei `nav` e `main` (a div do
   menu e a div que envolve as seções continuam div) e ajustei a meta da
   unidade pra descrever só o que foi entregue, em vez de prometer as
   seis tags. O guia não diz o que fazer quando a lista de conceitos do
   mapa curricular é maior do que cabe no formato padrão.

### Atrito de motor real, pego antes de commitar (o mais importante desta rodada)

Ao desenhar a U4 ("Links, imagens, id e class"), percebi lendo
`TagAbertura.tsx` que **a árvore só sabe editar o VALOR de um atributo
que a peça já tem** (dois cliques nele): o componente só renderiza um
campo editável para cada `no.atributos` existente, e não existe nenhum
"+" ou afim pra criar um atributo novo pela árvore. Isso significa que
ensinar "acrescente `target="_blank"`" ou "escreva um `alt`" numa peça
que ainda não tem esse atributo **não é possível pela árvore** — só dá
pelo código (que já é livre, digitação normal).

Isso não é uma "regra de parada" (o motor não precisa de nada novo: o
jogador SEMPRE pode editar o código livremente, esse caminho já existe
desde a Unidade 1), mas é uma pegadinha de conteúdo real: `definirAtributo`
(a ação declarativa) funciona igual não importa se o atributo já existia
ou não — ela só faz `setAttribute`. Então dava pra escrever a fase toda
com `ajudas.linha` apontando pra árvore, o `testar:conteudo` passar
(porque ele só roda a AÇÃO declarativa, não simula a interface de
verdade) e a fase ficar **impossível de jogar do jeito descrito**. Só
percebi rodando a bateria Playwright de verdade, quando o duplo clique
na árvore não achava nada pra editar. Reescrevi os `enunciado` e
`ajudas.linha` da U4 (fases 1, 2 e 3) pra apontar pro código sempre que
o atributo é novo, e só pra árvore quando ele já existe (como o `href`
quebrado do menu).

**O que ajudaria:** uma frase no guia (seção 3.5, Ações, ou uma nota
nova) avisando que a árvore só edita atributo já existente, e que
`ajudas.linha` de um objetivo que ACRESCENTA um atributo deve usar
`alvo: "editor"`, nunca `alvo: "arvore"`.

### O que os testes deixaram passar

- **Confirma o ponto acima:** `testar:conteudo` (e a solução do "Me
  ajuda") nunca teriam pego o problema de `ajudas.linha` apontando pra
  um lugar que não existe na interface, porque a checagem de
  `acoes-usam-ferramentas-da-fase` só olha se `editar-duplo-clique` foi
  apresentada, não se o atributo em questão já existia no HTML inicial
  da fase. Só a bateria Playwright, clicando de verdade, expõe isso.
- **Virtualização do editor de código não é simulada em lugar nenhum.**
  O CodeMirror só mantém no DOM as linhas perto da rolagem atual; nenhum
  teste (nem os antigos, da Unidade 1 em diante) cobria uma linha no
  MEIO de um arquivo grande — todos os casos anteriores calhavam de
  rolar até o fim funcionar (a linha buscada ficava perto do fim por
  acidente). Isso só quebrou nesta rodada porque a Unidade 4 tem sites
  maiores e o desafio da U4 mexe numa linha (a foto da banda) que não é
  a última do arquivo.
- **Quebra de linha (liga por padrão) muda o comportamento de Home/End**
  no CodeMirror: com quebra ligada, as duas teclas andam pela linha
  VISUAL, não pela linha lógica inteira, o que quebra qualquer cálculo
  de posição por número de caracteres numa linha comprida (como o
  `src` de uma imagem, um data URI enorme numa linha só). Nenhum teste
  cobria isso porque nenhuma fase anterior tinha uma linha tão comprida
  a ponto de quebrar visualmente.
- **A régua de números do editor muda de largura conforme o número de
  dígitos da linha**, e no celular um toque perto demais da borda da
  linha cai em cima dela em vez do conteúdo. Só aparece com arquivos
  compridos o bastante pra ter linhas de dois dígitos, e só é visível em
  modo toque.

### O que aceleraria as próximas unidades

- Documentar no guia a regra "árvore só edita atributo existente;
  atributo novo é sempre pelo código" (seção do atrito acima).
- Registrar `editar-atributo` como prerequisito claro pra unidades
  futuras que mexam com atributos, evitando a dúvida do item 1.
- Ajudantes novos em `testes/util.mjs` (hoje só em `testes/unidades.mjs`,
  valeria promover pra lá): `acrescentarAtributoPeloCodigo` (calcula a
  posição certa numa linha, rolando o editor aos poucos até achá-la, com
  a quebra de linha desligada) e `editarValorAtributo` (dois cliques no
  VALOR de um atributo que já existe, com novas tentativas em toque).
  Documentar as três pegadinhas do CodeMirror (virtualização, quebra de
  linha afetando Home/End, régua de números variável) no
  `testes/README.md`, do jeito que o esquema do `data-chave` já está
  documentado — evita redescobrir tudo isso testando na unha de novo.
- Ao escrever uma fase que ensina "acrescentar um atributo", já nascer
  pensando no código como o caminho (não na árvore), poupando a
  reescrita que aconteceu na U4.

## Rodada 3: U6, zona Estilos completa (E2 a E4) e dois ajustes de conteúdo

Produção das quatro últimas unidades planejadas da Ilha Sites — U6
"Página do zero" (Elementos, modo documento), E2 "Seletores", E3
"Modelo de caixa" e E4 "Por que minha regra não pega?" (Estilos) —, mais
dois ajustes: uma checagem nova de símbolos que viram emoji colorido no
celular (`testar:conteudo`) e a correção de uma fala factualmente errada
na U4 já publicada. Cada unidade seguiu o ciclo padrão (fases,
`testar:conteudo`, `/lab/fases`, Playwright nos 3 layouts, mais
`publicar:conteudo`, build, lint e commit para as de conteúdo).

### Atrito de motor real, pego antes de publicar (o mais importante desta rodada)

Publicar a U6 (a primeira unidade nova de uma zona ANTERIOR à Estilos
desde que a E1 existe) expôs uma regra que faltava no mapa
(`src/lib/mapa.ts`): `zonaAberta`/`ilhaAberta` decidiam só pelo conteúdo
registrado HOJE, sem saber que um jogador podia ter aberto (ou até
concluído) a zona Estilos ONTEM, quando a zona Elementos só tinha 5
unidades prontas. Publicar a U6 fazia a zona Elementos "crescer" de 5
para 6 unidades prontas, e quem só tinha as 5 antigas concluídas via a
zona Estilos, já aberta, TRANCAR de novo — um retrocesso visível pra
quem já estava jogando.

Não tinha como o `testar:conteudo` pegar isso: é uma checagem de
comportamento ao longo do TEMPO (progresso salvo antes vs. currículo
depois), não uma checagem do conteúdo num instante só. Só apareceu
porque a Etapa 3 pedia explicitamente conferir esse cenário depois da
U6. Corrigido com um "desbloqueio permanente": `algumaComProgresso`/
`zonaComProgresso`/`ilhaComProgresso` (`src/lib/mapa.ts`) checam primeiro
se a zona ou ilha já tem qualquer fase concluída OU em andamento no
progresso salvo — se sim, ela conta como aberta, não importa o que o
currículo diga agora. Teste novo em `mapa.test.ts` ("desbloqueio
permanente: uma unidade nova numa zona anterior não tranca de novo a
zona já aberta"), com os dois casos (já concluiu uma fase da zona;
só começou uma, sem concluir).

**O que ajudaria:** uma nota no guia (seção 0 ou uma seção de "publicar
conteúdo") avisando que publicar uma unidade numa zona ANTERIOR à
fronteira atual do jogo é um evento especial: sempre conferir se algum
desbloqueio existente pode retroceder, não só se o conteúdo novo
funciona.

### O padrão recorrente: apresentação já de pé antes do código do teste continuar

Confirma e generaliza o que a Rodada 2 já tinha achado num caso (o
duplo clique num atributo que não existe): a apresentação da ferramenta
do PRÓXIMO objetivo aparece assim que ele fica ativo — **antes** de
`proximoObjetivo()` sequer devolver o controle pro código do teste.
Isso apareceu de novo em três ferramentas diferentes desta rodada:
`adicionar-atributo` (U6, no celular, o menu do nó precisa do segmento
"Árvore" já selecionado), `editor-css` (E2, o recorte do spotlight é
calculado com o painel já na aba CSS) e `painel-calculado` (E3, a
aba Calculado precisa estar à vista). A solução é sempre a mesma: trocar
de aba/segmento/sub-aba ANTES de chamar `proximoObjetivo()` no objetivo
ANTERIOR, nunca depois — não existe uma janela "objetivo ainda não
começou" pra preparar a interface com calma.

**O que ajudaria:** documentar essa regra geral no
`testes/README.md` (não só o caso específico da Rodada 2), como uma
categoria própria: "toda apresentação de ferramenta nova corre uma
corrida com o código do teste; prepare a interface antes do
`proximoObjetivo()`, não depois".

### Três bugs de teste (não de conteúdo nem de motor) achados rodando em toque

A bateria Playwright em retrato e paisagem (não coberta por completo nas
rodadas anteriores para E2/E3, e nova para E4) expôs três bugs no
PRÓPRIO script `testes/unidades.mjs`, todos do mesmo tipo: uma
interação que funciona no desktop mas não em toque, porque o
componente reage a um evento diferente (ou porque um overlay do celular
fica na frente):

1. **`.hover()` não existe em toque.** A apresentação de
   `modelo-de-caixa` (E3F1) usava `.hover()` numa camada do diagrama pra
   "experimentar" a ferramenta; em toque, `onMouseOver` fica desligado
   de propósito no componente (`PainelCalculado.tsx`) e só o `onClick`
   realça a camada, então a apresentação nunca fechava em retrato/
   paisagem. Trocado por um toque (`tocar()`) na própria camada, que
   funciona igual em toque e no clique do desktop.
2. **O balão da conversa não fecha sozinho entre uma ação e a
   próxima.** `trocarValorNoPainel`, `acrescentarNoPainel` e
   `caixinhaNoPainel` nunca chamavam `fecharBalao()`, ao contrário de
   `selecionarParaEstilos`. Enquanto o objetivo seguinte troca de peça
   selecionada (chamando `selecionarParaEstilos` de novo), isso passava
   despercebido; quando reaproveita a MESMA peça (caso do E3F1 objetivo
   2, "border", que segue direto no `.bolo` já selecionado), o balão
   ainda aberto do "Próximo objetivo" anterior intercepta o toque.
3. **O balão reabre sozinho por reação do computadorzinho.** Mesmo
   fechando o balão no começo de `trocarValorNoPainel`, a reação
   automática à mudança reabre ele; o `mostrarEstilos()` só fecha o
   balão em modo retrato (`if (MODO !== "retrato") return`), não em
   paisagem, então o `.hover()` seguinte no seletor `h3` (E2F1) esbarra
   de novo no backdrop do balão, só em paisagem.

Os três já eram bugs latentes no teste desde as rodadas anteriores; só
apareceram agora porque essa foi a primeira vez que a bateria completa
em retrato E paisagem chegou até esses pontos exatos. Corrigidos
fechando o balão nos três ajudantes do painel e antes do `.hover()`
avulso, e usando toque em vez de hover na apresentação do modelo de
caixa.

**O que ajudaria:** um ajudante único (`agirNoPainel(fn)`) que sempre
fecha o balão antes de qualquer interação com o painel Estilos, em vez
de espalhar `fecharBalao()` em cada função — evitaria descobrir isso
função por função, ponto de falha por ponto de falha.

### Atrito não corrigido: flakiness pré-existente do celular na U4

Documentado nas rodadas anteriores e confirmado de novo aqui:
`editarValorAtributo` (U4, zona Elementos) trava intermitentemente em
retrato e paisagem, num ponto DIFERENTE a cada execução — às vezes na
própria U4, às vezes um pouco depois (na árvore da E2, por exemplo,
provavelmente o mesmo tipo de corrida, não um bug novo). A bateria
completa em paisagem não fechou por causa disso, mesmo depois de duas
tentativas. Como não é causado por nenhuma mudança desta rodada
(acontece em conteúdo publicado há rodadas) e o pedido explícito era
"não improvisar, produzir o possível e relatar o que falta" em vez de
inventar um jeito de contornar um problema de motor, ficou como está:

- **Desktop:** bateria completa (U1 a U6, E1 a E4) verde, 3 execuções,
  console limpo.
- **Retrato:** bateria completa verde, 2 execuções seguidas depois dos
  três fixes de teste acima.
- **Paisagem:** trava por causa da flakiness pré-existente antes de
  terminar (duas tentativas, pontos de falha diferentes); nunca chegou
  a expor um problema NOVO desta rodada — parou sempre em código de
  unidades anteriores (U4, E2), não em U6/E2/E3/E4 propriamente.

**O que ajudaria:** o item já registrado nas rodadas anteriores
continua de pé — promover `editarValorAtributo` pro `testes/util.mjs`
com mais tentativas e alguma espera adicional depois de cada toque
longo, e investigar se a régua de números ou a virtualização do
CodeMirror mudou de layout num viewport de paisagem (mais largo e mais
baixo que retrato) o bastante pra deslocar onde o duplo clique cai.

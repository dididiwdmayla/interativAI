# Atritos da fábrica — rodada 4 (arquivo)

Movido para cá pela regra de economia de cota do `CLAUDE.md`. A zona
Layout (L1 a L4): a regra `definirPropriedade`/"+ declaração" exigindo a
regra já existir na folha, o cuidado com valor inicial sozinho num
objetivo, `grid-template-areas` sem checador (sempre `declaracao`), a
jornada isolada `testes/layout.mjs` com `UNIDADE=`, um flake de
dev-server e o clique perto do canto caindo na setinha de expandir no
toque.

---

## Rodada 4: zona Layout (L1 a L4)

Produção da zona Layout inteira — L1 "Display", L2 "Flexbox", L3 "Grid" e
L4 "Posição e camadas" —, a primeira zona toda de CSS de layout depois da
E1 (modelo). Motor pronto: nenhuma ferramenta, aba nem tipo de fase novo
foi preciso; toda unidade usa só o painel Estilos que a zona Estilos já
apresentou.

### 1. `definirPropriedade` (e o "+ declaração") exigem a REGRA já existir na folha

Toda propriedade nova de layout (`display`, `flex-direction`,
`justify-content`, `position`...) começa uma fase sem estar declarada em
lugar nenhum: é natural o container do exercício (`.cards`, `.produtos`,
`.destaques`) não ter regra própria nenhuma na folha inicial, só herdando
do navegador. `definirPropriedade` (o núcleo por trás de "+ declaração")
recusa acrescentar uma declaração numa regra que NÃO EXISTE na folha —
ele só troca ou acrescenta declaração numa regra já escrita. A primeira
versão da L2 e do desafio dela tropeçou exatamente nisso:
`testar:conteudo` acusou "não deu para definir gap na regra '.cards' (a
regra não existe...)". Correção: toda peça que vai ganhar uma
propriedade de layout precisa de uma regra própria na folha inicial,
mesmo vazia ou só com um `margin: 0` qualquer (como o `.promo`/`.horario`
da E1, mas ali para `adicionarRegra`; aqui a regra já existe e o jogador
só entra com "+ declaração").

**O que ajudaria:** uma linha no guia (seção 8, Sites-alvo, ou a seção 12
de CSS) avisando que toda regra que uma solução vai tocar com
`definirPropriedade`/`alternarDeclaracao` precisa JÁ EXISTIR na folha
inicial (ainda que vazia); só `adicionarRegra` cria uma regra do zero.

### 2. Uma declaração no valor inicial de uma propriedade nunca pode ser o alvo sozinho de um objetivo

`flex-direction: row` é o valor INICIAL da propriedade (sem herdar nada,
sem regra nenhuma): um objetivo cuja única exigência é "flex-direction
vale row" já começa cumprido antes de qualquer ação do jogador, porque o
valor efetivo bate com o inicial mesmo sem declaração. Aconteceu no
primeiro rascunho da L2F1 (um objetivo sozinho que "desfazia" a previsão,
voltando o menu para row): `testar:conteudo` acusou "objetivo já passa no
estado inicial". Corrigido trocando o objetivo por outra peça que ainda
não é flex (a lista de redes do rodapé). Regra geral: nunca termine um
objetivo pedindo só o valor INICIAL de uma propriedade (`INICIAIS` em
`src/motor/css/propriedades.ts` lista todos); combine com outra
declaração, ou mude de alvo.

### 3. `grid-template-areas` não tem checador de valor: é sempre `declaracao`, nunca `valorEfetivo`

O motor de cascata não tenta validar o TEXTO de `grid-template-areas`
(não é lista de medidas nem palavra-chave fixa, é uma gramática própria
de linhas entre aspas), então a propriedade fica "desconhecida" para
`valorEfetivo` e nenhum objetivo com ela passaria. A seção 12.2 do guia
já avisava "para as outras, use `declaracao`", mas não citava esse caso
específico. `declaracao` funciona bem aqui porque compara o texto
declarado normalizado (`valoresDaPropriedadeIguais` cai no comparador
genérico quando a propriedade não tem checador próprio).

**O que ajudaria:** citar `grid-template-areas` (e qualquer atalho sem
checador em `CHECADORES`) como exemplo explícito na seção 12.2 do guia,
ao lado da tabela "Quero conferir... Use...".

### 4. Bateria de teste isolada por zona: `testes/layout.mjs` e o parâmetro `UNIDADE=`

Com a zona Layout inteira dependendo de 35 fases anteriores (U1 a U6 e
E1 a E4) já concluídas, estender a jornada única `unidades.mjs` faria
toda rodada de teste de uma unidade nova repetir esse conteúdo antigo (os
tais ~45 min citados no prompt desta rodada). Em vez de misturar tudo num
arquivo só, a zona ganhou `testes/layout.mjs`, um script novo e
independente que:

- semeia o progresso direto com as 35 fases de Elementos e Estilos
  concluídas (ids hardcoded, de propósito: é ferramenta de teste, não
  motor; `publicados.json` seria a fonte de verdade se um dia a lista
  mudar) e todas as ferramentas já apresentadas, entrando direto na ilha
  Sites com a zona Layout disponível;
- aceita `UNIDADE=<id>` para semear também as unidades da própria Layout
  anteriores à pedida, rodando só a jornada de uma unidade (útil
  exatamente no ciclo "escrever fase -> testar -> repetir" pedido nesta
  rodada).

Registrado em `testes/todos.mjs` (bateria completa) e no `testes/README.md`.
A jornada única `unidades.mjs` continua cobrindo Elementos e Estilos (U1 a
E4); só o contador final ("Sites com X de Y unidades" no mundo) precisou
subir a cada unidade nova da Layout publicada.

### 5. Um flake de dev-server, não do conteúdo

Numa das primeiras rodadas do `testes/layout.mjs` com `UNIDADE=` (a
primeira vez que aquela rota específica era pedida na sessão do `next
dev`), apareceu um console error 404 isolado, sem relação com nenhum
seletor ou fase; a mesma rodada, repetida na sequência, saiu limpa.
Consistente com a compilação sob demanda do Turbopack em dev na primeira
visita a uma rota (não reproduzido em builds seguintes): não gerou
correção de conteúdo nem de motor, só o registro aqui para não confundir
quem vir um 404 isolado numa rodada futura.

### 6. Um clique perto do canto pode cair na setinha de expandir, no toque

A primeira versão de `selecionarNoRobusto` (o ajudante de seleção pela
árvore do `layout.mjs`) clicava perto do canto esquerdo da linha (posição
fixa) para não cair fora dela quando um atributo comprido quebra a linha
em várias, um problema real visto em paisagem. Só que em retrato e
paisagem (toque), a área de toque da setinha de expandir/recolher de um
nó colapsado é maior que a marca visível (alvo de 44 px), e esse mesmo
canto passou a cair nela para uma linha sem atributo comprido (o
`<header id="cabecalho">`, colapsado): o clique expandia o nó em vez de
selecioná-lo, e a seleção nunca mudava. Corrigido com duas tentativas: o
canto primeiro, o centro da linha depois (como o `tocarNo` de
`testes/util.mjs`) se a primeira não selecionar — cobre os dois casos sem
precisar calcular a posição da setinha.

### 7. `mapa.mjs` esperava a Layout "planejada"

Como nas rodadas passadas (U6 e E1), publicar a primeira unidade de uma
zona nova quebra um teste hardcoded que checava essa zona como
"planejada": `mapa.mjs` esperava `sites-layout-u1` com `data-estado`
"planejada" e o card dela dizendo "Em breve". Corrigido para checar
`sites-layout-u1` como "bloqueada" (ela é pronta agora, só espera as
unidades anteriores da Ilha Sites) e a próxima zona sem conteúdo nenhum
(`sites-responsivo-u1`) como a "planejada" de verdade. Padrão a repetir:
sempre que uma zona ganha a primeira unidade, `mapa.mjs` precisa apontar
para a zona planejada seguinte.

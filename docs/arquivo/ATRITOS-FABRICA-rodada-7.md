# Atritos da fábrica

Registro de coisas concretas que foram ambíguas, faltaram ou que o
`testar:conteudo` deveria ter pego e não pegou, ao produzir conteúdo
seguindo `docs/GUIA-DE-CONTEUDO.md` e `docs/TEMPLATE-FASE.ts`. Regra de
economia de cota (`CLAUDE.md`): este arquivo guarda só a rodada mais
recente; as antigas ficam em `docs/arquivo/`.

**Resumo das rodadas 1 a 6:** o primeiro teste de produção em massa da
fábrica (Unidade 1), a Unidade 6, a zona Estilos completa, a causa raiz
da instabilidade da bateria no celular e a zona Layout completa (L1 a
L4), com a jornada de teste isolada por zona (`UNIDADE=<id>`), a Ilha
Sites completa (E5, R1, R2 e P1) e os itens de revisão de U3 a P2 (174
itens, a resposta certa girada à mão). Detalhe em
`docs/arquivo/ATRITOS-FABRICA-rodadas-1-a-3.md`,
`docs/arquivo/ATRITOS-FABRICA-rodada-4.md`,
`docs/arquivo/ATRITOS-FABRICA-rodada-5.md` e
`docs/arquivo/ATRITOS-FABRICA-rodada-6.md`.

## Rodada 7: a zona Ser encontrado (S2 a S5)

Quatro unidades (18 fases, 22 conceitos novos, 44 itens de revisão) em um prompt só, com o
simulador de campanha, a Medição e a Busca já prontos. O
`testar:conteudo` pegou quase tudo de primeira; os atritos foram de
encaixe entre o conteúdo e as peças que só o S1 tinha usado.

### 1. Itens e índice só reconheciam a fase de prática como "quem ensina"

`conferirItensDeRevisao` e `testes/conteudo/indice.test.ts` comparavam
`fase.tipo === "pratica"`. A S5 é `simulador-campanha` (tem objetivos, e o
agendador da revisão já a reconhecia por `temObjetivos`): os 12 itens da
S5 acusavam "nenhuma fase ensina o conceito". Corrigido com
`temObjetivos` nas duas. Vale para todo tipo de fase futuro com objetivos.

### 2. O simulador não cabe em "desafio": a S5 fica sem `meta.desafioId`

Os validadores `simulacao` só existem no tipo `simulador-campanha`, e o
`testar:conteudo` exige que a fase de `meta.desafioId` seja do tipo
`desafio`. O desafio da S5 é a última fase do simulador (só de sozinho,
`conceitos` vazio) e a unidade não tem meta com antes e depois. Se um dia
valer a pena, `desafio` aceitaria os validadores de simulação.

### 3. Nenhuma tela mostra o `plataformas-marketing.ts`

O mapa curricular diz que "a tela mostra conferido em <data>", mas nada
lia o arquivo. Sem mexer no motor: as fases carregam o "conferido em" em
uma fala ou na missão de campo, e a regra nova `conferido-em-nas-fases`
cobra isso das unidades em `usadaEm` e acusa data que o arquivo não tem.
O tipo ganhou `fatos` e `fontes` (dado). Fica em "Pendências" a tela que
liste os passos.

### 4. Texto livre só se confere por "mudou" ou por igualdade

Resposta a avaliação, h1, texto que responde: só há `textoDiferenteDoInicial`
e `textoIgual`. As fases dizem no comentário do topo que a qualidade do
texto é do jogador e do computadorzinho. Um `textoContem` resolveria o
que hoje é honra (por exemplo, "o h1 fala do que a página trata").

### 5. Detalhes que custaram uma tentativa nos testes de navegador

- O editor do modo documento recua o conteúdo do head: o trecho a trocar
  aceita espaços no começo de cada linha.
- O `.cm-content` só desenha as linhas visíveis: o texto inteiro vem de
  `no.cmTile.view.state.doc` (o `innerText` truncava a página do desafio).
- O `title` do iframe da prévia é o do site (não "Site..."): o seletor é
  `section[data-previa] iframe`.
- No retrato, o balão que reabre depois de uma ação cobre o botão
  seguinte: `fecharBalao` antes de cada toque numa ferramenta.
- O `pkill -f` derruba o próprio shell do agente: mate os servidores por PID.

### 5.1 Mais duas coisas pequenas

- A `temas.test.ts` supunha Interfaces em toda unidade de Sites; a zona
  opcional é de Presença digital e ficou fora dessa conta.
- Um mini-site de item com a URL de um site de fase antigo (Vidraçaria
  Cristal) foi acusado pela checagem; custou um nome novo.

### 6. Escrever números do simulador às cegas não funciona

O estado inicial de cada objetivo precisa falhar e a solução precisa
passar, e o modelo tem manhas: acima do mínimo, o lance não muda o custo do
1º lugar (é o mínimo para ficar na frente); a palavra-chave só muda o
volume de buscas; o contraste do rodapé sozinho não mexeu na nota em uma
página pequena. Os números foram explorados com um teste descartável
(`simularCampanha` com a página ruim e a boa) antes de escrever os
objetivos. Uma tabela dessas no `/lab` ajudaria o próximo.

### 7. O volume ainda pede gerador

Os 44 itens (2 por conceito) saíram de um gerador local (não entrou no
repositório, como na rodada 6): uma lista compacta vira um arquivo por
conceito, com o comentário no topo e as imagens em `data:`. Promover o
gerador à fábrica segue em aberto.

# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-39.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 42: termos em inglês e glossário bilíngue

Branch `codex/glossario-bilingue`, base `864d1f7`. IDs, resumos e fases
publicadas preservados.

### Etapa 1 — Catálogo

252 conceitos antigos receberam `termoIngles`, com vocabulário técnico:
array, breakpoint, scope, accumulator, type selector e call frame.
Conceitos compostos usam os dois termos quando necessário (step into / step out).
Único conceito sem equivalente: `salvar-como-meu-tema` (Salvar como Meu tema),
recurso próprio do jogo, marcado com `semEquivalenteIngles: true`.
Fontes: [MDN Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array),
[seletores CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selectors_and_combinators),
[Chrome DevTools](https://developer.chrome.com/docs/devtools/javascript/reference) e
[Google Search Central](https://developers.google.com/search/docs/appearance/title-link).
Validação: 23.230 testes, build e lint verdes. A instalação temporária do
Playwright interferiu nas dependências locais durante o primeiro build;
restauradas com `npm ci`, sem mudar manifesto ou lockfile, build repetido verde.

## Rodada 41: faxina técnica das pendências

Branch `codex/faxina-tecnica-pendencias`, base `3d3685e`, depois dos merges
#40 e #41 do mundo vivo e da fila de falas. IDs e ordem publicados preservados.

### Item 1 — Duplo toque da U4F1

Reproduzido no jogo de produção e na jornada: o primeiro toque em `#membros`
rola a linha 32 px em 50 ms; o segundo, na mesma posição, cai no texto
Integrantes. Defeito do jogo: a rolagem imediata da linha ainda movia o alvo.
Toda rolagem da seleção agora espera os 400 ms já existentes (a janela do
duplo toque é 350 ms). Regressão `duplo-toque-u4.mjs` toca sem seleção prévia
nem recalcular coordenadas. Em retrato passou depois e falhou antes.
A jornada completa também precisava evitar fechar o balão pelo véu do
Experimente quando a Árvore já estava aberta; ajuste do teste, com a causa
registrada, para chegar à U4. Sob concorrência, o novo teste em paisagem
também falhou com duas chamadas de toque sem cadência definida. O helper
agora envia os eventos pelo protocolo do Chrome com 140 ms entre os
inícios, no mesmo ponto e sem aumentar timeout; regressão repetida verde
nos três layouts durante a bateria.
A jornada deitada revelou ainda um bloqueio anterior, na U1: o balão fechava
pelo tempo de leitura enquanto o aluno lia a apresentação do tutor. Era do
jogo, não da espera do teste. O fechamento automático agora fica suspenso
durante qualquer apresentação; fora dela continua normal. A regressão espera
o prazo de leitura mais a saída do balão: falhou antes porque o campo sumia.
Jornadas completas e a regressão nos três layouts no fechamento.

### Item 2 — U3 dos Algoritmos sob carga

A espera de 30 s por Home era o sintoma: sob carga o Console registrava
parada após 4 s, o rastro tinha zero passos e o range ficava desabilitado.
O worker transportava cópias dos mesmos quadros externos em cada foto da
recursão. O núcleo agora compartilha quadros imutáveis quando linha, escopos
e valores não mudaram; cada foto mantém seu monte separado. O limite continua
1,5 s de execução, 4 s de reserva e 1.000 fotos: nenhum timeout aumentado.

Regressão com 80 chamadas: payload de 1.579.744 bytes antes, abaixo de 120 KB
depois; clone completo equivalente e valores antigos/atuais de variáveis e
listas preservados. O novo teste falhou antes e passou depois. A prova da
jornada também exige rastro não vazio para detectar a causa diretamente.
Home/End vão ao localizador da barra; no jogo explicitam a seleção mesmo
no extremo, quando o range nativo não emite change. Home repetido em zero
é conferido. Jornadas dos três layouts e provas do executor afetadas repetidas
após a correção. O import pesado já estava fora do teste de Estruturas.
As checagens do mundo também corriam contra timers: o aceno era lido só
depois das fontes, e o movimento reduzido depois de uma pausa fixa. O teste
agora captura aceno e texto juntos antes das fontes e aguarda o estado de
movimento reduzido; nenhuma animação do jogo ou timeout foi afrouxado.
As três jornadas repetidas passaram.

### Item 3 — Portões sem alvos sobrepostos

Antes, os retângulos ampliados cobriam os vizinhos. A jornada sem ampliar
falhou ao conectar o NÃO no retrato. Depois passou na escala inicial.
Os alvos são recortados por células de proximidade (Voronoi), incluindo
corpos e portas: nenhum interior de área cobre outro alvo; o desenho é
preservado e não intercepta o toque fora do recorte. O unitário confere
cada vértice contra todos os vizinhos; circuito e museu usam a mesma bancada.
Jornadas de circuito, Decisões U2 e museu agora não ampliam automaticamente;
testes de zoom continuam à parte.
A bateria revelou mais um caso em paisagem, U4F6 do museu: o toque recebido
pela entrada inferior ainda era desviado pelo tratamento antigo do miolo.
O afastamento vertical dos retângulos também não é mais necessário. Ambos
foram retirados: a célula de proximidade decide o alvo, com as áreas centradas
nas portas. Regressão focada falhou antes ao conectar B na entrada 1; as
jornadas de circuito e museu são repetidas na build corrigida, nos três layouts.
Outra reprodução no somador encontrou avanço acidental: a ligação pelo corpo
concluía a meta no `pointerup`; o `click` seguinte acertava Próximo objetivo,
recém-aberto sob o dedo. O corpo agora aplica a ação no `click`, cujo alvo
já está definido. A regressão cobre os três primeiros objetivos e exige
que só o botão apertado de propósito avance; falhou antes no segundo.

### Item 4 — Todos os aparelhos fora do jogo

Regressão enumera `TIPOS_DISPOSITIVO` e roda exemplos, comandos e propriedades
no Node: antes faltavam oito aparelhos, acontecimentos genéricos e o método
`forno.assar`. Exportação agora cobre o catálogo completo, entradas constantes
ou em rampa e reações de atores (com atraso/fim). Registradora e telaApp já
saíam; ficaram incluídas na prova de cobertura. Registro de fábricas é
`Record<TipoDispositivo, string>` (um novo tipo sem exportação quebra o build)
e a prova por catálogo verifica execução e console. 20 provas verdes.

### Item 5 — Tempo de trabalho ativo

Antes, `Date.now() - inicioTrabalho` somava toda a visita, inclusive oculta
ou esquecida. O relógio puro limita o intervalo à última interação + 60 s,
pausa em `document.hidden`, salva ao ocultar e retoma ao voltar/interagir.
Escuta toque/clique, teclado, escrita e rolagem. Não depende de ticks para
parar no limite e não soma duas vezes ao entregar. Duas regressões verdes.

### Item 6 — Texto exato no contrato

Antes, `estadoNaCena` só mostrava o valor recebido. Agora as falhas de texto
trazem esperado/recebido e a faixa diferente, sem normalizar espaços, caixa
ou acento. No checklist do contrato a faixa é marcada e espaços viram `␠`;
uma remoção aparece como "ausente". O /lab também recebe a comparação no
detalhe do validador. Unitários cobrem `CLIENTES: 4` sem espaço, caixa e CAFÉ.

### Item 7 — O plano não apaga comentários do aluno

Reprodução: comentário `// 99. anotação minha` imediatamente depois do plano
sumia ao reordenar; regressão falhou antes e passou depois. Causa: o bloco
terminava na última linha numerada, sem marcador de fim. Agora os marcadores
`// <interativai:plano>` e `// </interativai:plano>` delimitam a substituição.
Blocos legados/incompletos ficam intactos; inserir novamente preserva tudo.
Só a bancada não publicada ganhou exemplos delimitados. 19 unitários verdes;
jornadas compostas e unidades afetadas conferidas no fechamento.

### Item 8 — Aplicar solução no /lab

Reproduzido no desafio publicado U6F3: aplicar a próxima ação sintética não
recalculava o checklist (regressão parou antes). Causa: o evento chega antes
do commit do React que atualiza o contexto. Cada aplicação agenda uma nova
conferência após o commit, com o contexto atual. A prova aplica todas as
partes pelo botão, esperando só a marcação; nenhum gesto intermediário.
Passou no desktop após a correção; incluída na bateria nos três layouts.

### Item 9 — `textoContem`

Regressão falhou antes: o motor não reconhecia o novo tipo. Agora confere
um trecho não vazio em pelo menos um elemento, com espaços normalizados,
caixa e acentos exatos. Testes cobrem trecho ausente, seletor vazio, diferenças
de caixa/acento e composição com `todos`. Guia documentado; nenhuma fase
publicada foi alterada. 24 testes do núcleo verdes.

### Item 10 — Meta compacta em retrato

Reprodução medida: a meta da padaria ocupava 715,75 px dos 844 px. A
miniatura reservava 288 px mesmo quando só tinha uma cena de 112 px,
deixando espaço vazio. Só as miniaturas com cena única usam altura natural;
a cena, as legendas e a fonte mantêm o tamanho. Regressão exige até 610 px,
antes/depois e botão visíveis; demais composições mantêm a altura.

### Limpeza das demais pendências

Retiradas as dez correções desta rodada; as demais entradas foram agrupadas
por decisão do Will ou ilha/etapa futura, mantendo o assunto e a decisão
concreta. Duplicatas de Revisão do museu e do lugar da próxima geração foram
unificadas. Informações já resolvidas/de referência retiradas da lista:

- Bateria da rodada 14: publicar/layout/explorar já foram corrigidos ali.
- Padaria após Estruturas, aquecimento apresentando aparelhos e chamados
  sem fim de ilha: regras já implementadas, não correções pendentes.
- Classes animadas nas duas listas: regra protegida por teste e já
  documentada no PROJETO, não uma falha aberta.
- Testes unitários sob carga de Depuração: os imports das checagens já
  estão no topo desde a rodada 29; conteúdo roda com um worker e separado
  das jornadas, sem afrouxar o motor.
- Síntese inicial do PROJETO atualizada nesta rodada, referenciando o status
  consolidado e o manifesto, sem manter contagem histórica desatualizada.
- Termos em inglês movidos para o primeiro Próximo (a implementação do
  campo já existia); depois Porto de chegada, login/versão pública para
  planejar e Páginas vivas A, na ordem pedida.

A jornada pelo mapa de E5/R1/R2/P1 continua pendente: as checagens e as provas
pelo /lab não equivalem à jornada completa; não foi retirada como resolvida.

### Verificação final

Build de produção e lint completos verdes; lint da bancada repetido após
corrigir o gesto. Conteúdo: bateria completa uma vez, com a expectativa JSON
derivada do plano corrigida e os 28 testes afetados repetidos verdes. Com as
duas provas novas do rastro, o conjunto fecha em 57 arquivos e 23.230 provas;
as 22.592 provas afetadas do executor passaram após a compactação.

Bateria de navegador completa executada uma vez: 221 entradas, com 20
falhas no registro inicial. Todas têm repetição verde após correção ou
recuperação do ambiente; nenhum timeout foi aumentado. As seis regressões
adicionadas durante a investigação (portas e apresentação, três layouts
cada) também passaram, completando as 227 entradas do catálogo final.
Circuito, Decisões U2 e as seis salas do museu foram conferidos nos três
layouts na escala inicial; Sites em paisagem fechou as 35 fases da jornada.
Arquivos exportados foram baixados e executados no Node nas jornadas de
contrato. Nenhuma falha conhecida permanece nas verificações finais.

A medição do mundo rodou sozinha: 57,5 fps de dia e 51,4 fps à noite em 6x,
com respectivamente 0 e 8 quadros acima de 50 ms; em 12x, modo leve
ativado automaticamente. Build e repetições ficaram fora dessa medição.

Durante a bateria, uma build iniciada por engano na pasta do servidor
invalidou dez jornadas. A build foi restaurada, a mesma bateria retomada e
as dez jornadas repetidas verdes, sem mudar jogo ou timeout para contornar
o incidente. Um 404 isolado no mapa não voltou na jornada completa repetida.
Uma repetição do museu teve `Target crashed`, com uma morte por falta de
memória registrada pelo ambiente; a jornada foi repetida com menos
navegadores simultâneos. A primeira tentativa da última build recebeu 503
nas fontes do Google; a repetição da build passou.

## Rodada 40: o mundo fluido no celular e os nomes das ilhas que não somem

Branch `claude/mundo-completo-falas-b43oz0`, recomeçada da principal depois
do merge da rodada 39 (PR #40).

### Etapa 1 — Medir como um celular de verdade

`testes/desempenho-mundo.mjs`: 390 x 844, toque, processador limitado pelo
protocolo do Chrome (`Emulation.setCPUThrottlingRate`, 4x e 6x), de dia e de
noite (`?hora=22`). Mede, durante a rolagem, quadros por segundo
(`requestAnimationFrame`), quadros acima de 50 ms e de 20 ms, tarefas longas,
JS por quadro, animações rodando, nós do SVG, camadas e quantas vezes a
árvore de camadas muda com o mundo parado.

Achado no caminho: o gesto sintético de rolagem por toque
(`Input.synthesizeScrollGesture` com "touch") não rola nada no Chromium sem
tela; as primeiras medidas eram do mundo parado. O teste passou a usar
toques de verdade (`arrastarComODedo` em `util.mjs`, com o carimbo de tempo
de cada toque, sem o qual o Chrome não dá o embalo) e confere que rolou de
ponta a ponta. Os números "antes" abaixo são da versão da principal (commit
e5cb1b0, servidor de produção) com o teste final.

### Etapa 2 — Causas e correções

Causas, pelo rastro do Chrome (tracing) e por experimentos (esconder uma
parte e medir):

1. O processador principal trabalhava a cada quadro: as animações do
   Framer na arte das ilhas e no computadorzinho (um cálculo e uma
   repintura por quadro) e, por causa delas, a árvore de 93 camadas
   recomposta a cada quadro (106 mudanças de camadas em 3 s com o mundo
   parado).
2. Rolando, cada animação (mesmo as do compositor) ganha um recálculo de
   estilo por quadro, e as de dentro de um SVG, um layout. O respiro do
   computadorzinho, num grupo de dentro do SVG, refazia o layout do desenho
   inteiro dele a cada quadro (o do logo da barra também, em todo o jogo).
3. As marcas de "fora da tela" trocavam a animação de alguém no meio da
   rolagem: cada pedaço que entrava ou saía da tela refazia as camadas e
   repintava.
4. Camadas do tamanho do mundo (as duas de ondas que deslizavam e outras que
   a sobreposição criava) gastavam a memória de vídeo (ver a Etapa 3).

Correções:

- A vida das ilhas (engrenagens, guindaste, pulsos nos cabos, fumaça, bloco,
  bandeirola, barco atracado, operários, faíscas, barras) e o respiro do
  computadorzinho em CSS de transform e opacity; o respiro no `<svg>` de
  fora. `useAnimarMapa` ficou só para a tela da ilha.
- Marcas por atributo, sem estado do React (`mundo/useNaTela.ts`):
  `data-pausado` (fora da tela, com folga: sem animação e sem camada),
  `data-parada` (ilha com menos da metade na tela: para onde está) e
  `data-rolando` (rolando: tudo pausa; as marcas de quem entra ou sai esperam
  a rolagem parar, 600 ms depois do último movimento).
- As regras de pausa do `globals.css` com a lista das classes animadas: com
  um seletor universal, ligar a pausa recalculava o mundo inteiro (mais de
  mil elementos, até 100 ms em 6x).
- Uma camada só do tamanho do mundo: o mar de baixo com as ondas paradas, a
  rota e a hora na água. A arte de cada ilha, cada nome, as luzes, a névoa e
  o computadorzinho em camadas pequenas (`camada-ilha`, `camada-propria`).
- Modo leve (`mundo/useModoAnimacoes.ts`): sem peixes, baleia nem gaivotas,
  metade dos reflexos e das estrelas piscando, um anel de espuma e no máximo
  duas nuvens. No menu, "Animações: Completas | Leves" (no desktop, no painel
  do som), salvo em `progresso.animacoes` (`auto`, `completas`, `leves`). No
  automático, liga sozinho com pouca memória ou poucos núcleos, ou com a
  rolagem travando nos primeiros segundos (abaixo de 45 quadros por segundo
  ou mais de um quarto dos quadros acima de 25 ms); o leve automático fica
  guardado no aparelho. Menos movimento (`prefers-reduced-motion`) continua
  parando tudo.

Antes e depois (rolagem com o dedo, servidor de produção, médias de uma
passada; 12x é um aparelho bem mais fraco):

| Cenário | Antes | Depois |
| --- | --- | --- |
| 4x dia | 29,0 qps; 20 quadros > 50 ms; 90% > 20 ms | 58,1 qps; 1 quadro > 50 ms; 2,5% > 20 ms (completas) |
| 4x noite | 28,0 qps; 29 > 50 ms; 91% > 20 ms | 58,2 qps; 0 > 50 ms; 2,9% > 20 ms (completas) |
| 6x dia | 19,5 qps; 234 > 50 ms; 129 tarefas longas (7,6 s) | 56,2 qps; 1 > 50 ms; 6% > 20 ms (completas) |
| 6x noite | 19,5 qps; 491 > 50 ms; 329 tarefas longas (19,6 s) | 55,6 qps; 1 > 50 ms; 7% > 20 ms (completas) |
| 12x dia | — | 33,9 qps, modo leve ligado sozinho |
| JS por quadro | 1,3 a 2,1 ms | 0 a 0,2 ms |
| Mudanças de camadas, 3 s parado | 61 a 106 | 4 a 12 |
| Animações rodando no meio de um arrasto | 22 a 27 | 2 (o barquinho e o logo) |
| Camadas do tamanho do mundo | várias (ondas, rota, grupos) | 1 (o mar) |

Com as correções, o automático mantém as animações completas em 4x e em 6x
(a rolagem aguenta) e liga o leve em 12x.

### Etapa 3 — Os nomes e a arte das ilhas sumindo

Reproduzido no teste: com a memória de vídeo de um celular de entrada
(`--force-gpu-mem-available-mb`), tela de 3x, de noite, processador em 6x e
arrastos rápidos, a versão antiga perdia nomes e arte das ilhas: 17 de 33
nomes com 32 MB, 14 de 33 com 40 MB (com 96 MB, nenhum). A causa: o Chrome
reserva memória de vídeo para cada camada que aparece na tela, e as camadas
do tamanho do mundo (as duas de ondas, os grupos) não cabiam junto com as
ilhas e os nomes; o que ficava sem memória não era pintado, até a pessoa
rolar para longe e voltar. Com uma camada só do tamanho do mundo, a versão
nova não perde nenhum nome com 40 MB (3 de 15 com 32 MB, contra 17 de 33).

O teste novo (as paradas do `desempenho-mundo.mjs`): em pé, 6x, de noite,
tela de 3x e 40 MB, três idas e voltas rápidas; a cada parada, toda ilha com
o nome na tela tem a plaquinha do nome nos pixels e a arte (a captura
comparada com a mesma cena, num navegador sem limites, com e sem a arte
das ilhas) e o mar não tem buraco (o azul de fundo nunca aparece de noite).
Versão antiga: 17 de 35 ilhas sem nome ou sem arte; nova: 0 de 23.

Outros achados:

- Uma captura de tela logo depois de mudar o estilo pode vir com o quadro
  anterior numa camada (as referências do teste esperam o Chrome pintar).
- A área de rolagem é uns 15 px mais larga que o desenho (o fim do mundo
  mostra uma faixa do azul de fundo, que de noite destoa). Ficou nas
  Pendências.

### Fechamento

- `mundo.mjs` com as animações completas fixas e a opção do menu
  (completas e leves, salva no progresso), nos três layouts.
- A bateria roda os testes de desempenho no fim, sozinhos (`SOZINHOS` em
  `todos.mjs`): com outros testes disputando o processador, a medida vira
  ruído.
- Docs: `PROJETO.md` ("Desempenho do mundo", as regras para o que entrar no
  mundo), `testes/README.md` e o ROADMAP.
- Build, lint e `testar:conteudo` verdes (com um teste novo da normalização
  de `animacoes`). Bateria completa uma vez, no servidor de produção
  (`PARALELO=4`): 209 execuções, 207 verdes. As 2 falhas: `algoritmos.mjs
  paisagem 3` (a instabilidade sob carga já registrada; verde sozinho) e
  `unidades.mjs retrato` (o duplo toque da U4F1, pendência da rodada 36;
  falha igual na principal). O `desempenho-mundo.mjs` passou no fim,
  sozinho.
- Depois da bateria, os limites do teste de desempenho ganharam folga
  (quadros acima de 50 ms: até 3 em 4x e até 8 em 6x; a bateria deu 6 em 6x
  de noite, no limite antigo), e a conferência da arte nas paradas passou a
  exigir 40% (de noite, o farol girando da IA só aparece na captura e
  deixava a ilha em 58%; uma arte sumida fica perto de 0%). O teste foi
  rodado de novo, verde.

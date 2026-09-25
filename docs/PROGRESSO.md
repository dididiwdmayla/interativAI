# Progresso

Checklist das etapas (Ilha Sites › Zona Elementos). Cada etapa termina com
`npm run build`, `npm run lint` e (a partir da Etapa 15)
`npm run testar:conteudo` passando e um commit.

**Estado atual:** rodada 5 em andamento (fábrica corrigida, currículo em
dados e mapa das ilhas). Etapas 1 a 5 concluídas.

## Rodada 5: fábrica corrigida, currículo e mapa das ilhas

- [x] **Etapa 1: correções da fábrica** (resposta ao
  `docs/ATRITOS-FABRICA.md`). Campo `pratica` em `FasePratica`
  (conceitos já ensinados que a fase só treina); fase de prática precisa
  de `conceitos` ou `pratica`; `montarIndice()` põe `pratica` em
  "praticam"; u1-f2 migrada (`conceitos: []`, as 4 habilidades em
  `pratica`). Regra nova `fase-so-sozinho` (todos sozinho = `conceitos`
  vazio; fase que só treina não tem guiado nem previsão guiada); `pratica`
  só com conceitos ensinados antes; `revisarEm` precisa apontar para fase
  com objetivo guiado; `meta.desafioId` confere tipo, unidade e posição.
  Meta de entrada uma vez só por unidade (`metasVistas` no progresso,
  `faseAbreComMeta` em `src/lib/metaDaUnidade.ts`), só sem progresso na
  unidade; a do desafio continua. `jogarDesafio` usa
  `recalcularPartesFeitas` e confere a conclusão simultânea no fim.
  Congelamento: `src/conteudo/publicados.json` + regra
  `publicados-congelados` + `npm run publicar:conteudo`
  (`scripts/publicarConteudo.ts`, recusa publicar com id sumido ou
  checagem falhando). `src/motor/chaveArvore.ts` (esquema do
  `data-chave`, sem imports) e ajudantes `pularMeta`, `selecionarNo` e
  `chaveDoSeletor` em `testes/util.mjs` (transpilam o arquivo do motor
  com o TypeScript do projeto e executam dentro da página); testes
  `fase-completa`, `tutor` e `unidades` usam os ajudantes. Testes novos:
  `checagens.test.ts` (sabotagens: parte seguinte que desfaz a anterior,
  id de objetivo publicado alterado, fase renomeada, ordem trocada, fase
  só de sozinho com conceito, guiado em fase de treino, `revisarEm` para
  a fase sozinha, `meta.desafioId` de outra unidade),
  `chaveArvore.test.ts` (chave da árvore = chave calculada, em todos os
  sites) e meta uma vez só em `progresso.test.ts`. Guia (seções 2, 3.2,
  3.8, 3.9, 3.10, 10, 11 e checklist), template, `testes/README.md` e
  atritos atualizados. `testar:conteudo` (182 testes), `lint`, `build` e
  bateria Playwright inteira verdes.

- [x] **Etapa 2: currículo em dados.** `docs/MAPA-CURRICULAR.md` (o
  Anexo A inteiro, formatado, com o id de cada unidade no currículo).
  `src/curriculo/`: tipos (`IlhaCurriculo`, `ZonaCurriculo` com `icone`
  para o mapa, `UnidadeCurriculo` com `requerMotor` opcional, porque a U6
  requer motor numa zona pronta), dados na ordem do mapa (Origens com as
  5 salas, Sites com Elementos/Estilos/Layout/Responsivo/Publicar,
  Lógica, Páginas vivas, Rede e Servidor e Ofício com uma unidade
  planejada por zona, Frameworks opcional) e consultas (`statusDaUnidade`
  a partir do conteúdo registrado, `localNoCurriculo`, `motorQueFalta`).
  Ofício ganhou `requerMotor` por zona (o anexo não listava, mas o motor
  só tem a aba Elementos). Regras gerais novas: `curriculo-ids`,
  `curriculo-conteudo` (id `<ilha>-<zona>-u<n>`, número, ilha, zona,
  título e ordem) e `curriculo-motor`. Testes em `curriculo.test.ts`
  (com sabotagens: id repetido, unidade fora do currículo, zona errada,
  conteúdo em zona com `requerMotor`, a U6).

- [x] **Etapa 3: renomear tag e links na prévia.** Renomear tag
  conferido na doc do Chrome ("Edit node type") e no devtools-frontend
  (`startEditingTagName`/`tagNameEditingCommitted`: Enter e Espaço
  confirmam, Esc desiste, fechamento acompanha, nome vazio ou igual
  desiste, `html`/`head`/`body` bloqueados, `setNodeName` preserva
  atributos e filhos). Núcleo `renomearTag` (desfazer/refazer, seleção
  continua na peça), evento `renomeouTag`, ação
  `{ tipo: "renomearTag", seletor, novaTag }`, validador
  `{ tipo: "tag", seletor, nome }`. Interface: dois cliques (ou dois
  toques) no nome da tag, item "Renomear tag" no menu do nó e botão
  "Renomear" na barra do celular (7 botões de 44 px). Ferramenta
  `renomear-tag` no registro com ícone, card, apresentação (mouse e
  toque) e mini demo. Links: `src/lib/linksPrevia.ts` (âncora, quebrado,
  vazio, externo, aba nova) e núcleo `clicarLink` (evento `clicouLink`
  com `href`); a prévia segura clique, botão do meio e envio de
  formulário; âncora rola, `#` volta ao topo, e o computadorzinho diz
  "Esse link levaria para: <href>" (ou a fala de quebrado e de vazio).
  Ação `clicarLink` e `href` opcional no validador `evento`. Testes:
  `nucleo.test.ts` (renomear, recusas, desfazer, links e falas) e
  `testes/renomear-links.mjs` (desktop e em pé), `ferramentas-novas.mjs`
  com 5 itens no menu e 7 na barra.

- [x] **Etapa 4: mapa (mundo, ilha, museu e desbloqueios).** Regras em
  `src/lib/mapa.ts` (estado da ilha, zona aberta, estado da unidade,
  ação do card, estrelas, ilha e ponto atuais), com testes. Progresso
  ganha `unidadesComemoradas`, `posicaoNoMapa` e `mapaDesbloqueado` (o
  último abre tudo, inclusive as fases em `faseLiberada`). Mundo em
  `/mapa` (provisório nesta etapa: o jogo continua em `/` até a Etapa 5),
  ilha e museu em `/ilha/[id]` (só os ids do currículo, 404 no resto).
  Arte SVG de cada ilha (museu com colunas, cartão perfurado e terminal;
  prédios `< >` e blocos; engrenagens; peças que pulam, faíscas e botão;
  antenas e cabos no mar; oficina com ferramentas; blocos montados),
  estados (brilho, andaimes com computadorzinho dormindo, névoa e
  cadeado), mar com ondas, rota com barquinho e o computadorzinho na ilha
  atual. Ilha: zonas ao longo do caminho (horizontal ou vertical em pé),
  ícone da aba por zona (`IconeZona`), placa "Em construção", pontos,
  card com Jogar/Continuar/Jogar de novo, caminhada do computadorzinho e
  comemoração ao concluir. Barra do mapa com total de estrelas,
  Ferramentas (Caixa só de leitura: `aoRever` ficou opcional), tema e
  som. Tudo respeita `prefers-reduced-motion`. Teste
  `testes/mapa.mjs` nos três layouts.

- [x] **Etapa 5: integração do mapa com o jogo.** `/` virou o mundo;
  fases em `/fase/[id]` (deep link, 404 fora do conteúdo, aviso de fase
  trancada com volta para a ilha); o `/mapa` provisório saiu. Botão
  "Mapa" dentro da fase (desktop na barra; celular à esquerda do título,
  44 px), que volta para a ilha. "Próxima fase" só dentro da unidade;
  depois do desafio, "Voltar pra ilha" (a ilha comemora, o ponto acende e
  o próximo aparece). A Lista de fases saiu do jogo e foi para o
  `/lab/mapa` (com "Desbloquear tudo" e "Resetar o progresso do mapa").
  Testes: `unidades.mjs` joga as Unidades 1 e 2 começando pelo mapa e
  voltando para a ilha, nos três layouts; `mapa.mjs` com deep links,
  voltar e avançar do navegador, botão Mapa, fase trancada e o lab;
  `migracao.mjs` entra pelo mapa; `abrir()` abre `/fase/<faseAtual>`.

## Rodada 4: primeiro teste da fábrica (Unidade 1)

- [x] **Etapa 1: checklist do desafio ao vivo.** Partes do desafio cujo
  validador depende de seleção ou evento (`selecionado`, `evento`, ou
  `todos`/`algum`/`nao` que contenham algum deles) continuam travando (uma
  vez marcadas, ficam marcadas); as demais (estado da página: `existe`,
  `naoExiste`, `escondido`, `contagem`, `atributo`, texto) passam a ser
  avaliadas ao vivo a cada checagem e desmarcam se o jogador desfizer a
  ação. `validadorTravado` e `recalcularPartesFeitas` em
  `src/motor/validadores.ts`; `useMotorFase` troca `marcarPartes` (só
  adicionava) por `atualizarChecklist` (recalcula tudo a cada verificação).
  O desafio só conclui com as partes ao vivo passando juntas e as travadas
  já marcadas. Teste novo em `testes/conteudo/nucleo.test.ts`
  (`validadorTravado` e `checklist do desafio`, com o desafio da Unidade 2:
  apagar o pop-up marca, desfazer desmarca; selecionar a vitrine pela
  trilha continua marcado mesmo perdendo a seleção depois). Regra
  documentada em `docs/PROJETO.md` e `docs/GUIA-DE-CONTEUDO.md`. Bateria
  Playwright `unidades.mjs` (desktop, retrato, paisagem) continua verde.

- [x] **Etapa 2: conteúdo da Unidade 1.** u1-f1 intocada (ids, objetivos e
  textos iguais: progresso salvo e testes antigos continuam valendo).
  Fase 2, "Agora sem rodinhas" (`fase-2.ts`): as mesmas 4 habilidades da
  Fase 1 (árvore, setinha, editar texto, adicionar pelo código), todas em
  modo `sozinho`, na página de encomendas da mesma padaria
  (`sites/padariaEncomendas.ts`, âncoras diferentes: `h2`, `.sabores`,
  `ul.sabores > li`). Fase 3, o desafio "Lanchonete Sabor Rápido"
  (`fase-3-desafio.ts`), num site novo e diferente da padaria
  (`sites/lanchoneteSaborRapido.ts`, só CSS): 4 partes, uma por habilidade,
  todas com `revisarEm: "sites-elementos-u1-f1"` (a fase guiada, com a
  escada de ajuda completa). Pelas regras da Etapa 1: as partes de seleção
  (árvore, setinha) travam; as de texto e contagem são ao vivo.
  `unidade.ts` com as 3 fases em ordem e `meta.desafioId` apontando para a
  Fase 3. `npm run testar:conteudo` (150 testes), `lint` e `build` verdes.
  Jogado em `/lab/fases` e pela bateria Playwright: `unidades.mjs`
  estendido para jogar u1-f2 e u1-f3 (checklist travando/desmarcando de
  verdade) nos três layouts; `fase-completa.mjs` e `tutor.mjs` ajustados
  para passar pela tela de meta que agora abre a Unidade 1 (efeito
  colateral de preencher `meta.desafioId`, ver atritos). Bateria inteira
  (`testes/todos.mjs`, 12 scripts) verde, console limpo.

- [x] **Etapa 3: relatório de atritos.** `docs/ATRITOS-FABRICA.md`: fase
  só de objetivos sozinho sem ensinar conceito novo (checagem exige
  `conceitos` não vazio), `meta.desafioId` novo mudando o comportamento da
  primeira fase já publicada (invisível ao `testar:conteudo`, só apareceu
  na bateria Playwright), esquema do `data-chave` da árvore não
  documentado, conflito entre a previsão guiada opcional do guia e a regra
  "guiado antes de sozinho", ambiguidade do `revisarEm` quando guiado e
  sozinho moram em fases separadas, e uma lacuna na simulação de desafio
  do `checagens.ts` (não confere a conclusão simultânea das partes ao
  vivo). Nada do guia, do template ou do motor foi corrigido nesta etapa,
  só relatado.

- [x] **Etapa 1: Fundação.** Next + TS + Tailwind + Framer Motion, tokens e
  temas Doce e Fliperama (Segredo já definido, bloqueado), seletor de tema,
  fontes, layout esqueleto (barra superior, painel com abas bloqueadas, janela
  do navegador, área do mascote), armazém de progresso, docs.
- [x] **Etapa 2: Mascote e Carinha.** `Mascote` (7 expressões, piscar
  aleatório, respiração, crossfade, pulinho, confete, respeita
  `prefers-reduced-motion`), `Carinha` (feliz, dormindo, surpresa em 4 tons),
  rota `/lab/mascote` com todos os temas lado a lado.
- [x] **Etapa 3: Preview e editor.** Hook `useSiteAlvo` (fonte única de
  verdade = HTML do body), caminho A com debounce de 300 ms, `EditorCodigo`
  (CodeMirror 6 + lang-html, tema dos tokens, quebra de linha opcional, API
  `definirTexto`/`destacarLinhas`/`rolarParaLinha`), `PreviewSiteAlvo`
  (iframe `srcdoc` + `sandbox="allow-same-origin"`), `PainelDividido` com
  divisor arrastável, site-alvo "Padaria Pão Quentinho" renderizando.
- [x] **Etapa 4: Árvore de Elementos.** `ArvoreElementos` (estilo F12, texto
  curto na mesma linha, `== $0` no selecionado, tudo nasce expandido),
  sobreposição com etiqueta `tag.classe L × A` no hover, seleção que rola o
  editor até a linha, modo inspecionar (mouse, e setas + Enter pelo teclado,
  Esc cancela), edição inline de texto e de valor de atributo (Enter confirma,
  Esc cancela), caminho B sem recarregar o iframe, seleção preservada pelo
  caminho de índices, teclado (setas, Home, End, Enter/F2 edita).
- [x] **Etapa 5: Motor de fases e conteúdo da Fase 1.** Tipos em
  `src/motor/tipos.ts`, fase como dados em `src/fases/sites-elementos-1/fase.ts`,
  hook genérico `useMotorFase` (introdução com Enter/clique, objetivos em
  sequência, validação a cada load/edição/evento, pausa com fala de conclusão
  e botão "Próximo objetivo", escada de ajuda com destaque pulsante na árvore,
  no editor e no botão de inspecionar, solução com confirmação e custo de 1
  estrela, mínimo 1), tela de conclusão com estrelas, falas finais, missão de
  campo (checkbox salvo) e gancho do easter egg, persistência em
  `ilha-sites:progresso:v1` (retoma objetivo, HTML e estrelas), "Recomeçar
  fase" com confirmação. Barramento de eventos liga o painel ao motor.
- [x] **Etapa 6: Tutor Gemini.** Rota `POST /api/tutor` (runtime nodejs,
  `@google/genai`, `responseMimeType` JSON + `responseJsonSchema`, thinking
  LOW nos modelos Gemini 3, tempo limite de 20 s, sem novas tentativas),
  system prompt completo em `src/lib/tutor/promptTutor.ts`, validação e corte
  da entrada, parse seguro (cercas, JSON cortado, texto puro, sem emojis e sem
  markdown), campo "Pergunte ao computadorzinho" com mascote pensativo durante
  a espera e preocupado na falha ("Estou sem sinal agora. Tenta o botão Me
  ajuda!"). Falhas esperadas respondem 200 com `{ erro }` para não sujar o
  console do navegador. Testado sem chave e com chave inválida.
- [x] **Etapa 7: Acabamento.** Sons com Web Audio (acerto, clique, conclusão,
  aviso; volume baixo, respeitam o botão de som, AudioContext só depois da
  primeira interação), easter egg (comentário HTML e `data-segredo` no HTML do
  jogo; a palavra "curioso" no campo do tutor libera e liga o tema Segredo sem
  chamar o Gemini), estrelas surgindo uma a uma na conclusão, `MotionConfig`
  com movimento reduzido, responsivo abaixo de 1024 px (abas "Painel" | "Tela",
  inspecionar troca de aba sozinho, mascote compacto e objetivo atual em uma
  linha), dicas que não estouram a largura, contraste revisado nos três temas.

## Rodada 2: tutor resistente, sincronia, ferramentas e mobile

- [x] **Etapa 8: Tutor resistente.** `gerarComResiliencia`
  (`src/lib/tutor/resiliencia.ts`): 503/429 (ou UNAVAILABLE /
  RESOURCE_EXHAUSTED) tentam de novo 2 vezes com backoff exponencial e jitter
  (~1 s, ~2 s) e depois 1 vez no modelo reserva (`GEMINI_MODEL_RESERVA`,
  padrão `gemini-3.5-flash-lite`). Orçamento de 45 s, cada tentativa até 15 s,
  `maxDuration = 60`. Resposta de falha `{ erro: { tipo } }` com `sobrecarga`,
  `sem_chave`, `rede` ou `desconhecido`; log no servidor com tipo, status e
  modelo. No cliente: sobrecarga (pensativo + "Tentar de novo"), sem chave
  (dormindo), rede/desconhecido (preocupado, "sem sinal"). Simulação local com
  `TUTOR_SIMULAR=sobrecarga | sobrecarga-total | rede` (ignorada em produção).
  Teste: `testes/tutor.mjs`.
- [x] **Etapa 9: Sincronia tripla.** Caminho "só de elementos"
  (`src/lib/caminhoElementos.ts`, ignora textos e comentários dos dois lados)
  ligando o código (árvore sintática Lezer do CodeMirror,
  `editor/mapaElementos.ts`) ao DOM. Selecionar pela árvore, inspeção ou
  ajuda acende o nó, o trecho inteiro no editor (fundo animado + barrinha,
  `editor/destaqueTrecho.ts`, rola até ele) e a caixa no preview (sem hover,
  a caixa mostra o selecionado). Cursor no editor (150 ms de espera)
  seleciona o elemento mais interno, conferindo as tags nos dois lados;
  se não bater, não destaca nada. Seleção vinda do editor não mexe no
  cursor (transações externas são anotadas). Teste: `testes/sincronia.mjs`.
- [x] **Etapa 10: Sistema de apresentação de ferramentas.** Registro central
  data-driven em `src/ferramentas/registro.ts` (9 ferramentas, ícones SVG
  próprios, 4 mini demos), `data-ferramenta` nos elementos reais via
  `AlvoFerramenta` (também dá o "?" no desktop e o toque longo no celular).
  Spotlight `ApresentacaoFerramenta`: véu com recorte arredondado (máscara
  SVG) e contorno pulsante, mascote ao lado do alvo, 3 falas (Enter, clique
  ou toque avançam; Esc pula), passo "Experimente" em que só o alvo fica
  livre (bloqueio com `clip-path` evenodd, com áreas extras como a tela no
  modo inspecionar) e fecha quando o jogador usa a ferramenta de verdade
  (`sinalizarUso` ou toque no alvo), com comemoração. "Pular" sempre visível.
  Vistas salvas em `apresentacoesVistas` no progresso. Caixa de Ferramentas
  (gaveta no desktop, folha arrastável no celular) com cards, silhuetas
  dormindo e "Rever apresentação". `apresentar` em `Fase` e `Objetivo`;
  Fase 1 configurada; enunciados com variação de toque (`enunciadoToque`).
  Testes: `testes/fase-completa.mjs`, `testes/ferramentas.mjs`.
- [x] **Etapa 11: Mobile retrato e toque.** Três composições
  (`jogo/movel/useLayoutJogo.ts`): desktop (>= 1024 px), retrato (abaixo
  disso, inclusive tablets) e paisagem (deitado e com altura < 500 px). A
  árvore de componentes é a mesma nos três (só mudam classes e ordem), então
  editor, iframe e seleção não remontam ao girar. Retrato: prévia em cima
  (40%, alça arrastável de 25% a 60%, salva em `proporcaoPrevia`), painel
  embaixo com "Árvore | Código" (as duas áreas continuam montadas; trocar
  para Código rola até o trecho selecionado), barra superior compacta com
  menu (Ferramentas, tema, som, recomeçar), barra de objetivos (2/4, toque
  expande), computadorzinho flutuante de 56 px com balão que abre sozinho a
  cada fala nova e fecha com toque fora ou arrastando para baixo. Teclado:
  `interactiveWidget: "resizes-content"` na viewport + VisualViewport (altura
  real e teclado aberto com campo focado); com teclado, a prévia vai a 25% e
  a barra de objetivos some. Toque: `touch-action: manipulation`, inspecionar
  arrastando o dedo (soltar escolhe), duplo toque e botão "Editar" no nó
  selecionado, linhas da árvore e botões com 44 px. Testes:
  `testes/fase-completa.mjs retrato`, `testes/movel.mjs`.
- [x] **Etapa 12: Mobile paisagem.** Deitado e com altura < 500 px: painel e
  prévia lado a lado (50/50), barra superior fina, árvore por padrão no
  painel, mini avatar (44 px) com balão sobreposto que fecha sozinho depois
  do tempo de leitura (não fecha se a fala pede um botão, se o dedo ou o
  foco estão nele). Focar o editor deitado mostra o recado "Pra digitar,
  fica mais confortável com o celular em pé" sem bloquear. Girar mantém
  seleção, código, objetivo, balão e rascunho do tutor (mesma árvore de
  componentes nos três layouts). Menu do celular fecha ao escolher um item
  e mantém o conteúdo montado. Teste: `testes/movel.mjs` (giro e spotlight
  nos dois modos).
- [x] **Etapa 13: Testes, acabamento e docs.** Bateria completa rodada em
  `next dev` e em `next start` (build de produção): `testes/todos.mjs`
  (sincronia, ferramentas, fase inteira nos três modos, celular) e
  `testes/tutor.mjs` nos três cenários (sobrecarga total, reserva, sem
  chave), todos com console limpo. `PROJETO.md` com as decisões novas e
  `testes/README.md` com como rodar.

## Rodada 3: fábrica de conteúdo, ferramentas novas e Unidade 2

Etapas 14 a 19 correspondem às etapas 1 a 6 da tarefa "Fábrica de conteúdo".

- [x] **Etapa 14: Formato declarativo.** Tipos em `src/conteudo/tipos.ts`
  (`Validador`, `Acao`, `Objetivo` guiado/sozinho e ação/previsão, `Fase`
  prática/desafio, `Unidade`, `SiteAlvo`), catálogo `src/conteudo/conceitos.ts`,
  registro `src/conteudo/index.ts`, registro de tipos de fase
  `src/motor/tiposDeFase.ts`. Interpretador `src/motor/validadores.ts` (com
  resultado detalhado), executor `src/motor/executarAcao.ts` (`$0`, via
  trilha sobe pelos ancestrais) e núcleo sem React `src/motor/nucleoPainel.ts`
  (seleção, texto, atributo, esconder do Chrome, apagar, duplicar, inserir
  HTML, pilha de 50 fotos para desfazer/refazer), usado pelo
  `usePainelElementos`. Fase 1 migrada para
  `src/conteudo/ilhas/sites/elementos/unidade-1/` (id
  `sites-elementos-u1-f1`), comportamento igual (bateria Playwright antiga
  passou inteira). Progresso `ilha-sites:progresso:v2` com migração
  automática da v1 (ids renomeados, fase atual, campos novos com padrão).
- [x] **Etapa 15: Testes de conteúdo e /lab/fases.** `npm run testar:conteudo`
  (Vitest + jsdom, `vitest.config.mts`, testes em `testes/conteudo/`).
  Regras em `src/conteudo/checagens.ts` (gerais, de dados e de simulação),
  simulação headless `src/motor/simulacao.ts` (mesmo núcleo da interface),
  `montarIndice()` em `src/conteudo/indice.ts`. Testes do núcleo, dos
  validadores e da migração v1. Rota `/lab/fases` (fora da navegação):
  abre qualquer fase no primeiro objetivo, sem salvar e sem apresentações,
  com gaveta de validadores ao vivo, "Aplicar solução do objetivo atual",
  "Resetar fase", checagens rodando no navegador e índice de conceitos.
  Sabotagem de seletor conferida: a falha diz fase, objetivo, ação e motivo.
- [x] **Etapa 16: Ferramentas novas do DevTools.** Registro com `trilha`,
  `esconder`, `apagar`, `desfazer` (e refazer) e `duplicar`, cada uma com
  ícone SVG, card, apresentação (texto de mouse e de toque, "No F12 de
  verdade" conferido na doc do Chrome e no código do devtools-frontend) e
  mini demo (trilha, esconder, apagar, duplicar). Trilha
  (`TrilhaElementos`) no rodapé da árvore: `html › body › ... ›
  tag#id.classe`, clicar seleciona o ancestral (evento `trilha`), rola na
  horizontal no celular. Esconder igual ao Chrome: tecla H alterna a classe
  `__web-inspector-hide-shortcut__`, que aparece na árvore e no código, com
  a regra `visibility: hidden !important` no head do site-alvo. Apagar
  (Delete ou Backspace; seleção vai ao próximo irmão ou ao pai), duplicar
  (Shift+Alt+seta para baixo, cópia selecionada), desfazer/refazer (pilha
  de 50 fotos, Ctrl+Z e Ctrl+Shift+Z ou Ctrl+Y com o foco no painel e
  botões no topo do painel; no editor vale o do CodeMirror; a primeira
  tecla de uma digitação no código também vira foto). Menu do nó
  (`MenuNo`): botão direito, tecla Menu/Shift+F10 ou toque longo no nó (o
  toque longo em botões de ferramenta continua abrindo o card:
  `reivindicarToque`). Barra de ações no nó selecionado no celular
  (`BarraAcoesNo`, 6 botões de 44 px). No "Experimente", o cartão do
  mascote também evita as áreas liberadas. Teste:
  `testes/ferramentas-novas.mjs` (desktop e celular, apresentações).
- [x] **Etapa 17: Motor dos modos.** `useMotorFase` reescrito para prática
  e desafio, com modos de jogo `jogo`, `revisao` e `lab`
  (`src/motor/estadoMotor.ts`). Meta com antes/depois (`TelaMeta`,
  `MiniPrevia`; o depois sai de `estadoFinalDoDesafio`) no começo da
  unidade e antes do desafio, quando a unidade tem desafio. Sozinho: selo
  "Sozinho" com carinha determinada (lista, barra do celular, linha do
  balão), "Me ajuda" só até a dica, comemoração "Fez sozinho!". Previsão:
  card com opções no balão (sem "Me ajuda" antes do palpite), resultado
  com a explicação, errar não custa estrela, apresentações esperam o
  palpite. Momentos roteirizados (`eventosIniciais`, `eventoAoComecar`)
  com a animação de esbarrão (`Tropeco`); retomar no meio volta ao HTML de
  antes e roda o momento de novo. Desafio: checklist que marca as partes
  ao vivo (e elas ficam marcadas), "Me ajuda" vira "Rever" com a lista das
  partes pendentes, cada Rever custa 1 estrela (mínimo 1), salva o desafio
  e abre a fase em modo revisão (sem estrelas, sem salvar, "Voltar ao
  desafio"). Navegação: Lista de fases (gaveta ou folha) com cadeados,
  "Próxima fase" na conclusão, fase atual salva em `faseAtual`. Tutor
  recebe o modo (guiado, sozinho, desafio) calculado no servidor e só faz
  perguntas nos dois últimos.
- [x] **Etapa 18: Unidade 2, "Faxina no site" (a unidade-modelo).** Pasta
  `src/conteudo/ilhas/sites/elementos/unidade-2/` com um arquivo por fase
  (cada um explica as decisões pedagógicas no topo) e `unidade.ts` (meta e
  desafio). Sites-alvo novos em `sites/`: Jornal da Vila (banner
  `#banner-topo`, pop-up `#popup-cookies` no meio da página, três
  `article.noticia`, `#anuncio-lateral`, `#rodape`; versão limpa para a
  fase 3) e Brinquedos Arco-Íris (pop-up `#popup-oferta` flutuando,
  banner, anúncio, `#vitrine` com 4 produtos desenhados em CSS). Fases:
  família de elementos (trilha, previsão sobre o main, sozinho com a
  setinha), esconder ou apagar (previsão, esbarrão que apaga o rodapé,
  desfazer, faxina sozinho revisando edição de texto), copia e cola
  (trilha + duplicar + editar, sozinho com duas cópias) e o desafio de 5
  partes. `testar:conteudo` verde (90 testes). Jornada inteira das
  Unidades 1 e 2 em Playwright nos três layouts (`testes/unidades.mjs`) e
  retomada no meio do esbarrão (`testes/retomar.mjs`).
  Nota: o pedido previa "terminando com 5 notícias" no sozinho da fase 3,
  mas com as 3 originais, a cópia do guiado e as 2 novas são 6; o
  validador pede 6 notícias e 3 títulos novos diferentes entre si.
- [x] **Etapa 19: Guia, template, docs e testes gerais.**
  `docs/GUIA-DE-CONTEUDO.md` (voz do computadorzinho, modelo pedagógico,
  formato com tabelas de validadores e ações, escada de ajuda, previsão,
  momentos roteirizados, desafio, regras de dificuldade, limites,
  ferramentas, sites-alvo, conceitos, validador custom, passo a passo e
  checklist) e `docs/TEMPLATE-FASE.ts` (prática e desafio anotados; compila
  e passa nas regras de fase, conferido em `testes/conteudo/template.test.ts`).
  Contexto do tutor extraído para `src/lib/tutor/contextoDoTutor.ts` e
  testado. Teste de navegador da migração v1 (`testes/migracao.mjs`).
  `PROJETO.md`, `README.md` e `testes/README.md` atualizados.

## Critérios de pronto da rodada 3 (verificados na Etapa 19)

- [x] `npm run build`, `npm run lint` e `npm run testar:conteudo` (119
  testes) passam; console limpo em todos os testes de navegador.
- [x] Playwright: Unidades 1 e 2 jogadas do começo ao fim no desktop, em
  retrato (390×844, toque) e em paisagem (844×390, toque)
  (`testes/unidades.mjs`), no build de produção e no dev. Bateria inteira
  (`testes/todos.mjs`, 12 scripts) e os três cenários do tutor verdes.
- [x] Progresso antigo (v1) migra sem perda (`testes/migracao.mjs` e
  `testes/conteudo/progresso.test.ts`).
- [x] Sabotagem: trocar `#popup-cookies` por `#popup-cookie` na solução do
  objetivo 2 da fase `sites-elementos-u2-f2` faz o `testar:conteudo` falhar
  com "objetivo 2 "apagar-popup": a solucaoDeTeste quebrou na ação 2 de 2
  (apagar #popup-cookie): o seletor "#popup-cookie" não achou nenhum
  elemento". Sabotagem desfeita.
- [x] Buscas no repositório: nenhum emoji, nenhuma cor literal fora de
  `src/tema/tokens.css` e dos sites-alvo (`src/conteudo/**/sites/`),
  nenhum `NEXT_PUBLIC_GEMINI`.
- [x] Atalhos e comportamentos do Chrome conferidos na doc oficial (fonte
  do developer.chrome.com no GitHub: H esconde, Delete apaga, Ctrl+Z
  desfaz, Ctrl+Y ou Cmd+Shift+Z refaz, Shift+Alt+seta para baixo duplica,
  trilha no rodapé da aba Elements) e no código do devtools-frontend
  (classe `__web-inspector-hide-shortcut__` com `visibility: hidden
  !important`).

## Critérios de pronto (verificados na Etapa 13)

- [x] `npm run build` e `npm run lint` passam; console limpo em todos os testes.
- [x] Tutor: 503 simulado faz 4 tentativas (3 no principal + reserva); com a
  reserva respondendo o jogador vê a resposta; com tudo falhando aparece a
  fala de sobrecarga e "Tentar de novo" reenvia. Sem chave: chat desligado.
- [x] Sincronia: árvore acende código e tela; cursor no código acende árvore
  e tela; HTML quebrado ao digitar não gera erro.
- [x] Apresentações: fase do zero passa por todas na ordem; recarregar não
  repete; "Rever apresentação" e "Pular" funcionam.
- [x] Mobile (Playwright, `hasTouch`, 390×844 e 844×390): fase inteira
  jogável nos dois modos; prévia visível ao editar; giro não perde nada;
  spotlight dentro da tela sem cobrir o alvo; teclado simulado encolhe a
  prévia sem sumir.
- [x] Desktop igual ao anterior, fora o botão Ferramentas, os "?" e a sincronia.
- [x] grep: nenhum emoji, nenhuma cor fora dos tokens (exceto o site-alvo),
  nenhum `NEXT_PUBLIC_GEMINI`.

## Critérios de pronto da rodada 1 (verificados na Etapa 7)



- [x] `npm run build` e `npm run lint` passam; sem erros no console do
  navegador (testado com Playwright no Chromium, desktop e celular).
- [x] Fase jogável do início ao fim com mouse e teclado (inclusive modo
  inspecionar pelo teclado: setas + Enter).
- [x] Recarregar mantém objetivo, HTML do site, estrelas, tema, som e missão.
- [x] Trocar o tema muda painel, editor, árvore, mascote e carinhas; o
  site-alvo continua igual.
- [x] grep: nenhum emoji; nenhuma cor hex/rgb/hsl fora de `src/tema/tokens.css`
  e `src/fases/sites-elementos-1/siteAlvo.ts`; nenhum `NEXT_PUBLIC_GEMINI`.
- [x] Sem `GEMINI_API_KEY`, o jogo funciona e o chat mostra "Estou sem sinal
  agora. Tenta o botão Me ajuda!".
- [x] Editar pela árvore não recarrega o iframe (conferido com uma marca na
  janela do iframe que sobrevive à edição) nem entra em loop.

## Próximos passos sugeridos

- Próximas unidades da zona Elementos, copiando a pasta da Unidade 2 (ou a
  Unidade 1, se a próxima precisar separar guiado e sozinho em fases
  diferentes). Ler `docs/ATRITOS-FABRICA.md` antes.
- Computadorzinho navegador em cima de `montarIndice()`.
- Testar num celular de verdade (Android e iPhone), principalmente o teclado
  virtual no iOS, que ainda não tem `interactive-widget`.
- Configurar `GEMINI_MODEL_RESERVA` na Vercel só se quiser outro reserva.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.
- Etapa 16: `developer.chrome.com` está bloqueado pela rede do ambiente; a
  doc oficial foi lida pelo repositório de fontes dela no GitHub
  (GoogleChrome/developer.chrome.com) e o mecanismo de esconder pelo
  ChromeDevTools/devtools-frontend.
- Etapa 15: Vitest 5 pede `@types/node` 22 ou mais; ele subiu de 20 para 22
  (o Node do ambiente é o 22).
- Testes de navegador: o `addInitScript` do Playwright gera um aviso no
  console dos iframes com sandbox (mini prévias) em contexto de celular.
  Sem o script do teste, o jogo não gera o aviso; `errosRelevantes` ignora
  só essa mensagem.

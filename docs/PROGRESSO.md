# Progresso

Checklist das etapas da Fase 1 jogável (Ilha Sites › Zona Elementos).
Cada etapa termina com `npm run build` e `npm run lint` passando e um commit.

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
  chave), todos com console limpo. Corrigido: menu do celular não fechava ao
  escolher item; círculo da demo sem raio inicial. `PROJETO.md` com as
  decisões novas.

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

- Testar num celular de verdade (Android e iPhone), principalmente o teclado
  virtual no iOS, que ainda não tem `interactive-widget`.
- Configurar `GEMINI_MODEL_RESERVA` na Vercel só se quiser outro reserva.
- Ferramentas novas do DevTools e a Fase 2, já usando o registro de
  ferramentas e o `apresentar` dos objetivos.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.

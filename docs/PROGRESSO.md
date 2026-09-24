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
- [ ] **Etapa 10: Sistema de apresentação de ferramentas.**
- [ ] **Etapa 11: Mobile retrato e toque.**
- [ ] **Etapa 12: Mobile paisagem.**
- [ ] **Etapa 13: Testes, acabamento e docs.**

## Critérios de pronto (verificados na Etapa 7)

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

- Configurar `GEMINI_API_KEY` na Vercel e testar o tutor com uma chave real.
- Mapa das ilhas e as próximas fases da zona Elementos.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.

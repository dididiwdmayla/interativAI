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
- [ ] **Etapa 6: Tutor Gemini.** Rota, system prompt, chat no mascote,
  expressões vindas da resposta, tratamento de erro.
- [ ] **Etapa 7: Acabamento.** Sons, easter egg, polimento, responsivo,
  acessibilidade.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.

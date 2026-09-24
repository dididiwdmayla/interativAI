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
- [ ] **Etapa 3: Preview e editor.** Fonte única de verdade, caminho A
  (editor → iframe), site-alvo da Fase 1 renderizando.
- [ ] **Etapa 4: Árvore de Elementos.** Render estilo DevTools, sobreposição no
  hover, seleção, modo inspecionar, edição inline, caminho B, teclado.
- [ ] **Etapa 5: Motor de fases e conteúdo da Fase 1.** Introdução, objetivos,
  validação, escada de ajuda, estrelas, conclusão, missão de campo, persistência.
- [ ] **Etapa 6: Tutor Gemini.** Rota, system prompt, chat no mascote,
  expressões vindas da resposta, tratamento de erro.
- [ ] **Etapa 7: Acabamento.** Sons, easter egg, polimento, responsivo,
  acessibilidade.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.

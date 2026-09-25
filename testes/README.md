# Testes

## Conteúdo (sem navegador)

```bash
npm run testar:conteudo
```

Vitest com jsdom (`vitest.config.mts`). Os arquivos ficam em
`testes/conteudo/`: as regras de `src/conteudo/checagens.ts` viram um teste
por fase (ids, conceitos, ferramentas apresentadas, limites de texto,
emojis, previsões, soluções que cumprem cada objetivo na hora certa...),
mais o índice de conceitos, o núcleo do painel e a migração do progresso.
As mesmas checagens rodam no navegador em `/lab/fases` (aba Checagens).

## Navegador

Scripts Playwright que jogam o jogo de verdade num Chromium. Eles usam o
Playwright do projeto ou, se não houver, o instalado globalmente
(`npm root -g`). Todos precisam do jogo no ar em `URL_JOGO`
(padrão `http://localhost:3000`).

```bash
# Tudo o que não depende do tutor (funciona com npm run dev ou npm start):
npm run dev
node testes/todos.mjs

# Tutor (só em dev, a simulação é ignorada em produção):
TUTOR_SIMULAR=sobrecarga-total npm run dev   # e então: node testes/tutor.mjs
TUTOR_SIMULAR=sobrecarga npm run dev         # e então: RESERVA=1 node testes/tutor.mjs
npm run dev  # sem GEMINI_API_KEY             # e então: SEM_CHAVE=1 node testes/tutor.mjs
```

| Arquivo | O que confere |
| --- | --- |
| `sincronia.mjs` | árvore acende código e tela; cursor no código acende árvore e tela; HTML quebrado sem erro; hover não muda a seleção |
| `ferramentas.mjs` | Pular e Esc, vistas salvas, Caixa com silhuetas, Rever apresentação, "?" abre o card certo |
| `fase-completa.mjs [desktop\|retrato\|paisagem]` | a Fase 1 do zero, com todas as apresentações na ordem, e recarregar sem repetir |
| `movel.mjs` | prévia visível ao editar, teclado simulado, alça, giro sem perder nada, spotlight nos dois modos, dica deitado |
| `ferramentas-novas.mjs` | trilha, esconder (classe do Chrome), apagar, desfazer/refazer (botões e atalhos), duplicar, menu do nó (botão direito e toque longo), barra do celular e as apresentações novas |
| `unidades.mjs [desktop\|retrato\|paisagem]` | as Unidades 1 e 2 inteiras: meta com antes/depois, previsões (certa e errada), esbarrão e desfazer, sozinho ("Fez sozinho!"), desafio com checklist (parte de seleção trava, parte de estado desmarca ao desfazer), Rever, revisão e volta, estrelas, Lista de fases e Próxima fase |
| `retomar.mjs` | recarregar no meio do esbarrão: a página volta, o momento roda de novo e o Desfazer vale |
| `migracao.mjs` | progresso da chave v1 migra para a v2 sem perder nada |
| `tutor.mjs` | falas de sobrecarga, reserva e sem chave, botão Tentar de novo |

Todos falham se aparecer erro ou aviso no console do navegador.

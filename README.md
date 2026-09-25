# InterativAI: Ilha Sites

Jogo em PT-BR para aprender web mexendo num DevTools (F12) simplificado, com a
ajuda do computadorzinho.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000: é o mapa das ilhas. As rotas do jogo são `/`
(o mundo), `/ilha/<id>` (uma ilha; `/ilha/origens` é o museu) e
`/fase/<id>` (uma fase). Rotas de laboratório (fora da navegação):

- `/lab/mapa`: desbloquear tudo, resetar o progresso do mapa e a Lista de
  fases (abre qualquer fase aberta).
- `/lab/fases`: abre qualquer fase direto, mostra os validadores ao vivo,
  aplica a solução do objetivo atual, reseta e roda as checagens de conteúdo.
- `/lab/mascote`: todas as expressões do mascote em todos os temas.

## Checagens

```bash
npm run lint
npm run build
npm run testar:conteudo   # checagens de todo o conteúdo (Vitest + jsdom)
npm run publicar:conteudo # ao publicar uma unidade nova: congela os ids dela
```

Os testes de navegador (Playwright) ficam em `testes/` (veja `testes/README.md`).

## Tutor (opcional)

O chat com o computadorzinho usa a API do Gemini pelo servidor. Crie um
`.env.local` (veja `.env.example`):

```
GEMINI_API_KEY=sua-chave
GEMINI_MODEL=gemini-3.8-flash
```

Sem a chave, o jogo funciona normalmente e só o chat fica indisponível.

## Documentação

- `docs/PROJETO.md`: visão, regras e arquitetura.
- `docs/PROGRESSO.md`: checklist das etapas.
- `docs/GUIA-DE-CONTEUDO.md`: como escrever unidades e fases novas.
- `docs/MAPA-CURRICULAR.md`: o percurso inteiro, ilha por ilha (em dados em `src/curriculo/`).
- `docs/TEMPLATE-FASE.ts`: template anotado de fase.

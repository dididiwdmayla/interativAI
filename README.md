# InterativAI: Ilha Sites

Jogo em PT-BR para aprender web mexendo num DevTools (F12) simplificado, com a
ajuda do computadorzinho.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000. A rota `/lab/mascote` mostra todas as expressões do
mascote em todos os temas.

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

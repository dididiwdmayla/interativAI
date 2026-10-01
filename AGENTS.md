# Instruções do projeto para o Codex

As regras do projeto estão em `CLAUDE.md` e devem ser seguidas integralmente,
inclusive os documentos obrigatórios que ele indica. Leia o outro arquivo.
Este resumo não substitui as regras completas:

- Leia o Status e as Pendências de `docs/ROADMAP.md` antes de começar e
  atualize o Status no fim. Registre o detalhe em `docs/PROGRESSO.md`.
- Trabalhe em etapas, com um commit em PT-BR por etapa.
- Testes em camadas, conforme a seção "Economia de cota" do `CLAUDE.md`:
  durante o trabalho, unitários, `testar:conteudo` e o teste afetado em um
  layout; no fim da etapa, o afetado nos três layouts; bateria completa
  uma vez no fim de prompts de motor. Depois de uma falha, repita só o
  afetado. Use saída resumida.
- Se o prompt alterar qualquer coisa numa unidade já publicada, inclusive a ordem das opções, rode as jornadas dessas unidades.
- Zero emojis e zero símbolos que viram emoji. Expressividade por SVG.
- Cores só por tokens de `src/tema/tokens.css` (a exceção existente são
  os sites-alvo fictícios, conforme `docs/PROJETO.md`).
- Interface em PT-BR; TypeScript estrito, sem `any`.
- A chave do Gemini nunca vai para o cliente.
- Conteúdo publicado congelado, conforme o guia de conteúdo.

## Preparar o ambiente de testes

Instale as dependências com `npm ci`. Os scripts em `testes/` usam
Playwright local ou o disponível no ambiente. Se necessário, instale o
pacote sem alterar o manifesto: `npm install --no-save --package-lock=false playwright`.
Se faltar Chromium ou suas bibliotecas, execute:

```sh
npx playwright install --with-deps chromium
```

Neste ambiente, `--with-deps` falhou no `apt` com `Failed to setgroups`
(restrição de troca de usuário/grupo). Se as bibliotecas já estiverem
disponíveis, instale só o navegador com `npx playwright install chromium`.
Os downloads do CDN também chegaram vazios nesta rodada. Alternativa
usada: instalar `@sparticuz/chromium@133.0.0` numa pasta temporária fora
do projeto, extrair seu executável e ligá-lo ao caminho do headless shell
esperado pelo Playwright disponível. Chromium 133 executou as jornadas;
não altere o manifesto do projeto para esse preparo.

Inicie o jogo com `npm run dev -- --hostname 127.0.0.1` ou, para a bateria
final, `npm run build` seguido de `npm start -- --hostname 127.0.0.1`.
Os testes usam `http://localhost:3000` ou `URL_JOGO`. Neste executor, cada
invocação tem rede isolada: servidor e testes devem ser filhos da mesma
invocação; use `URL_JOGO=http://127.0.0.1:3000` para ambos.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

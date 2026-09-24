# InterativAI: Ilha Sites

Resumo do projeto para quem chega numa sessão nova. Leia este arquivo e o
`docs/PROGRESSO.md` antes de mexer em qualquer coisa.

## Visão

Jogo interativo em PT-BR para ensinar programação web a quem nunca programou.
O jogador aprende usando uma versão simplificada do DevTools (F12) e vê a
página mudar em tempo real. Tudo o que ele aprende funciona "lá fora", no F12
de qualquer site real. O gancho emocional: "eu consigo mexer em qualquer site".

Estrutura futura (não construir agora, só não bloquear):

- Mapa estilo Mario World com ilhas. Cada ilha é uma esfera de conteúdo; a
  primeira é a **Ilha Sites**.
- Dentro da ilha, zonas seguindo os painéis do DevTools: Elementos, Estilos,
  Console, Rede, Aplicação.
- Cada zona tem várias fases.

Hoje existe **uma fase completa**: Ilha Sites › Elementos › Fase 1, "O site é
seu", que valida o loop de aprendizado.

## Regras de trabalho (obrigatórias)

1. Trabalhar em etapas. No fim de cada etapa: `npm run build` e `npm run lint`
   passando, commit em PT-BR, `docs/PROGRESSO.md` atualizado.
2. Se o contexto ficar pesado, parar num fim de etapa, com commit feito.
3. Não inventar APIs, pacotes ou nomes de modelo. Confirmar na doc oficial.
4. TypeScript estrito, sem `any`. Componentes pequenos, um por arquivo.
5. **Zero emojis** em qualquer lugar (UI, falas, código de conteúdo, commits).
   Expressividade visual vem de SVG.
6. **Zero cores literais** fora de `src/tema/tokens.css`. Única exceção: o CSS
   do site-alvo fictício (`src/fases/**/siteAlvo.ts`), que representa "o site
   de outra pessoa".
7. Interface 100% em PT-BR.
8. A chave do Gemini nunca vai para o cliente. Nada de `NEXT_PUBLIC_` com chave.

## Stack

- Next.js 16 (App Router) + TypeScript estrito + Tailwind CSS v4 + Framer Motion.
- Editor: CodeMirror 6 com `@codemirror/lang-html` (Monaco está proibido).
- Formatação de HTML no browser: `js-beautify` (função `html`).
- Tutor: `@google/genai` (SDK oficial), chamado só pela rota
  `src/app/api/tutor/route.ts`. Modelo padrão `gemini-3.8-flash`
  (Flash mais recente GA na doc oficial em 2026-09), configurável por
  `GEMINI_MODEL`.
- Persistência: `localStorage`, chave `ilha-sites:progresso:v1`, sempre com
  try/catch e normalização.
- Fontes via `next/font/google`: Nunito (UI) e JetBrains Mono (código).
- Sem banco, sem login, sem backend além da rota do tutor.

## Arquitetura

```
src/
  app/                  rotas (/, /lab/mascote, /api/tutor)
  tema/                 tokens.css (ÚNICO lugar com cores), temas.ts, script do tema
  lib/                  progresso (localStorage), armazém reativo, tema, som, DOM
  motor/                tipos das fases, validação, escada de ajuda, abas
  fases/                dados das fases (uma pasta por fase)
  componentes/
    layout/             barra superior, trilha, estrelas, seletor de tema, som
    painel/             DevTools simplificado: abas, árvore, editor, divisor
    preview/            janela de navegador falsa, iframe, sobreposição
    mascote/            Mascote, Carinha, balão de fala, área inferior
    jogo/               composição da tela e estado da fase
    icones/             ícones SVG (um por arquivo)
    ui/                 peças genéricas (dica, botão, modal)
```

### Tema

- Todas as cores são variáveis CSS em `src/tema/tokens.css`, aplicadas por
  `data-theme` no `<html>` (seletor `[data-theme="..."]`, então funciona em
  qualquer elemento, o que permite o `/lab/mascote` mostrar temas lado a lado).
- O Tailwind lê essas variáveis (`@theme inline` em `globals.css`) e a paleta
  padrão do Tailwind está desligada (`--color-*: initial`).
- Temas: **Doce** (claro, pastéis saturados), **Fliperama** (escuro, neon) e
  **Segredo** (bloqueado, liberado pelo easter egg).
- Um script inline no `<head>` aplica o tema salvo antes da primeira pintura.

### Painel + preview (fonte única de verdade)

- O estado principal é uma string: o HTML do `<body>` do site-alvo.
- O `<head>` do site-alvo é fixo na fase e não aparece no editor.
- Preview: `<iframe sandbox="allow-same-origin">` com `srcdoc` = head + body.
- A árvore é construída do `contentDocument.body` depois do `load`.
- **Caminho A** (editor): editor muda, debounce 300 ms, novo `srcdoc`, no
  `load` reconstrói a árvore e valida objetivos.
- **Caminho B** (árvore): altera direto o `contentDocument`, serializa
  `body.innerHTML`, formata, atualiza o editor com anotação de origem externa
  (não dispara o caminho A), reconstrói a árvore e valida.
- Seleção preservada entre recargas pelo caminho de índices do nó.

### Motor de fases

- Fases são **dados** (`src/fases/<id>/`), o motor é genérico.
- Tipos principais em `src/motor/tipos.ts`: `Fase`, `Objetivo`, `Ajudas`,
  `Fala`, `ContextoValidacao`, `ContextoFase`.
- Objetivos sequenciais, validação a cada mudança e evento
  (`selecionou`, `inspecionou`, `editouTexto`, `editouAtributo`, `editouCodigo`).
- Escada de ajuda "Me ajuda": pergunta, dica, aponta a linha, solução (custa
  1 estrela; mínimo de 1 estrela ao concluir).

### Mascote

- Computadorzinho: monitor retrô em SVG puro, rosto estilo `:)`.
- Expressões: feliz, curioso, pensativo, apontando, comemorando, preocupado,
  dormindo. Piscar aleatório, respiração, transição suave, respeita
  `prefers-reduced-motion`.
- `Carinha` (feliz, dormindo, surpresa) para decorar com moderação.

### Tutor (Gemini)

- `POST /api/tutor` (runtime nodejs). Entrada: fase, objetivo, degrau atual,
  HTML atual, pergunta, histórico (últimas 6). Saída `{ texto, expressao }`.
- Variáveis: `GEMINI_API_KEY`, `GEMINI_MODEL`. Sem chave o jogo funciona e o
  chat mostra "Estou sem sinal agora. Tenta o botão Me ajuda!".
- Falhas esperadas (sem chave, 429, rede) respondem 200 com `{ erro }`; só
  entrada inválida usa 400. Assim o console do navegador fica limpo.
- O enunciado enviado ao modelo vem dos dados da fase no servidor.

### Easter egg

- O HTML do próprio jogo tem um comentário e um elemento `data-segredo` pedindo
  para digitar "curioso" no campo do computadorzinho. Isso libera o tema
  Segredo, sem chamar o Gemini.

## Fora do escopo agora

Mapa das ilhas, outras zonas e fases, abas além de Elementos, site-alvo
externo validado, login, banco de dados, Monaco.

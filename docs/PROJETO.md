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
   dos sites-alvo fictícios (`src/conteudo/**/sites/*.ts`), que representam
   "o site de outra pessoa".
7. Interface 100% em PT-BR.
8. A chave do Gemini nunca vai para o cliente. Nada de `NEXT_PUBLIC_` com chave.

## Stack

- Next.js 16 (App Router) + TypeScript estrito + Tailwind CSS v4 + Framer Motion.
- Editor: CodeMirror 6 com `@codemirror/lang-html` (Monaco está proibido).
- Formatação de HTML no browser: `js-beautify` (função `html`).
- Tutor: `@google/genai` (SDK oficial), chamado só pela rota
  `src/app/api/tutor/route.ts`. Modelo padrão `gemini-3.8-flash`
  (Flash mais recente GA na doc oficial em 2026-09), configurável por
  `GEMINI_MODEL`. Reserva em sobrecarga: `gemini-3.5-flash-lite` (Flash-Lite
  atual recomendado na doc em 2026-09), configurável por `GEMINI_MODEL_RESERVA`.
- Persistência: `localStorage`, chave `ilha-sites:progresso:v2`, sempre com
  try/catch e normalização. A v1 é migrada sozinha na primeira leitura
  (ids de fase renomeados, nada se perde) e fica intacta como cópia.
- Fontes via `next/font/google`: Nunito (UI) e JetBrains Mono (código).
- Sem banco, sem login, sem backend além da rota do tutor.

## Arquitetura

```
src/
  app/                  rotas (/, /lab/mascote, /api/tutor)
  ferramentas/          registro central das ferramentas (dados), ids, sinal de uso, mini demos
  tema/                 tokens.css (ÚNICO lugar com cores), temas.ts, script do tema
  lib/                  progresso (localStorage), armazém reativo, tema, som, DOM
  conteudo/             conteúdo declarativo: tipos, catálogo de conceitos, unidades e fases
    ilhas/sites/elementos/unidade-N/   uma pasta por unidade (fases, unidade.ts, sites/)
  motor/                núcleo do painel, validadores, executor de ações, estado do motor
  componentes/
    layout/             barra superior, trilha, estrelas, seletor de tema, som
    painel/             DevTools simplificado: abas, árvore, editor, divisor
    preview/            janela de navegador falsa, iframe, sobreposição
    mascote/            Mascote, Carinha, balão de fala, área inferior
    jogo/               composição da tela e estado da fase (movel/: layouts e teclado)
    ferramentas/        apresentação (spotlight), Caixa de Ferramentas, AlvoFerramenta
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

### Sincronia tripla (árvore, código e tela)

- Seleção (árvore, inspeção, ajuda ou cursor no editor) acende três coisas:
  o nó na árvore, o trecho inteiro do elemento no editor (fundo animado e
  barrinha na margem, rolando até ele) e a caixa no preview. Sem hover, a
  caixa do preview mostra o selecionado; o hover na árvore só troca a caixa.
- Código e DOM se ligam por um **caminho só de elementos**
  (`src/lib/caminhoElementos.ts`): índices entre filhos-elemento, ignorando
  textos e comentários dos dois lados, mais a lista de tags de cada passo.
  No código, o caminho sai da árvore sintática Lezer que o CodeMirror já tem
  (`ensureSyntaxTree`, `editor/mapaElementos.ts`). Se as tags não baterem
  (HTML quebrado no meio da digitação, correção do parser do navegador),
  nada é destacado e nada é lançado.
- Cursor no editor: só transações do jogador (sem a anotação de origem
  externa, sem mudança de texto) disparam a seleção, com 150 ms de espera.
  Seleção vinda do editor não mexe no cursor nem rola o editor: sem laço.

### Motor de fases

- Fases são **dados 100% declarativos** (`src/conteudo/`), o motor é
  genérico. Tipos em `src/conteudo/tipos.ts`: `Validador`, `Acao`,
  `Objetivo`, `Fase` (`pratica` | `desafio`), `Unidade`, `SiteAlvo`.
- Validadores são interpretados por `src/motor/validadores.ts`; ações, por
  `src/motor/executarAcao.ts`, que chama o núcleo do painel
  (`src/motor/nucleoPainel.ts`): as mesmas funções que a interface usa.
- Objetivos sequenciais, validação a cada mudança e evento
  (`selecionou`, `inspecionou`, `editouTexto`, `editouAtributo`, `editouCodigo`).
- Escada de ajuda "Me ajuda": pergunta, dica, aponta a linha, solução (custa
  1 estrela; mínimo de 1 estrela ao concluir).

### Apresentação de ferramentas

- Regra de produto: toda ferramenta é apresentada antes (ou no momento) do
  primeiro uso. Tudo é dado: `src/ferramentas/registro.ts` tem um objeto por
  ferramenta (nome, ícone SVG, `alvo`, o que faz, pra que serve, como usar
  com mouse e com toque, "No F12 de verdade", o que fazer no "Experimente",
  como detectar o uso e mini demo opcional). Ferramenta nova = entrada nova
  no registro + `data-ferramenta` no elemento real (via `AlvoFerramenta`).
- Fases e objetivos pedem apresentações com `apresentar?: IdFerramenta[]`.
  Quando um objetivo fica ativo, a fila é: as da fase, depois as dos
  objetivos até o atual, tirando as já vistas. O objetivo já está ativo
  durante a apresentação, então o "Experimente" pode cumpri-lo.
- Spotlight: véu (`--cor-veu`) com máscara SVG e recorte arredondado,
  contorno pulsante na `--cor-destaque`, mascote num cartão ao lado do alvo
  (escolhe o lado que cabe sem cobrir; alvo maior que a tela manda o cartão
  para a borda oposta). Três falas (clique, toque ou Enter; Esc pula) e o
  "Experimente": o bloqueio vira uma camada com `clip-path: path(evenodd)`
  cheia de buracos, então só o alvo (e áreas extras, como a tela no modo
  inspecionar) recebe toques. Uso detectado por `sinalizarUso(id)` da
  interface ou, para `uso: "tocar"`, por toque/rolagem no alvo (inclusive
  dentro do iframe). "Pular" sempre visível. Vistas e puladas ficam em
  `apresentacoesVistas`.
- Caixa de Ferramentas: gaveta (desktop) ou folha arrastável (celular), card
  por ferramenta, silhueta com carinha dormindo para as ainda não vistas,
  "Rever apresentação". O "?" discreto (só com mouse) e o toque longo
  (550 ms, cancela se o dedo andar) abrem direto o card.

### Mascote

- Computadorzinho: monitor retrô em SVG puro, rosto estilo `:)`.
- Expressões: feliz, curioso, pensativo, apontando, comemorando, preocupado,
  dormindo. Piscar aleatório, respiração, transição suave, respeita
  `prefers-reduced-motion`.
- `Carinha` (feliz, dormindo, surpresa) para decorar com moderação.

### Tutor (Gemini)

- `POST /api/tutor` (runtime nodejs). Entrada: fase, objetivo, degrau atual,
  HTML atual, pergunta, histórico (últimas 6). Saída `{ texto, expressao }`.
- Variáveis: `GEMINI_API_KEY`, `GEMINI_MODEL`, `GEMINI_MODEL_RESERVA`
  (opcional).
- Resistência a sobrecarga (`src/lib/tutor/resiliencia.ts`): 503/429 ou
  UNAVAILABLE/RESOURCE_EXHAUSTED tentam de novo 2 vezes com backoff
  exponencial e jitter (~1 s e ~2 s) e depois 1 vez no modelo reserva. Cada
  tentativa tem até 15 s e o total fica em 45 s; `maxDuration = 60` (o teto
  do plano Hobby da Vercel com Fluid compute é 300 s, doc de set/2026).
- Falhas respondem 200 com `{ erro: { tipo } }`, tipo `sobrecarga`,
  `sem_chave`, `rede` ou `desconhecido` (entrada inválida usa 400). O
  servidor loga tipo, status e modelo (nunca a chave). No cliente:
  sobrecarga = pensativo + "Tentar de novo" (reenvia a mesma pergunta); sem
  chave = dormindo, "Meu chat ainda não foi ligado..."; rede e desconhecido
  = preocupado, "Estou sem sinal agora...". Quando a reserva responde, o
  jogador nem percebe.
- Testes locais: `TUTOR_SIMULAR=sobrecarga | sobrecarga-total | rede` (só
  fora de produção) simula o Gemini sem chave.
- O enunciado enviado ao modelo vem dos dados da fase no servidor.

### Som

- `src/lib/som.ts`: Web Audio, sem arquivos. Sons: acerto, clique, conclusão,
  aviso. Volume baixo, botão liga/desliga salvo no progresso. O AudioContext só
  é criado depois da primeira interação (`Provedores` libera no primeiro
  clique ou tecla).

### Responsivo (três composições)

- Regra central: enquanto o jogador edita, a prévia continua visível.
- `useLayoutJogo`: **paisagem** quando `(orientation: landscape) and
  (max-height: 499.98px)`; senão **desktop** a partir de 1024 px; senão
  **retrato**. Entre 768 e 1024 px (tablets) vale o retrato: o layout antigo
  (abas "Painel" | "Tela") escondia a prévia enquanto se editava, e o
  retrato mantém os dois à vista com área de sobra num tablet em pé.
- Os três layouts usam a mesma árvore de componentes; só mudam classes,
  `order` e o que é mostrado (`PainelDividido` com `mostrar`). Editor,
  iframe e estado não remontam ao girar. O rascunho do tutor fica no
  `JogoFase` pelo mesmo motivo.
- Retrato: prévia em cima (padrão 40%, alça de 25% a 60%, salva em
  `proporcaoPrevia`), painel embaixo com "Árvore | Código", barra superior
  compacta com menu, barra de objetivos de uma linha, computadorzinho
  flutuante (56 px) com balão que abre sozinho a cada fala nova.
- Paisagem: lado a lado 50/50, barra fina, mini avatar, balão que fecha
  sozinho depois do tempo de leitura, recado para virar o celular ao focar
  o editor (sem bloquear).
- Teclado virtual: `interactiveWidget: "resizes-content"` na viewport (Chrome
  108+ e Firefox 132+; no Safari ainda não saiu em versão pública, set/2026)
  e, como reforço, `window.visualViewport`: a altura do app segue a altura
  visível, e com campo focado e altura < 78% da maior vista o teclado conta
  como aberto (prévia vai a 25%, barra de objetivos some). Unidades `dvh`.
- Toque: `touch-action: manipulation` (sem zoom de duplo toque), inspecionar
  arrastando o dedo (soltar escolhe), duplo toque e botão "Editar" no nó
  selecionado, alvos de 44 px (`pointer-coarse:`), toque longo no lugar do
  "?". Enunciados têm `enunciadoToque` ("toque" em vez de "clique").

### Easter egg

- O HTML do próprio jogo tem um comentário e um elemento `data-segredo` pedindo
  para digitar "curioso" no campo do computadorzinho. Isso libera o tema
  Segredo, sem chamar o Gemini.

## Testes

Scripts Playwright em `testes/` (ver `testes/README.md`), rodando contra o
jogo no ar: sincronia, apresentações e Caixa, a fase inteira em desktop,
retrato (390×844, toque) e paisagem (844×390, toque), celular (prévia ao
editar, teclado simulado, alça, giro, spotlight) e tutor (sobrecarga,
reserva, sem chave).

## Fora do escopo agora

Mapa das ilhas, outras zonas e fases, abas além de Elementos, site-alvo
externo validado, login, banco de dados, Monaco. Ferramentas novas do
DevTools (trilha de hierarquia, apagar/esconder elemento, desfazer,
duplicar) e a Fase 2.

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

Hoje existem duas unidades na Ilha Sites › Elementos:

- **Unidade 1, "O site é seu"**: a Fase 1 (só objetivos guiados; os objetivos
  sozinho e o desafio dela são o primeiro trabalho a fazer com a fábrica).
- **Unidade 2, "Faxina no site"**: a unidade-modelo, completa (3 fases de
  micro-passos no Jornal da Vila e o desafio na loja Brinquedos Arco-Íris).

O conteúdo é produzido em massa a partir do formato declarativo, das
checagens automáticas e do guia `docs/GUIA-DE-CONTEUDO.md`.

### Modelo pedagógico (regra do projeto)

Cada conteúdo X é uma **unidade**: (1) meta no começo, com o site do desafio
antes e depois; (2) micro-passos, cada habilidade primeiro **guiada** (ajuda
completa) e depois **sozinho** (só pergunta e dica) em outra situação; (3)
**desafio** num site diferente, sem passo a passo, com checklist e "Rever";
(4) **revisão espaçada**: cada fase revisita algo de antes, misturado na
tarefa. Detalhes em `docs/GUIA-DE-CONTEUDO.md`.

## Regras de trabalho (obrigatórias)

1. Trabalhar em etapas. No fim de cada etapa: `npm run build`, `npm run lint`
   e `npm run testar:conteudo` passando, commit em PT-BR,
   `docs/PROGRESSO.md` atualizado.
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
9. Conteúdo é **só dado** (nada de função em fase) e segue o
   `docs/GUIA-DE-CONTEUDO.md`. Toda ferramenta nova entra no registro de
   ferramentas, com apresentação, card, `data-ferramenta` e variantes de
   mouse e toque.

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
- Testes de conteúdo: Vitest + jsdom (`npm run testar:conteudo`). Testes de
  navegador: scripts Playwright em `testes/`.
- Sem banco, sem login, sem backend além da rota do tutor.

## Arquitetura

```
src/
  app/                  rotas (/ mundo, /ilha/[id], /fase/[id], /lab/mapa, /lab/fases, /lab/mascote, /api/tutor)
  ferramentas/          registro central das ferramentas (dados), ids, sinal de uso, mini demos
  tema/                 tokens.css (ÚNICO lugar com cores), temas.ts, script do tema
  lib/                  progresso (localStorage), armazém reativo, tema, som, DOM
  curriculo/            o currículo inteiro em dados (ilhas, zonas, unidades) e a consistência com o conteúdo
  componentes/mapa/     o mapa: mundo, ilha (pontos e card), museu das Origens, arte SVG das ilhas
  conteudo/             conteúdo declarativo: tipos, conceitos, registro, checagens, índice
    ilhas/sites/elementos/unidade-N/   uma pasta por unidade (fases, unidade.ts, sites/)
  motor/                núcleo do painel, validadores, executor de ações, simulação, estado do motor
  componentes/
    layout/             barra superior, onde estou, estrelas, botão Fases, tema, som
    painel/             DevTools simplificado: abas, árvore (menu do nó, barra, trilha), editor
    preview/            janela de navegador falsa, iframe, sobreposição
    mascote/            Mascote, Carinha, balão, previsão, checklist, Rever, selo Sozinho
    jogo/               composição da tela, motor, meta, conclusão, Lista de fases (usada no /lab/mapa) (movel/)
    lab/                o /lab/fases (validadores ao vivo, checagens, índice) e o /lab/mapa
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
- Preview: `<iframe sandbox="allow-same-origin">` com `srcdoc` = head + body
  (+ a regra de esconder do F12, ver "Ferramentas da aba Elementos").
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
- Objetivos sequenciais, validação a cada mudança e evento (`selecionou`,
  `inspecionou`, `trilha`, `editouTexto`, `editouAtributo`, `editouCodigo`,
  `escondeu`, `mostrou`, `apagou`, `duplicou`, `desfez`, `refez`,
  `respondeuPrevisao`). Eventos contam a partir do começo do objetivo; os
  dos momentos roteirizados não contam.
- Escada de ajuda "Me ajuda": pergunta, dica, aponta a linha, solução (custa
  1 estrela; mínimo de 1 estrela ao concluir).
- Estado em `src/motor/estadoMotor.ts`, comportamento em
  `componentes/jogo/useMotorFase.ts`. Etapas: `meta`, `introducao`,
  `objetivos`, `concluida`. Modos de jogo: `jogo`, `revisao` (aberta pelo
  "Rever": sem estrelas, sem salvar, começa nos objetivos, botão "Voltar ao
  desafio") e `lab` (/lab/fases: sem salvar, sem apresentações).
- **Guiado**: os 4 degraus. **Sozinho**: selo "Sozinho" (carinha
  determinada), "Me ajuda" até a dica, tutor só pergunta, comemoração "Fez
  sozinho!". **Previsão**: card com opções no balão (sem "Me ajuda" e sem
  apresentações até o palpite), resultado com a explicação, errar não custa
  estrela; depois o jogador faz a ação e vê acontecer.
- **Momentos roteirizados** (`eventosIniciais`, `eventoAoComecar`): o
  computadorzinho faz ações pelo painel, com animação de esbarrão opcional.
  Ao retomar no meio, a página volta ao HTML de antes (`htmlInicioObjetivo`)
  e o momento roda de novo.
- **Desafio**: meta com antes/depois (o depois sai de
  `estadoFinalDoDesafio`, aplicando as soluções das partes), "Me ajuda" vira
  "Rever" (lista das partes pendentes; cada uso custa 1 estrela, salva o
  desafio e abre a fase de `revisarEm` em modo revisão), tutor só pergunta.
  **Checklist**: parte cujo validador depende de seleção ou evento
  (`selecionado`, `evento`, ou `todos`/`algum`/`nao` que contenham algum
  deles — `validadorTravado` em `src/motor/validadores.ts`) **trava**: uma
  vez marcada, fica marcada, porque são momentos, não estado da página, e
  desfazer não teria como "voltar" a eles (ex.: "selecionar a vitrine pela
  trilha"). As demais (`existe`, `naoExiste`, `escondido`, `contagem`,
  `atributo`, validadores de texto e combinações só com eles) são
  **avaliadas ao vivo**: a cada checagem o motor confere de novo
  (`recalcularPartesFeitas`), e desfazer a ação desmarca a parte. O desafio
  só conclui quando todas as partes ao vivo passam ao mesmo tempo e todas as
  travadas já foram marcadas.
- **Meta**: quando a unidade tem `meta.desafioId`, aparece antes do
  desafio (sempre que ele começa) e, uma vez só por unidade, na primeira
  fase, se a pessoa não tem nenhum progresso nela (`faseAbreComMeta`,
  `src/lib/metaDaUnidade.ts`; vistas em `metasVistas`).

### Navegação (o mapa)

- Rotas (`src/lib/rotas.ts`), todas com deep link: `/` é o mundo,
  `/ilha/[id]` a ilha (ou o museu, em `/ilha/origens`), `/fase/[id]` a
  fase. Recarregar mantém o lugar e o voltar do navegador faz fase ->
  ilha -> mundo. Ids fora do currículo ou do conteúdo dão 404
  (`generateStaticParams` + `dynamicParams = false`).
- `Jogo` recebe o id da rota; fase ainda trancada
  (`src/lib/liberacao.ts`: abre quando a anterior foi concluída) mostra um
  aviso com o caminho de volta. A fase aberta vira `faseAtual` (o mapa põe
  o computadorzinho nela e o card diz "Continuar").
- Dentro da fase, o botão "Mapa" (barra do desktop; no celular, à esquerda
  do título) volta para a ilha. "Próxima fase" só aparece dentro da
  unidade; depois da última fase (o desafio), a conclusão tem "Voltar pra
  ilha", e a ilha comemora. O "Rever" do desafio continua na mesma página
  (sem mudar o endereço).
- A Lista de fases saiu da navegação: mora no `/lab/mapa`, junto com
  "Desbloquear tudo" (`mapaDesbloqueado`) e "Resetar o progresso do mapa",
  só para testes.
- A palavra "trilha" fica reservada para a ferramenta; o "onde estou" da
  barra superior é o componente `OndeEstou`.

### Mapa das ilhas

- Regras em `src/lib/mapa.ts` (testadas em `testes/conteudo/mapa.test.ts`),
  tudo derivado do currículo, do conteúdo e do progresso. Ilha sem unidade
  pronta: "em construção"; Origens (sempre aberta) e Sites abertas; cada
  ilha seguinte da rota abre quando a anterior está aberta e com todas as
  unidades prontas concluídas (a opcional segue a última da rota); com
  unidade pronta e sem essa condição: "bloqueada". Dentro da ilha, a zona
  abre quando as anteriores têm tudo pronto concluído, e as unidades
  prontas da zona vão em sequência. Unidade: planejada (sem conteúdo),
  concluída (todas as fases), disponível ou bloqueada.
- Mundo (`MundoMapa`): mar com ondas SVG, ilhas na ordem do currículo
  ligadas por uma rota pontilhada com um barquinho, Frameworks afastada e
  marcada "Opcional", arte própria de cada ilha em SVG
  (`componentes/mapa/arte/`, só tokens) e o estado dela (brilho, andaimes
  com o computadorzinho dormindo, névoa com cadeado). O computadorzinho
  fica na ilha da última fase aberta. Dá para arrastar (mouse) e rolar
  (dedo, rodinha, teclado): `AreaArrastavel`.
- Ilha (`TelaIlha`, `/ilha/[id]`): zonas como regiões ao longo de um
  caminho sinuoso (horizontal no desktop e deitado, vertical em pé), com
  o ícone da aba do DevTools da zona e a placa "Em construção" nas zonas
  com `requerMotor` (sem o texto técnico). Pontos de 52 px: concluída
  (carinha feliz e estrelas), disponível (pulsando), bloqueada (cadeado),
  planejada (andaime, "Em breve"). O card mostra título, meta, estrelas e
  Jogar / Continuar / Jogar de novo (a próxima fase não concluída; "Jogar
  de novo" recomeça as fases da unidade, sem perder estrelas). O
  computadorzinho anda do ponto onde parou (`posicaoNoMapa`) até o atual;
  unidade concluída desde a última visita acende com festa e desenha o
  trecho até a próxima (`unidadesComemoradas`, uma vez só).
- Museu das Origens (`/ilha/origens`): fachada, os antepassados do
  computadorzinho em silhueta (cartão perfurado, terminal verde, primeiro
  PC) e as 5 salas do currículo como portas fechadas "Em breve".
- Tokens novos do mapa em `tokens.css` (mar, onda, areia, grama, rota,
  névoa, madeira, pedra, terminal), nos três temas.

### Currículo

- `docs/MAPA-CURRICULAR.md` é o percurso inteiro (ilhas Origens, Sites,
  Lógica, Páginas vivas, Rede e Servidor, Ofício e a opcional
  Frameworks). `src/curriculo/curriculo.ts` é a versão em dados: ilha
  (`opcional`, `sempreAberta`), zona (`icone`, `requerMotor`) e unidade
  (id `<ilha>-<zona>-u<n>`, título, meta em uma frase e, raro,
  `requerMotor` só dela, como a U6).
- Status não é guardado: unidade com conteúdo registrado de mesmo id é
  "pronta"; o resto é "planejada" (`statusDaUnidade`).
- Checagens (`src/curriculo/conferir.ts`, no `testar:conteudo`): ids
  únicos; toda unidade de conteúdo está no currículo, com id, número,
  ilha, zona, título e ordem batendo; nenhuma unidade de conteúdo mora em
  zona (ou unidade) com `requerMotor`.

### Fábrica de conteúdo

- Guia: `docs/GUIA-DE-CONTEUDO.md`. Template anotado: `docs/TEMPLATE-FASE.ts`.
- Catálogo de conceitos: `src/conteudo/conceitos.ts`; índice conceito ->
  fases que ensinam, praticam, revisam e pedem: `montarIndice()`
  (`src/conteudo/indice.ts`), base do futuro computadorzinho navegador.
- Checagens: `src/conteudo/checagens.ts` (regras gerais, de dados e de
  simulação), rodando em `npm run testar:conteudo` e no `/lab/fases`.
  A simulação do desafio usa o mesmo `recalcularPartesFeitas` do motor.
- `pratica` na fase: conceitos já ensinados que a fase só treina (fase
  só de sozinho: `conceitos` vazio, sem guiado). `revisarEm` aponta para
  a fase guiada.
- Congelamento: `src/conteudo/publicados.json` (ids de unidades, fases,
  objetivos e partes publicados, na ordem). O `testar:conteudo` falha se
  algum sumir ou mudar; `npm run publicar:conteudo` atualiza de propósito.
- `data-chave` da árvore: `src/motor/chaveArvore.ts` (sem imports, para os
  testes Playwright executarem as mesmas funções dentro da página).
- Simulação headless: `src/motor/simulacao.ts` (Document solto + o mesmo
  núcleo do painel da interface).
- `/lab/fases`: qualquer fase direto, validadores ao vivo, aplicar a solução
  do objetivo atual, resetar, checagens e índice.

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
- A fila espera enquanto um momento roteirizado roda, enquanto um card de
  previsão não foi respondido e na revisão/lab (no lab não há
  apresentações). No "Experimente", o cartão do mascote também evita as
  áreas liberadas (a árvore da trilha, a tela do inspecionar), se couber.
- Caixa de Ferramentas: gaveta (desktop) ou folha arrastável (celular), card
  por ferramenta, silhueta com carinha dormindo para as ainda não vistas,
  "Rever apresentação". O "?" discreto (só com mouse) e o toque longo
  (550 ms, cancela se o dedo andar) abrem direto o card.

### Ferramentas da aba Elementos (Unidade 2)

- Trilha de elementos no rodapé da árvore (clicar seleciona o ancestral).
- Esconder como o Chrome (tecla H): classe `__web-inspector-hide-shortcut__`
  no elemento e regra `visibility: hidden !important` no head do site-alvo
  (`src/lib/esconder.ts`); o espaço continua e a classe aparece na árvore
  e no código.
- Apagar (Delete), duplicar (Shift+Alt+seta para baixo), desfazer e
  refazer (Ctrl+Z, Ctrl+Shift+Z ou Ctrl+Y com o foco no painel; botões no
  topo do painel). Tudo passa pelo núcleo `src/motor/nucleoPainel.ts`.
- Menu do nó: botão direito (desktop) ou toque longo (celular). No
  celular, o nó selecionado ganha uma barra com Editar, Renomear, Esconder,
  Apagar, Duplicar, Desfazer e Refazer.
- Renomear tag (ferramenta `renomear-tag`, rodada 5): dois cliques no nome
  da tag, como o "Edit node type" do Chrome (doc e devtools-frontend:
  `setNodeName` troca a peça por outra com os mesmos atributos e filhos;
  Enter ou Espaço confirmam, Esc desiste, nome vazio ou igual não faz
  nada, `html`/`head`/`body` não renomeiam). O fechamento acompanha o nome
  enquanto digita. Núcleo `renomearTag` (entra no desfazer), evento
  `renomeouTag`, ação `renomearTag` e validador `tag`.
- Links na prévia (rodada 5): o iframe nunca navega (clique, botão do
  meio e envio de formulário são segurados em `PreviewSiteAlvo`). O
  núcleo `clicarLink` classifica o link (`src/lib/linksPrevia.ts`:
  âncora, quebrado, vazio, externo) e gera `clicouLink` com o `href`; a
  interface rola até a âncora (e ao topo no `href="#"`) e o
  computadorzinho fala para onde o link levaria. Ação `clicarLink`;
  validador `evento` com `href` opcional.

### Mascote

- Computadorzinho: monitor retrô em SVG puro, rosto estilo `:)`.
- Expressões: feliz, curioso, pensativo, apontando, comemorando, preocupado,
  dormindo. Piscar aleatório, respiração, transição suave, respeita
  `prefers-reduced-motion`.
- `Carinha` (feliz, dormindo, surpresa) para decorar com moderação.

### Tutor (Gemini)

- `POST /api/tutor` (runtime nodejs). Entrada: fase, objetivo, degrau atual,
  HTML atual, pergunta, histórico (últimas 6). Saída `{ texto, expressao }`.
- O servidor tira dos dados da fase (`src/lib/tutor/contextoDoTutor.ts`) o
  enunciado oficial, o site-alvo e o **modo** (`guiado`, `sozinho` ou
  `desafio`); no sozinho e no desafio o prompt manda só fazer perguntas.
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

- **Conteúdo** (`npm run testar:conteudo`, Vitest + jsdom, `testes/conteudo/`):
  cada regra de `src/conteudo/checagens.ts` vira um teste por fase (ids,
  conceitos, ferramentas apresentadas, limites de texto, emojis, previsões,
  estado inicial, soluções de teste e do "Me ajuda" cumprindo cada objetivo
  na hora certa, momentos roteirizados, partes do desafio), mais o índice de
  conceitos, o núcleo do painel, a migração do progresso, o contexto do
  tutor e o próprio template anotado.
- **Navegador** (Playwright em `testes/`, ver `testes/README.md`), contra o
  jogo no ar: sincronia, apresentações e Caixa, ferramentas novas (desktop,
  celular, toque longo, apresentações), a Fase 1 e as Unidades 1 e 2
  inteiras em desktop, retrato (390×844, toque) e paisagem (844×390, toque),
  retomar no meio de um momento roteirizado, celular (prévia ao editar,
  teclado simulado, alça, giro, spotlight) e tutor (sobrecarga, reserva,
  sem chave).

## Fora do escopo agora

Computadorzinho navegador
(o índice `montarIndice()` já existe), atividades teóricas (linha do tempo,
comparador de linguagens, diagrama de rede; o registro de tipos de fase já
está pronto para elas), outras zonas, abas além de Elementos, objetivos
sozinho e desafio da Unidade 1 (primeiro trabalho com a fábrica), site-alvo
externo validado, login, banco de dados, Monaco.

# Roadmap

Fonte única de status do projeto: o que foi feito, o que está em
andamento e o que vem depois. **Todo prompt do Claude Code termina
atualizando a seção Status deste arquivo.** O detalhe de cada rodada
(etapas, decisões, testes) continua em `docs/PROGRESSO.md`.

## Visão

Plataforma/jogo pra ensinar programação de verdade, do zero até dev
júnior e além, de forma super interativa: um DevTools (F12)
simplificado, prévia ao vivo e o computadorzinho como tutor. Tudo que se
aprende funciona no F12 de verdade. No futuro, trilhas paralelas
(Automação industrial com eletrônica e elétrica, Jogos) compartilham o
núcleo comum.

## Fluxo de trabalho

- Estrutura, motor, visual e criatividade: Claude Opus 5.5. Conteúdo em
  massa: Claude Sonnet 5 (esforço médio).
- Fluxo sequencial: uma sessão nova do Claude Code por prompt, a partir
  da branch principal. Merge depois de conferir o relatório.
- Todo prompt termina atualizando a seção Status deste arquivo.
- Materiais de apoio opcionais (ideia em avaliação): textos teóricos
  brutos em `docs/materiais/<ilha>.md`, produzidos fora (ex: DeepSeek) e
  conferidos pelo Sonnet antes de usar.

## Status

### Feito

- Motor: painel Elementos, prévia, sincronia árvore-código-tela,
  ferramentas (árvore, inspecionar, editar, trilha, esconder, apagar,
  desfazer/refazer, duplicar, renomear tag, links na prévia),
  apresentações e Caixa de Ferramentas, escada de ajuda, modos
  guiado/sozinho/previsão/desafio, tutor Gemini com retry e modelo
  reserva, mobile (retrato e paisagem), 3 temas, sons sintetizados,
  easter egg.
- Fábrica: formato declarativo, `testar:conteudo`, congelamento
  (`publicar:conteudo`), guia, template, atritos.
- Mapa: mundo, ilhas, zonas, unidades, Museu das Origens (vazio),
  desbloqueios.
- Conteúdo: **Ilha Sites completa** — Elementos (U1 a U6), Estilos (E1 a
  E5), Layout (L1 a L4), Responsivo (R1 e R2) e Publicar (P1 e P2).
- Rodada 9 (painel Estilos, modo documento, ROADMAP):
  - `docs/ROADMAP.md` (este arquivo) e a regra de atualizar o Status no
    fim de todo prompt (`PROJETO.md` e guia).
  - Currículo com as adições do mapa: ilha IA entre Rede e Servidor e
    Ofício (5 zonas, todas com "IA ao vivo" como motor), sala "Por baixo
    do capô" nas Origens, zonas novas na Lógica (Resolvendo problemas,
    Estruturas de dados, Algoritmos essenciais), na Rede e Servidor
    (Login e autenticação, Segurança; APIs REST e SQL/NoSQL como
    unidades novas) e no Ofício (Git em equipe, Ler código dos outros,
    TypeScript, Testes automatizados, Variáveis de ambiente, Portfólio).
    Filosofia no topo do `MAPA-CURRICULAR.md`. Arte da ilha IA
    (constelação e farolzinho) no mundo, "em construção".
  - CSS editável (`siteAlvo.css`) e motor de cascata próprio
    (`src/motor/css/`): regras que casam, especificidade, ordem,
    `!important`, inline, herança, atalhos, riscadas e valor vencedor,
    rodando igual no navegador e no jsdom; quando não sabe, não risca.
    Editor com abas HTML e CSS; validadores `valorEfetivo`, `declaracao`,
    `regraExiste`, `riscada`; ações de CSS; Bancada do motor no
    `/lab/fases`.
  - Painel Estilos dentro de Elementos (como no Chrome): ordem das
    regras, riscadas, "Herdado de", edição de nome e valor, setas,
    caixinha, seletor de cor, "+ declaração", regra nova, link para o
    editor CSS, celular em pé e deitado; 6 ferramentas novas com
    apresentação. Abas de cima na ordem do Chrome (Fontes entrou,
    Estilos saiu).
  - Aba Calculado ao lado de Estilos: diagrama do modelo de caixa com
    as medidas reais, camadas acesas na prévia com as cores do Chrome,
    lista das calculadas com filtro, "Mostrar todas" e o rastro de cada
    propriedade.
  - Modo documento (destrava a U6): o documento inteiro no editor e na
    árvore, a aba com o `<title>` ao vivo, simulação honesta dos acentos
    sem meta charset, validador `tituloDaAba`. "Adicionar atributo" pelo
    menu do nó (e toque longo), com a ferramenta `adicionar-atributo`:
    fases futuras podem usar o gesto (as U1 a U5 publicadas não mudam; a
    U4 continua como está).
  - Celular deitado nos painéis novos, testes Playwright de paisagem,
    guia com "Como escrever fases de CSS" e liberações no currículo: U6,
    Estilos (E1 a E4) e Layout (L1 a L4) sem `requerMotor` (E5,
    Responsivo e Publicar continuam pedindo motor).
  - Unidade-modelo E1 "A aba Estilos" (publicada): 3 fases de prática na
    Floricultura Pétala Azul (guiado e sozinho na mesma fase, uma
    previsão por fase) e o desafio no Café Cantinho do Grão, com
    `valorEfetivo` e `declaracao` na prática e as 6 ferramentas do painel
    apresentadas uma a uma. Jornada Playwright pelo mapa nos 3 layouts.
  - Checagem de símbolos que viram emoji colorido no celular
    (`temSimboloSemSeletorDeTexto`, `testar:conteudo`), com o U+FE0E como
    saída, documentada no guia (seção 6).
  - Ajuste de conteúdo: fala da U4 (`sites-elementos-u4-f1`) corrigida
    (não dizia mais que um atributo novo "se escreve na aba Estilos").
  - **Zona Elementos completa (U1 a U6)**: U6 "Página do zero" publicada
    (modo documento, esqueleto HTML, charset, desafio no cartão do Marcos
    Conserta Bikes).
  - **Zona Estilos completa (E1 a E4)**: E2 "Seletores" (tag, classe, id,
    descendente, editor CSS), E3 "Modelo de caixa" (padding, border,
    margin, box-sizing, painel Calculado) e E4 "Por que minha regra não
    pega?" (cascata, ordem, especificidade, herança, `!important`), cada
    uma publicada com desafio em site novo.
  - Desbloqueio permanente de zona/ilha (`src/lib/mapa.ts`): publicar uma
    unidade numa zona anterior não tranca de novo uma zona que um jogador
    já tinha aberto (ou começado) antes dela existir.

- **Rodada 10 (estabilidade, trilhas, temas, profissões, glossário e
  áudio)**:
  - Estabilidade da bateria: causa raiz da instabilidade do celular
    corrigida no motor (a árvore tirava a linha debaixo do dedo no meio do
    duplo toque; balão saindo de cena segurava toques; falas de
    temporizador reabriam o balão; janela medida no meio da animação;
    rolagem suave da prévia sem espera) e no teste (aba "Árvore e
    Estilos" em paisagem); estados explícitos (`data-pronto`,
    `data-apresentacao-estado`, `data-objetivo-atual`, `data-balao`,
    `data-modal-assentado`...), pendências (`src/lib/pendencias.ts`),
    ajudantes por estado, sem `waitForTimeout` de muleta,
    `npm run bateria:repetir` (5 rodadas) e `PARALELO=n`. Resultado: 5
    rodadas seguidas verdes nos três layouts, no build de produção, com
    console limpo (antes, um toque só abria a edição na árvore, por um
    `dblclick` do navegador; corrigido).
  - Camada de trilhas: Web (ativa), Jogos e Automação industrial (em
    construção, ilhas só nomeadas), núcleo comum, tela `/trilhas`, mundo e
    desbloqueio por trilha, progresso compartilhado, "Como integrar uma
    trilha nova" no `PROJETO.md`.
  - Temas: 11 temas com ícone, 62 conceitos e 78 unidades classificados,
    lente no mundo e na ilha (planejadas inclusive) com "Tema: X de Y
    unidades", insígnias com marcos de 25/50/75/100%, painel e
    comemoração.
  - Profissões: Front-end, Back-end, Full-stack, Segurança, Dados e
    DevOps, tela `/profissoes` com progresso ponderado e lente.
  - Glossário vivo: `/glossario` com busca sem acento, onde aprender e
    onde praticar, links para a fase ou para o ponto no mapa, botão no
    mapa e na fase.
  - Áudio: manifesto do que o jogo espera, pré-carga da próxima tela,
    troca de 0,8 s, `insignia` ligado, `docs/AUDIO.md` com o preparo dos
    arquivos (Suno em loop, formatos, LUFS). Os arquivos já estão todos em
    `public/audio` (8 músicas e 11 efeitos); sem eles, tudo funciona em
    silêncio (testado).
  - Decisão: o protótipo `InterativAIPLUS` vira a futura trilha Automação
    industrial, portada depois que a camada de trilhas e a fábrica
    estiverem estáveis.
- **Rodada 11 (zona Layout completa, L1 a L4):**
  - **L1 "Display"** (`sites-layout-u1`): block, inline, inline-block e
    none, com a Fase 3 revisando DIRETO `display: none` contra a
    ferramenta Esconder da U2 (a confusão de leigo pedida na rodada).
    Micro-passos na Papelaria Ponto de Luz, desafio na Oficina Conserta
    Tudo.
  - **L2 "Flexbox"** (`sites-layout-u2`): display: flex, flex-direction,
    justify-content, align-items, gap e flex-wrap. Micro-passos na
    Livraria Página Virada, desafio no Brechó Segunda Chance.
  - **L3 "Grid"** (`sites-layout-u3`): display: grid, colunas e linhas com
    a unidade fr, gap (revisão do flexbox) e grid-template-areas (os
    filhos já vêm com `grid-area` pronto, atacando a confusão "cada filho
    precisa ganhar algo novo"). Micro-passos na Revista Retalhos, desafio
    na Revista Ventania.
  - **L4 "Posição e camadas"** (`sites-layout-u4`, última da zona):
    relative, absolute (ancorado no pai relative), fixed, sticky e
    z-index. Micro-passos na Loja Retrô Vinil, desafio na Confeitaria
    Doce Instante.
  - 21 conceitos novos no catálogo, todos com `temas` (interfaces) desde
    a criação. Nenhuma ferramenta, aba nem tipo de fase novo: a zona toda
    usa o painel Estilos que a Estilos já apresentou.
  - `testes/layout.mjs`: jornada Playwright própria da zona Layout, com o
    progresso das 35 fases de Elementos e Estilos já semeado (não repete
    o que `unidades.mjs` cobre), e o parâmetro `UNIDADE=<id>` (semeia
    também as unidades da Layout anteriores à pedida), para rodar só a
    jornada de uma unidade nova. Registrada em `testes/todos.mjs`.
  - Atritos e o porquê de cada decisão de conteúdo:
    `docs/ATRITOS-FABRICA.md`, "Rodada 4".

- **Rodada 12: motores que fecham a Ilha Sites** (detalhe em
  `docs/PROGRESSO.md`, uma etapa por commit):
  - Testes que leem o currículo (o esperado derivado do currículo e do
    conteúdo registrado, sem "Layout planejada" escrito à mão) e os
    portões lógicos registrados (`logica-decisoes-u2`, a sala "Por baixo
    do capô" e o motor planejado `circuito-logico`).
  - Motor de cascata com variáveis CSS (herança, reserva, encadeadas,
    ciclo) e `@media` avaliada contra uma tela informada (igual no
    navegador e no jsdom); painel Estilos com o valor do `var()`, o link
    até a declaração e o cabeçalho `@media`; `larguraTela` nos
    validadores.
  - E5 com o próprio jogo como site-alvo (tokens reais), "Salvar como Meu
    tema" com aviso de contraste, o Meu tema no seletor e no jogo inteiro,
    a oficina `/meu-tema`; `variavelCss` e `temaSalvo`.
  - Modo dispositivo (botão e Ctrl+Shift+M, modelos, girar, largura livre,
    zoom, iframe com a largura de verdade, simulação dos 980 px sem meta
    viewport); validador `dispositivo`.
  - Painel Lighthouse (14 verificações no motor, notas no anel, problema
    levando à peça com explicação); `notaAuditoria` e `semProblema`.
  - Tipo de fase projeto-ponte, Levar pro mundo (.zip com index.html e
    style.css), guia de publicação em dados com o link validado, Meus
    projetos, a ilha que acende inteira e a P2 "Do jogo pro mundo"
    publicada como unidade-modelo.
  - Guia de conteúdo com as seções novas (12.7 variáveis, 12.8 `@media` e
    `larguraTela`, 15 E5, 16 modo dispositivo, 17 Lighthouse, 18
    projeto-ponte e publicação). Currículo: E5, a zona Responsivo (R1 e
    R2) e a P1 liberadas (sem `requerMotor`), esperando o conteúdo.
  - Bateria completa verde nos três layouts, console limpo.

- **Rodada 13: E5, R1, R2 e P1 — a Ilha Sites fica completa** (detalhe em
  `docs/PROGRESSO.md` e `docs/ATRITOS-FABRICA.md`, "Rodada 5", um commit
  por unidade):
  - **E5 "Variáveis e temas"** (`sites-estilos-u5`, última da zona
    Estilos): variável CSS e `var()`, o alcance de uma variável (no
    `:root` ou numa regra só) e "Salvar como Meu tema", tudo na maquete
    do próprio jogo (`SITE_ALVO_DO_JOGO`). O desafio usa o mesmo
    site-alvo dos micro-passos (decisão registrada no arquivo da fase: a
    meta da unidade É o tema do próprio jogo, não existe "outro site"
    possível aqui).
  - **R1 "Modo dispositivo"** (`sites-responsivo-u1`, abre a zona
    Responsivo): ligar o modo dispositivo, trocar de aparelho, girar, o
    meta viewport e a simulação de 980px sem ele. Desafio: diagnosticar
    três problemas de celular numa academia (site novo). A partir desta
    unidade, `modo-dispositivo` deixou de ser apresentado pela P2 (que
    passou a só revisar).
  - **R2 "Media queries e mobile first"** (`sites-responsivo-u2`, fecha a
    zona Responsivo): a sintaxe de `@media`, breakpoint, imagem
    responsiva e mobile first (`min-width` acrescentando, em vez de
    `max-width` tirando). Desafio: o restaurante do `MAPA-CURRICULAR.md`.
  - **P1 "Acessibilidade e Lighthouse"** (`sites-publicar-u1`, abre a
    zona Publicar, antes da P2 na ordem): a aba Lighthouse de verdade
    pela primeira vez, alt, ordem dos títulos, contraste mínimo (revisa a
    E5) e rótulo acessível. Desafio: uma livraria de nota baixa a
    Acessibilidade 90+. A partir desta unidade, `lighthouse` deixou de
    ser apresentado pela P2. 3 conceitos novos no catálogo entre as
    quatro unidades, todos com temas.
  - **A Ilha Sites fica completa**: as 19 unidades das seis zonas
    (Elementos, Estilos, Layout, Responsivo, Publicar) prontas.
  - Verificado em cada unidade: `testar:conteudo`, TypeScript limpo,
    `/lab/fases` (as fases de prática jogadas de ponta a ponta, console
    limpo), `publicar:conteudo`, build e lint. Sem bateria completa
    (prompt só de conteúdo, os motores não mudaram).
  - **Não feito nesta rodada** (ver "Pendências"): jornadas Playwright
    pelo MAPA (como `layout.mjs`/`publicar.mjs`) para E5, R1, R2 e P1, e
    os três layouts (retrato/paisagem) das fases de desafio.

### Em andamento

(nada no momento)

### Pendências

- **Jornadas de navegador pelo mapa das unidades novas.** E5, R1, R2 e
  P1 foram verificadas por `testar:conteudo` (que reproduz o mesmo motor
  de validação e ações do jogo real) e por fases de prática jogadas de
  ponta a ponta em `/lab/fases` no desktop; faltam as jornadas
  Playwright pelo MAPA (mundo → ilha → fase, como `testes/layout.mjs` e
  `testes/publicar.mjs` fazem) e a cobertura de retrato/paisagem,
  inclusive dos desafios. Ao escrever essas jornadas, seguir o padrão
  dinâmico de `publicar.mjs` (`prontasDaIlha`/`PUBLICADAS` de
  `testes/curriculo.mjs`) em vez de listas de fases hardcoded — evita o
  atrito registrado nas rodadas 4 e 5 do `ATRITOS-FABRICA.md` de toda
  zona nova quebrar o semeado das zonas seguintes.
- **`/lab/fases`, "Aplicar solução do objetivo atual" num desafio:** o
  checklist não recalcula sozinho depois de uma ação sintética sem
  nenhuma interação real de UI entre uma parte e outra (reproduzido
  também num desafio antigo e publicado, U6-F3; não afeta
  `testar:conteudo` nem o jogo real). Detalhe:
  `docs/ATRITOS-FABRICA.md`, "Rodada 5", item 7.

### Próximo (em ordem)

1. Opus: Revisão do dia (ponto fixo no mapa com desafios curtos por
   revisão espaçada).
2. Opus: motor da Lógica (Console, execução de JS, depurador) com o motor
   `circuito-logico` (portões lógicos, `src/curriculo/motores.ts`).
3. Depois: motores das outras ilhas (Origens: linha do tempo, comparador
   de linguagens, diagrama; Páginas vivas; Rede e Servidor; IA ao vivo;
   Ofício), intercalados com conteúdo, e a trilha Automação industrial a
   partir do protótipo `InterativAIPLUS` (ver "Como integrar uma trilha
   nova" no `PROJETO.md`).

## Decisões aprovadas

- A ordem das ilhas segue a progressão, por causa dos pré-requisitos.
  Temas e profissões são lentes sobre o mapa, não uma reorganização.
- Trilhas: o núcleo comum (Origens, Lógica, IA, Ofício) serve pra
  todas; Web, Jogos e Automação têm ilhas próprias.
- Áudio:
  - um tema musical por ilha, mais o mapa e o museu;
  - loops sem emenda audível, carregados só quando necessários, com
    transição suave entre telas;
  - volume de música separado do de efeitos;
  - áudio só depois da primeira interação;
  - sons sintetizados pras micro-interações e arquivos gerados pros
    momentos grandes;
  - Suno Pro (uso comercial ok; guias de terceiros reportam 20 downloads
    por mês).
- Critério final do núcleo: o projeto do Ofício, feito a partir de uma
  página em branco, sem roteiro.
- `InterativAIPLUS` (protótipo em repositório separado): será a trilha
  Automação industrial, portada depois que a camada de trilhas e a
  fábrica estiverem estáveis (rodada 10).
- Temas: 11 (o ponto de partida mais Fundamentos, para as Origens);
  unidade planejada declara temas, pronta os tira dos conceitos.

## Estimativas (grosseiras)

- Núcleo: umas 130 unidades, de 400 a 450 fases, mais de 100 horas com
  os projetos.
- Ilha Sites: 19 unidades, de 8 a 12 horas de jogo.
- Gargalo: o motor de cada ilha (Opus) e o tempo de validação jogando.

# Roadmap

Fonte única de status do projeto: o que foi feito, o que está em
andamento e o que vem depois. **Todo prompt de implementação termina
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

- **Quatro ambientes novos no kit de cenas:** garagem automática,
  cozinha de casa, esquina com semáforo de pedestres e estufa. Entradas
  genéricas instantâneas/gradativas e atores determinísticos, preservando
  os formatos anteriores. Oito dispositivos novos, timer do forno, seis
  peças de cenário, bancada `lab-cenas-novas-u1` com quatro missões e
  cenários alternativos; mostruário nos três temas e 36 capturas para
  revisão no celular em `docs/capturas/cenas-novas/`. Testes de conteúdo,
  jornadas novas nos três layouts, build, lint e bateria de conteúdo
  passaram. Bateria completa executada: 166 jornadas; três falhas iniciais
  resolvidas nos retestes, incluindo ajuste de foco no teste móvel de
  Funções. Detalhe em `docs/PROGRESSO.md`.

- **Zona Algoritmos essenciais completa (U1 a U4):** Buscar (linear e
  binária só em lista ordenada), Ordenar (seleção, bolha e sort numérico),
  Recursão (molduras e caso de parada) e Por que isso trava? (passos e
  crescimento). 13 fases, 12 conceitos com temas e 24 itens de revisão;
  quatro cenas diferentes com o kit existente, desafios em tela composta
  e casos de borda. Binária até 130 passos e vizinhos até 4.500, ambos
  medidos com 1.000 itens. Jornadas nos três layouts, conteúdo, publicação,
  build, lint e bateria de conteúdo em produção verdes.
  Detalhe em `docs/PROGRESSO.md`.

- **Rodada 29: formato contrato e o contrato da Lógica:** o "TCC" de fim de
  ilha como dados (um desafio com o campo `contrato`, em
  `src/motor/contrato/`): briefing do cliente com o documento do pedido,
  requisitos escolhidos entre distrações (com lacunas que se acham no
  documento), checklist ao vivo, mudança de pedido no meio (parte nova ou
  que troca uma antiga, exigindo ajuste real no código), entrega com o
  relatório automático e a reação do cliente, comemoração de fim de ilha e
  o Levar pro mundo (um .js com o programa e os aparelhos de mentirinha,
  que roda no Console de qualquer navegador e no Node; substitui o motor
  `projeto-ponte-js`). O computadorzinho vira colega de trabalho (só
  pergunta) e o tutor ganha o modo contrato. Kit de clientes em SVG (peças
  como dados, cinco expressões, pisca, respira e fala com a boca
  acompanhando o texto; `/lab/clientes`), `variosCenarios` com `porLinha`,
  relógio e campainha no kit de cenas, bancada `lab-contrato-u1` e guia
  (seção 31). Publicado: **"O contrato da padaria"**
  (`logica-programa-de-verdade-u1`, a última unidade da Ilha Lógica): a
  vitrine às seis da manhã e o contrato da Dona Celeste (Padaria Pão de
  Mel), com a luz que passa a apagar sozinha sem ninguém na porta. Correções:
  o Observar e o Console do depurador pausado leem a cena no instante da
  pausa; os testes de conteúdo não carregam mais o currículo dentro do
  limite de 5 s. Detalhe em `docs/PROGRESSO.md`.

- **Rodada 28: motor de cenas programáveis:** área `cena` na tela composta
  (a cena é dado: cenário com o kit, dispositivos com nome de variável,
  linha do tempo), dispositivos como objetos no reino do código,
  `esperar(ms)` no relógio simulado, `while (true)` com esperar terminando
  com a simulação (sem esperar, a proteção de sempre), rastro animado em
  1x/2x/4x sincronizado com a linha do tempo e o palco, ficha do
  dispositivo com "Por dentro", validadores `estadoNaCena`,
  `sequenciaNaCena`, `reagiu` e `variosCenarios`, kit SVG com tokens nos
  três temas, cenas de referência (quarto à noite e vitrine da Padaria Pão
  de Mel), bancada `lab-cenas-u1`, mostruário `/lab/cenas`, guia (seção 30)
  e a regra de ritmo no `testar:conteudo`. Detalhe em `docs/PROGRESSO.md`.

- **Zona Resolvendo problemas completa (U1 a U4):** 12 fases e 14 itens
  de revisão; entendimento e decomposição por agrupar, pseudocódigo,
  dependências com execução dos cartões, plano no código e testes do
  aluno. U4 e desafios em contextos novos usam a tela composta, com
  bordas escondidas e próprias (vazio, zero, repetido e negativo).

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

- **Rodada 14: Revisão do dia e o motor da zona "Ser encontrado"**
  (detalhe em `docs/PROGRESSO.md`, um commit por etapa):
  - Zona opcional no currículo (`opcional: true`: não conta para concluir
    a ilha nem tranca o caminho; plaquinha "Opcional"; vale nas lentes) e
    a zona **Ser encontrado** (S1 a S5) no fim da Ilha Sites, com a
    filosofia no `MAPA-CURRICULAR.md`. Tema novo **Presença digital** (12
    temas). `src/conteudo/plataformas-marketing.ts` (estrutura vazia, com
    data de verificação e "conferido em").
  - **Revisão do dia**: itens declarativos (`src/conteudo/revisao/`,
    mesmas regras dos objetivos no `testar:conteudo`, ids congelados),
    agendador por conceito (1, 3, 7, 21 e 60 dias, testes com relógio
    falso), estado no progresso com migração, sessão em `/revisao` (até 5
    itens, tutor só pergunta, Me ajuda até a dica, "Não lembrei", treino
    livre, resumo com quando volta, "Rever onde aprendi" e a sequência
    sem culpa) e o **Porto da revisão** no mundo. 40 itens-modelo (U1, U2
    e S1).
  - Aba **Busca**: Resultado na busca (título, endereço, descrição, corte
    aproximado, noindex, cartão do negócio no mapa) e Teste de dados
    estruturados (JSON com a linha do erro, LocalBusiness e subtipos).
    Validadores `resultadoBusca`, `indexavel`, `dadosEstruturados`.
  - Aba **Medição** (eventos de `data-evento`, link rastreável com utm,
    visita simulada) e tipo de fase **`simulador-campanha`** (aba
    Campanha: leilão por lance vezes qualidade, dia simulado, página de
    destino decidindo a conversão). Validadores `eventoMedido`,
    `linkRastreavel`, `simulacao`. Demonstração em
    `/lab/fases?fase=lab-motor-u1-f7`. Tudo que é simulação diz isso na
    tela.
  - **S1 "Como o Google acha seu site"** publicada (unidade-modelo da
    zona), jogável pelo mapa. Guia com as seções 19 a 24.
  - Testes de navegador novos nos três layouts: `revisao.mjs`,
    `busca.mjs`, `campanha.mjs`, `ser-encontrado.mjs`.

- **Rodada 15: itens de revisão de U3 a P2 e a `bateria:conteudo`**
  (detalhe em `docs/PROGRESSO.md` e `docs/ATRITOS-FABRICA.md`, "Rodada 6",
  um commit por zona):
  - `npm run bateria:conteudo` (`testes/conteudo-navegador.mjs`): mapa,
    explorar (lentes, trilhas, glossário), publicar (fim da ilha) e
    revisão, só no desktop e resumida; roda uma vez no fim dos prompts só
    de conteúdo (regra no `CLAUDE.md`).
  - **Itens de revisão até a P2**: 87 conceitos, 174 itens (2 por
    conceito, ação e previsão), em mini-sites próprios: Elementos (U3 a U6,
    20 conceitos), Estilos (E1 a E5, 31), Layout (L1 a L4, 22) e
    Responsivo e Publicar (R1, R2, P1 e P2, 14). Com os 40 dos modelos
    (U1, U2 e S1), o registro tem 214 itens, com os ids congelados.
  - `testes/revisao-zonas.mjs [layout] [zona]`: a sessão de revisão com o
    progresso semeado por zona (uma sessão por grupo de 5 conceitos),
    jogada nos três layouts.

- **Rodada 16: a zona "Ser encontrado" (S2 a S5), a checagem de posição e o
  `/lab/revisao`** (detalhe em `docs/PROGRESSO.md` e `docs/ATRITOS-FABRICA.md`,
  "Rodada 7", um commit por unidade):
  - **Etapa 0.** `testar:conteudo` acusa previsões da mesma unidade (ou do
    mesmo conceito, na revisão) com a certa sempre na mesma posição (as 15
    previsões antigas e as da S1 foram giradas; ids e conteúdo intactos).
    Rota `/lab/revisao` (fora da navegação): lista os 258 itens de revisão por
    zona e conceito e abre qualquer um direto (`?item=<id>`), jogado como a
    Revisão do dia, sem mexer no progresso nem no agendamento.
  - **S2 "SEO na página"** (4 fases + desafio Casa de Chá Lótus): h1, texto
    que responde, enchimento de palavra-chave, texto de link, alt, velocidade
    e imagem preguiçosa. **S3 "Seu negócio no mapa"** (4 + desafio Padaria Pão
    de Mel): perfil da empresa, dados iguais, avaliações, JSON-LD e subtipos de
    LocalBusiness. **S4 "Medir quem chega"** (3 + desafio Casa de Sucos
    Vitamina): eventos e conversão (aba Medição), Search Console e Analytics
    como conceitos, links com utm. **S5 "Anúncio pago por dentro"** (4 fases
    do tipo simulador-campanha; a última é o desafio "mesma verba, mais
    clientes", sem meta com antes e depois): leilão, custo por clique,
    palavra-chave, orçamento, página de destino e Índice de qualidade.
    22 conceitos novos (todos com temas, Presença digital em todos) e 44 itens
    de revisão (registro: 258 itens).
  - **Plataformas.** `src/conteudo/plataformas-marketing.ts` preenchido
    (perfil da empresa, schema.org, Search Console e Google Ads), conferido em
    30/09/2026, com `fatos` e `fontes`; regra nova `conferido-em-nas-fases`
    (a unidade que cita a plataforma mostra o "conferido em" e nenhuma fase
    mostra data que o arquivo não tem). A lista de subtipos de LocalBusiness do
    validador (`src/motor/busca.ts`) ganhou os que o ANEXO cita e faltavam
    (FastFoodRestaurant, NailSalon, DaySpa, TattooParlor,
    HomeAndConstructionBusiness, Plumber, Electrician, RoofingContractor,
    HousePainter, AutoWash, AutoDealer, LegalService e RealEstateAgent).
  - **Simulação dita como simulação.** O texto da S5 diz que lance vezes
    qualidade é simplificação e explica o que o Google considera; o Índice de
    qualidade aparece só como diagnóstico. O painel Campanha deixou de afirmar
    que "a posição sai de lance vezes qualidade" sem ressalva.
  - **Testes.** `testes/ser-encontrado-zona.mjs [layout] [unidade]` (tabela em
    `testes/ser-encontrado-passos.mjs`: S2 a S5 pelo mapa nos três layouts) e
    `testes/lab-revisao.mjs`. Bateria de conteúdo verde no fim.

- **Rodada 17: Ilha Lógica, parte A (Console, execução, palco da memória,
  circuito lógico)** (detalhe em `docs/PROGRESSO.md`, um commit por etapa):
  - **Currículo.** Lógica detalhada em 10 zonas e 33 unidades
    (`src/curriculo/curriculo.ts`, `docs/MAPA-CURRICULAR.md`), zonas
    reordenadas (Resolvendo problemas depois de Listas e objetos, Depuração
    antes de Algoritmos). Motores planejados da parte B em
    `src/curriculo/motores.ts`: `ordenar-passos`, `depurador-fontes`,
    `visualizador-arvore`, `projeto-ponte-js`.
  - **Executor** (`src/motor/executor/`): acorn inserindo ganchos no texto
    (linhas preservadas), modo do Console do Chrome (let e const de novo em
    entradas separadas, const protegida), limite de passos e de tempo (loop
    infinito não trava), Math.random e Date reais no jogo e fixos apenas
    nos testes, Web Worker sem
    rede nem página (vm no Node para os testes), formato e erros do Chrome
    com explicação de leigo.
  - **Console e Snippet** fiéis ao Chrome, fase de programa (`programa`,
    `SITE_DO_PROGRAMA`), validadores `valorVariavel`, `respostaDoConsole`,
    `saida`, `semErro`, `erroDoTipo`, `usouSintaxe`, `funcaoPassa`, ações
    `executarNoConsole`, `definirSnippet`, `executarSnippet`, progresso da
    memória, tutor com o código.
  - **Palco da memória e linha do tempo**: caixinhas com nome, let/const,
    tipo e valor; listas e objetos desenhados, referência como seta,
    quadros de função; voltar e avançar a execução passo a passo.
  - **Circuito lógico** (`src/motor/circuito/`, independente da ilha): tipo
    de fase `circuito-logico`, portões E, OU, NÃO (e OU exclusivo), tabela
    verdade, "Ver como código", mouse e toque; validadores `circuitoTabela`
    e `usouPortao`. Demonstrações no `/lab/fases` (`lab-logica-u1-f1` e
    `-f2`).
  - **Unidade-modelo** `logica-primeiros-comandos-u1` "O Console calcula"
    (3 fases + desafio Mercadinho do Seu Zé, meta com mini-palcos antes e
    depois), 8 conceitos, 16 itens de revisão de programa (registro: 274).
    A Ilha Lógica abre depois da Ilha Sites completa; a primeira fase de
    cada unidade segue o mapa (`src/lib/liberacao.ts`). Guia, seção 25.
  - **Testes.** `executor.test.ts`, `programa.test.ts`, `palco.test.ts`,
    `circuito.test.ts`; navegador `console.mjs`, `palco.mjs`,
    `circuito.mjs` e `logica.mjs` (jornada pelo mapa) nos três layouts.

- **Rodada 18: correções antes do conteúdo da Lógica** (detalhe em
  `docs/PROGRESSO.md`, um commit por correção):
  - AGENTS remete às regras integrais do CLAUDE, resume os cuidados do
    projeto e registra o preparo do ambiente.
  - Console: ReferenceError com explicação de leigo antes da primeira
    declaração de let/const; redeclaração em outra entrada como no Chrome.
  - Sorteio e relógio reais no jogo; determinismo explícito só nos testes.
    O guia proíbe validadores dependentes de sorteio ou data específica.
  - Cartão da apresentação ignora toque enquanto se move; regressão em
    retrato e espera do helper preservada.
  - Circuito: pinça, zoom por botões, ajustar à tela e arrastar a câmera;
    alvos de pelo menos 44 px na escala atual, testados com muitos portões.
  - Todas as jornadas respondem previsões pelo `correta` do conteúdo.
    Regra de rodar jornadas das unidades publicadas afetadas no CLAUDE/AGENTS.
  - 8.258 testes de conteúdo, lint, build e bateria completa (67 jornadas
    em produção) verdes.

- **Rodada 19: zona Primeiros comandos completa (U1 a U3)**:
  - Etapa 0: AGENTS e CLAUDE registram `claude/intelligent-pascal-5va93x`
    como branch principal e o formato obrigatório do relatório final.
  - **U2 "Textos"** publicada: aspas e erro real, junção com espaço,
    template, .length, console.log e desafio na floricultura.
  - **U3 "Tipos"** publicada: tipos no palco, typeof (incluindo null),
    coerção, Number/String, comentários e desafio da gorjeta num café.
    Introdução mínima a `=` versus `===`, aprofundada na próxima zona.
  - 11 fases novas, 13 conceitos com temas e 26 itens de revisão
    (300 itens registrados). Guiado/sozinho, previsões, revisa e missões
    de campo no Console real. Meta dos desafios com mini-palcos.
  - Jornadas de U2 e U3 pelo mapa nos três layouts, 9.035 testes,
    publicar:conteudo, build e lint verdes. Bateria de conteúdo em produção
    verde (mapa, explorar, publicar e revisão). Sem mudança no motor.

- **Rodada 20: zona Decisões completa (U1 a U4)**:
  - **U1 "Verdadeiro ou falso"** (6 fases): comparações e booleano, a
    fronteira `>`/`>=`, `===` e `!==`, `=` contra `===` (bug provocado e
    consertado), `==` que converte e desafio do frete grátis.
  - **U2 "Portões lógicos"** (6 fases, a ponte): circuito E, OU e NÃO com
    "Ver como código", depois `&&`, `||` e `!` no Console, a ordem do E e do
    OU na catraca do metrô e desafio da catraca da academia no Console.
    Primeira unidade com fases `circuito-logico` no mapa.
  - **U3 "Se, senão"** (5 fases): if, bloco, else (e o `;` depois do if),
    else if e a ordem, condições com `&&`/`||` e desafio do classificador.
  - **U4 "Verdadeiro disfarçado"** (4 fases): falsos, verdadeiros que
    enganam (`'0'`, `[]`), `!!valor` e desafio do cadastro da academia.
  - 21 fases novas, 20 conceitos com temas e 40 itens de revisão (340
    registrados). Guiado/sozinho na mesma fase, previsões, `revisa` com
    Primeiros comandos, desafios em contexto novo e missões de campo no
    Console real. Sem mudança no motor.
  - Jornadas pelo mapa nos três layouts (`testes/decisoes.mjs`, passos em
    `testes/decisoes-jornadas.json`), 10.316 testes, publicar:conteudo,
    build, lint e `bateria:conteudo` em produção verdes.

- **Rodada 21: zona Repetição completa (U1 a U3)**:
  - **U1 "Enquanto for verdade"**: forno, condição de parada, contador,
    fronteira `<` / `<=`, loop infinito com proteção e conserto; desafio
    da fila de senhas da farmácia.
  - **U2 "for e for...of"**: três partes do for, tabuada, letras de textos,
    primeira apresentação de break com if; desafio das etiquetas da gráfica.
  - **U3 "Contar e somar"**: acumulador, contador condicional, maior/menor
    e média; desafio do caixa da sorveteria. Confusões sobre zerar dentro
    do laço e usar o contador final como quantidade atacadas diretamente.
  - 13 fases, 11 conceitos com temas e 22 itens de revisão (362 no registro).
    Snippet para programas, Console para testes rápidos; palco e linha do
    tempo em todas as fases, guiado/sozinho, previsões, revisa e missões
    de campo no Console real. Sem alteração no motor.
  - 11.051 testes; jornadas pelo mapa nos três layouts, com negativas,
    leitura das caixinhas ao rebobinar e console limpo; publicar:conteudo,
    build, lint e bateria:conteudo em produção verdes. Um commit por unidade.

- **Rodada 22: Ilha Lógica, parte B (motor)**:
  - **Console e pendências da parte A:** o `}` fechado pelo Console passa
    por cima, Enter entre chaves abre o bloco, `usouSintaxe` separa `else`
    de `else-if`, `desafio` aceita circuito (com a ponte circuito/Console)
    e o palco mostra o escopo de bloco (some quando o bloco termina).
  - **Aba Fontes com depurador:** pontos de parada no número da linha e
    `debugger;`, pausa antes da linha com o palco do momento, Retomar,
    Passar por cima, Entrar e Sair com os atalhos do Chrome, painéis
    Escopo, Observar e Pilha de chamadas, valor no hover; no celular,
    barra de controles embaixo e painéis em abas. Validadores
    `pontoDeParada`, `pausouNaLinha`, `observou`, `usouControle`.
  - **Ordenar passos:** tipo de fase `ordenar-passos` com cartões,
    dependências (qualquer ordem válida passa), distrações, agrupar e
    plano de código que roda; mouse e toque.
  - **Estruturas e desempenho no palco:** vagões pelo lado certo, leitura
    e troca acesas, "Ver como árvore" com a ponte para Elementos,
    contador de passos e aba Desempenho com o gráfico passos x tamanho.
    Validadores `passosNoMaximo` e `formaDaEstrutura`.
  - Demonstrações `/lab/fases?fase=lab-logica-u1-f3` a `f9`, guia (seções
    26 a 28), zonas Resolvendo problemas, Depuração e Estruturas de dados
    liberadas (só o `projeto-ponte-js` segue planejado).
  - 12.614 testes unitários, lint, build e a bateria completa no build
    de produção verdes (o arrasto com o dedo do `ordenar.mjs` agora para
    no destino antes de soltar). Conteúdo publicado sem mudança.

- **Rodada 23: tela cheia e zona Funções completa (U1 a U4)**:
  - Botão SVG nos controles gerais do mundo, ilha, fase, revisão e
    glossário, Fullscreen API no documento, estado por fullscreenchange,
    oculto sem suporte; navegação interna preserva a tela cheia, layouts
    e altura visual do teclado com áreas seguras.
  - **U1 Criar e chamar**, **U2 Parâmetros e retorno**, **U3 Escopo** e
    **U4 Arrow functions**: 14 fases, 14 conceitos com tema Lógica e 28
    itens de revisão (390 registrados). Guiado/sozinho, previsões,
    desafios novos, if/for dentro das funções e missões no Console real.
  - Molduras e linha do tempo mostram parâmetros, variáveis locais,
    escopo de bloco e retorno; confusões entre declaração/chamada,
    console.log/return, undefined e arrow com/sem chaves atacadas com
    programas executáveis e negativas. Sem listas e sem depurador.
  - 13.622 testes; jornadas de cada unidade nos três layouts,
    publicar:conteudo, lint, build e bateria:conteudo verdes.

- **Rodada 24: zona Listas e objetos completa (U1 a U4)** — 16 fases,
  17 conceitos com temas Lógica e Dados e 34 itens de revisão. Vagões,
  fichas e setas de referência; map/filter na linha do tempo; cardápio
  e pedidos da Padaria Pão de Mel, desafios em contextos novos e missão
  verificável no Console real. Validação por conteúdo de listas/objetos,
  um commit por unidade e jornadas nos três layouts. Detalhe em
  `docs/arquivo/PROGRESSO-rodada-24.md` e rodada curta no `docs/ATRITOS-FABRICA.md`.

- **Rodada 26: motor de resolução de problemas (tela composta)**:
  - **Composição de áreas:** a prática e o desafio declaram `areas`
    (`plano`, `snippet`, `palco`, `testes`) e o motor monta a tela, sem
    tipo novo de fase. Os tipos publicados seguem com as telas deles (o
    porquê no `PROJETO.md`); nenhuma fase publicada declara áreas.
  - **Plano junto do código:** o quadro de passos (ordenar ou agrupar)
    fica editável o tempo todo; "Levar pro código" escreve o plano como
    comentários numerados no topo do Snippet, sem apagar código, e mexer no
    plano reescreve só esse bloco; tocar num passo acende o comentário
    dele. Validador `planoComentado`.
  - **Casos de teste do aluno:** entrada e saída esperada, rodados contra a
    própria função, com passou/falhou e o que veio; a semente dos testes
    automatizados do Ofício. Validador `casosDoAluno` (minimo, casos de
    borda exigidos, passando). Tutor com plano, código e casos.
  - **Desafio composto:** partes de plano, plano no código, código e
    testes; Rever, meta com antes e depois das áreas e plano, código e
    casos salvos. `/lab/fases?modo=jogo` joga uma bancada como no jogo.
  - Três layouts (coluna do plano, código e palco/testes no computador;
    plano e código lado a lado deitado; abas "Plano | Código | Testes" com
    o palco recolhível em pé), alvos de 44 px e tela cheia. Ferramentas
    `plano-no-codigo` e `casos-de-teste` com apresentação. Demonstração
    `lab-resolver-u1` (prática e desafio, do plano aos testes), guia
    (seção 29), `testes/resolver.mjs` nos três layouts. Detalhe em
    `docs/PROGRESSO.md`.

### Em andamento

- Quatro ambientes concluídos; aguardando revisão visual das capturas
  e do pull request.

### Pendências

- O Levar pro mundo dos contratos exporta apenas o kit anterior: os
  acontecimentos genéricos, atores e novos dispositivos ainda não têm
  exportação autônoma. As quatro demonstrações são fases de laboratório.

- **Contratos (rodada 29), para depois:**
  - Os próximos contratos (Páginas vivas, Rede e Servidor...) pedem o Levar
    pro mundo de cada ilha (o site com interação, o sistema com dados): o
    da Lógica é o .js (`src/motor/contrato/levarProMundo.ts`).
  - Enquanto as zonas Depuração e Estruturas de dados não existem, o
    contrato abre depois de Algoritmos essenciais; a fase 1 da unidade
    apresenta os aparelhos específicos da padaria.
  - No computador, com as cinco áreas, o palco fica baixo entre a cena e os
    casos de teste (o divisor arrasta). Em pé, a cena aberta aperta o
    código; ela recolhe sozinha só com o teclado aberto.
  - O texto do cliente aparece letra por letra (uns 3 s por fala): as
    jornadas do contrato ficam mais longas; "Continuar" no meio completa a
    fala.
  - O tempo de trabalho do relatório conta com a fase aberta na etapa de
    trabalho (salvo de minuto em minuto); uma aba esquecida aberta conta.
  - O relatório não tem "voltar e revisar": depois de tudo marcado, é
    enviar.
- **Cenas programáveis (rodada 28), para depois:**
  - Cada linha do tempo do `variosCenarios` roda o código de novo a cada
    Executar (cada uma com o próprio limite de 1,5 s): use 2 a 4 linhas do
    tempo, com loops de `esperar(100)` ou mais.
  - Com loops curtos e cenas longas, a linha do tempo da execução para nas
    primeiras 1.000 fotos (a cena continua tocando até o fim).
  - `ItemRevisao` não aceita cena (como não aceita áreas compostas): a
    revisão de conceitos de cena fica em previsões.
  - O aviso de cena repetida só aparece na saída do `testar:conteudo`
    (o `/lab/fases` não mostra avisos).
  - A foto da cena na meta de um desafio usa o meio das mudanças que o
    código fez; uma cena com mudanças muito espalhadas pode pedir um
    instante escolhido pelo conteúdo.
  - À noite, o escuro cobre também a janela e a rua; uma janela com luz
    própria (poste, lua mais forte) pede uma peça emissiva nova no kit.

- **Revisão de planejamento (rodada 27):** ItemRevisao não aceita quadro
  nem áreas compostas. Os sete conceitos novos têm duas previsões cada;
  revisão com cartões/casos próprios pede essa capacidade no item.
- **Resumo inicial do PROJETO.md:** ainda descreve duas unidades prontas
  e U3 de Elementos como próxima; atualizar a síntese sem duplicar o
  status consolidado deste ROADMAP.

- **Tela composta (rodada 26), para depois:**
  - Deitado, o código mostra poucas linhas (abas do DevTools, o cabeçalho
    do Snippet, o seletor Snippet | Console e a barra de símbolos ocupam a
    altura); com o teclado aberto, quase nada. É o mesmo aperto das fases
    de programa deitadas; o recado de virar o celular continua valendo.
  - Em pé, o palco começa recolhido; quem quer ver a memória depois de
    Executar precisa abri-lo (talvez um aviso de "a memória mudou" no
    cabeçalho dele).
  - No computador de 1024 x 768, a lista de casos fica baixa embaixo do
    palco (o divisor arrasta); a coluna do plano quebra cartões longos em
    duas linhas.
  - O bloco do plano no código é o cabeçalho e as linhas numeradas logo
    abaixo: um comentário numerado do aluno colado ao bloco é lido como
    parte dele e some quando o plano muda. Só comentários de linha inteira
    contam para `planoComentado`.
  - `casosDoAluno.incluir` casa por argumentos e/ou saída exatos: uma borda
    como "pago igual ao preço" (qualquer valor) precisa ser escrita pela
    saída esperada (`esperado: 0`) ou por argumentos fixos.
  - Os tipos publicados (DevTools, programa, circuito, ponte e
    ordenar-passos) não passaram a usar a composição por baixo: migrá-los
    pede revisar telas e testes publicados, sem ganho para o aluno agora.

- **Lógica, parte B (rodada 22), para depois:**
  - O depurador anda pelo rastro, que guarda até 1.000 fotos da memória:
    num programa mais longo, as pausas depois disso não acontecem. A zona
    Depuração deve usar programas curtos, dentro dessas primeiras 1.000 fotos.
  - O palco ainda não mostra as variáveis declaradas dentro de um `case`
    do `switch` (o escopo de bloco cobre if, for, while e for...of).
  - A troca com variável auxiliar aparece como duas escritas que piscam;
    só a troca numa linha (desestruturação) acende "trocou".
  - No celular, a aba Desempenho fica depois das abas trancadas (Elementos
    e Rede) e pede rolar a barra de abas; as medições do gráfico não são
    salvas no progresso (Medir de novo depois de recarregar).
  - developer.chrome.com está bloqueado pela política de rede do ambiente
    (os fatos do Chrome foram conferidos pela busca); vale reconferir os
    textos de atalhos e painéis quando o acesso for liberado.

- **Zona Decisões (rodada 20), para depois:**
  - Fases de circuito têm 3 chaves e até 3 saídas (8 linhas na tabela): a
    tabela e a bancada em retrato ficam apertadas; revisar o visual com
    jogadores.
  - A jornada de U2 depende do id automático dos portões (`e1`, `ou1`,
    `nao1`), que o motor atribui; se o esquema mudar, ajustar o JSON.

- **Lógica, parte A (rodada 17), para depois:**
  - Numa fase de programa a aba Elementos aparece trancada (não há
    página); talvez escondê-la.
  - No celular, o computadorzinho às vezes cobre parte da barra de
    símbolos do Console.
  - O executor não roda `setTimeout`, `async`/`await` e `fetch` (erro
    "Ainda não roda aqui"): ficam para a Ilha Rede e Servidor.
  - As bancadas do `/lab` usam o conceito "elemento" como marcador; os
    conceitos `snippet-js`, `funcao-js` e `portao-logico` entram com as
    unidades que os ensinam.

- **Tela dos passos das plataformas (rodada 16):** o
  `plataformas-marketing.ts` (perfil da empresa, Search Console, Google Ads,
  schema.org) só é lido pelo `testar:conteudo`; as fases carregam o "conferido
  em" e o caminho geral em falas. Uma tela que liste os passos e fatos (com a
  data) é trabalho de motor.
- **Validador de texto livre (rodada 16):** respostas escritas (h1, texto que
  responde, resposta a avaliação) só conferem "mudou" (`textoDiferenteDoInicial`)
  ou igualdade. Um `textoContem` fecharia a porta de "qualquer coisa vale".
- **Simulador sem antes e depois (rodada 16):** os validadores `simulacao` só
  existem no tipo `simulador-campanha`, então o desafio da S5 não é do tipo
  `desafio` e a unidade não tem meta com antes e depois.
- **Gerador de itens (rodadas 15 e 16):** os 218 itens das duas rodadas
  saíram de scripts locais, fora do repositório; promover um gerador à fábrica
  segue em aberto.
- **Itens de revisão de `salvar-como-meu-tema` e `index-html`:** só
  previsões (o Meu tema só existe na maquete do jogo; o `index.html` não
  tem gesto próprio). Se `ItemRevisao` um dia aceitar o site do jogo,
  ganham uma ação.
- **Bateria completa (rodada 14):** três testes quebrados desde a rodada
  13 foram corrigidos: `publicar.mjs` (a P2 não apresenta mais o modo
  dispositivo e o Lighthouse), `layout.mjs` (o semeado de Elementos e
  Estilos agora vem do `publicados.json`, com a E5) e `explorar.mjs` (12
  temas).
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
- **Revisão do dia, detalhes para depois:** o Porto só aparece na trilha
  Web na posição fixa (trilhas futuras podem querer outro lugar); a
  música da revisão é a do mapa; `Objetivo.conceitos` ainda não é usado
  por nenhuma fase (a ajuda é aproximada pelas estrelas da fase).
- **`/lab/fases`, "Aplicar solução do objetivo atual" num desafio:** o
  checklist não recalcula sozinho depois de uma ação sintética sem
  nenhuma interação real de UI entre uma parte e outra (reproduzido
  também num desafio antigo e publicado, U6-F3; não afeta
  `testar:conteudo` nem o jogo real). Detalhe:
  `docs/ATRITOS-FABRICA.md`, "Rodada 5", item 7.

### Próximo (em ordem)

1. Zona Estruturas de dados; depois, Depuração, já com
   cenas (regra de ritmo: toda unidade nova da Lógica tem pelo menos uma
   fase com cena, diferente das anteriores; guia, seção 30). A Depuração
   pode usar cenas com o depurador (o Observar e o Console pausados leem a
   cena no instante da pausa). Elas ficam antes do contrato no mapa.
2. Opus: Origens (os tipos de atividade do Museu: linha do tempo,
   comparador de linguagens e diagrama).
3. Depois: motores das outras ilhas (Páginas vivas; Rede e Servidor; IA
   ao vivo, que reaproveita a tela composta com a especificação e o código
   gerado; Ofício, com os arquivos do projeto e os testes automatizados),
   intercalados com conteúdo, e a trilha Automação industrial a partir do
   protótipo `InterativAIPLUS` (ver "Como integrar uma trilha nova" no
   `PROJETO.md`; o "Por dentro" das cenas já aponta para ela).

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

# Progresso

Checklist das etapas (Ilha Sites › Zona Elementos). Cada etapa termina com
`npm run build`, `npm run lint` e (a partir da Etapa 15)
`npm run testar:conteudo` passando e um commit.

**Estado atual:** rodada 12 em andamento (ver a seção dela). Antes:
rodada 11 concluída (zona Layout completa: L1 a L4; ver
a seção dela e o `docs/ROADMAP.md`). Antes: rodada 10 concluída
(estabilidade da bateria, trilhas, temas, profissões, glossário e áudio).
Antes: rodada 9 concluída (painel Estilos, motor de cascata,
modo documento, ROADMAP e, nas etapas finais, U6 e a zona Estilos
inteira; ver a seção dela abaixo e o `docs/ROADMAP.md`, que é a fonte do
status). A Ilha Sites tem as zonas Elementos (U1 a U6), Estilos (E1 a E4)
e Layout (L1 a L4) completas; só faltam E5 (requer motor), Responsivo e
Publicar. Antes: rodada 8 (áudio v2: música do mapa e efeitos
gravados) concluída; antes dela, a rodada 7 (sistema de áudio) e a
rodada 6 — Unidades 3, 4 e 5 da zona
Elementos produzidas (Títulos e textos, Links/imagens/id/class, Caixas e
seções). Próximo passo: a Revisão do dia (ponto fixo no mapa com desafios
curtos por revisão espaçada).

## Rodada 12: motores que fecham a Ilha Sites

Variáveis CSS e `@media` no motor, E5 (o jogo como site-alvo), modo
dispositivo, Lighthouse, projeto-ponte e a P2. Status resumido em
`docs/ROADMAP.md`.

- [x] **Etapa 1: testes que leem o currículo e os portões lógicos.**
  - Testes com o estado do currículo escrito à mão agora derivam o
    esperado: `curriculo.test.ts` (status de toda unidade do currículo
    contra `UNIDADES`, zona e ilha de cada unidade pronta, "zona com
    `requerMotor` só tem planejadas"; as sabotagens usam um currículo de
    mentirinha em vez de "a Responsivo ainda pede motor"), `mapa.test.ts`
    (a Lógica abre só com todas as prontas de Sites concluídas, testado
    prefixo a prefixo; os estados da Estilos calculados da lista de
    prontas) e, nos testes de navegador, `testes/curriculo.mjs` (lê o
    currículo transpilado e o `publicados.json`): `mapa.mjs` confere a
    primeira pronta de Sites disponível, as outras prontas bloqueadas, as
    planejadas planejadas, a primeira ilha em construção da rota (placas,
    tudo planejado, card "Em breve") e o museu com as salas do currículo;
    `unidades.mjs` conta as prontas de Sites; `explorar.mjs` acha a
    planejada com o tema.
  - Portões lógicos registrados: `logica-decisoes-u2` "Portões lógicos"
    (depois do if/else, antes do `&&`, `||` e `!` no código), a sala
    "Por baixo do capô" (`origens-museu-u6`) com o somador e a memória com
    realimentação, e o motor planejado `circuito-logico` em
    `src/curriculo/motores.ts` (peças, onde é usado, trilhas Web e
    Automação), com a checagem `motores-planejados` no `testar:conteudo`
    e sabotagens. `MAPA-CURRICULAR.md` com a seção "Motores planejados";
    no `ROADMAP.md`, o motor entra junto com o da Lógica.

- [x] **Etapa 2: variáveis CSS e `@media` no motor e no painel.**
  - Media queries (`src/motor/css/midia.ts`): o motor não usa mais o
    `matchMedia` do navegador; avalia a condição contra uma tela
    informada (`OpcoesCascata.tela`), então navegador e jsdom chegam à
    mesma resposta. Sabe `min-width`, `max-width`, `width`, as de altura,
    px, em e rem (16 px, a fonte inicial, como nas media queries de
    verdade), `orientation`, `and`, `or`, `not`, `only`, tipos `all`,
    `screen` e `print`, listas com vírgula e a sintaxe de intervalo
    (`(400px <= width < 800px)`). O que ele não sabe avaliar
    (`prefers-color-scheme`, `hover`, `vw`...) NÃO SE APLICA (decisão
    registrada em teste). Sem tela informada, vale a da janela do
    documento (a prévia de verdade) ou, num documento solto, a padrão
    1280 x 800 (o Notebook 1280 do modo dispositivo). O conteúdo publicado
    não mudou (o `testar:conteudo` passou igual: os `@media` dos heads
    eram "incertos" no jsdom e agora ficam de fora em 1280 px).
  - Variáveis: `--nome` herdadas, `var(--nome, reserva)` encadeadas, com
    proteção contra ciclo (as variáveis do ciclo ficam inválidas, como na
    especificação), variável que não existe usando a reserva e, sem
    reserva, a propriedade "inválida na hora de calcular" voltando ao
    herdado ou ao inicial; atalho com `var()` troca as variáveis antes de
    separar as partes. `ValorEfetivo` ganhou o caso `invalido`.
  - Painel Estilos, conferido no devtools-frontend
    (`VariableRenderer`, `StylePropertiesSection.createMediaElement`): as
    variáveis aparecem nas regras onde são declaradas (e no "Herdado
    de"); o `var(` desenha o nome como link (apagado se não existe), o
    valor aparece no `title` e ao lado (no toque não há hover), a amostra
    de cor usa o valor resolvido e o clique no nome leva até a declaração
    (pisca por 1,6 s, como pendência); a regra de `@media` tem o cabeçalho
    `@media (...)` numa linha acima do seletor (clicável até o editor CSS)
    e só aparece quando vale na largura atual da prévia.
  - Validadores: `larguraTela` (e `alturaTela`) opcionais em
    `valorEfetivo` e `riscada`; `ContextoValidacao.tela` para o jogo
    passar a tela da prévia. Os modelos do modo dispositivo ficam em
    `src/motor/dispositivos.ts` (`telaDaLargura`).
  - Bancada de variáveis e `@media` (`lab-motor-u1-f3`) e o teste de
    navegador `testes/variaveis.mjs` (desktop e retrato), na bateria.
    Testes unitários em `cascata.test.ts` (herança, encadeadas, reserva,
    ciclo, atalho, painel; limites exatos, unidades, orientação, listas,
    intervalo e condições desconhecidas).

- [x] **Etapa 3: E5, o próprio jogo como site-alvo, e o Meu tema.**
  - `siteAlvo.tipo: "jogo"` e o objeto pronto `SITE_ALVO_DO_JOGO`
    (`src/motor/siteDoJogo.ts`): uma maquete do jogo (barra superior com
    estrelas, um pedaço do mapa com a rota, o painel com a árvore, o
    computadorzinho e dois botões) cujo head desenha tudo com
    `var(--cor-*)`, sem nenhuma cor literal (há teste). A folha editável é
    um `:root` com os tokens reais do tema aberto, em grupos comentados,
    montada quando a fase abre (`materializarFase`): no jogo, com o tema
    do jogador (o Meu tema, se for ele); nos testes, com o Doce.
  - Tokens reais sem copiar cor nenhuma (`src/tema/tokensDoJogo.ts`): no
    navegador, lidos das folhas da página (a regra `[data-theme=...]` do
    tokens.css compilado); no Vitest, do arquivo tokens.css, pelo preparo
    `testes/conteudo/preparar.ts` (também no `publicar:conteudo`).
  - Painel Estilos: as regras "Herdado de" agora se editam, como no
    Chrome (a edição guarda o elemento dono), então as variáveis do
    `:root` mudam pelo painel com qualquer peça selecionada; Tab anda só
    entre as declarações que aparecem.
  - "Salvar como Meu tema" (botão na barra de endereço da prévia,
    ferramenta `salvar-tema` com apresentação, card e o link "Abrir a
    oficina do Meu tema"): lê cada token no `:root` com as variáveis
    resolvidas, cobre o tema de base e confere o contraste dos 7 pares
    principais (texto e fundo, cartões, painel, texto suave, texto nos
    três botões; WCAG 2, `src/lib/contraste.ts`). Abaixo de 4,5:1, o
    computadorzinho lista os pares e deixa salvar mesmo assim
    (`AvisoContraste`). Salvo, o tema `meu` entra no progresso
    (`meuTema`: cores limpas, só `--cor-*` com valor de cor seguro, base e
    claro ou escuro), aparece no seletor e vale no jogo inteiro: um
    `<style id="estilo-meu-tema">` posto pelo script de antes da pintura
    (sem piscar ao recarregar) e mantido pelo `EstiloMeuTema`. Os três
    temas do jogo passam nos 7 pares (teste).
  - Oficina `/meu-tema`: a mesma maquete, um seletor de cor e o valor em
    texto por variável, o contraste ao vivo, salvar (com o mesmo aviso),
    desfazer as mudanças e apagar (volta ao tema de base).
  - Evento `temaSalvo`, validadores `{ tipo: "temaSalvo" }` (trava no
    checklist, como `evento`) e `{ tipo: "variavelCss"; nome; valor?;
    seletor?; diferenteDoInicial? }` (o valor de partida depende do tema
    do jogador, então "troque por uma cor qualquer" usa
    `diferenteDoInicial`), ação `salvarTema` e a checagem `site-do-jogo`
    (temaSalvo e salvarTema só no site do jogo, que vem sem css).
  - Bancada do tema (`lab-motor-u1-f4`), `testes/conteudo/meuTema.test.ts`
    e `testes/tema.mjs` (desktop e retrato), na bateria.

- [x] **Etapa 4: modo dispositivo (destrava a zona Responsivo).**
  - Conferido no devtools-frontend: a ação "Toggle device toolbar"
    (`emulation-meta.ts`, Shift+Ctrl+M; Shift+Cmd+M no Mac), a barra
    (`DeviceModeToolbar`: aparelhos, largura e altura, zoom, girar) e o
    ajuste do zoom para caber (`DeviceModeModel`, "auto-adjust scale").
  - Botão na barra do painel, ao lado da setinha, e Ctrl+Shift+M (Cmd no
    Mac), só nas fases com a ferramenta `modo-dispositivo` (as publicadas
    não mudam). A barra sobre a prévia: aparelho (Celular 360, Celular
    390, Tablet 768, Notebook 1280 ou Livre), largura (campo no desktop) e
    altura, girar (`girar-dispositivo`) e o zoom quando o aparelho não
    cabe. No celular, tudo numa linha (seletor compacto, medida em texto,
    girar e zoom).
  - O iframe ganha a largura de desenho de verdade (as `@media` reagem de
    verdade) e é encolhido para caber, sempre o MESMO iframe (ligar não
    recarrega a página). Alças dos dois lados mudam a largura (o aparelho
    fica no meio: a largura muda o dobro do arrasto) e viram "Livre". A
    setinha converte o ponto da tela pelo zoom (`CamadaInspecao`).
  - Meta viewport, simulação honesta: num celular, página sem
    `<meta name="viewport">` é desenhada em 980 px e encolhida para a
    largura do aparelho (a regra dos navegadores de celular), com o aviso
    "simulação" na prévia e uma fala do computadorzinho (uma vez, quando
    não atrapalha), no mesmo padrão dos acentos sem meta charset.
    Apagar ou pôr o meta (árvore, editor, desfazer) liga e desliga na hora.
  - Painel Estilos, Calculado e validadores usam a tela do aparelho (a
    largura de desenho): `ContextoValidacao.tela` e `.dispositivo`, lidos
    na hora do evento. O Calculado mede de novo quando a prévia muda de
    tamanho (`aoRedimensionar`, um ResizeObserver no iframe).
  - Estado puro em `src/motor/dispositivos.ts` (modelos, girar, livre,
    980 px, zoom, tela das `@media`). Eventos `trocouDispositivo` e
    `girou`; validador `{ tipo: "dispositivo"; largura?; orientacao? }`;
    ações `trocarDispositivo`, `girarDispositivo` e
    `desligarDispositivo`; checagem `ferramentas-dos-validadores` (o
    validador dispositivo pede a ferramenta). Ferramentas novas com
    apresentação e card: `modo-dispositivo` e `girar-dispositivo` (a
    apresentação do girar liga a barra em silêncio, para o botão existir).
  - A Bancada de variáveis ganhou dois objetivos (Celular 390 e girar,
    com a `@media` deixando de valer deitado) e a do documento, a
    ferramenta. Testes: `testes/conteudo/dispositivo.test.ts` e
    `testes/dispositivo.mjs` (três layouts), na bateria.

- [x] **Etapa 5: painel Lighthouse (auditoria simplificada).**
  - Conferido no Lighthouse de verdade (`core/config/default-config.js`:
    categorias e pesos; `shared/util.js`: faixas 0,9 e 0,5) e no
    devtools-frontend (a aba e o "Analyze page state", que confere a
    página como ela está). Aba de cima nova, "Lighthouse" (a última, como
    no Chrome depois de Application), liberada só nas fases com a
    ferramenta `lighthouse` (nas outras, trancada como Console e Rede).
  - `src/motor/auditoria.ts`: 14 verificações em cima do DOM e do motor
    de cascata (sem layout, iguais no navegador e no jsdom): imagem sem
    alt, contraste (as cores resolvidas pelo motor: variáveis, herança,
    o primeiro fundo opaco dos ancestrais, texto grande pedindo 3:1, fundo
    com imagem ou gradiente fica de fora como no Lighthouse, e as `@media`
    na tela do aparelho), títulos pulando nível, link e botão sem texto
    (texto, aria-label, title, alt de imagem dentro), html sem lang,
    página sem title, sem main, sem meta viewport, id duplicado, sem
    doctype, sem charset, sem descrição e link "clique aqui". O que está
    escondido (display none, hidden, aria-hidden) não conta. Nota de 0 a
    100 por categoria (Acessibilidade, Boas práticas e SEO básico): a
    média pesada das que se aplicam, com os pesos do Lighthouse (viewport
    e id duplicado em Boas práticas com peso 3, simplificação anotada no
    arquivo). Leitor de valores que reaproveita a cascata
    (`leitorDeValores`).
  - `PainelLighthouse`: aviso de versão simplificada, Analisar (Analisar
    de novo), o anel de cada categoria (`AnelNota`, cores das faixas pelos
    tokens de sucesso, alerta e erro), os problemas por categoria (por que
    importa em linguagem de leigo, como consertar, o nome da verificação
    no Lighthouse de verdade e as peças com o detalhe, como "1,6:1, o
    mínimo aqui é 4,5:1") e as aprovadas. A peça leva à aba Elementos com
    ela selecionada na árvore, e o computadorzinho explica (quando a
    conversa está livre). A análise avisa quando ficou velha (a página, o
    CSS ou a tela mudou).
  - Validadores `{ tipo: "notaAuditoria"; categoria; minimo }` e
    `{ tipo: "semProblema"; regra }` (calculam na hora, sem precisar
    clicar em Analisar), evento `auditou`, ação `analisarAuditoria`,
    ferramenta `lighthouse` com apresentação e card; a checagem
    `ferramentas-dos-validadores` pede a ferramenta e nota de 0 a 100.
  - Bancada do Lighthouse (`lab-motor-u1-f5`, modo documento, um problema
    de cada tipo). Testes: `testes/conteudo/auditoria.test.ts` e
    `testes/lighthouse.mjs` (três layouts), na bateria.

- [x] **Etapa 6: projeto-ponte, Levar pro mundo, guia de publicação,
  Meus projetos e a P2.**
  - Tipo de fase `projeto-ponte` (`FaseProjetoPonte`: `requisitos`,
    `nomeDoProjeto`, sempre em `modoDocumento`): o checklist do desafio
    generalizado (`itensDoChecklist`, `recalcularPartesFeitas` para partes
    e requisitos; itens de estado conferidos ao vivo, os de evento
    travam), sem Rever: o "Me faz uma pergunta" só pergunta (uma pergunta
    de cada requisito que falta, em rodízio) e o tutor ganhou o modo
    `projeto` (só perguntas, no prompt e no contexto do servidor). Rótulos
    "Projeto", "Requisitos do projeto" e "Projeto pronto!" (barra,
    conclusão, lista de fases, glossário: `rotuloDaFase`).
  - Validadores novos para requisitos: `temMediaQuery` (conta `@media`
    nas folhas da página, não nas do navegador) e `cabeNaTela` (sem meta
    viewport num celular, largura ou min-width em px maior que a tela e
    colunas de grid em px somando mais que ela, avaliados pelo motor na
    largura pedida, com a `@media` valendo).
  - Levar pro mundo (ferramenta `levar-pro-mundo`, com apresentação, card
    e o link para Meus projetos): botão na barra de endereço da prévia,
    uma janela com os dois arquivos (index.html, a página; style.css, a
    aba estilo.css) e o aviso da linha `<link rel="stylesheet"
    href="style.css">` posta no fim do head quando o jogador ainda não
    escreveu; "Baixar .zip" com o fflate 0.8.3 (MIT, mantido, roda no
    navegador e no Node; `zipSync`), os dois arquivos na raiz, o nome do
    .zip vindo do nome do projeto. Evento `exportouProjeto`, ação
    `levarProMundo` (na simulação, monta os arquivos de verdade sem
    baixar). A prévia do modo documento ganhou um `<base href="about:blank">`
    do jogo (escondido da árvore e do código) para o `<link>` e as imagens
    relativas não virarem pedidos ao servidor do jogo.
  - Guia de publicação: dados em `src/conteudo/publicacao.ts` (Netlify
    Drop, 6 passos com id estável, `verificadoEm` 2026-09-28, aviso de que
    as plataformas mudam, outras opções), janela com os passos marcáveis
    e o campo do link (só o formato: https:// e domínio com ponto;
    `linkPublicadoValido`), tudo guardado por projeto.
  - Meus projetos (`/projetos`, link na barra do mapa e no menu do
    celular): o cartão "Meu primeiro site" com a miniatura, a situação
    (trancado, novo, em andamento, pronto), Abrir e editar, Levar pro
    mundo, o guia e o link publicado. Progresso: `projetos` (o site
    copiado a cada mudança, sobrevive ao "Jogar de novo" da ilha; o
    Recomeçar da fase zera o site e mantém guia e link) e
    `ilhasComemoradas`.
  - A ilha acende: com todas as unidades prontas concluídas, a ilha
    ganha a borda acesa, o computadorzinho comemora uma vez ("Ilha Sites
    completa!", com o caminho para Meus projetos) e, no mundo, a ilha
    mostra "Completa!" com um anel aceso.
  - Unidade-modelo P2 "Do jogo pro mundo" (`sites-publicar-u2`), com
    comentários pedagógicos: Fase 1 "Arquivos de verdade" (o Cantinho da
    Bia: conferir no Celular 390, Analisar no Lighthouse, previsão do
    `<link>` e o .zip; sozinho: mudar a cor e levar de novo) e Fase 2
    "Meu primeiro site" (projeto-ponte com 6 requisitos: título da aba,
    header/main/footer, h2 e parágrafo sobre você, uma `@media`,
    Acessibilidade 90+ depois de Analisar e nada cortado no Celular 390
    com o aparelho ligado). Conceitos novos: `modo-dispositivo`,
    `auditoria-lighthouse`, `css-externo`, `index-html`, `publicar-site`.
    Como R1 e P1 ainda não existem, a Fase 1 apresenta o modo dispositivo
    e o Lighthouse (nota no arquivo para quem escrever R1 e P1). A zona
    Publicar perdeu o `requerMotor`; a P2 foi publicada
    (`publicados.json`).
  - Checagens: `projeto-e-levar-pro-mundo` (projeto em modo documento com
    levar-pro-mundo e nome; Levar pro mundo só com modo documento e
    style.css), projeto não apresenta ferramenta, pratica só o que foi
    ensinado antes, limites da descrição e da pergunta dos requisitos.
  - Testes: `testes/conteudo/projeto.test.ts` (arquivos e .zip aberto
    pelo fflate, nome do .zip, guia e link, `temMediaQuery`, `cabeNaTela`,
    o checklist marcando cada requisito na hora, progresso e sabotagens) e
    `testes/publicar.mjs` (a P2 jogada pelo mapa nos três layouts, o .zip
    baixado e aberto, a ilha acendendo, Meus projetos), na bateria.

- [x] **Etapa 7: mobile e paisagem, guia, liberações e bateria.**
  - Mobile e paisagem dos recursos novos cobertos pelas jornadas nos três
    layouts (`dispositivo`, `lighthouse`, `tema`, `variaveis`,
    `publicar`): botões de 44 px no toque, a barra de dispositivo numa
    linha, o Levar pro mundo só com o ícone na barra compacta, as janelas
    (Levar pro mundo, guia) e Meus projetos sem rolagem de lado.
  - Barra do mapa: com o link Meus projetos, os rótulos dos links
    (Trilha, Profissões, Glossário, Insígnias, Meus projetos) passaram a
    aparecer só a partir de 1440 px; abaixo, só os ícones (com o nome no
    `aria-label`). Antes, de 1024 a 1439 px, as telas com "Voltar"
    (glossário, Meu tema, Meus projetos) rolavam de lado.
  - Guia de conteúdo: a regra "nada de `@media` na folha editável" caiu;
    seções novas 12.7 (variáveis CSS), 12.8 (`@media` e `larguraTela`),
    15 (E5 e o site do jogo), 16 (modo dispositivo), 17 (Lighthouse) e 18
    (projeto-ponte e publicação), com os validadores, eventos e ações
    novos nas tabelas 3.4 e 3.5.
  - Currículo: E5 e a zona Responsivo sem `requerMotor` (a zona Publicar
    já tinha saído na etapa 6), então E5, R1, R2 e P1 aparecem como
    planejadas, esperando o conteúdo.
  - ROADMAP: tudo desta rodada em Feito; Próximo na ordem pedida (Sonnet:
    E5, R1, R2 e P1; Opus: Revisão do dia; Opus: motor da Lógica com o
    circuito-logico).
  - Falha intermitente achada na primeira bateria (só sob carga):
    `ferramentas-novas.mjs` tocava a árvore no "Experimente" da trilha e
    o toque caía no véu. Causa: as áreas extras liberadas no Experimente
    (a árvore, na trilha) só são medidas no quadro seguinte à troca de
    passo, então por um instante o véu ainda não tinha o buraco. A camada
    da apresentação agora diz `data-alvo-livre="sim"` quando os buracos
    estão medidos, e `passarApresentacao` espera por ele (documentado em
    `testes/README.md`).
  - `tema.mjs` e `variaveis.mjs` também em paisagem.
  - Bateria completa (`PARALELO=2 npm run bateria`, 42 execuções) verde
    nos três layouts, com build de produção e console limpo;
    `testar:conteudo` com 1425 testes verdes.

## Rodada 11: zona Layout completa (L1 a L4)

Produção das quatro unidades da zona Layout (motor pronto desde a rodada
9; nenhuma ferramenta, aba nem tipo de fase novo foi preciso — tudo usa o
painel Estilos que a zona Estilos já apresentou). Detalhe dos atritos
encontrados: `docs/ATRITOS-FABRICA.md`, "Rodada 4".

- [x] **L1, "Display"** (`sites-layout-u1`): block, inline, inline-block e
  none, na Papelaria Ponto de Luz (micro-passos) e no desafio na Oficina
  Conserta Tudo. A Fase 3 revisa DIRETO `display: none` contra a
  ferramenta Esconder da U2 (`visibility: hidden`, mantém o espaço), a
  confusão de leigo pedida nesta rodada.
- [x] **L2, "Flexbox"** (`sites-layout-u2`): display: flex, flex-direction,
  justify-content, align-items, gap e flex-wrap, na Livraria Página
  Virada e no desafio no Brechó Segunda Chance.
- [x] **L3, "Grid"** (`sites-layout-u3`): display: grid, colunas e linhas
  com a unidade fr, gap (revisão do flexbox) e grid-template-areas, na
  Revista Retalhos e no desafio na Revista Ventania. Os filhos com
  `grid-area` já vêm prontos na folha inicial: o jogador só desenha o
  mapa no container, atacando a confusão "cada filho precisa ganhar algo
  novo" (não precisa).
- [x] **L4, "Posição e camadas"** (`sites-layout-u4`): relative (desliza
  sem sair do fluxo), absolute (ancorado no pai relative mais próximo),
  fixed, sticky e z-index, na Loja Retrô Vinil e no desafio na
  Confeitaria Doce Instante.
- [x] **Conceitos novos** (`src/conteudo/conceitos.ts`, tema `interfaces`
  em todos): 5 de display, 6 de flexbox, 4 de grid, 6 de posição — todos
  com `temas` desde a criação (seção 9.1 do guia).
- [x] **Ferramenta de teste isolada por zona:** `testes/layout.mjs`
  (jornada própria da Layout, com o progresso das 35 fases de Elementos e
  Estilos já semeado, para não repetir o que `unidades.mjs` já cobre) e o
  parâmetro `UNIDADE=<id>`, que semeia também as unidades da Layout
  anteriores à pedida — permite rodar só a jornada de uma unidade nova
  (`UNIDADE=sites-layout-u2 node testes/layout.mjs`), sem jogar as
  anteriores. Registrada em `testes/todos.mjs` e no `testes/README.md`.
- [x] Testes velhos atualizados para as unidades novas: `curriculo.test.ts`
  (zonas das `UNIDADES`, status pronta/planejada), `mapa.test.ts` (cadeia
  de desbloqueio da Lógica, agora esperando L1 a L4 concluídas) e o
  contador "Sites com X de Y unidades" em `unidades.mjs`.
- [x] `npm run testar:conteudo`, `npm run lint`, `npm run build` e
  `PARALELO=2 npm run bateria` (uma rodada completa, três layouts) verdes,
  console limpo. `npm run publicar:conteudo` rodado (a L1 na hora, L2 a
  L4 juntas no fim da zona).

## Rodada 10: estabilidade, trilhas, temas, profissões, glossário e áudio

Status resumido em `docs/ROADMAP.md`.

- [x] **Etapa 1: estabilidade da bateria.** Causa raiz da instabilidade do
  celular (detalhe em `docs/ATRITOS-FABRICA.md`, "Rodada 3, resolvido"):
  a árvore rolava o item selecionado inteiro (linha mais a barra de ações)
  e tirava a linha debaixo do dedo no meio do duplo toque (agora rola a
  linha na hora e o item inteiro 400 ms depois, fora da janela do duplo
  toque); o fundo do balão saindo de cena segurava toques (`FundoBalao`);
  falas vindas de temporizadores reabriam o balão entre um passo e outro;
  deitado, o balão fechava sozinho no meio de uma leitura; e, em
  paisagem com o painel Estilos, o teste procurava a aba "Árvore", que ali
  se chama "Árvore e Estilos" (a falha da E2, determinística). Motor: todo
  temporizador que muda a tela sozinho virou pendência
  (`src/lib/pendencias.ts`: roteiros, validação, espera do editor, do CSS
  e do cursor, recarga da prévia, animação do balão, troca de texto da
  fala, comemoração da apresentação, rolagem da árvore); estados explícitos na raiz da fase
  (`data-pronto`, `data-apresentacao-estado`, `data-objetivo-atual`,
  `data-etapa`, `data-roteiro`), `data-balao` no avatar e
  `data-passo-apresentacao` na apresentação. Testes: ajudantes por estado
  em `testes/util.mjs` (`esperarPronto`, `abrirBalao`, `fecharBalao`,
  `passarApresentacao`, `doisQuadros`), os `waitForTimeout` que eram
  muleta saíram de todos os testes de fase, duplo toque direto na tela, o
  `mostrarPainel` acusa troca de segmento com apresentação de pé, `mapa.mjs`
  corrigido (a U6 foi publicada; agora confere a L1 planejada),
  `todos.mjs` lista quais falharam e `npm run bateria:repetir`
  (`testes/repetir.mjs`, 5 rodadas). Guia (seção 11) e `testes/README.md`
  com a regra "espere estados, nunca tempos".

- [x] **Etapa 2: camada de trilhas.** `Trilha` em `src/curriculo/trilhas.ts`
  (Web ativa; Jogos e Automação industrial em construção, com as ilhas
  próprias só nomeadas em `ILHAS_FUTURAS`), `NUCLEO_COMUM` (Origens,
  Lógica, IA, Ofício) em todas. O mundo desenha as ilhas da trilha
  escolhida na ordem dela (`progresso.trilha`, padrão `web`), e o
  desbloqueio segue a rota da trilha (`ilhaAnterior(ilha, fonte)`); o
  progresso é da ilha, então vale em todas. Tela `/trilhas` com card por
  trilha (descrição, ilhas, progresso contando as planejadas, estado,
  Escolher), link na barra do mapa (no celular, no menu), ilha só nomeada
  com a tela "ainda é só um terreno" e arte `ArteFutura`. Checagem
  `trilhas` no `testar:conteudo` (`conferirTrilhas`) e
  `testes/conteudo/trilhas.test.ts` (dados, sabotagens, rota por trilha,
  progresso compartilhado). `PROJETO.md` com "Trilhas" e "Como integrar
  uma trilha nova" (o tipo de fase `bancada-eletrica` como exemplo);
  `MAPA-CURRICULAR.md` com as trilhas e o `InterativAIPLUS`. Estabilidade:
  a bateria desta etapa achou mais uma corrida (a meta medida no meio da
  animação de entrada); o `Modal` agora marca `data-modal-assentado`.

- [x] **Etapa 3: temas, lente e insígnias.** Catálogo de 11 temas
  (`src/curriculo/temas.ts`; o ponto de partida mais Fundamentos, decisão
  no `PROJETO.md`) com ícone SVG por tema (`IconeTema`). Os 62 conceitos
  classificados (`temas` no catálogo) e as 78 unidades do currículo com
  `temas` declarados; nas prontas, os temas vêm dos conceitos ensinados e
  praticados (`temasDerivados`), e a checagem `temas` confere que os
  declarados estão contidos neles. Lente no mapa (`BarraLentes`,
  `progresso.lente`): acende as unidades do tema em todas as ilhas da
  trilha (no mundo, contagem por ilha e as sem nenhuma apagadas; na ilha,
  anel ou ponto apagado, planejadas inclusive) e mostra "Tema: X de Y
  unidades" contando as planejadas. Card da unidade com os temas.
  Insígnias SVG com anel e marcos de 25, 50, 75 e 100% (`Insignia`),
  painel "Insígnias" na barra do mapa e comemoração curta a cada marco
  novo (`ComemoracaoInsignia`, som `insignia`, `progresso.marcosInsignias`).
  Testes: `testes/conteudo/temas.test.ts`. Guia com a seção 9.1 "Temas e
  conceitos".

- [x] **Etapa 4: profissões e lente.** `src/curriculo/profissoes.ts`:
  Front-end, Back-end, Full-stack, Segurança, Dados e DevOps, cada uma com
  "O que faz" e "Um dia de trabalho" para leigo (honestos, com o lado
  chato) e temas com peso de 1 a 3. Progresso no caminho = média do
  progresso dos temas na trilha, ponderada pelos pesos, contando as
  planejadas (`progressoDaProfissao`). Tela `/profissoes` (card com o que
  faz, um dia, temas com o peso em pontinhos, barra do caminho) e "Acender
  no mapa", que vira lente igual à de tema (`lente: { tipo: "profissao" }`;
  a barra mostra "DevOps: 12% do caminho"). Checagem `profissoes` no
  `testar:conteudo` e `testes/conteudo/profissoes.test.ts`.

- [x] **Etapa 5: glossário vivo.** Rota `/glossario` com botão
  "Glossário" na barra do mapa e dentro da fase (barra do desktop e menu
  do celular; fora do lab e da revisão), e "Voltar" de volta para onde
  estava. `src/lib/glossario.ts` em cima do `montarIndice()`: um verbete
  por conceito (nome, resumo, temas, "Onde aprender" e "Onde praticar"),
  busca pelo nome e pelo resumo sem acento e sem maiúscula. Fase liberada
  abre direto; trancada leva ao ponto da unidade no mapa
  (`/ilha/<ilha>#<unidade>`, a ilha abre o card) com "Você chega lá na Ilha
  X"; `/glossario#<conceito>` abre no verbete. Testes em
  `testes/conteudo/glossario.test.ts`. O opcional (sublinhar termos nas
  falas do computadorzinho) ficou de fora: nomes curtos e comuns como
  "Elemento" e "Tag" aparecem em quase toda fala e o sublinhado ia poluir
  a leitura.

- [x] **Etapa 6: sistema de áudio.** O sistema da rodada 7/8 já fazia
  quase tudo (música por tela carregada sob demanda e só depois do
  primeiro gesto, loop sem emenda, pausa com a aba escondida, volumes
  separados e salvos, mudo, efeitos grandes em arquivo com reserva
  sintetizada). Esta etapa completou: `src/audio/manifesto.ts` (o que o
  jogo espera: música por ilha, mapa e museu; efeitos grandes
  `unidade-concluida`, `esbarrao`, `insignia`, `entrar-mapa`), pré-carga
  da próxima tela provável (só os bytes, `preCarregarTelaMusical`),
  crossfade de 0,8 s entre telas (era 1,5 s), o `insignia` ligado às
  insígnias e a seção "Preparando os arquivos" no `docs/AUDIO.md` (nomes,
  formato WebM/Opus com M4A/AAC de reserva, -18 LUFS na música e -16 nos
  efeitos, como cortar uma faixa do Suno em loop no fim do compasso).
  Arquivos presentes em `public/audio`: 8 músicas (mapa, origens, sites,
  logica, paginas-vivas, rede-servidor, ia, oficio) e 11 efeitos (boot,
  dormir, acordar, esbarrao, fase-concluida, unidade-concluida,
  desbloqueio, insignia, entrar-mapa, viagem-ilha, abrir-museu), cada um
  em `.webm` e `.m4a`. Testes: `registro.test.ts` (manifesto esperado,
  sem manifesto tudo silencioso ou sintetizado) e `audio.mjs` (sem
  arquivo nenhum, com manifestos vazios e ausentes: silêncio, sintetizado,
  nenhum pedido de arquivo, console limpo; pré-carga).

- [x] **Etapa 7: guia, ROADMAP, PROGRESSO e testes novos.**
  `testes/explorar.mjs` nos três layouts (trilhas, lentes de tema e de
  profissão no mundo e na ilha com planejadas, card com temas, painel e
  comemoração de insígnia, glossário com busca, links para a fase e para
  o ponto no mapa, botão dentro da fase e Voltar), na bateria
  (`todos.mjs`). Ajudante `tocarNo` (toca a linha da árvore e confere que
  ela ficou selecionada; se não, o erro diz o que aconteceu e guarda uma
  foto). O duplo toque no nome da tag (`renomear-links.mjs`) também vai
  direto na tela. Guia: checklist com temas e testes por estado;
  `testes/README.md` com o `explorar.mjs`, o áudio sem arquivos e as
  unidades atuais; ROADMAP com Feito, Próximo e a decisão do
  `InterativAIPLUS`.
  Resultado final: `npm run bateria:repetir` no build de produção: **5 rodadas seguidas
  verdes** (24 execuções por rodada, três layouts, console limpo em todas;
  cerca de 45 min por rodada). Antes delas, duas tentativas pararam em
  falhas novas, que viraram os itens 7 e 8 do relatório de atritos
  ("Rodada 3, resolvido") e foram corrigidas antes de recomeçar do zero.

## Rodada 9: painel Estilos, motor de cascata, modo documento e ROADMAP

Status resumido em `docs/ROADMAP.md` (fonte única de status a partir
desta rodada).

- [x] **Etapa 1: ROADMAP e currículo.** `docs/ROADMAP.md` criado (visão,
  fluxo de trabalho, status, decisões, estimativas) e a regra nova "todo
  prompt termina atualizando o Status do ROADMAP" no `PROJETO.md`, no
  guia (com item no checklist) e no `CLAUDE.md`. Currículo
  (`docs/MAPA-CURRICULAR.md` e `src/curriculo/curriculo.ts`) com as
  adições: filosofia no topo; sala 6 "Por baixo do capô"
  (`origens-museu-u6`); Lógica com "Resolvendo problemas" (2 unidades),
  "Estruturas de dados" (3) e "Algoritmos essenciais" (4, a última é a
  noção de desempenho); Rede e Servidor com APIs REST
  (`rede-servidor-apis-e-json-u2`), SQL e NoSQL
  (`rede-servidor-banco-de-dados-u2`), "Login e autenticação" e
  "Segurança" (3); ilha nova `ia` entre Rede e Servidor e Ofício, com 5
  zonas e `requerMotor` "IA ao vivo" (roteirizado e determinístico nas
  guiadas, Gemini ao vivo nas livres); Ofício com "Git em equipe", "Ler
  código dos outros", "TypeScript", "Testes automatizados", "Variáveis
  de ambiente" e "Portfólio e aprender sozinho", e o projeto final
  (`oficio-deploy-u2`) descrito como o critério do núcleo. Nenhum id
  antigo mudou (unidades novas entram no fim das zonas; zonas novas
  podem entrar no meio, porque o id da unidade depende só da posição na
  zona). Ícones de zona novos `ia` (constelação) e `seguranca` (escudo).
  Arte `ArteIA` (nós ligados como constelação e um farolzinho com sinal,
  só tokens, animação só sem `prefers-reduced-motion`), mundo com 1840
  de largura e as ilhas reposicionadas; o museu mostra as 6 salas.
  Testes: `curriculo.test.ts` (ordem das ilhas, IA no lugar certo, ids
  antigos preservados), `mapa.test.ts`, `registro.test.ts` (faixa `ia`,
  que já existia no manifesto, agora tem ilha) e `testes/mapa.mjs`.
- [x] **Etapa 2: CSS editável, motor de cascata, editor com abas e
  declarativo novo.** `siteAlvo.css` (opcional; fases sem ele iguais) num
  `<style data-folha-jogo>` depois do head; editar troca o `textContent`
  no iframe na hora, sem recarregar (`PreviewSiteAlvo.definirCss`), e a
  recarga do HTML leva o CSS mais novo. Motor próprio em `src/motor/css/`
  (analisador com posições e declarações comentadas como desligadas,
  especificidade do Selectors 4, folha do navegador resumida, atalhos e
  longas, validade em três estados, cascata com riscadas por propriedade
  longa, herança e `valorEfetivo` com inherit/initial/unset/var(),
  edições no texto sem bagunçar a formatação). Regra de ouro: quando não
  sabe, não risca (valor desconhecido, atalho que não sabe abrir, @media
  sem matchMedia, lógica com física, folha com @layer). Nenhuma
  biblioteca: a especificidade é nossa, com testes. Núcleo com operações
  de CSS e foto do desfazer com HTML e CSS juntos. Validadores
  `valorEfetivo`, `declaracao`, `regraExiste`, `riscada`; ações
  `definirPropriedade`, `alternarDeclaracao`, `adicionarRegra`,
  `editarCss`; linha de ajuda `{ alvo: "css" }`; eventos `editouCss`,
  `editouPropriedade`, `alternouDeclaracao`, `adicionouRegra`; checagens
  `css-da-fase` (CSS sem `siteAlvo.css`, seletorRegra inválido) e
  `valorEfetivo` numa propriedade que o motor não conhece. Editor com abas
  HTML e CSS (`@codemirror/lang-css` 6.3.1), cursor numa regra acende
  todas as peças dela. Ferramenta `editor-css` no registro (card e
  apresentação). Progresso com `cssAtual` e `cssInicioObjetivo`; meta
  antes/depois e tutor com o CSS. Bancada do motor
  (`src/conteudo/laboratorio/`, `/lab/fases?fase=lab-motor-u1-f1`), fora
  do currículo. Testes: `cascata.test.ts` (56), `css.test.ts` (13, com
  sabotagens), `testes/css.mjs` (Playwright, na bateria).
- [x] **Etapa 3: painel Estilos dentro de Elementos.** Abas de cima na
  ordem do Chrome (Elementos, Console, Fontes, Rede, Aplicação; só
  Elementos funciona) e Estilos como sub-painel de Elementos, ligado
  pela fase em `paineisElementos`. Painel com `element.style` sempre em
  cima, regras da que vence para a que perde, folha do navegador e
  "Herdado de" (só ancestrais com herdável, botão que seleciona o
  ancestral), riscadas e aviso de valor inválido, link `estilo.css:N`
  que abre a aba CSS do editor na regra, filtro, atalhos que abrem as
  longas. Edição como no Chrome (conferida no devtools-frontend): clique
  no nome ou no valor, Enter, Esc, Tab e Shift+Tab, `:` e `;` pulando
  de campo, setas (1, Shift 10, Alt 0,1), caixinha que comenta, amostra
  de cor com o seletor do sistema, "+ declaração", regra nova com o
  seletor que o Chrome sugere, hover no seletor acendendo as peças,
  prévia provisória enquanto digita (sem entrar no desfazer), desfazer.
  Celular: "Árvore | Estilos | Código" em pé, lado a lado deitado,
  alvos de 44 px e botões de seta. Ferramentas novas com card e
  apresentação: `painel-estilos`, `editar-valor-css`,
  `ligar-desligar-declaracao`, `setas-numericas`, `seletor-de-cor`,
  `nova-regra`; as ações do painel contam como elas. Linha de ajuda
  `{ alvo: "estilos" }`; checagem pede `"estilos"` em
  `paineisElementos` quando a fase usa o painel. Testes: `css.test.ts`
  (15, com as sabotagens novas), `numeros.test.ts` (5) e
  `testes/estilos.mjs` (Playwright, desktop, em pé e deitado, na
  bateria).
- [x] **Etapa 4: aba Calculado e diagrama de caixa.** Sub-aba Calculado
  ao lado de Estilos (`paineisElementos: ["estilos", "calculado"]`),
  conferida no devtools-frontend (`MetricsSidebarPane`,
  `ComputedStyleWidget`, `Color.PageHighlight`): diagrama do modelo de
  caixa com as medidas reais do iframe (zero é "0", 3 casas, camada
  "position"), lista das calculadas (sem "Mostrar todas", só as
  declaradas no elemento mais display, width e height; ordem do Chrome),
  filtro e rastro de cada propriedade pelo motor de cascata. Passar o
  mouse numa camada acende ela na prévia com as cores do Chrome (tokens
  `--cor-caixa-*` nos três temas); no toque, tocar liga e desliga; trocar
  de sub-aba ou de segmento apaga. Ferramentas `painel-calculado` e
  `modelo-de-caixa` com card e apresentação (a apresentação abre a
  sub-aba). Checagem: Calculado precisa de `"calculado"` (e de
  `"estilos"`) em `paineisElementos`. Testes: `modeloCaixa.test.ts` (3) e
  `testes/calculado.mjs` (Playwright, desktop e em pé, na bateria).
- [x] **Etapa 5: modo documento e adicionar atributo.** `modoDocumento:
  true` (fase): editor com o documento inteiro, árvore a partir do
  `<!DOCTYPE>` e do `<html>` com head, title e meta (estilos do jogo
  injetados e escondidos), aba do navegador falso com o `<title>` ao vivo,
  cabeçalho "Código da página index.html", foto do desfazer com o `<html>`
  inteiro. Charset: não dá para reproduzir de verdade num iframe (srcdoc é
  texto; blob: herda o UTF-8 do pai), então a prévia SIMULA os acentos
  quebrados sem meta charset (aviso "simulação" e fala do
  computadorzinho); código e validadores veem o texto certo; o meta
  charset liga e desliga a simulação na hora. Validador `tituloDaAba`
  (checagem: só no modo documento). "Adicionar atributo" como o Add
  attribute do Chrome (conferido no devtools-frontend): item do menu do
  nó (botão direito, toque longo), campo dentro da tag, mais de um
  atributo de uma vez, desfazer, evento `adicionouAtributo`, ação
  `adicionarAtributo`, ferramenta `adicionar-atributo` com apresentação;
  só nas fases que usam a ferramenta (U1 a U5 intactas). Bancada do
  documento (`lab-motor-u1-f2`) no `/lab/fases`. Testes:
  `documento.test.ts` (14), `codificacao.test.ts` (3) e
  `testes/documento.mjs` (Playwright, desktop e em pé, na bateria).
- [x] **Etapa 6: mobile, testes, guia e liberações.** Celular deitado: o
  seletor do painel vira "Árvore e Estilos | Código" (o Estilos já fica
  ao lado da árvore) e o cabeçalho do painel Estilos quebra a linha no
  espaço estreito (filtro e regra nova descem juntos, 44 px). As
  apresentações das ferramentas do painel que se experimentam usando
  (editar valor, caixinha, setas, cor, regra nova) mostram, em silêncio,
  a peça que o objetivo aponta (sem ela e sem seleção, o body): o painel
  nunca fica vazio no "Experimente". Testes Playwright de paisagem em
  `estilos.mjs`, `calculado.mjs` e `documento.mjs`. Guia: seção 12
  "Como escrever fases de CSS" (site-alvo de CSS sem @media, qual
  validador usar, atalhos, como o motor decide o que risca, ações e
  ferramentas, a bancada) e item no checklist. Currículo: a U6, a zona
  Estilos (E1 a E4) e a zona Layout (L1 a L4) sem `requerMotor`; a E5,
  Responsivo e Publicar continuam pedindo motor (testes do currículo e
  `MAPA-CURRICULAR.md` atualizados).
- [x] **Etapa 7: unidade-modelo E1 "A aba Estilos".** Meta ("repagina um
  site sozinho pela folha de estilo"), 3 fases de prática na Floricultura
  Pétala Azul e o desafio no Café Cantinho do Grão, com os comentários
  pedagógicos no topo de cada arquivo (como a Unidade 2). F1 "Regras e
  declarações" (olhar, trocar a cor, previsão "desligar apaga a peça?",
  sozinho numa class repetida), F2 "Tamanho, fonte e alinhamento"
  (setas, previsão do rem, fonte herdada do body, + declaração, sozinho
  com duas declarações), F3 "Cores e regras novas" (previsão do
  hexadecimal, seletor de cor, regra nova, sozinho com regra nova e hex),
  desafio com 5 partes, cada uma apontando para a fase guiada. Validadores
  `valorEfetivo` (o resultado) e `declaracao` (o caminho, ao desligar), e
  `todos` + `nao` para "qualquer cor nova" sem aceitar valor inválido. As
  6 ferramentas do painel apresentadas uma a uma; 13 conceitos novos.
  Publicada (`publicar:conteudo`). Motor: o recorte da apresentação não
  bloqueia mais um alvo que fica dentro de outra área liberada (o "+" da
  regra nova dentro do painel), e a folga de toque do nome e do valor
  diminuiu (em paisagem, com a declaração quebrando a linha, a de baixo
  cobria a de cima). Testes: `unidades.mjs` joga a E1 inteira pelo mapa
  depois da U5, nos 3 layouts (U6 e E2 planejadas, Sites 6 de 6);
  `curriculo.test.ts` e `mapa.test.ts` com a zona Estilos (a E1 abre ao
  acabar a zona Elementos; a Lógica só depois da E1).
- [x] **Etapa 8: símbolo que vira emoji no celular.** Varredura do
  repositório atrás de símbolos Unicode que o iOS/Android renderizam
  como emoji colorido fora de contexto (setas 2190-21FF, símbolos
  técnicos 2300-23FF, formas geométricas 25A0-25FF, símbolos diversos
  2600-26FF, dingbats 2700-27BF, setas suplementares 2B00-2BFF, mais os
  blocos de emoji), com o texto-selector U+FE0E como saída pra quando o
  símbolo é mesmo necessário. `temSimboloSemSeletorDeTexto`
  (`src/conteudo/checagens.ts`) combina essas faixas com o regex de
  emoji já existente, checando o U+FE0E logo depois do símbolo; entra
  nas checagens "meta-e-desafio" e "textos" do `testar:conteudo`, no
  lugar do `EMOJI.test()` cru. Achado e corrigido: a seta `↓` no atalho
  do menu do nó (`MenuNo.tsx`) virava emoji colorido no celular; agora é
  `↓︎` (com U+FE0E). Guia (seção 6) e sabotagem em
  `checagens.test.ts` (falha sem U+FE0E, passa com ele).
- [x] **Etapa 9: fala errada da U4 corrigida.** A U4 já publicada dizia,
  ao ensinar a acrescentar um atributo pela árvore, que "esse atributo
  novo se escreve na aba Estilos" — factualmente errado (atributos são
  HTML, não CSS; a aba Estilos edita `element.style` e regras CSS, nunca
  atributos). Só o texto da fala mudou (`sites-elementos-u4-f1`, dentro
  do limite de 160 caracteres do publicado); id, ordem e objetivos
  intactos. Pendência removida do `docs/ROADMAP.md`.
- [x] **Etapa 10: Unidade 6 "Página do zero".** Zona Elementos completa.
  Duas fases guiadas no modo documento (esqueleto HTML do zero — head,
  title, meta charset e viewport — no cartaz da Feira de Talentos; a
  simulação de acentos quebrados até o meta charset entrar) e desafio no
  Site do Marcos Conserta Bikes (title, h1, meta charset e meta
  viewport, 5 partes). Conceitos novos: `estrutura-do-documento`,
  `head-vs-body`, `title`, `meta-charset`. Testes: `unidades.mjs` joga a
  U6 inteira depois da U5, nos 3 layouts.
- [x] **Etapa 11: Unidade E2 "Seletores".** F1 seletor de tag e de
  classe (Livraria Página Virada); F2 seletor de id e descendente
  (Mercadinho Preço Bom), com o editor CSS apresentado pela primeira vez
  porque o botão "+ regra nova" só sugere seletores simples (tag, id ou
  classes do próprio elemento — nunca um seletor composto como
  `main .autor`, limitação do `seletorSimples()` em
  `src/motor/css/editarCss.ts`). Desafio em site novo. Conceitos:
  `seletor-de-tag`, `seletor-de-classe`, `seletor-de-id`,
  `seletor-descendente`.
- [x] **Etapa 12: Unidade E3 "Modelo de caixa".** F1 padding e border,
  F2 margin e box-sizing (Confeitaria Doce Encanto), com a aba Calculado
  e o diagrama do modelo de caixa apresentados juntos. Desafio na
  Barbearia Corte Certo. Conceitos: `modelo-de-caixa`, `padding-css`,
  `border-css`, `margin-css`, `box-sizing`.
- [x] **Etapa 13: Unidade E4 "Por que minha regra não pega?" — zona
  Estilos completa.** F1 ordem e especificidade (a loja Corda & Nota,
  com `#topo` mais específico vencendo `h1` mesmo escrito antes no
  arquivo — ataca de propósito a confusão "a última regra sempre
  vence"); F2 herança e `!important` (a mesma loja: `.descricao` herda a
  cor do `article` pai sem regra própria; consertar um `!important`
  editando a PRÓPRIA declaração, nunca criando outro). Desafio na
  Academia Corpo Ativo, três regras que não pegam (especificidade,
  especificidade de novo, `!important`), cada parte apontando
  (`revisarEm`) pra fase guiada certa. Conceitos: `cascata-css`,
  `ordem-das-regras`, `especificidade-css`, `heranca-css`,
  `importante-css`. Motor: descoberto e corrigido um bug real de
  desbloqueio (publicar a U6, numa zona anterior à Estilos, trancava de
  novo a zona Estilos pra quem já tinha aberto ela antes) — ver
  `docs/ATRITOS-FABRICA.md`, Rodada 3. Testes: `unidades.mjs` estende a
  jornada até a E4 e o "10 de 10 unidades" no mundo; `curriculo.test.ts`
  e `mapa.test.ts` atualizados a cada unidade nova; teste novo de
  desbloqueio permanente. Bateria completa (`testar:conteudo`, build,
  lint) verde nos 3 layouts em desktop e retrato; em paisagem, a
  jornada completa esbarrou numa flakiness pré-existente do celular
  (não causada por esta rodada, já documentada nas rodadas anteriores) —
  detalhe completo em `docs/ATRITOS-FABRICA.md`, Rodada 3.

## Rodada 8: áudio v2 (música do mapa e efeitos gravados)

Detalhes em `docs/AUDIO.md`.

- [x] **Etapa 0: reconhecimento.** O motor da rodada 7 já cobria música,
  voz, efeitos e ajustes. O que mudou: o `audio-v2.zip` traz a faixa
  `mapa` (sai de `pendentes`) e 11 efeitos gravados, com o `efeitos.json`
  num formato novo (só ids com arquivo, cada um com `descricao`,
  `arquivos` e `duracaoSegundos`; sem `"arquivos": null` nem
  `preCarregar`). Nenhum evento novo no jogo: `dormir`, `acordar` e
  `insignia` seguem sem ligação.
- [x] **Etapa 1: arquivos.** 17 arquivos em `public/audio/musica/` e 23 em
  `public/audio/efeitos/`, sem renomear nem editar os json; zip removido.
- [x] **Etapa 2: motor.** Leitura do contrato novo do `efeitos.json`;
  `resolverEfeito` (arquivo que falha cai no sintetizado); boot baixado e
  decodificado antes do primeiro gesto (`prepararAudio`, com
  `OfflineAudioContext`) e tocado "na hora" no gesto; momentos grandes
  pré-carregados no primeiro gesto; efeito em arquivo termina em
  `duracaoSegundos`; ganho 0,13 dos arquivos medido contra a música.
- [x] **Etapa 3: testes e docs.** `registro.test.ts` no contrato novo
  (arquivo, sintetizado, falha, sem arquivo órfão, `mapa` no mundo);
  `testes/audio.mjs` com a faixa `mapa`, boot do arquivo no primeiro
  gesto, momentos grandes do arquivo e efeitos em 404 caindo no
  sintetizado. `AUDIO.md`, `PROJETO.md` e `testes/README.md` atualizados.

## Rodada 7: sistema de áudio

Detalhes em `docs/AUDIO.md`.

- [x] **Etapa 0: reconhecimento.** Som antigo em `src/lib/som.ts` (acerto,
  clique, conclusão, aviso; liga/desliga em `som` no progresso). Balão
  (`BalaoFala`) mostra o texto de uma vez, sem digitação. 7 expressões
  (`src/motor/expressao.ts`). Eventos que existem: conclusão de fase,
  comemoração de unidade na ilha (com a próxima abrindo), esbarrão,
  previsão certa/errada, ferramentas pelo barramento do painel. Não
  existem: ociosidade (dormir/acordar), insígnias, evento de ilha ou zona
  desbloqueada (o estado é derivado).
- [x] **Etapa 1: músicas.** 14 arquivos e o `musicas.json` em
  `public/audio/musica/`; zip removido.
- [x] **Etapa 2: motor.** `src/audio/`: `AudioContext` único no primeiro
  gesto, barramentos, suspensão com a aba escondida, rampas, música por
  tela (tabela única `telas.ts`, crossfade de 1,5 s, `loopEnd` do
  manifesto, no máximo duas faixas decodificadas), ducking. O
  `src/lib/som.ts` foi absorvido (mesmos sons). Ajustes de som
  (`AjustesSom`) no botão de som e no menu do celular, salvos no progresso
  (`volumeMusica`, `volumeEfeitos`, `volumeVoz`; `som` preservado).
- [x] **Etapa 3: voz de modem.** Gerador puro e determinístico
  (`vozModem.ts`) + tocador; 4 assinaturas (feliz, pensativo, triste,
  surpreso) para as 7 expressões; teto de 2,5 s com cauda natural; uma
  voz por vez; balão saindo de cena cala.
- [x] **Etapa 4: efeitos.** Registro de 31 ids com versão sintetizada e
  arquivo opcional pelo `public/audio/efeitos/efeitos.json`; teclas do
  editor, ferramentas do DevTools, painéis, momentos grandes. `dormir`,
  `acordar` e `insignia` sem ligação (não há evento).
- [x] **Etapa 5: docs.** `docs/AUDIO.md`, este arquivo, `PROJETO.md` e
  `testes/README.md`.
- [x] **Etapa 6: testes.** `testes/audio/` (Vitest, também no
  `testar:conteudo`) e `testes/audio.mjs` (Playwright: ajustes salvos,
  navegação com o AudioContext real, toque em pé), na `testes/todos.mjs`.

## Rodada 6: Unidades 3, 4 e 5 da zona Elementos

- [x] **Unidade 3, "Títulos e textos"** (`sites-elementos-u3`). Fases 1-3
  no Blog da Horta Comunitária: hierarquia de títulos (h1-h6) e
  parágrafo, com a ferramenta renomear-tag apresentada pela primeira vez
  fora da U3 original; ênfase forte e leve (strong vs b, em vs i),
  atacando a confusão "b e strong são iguais" com previsão; listas
  numeradas (ol vs ul), revisando trilha e duplicar elemento. Desafio na
  Receita da Vovó (site novo), 4 partes. 5 conceitos novos no catálogo
  (`titulos-hierarquia`, `paragrafo`, `enfase-forte`, `enfase-leve`,
  `lista-numerada`).
- [x] **Unidade 4, "Links, imagens, id e class"** (`sites-elementos-u4`).
  Fases 1-3 no Coral Vozes da Vila: editar atributo (conceito novo, nunca
  tinha sido nomeado apesar da mecânica existir desde a U1), href e link
  âncora, target="_blank"; alt de imagem, atacando "alt é legenda" com
  previsão; id único vs class repetível, atacando "id e class são a
  mesma coisa" com previsão sobre id duplicado, revisando duplicar
  elemento. Desafio na banda Trovão de Lata (site novo), 4 partes.
  Atrito de motor real pego antes do commit: a árvore só edita o valor
  de um atributo que já existe, nunca cria um novo — atributos novos
  (target, alt, class quando ainda não existe) precisam ser escritos
  pelo código; conteúdo ajustado para orientar certo (ver
  `docs/ATRITOS-FABRICA.md`, Rodada 2).
- [x] **Unidade 5, "Caixas e seções"** (`sites-elementos-u5`). Fases 1-3
  na Oficina Roda Livre: div genérica e semântica do HTML (header,
  footer), atacando "a div faz algo visual" com previsão; section vs
  article, atacando "tanto faz" com previsão; span (revisando ênfase
  forte da U3: o preço não é "importante de verdade", é só estilo).
  Desafio no Pet Shop Focinho Feliz (site só de div), 4 partes.
- [x] **Testes e docs.** `testar:conteudo` verde nas três unidades (377
  testes no total, todas de primeira exceto um limite de caracteres na
  U3 e um na U4). `npm run publicar:conteudo` rodado uma vez por unidade,
  cada uma com seu commit. Bateria Playwright (`testes/unidades.mjs`)
  estendida com a jornada das três unidades, nos três layouts (desktop,
  retrato, paisagem), a partir do mapa. Ajudantes novos:
  `renomearTag`, `editarValorAtributo`, `clicarLinhaCodigo` (corrigido
  pra lidar com virtualização do editor, quebra de linha e a régua de
  números) e `acrescentarAtributoPeloCodigo`. `curriculo.test.ts` e
  `mapa.test.ts` atualizados a cada unidade nova (status "pronta",
  desbloqueio de ilha e zona, ponto do computadorzinho). `build` e
  `lint` verdes o tempo todo. `docs/ATRITOS-FABRICA.md` com a Rodada 2.

## Rodada 5: fábrica corrigida, currículo e mapa das ilhas

- [x] **Etapa 1: correções da fábrica** (resposta ao
  `docs/ATRITOS-FABRICA.md`). Campo `pratica` em `FasePratica`
  (conceitos já ensinados que a fase só treina); fase de prática precisa
  de `conceitos` ou `pratica`; `montarIndice()` põe `pratica` em
  "praticam"; u1-f2 migrada (`conceitos: []`, as 4 habilidades em
  `pratica`). Regra nova `fase-so-sozinho` (todos sozinho = `conceitos`
  vazio; fase que só treina não tem guiado nem previsão guiada); `pratica`
  só com conceitos ensinados antes; `revisarEm` precisa apontar para fase
  com objetivo guiado; `meta.desafioId` confere tipo, unidade e posição.
  Meta de entrada uma vez só por unidade (`metasVistas` no progresso,
  `faseAbreComMeta` em `src/lib/metaDaUnidade.ts`), só sem progresso na
  unidade; a do desafio continua. `jogarDesafio` usa
  `recalcularPartesFeitas` e confere a conclusão simultânea no fim.
  Congelamento: `src/conteudo/publicados.json` + regra
  `publicados-congelados` + `npm run publicar:conteudo`
  (`scripts/publicarConteudo.ts`, recusa publicar com id sumido ou
  checagem falhando). `src/motor/chaveArvore.ts` (esquema do
  `data-chave`, sem imports) e ajudantes `pularMeta`, `selecionarNo` e
  `chaveDoSeletor` em `testes/util.mjs` (transpilam o arquivo do motor
  com o TypeScript do projeto e executam dentro da página); testes
  `fase-completa`, `tutor` e `unidades` usam os ajudantes. Testes novos:
  `checagens.test.ts` (sabotagens: parte seguinte que desfaz a anterior,
  id de objetivo publicado alterado, fase renomeada, ordem trocada, fase
  só de sozinho com conceito, guiado em fase de treino, `revisarEm` para
  a fase sozinha, `meta.desafioId` de outra unidade),
  `chaveArvore.test.ts` (chave da árvore = chave calculada, em todos os
  sites) e meta uma vez só em `progresso.test.ts`. Guia (seções 2, 3.2,
  3.8, 3.9, 3.10, 10, 11 e checklist), template, `testes/README.md` e
  atritos atualizados. `testar:conteudo` (182 testes), `lint`, `build` e
  bateria Playwright inteira verdes.

- [x] **Etapa 2: currículo em dados.** `docs/MAPA-CURRICULAR.md` (o
  Anexo A inteiro, formatado, com o id de cada unidade no currículo).
  `src/curriculo/`: tipos (`IlhaCurriculo`, `ZonaCurriculo` com `icone`
  para o mapa, `UnidadeCurriculo` com `requerMotor` opcional, porque a U6
  requer motor numa zona pronta), dados na ordem do mapa (Origens com as
  5 salas, Sites com Elementos/Estilos/Layout/Responsivo/Publicar,
  Lógica, Páginas vivas, Rede e Servidor e Ofício com uma unidade
  planejada por zona, Frameworks opcional) e consultas (`statusDaUnidade`
  a partir do conteúdo registrado, `localNoCurriculo`, `motorQueFalta`).
  Ofício ganhou `requerMotor` por zona (o anexo não listava, mas o motor
  só tem a aba Elementos). Regras gerais novas: `curriculo-ids`,
  `curriculo-conteudo` (id `<ilha>-<zona>-u<n>`, número, ilha, zona,
  título e ordem) e `curriculo-motor`. Testes em `curriculo.test.ts`
  (com sabotagens: id repetido, unidade fora do currículo, zona errada,
  conteúdo em zona com `requerMotor`, a U6).

- [x] **Etapa 3: renomear tag e links na prévia.** Renomear tag
  conferido na doc do Chrome ("Edit node type") e no devtools-frontend
  (`startEditingTagName`/`tagNameEditingCommitted`: Enter e Espaço
  confirmam, Esc desiste, fechamento acompanha, nome vazio ou igual
  desiste, `html`/`head`/`body` bloqueados, `setNodeName` preserva
  atributos e filhos). Núcleo `renomearTag` (desfazer/refazer, seleção
  continua na peça), evento `renomeouTag`, ação
  `{ tipo: "renomearTag", seletor, novaTag }`, validador
  `{ tipo: "tag", seletor, nome }`. Interface: dois cliques (ou dois
  toques) no nome da tag, item "Renomear tag" no menu do nó e botão
  "Renomear" na barra do celular (7 botões de 44 px). Ferramenta
  `renomear-tag` no registro com ícone, card, apresentação (mouse e
  toque) e mini demo. Links: `src/lib/linksPrevia.ts` (âncora, quebrado,
  vazio, externo, aba nova) e núcleo `clicarLink` (evento `clicouLink`
  com `href`); a prévia segura clique, botão do meio e envio de
  formulário; âncora rola, `#` volta ao topo, e o computadorzinho diz
  "Esse link levaria para: <href>" (ou a fala de quebrado e de vazio).
  Ação `clicarLink` e `href` opcional no validador `evento`. Testes:
  `nucleo.test.ts` (renomear, recusas, desfazer, links e falas) e
  `testes/renomear-links.mjs` (desktop e em pé), `ferramentas-novas.mjs`
  com 5 itens no menu e 7 na barra.

- [x] **Etapa 4: mapa (mundo, ilha, museu e desbloqueios).** Regras em
  `src/lib/mapa.ts` (estado da ilha, zona aberta, estado da unidade,
  ação do card, estrelas, ilha e ponto atuais), com testes. Progresso
  ganha `unidadesComemoradas`, `posicaoNoMapa` e `mapaDesbloqueado` (o
  último abre tudo, inclusive as fases em `faseLiberada`). Mundo em
  `/mapa` (provisório nesta etapa: o jogo continua em `/` até a Etapa 5),
  ilha e museu em `/ilha/[id]` (só os ids do currículo, 404 no resto).
  Arte SVG de cada ilha (museu com colunas, cartão perfurado e terminal;
  prédios `< >` e blocos; engrenagens; peças que pulam, faíscas e botão;
  antenas e cabos no mar; oficina com ferramentas; blocos montados),
  estados (brilho, andaimes com computadorzinho dormindo, névoa e
  cadeado), mar com ondas, rota com barquinho e o computadorzinho na ilha
  atual. Ilha: zonas ao longo do caminho (horizontal ou vertical em pé),
  ícone da aba por zona (`IconeZona`), placa "Em construção", pontos,
  card com Jogar/Continuar/Jogar de novo, caminhada do computadorzinho e
  comemoração ao concluir. Barra do mapa com total de estrelas,
  Ferramentas (Caixa só de leitura: `aoRever` ficou opcional), tema e
  som. Tudo respeita `prefers-reduced-motion`. Teste
  `testes/mapa.mjs` nos três layouts.

- [x] **Etapa 5: integração do mapa com o jogo.** `/` virou o mundo;
  fases em `/fase/[id]` (deep link, 404 fora do conteúdo, aviso de fase
  trancada com volta para a ilha); o `/mapa` provisório saiu. Botão
  "Mapa" dentro da fase (desktop na barra; celular à esquerda do título,
  44 px), que volta para a ilha. "Próxima fase" só dentro da unidade;
  depois do desafio, "Voltar pra ilha" (a ilha comemora, o ponto acende e
  o próximo aparece). A Lista de fases saiu do jogo e foi para o
  `/lab/mapa` (com "Desbloquear tudo" e "Resetar o progresso do mapa").
  Testes: `unidades.mjs` joga as Unidades 1 e 2 começando pelo mapa e
  voltando para a ilha, nos três layouts; `mapa.mjs` com deep links,
  voltar e avançar do navegador, botão Mapa, fase trancada e o lab;
  `migracao.mjs` entra pelo mapa; `abrir()` abre `/fase/<faseAtual>`.

- [x] **Etapa 6: guia, docs e verificação final.** Guia com a seção 0
  ("Como escolher a próxima unidade": seguir o `docs/MAPA-CURRICULAR.md`
  na ordem, com o id do currículo; a regra de parada para zona ou unidade
  com `requerMotor`), a unidade no formato do currículo (3.1), o passo a
  passo e o checklist com o mapa, `npm run publicar:conteudo`, as
  checagens e o commit, links nos sites-alvo e os endereços nos testes de
  navegador (além do que entrou na Etapa 1: `pratica`, fase só de
  sozinho, `revisarEm`, formato padrão, meta, congelamento, ajudantes).
  `PROJETO.md` (visão com o mapa, navegação, testes, fora do escopo),
  `README.md` e este arquivo atualizados.

## Critérios de pronto da rodada 5 (verificados na Etapa 6)

- [x] `npm run build`, `npm run lint` e `npm run testar:conteudo` (209
  testes) verdes; bateria Playwright inteira (`testes/todos.mjs`, 16
  execuções) verde com console limpo, no `next dev` e no `next start`
  (build de produção), e `tutor.mjs` sem chave.
- [x] `prefers-reduced-motion`: mapa sem ondas, caminhada ou pulsos, a
  comemoração ainda registra, e sem erro de hidratação (o computadorzinho
  e a arte do mapa só animam depois de montar: `useMontado`).
- [x] Unidades 1 e 2 jogadas começando pelo mapa nos três layouts
  (`unidades.mjs desktop|retrato|paisagem`): ao concluir cada desafio,
  "Voltar pra ilha", o ponto acende, o caminho até o próximo se desenha e
  a U3 aparece como planejada.
- [x] Progresso antigo preservado: v1 migra e o mapa mostra a U1 com
  "Continuar", sem a meta de novo (`migracao.mjs`); campos novos com
  padrão (`progresso.test.ts`).
- [x] Sabotagens: (1) a solução da parte "novo-prato" do desafio da U1
  devolvendo o nome do prato faz o `testar:conteudo` falhar com 'no fim,
  a parte "trocar-prato" (avaliada ao vivo) não passa mais: a solução de
  uma parte seguinte desfez o efeito dela, e o desafio nunca
  concluiria...'; (2) renomear o objetivo publicado "duas-copias" da
  u2-f3 falha com 'a fase publicada "sites-elementos-u2-f3" mudou os
  objetivos (...; sumiram "duas-copias"; entraram "duas-copias-novas").
  Ids publicados nunca mudam: isso apaga o progresso de quem já jogou.'.
  As duas desfeitas; as mesmas sabotagens também são testes permanentes
  em `testes/conteudo/checagens.test.ts`.
- [x] Buscas no repositório: nenhum emoji (só o aviso do guia sobre `©` e
  `™`), nenhuma cor literal fora de `src/tema/tokens.css` e dos
  sites-alvo (os `white`/`black` de `ApresentacaoFerramenta` são valores
  de máscara SVG, de antes), nenhum `NEXT_PUBLIC_GEMINI`.

## Rodada 4: primeiro teste da fábrica (Unidade 1)

- [x] **Etapa 1: checklist do desafio ao vivo.** Partes do desafio cujo
  validador depende de seleção ou evento (`selecionado`, `evento`, ou
  `todos`/`algum`/`nao` que contenham algum deles) continuam travando (uma
  vez marcadas, ficam marcadas); as demais (estado da página: `existe`,
  `naoExiste`, `escondido`, `contagem`, `atributo`, texto) passam a ser
  avaliadas ao vivo a cada checagem e desmarcam se o jogador desfizer a
  ação. `validadorTravado` e `recalcularPartesFeitas` em
  `src/motor/validadores.ts`; `useMotorFase` troca `marcarPartes` (só
  adicionava) por `atualizarChecklist` (recalcula tudo a cada verificação).
  O desafio só conclui com as partes ao vivo passando juntas e as travadas
  já marcadas. Teste novo em `testes/conteudo/nucleo.test.ts`
  (`validadorTravado` e `checklist do desafio`, com o desafio da Unidade 2:
  apagar o pop-up marca, desfazer desmarca; selecionar a vitrine pela
  trilha continua marcado mesmo perdendo a seleção depois). Regra
  documentada em `docs/PROJETO.md` e `docs/GUIA-DE-CONTEUDO.md`. Bateria
  Playwright `unidades.mjs` (desktop, retrato, paisagem) continua verde.

- [x] **Etapa 2: conteúdo da Unidade 1.** u1-f1 intocada (ids, objetivos e
  textos iguais: progresso salvo e testes antigos continuam valendo).
  Fase 2, "Agora sem rodinhas" (`fase-2.ts`): as mesmas 4 habilidades da
  Fase 1 (árvore, setinha, editar texto, adicionar pelo código), todas em
  modo `sozinho`, na página de encomendas da mesma padaria
  (`sites/padariaEncomendas.ts`, âncoras diferentes: `h2`, `.sabores`,
  `ul.sabores > li`). Fase 3, o desafio "Lanchonete Sabor Rápido"
  (`fase-3-desafio.ts`), num site novo e diferente da padaria
  (`sites/lanchoneteSaborRapido.ts`, só CSS): 4 partes, uma por habilidade,
  todas com `revisarEm: "sites-elementos-u1-f1"` (a fase guiada, com a
  escada de ajuda completa). Pelas regras da Etapa 1: as partes de seleção
  (árvore, setinha) travam; as de texto e contagem são ao vivo.
  `unidade.ts` com as 3 fases em ordem e `meta.desafioId` apontando para a
  Fase 3. `npm run testar:conteudo` (150 testes), `lint` e `build` verdes.
  Jogado em `/lab/fases` e pela bateria Playwright: `unidades.mjs`
  estendido para jogar u1-f2 e u1-f3 (checklist travando/desmarcando de
  verdade) nos três layouts; `fase-completa.mjs` e `tutor.mjs` ajustados
  para passar pela tela de meta que agora abre a Unidade 1 (efeito
  colateral de preencher `meta.desafioId`, ver atritos). Bateria inteira
  (`testes/todos.mjs`, 12 scripts) verde, console limpo.

- [x] **Etapa 3: relatório de atritos.** `docs/ATRITOS-FABRICA.md`: fase
  só de objetivos sozinho sem ensinar conceito novo (checagem exige
  `conceitos` não vazio), `meta.desafioId` novo mudando o comportamento da
  primeira fase já publicada (invisível ao `testar:conteudo`, só apareceu
  na bateria Playwright), esquema do `data-chave` da árvore não
  documentado, conflito entre a previsão guiada opcional do guia e a regra
  "guiado antes de sozinho", ambiguidade do `revisarEm` quando guiado e
  sozinho moram em fases separadas, e uma lacuna na simulação de desafio
  do `checagens.ts` (não confere a conclusão simultânea das partes ao
  vivo). Nada do guia, do template ou do motor foi corrigido nesta etapa,
  só relatado.

- [x] **Etapa 1: Fundação.** Next + TS + Tailwind + Framer Motion, tokens e
  temas Doce e Fliperama (Segredo já definido, bloqueado), seletor de tema,
  fontes, layout esqueleto (barra superior, painel com abas bloqueadas, janela
  do navegador, área do mascote), armazém de progresso, docs.
- [x] **Etapa 2: Mascote e Carinha.** `Mascote` (7 expressões, piscar
  aleatório, respiração, crossfade, pulinho, confete, respeita
  `prefers-reduced-motion`), `Carinha` (feliz, dormindo, surpresa em 4 tons),
  rota `/lab/mascote` com todos os temas lado a lado.
- [x] **Etapa 3: Preview e editor.** Hook `useSiteAlvo` (fonte única de
  verdade = HTML do body), caminho A com debounce de 300 ms, `EditorCodigo`
  (CodeMirror 6 + lang-html, tema dos tokens, quebra de linha opcional, API
  `definirTexto`/`destacarLinhas`/`rolarParaLinha`), `PreviewSiteAlvo`
  (iframe `srcdoc` + `sandbox="allow-same-origin"`), `PainelDividido` com
  divisor arrastável, site-alvo "Padaria Pão Quentinho" renderizando.
- [x] **Etapa 4: Árvore de Elementos.** `ArvoreElementos` (estilo F12, texto
  curto na mesma linha, `== $0` no selecionado, tudo nasce expandido),
  sobreposição com etiqueta `tag.classe L × A` no hover, seleção que rola o
  editor até a linha, modo inspecionar (mouse, e setas + Enter pelo teclado,
  Esc cancela), edição inline de texto e de valor de atributo (Enter confirma,
  Esc cancela), caminho B sem recarregar o iframe, seleção preservada pelo
  caminho de índices, teclado (setas, Home, End, Enter/F2 edita).
- [x] **Etapa 5: Motor de fases e conteúdo da Fase 1.** Tipos em
  `src/motor/tipos.ts`, fase como dados em `src/fases/sites-elementos-1/fase.ts`,
  hook genérico `useMotorFase` (introdução com Enter/clique, objetivos em
  sequência, validação a cada load/edição/evento, pausa com fala de conclusão
  e botão "Próximo objetivo", escada de ajuda com destaque pulsante na árvore,
  no editor e no botão de inspecionar, solução com confirmação e custo de 1
  estrela, mínimo 1), tela de conclusão com estrelas, falas finais, missão de
  campo (checkbox salvo) e gancho do easter egg, persistência em
  `ilha-sites:progresso:v1` (retoma objetivo, HTML e estrelas), "Recomeçar
  fase" com confirmação. Barramento de eventos liga o painel ao motor.
- [x] **Etapa 6: Tutor Gemini.** Rota `POST /api/tutor` (runtime nodejs,
  `@google/genai`, `responseMimeType` JSON + `responseJsonSchema`, thinking
  LOW nos modelos Gemini 3, tempo limite de 20 s, sem novas tentativas),
  system prompt completo em `src/lib/tutor/promptTutor.ts`, validação e corte
  da entrada, parse seguro (cercas, JSON cortado, texto puro, sem emojis e sem
  markdown), campo "Pergunte ao computadorzinho" com mascote pensativo durante
  a espera e preocupado na falha ("Estou sem sinal agora. Tenta o botão Me
  ajuda!"). Falhas esperadas respondem 200 com `{ erro }` para não sujar o
  console do navegador. Testado sem chave e com chave inválida.
- [x] **Etapa 7: Acabamento.** Sons com Web Audio (acerto, clique, conclusão,
  aviso; volume baixo, respeitam o botão de som, AudioContext só depois da
  primeira interação), easter egg (comentário HTML e `data-segredo` no HTML do
  jogo; a palavra "curioso" no campo do tutor libera e liga o tema Segredo sem
  chamar o Gemini), estrelas surgindo uma a uma na conclusão, `MotionConfig`
  com movimento reduzido, responsivo abaixo de 1024 px (abas "Painel" | "Tela",
  inspecionar troca de aba sozinho, mascote compacto e objetivo atual em uma
  linha), dicas que não estouram a largura, contraste revisado nos três temas.

## Rodada 2: tutor resistente, sincronia, ferramentas e mobile

- [x] **Etapa 8: Tutor resistente.** `gerarComResiliencia`
  (`src/lib/tutor/resiliencia.ts`): 503/429 (ou UNAVAILABLE /
  RESOURCE_EXHAUSTED) tentam de novo 2 vezes com backoff exponencial e jitter
  (~1 s, ~2 s) e depois 1 vez no modelo reserva (`GEMINI_MODEL_RESERVA`,
  padrão `gemini-3.5-flash-lite`). Orçamento de 45 s, cada tentativa até 15 s,
  `maxDuration = 60`. Resposta de falha `{ erro: { tipo } }` com `sobrecarga`,
  `sem_chave`, `rede` ou `desconhecido`; log no servidor com tipo, status e
  modelo. No cliente: sobrecarga (pensativo + "Tentar de novo"), sem chave
  (dormindo), rede/desconhecido (preocupado, "sem sinal"). Simulação local com
  `TUTOR_SIMULAR=sobrecarga | sobrecarga-total | rede` (ignorada em produção).
  Teste: `testes/tutor.mjs`.
- [x] **Etapa 9: Sincronia tripla.** Caminho "só de elementos"
  (`src/lib/caminhoElementos.ts`, ignora textos e comentários dos dois lados)
  ligando o código (árvore sintática Lezer do CodeMirror,
  `editor/mapaElementos.ts`) ao DOM. Selecionar pela árvore, inspeção ou
  ajuda acende o nó, o trecho inteiro no editor (fundo animado + barrinha,
  `editor/destaqueTrecho.ts`, rola até ele) e a caixa no preview (sem hover,
  a caixa mostra o selecionado). Cursor no editor (150 ms de espera)
  seleciona o elemento mais interno, conferindo as tags nos dois lados;
  se não bater, não destaca nada. Seleção vinda do editor não mexe no
  cursor (transações externas são anotadas). Teste: `testes/sincronia.mjs`.
- [x] **Etapa 10: Sistema de apresentação de ferramentas.** Registro central
  data-driven em `src/ferramentas/registro.ts` (9 ferramentas, ícones SVG
  próprios, 4 mini demos), `data-ferramenta` nos elementos reais via
  `AlvoFerramenta` (também dá o "?" no desktop e o toque longo no celular).
  Spotlight `ApresentacaoFerramenta`: véu com recorte arredondado (máscara
  SVG) e contorno pulsante, mascote ao lado do alvo, 3 falas (Enter, clique
  ou toque avançam; Esc pula), passo "Experimente" em que só o alvo fica
  livre (bloqueio com `clip-path` evenodd, com áreas extras como a tela no
  modo inspecionar) e fecha quando o jogador usa a ferramenta de verdade
  (`sinalizarUso` ou toque no alvo), com comemoração. "Pular" sempre visível.
  Vistas salvas em `apresentacoesVistas` no progresso. Caixa de Ferramentas
  (gaveta no desktop, folha arrastável no celular) com cards, silhuetas
  dormindo e "Rever apresentação". `apresentar` em `Fase` e `Objetivo`;
  Fase 1 configurada; enunciados com variação de toque (`enunciadoToque`).
  Testes: `testes/fase-completa.mjs`, `testes/ferramentas.mjs`.
- [x] **Etapa 11: Mobile retrato e toque.** Três composições
  (`jogo/movel/useLayoutJogo.ts`): desktop (>= 1024 px), retrato (abaixo
  disso, inclusive tablets) e paisagem (deitado e com altura < 500 px). A
  árvore de componentes é a mesma nos três (só mudam classes e ordem), então
  editor, iframe e seleção não remontam ao girar. Retrato: prévia em cima
  (40%, alça arrastável de 25% a 60%, salva em `proporcaoPrevia`), painel
  embaixo com "Árvore | Código" (as duas áreas continuam montadas; trocar
  para Código rola até o trecho selecionado), barra superior compacta com
  menu (Ferramentas, tema, som, recomeçar), barra de objetivos (2/4, toque
  expande), computadorzinho flutuante de 56 px com balão que abre sozinho a
  cada fala nova e fecha com toque fora ou arrastando para baixo. Teclado:
  `interactiveWidget: "resizes-content"` na viewport + VisualViewport (altura
  real e teclado aberto com campo focado); com teclado, a prévia vai a 25% e
  a barra de objetivos some. Toque: `touch-action: manipulation`, inspecionar
  arrastando o dedo (soltar escolhe), duplo toque e botão "Editar" no nó
  selecionado, linhas da árvore e botões com 44 px. Testes:
  `testes/fase-completa.mjs retrato`, `testes/movel.mjs`.
- [x] **Etapa 12: Mobile paisagem.** Deitado e com altura < 500 px: painel e
  prévia lado a lado (50/50), barra superior fina, árvore por padrão no
  painel, mini avatar (44 px) com balão sobreposto que fecha sozinho depois
  do tempo de leitura (não fecha se a fala pede um botão, se o dedo ou o
  foco estão nele). Focar o editor deitado mostra o recado "Pra digitar,
  fica mais confortável com o celular em pé" sem bloquear. Girar mantém
  seleção, código, objetivo, balão e rascunho do tutor (mesma árvore de
  componentes nos três layouts). Menu do celular fecha ao escolher um item
  e mantém o conteúdo montado. Teste: `testes/movel.mjs` (giro e spotlight
  nos dois modos).
- [x] **Etapa 13: Testes, acabamento e docs.** Bateria completa rodada em
  `next dev` e em `next start` (build de produção): `testes/todos.mjs`
  (sincronia, ferramentas, fase inteira nos três modos, celular) e
  `testes/tutor.mjs` nos três cenários (sobrecarga total, reserva, sem
  chave), todos com console limpo. `PROJETO.md` com as decisões novas e
  `testes/README.md` com como rodar.

## Rodada 3: fábrica de conteúdo, ferramentas novas e Unidade 2

Etapas 14 a 19 correspondem às etapas 1 a 6 da tarefa "Fábrica de conteúdo".

- [x] **Etapa 14: Formato declarativo.** Tipos em `src/conteudo/tipos.ts`
  (`Validador`, `Acao`, `Objetivo` guiado/sozinho e ação/previsão, `Fase`
  prática/desafio, `Unidade`, `SiteAlvo`), catálogo `src/conteudo/conceitos.ts`,
  registro `src/conteudo/index.ts`, registro de tipos de fase
  `src/motor/tiposDeFase.ts`. Interpretador `src/motor/validadores.ts` (com
  resultado detalhado), executor `src/motor/executarAcao.ts` (`$0`, via
  trilha sobe pelos ancestrais) e núcleo sem React `src/motor/nucleoPainel.ts`
  (seleção, texto, atributo, esconder do Chrome, apagar, duplicar, inserir
  HTML, pilha de 50 fotos para desfazer/refazer), usado pelo
  `usePainelElementos`. Fase 1 migrada para
  `src/conteudo/ilhas/sites/elementos/unidade-1/` (id
  `sites-elementos-u1-f1`), comportamento igual (bateria Playwright antiga
  passou inteira). Progresso `ilha-sites:progresso:v2` com migração
  automática da v1 (ids renomeados, fase atual, campos novos com padrão).
- [x] **Etapa 15: Testes de conteúdo e /lab/fases.** `npm run testar:conteudo`
  (Vitest + jsdom, `vitest.config.mts`, testes em `testes/conteudo/`).
  Regras em `src/conteudo/checagens.ts` (gerais, de dados e de simulação),
  simulação headless `src/motor/simulacao.ts` (mesmo núcleo da interface),
  `montarIndice()` em `src/conteudo/indice.ts`. Testes do núcleo, dos
  validadores e da migração v1. Rota `/lab/fases` (fora da navegação):
  abre qualquer fase no primeiro objetivo, sem salvar e sem apresentações,
  com gaveta de validadores ao vivo, "Aplicar solução do objetivo atual",
  "Resetar fase", checagens rodando no navegador e índice de conceitos.
  Sabotagem de seletor conferida: a falha diz fase, objetivo, ação e motivo.
- [x] **Etapa 16: Ferramentas novas do DevTools.** Registro com `trilha`,
  `esconder`, `apagar`, `desfazer` (e refazer) e `duplicar`, cada uma com
  ícone SVG, card, apresentação (texto de mouse e de toque, "No F12 de
  verdade" conferido na doc do Chrome e no código do devtools-frontend) e
  mini demo (trilha, esconder, apagar, duplicar). Trilha
  (`TrilhaElementos`) no rodapé da árvore: `html › body › ... ›
  tag#id.classe`, clicar seleciona o ancestral (evento `trilha`), rola na
  horizontal no celular. Esconder igual ao Chrome: tecla H alterna a classe
  `__web-inspector-hide-shortcut__`, que aparece na árvore e no código, com
  a regra `visibility: hidden !important` no head do site-alvo. Apagar
  (Delete ou Backspace; seleção vai ao próximo irmão ou ao pai), duplicar
  (Shift+Alt+seta para baixo, cópia selecionada), desfazer/refazer (pilha
  de 50 fotos, Ctrl+Z e Ctrl+Shift+Z ou Ctrl+Y com o foco no painel e
  botões no topo do painel; no editor vale o do CodeMirror; a primeira
  tecla de uma digitação no código também vira foto). Menu do nó
  (`MenuNo`): botão direito, tecla Menu/Shift+F10 ou toque longo no nó (o
  toque longo em botões de ferramenta continua abrindo o card:
  `reivindicarToque`). Barra de ações no nó selecionado no celular
  (`BarraAcoesNo`, 6 botões de 44 px). No "Experimente", o cartão do
  mascote também evita as áreas liberadas. Teste:
  `testes/ferramentas-novas.mjs` (desktop e celular, apresentações).
- [x] **Etapa 17: Motor dos modos.** `useMotorFase` reescrito para prática
  e desafio, com modos de jogo `jogo`, `revisao` e `lab`
  (`src/motor/estadoMotor.ts`). Meta com antes/depois (`TelaMeta`,
  `MiniPrevia`; o depois sai de `estadoFinalDoDesafio`) no começo da
  unidade e antes do desafio, quando a unidade tem desafio. Sozinho: selo
  "Sozinho" com carinha determinada (lista, barra do celular, linha do
  balão), "Me ajuda" só até a dica, comemoração "Fez sozinho!". Previsão:
  card com opções no balão (sem "Me ajuda" antes do palpite), resultado
  com a explicação, errar não custa estrela, apresentações esperam o
  palpite. Momentos roteirizados (`eventosIniciais`, `eventoAoComecar`)
  com a animação de esbarrão (`Tropeco`); retomar no meio volta ao HTML de
  antes e roda o momento de novo. Desafio: checklist que marca as partes
  ao vivo (e elas ficam marcadas), "Me ajuda" vira "Rever" com a lista das
  partes pendentes, cada Rever custa 1 estrela (mínimo 1), salva o desafio
  e abre a fase em modo revisão (sem estrelas, sem salvar, "Voltar ao
  desafio"). Navegação: Lista de fases (gaveta ou folha) com cadeados,
  "Próxima fase" na conclusão, fase atual salva em `faseAtual`. Tutor
  recebe o modo (guiado, sozinho, desafio) calculado no servidor e só faz
  perguntas nos dois últimos.
- [x] **Etapa 18: Unidade 2, "Faxina no site" (a unidade-modelo).** Pasta
  `src/conteudo/ilhas/sites/elementos/unidade-2/` com um arquivo por fase
  (cada um explica as decisões pedagógicas no topo) e `unidade.ts` (meta e
  desafio). Sites-alvo novos em `sites/`: Jornal da Vila (banner
  `#banner-topo`, pop-up `#popup-cookies` no meio da página, três
  `article.noticia`, `#anuncio-lateral`, `#rodape`; versão limpa para a
  fase 3) e Brinquedos Arco-Íris (pop-up `#popup-oferta` flutuando,
  banner, anúncio, `#vitrine` com 4 produtos desenhados em CSS). Fases:
  família de elementos (trilha, previsão sobre o main, sozinho com a
  setinha), esconder ou apagar (previsão, esbarrão que apaga o rodapé,
  desfazer, faxina sozinho revisando edição de texto), copia e cola
  (trilha + duplicar + editar, sozinho com duas cópias) e o desafio de 5
  partes. `testar:conteudo` verde (90 testes). Jornada inteira das
  Unidades 1 e 2 em Playwright nos três layouts (`testes/unidades.mjs`) e
  retomada no meio do esbarrão (`testes/retomar.mjs`).
  Nota: o pedido previa "terminando com 5 notícias" no sozinho da fase 3,
  mas com as 3 originais, a cópia do guiado e as 2 novas são 6; o
  validador pede 6 notícias e 3 títulos novos diferentes entre si.
- [x] **Etapa 19: Guia, template, docs e testes gerais.**
  `docs/GUIA-DE-CONTEUDO.md` (voz do computadorzinho, modelo pedagógico,
  formato com tabelas de validadores e ações, escada de ajuda, previsão,
  momentos roteirizados, desafio, regras de dificuldade, limites,
  ferramentas, sites-alvo, conceitos, validador custom, passo a passo e
  checklist) e `docs/TEMPLATE-FASE.ts` (prática e desafio anotados; compila
  e passa nas regras de fase, conferido em `testes/conteudo/template.test.ts`).
  Contexto do tutor extraído para `src/lib/tutor/contextoDoTutor.ts` e
  testado. Teste de navegador da migração v1 (`testes/migracao.mjs`).
  `PROJETO.md`, `README.md` e `testes/README.md` atualizados.

## Critérios de pronto da rodada 3 (verificados na Etapa 19)

- [x] `npm run build`, `npm run lint` e `npm run testar:conteudo` (119
  testes) passam; console limpo em todos os testes de navegador.
- [x] Playwright: Unidades 1 e 2 jogadas do começo ao fim no desktop, em
  retrato (390×844, toque) e em paisagem (844×390, toque)
  (`testes/unidades.mjs`), no build de produção e no dev. Bateria inteira
  (`testes/todos.mjs`, 12 scripts) e os três cenários do tutor verdes.
- [x] Progresso antigo (v1) migra sem perda (`testes/migracao.mjs` e
  `testes/conteudo/progresso.test.ts`).
- [x] Sabotagem: trocar `#popup-cookies` por `#popup-cookie` na solução do
  objetivo 2 da fase `sites-elementos-u2-f2` faz o `testar:conteudo` falhar
  com "objetivo 2 "apagar-popup": a solucaoDeTeste quebrou na ação 2 de 2
  (apagar #popup-cookie): o seletor "#popup-cookie" não achou nenhum
  elemento". Sabotagem desfeita.
- [x] Buscas no repositório: nenhum emoji, nenhuma cor literal fora de
  `src/tema/tokens.css` e dos sites-alvo (`src/conteudo/**/sites/`),
  nenhum `NEXT_PUBLIC_GEMINI`.
- [x] Atalhos e comportamentos do Chrome conferidos na doc oficial (fonte
  do developer.chrome.com no GitHub: H esconde, Delete apaga, Ctrl+Z
  desfaz, Ctrl+Y ou Cmd+Shift+Z refaz, Shift+Alt+seta para baixo duplica,
  trilha no rodapé da aba Elements) e no código do devtools-frontend
  (classe `__web-inspector-hide-shortcut__` com `visibility: hidden
  !important`).

## Critérios de pronto (verificados na Etapa 13)

- [x] `npm run build` e `npm run lint` passam; console limpo em todos os testes.
- [x] Tutor: 503 simulado faz 4 tentativas (3 no principal + reserva); com a
  reserva respondendo o jogador vê a resposta; com tudo falhando aparece a
  fala de sobrecarga e "Tentar de novo" reenvia. Sem chave: chat desligado.
- [x] Sincronia: árvore acende código e tela; cursor no código acende árvore
  e tela; HTML quebrado ao digitar não gera erro.
- [x] Apresentações: fase do zero passa por todas na ordem; recarregar não
  repete; "Rever apresentação" e "Pular" funcionam.
- [x] Mobile (Playwright, `hasTouch`, 390×844 e 844×390): fase inteira
  jogável nos dois modos; prévia visível ao editar; giro não perde nada;
  spotlight dentro da tela sem cobrir o alvo; teclado simulado encolhe a
  prévia sem sumir.
- [x] Desktop igual ao anterior, fora o botão Ferramentas, os "?" e a sincronia.
- [x] grep: nenhum emoji, nenhuma cor fora dos tokens (exceto o site-alvo),
  nenhum `NEXT_PUBLIC_GEMINI`.

## Critérios de pronto da rodada 1 (verificados na Etapa 7)



- [x] `npm run build` e `npm run lint` passam; sem erros no console do
  navegador (testado com Playwright no Chromium, desktop e celular).
- [x] Fase jogável do início ao fim com mouse e teclado (inclusive modo
  inspecionar pelo teclado: setas + Enter).
- [x] Recarregar mantém objetivo, HTML do site, estrelas, tema, som e missão.
- [x] Trocar o tema muda painel, editor, árvore, mascote e carinhas; o
  site-alvo continua igual.
- [x] grep: nenhum emoji; nenhuma cor hex/rgb/hsl fora de `src/tema/tokens.css`
  e `src/fases/sites-elementos-1/siteAlvo.ts`; nenhum `NEXT_PUBLIC_GEMINI`.
- [x] Sem `GEMINI_API_KEY`, o jogo funciona e o chat mostra "Estou sem sinal
  agora. Tenta o botão Me ajuda!".
- [x] Editar pela árvore não recarrega o iframe (conferido com uma marca na
  janela do iframe que sobrevive à edição) nem entra em loop.

## Próximos passos sugeridos

- A zona Elementos está completa (U1 a U5). A U6 ("Página do zero"), a
  zona Estilos (E1 a E4) e a zona Layout (L1 a L4) já têm motor (rodada
  9): é trabalho da fábrica, seguindo o guia (seção 12 para CSS; a
  Bancada do documento no `/lab/fases` como exemplo de `modoDocumento`).
- Computadorzinho navegador em cima de `montarIndice()`.
- Testar num celular de verdade (Android e iPhone), principalmente o teclado
  virtual no iOS, que ainda não tem `interactive-widget`.
- Configurar `GEMINI_MODEL_RESERVA` na Vercel só se quiser outro reserva.

## Notas da sessão

- Etapa 1: `ai.google.dev` está bloqueado pela rede do ambiente; o nome do
  pacote (`@google/genai`) e do modelo (`gemini-3.8-flash`) foram confirmados
  pela busca na doc oficial e pelo README do pacote no npm.
- Etapa 16: `developer.chrome.com` está bloqueado pela rede do ambiente; a
  doc oficial foi lida pelo repositório de fontes dela no GitHub
  (GoogleChrome/developer.chrome.com) e o mecanismo de esconder pelo
  ChromeDevTools/devtools-frontend.
- Etapa 15: Vitest 5 pede `@types/node` 22 ou mais; ele subiu de 20 para 22
  (o Node do ambiente é o 22).
- Testes de navegador: o `addInitScript` do Playwright gera um aviso no
  console dos iframes com sandbox (mini prévias) em contexto de celular.
  Sem o script do teste, o jogo não gera o aviso; `errosRelevantes` ignora
  só essa mensagem.

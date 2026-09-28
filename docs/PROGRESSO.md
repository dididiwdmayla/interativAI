# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/PROGRESSO-rodadas-1-a-11.md`. Status
consolidado: `docs/ROADMAP.md` (fonte única).

**Resumo das rodadas 1 a 11:** a fábrica de conteúdo declarativo e o
`testar:conteudo`; o congelamento (`publicar:conteudo`); o painel Estilos
dentro de Elementos com o motor de cascata próprio (especificidade,
`!important`, herança, atalhos); o modo documento; a camada de trilhas,
temas, profissões, glossário e áudio; a estabilidade da bateria nos três
layouts; e as zonas Elementos (U1 a U6), Estilos (E1 a E4) e Layout (L1 a
L4) da Ilha Sites completas.

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


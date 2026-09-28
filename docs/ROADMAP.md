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
- Conteúdo: Ilha Sites › Elementos completa (U1 a U6); Estilos completa
  (E1 a E4); Layout completa (L1 a L4). Só faltam E5 (requer motor),
  Responsivo e Publicar.
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

### Em andamento

- **Rodada 12 (motores que fecham a Ilha Sites)**, etapa por etapa (detalhe
  em `docs/PROGRESSO.md`):
  - [x] Etapa 1: testes que leem o currículo (nada de "Layout planejada"
    escrito à mão: `testes/curriculo.mjs` e os testes de conteúdo derivam
    o esperado do currículo e do conteúdo registrado) e o registro dos
    portões lógicos (`logica-decisoes-u2`, sala "Por baixo do capô" e o
    motor planejado `circuito-logico` em `src/curriculo/motores.ts`).
  - [x] Etapa 2: variáveis CSS (herança, reserva, encadeadas, ciclo) e
    `@media` avaliada contra a largura da tela no motor, no painel
    Estilos (link do `var()`, valor resolvido, cabeçalho `@media`) e nos
    validadores (`larguraTela`).
  - [x] Etapa 3: E5 com o próprio jogo como site-alvo (maquete com os
    tokens reais), "Salvar como Meu tema" com aviso de contraste, o Meu
    tema no seletor e no jogo inteiro, a oficina `/meu-tema` (editar e
    apagar), `temaSalvo` e `variavelCss`.
  - [x] Etapa 4: modo dispositivo (botão e Ctrl+Shift+M, modelos, girar,
    largura livre pelas alças, zoom, iframe com a largura de verdade,
    simulação honesta dos 980 px sem meta viewport, validador
    `dispositivo`).
  - [x] Etapa 5: painel Lighthouse (aba nova, 14 verificações sobre o
    motor, notas pesadas no anel, problema levando à peça com explicação,
    `notaAuditoria` e `semProblema`).
  - [x] Etapa 6: projeto-ponte (checklist de requisitos, tutor que só
    pergunta, projeto salvo), Levar pro mundo (.zip com index.html e
    style.css pelo fflate), guia de publicação em dados com o link
    validado, Meus projetos, a ilha que acende e a P2 publicada.
  - [ ] Etapa 7: mobile, guia, liberações e bateria completa.

### Pendente de decisão

(nenhuma no momento)

### Próximo (em ordem)

1. Revisão do dia: ponto fixo no mapa com desafios curtos por revisão
   espaçada.
2. Motores das próximas ilhas (Opus), intercalados com conteúdo
   (Sonnet): E5 (o jogo como site-alvo), Responsivo (modo dispositivo),
   Publicar (auditoria, exportar, projeto-ponte), Origens (linha do
   tempo, comparador de linguagens, diagrama), Lógica (Console, execução
   de JS, depurador) junto com o motor `circuito-logico` (portões
   lógicos, `src/curriculo/motores.ts`), Páginas vivas, Rede e Servidor, IA (IA ao vivo),
   Ofício.
3. Depois que a camada de trilhas e a fábrica estiverem estáveis: portar o
   protótipo `InterativAIPLUS` como a trilha Automação industrial (ver
   "Como integrar uma trilha nova" no `PROJETO.md`).

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

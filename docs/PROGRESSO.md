# Progresso

Checklist das etapas (Ilha Sites › Zona Elementos). Cada etapa termina com
`npm run build`, `npm run lint` e (a partir da Etapa 15)
`npm run testar:conteudo` passando e um commit.

**Estado atual:** rodada 9 em andamento (painel Estilos, motor de
cascata, modo documento, ROADMAP; ver a seção dela abaixo e o
`docs/ROADMAP.md`). Antes: rodada 8 (áudio v2: música do mapa e efeitos
gravados) concluída; antes dela, a rodada 7 (sistema de áudio) e a
rodada 6 — Unidades 3, 4 e 5 da zona
Elementos produzidas (Títulos e textos, Links/imagens/id/class, Caixas e
seções). A zona Elementos está completa: U1 a U5 prontas, só a U6
("Página do zero") segue planejada, por exigir motor (modo documento
inteiro). Próximo passo: zona Estilos (`docs/MAPA-CURRICULAR.md`),
que também requer motor (aba Estilos) — parar e relatar antes de
produzir, seguindo a seção 0 do guia.

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

- A zona Elementos está completa (U1 a U5). A U6 ("Página do zero") e a
  zona Estilos (próxima da rota) pedem motor antes de produzir conteúdo
  (ver `requerMotor` em `src/curriculo/curriculo.ts`): modo documento
  inteiro (head editável) para a U6, e a aba Estilos inteira para a zona
  Estilos.
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

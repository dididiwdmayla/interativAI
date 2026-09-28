# Testes

## Conteúdo (sem navegador)

```bash
npm run testar:conteudo
```

Vitest com jsdom (`vitest.config.mts`). Os arquivos ficam em
`testes/conteudo/`: as regras de `src/conteudo/checagens.ts` viram um teste
por fase (ids, conceitos, ferramentas apresentadas, limites de texto,
emojis, previsões, soluções que cumprem cada objetivo na hora certa...),
mais o índice de conceitos, o núcleo do painel, a migração do progresso,
o congelamento dos ids publicados (`src/conteudo/publicados.json`) e
o motor de cascata (`cascata.test.ts`: especificidade, ordem, `!important`,
inline, herança, atalhos, "não sei, não risca", as edições no texto da
folha, as variáveis CSS (herança, encadeadas, reserva, ciclo, atalho com
`var()`) e as media queries contra uma tela informada (limites exatos, px,
em e rem, orientação, `and`, `or`, `not`, listas, intervalo e o que o motor
não sabe avaliar, que não se aplica)), o CSS no formato declarativo (`css.test.ts`: ações e validadores
de CSS, desfazer com HTML e CSS juntos, checagens de fase de CSS e a
Bancada de estilos), sabotagens de propósito que confirmam as mensagens das checagens
(`checagens.test.ts`: desafio cuja parte seguinte desfaz a anterior, id
publicado alterado, fase só de sozinho com conceito, `revisarEm` sem
guiado...).
A auditoria do Lighthouse (`auditoria.test.ts`: cada verificação achando o
problema e não reclamando da página certa, nomes de link e botão, o que
não se vê, o que não se aplica, contraste com variáveis, herança, fundo do
ancestral, texto grande, gradiente e `@media`, as notas pesadas e as
faixas, os validadores e as sabotagens), o modo dispositivo
(`dispositivo.test.ts`) e o Meu tema (`meuTema.test.ts`) também.
As mesmas checagens rodam no navegador em `/lab/fases` (aba Checagens).

## Áudio (sem navegador)

```bash
npm run testar:audio
```

`testes/audio/`: a voz de modem (determinismo, teto, pausas, pergunta,
humores, taxa de blips), o registro de efeitos (arquivo, sintetizado e
arquivo que falha), a tabela tela -> faixa, os manifestos em
`public/audio` (arquivos citados existem, `.webm` com `.m4a`), o manifesto
do que o jogo espera (`src/audio/manifesto.ts`) e a escolha de formato. Também rodam no
`npm run testar:conteudo`.

## Navegador

Scripts Playwright que jogam o jogo de verdade num Chromium. Sem `rota`,
`abrir()` vai direto para a fase atual do progresso (ou a primeira), em
`/fase/<id>`; o mundo é `/` e a ilha, `/ilha/<id>`. Eles usam o
Playwright do projeto ou, se não houver, o instalado globalmente
(`npm root -g`). Todos precisam do jogo no ar em `URL_JOGO`
(padrão `http://localhost:3000`).

```bash
# Tudo o que não depende do tutor (funciona com npm run dev ou npm start):
npm run dev
node testes/todos.mjs

# Tutor (só em dev, a simulação é ignorada em produção):
TUTOR_SIMULAR=sobrecarga-total npm run dev   # e então: node testes/tutor.mjs
TUTOR_SIMULAR=sobrecarga npm run dev         # e então: RESERVA=1 node testes/tutor.mjs
npm run dev  # sem GEMINI_API_KEY             # e então: SEM_CHAVE=1 node testes/tutor.mjs
```

| Arquivo | O que confere |
| --- | --- |
| `sincronia.mjs` | árvore acende código e tela; cursor no código acende árvore e tela; HTML quebrado sem erro; hover não muda a seleção |
| `ferramentas.mjs` | Pular e Esc, vistas salvas, Caixa com silhuetas, Rever apresentação, "?" abre o card certo |
| `fase-completa.mjs [desktop\|retrato\|paisagem]` | a Fase 1 do zero, com todas as apresentações na ordem, e recarregar sem repetir |
| `movel.mjs` | prévia visível ao editar, teclado simulado, alça, giro sem perder nada, spotlight nos dois modos, dica deitado |
| `ferramentas-novas.mjs` | trilha, esconder (classe do Chrome), apagar, desfazer/refazer (botões e atalhos), duplicar, menu do nó (botão direito e toque longo), barra do celular e as apresentações novas |
| `unidades.mjs [desktop\|retrato\|paisagem]` | as Unidades 1 a 6 da zona Elementos e as E1 a E4 da zona Estilos inteiras, começando pelo mapa (mundo -> ilha Sites -> card -> Jogar), com meta com antes/depois, previsões (certa e errada), esbarrão e desfazer, sozinho ("Fez sozinho!"), desafio com checklist (parte de seleção trava, parte de estado desmarca ao desfazer), Rever, revisão e volta, estrelas, Próxima fase dentro da unidade e "Voltar pra ilha" depois do desafio (ponto aceso, próximo aberto). Na E1, o painel Estilos de verdade: apresentações (painel, editar valor, caixinha, setas, seletor de cor, regra nova), + declaração e o desafio da cafeteria; U6 no modo documento; E2 a E4 com seletores, editor CSS, Calculado e cascata; no fim, Sites 10 de 14 no mundo (o total sobe conforme a Layout publica unidades) |
| `renomear-links.mjs` | renomear tag pela árvore (dois cliques, Enter, Espaço, Esc, nome inválido, desfazer/refazer, menu do nó, barra e dois toques no celular), a apresentação e o card da ferramenta nova, e links na prévia (href="#", externo com aba nova, botão do meio, quebrado, sem href, âncora que rola) no desktop e em pé |
| `layout.mjs [desktop\|retrato\|paisagem]` | a zona Layout (L1 a L4), a partir do mapa, com o progresso das zonas Elementos e Estilos JÁ SEMEADO (não repete as 35 fases que `unidades.mjs` já cobre); nenhuma ferramenta nova é apresentada (todas já vieram da zona Estilos). `UNIDADE=<id>` semeia também as unidades da Layout anteriores à pedida, para rodar só a jornada de uma unidade nova enquanto ela é escrita (ex.: `UNIDADE=sites-layout-u2 node testes/layout.mjs`) |
| `mapa.mjs [desktop\|retrato\|paisagem]` | o mundo (estados das ilhas, Opcional, computadorzinho, rola no celular), ilha em construção (placas, tudo planejado, sem texto técnico), voltar do navegador, a ilha Sites (pontos de 44 px, caminho horizontal ou vertical, cards, Jogar abre a fase), o museu das Origens, a comemoração ao concluir a U1 (ponto aceso, caminho desenhado, registrada uma vez só, 9 estrelas), deep links (recarregar mantém fase e ilha), voltar e avançar do navegador (fase -> ilha -> mundo), o botão Mapa da fase, fase trancada pelo endereço e o `/lab/mapa` (desbloquear tudo, Lista de fases, resetar) |
| `css.mjs` | CSS editável na Bancada de estilos (`/lab/fases?fase=lab-motor-u1-f1`): abas HTML e CSS do editor, digitar no CSS muda a prévia sem recarregar (marca na janela do iframe), cursor numa regra acende todas as peças dela, desfazer e refazer do painel voltam o CSS no editor e na prévia, soluções de CSS pelo lab (alternarDeclaracao, editarCss) e o CSS sobrevivendo à recarga pelo HTML |
| `estilos.mjs` | o painel Estilos dentro de Elementos na Bancada de estilos: abas de cima sem Estilos e com Fontes, ordem do Chrome (element.style, regras da que vence para a que perde, "Herdado de" só com herdáveis), riscadas, hover no seletor acendendo as peças, editar valor (Enter, Esc, prévia provisória), setas (1, Shift 10, Alt 0,1), Tab entre campos, "+ declaração", caixinha virando comentário, seletor de cor, regra nova com o seletor do Chrome, element.style, link `estilo.css:N`, desfazer; no celular em pé "Árvore \| Estilos \| Código" com alvos de 44 px e botões de seta, deitado lado a lado |
| `calculado.mjs` | a aba Calculado na Bancada de estilos: sub-abas Estilos e Calculado, diagrama com as medidas reais (padding, border, margin, zero como 0, largura do conteúdo igual à calculada, 3 casas), camadas acesas na prévia (uma por vez, todas na borda do diagrama, apagar ao sair), lista sem e com "Mostrar todas" (declaradas mais display/width/height, ordem alfabética, -webkit- no fim), filtro, rastro com a regra que vence e as riscadas, link para o editor, diagrama acompanhando edição no Estilos; no celular, tocar liga e desliga a camada e trocar de segmento apaga |
| `variaveis.mjs [desktop\|retrato]` | variáveis CSS e `@media` no painel Estilos, na Bancada de variáveis (`/lab/fases?fase=lab-motor-u1-f3`): o `var()` como link com o valor resolvido ao lado (encadeado, reserva de variável que não existe, variável sobrescrita numa regra), a prévia concordando (`getComputedStyle`), `--cor-marca` na regra `:root` do "Herdado de html", o clique no nome levando até a declaração; a regra da `@media (max-width: 600px)` só aparece quando o `matchMedia` do iframe diz que vale, com o cabeçalho `@media` acima do seletor |
| `tema.mjs [desktop\|retrato]` | E5 na Bancada do tema (`/lab/fases?fase=lab-motor-u1-f4`): a maquete do jogo com as cores reais do tema, o `var(--cor-primaria)` na regra `.botao`, a variável do `:root` editada pelo "Herdado de html" repintando a maquete ao vivo (sem recarregar), o aviso de contraste com o par ruim ("Voltar e ajustar" não salva), salvar ligando o Meu tema no jogo inteiro (progresso com o conjunto inteiro de cores), recarregar sem perder (o `<style>` do Meu tema posto antes da pintura), a maquete reabrindo com as cores salvas, o Meu tema no seletor, a oficina `/meu-tema` (editar, salvar, apagar voltando ao Doce) e o card da Caixa levando à oficina; botão de 44 px no toque |
| `dispositivo.mjs [desktop\|retrato\|paisagem]` | modo dispositivo nas bancadas de variáveis e do documento: Ctrl+Shift+M (desktop) e o botão ao lado da setinha (44 px no toque) ligam a barra; o iframe com 390 px de verdade e o `matchMedia` dele concordando com o painel Estilos (a regra da `@media` aparece e some); Tablet 768, girar (1024 de largura), Notebook 1280 com zoom e o indicador na barra; a setinha acertando a peça com a página encolhida; a alça mudando a largura (vira "Livre", o iframe acompanha); no celular, a barra numa linha e o girar com 44 px; desligar; sem meta viewport, o celular desenha em 980 px com o aviso e a fala, e desfazer volta |
| `lighthouse.mjs [desktop\|retrato\|paisagem]` | a aba Lighthouse na Bancada do Lighthouse (`/lab/fases?fase=lab-motor-u1-f5`): liberada só nas fases com a ferramenta, o aviso de versão simplificada, o Analisar com as três notas iguais às do `testar:conteudo` e as faixas (ruim, média, boa), os problemas reais da Acessibilidade, um problema explicando por que importa e levando à peça (a aba Elementos com a imagem selecionada e a fala do computadorzinho), a análise avisando que ficou velha depois de um conserto e a nota subindo para a faixa boa; no toque, Analisar e peças com 44 px |
| `documento.mjs` | o modo documento e o "Adicionar atributo" na Bancada do documento (`/lab/fases?fase=lab-motor-u1-f2`): árvore com `<!DOCTYPE html>`, raiz `<html>`, head e title (estilos do jogo escondidos), editor com a página inteira, aba com o `<title>` ao vivo, acentos quebrados sem meta charset (aviso, fala do computadorzinho, código certo), title editado pela árvore mudando a aba, meta charset pelo editor consertando tudo, atributo novo pelo botão direito (mais de um de uma vez, árvore e código, desfazer, Esc desiste) e pelo toque longo no celular |
| `explorar.mjs [desktop\|retrato\|paisagem]` | trilhas (três cards, Web padrão, escolher Automação troca as ilhas do mundo e move o computadorzinho, ilha só nomeada, escolha salva), lente de tema no mundo (progresso contando as planejadas, ilhas acesas e apagadas, contagem por ilha) e na ilha (planejada acende, X apaga), temas no card da unidade, profissões (seis cards, lente com % do caminho), painel Insígnias, glossário (busca sem acento, fase trancada leva ao ponto da unidade com o card aberto, fase liberada direto, botão dentro da fase e Voltar) e a comemoração de marco de insígnia (uma vez só) |
| `retomar.mjs` | recarregar no meio do esbarrão: a página volta, o momento roda de novo e o Desfazer vale |
| `migracao.mjs` | progresso da chave v1 migra para a v2 sem perder nada, entrando pelo mapa (computadorzinho em Sites, U1 com "Continuar", sem a meta de novo) |
| `audio.mjs` | ajustes de som (padrões, mudar pelo mouse e pelo teclado, silenciar, salvos depois de recarregar), navegação mapa -> ilha -> fase -> ilha -> mapa -> museu com o AudioContext real (faixa certa em cada tela, `mapa` no mundo, sem reiniciar entre ilha e fase, silêncio em Frameworks, boot do arquivo no primeiro gesto, momentos grandes tocando os arquivos, console limpo), efeitos em 404 caindo no sintetizado, os controles no toque, em pé, **sem arquivo nenhum** (manifestos vazios e ausentes: silêncio, momentos grandes sintetizados, nenhum arquivo pedido, console limpo) e a **pré-carga** da próxima tela provável |
| `tutor.mjs` | falas de sobrecarga, reserva e sem chave, botão Tentar de novo |

Todos falham se aparecer erro ou aviso no console do navegador.

**O que esperar do mapa vem do currículo, nunca escrito à mão.**
`testes/curriculo.mjs` lê o `src/curriculo/curriculo.ts` (transpilado
pelo TypeScript do projeto) e as unidades publicadas
(`src/conteudo/publicados.json`) e dá `CURRICULO`, `PUBLICADAS`,
`prontasDaIlha`, `planejadasDaIlha`, `unidadesDaIlha` e
`planejadaComTema`. Assim, "a primeira pronta disponível, as outras
bloqueadas, as sem conteúdo planejadas" continua certo quando uma zona
vira conteúdo (antes, `mapa.mjs` esperava "Layout planejada" e quebrava a
cada zona nova). Os testes de conteúdo fazem o mesmo com `UNIDADES` e
`CURRICULO` (`curriculo.test.ts`, `mapa.test.ts`).

```bash
npm run bateria           # a bateria inteira (testes/todos.mjs), uma vez
npm run bateria:repetir   # 5 rodadas seguidas (RODADAS=n muda), com resumo
PARALELO=2 npm run bateria  # dois arquivos ao mesmo tempo (mais rápido; a saída de cada um sai inteira no fim)
```

Critério de estabilidade: `bateria:repetir` com 5 rodadas seguidas verdes
no build de produção (`npm run build && npm start`).

## Ajudantes (`testes/util.mjs`)

| Ajudante | O que faz |
| --- | --- |
| `abrir({ largura, altura, toque, progresso })` | abre o jogo num Chromium; `progresso: null` começa do zero, um objeto grava o progresso antes |
| `progressoComFase(faseId, estadoFase, extra)` | progresso v2 com uma fase em andamento (introdução e meta vistas) |
| `pularMeta(page)` | passa pela tela de meta (antes/depois) se ela abrir; devolve `true` se passou |
| `selecionarNo(page, seletor)` | seleciona pela árvore o primeiro elemento do site-alvo que casa com o seletor CSS (clique ou toque; no celular fecha o balão e mostra a Árvore) |
| `chaveDoSeletor(page, seletor)` | só calcula o `data-chave` da linha da árvore desse elemento |
| `linhaDaArvore(page, chave)` | a linha clicável da árvore de uma chave |
| `esperarPronto(page)` | espera `[data-jogo-fase][data-pronto="sim"]` (fora de uma fase, só dois quadros); use depois de toda ação |
| `abrirBalao(page)`, `fecharBalao(page)` | no celular, abrem e fecham a conversa e esperam `data-balao` assentar; deitado, um balão aberto há tempo é reaberto (ele fecha sozinho depois do tempo de leitura) |
| `passarApresentacao(page, id, experimentar)` | espera a apresentação, passa as 3 falas, espera o "Experimente", faz a ação e confere que fechou |
| `doisQuadros(page)` | dois `requestAnimationFrame`: o React aplica o que o último gesto mudou |
| `conferir`, `errosRelevantes` | asserção com mensagem e filtro do console |

### Estados explícitos (espere estados, nunca tempos)

A fase expõe o estado no elemento `[data-jogo-fase="<id da fase>"]`:

| Atributo | Valores |
| --- | --- |
| `data-pronto` | `sim` quando nada vai mudar a tela sozinho: nenhum roteiro, nenhuma pendência (`src/lib/pendencias.ts`: roteiros agendados, a validação que espera, a espera do editor e do CSS, o cursor do editor, a prévia recarregando, a animação do balão, a troca de texto da fala, a comemoração da apresentação, a rolagem da árvore até o item selecionado) e o tutor sem pergunta no ar; senão `nao` |
| `data-apresentacao-estado` | `ativa` ou `inativa` |
| `data-objetivo-atual` | o id do objetivo, `desafio` no desafio, vazio fora dos objetivos |
| `data-etapa` | `meta`, `introducao`, `objetivos` ou `concluida` |
| `data-roteiro` | `esbarrao`, `roteiro` ou `nenhum` |

No celular, o avatar do computadorzinho tem `data-balao` (`aberto`,
`fechado`, `abrindo`, `fechando`); a camada da apresentação tem
`data-passo-apresentacao` (`fala`, `experimente`, `comemorando`); toda
janela (`Modal`: meta, card da unidade, conclusão...) tem
`data-modal-assentado="sim"` depois da animação de entrada (meça e toque
só depois).

`waitForTimeout` fica só para gesto que depende de duração (toque longo
de 750 ms) e para os testes de áudio e de mapa, que medem animação e som.
Duas regras que a instabilidade das rodadas passadas ensinou:

- **prepare a interface antes do `proximoObjetivo()`**: a apresentação do
  objetivo seguinte fica de pé assim que ele começa, e o véu só libera a
  ferramenta (o `mostrarPainel` da jornada acusa a tentativa);
- **gesto com tempo vai direto na tela**: o duplo toque precisa dos dois
  toques em menos de 350 ms, então `page.touchscreen.tap` duas vezes
  seguidas, não dois `locator.tap()`.

### O `data-chave` da árvore

Cada linha da árvore de elementos tem um `data-chave`:

- é o caminho de índices do `<body>` até o nó, separado por ponto; o
  próprio `<body>` é `"body"`, o primeiro filho dele é `"0"`, o segundo
  filho do primeiro filho é `"0.1"`;
- os índices contam só os filhos que **aparecem na árvore**: elementos,
  comentários e textos que não são só espaço (espaços e quebras de linha
  entre as tags não contam);
- um texto também tem chave: em `<li>Sonho</li>`, se o `li` é `"5"`, o
  texto é `"5.0"`.

Não calcule à mão: `selecionarNo` e `chaveDoSeletor` usam as MESMAS
funções que a árvore usa (`src/motor/chaveArvore.ts`, transpilado pelo
TypeScript do projeto e executado dentro da página), e
`testes/conteudo/chaveArvore.test.ts` confere que elas dão a mesma chave
que a árvore desenha, em todos os sites-alvo. Prefira seletores com
âncoras do site (`#aviso`, `.cardapio li`); lembre que duplicar copia o
`id`, então a cópia de `#noticia-praca` é achada por posição
(`#noticias > .noticia:nth-child(2)`).

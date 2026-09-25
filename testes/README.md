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
sabotagens de propósito que confirmam as mensagens das checagens
(`checagens.test.ts`: desafio cuja parte seguinte desfaz a anterior, id
publicado alterado, fase só de sozinho com conceito, `revisarEm` sem
guiado...).
As mesmas checagens rodam no navegador em `/lab/fases` (aba Checagens).

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
| `unidades.mjs [desktop\|retrato\|paisagem]` | as Unidades 1 e 2 inteiras começando pelo mapa (mundo -> ilha Sites -> card -> Jogar), com meta com antes/depois, previsões (certa e errada), esbarrão e desfazer, sozinho ("Fez sozinho!"), desafio com checklist (parte de seleção trava, parte de estado desmarca ao desfazer), Rever, revisão e volta, estrelas, Próxima fase dentro da unidade e "Voltar pra ilha" depois do desafio (ponto aceso, próximo aberto, U3 planejada, Sites 2 de 2 no mundo) |
| `renomear-links.mjs` | renomear tag pela árvore (dois cliques, Enter, Espaço, Esc, nome inválido, desfazer/refazer, menu do nó, barra e dois toques no celular), a apresentação e o card da ferramenta nova, e links na prévia (href="#", externo com aba nova, botão do meio, quebrado, sem href, âncora que rola) no desktop e em pé |
| `mapa.mjs [desktop\|retrato\|paisagem]` | o mundo (estados das ilhas, Opcional, computadorzinho, rola no celular), ilha em construção (placas, tudo planejado, sem texto técnico), voltar do navegador, a ilha Sites (pontos de 44 px, caminho horizontal ou vertical, cards, Jogar abre a fase), o museu das Origens, a comemoração ao concluir a U1 (ponto aceso, caminho desenhado, registrada uma vez só, 9 estrelas), deep links (recarregar mantém fase e ilha), voltar e avançar do navegador (fase -> ilha -> mundo), o botão Mapa da fase, fase trancada pelo endereço e o `/lab/mapa` (desbloquear tudo, Lista de fases, resetar) |
| `retomar.mjs` | recarregar no meio do esbarrão: a página volta, o momento roda de novo e o Desfazer vale |
| `migracao.mjs` | progresso da chave v1 migra para a v2 sem perder nada, entrando pelo mapa (computadorzinho em Sites, U1 com "Continuar", sem a meta de novo) |
| `tutor.mjs` | falas de sobrecarga, reserva e sem chave, botão Tentar de novo |

Todos falham se aparecer erro ou aviso no console do navegador.

## Ajudantes (`testes/util.mjs`)

| Ajudante | O que faz |
| --- | --- |
| `abrir({ largura, altura, toque, progresso })` | abre o jogo num Chromium; `progresso: null` começa do zero, um objeto grava o progresso antes |
| `progressoComFase(faseId, estadoFase, extra)` | progresso v2 com uma fase em andamento (introdução e meta vistas) |
| `pularMeta(page)` | passa pela tela de meta (antes/depois) se ela abrir; devolve `true` se passou |
| `selecionarNo(page, seletor)` | seleciona pela árvore o primeiro elemento do site-alvo que casa com o seletor CSS (clique ou toque; no celular fecha o balão e mostra a Árvore) |
| `chaveDoSeletor(page, seletor)` | só calcula o `data-chave` da linha da árvore desse elemento |
| `linhaDaArvore(page, chave)` | a linha clicável da árvore de uma chave |
| `conferir`, `errosRelevantes` | asserção com mensagem e filtro do console |

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

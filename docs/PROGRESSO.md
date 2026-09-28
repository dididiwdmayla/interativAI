# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/`. Status consolidado: `docs/ROADMAP.md`
(fonte única).

**Resumo das rodadas 1 a 12:** a fábrica de conteúdo declarativo e o
`testar:conteudo`; o congelamento (`publicar:conteudo`); o painel Estilos
dentro de Elementos com o motor de cascata próprio (especificidade,
`!important`, herança, atalhos, variáveis CSS e `@media`); o modo
documento; a camada de trilhas, temas, profissões, glossário e áudio; a
estabilidade da bateria nos três layouts; as zonas Elementos (U1 a U6),
Estilos E1 a E4 e Layout (L1 a L4) completas; e os motores que faltavam
para fechar a Ilha Sites (E5/Meu tema, modo dispositivo, painel
Lighthouse, projeto-ponte, Levar pro mundo) com a P2 como unidade-modelo.
Detalhe em `docs/arquivo/PROGRESSO-rodadas-1-a-11.md` e
`docs/arquivo/PROGRESSO-rodada-12.md`.

## Rodada 13: E5, R1, R2 e P1 — a Ilha Sites fica completa

Produção das quatro unidades que faltavam na Ilha Sites, todas com motor
pronto desde a Rodada 12 (`docs/GUIA-DE-CONTEUDO.md`, seções 12.7, 12.8 e
15 a 18). Um commit por etapa/unidade; atritos concretos em
`docs/ATRITOS-FABRICA.md`, "Rodada 5".

- [x] **Etapa 0: economia de cota e docs mais leves.** Seção "Economia de
  cota" no `CLAUDE.md`; `PROGRESSO.md` e `ATRITOS-FABRICA.md` só com a
  rodada mais recente (as antigas em `docs/arquivo/`); índice de seções
  no topo do `GUIA-DE-CONTEUDO.md`; `RESUMO=1` em `testes/util.mjs`
  (`conferir()` para de imprimir uma linha por checagem que passou) e o
  `--reporter=dot` do `testar:conteudo`, documentados no
  `testes/README.md`.

- [x] **E5, "Variáveis e temas"** (`sites-estilos-u5`, fecha a zona
  Estilos): a primeira unidade a usar o próprio jogo como site-alvo
  (`SITE_ALVO_DO_JOGO`). Fase 1: variável CSS e `var()`, trocando
  `--cor-primaria`, `--cor-destaque` e `--cor-fundo` no `:root`, com uma
  previsão sobre quantos lugares mudam ao trocar uma variável (ataca "é
  a peça que guarda a cor, não a variável"). Fase 2: o alcance de uma
  variável — declarada numa regra (`.fala`, `.mascote`, `.painel`), só
  vale ali e em quem está dentro, revisando a herança da E4. Fase 3:
  "Salvar como Meu tema" (ferramenta `salvar-tema`), com uma previsão
  sobre o aviso de contraste (ataca "o jogo não deixa salvar se a cor for
  ruim": ele avisa, não trava). Fase 4, desafio: criar um tema completo e
  salvar — **desvio registrado**: usa o MESMO site-alvo dos micro-passos
  (a meta da unidade é literalmente o tema do próprio jogo; não existe
  "outro site" possível aqui). 4 conceitos novos (`variavel-css`,
  `escopo-de-variavel`, `contraste-de-cor`, `salvar-como-meu-tema`).

- [x] **R1, "Modo dispositivo"** (`sites-responsivo-u1`, abre a zona
  Responsivo): Fase 1 (Padaria Trigo Dourado): ligar o modo dispositivo,
  trocar de aparelho (Celular 390, Tablet 768), uma previsão sobre o que
  o modo dispositivo faz de verdade (não é zoom: o navegador redesenha a
  página naquela largura) e girar. Fase 2 (Pet Shop Focinho Feliz, modo
  documento): a simulação de 980px sem `<meta name="viewport">`, uma
  previsão sobre a consequência disso e o conserto; mais um elemento de
  largura fixa que ainda estoura mesmo com o viewport certo (ataca "o
  meta viewport resolve tudo sozinho"). Fase 3, desafio (Academia Corpo
  em Movimento, site novo): três problemas de celular para diagnosticar
  sem passo a passo (viewport, uma foto e uma caixa com largura fixa). 3
  conceitos novos (`meta-viewport`, `simulacao-sem-viewport`,
  `orientacao-da-tela`). A partir desta unidade, a P2 deixou de
  apresentar `modo-dispositivo` (virou revisa).

- [x] **R2, "Media queries e mobile first"** (`sites-responsivo-u2`,
  fecha a zona Responsivo): Fase 1 (Estúdio Passo Leve, escrito desktop
  first): a sintaxe de `@media (max-width: ...)` e o conceito de
  breakpoint, com uma previsão sobre por que a regra "desliga" na tela
  grande. Fase 2 (Loja Verde Vivo, escrita mobile first): imagem
  responsiva (`max-width: 100%; height: auto`) e `min-width` — o oposto
  de `max-width`, ACRESCENTANDO layout conforme a tela cresce, com uma
  previsão sobre por que "o padrão já é o celular" é mais simples. Fase
  3, desafio (Restaurante Sabor da Vila, o site do `MAPA-CURRICULAR.md`,
  site novo, desktop first): junta tudo sem passo a passo. 5 conceitos
  novos (`media-query`, `breakpoint`, `mobile-first`,
  `unidade-responsiva`, `imagem-responsiva`).

- [x] **P1, "Acessibilidade e Lighthouse"** (`sites-publicar-u1`, abre a
  zona Publicar, antes da P2 na ordem do currículo): Fase 1 (Clínica
  Sorriso Novo): a aba Lighthouse de verdade pela primeira vez (Analisar,
  ler a nota), com uma previsão sobre o que um leitor de tela faz com uma
  imagem sem alt, e o conserto (revisa a U4). Fase 2 (Loja Estação Moda):
  ordem dos títulos (revisa a hierarquia da U3), uma previsão sobre o
  contraste mínimo (4,5:1) e o conserto (revisa a E5), e rótulo acessível
  (`aria-label`) num link só com ícone. Fase 3, desafio (Livraria
  Capítulo Final, site novo): os quatro problemas juntos, até
  Acessibilidade 90+. 2 conceitos novos (`auditoria-lighthouse` já
  existia; `rotulo-acessivel` é novo, com o tema `interfaces` além de
  `acessibilidade`, para a insígnia de Interfaces continuar batendo com
  as unidades de Sites concluídas — item 9 do `ATRITOS-FABRICA.md`).
  Junto (pedido do prompt): `sites-publicar-u2/fase-1-arquivos.ts`
  (P2) não apresenta mais `modo-dispositivo` nem `lighthouse` (agora
  ensinados por R1 e por esta unidade) — os dois viraram `revisa`, sem
  mudar ids nem ordem; o congelamento continuou passando.

- [x] **A Ilha Sites fica completa**: as 19 unidades das seis zonas
  (Elementos, Estilos, Layout, Responsivo, Publicar) prontas. Verificado
  em cada unidade: `testar:conteudo` (1425 → 1672 testes, todos verdes),
  TypeScript limpo (`tsc --noEmit`), as fases de prática jogadas de ponta
  a ponta em `/lab/fases` (desktop, console limpo), `publicar:conteudo`,
  `npm run build` e `npm run lint`. Sem bateria completa: prompt só de
  conteúdo, nenhum motor mudou (regra de economia de cota).

- [ ] **Pendência registrada** (não feito nesta rodada, ver
  `docs/ROADMAP.md`, "Pendências"): jornadas Playwright pelo MAPA (como
  `testes/layout.mjs` e `testes/publicar.mjs`) para E5, R1, R2 e P1, e os
  três layouts (retrato/paisagem) das fases de desafio dessas quatro
  unidades. Verificação feita: `testar:conteudo` (reproduz o mesmo motor
  de validação e ações do jogo real) e as fases de prática em
  `/lab/fases`, no desktop.

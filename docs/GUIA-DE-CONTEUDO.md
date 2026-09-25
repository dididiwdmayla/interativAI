# Guia de conteúdo

Este guia é para quem vai escrever unidades novas do jogo (pessoa ou
modelo). Ele explica o modelo pedagógico, o formato dos dados, como
escrever cada texto e como provar que a unidade funciona antes do commit.

A referência viva é a **Unidade 2, "Faxina no site"**
(`src/conteudo/ilhas/sites/elementos/unidade-2/`). Cada arquivo de fase
dela explica no topo por que foi feito daquele jeito. Na dúvida, copie o
jeito dela.

Arquivos que você vai usar:

| Arquivo | Para quê |
| --- | --- |
| `docs/TEMPLATE-FASE.ts` | template anotado de fase de prática e de desafio |
| `src/conteudo/tipos.ts` | os tipos (o TypeScript reclama de campo faltando) |
| `src/conteudo/conceitos.ts` | o catálogo de conceitos |
| `src/ferramentas/ids.ts` | as ferramentas que existem |
| `src/conteudo/index.ts` | o registro das unidades, na ordem do jogo |
| `npm run testar:conteudo` | as checagens automáticas |
| `/lab/fases` | abrir qualquer fase, ver os validadores ao vivo |

Regras do projeto que valem aqui também (ver `docs/PROJETO.md`): zero
emojis, PT-BR, cores só nos sites-alvo, nada de função dentro de fase.

---

## 1. A voz do computadorzinho

O computadorzinho é um monitor retrô fofo que fala com quem nunca
programou. Ele é:

- **Gentil e animado.** Comemora de verdade, nunca debocha, nunca culpa.
  Erro é normal ("Ops! Tropecei e apaguei o rodapé...").
- **De frases curtas.** Uma ideia por frase. Fala até 160 caracteres.
- **Sem emojis.** Nunca. A expressão do rosto faz esse papel
  (`feliz`, `curioso`, `pensativo`, `apontando`, `comemorando`,
  `preocupado`, `dormindo`).
- **Didático sem jargão solto.** Todo termo técnico é explicado na
  primeira vez que aparece, com palavras do dia a dia:
  "o `main` é o conteúdo principal da página".
- **De comparações do dia a dia.** Caixa dentro de caixa, cadeira
  reservada, fila quando alguém sai, bonecas russas.
- **Sempre ligado ao F12 de verdade.** Pelo menos uma fala por fase diz
  como aquilo funciona no navegador real ("No F12 de verdade é Ctrl+Z").
  Antes de escrever um atalho ou um comportamento do Chrome, confirme na
  doc oficial (developer.chrome.com).

Bom: "Esconder deixa a peça invisível, mas ela continua no lugar, como
uma cadeira reservada."

Ruim: "Aplique visibility hidden no nó para ocultá-lo do render tree."
(jargão sem explicação, voz de manual)

Ruim: "Muito bem!!! Você é incrível!!!" (vazio: diga O QUE ele acertou)

**Falas não têm versão de toque.** Só os enunciados têm `mouse` e
`toque`. Por isso, nas falas (ajudas, conclusões), escreva de um jeito
neutro: "Use Esconder nele", "Duplique ele", e não "clique com o botão
direito". Nos enunciados, capriche nas duas versões ("clique" / "toque").

---

## 2. O modelo pedagógico

Cada conteúdo X é ensinado como uma **unidade**:

1. **Meta.** No começo da unidade o jogador vê o X pronto: "No fim desta
   unidade, você faz isso sozinho", com o site do desafio antes e depois
   lado a lado. O "depois" é gerado sozinho aplicando as soluções das
   partes do desafio. A meta aparece de novo antes do desafio.
2. **Micro-passos (Y).** Cada habilidade aparece primeiro num objetivo
   **guiado** (ajuda completa: pergunta, dica, onde olhar, solução) e
   depois num objetivo **sozinho** (só pergunta e dica), com a mesma
   habilidade numa situação diferente.
3. **Desafio.** A última fase, num **site diferente** dos micro-passos,
   junta todas as habilidades sem passo a passo. Um checklist marca cada
   parte sozinho. Se o jogador travar, o "Rever" abre a fase onde a parte
   foi ensinada (em modo revisão, sem estrelas) e ele volta ao desafio do
   jeito que deixou. Cada "Rever" custa 1 estrela (mínimo 1).
4. **Revisão espaçada.** Sempre que der, cada fase revisita pelo menos um
   conceito de fases anteriores, **misturado na tarefa** (sem avisar "agora
   é revisão"). Liste esses conceitos em `revisa`.

Estrutura típica de uma unidade (veja a Unidade 2):

```
unidade-N/
  sites/                  sites-alvo (o dos micro-passos e o do desafio)
  fase-1-algo.ts          micro-passos: guiado(s), talvez previsão, sozinho
  fase-2-algo.ts          idem, revisando algo da fase 1
  fase-3-algo.ts          idem
  fase-4-desafio.ts       desafio no outro site
  unidade.ts              meta, desafioId e a lista de fases
```

---

## 3. O formato

Tudo é dado. O motor lê os dados e sabe validar, ajudar, roteirizar e
testar sozinho. Os tipos estão comentados em `src/conteudo/tipos.ts`.

### 3.1 Unidade

```ts
{
  id: "sites-elementos-u3",          // "<ilha>-<zona>-u<numero>"
  ilha: "Ilha Sites",
  zona: "Elementos",
  numero: 3,
  titulo: "Nome da unidade",
  meta: {
    enunciado: "No fim desta unidade, você ...",   // até 200
    desafioId: FASE_U3_F4.id,                      // o desafio (última fase)
  },
  fases: FASES_UNIDADE_3.map((fase) => fase.id),
}
```

### 3.2 Fase

Dois tipos: `pratica` (objetivos em sequência) e `desafio` (checklist de
partes). O registro de tipos (`src/motor/tiposDeFase.ts`) já está pronto
para tipos futuros (linha do tempo, comparador, diagrama de rede), mas
eles ainda não existem: não use.

Campos comuns: `id` (`"sites-elementos-u3-f1"`, nunca mude depois de
publicado), `unidadeId`, `titulo` (até 40), `conceitos`, `revisa`,
`prerequisitos`, `usaFerramentas`, `apresentar?`, `introducao`,
`eventosIniciais?`, `siteAlvo`, `conclusao`, `missaoDeCampo?` (até 320),
`falaFinal?`.

- `conceitos`: o que a fase **ensina** (no desafio: o que ele **pratica**,
  e tudo precisa ter sido ensinado na unidade).
- `revisa` e `prerequisitos`: só conceitos ensinados em fases anteriores.
- `usaFerramentas`: toda ferramenta usada, inclusive pelas soluções. Cada
  uma precisa ter sido apresentada nesta fase ou antes.
- `falaFinal`: aparece depois da missão de campo. Sem ela, a última fala
  da conclusão se repete; então escreva uma.

### 3.3 Objetivo (fase de prática)

| Campo | O que é |
| --- | --- |
| `id` | único na fase, kebab-case |
| `tipo` | `"acao"` ou `"previsao"` |
| `modo` | `"guiado"` ou `"sozinho"` |
| `enunciado` | `{ mouse, toque }`, até 140 cada |
| `validador` | quando passa, o objetivo está cumprido |
| `previsao` | só no tipo `previsao` (pergunta, 2 a 4 opções, `correta`, `explicacao`) |
| `apresentar?` | ferramentas apresentadas quando o objetivo começa |
| `eventoAoComecar?` | momento roteirizado quando o objetivo começa |
| `ajudas` | guiado: `pergunta`, `dica`, `linha`, `solucao`; sozinho: só `pergunta` e `dica` |
| `falaAoConcluir` | a comemoração |
| `solucaoDeTeste` | **obrigatória**: ações que cumprem o objetivo (testes e lab) |

### 3.4 Validadores

Textos são comparados normalizados (sem espaços nas pontas, espaços
repetidos viram um). **Quando o seletor acha vários elementos, basta UM
deles cumprir** (existe, textoIgual, textoNaoVazio, atributo, escondido,
selecionado). `contagem` conta todos e `textoDiferenteDoInicial` compara
os conjuntos de textos.

| Validador | Passa quando |
| --- | --- |
| `{ tipo: "existe", seletor }` | algum elemento casa |
| `{ tipo: "naoExiste", seletor }` | nenhum casa (foi apagado) |
| `{ tipo: "contagem", seletor, op, valor, comTexto? }` | a quantidade compara com `valor` (`==`, `>=`, `<=`, `>`, `<`); `comTexto` só conta os que têm texto |
| `{ tipo: "textoIgual", seletor, valor }` | algum tem exatamente esse texto |
| `{ tipo: "textoDiferenteDoInicial", seletor, minimo? }` | existem pelo menos `minimo` (padrão 1) textos novos, diferentes entre si, que nenhum elemento do seletor tinha no começo da fase |
| `{ tipo: "textoNaoVazio", seletor }` | algum tem texto |
| `{ tipo: "atributo", seletor, nome, valor? }` | algum tem o atributo (com esse valor, se vier) |
| `{ tipo: "escondido", seletor }` | algum está invisível **guardando o espaço** (classe de esconder do Chrome ou `visibility: hidden` no style). Apagado não conta |
| `{ tipo: "selecionado", seletor, via? }` | o selecionado agora casa (texto selecionado vale pelo elemento dono); `via`: `"arvore"`, `"inspecionar"`, `"trilha"` ou `"editor"` |
| `{ tipo: "evento", evento, minimo? }` | o evento aconteceu `minimo` vezes (padrão 1) desde que o objetivo começou |
| `{ tipo: "todos", validadores }` | todos passam |
| `{ tipo: "algum", validadores }` | algum passa |
| `{ tipo: "nao", validador }` | o de dentro não passa |
| `{ tipo: "custom", id }` | quase nunca (seção 9) |

Eventos (`evento`): `selecionou`, `inspecionou`, `trilha`, `editouTexto`,
`editouAtributo`, `editouCodigo`, `escondeu`, `mostrou`, `apagou`,
`duplicou`, `desfez`, `refez`, `respondeuPrevisao`. As ações dos momentos
roteirizados (o computadorzinho mexendo) **não contam** como eventos do
jogador.

Dicas:

- **Âncoras naturais.** Use ids e classes do site (`#popup-cookies`,
  `.noticia h3`). Nada de posição (`li:nth-child(2)`): quebra quando o
  jogador duplica ou apaga.
- **Valide o resultado, e o caminho só quando ele é o conteúdo.** "Apague
  o pop-up" é `naoExiste`. Mas "suba pela trilha" é
  `selecionado ... via: "trilha"`, e "use a setinha" pede
  `{ tipo: "evento", evento: "inspecionou" }` junto (`todos`).
- **Feche as portas erradas.** Se o erro comum é duplicar só o título, a
  `contagem` de cards pega isso. Se o objetivo é desfazer, peça o evento
  `desfez` (senão reescrever no código também passaria).
- `$0` não vale em validador; para "o que está selecionado" use
  `selecionado`.

### 3.5 Ações

Ações descrevem o que o jogador faria. O executor chama **as mesmas
funções que a interface usa** quando o jogador faz a ação à mão, então as
soluções testam o caminho real.

| Ação | O que faz |
| --- | --- |
| `{ tipo: "selecionar", seletor, via? }` | seleciona (padrão: pela árvore). Com `via: "trilha"`, sobe até o ancestral mais próximo do selecionado que casa com o seletor, como a trilha de verdade (precisa ter algo selecionado dentro dele) |
| `{ tipo: "definirTexto", seletor, valor }` | os dois cliques da árvore: seleciona o elemento e troca o texto (o elemento precisa ter só texto dentro) |
| `{ tipo: "definirAtributo", seletor, nome, valor }` | troca o valor de um atributo pela árvore |
| `{ tipo: "esconder", seletor }` | seleciona e esconde (se já está escondido, não mexe) |
| `{ tipo: "apagar", seletor }` | seleciona e apaga; a seleção vai para o próximo irmão ou para o pai |
| `{ tipo: "duplicar", seletor }` | seleciona e duplica; **a cópia fica selecionada** |
| `{ tipo: "desfazer" }` | desfaz a última mudança do painel |
| `{ tipo: "inserirHTML", seletor, posicao, html }` | o que o jogador escreveria no editor: `antes`, `depois`, `inicio` ou `fim` do elemento |
| `{ tipo: "responderPrevisao", opcao }` | responde o card de previsão (índice a partir de 0) |

Seletores de ação usam o **primeiro** elemento que casa. `"$0"` é o
selecionado (como no Console do F12) e `"$0 h3"` procura dentro dele.

Pegadinhas do `$0`:

- depois de `duplicar`, `$0` é a **cópia**;
- depois de `definirTexto`, `definirAtributo` e `esconder`, o elemento
  mexido fica selecionado: depois de `definirTexto "$0 h3"`, o `$0` passa
  a ser o `h3`;
- depois de `apagar`, a seleção vai para o próximo irmão (ou, sem ele,
  para o pai).

Duplicar copia também o `id`. Se um objetivo duplica um elemento com id,
lembre que o seletor `#id` passa a achar o original primeiro (é assim no
Chrome também).

### 3.6 Previsão

O card aparece antes, com a pergunta e as opções; o "Me ajuda" some até o
palpite (e as apresentações esperam). Depois de responder, o jogo mostra
se acertou e a `explicacao`, e o **enunciado** vira a ação para conferir
("Agora confira: selecione o main e veja o que acende"). Errar não custa
estrela.

- Pergunta concreta sobre o que VAI acontecer, até 160.
- 2 a 4 opções curtas (até 80), todas plausíveis; a errada mais comum
  deve estar lá.
- A `explicacao` dá o porquê em uma ou duas frases.
- A `solucaoDeTeste` **começa** com `responderPrevisao`. A
  `ajudas.solucao` **não** responde (o jogador já respondeu antes).
- O validador é o da ação que confere a previsão.

### 3.7 Momentos roteirizados

`eventosIniciais` (depois da introdução) e `eventoAoComecar` (quando um
objetivo começa) rodam ações feitas pelo computadorzinho, com animação
opcional:

```ts
eventoAoComecar: {
  animacao: "esbarrao",                       // ele tropeça antes
  acoes: [{ tipo: "apagar", seletor: "#rodape" }],
  fala: { texto: "Ops! Tropecei e apaguei o rodapé sem querer. Me ajuda a desfazer?", expressao: "preocupado" },
},
```

Use para criar um problema real para o jogador resolver (apagar algo por
engano, bagunçar uma lista). Se o jogador recarregar no meio, a página
volta para antes do momento e ele roda de novo. Prefira `eventoAoComecar`
do objetivo que resolve o problema: assim a fala do momento fica na tela
enquanto ele trabalha.

### 3.8 Desafio

```ts
partes: [
  {
    id: "apagar-popup",
    descricao: "Apagar o pop-up de oferta que flutua em cima da vitrine", // O QUE, nunca COMO; até 140
    validador: { tipo: "naoExiste", seletor: "#popup-oferta" },
    revisarEm: "sites-elementos-u2-f2",   // fase de prática da MESMA unidade
    solucaoDeTeste: [{ tipo: "apagar", seletor: "#popup-oferta" }],
  },
]
```

- Uma parte por habilidade da unidade. As partes não podem se misturar: a
  solução de uma não pode marcar outra.
- **Parte marcada fica marcada só se o validador dela depende de seleção ou
  evento** (`selecionado`, `evento`, ou `todos`/`algum`/`nao` que contenham
  algum deles). É o caso de "selecionar X pela trilha": são momentos, e
  desfazer não teria como voltar a eles. **As demais partes (estado da
  página: `existe`, `naoExiste`, `escondido`, `contagem`, `atributo`, texto)
  são avaliadas ao vivo a cada checagem**: se o jogador desfizer a ação, a
  parte desmarca. O desafio só conclui quando todas as partes ao vivo
  passam ao mesmo tempo e todas as travadas já foram marcadas. Pense nisso
  ao escrever o validador de cada parte: misturar os dois tipos num `todos`
  trava a parte inteira.
- Sem `apresentar` e sem ferramenta nova.
- O site é **diferente** do dos micro-passos (outro assunto, outro
  visual, outra estrutura), para o jogador aplicar e não decorar.
- As soluções das partes, aplicadas em ordem, geram o "depois" da meta:
  confira no `/lab/fases` ou na própria meta se ele ficou bonito.

---

## 4. A escada de ajuda

Cada degrau tem um trabalho. Escreva os quatro pensando no MESMO erro
provável do jogador.

1. **Pergunta (degrau 1): faz pensar, não entrega.** Aponta para a ideia,
   nunca para o botão. Bom: "Se o link mora dentro da notícia, quem é a
   casa dele?". Ruim: "Você já clicou no article da trilha?".
2. **Dica (degrau 2): o conceito.** Uma ou duas frases que ensinam a regra
   geral. Bom: "Duplicar copia a peça com tudo o que tem dentro". Pode
   lembrar a ferramenta, mas no sozinho não diz onde ela fica.
3. **Linha (degrau 3, só guiado): ONDE.** Pisca algo na tela e diz o que é:
   - `{ alvo: "arvore", seletor, parte?: "texto", fala }` pisca o nó (ou
     só o texto dele);
   - `{ alvo: "editor", seletor, fala }` pisca as linhas do código de todos
     os elementos do seletor;
   - `{ alvo: "ferramenta", ferramenta, fala }` pisca o botão ou a área de
     uma ferramenta (setinha, trilha, desfazer...).
4. **Solução (degrau 4, só guiado): O QUÊ e POR QUÊ.** Custa 1 estrela. A
   fala conta o que foi feito e por que funciona ("Dupliquei o card e
   troquei o título da cópia: a cópia nasce logo depois da original").

No **sozinho**, só existem os degraus 1 e 2 (linha e solução são
proibidas; o TypeScript e o teste acusam). O tutor, nesse modo, também só
faz perguntas.

---

## 5. Regras de dificuldade

- **Um conceito novo por objetivo.** Se o objetivo precisa de duas ideias
  novas, divida.
- **Guiado antes de sozinho**, sempre, para a mesma habilidade.
- **O sozinho muda a situação, não só o texto.** Outra peça, outro
  caminho (setinha em vez de árvore), mais de uma vez, escolher a
  ferramenta sem ser dito qual. Na Unidade 2: o guiado sobe um andar a
  partir de um link; o sozinho começa pela setinha, em outra notícia, e
  precisa achar o pai certo entre dois candidatos.
- **O sozinho não pode já começar cumprido** pelo que o guiado deixou na
  página (o teste acusa). Use contagens e `minimo` que exijam coisa nova.
- **O desafio nunca repete o site dos micro-passos.**
- **Revisão espaçada misturada.** Uma habilidade antiga usada como parte
  natural da tarefa nova (trocar o título da cópia revisa editar texto).

---

## 6. Limites e checagens de texto

| Texto | Limite |
| --- | --- |
| Fala (introdução, conclusão, ajudas, falaAoConcluir, momentos, pergunta e explicação da previsão) | 160 |
| Enunciado (`mouse` e `toque`) | 140 |
| Descrição de parte do desafio | 140 |
| Opção de previsão | 80 |
| Título da fase | 40 |
| Meta da unidade | 200 |
| Missão de campo | 320 |

- Nenhum emoji em lugar nenhum (nem nos sites-alvo). Cuidado com `©` e
  `™`, que contam como emoji para a checagem.
- `enunciado.toque` sempre preenchido.
- Não comece o enunciado sozinho com "Sozinho:": o selo já aparece.
- Toda ferramenta usada precisa ter sido apresentada antes (ou no próprio
  objetivo, com `apresentar`). Apresente cada ferramenta no primeiro
  objetivo que precisa dela, nunca antes.

---

## 7. Ferramentas

Ferramentas existentes (`src/ferramentas/ids.ts`), na ordem em que são
apresentadas:

| Id | O que é | Onde aparece |
| --- | --- | --- |
| `painel`, `previa`, `me-ajuda`, `tutor` | o painel, a tela do site, o botão de ajuda, o campo do tutor | Unidade 1 |
| `arvore` | árvore de elementos (selecionar) | Unidade 1 |
| `inspecionar` | a setinha | Unidade 1 |
| `editar-duplo-clique` | editar texto e atributo na árvore | Unidade 1 |
| `editor`, `sincronia` | código HTML e a sincronia código/árvore/tela | Unidade 1 |
| `trilha` | trilha de ancestrais no rodapé da árvore | Unidade 2 |
| `esconder`, `apagar`, `duplicar` | menu do nó (botão direito, toque longo, barra no celular) e atalhos H, Delete, Shift+Alt+seta | Unidade 2 |
| `desfazer` | desfazer e refazer (Ctrl+Z, Ctrl+Shift+Z ou Ctrl+Y) | Unidade 2 |

A ferramenta de cada ação (para a checagem de `usaFerramentas`):
`selecionar` pela árvore = `arvore`, pela setinha = `inspecionar`, pela
trilha = `trilha`, pelo editor = `sincronia`; `definirTexto` e
`definirAtributo` = `editar-duplo-clique`; `inserirHTML` = `editor`;
`esconder`, `apagar`, `duplicar`, `desfazer` = a ferramenta de mesmo nome.

Ferramenta nova (outra aba do DevTools, outra ação) é trabalho de motor,
não de conteúdo: entrada no registro (`src/ferramentas/registro.ts`),
`data-ferramenta` na interface, apresentação com mouse e toque. Não
invente ferramenta num arquivo de fase.

---

## 8. Sites-alvo

Cada site mora em `sites/` da unidade e exporta um `SiteAlvo`
(`url`, `titulo`, `head`, `body`). É "o site de outra pessoa": pode (e
deve) ter cores próprias no CSS do `head`; é a única exceção à regra das
cores do jogo.

- **Âncoras naturais:** `id` nas peças únicas que os validadores olham
  (`#banner-topo`, `#vitrine`), classes nas repetidas (`.noticia`,
  `.produto`). Pense nos seletores ao desenhar o HTML.
- **Sem imagens externas.** "Fotos" e anúncios são desenhados em CSS
  (gradientes, bordas) ou SVG dentro do HTML.
- **Sem scripts.** O iframe não roda JavaScript.
- **Responsivo:** o preview do celular tem 390 px. Use um
  `@media (max-width: 560px)` para empilhar colunas.
- **Pense no efeito visível.** Na Unidade 2, o pop-up de cookies fica NO
  MEIO da página (ocupa espaço), para que apagar mostre o conteúdo
  subindo; no desafio, o pop-up flutua por cima (atrapalha até a setinha,
  o que dá motivo para tirá-lo).
- Pode haver variações do mesmo site para fases diferentes (o Jornal da
  Vila "limpo" da fase 3).
- Nada de marca, pessoa ou empresa real. Nada de `©`.

---

## 9. Conceitos e validador custom

**Conceito novo:** acrescente no catálogo `src/conteudo/conceitos.ts`:

```ts
"elemento-irmao-anterior": {
  nome: "Irmão de cima",
  resumo: "A peça que vem logo antes de outra, dentro do mesmo pai.",
},
```

- id em kebab-case, curto, sem acento, **estável** (nunca renomeie um id
  em uso);
- `nome` como o jogador falaria; `resumo` em UMA frase de leigo;
- o conceito só entra no índice (`montarIndice()`) quando alguma fase o
  usa.

**Validador custom (quase nunca):** só quando nenhuma combinação de
`todos`, `algum`, `nao`, `contagem`, `textoIgual`... consegue dizer o que o
objetivo pede (por exemplo, conferir a ORDEM dos itens). Registre em
`src/conteudo/validadoresCustom.ts` com um comentário explicando por que o
declarativo não serve, e use `{ tipo: "custom", id }`. Os testes acusam
id não registrado. Se você está pensando em custom, provavelmente o
objetivo está pedindo coisa demais: divida.

---

## 10. Passo a passo para criar uma unidade

1. **Planeje no papel.** A meta ("No fim desta unidade, você..."), as
   habilidades (Ys), o site dos micro-passos e o do desafio (diferente).
   Para cada Y: o guiado, o sozinho (que muda a situação) e o que ele
   revisa de antes.
2. **Copie a pasta modelo.** Duplique
   `src/conteudo/ilhas/sites/elementos/unidade-2/` como `unidade-N/`.
   Troque os nomes das constantes (`FASE_UN_F1`...) e os ids
   (`sites-elementos-uN-f1`...).
3. **Faça os sites** em `sites/`, com as âncoras que os validadores vão
   usar.
4. **Escreva as fases** seguindo o `docs/TEMPLATE-FASE.ts`: um comentário
   no topo (o que ensina, revisão, por que esta ordem), depois os dados.
5. **Conceitos novos** no catálogo, se precisar.
6. **Registre:** `unidade.ts` da unidade (com `meta.desafioId`) e, em
   `src/conteudo/index.ts`, a unidade em `UNIDADES` e as fases em `FASES`,
   na ordem.
7. **Rode `npm run testar:conteudo`.** Ele diz a fase, a regra e o motivo
   de cada problema (ex.: "objetivo 3: a solucaoDeTeste quebrou na ação 1
   de 1 (apagar #popup-cookie): o seletor não achou nenhum elemento").
   Corrija até ficar verde.
8. **Jogue em `/lab/fases`.** Escolha a fase, veja os validadores ao vivo
   enquanto faz à mão, use "Aplicar solução do objetivo atual" e "Resetar
   fase". Rode as checagens pela aba Checagens. Olhe a meta com
   antes/depois (no jogo normal, na primeira fase da unidade).
9. **Jogue de verdade** pelo menos uma vez no desktop e uma no celular
   (DevTools do navegador, 390 x 844), do começo ao fim.
10. **Rode `npm run lint` e `npm run build`** e só então faça o commit.

---

## 11. Checklist final antes do commit

- [ ] Meta da unidade escrita ("No fim desta unidade, você...") e
      `desafioId` apontando para a última fase.
- [ ] Cada habilidade tem guiado e depois sozinho, e o sozinho muda a
      situação.
- [ ] Cada fase revisa algo de antes (`revisa`), misturado na tarefa.
- [ ] O desafio usa um site diferente e cada parte aponta (`revisarEm`)
      para a fase onde foi ensinada.
- [ ] Falas até 160, enunciados até 140, nenhum emoji, `toque` preenchido.
- [ ] Falas neutras (sem "clique"); enunciados com as duas versões.
- [ ] Todo termo técnico explicado na primeira vez; pelo menos uma ligação
      ao F12 de verdade por fase (atalhos conferidos na doc do Chrome).
- [ ] Pergunta socrática que não entrega; dica com o conceito; linha que
      mostra onde; solução que explica o quê e por quê.
- [ ] Seletores com âncoras naturais, sem posição.
- [ ] Ferramentas apresentadas no primeiro objetivo que usa cada uma.
- [ ] `npm run testar:conteudo`, `npm run lint` e `npm run build` verdes.
- [ ] Jogado no `/lab/fases` e de verdade (desktop e celular).
- [ ] `docs/PROGRESSO.md` atualizado.

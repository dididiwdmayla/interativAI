# Guia de conteúdo

Este guia é para quem vai escrever unidades novas do jogo (pessoa ou
modelo). Ele explica o modelo pedagógico, o formato dos dados, como
escrever cada texto e como provar que a unidade funciona antes do commit.

A referência viva é a **Unidade 2, "Faxina no site"**
(`src/conteudo/ilhas/sites/elementos/unidade-2/`). Cada arquivo de fase
dela explica no topo por que foi feito daquele jeito. Na dúvida, copie o
jeito dela.

## Índice

Leia só as seções que a tarefa pedir (regra de economia de cota do
`CLAUDE.md`).

0. Como escolher a próxima unidade
1. A voz do computadorzinho
2. O modelo pedagógico
3. O formato (unidade, fase, objetivo, validadores, ações, previsão,
   momentos roteirizados, desafio, fase só de sozinho, tela de meta)
4. A escada de ajuda
5. Regras de dificuldade
6. Limites e checagens de texto
7. Ferramentas
8. Sites-alvo
9. Conceitos e validador custom (9.1 Temas e conceitos)
10. Conteúdo publicado é congelado
11. Testes de navegador
12. Como escrever fases de CSS (12.1 site-alvo de CSS, 12.2 qual
    validador usar, 12.3 atalhos, 12.4 riscadas, 12.5 ações e
    ferramentas, 12.6 a bancada, 12.7 variáveis CSS, 12.8 `@media` e
    `larguraTela`)
13. Passo a passo para criar uma unidade
14. Checklist final antes do commit
15. E5: o próprio jogo como site-alvo
16. Modo dispositivo
17. Lighthouse (auditoria simplificada)
18. Projeto-ponte e publicação
19. Itens de revisão (Revisão do dia)
20. Zona opcional
21. Busca simulada e dados estruturados
22. Medição simulada
23. Simulador de campanha
24. Plataformas de marketing (arquivo com data)
25. Programação: a Ilha Lógica (25.1 executor, 25.2 Console e Snippet,
    25.3 validadores de código, 25.4 ações, 25.5 palco e linha do tempo,
    25.6 itens de revisão de programa, 25.7 circuito lógico, 25.8 a
    unidade-modelo)
26. Depurador da aba Fontes
27. Ordenar passos
28. Estruturas e desempenho (28.1: o custo escondido dos métodos nativos)
29. Resolução de problemas: a tela composta (plano, código, palco e
    casos de teste na mesma fase, inclusive no desafio)
30. Cenas programáveis (30.1 a área cena, 30.2 montar uma cena com o kit,
    30.3 dispositivos e relógio simulado, 30.4 validadores de cena, 30.5
    escolher dispositivos e linhas do tempo, 30.6 regra de ritmo, 30.7
    como acrescentar peças ao kit)
31. Contratos: o trabalho de fim de ilha (31.1 as etapas, 31.2 o campo
    contrato, 31.3 o briefing, 31.4 requisitos, 31.5 a mudança, 31.6 o kit
    de clientes, 31.7 validadores e fábrica, 31.8 Levar pro mundo, 31.9
    checklist, 31.10 chamados de manutenção)
32. O Museu das Origens: a área exposicao e os antepassados (32.1 a sala
    é uma fase composta, 32.2 as estações, 32.3 validadores e ações, 32.4
    o anfitrião e as falas, 32.5 os antepassados, 32.6 o corredor e a
    próxima geração, 32.7 como criar uma sala nova, 32.8 como criar um
    tipo de estação novo)

Arquivos que você vai usar:

| Arquivo | Para quê |
| --- | --- |
| `docs/MAPA-CURRICULAR.md` | o percurso inteiro: qual unidade vem agora, a meta, os conceitos, o desafio e as confusões a atacar |
| `src/curriculo/curriculo.ts` | o mesmo currículo em dados: o id, o título e a meta da unidade, e se ela requer motor |
| `docs/TEMPLATE-FASE.ts` | template anotado de fase de prática e de desafio |
| `src/conteudo/tipos.ts` | os tipos (o TypeScript reclama de campo faltando) |
| `src/conteudo/conceitos.ts` | o catálogo de conceitos |
| `src/ferramentas/ids.ts` | as ferramentas que existem |
| `src/conteudo/index.ts` | o registro das unidades, na ordem do jogo |
| `npm run testar:conteudo` | as checagens automáticas |
| `/lab/fases` | abrir qualquer fase, ver os validadores ao vivo |
| `/lab/fases?fase=<id>&modo=jogo` | jogar uma bancada como no jogo (meta, apresentações, Rever, progresso salvo) |
| `/lab/mapa` | desbloquear tudo no mapa, resetar o progresso e a Lista de fases |
| `/lab/cenas` | o kit de cenas (peças e dispositivos) nos três temas |
| `npm run publicar:conteudo` | congela os ids da unidade nova em `src/conteudo/publicados.json` |
| `docs/ROADMAP.md` | o status do projeto; atualize a seção Status no fim do trabalho |

Regras do projeto que valem aqui também (ver `docs/PROJETO.md`): zero
emojis, PT-BR, cores só nos sites-alvo, nada de função dentro de fase.

**Ao terminar qualquer trabalho (unidade, correção, rodada):** atualize a
seção Status do `docs/ROADMAP.md` (o que foi feito, o que ficou em
andamento e o próximo passo). Ele é a fonte única de status do projeto.

---

## 0. Como escolher a próxima unidade (leia antes de tudo)

1. **Siga o `docs/MAPA-CURRICULAR.md` na ordem.** A próxima unidade é a
   primeira do currículo que ainda não tem conteúdo (no mapa do jogo, o
   primeiro ponto "Em breve"). Hoje: Ilha Sites, zona Elementos, U6
   ("Página do zero", uma fase com `modoDocumento`, seção 3.2).
2. **Use o id do currículo.** A unidade nova tem o id, o título, a ilha e
   a zona que estão em `src/curriculo/curriculo.ts` (ex.:
   `sites-elementos-u3`, "Títulos e textos", "Ilha Sites", "Elementos",
   `numero: 3`). O `testar:conteudo` confere tudo isso e a ordem em
   `UNIDADES`. A unidade vira "pronta" no mapa sozinha, quando é
   registrada: ninguém marca status à mão.
3. **Regra de parada: NUNCA produza uma unidade de zona com
   `requerMotor`** (nem uma unidade que tenha `requerMotor` própria, como
   a E5). Pare e relate o que falta no motor (o texto do `requerMotor` diz
   o quê). Conteúdo não inventa ferramenta, aba nem tipo de fase: isso é
   trabalho de motor. Se mesmo assim uma unidade dessas for registrada, o
   `testar:conteudo` falha dizendo o que falta.
4. **Leia a unidade no mapa curricular inteira:** meta, conceitos,
   micro-passos sugeridos, desafio, o que revisa e as confusões de leigo
   a atacar. As confusões viram previsões e perguntas do "Me ajuda".

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

**Inglês técnico (regra para conteúdo novo, rodada 36).** A documentação,
os erros e as ferramentas de verdade falam inglês; o jogo prepara para
isso sem virar aula de inglês:

- **todo conceito novo tem `termoIngles`** (`src/conteudo/conceitos.ts`):
  o nome como aparece na documentação ("bit", "breakpoint", "event
  loop"). O glossário mostra os dois e a busca acha pelos dois;
- na primeira vez que o termo aparece numa fala, diga os dois: "o ponto de
  parada (em inglês, breakpoint)". Depois, use o nome em português;
- **de vez em quando, uma missão de campo pede ler um trecho curto da
  documentação original** (MDN, docs do Python) e achar uma coisa nele
  ("abra a página do `Array.prototype.push` na MDN em inglês e ache o que
  ele devolve: procure por Return value"). Uma por zona, mais ou menos;
  diga onde procurar, nunca peça para traduzir o texto inteiro;
- os conceitos antigos ainda não têm o termo: preencher fica para uma
  tarefa de conteúdo (ROADMAP).

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
   partes do desafio. Ela aparece uma vez só na entrada da unidade e
   sempre antes do desafio (seção 3.10).
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

**Formato padrão: guiado e sozinho da mesma habilidade moram na MESMA
fase** (modelo da Unidade 2: a fase ensina com um objetivo guiado e
termina com o sozinho dele, numa situação diferente). Separar o guiado e o
sozinho em fases diferentes é **exceção**, só quando não dá para mexer na
fase guiada: o caso real é uma fase já publicada e congelada (seção 10).
Foi o que aconteceu na Unidade 1: a Fase 1 (guiada) já estava publicada,
então o sozinho veio numa fase nova, só de treino (seção 3.9).

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
  id: "sites-elementos-u3",          // o id do currículo: "<ilha>-<zona>-u<numero>"
  ilha: "Ilha Sites",                // "Ilha " + o nome da ilha no currículo
  zona: "Elementos",                 // o nome da zona no currículo
  numero: 3,                         // a posição na zona
  titulo: "Títulos e textos",        // igual ao do currículo
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
para tipos futuros (comparador de linguagens, diagrama de rede), mas
eles ainda não existem: não use. A linha do tempo existe desde a rodada
36, como estação da área `exposicao` do museu (seção 32).

Campos comuns: `id` (`"sites-elementos-u3-f1"`, nunca mude depois de
publicado), `unidadeId`, `titulo` (até 40), `conceitos`, `revisa`,
`prerequisitos`, `usaFerramentas`, `apresentar?`, `introducao`,
`eventosIniciais?`, `siteAlvo`, `paineisElementos?`, `conclusao`,
`missaoDeCampo?` (até 320), `falaFinal?`.

- `conceitos`: o que a fase **ensina** (no desafio: o que ele **pratica**,
  e tudo precisa ter sido ensinado na unidade).
- `pratica` (só fase de prática, opcional): o que a fase **treina**,
  conceitos que já foram ensinados antes (com objetivo guiado) e aqui
  voltam só para o jogador fazer sozinho. Toda fase de prática precisa ter
  `conceitos` ou `pratica` não vazio, e um conceito não fica nos dois. No
  índice de conceitos (`montarIndice()`), `pratica` entra em "praticam".
- `revisa` e `prerequisitos`: só conceitos ensinados em fases anteriores.
- `usaFerramentas`: toda ferramenta usada, inclusive pelas soluções. Cada
  uma precisa ter sido apresentada nesta fase ou antes.
- `falaFinal`: aparece depois da missão de campo. Sem ela, a última fala
  da conclusão se repete; então escreva uma.
- `modoDocumento: true`: o jogador edita o documento INTEIRO (doctype,
  html, head e body). O editor mostra tudo ("Código da página
  index.html"), a árvore começa no `<!DOCTYPE html>` e no `<html>` (o head
  é "0", o body é "1"; o `head` do site-alvo vira o head inicial,
  editável), a aba do navegador falso mostra o `<title>` ao vivo e,
  enquanto não houver `<meta charset="utf-8">`, a prévia SIMULA os
  acentos quebrados ("CartÃ£o") com um aviso e uma fala do
  computadorzinho. Os validadores olham o texto de verdade (a quebra é só
  da tela), `existe` acha o que está no head (`head > meta[charset]`) e
  `tituloDaAba` só vale nesse modo. Exemplo: a Bancada do documento
  (`src/conteudo/laboratorio/bancadaDocumento.ts`). É o modo da U6.
- `paineisElementos` (só em fase com `siteAlvo.css`): os sub-painéis da
  aba Elementos que a fase mostra, `["estilos"]` ou
  `["estilos", "calculado"]`, como o Chrome (Styles e Computed dentro de
  Elements). Sem o campo, a aba Elementos fica como nas U1 a U5 (só
  árvore). A checagem exige `"estilos"` quando a fase usa as ações ou as
  ferramentas do painel, ou a linha `alvo: "estilos"`, e `"calculado"`
  quando usa `painel-calculado` ou `modelo-de-caixa`. O Calculado é só
  para ver (medidas de layout reais): nenhum validador olha pixels.

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
| `{ tipo: "evento", evento, minimo?, href? }` | o evento aconteceu `minimo` vezes (padrão 1) desde que o objetivo começou; com `evento: "clicouLink"`, `href` só conta cliques em links com esse href (ex.: `"#rodape"`) |
| `{ tipo: "tag", seletor, nome }` | algum elemento do seletor tem essa tag (minúsculas). Renomear mantém os atributos: `{ tipo: "tag", seletor: "#titulo", nome: "h1" }` continua achando a peça depois da troca |
| `{ tipo: "tituloDaAba", valor? }` | (modo documento) o `<title>` da página, que a aba do navegador falso mostra: igual a `valor` ou, sem `valor`, qualquer título não vazio. Olha o texto que o jogador escreveu (a quebra dos acentos é só da prévia) |
| `{ tipo: "valorEfetivo", seletor, propriedade, valor }` | (CSS) o valor que VENCE a cascata em algum elemento do seletor (declarado, herdado ou inicial), comparado normalizado; atalho confere cada propriedade longa; incerto não passa |
| `{ tipo: "declaracao", seletorRegra, propriedade, valor?, ativa? }` | (CSS) a regra tem a declaração (com o valor, se vier; `ativa: true` ligada, `false` desligada, sem `ativa` qualquer uma) |
| `{ tipo: "regraExiste", seletorRegra }` | (CSS) existe uma regra com esse seletor nas folhas do site |
| `{ tipo: "riscada", seletor, propriedade, seletorRegra }` | (CSS) em algum elemento do seletor, a declaração dessa regra perde para outra (riscada no painel); `"element.style"` é o inline |
| `larguraTela?`, `alturaTela?` (em `valorEfetivo` e `riscada`) | (CSS) confere numa tela desse tamanho: as `@media` são avaliadas contra ela (seção 12.8). Sem eles, vale a tela da prévia (o aparelho do modo dispositivo, se ligado) ou, fora da tela, 1280 x 800 |
| `{ tipo: "variavelCss", nome, valor?, seletor?, diferenteDoInicial? }` | (CSS) a variável `--nome` vale `valor` no elemento (padrão `:root`), já resolvida; `diferenteDoInicial` pede só que tenha mudado (seção 15) |
| `{ tipo: "temaSalvo" }` | (site do jogo) o jogador salvou o Meu tema; trava no checklist como `evento` |
| `{ tipo: "dispositivo", largura?, orientacao? }` | o modo dispositivo está ligado (nessa largura de layout, em `"retrato"` ou `"paisagem"`) (seção 16) |
| `{ tipo: "notaAuditoria", categoria, minimo }` | a nota da categoria (`"acessibilidade"`, `"boas-praticas"`, `"seo"`) na auditoria, calculada ao vivo, é pelo menos `minimo` (seção 17) |
| `{ tipo: "semProblema", regra }` | a auditoria não acha aquele problema (ex.: `"imagem-sem-alt"`) |
| `{ tipo: "temMediaQuery", minimo? }` | as folhas da página têm pelo menos `minimo` (padrão 1) regras `@media` |
| `{ tipo: "cabeNaTela", largura }` | a página cabe numa tela dessa largura sem rolar de lado: tem meta viewport, nenhuma largura (ou min-width) em px maior que a tela e nenhum grid com colunas em px somando mais que ela, com as `@media` valendo nessa largura (seção 18) |
| `{ tipo: "todos", validadores }` | todos passam |
| `{ tipo: "algum", validadores }` | algum passa |
| `{ tipo: "nao", validador }` | o de dentro não passa |
| `{ tipo: "custom", id }` | quase nunca (seção 9) |

Eventos (`evento`): `selecionou`, `inspecionou`, `trilha`, `editouTexto`,
`editouAtributo`, `adicionouAtributo` (criou um atributo que o elemento
não tinha, pelo "Adicionar atributo"), `editouCodigo`, `escondeu`, `mostrou`, `apagou`,
`duplicou`, `desfez`, `refez`, `respondeuPrevisao`, `renomeouTag` (trocou o
nome da tag), `clicouLink` (clicou num link da prévia, com o `href`),
`editouCss` (digitou no editor CSS), `editouPropriedade`,
`alternouDeclaracao` e `adicionouRegra` (painel Estilos), `temaSalvo`
(Salvar como Meu tema), `trocouDispositivo` e `girou` (modo dispositivo),
`auditou` (Analisar do Lighthouse) e `exportouProjeto` (Baixar .zip do
Levar pro mundo). As ações dos momentos
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
| `{ tipo: "adicionarAtributo", seletor, nome, valor }` | cria um atributo pelo "Adicionar atributo" do menu do nó (ferramenta `adicionar-atributo`); se já existe, troca o valor. Gera `adicionouAtributo` |
| `{ tipo: "esconder", seletor }` | seleciona e esconde (se já está escondido, não mexe) |
| `{ tipo: "apagar", seletor }` | seleciona e apaga; a seleção vai para o próximo irmão ou para o pai |
| `{ tipo: "duplicar", seletor }` | seleciona e duplica; **a cópia fica selecionada** |
| `{ tipo: "renomearTag", seletor, novaTag }` | seleciona e troca o nome da tag (dois cliques no nome, como no F12): atributos e filhos ficam, a peça continua selecionada. Nome igual, inválido, `html`/`head`/`body` ou tag sem conteúdo (`img`, `br`...) numa peça com filhos quebram a ação |
| `{ tipo: "clicarLink", seletor }` | clica num link da prévia (ou em algo dentro dele). A prévia **nunca navega**: âncora (`#id` que existe) rola até o alvo; externo, quebrado (`#id` que não existe) e vazio (sem href, `""` ou `"#"`) viram fala do computadorzinho; sempre gera `clicouLink` |
| `{ tipo: "desfazer" }` | desfaz a última mudança do painel |
| `{ tipo: "inserirHTML", seletor, posicao, html }` | o que o jogador escreveria no editor: `antes`, `depois`, `inicio` ou `fim` do elemento |
| `{ tipo: "responderPrevisao", opcao }` | responde o card de previsão (índice a partir de 0) |
| `{ tipo: "definirPropriedade", seletorRegra, propriedade, valor }` | (CSS) a edição do painel Estilos: troca o valor se a regra já tem a propriedade ligada, senão acrescenta |
| `{ tipo: "alternarDeclaracao", seletorRegra, propriedade }` | (CSS) liga ou desliga a declaração (a checkbox; no texto vira comentário, como no Chrome) |
| `{ tipo: "adicionarRegra", seletorRegra, declaracoes? }` | (CSS) cria uma regra nova no fim da folha |
| `{ tipo: "editarCss", posicao, texto }` | (CSS) o que o jogador escreveria no editor CSS: `inicio` ou `fim` da folha |
| `{ tipo: "salvarTema" }` | (site do jogo) "Salvar como Meu tema", confirmando mesmo com contraste ruim (seção 15) |
| `{ tipo: "trocarDispositivo", modelo, largura? }` | liga o modo dispositivo no modelo (`"celular-360"`, `"celular-390"`, `"tablet-768"`, `"notebook-1280"` ou `"livre"` com `largura`) (seção 16) |
| `{ tipo: "girarDispositivo" }` / `{ tipo: "desligarDispositivo" }` | gira o aparelho / desliga a barra de dispositivo |
| `{ tipo: "analisarAuditoria" }` | o Analisar da aba Lighthouse (seção 17) |
| `{ tipo: "levarProMundo" }` | baixa o .zip do Levar pro mundo; gera `exportouProjeto` (seção 18) |

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
- **`revisarEm` aponta sempre para a fase onde a habilidade foi ensinada
  de forma GUIADA** (a fase apontada precisa ter pelo menos 1 objetivo
  guiado; o teste acusa). O "Rever" existe para socorrer quem travou, e só
  a fase guiada tem a escada de ajuda completa. Numa unidade com guiado e
  sozinho em fases separadas (Unidade 1), aponte para a guiada (u1-f1),
  nunca para a só de sozinho (u1-f2).
- O `testar:conteudo` joga o desafio com o MESMO checklist do motor
  (`recalcularPartesFeitas`): depois de aplicar as soluções de todas as
  partes, confere que todas as partes de estado passam ao mesmo tempo e
  que as travadas foram marcadas. Se a solução de uma parte desfizer outra
  (ex.: devolver um texto que a parte anterior trocou), ele falha com
  "no fim, a parte X (avaliada ao vivo) não passa mais".

### 3.9 Fase só de sozinho (exceção)

Uma fase cujos objetivos são **todos** `sozinho` não ensina nada novo: ela
só treina. Regras (conferidas pelo `testar:conteudo`):

- `conceitos` fica **vazio** e tudo o que ela treina vai em `pratica`;
- ela não pode ter objetivo guiado nem previsão guiada (guiado ensina algo
  novo, e aí o conceito precisaria de um sozinho depois dele);
- tudo em `pratica` precisa ter sido ensinado numa fase anterior.

Use só quando o formato padrão não dá (fase guiada publicada e congelada).
Modelo: `unidade-1/fase-2.ts`.

### 3.10 A tela de meta

A meta (antes/depois do site do desafio) aparece:

- **uma vez só por unidade na entrada**: ao abrir a primeira fase da
  unidade sem nenhum progresso nela. Ao passar da meta, o id da unidade
  vai para `metasVistas` no progresso, e ela não volta (nem recomeçando a
  fase). Quem já tinha progresso na unidade não vê a meta de entrada;
- **sempre antes do desafio**: a meta é o X, então ela abre o desafio
  toda vez que ele começa do zero.

Só aparece quando a unidade tem `meta.desafioId`. A checagem confere que
ele aponta para uma fase do tipo `desafio`, da mesma unidade, e que ela é
a última da lista.

O antes e o depois saem do desafio (rodada 37): o site, a bancada, a
memória ou as áreas da tela composta. Num **contrato**, nunca o código:
com cena, a cena antes (com o programa que o cliente já tem rodando; sem
programa, o mundo parado) e depois das soluções; sem cena, a **saída do
programa** antes e depois do conserto (o console e as variáveis do
programa, com o que mudou em destaque). Quando não há o que mostrar (um
contrato em branco e sem cena), a seção não aparece: nunca caixas vazias
(`metaDoContrato`, em `src/motor/simulacao.ts`). Preencher `meta.desafioId` numa unidade já jogada não
muda nada para quem tem progresso nela, mas muda a entrada de quem começa
do zero: confira os testes de navegador que abrem o jogo do zero (eles
usam `pularMeta`, seção 11).

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
     uma ferramenta (setinha, trilha, desfazer...);
   - `{ alvo: "css", seletorRegra, propriedade?, fala }` abre a aba CSS e
     pisca as linhas da regra (ou só a da declaração);
   - `{ alvo: "estilos", seletorRegra, propriedade?, fala }` pisca o bloco
     da regra no painel Estilos (ou só a declaração). Seleciona antes uma
     peça que a regra pega, se a selecionada não for; no celular em pé,
     troca para o segmento Estilos. Exige `painel-estilos` em
     `usaFerramentas` e `"estilos"` em `paineisElementos`.
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
- **Nenhum símbolo tipográfico das faixas que o celular troca por emoji
  colorido**, mesmo sem serem "emoji" de verdade: setas (2190–21FF),
  símbolos técnicos (2300–23FF), formas geométricas (25A0–25FF), símbolos
  diversos (2600–26FF), dingbats (2700–27BF) e símbolos/setas diversos
  (2B00–2BFF) — exemplos: `✓ ✔ ★ ☆ ⚠ ▶ ◀ ↩ ⏎ ✕ ✖ ♥ ☀ ☕ ⚙`. Troque por SVG
  (interface) ou por CSS/texto (sites-alvo). Se o caractere for mesmo
  necessário, acrescente logo depois o seletor de apresentação de texto
  U+FE0E (ex.: `"↓︎"`), que impede a troca por emoji. A checagem
  `textos` (e `meta-e-desafio`) do `testar:conteudo` falha se algum desses
  símbolos aparecer sem o U+FE0E logo depois.
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
| `renomear-tag` | dois cliques (ou dois toques) no nome da tag; também no menu do nó e na barra do celular ("Renomear"). Enter ou Espaço confirmam, Esc desiste | a partir da Unidade 3 (ainda não apresentada: apresente no primeiro objetivo que renomeia) |
| `adicionar-atributo` | "Adicionar atributo" no menu do nó (botão direito; toque longo no celular), como o Add attribute do Chrome: um espaço aparece dentro da tag e o jogador escreve o atributo inteiro (`target="_blank"`, ou mais de um). Enter confirma, Esc desiste. O item só aparece nas fases que têm a ferramenta em `usaFerramentas` | fases futuras (U6 em diante); as U1 a U5 publicadas seguem sem ele |
| `editor-css` | a aba CSS do editor (a folha `estilo.css`) | Estilos |
| `painel-estilos` | o painel Estilos dentro de Elementos: `element.style`, as regras da que vence para a que perde, a folha do navegador e "Herdado de", com as riscadas e o link `estilo.css:N` | Estilos, Unidade 1 |
| `editar-valor-css` | clicar no nome ou no valor de uma declaração e digitar (Enter confirma, Esc desiste, Tab vai para o próximo campo); "+ declaração" no fim do bloco | Estilos, Unidade 1 |
| `ligar-desligar-declaracao` | a caixinha de cada declaração (desligada vira comentário no CSS) | Estilos, Unidade 1 |
| `setas-numericas` | setas no valor numérico: 1, Shift 10, Alt 0,1; no toque, botões de seta de 44 px | Estilos |
| `seletor-de-cor` | o quadradinho de cor ao lado de um valor de cor (abre o seletor do sistema) | Estilos |
| `nova-regra` | o botão "+" do painel Estilos: regra nova no fim da folha, com o seletor que o Chrome sugere (id, senão classes, senão a tag) | Estilos |
| `painel-calculado` | a sub-aba Calculado (Computed): o valor final de cada propriedade, filtro, "Mostrar todas" e o rastro (as regras que deram valor, a que vence primeiro) | Estilos (precisa de `"calculado"` em `paineisElementos`) |
| `modelo-de-caixa` | o diagrama de caixas no alto do Calculado: margin, border, padding e conteúdo com as medidas reais; passar o mouse (ou tocar) numa camada acende ela na prévia | Estilos (idem) |

A ferramenta de cada ação (para a checagem de `usaFerramentas`):
`selecionar` pela árvore = `arvore`, pela setinha = `inspecionar`, pela
trilha = `trilha`, pelo editor = `sincronia`; `definirTexto` e
`definirAtributo` = `editar-duplo-clique`; `inserirHTML` = `editor`;
`esconder`, `apagar`, `duplicar`, `desfazer` = a ferramenta de mesmo nome;
`renomearTag` = `renomear-tag`; `clicarLink` = `previa`; `editarCss` =
`editor-css`; `definirPropriedade` = `editar-valor-css`;
`alternarDeclaracao` = `ligar-desligar-declaracao`; `adicionarRegra` =
`nova-regra`. As ações de CSS só funcionam numa fase com `siteAlvo.css`
(a folha editável); as do painel pedem também `"estilos"` em
`paineisElementos`.

**Links na prévia.** O jogador pode clicar nos links do site-alvo: nada
navega. Âncora rola a prévia; os demais fazem o computadorzinho falar
("Esse link levaria para: https://..." e, com `target="_blank"`, "(numa
aba nova)"; link quebrado e vazio têm fala própria). A fala só entra
durante os objetivos (fora da conversa, das pausas e do card de previsão).

Ferramenta nova (outra aba do DevTools, outra ação) é trabalho de motor,
não de conteúdo: entrada no registro (`src/ferramentas/registro.ts`),
`data-ferramenta` na interface, apresentação com mouse e toque. Não
invente ferramenta num arquivo de fase.

---

## 8. Sites-alvo

Cada site mora em `sites/` da unidade e exporta um `SiteAlvo`
(`url`, `titulo`, `head`, `body` e, nas fases de CSS, `css`: a folha
editável, que aparece na aba CSS do editor como `estilo.css`). É "o site de outra pessoa": pode (e
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
- **Links:** a prévia nunca navega. Âncora (`href="#id"`) rola até o
  elemento; link externo, quebrado (`#id` que não existe) ou vazio (sem
  href, `""` ou `"#"`) faz o computadorzinho falar para onde levaria. Para
  ensinar links (U4), use `clicarLink` nas soluções e o validador
  `{ tipo: "evento", evento: "clicouLink", href }`. Endereços externos
  sempre de mentirinha (`https://exemplo.site/...`).

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

### 9.1 Temas e conceitos

- **Todo conceito novo precisa de temas** (`temas` no catálogo, pelo
  menos um, dos ids de `src/curriculo/temas.ts`). Pergunte: "quem procura
  esse assunto no mapa, procura por qual tema?". Um conceito de CSS é
  Interfaces; se ele muda quem consegue usar a página (alt, títulos, rem),
  também é Acessibilidade; um gesto do F12 é Ferramentas do ofício.
- **Toda unidade nova do currículo declara temas** (`temas` em
  `src/curriculo/curriculo.ts`), mesmo planejada: é o que acende ela na
  lente do mapa. Quando a unidade fica pronta, os temas passam a vir dos
  conceitos das fases dela; os declarados precisam estar contidos nesses
  (o `testar:conteudo` acusa: "declara o tema X, mas nenhum conceito que
  ela ensina ou pratica tem esse tema"). Se acusar, ou falta o tema num
  conceito, ou o tema declarado não é assunto da unidade.
- Tema novo só com motivo (um assunto que atravessa ilhas e não cabe em
  nenhum): entra no catálogo com ícone (`IconeTema`) e, se fizer sentido,
  nas profissões.

## 10. Conteúdo publicado é congelado

**Nunca mude ids publicados; isso apaga o progresso de quem já jogou.** O
progresso guarda fases concluídas, estrelas e fases em andamento pelo id
da fase, o objetivo atual pela POSIÇÃO na lista de objetivos, o checklist
do desafio pelos ids das partes e a meta vista pelo id da unidade.

- `src/conteudo/publicados.json` guarda os ids de todas as unidades
  (com as fases em ordem), fases e objetivos (ou partes) publicados.
- `npm run testar:conteudo` falha se algum id publicado sumir ou mudar:
  fase renomeada, objetivo renomeado, objetivos em outra ordem, fase
  inserida numa unidade publicada. A mensagem diz o que era e o que ficou.
- Texto, dica, validador e site de uma fase publicada podem melhorar à
  vontade; o que não muda são os ids e a ordem.
- Precisa de um objetivo novo numa habilidade publicada? Ele vai numa
  fase nova de uma unidade nova (ou, como na Unidade 1, numa fase nova
  que ainda não foi publicada).
- Ao publicar uma unidade nova: `npm run publicar:conteudo`. Ele se recusa
  a gravar se algum id publicado sumiu ou se alguma checagem falha, e
  então grava o registro com tudo o que está no jogo agora. Faça o commit
  do `publicados.json` junto com a unidade.

## 11. Testes de navegador

Os scripts Playwright ficam em `testes/` (como rodar: `testes/README.md`).
Ao estender um deles para a sua unidade, use os ajudantes de
`testes/util.mjs`:

- `pularMeta(page)`: passa pela tela de meta se ela abrir (o jogo do zero
  abre com a meta da Unidade 1);
- `selecionarNo(page, seletor)`: seleciona pela árvore o primeiro elemento
  do site-alvo que casa com o seletor CSS (clique ou toque);
- `chaveDoSeletor(page, seletor)`: o `data-chave` da linha da árvore
  desse elemento, para as outras ações (menu do nó, editar texto);
- `esperarPronto(page)`: espera a fase ficar estável (ver abaixo). Use
  depois de toda ação, no lugar de `waitForTimeout`;
- `abrirBalao(page)` e `fecharBalao(page)`: no celular, abrem e fecham a
  conversa esperando a animação acabar (no desktop não fazem nada);
- `passarApresentacao(page, id, experimentar)`: uma apresentação de
  ferramenta inteira (3 falas, o "Experimente", confere que fechou).

**Espere estados, nunca tempos.** A fase expõe o estado no elemento
`[data-jogo-fase]`: `data-pronto="sim"` quando nada vai mudar a tela
sozinho (nenhum roteiro, temporizador, recarga da prévia, animação do
balão ou tutor pensando), `data-apresentacao-estado="ativa|inativa"`,
`data-objetivo-atual="<id>"`, `data-etapa` e `data-roteiro`; o avatar do
celular tem `data-balao="aberto|fechado|abrindo|fechando"`; a camada da
apresentação tem `data-passo-apresentacao="fala|experimente|comemorando"`.
`waitForTimeout` só vale para gesto que depende de duração (o toque
longo de 750 ms). Timer novo no motor que muda a tela sozinho entra como
pendência (`agendarRastreado` ou `comecarPendencia`, `src/lib/pendencias.ts`),
senão o `data-pronto` mente.

**Prepare a interface antes do `proximoObjetivo()`.** A apresentação do
objetivo seguinte aparece assim que ele fica ativo, e o véu só libera a
ferramenta. Trocar de segmento (Árvore, Código, Estilos), de aba do
editor ou de sub-aba (Calculado) vai ANTES do clique em "Próximo
objetivo"; o `mostrarPainel` da jornada acusa se alguém tentar trocar
com uma apresentação de pé.

**Gestos com tempo vão direto na tela.** O duplo toque da árvore precisa
dos dois toques em menos de 350 ms: use `page.touchscreen.tap` duas vezes
seguidas (as checagens de ação de dois `locator.tap()` podem passar disso).

O `data-chave` é o caminho de índices do `<body>` até o nó ("body", "0",
"0.1"...), contando só o que aparece na árvore: elementos, comentários e
textos que não são só espaço. O texto de `<li>Sonho</li>` (li "5") é
"5.0". Não calcule à mão: os ajudantes usam as mesmas funções da árvore
(`src/motor/chaveArvore.ts`).

Endereços: `abrir()` sem `rota` vai direto para `/fase/<faseAtual>` (ou a
primeira fase); o mundo é `/` e a ilha, `/ilha/<id>`. A jornada completa
(`testes/unidades.mjs`) começa no mapa: mundo, ilha Sites, card da
unidade, "Jogar", e depois do desafio "Voltar pra ilha". Unidade nova:
estenda essa jornada, e confira no fim que o ponto dela acende e que o
próximo aparece "Em breve".

---

## 12. Como escrever fases de CSS

A zona Estilos (e a Layout) mexe na APARÊNCIA do site pela folha de
estilo, sem tocar no HTML. Tudo aqui vale junto com as seções 3 a 11: o
formato, a escada de ajuda, as previsões e as checagens são os mesmos. O
modelo é a E1, "A aba Estilos" (`src/conteudo/ilhas/sites/estilos/unidade-1/`):
cada arquivo de fase explica no topo as decisões (ordem, validadores,
revisão espaçada, confusões atacadas), como a Unidade 2 faz para HTML.

### 12.1 O site-alvo de CSS

- Escreva a folha editável em `siteAlvo.css`. Ela aparece na aba CSS do
  editor como `estilo.css` e no painel Estilos, e é a segunda fonte de
  verdade (ao lado do body). O `head` continua fixo: deixe nele só o
  `meta charset`, o `viewport` e o `title` (um `<style>` no head também
  entra na cascata, mas aparece como "(index)" e não dá para editar).
- Ligue os sub-painéis na fase: `paineisElementos: ["estilos"]` (e
  `"calculado"` a partir da E3, Modelo de caixa).
- **`@media` pode (desde a Rodada 12).** O motor avalia a condição contra
  uma tela informada, igual no navegador e no jsdom (seção 12.8). Sem
  modo dispositivo na fase, a prévia usa a largura da janela; os
  validadores, a da prévia (ou 1280 px fora da tela). Numa fase sem o
  modo dispositivo, prefira páginas que funcionem numa coluna só.
- Deixam o motor incerto: `@layer`, `@import`, CSS aninhado e
  `@container` (nada fica riscado na página inteira), e `@media` com
  condição que ele não sabe avaliar (essa regra NÃO se aplica: ver 12.8).
- Folha começando "sem graça de propósito" ajuda: nome apagado, preço
  quase invisível, tudo à esquerda. O jogador vê o antes e o depois.

### 12.2 Qual validador usar

| Quero conferir... | Use |
| --- | --- |
| como a peça APARECE (a cor que ganhou, o tamanho que ganhou) | `valorEfetivo` |
| que o jogador escreveu (ou desligou) uma declaração numa regra | `declaracao` (com `ativa: false` para "desligou") |
| que ele criou uma regra | `regraExiste` (ou, melhor, `valorEfetivo` no elemento: aceita qualquer seletor que pegue a peça) |
| que uma declaração perdeu a briga (E4, cascata) | `riscada` |

- **Prefira `valorEfetivo`.** Ele confere o resultado, não o caminho: o
  jogador pode editar pelo painel, digitar no editor CSS ou criar uma regra
  mais específica, e tudo vale. Use `declaracao` quando o caminho é o
  conteúdo (desligar pela caixinha, escrever naquela regra).
- `valorEfetivo` compara o valor DECLARADO que ganhou, normalizado: cores
  em qualquer formato (`red` = `#f00` = `rgb(255, 0, 0)`), números
  (`16.0px` = `16px`, `0px` = `0`), espaços, aspas de fonte e `bold` =
  `700` no `font-weight`. Ele NÃO converte unidades: `2em` não é `32px`.
- Herança conta: `valorEfetivo` de `color` num `p` sem regra própria vem
  do ancestral que declarou. E a folha do navegador também: um `h1` é
  `bold` sem regra nenhuma do site.
- Atalho no validador confere cada propriedade longa:
  `{ propriedade: "margin", valor: "0 auto" }` pede `margin-top: 0`,
  `margin-right: auto`...
- `valorEfetivo` só em propriedade que o motor conhece (cores, medidas,
  margens, bordas, fonte, texto, display, position, flex, grid...). A
  checagem acusa as outras (`box-shadow`, `transition`...): para elas,
  use `declaracao`.
- Objetivo "troque por uma cor qualquer": `todos` com
  `declaracao ... ativa: true` e `nao` do `valorEfetivo` antigo (e do
  `transparent`), para um valor inválido não passar.

### 12.3 Atalhos (shorthands)

- `margin`, `padding`, `border` (e lados), `background`, `font`, `gap`,
  `flex`, `inset`, `overflow`, `text-decoration` e `list-style` são
  abertos nas propriedades longas. Um `margin-top` depois de um `margin`
  derruba só a parte de cima; um `margin` depois de um `margin-top`
  derruba o `margin-top` inteiro.
- O painel risca um atalho só quando TODAS as partes dele perderam (como
  o Chrome); a setinha ao lado mostra as partes riscadas.
- Atalho que o motor não sabe separar (`background` com várias camadas ou
  com `/`, `font` com nome de sistema, `border-radius` com `/`): a
  propriedade vale, mas o valor das partes fica "incerto". Em fase, prefira
  as longas (`background-color`, `font-size`).

### 12.4 Como o motor decide o que fica riscado

1. Pega as regras que casam com o elemento (`element.matches`), o estilo
   inline e a folha do navegador. Pseudo-classes de estado (`:hover`,
   `:focus`) não contam.
2. Ordena por: importância e origem (`!important` do navegador, do site,
   depois as normais do site e as do navegador), inline, especificidade
   (a do seletor da lista que casa) e ordem na folha.
3. Para cada propriedade longa, a primeira declaração válida vence; as
   outras ficam riscadas. Valor inválido (`color: vermelho`) é riscado com
   aviso e não conta.
4. Herdadas: a própria vence a herdada; entre ancestrais, o mais perto
   vence.
5. **Quando não sabe, não risca**: valor que o motor não conhece no topo,
   atalho que ele não separa, lógica misturada com física
   (`margin-inline-start` com `margin-left`), folha com `@layer`. Ele
   prefere deixar de riscar a riscar errado, e o `valorEfetivo` diz
   "incerto" (o detalhe no `/lab/fases` e no teste diz por quê).

### 12.5 Ações e ferramentas

| Ação | Ferramenta (usaFerramentas) |
| --- | --- |
| `definirPropriedade` | `editar-valor-css` |
| `alternarDeclaracao` | `ligar-desligar-declaracao` |
| `adicionarRegra` | `nova-regra` |
| `editarCss` | `editor-css` |

As setas (`setas-numericas`) e o seletor de cor (`seletor-de-cor`) não
têm ação própria: a solução usa `definirPropriedade` com o valor final;
apresente a ferramenta no objetivo que pede o gesto. Linhas de ajuda:
`{ alvo: "estilos", seletorRegra, propriedade?, fala }` pisca a regra no
painel Estilos; `{ alvo: "css", seletorRegra, propriedade?, fala }` pisca
as linhas no editor CSS.

### 12.6 A bancada

`/lab/fases?fase=lab-motor-u1-f1` abre a Bancada de estilos (fora do
currículo): uma página com atalhos, `!important`, inline, herança e uma
declaração desligada, para ver o motor trabalhando antes de escrever a
fase. As outras bancadas: `f2` (modo documento com dispositivo), `f3`
(variáveis e `@media`), `f4` (o site do jogo e o Meu tema) e `f5`
(Lighthouse).

### 12.7 Variáveis CSS

- `--nome: valor` é herdada, como no Chrome: declare no `:root` (ou numa
  peça) e use com `var(--nome)` em qualquer descendente.
  `var(--nome, reserva)` usa a reserva quando a variável não existe;
  pode encadear (`var(--a, var(--b, red))`).
- Ciclo (`--a: var(--b); --b: var(--a)`): as variáveis do ciclo ficam
  inválidas, e a propriedade que as usa volta ao herdado ou ao inicial
  (a "inválida na hora de calcular" da especificação). O motor e o
  painel concordam.
- No painel Estilos, as variáveis aparecem na regra onde foram
  declaradas (e no "Herdado de"); o `var(--nome)` mostra o valor ao lado
  e é um link até a declaração. `valorEfetivo` compara o valor JÁ
  RESOLVIDO: `{ propriedade: "color", valor: "#1d5c8a" }` passa com
  `color: var(--destaque)` se `--destaque` vale isso.
- Para conferir a própria variável, use `variavelCss` (seção 15).

### 12.8 `@media` e `larguraTela`

- O motor avalia `min-width`, `max-width`, `width` e as de altura (px, em
  e rem, com 16 px por em), `orientation`, `and`, `or`, `not`, `only`,
  os tipos `all`, `screen` e `print`, listas com vírgula e a sintaxe de
  intervalo (`(400px <= width < 800px)`). O que ele não sabe avaliar
  (`prefers-color-scheme`, `hover`, `vw` na condição) NÃO SE APLICA.
- A tela vem, nesta ordem: do `larguraTela`/`alturaTela` do validador; do
  modo dispositivo, se ligado (a largura de LAYOUT: sem meta viewport num
  celular, 980 px); da prévia; e, fora da tela, 1280 x 800.
- O painel Estilos só lista a regra de `@media` que vale na largura atual
  e mostra o cabeçalho `@media (...)` acima do seletor, como o Chrome.
- Para conferir o site em várias larguras no mesmo objetivo, use `todos`
  com o mesmo `valorEfetivo` em `larguraTela: 390` e `larguraTela: 1280`.

---

## 13. Passo a passo para criar uma unidade

1. **Escolha a unidade** pela seção 0: a próxima do
   `docs/MAPA-CURRICULAR.md`, com o id do currículo. Zona (ou unidade) com
   `requerMotor`: pare e relate.
2. **Planeje no papel.** A meta ("No fim desta unidade, você..."), as
   habilidades (Ys), o site dos micro-passos e o do desafio (diferente).
   Para cada Y: o guiado e o sozinho **na mesma fase** (formato padrão),
   com o sozinho mudando a situação, e o que ele revisa de antes.
3. **Copie a pasta modelo.** Duplique
   `src/conteudo/ilhas/sites/elementos/unidade-2/` como `unidade-N/`.
   Troque os nomes das constantes (`FASE_UN_F1`...) e os ids
   (`sites-elementos-uN-f1`...).
4. **Faça os sites** em `sites/`, com as âncoras que os validadores vão
   usar.
5. **Escreva as fases** seguindo o `docs/TEMPLATE-FASE.ts`: um comentário
   no topo (o que ensina, revisão, por que esta ordem), depois os dados.
6. **Conceitos novos** no catálogo, se precisar.
7. **Registre:** `unidade.ts` da unidade (com `meta.desafioId`) e, em
   `src/conteudo/index.ts`, a unidade em `UNIDADES` e as fases em `FASES`,
   na ordem.
8. **Rode `npm run testar:conteudo`.** Ele diz a fase, a regra e o motivo
   de cada problema (ex.: "objetivo 3: a solucaoDeTeste quebrou na ação 1
   de 1 (apagar #popup-cookie): o seletor não achou nenhum elemento").
   Corrija até ficar verde.
9. **Jogue em `/lab/fases`.** Escolha a fase, veja os validadores ao vivo
   enquanto faz à mão, use "Aplicar solução do objetivo atual" e "Resetar
   fase". Rode as checagens pela aba Checagens. Olhe a meta com
   antes/depois (no jogo normal, na primeira fase da unidade).
10. **Jogue de verdade, começando pelo mapa**, pelo menos uma vez no
    desktop e uma no celular (DevTools do navegador, 390 x 844), do começo
    ao fim: mundo, ilha, o ponto da unidade nova, as fases, o desafio e a
    volta para a ilha (o ponto acende). No `/lab/mapa`, "Desbloquear tudo"
    abre a unidade sem jogar as anteriores.
11. **Estenda os testes de navegador** se a unidade trouxer algo novo
    (seção 11), e rode a bateria (`node testes/todos.mjs`).
12. **Ao terminar a unidade:** `npm run publicar:conteudo` (congela os ids
    dela em `src/conteudo/publicados.json`; ele se recusa se algum id
    publicado sumiu ou se alguma checagem falha), depois as checagens
    (`npm run testar:conteudo`, `npm run lint`, `npm run build`) e só então
    o commit, com o `publicados.json` junto.

---

## 14. Checklist final antes do commit

- [ ] Meta da unidade escrita ("No fim desta unidade, você...") e
      `desafioId` apontando para a última fase.
- [ ] Cada habilidade tem guiado e depois sozinho, e o sozinho muda a
      situação.
- [ ] Cada fase revisa algo de antes (`revisa`), misturado na tarefa.
- [ ] O desafio usa um site diferente e cada parte aponta (`revisarEm`)
      para a fase onde foi ensinada de forma guiada.
- [ ] Guiado e sozinho da mesma habilidade na mesma fase (fase só de
      sozinho só como exceção, com `conceitos` vazio e tudo em `pratica`).
- [ ] Nenhum id publicado mudou; unidade nova publicada com
      `npm run publicar:conteudo`.
- [ ] A unidade é a próxima do `docs/MAPA-CURRICULAR.md`, com o id, o
      título, a ilha e a zona do currículo, e a zona não tem `requerMotor`.
- [ ] Jogada começando pelo mapa, e o ponto dela acende ao concluir.
- [ ] Falas até 160, enunciados até 140, nenhum emoji, `toque` preenchido.
- [ ] Falas neutras (sem "clique"); enunciados com as duas versões.
- [ ] Todo termo técnico explicado na primeira vez; pelo menos uma ligação
      ao F12 de verdade por fase (atalhos conferidos na doc do Chrome).
- [ ] Pergunta socrática que não entrega; dica com o conceito; linha que
      mostra onde; solução que explica o quê e por quê.
- [ ] Todo conceito novo com `temas`; os `temas` da unidade no currículo
      contidos nos que os conceitos dela dão (seção 9.1).
- [ ] Testes de navegador esperando estados (`esperarPronto`,
      `abrirBalao`, `fecharBalao`), nunca `waitForTimeout` (seção 11).
- [ ] Seletores com âncoras naturais, sem posição.
- [ ] Ferramentas apresentadas no primeiro objetivo que usa cada uma.
- [ ] Unidade nova da Lógica: pelo menos uma fase com cena, diferente das
      anteriores (outro ambiente, outro dispositivo ou outra missão; seção
      30.6), sem `[aviso de cena]` no `testar:conteudo`.
- [ ] Fim de ilha: um contrato (seção 31.9), com a jogada inteira verde no
      `testar:conteudo` e a jornada nos três layouts.
- [ ] Fase de CSS (seção 12): `@media` só com condição que o motor sabe
      (12.8),
      `paineisElementos` ligado, `valorEfetivo` onde o resultado importa e
      `declaracao` onde o caminho importa; nada "incerto" no
      `/lab/fases`.
- [ ] `npm run testar:conteudo`, `npm run lint` e `npm run build` verdes.
- [ ] Jogado no `/lab/fases` e de verdade (desktop e celular).
- [ ] `docs/PROGRESSO.md` atualizado.
- [ ] Seção Status do `docs/ROADMAP.md` atualizada.

---

## 15. E5: o próprio jogo como site-alvo

- `siteAlvo: SITE_ALVO_DO_JOGO` (de `src/motor/siteDoJogo.ts`), sem
  `css` e sem `modoDocumento`: a maquete (barra, pedaço do mapa, painel,
  computadorzinho, botões) é desenhada só com `var(--cor-*)`; a folha
  editável é um `:root` com os tokens REAIS do tema do jogador, montado
  quando a fase abre (nos testes, o tema Doce). Nenhuma cor literal no
  conteúdo: troque cores com `variavelCss` e `diferenteDoInicial`.
- "Salvar como Meu tema" (ferramenta `salvar-tema`, botão na barra de
  endereço da prévia): confere o contraste dos 7 pares principais (4,5:1)
  e deixa salvar mesmo abaixo, avisando. Valide com `temaSalvo` e use a
  ação `salvarTema` na solução. A checagem `site-do-jogo` acusa
  `temaSalvo` e `salvarTema` fora do site do jogo.
- O Meu tema se edita e se apaga depois na oficina `/meu-tema` (o card da
  ferramenta leva até lá).

## 16. Modo dispositivo

- Ferramentas `modo-dispositivo` (botão ao lado da setinha e
  Ctrl+Shift+M, como no Chrome) e `girar-dispositivo` (na barra de
  dispositivo). Modelos: Celular 360 e 390, Tablet 768, Notebook 1280, e
  largura livre arrastando as alças. O iframe ganha a largura de verdade,
  então as `@media` reagem de verdade.
- Sem `<meta name="viewport">` num celular, a prévia desenha em 980 px e
  encolhe (a regra dos navegadores de celular), com o aviso "simulação" e
  uma fala; é o jeito de ensinar por que o viewport importa.
- Validador `dispositivo` (largura e orientação), eventos
  `trocouDispositivo` e `girou`, ações `trocarDispositivo` (modelo e, no
  livre, largura), `girarDispositivo` e `desligarDispositivo`. A checagem
  pede `modo-dispositivo` em `usaFerramentas` para o validador.

## 17. Lighthouse (auditoria simplificada)

- Ferramenta `lighthouse`: a aba de cima com o aviso de versão
  simplificada e o Analisar. Três categorias (Acessibilidade, Boas
  práticas, SEO básico) com nota de 0 a 100 no anel (faixas como no
  Lighthouse: 90 ou mais boa, 50 a 89 média). As 14 verificações moram em
  `src/motor/auditoria.ts` (pesos, textos de leigo e a regra de cada uma)
  e rodam no motor, então o `testar:conteudo` vê as mesmas notas.
- Cada problema abre a peça na árvore e o computadorzinho explica por que
  importa. Valide com `notaAuditoria` (nota mínima) ou `semProblema`
  (uma verificação); use a ação `analisarAuditoria` na solução e o evento
  `auditou` quando o objetivo é RODAR a análise.
- As notas são calculadas ao vivo: numa página quase vazia, a nota é alta.
  Para "confira no Lighthouse", junte o evento `auditou` com a nota
  (`todos`), como faz a P2.

## 18. Projeto-ponte e publicação

O modelo é a P2, "Do jogo pro mundo"
(`src/conteudo/ilhas/sites/publicar/unidade-2/`).

- Tipo `projeto-ponte` (`FaseProjetoPonte`): o site do PRÓPRIO jogador,
  sempre com `modoDocumento: true`, `siteAlvo.css` (vira o style.css),
  `nomeDoProjeto` (até 40 caracteres, aparece em Meus projetos e no nome
  do .zip) e `levar-pro-mundo` em `usaFerramentas`. Não apresenta
  ferramenta nenhuma e só pratica conceitos ensinados antes (as
  checagens acusam).
- `requisitos` em vez de objetivos: cada um com `id`, `descricao` (até
  140), `validador`, `pergunta` (até 160: é o que o "Me faz uma pergunta"
  fala, uma de cada requisito que falta, em rodízio) e `solucaoDeTeste`.
  Eles se marcam sozinhos como as partes do desafio: os de estado são
  conferidos ao vivo, os com evento travam. Nenhum pode passar no começo,
  e a solução de um não pode marcar outro.
- O ponto de partida é quase vazio de propósito (o `title` vazio, um
  recado no body, um CSS básico sem `@media`). Para requisitos que uma
  página vazia já cumpriria (nota alta, nada cortado), peça a ferramenta
  junto: `auditou` com `notaAuditoria`, `dispositivo` com `cabeNaTela`.
- O projeto fica salvo em Meus projetos (`/projetos`) e sobrevive ao
  "Jogar de novo" da ilha; só o Recomeçar da fase zera o site.
- Levar pro mundo (ferramenta `levar-pro-mundo`, só com modo documento e
  `siteAlvo.css`): baixa um .zip com `index.html` (o documento do jogador,
  com a linha `<link rel="stylesheet" href="style.css">` posta no fim do
  head se faltar) e `style.css` (a aba estilo.css). Valide com o evento
  `exportouProjeto`; na solução, a ação `levarProMundo`.
- O guia de publicação é DADO, em `src/conteudo/publicacao.ts`: passos
  com id estável (ficam no progresso), a data `verificadoEm` e as outras
  opções. Quando a plataforma mudar, atualize os passos e a data, sem
  mexer em código; confira de novo antes de publicar uma versão. O campo
  do link só confere o formato (https:// e um domínio com ponto).
- Concluir a última unidade pronta de uma ilha acende a ilha no mapa
  (borda, festa uma vez, "Completa!" no mundo): o fim da ilha pede uma
  conclusão à altura.
- Nas outras ilhas, o fim é um **contrato** (seção 31): um cliente, o
  pedido, a mudança no meio, a entrega e o Levar pro mundo da ilha (na
  Lógica, um .js que roda no Console e no Node).

## 19. Itens de revisão (Revisão do dia)

Modelo: os itens da U1 e da U2 (`src/conteudo/revisao/`, um arquivo por
conceito, com um comentário no topo dizendo por que aqueles itens) e os
da S1 (mini-sites no modo documento).

- Um item (`ItemRevisao`, `src/conteudo/tipos.ts`) é um desafio curto (1 a
  2 minutos) sobre UM conceito já ensinado, num mini-site próprio e
  pequeno. Na sessão ele vira a fase de um objetivo sozinho
  (`faseDoItem`): o tutor só pergunta, o "Me ajuda" para na dica, não há
  estrelas nem apresentações.
- Pelo menos **2 variações por conceito**, em situações **diferentes das
  fases** (outro site, outro alvo, a direção contrária do que a fase fez).
  A checagem acusa mini-site igual ao de uma fase.
- `tipo: "acao"` precisa de `validador`; `tipo: "previsao"` precisa de
  `previsao` (com `validador`, o jogador prevê e depois faz; sem ele, o
  item acaba na resposta, e a explicação é a fala final). Errar a
  previsão conta como "ainda não firmou".
- `ajudas` são só `pergunta` e `dica`. `enunciado` com mouse e toque
  (até 140). `solucaoDeTeste` como nos objetivos (previsão começa com
  `responderPrevisao`).
- `siteAlvo`: `body` (obrigatório), `head`, `css` (liga o painel Estilos),
  `url` e `titulo`; `modoDocumento: true` quando o item mexe no head. As
  cores dos mini-sites moram em `src/conteudo/revisao/sites/` (a exceção
  das cores dos sites-alvo).
- As ferramentas vêm sozinhas das ações e dos validadores (Busca,
  Medição, Lighthouse): só use ferramentas que o conceito já apresentou.
- Registre em `src/conteudo/revisao/index.ts`. O conceito precisa ser
  ensinado (campo `conceitos`) por alguma fase de prática, senão nunca
  entra na fila. O `testar:conteudo` roda as mesmas regras dos objetivos
  em cada item; os ids publicados ficam congelados em `publicados.json`
  (`itensRevisao`).
- O agendamento (1, 3, 7, 21 e 60 dias; o que conta como ajuda; o treino
  livre) está no topo de `src/lib/revisao.ts`.
- **Escrevendo em volume** (U3 a P2, rodada 15, um arquivo por conceito):
  - Itens de CSS levam `css` e o head `HEAD_CSS` (`sites/estilos.ts`, só
    charset e viewport); o visual do mini-site mora no `css`, que o
    jogador vê no painel Estilos. Só o painel Estilos existe (sem o
    Calculado), então o modelo de caixa se resolve pelas propriedades.
  - Imagem do mini-site é sempre `data:` (um SVG de retângulo colorido):
    um `src="foto.jpg"` gera 404 no console e derruba o teste de navegador.
  - **Gire a posição da resposta certa** nas previsões: a regra
    `posicao-da-correta` do `testar:conteudo` acusa 2 ou mais previsões da
    mesma unidade (objetivos) ou do mesmo conceito (itens) com o mesmo
    `correta`. Nas ações de variável, use só
    `definirPropriedade` no `:root` (sem `selecionar`); `grid-template-areas`
    se valida com `declaracao`, não `valorEfetivo`.
  - Conceito que só vive numa maquete que o item não aceita (o Meu tema,
    `SITE_ALVO_DO_JOGO`) ou que não tem gesto no jogo (o nome
    `index.html`) fica só com previsões, com o motivo no comentário.
  - Para conferir no navegador: `node testes/revisao-zonas.mjs [layout]
    [zona]` (seção "Navegador" do `testes/README.md`).
  - Para jogar UM item, sem esperar a fila: `/lab/revisao` (fora da
    navegação) lista todos por zona e conceito e abre qualquer um
    (`?item=<id>`), como a revisão joga, sem mexer no progresso.
  - Um conceito ensinado por fase do tipo `simulador-campanha` também
    conta como ensinado (a regra usa `temObjetivos`). Conceito que vive
    fora do jogo (Analytics, Search Console, Índice de qualidade) fica só
    com previsões, com o motivo no comentário do arquivo.

## 20. Zona opcional

- `opcional: true` numa zona do currículo (`ZonaCurriculo`): ela não
  conta para concluir a ilha, não tranca a zona seguinte nem a próxima
  ilha, aparece no mapa com a plaquinha "Opcional" e vale nas lentes. Ela
  mesma abre como as outras (quando as zonas obrigatórias antes dela
  estão concluídas).
- Nos testes de navegador, use `obrigatoriasProntasDaIlha` (de
  `testes/curriculo.mjs`) para contar o que fecha a ilha, e
  `prontasDaIlha` para semear tudo o que tem conteúdo.

## 21. Busca simulada e dados estruturados

Modelo: a S1 (`src/conteudo/ilhas/sites/ser-encontrado/unidade-1/`) e a
Bancada da Busca (`/lab/fases?fase=lab-motor-u1-f6`).

- A aba **Busca** só aparece nas fases com `resultado-busca` ou
  `dados-estruturados` em `usaFerramentas`. Use `modoDocumento: true`
  para o jogador mexer no head (title, metas, scripts).
- **Resultado na busca** (`resultado-busca`): título (o `<title>`),
  endereço e descrição (a meta description), ao vivo, no computador e no
  celular. É uma simulação aproximada, e a tela diz isso: o corte é por
  largura em pixels (uns 60 caracteres no título, uns 150 na descrição do
  computador), estimada em `src/motor/busca.ts`. Sem title, a busca
  inventa com o h1; sem descrição, mostra o primeiro parágrafo. Com
  `noindex` (meta robots ou googlebot, também "none"), a página some.
- Validadores: `resultadoBusca` (`campo: "titulo" | "descricao"`,
  `contem`, `semCorte`; só passa com o texto DECLARADO pela página) e
  `indexavel` (`valor: true | false`). Para "a página X fora da busca"
  quando a página começa com noindex, junte com algo que marque a
  situação nova (`todos`), senão o estado inicial já passa (S1, Fase 3).
- **Teste de dados estruturados** (`dados-estruturados`): lê os
  `<script type="application/ld+json">`, aponta JSON inválido com linha e
  coluna (leitor próprio, mensagem em português) e, para LocalBusiness e
  subtipos comuns (Bakery, Restaurant, Store, HairSalon...), os
  obrigatórios `name` e `address` e os recomendados principais. Com um
  negócio local válido e a página indexável, o Resultado mostra o cartão
  do negócio no mapa. Validador `dadosEstruturados` (`tipoSchema`,
  `campos`, com ponto: `"address.streetAddress"`).
- A lista de subtipos reconhecidos mora em `TIPOS_DE_NEGOCIO_LOCAL`
  (`src/motor/busca.ts`) e confere com os subtipos comuns do arquivo de
  plataformas (`dados-estruturados-schema`); `testes/conteudo/busca.test.ts`
  trava isso. `tipoSchema` exato (`"Bakery"`) só passa com aquele `@type`;
  `"LocalBusiness"` aceita qualquer subtipo da lista. Uma unidade que use
  um subtipo novo acrescenta na lista (é dado, não motor).
- Para o jogador consertar o JSON, dê um `id` ao `<script>` e use, na
  solução, `definirTexto` nele com o JSON inteiro; no jogo, o editor de
  código. O editor recua o conteúdo do head (teste de navegador: o trecho
  a trocar aceita espaços no começo de cada linha).

## 22. Medição simulada

Modelo: a demonstração do `/lab/fases?fase=lab-motor-u1-f7`.

- A aba **Medição** aparece com `medicao` e/ou `link-rastreavel` em
  `usaFerramentas`. O site-alvo não roda JavaScript: um elemento com
  `data-evento="<nome>"` (minúsculas, números e `_`) gera o evento quando
  é clicado na prévia. A tela explica que, na vida real, é um código de
  medição (ensinado na Páginas vivas).
- O construtor de link rastreável monta `utm_source`, `utm_medium` e
  `utm_campaign`, copia, põe no link selecionado e simula uma visita: os
  eventos seguintes contam com essa origem.
- Validadores: `eventoMedido` (`nome`, trava no checklist, como
  `evento`) e `linkRastreavel` (`seletor`, `utm` com os valores pedidos).
  Ações: `clicarNaPrevia` (`seletor`, o clique de verdade) e
  `simularVisita` (`utm`).
- Padrão da S4: `adicionarAtributo data-evento` e `clicarNaPrevia` no
  mesmo objetivo (`atributo` + `eventoMedido`, dentro de `todos`); o link
  rastreável monta `https://<url do site>/?utm_source=...` (a solução usa
  `definirAtributo href` com essa string). Não cite nome de menu de
  Analytics nem de Search Console: são conceitos.

## 23. Simulador de campanha

Modelo: a demonstração do `/lab/fases?fase=lab-motor-u1-f7`
(`src/conteudo/laboratorio/demoCampanha.ts`).

- Tipo de fase `simulador-campanha` (`FaseSimuladorCampanha`): objetivos
  como numa prática, mais `campanha` (`DadosCampanha`: anunciante, 2 ou 3
  palavras-chave com buscas por dia, custo médio e concorrência, 2 ou 3
  concorrentes com lance e qualidade, orçamento, palavra e lance
  iniciais). Números fictícios, declarados na tela.
- A aba **Campanha** mostra a configuração, o leilão (posição = lance x
  qualidade) e o dia simulado. A qualidade e a conversão saem da nota da
  página de destino (auditoria e busca): melhorar a página no painel
  muda o resultado com a mesma verba. O modelo está no topo de
  `src/motor/campanha.ts`.
- Validador `simulacao` (`metrica`: cliques, clientes, custoPorCliente,
  posicao, taxaConversao em %, qualidade, notaPagina; `op`; `valor`), só
  neste tipo de fase. Ação `configurarCampanha` (`orcamento`,
  `palavraChave`, `lance`). Confira os números em
  `testes/conteudo/campanha.test.ts` antes de escrever o objetivo: o
  estado inicial de cada objetivo não pode já passar.
- **É simplificação, e o texto diz.** Lance vezes qualidade é o modelo do
  simulador; no Google de verdade a classificação do anúncio vem do lance,
  da qualidade do anúncio e da página de destino, dos limites mínimos de
  qualidade, da concorrência, do contexto da pesquisa e dos recursos do
  anúncio (arquivo de plataformas, `google-ads`). O Índice de qualidade
  (1 a 10, por palavra-chave) é só diagnóstico e NUNCA é multiplicado no
  leilão; a "qualidade" da tela é do simulador.
- **Manhas do modelo** (S5): acima do mínimo, subir o lance não muda o
  custo do 1º lugar (o custo é o mínimo para ficar na frente); a
  palavra-chave só muda o volume de buscas; o que barateia o cliente é a
  página. Explore os números com `simularCampanha` (página ruim e página
  boa) antes de escrever os objetivos.
- **Sem desafio do tipo `desafio`:** os validadores `simulacao` só existem
  neste tipo de fase. A última fase do simulador faz o papel do desafio
  (só de sozinho, `conceitos` vazio) e a unidade fica sem
  `meta.desafioId` (sem meta com antes e depois).

## 24. Plataformas de marketing (arquivo com data)

- O passo a passo do perfil da empresa no Google, do Search Console e das
  plataformas de anúncio mora em `src/conteudo/plataformas-marketing.ts`,
  só como dado, com `verificadoEm` (AAAA-MM-DD). A tela mostra
  "conferido em <data>" (`rotuloConferido`).
- Escreva os passos na produção da unidade, conferidos na época, nunca de
  memória. As fases ensinam o conceito e o que o programador faz; o
  clique a clique de cada plataforma fica no arquivo.
- Cada plataforma tem `passos` (o caminho, na ordem), `fatos` (regras,
  limites, boas práticas) e `fontes` (de onde foi conferido), e `usadaEm`
  (as unidades que a citam). Não há tela que liste isso: a fase da unidade
  cita o caminho geral em falas e mostra o "conferido em <data>" (fala ou
  missão de campo). A regra `conferido-em-nas-fases` confere que a data da
  fase é a do arquivo; ao atualizar uma plataforma, troque a data nos dois.

## 25. Programação: a Ilha Lógica

Modelo: a unidade `logica-primeiros-comandos-u1` ("O Console calcula",
`src/conteudo/ilhas/logica/primeiros-comandos/unidade-1/`). As bancadas
`/lab/fases?fase=lab-logica-u1-f1` (Console, Snippet, palco) e
`lab-logica-u1-f2` (circuito) mostram tudo ao vivo. As outras
demonstrações da Bancada da Lógica: `f3` (desafio com circuito e ponte
circuito/Console), `f4` (depurador, seção 26), `f5` a `f7` (ordenar
passos, seção 27), `f8` e `f9` (estruturas e desempenho, seção 28), `f10` e
`f11` (custo escondido dos métodos nativos, seção 28.1). A tela
composta (plano, código, palco e casos de teste juntos) tem a bancada
própria, `lab-resolver-u1` (seção 29), e as cenas programáveis, a
`lab-cenas-u1` (seção 30). **Regra de ritmo:** toda unidade nova da Lógica
tem pelo menos uma fase com cena (seção 30.6).

### 25.1 O executor

- O código do jogador roda em `src/motor/executor`, nunca no jogo: no
  navegador, num Web Worker sem rede, sem timers e sem acesso à página;
  nos testes, no `vm` do Node. O jogo só vê o resumo (respostas,
  console.log, erro, memória passo a passo).
- Limites: 100 mil passos e 1,5 s por execução. Laço infinito para com a
  explicação "Loop que nunca termina?" e o jogo não trava.
- No jogo, `Math.random()` sorteia de verdade e `new Date()`/`Date.now()`
  usam a data real. Semente e instante fixos (5 de janeiro de 2026, 15h UTC)
  existem apenas nos testes (`testar:conteudo` e Playwright), por opção
  explícita do hospedeiro. **Validadores nunca dependem de um valor
  aleatório nem da data**: valide a relação, a faixa ou a estrutura do
  resultado, e não um sorteio específico nem o dia de hoje.
- O Console guarda a memória entre entradas, como o do Chrome: `let` e
  `const` do topo continuam existindo, e redeclarar `let x` numa entrada
  nova funciona (no Chrome também), inclusive usar o valor anterior no
  inicializador da redeclaração. Antes da primeira declaração, let/const
  dão `ReferenceError`, explicado como "Usou antes de criar". Trocar uma
  `const` dá `TypeError:
  Assignment to constant variable.`
- Sem `setTimeout`, `fetch`, `async`/`await` de verdade nesta parte: ficam
  para a Ilha Rede e Servidor (Pendências no ROADMAP).
- As respostas seguem o formato do Chrome: textos com aspas simples
  (`'oi'`), listas como `(3) [1, 2, 3]`, objetos como `{nome: 'Ana'}`,
  função como `ƒ soma(a, b)`. Os erros usam o nome e a mensagem do V8
  (Chrome); `src/motor/executor/erros.ts` explica cada um em PT-BR.

### 25.2 Console e Snippet (a fase de programa)

- Uma fase é de programa quando tem o campo `programa` (`BancadaPrograma`)
  e `siteAlvo: SITE_DO_PROGRAMA` (`src/motor/programa.ts`): não há página,
  a tela é o palco da memória. `usaFerramentas` precisa de `"console"` e
  `"palco-memoria"`; `"linha-do-tempo"` e `"snippet"` quando a fase usar.
- `programa.snippet` (`codigoInicial`, `nome`) põe o editor de Fontes >
  Snippets com Executar, para programas de várias linhas. Sem ele, o
  jogador escreve várias linhas no Console, como no Chrome: `{` fecha
  sozinha; Enter com o cursor no meio (entre `{` e `}`) ou com o código
  incompleto pula linha e indenta; com o cursor no fim e o código completo,
  roda. Digitar o `}` que o Console já fechou passa por cima dele (não
  duplica). Shift+Enter sempre pula linha e Ctrl+Enter (Cmd+Enter) roda de
  qualquer jeito. No toque vale o mesmo, com a tecla Enter do teclado, a
  barra de símbolos (que digita `{` e `}` como o teclado) e o botão Rodar.
- `programa.preparo`: código que roda escondido quando a fase abre, para a
  memória já começar com algo (a lista do desafio, por exemplo).
- A linha de ajuda aponta `{ alvo: "console", fala }` ou
  `{ alvo: "snippet", linhas: [1, 2], fala }` (linhas do Snippet começam
  em 1). A regra `fase-de-programa` recusa `arvore`, `editor`, `css`,
  `estilos` e `circuito` aqui, e qualquer validador com `seletor`.
- A memória, as entradas do Console e o Snippet ficam salvos no progresso
  (o jogador recarrega e as caixinhas voltam).

### 25.3 Validadores de código

Só em fase com `programa` (a regra `fase-de-programa` confere). Os que
"travam no checklist" contam desde que o objetivo começou; os outros
olham a memória de agora.

| Validador | Passa quando | Use para |
| --- | --- | --- |
| `valorVariavel` (`nome`, `valor`) | a variável global vale isso agora (número com tolerância; lista e objeto comparados por valor) | criar e trocar caixinhas |
| `respostaDoConsole` (`valor`) | alguma entrada do Console respondeu isso (trava) | contas no Console, sem variável |
| `saida` (`contem` ou `igual`) | o console.log mostrou esse trecho, ou exatamente essas linhas numa execução (trava) | console.log, laços que imprimem |
| `semErro` | rodou algo e a última execução não deu erro (trava) | "agora roda" depois de consertar |
| `erroDoTipo` (`nome`) | alguma execução deu esse erro, como `"TypeError"` (trava) | fases que ensinam a LER o erro |
| `usouSintaxe` (`sintaxe`) | o código rodado usa essa sintaxe, lida da árvore (trava) | exigir `let`, `if`, `for`, `return`... |
| `funcaoPassa` (`nome`, `casos`) | a função global, chamada com os `args` de cada caso, devolve o `esperado` | TODA fase de função |

- **`funcaoPassa` é o jeito de validar função.** Ele chama a função do
  jogador com cada caso e compara o que ela DEVOLVE (`return`). Função que
  só faz `console.log` não passa, e isso é de propósito: é a confusão
  número um de quem começa. O detalhe (no /lab e no tutor) diz o caso que
  falhou: `dobro(2) devolveu undefined, esperado 4`. Dê pelo menos 2
  casos, um deles de borda (zero, lista vazia, texto vazio), para que
  "devolver sempre o mesmo número" não passe. Os casos rodam de novo a
  cada execução, com cópias dos argumentos (a função não estraga o caso
  seguinte).
- `respostaDoConsole` é a resposta do Console (a linha depois da entrada,
  como `14` para `2 + 3 * 4`), não o console.log. Previsão "o que o
  Console responde se...?" combina com ele.
- `usouSintaxe` sozinho não prova nada; combine com um validador de
  resultado (`todos`). Exemplo: `valorVariavel` + `usouSintaxe: "let"`.
- `else` e `else if` são sintaxes separadas: `usouSintaxe: "else"` é o
  `else` final (o "senão" sem condição) e `usouSintaxe: "else-if"` é o
  `else if`. Uma cadeia `if / else if / else` conta as três; um `if` dentro
  do bloco de um `else` não é `else if` (conta `else`). Para provar qual
  caminho de um if/else rodou, prefira `saida` com `igual` (nunca os dois);
  para provar um bug que pode ser refeito (como o `;` depois do `if`),
  prefira o estado (`valorVariavel`).
- Programas de várias linhas no Console: o editor fecha `}` ao digitar `{`
  e o `}` digitado passa por cima dele (25.2); nos testes de navegador o
  código entra como texto colado, ou digitado linha a linha
  (`testes/console.mjs`).
- Para o erro: `erroDoTipo` no objetivo que faz o erro acontecer, e a fala
  ao concluir explica a mensagem (a primeira palavra diz o tipo, o resto
  diz o motivo).

### 25.4 Ações de programa

- `executarNoConsole` (`codigo`): escreve e roda no Console, como Enter.
  Várias linhas com `\n`.
- `definirSnippet` (`codigo`) e `executarSnippet`: trocam o texto do
  Snippet e o rodam (só com `programa.snippet`).
- A `solucao` do "Me mostra" e a `solucaoDeTeste` usam essas ações. A
  checagem "objetivo não nasce resolvido" roda o executor de verdade, em
  sequência, fase por fase.

### 25.5 Palco da memória e linha do tempo

- O palco (`src/motor/palco.ts`) é a tela da fase: cada variável é uma
  caixinha com o nome, `let` ou `const`, o tipo (número, texto,
  booleano...) e o valor. Lista e objeto aparecem desenhados; quando
  outra variável aponta a MESMA lista, ela vira uma seta até lá (é assim
  que o jogo ensina referência). Cada chamada de função abre um quadro
  próprio, que some quando ela devolve.
- Escopo de bloco, como no JavaScript de verdade: `let` e `const` de
  dentro de um bloco (o `i` do `for`, a variável de dentro do `if`, do
  `while` ou do `for...of`) aparecem numa caixa tracejada "dentro do
  bloco" e somem do palco quando o bloco termina. Dentro de função, o
  bloco fica dentro do quadro dela. (O `switch` ainda não mostra as
  variáveis declaradas nos `case`.)
- A linha do tempo (`"linha-do-tempo"`) deixa voltar e avançar a última
  execução passo a passo. Cada passo mostra a memória ANTES da linha
  marcada rodar, como o depurador do Chrome pausado nela. Com três linhas
  (`let total = 0`, `total = total + 18`, `total = total + 5`), um passo
  para trás a partir do fim mostra `total` em 18.
- Apresente o palco na primeira fase de programa e a linha do tempo na
  primeira fase com um programa de várias linhas (campo `apresentar`).
- A tela de meta de um desafio de programa mostra dois mini-palcos, antes
  e depois (`memoriasDoDesafio` em `src/motor/simulacao.ts`, com o
  `preparo` e as soluções do desafio).

### 25.6 Itens de revisão de programa

- Um item de revisão (seção 19) com `programa: {}` (ou com `preparo`)
  vira uma fase de programa: `siteAlvo` sem página (`body: ""`),
  ferramentas `console` e `palco-memoria`. A checagem de itens não compara
  mini-site nesses; roda a solução no executor e confere que passa.
- Modelo: `src/conteudo/revisao/variavel-let.ts`.

### 25.7 Circuito lógico

- Tipo de fase `circuito-logico` (`FaseCircuitoLogico`): objetivos como
  numa prática, `siteAlvo: SITE_DO_PROGRAMA`, e `circuito`
  (`DadosCircuito`: `inicial` com as peças e os fios que a fase traz, e
  `paleta` com os portões que o jogador pode puxar: `"e"`, `"ou"`,
  `"nao"`, e o extra `"xou"`). O modelo mora em
  `src/motor/circuito/modelo.ts` e não depende da tela.
- Entradas e saídas têm `nome` de variável JavaScript (`temCliente`):
  "Ver como código" mostra o circuito com `&&`, `||` e `!` usando esses
  nomes, e a tabela verdade ao lado usa os mesmos.
- Validadores (só nesse tipo): `circuitoTabela` (`esperado`: linhas com
  `entradas` e `saida`; o validador simula todas as combinações, então
  ligar e desligar as entradas à mão não conta) e `usouPortao` (`portao`,
  `minimo`). Ações: `adicionarPortao` (`portao`, `id`, `x`, `y`),
  `ligarFio` (`de`, `para`, `porta`), `alternarEntrada`, `apagarPeca`,
  `verComoCodigo`. A linha de ajuda aponta `{ alvo: "circuito", peca,
  fala }`.
- No toque: toque a porta de saída de uma peça e depois o corpo da peça
  de destino (o fio vai para a entrada livre mais perto). No mouse,
  arrastar da saída até a entrada.
- Ferramentas: `"circuito"` e `"tabela-verdade"`. Primeira unidade que usa:
  `logica-decisoes-u2` (portões lógicos, logo depois do if).
- **Desafio com circuito:** um `desafio` aceita o campo `circuito` (o mesmo
  `DadosCircuito`); as partes usam `circuitoTabela` e `usouPortao` e as
  soluções, as ações da bancada. A meta mostra a bancada antes e depois.
  Com `circuito` e `programa` juntos é a **ponte circuito/Console**: a
  bancada é a tela e o painel tem a tabela verdade em cima e o Console
  embaixo (no celular, um seletor "Tabela verdade | Console"); as partes
  misturam validadores de circuito e de código (`valorVariavel`,
  `usouSintaxe`...). Na ponte não há palco: `usaFerramentas` leva
  `circuito`, `tabela-verdade` e `console`, sem `palco-memoria` nem
  `linha-do-tempo`. Modelo: `/lab/fases?fase=lab-logica-u1-f3`.

### 25.8 A unidade-modelo

`logica-primeiros-comandos-u1` segue o formato de sempre (meta, guiado e
sozinho, previsões, desafio em contexto novo, itens de revisão), com o
Console no lugar do painel Elementos:

- Fase 1: contas no Console (`respostaDoConsole`), previsão da ordem das
  operações, parênteses.
- Fase 2: `let` e o `undefined` que o Console responde depois dela
  (previsão), caixinhas no palco (`valorVariavel` + `usouSintaxe`).
- Fase 3: `const` e o TypeError de trocá-la (`erroDoTipo`), nomes bons,
  programa de três linhas com a linha do tempo.
- Fase 4 (desafio): o Mercadinho do Seu Zé, contexto novo, 4 partes com
  `valorVariavel` e `respostaDoConsole`.
- Teste de navegador: `testes/logica.mjs` (a jornada pelo mapa, com
  recarga no meio da fase 2).

## 26. Depurador da aba Fontes

Modelo: `/lab/fases?fase=lab-logica-u1-f4` (desconto.js). Zona que usa:
Depuração. O motor mora em `src/motor/depurador.ts`.

- **Quando existe:** fase de programa com `programa.snippet` e alguma das
  ferramentas `"pontos-de-parada"`, `"controles-depurador"`,
  `"painel-escopo"`, `"painel-observar"` e `"pilha-de-chamadas"` (a regra
  `depurador` confere). O Snippet ganha os números de linha clicáveis e,
  embaixo (no celular, no botão Depurador da aba Fontes), os painéis
  Escopo, Observar, Pilha de chamadas e Pontos de parada.
- **Como no Chrome** (Sources): clicar no número da linha põe ou tira o
  ponto de parada (Ctrl+B / Cmd+B na linha do cursor); `debugger;` no
  código pausa do mesmo jeito. Executar pausa ANTES da linha marcada
  rodar: aparece "Pausado no depurador", a linha acende, o palco mostra a
  memória daquele momento e o Snippet fica só de leitura. Ponto numa linha
  sem código (chave, comentário) vale para a próxima linha com código.
- **Controles:** Retomar (F8), Passar por cima (F10), Entrar na função
  (F11) e Sair da função (Shift+F11), com os atalhos de Ctrl (Cmd no Mac)
  do Chrome. No celular, numa barra grande embaixo.
- **Painéis:** Escopo (Local, Bloco, Script e Global, como no Chrome),
  Observar (expressões avaliadas no momento pausado, numa cópia: observar
  não muda o programa) e Pilha de chamadas (a de cima é a que roda agora).
  Com o mouse parado em cima de uma variável, o valor aparece. O Console,
  pausado, responde no momento pausado.
- **Validadores:** `pontoDeParada` (`linha`: tem ponto ali agora),
  `pausouNaLinha` (`linha`: pausou ali desde o começo do objetivo, trava),
  `observou` (`expressao`, e com `valor`, mostrou esse valor numa pausa,
  trava) e `usouControle` (`controle`: `retomar`, `passar-por-cima`,
  `entrar`, `sair`; `minimo`, trava). Para provar que o jogador entendeu
  o momento, combine o controle com o que ele mostra (`todos` com
  `usouControle` e `observou` com `valor`, como no modelo).
- **Ações:** `alternarPontoDeParada` (`linha`), `controlarDepurador`
  (`controle`) e `observar` (`expressao`). Eventos:
  `alternouPontoDeParada`, `pausouNoDepurador`, `usouControleDepurador`,
  `adicionouObservacao` e `observouValor`.
- **A cena na pausa (fase com cena):** o desenho da cena mostra o instante
  da pausa, o mesmo do palco, do Observar e do Console: o tempo e o estado
  de cada aparelho nesse passo (o comando da linha pausada ainda não
  rodou). Passar por cima, Entrar e Sair levam a cena até o novo instante;
  Retomar toca a animação do instante da pausa até o fim. Mexer na linha
  do tempo da execução com o programa pausado não muda o instante da
  pausa. Pausas com o mesmo tempo (vários comandos em 0 ms) se distinguem
  pelo passo, não só pelo relógio. Prova: `testes/depuracao-cena-bloqueio.mjs`.
- **Previsão casa bem:** "na primeira pausa na linha 8, quanto vale
  total?" (resposta: o valor de ANTES da linha). É a confusão número um.
- **Limite:** o depurador anda pelo rastro da execução, que guarda até
  1.000 fotos da memória; num programa mais longo que isso, as pausas
  depois da milésima foto não acontecem (o aviso "rastro cortado" da linha
  do tempo vale aqui também). Programas de depuração devem ser curtos.

## 27. Ordenar passos

Modelos: `/lab/fases?fase=lab-logica-u1-f5` (café: dependências e
distração), `f6` (agrupar) e `f7` (plano de código que roda). Zona que
usa: Resolvendo problemas. O motor mora em `src/motor/ordenar/modelo.ts`.
O mesmo quadro é a área "plano" de uma fase composta (seção 29), onde ele
fica ao lado do código e vira comentários no Snippet; lá os validadores e
as ações do quadro valem igual, sem `rodar`.

- **Tipo de fase**, não objetivo: `tipo: "ordenar-passos"`
  (`FaseOrdenarPassos`), com objetivos como numa prática, `siteAlvo:
  SITE_DO_PROGRAMA`, a ferramenta `"quadro-de-passos"` e o campo
  `ordenar` (`DadosOrdenar`). Decidido assim porque o quadro é a tela
  inteira da fase (como a bancada do circuito), não um painel a mais.
- **Cartões** (`cartoes`): `id` em kebab-case, `texto` (até 80
  caracteres), `depoisDe` (os ids que precisam vir antes), `sobra: true`
  (distração: tem que ficar fora) e, no agrupar, `grupo`. `inicial` põe
  cartões já no plano (bom para uma distração que o jogador precisa tirar).
- **Validação pelas dependências:** `ordemValida` aceita QUALQUER ordem
  que respeite os `depoisDe` (nunca uma ordem decorada). Escreva só as
  dependências de verdade: se ferver a água e pôr o filtro não dependem
  um do outro, as duas ordens valem. A checagem recusa ciclo, dependência
  que não existe e dependência numa distração.
- **Agrupar** (`modo: "agrupar"` com `grupos`): os passos grandes já estão
  no quadro e cada subpasso vai dentro do seu. Dependência entre grupos
  segue a ordem dos grupos.
- **Plano que roda** (`rodar: true` com `programa`): cada cartão é uma
  linha de código (`codigo`, ou o `texto`), e Rodar executa o plano na
  ordem, com memória nova. Os validadores de código (`saida`,
  `valorVariavel`, `semErro`...) valem; a ordem errada dá o erro de
  verdade (usar antes de criar).
- **Validadores:** `ordemValida`, `passoNoPlano` (`passo`, `grupo`),
  `passoAntes` (`passo`, `antesDe`) e `semSobras`. **Ações:** `porPasso`
  (`passo`, `posicao`, `grupo`), `tirarPasso` e `rodarPlano`. Evento:
  `moveuPasso`.
- **Mouse e toque:** arrastar pela alça (o cartão segue o dedo ou o
  mouse); ou tocar no cartão e depois em "Pôr aqui"; setas para subir e
  descer. A linha de ajuda aponta a ferramenta `quadro-de-passos`.

## 28. Estruturas e desempenho

Modelos: `/lab/fases?fase=lab-logica-u1-f8` (pilha, fila, árvore e o
bolha.js) e `f9` (contador e gráfico de passos). Zonas que usam:
Estruturas de dados e Algoritmos essenciais. Motor:
`src/motor/estruturas.ts` e `src/motor/desempenho.ts`.

- **Palco de listas (sempre ligado):** o vagão que entra pelo fim (push)
  chega pela direita e o que sai pelo fim (pop) sai pela direita; pelo
  começo (unshift, shift), pela esquerda. Andando pela linha do tempo ou
  pelo depurador, o vagão que a linha anterior LEU acende ("2 leu") e
  uma troca de duas posições numa linha só (`[a[i], a[j]] = [a[j],
  a[i]]`) acende os dois ("trocou"). Com uma variável auxiliar, a troca
  vira duas escritas, e cada vagão escrito pisca no seu passo.
- **Ver como árvore** (`"arvore-palco"`): a caixinha de um objeto com
  filhos objetos (ou listas de objetos) ganha o botão "Ver como árvore". O
  rótulo de cada nó é o campo `nome` (ou `valor`, `texto`, `titulo`...);
  dentro de uma função, o nó que ela está olhando fica aceso (o percurso
  acontecendo). Embaixo, a ponte para a árvore de Elementos do F12.
- **Contador de passos** (`"contador-passos"`): no canto do palco, os
  passos da última execução (cada linha executada, inclusive cada volta
  de laço) e, à parte, os escondidos nos métodos nativos ("1.001 passos +
  500.500 escondidos em `shift`"; seção 28.1).
- **Gráfico passos x tamanho** (`"grafico-passos"` com
  `programa.desempenho`): a aba Desempenho (simulação: a do Chrome mede
  tempo) roda cada função com listas de vários tamanhos e desenha uma
  linha por função. `desempenho`: `funcoes` (1 ou 2, `{ nome, args? }`;
  nos `args`, `"$lista"` vira a lista do tamanho e `"$tamanho"`, o
  número; sem `args`, a função recebe só a lista), `tamanhos` (2 a 6,
  crescentes, até 5000; padrão 10, 100, 500 e 1000) e `lista`
  (`crescente`, `decrescente` ou `embaralhada`, sempre a mesma). Acima de
  2 milhões de passos a medida para e o ponto diz "travaria". Cada ponto é
  o total (código mais escondidos), e a legenda embaixo dos botões explica.
- **Validadores:** `passosNoMaximo` (conta o total, com os escondidos;
  `contarEscondidos: false` conta só os do código) sem `tamanho` (a última
  execução do objetivo deu no máximo `valor` passos; pede `contador-passos`) e com
  `tamanho` (a função, `funcao` ou a primeira do `desempenho`, com a lista
  desse tamanho, medida de novo a cada execução: o jogador melhora o
  algoritmo, não decora). `formaDaEstrutura` (`nome`, `forma`): `pilha`
  (entrou e saiu pelo mesmo lado) ou `fila` (entrou por um, saiu pelo
  outro), contando as execuções do objetivo, ou `arvore` (agora é um
  objeto com filhos objetos; pede `arvore-palco`).
- **Orçamento de passos:** dê pelo menos 3 vezes de folga sobre a solução
  eficiente mais "falante" (variáveis auxiliares, nomes intermediários e
  linhas de explicação) e mantenha o limite pelo menos 10 vezes abaixo da
  solução ingênua, medindo ambas na mesma entrada de pior caso. O limite
  separa algoritmos, não estilos. Se as faixas não couberem, aumente o
  tamanho da entrada ou escolha outra comparação; não aperte a solução certa.
- **Ações:** `verComoArvore` (`nome`) e `medirDesempenho`. Eventos:
  `viuComoArvore` e `mediuDesempenho` (use `{ tipo: "evento", evento:
  "mediuDesempenho" }` para o objetivo de medir).
- **Previsão casa bem:** "se a lista ficar 50 vezes maior, os passos
  crescem quanto?". O gráfico responde: a reta cresce junto, a curva
  dispara.

### 28.1 O custo escondido dos métodos nativos

Modelos: `/lab/fases?fase=lab-logica-u1-f10` (consumir uma fila com
`shift` contra andar por índice) e `f11` (procurar com `includes` contra
`Map.has`). Motor: `src/motor/executor/custoNativo.ts`.

- **O problema que resolve:** o contador conta comandos do aluno. Sem o
  custo escondido, `while (fila.length) fila.shift()` com 1.000 itens dava
  1.001 passos, menos que a versão por índice (2.002), e o gráfico ensinava
  o contrário da verdade: cada `shift` move todos os itens.
- **O modelo** (passos escondidos, somados à parte, por método):

  | Método | Custo escondido |
  | --- | --- |
  | `shift`, `unshift` | o tamanho da lista (todos se movem) |
  | `splice` | os itens movidos depois da posição + inseridos + removidos |
  | `indexOf`, `includes`, `lastIndexOf` | os examinados até achar (ou todos) |
  | `slice`, `concat`, `join`, `reverse`, `fill`, `...`, `Array.from`, `Object.keys/values/entries`, `new Set(lista)`, `new Map(pares)` | os itens copiados ou percorridos |
  | `sort()` sem comparador | n x log2(n); com comparador, só as chamadas dele (já contam como passos do código) |
  | `map`, `filter`, `find`, `findIndex`, `some`, `every`, `forEach`, `reduce`, `flatMap` | um por item visitado (o callback conta os passos dele à parte) |
  | texto: `includes`, `indexOf` / `split`, `replaceAll` / `repeat` | até achar / o texto todo / o texto que sai |
  | `push`, `pop`, `Map` e `Set` (`get`, `set`, `has`, `delete`, `add`), `lista[i]`, `obj.chave` | nenhum: o passo do comando é o trabalho todo |

  Só conta a chamada escrita no código do jogador e só quando o método é o
  nativo: uma classe `Fila` com um `shift` próprio conta os passos do
  próprio código. É um modelo didático (o motor de JavaScript tem atalhos),
  não uma medida de tempo; os textos da fase falam em "trabalho", nunca em
  milissegundos.
- **Onde aparece:** o contador do palco mostra "N passos + M escondidos em
  `shift`" (os dois métodos que mais pesaram); o gráfico de Desempenho usa
  o total (e a medição para em 2 milhões, contando os escondidos); no
  palco, depois de `shift`, `unshift` e `splice`, cada vagão que mudou de
  posição desliza, um depois do outro (o trem inteiro andando é o custo).
- **O que não muda:** os escondidos não criam fotos na linha do tempo nem
  no depurador (não pesam no limite de 1.000 fotos) e não contam para o
  limite de 100 mil passos de uma execução (um `shift` em lista grande não
  é loop infinito).
- **No conteúdo:**
  - Para ensinar estrutura certa para o trabalho (zona Estruturas de
    dados), compare no gráfico o método caro com o barato: `shift` contra
    índice, `includes` contra `Map.has`/`Set.has`. A previsão casa bem:
    "com 1.000 itens, qual dá mais passos no total?".
  - O orçamento de `passosNoMaximo` segue a regra da seção 28 (3 vezes a
    eficiente mais falante, 10 vezes abaixo da ingênua), medindo as duas
    com o total. Nas demonstrações: fila de 1.000 itens, 10.000 passos
    (índice 2.002; shift 501.501); estoque de 1.000 itens, 20.000 passos
    (Map 3.005; includes 502.503).
  - `contarEscondidos: false` só em casos especiais: quando a fase ensina
    a forma do código (contar as voltas de um laço escrito pelo aluno) e
    um método pronto fora do foco não deve pesar. O ponto que "travaria"
    reprova mesmo assim.
  - Na fala, chame de "trabalho escondido" ou "o método trabalha por
    dentro"; evite "custo" sozinho (o jogador ainda não tem a palavra).

## 29. Resolução de problemas: a tela composta

Modelos: `/lab/fases?fase=lab-resolver-u1-f1` (a média das notas, do plano
aos casos de teste) e `lab-resolver-u1-f2` (o desafio composto: quantos
passaram na prova). Com `&modo=jogo` no endereço, a bancada abre como no
jogo: meta com antes e depois, apresentações, progresso salvo e o Rever com
volta. Motor: `src/motor/composicao.ts` (as áreas),
`src/motor/plano/comentarios.ts` (o plano no código) e `src/motor/casos/`
(os casos de teste). Zona que usa: Resolvendo problemas (a U4 e os
desafios); depois, a especificação e o código gerado da Ilha IA e os
projetos do Ofício, como áreas novas. A área `cena` (o mundo que o código
controla) está na seção 30.

- **Quando usar:** quando o aluno precisa planejar, programar e testar o
  mesmo problema na mesma tela. Fase só de quadro (decompor, ordenar,
  agrupar) continua `ordenar-passos` (seção 27).
- **Não é tipo novo:** a fase é `pratica` ou `desafio` e declara as áreas;
  o motor monta a tela. `areas`: `"plano"` (o quadro, campo `plano`, um
  `DadosOrdenar` sem `rodar`), `"snippet"` (o código, pede
  `programa.snippet`; é obrigatória), `"palco"` (o palco com a linha do
  tempo) e `"testes"` (os casos do aluno, campo `testes`: `funcao`,
  `parametros` e, se quiser, exemplos prontos em `inicial`, escritos como o
  aluno escreveria: `{ entrada: "[8, 6]", esperado: "7" }`).
  `siteAlvo: SITE_DO_PROGRAMA`.
- **Ferramentas:** cada área pede a dela em `usaFerramentas`
  (`quadro-de-passos`, `snippet`, `palco-memoria`, `casos-de-teste`), mais
  `console` (o Console continua na aba dele), `linha-do-tempo` (com o palco)
  e `plano-no-codigo` (o botão Levar pro código). Apresente
  `plano-no-codigo` e `casos-de-teste` no objetivo que usa cada uma (a
  apresentação dos casos diz que eles são a semente dos testes
  automatizados do Ofício). A regra `composicao` confere área, campo e
  ferramenta.
- **A tela:** no computador, o plano numa coluna à esquerda (o plano em cima
  e os cartões embaixo), o código no centro e o palco e os casos à direita,
  um embaixo do outro. Deitado, o plano (ou o palco, ou os testes, em abas)
  ao lado do código. Em pé, as abas "Plano | Código | Testes" e o palco
  recolhível em cima (começa recolhido). Alvos de 44 px no toque; a barra de
  símbolos aparece no Snippet e nos campos dos casos.
- **O plano no código:** o botão "Levar pro código" escreve o plano, na
  ordem do aluno, no topo do Snippet, sem apagar o código: um cabeçalho
  `// Plano: <problema>` e uma linha por passo (`// 1. texto`; no agrupar,
  `// 1. Passo grande` e `//   1.1 subpasso`). O bloco é o cabeçalho e as
  linhas numeradas logo abaixo dele; mexer no quadro depois reescreve só
  ele (o resto do código fica). O plano fica editável o tempo todo. Tocar
  num passo do plano acende o comentário dele no código; os cartões que já
  estão no código ganham o selo `//` e o rodapé diz a linha (em pé, com o
  botão "Ver no código").
- **Os casos de teste:** o aluno escreve a entrada como os argumentos de
  uma chamada (`[8, 6]`, `10, 7`) e a saída esperada (`7`); valem números,
  textos entre aspas, `true`, `false`, `null`, listas e objetos (lidos como
  valores, sem rodar nada; `undefined` e contas não valem, e o caso diz o
  motivo). "Rodar os casos" roda o Snippet e chama a função com cada caso:
  cada um mostra se passou e o que veio. Mudar um caso apaga o resultado
  dele. Até 12 casos.
- **Validadores novos:**
  - `{ tipo: "planoComentado" }`: os comentários de linha inteira que batem
    com o texto dos cartões (sem diferenciar acento, maiúscula ou ponto no
    fim), lidos na ordem do código, formam um plano que vale (todos os
    passos, nenhum que sobra, cada um depois do que ele precisa). O aluno
    pode descer cada comentário para perto do código que ele vira, desde
    que a ordem continue valendo. Pede as áreas plano e snippet. Olha o
    código de agora.
  - `{ tipo: "casosDoAluno", minimo, incluir?, passando? }`: pelo menos
    `minimo` casos que dá para ler; `incluir` são os casos de borda exigidos
    (`{ args?, esperado?, rotulo? }`: casa pelos argumentos, pela saída ou
    pelos dois; `rotulo` é como ele aparece no detalhe, "a lista vazia");
    com `passando: true`, só contam os casos que passaram na última rodada.
    Combine com um `funcaoPassa` de casos escondidos (com as bordas): a
    função certa mais os casos do aluno passando provam que as saídas que
    ele escreveu estão certas.
  - Valem também: `ordemValida`, `passoNoPlano`, `passoAntes` e `semSobras`
    (no quadro), `funcaoPassa`, `semErro`, `usouSintaxe` e os demais de
    código.
- **Ações:** `levarPlanoProCodigo`, `verPassoNoCodigo` (`passo`: tocar no
  passo do plano), `escreverCaso` (`entrada`, `esperado`), `apagarCaso`
  (`indice`), `rodarCasos`, mais `porPasso` e `tirarPasso`. Eventos:
  `levouPlanoProCodigo`, `apontouPasso`, `editouSnippet` (o texto do Snippet
  mudou, avisado depois de uma pausa), `editouCasos` e `rodouCasos`.
- **Linha de ajuda:** `{ alvo: "ordenar", passo }` no plano,
  `{ alvo: "snippet", linhas }` no código e `{ alvo: "ferramenta",
  ferramenta: "plano-no-codigo" }` ou `"casos-de-teste"`. A área certa
  aparece sozinha no celular.
- **Desafio composto:** o `desafio` aceita as mesmas áreas. Bom checklist:
  uma parte de plano (`ordemValida`), uma de plano no código
  (`planoComentado`), uma de código (`funcaoPassa` com bordas escondidas) e
  uma de testes (`casosDoAluno` com `incluir` e `passando`), cada uma com
  `revisarEm` na prática composta (ou na fase de quadro) que ensinou aquilo.
  Mexer no plano depois desmarca as partes de plano até ele valer de novo;
  o código e os testes ficam. A meta mostra o antes e o depois das áreas
  (o plano, o código com o bloco resumido e os casos). Plano, código e
  casos ficam salvos (Rever, recarregar).
- **Tutor:** recebe o plano na ordem do aluno, os casos com o resultado e o
  código; continua só perguntando (não diz a ordem, o código nem a saída
  certa de um caso).
- **Limites:** só comentários de linha inteira contam (comentário no fim de
  uma linha de código não); deixe uma linha em branco entre o bloco do
  plano e o código (um comentário numerado colado logo abaixo do bloco é
  lido como parte dele e some quando o plano muda). Deitado, o código mostra
  poucas linhas (o celular em pé tem mais espaço). Teste:
  `testes/resolver.mjs`.

## 30. Cenas programáveis: o mundo que o código controla

Modelos: `/lab/fases?fase=lab-cenas-u1-f1` (o quarto à noite: acender,
ficha e Por dentro, liga e desliga sem esperar, piscar 3 vezes, a
velocidade) e `lab-cenas-u1-f2` (a vitrine da Padaria Pão de Mel: o sensor
lido no Console, o if que roda uma vez só, o loop de controle nas várias
linhas do tempo). O mostruário do kit, nos três temas: `/lab/cenas`. Motor:
`src/motor/cena/` (`modelo.ts`, os dados e o estado no tempo;
`catalogo.ts`, os dispositivos e as fichas; `motor.ts`, o relógio e os
objetos no executor; `validar.ts`, os validadores; `ritmo.ts`, a regra de
ritmo). Desenho: `src/componentes/cena/` (o kit em `kit/`).

O foco é a PROGRAMAÇÃO: o que o código manda, como o dispositivo responde e
por que funciona. A parte elétrica aparece só no "Por dentro" da ficha,
como ponte para a trilha Automação.

### 30.1 A cena é uma área da tela composta

- A fase é `pratica` ou `desafio` com `areas` (seção 29) e a área `"cena"`
  (sempre com `"snippet"`; o `"palco"` é opcional, mas a linha do tempo
  mora nele). Campo `cena` (`DadosCena`), `siteAlvo: SITE_DO_PROGRAMA`,
  `programa.snippet`.
- `usaFerramentas`: `"cena"`, `"ficha-dispositivo"` e
  `"velocidade-simulacao"` (as três aparecem sempre com a área; a regra
  `composicao` cobra), mais `snippet`, `console` e, com o palco,
  `palco-memoria` e `linha-do-tempo`. Apresente `cena` na primeira fase
  com cena (`apresentar` da fase), `ficha-dispositivo` no objetivo que
  manda abrir a ficha e `velocidade-simulacao` quando fizer sentido trocar
  a velocidade (modelo: f1 da bancada).
- A tela: no computador, a cena em cima na coluna da direita (com o palco
  embaixo, divisor arrastável); deitado, a cena é a primeira aba ao lado
  do código; em pé, a cena fica em cima (recolhível, e recolhe sozinha
  enquanto o teclado está aberto) e as abas "Código | Palco" embaixo.
- A linha de ajuda aponta `{ alvo: "ferramenta", ferramenta: "cena" }`,
  `"ficha-dispositivo"` (o desenho) ou `"velocidade-simulacao"`; a área
  aparece sozinha no celular.

### 30.2 Montar uma cena com o kit (cenas são dados)

Uma cena nova é montar peças, não desenhar. `DadosCena`:

- `id` (kebab-case, ex.: `garagem-portao`), `titulo` (até 40), `ambiente`
  (kebab-case: `quarto`, `vitrine`, `garagem`...; a regra de ritmo compara
  por ele), `periodo` (`"noite"`: o ambiente escurece e cada lâmpada acesa
  clareia a área dela de verdade; `"dia"`: claro, a janela mostra o céu
  azul) e `duracaoMs` (de 2.000 a 60.000; o loop de controle termina junto).
- `cenario`: as peças, na ordem de desenho (de trás para a frente), no
  sistema de coordenadas 320 x 200 (0, 0 é o canto de cima à esquerda; o
  chão das cenas de referência começa em y 150 e os pés das pessoas ficam
  em y 186). Cada peça: `{ peca, x, y, largura?, altura?, variante?,
  espelhar? }`, com x e y no canto de cima à esquerda. As peças e as
  variantes:
  - `parede` (320 x 150; `listras`, `tijolos` para fachada, ou lisa);
  - `piso` (320 x 50; `madeira` ou `calcada`, com meio-fio);
  - `janela` (64 x 52; o céu segue o `periodo`; `cortina`);
  - `porta` (40 x 82; `vidro`, com a plaquinha de loja);
  - `cama` (112 x 50), `mesa` (46 x 34; `cabeceira`, com gavetas),
    `planta` (26 x 44), `quadro` (36 x 28), `tapete` (96 x 16);
  - `prateleira` (64 x 30; `livros`, `paes` ou `potes`);
  - `balcao` (120 x 46; `padaria`, com pães atrás do vidro);
  - `toldo` (200 x 26) e `vitrine` (150 x 84: o vidro com reflexo; ponha
    o que fica dentro dela ANTES, no `cenario`);
  - comércio (rodada 37): `balcao` com as variantes `mercadinho` (a
    esteira e a faixa de estrelas) e `salao` (a recepção, com o
    caderninho), `cesta` (34 x 24, a cesta de compras cheia), `espelho`
    (44 x 58) e `cadeira` (42 x 56, a do salão).
- `dispositivos` (1 a 6): `{ id, tipo, x, y, escala?, variante?, inicial? }`.
  O `id` é o NOME DA VARIÁVEL no código (`lampada`, `luz`, `sensor`) e não
  pode ser um nome que o código já tem (`esperar`, `console`...). O ponto
  (x, y) de cada tipo: lâmpada pendente, a lâmpada (o fio desce do teto);
  lâmpada `variante: "spot"`, a luminária presa no teto ou no toldo;
  sensor e interruptor, o centro; portão (uns 200 de largura: a passagem e
  o muro onde a folha entra), letreiro e forno, o canto de cima à
  esquerda; ventilador, o meio da base. `inicial` muda o começo (ex.: o
  letreiro já mostrando `"PÃO DE MEL"`, o interruptor já ligado).
- `linhaDoTempo`: o que acontece sozinho. `{ tipo: "pessoa", chegaMs,
  saiMs?, x?, y?, lado? }` (ela aparece andando um pouco antes, vinda do
  `lado`, para em `x` e os sensores de presença veem gente de `chegaMs` a
  `saiMs`) e `{ tipo: "interruptor", dispositivo, noMs }` (alguém aperta).
- Confira no `/lab/fases` (a cena aparece com o objetivo ao lado) e no
  `/lab/cenas` (o padrão do kit). A regra `composicao` confere peças,
  dispositivos, nomes e instantes.

### 30.3 Os dispositivos e o relógio simulado

Cada tipo tem a ficha no `catalogo.ts` (o aluno abre tocando nele):

| Tipo | Comandos | Propriedades |
| --- | --- | --- |
| `lampada` | `ligar()`, `desligar()` | `ligada`, `brilho` (0 a 100, troca com `=`) |
| `sensor` (presença) | nenhum | `temGente` (do mundo) |
| `interruptor` | nenhum | `ligado` (do mundo) |
| `portao` | `abrir()`, `fechar()` | `aberto` |
| `letreiro` | `mostrar(texto)`, `apagar()` | `texto` (até 16 letras) |
| `forno` | `ligar()`, `desligar()` | `ligado`, `temperatura` (sobe uns 40 graus por segundo ligado, desce 15 desligado) |
| `ventilador` | `desligar()` | `velocidade` (0 a 3, troca com `=`) |
| `relogio` | nenhum | `hora` (do mundo: a hora cheia, de 0 a 23; cada hora passa em 2 s; `inicial: { hora }` é a hora do começo) |
| `campainha` | `tocar()` | `toques` (quantas vezes tocou) |
| `sensorCarro` | nenhum | `temCarro` (entrada do mundo; o ator libera ao terminar a entrada) |
| `geladeira` | nenhum | `portaAberta` (entrada do mundo) |
| `alarme` | `tocar()`, `parar()` | `tocando` (aviso visual pulsante; sem áudio novo) |
| `semaforo` | `mudar("verde")`, `mudar("amarelo")`, `mudar("vermelho")` | `cor` (para carros; o sinal menor de pedestre libera no vermelho) |
| `botao` | nenhum | `pressionado` (entrada momentânea; soltar exige evento false) |
| `aspersor` | `ligar()`, `desligar()` | `ligado` |
| `sensorUmidade` | nenhum | `valor` (entrada numérica de 0 a 100) |
| `sensorDia` | nenhum | `dia` (entrada booleana, também controla o período visual com `periodoPor`) |
| `registradora` | `mostrar(texto)`, `apagar()` | `texto` (o visor do caixa, até 12 letras, alinhado à direita) |
| `telaApp` | `mostrar(texto)`, `mostrarAgenda(lista, titulo)`, `apagar()` | `texto` e `conflitos` (calculados do que a tela mostra) |

A **tela de aplicativo** (`telaApp`) é a cena de um software: o
"dispositivo" de um programa é a tela dele. `mostrar` põe um recado (até
24 letras); `mostrarAgenda` desenha uma linha por marcação `{ horario,
cliente }` (horário inteiro de 0 a 23), em ordem de horário, até 8 linhas,
com o título curto do dia; o horário que aparece mais de uma vez fica em
vermelho, e `conflitos` diz quantos horários se repetem. Marcação sem
horário ou sem cliente é `TypeError` com a marcação e o que falta. Por
dentro, ela guarda o que mostra num texto só (`conteudo`), e o desenho, o
`texto` e os `conflitos` saem dele (`src/motor/cena/telaApp.ts`).

O forno também aceita `assar(ms)` (1 a 60.000): liga e desliga sozinho
quando o timer acaba; `restante` informa os milissegundos restantes.
`ligar()` ou `desligar()` cancelam o timer. Os comandos antigos mantêm o
comportamento anterior.

- `esperar(ms)` avança o relógio da SIMULAÇÃO (não espera de verdade). Os
  sensores leem a linha do tempo no instante do relógio. Sem `esperar`,
  tudo acontece no mesmo instante: ligar e desligar seguidos não aparecem
  (uma boa previsão).
- Executar (o Snippet) recomeça a cena do zero; o Console continua de onde
  ela está (dá para ler `sensor.temGente`, rodar `esperar(3500)` e ler de
  novo). Depois do Snippet, o mundo continua até o fim da cena, mesmo que
  o código pare antes.
- Loop de controle: `while (true)` com `esperar()` dentro é legítimo. A
  simulação termina sozinha quando o tempo da cena acaba ("A simulação
  terminou"), sem erro, e nem um try/catch do aluno segura. Um loop SEM
  `esperar()` cai na proteção de sempre ("Loop que nunca termina?"), com a
  dica da cena; com `esperar(0)` ou `esperar(1)`, a dica manda esperar mais
  (o limite de 100 mil passos vale: cenas de até 60 s com `esperar(100)`
  ficam bem longe dele).
- Erros em PT-BR, do JavaScript de verdade: trocar uma propriedade só de
  leitura (`lampada.ligada = true`) é `TypeError` com a dica do comando;
  valor fora da faixa (`ventilador.velocidade = 5`) é `RangeError`.
- No Console, `lampada` mostra `Lampada {ligada: false, brilho: 100}`, como
  um objeto do Chrome. Os dispositivos não entram no palco (só o que o
  aluno declara).
- A cena toca como animação (1x, 2x, 4x) depois de cada Executar. A linha
  do tempo da execução, o palco e a linha do código andam junto com a
  cena; escolher um passo na linha do tempo leva a cena para o instante
  dele, só com as mudanças feitas até ali. Limite: a linha do tempo guarda
  as primeiras 1.000 fotos (o rastro da cena guarda até 2.000 mudanças).

### 30.4 Validadores de cena

Olham a simulação de agora (desde o último Executar) e não travam; nenhum
passa antes de a cena rodar.

- `{ tipo: "estadoNaCena", dispositivo, propriedade, valor, noTempo? }`: o
  valor no instante (ms; sem `noTempo`, no fim da cena).
- `{ tipo: "sequenciaNaCena", dispositivo, eventos: [{ acao, aposMs?,
  toleranciaMs? }], exata? }`: o dispositivo fez essas ações em ordem (só
  mudanças de verdade: ligar o que já está ligado não conta). `aposMs` é o
  tempo desde a ação anterior (na primeira, desde o começo), com folga
  padrão de 100 ms; `exata`: nada a mais dessas ações (piscou 3 vezes, e
  não 4). As ações: lâmpada `ligar`, `desligar`, `brilho`; portão `abrir`,
  `fechar`; letreiro `mostrar`, `apagar`; forno `ligar`, `desligar`;
  ventilador `velocidade`, `desligar`; campainha `tocar`.
- `{ tipo: "reagiu", quando: { dispositivo, propriedade, valor }, entao: {
  dispositivo, acao }, prazoMs }`: TODA vez que a propriedade passa a valer
  o valor (o sensor vê gente), a ação acontece no prazo (a luz faz
  `ligar` em até 500 ms). Ligar no começo e deixar ligado não conta.
- `{ tipo: "variosCenarios", linhasDoTempo: [...], validador }`: o código
  roda de novo com cada linha do tempo a cada Executar (como os casos
  escondidos do `funcaoPassa`) e o validador de cena de dentro passa em
  todas. É o que pega o código "decorado" (`esperar(3000); luz.ligar()`).
  Pelo menos 2 linhas do tempo; dentro, só validadores de cena (com
  `todos`, `algum`, `nao`). Com `porLinha` (um validador de cena para cada
  linha do tempo, na mesma ordem), o esperado muda de um dia para o outro
  (o total de clientes, os instantes em que a luz apaga; seção 31.7). A cena mostra as linhas do tempo de teste do
  objetivo de agora ("Teste 1, 2, 3") para o aluno ver que funciona em
  todas.
- Combine com `usouSintaxe` quando o caminho importa (`for`/`while` no
  pisca-pisca; `if` no "roda uma vez só"). Eventos para a ficha e a
  velocidade: `abriuFicha`, `viuPorDentro`, `mudouVelocidade` (validador
  `evento`). Ações: `abrirFicha` e `verPorDentro` (`dispositivo`) e
  `velocidadeCena` (`velocidade`: 1, 2 ou 4).

### 30.5 Escolher dispositivos e linhas do tempo

- Uma missão, um conceito: o pisca-pisca ensina loop e tempo; a vitrine
  ensina o if dentro do loop de controle; o forno serve para um `while`
  que espera uma condição (`while (forno.temperatura < 180)`); o portão,
  para a sequência abrir, esperar, fechar; o interruptor, para reagir a
  uma entrada.
- Poucos dispositivos (1 a 3 na missão); os outros são para explorar
  depois (a fala final convida: "o ventilador também obedece").
- Linhas do tempo de teste com horários bem diferentes (cedo, tarde,
  duas chegadas), longe das bordas da cena, e uma que pega o código que
  só acende e nunca apaga, quando a missão pedir apagar.
- Previsões que funcionam: "liga e desliga sem esperar: o que você vê?",
  "o if sozinho acende quando a pessoa chega no segundo 3?", "em 4x, o
  esperar(500) vale quanto?".

### 30.6 Regra de ritmo

- A partir das cenas, **toda unidade nova da Lógica tem pelo menos uma
  fase com cena**. O `testar:conteudo` cobra (regra `ritmo-das-cenas`) só
  nas unidades fora do `publicados.json`: as publicadas antes ficam
  isentas. Fase de revisão e item de revisão não contam.
- **Cada cena nova é diferente das anteriores**: outro ambiente, outro
  dispositivo ou outra missão. Dentro da mesma unidade, reaproveitar o
  lugar é o normal (a fase 1 apresenta, o desafio usa); uma repetição
  exata (mesmo ambiente, mesmos dispositivos, mesma missão) vira aviso
  `[aviso de cena]` na saída do `testar:conteudo`.
- **Entre unidades diferentes, a mesma cena reprova** (regra
  `cena-repetida-entre-unidades`, rodada 37): o mesmo ambiente com os
  mesmos tipos de aparelho na missão (sem validador de cena, todos os da
  cena). Foi o que deixou os dois chamados com a mesma vitrine, que não
  combinava com nenhum deles. Monte um lugar que combine com o caso. Os
  pares publicados antes da regra e conferidos ficam em
  `CENAS_REPETIDAS_CONFERIDAS` (`src/conteudo/checagens.ts`): hoje só a
  estufa da Depuração U4 e de Estruturas U3.
- **Unidade de software usa a tela de aplicativo como cena** (`telaApp`):
  o programa escreve nela, e é ela que conta para a regra de ritmo. Num
  caixa ou balcão, a registradora (`registradora`) mostra o total.

### 30.7 Como acrescentar peças ao kit

Para outros agentes (inclusive o ChatGPT) criarem ambientes novos no mesmo
padrão visual:

1. **Peça de cenário** (decoração): acrescente o nome em `PECAS_CENARIO`
   (`src/motor/cena/modelo.ts`), o tamanho padrão em `TAMANHO_PADRAO` e o
   desenho em `src/componentes/cena/kit/PecasCenario.tsx` (uma função que
   recebe x, y, largura, altura e variante, registrada em `DESENHOS`).
2. **Dispositivo novo** (o código usa): o tipo em `TIPOS_DISPOSITIVO` e a
   ficha em `CATALOGO_DISPOSITIVOS` (`catalogo.ts`: comandos, propriedades,
   exemplo, estado do começo e o "Por dentro", de 3 a 5 etapas terminando
   no dispositivo), as ações em `ACOES_DO_TIPO`, os métodos em `motor.ts`
   (`criarObjeto`), o desenho e a caixa de toque em
   `kit/DispositivosCena.tsx`, a frase de estado em `resumoDoDispositivo`
   (`CenaSvg.tsx`) e, se ele brilhar sozinho, a parte em `Emissao`.
3. **O padrão visual**: cores só por tokens `--cor-cena-*` (acrescente o
   token nos TRÊS temas de `src/tema/tokens.css`); formas arredondadas;
   contorno `CONTORNO` (fino e transparente); cada peça com a cor de base
   e a "-sombra" dela no lado de baixo ou da direita (luz de cima); sombra
   no chão (`SombraNoChao`) embaixo de móveis e pessoas; nada de texto
   desenhado, a não ser números e letras de display (letreiro, termômetro).
4. **Conferir**: o `/lab/cenas` (a peça nos três temas, de dia e de noite)
   e uma fase de laboratório usando a peça; `npm run testar:conteudo`
   (a regra `composicao` aceita a peça nova só depois do passo 1).

### Ambientes novos do kit

Mostruário: `/lab/cenas`, antes, durante e depois em Doce, Fliperama e
Segredo. Bancada `lab-cenas-novas-u1`: quatro fases, uma por missão (a
cena pertence à fase, não a um objetivo). Os dados estão em
`src/conteudo/laboratorio/cenasNovas.ts`; missões e soluções em
`bancadaCenasNovas.ts`.

| Peça | Tamanho padrão | Uso |
| --- | --- | --- |
| `ceu` | 320 × 160 | Sol/nuvens de dia; lua/estrelas à noite |
| `garagem` | 270 × 142 | Fachada, telhado, bancada e mangueira; portão é dispositivo separado |
| `cozinha` | 180 × 110 | Armários, azulejos, bancada, pia e utensílios |
| `rua` | 320 × 100 | Calçadas, faixa de pedestres e marcas da pista |
| `estufa` | 284 × 162 | Estrutura de vidro, reflexos e janela de ventilação |
| `canteiro` | 124 × 50 | Terra e mudas; variante `tomates` com frutos |

Os dispositivos novos usam o canto superior esquerdo como referência.
Tamanhos: geladeira 52 × 88, semáforo 62 × 108 (inclui o sinal de
pedestre), umidade 30 × 43, demais com caixa de 30 × 30, multiplicados
por `escala`. Carros e pessoas são atores; x/y marcam o chão sob eles.
Para escolher cores, há tokens adicionais `--cor-cena-sinal-vermelho`,
`--cor-cena-sinal-amarelo`, `--cor-cena-sinal-verde` e `--cor-cena-agua`
nos três temas.

As missões cobrem horários distintos de chegada; porta aberta por tempo
curto, exato e prolongado com reabertura; botão cedo/tarde/ausente;
umidade gradual, amanhecer e terra úmida. `porLinha` se soma ao
`validador` comum de `variosCenarios`: condições específicas de horário
ficam em `porLinha`. A estufa lê umidade de uma linha do tempo de teste;
a água desenhada não simula uma equação física de absorção da terra.

Capturas reproduzíveis, com o jogo em produção no ar:
`CAPTURAS=1 node testes/cenas-novas.mjs retrato` (usa `URL_JOGO`).
Saída em `docs/capturas/cenas-novas/`: quatro ambientes × três temas ×
três estados. O modo reduzido mantém gotas fixas e remove o pulso; atores
e portão mudam de posição sem deslocamento contínuo.

### 30.8 Entradas genéricas e atores (extensão do motor)

A linha do tempo também aceita entradas do mundo, sem criar um tipo de
acontecimento para cada aparelho:

```ts
{ em: 1000, dispositivo: "geladeira", propriedade: "portaAberta", valor: true }
{ de: 0, ate: 6000, dispositivo: "sensorUmidade", propriedade: "valor", valorInicial: 80, valorFinal: 20 }
```

Somente propriedades `doMundo` aceitam essas entradas; tipos, faixas e
instantes são conferidos. A rampa interpola linearmente e mantém o valor
final. A entrada que começou por último prevalece, inclusive sobre uma
rampa; em empate, vence a última da lista. Os formatos antigos `pessoa`
e `interruptor` continuam compatíveis; uma entrada explícita de
`sensor.temGente` substitui a leitura automática de presença a partir do
seu instante. `variosCenarios` troca a linha inteira, como antes.

`atores` declara desenhos (`pessoa` ou `carro`), posição, escala opcional,
`visivelQuando` opcional e ações com nomes livres. Cada ação declara
`duracaoMs`, `destino: { x, y }` e, opcionalmente, `aoConcluir`: entradas
`{ dispositivo, propriedade, valor }` aplicadas quando termina. Atores
reagem a `reacoes`, por exemplo:

```ts
{
  quando: { dispositivo: "portao", propriedade: "aberto", valor: true },
  se: [{ dispositivo: "sensorCarro", propriedade: "temCarro", valor: true }],
  atrasoMs: 1200,
  entao: { ator: "carro", acao: "entrar" }
}
```

A reação começa quando todas as condições passam a valer; precisa manter
as condições durante o atraso. Os 1200 ms acompanham a abertura completa
do portão. O ator não inicia outra ação enquanto se desloca. Uma nova
borda pode disparar outra ação depois; a posição parte do último destino.
Movimento, efeitos e sensores são calculados do rastro, sem relógio real,
inclusive no Node, nos testes alternativos e ao rebobinar. Com movimento
reduzido, o desenho troca de posição no fim, mantendo os mesmos tempos.

`periodoPor: { dispositivo: "sensorDia", propriedade: "dia" }` liga o
período visual a uma propriedade booleana: true é dia; false é noite.
Sem esse campo, `periodo` continua fixo como nas cenas publicadas.

O Levar pro mundo dos contratos ainda só exporta os dispositivos e
acontecimentos anteriores. As extensões desta seção são para cenas no
jogo e no laboratório, não para novos contratos exportáveis.

## 31. Contratos: o trabalho de fim de ilha

Modelos: o contrato da Lógica, `logica-programa-de-verdade-u1`
(`src/conteudo/ilhas/logica/programa-de-verdade/unidade-1/`: a fase 1
apresenta a vitrine e os aparelhos; a fase 2 é o contrato da Padaria Pão de
Mel), e a bancada enxuta `/lab/fases?fase=lab-contrato-u1-f1&modo=jogo` (o
estúdio do Rafa). Motor: `src/motor/contrato/` (`modelo.ts`, as etapas, o
checklist antes e depois da mudança, a conferência dos requisitos e o
relatório; `conferir.ts`, as checagens dos dados; `clientes.ts`, o kit de
clientes; `levarProMundo.ts`, o .js que sai do jogo). Tela:
`src/componentes/contrato/`. O mostruário dos clientes: `/lab/clientes`.

No fim de cada ilha, o aluno recebe um trabalho de verdade: um cliente o
contrata para criar um sistema e ele passa pelo processo inteiro. A graça é
ser realista, inclusive na parte em que o cliente muda de ideia no meio.

### 31.1 O formato (as etapas)

1. **Briefing:** o cliente aparece e conta o que quer, do jeito dele. As
   falas aparecem como alguém falando (a boca acompanha o texto) e, no fim,
   vem o pedido por escrito: o **documento do cliente**, que o botão
   "Pedido" (em cima do checklist) reabre a qualquer momento.
2. **Requisitos:** "o que ele pediu de verdade?". O aluno escolhe entre
   cartões (pedidos de verdade e distrações) e completa as lacunas lendo o
   documento. Só segue com a lista certa. Na primeira conferência errada, o
   colega diz o que falta sem dizer qual cartão; da segunda em diante, os
   cartões errados aparecem com o porquê.
3. **Trabalho:** a tela da fase (a composta, com cena, plano, código, palco
   e testes, ou a do DevTools nas ilhas de site) e o checklist dos
   requisitos marcando ao vivo, como no desafio. Antes da etapa de
   requisitos, o checklist não mostra a lista (é o aluno que monta).
4. **Mudança de pedido:** quando as partes de `mudanca.depoisDe` ficam
   prontas, o cliente manda uma mensagem. O checklist muda (com o selo
   "Novo"), o documento ganha o adendo e o código precisa passar nos
   requisitos antigos e nos novos.
5. **Entrega:** tudo marcado abre o relatório automático (pedidos
   atendidos, com o que mudou; dias de teste na cena; casos do aluno
   passando; tempo de trabalho; o processo). O aluno envia, o cliente
   reage e vem a comemoração de fim de ilha.
6. **Levar pro mundo:** na conclusão, o programa sai do jogo (seção 31.8).

O computadorzinho vira **colega de trabalho**: o "Me faz uma pergunta" fala
a `pergunta` de uma parte que falta (em rodízio), sempre de processo
("você já testou com a vitrine vazia?"), e o Rever continua ao lado. O
tutor entra no modo `contrato` (só pergunta e lembra do processo).

### 31.2 O contrato é um desafio com o campo `contrato`

Não é tipo novo: a fase é `tipo: "desafio"` (com `areas`, cena, plano,
testes, como qualquer desafio composto) e o campo `contrato`
(`DadosContrato`):

- `cliente`: o id no kit de clientes (seção 31.6);
- `projeto` (até 40): o nome do trabalho no relatório e no arquivo;
- `briefing`: de 2 a 8 falas do cliente (`{ texto, expressao }`, até 160,
  expressões `feliz`, `pensativo`, `preocupado`, `empolgado`,
  `satisfeito`);
- `documento`: `titulo` (até 60) e de 1 a 8 `paragrafos` (até 320): o
  pedido por escrito, com os números exatos (horários, nomes, formatos);
- `requisitos.cartoes` (até 12): os de verdade com `parte` (a parte do
  desafio que ele vira), as distrações com `sobra: true`, e todos com
  `porque` (até 160); `texto` com lacunas `___`, uma para cada item de
  `lacunas` (`{ opcoes, correta }`, de 2 a 4 opções);
- `mudanca`: `depoisDe` (ids de partes do começo), `mensagem` (1 a 4
  falas), `adendo` (o parágrafo novo do documento) e `novas`
  (`{ parte, substitui? }`: a parte que só existe depois; com
  `substitui`, ela toma o lugar de uma antiga no checklist);
- `entrega.reacao`: de 1 a 4 falas;
- `levarProMundo.arquivo` (ilhas com código): o nome do .js, em kebab-case.

As `partes` do desafio são os requisitos: as do cliente (ligadas aos
cartões e às novas) e as do **processo** (sem cartão: o plano no código,
os casos de teste, ler a ficha). No contrato, toda parte tem `pergunta`
(até 160) e o `revisarEm` pode apontar para uma fase de outra unidade,
antes do contrato, onde a habilidade foi ensinada com objetivo guiado. As
partes novas ficam no fim de `partes` (a meta aplica as soluções em ordem e
termina com o código do depois).

O contrato abre com o cliente, não com a tela de meta; a meta da unidade
(na primeira fase) mostra só a cena antes e depois, nunca o código.

### 31.3 Um briefing com cara de cliente de verdade

- O cliente fala de tudo um pouco, do jeito dele, com o vocabulário do
  negócio ("abro às 7 e fecho às 7 da noite"). Ele não sabe programar: não
  diz "variável", "loop" nem "função".
- Os números aparecem do jeito cotidiano na fala e exatos no documento
  ("7 da noite" na fala, "19h" no documento): a lacuna do cartão obriga a
  traduzir.
- Misture o pedido com conversa: o palpite da sobrinha, o site do vizinho,
  o que fica "pra outro dia". É daí que saem as distrações.
- Dê a cada fala uma expressão que combine (preocupado com a correria,
  empolgado com a ideia, pensativo no detalhe).

### 31.4 Requisitos: distrações e lacunas

- Pelo menos 2 cartões de verdade e 2 distrações (a Lógica tem 4 e 3).
- Boas distrações: o que o cliente comentou mas não pediu (pintar a
  fachada), o que ele disse que fica pra depois (o site) e um quase igual
  ao pedido de verdade ("avisar quando o pão ficar pronto" contra "quando o
  forno chegar a 180 graus").
- Pelo menos uma lacuna, sempre com a resposta no documento (o horário, a
  temperatura, o formato do texto). As opções erradas são plausíveis (18h,
  19h, 20h).
- O `porque` explica sem humilhar: "Quem sugeriu foi a sobrinha, e é
  trabalho de pintor, não de programa."

### 31.5 Uma mudança que faça sentido

- Realista: o cliente usou o que você fez e descobriu algo (a conta de luz
  assustou). Ela chega depois de partes prontas (`depoisDe`), de
  preferência das que ela mexe.
- Ela exige **ajuste real** no código pronto: a checagem roda a solução do
  antes e acusa a parte nova que já passasse com ela. Trocar um requisito
  antigo (`substitui`) é o caso mais comum; acrescentar um novo também vale.
- O documento ganha o `adendo` (o pedido novo, por escrito, com os números)
  e a mensagem termina lembrando o que continua igual ("na abertura ela
  acende, como antes").

### 31.6 O kit de clientes (como criar um cliente novo)

Um cliente é DADO em `src/motor/contrato/clientes.ts`: `id` (kebab-case,
igual à chave), `nome` (até 24), `negocio` (até 40) e a `aparencia` montada
com as peças do kit (`src/componentes/contrato/kit/`):

- `pele`: `clara`, `media`, `morena`, `escura`;
- `cabelo`: `coque`, `curto`, `cacheado`, `longo`, `careca`, `rabo`, com
  `corCabelo`: `preto`, `castanho`, `ruivo`, `loiro`, `grisalho`;
- `roupa`: `avental`, `camisa`, `jaleco`, `macacao`, com `corRoupa`:
  `azul`, `vermelho`, `verde`, `amarelo`, `roxo`;
- `acessorios`: `oculos`, `bigode`, `touca`, `brincos`, `lenco`, `bone`.

Nomes e negócios originais (nada de personagens ou marcas conhecidas).
Confira o cliente novo no `/lab/clientes` (as cinco expressões, falando, nos
três temas). Para uma peça nova do kit: o nome na lista do `clientes.ts`, o
desenho no arquivo da peça (`Cabelo.tsx`, `Roupa.tsx`, `Acessorios.tsx`),
cores só por tokens `--cor-cliente-*` nos TRÊS temas de
`src/tema/tokens.css`, formas arredondadas, contorno `CONTORNO` e a sombra
como camada escura transparente (`SOMBRA`).

O cliente tem a vida do computadorzinho: pisca, respira, inclina a cabeça
para pensar, pula de empolgação e, falando, a boca abre nas vogais e quase
fecha nas consoantes (`formaDaLetra`).

### 31.7 Validadores e a fábrica

- Os de sempre: os de cena (seção 30.4), os de código, `funcaoPassa`,
  `casosDoAluno`, `ordemValida` e `planoComentado`.
- `variosCenarios` com `porLinha`: um validador de cena a mais para cada
  linha do tempo (o que muda de um dia para o outro: quantos clientes
  passaram, quando a luz apaga). Os instantes conferidos ficam longe das
  trocas (um pouco mais de meia hora da cena depois de cada uma), para
  valer qualquer ritmo de loop razoável.
- A regra `contrato` confere os dados (seção 31.2). O `testar:conteudo`
  joga o contrato inteiro (`jogarContrato`): a lista certa passa e as
  erradas não; as partes do começo, uma a uma, com as soluções delas (o
  antes); a mudança chegando; cada parte nova falhando com o código do
  antes; as soluções das partes novas (o depois); e tudo passando junto no
  fim. As soluções de código são em camadas: cada uma é o código inteiro
  até ali (com o bloco do plano no topo).
- O relatório e a conferência dos requisitos são funções puras
  (`montarRelatorio`, `conferirRequisitos`).

### 31.8 Levar pro mundo

Regra (rodada 37): o arquivo leva **todos** os aparelhos da cena; se o
exportador não sabe levar um deles, o contrato não oferece o botão (a
regra `contrato` reprova `levarProMundo` nesse caso). A registradora e a
tela de aplicativo já saem do jogo (a agenda aparece no console, com o
horário repetido marcado); os aparelhos e as entradas genéricas da seção
30.8 ainda não.

Nas ilhas com código, a conclusão do contrato tem o "Levar pro mundo": um
.js com o programa do aluno e uma versão simples dos aparelhos da cena, que
escrevem no console o que fariam ("[07:00] Luz da vitrine: ligada"), no
relógio simulado; os acontecimentos da linha do tempo também aparecem
("Chegou alguém."). Roda no Console de qualquer navegador (colar e Enter) e
no Node (`node arquivo.js`); as instruções vão no topo do arquivo. Dê a
cada dispositivo da cena um `nome` (até 24: "Luz da vitrine"), que é como
ele aparece fora do código. Nas próximas ilhas, o Levar pro mundo é o da
ilha (o site com interação, o sistema com dados).

### 31.9 Checklist de um contrato novo

- [ ] Uma fase antes do contrato apresenta as ferramentas e os aparelhos
      novos (o desafio não apresenta nada).
- [ ] Briefing com cara de cliente, documento com os números exatos.
- [ ] Cartões: pedidos de verdade, distrações plausíveis, lacunas com a
      resposta no documento, `porque` em todos.
- [ ] Partes do cliente e do processo, cada uma com `pergunta` de colega.
- [ ] Mudança realista, depois de partes prontas, exigindo ajuste real.
- [ ] Vários dias de teste (`variosCenarios`, com `porLinha` quando o
      esperado muda de um dia para o outro).
- [ ] Reação do cliente, conclusão à altura do fim da ilha e o Levar pro
      mundo.
- [ ] `testar:conteudo` verde (a jogada do contrato inteiro) e a jornada de
      navegador nos três layouts.

### 31.10 Chamados de manutenção (contrato no meio da ilha)

Modelos: `logica-depuracao-u5` (o estoque do Mercadinho Estrela) e
`logica-depuracao-u6` (a agenda do Salão Girassol), em
`src/conteudo/ilhas/logica/depuracao/`; peças comuns em `chamados.ts`.
É o mesmo formato contrato, com o trabalho invertido: em vez de criar um
sistema, o aluno conserta um que já existe, como num serviço de verdade.

- **Unidade curta:** uma fase de aquecimento (prática, que ensina o
  conceito, com uma cena que combine com o caso) e o contrato. Cenas
  próprias (rodada 37): o caixa do Mercadinho Estrela (o balcão com a
  esteira, a cesta e a registradora, cujo visor mostra o total) e a
  recepção do Salão Girassol (o espelho, a cadeira e a tela do aplicativo
  no balcão), que o contrato da agenda também usa: a terça aparece com o
  horário marcado em dobro em vermelho até o conserto. O contrato do
  estoque segue sem cena (o software é o próprio programa, com palco,
  console e casos de teste) e a meta mostra a saída do programa antes e
  depois (seção 3.10).
- **`fimDeIlha: false`** no `contrato`: a entrega não mostra a
  comemoração de fim de ilha (que é do trabalho que fecha a ilha). A zona
  termina com o contrato da padaria. O Levar pro mundo segue a regra da
  seção 31.8: a agenda oferece (`agenda-do-salao.js`, a agenda no console);
  o estoque, sem cena e sem nada que o programa escreva, não.
- **O cliente é vago:** "às vezes dá errado, não sei quando". O defeito
  real depende de uma condição que o briefing não diz (a entrega digitada
  como texto; o horário ocupado só ser notado se for o primeiro da lista).
- **Diagnóstico com cartões:** o quadro de plano (modo `agrupar`) é o
  relatório do conserto, com três passos grandes (O que estava errado,
  Como foi achado, Como foi testado). A causa raiz é escolhida num grupo
  entre cartões de hipóteses plausíveis (`sobra`). A parte `causa` confere
  com `passoNoPlano` na certa e `nao(passoNoPlano)` em cada distração: o
  cliente pede, num cartão de requisito, que a causa seja dita antes de
  consertar. A parte do conserto vem depois dela no checklist.
- **Entrega com o relatório:** a parte `relatorio` pede `ordemValida` e
  `planoComentado`: os cartões que sobraram (como foi achado e testado)
  entram no quadro e o relatório vai para o topo do Snippet, em
  comentários. As soluções em camadas que redefinem o código depois dele
  precisam repetir o bloco (use `linhasDoPlano` para gerar o mesmo texto).
- **Investigar sem depender do número da linha:** o plano no código
  desloca as linhas. Em contrato, `reproduzir` usa `observou` com valor
  (`typeof mov.quantidade`, a comparação do if), sem `pausouNaLinha`.
- **Conserto sem quebrar o resto:** o `funcaoPassa` do conserto tem casos
  escondidos que já funcionavam (o dia só de venda, a lista vazia) e o que
  falhava. Consertos de sintoma ("devolver o resultado da sexta",
  `Number(a + b)`, recusar tudo) têm que cair neles; os testes
  `testes/conteudo/chamados.test.ts` provam isso com sabotagens.
- **A mudança** pode ser um segundo sintoma ou uma regra nova que o
  cliente descobre depois do primeiro conserto: a parte nova toma o lugar
  da do conserto (`substitui`) e junta os casos antigos aos novos.
- **Clientes novos** no kit (`seu-tonho`, `dona-zelia`), como na seção 31.6.
- **Conceitos do chamado:** reproduzir o defeito, causa raiz e teste de
  regressão, cada um com dois itens de revisão.

---

## 32. O Museu das Origens: a área exposicao e os antepassados

O museu (`/ilha/origens`) é um corredor de épocas. Cada época tem um
antepassado do computadorzinho, e quase toda época recebe uma **sala**: uma
unidade da zona `museu` com exposições interativas e um pequeno desafio no
fim, no modelo pedagógico de sempre (guiado, sozinho, desafio em contexto
novo), mas com cara de museu: explorar, tocar, descobrir. As salas 1 e 2
são o modelo (`src/conteudo/ilhas/origens/museu/`).

### 32.1 A sala é uma fase composta

Uma fase do museu é uma `pratica` (ou um `desafio`) com
`areas: ["exposicao"]` e o campo `exposicao`. A área ocupa a tela inteira
(é sempre a única), sem programa, e usa `siteAlvo: SITE_DO_PROGRAMA`. A
tela mostra a placa da peça, o antepassado anfitrião falando no jeito da
época dele e as estações (no desafio, várias, em abas). O computadorzinho
continua no lugar de sempre, com o enunciado, a escada de ajuda e a
conversa. Tudo o que vale para fase de prática vale aqui: objetivos
guiados e sozinho, previsões, `apresentar`, conclusão, missão de campo.

```ts
{
  id: "origens-museu-u1-f1", tipo: "pratica", unidadeId: "origens-museu-u1",
  areas: ["exposicao"],
  siteAlvo: SITE_DO_PROGRAMA,
  usaFerramentas: ["tear-de-cartoes"],
  exposicao: {
    anfitriao: "tecela",
    placa: { titulo: "O tear de Jacquard", texto: "Início dos anos 1800. ..." },
    falas: { abrir: "...", porEtapa: { "furar-linha-cheia": "..." }, concluir: "..." },
    estacoes: [{ id: "tear-flor", tipo: "tear", titulo: "O tear da árvore", modelo: ["..#..", ".###."], inicial: ["..#..", "....."] }],
  },
  objetivos: [ ... ],
}
```

### 32.2 As estações

Modelo puro em `src/motor/exposicao/modelo.ts`; a tela de cada uma em
`src/componentes/museu/exposicao/`. Cada tipo tem a sua ferramenta (que
precisa estar em `usaFerramentas` e ser apresentada na primeira vez):

| Tipo | O que é | Ferramenta |
| --- | --- | --- |
| `tear` | cartões que tecem um desenho: `modelo` (uma linha por cartão, `#` furo, `.` sem furo), `inicial`, `mostrarBinario` | `tear-de-cartoes` |
| `bits` | lâmpadas ou válvulas (`aparencia`), `quantos` 4 ou 8, `pesos`, `letra` (só com 8: a tabela ASCII) | `lampadas-de-bits` |
| `camadas` | o mesmo programa em 2 a 4 camadas; cada linha diz `de` quais linhas da camada de cima ela veio | `camadas-da-maquina` |
| `cor` | `#rrggbb` com setinhas por dígito, o CSS que usa a cor (`css`) e uma `amostra` | `mesa-de-cores` |
| `linha-do-tempo` | `eventos` JÁ NA ORDEM CERTA (a tela embaralha), `fixos` (âncoras), `plaquinhas` (o "o que mudou" solto) | `linha-do-tempo-museu` |

Na linha do tempo: cada cartão no lugar certo (em relação aos outros da
linha) mostra a época e o que mudou; com `plaquinhas`, mostra só a época
e as frases ficam soltas para pendurar. **Fatos conferidos e sem data
inventada:** na dúvida, a década ("anos 1940"); a checagem reclama de uma
época que pareça data exata. Não ponha dois cartões da mesma década na
mesma linha (a ordem tem que ser clara). Os eventos das salas ficam em
`unidade-2/eventos.ts`, com a fonte de cada fato no comentário.

### 32.3 Validadores e ações

Validadores (olham o estado de agora: desfazer desmarca a parte do
desafio): `tecidoIgual` (com `linhas` para só alguns cartões),
`bitsValem`, `camadaAberta`, `linhaEscolhida`, `corHex` (`valor` ou
`canais` com faixas), `linhaEmOrdem` (com `eventos` para um subconjunto) e
`plaquinhasCertas` (com `eventos`). Ações (o que o aluno faz; as soluções
passam pelas mesmas funções da tela): `abrirEstacao`, `furarCartao`
(`furado` opcional: sem ele, alterna), `alternarBit` (`ligado` opcional),
`descerCamada`, `escolherLinha`, `definirCor`, `porNaLinha` (`posicao`
opcional), `tirarDaLinha` e `pendurarPlaquinha`. Todas geram
`mexeuNaExposicao`. O degrau 3 aponta com
`{ alvo: "exposicao", estacao, peca?, fala }` (a peça: `"2-0"` é o furo da
linha 2, coluna 0; `"1"` a lâmpada 1; o id de uma linha ou de um cartão;
`"descer"`; `"r"`, `"g"` ou `"b"`). O objetivo novo abre sozinho a
estação que o validador dele olha.

A Revisão do dia não aceita a área exposicao: os itens dos conceitos do
museu são previsões sobre uma vitrine pequena (`src/conteudo/revisao/origens.ts`).

### 32.4 O anfitrião e as falas

`anfitriao` é um antepassado (abaixo). `falas.abrir` aparece quando a fase
abre; `falas.porEtapa[id]` quando aquele objetivo começa (na prática) ou
quando aquela parte é feita (no desafio); `falas.concluir` no fim. Até 160
caracteres, no **jeito de falar do anfitrião** (a tecelã é avó paciente, o
gigante fala ALTO, o terminal é seco e rabugento, o PC bege é animado, a
internet é tagarela, o celular é curto). A fala do anfitrião conversa com o
computadorzinho, não repete o enunciado.

### 32.5 Os antepassados

Ficha em dados: `src/motor/exposicao/antepassados.ts` (nome, máquina,
época, parentesco, sala, jeito de falar, saudação, aviso de em breve,
boas-vindas e a reação do computadorzinho). Desenho em
`src/componentes/museu/antepassados/`: cada um usa as peças comuns
(`Olhos`, `Boca`, `Braco`), pisca, respira, a boca acompanha o texto
(abre nas vogais) e dorme em silhueta. O jeito de falar mora em
`FalaAntepassado.tsx`: trama (letra a letra, com a lançadeira), engrenagens
(girando), válvulas (palavra a palavra, cada palavra acende uma válvula),
terminal (maiúsculas sem acento, com o cursor; o leitor de tela ouve com
acento), 8 bits (quadro azul), modem (o texto sai do chiado) e notificação
(uma por frase). Cada época tem os seus sons sintetizados
(`fala-*` e `epoca-*` em `src/audio/receitas.ts`). Cores só por tokens
(`--cor-ante-*` e `--cor-museu-*`, nos três temas). Mostruário:
`/lab/antepassados`.

### 32.6 O corredor e a próxima geração

`src/componentes/museu/corredor/`: o corredor corre de lado no computador
e desce no celular; a parede do fundo anda mais devagar. A regra das portas
(`src/lib/museu.ts`) sai do currículo e do progresso: sala com conteúdo
mostra Entrar, Continuar ou Jogar de novo; sem conteúdo, Em breve; as salas
seguem em sequência. No fim fica a árvore da família, com o lugar da
próxima geração: ele abre quando a sala 2 (`SALA_DA_PROXIMA_GERACAO`)
termina; o aluno monta o retrato com o kit de clientes e entra para a
família (`proximaGeracao` no progresso).

### 32.7 Como criar uma sala nova (sem quebrar o padrão)

1. Leia a sala no `MAPA-CURRICULAR.md` (Ilha 0) e tire o `requerMotor` da
   unidade em `src/curriculo/curriculo.ts` só se as estações que ela pede
   já existem (senão, é trabalho de motor: 32.8).
2. Crie `src/conteudo/ilhas/origens/museu/unidade-N/` com as fases e o
   `unidade.ts`, como as salas 1 e 2: 2 a 4 exposições e o desafio, que
   junta as estações em abas e aponta `revisarEm` para a exposição guiada.
3. O anfitrião é o antepassado da ficha que tem `sala` igual à unidade; os
   outros podem aparecer de visita numa exposição (como o gigante na sala
   1). Escreva as falas no jeito dele.
4. Conceitos novos com temas (`fundamentos` quase sempre) e `termoIngles`;
   dois itens de revisão por conceito (previsões, 32.3).
5. Registre em `src/conteudo/index.ts` (o museu vem antes de Sites, na
   ordem do currículo), rode `npm run testar:conteudo`, publique
   (`npm run publicar:conteudo`) e rode `node testes/museu.mjs` nos três
   layouts (a jornada joga todas as salas publicadas pela porta do
   corredor).
6. Se a sala nova precisa abrir o lugar da próxima geração em vez da sala
   2, mude `SALA_DA_PROXIMA_GERACAO` (e diga no relatório).

### 32.8 Como criar um tipo de estação novo

Trabalho de motor: o tipo e o estado em `modelo.ts` (com o estado inicial,
a forma salva, as mudanças e `aplicarAcaoExposicao`), as ações e os
validadores em `src/conteudo/tipos.ts`, `executarAcao.ts` e
`validadores.ts`, a conferência dos dados em `exposicao/conferir.ts` e na
checagem `exposicao-do-museu`, a leitura do progresso salvo
(`src/lib/progresso.ts`), a ferramenta em `src/ferramentas` (com ícone e
`FERRAMENTA_DA_ESTACAO`), a tela em `src/componentes/museu/exposicao/`
(com a peça de mexer em `NucleoDaEstacao`, o alvo das apresentações) e a
miniatura da meta (`MiniComposicao`). As salas 3 a 5 pedem três estações
novas: o comparador de linguagens executável, o computador aberto com os
portões e o diagrama de rede.

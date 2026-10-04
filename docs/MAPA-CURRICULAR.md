# Mapa curricular

O percurso inteiro do jogo, ilha por ilha. É a fonte para escolher a
próxima unidade (ver `docs/GUIA-DE-CONTEUDO.md`, "Como escolher a próxima
unidade"). A versão em dados, que o mapa das ilhas e as checagens usam,
fica em `src/curriculo/curriculo.ts`: cada unidade daqui tem lá um id, um
título e a meta em uma frase. Uma unidade é **pronta** quando existe
conteúdo registrado com aquele id (`src/conteudo/index.ts`); senão, é
**planejada**. Ninguém marca status à mão.

Onde está escrito **Requer motor**, o motor ainda não tem o que a zona (ou
a unidade) precisa. Unidade assim não é produzida: pare e relate o que
falta.

## Filosofia

Cortar o que não serve na prática para quem vai programar (por exemplo, a
matemática pesada da engenharia), mas **manter** o que sustenta tudo:
estruturas de dados, algoritmos e o funcionamento do computador,
ensinados pela intuição, com exemplos e sem fórmula. E acrescentar o que
o programador de hoje precisa no dia a dia: TypeScript, testes, Git em
equipe, segurança e trabalhar com IA com critério.

## Meta geral

Levar uma pessoa do zero até o nível de dev júnior web (front e back), de
forma interativa e sólida. Princípios:

- unidade = X dividido em Ys (guiado, depois sozinho, depois desafio em
  contexto novo);
- revisão espaçada;
- tudo ligado ao F12 de verdade;
- cada ilha termina com algo feito fora do jogo;
- toda dúvida de leigo respondida.

Cada unidade abaixo traz: meta (X), conceitos, micro-passos sugeridos,
desafio, revisa, confusões de leigo a atacar, e o que falta no motor,
quando falta.

## Trilhas

As ilhas deste documento formam a trilha **Web** (a ativa). O núcleo
comum (Origens, Lógica, IA e Ofício) serve para todas as trilhas; as
outras duas estão em construção, com as ilhas próprias só nomeadas (em
dados: `TRILHAS` em `src/curriculo/trilhas.ts` e `ILHAS_FUTURAS` em
`src/curriculo/curriculo.ts`):

- **Jogos**: Origens, Lógica, Primeiro jogo, Gráficos e animação, Física
  e colisão, IA, Ofício.
- **Automação industrial**: Origens, Eletrônica, Comandos elétricos,
  Mecânica, Lógica, CLP e Ladder, IA, Ofício. Vai receber o protótipo
  `InterativAIPLUS`, portado depois que a camada de trilhas e a fábrica
  estiverem estáveis.

---

## Ilha 0: Origens (museu, sempre aberta)

Id no currículo: `origens`, zona `museu`.

**Requer motor:** tipos de atividade linha do tempo, comparador de
linguagens executável e diagrama de rede.

Salas (a sala 6 entrou na rodada 9, depois das outras, para manter os
ids):

1. **Como o computador entende** (`origens-museu-u1`): bits, instruções,
   da linguagem de máquina às linguagens que a gente escreve.
2. **Linha do tempo** (`origens-museu-u2`): dos cartões perfurados à IA.
3. **Por que existem tantas linguagens** (`origens-museu-u3`): o mesmo
   programa em várias linguagens, lado a lado, rodando.
4. **Onde a programação vive** (`origens-museu-u4`): o dia a dia e as
   carreiras.
5. **Front, back e o caminho de um clique** (`origens-museu-u5`): visão
   geral.
6. **Por baixo do capô** (`origens-museu-u6`): memória, processador,
   sistema operacional, arquivos, binário e hexadecimal (ligado às cores
   do CSS: `#ff8800` é hexadecimal) e a internet física (cabos,
   servidores, pacotes). Aqui também moram os **quebra-cabeças maiores
   com portões lógicos** (ideia aprovada na rodada 12): somar dois números
   só com portões E, OU e NÃO e montar uma memória simples com
   realimentação (a saída voltando para a entrada, o mesmo princípio do
   selo da contatora dos comandos elétricos). O tipo de fase
   `circuito-logico` ficou pronto na rodada 17, já com realimentação;
   **requer motor:** os tipos de atividade do museu.

---

## Ilha 1: Sites

Id no currículo: `sites`.

### Zona Elementos (`elementos`)

Motor pronto (depois da rodada 5), exceto a U6.

#### U1. O site é seu (pronta) — `sites-elementos-u1`

#### U2. Faxina no site (pronta) — `sites-elementos-u2`

#### U3. Títulos e textos — `sites-elementos-u3`

- **Meta:** organizar um artigo bagunçado com a hierarquia de títulos e as
  ênfases corretas.
- **Conceitos:** h1 a h6 e hierarquia; p; strong vs b e em vs i
  (importância vs aparência); ul vs ol.
- **Micro-passos:** consertar a hierarquia renomeando tags; transformar
  lista em lista numerada; destacar com strong; previsão "o que muda se
  trocar h2 por h4?".
- **Desafio:** página de uma receita de bolo, com títulos, ingredientes em
  lista e passos numerados.
- **Revisa:** editar texto, duplicar, trilha.
- **Confusões:** "título é só pra letra ficar grande" (é estrutura, e
  leitores de tela e o Google usam); "b e strong são iguais".

#### U4. Links, imagens, id e class — `sites-elementos-u4`

- **Meta:** consertar um site com links quebrados e imagens sem descrição,
  e organizar elementos com id e class.
- **Conceitos:** a e href; target; link âncora (#id); img, src e alt
  (imagens como SVG embutido, nunca externas); id (único) vs class
  (repetível).
- **Micro-passos:** trocar um href quebrado; adicionar alt; criar um link
  âncora até o rodapé; dar a mesma class a vários cards; previsão "e se
  dois elementos tiverem o mesmo id?".
- **Desafio:** site de uma banda fictícia.
- **Revisa:** editar atributo, duplicar.
- **Confusões:** "alt é legenda"; "id e class são a mesma coisa".

#### U5. Caixas e seções — `sites-elementos-u5`

- **Meta:** dar estrutura a um site feito só de div, trocando por header,
  nav, main, section, article e footer onde fizer sentido.
- **Conceitos:** div (caixa genérica, sem significado) e span; semântica e
  por que ela existe (acessibilidade, leitores de tela, busca,
  manutenção).
- **Micro-passos:** agrupar elementos numa div pelo editor e ver que nada
  muda na tela (previsão); renomear div para header e footer; distinguir
  section de article; usar span num trecho de texto.
- **Desafio:** site de um pet shop fictício feito só de div.
- **Revisa:** trilha, pai e filho, renomear tag.
- **Confusões:** "a div faz alguma coisa visual" (sem CSS ela é
  invisível); "se só div funciona, tanto faz".

#### U6. Página do zero — `sites-elementos-u6`

- **Motor pronto (rodada 9):** fase com `modoDocumento` (documento
  inteiro no editor e na árvore, aba com o `<title>` ao vivo, validador
  `tituloDaAba`, simulação dos acentos sem meta charset). Exemplo: a
  Bancada do documento no `/lab/fases`.
- **Meta:** escrever uma página completa do zero: doctype, html, head
  (title, meta charset, meta viewport) e body.
- **Conceitos:** estrutura do documento; head vs body; title; meta charset
  (acento quebrado sem ele).
- **Desafio:** um cartão de visita pessoal do zero.

### Zona Estilos (`estilos`)

**Motor pronto (rodada 9) para E1 a E4:** painel Estilos dentro de
Elementos (regras do elemento selecionado, editar valores ao vivo,
caixinha para ligar e desligar, adicionar declaração e regra, riscadas),
aba Calculado com o diagrama de caixa, editor com abas HTML e CSS e os
validadores de CSS (guia, seção 12). A E5 continua pedindo motor.

#### E1. A aba Estilos — `sites-estilos-u1`

- **Meta:** redesenhar cores e textos de um site sem tocar no HTML.
- **Conceitos:** o que é CSS; propriedade e valor; color,
  background-color, font-size, font-family, font-weight, text-align; cores
  por nome e hex; px e rem.
- **Desafio:** repaginar a identidade de uma cafeteria.

#### E2. Seletores — `sites-estilos-u2`

- **Conceitos:** seletor de tag, .classe, #id, descendente; como uma regra
  encontra seus elementos.
- **Desafio:** estilizar só os itens em promoção.

#### E3. Modelo de caixa — `sites-estilos-u3`

- **Conceitos:** content, padding, border, margin; o diagrama do DevTools;
  box-sizing.
- **Confusão:** margin vs padding.
- **Desafio:** consertar cards espremidos.

#### E4. Por que minha regra não pega? — `sites-estilos-u4`

- **Conceitos:** cascata, ordem, especificidade, herança, !important e por
  que evitar; regras riscadas no painel.
- **Desafio:** depurar um site com três regras que não funcionam.

#### E5. Variáveis e temas — `sites-estilos-u5`

- **Requer motor:** o próprio jogo como site-alvo (tokens do tema
  editáveis na aba Estilos).
- **Conceitos:** custom properties e var().
- **Desafio:** criar um tema novo pro próprio jogo, salvo como "Meu tema".

### Zona Layout (`layout`)

**Motor pronto (rodada 9):** o mesmo da zona Estilos. Um editor visual de
flex e grid como o do Chrome seria bom, mas não é obrigatório.

- **L1. Display** (`sites-layout-u1`): block, inline, inline-block, none
  (revisa: none vs esconder mantendo espaço). Desafio: menu horizontal.
- **L2. Flexbox** (`sites-layout-u2`): direction, justify-content,
  align-items, gap, wrap. Desafio: barra de navegação e cards alinhados.
- **L3. Grid** (`sites-layout-u3`): colunas, linhas, fr, gap, áreas.
  Desafio: layout de revista.
- **L4. Posição e camadas** (`sites-layout-u4`): relative, absolute,
  fixed, sticky, z-index. Desafio: selo de promoção sobre o card e
  cabeçalho fixo.

### Zona Responsivo (`responsivo`)

**Requer motor:** modo dispositivo na prévia (tamanhos de tela e girar).

- **R1. Modo dispositivo** (`sites-responsivo-u1`): ver o site em celular,
  tablet e PC; meta viewport; o que quebra. Desafio: diagnosticar três
  problemas no celular.
- **R2. Media queries e mobile first** (`sites-responsivo-u2`): @media,
  breakpoints, %, vw, max-width e imagens responsivas. Desafio: deixar o
  site de um restaurante bom no celular.

### Zona Publicar (`publicar`)

Motores prontos (Rodada 12): aba Lighthouse (auditoria simplificada),
Levar pro mundo (.zip com index.html e style.css) e o tipo de fase
projeto-ponte. A P2 está publicada; a P1 espera o conteúdo.

- **P1. Acessibilidade e Lighthouse** (`sites-publicar-u1`): contraste,
  alt, rótulos, ordem de títulos (revisa U3), navegação por teclado.
  Desafio: levar um site de nota baixa a nota alta.
- **P2. Do jogo pro mundo** (`sites-publicar-u2`, saída da ilha): arquivos
  de verdade (index.html e style.css), editor real, publicar e ter um
  link. Projeto-ponte: o site pessoal do jogador, publicado. As
  ferramentas e serviços recomendados são verificados na época da
  produção. Publicada (Rodada 12): Fase 1 "Arquivos de verdade" (o site da
  Bia conferido no celular e no Lighthouse e levado pro mundo) e Fase 2
  "Meu primeiro site" (projeto-ponte). O guia de publicação mora em
  `src/conteudo/publicacao.ts` (Netlify Drop, verificado em 2026-09-28).

### Zona Ser encontrado (`ser-encontrado`, opcional)

**Zona opcional** (`opcional: true` no currículo): no fim da Ilha Sites,
depois de Publicar. Não conta para concluir a ilha nem para abrir a
Lógica; aparece no mapa com a plaquinha "Opcional" e vale nas lentes de
tema (Presença digital) e de profissão.

**Filosofia da zona:** ensinar o que o programador faz (o HTML que a busca
lê, os dados estruturados, os eventos e os links rastreáveis, a página de
destino rápida e clara) e os conceitos que não envelhecem (rastreamento,
indexação, leilão, conversão). O passo a passo de cada plataforma (o
perfil da empresa no Google, o Search Console, as plataformas de anúncio)
muda de tela o tempo todo: ele mora num arquivo de dados com data de
verificação, `src/conteudo/plataformas-marketing.ts`, e a tela mostra
"conferido em <data>". Os textos entram na produção de conteúdo, conferidos
na época, nunca de memória. Toda ferramenta da zona que simula algo
(busca, medição, campanha) diz na tela que é uma simulação aproximada.

**Motores (Rodada 14):** painel "Resultado na busca" e "Teste de dados
estruturados" (S1 a S3), "Medição" com o construtor de link rastreável
(S4) e o tipo de fase `simulador-campanha` (S5). S1 publicada como
unidade-modelo.

- **S1. Como o Google acha seu site** (`sites-ser-encontrado-u1`):
  rastreamento (o robô que visita e segue links), indexação (a página
  entra no catálogo), o `<title>` e a `<meta name="description">` como o
  título e a descrição do resultado, o corte dos textos longos e o
  `noindex` (a página some da busca). Desafio: a página de uma loja que
  não aparece direito na busca. Confusões: "o Google lê o site na hora da
  busca"; "a descrição muda o ranking"; "noindex é segredo" (a página
  continua no ar, só sai da busca).
- **S2. SEO na página** (`sites-ser-encontrado-u2`): um h1 que diz do que a
  página trata e títulos em ordem (revisa U3), textos que respondem o que
  a pessoa busca, alt nas imagens (revisa U4 e P1), textos de link que
  dizem para onde vão e velocidade (revisa P1 e o Lighthouse). Desafio:
  uma página bonita e invisível para a busca. Confusões: "encher de
  palavra-chave ajuda"; "SEO é truque" (é, na maior parte, fazer a página
  boa para quem lê). **Publicada (Rodada 16):** 4 fases (h1; texto que
  responde e enchimento; links e alt; velocidade e imagem preguiçosa) e o
  desafio Casa de Chá Lótus.
- **S3. Seu negócio no mapa** (`sites-ser-encontrado-u3`): o perfil da
  empresa no Google (o que é, o que o programador ajuda a preencher; o
  passo a passo fica no arquivo de plataformas), nome, endereço e telefone
  iguais em todo lugar, avaliações (responder, nunca comprar) e os dados
  estruturados `LocalBusiness` (JSON-LD) ligando o site ao negócio.
  Desafio: uma padaria com três endereços diferentes espalhados. Painel
  "Teste de dados estruturados". Confusões: "dados estruturados garantem o
  cartão no mapa" (ajudam a busca a entender; quem decide é ela).
  **Publicada (Rodada 16):** 4 fases (dados iguais e o perfil; avaliações;
  JSON-LD; subtipos) e o desafio Padaria Pão de Mel.
- **S4. Medir quem chega** (`sites-ser-encontrado-u4`): Search Console (o
  que a busca vê do seu site) e Analytics (o que as pessoas fazem nele),
  como conceitos; links rastreáveis com `utm_source`, `utm_medium` e
  `utm_campaign`; eventos de conversão (o clique no WhatsApp, o envio do
  pedido). Painel "Medição" (simulado: o site-alvo ainda não roda
  JavaScript; o código de medição de verdade vem na Páginas vivas).
  Desafio: descobrir qual divulgação trouxe clientes. Confusões: "visita é
  cliente"; "UTM muda a página". **Publicada (Rodada 16):** 3 fases
  (eventos e conversão; Search Console; utm) e o desafio Casa de Sucos
  Vitamina.
- **S5. Anúncio pago por dentro** (`sites-ser-encontrado-u5`): leilão,
  palavra-chave, orçamento diário, custo por clique, página de destino e
  conversão; a posição depende do lance vezes a qualidade. Por que um site
  ruim queima o dinheiro do anúncio. Tipo de fase `simulador-campanha`
  (números fictícios, declarados). Desafio: a mesma verba trazendo mais
  clientes depois de melhorar a página. Confusões: "quem paga mais sempre
  aparece em primeiro"; "mais cliques é mais clientes". **Publicada
  (Rodada 16):** 4 fases do tipo simulador-campanha; a última é o desafio
  "mesma verba, mais clientes" (sem meta com antes e depois). O texto diz
  que lance vezes qualidade é simplificação e que o Índice de qualidade é só
  diagnóstico.

---

## Ilha 2: Lógica (JavaScript puro)

Id no currículo: `logica`. Unidades `logica-<zona>-u<n>`, detalhadas na
rodada 17 (motor da Lógica, parte A).

**Princípio da ilha.** Aqui começa programar de verdade, e o coração do
jogo continua o mesmo: ver a estrutura mudar em tempo real. Lógica não tem
"tela de site", então a tela vira o **palco da memória**: cada variável é
uma caixinha com nome, valor e tipo; uma lista é uma fileira de vagões
numerados; um objeto é uma ficha de chave e valor. Tudo muda ao vivo quando
o código roda, e a **linha do tempo** rebobina a execução passo a passo.
Tudo que o jogador aprende funciona no Console do F12 de verdade.

**Ferramentas (parte A, rodada 17):** aba Console (fiel ao Chrome: resposta
de cada expressão, `undefined` depois de declarações, histórico com a seta
para cima, Shift+Enter para várias linhas, limpar), o Snippet (editor de
programas maiores com Executar e Ctrl+Enter; no Chrome fica em Fontes >
Snippets), o palco da memória, a linha do tempo e o tipo de fase
`circuito-logico`. Validadores de código: `valorVariavel`,
`respostaDoConsole`, `saida`, `semErro`, `erroDoTipo`, `usouSintaxe` e
`funcaoPassa` (guia, seção 25). As zonas não requerem mais motor; só as
unidades da parte B abaixo.

**Ler erro desde o começo.** Todo erro aparece em vermelho com a mensagem
original do navegador e, embaixo, a explicação em linguagem de leigo e a
linha certa. Cada zona tem pelo menos um momento de "o que esse erro quer
dizer?"; a zona Depuração só formaliza.

**Missões de campo desta ilha:** "abra o Console de qualquer site e faça X"
(o Console roda JavaScript em qualquer página, sem mexer nela). Cada zona
sugere a dela abaixo.

**Ordem das zonas (ajustada na rodada 17, com o porquê):**

1. Primeiros comandos, 2. Decisões, 3. Repetição, 4. Funções, 5. Listas e
   objetos: as ferramentas da linguagem, cada uma usando a anterior.
6. **Resolvendo problemas** saiu do 2º lugar para depois de Listas e
   objetos: decompor e testar com exemplos só tem graça quando já dá para
   escrever o programa inteiro (variáveis, if, repetição, funções e
   listas). Antes disso, os "problemas" seriam de uma linha.
7. **Depuração** veio antes de Algoritmos (o ponto de partida a punha no
   fim): o depurador (pontos de parada, passo a passo) é justamente a
   ferramenta para entender busca binária e recursão. Ler mensagem de erro
   (u1) não precisa de motor novo e já aparece aos poucos desde a zona 1.
8. Algoritmos essenciais e 9. Estruturas de dados (a árvore precisa de
   recursão para ser percorrida).
10. **Programa de verdade**: o projeto-ponte, a saída da ilha.

**Onde falta motor:** só o `projeto-ponte-js` (Programa de verdade), com
a ficha em `src/curriculo/motores.ts`. A parte B ficou pronta na rodada
22: ordenar passos (Resolvendo problemas), depurador da aba Fontes
(Depuração) e estruturas no palco, com "Ver como árvore" e o gráfico de
passos (Estruturas de dados e Algoritmos essenciais). Ver o guia de
conteúdo, seções 26 a 28. A rodada 26 acrescentou a tela composta (plano,
código, palco e casos de teste juntos, inclusive no desafio), que destrava
a zona Resolvendo problemas (guia, seção 29).

### Zona Primeiros comandos (`primeiros-comandos`)

Missão de campo: abrir o Console de qualquer site e fazer a conta da feira
(`3 * 4.5 + 2 * 7`), guardar em uma variável e perguntar o `typeof` dela.

#### U1. O Console calcula (pronta) — `logica-primeiros-comandos-u1` (unidade-modelo)

- **Meta:** usar o Console como calculadora e guardar os resultados em
  variáveis com nomes bons.
- **Conceitos:** Console (ler, rodar, responder); operações `+ - * / %`;
  ordem das operações e parênteses; `let` (caixinha que muda); `const`
  (caixinha que não muda); nomes bons (camelCase, sem acento, dizem o que
  guardam); `undefined` como resposta de uma declaração.
- **Micro-passos:** a conta da padaria no Console (guiado) e depois a do
  troco (sozinho); previsão "o que o Console responde para `2 + 3 * 4`?";
  guardar o total em `let total` e ver a caixinha surgir no palco; mudar o
  valor e ver a caixinha piscar; `const` e o erro de trocar o valor dela
  (ler o erro); previsão "o que aparece depois de `let preco = 5`?"
  (`undefined`).
- **Desafio:** a conta do mercadinho do bairro (contexto novo): guardar
  preços e quantidades em variáveis e calcular o total e o troco, sem passo
  a passo.
- **Revisa:** da Ilha Sites, o F12 e as abas (onde o Console mora).
- **Confusões:** "o `=` é igual da matemática" (é guardar: a caixinha
  recebe); "`undefined` é erro" (é o Console dizendo que a linha não tem
  valor para mostrar); "`const` é constante matemática" (é só uma caixinha
  que não troca de valor).

#### U2. Textos (pronta) — `logica-primeiros-comandos-u2`

- **Meta:** escrever textos entre aspas, juntar textos e montar frases com
  valores dentro.
- **Conceitos:** string; aspas simples, duplas e crase; juntar com `+`;
  template literal (`` `Olá, ${nome}` ``); `.length`; `console.log`.
- **Micro-passos:** o nome do cliente entre aspas; juntar nome e
  sobrenome (e o espaço que falta); a frase do pedido com template;
  previsão "o que o Console responde para `'oi' + 'tchau'`?".
- **Desafio:** a mensagem de confirmação do pedido de uma floricultura,
  montada com template.
- **Revisa:** variáveis (U1).
- **Confusões:** "sem aspas também é texto" (sem aspas é nome de
  variável: `ReferenceError`); "o `+` sempre soma".

#### U3. Tipos (pronta) — `logica-primeiros-comandos-u3`

- **Meta:** descobrir o tipo de cada valor com `typeof` e entender por que
  `"2" + 2` dá `"22"`.
- **Conceitos:** tipos (number, string, boolean, undefined, null) e a cor
  de cada um no palco; `typeof`; `"2" + 2` e `"2" * 2`; `Number()` e
  `String()`; comentários (`//` e `/* */`).
- **Micro-passos:** perguntar o `typeof` de cada caixinha; a conta que deu
  "22" (o preço veio como texto) e o conserto com `Number`; comentar uma
  linha para o computador pular; previsão "`'5' - 2` dá quanto?".
- **Desafio:** a calculadora de gorjeta que recebe o valor como texto e
  precisa somar certo.
- **Revisa:** textos (U2), operações (U1).
- **Confusões:** "`'2'` e `2` são a mesma coisa"; "comentário muda o
  programa".

### Zona Decisões (`decisoes`)

Missão de campo: no Console de qualquer site, perguntar `10 > 9`,
`'10' === 10` e `'10' == 10` e explicar a diferença para alguém.

#### U1. Verdadeiro ou falso (pronta) — `logica-decisoes-u1`

- **Meta:** fazer perguntas ao programa com comparações e receber `true`
  ou `false`.
- **Conceitos:** boolean; `>`, `<`, `>=`, `<=`; `===` e `!==`; `=` (guarda)
  vs `===` (compara) vs `==` (compara convertendo, evitar).
- **Micro-passos:** "o cliente tem idade para o combo?"; comparar textos;
  previsão "`'10' === 10`?"; o bug do `=` no lugar de `===`.
- **Desafio:** as regras de frete grátis de uma loja virtual, como
  comparações.
- **Revisa:** tipos (Primeiros comandos U3).
- **Confusões:** "`=` compara"; "`==` e `===` são iguais".

#### U2. Portões lógicos (pronta) — `logica-decisoes-u2`

- **Motor:** `circuito-logico` (rodada 17), mais a Lógica.
- **Meta:** montar portões E, OU e NÃO para uma saída acontecer e ver o
  mesmo circuito virar código com `&&`, `||` e `!`.
- **Conceitos:** E (as duas), OU (pelo menos uma), NÃO (inverte); tabela
  verdade; `&&`, `||`, `!`.
- **Micro-passos:** "a porta da padaria só abre se tiver cliente E a loja
  estiver aberta" (circuito, guiado); o alarme que toca se a janela OU a
  porta abrir (sozinho); a luz que acende quando NÃO tem sol; "Ver como
  código" e a mesma expressão rodando no Console; previsão "com as duas
  chaves desligadas, o OU acende?".
- **Desafio:** a catraca do metrô (bilhete E (não bloqueado)), montada no
  circuito e depois escrita como código.
- **Revisa:** comparações (U1).
- **Confusões:** "OU é um ou outro, nunca os dois" (no código, os dois
  também valem); "a ordem das entradas muda o resultado".

#### U3. Se, senão (pronta) — `logica-decisoes-u3`

- **Meta:** fazer o programa escolher um caminho com `if`, `else if` e
  `else`.
- **Conceitos:** `if`; bloco `{ }`; `else`; `else if` e a ordem das
  perguntas; condições com `&&` e `||` (revisa U2).
- **Micro-passos:** a mensagem de "loja aberta" ou "fechada"; faixas de
  preço com `else if` (e o bug da ordem trocada); a linha do tempo mostrando
  qual caminho rodou; previsão "qual mensagem aparece se a nota for 7?".
- **Desafio:** o classificador de pedidos de uma lanchonete (pequeno,
  médio, grande, ou "pedido inválido").
- **Revisa:** portões (U2), comparações (U1).
- **Confusões:** "o `else if` testa tudo" (para no primeiro verdadeiro);
  "ponto e vírgula depois do `if (...)`".

#### U4. Verdadeiro disfarçado (pronta) — `logica-decisoes-u4`

- **Meta:** prever quando um valor que não é booleano conta como verdadeiro
  ou falso num `if`.
- **Conceitos:** falsy (`0`, `''`, `null`, `undefined`, `NaN`, `false`);
  truthy (todo o resto, até `'0'` e `[]`); `!!valor`.
- **Micro-passos:** o campo de nome vazio; o estoque zero que some;
  previsão "`if ('0')` entra?".
- **Desafio:** a validação do formulário de cadastro de uma academia.
- **Revisa:** if/else (U3), tipos.
- **Confusões:** "texto `'0'` é falso"; "lista vazia é falsa".

### Zona Repetição (`repeticao`)

Missão de campo: no Console de qualquer site, escrever um `for` que
mostra a tabuada do 7.

#### U1. Enquanto for verdade (pronta) — `logica-repeticao-u1`

- **Meta:** repetir uma tarefa com `while`, contando as voltas, e
  reconhecer um loop que nunca para.
- **Conceitos:** `while`; condição de parada; contador (`i = i + 1`, `i++`);
  loop infinito e a proteção do jogo (limite de passos e de tempo, com
  mensagem amigável; no Chrome de verdade, a aba trava).
- **Micro-passos:** a contagem regressiva do forno; a linha do tempo
  mostrando cada volta; o loop sem `i++` e a mensagem da proteção;
  previsão "quantas vezes aparece 'assando'?".
- **Desafio:** a fila de senhas de uma farmácia até acabar.
- **Revisa:** comparações, if.
- **Confusões:** "o loop para sozinho"; "o `while` testa só uma vez".

#### U2. for e for...of (pronta) — `logica-repeticao-u2`

- **Meta:** repetir um número certo de vezes com `for` e passar por cada
  item com `for...of`.
- **Conceitos:** as três partes do `for`; `for...of` nas letras de um
  texto (listas ficam para Listas e objetos); `break` (só apresentação).
- **Micro-passos:** a tabuada; as letras de um nome; previsão "o `for (let
  i = 0; i < 3; i++)` roda quantas vezes?".
- **Desafio:** as etiquetas numeradas de uma gráfica.
- **Revisa:** while (U1), textos.
- **Confusões:** "o `i` começa em 1"; "o `<=` e o `<` dão no mesmo".

#### U3. Contar e somar (pronta) — `logica-repeticao-u3`

- **Meta:** usar contadores e acumuladores para contar, somar e achar o
  maior valor.
- **Conceitos:** acumulador (`total += preco`); contador condicional;
  maior e menor; média.
- **Micro-passos:** o total das vendas do dia; quantos pedidos passaram de
  R$ 50; a maior venda; previsão "o total começa em quanto?".
- **Desafio:** o fechamento do caixa de uma sorveteria.
- **Revisa:** for (U2), if.
- **Confusões:** "declarar o total dentro do loop" (zera a cada volta).

### Zona Funções (`funcoes`)

Missão de campo: no Console de qualquer site, criar a função
`dobro(n)` e chamar com três números.

#### U1. Criar e chamar (pronta) — `logica-funcoes-u1`

- **Meta:** guardar um passo a passo numa função e usar de novo quando
  quiser.
- **Conceitos:** `function nome() { }`; chamar com `()`; a função sem
  chamar não faz nada; a moldura da função no palco.
- **Micro-passos:** a função `saudar()`; chamar duas vezes; previsão "o
  que aparece se você só declarar a função?".
- **Desafio:** as mensagens de abertura e fechamento de uma loja.
- **Revisa:** console.log, textos.
- **Confusões:** "escrever a função já roda"; "`saudar` e `saudar()` são a
  mesma coisa".

#### U2. Parâmetros e retorno (pronta) — `logica-funcoes-u2`

- **Meta:** dar valores para a função trabalhar e receber a resposta de
  volta com `return`.
- **Conceitos:** parâmetro e argumento; `return`; `return` vs
  `console.log` (a confusão principal); validado com `funcaoPassa`.
- **Micro-passos:** `precoComDesconto(preco)`; a função que só mostra e a
  que devolve (o `undefined` que aparece quando falta o `return`);
  previsão "o que `total = somar(2, 3)` guarda se a função só fizer
  console.log?".
- **Desafio:** as funções da calculadora de frete de uma loja.
- **Revisa:** funções (U1), if.
- **Confusões:** "mostrar é devolver"; "o nome do parâmetro precisa ser o
  da variável".

#### U3. Escopo (pronta) — `logica-funcoes-u3`

- **Meta:** saber onde cada variável existe e por que a de dentro da função
  some quando ela termina.
- **Conceitos:** escopo global e de função; escopo de bloco (`let` dentro
  do `if`); a moldura que some no palco.
- **Micro-passos:** a variável de dentro que "não existe" lá fora
  (`ReferenceError`); duas variáveis com o mesmo nome; previsão.
- **Desafio:** consertar o contador de visitas que sempre zera.
- **Revisa:** parâmetros e retorno (U2).
- **Confusões:** "variável é global sempre".

#### U4. Arrow functions (pronta) — `logica-funcoes-u4`

- **Meta:** escrever funções curtas com a seta `=>` e reconhecer as duas
  formas no código dos outros.
- **Conceitos:** `const dobro = (n) => n * 2`; retorno implícito; chaves e
  `return` explícito.
- **Micro-passos:** reescrever uma função como arrow; a arrow com chaves
  que esqueceu o `return`; previsão.
- **Desafio:** o conversor de medidas de uma receita.
- **Revisa:** parâmetros e retorno.
- **Confusões:** "arrow é outra coisa, não é função".

### Zona Listas e objetos (`listas-e-objetos`)

Missão de campo: no Console de qualquer site, criar a lista de compras,
dar `push` num item e perguntar o `length`.

#### U1. Listas (pronta) — `logica-listas-e-objetos-u1`

- **Meta:** guardar vários valores numa lista, pegar cada um pelo índice e
  pôr e tirar itens.
- **Conceitos:** array; índice começando em 0; `length`; `push`, `pop`; os
  vagões no palco; duas variáveis apontando para a mesma lista (a seta).
- **Micro-passos:** a fila de pedidos; o primeiro é `[0]`; o último é
  `[length - 1]`; previsão "`lista[3]` numa lista de 3 itens?"
  (`undefined`).
- **Desafio:** a playlist de uma festa.
- **Revisa:** variáveis, for...of.
- **Confusões:** "o primeiro é o 1"; "copiar a variável copia a lista".

#### U2. Percorrer listas (pronta) — `logica-listas-e-objetos-u2`

- **Meta:** passar por todos os itens de uma lista e transformar, filtrar e
  achar itens.
- **Conceitos:** `for...of` (revisa); `map`, `filter`, `find` (introdução,
  com arrow).
- **Micro-passos:** os preços com aumento (`map`); os produtos baratos
  (`filter`); o primeiro esgotado (`find`); previsão.
- **Desafio:** os resultados de uma votação da turma.
- **Revisa:** arrow functions, for.
- **Confusões:** "o `map` muda a lista original".

#### U3. Objetos (pronta) — `logica-listas-e-objetos-u3`

- **Meta:** descrever uma coisa com chaves e valores, e ler e mudar cada
  campo.
- **Conceitos:** objeto `{ chave: valor }`; `obj.chave` e `obj['chave']`;
  mudar e acrescentar campo; a ficha no palco.
- **Micro-passos:** a ficha do produto; mudar o preço; a chave que não
  existe (`undefined`); previsão.
- **Desafio:** o cadastro de um pet no pet shop.
- **Revisa:** tipos, listas.
- **Confusões:** "objeto é a mesma coisa que lista".

#### U4. Listas de objetos (pronta) — `logica-listas-e-objetos-u4`

- **Meta:** organizar o cardápio de uma padaria como dados e responder
  perguntas sobre ele.
- **Conceitos:** lista de objetos; percorrer e somar um campo; filtrar por
  campo; desestruturação simples (`const { nome, preco } = item`).
- **Micro-passos:** o cardápio da padaria (a mesma do site da Ilha Sites,
  agora como dados); o mais caro; os sem glúten; previsão.
- **Desafio:** o pedido de uma pizzaria com o total calculado.
- **Revisa:** map/filter, objetos.
- **Confusões:** "`item.preco` muda o cardápio inteiro".

### Zona Resolvendo problemas (`resolvendo-problemas`)

Missão de campo: somar gastos no Console de qualquer site seguindo os
cinco passos: entender entrada e saída, decompor, planejar em comentários,
programar e testar lista vazia, zero e valores repetidos.

Motor (rodada 26): além do `ordenar-passos`, a tela composta (guia, seção
29) junta o plano, o código, o palco e os casos de teste do aluno na mesma
fase, inclusive no desafio: o plano vira comentários no Snippet
(`planoComentado`) e os casos do aluno são cobrados com `casosDoAluno`.
Modelo: `/lab/fases?fase=lab-resolver-u1-f1` e `f2`.

- **U1. Decompor um problema (pronta)** (`logica-resolvendo-problemas-u1`, fase
  `ordenar-passos`): quebrar "fazer o pedido da festa" em passos pequenos.
  Confusão: "programador sabe a resposta antes de começar".
- **U2. Pseudocódigo (pronta)** (`logica-resolvendo-problemas-u2`, fase
  `ordenar-passos`, variante agrupar): o passo a passo em português com cartões, depois
  cada cartão virando uma linha de código.
- **U3. Ordenar os passos (pronta)** (`logica-resolvendo-problemas-u3`, fase
  `ordenar-passos` com `rodar`): pôr linhas na ordem e ver o que quebra (usar antes de
  declarar, somar antes de ler).
- **U4. Testar com exemplos (pronta)** (`logica-resolvendo-problemas-u4`): escolher
  exemplos que provam que a função funciona, inclusive os esquisitos
  (lista vazia, zero, negativo); validado com `funcaoPassa`. Desafio: a
  função de troco de uma cantina. Confusão: "funcionou com um exemplo,
  está certo".

### Zona Depuração (`depuracao`)

Missão de campo: abrir o Console de um site qualquer, procurar uma
mensagem vermelha e tentar entender o que ela diz.

- **U1. Ler a mensagem de erro** (`logica-depuracao-u1`): o nome do erro
  (`ReferenceError`, `TypeError`, `SyntaxError`), a mensagem e a linha;
  o dicionário de erros de iniciante; validadores `erroDoTipo` e
  `semErro`. Desafio: um programa com três erros para consertar na ordem
  em que aparecem. Confusões: "erro vermelho é que estraguei o
  computador"; "a linha do erro é sempre onde está o problema".
- **U2. Pontos de parada** (`logica-depuracao-u2`, depurador da aba
  Fontes): parar numa linha e olhar os valores.
- **U3. Passo a passo** (`logica-depuracao-u3`, depurador da aba
  Fontes): próxima linha, entrar e sair de função, observar
  variáveis.

### Zona Algoritmos essenciais (`algoritmos-essenciais`)

Missão de campo: contar quantas comparações a busca binária faz para
achar um número entre 1 e 1000 (no Console, com um contador).

- **U1. Buscar** (`logica-algoritmos-essenciais-u1`): busca linear e
  binária, com os vagões acendendo no palco. Confusão: "a binária serve
  para qualquer lista" (só na ordenada).
- **U2. Ordenar** (`logica-algoritmos-essenciais-u2`): ordenação vendo cada
  troca nos vagões (seleção e bolha), e o `sort` pronto (e a pegadinha do
  `sort` com números).
- **U3. Recursão** (`logica-algoritmos-essenciais-u3`): a função que chama
  ela mesma, cada chamada como uma moldura nova no palco; o caso base.
  Confusão: "recursão é loop infinito".
- **U4. Por que isso trava?** (`logica-algoritmos-essenciais-u4`): contar
  passos com 10, 100 e 1000 itens (o contador de passos e o gráfico passos
  x tamanho da aba Desempenho; `passosNoMaximo`), sem fórmula; o limite
  de passos do jogo como exemplo.

### Zona Estruturas de dados (`estruturas-de-dados`)

Missão de campo: no Console, simular o desfazer de um editor com uma
pilha (`push` a cada letra, `pop` no desfazer).

- **U1. Pilhas e filas** (`logica-estruturas-de-dados-u1`): pilha (o
  desfazer do painel Elementos) e fila (a fila de impressão), com `push`,
  `pop` e `shift` (os vagões entram e saem pelo lado certo no palco;
  `formaDaEstrutura`).
- **U2. Dicionários** (`logica-estruturas-de-dados-u2`): `Map` (`set`,
  `get`, `has`), quando usar no lugar de lista (achar sem percorrer).
- **U3. Árvores** (`logica-estruturas-de-dados-u3`, "Ver como árvore"
  no palco, `arvore-palco`): nós e filhos, percorrer, e o DOM da aba Elementos
  como árvore.

### Zona Programa de verdade (`programa-de-verdade`)

- **U1. Meu primeiro programa** (`logica-programa-de-verdade-u1`, requer
  `projeto-ponte-js`): o projeto-ponte da ilha. **Formato (decisão da
  rodada 17):** um snippet que roda no Chrome de verdade (Fontes >
  Snippets), em qualquer página, sem instalar nada. O jogador escreve
  sozinho um programa de lógica pura que resolve um problema dele (a
  divisão da conta, a lista de compras com total, o sorteio de amigo
  secreto), confere com exemplos no jogo (`funcaoPassa`) e leva para o
  Chrome com o guia. Por que não Node: instalar e usar o terminal é
  assunto do Ofício; o Console e os Snippets já estão em todo computador
  com Chrome, e a ilha inteira foi ensinada neles.

### Motores planejados

Tipos de fase aprovados que ainda não existem. A ficha em dados fica em
`src/curriculo/motores.ts` (`MOTORES_PLANEJADOS`), e a checagem
`motores-planejados` do `testar:conteudo` confere que toda unidade citada
existe e continua travada por um `requerMotor` que nomeia o tipo.

- **`circuito-logico`** (Circuito lógico): **pronto na rodada 17**
  (`src/motor/circuito/modelo.ts`, independente da ilha). Serve a
  `logica-decisoes-u2`, a `origens-museu-u6` (somador e memória com
  realimentação) e a futura trilha Automação industrial. Demonstração em
  `/lab/fases?fase=lab-logica-u1-f2`.
- **`ordenar-passos`** (tipo de fase), **`depurador-fontes`** (aba Fontes)
  e **`visualizador-arvore`** ("Ver como árvore" no palco): **prontos na
  rodada 22**, com demonstrações em `/lab/fases?fase=lab-logica-u1-f4` a
  `f9`.
- **`projeto-ponte-js`**: o que falta da Lógica (ficha em
  `src/curriculo/motores.ts`).

---

## Ilha 3: Páginas vivas

Id no currículo: `paginas-vivas`. Uma unidade planejada por zona.

**Requer motor:** JS do jogador rodando no site-alvo; aba Aplicação.

Zonas:

1. DOM pelo código (`dom`).
2. Eventos (`eventos`).
3. Formulários (`formularios`): inputs, labels, validação.
4. Guardar dados (`guardar-dados`): localStorage e a aba Aplicação.
5. Projeto-ponte (`projeto-ponte`): um app de lista de tarefas feito fora
   do jogo.

---

## Ilha 4: Rede e Servidor

Id no currículo: `rede-servidor`. Unidades planejadas por zona.

**Requer motor:** aba Rede, servidor simulado e diagrama de requisições.

Zonas (na ordem do mapa):

1. O caminho de um clique (`caminho-de-um-clique`): HTTP, status e a aba
   Rede.
2. APIs e JSON (`apis-e-json`): fetch (u1) e APIs REST (u2: métodos e
   endereços).
3. Servidor (`servidor`): Node básico, simulado.
4. Banco de dados (`banco-de-dados`): conceitos e CRUD (u1), SQL e NoSQL
   (u2).
5. Login e autenticação (`login-e-autenticacao`): sessões e tokens.
6. Segurança (`seguranca`): senhas e hash (u1), chaves e segredos (u2),
   injeção e XSS (u3).
7. Front e back juntos (`front-e-back`): projeto.

---

## Ilha 5: IA

Id no currículo: `ia`. Fica entre Rede e Servidor e Ofício: depois de
saber como um site e um servidor funcionam, dá para julgar o que a IA
escreve.

**Requer motor: IA ao vivo.** Nas fases guiadas, o código roteirizado
aparece no editor como se estivesse sendo digitado, de forma
determinística, com um bug plantado fixo (sempre o mesmo, para a fase
ser testável). Nas fases livres, o Gemini escreve ao vivo e o jogador
aceita, rejeita ou corrige cada trecho.

Zonas:

1. Como um modelo funciona (`como-funciona`): como um modelo de
   linguagem escolhe a próxima palavra, pela intuição, sem matemática.
2. Especificação e prompt (`especificacao-e-prompt`): pedir do jeito
   certo, com uma especificação clara.
3. IA ao vivo (`ia-ao-vivo`): revisar código gerado (u1), achar o bug da
   IA (u2) e quando não confiar (u3).
4. Agentes (`agentes`): o que um agente faz sozinho e onde você continua
   no comando.
5. Custo e privacidade (`custo-e-privacidade`): quanto custa e nunca
   colar chaves ou dados sensíveis.

---

## Ilha 6: Ofício

Id no currículo: `oficio`. Unidades planejadas por zona, e o projeto
final na zona Deploy.

Zonas (na ordem do mapa):

1. Terminal (`terminal`).
2. Git e GitHub (`git-e-github`).
3. Git em equipe (`git-em-equipe`): branches (u1), pull request e
   revisão de código (u2).
4. Editor real e documentação (`editor-e-documentacao`).
5. Ler código dos outros (`ler-codigo-dos-outros`).
6. TypeScript (`typescript`).
7. Testes automatizados (`testes-automatizados`).
8. Variáveis de ambiente (`variaveis-de-ambiente`).
9. IA com critério (`ia-com-criterio`): usar a IA no projeto de verdade,
   aplicando o que a ilha IA ensinou.
10. Deploy (`deploy`): publicar (u1) e o **projeto final** (u2).
11. Portfólio e aprender sozinho (`portfolio`).

**Critério final do núcleo:** o projeto do Ofício (`oficio-deploy-u2`),
um app completo, front e back, feito a partir de uma página em branco,
sem roteiro, e publicado.

**Requer motor (acréscimo do currículo em dados):** o anexo original não
lista o que falta aqui, mas o motor atual só tem a aba Elementos. Cada
zona do Ofício está marcada em `src/curriculo/curriculo.ts` com o que
falta (terminal simulado, git simulado, tipo de fase projeto-ponte,
exportar o projeto, atividade de avaliar respostas de IA), para ninguém
produzir essas unidades antes da hora.

---

## Ilha opcional: Frameworks

Id no currículo: `frameworks` (opcional, fica afastada no mapa).

React e Next. A detalhar depois do núcleo.

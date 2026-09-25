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
   servidores, pacotes).

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

- **Requer motor:** modo documento inteiro (head editável) e o título da
  aba do navegador falso refletindo o `<title>`.
- **Meta:** escrever uma página completa do zero: doctype, html, head
  (title, meta charset, meta viewport) e body.
- **Conceitos:** estrutura do documento; head vs body; title; meta charset
  (acento quebrado sem ele).
- **Desafio:** um cartão de visita pessoal do zero.

### Zona Estilos (`estilos`)

**Requer motor:** aba Estilos (regras aplicadas ao elemento selecionado,
editar valores ao vivo, checkbox pra ligar e desligar propriedade,
adicionar propriedade, regras riscadas, diagrama de caixa) e editor com
abas HTML e CSS.

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

**Requer motor:** aba Estilos pronta; editor visual de flex e grid como no
Chrome é desejável.

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

**Requer motor:** auditoria simplificada estilo Lighthouse; exportar o
projeto do jogador; tipo de fase projeto-ponte.

- **P1. Acessibilidade e Lighthouse** (`sites-publicar-u1`): contraste,
  alt, rótulos, ordem de títulos (revisa U3), navegação por teclado.
  Desafio: levar um site de nota baixa a nota alta.
- **P2. Do jogo pro mundo** (`sites-publicar-u2`, saída da ilha): arquivos
  de verdade (index.html e style.css), editor real, publicar e ter um
  link. Projeto-ponte: o site pessoal do jogador, publicado. As
  ferramentas e serviços recomendados são verificados na época da
  produção.

---

## Ilha 2: Lógica (JavaScript puro)

Id no currículo: `logica`. Unidades planejadas por zona
(`logica-<zona>-u<n>`), a detalhar quando o motor existir.

**Requer motor:** Console interativo, execução de JS isolada e aba Fontes
com depurador.

Zonas (na ordem do mapa):

1. Primeiros comandos (`primeiros-comandos`): console, valores,
   variáveis, tipos.
2. Resolvendo problemas (`resolvendo-problemas`): decompor um problema
   em passos pequenos (u1) e pseudocódigo (u2).
3. Decisões (`decisoes`): comparações, booleanos, if/else.
4. Repetição (`repeticao`): for, while.
5. Funções (`funcoes`).
6. Listas e objetos (`listas-e-objetos`).
7. Depuração (`depuracao`): ler erros, breakpoints.
8. Estruturas de dados (`estruturas-de-dados`): listas e dicionários
   (u1), pilhas e filas (u2, com o desfazer como exemplo), árvores (u3:
   o DOM é uma árvore, a mesma da aba Elementos).
9. Algoritmos essenciais (`algoritmos-essenciais`): buscar (u1), ordenar
   (u2), recursão (u3) e a noção de desempenho (u4, "Por que isso
   trava?": por que um programa que voa com dez itens trava com um
   milhão, sem fórmula).

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

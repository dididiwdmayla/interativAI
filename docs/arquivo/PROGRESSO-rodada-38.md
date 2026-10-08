# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-37.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 38: Origens, parte 2 (as salas 3 a 6)

Branch `claude/origens-part2-languages-architecture-9rbsb0`, a partir da
principal depois do merge da rodada 37.

### Etapa 1 — O executor por linguagem (commit próprio)

- `src/motor/linguagens/`: a mesma pergunta (rodar este código nesta
  linguagem) e a mesma resposta (`ResultadoLinguagem`: as linhas no formato
  do Console e o erro no formato do executor de JavaScript). JavaScript
  roda numa sessão nova do executor de sempre; Python no Pyodide; C, Java,
  COBOL e BASIC devolvem a saída declarada (`simulado`).
- **Pyodide:** a versão atual no npm é a 314.0.7 (a numeração nova segue o
  Python: 314 é o CPython 3.14). Vem como dependência e
  `scripts/copiar-pyodide.mjs` copia o núcleo (5 arquivos, uns 13 MB) para
  `public/pyodide/314.0.7/` antes do dev e do build (fora do git). O
  `next.config.ts` serve a pasta com cache imutável (versão nova, pasta
  nova). Sem CDN de fora.
- **No navegador:** um Web Worker próprio (`python/python.worker.ts` e
  `python/sessao.ts`), criado no primeiro Rodar do Python e guardado para a
  página inteira. A carga baixa os arquivos grandes contando os bytes (a
  barra "baixando o Python") e depois acorda. Depois de acordar, o worker
  perde a rede (fetch, XMLHttpRequest, WebSocket... escondidos por uma
  propriedade própria, que alcança os do protótipo) e o Python perde o
  módulo `js`. `input()` dá erro. Passou de 5 s, o worker é encerrado.
  Cada execução começa com a memória vazia.
- **No Node:** `python/node.ts` carrega o mesmo Pyodide do node_modules; o
  núcleo (`python/nucleo.ts`) é o mesmo dos dois lados. Os erros saem do
  traceback (nome, mensagem e a linha do programa) e `explicarErroPython`
  dá a explicação de leigo (NameError, os dois-pontos, recuo, texto com
  número, divisão por zero).
- `testes/conteudo/linguagens.test.ts` (10 testes): o Python de verdade, os
  erros, a memória vazia, o módulo js e o input bloqueados, e o resumo para
  os validadores de saída.

### Etapa 2 — As estações das salas 3 a 6 (commit próprio)

- **Comparador** (`exposicao/comparador.ts`): o mesmo programa em 2 a 6
  linguagens; cada linha diz a sua parte e tocar acende a parte em todas;
  Rodar (assíncrono na tela: a linguagem só conta como rodada quando a
  saída chega, com o evento `executouCodigo`); linguagem editável; o coral.
- **Cartões** (`exposicao/cartoes.ts`): ligar (cada cartão no alvo certo,
  com a revelação) e ordem (escada de baixo para cima, ou etapas).
- **Circuito do museu** (`exposicao/circuitoMuseu.ts`): o modelo da Ilha
  Lógica numa estação, com a realimentação guardando estado; aparência de
  painel de cabos (desenho próprio, com chaves de faca, caixas de válvulas
  que acendem e cabos caídos) ou a bancada de portões.
- **Simulações por comando e marco** (`exposicao/simulacoes/`): traducao,
  memoria, processador, sistema, arquivos, clique, pacote, aba-rede e
  cidade. Uma ação (`comandoNaEstacao`) e um validador (`marcoNaEstacao`)
  servem a todas; cada tipo diz os comandos e os marcos que existem, e a
  fábrica confere.
- Validadores novos: `linguagensRodadas`, `parteVista`, `cartoesLigados`,
  `ordemCerta`, `circuitoNaEstacao`, `circuitoLembra`, `marcoNaEstacao`; os
  de saída valem com o comparador. 13 ferramentas com ícone e card, 6 sons
  sintetizados (rodar, o acorde do coral, plugar cabo, o tique do
  processador, o pulo e o mergulho do pacote), progresso salvo das
  estações novas e unitários (`testes/conteudo/estacoesNovas.test.ts`).

### Etapa 3 — O conteúdo das quatro salas (commit próprio)

- **Sala 3, Por que existem tantas linguagens** (terminal verde): a conta
  da padaria em COBOL, BASIC, C, Java, JavaScript e Python, e o coral; cada
  linguagem no seu serviço; o mesmo laço em quatro linguagens, com o Python
  editado para cinco fornadas e rodado de verdade; compilar ou interpretar
  e a escada; desafio do frete.
- **Sala 4, Por baixo do capô** (PC bege; o gigante de visita): caixas com
  endereço; o processador de brinquedo (a máquina da sala 1, rodando); o
  gerente; arquivos e pastas como árvore; os cabos do gigante (o meio
  somador plugado); os portões por dentro (o somador com E, OU e NÃO, e o
  selo); desafio do computador inteiro.
- **Sala 5, Front, back e o caminho de um clique** (internet): o clique
  etapa por etapa e as quebras; a ordem das etapas e front ou back; o
  pacote pelo oceano do mapa do jogo; a aba Rede; desafio do site do salão.
- **Sala 6, Onde a programação vive** (celular): a cidade do código, com a
  ponte para Profissões; desafio de quem programa o quê.
- 21 conceitos com `termoIngles` e 42 itens de revisão. As quatro salas
  saem do `requerMotor` e entram no `publicados.json`. O `testar:conteudo`,
  o `publicar:conteudo` e o `/lab` simulam com Python de verdade.

### Etapa 4 — A insígnia da história (commit próprio)

- Com as seis salas concluídas (`museuCompleto`), o retrato do aluno na
  árvore ganha uma medalha de latão com a arvorezinha da família (um
  pontinho por antepassado e o do aluno, mais claro, no alto), fitas nas
  cores dos fios da tecelã, um anel de oito contas em volta e a linha "e
  conhece a história da família inteira" na placa. A revelação (a medalha
  cai girando, o brilho passa uma vez, o som da insígnia e o recado do
  computadorzinho) toca uma vez só: `insigniaDoMuseu` no progresso.

### Etapa 5 — Correções achadas nas jornadas (commits próprios)

- **Cidade:** o papel de botão saiu do grupo de cada lugar (que inclui a
  bolinha pulsando e o carro andando) e foi para a área de toque, parada.
- **Mapa dos cabos:** o pulso dos próximos pontos anima a escala, não o
  raio (o raio animado sujava o console com `r: undefined`).
- **Apresentação das ferramentas (motor, vale para todas):** no
  "Experimente", se o cartão inteiro não cabe ao lado do alvo (paisagem
  baixa), ele fica compacto: o "No F12 de verdade" recolhe num item que
  abre ao toque. Sem lugar nem assim, o cartão vai para o canto que menos
  cobre o alvo, em vez do meio. Antes, em paisagem, o cartão cobria o
  botão de Compilar e o de Rodar uma linha: o aluno só podia pular.
- **`testes/museu.mjs`:** no toque, a bancada de portões é ampliada (150%)
  e arrastada com dois dedos até a peça antes de tocar, como em
  `circuito.mjs` (a 100%, no celular em pé, as áreas de 44 px das portas
  de portões vizinhos se cobrem: é o mesmo comportamento da bancada da
  Lógica).

### Decisões tomadas sem regra clara

- A ordem das salas segue o mapa curricular (a parte 1 tinha trocado 4 e
  6); a sala 6 tem duas fases (a cidade e o desafio), por ser a menor.
- No coral, o Java fica com a internet (anos 1990, a década do Java), já
  que o prompt não diz quem canta o Java.
- A saída igual em todas, quando a época deixa: "Total: 35"; o BASIC e o
  COBOL saem em maiúsculas ("TOTAL: 35"). No COBOL, CONTA em vez de TOTAL
  e, no BASIC, SOMA (TOTAL tem a palavra reservada TO).
- A sala 4 virou sete fases (memória, processador, gerente, arquivos, os
  cabos, os portões e o desafio), em vez de juntar estações por fase.
- A memória com realimentação vem com os portões já ligados, faltando só o
  fio que volta: o quebra-cabeça é a realimentação, não a fiação.
- Uma ação e um validador genéricos (comando e marco) para as simulações,
  em vez de um par por estação.
- Os sistemas de arquivos, o gerente e a aba Rede são simulações
  simplificadas, declaradas na placa.

### Validação

- `npm run testar:conteudo`: 51 arquivos, 23.181 testes verdes (com o
  Python de verdade, pelo Pyodide no Node).
- `npm run lint` e `npm run build` verdes.
- `testes/museu.mjs` (as seis salas jogadas pela interface, o coral, os
  cabos, os portões, o pacote, a cidade e a insígnia) verde nos três
  layouts, no servidor de desenvolvimento e no de produção.
- Bateria completa (`PARALELO=4`, servidor de produção): 205 execuções,
  200 verdes e 5 falhas.
  - `museu.mjs` nos três layouts: a checagem de que a insígnia fica
    guardada lia o progresso logo que a medalha aparecia, e a revelação
    grava cerca de 1 s depois. O teste passou a esperar o registro; os
    três, rodados de novo: verdes.
  - `algoritmos.mjs paisagem 3`: tempo esgotado com quatro navegadores ao
    mesmo tempo (a pendência "Testes sob carga"). Rodado de novo: verde.
  - `unidades.mjs retrato`: o duplo toque da U4F1
    (`editarValorAtributo`, linha 167), a pendência já registrada na
    rodada 36.

# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-27.md`. (Arquivada na rodada 29.)
Status consolidado: `docs/ROADMAP.md`.

## Rodada 28: motor de cenas programáveis

Branch `ccr-f2988c01-0t4z55`, a partir de `claude/intelligent-pascal-5va93x`
(depois do merge da zona Resolvendo problemas). Um commit por etapa.

### Etapa 1: a área cena e as cenas como dados

- `AREAS_TRABALHO` ganha `"cena"` (primeira na tela) e a fase, o campo
  `cena` (`DadosCena`): cenário com peças do kit, dispositivos com nome de
  variável e linha do tempo (pessoas que chegam e saem, interruptores).
  Modelo puro em `src/motor/cena/modelo.ts` (o estado de cada dispositivo
  num instante, a presença, a temperatura do forno) e catálogo em
  `catalogo.ts` (ficha, comandos, propriedades, ações e "Por dentro").
- `TelaComposta` nos três layouts: no computador, a cena em cima na coluna
  da direita (divisor com o palco); deitado, a primeira aba ao lado do
  código; em pé, em cima e recolhível (recolhe com o teclado aberto), com
  o palco virando aba.
- Ferramenta `cena`, tokens `--cor-cena-*` nos três temas e a checagem da
  cena na regra `composicao` (`src/motor/cena/conferir.ts`).

### Etapa 2: dispositivos, relógio simulado e rastro animado

- `MotorCena` (`motor.ts`) dentro do núcleo do executor: objetos no reino
  do código (getters, métodos e erros do reino), `esperar(ms)` avançando o
  relógio simulado, sensores lendo a linha do tempo no instante. O fim da
  cena lança um sinal tratado como fim normal (sem erro; a conferência de
  parada de cada passo repete o sinal); sem esperar, a proteção de passos
  com a dica da cena (`naCena` no erro).
- Executar recomeça a cena; o Console continua de onde ela está; depois do
  Snippet o mundo vai até o fim. Testes de função, medições e o Observar
  rodam numa cena separada e voltam a de antes.
- Rastro: cada mudança com instante e passo; cada passo com `tempoMs`. A
  área toca a cena (1x, 2x, 4x) com o relógio só nela; a linha do tempo, o
  palco e a linha do código andam junto, e escolher um passo leva a cena ao
  instante dele, só com as mudanças até ali.
- Worker e sessão: `definirCena` (reenviada a cada worker novo), as outras
  linhas do tempo no mesmo pedido de executar.

### Etapa 3: ficha do dispositivo e "Por dentro"

- Tocar num dispositivo abre a ficha (estado agora, comandos, propriedades
  com o nome da cena, exemplo); "Por dentro" mostra o caminho do comando
  com uma ilustração por peça (código, plaquinha, relé, driver, motor,
  resistência, termômetro, display, sensor, contato) e termina na ponte com
  a trilha Automação.
- Ferramentas `ficha-dispositivo` e `velocidade-simulacao` com
  apresentação; ações `abrirFicha`, `verPorDentro`, `velocidadeCena` e
  eventos `abriuFicha`, `viuPorDentro`, `mudouVelocidade`, na tela e na
  simulação.

### Etapa 4: validadores

- `estadoNaCena`, `sequenciaNaCena` (ações de verdade, ritmo com folga,
  `exata`), `reagiu` (toda vez que a propriedade passa ao valor, a ação no
  prazo) e `variosCenarios` (o código roda com cada linha do tempo a cada
  Executar; o decorado cai). Nada passa antes de a cena rodar. Checagem de
  dispositivos, propriedades, valores, ações, instantes e linhas do tempo.

### Etapa 5: kit, cenas de referência e a demonstração

- Kit em SVG com tokens: 13 peças de cenário (com variantes) e 7 tipos de
  dispositivo, a pessoa e a luz (à noite o ambiente escurece e cada
  lâmpada acesa abre a área clara dela por máscara, com o cone da
  pendente e o brilho). Portão desliza para dentro do muro, letreiro acende
  letra por letra, ventilador gira pelo histórico de velocidade, forno com
  termômetro e calor na porta.
- Cenas: o quarto à noite (lâmpada pendente e ventilador) e a vitrine da
  Padaria Pão de Mel (letreiro, spot da vitrine e sensor de presença; uma
  pessoa chega no segundo 3 e sai no 7).
- Bancada `lab-cenas-u1`: f1 (acender, ficha e Por dentro, liga e desliga
  sem esperar, piscar 3 vezes no ritmo, velocidade) e f2 (sensor no
  Console, if que roda uma vez só, loop de controle em 4 linhas do tempo,
  apagar quando a pessoa sai em 3). A cena mostra as linhas do tempo de
  teste do objetivo de agora ("Teste 1, 2, 3").
- `/lab/cenas`: o mostruário do kit nos três temas. A meta de um desafio
  com cena mostra a cena; o tutor recebe o que os dispositivos fizeram.
- `testes/cenas.mjs` nos três layouts (ritmo do pisca-pisca pela barra de
  tempo, linha do tempo junto, ficha, Console andando no tempo, proteção
  sem esperar, fim da simulação, vitrine nas linhas do tempo de teste e as
  apresentações em modo jogo); `apresentacoes-logica.mjs` com as três
  ferramentas.

### Etapa 6: guia, regra de ritmo e fechamento

- Guia, seção 30 (área, montar com o kit, dispositivos e relógio,
  validadores, escolha de dispositivos e linhas do tempo, regra de ritmo,
  como acrescentar peças), índice, checklist e PROJETO.md (arquitetura).
- Regra `ritmo-das-cenas`: unidade nova da Lógica (fora do
  `publicados.json`) sem fase com cena falha; cena repetida (mesmo
  ambiente, tipos de dispositivo e missão) vira aviso `[aviso de cena]`.
- Revisão do próprio diff: recarregar a página roda o Snippet de novo com
  as linhas do tempo de teste (o `variosCenarios` e as partes de um
  desafio não desmarcam até o próximo Executar); nomes que o Worker e a
  janela já têm (`name`, `location`, `status`...) ficam proibidos para
  dispositivos; o cenário é desenhado uma vez só (a animação redesenha só o
  que muda).
- Verificação final: `testar:conteudo` 16.126 testes (41 arquivos), lint,
  `publicar:conteudo` e build verdes; bateria completa (`testes/todos.mjs`,
  145 arquivos x layouts, inclusive `cenas.mjs` e `apresentacoes-logica.mjs`
  nos três layouts) verde no build de produção, uma vez, com 3 em paralelo.
  Depois das correções da revisão: build de novo, `testar:conteudo` e
  `cenas.mjs` nos três layouts verdes. Console limpo nas jornadas.
  Publicado igual a antes (nenhuma unidade publicada mudou).
- Um teste de estruturas passou do tempo (5 s) só com a bateria rodando
  junto, na mesma máquina; sozinho e com a máquina livre, passa.

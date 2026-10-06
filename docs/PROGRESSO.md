# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-34.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 35: conserto da cena pausada, U4 e os dois chamados

Branch `ccr-0642213a-vae9cs`, a partir da principal depois do merge da
zona Depuração (U1 a U3). A zona Depuração e a Ilha Lógica ficam completas,
com o contrato da padaria no fim.

### Etapa 1 — A cena no instante da pausa (motor)

- Causa: `JogoFase.tsx` só mandava o foco à cena ao mover a linha do tempo
  à mão; os controles do depurador não o atualizavam, e `AreaCena` tocava o
  rastro inteiro assim que a execução chegava.
- Conserto: a pausa vira um foco da cena (`focoDaPausa`: tempo do passo e
  filtro de execução/passo, que distingue comandos com o mesmo tempo). A
  cena para nesse instante e acompanha pausa, Passar por cima, Entrar e
  Sair. Retomar (ou terminar o programa) manda a cena tocar do instante da
  pausa até o fim (`FocoCena.tocar`); uma execução nova só limpa o pedido
  antigo e a cena recomeça do começo. `useDepurador` ganhou `aoTerminar`.
- `testes/depuracao-cena-bloqueio.mjs` virou a prova: pausa em 0 ms/verde,
  Passar por cima (comando ainda não rodou: 0 ms/verde), depois do comando
  (0 ms/vermelho) e Retomar tocando até 4.000 ms. Verde nos três layouts e
  na bateria. Jornadas U2 e U3 repetidas nos três layouts: verdes.

### Etapa 2 — U4, Observar variáveis

- O rascunho de `docs/rascunhos/depuracao-u4/` virou conteúdo: fases,
  unidade, revisão e os dois conceitos no catálogo; `requerMotor` saiu do
  currículo; os testes de conteúdo passaram a esperar a unidade registrada.
- 19.446 testes de conteúdo verdes; jornada U4 nos três layouts, cobrando o
  instante da cena (2.000 ms na pausa do sozinho); publicada.

### Etapas 3 e 4 — Os dois chamados (U5 e U6)

Formato contrato (guia, seção 31.10), uma unidade por chamado: aquecimento e
contrato.

- **U5, o estoque que não fecha** (Seu Tonho, Mercadinho Estrela). Aquecimento
  no caixa, com a cena do letreiro: reproduzir o defeito (o desconto some só
  com 3 itens), causa raiz e conserto da causa, e o frete repete o método.
  Contrato: o fechamento soma texto nos dias de entrega ("4" vira "64").
  Mudança depois do conserto: produto fora do estoque virava NaN.
- **U6, a agenda do salão** (Dona Zélia, Salão Girassol), sem cena no
  contrato. Aquecimento na recepção: o conserto que quebra o resto e o teste
  de regressão. Contrato: o laço decide na primeira marcação da lista, então
  só recusa o horário ocupado se for o primeiro. Mudança: expediente das 9h
  às 18h, com as bordas.
- Nos dois: diagnóstico com cartões no quadro de plano agrupado (a causa certa
  entre três hipóteses plausíveis; o conserto só vale depois do diagnóstico),
  relatório do conserto (o que estava errado, como foi achado e como foi
  testado) que vai para o topo do Snippet, casos escondidos que já
  funcionavam e `reproduzir` sem depender do número da linha.
- Conceitos novos com temas Lógica e Ferramentas: reproduzir o defeito, causa
  raiz e teste de regressão, com dois itens de revisão cada (`termoIngles`
  ainda não existe no catálogo). Dois clientes novos no kit.
- Sabotagens provadas em `testes/conteudo/chamados.test.ts`: resultado
  decorado, `Number(a + b)`, recusar tudo, olhar só a última marcação,
  trocar o limite do expediente e conserto certo sem diagnóstico.
- Motor/regras tocados só para caber o formato: `contrato.fimDeIlha: false`
  (sem a comemoração de fim de ilha) e `FILTRO` na bateria.

### Validação

- `testar:conteudo -- --maxWorkers=1`: 19.725 testes verdes.
- Jornadas U4, U5 e U6 nos três layouts; publicação, build e lint verdes.
- Bateria completa uma vez no fim (resultado no relatório e no ROADMAP).

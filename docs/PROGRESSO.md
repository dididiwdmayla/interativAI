# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-29.md`.
Status consolidado: `docs/ROADMAP.md`.

## Cenas novas: acontecimentos genéricos e quatro ambientes

Branch `feat/acontecimentos-quatro-ambientes`, a partir de `834b95a` da
principal. A nova solicitação autoriza ampliar o motor na primeira etapa.
Agente: Codex, baseado em GPT-6; variante exata e configuração de
raciocínio não expostas para confirmação nesta sessão.

### Etapa 1 — motor e cadastro dos dispositivos

- Entradas instantâneas e graduais, regras de reação e atores com ações
  declaradas nos dados, atrasos canceláveis e efeitos sobre sensores.
- Estado determinístico no Node e na tela; filtros do depurador e
  rebobinagem respeitados. Formatos antigos preservados.
- Cadastro de sensor de carro, geladeira, alarme, semáforo, botão,
  aspersor, umidade e luz do dia; comandos declarativos no catálogo.
  Forno ganha timer `assar(ms)` e leitura `restante`.
- Período visual ligado opcionalmente a uma entrada booleana.
- Limite concreto: Levar pro mundo continua restrito ao kit anterior;
  novos ambientes não serão usados em contratos exportáveis nesta rodada.
- Verificações: 17.788 testes em 44 arquivos; build e lint verdes.
  Jornadas de `lab-cenas-u1` nos três layouts verdes. Os comandos do
  forno antigo mantêm o rastro anterior; o teste de tipo inexistente
  passou a usar teletransporte, pois geladeira agora existe.

### Correção de fronteira da etapa 1

A expiração do timer do forno é aplicada antes de uma nova ordem no mesmo
instante. Assim, `assar(2000); esperar(2000); ligar()` mantém o forno
ligado. Teste específico acrescentado e 57 testes afetados verdes
(acontecimentos, motor anterior, composição e missões novas).

### Etapa 2 — ambientes, missões e revisão visual

- Garagem com carro que aguarda a abertura e libera o sensor ao entrar;
  cozinha com porta, aviso pulsante e timer do forno; esquina com sinais
  distintos para carro/pedestre e travessia; estufa com umidade gradual,
  aspersor e transição visual de dia/noite.
- Seis peças novas reutilizáveis: céu, garagem, cozinha, rua, estrutura
  de estufa e canteiro. Tokens adicionais nos três temas.
- Bancada `lab-cenas-novas-u1`, com quatro fases: uma missão por cena.
  Essa composição mantém o contrato existente de uma cena por fase.
  Todos usam `variosCenarios` e `porLinha`, com soluções testadas e
  negativas contra horários decorados, contagem acumulada indevida,
  botão ignorado, limite inclusivo incorreto e irrigação à noite.
- Mostruário `/lab/cenas` com antes/durante/depois. 36 PNGs da execução
  real das missões, em retrato, densidade 3×, nos três temas; índice em
  `docs/capturas/cenas-novas/README.md`.
- Jornadas novas nos três layouts: fichas e Por dentro, estados e atores,
  cenários alternativos, movimento reduzido, temas e console limpo.
- Verificações: 17.803 testes em 45 arquivos passaram; os 15 testes
  específicos foram repetidos após dar tolerância de 100 ms à reação
  do alarme e ao início da rega, preservando os limites estritos de
  2 s e umidade 30. Build e lint passaram; bateria de conteúdo em
  produção passou (mapa, explorar, publicar e revisão).
- Na revisão pelo navegador, uma prateleira da estufa com altura muito
  pequena produzia retângulos negativos. Corrigidos os dados, com novo
  teste da estufa e console limpo.
- Bateria completa em andamento; duas jornadas de Recursão deram timeout
  esperando o erro no palco sob execução paralela. Diagnóstico isolado
  mostrou o RangeError correto; retestes pendentes ao fim da bateria.

Decisões: umidade é entrada de teste, sem modelo físico de absorção;
alarme tem aviso visual pulsante, sem áudio novo; semáforo grande controla
carros, e o sinal menor corresponde à passagem dos pedestres.

## Rodada 30: zona Algoritmos essenciais

Branch `conteudo/algoritmos-essenciais`, a partir de
`claude/intelligent-pascal-5va93x` (`ebfd7b0`). Um commit por unidade e um
commit de fechamento. O motor e as unidades publicadas antes desta rodada
não mudaram.

- 13 fases em quatro unidades, na ordem do mapa; guiado e sozinho juntos,
  previsões, revisão de Listas, Funções, Repetição e Resolvendo problemas.
- Quatro cenas: retirada de encomendas, vitrine da feira, volumes na
  expedição e fila de pedidos. Kit existente; resultado no painel, vagões
  acesos em comparações/trocas e molduras recursivas na linha do tempo.
- Desafios compostos: ingressos do museu, distâncias do passeio, caixas da
  biblioteca e registros do observatório, com plano, código e casos do
  aluno; casos escondidos vazios, unitários, repetidos e já ordenados.
- 12 conceitos com temas (incluindo Desempenho); duas revisões por conceito
  em situações próprias (24 itens). Missão no Console real: sort padrão
  de [10,9,1] e correção pelo comparador numérico.
- Gráfico com 10, 100 e 1.000 itens; comparação de pares contra vizinhos;
  confusão de máquina rápida contra crescimento, garantia de ordem e
  freio do jogo em contagem finita longa. Limites escolhidos: binária 130
  passos e vizinhos 4.500, com medição independente em 1.000 itens.
- Provas de eficiência: resultado correto sozinho não basta; os dois
  caminhos lentos são rejeitados pelos orçamentos. Jornada confere luz dos
  vagões, trocas e molduras, além de concluir e salvar pelo mapa.

## Zona Algoritmos essenciais: U1 — Buscar

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.048 verificações), duas provas específicas verdes; jornada pelo mapa em desktop, retrato e paisagem, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U2 — Ordenar

- 4 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.310 verificações); jornada pelo mapa nos três layouts com comparações e trocas visíveis, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U3 — Recursão

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.544 verificações); jornada pelo mapa nos três layouts com RangeError e molduras recursivas no palco, publicar:conteudo, build e lint verdes.

## Zona Algoritmos essenciais: U4 — Por que isso trava?

- 3 fases com habilidade guiada e sozinha, desafio composto e cena própria.
- 3 conceitos com temas; 6 itens de revisão em outros contextos.
- Verificação: testar:conteudo verde (17.779 verificações); jornada pelo mapa nos três layouts com gráfico, proteção de passos e bordas, publicar:conteudo, build e lint verdes.

## Fechamento

- `npm run bateria:conteudo`, uma vez no build de produção: mapa (16 s),
  explorar (15 s), publicar (32 s) e revisão (12 s), todos verdes.
- Verificação final do conteúdo: 17.779 testes em 43 arquivos; as jornadas
  das quatro unidades concluíram nos três layouts com console limpo.
  Publicação, build e lint verdes em cada unidade.
- ROADMAP: Algoritmos essenciais em Feito; Estruturas de dados em Próximo,
  seguida de Depuração. Atritos da rodada registrados; rodada 29 arquivada.
- Decisões a conferir: orçamentos de 130 e 4.500 passos; medições até 1.000
  itens; cenas com o kit já disponível. Nenhum bloqueio de motor encontrado.
- GitHub: os commits foram enviados pelo plugin (o git local não possui
  credencial de push), mantendo as árvores idênticas às validadas. A branch
  principal recebe as mudanças somente pelo pull request.

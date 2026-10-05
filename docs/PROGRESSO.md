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
- Bateria completa executada uma vez: 166 jornadas, com 163 aprovações
  iniciais. As duas falhas de Recursão passaram isoladamente, sem mudança
  no produto. Em Funções U1/retrato, a lista de autocompletar interceptava
  o clique central do teste; a jornada passou após usar foco no editor
  móvel, como as demais jornadas. Retestes de Funções em retrato e
  paisagem passaram; lint do teste ajustado também passou.
- Build e lint finais passaram após a correção do timer. Revalidação
  das cenas no build final passou nos três layouts.
- Publicação pelo conector GitHub, verificando SHA de cada blob e árvore.
  O Git local retornou `fatal: could not read Username for 'https://github.com': No such device or address`;
  a tentativa com o helper do gh retornou `remote: Invalid username or token. Password authentication is not supported for Git operations.`
  O gh confirmou `gh: Bad credentials (HTTP 401)`. O conector tem acesso
  de escrita e preserva exatamente os arquivos testados.

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

## Rodada 31: preparar Estruturas de dados (parada por motor)

Branch `codex/zona-estruturas-dados`, a partir de `d59f5bc` da principal.
O pedido separa pilha, fila, Map e árvore em quatro unidades; o mapa atual
prevê três, agrupando pilha e fila. Nenhum id novo foi publicado.

### Etapa 0 — orçamentos e espera de estado

- Busca binária: 500 passos, medidos em 5.000 itens nos dois validadores.
  Em 1.000 itens, uma busca linear enxuta usa 2.003 passos: 500 ali não
  ficaria 10 vezes abaixo dela. O tamanho maior concilia o limite pedido
  com a regra. O gráfico didático continua em 10, 100 e 1.000 itens.
- Repetidos adjacentes: 20.000 passos em 1.000 itens, na prática e no
  desafio. Medição com variáveis intermediárias: 3.998 passos; comparar
  todos os pares sem repetidos: 500.502. O limite tem folga maior que
  três vezes e fica mais de dez vezes abaixo do caminho ingênuo.
- Mantidos os 200 passos da demonstração com três itens: esse objetivo
  apresenta o contador, sem selecionar algoritmo por eficiência.
- Guia, seção 28: orçamento separa algoritmos, não estilos; mínimo de
  três vezes a solução eficiente mais falante e dez vezes abaixo da
  ingênua, na mesma entrada de pior caso. Prova automatizada cobre os
  quatro validadores de eficiência e variáveis intermediárias.
- Jornada: a inspeção do rastro presumiu o índice final enquanto a cena
  também move a linha do tempo. Agora Home escolhe o início pela UI e
  cada avanço espera `data-passo-atual` e `data-tocando="nao"`, em vez
  de depender dos dois quadros da espera geral. Os limites não aumentam.
  Sob carga, Recursão/paisagem reproduziu timeout ao procurar
  `data-palco-erro`. Abrir o palco sozinho não bastou no primeiro
  reteste: o aviso só aparece no passo de erro, e a cena pode selecionar
  outro passo. A jornada agora abre o palco, pausa pelo Home e escolhe
  End, esperando os estados de índice e cena antes de ler o aviso.
  A mesma espera serve à inspeção do rastro.
  As mensagens históricas não estavam disponíveis; a falha móvel foi
  reproduzida nesta rodada, sem aumentar limites.
- O Chromium do ambiente pediu `/favicon.ico` implicitamente, causando
  404 e reprovando o console após uma jornada completa de Recursão.
  Ícone SVG do Console, já existente no kit, cadastrado como `app/icon.svg`
  pela convenção de metadata do Next. Sem cores literais nem exceção
  nova à checagem de console.

- Verificação da etapa: 17.805 testes em 45 arquivos; build e lint
  verdes. Buscar, Ordenar, Recursão e Desempenho concluíram pelo mapa
  em desktop, retrato e paisagem, com console limpo. Recursão/paisagem
  falhou antes das esperas do passo final e passou após a correção;
  desktop e retrato foram conferidos com a versão final da jornada.
- `npm run bateria:conteudo`, uma vez no build de produção: mapa,
  explorar, publicar e revisão verdes. Nenhuma mudança de motor;
  `publicar:conteudo` não se aplica, pois não há unidade nova.

### Parada — gráfico do custo de shift

O contador instrumenta linhas do aluno, sem contabilizar o trabalho
interno dos métodos nativos. A medição real em 1.000 itens dá 1.001
passos para `function consumir(lista) { while (lista.length) lista.shift(); }`
e 2.002 para `function consumir(lista) { let inicio = 0; while (inicio <
lista.length) { const item = lista[inicio]; inicio++; } }`. Ambas crescem
linearmente no gráfico, e shift parece mais barato. Isso não demonstra
o custo de mover as posições de uma fila enorme.

A regra de parada do pedido impede simular esse custo no conteúdo ou
reimplementar shift para obter uma curva desejada. Produção das quatro
unidades suspensa; pendência de motor registrada no ROADMAP. Não foram
alterados currículo, ids publicados nem registro de revisão. Depuração
continua depois de Estruturas; não há zona concluída para mover a Feito.

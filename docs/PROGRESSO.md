# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-33.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 34: zona Depuração

Branch `codex/zona-depuracao`, a partir de `984c37a` da principal.
Sem alteração de motor; U1 a U3 publicadas e U4 em rascunho bloqueado,
separando Observar conforme o pedido. O contrato continua no fim da Ilha Lógica.

### Etapa 1 — Ler a mensagem de erro

- Cozinha com propriedade somente leitura: TypeError é pista de uma
  operação inválida; conserto usa o comando do aparelho.
- Dicionário de SyntaxError, ReferenceError e TypeError; laço com uma
  volta a mais mostra a diferença entre linha da falha e causa.
- Desafio das etiquetas de viagem com três erros sucessivos, casos
  visíveis e bordas escondidas (vazio, um item e nomes repetidos).
- Dois conceitos novos com temas Lógica e Ferramentas, quatro revisões
  próprias e revisão explícita de funções, escopo, listas e decisões.
- Validação: 18.792 verificações de conteúdo; três falhas iniciais
  (ordem do registro e timeout da bancada) resolvidas com reteste dos
  afetados. Jornada da unidade nos três layouts, publicação, build e
  lint verdes. Publicação exigiu apresentar as ferramentas de cena
  nesta zona, que fica antes de Algoritmos no currículo.

### Etapa 2 — Pontos de parada

- Garagem com atribuição na condição: portão abre e não fecha; valores
  observados antes do conserto revelam a decisão alterada.
- Soma com uma volta a mais, sem erro vermelho, e desafio da carga com
  índice inicial errado. Comparar índice e tamanho confirma a hipótese.
- Três conceitos com temas, seis revisões; casos escondidos rejeitam
  solução constante e investigação é necessária mesmo com código certo.
- Conteúdo: 19.028 verificações, com dois casos antigos sensíveis à carga
  (bancada e recursão infinita) verdes no reteste isolado. As quatro
  provas específicas e 81 checagens afetadas passaram. Jornadas nos três
  layouts verdes, com leitura dos valores efetivamente vistos na pausa;
  teste móvel abre Observar e recolhe a cena em retrato. Publicação,
  build e lint verdes.

### Etapa 3 — Passo a passo

- Esquina com semáforo: Passar por cima mostra o salto de cor; Entrar
  e Sair acompanham o índice local até a cor entregue ao chamador.
- Função que imprime, mas não devolve: o cálculo local existe enquanto
  a chamada recebe undefined. A borda negativa repete a investigação.
- Desafio do recibo do cinema em contexto novo, com casos visíveis e
  escondidos. Três conceitos com temas e seis itens de revisão.
- As primeiras checagens apontaram que a segunda prática precisava
  declarar a habilidade nova; Investigar o retorno foi catalogado.
- Validação: 19.262 testes de conteúdo verdes sem reteste; jornadas
  nos três layouts com valores vistos nas pausas e Pilha de chamadas
  conferida; publicação, build e lint verdes.

### Etapa 4 — Observar variáveis

- Estufa com noite seca e dia úmido: comparar pedido e entradas, avançar
  até o comando e ver o aspersor ligado no instante do defeito.
- Tipo de código numérico recebido como texto e declaração local que
  esconde o saldo de fora. Os treinos mudam entrada e momento da cena.
- Desafio da biblioteca: pop encolhe a lista enquanto o índice avança,
  perdendo nomes; conserto preserva ordem, repetidos e lista vazia.
- Dois conceitos com temas e quatro revisões; casos incluem "007",
  vazio, repetidos e nomes diferentes para rejeitar inversão da ordem.
- Revisão final reforçou o caso escondido da U1 com nomes distintos.
  Seus ids e ordem ficaram preservados; as três jornadas repetidas passaram.
- A condição e o comando foram separados em linhas com bloco; o aluno
  acompanha as duas operações antes de conferir o aparelho.
  As 30 checagens afetadas e provas novas passaram.
- 19.446 testes de conteúdo passaram antes da revisão de formatação;
  28 checagens afetadas passaram depois. Isso não comprovou a cena visual.
- As jornadas da U4 falharam nos três layouts: Watch está na pausa, mas
  o desenho avança. Reprodução mínima da U3 confirma: pausa na linha 6,
  cena em 4.000 ms/vermelho em vez de 0 ms/verde. O motor não envia o
  foco da pausa à cena. Não alterado: aplicada a regra de parada do pedido.
- U4, seus itens de revisão e fixtures ficam para retomada, fora dos
  registros ativos e sem publicação. Currículo travado por `requerMotor`.
  ROADMAP registra causa, reprodução e critérios do conserto. PR em
  rascunho; a zona e a Ilha Lógica ainda não estão completas.

- Ao retirar U4, o glossário detectou seus conceitos sem fase ativa.
  Fontes, revisões e conceitos movidos para `docs/rascunhos/depuracao-u4/`
  como texto, fora do catálogo e da compilação; sem falsos verbetes ativos.

### Fechamento da interrupção

- Jornada U1 repetida em desktop, retrato e paisagem: verde.
- `testar:conteudo -- --maxWorkers=1`: 19.264 testes, única falha no
  glossário ao deixar conceitos U4 sem fases. Após separar o rascunho,
  58 checagens de glossário, Depuração, currículo, revisão e temas passaram.
- `publicar:conteudo`, build e lint verdes. `bateria:conteudo` rodada uma
  vez em produção: mapa, explorar, publicar e revisão passaram. Não foi
  rodada bateria completa de motor.
- U1/U2/U3 em commits próprios; fechamento com rascunho U4 e bloqueio
  em commit separado. Branch enviada por PR em rascunho, sem push na
  principal. Próximo: consertar a sincronização, retomar U4 e validar
  U2/U3/U4 nos três layouts antes de concluir a ilha; depois Opus: Origens.

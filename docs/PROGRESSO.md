# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-36.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 37: o mapa e as ilhas por dentro, e os dois chamados

Branch `ccr-9922e35d-fj1x34`, a partir da principal depois do merge das
Origens, parte 1. Capturas antes e depois em `docs/capturas/rodada-37/`.

### Etapa 1 — O mundo no celular (commit próprio)

- **Ilhas e nomes sumindo, a causa:** as ondas do mar eram dois grupos
  animados DENTRO do SVG do mundo, do tamanho do mundo inteiro. O Chrome
  repintava o mapa todo a cada quadro (medido pelo `LayerTree` do
  protocolo do Chrome: umas 35 telas de mapa por segundo, em pé, com
  pinturas de mais da metade da tela). Num Android mais fraco, os pedaços
  do mapa que entravam na tela ao rolar não ficavam prontos e apareciam só
  com a cor do mar do fundo: a ilha sem arte e sem nome, até sair da tela
  e voltar. A Lógica (a ilha atual, com mais animação em volta) era a
  mais exposta.
- **O conserto:** as ondas, o brilho das ilhas abertas, o anel da ilha
  completa, a névoa das bloqueadas e o barquinho viraram camadas de HTML
  com animação CSS (transform e opacity, pelo compositor: não repintam o
  desenho); a arte de cada ilha tem camada própria (`CamadaDaArte`), e as
  animações das ilhas fora da tela param (`GrupoAnimadoNaTela`, com
  IntersectionObserver na área que rola; a visibilidade nunca depende
  disso). Parado, o mundo repinta umas 4 telas por segundo, em pedaços
  pequenos (a maior pintura, 7% da tela em pé); com menos movimento, nada.
- **O mundo centralizado:** `desenhoMundo.ts` (puro) põe as ilhas num
  zigue-zague de duas linhas que cabe na altura com a mesma margem em cima
  e embaixo: fundo em pé (o espaço vazio de cima sumiu), achatado deitado
  (as ilhas não encolhem demais) e com o mar sobrando igual dos dois lados
  numa tela mais larga. Frameworks foi para o fim da rota (linha de baixo,
  rota mais clara) e o Porto para cima das Origens; a etiqueta do Porto
  ficou em coluna, como a das ilhas.
- **Teste novo** `testes/mundo.mjs` (três layouts, na bateria): cabe sem
  rolar para baixo, margens equilibradas, Frameworks e as plaquinhas
  inteiras; rolando de ponta a ponta e de volta, toda ilha com o nome
  inteiro na tela tem a arte desenhada e o nome legível, conferidos nos
  PIXELS da captura (`testes/png.mjs`, um leitor de PNG sem dependência
  nova); e a guarda da causa: parado, nenhuma pintura cobre mais de 30% do
  mapa e ele repinta menos de 8 telas por segundo. Unitários do desenho
  em `mapa.test.ts` (cabe, margens iguais, nada encosta, nas três
  trilhas e cinco telas).

### Etapa 2 — O interior das ilhas (commit próprio)

- **Sem vazamento:** a grama recorta as zonas (clipPath do contorno), e as
  zonas dividem o chão inteiro, contíguas.
- **O chão:** contorno orgânico (a mesma ondulação na areia, na grama, na
  espuma e na sombra na água), pedrinhas na areia, mato na beirada, relevo
  suave e luz de cima (gradiente).
- **Zonas com cara própria:** tom e textura por zona (pontinhos,
  listras, cruzinhas, ondinhas, grade, setinhas), cerca viva na divisa com
  a passagem do caminho, e a placa de madeira com o ícone (no tom da zona)
  e o nome, no alto da zona, do lado oposto ao primeiro ponto.
- **Identidade por ilha** (`EnfeitesIlha.tsx`): prédios em < e >, blocos
  e a placa de tag na Sites; engrenagens, chips e trilhas de circuito na
  Lógica; janelas, botões e faíscas em Páginas vivas; antenas, servidores
  e postes na Rede; gráfico, varal, observatório e uma cobrinha na Python;
  constelação, farol e lâmpada na IA; oficina, ferramentas e caixote no
  Ofício; blocos de montar em Frameworks. Os enfeites caem em lugares
  livres (`desenhoIlha.ts` calcula o que está ocupado: pontos, nomes,
  caminho, placas e o lugar do computadorzinho) e crescem num chão grande.
- **Caminho e pontos:** trilha de terra (o andado em cor cheia, o adiante
  mais apagado); o ponto atual brilha (halo que pulsa); o bloqueado é
  pedra. A geometria passou a ser em px de tela nos dois sentidos:
  deitado, a ilha ocupa a altura e os pontos ficam a 176 px (os nomes de
  144 px não se encostam mais, o que acontecia antes no celular deitado).
- **Movimento leve:** um enfeite por ilha (o mais perto do computadorzinho:
  a engrenagem gira devagar na Lógica, a antena e o farol mandam sinal), a
  espuma que respira e o brilho do ponto atual, tudo por CSS; parada, a
  ilha repinta menos de 1 tela por segundo. Menos movimento: parado.
- 16 tokens novos nos três temas (espuma, pedrinha, mato, relevo, luz, os
  quatro tons de zona, textura e caminho).
- Testes: unitários do desenho (zonas em ordem, placas, nomes e o
  computadorzinho sem encostar, enfeites dentro da grama sem cobrir nada,
  em pé, celular estreito, deitado e computador, em todas as ilhas) e, em
  `mundo.mjs`, a Sites e a Lógica no navegador (zonas recortadas, uma placa
  por zona, nada se sobrepõe, repintura leve).

### Etapa 3 — Os dois chamados da Depuração (commit próprio)

- **A meta:** `metaDoContrato` (`src/motor/simulacao.ts`). Contrato com
  cena: a cena antes (com o programa que o cliente já tem rodando) e
  depois das soluções. Sem cena: a saída do programa antes e depois do
  conserto (o console e as variáveis), com o que mudou em destaque (na U5,
  a sexta com o feijão "64" e depois com 10). Sem nada para mostrar, a
  seção não aparece; as outras metas (composta, de programa) também não
  mostram mais caixas vazias.
- **Kit de cenas:** dispositivos `registradora` (o visor do caixa, até 12
  letras, alinhado à direita) e `telaApp` (a tela de aplicativo: um recado
  ou a agenda que o programa monta, em ordem de horário, até 8 linhas,
  com o horário repetido em vermelho; `texto` e `conflitos` calculados do
  `conteudo`, em `src/motor/cena/telaApp.ts`). Peças novas: `balcao`
  `mercadinho` (com a esteira) e `salao`, `cesta`, `espelho` e `cadeira`.
  Tudo no `/lab/cenas` e com ficha e "Por dentro".
- **U5 (o caixa do Mercadinho Estrela):** o aquecimento troca a vitrine
  pelo caixa: o balcão com a esteira e a cesta, a registradora no balcão e
  o código `caixa.mostrar("R$ " + segunda)`. O contrato do estoque segue
  sem cena.
- **U6 (a agenda do Salão Girassol):** a recepção (espelho, cadeira e a
  tela do aplicativo no balcão), no aquecimento (`tela.mostrar("Taxa R$ "
  + ...)`) e no contrato, que ganhou a área cena: `tela.mostrarAgenda(terca,
  "Terça")` mostra Bia e Dani às 10h em vermelho até o conserto.
- **Regras:** a mesma cena em unidades diferentes reprova (regra
  `cena-repetida-entre-unidades`: o ambiente e os aparelhos da missão); o
  único par antigo, a estufa da Depuração U4 e de Estruturas U3, ficou em
  `CENAS_REPETIDAS_CONFERIDAS`. Um contrato só oferece o Levar pro mundo se
  o arquivo leva todos os aparelhos da cena (a regra `contrato` reprova).
- **Levar pro mundo:** a registradora e a tela de aplicativo saem do jogo;
  a agenda oferece o botão (`agenda-do-salao.js`: a agenda no console, com
  o horário repetido marcado); o estoque, sem cena, não.
- Ids e ordem das fases e dos objetivos não mudaram. Jornada
  `chamados-jornadas.json` regenerada do TS; `chamados.mjs` confere a meta,
  o visor, a tela e o botão nos três layouts.

### Decisões tomadas sem regra clara

- O mundo em pé virou um zigue-zague fundo de duas linhas (em vez de três
  com Frameworks e o Porto embaixo): é o que deixa tudo caber com margens
  iguais. Frameworks mudou de lugar (fim da rota) e o Porto subiu.
- No aquecimento da U5, o aparelho se chama `caixa` (era `letreiro`), e no
  da U6, `tela`. Quem tem uma dessas fases em andamento com o código
  antigo salvo vê o erro de nome não definido ao executar e precisa
  recomeçar a fase (o objetivo e as estrelas continuam).
- A tela de aplicativo também mostra o recado da taxa no aquecimento da
  U6, para a fase 1 apresentar o aparelho que o contrato usa.
- A meta de um chamado roda o código que o cliente entregou para o "antes"
  (a cena ou a saída do defeito), não o mundo parado.
- A estufa repetida (Depuração U4 e Estruturas U3) ficou como exceção
  conferida, em vez de mexer em duas unidades publicadas fora do escopo.

### Validação

- `npm run testar:conteudo`: 49 arquivos, 21.457 testes verdes.
- `npm run lint` e `npm run build` verdes.
- `mundo.mjs`, `mapa.mjs`, `chamados.mjs` (U5 e U6), nos três layouts;
  `explorar.mjs`, `ser-encontrado.mjs`, `contrato-logica.mjs` e
  `cenas-novas.mjs` verdes.
- Bateria completa (`PARALELO=4`, servidor de produção): 205 execuções,
  203 verdes e 2 falhas, nenhuma desta rodada.
  - `unidades.mjs retrato`: o duplo toque da U4F1 (`editarValorAtributo`,
    linha 167), a pendência já registrada na rodada 36 (reproduz na
    principal).
  - `algoritmos.mjs retrato 3`: o tempo esgotou na navegação da linha do
    tempo (Home e End) com quatro navegadores ao mesmo tempo. Rodado
    sozinho: verde. Código que esta rodada não tocou; ficou em Pendências
    ("Testes sob carga").

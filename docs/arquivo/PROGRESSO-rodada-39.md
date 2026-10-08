# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-38.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 39: mundo completo e vivo, fila de falas e ajustes nas Origens

Branch `claude/mundo-completo-falas-b43oz0`, a partir da principal depois do
merge da rodada 38.

### Etapa 1 — A fila de falas do computadorzinho (commit próprio)

- **Levantamento** (onde uma fala trocava outra): na prática, o roteiro do
  objetivo trocava o enunciado depois de 250 ms e a validação logo depois
  de ativar podia trocar o enunciado pela conclusão; o tutor e os avisos
  (acentos, 980 px, contraste do Meu tema) entravam por cima de qualquer
  coisa. No desafio e no projeto, "Parte feita" era atropelada pela parte
  seguinte e pela fala final. No contrato, o "Requisito cumprido" que
  disparava a mudança de pedido sumia e a conversa do cliente abria na
  hora. No museu, o anfitrião já pulava para a fala do próximo objetivo
  durante a pausa da conclusão (seguia `concluidos`) e, no desafio, cortava
  a fala no meio a cada parte. Deitado, o balão fechava sozinho com uma
  fala que pedia leitura. As apresentações só esperavam a pausa. Cena e
  revisão usam o mesmo motor da prática (mesmos casos).
- **`src/motor/filaDeFalas.ts`** (puro, com unitários): a fala importante
  espera o jogador (Continuar ou Enter); a automática espera a vez (entra
  no fim da fila se a de agora é importante, senão na hora); a pedida pelo
  jogador entra na hora e a fila continua; a pausa toma a cena e leva a
  fila que saiu de moda. O estado do motor ganhou `falaAguarda` e
  `filaFalas`; `ofereceContinuar` é a regra única do balão, do Enter e do
  atributo `data-fila-falas`.
- **No motor:** conclusão de objetivo, solução e fim do desafio tomam a
  cena; o roteiro conta (importante) e o enunciado vem depois; partes que
  ficam prontas juntas saem numa fala só; no contrato, o requisito que
  trouxe a mensagem é comemorado antes e a conversa do cliente abre no
  Continuar.
- **No balão:** botão Continuar com "mais N recados"; as apresentações só
  começam com a fila vazia; deitado, o balão não fecha sozinho com fala
  esperando.
- **Museu:** o anfitrião segue o objetivo ativo e tem a fila dele
  (`useFilaDoAnfitriao`): a fala nova espera a de agora terminar de
  aparecer e ficar 1,5 s.
- `testes/falas.mjs` (três layouts, na bateria): a conclusão fica na tela
  9 s sem trocar nem fechar, o Enter e o Próximo objetivo avançam; o
  esbarrão espera o Continuar, a apresentação espera a fila e o enunciado
  vem depois. `continuarFalas` em `testes/util.mjs`; `contrato.mjs`,
  `contrato-logica.mjs` e `chamados.mjs` passam pelo Continuar antes da
  conversa do cliente.

### Etapa 2 — Ajustes nas Origens (commit próprio)

- **Rolagem quase infinita do museu:** a parede com profundidade anda por
  transform, e o transform contava na área de rolagem a cada rolada (em pé,
  4.752 px viravam 7.969; no computador, 5.272 viravam 8.381). A camada
  ficou dentro de um recorte: o corredor acaba na árvore da família.
- **Mesa de cores:** os três canais separados (o vermelho, o verde e o azul
  sozinhos, cada um com a amostra, os dois dígitos com setinhas, o valor e
  um controle deslizante) e, embaixo, a cor combinada ao lado do alvo. O
  alvo sai do `corHex` com `valor` do objetivo ativo ou das partes do
  desafio (senão, da amostra): cada canal tem a régua até o alvo e diz se
  está no alvo, se falta subir ou se passou (`alvoDaCor.ts`, com
  unitários). Card da ferramenta, a fala do anfitrião e a dica do laranja
  atualizados, sem mudar ids nem ordem.

### Etapa 3 — O mundo completo (commit próprio)

- Todas as ilhas do currículo já estavam no mundo, com arte e estado
  (Origens, Sites, Lógica, Páginas vivas, Rede e Servidor, Python, IA,
  Ofício e a opcional Frameworks). O zigue-zague passou a sair só da ordem
  da trilha (a do currículo): a tabela fixa da trilha Web repetia a mesma
  conta e uma ilha nova não entraria nela. Mesmas posições.
- As ilhas das trilhas Jogos e Automação ganharam arte própria (a placa com
  o símbolo: controle, paleta, bola, chip, botoeira, engrenagem e ladder) e
  continuam aparecendo só na trilha delas.
- Unitários: a trilha Web passa por todo o currículo, na ordem; toda ilha
  tem arte; a rota anda para a direita em zigue-zague, com a opcional no
  fim.

### Etapa 4 — Um mundo vivo (commit próprio)

- `src/componentes/mapa/mundo/`: o mar fundo e raso, os reflexos, a espuma,
  os peixes, a baleia rara, a garrafa com mensagem (8 curiosidades com a
  década), o barquinho fazendo a rota ida e volta, nuvens com sombra,
  gaivotas, dia e noite pelo relógio (estrelas, lua, janelas e postes
  acesos, LEDs, o farol da IA girando), o aceno do computadorzinho para
  quem volta depois de 20 minutos. Nas ilhas: guindaste na Sites, pulsos nos
  cabos da Rede, fumaça na Ofício, bloco encaixando na Frameworks e
  operários de capacete nas em obra (de noite, cochilam).
- Tokens novos nos três temas (`--cor-mar-profundo`, `--cor-noite`,
  `--cor-janela-acesa`, `--cor-farol-luz`, `--cor-nuvem`...); sons
  sintetizados `baleia` e `garrafa`.
- Desempenho: transform e opacity pelo compositor; pausa fora da tela
  (`useNaTela`); recorte para quem atravessa o mundo (sem ele, a nuvem
  esticava a área de rolagem, como no museu); a vida de dentro da ilha só
  anda com metade dela na tela; os operários andam em passos. Repintura
  parada, de dia: 1,9 telas/s no computador, 3,7 em pé, 4,3 deitado (era
  4,2 deitado antes da rodada; o teto do teste é 8); de noite, 1,3, 0,4 e
  4,2; com menos movimento, de 0 a 0,3.
- `testes/mundo.mjs`: de dia fixo (`?hora=12`), o aceno, o barco andando,
  a baleia (`?baleia`) na tela e sumindo, a garrafa (44 px, curiosidade,
  Outra mensagem), a noite (`?hora=22`: estrelas, luzes, farol, nomes
  legíveis, repintura) e menos movimento (sem peixes e gaivotas, barco
  parado).

### Etapa 5 — Correções achadas na bateria (commit próprio)

- **A resposta da previsão sumia atrás de um aviso:** na U6F2, o aviso dos
  acentos (importante) entrava logo depois do palpite e o cartão com a
  resposta e a explicação só voltava depois do Continuar. Agora, com uma
  previsão respondida, o cartão fica no balão junto do Continuar.
- **Jornadas que passam pelo Continuar:** `unidades.mjs` (a fala do esbarrão
  da U2F2 espera o Continuar antes da apresentação do Desfazer) e
  `dispositivo.mjs` (a bancada abre sem meta charset: o aviso dos acentos
  chega antes, e o dos 980 px vem no Continuar).
- Capturas do mundo em `docs/capturas/rodada-39/` (celular em pé e
  computador, de dia e de noite; a mesa de cores e o Continuar).

### Decisões tomadas sem regra clara

- "Parte feita" do desafio não espera o Continuar (é automática): espera a
  vez só atrás de uma fala importante. A fala final do desafio resume as
  partes e leva a fila junto. Antes da mensagem do cliente, o requisito é
  importante (senão a conversa cobriria a fala).
- A fala pedida pelo jogador (tutor, link, Me ajuda) entra na hora mesmo
  com uma importante na tela: quem pergunta já leu.
- Sem tempo mínimo com relógio para fala comum: uma fala que chegasse
  atrasada abriria o balão sozinho no celular em pé no meio de um toque.
- Os períodos: amanhecer 6h a 8h, dia 8h a 17h, entardecer 17h a 19h e
  noite 19h a 6h. As luzes acendem no entardecer e de noite.
- A garrafa fica no lugar de mar aberto mais distante do começo da rota.
  A baleia: sorteio a cada 40 s com chance de 18% (uns 3,7 minutos em
  média), num lugar que está na tela.
- A hora da última visita ao mundo mora numa chave própria do
  localStorage (cosmética), fora do progresso.

### Validação

- `npm run testar:conteudo`: 52 arquivos, 23.198 testes verdes.
- `npm run lint` e `npm run build` verdes.
- Durante a rodada: `falas.mjs`, `museu.mjs`, `mundo.mjs` e `contrato.mjs`
  nos três layouts; `contrato-logica.mjs` e `chamados.mjs 5` no computador.
- Bateria completa (`PARALELO=4`, servidor de produção): 208 execuções, 201
  verdes e 7 falhas.
  - `dispositivo.mjs` nos três layouts e `unidades.mjs` nos três: as
    jornadas não passavam pelo Continuar da fila de falas, e a U6F2 achou o
    cartão da previsão escondido (Etapa 5). Rodados de novo, com o build
    novo: `dispositivo.mjs` verde nos três; `unidades.mjs` verde no
    computador e deitado.
  - `unidades.mjs retrato`: continua parando no duplo toque da U4F1
    (`editarValorAtributo`), a pendência registrada desde a rodada 36 (quebra
    igual na principal).
  - `algoritmos.mjs paisagem 3`: tempo esgotado com quatro navegadores ao
    mesmo tempo (a pendência "Testes sob carga"). Sozinho: verde.
  - `falas.mjs` no computador verde de novo, com o build novo.

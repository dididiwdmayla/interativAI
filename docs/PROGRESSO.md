# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-39.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 41: faxina técnica das pendências

Branch `codex/faxina-tecnica-pendencias`, base `3d3685e`, depois dos merges
#40 e #41 do mundo vivo e da fila de falas. IDs e ordem publicados preservados.

### Item 7 — O plano não apaga comentários do aluno

Reprodução: comentário `// 99. anotação minha` imediatamente depois do plano
sumia ao reordenar; regressão falhou antes e passou depois. Causa: o bloco
terminava na última linha numerada, sem marcador de fim. Agora os marcadores
`// <interativai:plano>` e `// </interativai:plano>` delimitam a substituição.
Blocos legados/incompletos ficam intactos; inserir novamente preserva tudo.
Só a bancada não publicada ganhou exemplos delimitados. 19 unitários verdes;
jornadas compostas e unidades afetadas conferidas no fechamento.

## Rodada 40: o mundo fluido no celular e os nomes das ilhas que não somem

Branch `claude/mundo-completo-falas-b43oz0`, recomeçada da principal depois
do merge da rodada 39 (PR #40).

### Etapa 1 — Medir como um celular de verdade

`testes/desempenho-mundo.mjs`: 390 x 844, toque, processador limitado pelo
protocolo do Chrome (`Emulation.setCPUThrottlingRate`, 4x e 6x), de dia e de
noite (`?hora=22`). Mede, durante a rolagem, quadros por segundo
(`requestAnimationFrame`), quadros acima de 50 ms e de 20 ms, tarefas longas,
JS por quadro, animações rodando, nós do SVG, camadas e quantas vezes a
árvore de camadas muda com o mundo parado.

Achado no caminho: o gesto sintético de rolagem por toque
(`Input.synthesizeScrollGesture` com "touch") não rola nada no Chromium sem
tela; as primeiras medidas eram do mundo parado. O teste passou a usar
toques de verdade (`arrastarComODedo` em `util.mjs`, com o carimbo de tempo
de cada toque, sem o qual o Chrome não dá o embalo) e confere que rolou de
ponta a ponta. Os números "antes" abaixo são da versão da principal (commit
e5cb1b0, servidor de produção) com o teste final.

### Etapa 2 — Causas e correções

Causas, pelo rastro do Chrome (tracing) e por experimentos (esconder uma
parte e medir):

1. O processador principal trabalhava a cada quadro: as animações do
   Framer na arte das ilhas e no computadorzinho (um cálculo e uma
   repintura por quadro) e, por causa delas, a árvore de 93 camadas
   recomposta a cada quadro (106 mudanças de camadas em 3 s com o mundo
   parado).
2. Rolando, cada animação (mesmo as do compositor) ganha um recálculo de
   estilo por quadro, e as de dentro de um SVG, um layout. O respiro do
   computadorzinho, num grupo de dentro do SVG, refazia o layout do desenho
   inteiro dele a cada quadro (o do logo da barra também, em todo o jogo).
3. As marcas de "fora da tela" trocavam a animação de alguém no meio da
   rolagem: cada pedaço que entrava ou saía da tela refazia as camadas e
   repintava.
4. Camadas do tamanho do mundo (as duas de ondas que deslizavam e outras que
   a sobreposição criava) gastavam a memória de vídeo (ver a Etapa 3).

Correções:

- A vida das ilhas (engrenagens, guindaste, pulsos nos cabos, fumaça, bloco,
  bandeirola, barco atracado, operários, faíscas, barras) e o respiro do
  computadorzinho em CSS de transform e opacity; o respiro no `<svg>` de
  fora. `useAnimarMapa` ficou só para a tela da ilha.
- Marcas por atributo, sem estado do React (`mundo/useNaTela.ts`):
  `data-pausado` (fora da tela, com folga: sem animação e sem camada),
  `data-parada` (ilha com menos da metade na tela: para onde está) e
  `data-rolando` (rolando: tudo pausa; as marcas de quem entra ou sai esperam
  a rolagem parar, 600 ms depois do último movimento).
- As regras de pausa do `globals.css` com a lista das classes animadas: com
  um seletor universal, ligar a pausa recalculava o mundo inteiro (mais de
  mil elementos, até 100 ms em 6x).
- Uma camada só do tamanho do mundo: o mar de baixo com as ondas paradas, a
  rota e a hora na água. A arte de cada ilha, cada nome, as luzes, a névoa e
  o computadorzinho em camadas pequenas (`camada-ilha`, `camada-propria`).
- Modo leve (`mundo/useModoAnimacoes.ts`): sem peixes, baleia nem gaivotas,
  metade dos reflexos e das estrelas piscando, um anel de espuma e no máximo
  duas nuvens. No menu, "Animações: Completas | Leves" (no desktop, no painel
  do som), salvo em `progresso.animacoes` (`auto`, `completas`, `leves`). No
  automático, liga sozinho com pouca memória ou poucos núcleos, ou com a
  rolagem travando nos primeiros segundos (abaixo de 45 quadros por segundo
  ou mais de um quarto dos quadros acima de 25 ms); o leve automático fica
  guardado no aparelho. Menos movimento (`prefers-reduced-motion`) continua
  parando tudo.

Antes e depois (rolagem com o dedo, servidor de produção, médias de uma
passada; 12x é um aparelho bem mais fraco):

| Cenário | Antes | Depois |
| --- | --- | --- |
| 4x dia | 29,0 qps; 20 quadros > 50 ms; 90% > 20 ms | 58,1 qps; 1 quadro > 50 ms; 2,5% > 20 ms (completas) |
| 4x noite | 28,0 qps; 29 > 50 ms; 91% > 20 ms | 58,2 qps; 0 > 50 ms; 2,9% > 20 ms (completas) |
| 6x dia | 19,5 qps; 234 > 50 ms; 129 tarefas longas (7,6 s) | 56,2 qps; 1 > 50 ms; 6% > 20 ms (completas) |
| 6x noite | 19,5 qps; 491 > 50 ms; 329 tarefas longas (19,6 s) | 55,6 qps; 1 > 50 ms; 7% > 20 ms (completas) |
| 12x dia | — | 33,9 qps, modo leve ligado sozinho |
| JS por quadro | 1,3 a 2,1 ms | 0 a 0,2 ms |
| Mudanças de camadas, 3 s parado | 61 a 106 | 4 a 12 |
| Animações rodando no meio de um arrasto | 22 a 27 | 2 (o barquinho e o logo) |
| Camadas do tamanho do mundo | várias (ondas, rota, grupos) | 1 (o mar) |

Com as correções, o automático mantém as animações completas em 4x e em 6x
(a rolagem aguenta) e liga o leve em 12x.

### Etapa 3 — Os nomes e a arte das ilhas sumindo

Reproduzido no teste: com a memória de vídeo de um celular de entrada
(`--force-gpu-mem-available-mb`), tela de 3x, de noite, processador em 6x e
arrastos rápidos, a versão antiga perdia nomes e arte das ilhas: 17 de 33
nomes com 32 MB, 14 de 33 com 40 MB (com 96 MB, nenhum). A causa: o Chrome
reserva memória de vídeo para cada camada que aparece na tela, e as camadas
do tamanho do mundo (as duas de ondas, os grupos) não cabiam junto com as
ilhas e os nomes; o que ficava sem memória não era pintado, até a pessoa
rolar para longe e voltar. Com uma camada só do tamanho do mundo, a versão
nova não perde nenhum nome com 40 MB (3 de 15 com 32 MB, contra 17 de 33).

O teste novo (as paradas do `desempenho-mundo.mjs`): em pé, 6x, de noite,
tela de 3x e 40 MB, três idas e voltas rápidas; a cada parada, toda ilha com
o nome na tela tem a plaquinha do nome nos pixels e a arte (a captura
comparada com a mesma cena, num navegador sem limites, com e sem a arte
das ilhas) e o mar não tem buraco (o azul de fundo nunca aparece de noite).
Versão antiga: 17 de 35 ilhas sem nome ou sem arte; nova: 0 de 23.

Outros achados:

- Uma captura de tela logo depois de mudar o estilo pode vir com o quadro
  anterior numa camada (as referências do teste esperam o Chrome pintar).
- A área de rolagem é uns 15 px mais larga que o desenho (o fim do mundo
  mostra uma faixa do azul de fundo, que de noite destoa). Ficou nas
  Pendências.

### Fechamento

- `mundo.mjs` com as animações completas fixas e a opção do menu
  (completas e leves, salva no progresso), nos três layouts.
- A bateria roda os testes de desempenho no fim, sozinhos (`SOZINHOS` em
  `todos.mjs`): com outros testes disputando o processador, a medida vira
  ruído.
- Docs: `PROJETO.md` ("Desempenho do mundo", as regras para o que entrar no
  mundo), `testes/README.md` e o ROADMAP.
- Build, lint e `testar:conteudo` verdes (com um teste novo da normalização
  de `animacoes`). Bateria completa uma vez, no servidor de produção
  (`PARALELO=4`): 209 execuções, 207 verdes. As 2 falhas: `algoritmos.mjs
  paisagem 3` (a instabilidade sob carga já registrada; verde sozinho) e
  `unidades.mjs retrato` (o duplo toque da U4F1, pendência da rodada 36;
  falha igual na principal). O `desempenho-mundo.mjs` passou no fim,
  sozinho.
- Depois da bateria, os limites do teste de desempenho ganharam folga
  (quadros acima de 50 ms: até 3 em 4x e até 8 em 6x; a bateria deu 6 em 6x
  de noite, no limite antigo), e a conferência da arte nas paradas passou a
  exigir 40% (de noite, o farol girando da IA só aparece na captura e
  deixava a ilha em 58%; uma arte sumida fica perto de 0%). O teste foi
  rodado de novo, verde.

# Áudio

Tudo o que o jogo toca: a música de cada tela, a voz de modem do
computadorzinho e os efeitos sonoros. Web Audio puro, sem bibliotecas.

## Onde fica

| Arquivo | O que tem |
| --- | --- |
| `src/audio/motor.ts` | O motor (sem React): AudioContext único, barramentos, música, voz, efeitos, teclas |
| `src/audio/telas.ts` | A tabela única tela -> faixa |
| `src/audio/vozModem.ts` | Gerador puro da voz: texto + humor -> lista de eventos |
| `src/audio/tocadorVoz.ts` | Toca a lista de eventos da voz no Web Audio |
| `src/audio/efeitos.ts` | Ids dos efeitos e a regra arquivo-ou-sintetizado |
| `src/audio/receitas.ts` | A versão sintetizada de cada efeito |
| `src/audio/sintese.ts` | Peças de síntese (tom, ruído filtrado, FM) com rampas |
| `src/audio/manifestos.ts` | Leitura dos manifestos e escolha de formato (webm ou m4a) |
| `src/audio/aleatorio.ts` | Hash e sorteio determinístico (a voz soa sempre igual) |
| `src/audio/ganchos.ts` | Camada fina para React: `useMusicaDaTela`, `useVozDoMascote` |
| `src/componentes/ui/AudioDoJogo.tsx` | Liga o motor à página (gestos, boot, volumes salvos) |
| `src/componentes/layout/AjustesSom.tsx` | A seção "Som" dos ajustes |
| `public/audio/musica/` | As músicas (`.webm` e `.m4a`) e o `musicas.json` |
| `public/audio/efeitos/efeitos.json` | Os efeitos gravados (por enquanto nenhum: tudo sintetizado) |

## Arquitetura

```
faixa (AudioBufferSource, loop) -> ganho da faixa (crossfade) -> música -> abaixar (ducking) -\
efeito (receita ou arquivo) -------------------------------------> efeitos -------------------> master -> saída
voz (eventos) -> ganho da fala (interromper) -> passa-baixa 4,5 kHz -> voz ------------------/
```

- **Um único `AudioContext`**, criado no primeiro gesto do jogador
  (`pointerdown`, `pointerup`, `touchend`, `keydown` ou `click`, ouvidos em
  `AudioDoJogo`). Cada gesto seguinte chama `liberarAudio()` de novo, que
  retoma o contexto se o navegador o suspendeu. Antes do primeiro gesto
  nada toca e nada vai para o console.
- **Barramentos**: `master` (0 quando "Silenciar tudo"), `música`,
  `efeitos` e `voz`. O ganho de cada um é `volume² × referência`
  (referência 1 na música, 4 nos efeitos e 7 na voz). O quadrado deixa o
  controle deslizante mais natural ao ouvido.
- **Níveis** (medidos por RMS num `OfflineAudioContext`, com os padrões):
  música a 50% em cerca de -32 dB; voz em -36 dB, uns 3 dB acima da música
  abaixada pelo ducking; acerto em -31 dB; clique em -40 dB; tecla em
  -42 dB (discreta, porque toca muito). Nenhum som passa de 0,21 de pico.
  O equilíbrio fino precisa de ouvido: ajuste `REFERENCIA` em `motor.ts`.
- **Aba escondida** (`visibilitychange`): o contexto é suspenso; ao voltar,
  retomado.
- **Rampas**: todo som começa e termina com rampa de ganho de pelo menos
  5 ms (`sintese.ts`, `RAMPA_MINIMA`); trocas de volume usam rampa de 50 ms.
  O ganho de cada som nasce em 0 antes da automação (o `GainNode` nasce em
  1, e a primeira amostra passaria inteira, virando um clique).
- **Ducking**: enquanto o computadorzinho fala, o nó `abaixar` leva a
  música a 0,5 (cerca de -6 dB) em 60 ms e devolve em 300 ms no fim da fala
  (ou em 250 ms se a fala for interrompida).
- **Silenciar tudo** ou volume de música em 0 param a música (fade) e
  liberam a faixa decodificada; ao religar, a faixa da tela volta do começo.

## Música

- **Formato**: `canPlayType('audio/webm; codecs="opus"')`; "probably" ou
  "maybe" usa o `.webm`, senão o `.m4a` (`escolherFormato`).
- **Carregamento**: `fetch` + `decodeAudioData`, só quando a tela pede a
  faixa. O `musicas.json` é lido em tempo de execução (uma vez).
- **Loop**: `loop = true`, `loopStart = 0`, `loopEnd = duracaoSegundos` do
  manifesto (nunca a duração do arquivo, que vem com alguns ms a mais).
  Cada arquivo já é um loop completo com a emenda embutida: sem crossfade
  na volta.
- **Memória**: cada faixa decodificada ocupa uns 30 MB. O motor guarda no
  máximo a atual e a que está entrando; quando a nova começa, as outras
  saem do cache (a que está saindo só vive no nó até terminar o fade), e
  se uma terceira troca chega no meio de um crossfade, a mais antiga sai
  na hora.
- **Transição**: crossfade de 1,5 s (`CROSSFADE_MUSICA`). Mesma faixa entre
  telas da mesma ilha (ilha, fase, volta para a ilha): continua tocando,
  sem reiniciar.
- Faixa pendente, sem entrada no manifesto, arquivo faltando ou que o
  navegador não abre: silêncio, sem erro.
- A página marca a faixa que está tocando em
  `<html data-faixa-musica="...">` (usado pelos testes de navegador).

### Tabela tela -> faixa (`src/audio/telas.ts`)

| Tela | Rota | Faixa |
| --- | --- | --- |
| Mapa do mundo | `/` | `mapa` (pendente: silêncio com fade out) |
| Museu das Origens | `/ilha/origens` | `origens` |
| Ilha Origens (e o que houver dentro) | `/ilha/origens` | `origens` |
| Ilha Sites, zonas, unidades e fases | `/ilha/sites`, `/fase/sites-*` | `sites` |
| Ilha Lógica | `/ilha/logica` | `logica` |
| Ilha Páginas vivas | `/ilha/paginas-vivas` | `paginas-vivas` |
| Ilha Rede e Servidor | `/ilha/rede-servidor` | `rede-servidor` |
| Ilha Ofício | `/ilha/oficio` | `oficio` |
| Ilha IA (ainda não existe no currículo) | `/ilha/ia` | `ia` |
| Ilha Frameworks (opcional) | `/ilha/frameworks` | nenhuma: silêncio |
| Id desconhecido | | silêncio |
| `/lab/*` | | não muda (continua o que estava tocando) |

A fase descobre a ilha pelo currículo (`localNoCurriculo(unidadeId)`),
então uma fase nova de qualquer ilha já toca a faixa certa.

### Como adicionar uma música nova (inclusive a do mapa)

1. Coloque os dois arquivos em `public/audio/musica/`, com o mesmo nome:
   `<id>.webm` (Opus) e `<id>.m4a` (AAC). O arquivo precisa ser um loop
   completo, com a emenda embutida.
2. No `public/audio/musica/musicas.json`, acrescente a entrada em `faixas`
   (`titulo`, `arquivos` com `webm` e `m4a`, `sampleRate`, `amostras` e
   `duracaoSegundos` exatos do loop) e tire o id de `pendentes`, se estiver
   lá.
3. Se for uma ilha nova, acrescente `id-da-ilha: "id-da-faixa"` em
   `FAIXA_DA_ILHA` (`src/audio/telas.ts`).

Para a faixa do mapa, os passos 1 e 2 bastam: o mundo já pede `mapa`.
`npm run testar:audio` confere que todo arquivo citado existe e que todo
`.webm` tem o `.m4a`.

## Efeitos sonoros

### Registro

Todo efeito tem um id (`IDS_EFEITOS` em `src/audio/efeitos.ts`) e uma
versão sintetizada (`RECEITAS` em `src/audio/receitas.ts`). Chamar
`tocarEfeito(id)`:

- se o `public/audio/efeitos/efeitos.json` listar um arquivo para o id,
  toca o arquivo (carregado sob demanda e guardado num cache dos 8 mais
  recentes; se o arquivo falhar, toca o sintetizado);
- senão, toca o sintetizado.

Os de momentos grandes têm `"preCarregar": true` e são carregados ao
entrar no mapa (quando tiverem arquivo).

### Formato do `efeitos.json`

```json
{
  "descricao": "...",
  "efeitos": {
    "clique": { "arquivos": null },
    "boot": { "arquivos": null, "preCarregar": true }
  }
}
```

### Como trocar um efeito sintetizado por um arquivo gravado

1. Grave o efeito e exporte em `.webm` (Opus, preferido) e `.m4a` (AAC, de
   reserva), com o nome do id: `public/audio/efeitos/boot.webm` e
   `public/audio/efeitos/boot.m4a`.
2. No `efeitos.json`, troque `"arquivos": null` por
   `"arquivos": { "webm": "/audio/efeitos/boot.webm", "m4a": "/audio/efeitos/boot.m4a" }`.

Sem mexer em código. Para voltar ao sintetizado, `"arquivos": null` de
novo. O volume de referência do arquivo é 0,5 no barramento de efeitos:
normalize os arquivos para soarem parecidos com a versão sintetizada.

### Ids, onde tocam e o que ficou sem ligação

| Id | Onde toca |
| --- | --- |
| `tecla` | Digitação do jogador no editor de código (CodeMirror, `keydown`), com variação aleatória de altura e volume |
| `tecla-espaco`, `tecla-enter`, `tecla-apagar` | Espaço, Enter, Backspace/Delete no editor. Limite de taxa: 28 ms entre teclas, 90 ms com a tecla segurada |
| `clique` | Botões que já tinham clique (conversa, Me ajuda, Rever, tema, card da unidade, pontos da ilha), nó da árvore clicado, entrada no museu pelo mapa, sair do modo inspecionar, confirmação de volume dos efeitos |
| `hover` | Ilhas do mundo e pontos da ilha, só com ponteiro fino (mouse) |
| `acerto` | Cada objetivo concluído, previsão certa, uso da ferramenta no "Experimente" (som antigo, igual) |
| `erro` | Previsão errada (novo, macio: errar não custa estrela) |
| `aviso` | Confirmação antes da solução do "Me ajuda" e falha do tutor (som antigo, igual) |
| `abrir-painel`, `fechar-painel` | Ajustes de som, menu do celular e Caixa de Ferramentas |
| `inspecionar` | Ligar o modo inspecionar |
| `editar` | Editar texto ou atributo pela árvore (evento `editouTexto`/`editouAtributo`) |
| `esconder` | Esconder e mostrar (tecla H, menu, barra) |
| `apagar` | Apagar elemento: chiado que desce |
| `desfazer` | Desfazer: tom que sobe "rebobinando" (bem diferente do apagar) |
| `refazer` | Refazer: dois blips subindo |
| `duplicar` | Duplicar: dois blips iguais |
| `renomear-tag` | Renomear tag |
| `boot` | Primeiro gesto do jogador na tela inicial (`/`), uma vez por carregamento |
| `esbarrao` | Momento roteirizado com a animação de esbarrão |
| `fase-concluida` | Tela de conclusão da fase (som antigo de conclusão, igual) |
| `fez-sozinho` | Comemoração "Fez sozinho!" (som antigo de conclusão, igual) |
| `unidade-concluida` | Ilha comemorando a unidade concluída |
| `desbloqueio` | A unidade seguinte abrindo na comemoração da ilha; tema Segredo liberado pelo easter egg |
| `entrar-mapa` | Voltar ao mapa do mundo (depois do primeiro gesto) |
| `viagem-ilha` | Clicar numa ilha aberta no mapa do mundo |
| `abrir-museu` | Entrar no Museu das Origens (rangido de porta antiga) |
| `dormir`, `acordar` | **Sem ligação**: o jogo ainda não tem sistema de ociosidade |
| `insignia` | **Sem ligação**: o jogo ainda não tem insígnias |

As ferramentas tocam pelo evento do painel, então valem também para as
soluções do "Me ajuda" e para os momentos roteirizados (o computadorzinho
mexendo no painel faz o mesmo som).

`tocarTeclaProgramatica(caractere)` (em `motor.ts`) toca a tecla certa de
um caractere, com o mesmo limite de taxa, para a futura "IA ao vivo"
digitando no editor. Ainda não está ligada a nada.

## Voz de modem do computadorzinho

O computadorzinho "fala" com apitos, chiados e tons de linha telefônica,
como as vozes de Animal Crossing, só que de modem. Tudo sintetizado.

### Duas partes

1. `gerarFala(texto, humor)` (`vozModem.ts`): função pura. Devolve a lista
   de eventos `{ tempo, tipo, frequencia, frequenciaFinal?, duracao, ganho,
   forma? }`, com `tipo` `blip`, `chiado`, `tom` ou `varrido`. A semente do
   sorteio é o hash de `humor|texto`: a mesma frase com o mesmo humor soa
   sempre igual.
2. `tocarEventosVoz` (`tocadorVoz.ts`): agenda os eventos no Web Audio.

### Como o texto vira som

- O texto é normalizado (sem acentos, minúsculo) e quebrado em **sílabas
  aproximadas** (consoantes + grupo de vogais; palavra sem vogal, como
  `html`, vira pedaços de 2 letras). Um blip por sílaba, nunca por letra.
- **Vogal**: blip tonal de 40 a 70 ms, onda quadrada ou FM suave, altura
  numa pentatônica de duas oitavas, num passeio aleatório puxado para o
  meio; `i`/`e` sobem um grau, `o`/`u` descem.
- **Consoante**: sibilantes (s, z, x, c, f, j, v, h) viram chiado de 22 ms
  com passa-banda em 3,2 a 3,8 kHz; oclusivas (p, t, k, q, b, d, g), chiado
  de 12 ms em 1,8 a 2,4 kHz; nasais e líquidas (m, n, l, r) fazem o blip
  entrar deslizando. Sibilante no fim da sílaba ganha um chiadinho depois.
- **Espaço**: pausa curta. **Vírgula** (e `;`, `:`): pausa maior.
  **Ponto** (e `!`): a maior. **Pergunta**: o último blip da frase sobe 45%.
- **Handshake** no começo de toda fala (135 ms): tom duplo de 1270 e
  2225 Hz (os tons de um modem antigo) e um varrido de 2100 para 1200 Hz.
- **Trinado de dados**: depois da 3a sílaba, 8% de chance por sílaba (no
  máximo 2 por fala), 4 a 6 tons alternando a cada 17 ms, baixinho.
- **Passa-baixa geral** de 4,5 kHz na voz, e todo chiado tem ganho menor
  que qualquer tom.
- **Teto**: nenhuma fala passa de 2,5 s. Texto que não cabe (as respostas
  do tutor Gemini, por exemplo) para na última sílaba que cabe e ganha uma
  cauda de 55 ms que desliza para baixo (ou para cima, se a frase era
  pergunta): final natural, sem corte seco.
- **Taxa**: a sílaba mais rápida (feliz) leva uns 80 ms, então nunca mais
  de ~13 blips por segundo.

### Humores

| Humor | Expressões do mascote | Escala (grau 0) | Tempo por sílaba | Saltos | Blip | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| feliz | `feliz`, `comemorando` | pentatônica maior em Dó5 (523 Hz) | 88 ms | até 3 graus | quadrada, 40-55 ms | |
| pensativo | `pensativo`, `apontando` | pentatônica maior em Sol4 (392 Hz) | 118 ms | 1 grau | FM, 55-70 ms | |
| triste | `preocupado`, `dormindo` | pentatônica menor em Lá3 (220 Hz) | 122 ms | 1 grau | FM, 58-70 ms | linha caindo no fim: varrido para baixo (até 35% da nota) com chiado |
| surpreso | `curioso` | pentatônica maior em Si bemol4 (466 Hz) | 96 ms | até 2 graus | quadrada, 45-60 ms | apito subindo (520 para 1560 Hz, 130 ms) antes do handshake |

O mascote tem 7 expressões (`src/motor/expressao.ts`) e nenhuma é
literalmente "surpreso" ou "triste": `curioso` é a mais próxima da surpresa,
e `preocupado`/`dormindo` (o chat desligado) ficam com a voz triste.

### Quando fala

- O balão (`BalaoFala`) fala a cada fala nova (texto ou expressão), inclusive
  as respostas do tutor Gemini, a tela de conclusão e o "Hmm, deixa eu
  pensar...". As apresentações de ferramentas falam cada passo.
- O texto do balão aparece de uma vez (não há efeito de digitação), então a
  voz dura o proporcional ao texto, com o teto de 2,5 s.
- **Uma voz por vez**: uma fala nova interrompe a anterior com fade de 30 ms.
  A mesma fala pedida duas vezes seguidas (dois balões com o mesmo texto)
  não recomeça.
- **Pular ou fechar o balão cala na hora**: o balão sai de cena (desmonta ou
  começa a animação de saída, `useIsPresent`) e a voz para.
- "Testar voz" nos ajustes fala "Oi! Eu sou o computadorzinho, e é assim que
  eu falo." com a voz feliz.

## Ajustes de som

- **Desktop**: o botão de som da barra (mapa, ilha, museu e fase) abre um
  painel com a seção "Som". **Celular**: a seção fica dentro do menu (e
  mexer nela não fecha o menu: `data-manter-menu`).
- Controles: Música (padrão 50%), Efeitos (70%) e Voz do computadorzinho
  (70%), de 5 em 5%, mais "Silenciar tudo" e "Testar voz". Soltar o
  controle de Efeitos toca um clique para ouvir o volume.
- Salvos no progresso (`ilha-sites:progresso:v2`), como o tema: `som`
  (o antigo liga/desliga, agora o inverso de "Silenciar tudo", preservado
  para quem já tinha desligado), `volumeMusica`, `volumeEfeitos` e
  `volumeVoz` (0 a 1, com padrão na normalização).

## Testes

- `npm run testar:audio` (também roda dentro de `npm run testar:conteudo`):
  `testes/audio/voz.test.ts` (determinismo, teto de 2,5 s, final natural,
  pausas, pergunta subindo, handshake, taxa de blips, sílabas, ruído abaixo
  dos tons, assinaturas por humor) e `testes/audio/registro.test.ts`
  (arquivo ou sintetizado, tabela tela -> faixa, manifestos e arquivos em
  `public/`, escolha de formato, ajustes no progresso).
- `node testes/audio.mjs` (Playwright, com o jogo no ar): ajustes aparecem,
  mudam e continuam depois de recarregar; navegação mapa -> ilha -> fase ->
  ilha -> mapa -> museu -> ilhas com o AudioContext real do Chromium
  (faixas decodificadas de verdade, sem reiniciar entre ilha e fase,
  silêncio no mapa e em Frameworks) e console limpo; celular em pé com os
  controles no toque.

# Roteiro dos curtos verticais

Gerado por `node scripts/roteiro-curtos-md.mjs` a partir de `src/curtos/roteiro.ts` (a fonte única dos dois curtos). Não edite este arquivo: mude o roteiro e gere de novo.

Os dois vendem a mesma ideia, "Programe jogando.", de jeitos opostos. Formato: 1080 x 1920, 30 fps, em laço (o último quadro é o primeiro).

A unidade de tempo é a batida da música. A música de cada curto é uma janela de compassos inteiros escolhida por medida (`scripts/energia.mjs`); o vídeo dura exatamente a janela e todo corte cai numa batida.

## O aprendiz (tema Doce)

- **Duração:** 471 quadros, 15,70 s (28 batidas de 0,56073 s, 107,004 bpm).
- **Música:** `sites`, janela de 7 compassos a partir do compasso 30 (65,04 s da faixa), -17,21 dB RMS. Por RMS puro, a mais forte das candidatas era `logica` (-16,97 dB, 101,372 bpm); as janelas a menos de 0,5 dB dela (`logica`, `sites`) empatam, e vence a mais rápida.
- **Laço do som:** os últimos 120 ms cruzam com os 120 ms que vêm antes do começo da janela; a música não entra nem sai (o vídeo repete).

| Tempo | Batidas | Plano | Tomada | Texto na tela | Som | O que acontece |
| --- | --- | --- | --- | --- | --- | --- |
| 0,00 a 1,67 s | 0 a 3 | Gancho | desenhado | "Achei que programar era isso" | `sint-tecla-3` (batida 1); `sint-vidro` (batida 2); `esbarrao` (batida 2,05) | O aprendiz em close, preocupado, na frente de um muro de código de verdade (programas da Ilha Lógica), desfocado e rolando devagar. Na batida 1 aparece o primeiro trinco; na batida 2 o muro racha como vidro e cai em pedaços. |
| 1,67 a 2,80 s | 3 a 5 | Start | desenhado | "Aperta start."; "JOGAR" | `acordar` (batida 2,9); `sint-clique` (batida 4,2); `entrar-mapa` (batida 4,3); voz: "Aperta start." (batida 3,08) | Atrás do muro está o computadorzinho, feliz. Ele fala com voz de modem; o botão JOGAR aparece, o dedo toca e a câmera mergulha na tela dele. O aprendiz encolhe para a câmera de streamer no canto. |
| 2,80 a 5,03 s | 5 a 9 | Fase 1 | V01 | "FASE 1: mexer num site de verdade"; "FASE CONCLUÍDA" | a música | O texto novo é digitado na árvore do site e, no Enter, a manchete da prévia muda. O aprendiz se empolga; carimbo, três estrelas para o placar e o boné voa para ele. |
| 5,03 a 7,30 s | 9 a 13 | Fase 2 | V05 | "FASE 2: deixar com a sua cara"; "FASE CONCLUÍDA" | a música | No painel Estilos, o dedo toca o quadradinho da cor e o cabeçalho do site troca de cor. Reação e estrelas. |
| 7,30 a 9,53 s | 13 a 17 | Fase 3 | V09 | "FASE 3: programar a padaria"; "uau"; "FASE CONCLUÍDA" | a música | A vitrine da padaria: o código acende a luz, o letreiro e o forno. O aprendiz diz "uau" no balão; estrelas, e os óculos voam para ele. |
| 9,53 a 11,77 s | 17 a 21 | Fase 4 | V06 | "FASE 4: caçar o bug"; "FASE CONCLUÍDA" | a música | O chamado da agenda: o programa para no ponto de parada (ele fica pensativo) e, depois do conserto, o último caso de teste fica verde (satisfeito). Estrelas. |
| 11,77 a 13,47 s | 21 a 24 | Mundo | V07, V04, V08 | "mais de 240 fases" | `sint-clique` (batida 21); `sint-clique` (batida 22); `insignia` (batida 23) | Três cortes de uma batida: o mundo de noite, um antepassado acordando no museu e o painel de insígnias. |
| 13,47 a 15,70 s | 24 a 28 | Final | desenhado | "Programe jogando."; "InterativAI"; "interativ-ai.vercel.app"; "Achei que programar era isso" | `unidade-concluida` (batida 24,45); `sint-remonta` (batida 26,680291762523854) | O aprendiz sai da câmera de streamer e volta ao close, de boné e óculos, satisfeito, com o placar grande ao lado. Na última meia batida ele pisca, os prêmios somem num brilho e o muro de código se remonta: o último quadro é o primeiro. |

Em cada fase vencida (o momento real da gravação): a fanfarra `fase-concluida` do jogo, três `sint-estrela` (uma por estrela que entra no placar), o `sint-acerto` do jogo quando o número fecha e, nas fases 1 e 3, o prêmio voando (`sint-voa` e `desbloqueio`). As vitórias caem nas batidas 7,33, 11,31, 14,02, 19,36 (24 sons ao todo).

### Cortes

| Tempo | Batidas | Tomada | Começa em | Velocidade | Câmera |
| --- | --- | --- | --- | --- | --- |
| 2,80 a 3,93 s | 5 a 7 | `V01-sites-u1-celular` | marca "digitar" - 0,10 s (8,38 s) | 2x | zoom 1,32 |
| 3,93 a 5,03 s | 7 a 9 | `V01-sites-u1-celular` | 10,61 s (10,61 s) | 1x | zoom 1,06 a 1,15 |
| 5,03 a 5,90 s | 9 a 10,5 | `V05-estilos-celular` | marca "clique-no-quadradinho" - 0,42 s (2,84 s) | 1x | zoom 1,25 a 1,4 |
| 5,90 a 7,30 s | 10,5 a 13 | `V05-estilos-celular` | marca "cor-mudou" - 0,10 s (3,79 s) | 0,9x | zoom 1,1 a 1,2 |
| 7,30 a 9,53 s | 13 a 17 | `V09-vitrine-de-perto` | marca "luz-acesa" - 0,56 s (0,39 s) | 1x | zoom 0,94 a 1,12 |
| 9,53 a 10,67 s | 17 a 19 | `V06-chamado-celular` | marca "pausou" - 0,28 s (1,80 s) | 1x | zoom 1,12 a 1,34 |
| 10,67 a 11,77 s | 19 a 21 | `V06-chamado-celular` | marca "teste-verde-4" - 0,19 s (24,55 s) | 1x | zoom 1,14 a 1,26 |
| 11,77 a 12,33 s | 21 a 22 | `V07-mundo-noite-celular` | marca "arrasto:2" + 0,20 s (4,80 s) | 1x | zoom 1,12 |
| 12,33 a 12,90 s | 22 a 23 | `V04-museu-celular` | marca "acordou:pc" + 0,30 s (10,09 s) | 1x | zoom 1,12 |
| 12,90 a 13,47 s | 23 a 24 | `V08-insignias-celular` | marca "painel-aberto" + 0,60 s (3,04 s) | 1x | zoom 1,12 |

## O chefão (tema Fliperama)

- **Duração:** 476 quadros, 15,87 s (36 batidas de 0,44097 s, 136,063 bpm).
- **Música:** `paginas-vivas`, janela de 9 compassos a partir do compasso 56 (97,01 s da faixa), -16,76 dB RMS. Por RMS puro, a mais forte das candidatas era `oficio` (-16,67 dB, 75,006 bpm); as janelas a menos de 0,5 dB dela (`oficio`, `paginas-vivas`, `logica`, `origens`) empatam, e vence a mais rápida.
- **Laço do som:** os últimos 120 ms cruzam com os 120 ms que vêm antes do começo da janela; a música não entra nem sai (o vídeo repete).

| Tempo | Batidas | Plano | Tomada | Texto na tela | Som | O que acontece |
| --- | --- | --- | --- | --- | --- | --- |
| 0,00 a 1,33 s | 0 a 3 | Gancho | desenhado | "UM BUG APARECEU"; "CHEFÃO: O HORÁRIO REPETIDO" | `sint-estalo` (batida 0) | Fundo do Fliperama com scanlines. O chefão (o bug) já está inteiro no quadro 0, com a barra de vida e o nome; a tela treme com o estalo grave da entrada. |
| 1,33 a 3,53 s | 3 a 8 | A missão | F01 | "MISSÃO: salvar a agenda do salão"; "DONA ZÉLIA"; "Salão Girassol" | `viagem-ilha` (batida 2,9); `sint-acerto` (batida 4) | A tela do aplicativo do Salão Girassol acende com a terça: as 10h marcadas duas vezes, em vermelho (gravação real, aproximada). A Dona Zélia aparece num cartão de cliente, preocupada. |
| 3,53 a 8,83 s | 8 a 20 | A luta | F02 | "PAUSA"; "ACHEI"; "CONSERTO"; "COMBO x2"; "COMBO x3" | `sint-golpe` (batida 8); `sint-golpe` (batida 11); `sint-golpe` (batida 14); `sint-estrela-1` (batida 17); `sint-estrela-2` (batida 18); `sint-estrela-3` (batida 19) | O mesmo chamado: o programa parado no ponto de parada (PAUSA); o Observar mostra o valor da segunda pausa (ACHEI); o trecho errado é selecionado e apagado (CONSERTO). Cada golpe quebra um pedaço do escudo do chefão. Depois, os casos de teste: cada um que fica verde na gravação tira um quarto da vida, e o contador de combo sobe. |
| 8,83 a 11,03 s | 20 a 25 | Nocaute | F02 | "COMBO x4"; "BUG DERROTADO" | `sint-nocaute` (batida 21); `unidade-concluida` (batida 21,7) | O último caso de teste (o do horário repetido) fica verde e a barra zera. O quadro congela por 4 quadros, com um clarão; o chefão explode em pixels, que viram estrelas e sobem. A Dona Zélia fica satisfeita. |
| 11,03 a 12,80 s | 25 a 29 | Próximas fases | F03, F04, F05, F06 | "mais de 240 fases"; "MUNDO"; "MUSEU"; "PYTHON"; "INSÍGNIAS" | `sint-clique` (batida 25); `sint-clique` (batida 26); `sint-clique` (batida 27); `sint-clique` (batida 28) | Um seletor de mundo de fliperama: quatro cartões de uma batida, com o mundo de noite, o museu, o Python rodando e as insígnias, tudo no tema Fliperama. |
| 12,80 a 15,87 s | 29 a 36 | Final | desenhado | "Programe jogando."; "1 jogador?"; "InterativAI"; "interativ-ai.vercel.app"; "UM BUG APARECEU" | `sint-neon` (batida 29,4); `sint-neon` (batida 30,4); `sint-pixel` (batida 34); voz: "1 jogador?" (batida 31,4) | O letreiro neon liga, palavra por palavra. O computadorzinho, no Fliperama, pergunta "1 jogador?" com voz de modem. Embaixo, o logo e o endereço. No fim, um pixel que sobrou da explosão cresce e vira o chefão de novo: o último quadro é o primeiro. |

A barra de vida do chefão tem 4 partes: uma por caso de teste que fica verde na gravação (batidas 17, 18, 19, 21). O escudo, de 3 pedaços, quebra nos golpes da investigação (batidas 8, 11, 14). No nocaute (batida 21), a imagem congela e a música some por 4 quadros.

### Cortes

| Tempo | Batidas | Tomada | Começa em | Velocidade | Câmera |
| --- | --- | --- | --- | --- | --- |
| 1,33 a 3,53 s | 3 a 8 | `F01-missao-fliperama` | marca "horario-repetido" - 0,44 s (0,36 s) | 1x | zoom 1 a 1,1 |
| 3,53 a 4,87 s | 8 a 11 | `F02-luta-fliperama` | marca "pausou" - 0,07 s (2,05 s) | 1x | zoom 1,1 a 1,2 |
| 4,87 a 5,73 s | 11 a 13 | `F02-luta-fliperama` | marca "observou" + 0,08 s (5,98 s) | 1x | zoom 1,08 a 1,16 |
| 5,73 a 7,50 s | 13 a 17 | `F02-luta-fliperama` | 10,55 s (10,55 s) | 1x | zoom 1,1 a 1,24 |
| 7,50 a 7,93 s | 17 a 18 | `F02-luta-fliperama` | marca "teste-verde-1" - 0,07 s (14,52 s) | 1x | zoom 1,1 a 1,16 |
| 7,93 a 8,37 s | 18 a 19 | `F02-luta-fliperama` | marca "teste-verde-2" - 0,07 s (17,90 s) | 1x | zoom 1,1 a 1,16 |
| 8,37 a 8,83 s | 19 a 20 | `F02-luta-fliperama` | marca "teste-verde-3" - 0,07 s (21,29 s) | 1x | zoom 1,1 a 1,16 |
| 8,83 a 11,03 s | 20 a 25 | `F02-luta-fliperama` | marca "teste-verde-4" - 0,44 s (24,33 s) | 1x | zoom 1,04 a 1,18 |
| 11,03 a 11,47 s | 25 a 26 | `F03-mundo-fliperama` | marca "arrasto:3" + 0,25 s (7,95 s) | 1x | zoom 1 |
| 11,47 a 11,90 s | 26 a 27 | `F04-museu-fliperama` | marca "acordou:valvulas" + 0,15 s (5,47 s) | 1,5x | zoom 1 |
| 11,90 a 12,33 s | 27 a 28 | `F05-python-fliperama` | marca "python-rodou" - 0,12 s (4,86 s) | 1x | zoom 1,16 |
| 12,33 a 12,80 s | 28 a 29 | `F06-insignias-fliperama` | marca "painel-aberto" + 0,50 s (2,91 s) | 1x | zoom 1 |

## Tomadas novas

| Tomada | Tema | O que mostra |
| --- | --- | --- |
| `V05-estilos-celular` | Doce | No celular em pé: o painel Estilos, a cor de fundo do cabeçalho trocada pelo seletor e a prévia mudando |
| `V06-chamado-celular` | Doce | O chamado da agenda do Salão Girassol no celular (Doce): ponto de parada, o programa pausado, o Observar, o conserto e os casos de teste ficando verdes, um por vez |
| `V07-mundo-noite-celular` | Doce | O mundo de noite no celular em pé (Doce): Porto da revisão, Origens, Sites e Lógica, rolado com o dedo, sem chegar nas ilhas em construção |
| `V08-insignias-celular` | Doce | O painel de insígnias no celular em pé (Doce) |
| `V09-vitrine-de-perto` | Doce | O contrato da padaria no celular, com a gravação aproximada na cena: o código acende a luz, o letreiro (com as promoções sem o preço) e o forno da vitrine (janela aproximada) |
| `F01-missao-fliperama` | Fliperama | O chamado da agenda do Salão Girassol no Fliperama, com a gravação aproximada na tela do aplicativo: a terça aparece com o horário das 10h marcado duas vezes, em vermelho (janela aproximada) |
| `F02-luta-fliperama` | Fliperama | O chamado da agenda do Salão Girassol no celular (Fliperama): ponto de parada, o programa pausado, o Observar, o conserto e os casos de teste ficando verdes, um por vez |
| `F03-mundo-fliperama` | Fliperama | O mundo de noite no celular em pé (Fliperama): Porto da revisão, Origens, Sites e Lógica, rolado com o dedo, sem chegar nas ilhas em construção |
| `F04-museu-fliperama` | Fliperama | O Museu das Origens no celular, no Fliperama: o corredor descendo e os primeiros antepassados acordando |
| `F05-python-fliperama` | Fliperama | Museu, sala 3, no celular e no Fliperama: o comparador roda o Python de verdade no navegador |
| `F06-insignias-fliperama` | Fliperama | O painel de insígnias no celular em pé (Fliperama) |

As tomadas V01 e V04 são as da apresentação v1. A V03 (a padaria no celular inteiro) não foi usada: no celular em pé o desenho da cena fica pequeno, e a solução do contrato escreve preços no letreiro.

# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-28.md`.
Status consolidado: `docs/ROADMAP.md`.

## Rodada 29: formato contrato e o contrato da Lógica

Branch `ccr-c810c095-jo1u85`, a partir de `claude/intelligent-pascal-5va93x`
(depois do merge do motor de cenas). Um commit por etapa.

### Etapa 0: duas correções

- Depurador pausado com cena: o Observar e o Console avaliavam com a cena
  reiniciada (relógio em zero), não no instante da pausa. Agora o núcleo
  posiciona a cena no passo pausado (`MotorCena.posicionar`: o relógio e só
  as mudanças até ali, com o filtro do passo, igual ao palco) e volta a
  simulação de verdade depois (`instanteDoPasso`, do hook até o Worker).
- O teste de estruturas que passava de 5 s com a máquina ocupada: a causa
  era o `await import("@/conteudo/checagens")` dentro do teste (uns 3 s
  carregando e transformando o currículo inteiro, contando no limite). Os
  imports foram para o topo nos quatro arquivos com o mesmo padrão
  (circuito, depurador, estruturas, ordenar): o teste caiu de 3,6 s para
  0,5 s, sem mudar o limite.

### Etapa 2: o formato contrato como dados

- O contrato é um desafio com o campo `contrato` (`src/motor/contrato/
  modelo.ts`): cliente, projeto, briefing, documento, cartões de requisitos
  (pedidos com `parte`, distrações com `sobra`, lacunas `___`), mudança
  (`depoisDe`, mensagem, adendo, partes novas com `substitui`), reação na
  entrega e o arquivo do Levar pro mundo. As partes do desafio são os
  requisitos, do cliente e do processo, cada uma com a `pergunta` do
  colega.
- Motor: o estado `contrato` na fase e no progresso (etapa, lista
  escolhida, tentativas, mudança, tempo, entregue), o checklist de agora
  (`partesVisiveis`), a pausa da mensagem do cliente, o tempo de trabalho
  (salvo de minuto em minuto), o colega que só pergunta com o Rever ao
  lado, o modo `contrato` do tutor, a meta da unidade só com a cena.
- Tela: conversa com o cliente (o texto digitando), documento (com o
  adendo depois da mudança), etapa de requisitos (o aviso sem dizer qual
  cartão na primeira vez; o porquê dos errados da segunda em diante), o
  checklist vazio antes da lista montada, com o cliente e o botão Pedido
  em cima e o selo Novo.
- Fábrica: a regra `contrato` (`conferir.ts`) e a jogada do contrato
  inteiro (`jogarContrato`): a lista certa (e a com distração ou sem um
  pedido, que não podem passar), o antes, a mudança exigindo ajuste real e
  o depois. `variosCenarios` ganhou `porLinha`. O kit de cenas ganhou o
  relógio (`hora`) e a campainha (`tocar()`).
- Bancada `lab-contrato-u1` (o estúdio do Rafa) e `testes/contrato.mjs`.

### Etapa 3: os clientes

- Kit de clientes como dados (`clientes.ts`): pele, cabelo e cor, roupa e
  cor, acessórios; desenho em peças (`src/componentes/contrato/kit/`), com
  tokens `--cor-cliente-*` nos três temas (o preto do cabelo e o contorno
  ajustados para os temas escuros).
- Cinco expressões com enfeites (a mão no queixo, a gota, os brilhos) e a
  vida do computadorzinho: pisca, respira, inclina a cabeça, pula de
  empolgação e fala com a boca acompanhando o texto (`formaDaLetra`).
- Dona Celeste (Padaria Pão de Mel) e Rafa. Mostruário `/lab/clientes`.

### Etapa 4: entrega, comemoração e Levar pro mundo

- Entrega: o relatório automático, o envio, a reação do cliente fala por
  fala e a comemoração de fim de ilha (o computadorzinho e o cliente,
  confete e o som grande).
- Levar pro mundo (`levarProMundo.ts`): um .js com o programa e os
  aparelhos de mentirinha que escrevem no console o que fariam, no relógio
  simulado, com os acontecimentos do dia; roda no Console de um navegador
  e no Node. Os dispositivos ganharam `nome` (o de fora do código).

### Etapa 5: o contrato da Lógica, publicado

- `logica-programa-de-verdade-u1`, "O contrato da padaria", na zona
  Programa de verdade (sem `requerMotor`; o `projeto-ponte-js` saiu dos
  motores planejados).
- Fase 1, "A vitrine às seis da manhã": a ficha do relógio, o tempo no
  Console (previsão do esperar), a campainha, o loop de controle e, sozinho,
  um plim por pessoa que chega.
- Fase 2, o contrato: o briefing da Dona Celeste, os cartões (4 pedidos, 3
  distrações, lacunas de horário, temperatura e formato), plano, código,
  cena, palco e casos de teste de `aberta(hora)`. A mudança: com a padaria
  aberta, uma hora sem ninguém apaga a luz e quem chega acende de novo,
  conferido em três dias de teste. O contador de clientes também é
  conferido nos três dias (4, 3 e 5).
- `testes/contrato-logica.mjs`, a jornada pelo mapa nos três layouts, com
  as soluções em `testes/contrato-jornadas.json` (o teste de conteúdo
  confere que o JSON acompanha o TS).

### Etapa 6: guia, ROADMAP e verificação

- Guia, seção 31 (como escrever um contrato), e os ajustes nas seções 18 e
  30 (relógio, campainha, `porLinha`); PROJETO.md (arquitetura) e
  MAPA-CURRICULAR.md (a zona Programa de verdade e o motor que saiu).
- Verificação final: `testar:conteudo` 16.814 testes (42 arquivos), lint,
  `publicar:conteudo` e build verdes; bateria completa (`testes/todos.mjs`,
  151 arquivos x layouts, inclusive `contrato.mjs` e `contrato-logica.mjs`
  nos três layouts) verde no build de produção, uma vez, com 3 em paralelo,
  console limpo. Depois da correção de acessibilidade da fala do cliente
  (o leitor de tela ouve a fala inteira uma vez): build de novo e os dois
  testes de contrato nos três layouts, verdes. Publicado igual a antes
  (nenhuma unidade publicada mudou; entrou a `logica-programa-de-verdade-u1`).

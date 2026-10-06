# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-34.md`.

## Rodada 35: conserto da cena pausada, U4 e os chamados

- O teste do bloqueio só cobria a pausa inicial. Foi ampliado para Passar por
  cima e Retomar, o caminho que o motor ainda não cobria; uma prova de
  sincronização precisa andar com os controles, não só olhar a primeira pausa.
- A regra de ritmo das cenas (toda unidade nova da Lógica tem cena) pega um
  chamado sem cena antes do `publicar:conteudo`. Resolvido pondo a cena no
  aquecimento; o contrato pode ficar sem ela.
- Não há cartão de diagnóstico no formato contrato: a etapa de requisitos
  trata de "o que o cliente pediu". O quadro de plano agrupado serviu de
  diagnóstico e de relatório, e a parte do conserto só marca depois dele.
- O plano levado para o código desloca as linhas: investigar com
  `pausouNaLinha` quebraria. Em contrato, `observou` com valor basta.
- Servidor `next start` deixa um processo filho vivo quando só o pai é
  morto: depois de um build novo, ele serve o site velho. Encerrar o
  `next-server` junto no script de teste.
- Contrato novo repete a jornada da padaria quase inteira: copiar
  `contrato-logica.mjs` e tirar o Levar pro mundo foi o caminho curto. A
  jornada espera o diálogo da entrega sair antes de abrir a conclusão (dois
  diálogos "Continuar" ao mesmo tempo).

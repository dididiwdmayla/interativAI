# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-33.md`.

## Rodada 34: zona Depuração

- Simulação e Watch corretos não provam que o desenho corresponde à pausa.
  Cobrar tempo e estado do aparelho revelou a cena animando o rastro inteiro;
  bloqueio reproduzido também na U3. U4 retirada dos registros, sem adaptar
  o conteúdo para mascarar o motor. Pendência antes de concluir a ilha.
- Comandos com o mesmo tempo pedem filtro de execução/passo, além de ms.
  Separar condição e comando em linhas permite pausar antes de cada operação.
- Casos escondidos com nomes diferentes rejeitam inversão; nomes repetidos
  sozinhos podem esconder esse conserto errado. U1 reforçada sem mudar ids.
- Guiado e sozinho compartilham a habilidade; jornadas comparam as ações do
  TS e leem Watch/Pilha pela UI. U4 e revisão permanecem rascunhos.
- Conteúdo sem navegadores concorrentes e `--maxWorkers=1` evitou falhas
  antigas sensíveis à carga. Servidor e navegador na mesma invocação.
- Catálogo alimenta o glossário: conceito de rascunho sem fase ativa falha.
  U4 guardada como texto em docs/rascunhos, incluindo catálogo/revisões.

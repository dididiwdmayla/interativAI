# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodadas-12-a-31.md`.

## Rodada 33: zona Estruturas de dados

- Motor suficiente após o merge do custo escondido (PR #33); nenhuma
  improvisação de medição no conteúdo. Pilha e fila separadas antes da
  publicação, porque os três ids antigos da zona ainda eram planejados.
- `formaDaEstrutura` precisa ver entrada e saída: a lista nasce vazia e
  recebe push antes de pop/shift. Bordas vazias e de um item são cobradas
  por `funcaoPassa`, separadamente da animação.
- Índice evita mover a fila, mas conserva os itens na lista: isso aparece
  na fala. Orçamentos conferem o total com escondidos e têm prova de
  folga para variáveis intermediárias; acertar bordas não prova eficiência.
- Map guarda uma leitura: mudar o sensor sozinho não atualiza o par.
  A estufa espera a entrada genérica e faz set na mesma chave; has
  distingue ausência de zero. Objeto e Map têm treino explícito.
- Na árvore, ramos de profundidade diferente rejeitam laços de níveis
  fixos. Abrir Ver como árvore antes de rebobinar permite conferir os nós
  visitados, junto com as molduras. Uma árvore já aberta não precisa de
  outro evento de abertura no sozinho; validar a estrutura nova basta.
  Subconjuntos de casos usam testarFuncao: a simulação prepara apenas os
  validadores declarados na fase.
- Jornadas ligadas às ações do TS via JSON, uma unidade por commit. Servidor
  e navegador na mesma invocação; encerrar o processo Next diretamente
  evita que um servidor antigo sobreviva ao encerramento do npm.

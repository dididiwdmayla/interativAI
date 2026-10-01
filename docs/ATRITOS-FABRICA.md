# Atritos da fábrica

Só a rodada mais recente fica aqui; as anteriores estão em `docs/arquivo/`.
Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-8.md`.

## Rodada 9: zona Decisões

- **Ordem do prompt contra o mapa:** o prompt dizia "a primeira unidade faz a ponte", mas o mapa curricular (e o ROADMAP) põem os portões na U2. Mantida a ordem do mapa: U1 comparações, U2 a ponte circuito → código.
- **Desafio da U2:** `desafio` não aceita circuito e a fase de programa recusa `circuito`. A catraca do metrô ficou numa fase de prática (circuito) e o desafio, no Console, é outra catraca (academia). Registrado em Pendências.
- **Validadores de saída que travam:** `saida` e `respostaDoConsole` "travam" no checklist; no desafio de `if`, cada faixa usa mensagem própria (senão uma execução satisfaz duas partes). O bug do `;` depois do `if` é provado pela caixinha (estado), não pela saída, para o conserto poder ser refeito.
- **`else` sem `else`:** `usouSintaxe: "else"` não reconhece `else if` sem `else` final; um item de revisão falhou na checagem por isso e usa `if`.
- **Chaves automáticas:** o Console fecha `}` ao digitar `{`; digitar `if` linha a linha deixou chaves a mais na jornada. Os testes agora colam o código (texto inserido).
- **Apresentação do circuito:** o "Experimente" da tabela verdade já abre o código; o botão alterna, então a jornada fecha e abre de novo antes do objetivo "Ver como código".
- **Fase de circuito:** objetivo guiado precisa de linha de ajuda com `alvo: "circuito"` (a regra recusa linha do Console). O gerador local passou a pôr uma por padrão.
- **Produção:** as fases e os itens vieram de geradores locais (fora do repositório, como nas rodadas 15 e 16) e passaram no `testar:conteudo` quase de primeira; só duas correções (linha do circuito e `else`). Sem extensão do motor.
- **Ambiente:** `npm ci` e Playwright global 1.56.1 com o Chromium 1194 já instalado funcionaram sem download. Servidor (`npm start`) e testes rodaram no mesmo comando por causa da rede isolada.

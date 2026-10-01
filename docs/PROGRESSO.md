# Progresso

Esta rodada guarda o detalhe mais recente. Rodada anterior: `docs/arquivo/PROGRESSO-rodada-21.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 22: Ilha Lógica, parte B (motor)

Um commit por etapa. Fidelidade ao Chrome conferida em developer.chrome.com pela busca (o site direto está bloqueado pela política de rede do ambiente): ponto de parada no número da linha e `debugger;`, pausa antes da linha, F8, F10, F11 e Shift+F11 (e os atalhos de Ctrl/Cmd), Ctrl+B, painéis Scope, Watch e Call Stack.

### Etapa 1: pendências de motor

- Console: o `}` que o próprio Console fechou passa por cima (não duplica); Enter entre `{` e `}` abre o bloco indentado; Enter só roda com o código completo e o cursor no fim; Shift+Enter pula linha e Ctrl+Enter roda sempre. A barra de símbolos do toque digita como o teclado (`src/componentes/painel/console/digitacaoConsole.ts`).
- `usouSintaxe`: `else` é o else final e `else-if` é o `else if` (id em kebab-case, como as outras sintaxes). Documentado no guia (25.3).
- Desafio com `circuito`: partes com `circuitoTabela` e `usouPortao`, meta com a bancada antes e depois. Com `programa` junto, a ponte circuito/Console (bancada como tela; tabela verdade e Console no painel; no celular, um seletor).
- Palco: `let`/`const` de dentro de um bloco aparecem numa caixa "dentro do bloco" e somem quando o bloco termina.
- Testes: unitários do Console, do else-if, do escopo de bloco e do desafio com circuito; `testes/console.mjs` digita um if linha a linha (desktop e toque); `testes/ponte-circuito.mjs` nova.

### Etapa 2: aba Fontes com depurador

- O depurador anda pelo rastro do executor (memória antes de cada linha): pontos de parada no número da linha e `debugger;`, "Pausado no depurador", linha acesa, palco do momento, Snippet só de leitura na pausa, valor no hover, Console respondendo no momento pausado.
- Controles Retomar, Passar por cima, Entrar e Sair, com os atalhos do Chrome; painéis Escopo, Observar e Pilha de chamadas. No celular: barra de controles grande embaixo e painéis em abas.
- Validadores `pontoDeParada`, `pausouNaLinha`, `observou` (com `valor`) e `usouControle`; ações e eventos; 5 ferramentas com apresentação; demonstração `lab-logica-u1-f4`.
- Testes: `depurador.test.ts`, `testes/depurador.mjs` e `testes/apresentacoes-logica.mjs`.

### Etapa 3: ordenar passos

- Tipo de fase `ordenar-passos` (o quadro é a tela inteira, como a bancada do circuito). Cartões com `depoisDe`, distrações (`sobra`), `inicial`, variante agrupar e plano de código que roda (`rodar`).
- Validação pelas dependências (qualquer ordem que as respeite); `ordemValida`, `passoNoPlano`, `passoAntes`, `semSobras`; arrastar pela alça (mouse e dedo), tocar e "Pôr aqui", setas.
- Demonstrações `f5` (café), `f6` (agrupar) e `f7` (plano de código). Testes: `ordenar.test.ts` (todas as permutações) e `testes/ordenar.mjs`.

### Etapa 4: palco para estruturas e desempenho

- Vagões entrando e saindo pelo lado certo (push/pop pela direita, unshift/shift pela esquerda); a leitura acende o vagão ("2 leu") e a troca numa linha só acende os dois ("trocou"). Leituras gravadas pela instrumentação (`__r.li`), sem contar o lado esquerdo de atribuições.
- "Ver como árvore" para objetos com filhos objetos, com o nó da função de agora aceso e a ponte para a árvore de Elementos.
- Contador de passos no palco e aba Desempenho (simulação) com o gráfico passos x tamanho: Medir, legenda, valor no fim de cada linha, detalhe ao passar o mouse ou tocar, tabela e "travaria" acima de 2 milhões de passos. Cores das duas séries validadas para daltonismo nos três temas (`--cor-grafico-1` e `--cor-grafico-2`).
- Validadores `passosNoMaximo` (com e sem `tamanho`) e `formaDaEstrutura` (`forma`: pilha, fila ou árvore); ações `verComoArvore` e `medirDesempenho`; checagem `estruturas-desempenho`.
- Demonstrações `f8` (pilha, fila, árvore e bolha.js) e `f9` (a lenta quadrática dispara a 125 mil passos com 500 itens; a rápida linear fica em 1.003). Testes: `estruturas.test.ts` e `testes/estruturas.mjs`.

### Etapa 5: fechamento

- Revisão de retrato e paisagem das peças novas: aviso da aba Desempenho encurtado; gráfico rola dentro da aba e árvore rola na horizontal.
- Guia: seções 26 (depurador), 27 (ordenar passos) e 28 (estruturas e desempenho); 25 aponta as demonstrações.
- Currículo: sem `requerMotor` em Resolvendo problemas u1 a u3, Depuração u2 e u3 e Estruturas de dados u3; `MOTORES_PLANEJADOS` só com `projeto-ponte-js`; MAPA-CURRICULAR atualizado.
- Verificado: 12.614 testes unitários, lint e build verdes. Bateria completa no build de produção (100 arquivos, 3 em paralelo): 99 verdes; o `ordenar.mjs paisagem` falhou porque o arrasto sintético pelo CDP soltava o dedo em movimento, o Chrome lia um "fling" e engolia o toque seguinte (no avatar do computadorzinho). O teste agora para o dedo no destino antes de soltar, como uma pessoa; reconferido nos três layouts no build de produção.

### Decisões a conferir

- `else-if` em kebab-case (não `elseIf`), seguindo os ids de sintaxe existentes.
- Ordenar passos como tipo de fase, não objetivo.
- `formaDaEstrutura` usa a chave `forma` (o `tipo` do prompt colidia com o discriminante); `passosNoMaximo` ganhou `funcao` opcional.
- O depurador é replay do rastro: até 1.000 fotos de memória; Snippet só de leitura enquanto pausado; Observar avalia numa cópia.
- A troca acende como "trocou" só quando acontece numa linha (desestruturação); com variável auxiliar são duas escritas que piscam.
- A aba se chama Desempenho, como a Performance do Chrome, com aviso de que a daqui conta passos e a do Chrome mede tempo.
- O contador mostra "Nenhum passo ainda" até a primeira execução de verdade (a abertura roda um código vazio).

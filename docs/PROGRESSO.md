# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-22.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 23: tela cheia e zona Funções

### Etapa 0: tela cheia

- Botão SVG nos cabeçalhos do mapa, da fase, revisão e glossário; no celular fica junto ao menu para acesso em um toque. Documento inteiro via Fullscreen API, estado pelo fullscreenchange, sem botão quando fullscreenEnabled é falso.
- Dica e rótulo acessível, controle durante a promessa e mensagem em caso de rejeição do navegador. Navegação interna mantém o documento e a tela cheia.
- Altura dvh e VisualViewport preservadas; fullscreenchange refaz a medida, e os insets de área segura descontam a altura disponível, inclusive com teclado.
- Verificado: 12.614 testes de conteúdo, build, lint; tela-cheia.mjs nos três layouts, alternância simulada, saída externa, falta de suporte, rejeição, navegação e API real com prévia visível; teclado simulado em retrato.
- Ambiente: Chromium 133 extraído do pacote temporário sem alterar manifesto/lockfile; o extrator padrão falhou em chown e foi substituído por descompressão local dos mesmos binários.

### Etapa 1: Criar e chamar

- U1 publicada com três fases: declarar, chamar com parênteses, moldura por chamada, desafio nas mensagens de abertura e fechamento da Loja Girassol. Revisa textos, console.log, if e for.
- Três conceitos com tema Lógica e seis itens de revisão em contextos novos; missão no Console real sem parâmetros/return, reservados à U2.
- Validação por saída exata e tipo da função nesta unidade de mensagens; funcaoPassa entra na U2, que ensina funções que devolvem valores. Nenhuma capacidade de motor faltou.
- Verificado: 12.830 testes; jornada pelo mapa nos três layouts com negativa de nome sem parênteses, entrada/sumiço da moldura e retorno ao Global; publicar:conteudo, lint e build.

### Etapa 2: Parâmetros e retorno

- U2 com quatro fases: parâmetro/argumento, return contra console.log, undefined sem return, saída antecipada por if e acumulador/for dentro de função; desafio na calculadora de frete da Loja Rota.
- Quatro conceitos com tema Lógica e oito itens de revisão; funcaoPassa com zero, negativos, decimais e fronteiras (99/100 e 199/200), combinado com resultados nas caixinhas e semErro.
- Verificado: 13.118 testes; jornadas nos três layouts com parâmetro dentro da moldura e faixa de retorno, negativas de console.log e função constante, desafio e console limpo; publicar:conteudo, lint e build.

### Etapa 3: Escopo

- U3 com quatro fases: global/local e nomes iguais, ReferenceError fora da função, let do if com moldura tracejada e contador que renascia em cada chamada. Desafio nas visitas da Exposição Marés, com o defeito no preparo e no Snippet: segunda visita em 1 antes, 2 depois.
- Quatro conceitos com tema Lógica e oito itens de revisão; funções de cálculo com funcaoPassa, contador persistente por valorVariavel e saída/semErro conforme a tarefa.
- Verificado: 13.406 testes; jornadas nos três layouts, variáveis locais dentro da moldura, variável dentro do bloco e seu desaparecimento antes do return, negativas dos escopos e do contador, meta e desafio; publicar:conteudo, lint e build.

### Etapa 4: Arrow functions

- U4 com três fases: reescrever function como arrow, retorno implícito e bloco sem return; desafio nas medidas da receita da Cozinha Aurora. Arrow com for revisa Repetição, e o desafio com if revisa Decisões.
- Três conceitos com tema Lógica e seis itens de revisão; funcaoPassa com zero, negativos e decimais, usouSintaxe arrow/return e valorVariavel/semErro. Sem listas e sem ferramentas do depurador.
- Verificado: 13.622 testes; jornadas nos três layouts com moldura, parâmetro e retorno da arrow, negativas de function no lugar de arrow e de bloco sem return, desafio e console limpo; publicar:conteudo, lint e build.

### Etapa 5: fechamento

- Zona Funções completa: 14 fases, 14 conceitos com tema Lógica e 28 itens (390 no registro), um commit por unidade; nenhum arquivo de unidade previamente publicada foi alterado.
- Tela cheia reconferida no build final: API real e navegação por fase, ilha, glossário, mundo e revisão nos três layouts, mantendo o documento em tela cheia. Insets de 20/16 px e teclado simulados; a barra em paisagem comporta o alvo de 44 px e a borda sem cortar o toque.
- Build e lint finais verdes; bateria:conteudo em produção verde (mapa, explorar, publicar, revisão). As jornadas das quatro unidades também estão registradas em testes/todos.mjs.
- ROADMAP aponta Listas e objetos como próxima zona e exige programas curtos em Depuração, dentro das primeiras 1.000 fotos do rastro. ATRITOS-FABRICA guarda a rodada curta; históricos preservados em docs/arquivo.
- Decisões: botão fora do menu no celular; saída exata para funções de mensagens da U1; contador global entre chamadas na U3, sem antecipar closures. Não houve mudança no executor nem nos validadores.
- Limite da verificação: Chromium 133 em ambiente headless; teclado e áreas seguras simulados, sem dispositivo físico ou Safari de iPhone.

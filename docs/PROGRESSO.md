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

# Progresso: rodada 14 (arquivada)

## Rodada 14: Revisão do dia e o motor da zona "Ser encontrado"

Um commit por etapa. Testes em camadas (unitários e o que mudou durante,
os três layouts no fim de cada etapa, a bateria completa uma vez no fim).

### Etapa 1: zona opcional e o registro de "Ser encontrado"

- `ZonaCurriculo.opcional`: `ilhaCompleta` e `zonaAberta` ignoram as
  zonas opcionais (`zonasObrigatorias`, `unidadesObrigatoriasDaIlha`); o
  "Completa!" do mundo conta só as obrigatórias; plaquinha "Opcional" na
  ilha; as lentes contam tudo.
- Zona `ser-encontrado` (S1 a S5) no fim da Ilha Sites, no currículo e no
  `MAPA-CURRICULAR.md` (com a filosofia: o que o programador faz e os
  conceitos que não envelhecem; o passo a passo das plataformas num
  arquivo de dados com data). Ícone de zona "busca".
- Tema **Presença digital** (12 temas), com ícone e a justificativa no
  `PROJETO.md`; peso 1 no Front-end e no Dados.
- `src/conteudo/plataformas-marketing.ts`: o tipo, a lista vazia,
  `rotuloConferido` e a checagem (ids, data, passos).

### Etapa 2: itens de revisão, agendador e estado

- `ItemRevisao` (tipos), registro em `src/conteudo/revisao/`,
  `faseDoItem` (o item vira a fase de um objetivo sozinho; ferramentas
  derivadas das ações e dos validadores), `conferirItensDeRevisao`
  (conceito ensinado, 2 variações, tipo coerente, site diferente das
  fases) e `checarItensDeRevisao` (as regras de fase em cada item).
  Congelamento dos ids (`publicados.json`, `itensRevisao`).
- Agendador puro em `src/lib/revisao.ts` (estado e dias em
  `src/lib/estadoRevisao.ts`, sem imports de conteúdo): 1, 3, 7, 21 e 60
  dias; entrada 1 dia depois da fase; reinício com solução ou Rever
  (estrelas abaixo de 3 como aproximação da ajuda); sem ajuda sobe, com
  ajuda (pergunta ou dica) mantém, errou ou "Não lembrei" volta para 1
  dia; treino livre com efeito menor; sessão de até 5 misturando ilhas;
  sequência de dias; dias pelo calendário local.
- `Progresso.revisao` com leitura segura (progresso antigo nasce vazio e
  é sincronizado no mapa); a fase concluída registra os conceitos.
  `Objetivo.conceitos` opcional. `ferramentaDaAcao` num módulo próprio.
- Testes com relógio falso (`testes/conteudo/revisao.test.ts`).

### Etapa 3: sessão, Porto e resumo

- Modo de jogo `revisao-dia` (sem salvar, sem estrelas, sem
  apresentações, direto no objetivo, "Não lembrei", "Próximo" no fim).
  Tutor: fases `revisao-*` sempre no modo sozinho.
- `/revisao` (`TelaRevisao`, `ResumoRevisao`): início com a contagem,
  "Nada pra revisar hoje" e o Treino livre; o resultado de cada item vai
  já para o progresso; resumo com quando volta, "Rever onde aprendi" e a
  sequência sem culpa.
- Porto da revisão (`ArtePorto`, SVG só com tokens) no mundo, depois do
  primeiro conceito aprendido com item, com "N hoje" ou "Em dia".
- 30 itens-modelo da U1 e da U2, com comentários pedagógicos.
- `testes/revisao.mjs` nos três layouts.

### Etapa 4: Resultado na busca e Teste de dados estruturados

- `src/motor/busca.ts`: corte aproximado por largura (tabela de larguras
  Arial calibrada nas referências de 2026-09: uns 580 px no título, 920
  px na descrição do computador, 680 no celular), título e descrição
  inventados, noindex/none, leitor de JSON próprio com linha e coluna,
  LocalBusiness e subtipos (name e address obrigatórios, conferidos na
  documentação do Google por busca; developers.google.com e schema.org
  estavam bloqueados na rede daqui), cartão do negócio.
- Aba Busca (abas que não são do Chrome só aparecem nas fases que as
  usam: `soQuandoLivre`), ferramentas `resultado-busca` e
  `dados-estruturados`, validadores `resultadoBusca`, `indexavel`,
  `dadosEstruturados`. Bancada da Busca (`lab-motor-u1-f6`).
- `testes/busca.mjs` nos três layouts.

### Etapa 5: Medição e simulador de campanha

- `src/motor/medicao.ts` e a aba Medição (relatório em tempo real
  simulado, construtor de link rastreável, visita simulada), com o clique
  de verdade na prévia (`aoClicarElemento`). Validadores `eventoMedido` e
  `linkRastreavel`; ações `clicarNaPrevia` e `simularVisita`.
- `src/motor/campanha.ts` e a aba Campanha (leilão animado, dia
  simulado). Tipo de fase `simulador-campanha`, com o helper
  `temObjetivos` no lugar dos `tipo === "pratica"` que queriam dizer
  "tem objetivos". Validador `simulacao`, ação `configurarCampanha`.
- Demonstração em `/lab/fases?fase=lab-motor-u1-f7` (medição, link, 1º
  lugar comprado caro, a página melhorada, menos lance e mais clientes).
- `testes/campanha.mjs` nos três layouts.

### Etapa 6: S1 publicada, guia e docs

- **S1 "Como o Google acha seu site"** (`sites-ser-encontrado-u1`):
  Ateliê Linha Fina (rastreamento, indexação, title), Floricultura Jardim
  Suspenso (meta description e o corte), Escola de Dança Passo Leve
  (noindex) e o desafio na Casa de Farinha Seu Dito. 5 conceitos novos no
  tema Presença digital. 10 itens de revisão da S1 (modelo com mini-sites
  no modo documento: `ItemRevisao.modoDocumento`). Publicada.
- `testes/ser-encontrado.mjs` (pelo mapa, nos três layouts): Sites
  completa sem a zona opcional, a plaquinha, a Fase 1 inteira e o
  desafio.
- Guia: seções 19 a 24. `publicar:conteudo` com tempo maior (as
  checagens dos itens passam de 5 s).

### Decisões a conferir

- "Com ajuda" conta qualquer degrau do Me ajuda (pergunta ou dica).
- A ajuda pesada de uma fase é aproximada pelas estrelas (menos de 3).
- Treino livre: acertar não sobe o nível; errar só traz para amanhã.
- As abas Busca, Medição e Campanha não existem no Chrome: só aparecem
  nas fases que as usam, com a explicação no "No F12 de verdade".

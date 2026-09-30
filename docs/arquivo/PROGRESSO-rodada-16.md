# Progresso: rodada 16 (arquivo)

## Rodada 16: a zona "Ser encontrado" (S2 a S5), a checagem de posição e o `/lab/revisao`

Um commit por etapa. Prompt só de conteúdo: nenhum motor mudou (só uma lista de
dados em `busca.ts` e uma frase do painel Campanha), então sem bateria
completa; no fim, `bateria:conteudo` (verde).

### Etapa 0

- **Checagem `posicao-da-correta`** (`src/conteudo/checagens.ts`): 2 ou mais
  previsões da mesma unidade, ou do mesmo conceito nos itens de revisão, com a
  mesma `correta` falham. Pegou 11 unidades e 1 conceito (rastreamento): as 15
  previsões giradas e a S1 mexeram só na ordem das opções e no
  `responderPrevisao` (ids e conteúdo intactos). Teste de sabotagem em
  `checagens.test.ts`.
- **`/lab/revisao`** (`src/componentes/lab/LabRevisao.tsx`): lista os itens por
  zona e conceito e abre qualquer um direto (`?item=<id>`), com o motor da
  revisão do dia e sem mexer no progresso. `testes/lab-revisao.mjs` nos três
  layouts.

### Etapas 1 a 4: as unidades

| Unidade | Fases | Desafio (site novo) | Conceitos novos | Itens |
| --- | --- | --- | --- | --- |
| S2 SEO na página | h1; texto e enchimento; links e alt; velocidade | Casa de Chá Lótus | 6 | 12 |
| S3 Seu negócio no mapa | dados iguais e perfil; avaliações; JSON-LD; subtipos | Padaria Pão de Mel | 5 | 10 |
| S4 Medir quem chega | eventos e conversão; Search Console; utm | Casa de Sucos Vitamina | 5 | 10 |
| S5 Anúncio pago por dentro | leilão; verba e palavras; página de destino | Desafio (a última fase do simulador): Pet Shop Rabo Feliz | 6 | 12 |

- Por unidade: `testar:conteudo` verde, jornada da unidade pelo mapa nos três
  layouts (`testes/ser-encontrado-zona.mjs`), `publicar:conteudo`, build, lint
  e commit. Registro de itens: 258 (214 + 44).
- **Plataformas** (`src/conteudo/plataformas-marketing.ts`): perfil da empresa,
  schema.org (subtipos e campos), Search Console e Google Ads, todos com
  `verificadoEm: "2026-09-30"`, `fatos`, `fontes` e `usadaEm`. O tipo ganhou
  `fatos` e `fontes` (o campo de data segue se chamando `verificadoEm`).
  Regra `conferido-em-nas-fases`: a unidade que cita a plataforma mostra
  "conferido em 30/09/2026" em uma fala ou na missão de campo, e nenhuma fase
  mostra data que o arquivo não tem.
- **S3, subtipos:** a lista `TIPOS_DE_NEGOCIO_LOCAL` não tinha os subtipos do ANEXO
  FastFoodRestaurant, NailSalon, DaySpa, TattooParlor,
  HomeAndConstructionBusiness, Plumber, Electrician, RoofingContractor,
  HousePainter, AutoWash, AutoDealer, LegalService e RealEstateAgent. A S3 usa
  o Plumber (e o IceCreamShop e o Bakery, que já estavam); entraram todos,
  com teste que trava a lista contra o arquivo. Ficaram os três que já existiam
  fora do ANEXO (BookStore, GroceryStore, ProfessionalService).
- **S4:** Analytics e Search Console são conceitos (sem nomes de menu); a
  Medição é simulada e a fase diz isso; utm_source, utm_medium e utm_campaign
  em links do jogo.
- **S5:** a simplificação (lance vezes qualidade) é dita na introdução, na
  previsão e na conclusão; o que o Google considera vem do arquivo
  (`google-ads`); o Índice de qualidade só aparece como diagnóstico, em três
  partes, e a "qualidade" da tela é chamada de "do simulador". A lição central
  (página melhor barateia o cliente) sai dos números do motor: com a página
  fraca o cliente custa uns R$ 66; com title e descrição, uns R$ 22; com o alt
  da foto, uns R$ 18 (os limites de cada objetivo estão conferidos pelo
  `testar:conteudo`). O painel Campanha
  deixou de dizer que a posição sai de lance vezes qualidade sem ressalva.
- **Testes de navegador:** `ser-encontrado-zona.mjs [layout] [unidade]`, com a
  tabela de passos em `ser-encontrado-passos.mjs` (previsões, Me ajuda até a
  solução, editor de código, clique na prévia, construtor de link, campanha,
  Lighthouse). Detalhes que custaram tentativa: `ATRITOS-FABRICA.md`, rodada 7.

### Decisões a conferir

- A S5 não tem desafio do tipo `desafio` (os validadores `simulacao` só existem
  no simulador): a última fase é o desafio, só de sozinho, e a unidade fica
  sem meta com antes e depois.
- Não há tela que liste os passos das plataformas: as fases carregam o
  caminho geral em falas e o "conferido em" (com regra no `testar:conteudo`).
- Textos livres (h1, resposta a avaliação, texto que responde) só conferem que
  mudaram; o comentário de cada fase diz isso.
- O campo da data das plataformas continua `verificadoEm` (o prompt dizia
  `conferidoEm`): mudar o nome quebraria o guia e a regra sem ganho.
- Afirmações fora do ANEXO, só de linguagem: JSON com erro "não consegue ler o
  bloco", avaliação comprada "é falsa e queima a confiança", loading lazy
  (HTML padrão). Nenhum nome de menu ou passo de plataforma veio de memória.
- Os tipos de correspondência de palavra-chave aparecem só pelos nomes (ampla,
  de frase e exata), como no ANEXO, sem definição de memória.

### Riscos

- A jornada por unidade usa o editor de código para os "sozinho" (o gesto
  fino de cada peça, como o menu do nó, está coberto pelas jornadas das
  unidades antigas e pelas soluções do `testar:conteudo`).
- Os números do simulador foram conferidos com o motor, mas dependem dele:
  se o modelo de `campanha.ts` mudar, as 4 fases da S5 podem acusar.

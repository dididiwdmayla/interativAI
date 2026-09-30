# Progresso: rodada 15 (arquivada)

## Rodada 15: itens de revisão de U3 a P2 e a `bateria:conteudo`

Um commit por etapa. Prompt só de conteúdo: nenhum motor mudou, então sem
bateria completa (só `bateria:conteudo`, no fim).

### Etapa 0: `npm run bateria:conteudo`

- `testes/conteudo-navegador.mjs`: mapa, explorar (lentes, trilhas,
  glossário), publicar (o fim da ilha) e revisão, só no desktop, com
  `RESUMO=1` e uma linha por arquivo (a falha mostra o começo do erro).
  Avisa e sai com código 2 se o jogo não estiver no ar. Rodou verde
  (cerca de 2 minutos).
- `CLAUDE.md` (economia de cota) e `testes/README.md` atualizados.

### Etapas 1 a 4: os itens

- 87 conceitos ensinados por U3 a P2, 2 itens cada (uma ação e uma
  previsão, com a exceção dos que só têm previsão: `salvar-como-meu-tema`
  e `index-html`), cada um num mini-site próprio e diferente dos das
  fases: Elementos (U3 a U6, 20 conceitos), Estilos (E1 a E5, 31),
  Layout (L1 a L4, 22) e Responsivo e Publicar (R1, R2, P1 e P2, 14).
  Total do registro agora: 214 itens (com os 40 dos modelos).
- Um arquivo por conceito em `src/conteudo/revisao/`, com o comentário do
  porquê no topo, registrados no `index.ts`. `HEAD_CSS` em
  `sites/estilos.ts` (head mínimo dos itens com CSS editável).
- Itens de Elementos com o modo documento (U6), de Estilos e Layout com
  `css` (painel Estilos), de R1 com `dispositivo` e de P1 com o Lighthouse.
  Imagens sempre em `data:` (atrito 2).
- `testes/revisao-zonas.mjs [layout] [zona]`: semeia o progresso com as
  fases publicadas e os conceitos de uma zona vencidos, abre uma sessão
  por grupo de 5 e percorre cada item (previsão respondida ou "Não
  lembrei"), com console limpo. A solução de cada item já é conferida no
  `testar:conteudo`.
- Cada zona: `testar:conteudo` verde, sessão de revisão no desktop,
  `publicar:conteudo` (ids congelados) e commit.

### Decisões a conferir

- A resposta certa das previsões foi girada por posição (atrito 1).
- Os itens de `salvar-como-meu-tema` e `index-html` são só previsões.
- Cada mini-site é novo, mas a lista de negócios (padarias, clínicas,
  lojas) é curta; a checagem só compara com os sites das fases.

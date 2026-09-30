# Atritos da fábrica

Registro de coisas concretas que foram ambíguas, faltaram ou que o
`testar:conteudo` deveria ter pego e não pegou, ao produzir conteúdo
seguindo `docs/GUIA-DE-CONTEUDO.md` e `docs/TEMPLATE-FASE.ts`. Regra de
economia de cota (`CLAUDE.md`): este arquivo guarda só a rodada mais
recente; as antigas ficam em `docs/arquivo/`.

**Resumo das rodadas 1 a 5:** o primeiro teste de produção em massa da
fábrica (Unidade 1), a Unidade 6, a zona Estilos completa, a causa raiz
da instabilidade da bateria no celular e a zona Layout completa (L1 a
L4), com a jornada de teste isolada por zona (`UNIDADE=<id>`), e a Ilha
Sites completa (E5, R1, R2 e P1). Detalhe em
`docs/arquivo/ATRITOS-FABRICA-rodadas-1-a-3.md`,
`docs/arquivo/ATRITOS-FABRICA-rodada-4.md` e
`docs/arquivo/ATRITOS-FABRICA-rodada-5.md`.

## Rodada 6: itens de revisão de U3 a P2

87 conceitos, 174 itens (2 por conceito), em quatro zonas. Passou no
`testar:conteudo` quase de primeira (uma falha por zona, no máximo); os
atritos foram de outro tipo.

### 1. Nada acusa a resposta certa sempre na mesma posição

Ao escrever previsões em volume, a tendência é pôr a resposta certa
primeiro (`correta: 0`). Nenhuma checagem olha isso, nem nas fases nem nos
itens: o jogador que "escolhe a primeira" acertaria tudo. Nesta rodada os
itens foram escritos com a certa primeiro e um gerador local girou as
opções (a posição da certa passa por todas). **O que ajudaria:** uma
checagem que acuse, por unidade ou por lote de itens, mais de metade das
previsões com a mesma `correta`. Fica em "Pendências".

### 2. Mini-site com `<img src="foto.jpg">` derruba o teste de navegador

O arquivo não existe, o iframe pede e o console registra um 404, que
`errosRelevantes` conta. Os sites das fases usam imagem em `data:` (SVG de
um retângulo colorido). Vale dizer na seção 19 do guia: imagem de item de
revisão é sempre `data:`.

### 3. Conceito que só existe na maquete do jogo não tem item de ação

`salvar-como-meu-tema` precisa de `SITE_ALVO_DO_JOGO`, que `ItemRevisao`
não aceita, e `temaSalvo` é conferido só nesse site. Os dois itens viraram
previsões. O mesmo vale para `index-html`, que não tem gesto no jogo (o
`.zip` é o do Levar pro mundo, coberto no `publicar-site`): dois itens de
previsão, com o comentário no arquivo.

### 4. Detalhes de ação e validador que custaram uma tentativa

- `selecionar` com `:root` acusa "achou algo fora do body": para variável
  no `:root`, a solução é só `definirPropriedade` (como nas fases da E5).
- `valorEfetivo` não conhece `grid-template-areas`; o validador é
  `declaracao` (a fase L3-F3 já dizia; o guia, na 12.2, não).
- Itens com CSS só ganham o painel Estilos (não o Calculado), então os de
  modelo de caixa se resolvem só pelas propriedades.

### 5. Volume: 174 itens não cabem em edição à mão sem gerador

Os arquivos por conceito (`src/conteudo/revisao/<conceito>.ts`, no padrão
dos modelos) foram gerados por um script local a partir de uma lista
compacta, para não repetir 90 vezes a mesma moldura. O script não entrou
no repositório (só o resultado, que é o que o `testar:conteudo` confere).
Se a S2 a S5 e os itens de outras ilhas seguirem esse volume, vale
promover um gerador à fábrica.

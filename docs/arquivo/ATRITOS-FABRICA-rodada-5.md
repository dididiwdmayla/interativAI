# Atritos da fábrica: rodada 5 (arquivada)

## Rodada 5: E5, R1, R2 e P1 (a Ilha Sites fica completa)

Produção das quatro últimas unidades da Ilha Sites num prompt só, cada
uma com motor pronto desde a Rodada 12.

### 1. `alvo: "css"` em `ajudas.linha` exige `seletorRegra`; um texto de `@media` ali não é seletor válido

Ao escrever a primeira fase de R2 (`@media`), o primeiro rascunho
apontava a linha de ajuda para `{ alvo: "css", seletorRegra: "@media
(max-width: 600px)", ... }`, tentando indicar o BLOCO inteiro. O tipo
`LinhaAjuda` (seção 3.7 do guia) exige um seletor de REGRA de verdade
(`.cabecalho`, não a condição do `@media`), e a checagem de "seletores
são CSS válido" acusa. Corrigido apontando para o seletor da regra de
dentro do bloco (`.cabecalho`), com a fala explicando o `@media` por
cima. Um objetivo sem `seletorRegra` nenhum (só `{ alvo: "css", fala }`)
também não passa: o campo é obrigatório para esse `alvo`, sem exceção.

**O que ajudaria:** um exemplo de `linha` para objetivo de `@media` na
seção 12.8 do guia, mostrando que o alvo é sempre a regra de dentro, não
a condição.

### 2. `ajudas.linha` sem valor em objetivo guiado: erro genérico, não uma mensagem de checagem

Esquecer `ajudas.linha` (ou deixar `ajudas.solucao` fora) num objetivo
`modo: "guiado"` não gera a mensagem clara "objetivo guiado precisa de
`ajudas.linha`" na hora — ela existe (`checagens.ts`), mas OUTRAS
checagens que leem `objetivo.ajudas.linha.alvo` direto (sem checar
`modo` primeiro) rodam antes e quebram com `Cannot read properties of
undefined`, um erro de JavaScript cru, não uma mensagem de conteúdo.
Aconteceu duas vezes (E5-F2 e E5-F3) ao copiar um objetivo sozinho como
base e esquecer de completar as `ajudas` ao trocá-lo para guiado.

**O que ajudaria:** nenhuma mudança de conteúdo — é uma melhoria de
motor (ordenar as checagens para a de "guiado precisa de linha" rodar
antes das que leem o valor dela), registrada aqui em vez de
"consertada", porque esta rodada é só de conteúdo (regra de parada).

### 3. Id de conceito não é o mesmo que id de ferramenta

`revisa`/`prerequisitos`/`pratica` usam ids do catálogo de CONCEITOS
(`src/conteudo/conceitos.ts`), não ids de FERRAMENTAS
(`src/ferramentas/ids.ts`) — mas alguns nomes coincidem na cabeça de
quem escreve ("seletor de cor" é uma ferramenta E um jeito de escolher
cor, mas só a ferramenta tem id; não existe o conceito
`seletor-de-cor`). Aconteceu na E5-F1 (`revisa: [...,
"seletor-de-cor"]`): a checagem "conceitos existem no catálogo" acusa
direto, com o nome exato que faltou — rápido de corrigir, mas vale o
registro porque se repetiu (tentei de novo com `editar-valor-css` na
R1-F2).

### 4. Parte de desafio com `solucaoDeTeste: []` nunca passa "na sua vez"

Uma parte cujo validador já fica satisfeito pelas AÇÕES de partes
anteriores (por exemplo, um `cabeNaTela` final depois de três correções
de largura) não pode ter `solucaoDeTeste: []`: a checagem "as soluções
cumprem cada parte na hora certa" acusa "já estava marcada antes da
própria solução", porque ela conta como sempre pronta demais cedo, e a
ORDEM das partes vira ambígua para quem joga (qual delas o jogador
"resolveu" de fato?). Removido o validador resumo redundante na R1-F3 em
vez de forçar uma solução vazia.

### 5. Duas partes de desafio com a MESMA `solucaoDeTeste` colidem

Parecido com o item 4: se duas partes usam exatamente a mesma ação como
solução (por exemplo, "acrescentar uma `@media`" e "o cabeçalho empilha
no celular", quando o jeito de fazer as duas é o mesmo bloco de CSS), a
segunda parte já passa quando a primeira roda, e a checagem acusa. Em
vez de inventar uma ação diferente artificial, a R2-F3 fundiu as duas
num `todos` (uma parte só, com dois validadores).

### 6. `revisarEm` só pode apontar para uma fase da MESMA unidade

O tipo (`ParteDesafio.revisarEm`) já documenta isso, mas vale reforçar
na prática: um desafio não pode revisitar uma fase de uma unidade
ANTERIOR (mesmo que a habilidade tenha sido ensinada lá) — só fases da
própria unidade, que têm pelo menos um objetivo guiado. Isso empurrou a
R1 a ensinar de forma guiada, na própria Fase 2, o conserto de uma peça
com largura fixa maior que a tela (ainda que como objetivo "sozinho"),
só para o desafio poder ter uma parte parecida com um "Rever" que faça
sentido.

### 7. `/lab/fases`, "Aplicar solução do objetivo atual" e desafios: o checklist não atualiza sozinho depois de uma ação sintética

Reproduzido também numa unidade antiga e publicada (U6-F3, "Marcos
Conserta Bikes"), então NÃO é um bug desta rodada: aplicar a solução de
uma parte de um DESAFIO pelo botão do Lab (sem nenhuma interação real de
UI entre um clique e outro) deixa `data-feita` da parte em `false`
mesmo com o validador já passando — um clique qualquer na árvore
(mudando a seleção) destrava o recálculo. `testar:conteudo` não é afetado
(ele usa o motor direto, sem esse botão), e o jogo real também não (o
jogador sempre interage com alguma coisa entre uma ação e outra). Só
atrapalha quem usa o Lab para conferir um desafio rodando "Aplicar
solução" em sequência rápida sem clicar em nada entre elas — registrado
aqui para não confundir quem vir isso numa unidade futura.

### 8. Unidade nova pode não ter nenhum conceito de algum tema que o currículo já declarava

`curriculo.ts` já trazia `temas: ["acessibilidade", "desempenho",
"ferramentas"]` para a P1, escrito antes do conteúdo existir. Como a P1
acabou não ensinando nada de desempenho (~~performance~~; ficou só
acessibilidade e a ferramenta Lighthouse), a checagem "os temas
declarados batem com os dos conceitos" acusou. Corrigido tirando
`"desempenho"` da declaração — o `MAPA-CURRICULAR.md` e o `curriculo.ts`
descrevem a INTENÇÃO antes de escrever; o conteúdo de verdade é que
decide os temas finais.

### 9. Tema de insígnia esperando 100% das unidades de Sites: um conceito sem aquele tema quebra a conta

`temas.test.ts` tem um teste que espera "toda unidade de Sites soma para
a insígnia Interfaces" (todas as 19, até agora, tocavam CSS/HTML de
alguma forma). A P1 é a primeira cujo foco central é auditoria, não
interface — sem nenhum conceito com o tema `interfaces`, ela ficou de
fora da conta, e o teste (que deriva o total das próprias `UNIDADES`,
não um número fixo) acusou a diferença. Corrigido acrescentando o tema
`interfaces` (além de `acessibilidade`) ao conceito `rotulo-acessivel`
— um rótulo de link/botão também é, de fato, uma decisão de interface,
então o ajuste é honesto, não só para passar no teste.

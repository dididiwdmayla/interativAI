# Progresso

Detalhe de cada rodada (etapas, decisões, testes). Regra de economia de
cota (`CLAUDE.md`): este arquivo guarda só a rodada mais recente; as
antigas ficam em `docs/arquivo/`. Status consolidado: `docs/ROADMAP.md`
(fonte única).

**Resumo das rodadas 1 a 18:** a fábrica de conteúdo declarativo e o
`testar:conteudo`; o congelamento (`publicar:conteudo`); o painel Estilos
dentro de Elementos com o motor de cascata próprio (especificidade,
`!important`, herança, atalhos, variáveis CSS e `@media`); o modo
documento; a camada de trilhas, temas, profissões, glossário e áudio; a
estabilidade da bateria nos três layouts; as zonas Elementos (U1 a U6),
Estilos E1 a E4 e Layout (L1 a L4) completas; e os motores que faltavam
para fechar a Ilha Sites (E5/Meu tema, modo dispositivo, painel
Lighthouse, projeto-ponte, Levar pro mundo) com a P2 como unidade-modelo;
a Ilha Sites completa (E5, R1, R2 e P1); e a Revisão do dia com a zona
opcional Ser encontrado (S1), a aba Busca, a Medição e o simulador de
campanha; os itens de revisão de U3 a P2 (174 itens) com a
`bateria:conteudo`; e a zona Ser encontrado (S2 a S5) com o `/lab/revisao`;
o executor, Console, palco da memória, circuito
lógico e a unidade-modelo da Ilha Lógica; e as correções de Console, relógio, sorteio, apresentação, circuito e jornadas da rodada 18. Detalhe em
`docs/arquivo/PROGRESSO-rodadas-1-a-11.md`,
`docs/arquivo/PROGRESSO-rodada-12.md`,
`docs/arquivo/PROGRESSO-rodada-13.md`,
`docs/arquivo/PROGRESSO-rodada-14.md`,
`docs/arquivo/PROGRESSO-rodada-15.md`,
`docs/arquivo/PROGRESSO-rodada-16.md` e
`docs/arquivo/PROGRESSO-rodada-17.md` e
`docs/arquivo/PROGRESSO-rodada-18.md`.

## Rodada 19: zona Primeiros comandos

### Etapa 0

- Base: `claude/intelligent-pascal-5va93x` (`3c4fbb0`); branch `codex/logica-primeiros-comandos`.
- AGENTS e CLAUDE registram a branch principal e o formato obrigatório do relatório final.
- Alteração documental; nenhuma mudança no motor ou conteúdo publicado.

### U2: Textos

- Cinco fases: aspas e erro real, junção e espaço, template, tamanho e saída, desafio na floricultura.
- Seis conceitos novos com temas e doze itens de revisão (ação e previsão), em situações próprias.
- Cada habilidade tem prática guiada e sozinha na mesma fase; variáveis e undefined entram em revisa.
- Validação por resultados; sintaxe só para crases/template, que são a habilidade pedida.
- `testar:conteudo`: checagens da U2 verdes após corrigir o comprimento da confirmação para 39.
- Jornada pelo mapa verde em desktop, retrato e paisagem, incluindo negativas (sem espaço; concatenação no lugar de template), meta e desafio; console limpo.
- `publicar:conteudo`, build e lint verdes. IDs congelados junto com a unidade.

### U3: Tipos

- Seis fases: tipos e typeof; guardar versus comparar; coerção do +, * e -; Number e String; comentários; desafio da gorjeta num café.
- Sete conceitos novos com temas e quatorze itens de revisão. As cinco categorias aparecem no palco; typeof null é explicado como peculiaridade histórica.
- Introdução mínima ao === nesta unidade, para atender à confusão explicitamente pedida no prompt; valor/tipo e ausência de alteração da variável são conferidos. A zona Decisões aprofunda comparações.
- Comentário explicativo não altera a expressão; comentar código executável pode alterar o resultado, pois desativa esse trecho. A linha do tempo mostra a soma e ignora a linha comentada.
- `testar:conteudo`: 33 arquivos, 9.035 testes verdes (inclui U2 e os 26 novos itens de revisão).
- Jornada pelo mapa verde em desktop, retrato e paisagem, com tipos no palco, negativa de soma textual, meta, desafio e linha do tempo; console limpo.
- `publicar:conteudo`, build e lint verdes; IDs congelados junto com a unidade. Sem alteração de motor ou dependências.

### Fechamento

- `npm run bateria:conteudo`, uma vez no build de produção: mapa, explorar, publicar e revisão verdes. Sem bateria de motor, conforme economia de cota.
- ROADMAP marca a zona Primeiros comandos completa; Próximo: zona Decisões, depois Opus: Ilha Lógica, parte B. Currículo documental marca U2/U3 prontas.
- Rodada curta no ATRITOS; rodadas anteriores de ATRITOS e PROGRESSO arquivadas.
- Limitação concreta: jornadas em Chromium 133, porque o download do navegador atual chegou vazio.
- PR para `claude/intelligent-pascal-5va93x`; nenhuma escrita na branch principal.

# Atritos da fábrica

Rodada anterior: `docs/arquivo/ATRITOS-FABRICA-rodada-10.md`.

## Rodada 11: zona Funções

- U1 ensina funções de mensagens sem retorno: saída exata e typeof separam declarar, ler o nome e chamar. funcaoPassa é principal a partir da U2, para validar o valor devolvido em vários casos.
- Undefined sem return é observado na caixinha e conferido por typeof, sem tratá-lo como mensagem impressa. As negativas garantem que console.log não substitui return.
- Escopo exige ver o caminho: as jornadas rebobinam pelas molduras, leem parâmetros/locais, conferem a faixa de retorno e a variável do bloco sumindo antes de devolver.
- Estado entre chamadas usa um contador global, sem listas nem closures. O desafio traz o defeito no preparo e no Snippet, para o antes/depois mostrar a segunda visita em 1 e 2.
- Revisões: ação em contexto novo e previsão conceitual autossuficiente por conceito, sem pedir código que só estaria escondido na solução de teste.
- Tela cheia: alvo de 44 px pede barra de pelo menos 46 px com borda em paisagem; a altura do app desconta os insets também no VisualViewport. O navegador determina o estado real.
- Nenhuma capacidade faltou no motor. Não foram usadas listas nem ferramentas do depurador.

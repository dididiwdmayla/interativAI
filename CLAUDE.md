Antes de qualquer tarefa, leia `docs/PROJETO.md` (visão, regras, arquitetura),
`docs/ROADMAP.md` (status: feito, em andamento, próximo) e `docs/PROGRESSO.md`
(o detalhe de cada rodada). Todo trabalho termina atualizando a seção Status do
`docs/ROADMAP.md`.

## Economia de cota (vale pra toda sessão)
- Leia só os docs e as seções que o prompt indicar. Do PROGRESSO e do ATRITOS, só a rodada mais recente; as antigas ficam em docs/arquivo/.
- Testes em camadas:
  - durante o trabalho: unitários, testar:conteudo e só o teste do que mudou, em um layout;
  - no fim de cada etapa ou unidade: o que mudou, nos três layouts;
  - bateria completa: uma vez no fim do prompt, e só em prompts que mexem no motor; prompts só de conteúdo não rodam a bateria completa, mas rodam `npm run bateria:conteudo` uma vez no fim;
  - depois de corrigir uma falha: rode só o teste que falhou e os que tocam o código alterado;
  - bateria:repetir só pra investigar instabilidade.
- Se o prompt alterar qualquer coisa numa unidade já publicada, inclusive a ordem das opções, rode as jornadas dessas unidades.
- Saída de teste resumida (resumo e falhas). Não leia logs inteiros.
- Screenshots só pra investigar um problema visual concreto.
- Comando longo: espere com um único comando de espera em vez de consultar o andamento várias vezes.
- Achados fora do escopo (ajuste visual pequeno, melhoria): registre em "Pendências" no ROADMAP. Corrija na hora só o que quebra teste ou funcionalidade.
- Relatório final curto: o que foi feito, decisões a conferir e riscos. Sem narrar o processo.

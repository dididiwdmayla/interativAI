# Progresso

Rodada anterior: `docs/arquivo/PROGRESSO-rodada-24.md`. Status consolidado: `docs/ROADMAP.md`.

## Rodada 25: diagnóstico da zona Resolvendo problemas

- Branch `conteudo/resolvendo-problemas`, criada a partir de
  `claude/intelligent-pascal-5va93x`. Leitura das instruções, Status e
  Pendências, guia (25 a 28, revisão e temas), currículo e modelos do
  `/lab` e de Listas e objetos.
- A produção parou antes da U1, pela regra explícita do prompt: falta o
  desafio que permita agrupar/decompor, ordenar o plano e escrever o código
  testado, no mesmo contexto, com checklist e Rever. O quadro atual só
  existe em fases com objetivos sequenciais; não equivale ao desafio pedido.
- Evidência: `FaseDesafio` em `src/conteudo/tipos.ts` só oferece o campo
  adicional `circuito`. `useOrdenar` e `criarSimulacao` só carregam `ordenar`
  quando `fase.tipo === "ordenar-passos"`. A regra `ordenar-passos` da
  fábrica recusa validadores e ações de plano num desafio e recusa Snippet
  numa fase de quadro. Não é só uma limitação de TypeScript.
- Reprodução temporária pela própria regra da fábrica, removida após o
  diagnóstico: um desafio com `ordemValida` e `porPasso` devolveu
  `parte "plano": o validador ordemValida só vale numa fase ordenar-passos`
  e `parte "plano" solucaoDeTeste: a ação porPasso só vale numa fase ordenar-passos`.
  Acrescentar Snippet à demonstração de plano executável devolveu
  `fase de ordenar passos não tem Snippet (o plano é o programa)`.
  Os dois diagnósticos e os oito testes existentes de ordenar passaram.
- `testar:conteudo`: 14.822 testes verdes, inclusive estruturas, sem timeout.
  Build e lint verdes. `bateria:conteudo` em produção verde: mapa,
  exploração, publicação e revisão, no desktop.
  Nenhuma unidade nova, conceito, revisão ou publicação; nenhum motor,
  dependência ou conteúdo congelado alterado. Jornadas de unidades novas
  e `publicar:conteudo` não se aplicam porque a produção foi interrompida.
- Próximo passo: implementar a capacidade listada em Pendências antes de
  retomar U1 Decompor um problema, U2 Pseudocódigo, U3 Ordenar os passos e
  U4 Testar com exemplos, uma por commit. Algoritmos essenciais vem depois
  da conclusão da zona, não antes.

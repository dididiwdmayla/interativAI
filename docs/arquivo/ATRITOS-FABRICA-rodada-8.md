# Atritos da fábrica: rodada 8 (arquivada)

## Rodada 8: Primeiros comandos U2 e U3

- **Contagem de texto:** a confirmação do desafio da U2 foi contada incorretamente como 37. A solução executada devolveu 39 e o teste acusou; o validador foi corrigido antes de publicar.
- **Limite entre unidades:** o mapa introduz comparações em Decisões, mas o prompt pediu atacar `=` versus `===`. U3 apresenta apenas valor/tipo e a diferença entre guardar e comparar; o conceito pode ser revisado pela próxima zona.
- **Tipos e comentários:** `typeof null` responde `"object"`, embora o palco mostre null. A fala explica a peculiaridade histórica. Um comentário explicativo não muda a conta, mas comentar código executável desativa esse trecho; os exemplos e a linha do tempo distinguem os casos.
- **Ambiente:** `npm ci` funcionou. O Playwright atual pediu outro caminho de navegador; `npx playwright install chromium` recebeu ZIP de 0 MiB e falhou com `End of central directory record signature not found`. Usado o Chromium 133.0.6943.0 já disponível, ligado ao caminho esperado, sem mudar manifesto ou lockfile. Servidor e testes rodaram na mesma invocação por causa da rede isolada.
- **Produção:** dados gerados por script temporário fora do repositório e conferidos pelo motor e pelas jornadas; nenhuma extensão do motor foi necessária. Publicação dos commits pelo conector GitHub, conferindo a igualdade de cada árvore com a local.

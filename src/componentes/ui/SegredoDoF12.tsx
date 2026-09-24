/**
 * Easter egg: só aparece para quem abre o F12 no próprio jogo.
 * Um comentário HTML e um elemento escondido com data-segredo.
 */
export function SegredoDoF12() {
  return (
    <div
      hidden
      aria-hidden="true"
      data-segredo="Você me achou pelo F12! Digite a palavra curioso no campo do computadorzinho."
      dangerouslySetInnerHTML={{
        __html:
          "<!-- Psiu! Você está olhando o código deste jogo, igualzinho fez na padaria. Tem um segredo aqui: leia o atributo data-segredo deste elemento. -->",
      }}
    />
  );
}

/*
 * O guia de publicação: o passo a passo, FORA do jogo, para o site do
 * jogador ganhar um endereço de verdade na internet.
 *
 * É só dado (os textos do checklist), num arquivo separado de propósito:
 * plataformas mudam de tela, de nome e de regra. Quando mudarem, atualize
 * os passos e a data `verificadoEm` aqui, sem mexer em código. Os ids dos
 * passos são guardados no progresso (o que o jogador já marcou): passo
 * novo ganha id novo; passo que sai, sai (a marca dele é ignorada).
 *
 * Verificado em 2026-09-28 (pesquisa na web; o site da Netlify não abriu
 * daqui, então confira antes de publicar uma versão nova):
 * - Netlify Drop (app.netlify.com/drop): arrastar a PASTA do site (com o
 *   index.html na raiz) publica na hora, sem conta; o site anônimo precisa
 *   ser "reivindicado" (claim) com uma conta grátis em até 1 hora, senão
 *   some. O zip também é aceito, mas a própria Netlify recomenda
 *   descompactar antes. O endereço termina em .netlify.app.
 * - Alternativas parecidas: Cloudflare Drop (também 60 minutos para
 *   reivindicar) e Vercel Drop (pede conta antes).
 */

export type PassoPublicacao = {
  /** Estável: fica no progresso (o jogador marcou). */
  id: string;
  /** O que fazer, em uma frase. */
  titulo: string;
  /** Um detalhe que tira a dúvida mais comum desse passo. */
  detalhe: string;
};

export type GuiaPublicacao = {
  plataforma: string;
  /** Endereço onde o jogador vai (texto, não link clicável dentro do jogo: ele abre no navegador). */
  endereco: string;
  /** Quando os passos foram conferidos pela última vez (AAAA-MM-DD). */
  verificadoEm: string;
  /** Aviso honesto: isso é fora do jogo e as plataformas mudam. */
  aviso: string;
  passos: readonly PassoPublicacao[];
  /** Outras opções, para quem quiser comparar. */
  outras: readonly string[];
};

export const GUIA_PUBLICACAO: GuiaPublicacao = {
  plataforma: "Netlify Drop",
  endereco: "app.netlify.com/drop",
  verificadoEm: "2026-09-28",
  aviso:
    "Esta parte é fora do jogo, num site de verdade, e as plataformas mudam de tela de vez em quando. Se algo estiver diferente, procure o botão com o mesmo sentido.",
  passos: [
    {
      id: "baixar-zip",
      titulo: "Baixe o .zip com o botão Levar pro mundo",
      detalhe: "Ele traz os dois arquivos do seu site: o index.html (a página) e o style.css (o visual).",
    },
    {
      id: "descompactar",
      titulo: "Descompacte o .zip numa pasta",
      detalhe: "No computador, clique com o botão direito no arquivo e escolha Extrair. A pasta tem que ter o index.html bem na entrada.",
    },
    {
      id: "abrir-netlify",
      titulo: "Abra app.netlify.com/drop no navegador do computador",
      detalhe: "Arrastar arquivos é bem mais fácil num computador. No celular, esse passo pode nem funcionar.",
    },
    {
      id: "arrastar-pasta",
      titulo: "Arraste a pasta para a área de soltar",
      detalhe: "Em alguns segundos aparece um endereço terminado em .netlify.app. É o seu site no ar!",
    },
    {
      id: "reivindicar",
      titulo: "Crie uma conta grátis e reivindique o site em até 1 hora",
      detalhe: "Sem conta, o site anônimo some depois de uma hora. Com a conta, ele fica, e dá para trocar o nome do endereço.",
    },
    {
      id: "testar-celular",
      titulo: "Abra o endereço no celular",
      detalhe: "Confira se tudo cabe na tela, como no modo dispositivo do jogo. Mande para alguém ver!",
    },
  ],
  outras: [
    "Cloudflare Drop: também publica arrastando, e também pede para reivindicar em 60 minutos.",
    "Vercel Drop: parecido, mas pede uma conta antes.",
    "GitHub Pages: publica direto de um repositório; você aprende a usar o Git na ilha Ofício.",
  ],
};

/**
 * O link colado no fim do guia: só confere o FORMATO (https:// e um
 * domínio com ponto). O jogo não visita o endereço.
 */
export function linkPublicadoValido(texto: string): boolean {
  const limpo = texto.trim();
  if (!/^https?:\/\//i.test(limpo) || /\s/.test(limpo)) return false;
  try {
    const url = new URL(limpo);
    return (url.protocol === "https:" || url.protocol === "http:") && /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname);
  } catch {
    return false;
  }
}

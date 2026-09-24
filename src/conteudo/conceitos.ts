/*
 * Catálogo central de conceitos.
 *
 * Todo conceito que uma fase ensina, revisa ou pede como pré-requisito
 * precisa existir aqui. O id é o que as fases usam; o nome e o resumo
 * aparecem para o jogador (índice de conceitos e, no futuro, o
 * computadorzinho navegador: "não sei o que é div, onde vejo?").
 *
 * Regras (ver docs/GUIA-DE-CONTEUDO.md):
 * - id em kebab-case, sem acento, curto e estável (nunca renomeie um id
 *   que já está em uso: progresso e índice dependem dele);
 * - nome curto, como o jogador falaria;
 * - resumo em UMA frase de leigo, sem jargão sem explicação.
 */

const CATALOGO = {
  // Unidade 1: o site é seu
  elemento: {
    nome: "Elemento",
    resumo: "Cada pecinha que monta uma página, como um título, um parágrafo ou um botão.",
  },
  tag: {
    nome: "Tag",
    resumo: "A etiqueta entre os sinais de menor e maior que diz que tipo de peça é aquela, como h1 ou button.",
  },
  "selecionar-pela-arvore": {
    nome: "Selecionar pela árvore",
    resumo: "Clicar num item da árvore do F12 para escolher uma peça e ver ela acender na tela.",
  },
  "modo-inspecionar": {
    nome: "Modo inspecionar",
    resumo: "A setinha do F12: você aponta algo na tela e o painel mostra qual peça é.",
  },
  "editar-texto": {
    nome: "Editar texto",
    resumo: "Trocar o texto de uma peça com dois cliques na árvore, só para você ver.",
  },
  "codigo-html": {
    nome: "Código HTML",
    resumo: "A página escrita na língua que o navegador entende, cheia de tags.",
  },
  "lista-e-itens": {
    nome: "Lista e itens",
    resumo: "Uma lista (ul) guarda itens (li), um para cada coisa da lista.",
  },

  // Unidade 2: faxina no site
  "elemento-pai": {
    nome: "Elemento pai",
    resumo: "A peça que guarda outra dentro dela, como uma caixa guarda um brinquedo.",
  },
  "elemento-filho": {
    nome: "Elemento filho",
    resumo: "A peça que mora dentro de outra; ela vai junto para onde o pai for.",
  },
  aninhamento: {
    nome: "Aninhamento",
    resumo: "Peças dentro de peças, em andares, como bonecas russas uma dentro da outra.",
  },
  "esconder-elemento": {
    nome: "Esconder elemento",
    resumo: "Deixar uma peça invisível sem tirar ela da página: o lugar dela continua reservado.",
  },
  "remover-do-documento": {
    nome: "Remover do documento",
    resumo: "Apagar a peça de vez: ela sai da página e o que vem depois sobe para ocupar o lugar.",
  },
  desfazer: {
    nome: "Desfazer e refazer",
    resumo: "Voltar um passo atrás quando algo deu errado, e ir para a frente de novo se mudar de ideia.",
  },
  "duplicar-elemento": {
    nome: "Duplicar elemento",
    resumo: "Fazer uma cópia exata de uma peça, com tudo o que tem dentro, logo depois dela.",
  },
  "elementos-irmaos": {
    nome: "Elementos irmãos",
    resumo: "Peças que moram dentro do mesmo pai, uma do lado da outra.",
  },
} as const satisfies Record<string, { nome: string; resumo: string }>;

export type IdConceito = keyof typeof CATALOGO;

export type Conceito = { id: IdConceito; nome: string; resumo: string };

export const IDS_CONCEITOS = Object.keys(CATALOGO) as IdConceito[];

export const CONCEITOS: readonly Conceito[] = IDS_CONCEITOS.map((id) => ({ id, ...CATALOGO[id] }));

export function ehIdConceito(valor: unknown): valor is IdConceito {
  return typeof valor === "string" && Object.hasOwn(CATALOGO, valor);
}

export function conceitoDoId(id: IdConceito): Conceito {
  return { id, ...CATALOGO[id] };
}

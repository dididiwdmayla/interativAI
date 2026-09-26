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

  // Unidade 3: títulos e textos
  "titulos-hierarquia": {
    nome: "Hierarquia de títulos",
    resumo: "Os títulos vão de h1 (o mais importante) a h6: o número mostra o nível, não o tamanho da letra.",
  },
  paragrafo: {
    nome: "Parágrafo",
    resumo: "A tag p marca um bloco de texto corrido, a peça mais comum de uma página.",
  },
  "enfase-forte": {
    nome: "Ênfase forte",
    resumo: "O strong diz que aquele trecho é importante de verdade; o b só deixa em negrito, sem avisar ninguém.",
  },
  "enfase-leve": {
    nome: "Ênfase leve",
    resumo: "O em marca um tom diferente na frase; o i só deixa em itálico, sem dizer que é especial.",
  },
  "lista-numerada": {
    nome: "Lista numerada",
    resumo: "A tag ol numera os itens porque a ordem deles importa; a ul não numera porque a ordem não importa.",
  },

  // Unidade 4: links, imagens, id e class
  "editar-atributo": {
    nome: "Editar atributo",
    resumo: "Trocar o valor de um atributo (como href, alt ou class) com dois cliques na árvore, só para você ver.",
  },
  "link-href": {
    nome: "Link e href",
    resumo: "A tag a cria um link; o href diz para onde ele leva, um endereço ou um lugar da própria página.",
  },
  "link-ancora": {
    nome: "Link âncora",
    resumo: "Um href que começa com # não sai da página: ele rola até o elemento com aquele id.",
  },
  "link-aba-nova": {
    nome: "Abrir em aba nova",
    resumo: "O atributo target=\"_blank\" faz o link abrir numa aba nova, sem fechar a página atual.",
  },
  "imagem-alt": {
    nome: "Imagem e alt",
    resumo: "O alt descreve a imagem em palavras: quem não consegue ver a imagem ouve ou lê essa descrição.",
  },
  "id-unico": {
    nome: "Id é único",
    resumo: "Um id identifica UMA peça só na página inteira; duas peças com o mesmo id confundem o navegador.",
  },
  "class-repetivel": {
    nome: "Class é repetível",
    resumo: "Uma class pode se repetir em várias peças parecidas, para tratar todas elas juntas.",
  },

  // Unidade 5: caixas e seções
  "div-generica": {
    nome: "Div genérica",
    resumo: "A div é uma caixa sem significado nem estilo próprio: ela só agrupa, e o visual depende do CSS.",
  },
  "semantica-html": {
    nome: "Semântica do HTML",
    resumo: "Usar a tag certa (como header ou footer) ajuda leitor de tela, busca e quem lê o código depois, mesmo sem mudar o visual.",
  },
  "section-vs-article": {
    nome: "Section ou article",
    resumo: "section agrupa conteúdo por tema; article é um conteúdo que se basta sozinho e poderia ser reaproveitado em outro lugar.",
  },
  "span-generico": {
    nome: "Span genérico",
    resumo: "O span é a versão em linha da div: uma marcação sem significado, só um gancho de estilo dentro do texto.",
  },

  // Zona Estilos, E1: a aba Estilos
  "o-que-e-css": {
    nome: "O que é CSS",
    resumo: "A folha de estilo diz como as peças aparecem (cor, tamanho, fonte); o HTML diz o que elas são.",
  },
  "regra-e-declaracao": {
    nome: "Regra e declaração",
    resumo: "Uma regra junta um seletor e declarações; cada declaração é uma propriedade e um valor, como color: white.",
  },
  "cor-do-texto": {
    nome: "Cor do texto",
    resumo: "A propriedade color pinta as letras de uma peça.",
  },
  "cor-de-fundo": {
    nome: "Cor de fundo",
    resumo: "A propriedade background-color pinta o fundo da caixa de uma peça.",
  },
  "cor-por-nome": {
    nome: "Cor por nome",
    resumo: "O CSS conhece cores pelo nome em inglês, como white, crimson ou gold.",
  },
  "ligar-desligar-declaracao": {
    nome: "Ligar e desligar declaração",
    resumo: "A caixinha do painel Estilos desliga uma declaração sem apagar, para testar o que ela faz.",
  },
  "tamanho-da-letra": {
    nome: "Tamanho da letra",
    resumo: "A propriedade font-size muda o tamanho do texto, por exemplo em px, os pontinhos da tela.",
  },
  "unidade-rem": {
    nome: "Unidade rem",
    resumo: "1rem é o tamanho da letra da página inteira (16px, se ninguém mudou), então 2rem é o dobro disso.",
  },
  "familia-da-fonte": {
    nome: "Família da fonte",
    resumo: "A propriedade font-family escolhe o desenho das letras, com uma reserva no fim, como Georgia, serif.",
  },
  "alinhamento-do-texto": {
    nome: "Alinhamento do texto",
    resumo: "A propriedade text-align põe o texto à esquerda, no centro ou à direita da caixa dele.",
  },
  "peso-da-fonte": {
    nome: "Peso da fonte",
    resumo: "A propriedade font-weight deixa a letra mais grossa (bold) ou normal.",
  },
  "cor-hexadecimal": {
    nome: "Cor em hexadecimal",
    resumo: "Uma cor escrita como #RRGGBB: quanto de vermelho, verde e azul, de 00 (nada) a FF (tudo).",
  },
  "regra-nova": {
    nome: "Regra nova",
    resumo: "Quando nenhuma regra pega a peça, você cria uma com o seletor dela e escreve as declarações.",
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

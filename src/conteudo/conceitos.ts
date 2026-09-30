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
 * - resumo em UMA frase de leigo, sem jargão sem explicação;
 * - temas: pelo menos um (src/curriculo/temas.ts). Eles acendem o conceito
 *   na lente de temas do mapa e no glossário.
 */
import type { IdTema } from "@/curriculo/temas";

const CATALOGO = {
  // Unidade 1: o site é seu
  elemento: {
    nome: "Elemento",
    resumo: "Cada pecinha que monta uma página, como um título, um parágrafo ou um botão.",
    temas: ["interfaces"],
  },
  tag: {
    nome: "Tag",
    resumo: "A etiqueta entre os sinais de menor e maior que diz que tipo de peça é aquela, como h1 ou button.",
    temas: ["interfaces"],
  },
  "selecionar-pela-arvore": {
    nome: "Selecionar pela árvore",
    resumo: "Clicar num item da árvore do F12 para escolher uma peça e ver ela acender na tela.",
    temas: ["ferramentas"],
  },
  "modo-inspecionar": {
    nome: "Modo inspecionar",
    resumo: "A setinha do F12: você aponta algo na tela e o painel mostra qual peça é.",
    temas: ["ferramentas"],
  },
  "editar-texto": {
    nome: "Editar texto",
    resumo: "Trocar o texto de uma peça com dois cliques na árvore, só para você ver.",
    temas: ["ferramentas"],
  },
  "codigo-html": {
    nome: "Código HTML",
    resumo: "A página escrita na língua que o navegador entende, cheia de tags.",
    temas: ["interfaces"],
  },
  "lista-e-itens": {
    nome: "Lista e itens",
    resumo: "Uma lista (ul) guarda itens (li), um para cada coisa da lista.",
    temas: ["interfaces"],
  },

  // Unidade 2: faxina no site
  "elemento-pai": {
    nome: "Elemento pai",
    resumo: "A peça que guarda outra dentro dela, como uma caixa guarda um brinquedo.",
    temas: ["interfaces"],
  },
  "elemento-filho": {
    nome: "Elemento filho",
    resumo: "A peça que mora dentro de outra; ela vai junto para onde o pai for.",
    temas: ["interfaces"],
  },
  aninhamento: {
    nome: "Aninhamento",
    resumo: "Peças dentro de peças, em andares, como bonecas russas uma dentro da outra.",
    temas: ["interfaces"],
  },
  "esconder-elemento": {
    nome: "Esconder elemento",
    resumo: "Deixar uma peça invisível sem tirar ela da página: o lugar dela continua reservado.",
    temas: ["interfaces", "ferramentas"],
  },
  "remover-do-documento": {
    nome: "Remover do documento",
    resumo: "Apagar a peça de vez: ela sai da página e o que vem depois sobe para ocupar o lugar.",
    temas: ["interfaces", "ferramentas"],
  },
  desfazer: {
    nome: "Desfazer e refazer",
    resumo: "Voltar um passo atrás quando algo deu errado, e ir para a frente de novo se mudar de ideia.",
    temas: ["ferramentas"],
  },
  "duplicar-elemento": {
    nome: "Duplicar elemento",
    resumo: "Fazer uma cópia exata de uma peça, com tudo o que tem dentro, logo depois dela.",
    temas: ["ferramentas"],
  },
  "elementos-irmaos": {
    nome: "Elementos irmãos",
    resumo: "Peças que moram dentro do mesmo pai, uma do lado da outra.",
    temas: ["interfaces"],
  },

  // Unidade 3: títulos e textos
  "titulos-hierarquia": {
    nome: "Hierarquia de títulos",
    resumo: "Os títulos vão de h1 (o mais importante) a h6: o número mostra o nível, não o tamanho da letra.",
    temas: ["interfaces", "acessibilidade"],
  },
  paragrafo: {
    nome: "Parágrafo",
    resumo: "A tag p marca um bloco de texto corrido, a peça mais comum de uma página.",
    temas: ["interfaces"],
  },
  "enfase-forte": {
    nome: "Ênfase forte",
    resumo: "O strong diz que aquele trecho é importante de verdade; o b só deixa em negrito, sem avisar ninguém.",
    temas: ["interfaces", "acessibilidade"],
  },
  "enfase-leve": {
    nome: "Ênfase leve",
    resumo: "O em marca um tom diferente na frase; o i só deixa em itálico, sem dizer que é especial.",
    temas: ["interfaces", "acessibilidade"],
  },
  "lista-numerada": {
    nome: "Lista numerada",
    resumo: "A tag ol numera os itens porque a ordem deles importa; a ul não numera porque a ordem não importa.",
    temas: ["interfaces"],
  },

  // Unidade 4: links, imagens, id e class
  "editar-atributo": {
    nome: "Editar atributo",
    resumo: "Trocar o valor de um atributo (como href, alt ou class) com dois cliques na árvore, só para você ver.",
    temas: ["ferramentas"],
  },
  "link-href": {
    nome: "Link e href",
    resumo: "A tag a cria um link; o href diz para onde ele leva, um endereço ou um lugar da própria página.",
    temas: ["interfaces"],
  },
  "link-ancora": {
    nome: "Link âncora",
    resumo: "Um href que começa com # não sai da página: ele rola até o elemento com aquele id.",
    temas: ["interfaces"],
  },
  "link-aba-nova": {
    nome: "Abrir em aba nova",
    resumo: "O atributo target=\"_blank\" faz o link abrir numa aba nova, sem fechar a página atual.",
    temas: ["interfaces"],
  },
  "imagem-alt": {
    nome: "Imagem e alt",
    resumo: "O alt descreve a imagem em palavras: quem não consegue ver a imagem ouve ou lê essa descrição.",
    temas: ["interfaces", "acessibilidade"],
  },
  "id-unico": {
    nome: "Id é único",
    resumo: "Um id identifica UMA peça só na página inteira; duas peças com o mesmo id confundem o navegador.",
    temas: ["interfaces"],
  },
  "class-repetivel": {
    nome: "Class é repetível",
    resumo: "Uma class pode se repetir em várias peças parecidas, para tratar todas elas juntas.",
    temas: ["interfaces"],
  },

  // Unidade 5: caixas e seções
  "div-generica": {
    nome: "Div genérica",
    resumo: "A div é uma caixa sem significado nem estilo próprio: ela só agrupa, e o visual depende do CSS.",
    temas: ["interfaces"],
  },
  "semantica-html": {
    nome: "Semântica do HTML",
    resumo: "Usar a tag certa (como header ou footer) ajuda leitor de tela, busca e quem lê o código depois, mesmo sem mudar o visual.",
    temas: ["interfaces", "acessibilidade"],
  },
  "section-vs-article": {
    nome: "Section ou article",
    resumo: "section agrupa conteúdo por tema; article é um conteúdo que se basta sozinho e poderia ser reaproveitado em outro lugar.",
    temas: ["interfaces", "acessibilidade"],
  },
  "span-generico": {
    nome: "Span genérico",
    resumo: "O span é a versão em linha da div: uma marcação sem significado, só um gancho de estilo dentro do texto.",
    temas: ["interfaces"],
  },

  // Unidade 6: página do zero
  "estrutura-do-documento": {
    nome: "Estrutura do documento",
    resumo: "Toda página começa com doctype, html, head e body: o esqueleto onde tudo o mais mora.",
    temas: ["interfaces"],
  },
  "head-vs-body": {
    nome: "Head e body",
    resumo: "O head guarda informação sobre a página (título, codificação); o body guarda o que aparece na tela.",
    temas: ["interfaces"],
  },
  title: {
    nome: "Title",
    resumo: "A tag title, dentro do head, dá o nome que aparece na aba do navegador, não na página.",
    temas: ["interfaces"],
  },
  "meta-charset": {
    nome: "Meta charset",
    resumo: "A tag meta charset diz ao navegador como ler as letras da página; sem ela, acentos podem sair errados.",
    temas: ["interfaces"],
  },

  // Zona Estilos, E1: a aba Estilos
  "o-que-e-css": {
    nome: "O que é CSS",
    resumo: "A folha de estilo diz como as peças aparecem (cor, tamanho, fonte); o HTML diz o que elas são.",
    temas: ["interfaces"],
  },
  "regra-e-declaracao": {
    nome: "Regra e declaração",
    resumo: "Uma regra junta um seletor e declarações; cada declaração é uma propriedade e um valor, como color: white.",
    temas: ["interfaces"],
  },
  "cor-do-texto": {
    nome: "Cor do texto",
    resumo: "A propriedade color pinta as letras de uma peça.",
    temas: ["interfaces"],
  },
  "cor-de-fundo": {
    nome: "Cor de fundo",
    resumo: "A propriedade background-color pinta o fundo da caixa de uma peça.",
    temas: ["interfaces"],
  },
  "cor-por-nome": {
    nome: "Cor por nome",
    resumo: "O CSS conhece cores pelo nome em inglês, como white, crimson ou gold.",
    temas: ["interfaces"],
  },
  "ligar-desligar-declaracao": {
    nome: "Ligar e desligar declaração",
    resumo: "A caixinha do painel Estilos desliga uma declaração sem apagar, para testar o que ela faz.",
    temas: ["interfaces", "ferramentas"],
  },
  "tamanho-da-letra": {
    nome: "Tamanho da letra",
    resumo: "A propriedade font-size muda o tamanho do texto, por exemplo em px, os pontinhos da tela.",
    temas: ["interfaces"],
  },
  "unidade-rem": {
    nome: "Unidade rem",
    resumo: "1rem é o tamanho da letra da página inteira (16px, se ninguém mudou), então 2rem é o dobro disso.",
    temas: ["interfaces", "acessibilidade"],
  },
  "familia-da-fonte": {
    nome: "Família da fonte",
    resumo: "A propriedade font-family escolhe o desenho das letras, com uma reserva no fim, como Georgia, serif.",
    temas: ["interfaces"],
  },
  "alinhamento-do-texto": {
    nome: "Alinhamento do texto",
    resumo: "A propriedade text-align põe o texto à esquerda, no centro ou à direita da caixa dele.",
    temas: ["interfaces"],
  },
  "peso-da-fonte": {
    nome: "Peso da fonte",
    resumo: "A propriedade font-weight deixa a letra mais grossa (bold) ou normal.",
    temas: ["interfaces"],
  },
  "cor-hexadecimal": {
    nome: "Cor em hexadecimal",
    resumo: "Uma cor escrita como #RRGGBB: quanto de vermelho, verde e azul, de 00 (nada) a FF (tudo).",
    temas: ["interfaces"],
  },
  "regra-nova": {
    nome: "Regra nova",
    resumo: "Quando nenhuma regra pega a peça, você cria uma com o seletor dela e escreve as declarações.",
    temas: ["interfaces", "ferramentas"],
  },

  // Zona Estilos, E2: Seletores
  "seletor-de-tag": {
    nome: "Seletor de tag",
    resumo: "Um seletor com o nome de uma tag (como h3) pega TODAS as peças daquele tipo na página.",
    temas: ["interfaces"],
  },
  "seletor-de-classe": {
    nome: "Seletor de classe",
    resumo: "Um seletor que começa com ponto (.autor) pega toda peça com aquela class, não importa onde ela more.",
    temas: ["interfaces"],
  },
  "seletor-de-id": {
    nome: "Seletor de id",
    resumo: "Um seletor que começa com sustenido (#id) pega só UMA peça, porque um id não se repete na página.",
    temas: ["interfaces"],
  },
  "seletor-descendente": {
    nome: "Seletor descendente",
    resumo: "Dois seletores com um espaço entre eles (main .preco) pegam só o segundo quando ele está dentro do primeiro.",
    temas: ["interfaces"],
  },

  // Zona Estilos, E3: Modelo de caixa
  "modelo-de-caixa": {
    nome: "Modelo de caixa",
    resumo: "Toda peça é uma caixa com quatro camadas: conteúdo, padding, border e margin, de dentro pra fora.",
    temas: ["interfaces"],
  },
  "padding-css": {
    nome: "Padding",
    resumo: "O padding é o espaço DENTRO da caixa, entre o conteúdo e a borda: empurra o conteúdo pra dentro.",
    temas: ["interfaces"],
  },
  "border-css": {
    nome: "Border",
    resumo: "A border é a linha ao redor do padding: tem espessura, estilo (como solid) e cor.",
    temas: ["interfaces"],
  },
  "margin-css": {
    nome: "Margin",
    resumo: "O margin é o espaço FORA da caixa: empurra as peças vizinhas pra longe, sem mudar o tamanho dela.",
    temas: ["interfaces"],
  },
  "box-sizing": {
    nome: "Box-sizing",
    resumo: "Com border-box, o padding e a border entram DENTRO da largura definida, em vez de somar a ela.",
    temas: ["interfaces"],
  },

  // Zona Estilos, E4: Por que minha regra não pega?
  "cascata-css": {
    nome: "Cascata",
    resumo: "Várias regras podem mirar a mesma peça ao mesmo tempo; a cascata decide qual declaração vence.",
    temas: ["interfaces"],
  },
  "ordem-das-regras": {
    nome: "Ordem das regras",
    resumo: "Quando duas regras têm a MESMA especificidade, a que vem depois no arquivo vence.",
    temas: ["interfaces"],
  },
  "especificidade-css": {
    nome: "Especificidade",
    resumo: "Um seletor com id vence um com classe, que vence um só de tag — não importa a ordem no arquivo.",
    temas: ["interfaces"],
  },
  "heranca-css": {
    nome: "Herança",
    resumo: "Sem regra própria, uma peça herda as propriedades herdáveis (como color) do ancestral mais perto.",
    temas: ["interfaces"],
  },
  "importante-css": {
    nome: "!important",
    resumo: "!important faz uma declaração vencer quase tudo; editar a própria declaração é o jeito de mudar seu valor, mas é melhor evitar usá-lo.",
    temas: ["interfaces"],
  },

  // Zona Layout, L1: Display
  "display-css": {
    nome: "Display",
    resumo: "O display de uma peça decide o formato da caixa dela: block, inline, inline-block ou none.",
    temas: ["interfaces"],
  },
  "display-block": {
    nome: "Display block",
    resumo: "block faz a caixa ocupar a linha toda (a largura do pai) e empurra o que vem depois para baixo.",
    temas: ["interfaces"],
  },
  "display-inline": {
    nome: "Display inline",
    resumo: "inline é o padrão de peças como span e a: fica ao lado do texto e ignora width e height.",
    temas: ["interfaces"],
  },
  "display-inline-block": {
    nome: "Display inline-block",
    resumo: "inline-block fica lado a lado como inline, mas respeita width, height e padding como block.",
    temas: ["interfaces"],
  },
  "display-none": {
    nome: "Display none",
    resumo: "display: none tira a peça do fluxo da página: ela some e o espaço dela fecha, como se nunca tivesse existido.",
    temas: ["interfaces"],
  },

  // Zona Layout, L2: Flexbox
  flexbox: {
    nome: "Flexbox",
    resumo: "Com display: flex, os filhos de uma caixa entram numa fila e ganham comandos de alinhamento.",
    temas: ["interfaces"],
  },
  "flex-direction": {
    nome: "Flex-direction",
    resumo: "flex-direction escolhe o sentido da fila: row (em linha) ou column (em coluna).",
    temas: ["interfaces"],
  },
  "justify-content": {
    nome: "Justify-content",
    resumo: "justify-content espalha os filhos ao longo da fila: no começo, no fim, no centro ou com espaço entre eles.",
    temas: ["interfaces"],
  },
  "align-items": {
    nome: "Align-items",
    resumo: "align-items alinha os filhos no sentido cruzado da fila: topo, base, centro ou esticado.",
    temas: ["interfaces"],
  },
  "gap-css": {
    nome: "Gap",
    resumo: "gap cria um espaço fixo entre os filhos de um flex ou de um grid, sem precisar de margin em cada um.",
    temas: ["interfaces"],
  },
  "flex-wrap": {
    nome: "Flex-wrap",
    resumo: "flex-wrap deixa os filhos quebrarem para a linha de baixo quando não cabem todos na fila.",
    temas: ["interfaces"],
  },

  // Zona Layout, L3: Grid
  "css-grid": {
    nome: "CSS Grid",
    resumo: "Com display: grid, uma caixa vira uma grade de linhas e colunas, e os filhos se encaixam nela.",
    temas: ["interfaces"],
  },
  "grid-template-columns": {
    nome: "Grid-template-columns",
    resumo: "grid-template-columns diz quantas colunas o grid tem e a largura de cada uma.",
    temas: ["interfaces"],
  },
  "fr-do-grid": {
    nome: "Unidade fr",
    resumo: "fr divide o espaço que sobra em frações; 1fr 2fr dá o dobro do espaço para a segunda coluna.",
    temas: ["interfaces"],
  },
  "grid-template-rows": {
    nome: "Grid-template-rows",
    resumo: "grid-template-rows diz quantas linhas o grid tem e a altura de cada uma, como as colunas mas na vertical.",
    temas: ["interfaces"],
  },
  "grid-template-areas": {
    nome: "Grid-template-areas",
    resumo: "grid-template-areas desenha o layout com nomes, como um mapa de caixas, e cada filho ocupa uma área.",
    temas: ["interfaces"],
  },

  // Zona Layout, L4: Posição e camadas
  "position-css": {
    nome: "Position",
    resumo: "position muda como uma peça se posiciona na página: static (o padrão), relative, absolute, fixed ou sticky.",
    temas: ["interfaces"],
  },
  "position-relative": {
    nome: "Position relative",
    resumo: "relative desliza a peça a partir do lugar onde ela estaria, sem tirar o espaço dela do fluxo.",
    temas: ["interfaces"],
  },
  "position-absolute": {
    nome: "Position absolute",
    resumo: "absolute tira a peça do fluxo e a posiciona a partir do ancestral mais próximo com position diferente de static.",
    temas: ["interfaces"],
  },
  "position-fixed": {
    nome: "Position fixed",
    resumo: "fixed gruda a peça na janela: ela fica no lugar mesmo quando a página rola.",
    temas: ["interfaces"],
  },
  "position-sticky": {
    nome: "Position sticky",
    resumo: "sticky se comporta como normal até a rolagem chegar num limite, e então gruda como fixed.",
    temas: ["interfaces"],
  },
  "z-index-css": {
    nome: "Z-index",
    resumo: "z-index decide qual peça fica por cima quando duas se sobrepõem: o número maior vence.",
    temas: ["interfaces"],
  },

  // Zona Publicar, P2: Do jogo pro mundo
  "modo-dispositivo": {
    nome: "Modo dispositivo",
    resumo: "O botão do F12 que mostra a página do tamanho de um celular ou tablet, sem sair do computador.",
    temas: ["ferramentas", "interfaces"],
  },
  "auditoria-lighthouse": {
    nome: "Lighthouse",
    resumo: "A aba do F12 que confere a página e dá notas de acessibilidade, boas práticas e SEO, apontando o que consertar.",
    temas: ["ferramentas", "acessibilidade"],
  },
  "css-externo": {
    nome: "CSS em arquivo separado",
    resumo: "O visual mora num arquivo .css à parte, ligado à página por uma linha link no head.",
    temas: ["interfaces", "ferramentas"],
  },
  "index-html": {
    nome: "index.html",
    resumo: "O nome da página de entrada de um site: é o arquivo que o servidor mostra quando alguém abre o endereço.",
    temas: ["servidores"],
  },
  "publicar-site": {
    nome: "Publicar um site",
    resumo: "Pôr os arquivos do site num servidor da internet, para qualquer pessoa abrir pelo endereço.",
    temas: ["servidores", "ferramentas"],
  },
  "variavel-css": {
    nome: "Variável CSS",
    resumo: "Um nome que guarda um valor (--nome: valor), usado em qualquer lugar com var(--nome). Mude num lugar só, e tudo que usa ela muda junto.",
    temas: ["interfaces"],
  },
  "escopo-de-variavel": {
    nome: "Alcance de uma variável",
    resumo: "Uma variável declarada numa peça só vale nela e em quem está dentro dela; declarada no :root, vale na página inteira.",
    temas: ["interfaces"],
  },
  "contraste-de-cor": {
    nome: "Contraste de cor",
    resumo: "A diferença entre a cor do texto e a do fundo. Pouco contraste deixa o texto difícil de ler, principalmente para quem enxerga menos.",
    temas: ["acessibilidade", "interfaces"],
  },
  "salvar-como-meu-tema": {
    nome: "Salvar como Meu tema",
    resumo: "Guardar o conjunto de cores que você criou como um tema novo, para usar no jogo inteiro a partir de agora.",
    temas: ["interfaces"],
  },
  "meta-viewport": {
    nome: "Meta viewport",
    resumo: "A linha no head que avisa o navegador do celular para desenhar a página do tamanho da tela dele, em vez de uma versão gigante encolhida.",
    temas: ["interfaces", "acessibilidade"],
  },
  "simulacao-sem-viewport": {
    nome: "Sem viewport, a página desenha gigante",
    resumo: "Sem o meta viewport, o navegador do celular desenha a página como se a tela tivesse 980px de largura e encolhe tudo para caber: fica pequeno e difícil de tocar.",
    temas: ["interfaces", "acessibilidade"],
  },
  "orientacao-da-tela": {
    nome: "Retrato e paisagem",
    resumo: "A tela pode estar em pé (retrato, mais alta que larga) ou deitada (paisagem, mais larga que alta); o layout pode reagir a cada uma.",
    temas: ["interfaces"],
  },
  "media-query": {
    nome: "Media query (@media)",
    resumo: "Uma regra de CSS que só vale quando a tela cumpre uma condição, como a largura mínima ou máxima: @media (max-width: 600px) { ... }.",
    temas: ["interfaces"],
  },
  "breakpoint": {
    nome: "Breakpoint",
    resumo: "A largura de tela onde o layout muda de jeito, porque uma @media liga ou desliga ali.",
    temas: ["interfaces"],
  },
  "mobile-first": {
    nome: "Mobile first",
    resumo: "Escrever primeiro o CSS para a tela pequena (sem @media nenhuma) e usar min-width para ir ACRESCENTANDO layout conforme a tela cresce.",
    temas: ["interfaces"],
  },
  "unidade-responsiva": {
    nome: "Unidade responsiva (%, max-width)",
    resumo: "Uma medida que se adapta ao espaço disponível, em vez de um tamanho fixo: max-width: 100% nunca passa da largura do pai.",
    temas: ["interfaces"],
  },
  "imagem-responsiva": {
    nome: "Imagem responsiva",
    resumo: "Uma imagem com max-width: 100% (e height: auto): nunca estoura a largura do espaço dela, em nenhuma tela.",
    temas: ["interfaces", "acessibilidade"],
  },
  "rotulo-acessivel": {
    nome: "Rótulo acessível",
    resumo: "O texto que diz o que um link ou botão faz para quem usa leitor de tela: o texto visível ou, se for só um ícone, um aria-label.",
    temas: ["acessibilidade", "interfaces"],
  },

  // Zona Ser encontrado (opcional), S1: como o Google acha seu site
  rastreamento: {
    nome: "Rastreamento",
    resumo: "O robô do buscador visita as páginas e segue os links de uma para outra, bem antes de alguém buscar.",
    temas: ["presenca-digital"],
  },
  indexacao: {
    nome: "Indexação",
    resumo: "Guardar a página visitada no catálogo do buscador: na hora da busca, ele procura no catálogo, não no site.",
    temas: ["presenca-digital"],
  },
  "titulo-na-busca": {
    nome: "Título na busca",
    resumo: "O texto do <title> vira o título azul do resultado; se for longo demais, a busca corta com reticências.",
    temas: ["presenca-digital", "interfaces"],
  },
  "descricao-na-busca": {
    nome: "Descrição na busca",
    resumo: "A meta description é o convite embaixo do título no resultado; sem ela, a busca mostra um trecho qualquer da página.",
    temas: ["presenca-digital"],
  },
  noindex: {
    nome: "noindex",
    resumo: "Uma meta no head que pede para a página ficar fora da busca: ela continua no ar para quem tem o link.",
    temas: ["presenca-digital"],
  },
  // Zona Ser encontrado (opcional), S2: SEO na página
  "h1-da-pagina": {
    nome: "h1 da página",
    resumo: "O título principal da página, um só, que diz do que ela trata: a busca e o leitor de tela se orientam por ele.",
    temas: ["presenca-digital", "acessibilidade"],
  },
  "enchimento-de-palavra-chave": {
    nome: "Enchimento de palavra-chave",
    resumo: "Repetir a mesma palavra sem sentido para tentar subir na busca: só deixa o texto ruim de ler.",
    temas: ["presenca-digital"],
  },
  "texto-que-responde": {
    nome: "Texto que responde",
    resumo: "Um texto que diz o que a pessoa foi buscar (preço, horário, como funciona), com as palavras que ela usaria.",
    temas: ["presenca-digital"],
  },
  "texto-de-link": {
    nome: "Texto de link",
    resumo: "O texto do link diz para onde ele leva (\"Veja o cardápio\"), em vez de \"clique aqui\", que fora da frase não diz nada.",
    temas: ["presenca-digital", "acessibilidade"],
  },
  "velocidade-da-pagina": {
    nome: "Velocidade da página",
    resumo: "Quanto a página demora para aparecer: foto pesada e muita coisa para baixar fazem a pessoa desistir antes de ver.",
    temas: ["desempenho", "presenca-digital"],
  },
  "imagem-preguicosa": {
    nome: "Imagem preguiçosa (lazy)",
    resumo: "Com loading=\"lazy\" na img, a foto só baixa quando a pessoa rola até perto dela, e a página abre mais rápido.",
    temas: ["desempenho"],
  },
  // Zona Ser encontrado (opcional), S3: seu negócio no mapa
  "perfil-da-empresa": {
    nome: "Perfil da Empresa no Google",
    resumo: "A ficha do negócio no Google, com endereço, telefone, horário, fotos e avaliações: é o que faz ele aparecer na busca local e no mapa.",
    temas: ["presenca-digital"],
  },
  "nome-endereco-telefone": {
    nome: "Nome, endereço e telefone iguais",
    resumo: "Os mesmos dados do negócio no site, no perfil e nas redes: dado diferente confunde o cliente e a busca.",
    temas: ["presenca-digital", "dados"],
  },
  "avaliacoes-do-cliente": {
    nome: "Avaliações dos clientes",
    resumo: "O que os clientes dizem do negócio: peça e responda com educação, nunca compre, porque avaliação comprada é falsa.",
    temas: ["presenca-digital"],
  },
  "dados-estruturados": {
    nome: "Dados estruturados (JSON-LD)",
    resumo: "Um bloco de dados no head que descreve o negócio para a busca num formato que ela lê fácil; ajuda, mas não garante o cartão no mapa.",
    temas: ["presenca-digital", "dados"],
  },
  "local-business": {
    nome: "LocalBusiness e subtipos",
    resumo: "O tipo de dado que descreve um negócio local; use o subtipo mais específico que existir, como Bakery, Plumber ou Dentist.",
    temas: ["presenca-digital", "dados"],
  },
  // Zona Ser encontrado (opcional), S4: medir quem chega
  analytics: {
    nome: "Analytics",
    resumo: "Um programa de análise que o site carrega para contar visitas e eventos: mostra o que as pessoas fazem no site.",
    temas: ["presenca-digital", "dados"],
  },
  "search-console": {
    nome: "Search Console",
    resumo: "Ferramenta gratuita do Google que mostra como o site aparece na busca: pesquisas, cliques e problemas de indexação.",
    temas: ["presenca-digital", "ferramentas"],
  },
  "evento-de-medicao": {
    nome: "Evento de medição",
    resumo: "O registro de que algo aconteceu no site, com um nome, como clique_whatsapp; no jogo, o data-evento da peça gera ele.",
    temas: ["presenca-digital", "dados"],
  },
  conversao: {
    nome: "Conversão",
    resumo: "Uma ação importante depois do clique, como compra, ligação ou cadastro: é o que conta, mais do que a visita.",
    temas: ["presenca-digital", "dados"],
  },
  "link-rastreavel-utm": {
    nome: "Link rastreável (utm)",
    resumo: "Um link com utm_source, utm_medium e utm_campaign no fim, que diz à medição de onde a visita veio; a página não muda.",
    temas: ["presenca-digital", "dados"],
  },
  // Zona Ser encontrado (opcional), S5: anúncio pago por dentro
  "leilao-de-anuncio": {
    nome: "Leilão do anúncio",
    resumo: "A disputa que decide quem aparece quando alguém busca: o lance conta, mas não sozinho (qualidade, concorrência e contexto também).",
    temas: ["presenca-digital", "desempenho"],
  },
  "custo-por-clique": {
    nome: "Custo por clique",
    resumo: "O que o anunciante paga por cada clique no anúncio: o lance é o máximo, e o custo real costuma ficar abaixo dele.",
    temas: ["presenca-digital", "dados"],
  },
  "palavra-chave-de-anuncio": {
    nome: "Palavra-chave do anúncio",
    resumo: "O termo que a pessoa digita na busca e que o anunciante escolhe para o anúncio poder aparecer; há correspondência ampla, de frase e exata.",
    temas: ["presenca-digital"],
  },
  "orcamento-diario": {
    nome: "Orçamento diário",
    resumo: "O teto do que o anúncio gasta por dia: quando a verba do dia acaba, o anúncio deixa de aparecer.",
    temas: ["presenca-digital", "dados"],
  },
  "pagina-de-destino": {
    nome: "Página de destino",
    resumo: "A página onde a pessoa cai depois de clicar no anúncio: decide quantos cliques viram clientes, e uma página melhor barateia o cliente.",
    temas: ["presenca-digital", "desempenho"],
  },
  "indice-de-qualidade": {
    nome: "Índice de qualidade",
    resumo: "Uma nota de 1 a 10, por palavra-chave, que só serve de diagnóstico do anúncio e da página: não entra no leilão.",
    temas: ["presenca-digital", "dados"],
  },
} as const satisfies Record<string, { nome: string; resumo: string; temas: readonly IdTema[] }>;

export type IdConceito = keyof typeof CATALOGO;

export type Conceito = { id: IdConceito; nome: string; resumo: string; temas: readonly IdTema[] };

export const IDS_CONCEITOS = Object.keys(CATALOGO) as IdConceito[];

export const CONCEITOS: readonly Conceito[] = IDS_CONCEITOS.map((id) => ({ id, ...CATALOGO[id] }));

export function ehIdConceito(valor: unknown): valor is IdConceito {
  return typeof valor === "string" && Object.hasOwn(CATALOGO, valor);
}

export function conceitoDoId(id: IdConceito): Conceito {
  return { id, ...CATALOGO[id] };
}

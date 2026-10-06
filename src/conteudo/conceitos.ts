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
 *   na lente de temas do mapa e no glossário;
 * - termoIngles: o nome como aparece na documentação em inglês ("bit",
 *   "event loop", "breakpoint"). Opcional nos conceitos antigos (preencher é
 *   uma tarefa de conteúdo), obrigatório nos novos a partir da rodada 36
 *   (guia, seção 1). O glossário mostra os dois e a busca acha pelos dois.
 */
import type { IdTema } from "@/curriculo/temas";

const CATALOGO = {
  // Museu das Origens, sala 1 (rodada 36): como o computador entende.
  "bit": {"nome": "Bit", "termoIngles": "bit", "resumo": "A menor informação que existe no computador: só duas possibilidades, como furo ou sem furo, ligado ou desligado, 1 ou 0.", "temas": ["fundamentos"]},
  "binario": {"nome": "Números em binário", "termoIngles": "binary", "resumo": "Contar só com 0 e 1: cada posição vale o dobro da vizinha (1, 2, 4, 8...) e o número é a soma das posições ligadas.", "temas": ["fundamentos"]},
  "instrucao-de-maquina": {"nome": "Instrução", "termoIngles": "instruction", "resumo": "Uma ordem pequena que o processador sabe cumprir, como pegar, somar ou guardar um número. Um programa vira milhares delas em fila.", "temas": ["fundamentos"]},
  "linguagem-de-maquina": {"nome": "Linguagem de máquina", "termoIngles": "machine code", "resumo": "As instruções escritas em bits, do jeito que o processador lê. Quase ninguém escreve assim: um tradutor faz isso pela gente.", "temas": ["fundamentos"]},
  "linguagem-de-programacao": {"nome": "Linguagem de programação", "termoIngles": "programming language", "resumo": "Um jeito de escrever ordens que gente consegue ler, como JavaScript. Um tradutor (compilador ou interpretador) passa para a máquina.", "temas": ["fundamentos", "logica"]},
  "byte": {"nome": "Byte", "termoIngles": "byte", "resumo": "Um grupo de 8 bits. Guarda um número de 0 a 255, que pode ser uma letra, um pedaço de uma cor ou de qualquer outra coisa.", "temas": ["fundamentos", "dados"]},
  "hexadecimal": {"nome": "Hexadecimal", "termoIngles": "hexadecimal", "resumo": "Contar de 16 em 16, com os dígitos de 0 a 9 e de a a f. Dois dígitos guardam um byte inteiro: de 00 (0) a ff (255).", "temas": ["fundamentos", "interfaces"]},
  // Museu das Origens, sala 2 (rodada 36): a linha do tempo.
  "cartao-perfurado": {"nome": "Cartão perfurado", "termoIngles": "punched card", "resumo": "Um cartão com furos que guardava informação e ordens: do tear de Jacquard aos computadores, foi usado por mais de um século.", "temas": ["fundamentos"]},
  "historia-da-computacao": {"nome": "Linha do tempo da computação", "termoIngles": "history of computing", "resumo": "Cada máquina aproveitou a de antes: cartões, válvulas, transistores, chips, o computador em casa, a web, o celular e a IA.", "temas": ["fundamentos"]},
  "transistor": {"nome": "Transistor", "termoIngles": "transistor", "resumo": "Uma chavinha elétrica sem vidro e sem partes que se mexem, que trocou a válvula: menor, mais fria e mais barata. Um chip tem bilhões.", "temas": ["fundamentos", "desempenho"]},
  "computador-pessoal": {"nome": "Computador pessoal", "termoIngles": "personal computer (PC)", "resumo": "O computador que cabe numa mesa e é de uma pessoa só. Tirou a computação das empresas e levou para as casas e escolas.", "temas": ["fundamentos"]},
  "web": {"nome": "Web", "termoIngles": "World Wide Web", "resumo": "Páginas ligadas por links, abertas num navegador. Roda em cima da internet, a rede que liga os computadores do mundo.", "temas": ["fundamentos", "interfaces", "servidores"]},

  "reproduzir-o-defeito": {"nome": "Reproduzir o defeito", "resumo": "Antes de procurar a causa, ache um caso que funciona e um que falha e compare as entradas: o que muda entre eles é a pista.", "temas": ["logica", "ferramentas"]},
  "causa-raiz": {"nome": "Causa raiz", "resumo": "O sintoma é o que aparece errado; a causa raiz é a decisão no código que o produz. Consertar só o sintoma deixa o defeito vivo.", "temas": ["logica", "ferramentas"]},
  "teste-de-regressao": {"nome": "Teste de regressão", "resumo": "Depois de consertar, rode de novo os casos antigos junto com o novo: um conserto bom não quebra o que já funcionava.", "temas": ["logica", "ferramentas"]},
  "observar-expressoes": {"nome": "Observar expressões", "resumo": "Observar acompanha valores e condições no instante de cada pausa sem alterar o código investigado.", "temas": ["logica", "ferramentas"]},
  "escopo-na-pausa": {"nome": "Escopo na pausa", "resumo": "Escopo separa as variáveis locais, de bloco e de fora para revelar qual caixinha a linha pausada lê.", "temas": ["logica", "ferramentas"]},
  "retorno-no-depurador": {"nome": "Investigar o retorno", "resumo": "Comparar o valor local com o que chega a quem chamou distingue cálculo, impressão e retorno ausente.", "temas": ["logica", "ferramentas"]},
  "passar-por-cima": {"nome": "Passar por cima", "resumo": "Passar por cima executa a linha inteira, incluindo uma chamada, e para na próxima linha do mesmo nível.", "temas": ["logica", "ferramentas"]},
  "entrar-e-sair": {"nome": "Entrar e sair de função", "resumo": "Entrar segue a chamada por dentro; Sair termina essa chamada e volta ao código que pediu sua resposta.", "temas": ["logica", "ferramentas"]},

  "ponto-de-parada": {"nome": "Ponto de parada", "resumo": "Marcar uma linha permite pausar antes dela executar e olhar a memória daquele instante.", "temas": ["logica", "ferramentas"]},
  "hipotese-de-bug": {"nome": "Hipótese de bug", "resumo": "Uma explicação provisória do defeito precisa ser confirmada ou descartada pelos valores observados.", "temas": ["logica", "ferramentas"]},
  "bug-silencioso": {"nome": "Bug silencioso", "resumo": "Um programa pode terminar sem erro e ainda devolver o resultado errado; casos de teste revelam a diferença.", "temas": ["logica", "ferramentas"]},

  "dicionario-de-erros": {"nome": "Dicionário de erros", "resumo": "SyntaxError aponta escrita inválida, ReferenceError um nome indisponível e TypeError uma operação incompatível com o valor.", "temas": ["logica", "ferramentas"]},
  "causa-do-erro": {"nome": "Pista e causa", "resumo": "A linha apontada mostra onde a falha apareceu; a causa pode estar antes, como no limite de um laço.", "temas": ["logica", "ferramentas"]},

"arvore-de-dados": {"nome": "Árvore de dados", "resumo": "Uma árvore tem uma raiz e nós com filhos; folhas não têm filhos, como os elementos aninhados do DOM.", "temas": ["dados", "logica"]},
"percorrer-arvore": {"nome": "Percorrer a árvore", "resumo": "Visitar um nó e chamar a mesma função para cada filho permite percorrer ramos de profundidades diferentes.", "temas": ["dados", "logica"]},

"dicionario-map": {"nome": "Dicionário com Map", "resumo": "Map guarda pares: set escreve ou atualiza, get lê, has confere se a chave existe.", "temas": ["dados", "logica"]},
"objeto-ou-map": {"nome": "Objeto ou Map", "resumo": "Objeto descreve campos de uma coisa; Map serve para pares dinâmicos com chaves que também podem ser números ou objetos.", "temas": ["dados", "logica"]},
"busca-com-map": {"nome": "Buscar com Map", "resumo": "Montar um Map custa percorrer os dados uma vez; muitas consultas has evitam repetir includes numa lista grande.", "temas": ["dados", "logica", "desempenho"]},

"fila-js": {"nome": "Fila", "resumo": "Numa fila, o primeiro item que entrou sai primeiro; push entra pelo fim e shift sai pelo começo.", "temas": ["dados", "logica"]},
"fila-por-indice": {"nome": "Fila sem deslizar", "resumo": "Para atender uma lista grande, avançar um índice preserva a ordem sem deslocar todos os vagões a cada shift.", "temas": ["dados", "logica", "desempenho"]},

"pilha-js": {"nome": "Pilha", "resumo": "Numa pilha, o último item que entrou é o primeiro a sair; push e pop usam o mesmo lado.", "temas": ["dados", "logica"]},
"pilha-vazia": {"nome": "Pilha vazia", "resumo": "Antes de retirar de uma pilha, confira length; pop no vazio devolve undefined.", "temas": ["dados", "logica"]},

"custo-em-passos": {"nome": "Custo em passos", "resumo": "Contar as linhas executadas ajuda a comparar o trabalho dos algoritmos sem depender da velocidade da máquina.", "temas": ["desempenho", "logica"]},
"crescimento-dos-passos": {"nome": "Crescimento dos passos", "resumo": "Medir a mesma tarefa com listas maiores mostra se o trabalho cresce junto com a entrada ou dispara.", "temas": ["desempenho", "logica"]},
"evitar-trabalho-repetido": {"nome": "Evitar trabalho repetido", "resumo": "Usar a ordem da lista pode evitar comparar cada par; o resultado precisa continuar correto nas bordas.", "temas": ["desempenho", "logica"]},

"recursao-js": {"nome": "Recursão", "resumo": "Uma função chama ela mesma para resolver uma versão menor do problema; cada chamada ganha uma moldura.", "temas": ["logica"]},
"caso-base-recursao": {"nome": "Caso de parada da recursão", "resumo": "O caso base devolve uma resposta sem nova chamada; sem alcançá-lo, a recursão continua até a proteção cortar.", "temas": ["logica"]},
"problema-menor-recursao": {"nome": "Um problema menor a cada chamada", "resumo": "A cada chamada, diminuir o número ou avançar na lista aproxima a função do caso de parada.", "temas": ["logica", "desempenho"]},

"ordenacao-selecao": {"nome": "Ordenação por seleção", "resumo": "Procurar o menor do trecho restante e colocá-lo na próxima posição da lista.", "temas": ["logica", "desempenho"]},
"ordenacao-bolha": {"nome": "Ordenação por bolha", "resumo": "Comparar vizinhos e trocar os fora de ordem, levando o maior ao fim em cada passada.", "temas": ["logica", "desempenho"]},
"sort-numerico": {"nome": "sort com números", "resumo": "O sort padrão compara como texto; o comparador (a, b) => a - b coloca números em ordem crescente.", "temas": ["logica", "desempenho"]},

"busca-linear": {"nome": "Busca linear", "resumo": "Olhar um item por vez até achar o alvo ou chegar ao fim da lista.", "temas": ["logica", "desempenho"]},
"busca-binaria": {"nome": "Busca binária", "resumo": "Numa lista ordenada, comparar o meio e descartar a metade que não pode conter o alvo.", "temas": ["logica", "desempenho"]},
"lista-ordenada": {"nome": "Lista ordenada", "resumo": "Manter os valores em ordem para que a busca binária possa descartar uma metade com segurança.", "temas": ["logica", "desempenho"]},

"casos-de-borda": {"nome": "Casos de borda", "resumo": "Testar vazio, zero, repetido e negativo para expor regras que um caso comum não verifica.", "temas": ["logica", "ferramentas"]},

"dependencias-passos": {"nome": "Dependências dos passos", "resumo": "Executar cada passo depois dos dados de que ele precisa, aceitando ordens independentes.", "temas": ["logica"]},

"pseudocodigo": {"nome": "Pseudocódigo", "resumo": "Planejar em palavras claras, sem precisar da sintaxe de uma linguagem.", "temas": ["logica"]},

"entender-problema": {"nome": "Entender o problema", "resumo": "Separar os dados de entrada, a resposta pedida e exemplos antes de programar.", "temas": ["logica"]},
"decompor-problema": {"nome": "Decompor um problema", "resumo": "Dividir um pedido grande em partes pequenas que dá para resolver separadamente.", "temas": ["logica"]},
"plano-comentado": {"nome": "Plano no código", "resumo": "Guardar o plano em comentários para conferir qual ideia cada linha realiza.", "temas": ["logica", "ferramentas"]},
"exemplos-de-teste": {"nome": "Exemplos de teste", "resumo": "Escrever entradas e saídas esperadas antes de conferir a função.", "temas": ["logica", "ferramentas"]},

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
  // Ilha Lógica, Primeiros comandos: U1 (rodada 17)
  "console-js": {
    nome: "Console",
    resumo: "A aba do F12 onde você escreve um comando de JavaScript, aperta Enter e vê a resposta na hora, em qualquer site.",
    temas: ["logica", "ferramentas"],
  },
  "operacoes-aritmeticas": {
    nome: "Operações de conta",
    resumo: "Os sinais que fazem conta no código: + soma, - subtrai, * multiplica, / divide e % dá o resto da divisão.",
    temas: ["logica"],
  },
  "ordem-das-operacoes": {
    nome: "Ordem das operações",
    resumo: "Como na escola: vezes e dividir vêm antes de mais e menos, e o que está entre parênteses vem primeiro.",
    temas: ["logica"],
  },
  "variavel-let": {
    nome: "Variável com let",
    resumo: "Uma caixinha com nome que guarda um valor e pode trocar de valor depois: let total = 10.",
    temas: ["logica", "dados"],
  },
  "variavel-const": {
    nome: "Constante com const",
    resumo: "Uma caixinha com nome que guarda o mesmo valor para sempre: tentar trocar dá erro.",
    temas: ["logica", "dados"],
  },
  "nome-de-variavel": {
    nome: "Nome de variável",
    resumo: "Um bom nome diz o que a caixinha guarda (precoDoPao, e não x), sem espaço nem acento, com as palavras coladas e a segunda em maiúscula.",
    temas: ["logica"],
  },
  "undefined-js": {
    nome: "undefined",
    resumo: "O jeito do JavaScript dizer que não tem valor ali: é o que o Console responde depois de uma linha que só guarda algo, como let preco = 5.",
    temas: ["logica", "dados"],
  },
  "ler-mensagem-de-erro": {
    nome: "Ler a mensagem de erro",
    resumo: "O erro vermelho diz o tipo do problema, o que aconteceu e a linha: ler com calma mostra por onde começar a consertar.",
    temas: ["logica", "ferramentas"],
  },
  "string-js": {
  "nome": "Texto (string)",
  "resumo": "Um valor que guarda caracteres, como um nome ou uma mensagem, escrito entre aspas.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "aspas-js": {
  "nome": "Aspas do texto",
  "resumo": "Aspas simples, duplas ou crases delimitam o texto; sem elas, uma palavra é lida como nome de variável.",
  "temas": [
    "logica"
  ]
},
  "concatenacao-js": {
  "nome": "Juntar textos",
  "resumo": "O + junta textos na ordem escrita, sem inventar espaços entre eles.",
  "temas": [
    "logica"
  ]
},
  "template-literal": {
  "nome": "Frase com valores",
  "resumo": "Entre crases, ${nome} coloca o valor da variável dentro do texto.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "length-texto": {
  "nome": "Tamanho do texto",
  "resumo": "A propriedade .length informa o tamanho do texto, incluindo espaços.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "console-log": {
  "nome": "Mostrar com console.log",
  "resumo": "console.log mostra uma mensagem; a resposta da chamada no Console continua sendo undefined.",
  "temas": [
    "logica",
    "ferramentas"
  ]
},
  "tipo-js": {
  "nome": "Tipo do valor",
  "resumo": "Número, texto, booleano, undefined e null representam coisas diferentes, mesmo quando parecem iguais.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "typeof-js": {
  "nome": "Perguntar o tipo",
  "resumo": "typeof devolve um texto com o nome do tipo do valor, como number ou string.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "igualdade-estrita": {
  "nome": "Comparar com ===",
  "resumo": "O === compara valor e tipo e responde true ou false, sem guardar nada nas variáveis.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "coercao-js": {
  "nome": "Conversão automática",
  "resumo": "Algumas operações convertem tipos sozinhas: + com texto junta, enquanto * e - tentam usar números.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "conversao-number": {
  "nome": "Converter com Number",
  "resumo": "Number(texto) tenta transformar texto numérico em número antes de fazer a conta.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "conversao-string": {
  "nome": "Converter com String",
  "resumo": "String(valor) transforma um valor em texto, útil para montar uma mensagem.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "comentario-js": {
  "nome": "Comentário no código",
  "resumo": "O computador ignora o trecho entre // e o fim da linha, ou entre /* e */; o resto continua executando.",
  "temas": [
    "logica",
    "ferramentas"
  ]
},
  "booleano-js": {
  "nome": "Verdadeiro ou falso",
  "resumo": "Um valor com só duas opções, true (verdadeiro) ou false (falso): é o que uma pergunta do código devolve.",
  "temas": ["logica","dados"]
},
  "comparacao-js": {
  "nome": "Comparar com > e <",
  "resumo": "Os sinais > e < perguntam se um valor é maior ou menor que outro, e o Console responde true ou false.",
  "temas": ["logica"]
},
  "limite-da-comparacao": {
  "nome": "Maior ou igual (>= e <=)",
  "resumo": "Com >= e <=, o valor que está exatamente no limite também conta; com > e <, ele fica de fora.",
  "temas": ["logica"]
},
  "diferente-estrito": {
  "nome": "Diferente com !==",
  "resumo": "O !== pergunta se dois valores são diferentes em valor ou em tipo: é o contrário do ===.",
  "temas": ["logica"]
},
  "atribuir-ou-comparar": {
  "nome": "Guardar não é comparar",
  "resumo": "Um = guarda um valor numa caixinha e a muda; três === perguntam se dois valores são iguais, sem mudar nada.",
  "temas": ["logica"]
},
  "igualdade-solta": {
  "nome": "Igualdade solta ==",
  "resumo": "O == compara convertendo os tipos antes ('10' == 10 dá true): por isso quase sempre se usa o ===.",
  "temas": ["logica"]
},
  "portao-e": {
  "nome": "Portão E",
  "resumo": "Só acende quando as duas entradas estão ligadas; no código se escreve && (true && true é true).",
  "temas": ["logica","fundamentos"]
},
  "tabela-verdade": {
  "nome": "Tabela verdade",
  "resumo": "Uma tabela que lista todos os jeitos de ligar as chaves e mostra, em cada um, se a saída acende.",
  "temas": ["logica","fundamentos"]
},
  "portao-ou": {
  "nome": "Portão OU",
  "resumo": "Acende quando pelo menos uma entrada está ligada (as duas também valem); no código se escreve ||.",
  "temas": ["logica","fundamentos"]
},
  "portao-nao": {
  "nome": "Portão NÃO",
  "resumo": "Inverte o valor: o que era ligado vira desligado e o contrário; no código é o ponto de exclamação (!).",
  "temas": ["logica","fundamentos"]
},
  "operadores-logicos": {
  "nome": "&&, || e !",
  "resumo": "Os operadores do código que fazem o papel dos portões: && é o E, || é o OU e ! é o NÃO.",
  "temas": ["logica"]
},
  "ordem-e-ou": {
  "nome": "Ordem do E e do OU",
  "resumo": "O E é calculado antes do OU, e os parênteses mudam quem vai primeiro: a mesma conta pode dar resultados diferentes.",
  "temas": ["logica"]
},
  "if-js": {
  "nome": "Se (if)",
  "resumo": "O if roda um trecho de código só quando a condição entre parênteses é true; se for false, o trecho é pulado.",
  "temas": ["logica"]
},
  "bloco-js": {
  "nome": "Bloco entre chaves",
  "resumo": "As chaves { } agrupam várias linhas num único bloco, que roda inteiro ou não roda.",
  "temas": ["logica"]
},
  "else-js": {
  "nome": "Senão (else)",
  "resumo": "O else é o plano B do if: roda quando a condição é false, e nunca junto com o bloco do if.",
  "temas": ["logica"]
},
  "else-if-js": {
  "nome": "Else if e a ordem",
  "resumo": "O else if encadeia mais uma pergunta; o programa para na primeira true, então a ordem das perguntas muda o resultado.",
  "temas": ["logica"]
},
  "condicao-composta": {
  "nome": "Condição com && e ||",
  "resumo": "Dentro do if dá para juntar condições: && exige todas, || aceita qualquer uma, e parênteses decidem quem vai primeiro.",
  "temas": ["logica"]
},
  "falsy-js": {
  "nome": "Valores falsos",
  "resumo": "No if, estes valores contam como falsos: false, 0, texto vazio, null, undefined e NaN.",
  "temas": ["logica","dados"]
},
  "truthy-js": {
  "nome": "Valores verdadeiros",
  "resumo": "Todo valor que não é falso conta como verdadeiro no if, até o texto '0', o texto 'false' e a lista vazia.",
  "temas": ["logica","dados"]
},
  "dupla-negacao": {
  "nome": "!!valor",
  "resumo": "Dois ! seguidos transformam qualquer valor em true ou false, do jeito que o if o enxerga.",
  "temas": ["logica","dados"]
},

  "while-js": {
  "nome": "Enquanto (while)",
  "resumo": "Testa a condição antes de cada volta e repete só o bloco enquanto ela for true.",
  "temas": [
    "logica"
  ]
},
  "condicao-de-parada": {
  "nome": "Condição de parada",
  "resumo": "O laço termina quando a condição fica false; se já começa false, não há voltas.",
  "temas": [
    "logica"
  ]
},
  "contador-js": {
  "nome": "Contador",
  "resumo": "Guarda o número da volta: i = i + 1 ou i++ aumenta um; i-- diminui um.",
  "temas": [
    "logica"
  ]
},
  "loop-infinito": {
  "nome": "Loop infinito e proteção",
  "resumo": "Se a condição nunca fica falsa, o laço não termina. O jogo limita passos e tempo para proteger a aba.",
  "temas": [
    "logica"
  ]
},

  "for-js": {
  "nome": "Laço for",
  "resumo": "Junta início, condição e atualização, separados por ponto e vírgula, para repetir um bloco.",
  "temas": [
    "logica"
  ]
},
  "for-of-js": {
  "nome": "for...of em textos",
  "resumo": "Entrega uma letra por volta, na ordem do texto, até ele acabar.",
  "temas": [
    "logica"
  ]
},
  "break-js": {
  "nome": "Saída com break",
  "resumo": "Sai do laço atual imediatamente; o programa continua depois do bloco.",
  "temas": [
    "logica"
  ]
},

  "acumulador-js": {
  "nome": "Acumulador",
  "resumo": "Guarda a soma dos valores, começando fora do laço; total += preco acrescenta o preço ao total.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "contador-condicional": {
  "nome": "Contador condicional",
  "resumo": "Aumenta só quando um if passa: conta os casos que atendem à condição, não todos os casos.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "maior-menor-js": {
  "nome": "Maior e menor",
  "resumo": "Compara cada valor com os extremos guardados e só troca ao achar um maior ou menor; o início deve ser um valor real.",
  "temas": [
    "logica",
    "dados"
  ]
},
  "media-js": {
  "nome": "Média",
  "resumo": "Divide a soma pela quantidade de valores, sem confundir a quantidade com o contador final da volta.",
  "temas": [
    "logica",
    "dados"
  ]
},
"funcao-js": {
  "nome": "Função",
  "resumo": "Guarda instruções sob um nome; criar uma função não executa seu corpo.",
  "temas": [
    "logica"
  ]
},
"chamada-funcao": {
  "nome": "Chamada de função",
  "resumo": "Os parênteses executam a função; ler apenas o nome obtém a própria função.",
  "temas": [
    "logica"
  ]
},
"moldura-funcao": {
  "nome": "Moldura de chamada",
  "resumo": "Cada chamada tem seu próprio quadro no palco e volta para quem chamou ao terminar.",
  "temas": [
    "logica"
  ]
},
"parametro-argumento": {
  "nome": "Parâmetro e argumento",
  "resumo": "Parâmetro é o nome de dentro; argumento é o valor entregue na posição da chamada.",
  "temas": [
    "logica"
  ]
},
"return-js": {
  "nome": "Retorno",
  "resumo": "return entrega um valor para quem chamou e encerra a chamada.",
  "temas": [
    "logica"
  ]
},
"mostrar-ou-devolver": {
  "nome": "Mostrar ou devolver",
  "resumo": "console.log mostra uma mensagem; return entrega um resultado. Sem return a função devolve undefined.",
  "temas": [
    "logica"
  ]
},
"return-encerra": {
  "nome": "Return encerra a chamada",
  "resumo": "Um return termina imediatamente a chamada; as instruções seguintes daquela função não executam.",
  "temas": [
    "logica"
  ]
},
"escopo-global-js": {
  "nome": "Escopo global",
  "resumo": "Uma variável do topo continua disponível entre chamadas.",
  "temas": [
    "logica"
  ]
},
"escopo-funcao-js": {
  "nome": "Escopo de função",
  "resumo": "Uma variável local pertence à chamada; um nome igual fora representa outra caixinha.",
  "temas": [
    "logica"
  ]
},
"escopo-bloco-js": {
  "nome": "Escopo de bloco",
  "resumo": "let e const dentro de chaves só existem naquele bloco, inclusive dentro de uma função.",
  "temas": [
    "logica"
  ]
},
"estado-entre-chamadas": {
  "nome": "Estado entre chamadas",
  "resumo": "Uma local nasce de novo a cada chamada; para guardar uma contagem entre chamadas a caixinha deve sobreviver fora.",
  "temas": [
    "logica"
  ]
},
"arrow-js": {
  "nome": "Função com seta",
  "resumo": "A seta => cria uma função; parâmetros e chamadas continuam funcionando do mesmo jeito.",
  "temas": [
    "logica"
  ]
},
"retorno-implicito": {
  "nome": "Retorno implícito",
  "resumo": "Uma arrow sem chaves devolve automaticamente o valor da expressão depois da seta.",
  "temas": [
    "logica"
  ]
},
"arrow-com-bloco": {
  "nome": "Arrow com bloco",
  "resumo": "Com chaves, a arrow executa instruções e precisa de return para devolver um resultado.",
  "temas": [
    "logica"
  ]
},

  "array-js": {
    "nome": "Lista de valores",
    "resumo": "Uma lista guarda vários valores em vagões numerados, na ordem escrita.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "indice-lista-js": {
    "nome": "Índice começa em zero",
    "resumo": "O primeiro índice é 0. Ler uma posição ausente devolve undefined, sem erro.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "length-lista-js": {
    "nome": "Tamanho da lista",
    "resumo": "length conta os itens; o último índice de uma lista não vazia é length - 1.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "push-pop-js": {
    "nome": "Pôr e tirar pelo fim",
    "resumo": "push acrescenta ao fim; pop tira e devolve o último item da lista.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "const-lista-js": {
    "nome": "Const e conteúdo",
    "resumo": "const impede trocar a lista inteira, mas permite alterar seus itens.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "referencia-lista-js": {
    "nome": "Duas setas, uma lista",
    "resumo": "Atribuir uma lista a outra variável compartilha a lista; não copia os vagões.",
    "temas": [
      "logica",
      "dados"
    ]
  },

  "map-lista-js": {
    "nome": "Transformar com map",
    "resumo": "map chama a função para cada item e devolve uma lista nova; a original permanece.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "filter-lista-js": {
    "nome": "Selecionar com filter",
    "resumo": "filter devolve uma lista com todos os itens cuja condição deu true, ou [] quando nenhum serve.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "find-lista-js": {
    "nome": "Achar com find",
    "resumo": "find devolve só o primeiro item que serve, ou undefined quando não encontra.",
    "temas": [
      "logica",
      "dados"
    ]
  },
"percorrer-lista-js": {
  "nome": "Percorrer os vagões",
  "resumo": "for...of entrega os valores da lista; for com índice lê lista[i] até antes de length.",
  "temas": [
    "logica",
    "dados"
  ]
},

  "objeto-js": {
    "nome": "Ficha de dados",
    "resumo": "Um objeto reúne campos nomeados: cada chave guarda um valor, não uma posição numerada.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "acesso-objeto-js": {
    "nome": "Ponto e colchetes",
    "resumo": "obj.total e obj[\"total\"] leem a mesma chave; chave ausente dá undefined.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "mudar-campo-js": {
    "nome": "Alterar e acrescentar campos",
    "resumo": "Atribuir obj.chave muda só esse campo; uma chave nova acrescenta um campo à ficha.",
    "temas": [
      "logica",
      "dados"
    ]
  },

  "lista-objetos-js": {
    "nome": "Lista de fichas",
    "resumo": "Uma lista pode guardar objetos: lista[0] escolhe uma ficha e lista[0].nome lê um campo dela.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "somar-campo-js": {
    "nome": "Somar um campo",
    "resumo": "Percorra as fichas e acrescente o campo numérico de cada item ao acumulador.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "filtrar-campo-js": {
    "nome": "Filtrar por campo",
    "resumo": "A condição do filter pode ler um campo da ficha; o resultado guarda as fichas aprovadas.",
    "temas": [
      "logica",
      "dados"
    ]
  },
  "desestruturacao-objeto-js": {
    "nome": "Separar campos em variáveis",
    "resumo": "const { nome, preco } = item lê esses campos e cria variáveis locais com seus valores.",
    "temas": [
      "logica",
      "dados"
    ]
  },
} as const satisfies Record<string, { nome: string; resumo: string; temas: readonly IdTema[]; termoIngles?: string }>;

export type IdConceito = keyof typeof CATALOGO;

export type Conceito = {
  id: IdConceito;
  nome: string;
  resumo: string;
  temas: readonly IdTema[];
  /** O termo da documentação em inglês (ausente nos conceitos antigos que ainda não foram preenchidos). */
  termoIngles?: string;
};

export const IDS_CONCEITOS = Object.keys(CATALOGO) as IdConceito[];

export const CONCEITOS: readonly Conceito[] = IDS_CONCEITOS.map((id) => ({ id, ...CATALOGO[id] }));

export function ehIdConceito(valor: unknown): valor is IdConceito {
  return typeof valor === "string" && Object.hasOwn(CATALOGO, valor);
}

export function conceitoDoId(id: IdConceito): Conceito {
  return { id, ...CATALOGO[id] };
}

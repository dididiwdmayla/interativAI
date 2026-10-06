/*
 * O currículo em dados, na ordem do mapa: Origens, Sites, Lógica, Páginas
 * vivas, Rede e Servidor, IA, Ofício e a opcional Frameworks. Espelha o
 * docs/MAPA-CURRICULAR.md (lá estão os conceitos, micro-passos, desafios e
 * confusões de cada unidade; aqui, só o que o mapa e as checagens usam).
 *
 * Unidade nova de conteúdo usa o id daqui. Zona (ou unidade) com
 * `requerMotor` não pode ter conteúdo: o testar:conteudo acusa.
 */
import type { IlhaCurriculo } from "./tipos";

const MOTOR_PAGINAS_VIVAS = "JS do jogador rodando no site-alvo e aba Aplicação";
const MOTOR_REDE = "aba Rede, servidor simulado e diagrama de requisições";
const MOTOR_OBJETOS = "classes no executor e no palco da memória (class, new, this, extends, com o objeto e os métodos dele visíveis)";
const MOTOR_ASSINCRONO =
  "executor com tempo assíncrono: setTimeout, promessas e async/await no relógio simulado, com a fila do loop de eventos visível no palco";
const MOTOR_PYTHON = "Python no navegador (Pyodide), com o Console e o palco da memória falando Python";
const MOTOR_ENTREVISTA = "entrevista-cliente";
const MOTOR_IA =
  "IA ao vivo: nas fases guiadas, código roteirizado aparecendo como se fosse digitado no editor, de forma determinística e com um bug plantado fixo; nas livres, o Gemini escrevendo ao vivo e o jogador aceitando, rejeitando ou corrigindo cada trecho";

export const CURRICULO: readonly IlhaCurriculo[] = [
  {
    id: "origens",
    nome: "Origens",
    sempreAberta: true,
    zonas: [
      {
        id: "museu",
        nome: "Museu",
        icone: "museu",
        // As salas 1 e 2 têm motor desde a rodada 36 (área exposicao); as salas 3 a 6, desde a rodada 38.
        unidades: [
          {
            id: "origens-museu-u1",
            titulo: "Como o computador entende",
            meta: "Entender como bits e instruções viram programas, da linguagem de máquina às linguagens que a gente escreve.",
            temas: ["fundamentos"],
          },
          {
            id: "origens-museu-u2",
            titulo: "Linha do tempo",
            meta: "Percorrer a história da computação, dos cartões perfurados à IA.",
            temas: ["fundamentos"],
          },
          {
            id: "origens-museu-u3",
            titulo: "Por que existem tantas linguagens",
            meta: "Ver o mesmo programa em várias linguagens, lado a lado, rodando.",
            temas: ["fundamentos", "logica"],
          },
          {
            id: "origens-museu-u4",
            titulo: "Por baixo do capô",
            meta: "Espiar o computador por dentro: memória, processador, sistema, arquivos e os portões lógicos que fazem contas.",
            temas: ["fundamentos", "desempenho", "logica"],
          },
          {
            id: "origens-museu-u5",
            titulo: "Front, back e o caminho de um clique",
            meta: "Ter a visão geral do que é front, do que é back e do caminho de um clique, dos cabos aos servidores.",
            temas: ["fundamentos", "interfaces", "servidores"],
          },
          {
            id: "origens-museu-u6",
            titulo: "Onde a programação vive",
            meta: "Descobrir onde a programação aparece no dia a dia e quais carreiras existem.",
            temas: ["fundamentos"],
          },
        ],
      },
    ],
  },
  {
    id: "sites",
    nome: "Sites",
    zonas: [
      {
        id: "elementos",
        nome: "Elementos",
        icone: "elementos",
        unidades: [
          {
            id: "sites-elementos-u1",
            titulo: "O site é seu",
            meta: "Mexer em qualquer site sozinho: achar peças pela árvore ou pela setinha, trocar textos e criar itens pelo código.",
            temas: ["interfaces", "ferramentas"],
          },
          {
            id: "sites-elementos-u2",
            titulo: "Faxina no site",
            meta: "Limpar um site bagunçado sozinho: sumir com pop-ups, esconder banners, reorganizar produtos e navegar pela família de elementos.",
            temas: ["interfaces", "ferramentas"],
          },
          {
            id: "sites-elementos-u3",
            titulo: "Títulos e textos",
            meta: "Organizar um artigo bagunçado com a hierarquia de títulos e as ênfases corretas.",
            temas: ["interfaces", "acessibilidade"],
          },
          {
            id: "sites-elementos-u4",
            titulo: "Links, imagens, id e class",
            meta: "Consertar um site com links quebrados e imagens sem descrição, e organizar elementos com id e class.",
            temas: ["interfaces", "acessibilidade"],
          },
          {
            id: "sites-elementos-u5",
            titulo: "Caixas e seções",
            meta: "Dar estrutura a um site feito só de div, trocando por header, nav, main, section, article e footer onde fizer sentido.",
            temas: ["interfaces", "acessibilidade"],
          },
          {
            id: "sites-elementos-u6",
            titulo: "Página do zero",
            meta: "Escrever uma página completa do zero: doctype, html, head (title, meta charset, meta viewport) e body.",
            temas: ["interfaces"],
          },
        ],
      },
      {
        id: "estilos",
        nome: "Estilos",
        icone: "estilos",
        unidades: [
          {
            id: "sites-estilos-u1",
            titulo: "A aba Estilos",
            meta: "Redesenhar cores e textos de um site sem tocar no HTML.",
            temas: ["interfaces", "ferramentas"],
          },
          {
            id: "sites-estilos-u2",
            titulo: "Seletores",
            meta: "Estilizar só os itens em promoção, escolhendo o seletor certo: tag, classe, id ou descendente.",
            temas: ["interfaces"],
          },
          {
            id: "sites-estilos-u3",
            titulo: "Modelo de caixa",
            meta: "Consertar cards espremidos com content, padding, border e margin.",
            temas: ["interfaces"],
          },
          {
            id: "sites-estilos-u4",
            titulo: "Por que minha regra não pega?",
            meta: "Depurar um site com três regras que não funcionam, entendendo cascata, especificidade e herança.",
            temas: ["interfaces"],
          },
          {
            id: "sites-estilos-u5",
            titulo: "Variáveis e temas",
            meta: "Criar um tema novo pro próprio jogo com variáveis CSS, salvo como Meu tema.",
            temas: ["interfaces"],
          },
        ],
      },
      {
        id: "layout",
        nome: "Layout",
        icone: "layout",
        unidades: [
          {
            id: "sites-layout-u1",
            titulo: "Display",
            meta: "Montar um menu horizontal entendendo block, inline, inline-block e none.",
            temas: ["interfaces"],
          },
          {
            id: "sites-layout-u2",
            titulo: "Flexbox",
            meta: "Alinhar uma barra de navegação e uma fileira de cards com flexbox.",
            temas: ["interfaces"],
          },
          {
            id: "sites-layout-u3",
            titulo: "Grid",
            meta: "Montar o layout de uma revista com colunas, linhas e áreas de grid.",
            temas: ["interfaces"],
          },
          {
            id: "sites-layout-u4",
            titulo: "Posição e camadas",
            meta: "Pôr um selo de promoção sobre o card e deixar o cabeçalho fixo com position e z-index.",
            temas: ["interfaces"],
          },
        ],
      },
      {
        id: "responsivo",
        nome: "Responsivo",
        icone: "responsivo",
        unidades: [
          {
            id: "sites-responsivo-u1",
            titulo: "Modo dispositivo",
            meta: "Ver um site no celular, no tablet e no PC e diagnosticar três problemas no celular.",
            temas: ["interfaces", "ferramentas"],
          },
          {
            id: "sites-responsivo-u2",
            titulo: "Media queries e mobile first",
            meta: "Deixar o site de um restaurante bom no celular com media queries.",
            temas: ["interfaces", "acessibilidade"],
          },
        ],
      },
      {
        id: "publicar",
        nome: "Publicar",
        icone: "publicar",
        unidades: [
          {
            id: "sites-publicar-u1",
            titulo: "Acessibilidade e Lighthouse",
            meta: "Levar um site de nota baixa a nota alta na auditoria de acessibilidade.",
            temas: ["acessibilidade", "ferramentas"],
          },
          {
            id: "sites-publicar-u2",
            titulo: "Do jogo pro mundo",
            meta: "Publicar o próprio site pessoal, feito em arquivos de verdade, e ter um link.",
            temas: ["ferramentas", "servidores"],
          },
        ],
      },
      {
        // Zona opcional (docs/MAPA-CURRICULAR.md, "Ser encontrado"): não tranca a Lógica.
        id: "ser-encontrado",
        nome: "Ser encontrado",
        icone: "busca",
        opcional: true,
        unidades: [
          {
            id: "sites-ser-encontrado-u1",
            titulo: "Como o Google acha seu site",
            meta: "Fazer uma página aparecer do jeito certo na busca: título, descrição e sem noindex esquecido.",
            temas: ["presenca-digital"],
          },
          {
            id: "sites-ser-encontrado-u2",
            titulo: "SEO na página",
            meta: "Deixar uma página boa para quem busca: títulos, textos, alt, links e velocidade.",
            temas: ["presenca-digital", "acessibilidade", "desempenho"],
          },
          {
            id: "sites-ser-encontrado-u3",
            titulo: "Seu negócio no mapa",
            meta: "Ligar o site ao negócio no mapa com dados iguais em todo lugar e dados estruturados.",
            temas: ["presenca-digital", "dados"],
          },
          {
            id: "sites-ser-encontrado-u4",
            titulo: "Medir quem chega",
            meta: "Saber de onde vêm as visitas e o que elas fazem, com links rastreáveis e eventos de conversão.",
            temas: ["presenca-digital", "dados"],
          },
          {
            id: "sites-ser-encontrado-u5",
            titulo: "Anúncio pago por dentro",
            meta: "Entender o leilão do anúncio e ver por que uma página ruim queima o dinheiro da campanha.",
            temas: ["presenca-digital", "desempenho"],
          },
        ],
      },
    ],
  },
  {
    id: "logica",
    nome: "Lógica",
    // Motor da parte A pronto (rodada 17): as zonas não pedem mais motor; só as unidades da parte B.
    // Ordem das zonas (docs/MAPA-CURRICULAR.md, "Ilha 2: Lógica", explica cada troca):
    // as ferramentas da linguagem primeiro, depois resolver problemas com elas,
    // o depurador antes dos algoritmos e as estruturas por último.
    zonas: [
      {
        id: "primeiros-comandos",
        nome: "Primeiros comandos",
        icone: "console",
        unidades: [
          {
            id: "logica-primeiros-comandos-u1",
            titulo: "O Console calcula",
            meta: "Usar o Console como calculadora e guardar os resultados em variáveis com nomes bons.",
            temas: ["logica", "dados"],
          },
          {
            id: "logica-primeiros-comandos-u2",
            titulo: "Textos",
            meta: "Escrever textos entre aspas, juntar textos e montar frases com valores dentro.",
            temas: ["logica", "dados"],
          },
          {
            id: "logica-primeiros-comandos-u3",
            titulo: "Tipos",
            meta: "Descobrir o tipo de cada valor com typeof e entender por que \"2\" + 2 dá \"22\".",
            temas: ["logica", "dados"],
          },
        ],
      },
      {
        id: "decisoes",
        nome: "Decisões",
        icone: "console",
        unidades: [
          {
            id: "logica-decisoes-u1",
            titulo: "Verdadeiro ou falso",
            meta: "Fazer perguntas ao programa com comparações e receber true ou false.",
            temas: ["logica"],
          },
          {
            id: "logica-decisoes-u2",
            titulo: "Portões lógicos",
            meta: "Montar portões E, OU e NÃO para uma saída acontecer e ver o mesmo circuito virar código com &&, || e !.",
            temas: ["logica", "fundamentos"],
          },
          {
            id: "logica-decisoes-u3",
            titulo: "Se, senão",
            meta: "Fazer o programa escolher um caminho com if, else if e else.",
            temas: ["logica"],
          },
          {
            id: "logica-decisoes-u4",
            titulo: "Verdadeiro disfarçado",
            meta: "Prever quando um valor que não é booleano conta como verdadeiro ou falso num if.",
            temas: ["logica"],
          },
        ],
      },
      {
        id: "repeticao",
        nome: "Repetição",
        icone: "console",
        unidades: [
          {
            id: "logica-repeticao-u1",
            titulo: "Enquanto for verdade",
            meta: "Repetir uma tarefa com while, contando as voltas, e reconhecer um loop que nunca para.",
            temas: ["logica"],
          },
          {
            id: "logica-repeticao-u2",
            titulo: "for e for...of",
            meta: "Repetir um número certo de vezes com for e passar por cada item com for...of.",
            temas: ["logica"],
          },
          {
            id: "logica-repeticao-u3",
            titulo: "Contar e somar",
            meta: "Usar contadores e acumuladores para contar, somar e achar o maior valor.",
            temas: ["logica", "dados"],
          },
        ],
      },
      {
        id: "funcoes",
        nome: "Funções",
        icone: "console",
        unidades: [
          {
            id: "logica-funcoes-u1",
            titulo: "Criar e chamar",
            meta: "Guardar um passo a passo numa função e usar de novo quando quiser.",
            temas: ["logica"],
          },
          {
            id: "logica-funcoes-u2",
            titulo: "Parâmetros e retorno",
            meta: "Dar valores para a função trabalhar e receber a resposta de volta com return.",
            temas: ["logica"],
          },
          {
            id: "logica-funcoes-u3",
            titulo: "Escopo",
            meta: "Saber onde cada variável existe e por que a de dentro da função some quando ela termina.",
            temas: ["logica"],
          },
          {
            id: "logica-funcoes-u4",
            titulo: "Arrow functions",
            meta: "Escrever funções curtas com a seta => e reconhecer as duas formas no código dos outros.",
            temas: ["logica"],
          },
        ],
      },
      {
        id: "listas-e-objetos",
        nome: "Listas e objetos",
        icone: "console",
        unidades: [
          {
            id: "logica-listas-e-objetos-u1",
            titulo: "Listas",
            meta: "Guardar vários valores numa lista, pegar cada um pelo índice e pôr e tirar itens.",
            temas: ["logica", "dados"],
          },
          {
            id: "logica-listas-e-objetos-u2",
            titulo: "Percorrer listas",
            meta: "Passar por todos os itens de uma lista e transformar, filtrar e achar itens.",
            temas: ["logica", "dados"],
          },
          {
            id: "logica-listas-e-objetos-u3",
            titulo: "Objetos",
            meta: "Descrever uma coisa com chaves e valores, e ler e mudar cada campo.",
            temas: ["logica", "dados"],
          },
          {
            id: "logica-listas-e-objetos-u4",
            titulo: "Listas de objetos",
            meta: "Organizar o cardápio de uma padaria como dados e responder perguntas sobre ele.",
            temas: ["dados", "logica"],
          },
        ],
      },
      {
        id: "resolvendo-problemas",
        nome: "Resolvendo problemas",
        icone: "fontes",
        unidades: [
          {
            id: "logica-resolvendo-problemas-u1",
            titulo: "Decompor um problema",
            meta: "Quebrar um problema grande em passos pequenos, que dá para resolver um de cada vez.",
            temas: ["logica"],
          },
          {
            id: "logica-resolvendo-problemas-u2",
            titulo: "Pseudocódigo",
            meta: "Escrever o passo a passo em português antes de escrever o código.",
            temas: ["logica"],
          },
          {
            id: "logica-resolvendo-problemas-u3",
            titulo: "Ordenar os passos",
            meta: "Pôr os passos de um programa na ordem certa e ver o que quebra quando a ordem muda.",
            temas: ["logica"],
          },
          {
            id: "logica-resolvendo-problemas-u4",
            titulo: "Testar com exemplos",
            meta: "Escolher exemplos que provam que o programa funciona, inclusive os casos esquisitos.",
            temas: ["logica", "ferramentas"],
          },
        ],
      },
      {
        id: "depuracao",
        nome: "Depuração",
        icone: "fontes",
        unidades: [
          {
            id: "logica-depuracao-u1",
            titulo: "Ler a mensagem de erro",
            meta: "Ler o que o erro diz, achar a linha e consertar sem chutar.",
            temas: ["logica", "ferramentas"],
          },
          {
            id: "logica-depuracao-u2",
            titulo: "Pontos de parada",
            meta: "Parar o programa numa linha com um ponto de parada, na aba Fontes, e olhar o que está acontecendo.",
            temas: ["logica", "ferramentas"],
          },
          {
            id: "logica-depuracao-u3",
            titulo: "Passo a passo",
            meta: "Andar uma linha de cada vez, observar as variáveis e achar onde o valor fica errado.",
            temas: ["logica", "ferramentas"],
          },
          {
            id: "logica-depuracao-u4",
            titulo: "Observar variáveis",
            meta: "Comparar valor, tipo e escopo em cada pausa e confirmar a hipótese antes de consertar.",
            temas: ["logica", "ferramentas"],
          },
          {
            id: "logica-depuracao-u5",
            titulo: "Chamado: o estoque que não fecha",
            meta: "Atender um chamado de verdade: reproduzir um defeito vago, achar a causa e consertar sem quebrar o resto.",
            temas: ["logica", "ferramentas"],
          },
          {
            id: "logica-depuracao-u6",
            titulo: "Chamado: a agenda do salão",
            meta: "Consertar um software com defeito, provar o conserto com os casos antigos e entregar o relatório.",
            temas: ["logica", "ferramentas"],
          },
        ],
      },
      {
        id: "algoritmos-essenciais",
        nome: "Algoritmos essenciais",
        icone: "console",
        unidades: [
          {
            id: "logica-algoritmos-essenciais-u1",
            titulo: "Buscar",
            meta: "Achar um item numa lista, olhando um por um e pela busca binária.",
            temas: ["logica", "desempenho"],
          },
          {
            id: "logica-algoritmos-essenciais-u2",
            titulo: "Ordenar",
            meta: "Ordenar uma lista vendo cada troca acontecer e comparar jeitos diferentes de fazer isso.",
            temas: ["logica", "desempenho"],
          },
          {
            id: "logica-algoritmos-essenciais-u3",
            titulo: "Recursão",
            meta: "Resolver um problema com uma função que chama ela mesma.",
            temas: ["logica"],
          },
          {
            id: "logica-algoritmos-essenciais-u4",
            titulo: "Por que isso trava?",
            meta: "Entender, sem fórmula, por que um programa que voa com dez itens trava com um milhão.",
            temas: ["desempenho", "logica"],
          },
        ],
      },
      {
        id: "estruturas-de-dados",
        nome: "Estruturas de dados",
        icone: "aplicacao",
        unidades: [
          {
            id: "logica-estruturas-de-dados-u1",
            titulo: "Pilha",
            meta: "Desfazer ações retirando primeiro o último item que entrou.",
            temas: ["dados", "logica"],
          },
          {
            id: "logica-estruturas-de-dados-u2",
            titulo: "Fila",
            meta: "Atender na ordem de chegada e evitar o trabalho escondido de shift em listas enormes.",
            temas: ["dados", "logica", "desempenho"],
          },
          {
            id: "logica-estruturas-de-dados-u3",
            titulo: "Dicionário (Map)",
            meta: "Guardar pares num Map e comparar muitas consultas has com includes.",
            temas: ["dados", "logica", "desempenho"],
          },
          {
            id: "logica-estruturas-de-dados-u4",
            titulo: "Árvore",
            meta: "Percorrer nós e filhos com recursão e reconhecer o DOM como árvore.",
            temas: ["dados", "logica"],
          },
        ],
      },
      {
        id: "programa-de-verdade",
        nome: "Programa de verdade",
        icone: "fontes",
        unidades: [
          {
            // O contrato da ilha (rodada 29): o formato contrato, com o Levar pro mundo em .js.
            id: "logica-programa-de-verdade-u1",
            titulo: "O contrato da padaria",
            meta: "Ser contratado pela Padaria Pão de Mel: entender o pedido, programar a vitrine, aguentar a mudança e entregar.",
            temas: ["logica"],
          },
        ],
      },
    ],
  },
  {
    id: "paginas-vivas",
    nome: "Páginas vivas",
    zonas: [
      // Primeiro, porque os elementos da página SÃO objetos com métodos
      // (elemento.classList.add): quem já sabe o que é um objeto com métodos
      // lê o DOM como mais um objeto, e não como mágica.
      {
        id: "objetos",
        nome: "Objetos e classes",
        icone: "console",
        requerMotor: MOTOR_OBJETOS,
        unidades: [
          {
            id: "paginas-vivas-objetos-u1",
            titulo: "Classes e objetos",
            meta: "Criar vários objetos do mesmo molde com uma classe, cada um com os seus dados e os seus métodos.",
            temas: ["logica", "dados"],
          },
          {
            id: "paginas-vivas-objetos-u2",
            titulo: "Encapsulamento",
            meta: "Esconder o que é de dentro do objeto e deixar só os métodos que os outros podem usar.",
            temas: ["logica", "seguranca"],
          },
          {
            id: "paginas-vivas-objetos-u3",
            titulo: "Herança e composição",
            meta: "Reaproveitar um molde estendendo outro ou juntando objetos menores, e saber quando cada um vale.",
            temas: ["logica"],
          },
        ],
      },
      {
        id: "dom",
        nome: "DOM pelo código",
        icone: "console",
        requerMotor: MOTOR_PAGINAS_VIVAS,
        unidades: [
          {
            id: "paginas-vivas-dom-u1",
            titulo: "DOM pelo código",
            meta: "Mudar a página pelo código: achar elementos e trocar textos, classes e estilos.",
            temas: ["interfaces", "logica"],
          },
        ],
      },
      // Antes de eventos (um clique é um aviso que chega depois) e do fetch da
      // Rede e Servidor (a resposta chega depois): o "depois" vem primeiro.
      {
        id: "assincrono",
        nome: "Programação assíncrona",
        icone: "console",
        requerMotor: MOTOR_ASSINCRONO,
        unidades: [
          {
            id: "paginas-vivas-assincrono-u1",
            titulo: "O loop de eventos",
            meta: "Entender pela intuição por que o código não espera parado e o que é a fila do loop de eventos.",
            temas: ["logica", "desempenho"],
          },
          {
            id: "paginas-vivas-assincrono-u2",
            titulo: "Temporizadores",
            meta: "Agendar trabalho para depois com setTimeout e setInterval, e cancelar quando não precisar mais.",
            temas: ["logica", "interfaces"],
          },
          {
            id: "paginas-vivas-assincrono-u3",
            titulo: "Promessas e async/await",
            meta: "Esperar uma resposta que chega depois com promessas e async/await, tratando o caso em que ela falha.",
            temas: ["logica", "apis"],
          },
        ],
      },
      {
        id: "eventos",
        nome: "Eventos",
        icone: "console",
        requerMotor: MOTOR_PAGINAS_VIVAS,
        unidades: [
          {
            id: "paginas-vivas-eventos-u1",
            titulo: "Eventos",
            meta: "Fazer a página reagir a cliques e teclas.",
            temas: ["interfaces", "logica"],
          },
        ],
      },
      {
        id: "formularios",
        nome: "Formulários",
        icone: "elementos",
        requerMotor: MOTOR_PAGINAS_VIVAS,
        unidades: [
          {
            id: "paginas-vivas-formularios-u1",
            titulo: "Formulários",
            meta: "Montar um formulário com inputs, labels e validação.",
            temas: ["interfaces", "acessibilidade", "dados"],
          },
        ],
      },
      {
        id: "guardar-dados",
        nome: "Guardar dados",
        icone: "aplicacao",
        requerMotor: MOTOR_PAGINAS_VIVAS,
        unidades: [
          {
            id: "paginas-vivas-guardar-dados-u1",
            titulo: "Guardar dados",
            meta: "Guardar dados no navegador com localStorage e conferir na aba Aplicação.",
            temas: ["dados"],
          },
        ],
      },
      {
        id: "projeto-ponte",
        nome: "Projeto-ponte",
        icone: "publicar",
        requerMotor: `${MOTOR_PAGINAS_VIVAS}; tipo de fase projeto-ponte`,
        unidades: [
          {
            id: "paginas-vivas-projeto-ponte-u1",
            titulo: "Lista de tarefas",
            meta: "Fazer um app de lista de tarefas fora do jogo.",
            temas: ["interfaces", "logica", "dados"],
          },
        ],
      },
    ],
  },
  {
    id: "rede-servidor",
    nome: "Rede e Servidor",
    zonas: [
      {
        id: "caminho-de-um-clique",
        nome: "O caminho de um clique",
        icone: "rede",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-caminho-de-um-clique-u1",
            titulo: "O caminho de um clique",
            meta: "Seguir um clique pela aba Rede: pedido HTTP, resposta e status.",
            temas: ["servidores", "apis", "ferramentas"],
          },
        ],
      },
      {
        id: "apis-e-json",
        nome: "APIs e JSON",
        icone: "rede",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-apis-e-json-u1",
            titulo: "APIs e JSON",
            meta: "Buscar dados de uma API com fetch e mostrar na página.",
            temas: ["apis", "dados"],
          },
          {
            id: "rede-servidor-apis-e-json-u2",
            titulo: "APIs REST",
            meta: "Conversar com uma API REST usando os métodos e os endereços certos.",
            temas: ["apis", "servidores"],
          },
        ],
      },
      {
        id: "servidor",
        nome: "Servidor",
        icone: "terminal",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-servidor-u1",
            titulo: "Servidor",
            meta: "Escrever um servidor Node básico, simulado, que responde pedidos.",
            temas: ["servidores"],
          },
        ],
      },
      {
        id: "banco-de-dados",
        nome: "Banco de dados",
        icone: "aplicacao",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-banco-de-dados-u1",
            titulo: "Banco de dados",
            meta: "Criar, ler, atualizar e apagar dados num banco.",
            temas: ["dados", "servidores"],
          },
          {
            id: "rede-servidor-banco-de-dados-u2",
            titulo: "SQL e NoSQL",
            meta: "Comparar um banco SQL e um NoSQL e escolher o certo para cada caso.",
            temas: ["dados"],
          },
        ],
      },
      {
        id: "login-e-autenticacao",
        nome: "Login e autenticação",
        icone: "seguranca",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-login-e-autenticacao-u1",
            titulo: "Sessões e tokens",
            meta: "Fazer o login funcionar com sessão ou token e entender o que cada um guarda.",
            temas: ["seguranca", "servidores", "apis"],
          },
        ],
      },
      {
        id: "seguranca",
        nome: "Segurança",
        icone: "seguranca",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-seguranca-u1",
            titulo: "Senhas e hash",
            meta: "Guardar senhas do jeito certo, com hash, e entender por que nunca em texto puro.",
            temas: ["seguranca"],
          },
          {
            id: "rede-servidor-seguranca-u2",
            titulo: "Chaves e segredos",
            meta: "Proteger as chaves e os segredos do projeto para que nunca vazem.",
            temas: ["seguranca"],
          },
          {
            id: "rede-servidor-seguranca-u3",
            titulo: "Injeção e XSS",
            meta: "Achar e fechar brechas de injeção e de XSS num site de mentirinha.",
            temas: ["seguranca", "dados"],
          },
        ],
      },
      // Depois de Segurança (proteger os dados) e antes do projeto (que guarda
      // dados de gente de verdade): o que se PODE fazer com eles. Ponte com a
      // zona Custo e privacidade da ilha IA.
      {
        id: "lgpd-e-etica",
        nome: "LGPD e ética",
        icone: "seguranca",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-lgpd-e-etica-u1",
            titulo: "Dados pessoais e consentimento",
            meta: "Reconhecer o que é dado pessoal e pedir consentimento de verdade, sem caixinha marcada por padrão.",
            temas: ["seguranca", "dados"],
          },
          {
            id: "rede-servidor-lgpd-e-etica-u2",
            titulo: "O que pode e o que não pode",
            meta: "Decidir o que o sistema pode guardar, por quanto tempo e com quem dividir, e atender quem pede para apagar.",
            temas: ["seguranca", "dados", "servidores"],
          },
        ],
      },
      {
        id: "front-e-back",
        nome: "Front e back juntos",
        icone: "rede",
        requerMotor: MOTOR_REDE,
        unidades: [
          {
            id: "rede-servidor-front-e-back-u1",
            titulo: "Front e back juntos",
            meta: "Ligar uma página ao próprio servidor num projeto completo.",
            temas: ["apis", "servidores", "interfaces"],
          },
        ],
      },
    ],
  },
  // Depois de Rede e Servidor: com a web inteira na mão (front e back em
  // JavaScript), a segunda linguagem mostra que o conceito é o mesmo e só a
  // escrita muda. Vem antes da IA porque julgar código gerado em mais de uma
  // linguagem pede ter lido mais de uma.
  {
    id: "python",
    nome: "Python",
    zonas: [
      {
        id: "fundamentos",
        nome: "Fundamentos em Python",
        icone: "console",
        requerMotor: MOTOR_PYTHON,
        unidades: [
          {
            id: "python-fundamentos-u1",
            titulo: "O mesmo, em Python",
            meta: "Escrever em Python o que você já faz em JavaScript: variáveis, textos, contas e print.",
            temas: ["logica"],
          },
          {
            id: "python-fundamentos-u2",
            titulo: "Decisões e repetição",
            meta: "Usar if, for e while em Python, onde a indentação é a regra e não o enfeite.",
            temas: ["logica"],
          },
          {
            id: "python-fundamentos-u3",
            titulo: "Funções, listas e dicionários",
            meta: "Organizar o programa em funções e guardar dados em listas e dicionários do Python.",
            temas: ["logica", "dados"],
          },
        ],
      },
      {
        id: "objetos",
        nome: "Orientação a objetos",
        icone: "console",
        requerMotor: MOTOR_PYTHON,
        unidades: [
          {
            id: "python-objetos-u1",
            titulo: "Classes em Python",
            meta: "Criar classes com __init__ e self, e reconhecer a mesma ideia das classes do JavaScript.",
            temas: ["logica", "dados"],
          },
        ],
      },
      {
        id: "dados",
        nome: "Dados",
        icone: "aplicacao",
        requerMotor: `${MOTOR_PYTHON}; arquivos de mentirinha e gráficos simples`,
        unidades: [
          {
            id: "python-dados-u1",
            titulo: "Arquivos e CSV",
            meta: "Ler e escrever arquivos e planilhas CSV para responder perguntas sobre os dados.",
            temas: ["dados"],
          },
          {
            id: "python-dados-u2",
            titulo: "Gráficos simples",
            meta: "Transformar uma tabela num gráfico simples que conta o que os números dizem.",
            temas: ["dados", "interfaces"],
          },
        ],
      },
      {
        id: "outras-linguagens",
        nome: "Outras linguagens",
        icone: "fontes",
        requerMotor: "comparador de linguagens (o mesmo programa lado a lado), com a memória do C e a compilação simuladas",
        unidades: [
          {
            id: "python-outras-linguagens-u1",
            titulo: "C: memória e compilar",
            meta: "Ver um programa em C ser compilado e cuidar da memória que o JavaScript e o Python cuidam por você.",
            temas: ["fundamentos", "desempenho"],
          },
          {
            id: "python-outras-linguagens-u2",
            titulo: "Java e C#",
            meta: "Ler um programa em Java ou C#, com tipos declarados e classes em tudo, e achar o que você já conhece.",
            temas: ["logica"],
          },
          {
            id: "python-outras-linguagens-u3",
            titulo: "O conceito é o mesmo",
            meta: "Comparar o mesmo problema em várias linguagens e aprender uma linguagem nova pelo que muda na escrita.",
            temas: ["fundamentos", "logica"],
          },
        ],
      },
    ],
  },
  {
    id: "ia",
    nome: "IA",
    zonas: [
      {
        id: "como-funciona",
        nome: "Como um modelo funciona",
        icone: "ia",
        requerMotor: MOTOR_IA,
        unidades: [
          {
            id: "ia-como-funciona-u1",
            titulo: "Como a IA escreve",
            meta: "Entender, pela intuição e sem matemática, como um modelo de linguagem escolhe a próxima palavra.",
            temas: ["ia"],
          },
        ],
      },
      {
        id: "especificacao-e-prompt",
        nome: "Especificação e prompt",
        icone: "ia",
        requerMotor: MOTOR_IA,
        unidades: [
          {
            id: "ia-especificacao-e-prompt-u1",
            titulo: "Pedir do jeito certo",
            meta: "Escrever uma especificação clara e um bom prompt para a IA fazer o que você quer.",
            temas: ["ia"],
          },
        ],
      },
      {
        id: "ia-ao-vivo",
        nome: "IA ao vivo",
        icone: "ia",
        requerMotor: MOTOR_IA,
        unidades: [
          {
            id: "ia-ia-ao-vivo-u1",
            titulo: "Revisar código gerado",
            meta: "Ler com calma o código que a IA escreveu antes de aceitar.",
            temas: ["ia", "logica"],
          },
          {
            id: "ia-ia-ao-vivo-u2",
            titulo: "Achar o bug da IA",
            meta: "Encontrar e corrigir o erro escondido no código que a IA digitou.",
            temas: ["ia", "logica"],
          },
          {
            id: "ia-ia-ao-vivo-u3",
            titulo: "Quando não confiar",
            meta: "Reconhecer quando a IA inventa coisas e conferir na fonte antes de usar.",
            temas: ["ia", "seguranca"],
          },
        ],
      },
      {
        id: "agentes",
        nome: "Agentes",
        icone: "ia",
        requerMotor: MOTOR_IA,
        unidades: [
          {
            id: "ia-agentes-u1",
            titulo: "Agentes",
            meta: "Entender o que um agente de IA faz sozinho e onde você continua no comando.",
            temas: ["ia", "ferramentas"],
          },
        ],
      },
      {
        id: "custo-e-privacidade",
        nome: "Custo e privacidade",
        icone: "ia",
        requerMotor: MOTOR_IA,
        unidades: [
          {
            id: "ia-custo-e-privacidade-u1",
            titulo: "Custo e privacidade",
            meta: "Usar IA sabendo quanto custa e sem nunca colar chaves ou dados sensíveis.",
            temas: ["ia", "seguranca"],
          },
        ],
      },
    ],
  },
  {
    id: "oficio",
    nome: "Ofício",
    zonas: [
      {
        id: "terminal",
        nome: "Terminal",
        icone: "terminal",
        requerMotor: "terminal simulado (comandos e pastas de mentirinha)",
        unidades: [
          {
            id: "oficio-terminal-u1",
            titulo: "Terminal",
            meta: "Andar pelas pastas e rodar comandos no terminal.",
            temas: ["ferramentas"],
          },
        ],
      },
      {
        id: "git-e-github",
        nome: "Git e GitHub",
        icone: "git",
        requerMotor: "git e repositório remoto simulados",
        unidades: [
          {
            id: "oficio-git-e-github-u1",
            titulo: "Git e GitHub",
            meta: "Guardar versões do projeto com git e mandar para o GitHub.",
            temas: ["ferramentas"],
          },
        ],
      },
      {
        id: "git-em-equipe",
        nome: "Git em equipe",
        icone: "git",
        requerMotor: "git e repositório remoto simulados, com branches, pull request e revisão de código",
        unidades: [
          {
            id: "oficio-git-em-equipe-u1",
            titulo: "Branches",
            meta: "Trabalhar em paralelo com branches sem atrapalhar ninguém.",
            temas: ["ferramentas"],
          },
          {
            id: "oficio-git-em-equipe-u2",
            titulo: "Pull request e revisão",
            meta: "Abrir um pull request e revisar o código de outra pessoa com cuidado.",
            temas: ["ferramentas"],
          },
        ],
      },
      {
        id: "editor-e-documentacao",
        nome: "Editor real e documentação",
        icone: "fontes",
        requerMotor: "tipo de fase projeto-ponte (trabalho feito fora do jogo, com checklist)",
        unidades: [
          {
            id: "oficio-editor-e-documentacao-u1",
            titulo: "Editor real e documentação",
            meta: "Trabalhar num editor de código de verdade e achar respostas na documentação.",
            temas: ["ferramentas"],
          },
        ],
      },
      {
        id: "ler-codigo-dos-outros",
        nome: "Ler código dos outros",
        icone: "fontes",
        requerMotor: "projeto com vários arquivos, navegável dentro do jogo",
        unidades: [
          {
            id: "oficio-ler-codigo-dos-outros-u1",
            titulo: "Ler código dos outros",
            meta: "Entrar num projeto que você não escreveu e descobrir por onde começar.",
            temas: ["ferramentas", "logica"],
          },
        ],
      },
      {
        id: "typescript",
        nome: "TypeScript",
        icone: "fontes",
        requerMotor: "TypeScript rodando no jogo, com os erros de tipo aparecendo no editor",
        unidades: [
          {
            id: "oficio-typescript-u1",
            titulo: "TypeScript",
            meta: "Dar tipos ao JavaScript e deixar o editor avisar do erro antes de rodar.",
            temas: ["logica", "ferramentas"],
          },
        ],
      },
      {
        id: "testes-automatizados",
        nome: "Testes automatizados",
        icone: "console",
        requerMotor: "executor de testes dentro do jogo (verde e vermelho)",
        unidades: [
          {
            id: "oficio-testes-automatizados-u1",
            titulo: "Testes automatizados",
            meta: "Escrever testes que conferem sozinhos se o código continua funcionando.",
            temas: ["ferramentas", "logica"],
          },
        ],
      },
      // Depois de testes: com código de verdade e testes para proteger,
      // dá para reorganizar sem medo. A engenharia vem na intuição.
      {
        id: "pensando-sistemas",
        nome: "Pensando sistemas",
        icone: "componentes",
        requerMotor: "projeto com vários arquivos, navegável dentro do jogo (o mesmo de Ler código dos outros)",
        unidades: [
          {
            id: "oficio-pensando-sistemas-u1",
            titulo: "Camadas e responsabilidades",
            meta: "Separar o projeto em camadas, cada parte com uma responsabilidade só.",
            temas: ["ferramentas", "logica"],
          },
          {
            id: "oficio-pensando-sistemas-u2",
            titulo: "Código limpo",
            meta: "Deixar o código fácil de ler e de mudar: nomes que explicam, funções pequenas e nada repetido à toa.",
            temas: ["ferramentas", "logica"],
          },
          {
            id: "oficio-pensando-sistemas-u3",
            titulo: "Arquitetura na intuição",
            meta: "Desenhar como as partes de um sistema conversam antes de escrever, e mudar o desenho quando o problema muda.",
            temas: ["ferramentas", "servidores"],
          },
        ],
      },
      {
        id: "como-equipes-trabalham",
        nome: "Como equipes trabalham",
        icone: "git",
        requerMotor: "quadro de tarefas e revisão de código simulados (sobre o git em equipe simulado)",
        unidades: [
          {
            id: "oficio-como-equipes-trabalham-u1",
            titulo: "Tarefas e estimativa",
            meta: "Quebrar um pedido em tarefas que cabem num dia e estimar com honestidade, dizendo o que não se sabe.",
            temas: ["ferramentas"],
          },
          {
            id: "oficio-como-equipes-trabalham-u2",
            titulo: "Revisão e o básico do ágil",
            meta: "Revisar e ser revisado com cuidado, e entender o ciclo curto de planejar, fazer, mostrar e ajustar.",
            temas: ["ferramentas"],
          },
        ],
      },
      {
        id: "variaveis-de-ambiente",
        nome: "Variáveis de ambiente",
        icone: "terminal",
        requerMotor: "terminal simulado com variáveis de ambiente",
        unidades: [
          {
            id: "oficio-variaveis-de-ambiente-u1",
            titulo: "Variáveis de ambiente",
            meta: "Guardar configurações e segredos fora do código com variáveis de ambiente.",
            temas: ["seguranca", "servidores", "ferramentas"],
          },
        ],
      },
      // Depois das variáveis de ambiente (a configuração fora do código) e
      // antes do deploy: o caminho do código até o servidor, no básico.
      {
        id: "da-maquina-a-producao",
        nome: "Da máquina à produção",
        icone: "terminal",
        requerMotor: "esteira de integração contínua, contêiner e logs simulados",
        unidades: [
          {
            id: "oficio-da-maquina-a-producao-u1",
            titulo: "Integração contínua",
            meta: "Fazer os testes rodarem sozinhos a cada mudança e barrar o que quebra antes de chegar no ar.",
            temas: ["ferramentas", "servidores"],
          },
          {
            id: "oficio-da-maquina-a-producao-u2",
            titulo: "Contêineres e logs",
            meta: "Empacotar o app para rodar igual em qualquer máquina e ler os logs para descobrir o que aconteceu no servidor.",
            temas: ["ferramentas", "servidores"],
          },
        ],
      },
      {
        id: "ia-com-criterio",
        nome: "IA com critério",
        icone: "console",
        requerMotor: "tipo de fase para avaliar respostas de IA",
        unidades: [
          {
            id: "oficio-ia-com-criterio-u1",
            titulo: "IA com critério",
            meta: "Usar IA para programar conferindo o que ela entrega.",
            temas: ["ia", "ferramentas"],
          },
        ],
      },
      {
        id: "deploy",
        nome: "Deploy",
        icone: "publicar",
        requerMotor: "tipo de fase projeto-ponte e exportar o projeto do jogador",
        unidades: [
          {
            id: "oficio-deploy-u1",
            titulo: "Deploy",
            meta: "Publicar um projeto na internet e ter um link.",
            temas: ["servidores", "ferramentas"],
          },
          {
            id: "oficio-deploy-u2",
            titulo: "Projeto final",
            meta: "Construir e publicar um app completo, front e back, a partir de uma página em branco, sem roteiro.",
            temas: ["interfaces", "servidores", "apis", "dados"],
          },
        ],
      },
      {
        id: "portfolio",
        nome: "Portfólio e aprender sozinho",
        icone: "publicar",
        requerMotor: "tipo de fase projeto-ponte (trabalho feito fora do jogo, com checklist)",
        unidades: [
          {
            id: "oficio-portfolio-u1",
            titulo: "Portfólio e aprender sozinho",
            meta: "Montar o portfólio com os seus projetos e um plano para continuar aprendendo sozinho.",
            temas: ["ferramentas"],
          },
        ],
      },
      // A última zona do núcleo: levar o que se aprendeu para o trabalho.
      // Ligada à zona Ser encontrado da Ilha Sites (o freelancer precisa
      // ser achado) e à Portfólio, logo antes.
      {
        id: "carreira",
        nome: "Carreira",
        icone: "publicar",
        requerMotor: `${MOTOR_ENTREVISTA} (entrevista com o cliente) e entrevista técnica simulada`,
        unidades: [
          {
            id: "oficio-carreira-u1",
            titulo: "Entrevista técnica",
            meta: "Programar na frente de alguém pensando em voz alta, perguntando antes de começar e testando no fim.",
            temas: ["ferramentas", "logica"],
          },
          {
            id: "oficio-carreira-u2",
            titulo: "Portfólio que conta história",
            meta: "Apresentar os seus projetos dizendo o problema, o que você decidiu e o que aprendeu.",
            temas: ["ferramentas", "presenca-digital"],
          },
          {
            id: "oficio-carreira-u3",
            titulo: "O caminho freelancer",
            meta: "Descobrir o problema do cliente numa conversa, fazer o orçamento e fechar um contrato claro.",
            temas: ["ferramentas", "presenca-digital"],
          },
        ],
      },
    ],
  },
  {
    id: "frameworks",
    nome: "Frameworks",
    opcional: true,
    zonas: [
      {
        id: "react-e-next",
        nome: "React e Next",
        icone: "componentes",
        requerMotor: "a detalhar depois do núcleo",
        unidades: [
          {
            id: "frameworks-react-e-next-u1",
            titulo: "React",
            meta: "Montar uma página com componentes React.",
            temas: ["interfaces", "logica"],
          },
          {
            id: "frameworks-react-e-next-u2",
            titulo: "Next",
            meta: "Criar um site com páginas e rotas usando Next.",
            temas: ["interfaces", "servidores", "desempenho"],
          },
        ],
      },
    ],
  },
];

/**
 * Ilhas próprias das trilhas em construção (Jogos e Automação industrial,
 * ver src/curriculo/trilhas.ts): só nomeadas, sem zonas nem conteúdo. No
 * mundo, aparecem "em construção" quando a trilha delas é a escolhida. A
 * Automação industrial vai receber o protótipo InterativAIPLUS, portado
 * depois que a camada de trilhas e a fábrica estiverem estáveis.
 */
export const ILHAS_FUTURAS: readonly IlhaCurriculo[] = [
  { id: "jogos-primeiro-jogo", nome: "Primeiro jogo", zonas: [] },
  { id: "jogos-graficos", nome: "Gráficos e animação", zonas: [] },
  { id: "jogos-fisica", nome: "Física e colisão", zonas: [] },
  { id: "eletronica", nome: "Eletrônica", zonas: [] },
  { id: "comandos-eletricos", nome: "Comandos elétricos", zonas: [] },
  { id: "mecanica", nome: "Mecânica", zonas: [] },
  { id: "clp-e-ladder", nome: "CLP e Ladder", zonas: [] },
];

/*
 * O currículo em dados, na ordem do mapa: Origens, Sites, Lógica, Páginas
 * vivas, Rede e Servidor, Ofício e a opcional Frameworks. Espelha o
 * docs/MAPA-CURRICULAR.md (lá estão os conceitos, micro-passos, desafios e
 * confusões de cada unidade; aqui, só o que o mapa e as checagens usam).
 *
 * Unidade nova de conteúdo usa o id daqui. Zona (ou unidade) com
 * `requerMotor` não pode ter conteúdo: o testar:conteudo acusa.
 */
import type { IlhaCurriculo } from "./tipos";

const MOTOR_LOGICA = "Console interativo, execução de JS isolada e aba Fontes com depurador";
const MOTOR_PAGINAS_VIVAS = "JS do jogador rodando no site-alvo e aba Aplicação";
const MOTOR_REDE = "aba Rede, servidor simulado e diagrama de requisições";

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
        requerMotor: "tipos de atividade linha do tempo, comparador de linguagens executável e diagrama de rede",
        unidades: [
          {
            id: "origens-museu-u1",
            titulo: "Como o computador entende",
            meta: "Entender como bits e instruções viram programas, da linguagem de máquina às linguagens que a gente escreve.",
          },
          {
            id: "origens-museu-u2",
            titulo: "Linha do tempo",
            meta: "Percorrer a história da computação, dos cartões perfurados à IA.",
          },
          {
            id: "origens-museu-u3",
            titulo: "Por que existem tantas linguagens",
            meta: "Ver o mesmo programa em várias linguagens, lado a lado, rodando.",
          },
          {
            id: "origens-museu-u4",
            titulo: "Onde a programação vive",
            meta: "Descobrir onde a programação aparece no dia a dia e quais carreiras existem.",
          },
          {
            id: "origens-museu-u5",
            titulo: "Front, back e o caminho de um clique",
            meta: "Ter a visão geral do que é front, do que é back e do caminho de um clique.",
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
          },
          {
            id: "sites-elementos-u2",
            titulo: "Faxina no site",
            meta: "Limpar um site bagunçado sozinho: sumir com pop-ups, esconder banners, reorganizar produtos e navegar pela família de elementos.",
          },
          {
            id: "sites-elementos-u3",
            titulo: "Títulos e textos",
            meta: "Organizar um artigo bagunçado com a hierarquia de títulos e as ênfases corretas.",
          },
          {
            id: "sites-elementos-u4",
            titulo: "Links, imagens, id e class",
            meta: "Consertar um site com links quebrados e imagens sem descrição, e organizar elementos com id e class.",
          },
          {
            id: "sites-elementos-u5",
            titulo: "Caixas e seções",
            meta: "Dar estrutura a um site feito só de div, trocando por header, nav, main, section, article e footer onde fizer sentido.",
          },
          {
            id: "sites-elementos-u6",
            titulo: "Página do zero",
            meta: "Escrever uma página completa do zero: doctype, html, head (title, meta charset, meta viewport) e body.",
            requerMotor: "modo documento inteiro (head editável) e o título da aba do navegador falso refletindo o <title>",
          },
        ],
      },
      {
        id: "estilos",
        nome: "Estilos",
        icone: "estilos",
        requerMotor:
          "aba Estilos (regras do elemento selecionado, editar valores ao vivo, ligar e desligar propriedade, adicionar propriedade, regras riscadas, diagrama de caixa) e editor com abas HTML e CSS",
        unidades: [
          {
            id: "sites-estilos-u1",
            titulo: "A aba Estilos",
            meta: "Redesenhar cores e textos de um site sem tocar no HTML.",
          },
          {
            id: "sites-estilos-u2",
            titulo: "Seletores",
            meta: "Estilizar só os itens em promoção, escolhendo o seletor certo: tag, classe, id ou descendente.",
          },
          {
            id: "sites-estilos-u3",
            titulo: "Modelo de caixa",
            meta: "Consertar cards espremidos com content, padding, border e margin.",
          },
          {
            id: "sites-estilos-u4",
            titulo: "Por que minha regra não pega?",
            meta: "Depurar um site com três regras que não funcionam, entendendo cascata, especificidade e herança.",
          },
          {
            id: "sites-estilos-u5",
            titulo: "Variáveis e temas",
            meta: "Criar um tema novo pro próprio jogo com variáveis CSS, salvo como Meu tema.",
            requerMotor: "o próprio jogo como site-alvo (tokens do tema editáveis na aba Estilos)",
          },
        ],
      },
      {
        id: "layout",
        nome: "Layout",
        icone: "layout",
        requerMotor: "aba Estilos pronta (editor visual de flex e grid como no Chrome é desejável)",
        unidades: [
          {
            id: "sites-layout-u1",
            titulo: "Display",
            meta: "Montar um menu horizontal entendendo block, inline, inline-block e none.",
          },
          {
            id: "sites-layout-u2",
            titulo: "Flexbox",
            meta: "Alinhar uma barra de navegação e uma fileira de cards com flexbox.",
          },
          {
            id: "sites-layout-u3",
            titulo: "Grid",
            meta: "Montar o layout de uma revista com colunas, linhas e áreas de grid.",
          },
          {
            id: "sites-layout-u4",
            titulo: "Posição e camadas",
            meta: "Pôr um selo de promoção sobre o card e deixar o cabeçalho fixo com position e z-index.",
          },
        ],
      },
      {
        id: "responsivo",
        nome: "Responsivo",
        icone: "responsivo",
        requerMotor: "modo dispositivo na prévia (tamanhos de tela e girar)",
        unidades: [
          {
            id: "sites-responsivo-u1",
            titulo: "Modo dispositivo",
            meta: "Ver um site no celular, no tablet e no PC e diagnosticar três problemas no celular.",
          },
          {
            id: "sites-responsivo-u2",
            titulo: "Media queries e mobile first",
            meta: "Deixar o site de um restaurante bom no celular com media queries.",
          },
        ],
      },
      {
        id: "publicar",
        nome: "Publicar",
        icone: "publicar",
        requerMotor: "auditoria simplificada estilo Lighthouse, exportar o projeto do jogador e tipo de fase projeto-ponte",
        unidades: [
          {
            id: "sites-publicar-u1",
            titulo: "Acessibilidade e Lighthouse",
            meta: "Levar um site de nota baixa a nota alta na auditoria de acessibilidade.",
          },
          {
            id: "sites-publicar-u2",
            titulo: "Do jogo pro mundo",
            meta: "Publicar o próprio site pessoal, feito em arquivos de verdade, e ter um link.",
          },
        ],
      },
    ],
  },
  {
    id: "logica",
    nome: "Lógica",
    zonas: [
      {
        id: "primeiros-comandos",
        nome: "Primeiros comandos",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-primeiros-comandos-u1",
            titulo: "Primeiros comandos",
            meta: "Usar o Console para calcular e guardar valores em variáveis de tipos diferentes.",
          },
        ],
      },
      {
        id: "decisoes",
        nome: "Decisões",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-decisoes-u1",
            titulo: "Decisões",
            meta: "Fazer o programa escolher um caminho com comparações, booleanos e if/else.",
          },
        ],
      },
      {
        id: "repeticao",
        nome: "Repetição",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-repeticao-u1",
            titulo: "Repetição",
            meta: "Repetir uma tarefa com for e while, sem copiar código.",
          },
        ],
      },
      {
        id: "funcoes",
        nome: "Funções",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-funcoes-u1",
            titulo: "Funções",
            meta: "Guardar um passo a passo numa função e usar de novo com valores diferentes.",
          },
        ],
      },
      {
        id: "listas-e-objetos",
        nome: "Listas e objetos",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-listas-e-objetos-u1",
            titulo: "Listas e objetos",
            meta: "Organizar dados em listas e objetos e percorrer cada item.",
          },
        ],
      },
      {
        id: "depuracao",
        nome: "Depuração",
        icone: "fontes",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-depuracao-u1",
            titulo: "Depuração",
            meta: "Ler mensagens de erro e achar o bug com breakpoints na aba Fontes.",
          },
        ],
      },
    ],
  },
  {
    id: "paginas-vivas",
    nome: "Páginas vivas",
    zonas: [
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
          },
          {
            id: "oficio-deploy-u2",
            titulo: "Projeto final",
            meta: "Publicar o projeto final, front e back juntos, feito fora do jogo.",
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
          },
          {
            id: "frameworks-react-e-next-u2",
            titulo: "Next",
            meta: "Criar um site com páginas e rotas usando Next.",
          },
        ],
      },
    ],
  },
];

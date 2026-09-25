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

const MOTOR_LOGICA = "Console interativo, execução de JS isolada e aba Fontes com depurador";
const MOTOR_PAGINAS_VIVAS = "JS do jogador rodando no site-alvo e aba Aplicação";
const MOTOR_REDE = "aba Rede, servidor simulado e diagrama de requisições";
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
          {
            id: "origens-museu-u6",
            titulo: "Por baixo do capô",
            meta: "Espiar o computador por dentro: memória, processador, sistema, arquivos, binário e hexadecimal, e os cabos da internet.",
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
        id: "resolvendo-problemas",
        nome: "Resolvendo problemas",
        icone: "fontes",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-resolvendo-problemas-u1",
            titulo: "Decompor um problema",
            meta: "Quebrar um problema grande em passos pequenos, que dá para resolver um de cada vez.",
          },
          {
            id: "logica-resolvendo-problemas-u2",
            titulo: "Pseudocódigo",
            meta: "Escrever o passo a passo em português antes de escrever o código.",
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
      {
        id: "estruturas-de-dados",
        nome: "Estruturas de dados",
        icone: "aplicacao",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-estruturas-de-dados-u1",
            titulo: "Listas e dicionários",
            meta: "Escolher entre lista e dicionário para guardar dados e achar o que precisa rápido.",
          },
          {
            id: "logica-estruturas-de-dados-u2",
            titulo: "Pilhas e filas",
            meta: "Usar pilhas e filas, e reconhecer as duas no desfazer e na fila de impressão.",
          },
          {
            id: "logica-estruturas-de-dados-u3",
            titulo: "Árvores",
            meta: "Percorrer uma árvore e perceber que o DOM, a árvore de elementos do F12, é uma delas.",
          },
        ],
      },
      {
        id: "algoritmos-essenciais",
        nome: "Algoritmos essenciais",
        icone: "console",
        requerMotor: MOTOR_LOGICA,
        unidades: [
          {
            id: "logica-algoritmos-essenciais-u1",
            titulo: "Buscar",
            meta: "Achar um item numa lista, olhando um por um e pela busca binária.",
          },
          {
            id: "logica-algoritmos-essenciais-u2",
            titulo: "Ordenar",
            meta: "Ordenar uma lista e comparar jeitos diferentes de fazer isso.",
          },
          {
            id: "logica-algoritmos-essenciais-u3",
            titulo: "Recursão",
            meta: "Resolver um problema com uma função que chama ela mesma.",
          },
          {
            id: "logica-algoritmos-essenciais-u4",
            titulo: "Por que isso trava?",
            meta: "Entender, sem fórmula, por que um programa que voa com dez itens trava com um milhão.",
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
          {
            id: "rede-servidor-apis-e-json-u2",
            titulo: "APIs REST",
            meta: "Conversar com uma API REST usando os métodos e os endereços certos.",
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
          {
            id: "rede-servidor-banco-de-dados-u2",
            titulo: "SQL e NoSQL",
            meta: "Comparar um banco SQL e um NoSQL e escolher o certo para cada caso.",
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
          },
          {
            id: "rede-servidor-seguranca-u2",
            titulo: "Chaves e segredos",
            meta: "Proteger as chaves e os segredos do projeto para que nunca vazem.",
          },
          {
            id: "rede-servidor-seguranca-u3",
            titulo: "Injeção e XSS",
            meta: "Achar e fechar brechas de injeção e de XSS num site de mentirinha.",
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
          },
          {
            id: "ia-ia-ao-vivo-u2",
            titulo: "Achar o bug da IA",
            meta: "Encontrar e corrigir o erro escondido no código que a IA digitou.",
          },
          {
            id: "ia-ia-ao-vivo-u3",
            titulo: "Quando não confiar",
            meta: "Reconhecer quando a IA inventa coisas e conferir na fonte antes de usar.",
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
        id: "git-em-equipe",
        nome: "Git em equipe",
        icone: "git",
        requerMotor: "git e repositório remoto simulados, com branches, pull request e revisão de código",
        unidades: [
          {
            id: "oficio-git-em-equipe-u1",
            titulo: "Branches",
            meta: "Trabalhar em paralelo com branches sem atrapalhar ninguém.",
          },
          {
            id: "oficio-git-em-equipe-u2",
            titulo: "Pull request e revisão",
            meta: "Abrir um pull request e revisar o código de outra pessoa com cuidado.",
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
        id: "ler-codigo-dos-outros",
        nome: "Ler código dos outros",
        icone: "fontes",
        requerMotor: "projeto com vários arquivos, navegável dentro do jogo",
        unidades: [
          {
            id: "oficio-ler-codigo-dos-outros-u1",
            titulo: "Ler código dos outros",
            meta: "Entrar num projeto que você não escreveu e descobrir por onde começar.",
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
            meta: "Construir e publicar um app completo, front e back, a partir de uma página em branco, sem roteiro.",
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

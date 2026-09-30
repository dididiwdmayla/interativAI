import type { ComponentType } from "react";
import { IconeAdicionarAtributo } from "@/componentes/icones/IconeAdicionarAtributo";
import { IconeApagar } from "@/componentes/icones/IconeApagar";
import { IconeArvore } from "@/componentes/icones/IconeArvore";
import { IconeCodigo } from "@/componentes/icones/IconeCodigo";
import { IconeDesfazer } from "@/componentes/icones/IconeDesfazer";
import { IconeDuplicar } from "@/componentes/icones/IconeDuplicar";
import { IconeEditarDuplo } from "@/componentes/icones/IconeEditarDuplo";
import { IconeEditarValorCss } from "@/componentes/icones/IconeEditarValorCss";
import { IconeEditorCss } from "@/componentes/icones/IconeEditorCss";
import { IconeLigarDesligar } from "@/componentes/icones/IconeLigarDesligar";
import { IconeModeloCaixa } from "@/componentes/icones/IconeModeloCaixa";
import { IconeNovaRegra } from "@/componentes/icones/IconeNovaRegra";
import { IconePainelCalculado } from "@/componentes/icones/IconePainelCalculado";
import { IconePainelEstilos } from "@/componentes/icones/IconePainelEstilos";
import { IconeSeletorCor } from "@/componentes/icones/IconeSeletorCor";
import { IconeSetasNumericas } from "@/componentes/icones/IconeSetasNumericas";
import { IconeEsconder } from "@/componentes/icones/IconeEsconder";
import { IconeInspecionar } from "@/componentes/icones/IconeInspecionar";
import { IconeMeAjuda } from "@/componentes/icones/IconeMeAjuda";
import { IconePainel } from "@/componentes/icones/IconePainel";
import { IconePrevia } from "@/componentes/icones/IconePrevia";
import { IconeRenomearTag } from "@/componentes/icones/IconeRenomearTag";
import { IconeSalvarTema } from "@/componentes/icones/IconeSalvarTema";
import { IconeDispositivo } from "@/componentes/icones/IconeDispositivo";
import { IconeGirar } from "@/componentes/icones/IconeGirar";
import { IconeLevarProMundo } from "@/componentes/icones/IconeLevarProMundo";
import { IconeLighthouse } from "@/componentes/icones/IconeLighthouse";
import { IconeDadosEstruturados } from "@/componentes/icones/IconeDadosEstruturados";
import { IconeResultadoBusca } from "@/componentes/icones/IconeResultadoBusca";
import { IconeCampanha } from "@/componentes/icones/IconeCampanha";
import { IconeConsole } from "@/componentes/icones/IconeConsole";
import { IconeLinhaDoTempo } from "@/componentes/icones/IconeLinhaDoTempo";
import { IconePalcoMemoria } from "@/componentes/icones/IconePalcoMemoria";
import { IconeSnippet } from "@/componentes/icones/IconeSnippet";
import { IconeLinkRastreavel } from "@/componentes/icones/IconeLinkRastreavel";
import { IconeMedicao } from "@/componentes/icones/IconeMedicao";
import { IconeSincronia } from "@/componentes/icones/IconeSincronia";
import { IconeTrilha } from "@/componentes/icones/IconeTrilha";
import { IconeTutor } from "@/componentes/icones/IconeTutor";
import type { PropsIcone } from "@/componentes/icones/tipos";
import { DemoApagar } from "./demos/DemoApagar";
import { DemoArvore } from "./demos/DemoArvore";
import { DemoDuplicar } from "./demos/DemoDuplicar";
import { DemoEditarDuploClique } from "./demos/DemoEditarDuploClique";
import { DemoEsconder } from "./demos/DemoEsconder";
import { DemoInspecionar } from "./demos/DemoInspecionar";
import { DemoRenomearTag } from "./demos/DemoRenomearTag";
import { DemoSincronia } from "./demos/DemoSincronia";
import { DemoTrilha } from "./demos/DemoTrilha";
import { ROTA_MEU_TEMA, ROTA_PROJETOS } from "@/lib/rotas";
import { IDS_FERRAMENTAS, type IdFerramenta, seletorFerramenta } from "./ids";

export type { IdFerramenta } from "./ids";

export type Ferramenta = {
  id: IdFerramenta;
  nome: string;
  /** SVG próprio, usando tokens. */
  Icone: ComponentType<PropsIcone>;
  /** Seletor do elemento real na UI (data-ferramenta="..."). */
  alvo: string;
  /** 1 frase. */
  oQueFaz: string;
  /** 1 ou 2 frases, com exemplo concreto. */
  praQueServe: string;
  comoUsarAqui: { mouse: string; toque: string };
  /** Como fazer no navegador real, com atalho quando houver. */
  noF12DeVerdade: string;
  /** O que o jogador faz no passo "Experimente". */
  experimente: { mouse: string; toque: string };
  /**
   * Quando o passo "Experimente" termina: "tocar" = qualquer clique ou toque
   * no alvo; "sinal" = a interface avisa pelo sinalizarUso quando a
   * ferramenta foi usada de verdade.
   */
  uso: "tocar" | "sinal";
  /** Outras áreas que também ficam livres (e acesas) no passo "Experimente". */
  liberarNoExperimente?: string[];
  /** Mini animação SVG opcional mostrando o gesto. */
  demo?: ComponentType;
  /** Um lugar do jogo ligado à ferramenta, com link no card da Caixa (a oficina do Meu tema). */
  lugar?: { rotulo: string; href: string };
};

/** O menu do botão direito (e do toque longo) fica livre no "Experimente". */
const MENU_DO_NO = "[data-menu-no]";

/** Registro central: toda ferramenta do jogo mora aqui. */
export const FERRAMENTAS: Record<IdFerramenta, Ferramenta> = {
  painel: {
    id: "painel",
    nome: "Painel do F12",
    Icone: IconePainel,
    alvo: seletorFerramenta("painel"),
    oQueFaz: "É a caixa de ferramentas de quem faz sites: mostra as pecinhas que montam a página.",
    praQueServe:
      "Com ele você espia e mexe em qualquer site. Por exemplo: descobrir qual peça mostra o título e trocar o texto dela.",
    comoUsarAqui: {
      mouse: "As abas lá em cima trocam de ferramenta. Por enquanto só a aba Elementos está aberta.",
      toque: "As abas lá em cima trocam de ferramenta. Por enquanto só a aba Elementos está aberta.",
    },
    noF12DeVerdade: "aperte F12 (ou Ctrl+Shift+I; no Mac, Cmd+Option+I) em qualquer site e esse painel aparece.",
    experimente: { mouse: "Clique em qualquer lugar do painel.", toque: "Toque em qualquer lugar do painel." },
    uso: "tocar",
  },
  previa: {
    id: "previa",
    nome: "Tela do site",
    Icone: IconePrevia,
    alvo: seletorFerramenta("previa"),
    oQueFaz: "Mostra o site do jeito que qualquer pessoa vê no navegador.",
    praQueServe:
      "Tudo o que você mexe no painel aparece aqui na hora. Trocou um texto? Ele muda na tela na mesma hora.",
    comoUsarAqui: {
      mouse: "Role com a rodinha do mouse para ver o site inteiro.",
      toque: "Arraste com o dedo para ver o site inteiro.",
    },
    noF12DeVerdade: "a página continua ali do lado do painel, e muda na hora quando você mexe no F12.",
    experimente: { mouse: "Clique ou role a tela do site.", toque: "Toque ou arraste a tela do site." },
    uso: "tocar",
  },
  "me-ajuda": {
    id: "me-ajuda",
    nome: "Botão Me ajuda",
    Icone: IconeMeAjuda,
    alvo: seletorFerramenta("me-ajuda"),
    oQueFaz: "Dá uma ajudinha por vez quando você travar.",
    praQueServe:
      "Primeiro vem uma pergunta, depois uma dica, depois onde olhar. A solução pronta é o último degrau e custa 1 estrela.",
    comoUsarAqui: {
      mouse: "Clique nele. Cada clique sobe um degrau; os pontinhos mostram em qual você está.",
      toque: "Toque nele. Cada toque sobe um degrau; os pontinhos mostram em qual você está.",
    },
    noF12DeVerdade: "não tem botão de ajuda, mas pesquisar o nome da tag seguido de MDN costuma resolver.",
    experimente: { mouse: "Clique no Me ajuda uma vez.", toque: "Toque no Me ajuda uma vez." },
    uso: "sinal",
  },
  tutor: {
    id: "tutor",
    nome: "Perguntar ao computadorzinho",
    Icone: IconeTutor,
    alvo: seletorFerramenta("tutor"),
    oQueFaz: "Um campo para você me perguntar qualquer coisa sobre o jogo.",
    praQueServe:
      "Ficou com dúvida do que é uma tag? Pergunta! Eu explico com palavras simples, mas sem entregar a resposta.",
    comoUsarAqui: {
      mouse: "Escreva a pergunta e aperte Enter ou o aviãozinho.",
      toque: "Toque no campo, escreva a pergunta e toque no aviãozinho.",
    },
    noF12DeVerdade: "não tem computadorzinho, mas você pode perguntar para quem já programa ou pesquisar.",
    experimente: {
      mouse: "Mande uma pergunta. Pode ser: o que é uma tag?",
      toque: "Mande uma pergunta. Pode ser: o que é uma tag?",
    },
    uso: "sinal",
  },
  arvore: {
    id: "arvore",
    nome: "Árvore de elementos",
    Icone: IconeArvore,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Lista todas as peças da página, uma dentro da outra, como galhos de uma árvore.",
    praQueServe:
      "Serve para achar qualquer peça. Passando por um item, a peça dele acende lá na tela, então dá pra saber quem é quem.",
    comoUsarAqui: {
      mouse: "Passe o mouse pelos itens e veja o que acende na tela. Um clique seleciona.",
      toque: "Toque num item: ele fica selecionado e a peça dele acende na tela.",
    },
    noF12DeVerdade: "é a aba Elements (Elementos). Passar o mouse nos itens também acende a peça na página.",
    experimente: {
      mouse: "Passe o mouse ou clique num item da árvore.",
      toque: "Toque num item da árvore.",
    },
    uso: "sinal",
    demo: DemoArvore,
  },
  inspecionar: {
    id: "inspecionar",
    nome: "Modo inspecionar",
    Icone: IconeInspecionar,
    alvo: seletorFerramenta("inspecionar"),
    oQueFaz: "A setinha faz o caminho contrário: você aponta na tela e o painel mostra a peça.",
    praQueServe:
      "É o jeito mais rápido de descobrir o que é aquilo que você está vendo. Por exemplo: qual peça é aquele botão?",
    comoUsarAqui: {
      mouse: "Clique na setinha, passe o mouse pela tela e clique na peça que quiser.",
      toque: "Toque na setinha e arraste o dedo pela tela. Soltou, escolheu.",
    },
    noF12DeVerdade: "é a setinha no canto do painel, ou o atalho Ctrl+Shift+C (no Mac, Cmd+Shift+C).",
    experimente: {
      mouse: "Clique na setinha e depois em qualquer coisa da tela.",
      toque: "Toque na setinha e depois em qualquer coisa da tela.",
    },
    uso: "sinal",
    liberarNoExperimente: [seletorFerramenta("previa")],
    demo: DemoInspecionar,
  },
  "editar-duplo-clique": {
    id: "editar-duplo-clique",
    nome: "Editar pela árvore",
    Icone: IconeEditarDuplo,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Troca o texto de uma peça, ou o valor de um atributo, direto na árvore.",
    praQueServe:
      "Com isso você muda o que o site mostra. Por exemplo: trocar o nome da padaria pelo seu nome.",
    comoUsarAqui: {
      mouse: "Dê dois cliques no texto, escreva o novo e aperte Enter. Esc desiste.",
      toque: "Dê dois toques no texto (ou selecione e toque em Editar), escreva e confirme.",
    },
    noF12DeVerdade: "dois cliques no texto na aba Elements. A mudança só aparece pra você e some ao recarregar.",
    experimente: {
      mouse: "Dê dois cliques em algum texto da árvore.",
      toque: "Dê dois toques em algum texto da árvore.",
    },
    uso: "sinal",
    demo: DemoEditarDuploClique,
  },
  editor: {
    id: "editor",
    nome: "Código HTML",
    Icone: IconeCodigo,
    alvo: seletorFerramenta("editor"),
    oQueFaz: "Mostra a página escrita em HTML, a língua que o navegador entende.",
    praQueServe:
      "Aqui dá pra escrever peças novas do zero. Por exemplo: copiar uma linha de produto e criar outro produto.",
    comoUsarAqui: {
      mouse: "Clique no código e digite. A tela atualiza sozinha logo depois.",
      toque: "Toque no código para abrir o teclado e digite. A tela atualiza sozinha.",
    },
    noF12DeVerdade: "clique com o botão direito numa peça da aba Elements e escolha Edit as HTML.",
    experimente: {
      mouse: "Clique em qualquer lugar do código.",
      toque: "Toque em qualquer lugar do código.",
    },
    uso: "sinal",
  },
  sincronia: {
    id: "sincronia",
    nome: "Código e tela conversando",
    Icone: IconeSincronia,
    alvo: seletorFerramenta("sincronia"),
    oQueFaz: "Árvore, código e tela mostram a mesma peça juntos.",
    praQueServe:
      "Clicou numa tag do código? A árvore e a tela acendem a mesma peça. Assim você nunca se perde.",
    comoUsarAqui: {
      mouse: "Clique dentro de uma tag no código, ou selecione algo na árvore, e veja os três acenderem.",
      toque: "Toque dentro de uma tag no código, ou num item da árvore, e veja os três acenderem.",
    },
    noF12DeVerdade: "selecionar na aba Elements também acende a peça na página, igualzinho.",
    experimente: {
      mouse: "Clique dentro de uma tag no código.",
      toque: "Toque dentro de uma tag no código.",
    },
    uso: "sinal",
    demo: DemoSincronia,
  },
  trilha: {
    id: "trilha",
    nome: "Trilha de elementos",
    Icone: IconeTrilha,
    alvo: seletorFerramenta("trilha"),
    oQueFaz: "Mostra o caminho da peça selecionada: quem é o pai dela, o avô, e assim até o html.",
    praQueServe:
      "Serve para subir de andar sem se perder. Selecionou um link? Um clique na trilha e você pega a notícia inteira em volta dele.",
    comoUsarAqui: {
      mouse: "Selecione uma peça e clique num nome da trilha, embaixo da árvore, para pegar aquele pai.",
      toque: "Selecione uma peça e toque num nome da trilha, embaixo da árvore. Ela rola para o lado.",
    },
    noF12DeVerdade:
      "a trilha fica no rodapé da aba Elements, com o mesmo caminho (html, body, main...). Clicar num nome seleciona aquele elemento.",
    experimente: {
      mouse: "Selecione algo dentro de outra peça na árvore e clique num nome da trilha.",
      toque: "Toque em algo dentro de outra peça na árvore e depois num nome da trilha.",
    },
    uso: "sinal",
    liberarNoExperimente: [seletorFerramenta("arvore")],
    demo: DemoTrilha,
  },
  esconder: {
    id: "esconder",
    nome: "Esconder elemento",
    Icone: IconeEsconder,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Deixa uma peça invisível, mas ela continua no lugar, guardando o espaço dela.",
    praQueServe:
      "Bom para tirar da frente um banner chato sem bagunçar a página: o resto não sai do lugar. Esconder de novo faz a peça voltar.",
    comoUsarAqui: {
      mouse: "Clique com o botão direito num elemento da árvore e escolha Esconder. Ou selecione e aperte H.",
      toque: "Toque num elemento da árvore e depois em Esconder, na barrinha que aparece embaixo dele.",
    },
    noF12DeVerdade:
      "botão direito no elemento e Hide element, ou a tecla H. O Chrome põe nele uma classe de nome esquisito com visibility: hidden.",
    experimente: {
      mouse: "Esconda algum elemento (um anúncio, por exemplo): botão direito nele e Esconder.",
      toque: "Esconda algum elemento (um anúncio, por exemplo): toque nele e depois em Esconder.",
    },
    uso: "sinal",
    liberarNoExperimente: [MENU_DO_NO],
    demo: DemoEsconder,
  },
  apagar: {
    id: "apagar",
    nome: "Apagar elemento",
    Icone: IconeApagar,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Tira a peça da página de vez. O que vinha depois dela sobe e ocupa o lugar.",
    praQueServe:
      "Bom para sumir com um pop-up que tampa tudo. Apagou a peça errada? O Desfazer traz de volta.",
    comoUsarAqui: {
      mouse: "Clique com o botão direito no elemento da árvore e escolha Apagar. Ou selecione e aperte Delete.",
      toque: "Toque no elemento da árvore e depois em Apagar, na barrinha que aparece embaixo dele.",
    },
    noF12DeVerdade:
      "botão direito e Delete element, ou a tecla Delete. Só some pra você, e tudo volta quando recarregar a página.",
    experimente: {
      mouse: "Apague algo que atrapalha (um pop-up, por exemplo): botão direito nele e Apagar.",
      toque: "Apague algo que atrapalha (um pop-up, por exemplo): toque nele e depois em Apagar.",
    },
    uso: "sinal",
    liberarNoExperimente: [MENU_DO_NO],
    demo: DemoApagar,
  },
  desfazer: {
    id: "desfazer",
    nome: "Desfazer e refazer",
    Icone: IconeDesfazer,
    alvo: seletorFerramenta("desfazer"),
    oQueFaz: "Volta a última mudança que você fez pelo painel. O Refazer vai para a frente de novo.",
    praQueServe: "Apagou a peça errada? Sem susto: um Desfazer e ela volta, do jeitinho que estava.",
    comoUsarAqui: {
      mouse:
        "Clique na setinha curva no topo do painel, ou aperte Ctrl+Z com o painel em foco. Ctrl+Shift+Z ou Ctrl+Y refaz.",
      toque: "Toque na setinha curva no topo do painel (ou em Desfazer, na barrinha do elemento selecionado).",
    },
    noF12DeVerdade:
      "Ctrl+Z desfaz e Ctrl+Y refaz o que você mudou na aba Elements (no Mac, Cmd+Z e Cmd+Shift+Z).",
    experimente: { mouse: "Clique em Desfazer.", toque: "Toque em Desfazer." },
    uso: "sinal",
  },
  duplicar: {
    id: "duplicar",
    nome: "Duplicar elemento",
    Icone: IconeDuplicar,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Faz uma cópia da peça, com tudo o que tem dentro, logo depois dela.",
    praQueServe: "Quer mais um card igualzinho? Duplique e depois só troque o texto da cópia.",
    comoUsarAqui: {
      mouse: "Clique com o botão direito no elemento e escolha Duplicar, ou Shift+Alt+seta para baixo. A cópia já fica selecionada.",
      toque: "Toque no elemento da árvore e depois em Duplicar, na barrinha. A cópia já fica selecionada.",
    },
    noF12DeVerdade:
      "botão direito e Duplicate element, ou Shift+Alt+seta para baixo (no Mac, Shift+Option+seta para baixo).",
    experimente: {
      mouse: "Duplique um elemento (um card, por exemplo): botão direito nele e Duplicar.",
      toque: "Duplique um elemento (um card, por exemplo): toque nele e depois em Duplicar.",
    },
    uso: "sinal",
    // A trilha fica livre para subir do título até o card inteiro antes de duplicar.
    liberarNoExperimente: [MENU_DO_NO, seletorFerramenta("trilha")],
    demo: DemoDuplicar,
  },
  // Conferido na doc do Chrome ("Edit node type": dois cliques no tipo,
  // escreve o novo e Enter) e no devtools-frontend (setNodeName troca a peça
  // por outra com os mesmos atributos e filhos; nome vazio ou igual desiste;
  // html, head e body não renomeiam; Espaço também confirma).
  "renomear-tag": {
    id: "renomear-tag",
    nome: "Renomear tag",
    Icone: IconeRenomearTag,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Troca o tipo de uma peça: um h2 vira h4, uma div vira section.",
    praQueServe:
      "O que tem dentro e os atributos continuam iguais, só muda o que a peça é. Bom para arrumar os títulos de um texto, por exemplo.",
    comoUsarAqui: {
      mouse: "Dê dois cliques no nome da tag (o h2 de <h2>), escreva o novo nome e aperte Enter. Esc desiste.",
      toque: "Dê dois toques no nome da tag (ou selecione e toque em Renomear), escreva o novo nome e confirme.",
    },
    noF12DeVerdade:
      "dois cliques no nome da tag na aba Elements, escreva o novo e aperte Enter. O fechamento muda junto, e tudo volta ao recarregar.",
    experimente: {
      mouse: "Dê dois cliques no nome de uma tag da árvore e troque por outra (h2 por h3, por exemplo).",
      toque: "Dê dois toques no nome de uma tag da árvore (ou toque em Renomear) e troque por outra.",
    },
    uso: "sinal",
    liberarNoExperimente: [MENU_DO_NO],
    demo: DemoRenomearTag,
  },
  // Conferido no devtools-frontend: o item "Add attribute" do menu do nó
  // (DOMTreeContextMenu) abre um atributo vazio no fim da tag, e o que se
  // escreve ali é lido como atributos de verdade (ElementsTreeElement,
  // addNewAttribute). Dois cliques no nome da tag renomeiam (renomear-tag).
  "adicionar-atributo": {
    id: "adicionar-atributo",
    nome: "Adicionar atributo",
    Icone: IconeAdicionarAtributo,
    alvo: seletorFerramenta("arvore"),
    oQueFaz: "Cria um atributo que a peça ainda não tem, como o target de um link ou o alt de uma imagem.",
    praQueServe:
      "Editar só troca o valor de um atributo que já existe. Para criar um novo, escreva ele inteiro: nome, sinal de igual e o valor entre aspas.",
    comoUsarAqui: {
      mouse: "Clique com o botão direito na peça, escolha Adicionar atributo, escreva algo como target=\"_blank\" e aperte Enter.",
      toque: "Toque e segure na peça, escolha Adicionar atributo, escreva algo como target=\"_blank\" e confirme.",
    },
    noF12DeVerdade:
      "botão direito no elemento, na aba Elements, e Add attribute. Um espaço vazio aparece dentro da tag: escreva o atributo e aperte Enter.",
    experimente: {
      mouse: 'Clique com o botão direito numa peça da árvore, escolha Adicionar atributo e escreva title="oi".',
      toque: 'Toque e segure numa peça da árvore, escolha Adicionar atributo e escreva title="oi".',
    },
    uso: "sinal",
    liberarNoExperimente: [MENU_DO_NO],
  },
  // O Chrome não tem uma aba "CSS" no editor: as folhas de estilo abrem na
  // aba Sources (Fontes). Aqui a folha do site mora ao lado do HTML, e o
  // link "estilo.css:12" do painel Estilos leva à linha certa.
  "editor-css": {
    id: "editor-css",
    nome: "Código CSS",
    Icone: IconeEditorCss,
    alvo: seletorFerramenta("editor-css"),
    oQueFaz: "Mostra a folha de estilo do site: as regras que dão cor, tamanho e fonte para as peças.",
    praQueServe:
      "O HTML diz o que cada peça é; o CSS diz como ela aparece. Mudou uma cor aqui? A tela muda na hora.",
    comoUsarAqui: {
      mouse: "Clique na aba CSS em cima do código. Com o cursor dentro de uma regra, a tela acende as peças que ela pega.",
      toque: "Toque na aba CSS em cima do código. Com o cursor dentro de uma regra, a tela acende as peças que ela pega.",
    },
    noF12DeVerdade:
      "as folhas de estilo ficam na aba Sources (Fontes). No painel Styles, o nome do arquivo com a linha (estilo.css:12) abre a folha no lugar certo.",
    experimente: {
      mouse: "Abra a aba CSS e clique dentro de uma regra.",
      toque: "Abra a aba CSS e toque dentro de uma regra.",
    },
    uso: "sinal",
  },
  // Conferido na doc do Chrome (developer.chrome.com, "CSS features
  // reference") e no devtools-frontend (StylesSidebarPane,
  // StylePropertiesSection, StylePropertyTreeElement).
  "painel-estilos": {
    id: "painel-estilos",
    nome: "Painel Estilos",
    Icone: IconePainelEstilos,
    alvo: seletorFerramenta("painel-estilos"),
    oQueFaz: "Mostra todas as regras de CSS que pegam o elemento selecionado, da que ganha para a que perde.",
    praQueServe:
      "Serve para descobrir de onde vem a cor, o tamanho ou a fonte de uma peça. O que está riscado perdeu a briga para outra regra.",
    comoUsarAqui: {
      mouse: "Selecione uma peça na árvore: as regras dela aparecem aqui. Passe o mouse num seletor e veja o que ele pega na tela.",
      toque: "Toque numa peça da árvore e abra Estilos: as regras dela aparecem ali, da que ganha para a que perde.",
    },
    noF12DeVerdade:
      "é o painel Styles, dentro da aba Elements. O element.style fica em cima, as regras no meio, a user agent stylesheet (a do navegador) embaixo e depois as herdadas.",
    experimente: {
      mouse: "Passe o mouse por um seletor do painel Estilos.",
      toque: "Toque em qualquer lugar do painel Estilos.",
    },
    uso: "tocar",
  },
  "editar-valor-css": {
    id: "editar-valor-css",
    nome: "Editar valor no Estilos",
    Icone: IconeEditarValorCss,
    alvo: seletorFerramenta("painel-estilos"),
    oQueFaz: "Troca o nome ou o valor de uma declaração direto no painel Estilos, e a tela muda na hora.",
    praQueServe:
      "É o jeito mais rápido de testar uma cor ou um tamanho. Clicar no espaço vazio de uma regra acrescenta uma declaração nova.",
    comoUsarAqui: {
      mouse: "Clique no valor, escreva e aperte Enter. Tab vai para o próximo campo e Esc desiste.",
      toque: "Toque no valor, escreva e confirme. Para acrescentar, toque no + da regra.",
    },
    noF12DeVerdade:
      "clique no nome ou no valor no painel Styles (a doc do Chrome fala em dois cliques; um já abre). Enter confirma, Tab pula de campo, Esc desiste.",
    experimente: {
      mouse: "Clique num valor do painel Estilos e troque por outro.",
      toque: "Toque num valor do painel Estilos e troque por outro.",
    },
    uso: "sinal",
  },
  "ligar-desligar-declaracao": {
    id: "ligar-desligar-declaracao",
    nome: "Ligar e desligar declaração",
    Icone: IconeLigarDesligar,
    alvo: seletorFerramenta("painel-estilos"),
    oQueFaz: "A caixinha ao lado de cada declaração liga e desliga ela, sem apagar.",
    praQueServe:
      "Serve para testar: desliga, vê o que muda na tela, liga de novo. No código, a declaração desligada vira um comentário.",
    comoUsarAqui: {
      mouse: "Passe o mouse numa regra: as caixinhas aparecem. Clique para desligar ou ligar.",
      toque: "Toque na caixinha ao lado da declaração para desligar ou ligar.",
    },
    noF12DeVerdade:
      "passe o mouse na regra no painel Styles e desmarque a caixinha. O Chrome risca a declaração e, na folha, ela vira comentário.",
    experimente: {
      mouse: "Desligue uma declaração pela caixinha e veja a tela mudar.",
      toque: "Desligue uma declaração pela caixinha e veja a tela mudar.",
    },
    uso: "sinal",
  },
  "setas-numericas": {
    id: "setas-numericas",
    nome: "Setas nos números",
    Icone: IconeSetasNumericas,
    alvo: seletorFerramenta("painel-estilos"),
    oQueFaz: "Enquanto edita um número, as setas sobem e descem o valor aos pouquinhos.",
    praQueServe: "Achar o tamanho certo sem ficar digitando: vai subindo e olhando a tela até ficar bom.",
    comoUsarAqui: {
      mouse: "Editando um número: seta para cima ou para baixo muda 1, com Shift muda 10 e com Alt muda 0,1.",
      toque: "Editando um número, toque nos botões de seta que aparecem ao lado do valor.",
    },
    noF12DeVerdade:
      "as mesmas setas: 1 (ou 0,1 entre -1 e 1), Shift 10, Alt (Option no Mac) 0,1 e Ctrl+Shift+Page Up 100.",
    experimente: {
      mouse: "Clique num valor com número (como 32px) e aperte a seta para cima.",
      toque: "Toque num valor com número (como 32px) e use a seta para cima.",
    },
    uso: "sinal",
  },
  "seletor-de-cor": {
    id: "seletor-de-cor",
    nome: "Seletor de cor",
    Icone: IconeSeletorCor,
    alvo: seletorFerramenta("painel-estilos"),
    oQueFaz: "O quadradinho colorido ao lado de uma cor abre um seletor para escolher outra.",
    praQueServe: "Escolher a cor olhando, em vez de adivinhar o código. O código da cor nova vai sozinho para o CSS.",
    comoUsarAqui: {
      mouse: "Clique no quadradinho de cor ao lado do valor e escolha a cor nova.",
      toque: "Toque no quadradinho de cor ao lado do valor e escolha a cor nova.",
    },
    noF12DeVerdade: "clique no quadradinho de cor no painel Styles: abre o Color Picker, com conta-gotas e paletas.",
    experimente: {
      mouse: "Clique num quadradinho de cor e escolha outra cor.",
      toque: "Toque num quadradinho de cor e escolha outra cor.",
    },
    uso: "sinal",
  },
  "nova-regra": {
    id: "nova-regra",
    nome: "Nova regra",
    Icone: IconeNovaRegra,
    alvo: seletorFerramenta("nova-regra"),
    oQueFaz: "Cria uma regra nova para o elemento selecionado, já com o seletor dele.",
    praQueServe: "Quando nenhuma regra pega só aquela peça, você cria uma e escreve as declarações nela.",
    comoUsarAqui: {
      mouse: "Selecione a peça e clique no + do painel Estilos. A regra nova aparece e já abre para escrever.",
      toque: "Selecione a peça e toque no + do painel Estilos. A regra nova aparece e já abre para escrever.",
    },
    noF12DeVerdade:
      "é o botão New Style Rule (o +) do painel Styles: ele cria a regra com o seletor do elemento, como h1#titulo ou p.nota.",
    experimente: {
      mouse: "Clique no + do painel Estilos.",
      toque: "Toque no + do painel Estilos.",
    },
    uso: "sinal",
    liberarNoExperimente: [seletorFerramenta("painel-estilos")],
  },
  // Aba Calculado: conferida na doc do Chrome ("View an element's box
  // model", "Computed tab") e no devtools-frontend (ComputedStyleWidget,
  // MetricsSidebarPane).
  "painel-calculado": {
    id: "painel-calculado",
    nome: "Aba Calculado",
    Icone: IconePainelCalculado,
    alvo: seletorFerramenta("painel-calculado"),
    oQueFaz: "Mostra o valor final de cada propriedade do elemento selecionado, depois de todas as regras brigarem.",
    praQueServe:
      "Serve para tirar a dúvida \"que cor ficou, afinal?\" sem ler regra por regra. A seta de cada propriedade mostra quais regras deram valor para ela.",
    comoUsarAqui: {
      mouse: "Selecione uma peça e clique em Calculado, ao lado de Estilos. Use o filtro para achar uma propriedade.",
      toque: "Selecione uma peça, abra Estilos e toque em Calculado. Use o filtro para achar uma propriedade.",
    },
    noF12DeVerdade:
      "é a aba Computed, ao lado de Styles na aba Elements. Show all mostra todas as propriedades, até as que ninguém declarou.",
    experimente: {
      mouse: "Clique em qualquer lugar da aba Calculado.",
      toque: "Toque em qualquer lugar da aba Calculado.",
    },
    uso: "tocar",
  },
  "modelo-de-caixa": {
    id: "modelo-de-caixa",
    nome: "Modelo de caixa",
    Icone: IconeModeloCaixa,
    alvo: seletorFerramenta("painel-calculado"),
    oQueFaz: "Desenha o elemento como caixas uma dentro da outra: margin, border, padding e o conteúdo, com as medidas em pixels.",
    praQueServe:
      "Serve para descobrir de onde vem um espaço: se é margem (fora da borda) ou preenchimento (dentro dela). Cada camada acende na tela.",
    comoUsarAqui: {
      mouse: "Na aba Calculado, passe o mouse numa camada do desenho: a mesma camada acende na tela do site.",
      toque: "Na aba Calculado, toque numa camada do desenho: a mesma camada acende na tela do site. Toque de novo para apagar.",
    },
    noF12DeVerdade:
      "fica no alto da aba Computed. Passar o mouse numa camada acende ela na página, com as mesmas cores; dois cliques num número editam o valor.",
    experimente: {
      mouse: "Passe o mouse na camada padding do desenho.",
      toque: "Toque na camada padding do desenho.",
    },
    uso: "sinal",
    liberarNoExperimente: [seletorFerramenta("previa")],
  },
  // E5: não existe no Chrome (lá, mudar o Styles some ao recarregar); é o
  // jeito do jogo guardar as variáveis editadas como um tema de verdade.
  "salvar-tema": {
    id: "salvar-tema",
    nome: "Salvar como Meu tema",
    Icone: IconeSalvarTema,
    alvo: seletorFerramenta("salvar-tema"),
    oQueFaz: "Guarda as cores da maquete do jogo como um tema novo, o Meu tema, que vale no jogo inteiro.",
    praQueServe:
      "Você muda as variáveis --cor-* e vê o jogo mudar na maquete. Salvando, as cores viram um tema de verdade, que aparece na paleta lá em cima.",
    comoUsarAqui: {
      mouse: "Mude as variáveis do :root e clique em Salvar como Meu tema, em cima da tela do site. Antes, eu confiro se o texto continua fácil de ler.",
      toque: "Mude as variáveis do :root e toque em Salvar como Meu tema, em cima da tela do site. Antes, eu confiro se o texto continua fácil de ler.",
    },
    noF12DeVerdade:
      "não tem esse botão: o que você muda no Styles some ao recarregar. Para guardar, as variáveis vão para o arquivo CSS do site (a aba Changes do Chrome mostra o que você mudou).",
    experimente: {
      mouse: "Clique em Salvar como Meu tema.",
      toque: "Toque em Salvar como Meu tema.",
    },
    uso: "sinal",
    lugar: { rotulo: "Abrir a oficina do Meu tema (editar ou apagar)", href: ROTA_MEU_TEMA },
  },
  // Modo dispositivo: conferido no devtools-frontend (emulation-meta.ts: a
  // ação "Toggle device toolbar", Shift+Ctrl+M, Shift+Cmd+M no Mac;
  // DeviceModeToolbar: aparelhos prontos, largura livre, girar e zoom).
  "modo-dispositivo": {
    id: "modo-dispositivo",
    nome: "Modo dispositivo",
    Icone: IconeDispositivo,
    alvo: seletorFerramenta("modo-dispositivo"),
    oQueFaz: "Mostra o site como ele fica num celular, num tablet ou num notebook, com a largura de verdade de cada um.",
    praQueServe:
      "Serve para ver o que quebra no celular sem ter um celular na mão: texto cortado, coluna espremida, rolagem de lado. As @media reagem à largura escolhida.",
    comoUsarAqui: {
      mouse: "Clique no botão do celular e tablet, ao lado da setinha. Escolha o aparelho na barra que aparece em cima da tela, ou arraste as bordas para uma largura livre.",
      toque: "Toque no botão do celular e tablet, ao lado da setinha. Escolha o aparelho na barra que aparece em cima da tela.",
    },
    noF12DeVerdade:
      "é o Toggle device toolbar (o ícone de celular e tablet no canto do DevTools), ou Ctrl+Shift+M (Cmd+Shift+M no Mac). A barra tem a lista de aparelhos, a largura e a altura, o zoom e o botão de girar.",
    experimente: {
      mouse: "Clique no botão do modo dispositivo.",
      toque: "Toque no botão do modo dispositivo.",
    },
    uso: "sinal",
  },
  "girar-dispositivo": {
    id: "girar-dispositivo",
    nome: "Girar o aparelho",
    Icone: IconeGirar,
    alvo: seletorFerramenta("girar-dispositivo"),
    oQueFaz: "Deita o aparelho: a largura e a altura trocam de lugar.",
    praQueServe: "Muita gente usa o celular deitado para ver vídeo ou tabela. Girar mostra se o site continua bom assim.",
    comoUsarAqui: {
      mouse: "Com o modo dispositivo ligado, clique no botão de girar na barra de cima da tela.",
      toque: "Com o modo dispositivo ligado, toque no botão de girar na barra de cima da tela.",
    },
    noF12DeVerdade: "é o botão Rotate da barra de dispositivo, ao lado do zoom.",
    experimente: {
      mouse: "Clique no botão de girar.",
      toque: "Toque no botão de girar.",
    },
    uso: "sinal",
  },
  // Lighthouse: conferido no devtools-frontend (a aba Lighthouse, o botão
  // "Analyze page state") e no Lighthouse (categorias, pesos, faixas 90/50).
  lighthouse: {
    id: "lighthouse",
    nome: "Lighthouse",
    Icone: IconeLighthouse,
    alvo: seletorFerramenta("lighthouse"),
    oQueFaz: "Confere a página e dá uma nota de 0 a 100 em Acessibilidade, Boas práticas e SEO, com a lista do que consertar.",
    praQueServe:
      "Serve para achar o que atrapalha as pessoas (imagem sem descrição, texto apagado demais) e o Google, sem precisar lembrar de tudo. Cada problema leva até a peça.",
    comoUsarAqui: {
      mouse: "Abra a aba Lighthouse, lá em cima no painel, e clique em Analisar. Clique num problema para ver a peça na árvore.",
      toque: "Abra a aba Lighthouse, lá em cima no painel, e toque em Analisar. Toque num problema para ver a peça na árvore.",
    },
    noF12DeVerdade:
      "é a aba Lighthouse do DevTools: escolha as categorias e clique em Analyze page load. A de verdade confere bem mais coisas (e o desempenho também); esta é uma versão simplificada.",
    experimente: {
      mouse: "Clique em Analisar.",
      toque: "Toque em Analisar.",
    },
    uso: "sinal",
  },
  // Levar pro mundo: não é do Chrome. No mundo de verdade, o site é uma
  // pasta com arquivos; o jogo monta essa pasta (index.html e style.css).
  "levar-pro-mundo": {
    id: "levar-pro-mundo",
    nome: "Levar pro mundo",
    Icone: IconeLevarProMundo,
    alvo: seletorFerramenta("levar-pro-mundo"),
    oQueFaz: "Transforma a página do jogo nos arquivos de um site de verdade: o index.html e o style.css, num .zip.",
    praQueServe:
      "Num site de verdade, o HTML e o CSS moram em arquivos separados, ligados por uma linha no head. Com os arquivos na mão, dá para publicar e ganhar um endereço na internet.",
    comoUsarAqui: {
      mouse: "Clique em Levar pro mundo, em cima da tela do site. Confira os dois arquivos e baixe o .zip. O guia de publicação mostra o resto.",
      toque: "Toque em Levar pro mundo, em cima da tela do site. Confira os dois arquivos e baixe o .zip. O guia de publicação mostra o resto.",
    },
    noF12DeVerdade:
      "não tem esse botão: o DevTools mexe numa página que já está publicada. Quem cria o site trabalha num editor (como o VS Code) com os arquivos numa pasta, e publica a pasta.",
    experimente: {
      mouse: "Clique em Levar pro mundo.",
      toque: "Toque em Levar pro mundo.",
    },
    uso: "sinal",
    lugar: { rotulo: "Abrir Meus projetos", href: ROTA_PROJETOS },
  },
  // Busca simulada (zona Ser encontrado): não é do Chrome. O painel imita o
  // resultado do Google e diz que é uma simulação aproximada.
  "resultado-busca": {
    id: "resultado-busca",
    nome: "Resultado na busca",
    Icone: IconeResultadoBusca,
    alvo: seletorFerramenta("resultado-busca"),
    oQueFaz: "Mostra, ao vivo, como esta página apareceria num resultado de busca: título, endereço e descrição.",
    praQueServe:
      "Serve para ver o que a pessoa lê ANTES de entrar no site. Um título cortado ou uma descrição vazia fazem ela escolher outro resultado.",
    comoUsarAqui: {
      mouse: "Abra a aba Busca, lá em cima no painel. Mexa no title ou na meta description e veja o resultado mudar na hora.",
      toque: "Abra a aba Busca, lá em cima no painel. Mexa no title ou na meta description e veja o resultado mudar na hora.",
    },
    noF12DeVerdade:
      "não existe: o resultado de verdade só aparece no Google depois que ele visita a página. Para conferir, busque site:seu-endereco no Google, ou use o Search Console.",
    experimente: {
      mouse: "Clique no resultado simulado.",
      toque: "Toque no resultado simulado.",
    },
    uso: "tocar",
  },
  "dados-estruturados": {
    id: "dados-estruturados",
    nome: "Teste de dados estruturados",
    Icone: IconeDadosEstruturados,
    alvo: seletorFerramenta("dados-estruturados"),
    oQueFaz: "Lê os blocos de dados estruturados (JSON-LD) da página e aponta JSON quebrado e campos que faltam.",
    praQueServe:
      "Dados estruturados contam para a busca, num formato que ela entende, quem é o negócio: nome, endereço, horário. Um erro de vírgula faz a busca ignorar tudo.",
    comoUsarAqui: {
      mouse: "Na aba Busca, clique em Dados estruturados. Cada bloco mostra o tipo, o que falta e a linha do erro, se houver.",
      toque: "Na aba Busca, toque em Dados estruturados. Cada bloco mostra o tipo, o que falta e a linha do erro, se houver.",
    },
    noF12DeVerdade:
      "fica fora do F12: é o Teste de pesquisa aprimorada do Google (search.google.com/test/rich-results), que confere a página publicada. Este é uma versão simplificada.",
    experimente: {
      mouse: "Clique na lista de blocos.",
      toque: "Toque na lista de blocos.",
    },
    uso: "tocar",
  },
  // Medição simulada: o site-alvo não roda JavaScript, então o jogo faz o
  // papel do código de medição (a tela explica).
  medicao: {
    id: "medicao",
    nome: "Medição",
    Icone: IconeMedicao,
    alvo: seletorFerramenta("medicao"),
    oQueFaz: "Mostra os eventos chegando, como o relatório em tempo real de uma ferramenta de análise: cada clique medido, com a origem da visita.",
    praQueServe:
      "Serve para saber o que as pessoas FAZEM no site: quantas clicaram no WhatsApp, quantas mandaram o pedido. Visita não é cliente; o evento de conversão é.",
    comoUsarAqui: {
      mouse: "Abra a aba Medição. Clique, na tela do site, numa peça com data-evento e veja o evento chegar no relatório.",
      toque: "Abra a aba Medição. Toque, na tela do site, numa peça com data-evento e veja o evento chegar no relatório.",
    },
    noF12DeVerdade:
      "não fica no F12: é um código de medição instalado no site que manda os eventos para uma ferramenta de análise. Aqui o jogo simula esse código, que você aprende a escrever na ilha Páginas vivas.",
    experimente: {
      mouse: "Clique no relatório.",
      toque: "Toque no relatório.",
    },
    uso: "tocar",
  },
  "link-rastreavel": {
    id: "link-rastreavel",
    nome: "Link rastreável",
    Icone: IconeLinkRastreavel,
    alvo: seletorFerramenta("link-rastreavel"),
    oQueFaz: "Monta um link com utm_source, utm_medium e utm_campaign no fim, para a medição saber de onde veio cada visita.",
    praQueServe:
      "Com um link diferente no Instagram, no panfleto e no e-mail, dá para ver qual divulgação trouxe gente. A página aberta é a mesma: só a medição lê o fim do link.",
    comoUsarAqui: {
      mouse: "Na aba Medição, preencha origem, meio e campanha. Copie o link, ponha num href ou clique em Simular uma visita.",
      toque: "Na aba Medição, preencha origem, meio e campanha. Copie o link, ponha num href ou toque em Simular uma visita.",
    },
    noF12DeVerdade:
      "não precisa de ferramenta: é só texto no fim do endereço. Existem construtores de link prontos nas ferramentas de análise, e o relatório de aquisição mostra as origens.",
    experimente: {
      mouse: "Clique no construtor de link.",
      toque: "Toque no construtor de link.",
    },
    uso: "tocar",
  },
  "simulador-campanha": {
    id: "simulador-campanha",
    nome: "Simulador de campanha",
    Icone: IconeCampanha,
    alvo: seletorFerramenta("simulador-campanha"),
    oQueFaz: "Simula um dia de anúncio pago numa busca: orçamento, palavra-chave e lance, o leilão com os concorrentes, os cliques e os clientes.",
    praQueServe:
      "Mostra por dentro por que uma página ruim queima o dinheiro do anúncio: com a mesma verba, uma página melhor paga menos por clique e transforma mais cliques em clientes.",
    comoUsarAqui: {
      mouse: "Abra a aba Campanha. Mude orçamento, palavra-chave e lance e veja o leilão e o dia mudarem. Melhore a página e compare.",
      toque: "Abra a aba Campanha. Mude orçamento, palavra-chave e lance e veja o leilão e o dia mudarem. Melhore a página e compare.",
    },
    noF12DeVerdade:
      "não fica no F12: a campanha é montada na plataforma de anúncios. O que o programador controla é a página de destino (rápida, clara e com o que a pessoa buscou) e a medição da conversão.",
    experimente: {
      mouse: "Clique no resultado do dia.",
      toque: "Toque no resultado do dia.",
    },
    uso: "tocar",
  },
  // Ilha Lógica (rodada 17). Comportamento do Console e dos Snippets conferido na
  // documentação do Chrome (developer.chrome.com, Console e "Run snippets").
  console: {
    id: "console",
    nome: "Console",
    Icone: IconeConsole,
    alvo: seletorFerramenta("console"),
    oQueFaz: "Roda JavaScript na hora: você escreve um comando, aperta Enter e o Console responde embaixo.",
    praQueServe:
      "Serve para fazer contas, testar uma ideia e ver o valor de uma variável sem criar arquivo nenhum. Depois de let ou const, ele responde undefined: a linha guardou algo, mas não tem valor para mostrar.",
    comoUsarAqui: {
      mouse: "Clique na linha com o sinal >, escreva e aperte Enter. Shift+Enter pula linha. A seta para cima traz o comando anterior.",
      toque: "Toque na linha com o sinal >, escreva e toque em Rodar. A barra de símbolos em cima do teclado tem os sinais do JavaScript.",
    },
    noF12DeVerdade:
      "é a aba Console (Ctrl+Shift+J no Windows, Cmd+Option+J no Mac). Funciona em qualquer site: o que você aprende aqui roda lá igualzinho.",
    experimente: {
      mouse: "Escreva 2 + 3 e aperte Enter.",
      toque: "Escreva 2 + 3 e toque em Rodar.",
    },
    uso: "sinal",
  },
  snippet: {
    id: "snippet",
    nome: "Snippet",
    Icone: IconeSnippet,
    alvo: seletorFerramenta("snippet"),
    oQueFaz: "Um editor para programas de várias linhas, que roda tudo de uma vez com Executar. O que o programa mostra aparece no Console.",
    praQueServe:
      "O Console é ótimo para um comando; um programa maior fica melhor escrito com calma, com as linhas numeradas, e rodado de novo sempre que mudar.",
    comoUsarAqui: {
      mouse: "Abra a aba Fontes, escreva no editor e clique em Executar (ou aperte Ctrl+Enter).",
      toque: "Abra a aba Fontes, escreva no editor e toque em Executar.",
    },
    noF12DeVerdade:
      "fica em Fontes > Snippets (Sources > Snippets): crie um snippet novo, escreva e rode com Ctrl+Enter. Ele fica salvo no seu Chrome e roda em qualquer página.",
    experimente: {
      mouse: "Clique em Executar.",
      toque: "Toque em Executar.",
    },
    uso: "sinal",
  },
  "palco-memoria": {
    id: "palco-memoria",
    nome: "Palco da memória",
    Icone: IconePalcoMemoria,
    alvo: seletorFerramenta("palco-memoria"),
    oQueFaz: "Mostra a memória do programa: cada variável é uma caixinha com nome, valor e tipo; listas são vagões numerados e objetos, fichas.",
    praQueServe:
      "Programa não tem tela de site: o que muda é a memória. Aqui você vê a caixinha nascer, o valor trocar e duas variáveis apontando para a mesma lista.",
    comoUsarAqui: {
      mouse: "Rode algo no Console ou no Snippet e olhe o palco mudar. Passe o mouse numa caixinha para ver o tipo do valor.",
      toque: "Rode algo no Console ou no Snippet e olhe o palco mudar. Toque numa caixinha para ver o tipo do valor.",
    },
    noF12DeVerdade:
      "não tem um palco igual: o mais perto é o painel Escopo (Scope) da aba Fontes, que lista as variáveis quando o programa pausa num ponto de parada.",
    experimente: {
      mouse: "Clique no palco.",
      toque: "Toque no palco.",
    },
    uso: "tocar",
  },
  "linha-do-tempo": {
    id: "linha-do-tempo",
    nome: "Linha do tempo",
    Icone: IconeLinhaDoTempo,
    alvo: seletorFerramenta("linha-do-tempo"),
    oQueFaz: "Rebobina o programa: cada ponto da barra é um passo que ele deu, com a linha do código acesa e a memória daquele momento.",
    praQueServe:
      "O programa roda rápido demais para ver. Voltando passo a passo, dá para achar em que linha um valor mudou e o que tinha na memória na hora do erro.",
    comoUsarAqui: {
      mouse: "Arraste a bolinha da barra ou use os botões de passo anterior e próximo. A linha do código acende no Snippet.",
      toque: "Arraste a bolinha da barra ou toque nos botões de passo anterior e próximo. A linha do código acende no Snippet.",
    },
    noF12DeVerdade:
      "o Chrome anda para a frente, não para trás: na aba Fontes, os botões de passo a passo avançam uma linha de cada vez depois de um ponto de parada.",
    experimente: {
      mouse: "Clique no botão de passo anterior.",
      toque: "Toque no botão de passo anterior.",
    },
    uso: "sinal",
  },
};

export const LISTA_FERRAMENTAS: readonly Ferramenta[] = IDS_FERRAMENTAS.map((id) => FERRAMENTAS[id]);

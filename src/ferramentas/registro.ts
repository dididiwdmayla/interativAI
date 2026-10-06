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
import { IconeCircuito } from "@/componentes/icones/IconeCircuito";
import { IconeTabelaVerdade } from "@/componentes/icones/IconeTabelaVerdade";
import { IconeControlesDepurador } from "@/componentes/icones/IconeControlesDepurador";
import { IconeEscopo } from "@/componentes/icones/IconeEscopo";
import { IconeObservar } from "@/componentes/icones/IconeObservar";
import { IconePlanoNoCodigo } from "@/componentes/icones/IconePlanoNoCodigo";
import { IconeCasosDeTeste } from "@/componentes/icones/IconeCasosDeTeste";
import { IconeCena } from "@/componentes/icones/IconeCena";
import { IconeFichaDispositivo } from "@/componentes/icones/IconeFichaDispositivo";
import { IconeVelocidade } from "@/componentes/icones/IconeVelocidade";
import { IconePilhaChamadas } from "@/componentes/icones/IconePilhaChamadas";
import { IconePontoDeParada } from "@/componentes/icones/IconePontoDeParada";
import { IconeQuadroPassos } from "@/componentes/icones/IconeQuadroPassos";
import { IconeArvorePalco } from "@/componentes/icones/IconeArvorePalco";
import { IconeContadorPassos } from "@/componentes/icones/IconeContadorPassos";
import { IconeGraficoPassos } from "@/componentes/icones/IconeGraficoPassos";
import { IconeLinkRastreavel } from "@/componentes/icones/IconeLinkRastreavel";
import { IconeMedicao } from "@/componentes/icones/IconeMedicao";
import { IconeSincronia } from "@/componentes/icones/IconeSincronia";
import { IconeTrilha } from "@/componentes/icones/IconeTrilha";
import { IconeTutor } from "@/componentes/icones/IconeTutor";
import { IconeBits } from "@/componentes/icones/IconeBits";
import { IconeCamadas } from "@/componentes/icones/IconeCamadas";
import { IconeLinhaDoTempoMuseu } from "@/componentes/icones/IconeLinhaDoTempoMuseu";
import { IconeMesaCores } from "@/componentes/icones/IconeMesaCores";
import {
  IconeAbaRede,
  IconeArvorePastas,
  IconeCaixasMemoria,
  IconeCaminhoClique,
  IconeCartoesLigar,
  IconeCidadeCodigo,
  IconeCompilarInterpretar,
  IconeComparador,
  IconeGerenteSistema,
  IconeMapaCabos,
  IconeOrdemCartoes,
  IconePainelCabos,
  IconeProcessador,
} from "@/componentes/icones/IconesSalasDoMuseu";
import { IconeTear } from "@/componentes/icones/IconeTear";
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
      mouse: "Rode algo no Console ou no Snippet e olhe o palco mudar. A plaquinha no canto de cada caixinha diz o tipo do valor, com a cor dele.",
      toque: "Rode algo no Console ou no Snippet e olhe o palco mudar. A plaquinha no canto de cada caixinha diz o tipo do valor, com a cor dele.",
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
  circuito: {
    id: "circuito",
    nome: "Bancada de circuito",
    Icone: IconeCircuito,
    alvo: seletorFerramenta("circuito"),
    oQueFaz: "Uma bancada com chaves, portões E, OU e NÃO e uma saída: você liga os fios e vê a corrente acender.",
    praQueServe:
      "Todo if decide com sim ou não. Montar o portão com as mãos mostra o que E, OU e NÃO fazem antes de escrever && , || e ! no código.",
    comoUsarAqui: {
      mouse: "Arraste um portão da paleta. Clique na bolinha da direita de uma peça e depois numa bolinha da esquerda de outra: nasce o fio. Clique numa chave para ligar e desligar.",
      toque: "Toque num portão da paleta. Toque na bolinha da direita de uma peça e depois numa bolinha da esquerda de outra: nasce o fio. Toque numa chave para ligar e desligar.",
    },
    noF12DeVerdade:
      "não existe no F12: os portões moram dentro do processador, aos bilhões. No código, eles viram os operadores &&, || e !, que funcionam no Console de qualquer site.",
    experimente: {
      mouse: "Clique numa chave para ligar.",
      toque: "Toque numa chave para ligar.",
    },
    uso: "tocar",
  },
  "tabela-verdade": {
    id: "tabela-verdade",
    nome: "Tabela verdade",
    Icone: IconeTabelaVerdade,
    alvo: seletorFerramenta("tabela-verdade"),
    oQueFaz: "Mostra, para cada jeito de ligar as chaves, se a saída acende. As linhas que você já testou ficam marcadas.",
    praQueServe:
      "É o resumo do circuito inteiro: dá para conferir todas as combinações sem esquecer nenhuma. O botão Ver como código mostra o mesmo circuito escrito em JavaScript.",
    comoUsarAqui: {
      mouse: "Ligue e desligue as chaves e veja a linha acender na tabela. Clique em Ver como código.",
      toque: "Ligue e desligue as chaves e veja a linha acender na tabela. Toque em Ver como código.",
    },
    noF12DeVerdade:
      "não é uma aba do Chrome: é como programadores e engenheiros conferem uma condição. O código que aparece roda no Console de qualquer site.",
    experimente: {
      mouse: "Clique em Ver como código.",
      toque: "Toque em Ver como código.",
    },
    uso: "sinal",
  },
  // Depurador da aba Fontes (Ilha Lógica, parte B). Nomes, gestos e atalhos conferidos na
  // documentação do Chrome (developer.chrome.com: "Pause your code with breakpoints",
  // "JavaScript debugging reference" e "Keyboard shortcuts").
  "pontos-de-parada": {
    id: "pontos-de-parada",
    nome: "Ponto de parada",
    Icone: IconePontoDeParada,
    alvo: seletorFerramenta("pontos-de-parada"),
    oQueFaz: "Marca uma linha do programa para ele parar ali, antes de rodar essa linha. A instrução debugger; no código faz o mesmo.",
    praQueServe:
      "O programa roda rápido demais para ver. Parado numa linha, dá para olhar cada variável naquele momento e descobrir onde o valor começa a ficar errado.",
    comoUsarAqui: {
      mouse: "Clique no número da linha, na aba Fontes: ele fica com uma etiqueta. Clique de novo para tirar. Ctrl+B marca a linha do cursor.",
      toque: "Toque no número da linha, na aba Fontes: ele fica com uma etiqueta. Toque de novo para tirar.",
    },
    noF12DeVerdade:
      "na aba Fontes (Sources), clique no número da linha: aparece um marcador azul. Ctrl+B (Cmd+B no Mac) marca a linha do cursor, e debugger; no código pausa do mesmo jeito.",
    experimente: {
      mouse: "Clique no número de uma linha do Snippet.",
      toque: "Toque no número de uma linha do Snippet.",
    },
    uso: "sinal",
  },
  "controles-depurador": {
    id: "controles-depurador",
    nome: "Controles do depurador",
    Icone: IconeControlesDepurador,
    alvo: seletorFerramenta("controles-depurador"),
    oQueFaz: "Com o programa pausado, andam com ele: Retomar, Passar por cima, Entrar na função e Sair da função.",
    praQueServe:
      "Passar por cima vai para a próxima linha; Entrar na função segue para dentro da função chamada; Sair volta para quem chamou; Retomar corre até o próximo ponto de parada.",
    comoUsarAqui: {
      mouse: "Use os botões em cima dos painéis do depurador: F8 retoma, F10 passa por cima, F11 entra e Shift+F11 sai (ou Ctrl+\\, Ctrl+', Ctrl+; e Ctrl+Shift+;).",
      toque: "Use os botões da barra embaixo da aba Fontes, ou os de cima do palco, enquanto o programa está pausado.",
    },
    noF12DeVerdade:
      "ficam no alto da barra lateral da aba Fontes: Retomar (F8 ou Ctrl+\\), Passar por cima (F10 ou Ctrl+'), Entrar (F11 ou Ctrl+;) e Sair (Shift+F11 ou Ctrl+Shift+;). No Mac, Cmd no lugar de Ctrl.",
    experimente: {
      mouse: "Clique na barra dos controles.",
      toque: "Toque na barra dos controles.",
    },
    uso: "tocar",
  },
  "painel-escopo": {
    id: "painel-escopo",
    nome: "Painel Escopo",
    Icone: IconeEscopo,
    alvo: seletorFerramenta("painel-escopo"),
    oQueFaz: "Com o programa pausado, lista as variáveis daquele momento: Local (da função), Bloco, Script e Global.",
    praQueServe:
      "Mostra que cada variável mora num lugar: o i do for só existe dentro do laço, e a variável de dentro da função some quando ela termina.",
    comoUsarAqui: {
      mouse: "Pause o programa num ponto de parada e olhe o painel Escopo. Os valores batem com as caixinhas do palco.",
      toque: "Pause o programa num ponto de parada e abra a aba Escopo do depurador. Os valores batem com as caixinhas do palco.",
    },
    noF12DeVerdade:
      "é o painel Scope da barra lateral da aba Fontes, com as seções Local, Block, Script e Global (no Chrome, Global também mostra tudo o que a página tem).",
    experimente: {
      mouse: "Clique no painel Escopo.",
      toque: "Toque no painel Escopo.",
    },
    uso: "tocar",
  },
  "painel-observar": {
    id: "painel-observar",
    nome: "Painel Observar",
    Icone: IconeObservar,
    alvo: seletorFerramenta("painel-observar"),
    oQueFaz: "Guarda expressões que você quer acompanhar, como total ou preco * 2, e mostra o valor delas a cada pausa.",
    praQueServe:
      "Em vez de procurar a variável toda vez, ela fica de olho para você: a cada passo, o valor da expressão aparece atualizado.",
    comoUsarAqui: {
      mouse: "No painel Observar, escreva a expressão no campo e aperte Enter. O x tira a expressão.",
      toque: "Na aba Observar do depurador, escreva a expressão e toque em Adicionar. O x tira a expressão.",
    },
    noF12DeVerdade:
      "é o painel Watch da aba Fontes: clique no + (Add watch expression), escreva e aperte Enter. Expressão que não existe naquele momento aparece como não disponível.",
    experimente: {
      mouse: "Clique no painel Observar.",
      toque: "Toque no painel Observar.",
    },
    uso: "tocar",
  },
  "pilha-de-chamadas": {
    id: "pilha-de-chamadas",
    nome: "Pilha de chamadas",
    Icone: IconePilhaChamadas,
    alvo: seletorFerramenta("pilha-de-chamadas"),
    oQueFaz: "Com o programa pausado, mostra as funções abertas: a de cima é a que roda agora, e embaixo dela, quem chamou.",
    praQueServe:
      "Responde \"como cheguei aqui?\": se a função dobro está em cima e o código de fora embaixo, foi a linha de fora que chamou dobro.",
    comoUsarAqui: {
      mouse: "Pause dentro de uma função e olhe a pilha. Clique numa linha da pilha para ver o Escopo e a linha daquela função.",
      toque: "Pause dentro de uma função e abra a aba Pilha do depurador. Toque numa linha da pilha para ver o Escopo daquela função.",
    },
    noF12DeVerdade:
      "é o painel Call Stack da aba Fontes. O código de cima de um snippet aparece como (anonymous), com o nome do snippet e a linha.",
    experimente: {
      mouse: "Clique na Pilha de chamadas.",
      toque: "Toque na Pilha de chamadas.",
    },
    uso: "tocar",
  },
  // Ordenar passos (zona Resolvendo problemas): não é do Chrome, é como se planeja um programa.
  "quadro-de-passos": {
    id: "quadro-de-passos",
    nome: "Quadro de passos",
    Icone: IconeQuadroPassos,
    alvo: seletorFerramenta("quadro-de-passos"),
    oQueFaz: "Cartões com os passos de um problema: você arrasta cada um para o plano, na ordem em que eles têm que acontecer.",
    praQueServe:
      "Antes do código vem o plano. Às vezes dois passos podem trocar de lugar, às vezes um precisa do outro, e alguns cartões nem fazem parte da solução.",
    comoUsarAqui: {
      mouse: "Arraste um cartão pela alça até o plano, ou clique nele e depois no lugar do plano. As setas sobem e descem; o x tira do plano.",
      toque: "Arraste um cartão pela alça até o plano, ou toque nele e depois no lugar do plano. As setas sobem e descem; o x tira do plano.",
    },
    noF12DeVerdade:
      "não existe no F12: é o que programadores fazem no papel (ou num comentário) antes de escrever o código, e o que vira pseudocódigo.",
    experimente: {
      mouse: "Clique num cartão.",
      toque: "Toque num cartão.",
    },
    uso: "tocar",
  },
  // Fase composta (resolução de problemas): não é do Chrome, é o hábito de planejar dentro do código.
  "plano-no-codigo": {
    id: "plano-no-codigo",
    nome: "Levar o plano pro código",
    Icone: IconePlanoNoCodigo,
    alvo: seletorFerramenta("plano-no-codigo"),
    oQueFaz: "Escreve os passos do seu plano, na sua ordem, como comentários numerados no topo do Snippet, sem apagar o código.",
    praQueServe:
      "Cada comentário vira um lembrete do que falta programar. Mexeu no plano depois? Os comentários acompanham, e tocar num passo acende a linha dele no código.",
    comoUsarAqui: {
      mouse: "Monte o plano e clique em Levar pro código, no alto do plano. Clique num passo do plano para achar o comentário dele.",
      toque: "Monte o plano e toque em Levar pro código, no alto do plano. Toque num passo do plano para achar o comentário dele.",
    },
    noF12DeVerdade:
      "não é um botão do F12: é um costume de quem programa. Antes do código, escreva o plano como comentários (// 1. ...) e preencha cada passo embaixo dele.",
    experimente: {
      mouse: "Clique em Levar pro código.",
      toque: "Toque em Levar pro código.",
    },
    uso: "sinal",
  },
  // Fase composta: os exemplos do aluno rodando contra a função dele (a semente dos testes automatizados).
  "casos-de-teste": {
    id: "casos-de-teste",
    nome: "Casos de teste",
    Icone: IconeCasosDeTeste,
    alvo: seletorFerramenta("casos-de-teste"),
    oQueFaz: "Você escreve exemplos (a entrada e a saída que espera) e roda todos contra a sua função: cada um diz se passou e o que veio de fato.",
    praQueServe:
      "Funcionar com um exemplo não prova nada: os esquisitos (lista vazia, zero) é que pegam o erro. É a semente dos testes automatizados que você vai escrever no Ofício.",
    comoUsarAqui: {
      mouse: "Escreva a entrada como numa chamada ([8, 6]) e a saída esperada (7), clique em Adicionar e depois em Rodar os casos.",
      toque: "Escreva a entrada como numa chamada ([8, 6]) e a saída esperada (7), toque em Adicionar e depois em Rodar os casos.",
    },
    noF12DeVerdade:
      "o F12 não tem isso pronto: no Console dá para conferir um caso de cada vez (media([8, 6]) === 7). No Ofício, os mesmos casos viram arquivos de teste que rodam sozinhos.",
    experimente: {
      mouse: "Clique em Rodar os casos.",
      toque: "Toque em Rodar os casos.",
    },
    uso: "sinal",
  },
  // Estruturas e desempenho no palco (zonas Estruturas de dados e Algoritmos essenciais).
  "contador-passos": {
    id: "contador-passos",
    nome: "Contador de passos",
    Icone: IconeContadorPassos,
    alvo: seletorFerramenta("contador-passos"),
    oQueFaz: "Conta quantos passos o programa deu: cada comando que rodou, inclusive cada volta de um laço.",
    praQueServe:
      "Dois programas podem dar a mesma resposta e um deles dar muito mais passos. É o primeiro jeito de comparar quem é mais rápido, sem cronômetro.",
    comoUsarAqui: {
      mouse: "Rode o programa e olhe o número no canto do palco.",
      toque: "Rode o programa e olhe o número no canto do palco.",
    },
    noF12DeVerdade:
      "o Chrome mede em milissegundos, não em passos: a aba Desempenho (Performance) grava o que a página fez, e console.time e console.timeEnd cronometram um trecho no Console.",
    experimente: { mouse: "Clique no contador.", toque: "Toque no contador." },
    uso: "tocar",
  },
  "grafico-passos": {
    id: "grafico-passos",
    nome: "Gráfico de passos",
    Icone: IconeGraficoPassos,
    alvo: seletorFerramenta("grafico-passos"),
    oQueFaz: "Roda a mesma função com listas de tamanhos diferentes e desenha quantos passos ela deu em cada uma.",
    praQueServe:
      "Com 10 itens tudo parece rápido. O gráfico mostra o que acontece quando a lista cresce: se os passos crescem junto (reta) ou disparam (curva), que é o que trava com um milhão de itens.",
    comoUsarAqui: {
      mouse: "Abra a aba Desempenho e clique em Medir. Cada linha é uma função; passe o mouse num ponto para ver o número.",
      toque: "Abra a aba Desempenho e toque em Medir. Cada linha é uma função; toque num ponto para ver o número.",
    },
    noF12DeVerdade:
      "o mais perto é a aba Desempenho (Performance) do Chrome, que grava o tempo de cada coisa. O gráfico daqui conta passos, que não mudam de um computador para o outro.",
    experimente: { mouse: "Clique em Medir.", toque: "Toque em Medir." },
    uso: "sinal",
  },
  "arvore-palco": {
    id: "arvore-palco",
    nome: "Ver como árvore",
    Icone: IconeArvorePalco,
    alvo: seletorFerramenta("arvore-palco"),
    oQueFaz: "Desenha um objeto com filhos como uma árvore: cada objeto é um nó, ligado aos filhos dele.",
    praQueServe:
      "Objeto dentro de objeto fica difícil de ler em fichas. Como árvore, dá para ver quem é filho de quem e o caminho até cada nó. É a mesma ideia da árvore de Elementos do F12.",
    comoUsarAqui: {
      mouse: "Clique em Ver como árvore na caixinha do objeto. Clique de novo para voltar às fichas.",
      toque: "Toque em Ver como árvore na caixinha do objeto. Toque de novo para voltar às fichas.",
    },
    noF12DeVerdade:
      "a aba Elementos mostra a árvore da página (o DOM): o <html> tem o <head> e o <body> como filhos, e assim por diante. Uma árvore de dados no seu programa funciona igual.",
    experimente: { mouse: "Clique em Ver como árvore.", toque: "Toque em Ver como árvore." },
    uso: "sinal",
  },
  // Cenas programáveis: o mundo real que o código controla (src/motor/cena).
  cena: {
    id: "cena",
    nome: "Cena",
    Icone: IconeCena,
    alvo: seletorFerramenta("cena"),
    oQueFaz: "Mostra o mundo que o seu código controla: um quarto, uma vitrine, um portão. Cada dispositivo é um objeto no código.",
    praQueServe:
      "Você escreve lampada.ligar() e vê a lâmpada acender. Com esperar(ms), o tempo da cena anda; Executar roda a cena do começo e ela toca como animação.",
    comoUsarAqui: {
      mouse: "Escreva o código no Snippet e clique em Executar: a cena toca do começo. O botão de tocar repete, e a barra de tempo volta e avança.",
      toque: "Escreva o código no Snippet e toque em Executar: a cena toca do começo. O botão de tocar repete, e a barra de tempo volta e avança.",
    },
    noF12DeVerdade:
      "o F12 não tem cena: na vida real o código roda numa plaquinha (um microcontrolador) ligada aos aparelhos. Na trilha Automação você monta isso de verdade.",
    experimente: {
      mouse: "Clique na cena.",
      toque: "Toque na cena.",
    },
    uso: "tocar",
  },
  // Cenas programáveis: o manual de cada dispositivo, com o "por dentro" (ponte com a trilha Automação).
  "ficha-dispositivo": {
    id: "ficha-dispositivo",
    nome: "Ficha do dispositivo",
    Icone: IconeFichaDispositivo,
    alvo: seletorFerramenta("ficha-dispositivo"),
    oQueFaz: "Abre o manual do dispositivo: o que ele faz, os comandos e as propriedades que o código usa, com um exemplo.",
    praQueServe:
      "Quem programa lê documentação o tempo todo: antes de usar uma peça nova, você descobre como falar com ela. O botão Por dentro mostra o caminho do comando até a lâmpada de verdade.",
    comoUsarAqui: {
      mouse: "Clique num dispositivo da cena (a lâmpada, o sensor...). Na ficha, Por dentro mostra o que acontece depois do comando.",
      toque: "Toque num dispositivo da cena (a lâmpada, o sensor...). Na ficha, Por dentro mostra o que acontece depois do comando.",
    },
    noF12DeVerdade:
      "não fica no F12: é a documentação. No JavaScript do navegador, o MDN (developer.mozilla.org) explica cada comando; numa plaquinha de verdade, quem explica é o manual (datasheet) da peça.",
    experimente: {
      mouse: "Clique num dispositivo da cena.",
      toque: "Toque num dispositivo da cena.",
    },
    uso: "sinal",
  },
  // Cenas programáveis: a cena toca em 1x, 2x ou 4x (o relógio é da simulação, não do mundo).
  "velocidade-simulacao": {
    id: "velocidade-simulacao",
    nome: "Velocidade da simulação",
    Icone: IconeVelocidade,
    alvo: seletorFerramenta("velocidade-simulacao"),
    oQueFaz: "Escolhe se a cena toca no tempo de verdade (1x), duas vezes mais rápido (2x) ou quatro (4x).",
    praQueServe:
      "Uma cena de 10 segundos em 4x passa em 2,5. O tempo do código não muda: esperar(500) continua sendo meio segundo da cena, só a animação corre mais.",
    comoUsarAqui: {
      mouse: "Clique em 1x, 2x ou 4x, embaixo da cena, e clique em tocar.",
      toque: "Toque em 1x, 2x ou 4x, embaixo da cena, e toque em tocar.",
    },
    noF12DeVerdade:
      "o F12 não acelera programas, mas a aba Desempenho (Performance) do Chrome grava o que aconteceu e deixa examinar a gravação com calma, quadro a quadro. Em automação, os simuladores fazem parecido: rodam o tempo mais rápido para testar.",
    experimente: {
      mouse: "Clique em 2x.",
      toque: "Toque em 2x.",
    },
    uso: "sinal",
  },
  // Exposições do Museu das Origens (área exposicao): peças de museu, não do Chrome.
  "tear-de-cartoes": {
    id: "tear-de-cartoes",
    nome: "Tear de cartões",
    Icone: IconeTear,
    alvo: seletorFerramenta("tear-de-cartoes"),
    oQueFaz: "Cada cartão é uma linha do tecido: onde tem furo, o fio sobe e a cor aparece; onde não tem, o fio fica embaixo.",
    praQueServe: "Furando os cartões certos, o tear tece o desenho sozinho, linha por linha. O cartão manda e a máquina obedece.",
    comoUsarAqui: {
      mouse: "Clique num lugar do cartão para furar. Clique de novo para tapar o furo.",
      toque: "Toque num lugar do cartão para furar. Toque de novo para tapar o furo.",
    },
    noF12DeVerdade:
      "não existe no F12: é peça de museu. Mas a ideia ficou. Furo ou sem furo são só duas possibilidades, e é assim que o computador guarda tudo, inclusive esta página.",
    experimente: { mouse: "Clique num lugar do cartão.", toque: "Toque num lugar do cartão." },
    uso: "sinal",
  },
  "lampadas-de-bits": {
    id: "lampadas-de-bits",
    nome: "Lâmpadas de bits",
    Icone: IconeBits,
    alvo: seletorFerramenta("lampadas-de-bits"),
    oQueFaz: "Lâmpadas que só acendem ou apagam. Cada uma vale um peso (1, 2, 4, 8...) e o número é a soma das acesas.",
    praQueServe: "Com quatro lâmpadas dá para mostrar de 0 a 15; com oito, de 0 a 255, e cada número desses pode ser uma letra.",
    comoUsarAqui: {
      mouse: "Clique numa lâmpada para acender ou apagar. O número aparece embaixo.",
      toque: "Toque numa lâmpada para acender ou apagar. O número aparece embaixo.",
    },
    noF12DeVerdade: "no Console, (5).toString(2) mostra o 5 em bits (\"101\"), e parseInt(\"101\", 2) faz o caminho de volta.",
    experimente: { mouse: "Clique numa lâmpada.", toque: "Toque numa lâmpada." },
    uso: "sinal",
  },
  "camadas-da-maquina": {
    id: "camadas-da-maquina",
    nome: "Camadas da máquina",
    Icone: IconeCamadas,
    alvo: seletorFerramenta("camadas-da-maquina"),
    oQueFaz: "Mostra o mesmo programa em camadas: o que a gente escreve, as instruções e a linguagem de máquina, os uns e zeros.",
    praQueServe: "Descer uma camada é traduzir. Tocar numa linha acende o que ela vira lá embaixo: uma linha nossa vira várias instruções.",
    comoUsarAqui: {
      mouse: "Clique em Descer uma camada para traduzir. Clique numa linha para ver o que ela vira.",
      toque: "Toque em Descer uma camada para traduzir. Toque numa linha para ver o que ela vira.",
    },
    noF12DeVerdade:
      "o F12 mostra a camada de cima, na aba Fontes. A tradução para a máquina acontece sozinha, dentro do navegador, enquanto a página roda.",
    experimente: { mouse: "Clique em Descer uma camada.", toque: "Toque em Descer uma camada." },
    uso: "sinal",
  },
  "mesa-de-cores": {
    id: "mesa-de-cores",
    nome: "Mesa de cores",
    Icone: IconeMesaCores,
    alvo: seletorFerramenta("mesa-de-cores"),
    oQueFaz: "Monta uma cor em hexadecimal: dois dígitos de vermelho, dois de verde e dois de azul, de 00 (nada) a ff (tudo).",
    praQueServe: "É o mesmo #ff8800 do CSS. Cada par de dígitos é um número de 0 a 255 contando de 16 em 16, com letras de a a f depois do 9.",
    comoUsarAqui: {
      mouse: "Clique nas setinhas de cada dígito para subir ou descer. A cor e o CSS mudam na hora.",
      toque: "Toque nas setinhas de cada dígito para subir ou descer. A cor e o CSS mudam na hora.",
    },
    noF12DeVerdade:
      "no painel Estilos da aba Elementos, ao lado de cada cor há um quadradinho: clicar nele abre o seletor de cores, e Shift + clique troca o jeito de escrever (hexadecimal, rgb, hsl).",
    experimente: { mouse: "Clique numa setinha.", toque: "Toque numa setinha." },
    uso: "sinal",
  },
  "linha-do-tempo-museu": {
    id: "linha-do-tempo-museu",
    nome: "Linha do tempo",
    Icone: IconeLinhaDoTempoMuseu,
    alvo: seletorFerramenta("linha-do-tempo-museu"),
    oQueFaz: "Cartões de máquinas e acontecimentos para pôr na ordem em que aconteceram, do mais antigo ao mais novo.",
    praQueServe: "Cartão no lugar certo mostra a época e o que ele mudou. Uma invenção quase sempre precisa das de antes.",
    comoUsarAqui: {
      mouse: "Clique num cartão da caixa e depois no lugar da linha. As setas mudam de lugar; o x devolve para a caixa.",
      toque: "Toque num cartão da caixa e depois no lugar da linha. As setas mudam de lugar; o x devolve para a caixa.",
    },
    noF12DeVerdade: "não existe no F12: é a história que explica por que o F12 é do jeito que é.",
    experimente: { mouse: "Clique num cartão da caixa.", toque: "Toque num cartão da caixa." },
    uso: "sinal",
  },
  "comparador-de-linguagens": {
    id: "comparador-de-linguagens",
    nome: "Comparador de linguagens",
    Icone: IconeComparador,
    alvo: seletorFerramenta("comparador-de-linguagens"),
    oQueFaz: "Mostra o mesmo programa escrito em várias linguagens, lado a lado, e roda cada um.",
    praQueServe: "Tocar numa linha acende a mesma parte em todas: o conceito é o mesmo, muda a escrita. JavaScript e Python rodam de verdade; as outras mostram a saída pronta, marcada como simulada.",
    comoUsarAqui: {
      mouse: "Clique em Rodar para ver a saída. Clique numa linha para acender a mesma parte nas outras linguagens.",
      toque: "Toque em Rodar para ver a saída. Toque numa linha para acender a mesma parte nas outras linguagens.",
    },
    noF12DeVerdade: "o Console do F12 roda JavaScript, a linguagem dos navegadores. As outras linguagens rodam fora dele: no computador, num servidor ou dentro de aparelhos.",
    experimente: { mouse: "Clique em Rodar.", toque: "Toque em Rodar." },
    uso: "sinal",
  },
  "cartoes-de-ligar": {
    id: "cartoes-de-ligar",
    nome: "Cartões de ligar",
    Icone: IconeCartoesLigar,
    alvo: seletorFerramenta("cartoes-de-ligar"),
    oQueFaz: "Cartões para pôr no lugar certo: cada um tem o seu par do outro lado.",
    praQueServe: "Cartão no lugar certo mostra uma curiosidade. Dá para mudar de ideia: é só levar o cartão para outro lugar.",
    comoUsarAqui: {
      mouse: "Clique num cartão e depois no lugar onde ele vai.",
      toque: "Toque num cartão e depois no lugar onde ele vai.",
    },
    noF12DeVerdade: "não existe no F12: é a mesa do museu para organizar as ideias.",
    experimente: { mouse: "Clique num cartão.", toque: "Toque num cartão." },
    uso: "sinal",
  },
  "ordem-dos-cartoes": {
    id: "ordem-dos-cartoes",
    nome: "Fila de cartões",
    Icone: IconeOrdemCartoes,
    alvo: seletorFerramenta("ordem-dos-cartoes"),
    oQueFaz: "Cartões para pôr em ordem: os degraus de uma escada ou as etapas de um acontecimento.",
    praQueServe: "Cartão no lugar certo, em relação aos outros da fila, acende e mostra por quê.",
    comoUsarAqui: {
      mouse: "Clique num cartão da caixa e depois no lugar da fila. As setas mudam de lugar; o x devolve para a caixa.",
      toque: "Toque num cartão da caixa e depois no lugar da fila. As setas mudam de lugar; o x devolve para a caixa.",
    },
    noF12DeVerdade: "não existe no F12: é a mesa do museu para organizar as ideias.",
    experimente: { mouse: "Clique num cartão da caixa.", toque: "Toque num cartão da caixa." },
    uso: "sinal",
  },
  "compilar-interpretar": {
    id: "compilar-interpretar",
    nome: "Compilar ou interpretar",
    Icone: IconeCompilarInterpretar,
    alvo: seletorFerramenta("compilar-interpretar"),
    oQueFaz: "Mostra os dois jeitos de traduzir um programa para a máquina: tudo antes (compilar) ou linha a linha (interpretar).",
    praQueServe: "O compilador entrega um programa pronto, que roda de novo sem traduzir; o intérprete traduz enquanto roda, toda vez.",
    comoUsarAqui: {
      mouse: "Clique em Compilar ou em Interpretar e acompanhe o placar de traduções.",
      toque: "Toque em Compilar ou em Interpretar e acompanhe o placar de traduções.",
    },
    noF12DeVerdade: "o JavaScript da página é traduzido pelo próprio navegador enquanto ela roda. Na aba Desempenho (Performance) dá para ver o tempo de \"Compile\" no meio do trabalho.",
    experimente: { mouse: "Clique em Compilar.", toque: "Toque em Compilar." },
    uso: "sinal",
  },
  "caixas-da-memoria": {
    id: "caixas-da-memoria",
    nome: "Caixas da memória",
    Icone: IconeCaixasMemoria,
    alvo: seletorFerramenta("caixas-da-memoria"),
    oQueFaz: "A memória como uma fileira de caixas, cada uma com o seu endereço (o número dela).",
    praQueServe: "Uma variável é um nome para uma caixa: quando o programa guarda o preço, o número vai para uma caixa de endereço certo.",
    comoUsarAqui: {
      mouse: "Clique em Rodar uma linha para o programa guardar valores. Clique numa caixa para apontar para ela.",
      toque: "Toque em Rodar uma linha para o programa guardar valores. Toque numa caixa para apontar para ela.",
    },
    noF12DeVerdade: "a aba Memória (Memory) do F12 tira uma foto de tudo o que a página guarda na memória, com o tamanho de cada coisa.",
    experimente: { mouse: "Clique em Rodar uma linha.", toque: "Toque em Rodar uma linha." },
    uso: "sinal",
  },
  "processador-de-brinquedo": {
    id: "processador-de-brinquedo",
    nome: "Processador de brinquedo",
    Icone: IconeProcessador,
    alvo: seletorFerramenta("processador-de-brinquedo"),
    oQueFaz: "Um processador simplificado rodando ordens uma de cada vez, no ciclo buscar, entender, executar.",
    praQueServe: "O contador diz onde está a próxima ordem; o acumulador guarda a conta do momento. Os processadores de verdade repetem esse ciclo bilhões de vezes por segundo.",
    comoUsarAqui: {
      mouse: "Clique em Próximo passo para andar uma etapa do ciclo. Rodar até o fim faz tudo de uma vez.",
      toque: "Toque em Próximo passo para andar uma etapa do ciclo. Rodar até o fim faz tudo de uma vez.",
    },
    noF12DeVerdade: "não dá para ver o processador no F12, mas o Gerenciador de tarefas do computador mostra o quanto ele está trabalhando agora.",
    experimente: { mouse: "Clique em Próximo passo.", toque: "Toque em Próximo passo." },
    uso: "sinal",
  },
  "gerente-do-sistema": {
    id: "gerente-do-sistema",
    nome: "O gerente do sistema",
    Icone: IconeGerenteSistema,
    alvo: seletorFerramenta("gerente-do-sistema"),
    oQueFaz: "Você faz o papel do sistema operacional: dá a vez do processador a um programa por fatia de tempo.",
    praQueServe: "O processador faz uma coisa por vez, mas troca tão rápido que parece tudo junto. Quem tem pressa (a música) não pode esperar muito.",
    comoUsarAqui: {
      mouse: "Clique num programa para dar a próxima fatia a ele. Automático deixa o gerente terminar.",
      toque: "Toque num programa para dar a próxima fatia a ele. Automático deixa o gerente terminar.",
    },
    noF12DeVerdade: "o Gerenciador de tarefas (Ctrl + Shift + Esc no Windows) e o do próprio Chrome (Shift + Esc) mostram cada programa, a memória e o processador que ele usa.",
    experimente: { mouse: "Clique num programa.", toque: "Toque num programa." },
    uso: "sinal",
  },
  "arvore-de-pastas": {
    id: "arvore-de-pastas",
    nome: "Árvore de pastas",
    Icone: IconeArvorePastas,
    alvo: seletorFerramenta("arvore-de-pastas"),
    oQueFaz: "O explorador de arquivos: pastas dentro de pastas, com os arquivos nas pontas.",
    praQueServe: "Isso é uma árvore: a raiz no topo, as pastas são galhos e os arquivos são folhas. O caminho de um arquivo é a trilha da raiz até ele.",
    comoUsarAqui: {
      mouse: "Clique numa pasta para abrir; clique num arquivo para escolher. Mover leva o arquivo escolhido para outra pasta.",
      toque: "Toque numa pasta para abrir; toque num arquivo para escolher. Mover leva o arquivo escolhido para outra pasta.",
    },
    noF12DeVerdade: "a aba Fontes (Sources) do F12 mostra os arquivos da página como árvore de pastas, do jeitinho do explorador.",
    experimente: { mouse: "Clique numa pasta.", toque: "Toque numa pasta." },
    uso: "sinal",
  },
  "painel-de-cabos": {
    id: "painel-de-cabos",
    nome: "Painel de cabos",
    Icone: IconePainelCabos,
    alvo: seletorFerramenta("painel-de-cabos"),
    oQueFaz: "Liga a saída de uma peça na entrada de outra com um cabo. As chaves ligam e desligam.",
    praQueServe: "Era assim que se programavam os computadores de válvulas: plugando cabos. Com portões, é o mesmo circuito, e a lâmpada acende quando a conta pede.",
    comoUsarAqui: {
      mouse: "Clique na bolinha de saída de uma peça e depois numa bolinha de entrada. Clique numa chave para ligar ou desligar.",
      toque: "Toque na bolinha de saída de uma peça e depois numa bolinha de entrada. Toque numa chave para ligar ou desligar.",
    },
    noF12DeVerdade: "não existe no F12: os portões viraram os operadores &&, || e ! do JavaScript.",
    experimente: { mouse: "Clique numa chave.", toque: "Toque numa chave." },
    uso: "sinal",
  },
  "caminho-do-clique": {
    id: "caminho-do-clique",
    nome: "O caminho de um clique",
    Icone: IconeCaminhoClique,
    alvo: seletorFerramenta("caminho-do-clique"),
    oQueFaz: "Mostra, etapa por etapa, o que acontece entre o clique num link e a página aparecer.",
    praQueServe: "O navegador (o front) pergunta o endereço ao DNS, o pedido viaja pelos roteadores até o servidor (o back) e a resposta volta para virar página.",
    comoUsarAqui: {
      mouse: "Clique no link para começar e em Próxima etapa para andar. Os cenários mostram o que acontece quando algo quebra.",
      toque: "Toque no link para começar e em Próxima etapa para andar. Os cenários mostram o que acontece quando algo quebra.",
    },
    noF12DeVerdade: "a aba Rede (Network) do F12 mostra cada pedido que a página fez, e o tempo de cada etapa (DNS, conexão, espera do servidor) na aba Tempo (Timing).",
    experimente: { mouse: "Clique no link.", toque: "Toque no link." },
    uso: "sinal",
  },
  "mapa-dos-cabos": {
    id: "mapa-dos-cabos",
    nome: "O mapa dos cabos",
    Icone: IconeMapaCabos,
    alvo: seletorFerramenta("mapa-dos-cabos"),
    oQueFaz: "O mapa com os roteadores e os cabos, inclusive os do fundo do mar. Você leva o pacote, um pulo de cada vez.",
    praQueServe: "A internet é física: os pacotes andam por cabos de verdade. Se um cabo parte, os roteadores acham outro caminho.",
    comoUsarAqui: {
      mouse: "Clique num ponto vizinho (os que piscam) para o pacote pular até ele. Voltar desfaz o último pulo.",
      toque: "Toque num ponto vizinho (os que piscam) para o pacote pular até ele. Voltar desfaz o último pulo.",
    },
    noF12DeVerdade: "o F12 não mostra o caminho, mas o comando tracert (Windows) ou traceroute (Mac e Linux), no terminal, lista cada roteador por onde o pacote passa.",
    experimente: { mouse: "Clique num ponto que pisca.", toque: "Toque num ponto que pisca." },
    uso: "sinal",
  },
  "aba-rede-previa": {
    id: "aba-rede-previa",
    nome: "Aba Rede",
    Icone: IconeAbaRede,
    alvo: seletorFerramenta("aba-rede-previa"),
    oQueFaz: "Uma prévia da aba Rede (Network) do F12: cada arquivo que a página pediu, com o status, o tamanho e o tempo.",
    praQueServe: "Recarregar com a aba aberta grava tudo. A cascata mostra quem veio primeiro e quem demorou; um 404 é um arquivo que o servidor não achou.",
    comoUsarAqui: {
      mouse: "Clique em Recarregar para gravar. Clique numa linha para ver os detalhes; clique em Tempo para ordenar.",
      toque: "Toque em Recarregar para gravar. Toque numa linha para ver os detalhes; toque em Tempo para ordenar.",
    },
    noF12DeVerdade: "F12, aba Rede (Network), e recarregue a página (F5). A coluna Status, a Tamanho (Size), a Tempo (Time) e a Cascata (Waterfall) são as mesmas daqui.",
    experimente: { mouse: "Clique em Recarregar.", toque: "Toque em Recarregar." },
    uso: "sinal",
  },
  "cidade-do-codigo": {
    id: "cidade-do-codigo",
    nome: "A cidade do código",
    Icone: IconeCidadeCodigo,
    alvo: seletorFerramenta("cidade-do-codigo"),
    oQueFaz: "Uma cidade com programas escondidos em todo lugar. Tocar num lugar abre o código de dentro.",
    praQueServe: "Semáforo, caixa eletrônico, aplicativo, carro: alguém programou cada um. Cada lugar mostra quem faz esse trabalho.",
    comoUsarAqui: {
      mouse: "Clique num lugar da cidade para ver o código de dentro e quem programa aquilo.",
      toque: "Toque num lugar da cidade para ver o código de dentro e quem programa aquilo.",
    },
    noF12DeVerdade: "o F12 abre o código de qualquer site. Os programas dos aparelhos (o semáforo, o carro) ficam guardados dentro deles, sem F12.",
    experimente: { mouse: "Clique num lugar da cidade.", toque: "Toque num lugar da cidade." },
    uso: "sinal",
    lugar: { rotulo: "Ver as profissões", href: "/profissoes" },
  },
};

export const LISTA_FERRAMENTAS: readonly Ferramenta[] = IDS_FERRAMENTAS.map((id) => FERRAMENTAS[id]);

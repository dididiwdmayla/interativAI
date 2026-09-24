import type { ComponentType } from "react";
import { IconeArvore } from "@/componentes/icones/IconeArvore";
import { IconeCodigo } from "@/componentes/icones/IconeCodigo";
import { IconeEditarDuplo } from "@/componentes/icones/IconeEditarDuplo";
import { IconeInspecionar } from "@/componentes/icones/IconeInspecionar";
import { IconeMeAjuda } from "@/componentes/icones/IconeMeAjuda";
import { IconePainel } from "@/componentes/icones/IconePainel";
import { IconePrevia } from "@/componentes/icones/IconePrevia";
import { IconeSincronia } from "@/componentes/icones/IconeSincronia";
import { IconeTutor } from "@/componentes/icones/IconeTutor";
import type { PropsIcone } from "@/componentes/icones/tipos";
import { DemoArvore } from "./demos/DemoArvore";
import { DemoEditarDuploClique } from "./demos/DemoEditarDuploClique";
import { DemoInspecionar } from "./demos/DemoInspecionar";
import { DemoSincronia } from "./demos/DemoSincronia";
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
};

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
};

export const LISTA_FERRAMENTAS: readonly Ferramenta[] = IDS_FERRAMENTAS.map((id) => FERRAMENTAS[id]);

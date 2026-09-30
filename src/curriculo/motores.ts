/*
 * Motores planejados: tipos de fase aprovados que ainda não existem no
 * motor, mas que o currículo já conta. Cada um diz o que o jogador faz,
 * as peças da interface e onde vai ser usado (unidades do currículo e
 * trilhas). Serve de ficha para quem for construir o motor e de trava
 * para ninguém produzir conteúdo antes: toda unidade citada aqui tem um
 * `requerMotor` (dela ou da zona) que nomeia o tipo de fase.
 *
 * Quando o motor ficar pronto, o tipo de fase entra no registro de tipos
 * (src/motor/tiposDeFase.ts), a entrada sai daqui e o `requerMotor` das
 * unidades cai.
 */
import type { IdIlha } from "./trilhas";

export type IdMotorPlanejado = "circuito-logico" | "ordenar-passos" | "depurador-fontes" | "visualizador-arvore" | "projeto-ponte-js";

export type UsoDoMotor = {
  /** Unidade do currículo que usa o tipo de fase. */
  unidadeId: string;
  /** Como a unidade usa o motor, em uma frase. */
  como: string;
};

export type MotorPlanejado = {
  /** O nome do tipo de fase, como vai aparecer em `Fase.tipo`. */
  id: IdMotorPlanejado;
  nome: string;
  /** A ideia, para leigo, em uma ou duas frases. */
  ideia: string;
  /** O que a bancada precisa ter (as peças da interface e do modelo). */
  pecas: readonly string[];
  usadoEm: readonly UsoDoMotor[];
  /** Trilhas que vão usar o motor, além das unidades já citadas (ex.: a Automação, ainda sem zonas). */
  trilhas: readonly string[];
  /** Ilhas futuras (só nomeadas) que devem usar o motor quando ganharem zonas. */
  ilhasFuturas: readonly IdIlha[];
};

export const MOTORES_PLANEJADOS: readonly MotorPlanejado[] = [
  {
    id: "circuito-logico",
    nome: "Circuito lógico",
    ideia:
      "Montar portões lógicos (E, OU, NÃO) arrastando e ligando peças para fazer uma saída acontecer, e depois ver o mesmo circuito escrito como código.",
    pecas: [
      "portões E, OU e NÃO para arrastar numa bancada",
      "fios ligando saídas a entradas",
      "entradas que o jogador liga e desliga (chaves)",
      "saídas que acendem (lâmpada, porta que abre)",
      "tabela verdade do circuito, preenchida ao vivo",
      'botão "ver como código", que mostra o circuito com &&, || e !',
      "realimentação (a saída voltando para a entrada), para a memória simples",
    ],
    usadoEm: [
      {
        unidadeId: "logica-decisoes-u2",
        como: 'Antes de escrever if com &&, || e !, montar o circuito ("a porta da padaria só abre se tiver cliente E a loja estiver aberta") e depois ver o mesmo circuito como código.',
      },
      {
        unidadeId: "origens-museu-u6",
        como: "Quebra-cabeças maiores: somar dois números só com portões e uma memória simples com realimentação (o mesmo princípio do selo da contatora).",
      },
    ],
    trilhas: ["web", "automacao"],
    ilhasFuturas: ["comandos-eletricos", "clp-e-ladder"],
  },
  {
    id: "ordenar-passos",
    nome: "Ordenar passos",
    ideia: "Arrastar os passos de um programa (em português ou em código) para a ordem certa e ver o que acontece quando a ordem muda.",
    pecas: [
      "cartões de passo para arrastar (mouse e toque)",
      "rodar a ordem escolhida e ver o resultado no palco da memória",
      "passos que sobram (distratores) e passos que podem trocar de lugar sem mudar nada",
    ],
    usadoEm: [
      { unidadeId: "logica-resolvendo-problemas-u1", como: "Quebrar um problema em passos e pôr os passos na ordem." },
      { unidadeId: "logica-resolvendo-problemas-u2", como: "Montar o pseudocódigo com cartões antes de escrever o código." },
      { unidadeId: "logica-resolvendo-problemas-u3", como: "Ordenar linhas de código e ver o que quebra com a ordem errada." },
    ],
    trilhas: ["web"],
    ilhasFuturas: [],
  },
  {
    id: "depurador-fontes",
    nome: "Aba Fontes com depurador",
    ideia: "Parar o programa numa linha, andar uma linha de cada vez e observar as variáveis, como na aba Fontes do Chrome.",
    pecas: [
      "aba Fontes com o código e a margem dos números de linha",
      "pontos de parada (clique no número da linha)",
      "botões continuar, próxima linha, entrar e sair da função",
      "painéis Escopo, Observar e Pilha de chamadas",
    ],
    usadoEm: [
      { unidadeId: "logica-depuracao-u2", como: "Pôr um ponto de parada e olhar os valores naquele momento." },
      { unidadeId: "logica-depuracao-u3", como: "Andar passo a passo e achar a linha onde o valor fica errado." },
    ],
    trilhas: ["web"],
    ilhasFuturas: [],
  },
  {
    id: "visualizador-arvore",
    nome: "Visualizador de árvore",
    ideia: "Desenhar uma árvore de dados (nós e filhos) e ver o percurso acontecer nó por nó.",
    pecas: [
      "árvore desenhada a partir de um objeto do programa",
      "o nó visitado aceso a cada passo da linha do tempo",
      "a mesma árvore lado a lado com a aba Elementos (o DOM é uma árvore)",
    ],
    usadoEm: [{ unidadeId: "logica-estruturas-de-dados-u3", como: "Percorrer uma árvore e comparar com a árvore de elementos do F12." }],
    trilhas: ["web"],
    ilhasFuturas: [],
  },
  {
    id: "projeto-ponte-js",
    nome: "Projeto-ponte de JavaScript",
    ideia: "Levar um programa escrito no jogo para Fontes > Snippets do Chrome de verdade e rodar lá, em qualquer página.",
    pecas: [
      "baixar o programa como arquivo .js",
      "guia passo a passo para criar o snippet no Chrome (conferido na época, com data)",
      "conferir o programa com exemplos antes de levar",
    ],
    usadoEm: [{ unidadeId: "logica-programa-de-verdade-u1", como: "O programa final da ilha, feito sozinho e rodado fora do jogo." }],
    trilhas: ["web"],
    ilhasFuturas: [],
  },
];

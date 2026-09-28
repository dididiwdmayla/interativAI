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

export type IdMotorPlanejado = "circuito-logico";

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
];

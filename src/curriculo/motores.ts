/*
 * Motores planejados: tipos de fase aprovados que ainda não existem no
 * motor, mas que o currículo já conta. Cada um diz o que o jogador faz,
 * as peças da interface e onde vai ser usado (unidades do currículo e
 * trilhas). Serve de ficha para quem for construir o motor e de trava
 * para ninguém produzir conteúdo antes: toda unidade citada aqui tem um
 * `requerMotor` (dela ou da zona) que nomeia o tipo de fase.
 *
 * O `circuito-logico` saiu daqui na rodada 17 (src/motor/circuito,
 * tipo de fase em src/motor/tiposDeFase.ts). Na rodada 22 saíram o
 * `ordenar-passos` (tipo de fase, src/motor/ordenar), o `depurador-fontes`
 * (aba Fontes, src/motor/depurador.ts) e o `visualizador-arvore` ("Ver
 * como árvore" no palco, src/motor/estruturas.ts). Na rodada 29 saiu o
 * `projeto-ponte-js`: o contrato (src/motor/contrato) leva o programa da
 * Ilha Lógica pro mundo como um .js que roda no Console e no Node.
 *
 * Quando o motor ficar pronto, o tipo de fase entra no registro de tipos
 * (src/motor/tiposDeFase.ts), a entrada sai daqui e o `requerMotor` das
 * unidades cai.
 */
import type { IdIlha } from "./trilhas";

/** O id do tipo de fase (ou da atividade) planejado. */
export type IdMotorPlanejado = string;

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
    // Registrado na rodada 36 (currículo ampliado). Nenhum motor da Lógica
    // segue planejado: este é do Ofício e dos contratos das próximas ilhas.
    id: "entrevista-cliente",
    nome: "Entrevista com o cliente",
    ideia:
      "O aluno conversa com o dono do negócio para descobrir o problema antes de programar. As perguntas sugeridas resolvem o caso sozinhas, sem IA; a pergunta livre é um extra em que o Gemini interpreta o cliente.",
    pecas: [
      "a ficha do cliente escrita no conteúdo: os fatos que dá para descobrir, cada um com as perguntas sugeridas que o revelam (a fonte única da verdade: o modelo só pode contar o que está na ficha)",
      "a lista de perguntas sugeridas, suficiente para descobrir todos os fatos necessários sem pergunta livre",
      "a pergunta livre como extra: um modelo leve interpreta o cliente a partir da ficha, sem inventar fato novo",
      "o tempo do cliente: umas 10 perguntas por conversa, com o relógio visível e a despedida quando acaba",
      "limite de perguntas livres por aluno no servidor (a chave do Gemini nunca vai para o cliente)",
      "o caderno de anotações: os fatos descobertos aparecem conforme a conversa e viram o briefing do contrato",
    ],
    usadoEm: [{ unidadeId: "oficio-carreira-u3", como: "a primeira conversa com um cliente freelancer, antes do orçamento" }],
    trilhas: ["web"],
    ilhasFuturas: [],
  },
];

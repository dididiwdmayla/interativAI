/*
 * Temas: uma lente sobre o mapa. Um tema junta o que se aprende sobre um
 * mesmo assunto em ilhas diferentes (Segurança aparece na Rede e Servidor,
 * na IA e no Ofício). Não reorganiza nada: a ordem das ilhas continua a
 * dos pré-requisitos.
 *
 * Todo conceito (src/conteudo/conceitos.ts) tem pelo menos um tema, e toda
 * unidade do currículo declara os temas dela (as planejadas também, para
 * acenderem na lente). Nas unidades prontas, os temas de verdade vêm dos
 * conceitos que elas ensinam e praticam; os declarados precisam estar
 * contidos neles (checagem do testar:conteudo).
 *
 * O catálogo segue o ponto de partida do prompt da rodada 10, com um tema
 * a mais, Fundamentos (ver docs/PROJETO.md, "Temas").
 */

export const IDS_TEMAS = [
  "fundamentos",
  "interfaces",
  "acessibilidade",
  "logica",
  "dados",
  "apis",
  "servidores",
  "seguranca",
  "desempenho",
  "ia",
  "ferramentas",
] as const;

export type IdTema = (typeof IDS_TEMAS)[number];

export type DadosTema = {
  id: IdTema;
  nome: string;
  /** Uma frase de leigo: do que o tema trata. */
  descricao: string;
};

export const TEMAS: readonly DadosTema[] = [
  {
    id: "fundamentos",
    nome: "Fundamentos",
    descricao: "Como o computador funciona por dentro, de onde vieram as linguagens e onde a programação vive.",
  },
  {
    id: "interfaces",
    nome: "Interfaces",
    descricao: "Tudo o que a pessoa vê e toca na tela: as peças da página, as cores, o tamanho e o lugar de cada coisa.",
  },
  {
    id: "acessibilidade",
    nome: "Acessibilidade",
    descricao: "Fazer páginas que todo mundo consegue usar, inclusive quem usa leitor de tela, teclado ou letra grande.",
  },
  {
    id: "logica",
    nome: "Lógica",
    descricao: "Dar ordens ao computador passo a passo: decisões, repetições, funções e o jeito de pensar num problema.",
  },
  {
    id: "dados",
    nome: "Dados",
    descricao: "Guardar, organizar e encontrar informação: listas, tabelas, bancos de dados e formatos como o JSON.",
  },
  {
    id: "apis",
    nome: "APIs",
    descricao: "Como um programa conversa com outro pela internet: pedidos, respostas e combinados entre os dois lados.",
  },
  {
    id: "servidores",
    nome: "Servidores",
    descricao: "Os computadores que ficam ligados em algum lugar respondendo pedidos, e como pôr um site no ar neles.",
  },
  {
    id: "seguranca",
    nome: "Segurança",
    descricao: "Proteger contas, senhas e dados de quem usa o sistema, e fechar as portas que atacantes procuram.",
  },
  {
    id: "desempenho",
    nome: "Desempenho",
    descricao: "Deixar as coisas rápidas e leves: por que um programa trava, o que pesa numa página e como medir.",
  },
  {
    id: "ia",
    nome: "IA",
    descricao: "Como os modelos de IA escrevem, como pedir do jeito certo e como revisar o que eles entregam.",
  },
  {
    id: "ferramentas",
    nome: "Ferramentas do ofício",
    descricao: "As ferramentas do dia a dia de quem programa: F12, terminal, Git, editor, testes e publicação.",
  },
];

export function ehIdTema(valor: unknown): valor is IdTema {
  return typeof valor === "string" && (IDS_TEMAS as readonly string[]).includes(valor);
}

export function temaDoId(id: IdTema): DadosTema {
  const tema = TEMAS.find((item) => item.id === id);
  if (!tema) throw new Error(`tema desconhecido: ${id}`);
  return tema;
}

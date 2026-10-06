/*
 * O kit de clientes: cada cliente é DADO (nome, negócio e a aparência,
 * montada com as peças do kit de desenho em src/componentes/contrato/kit).
 * Criar um cliente novo é escolher as peças, não desenhar do zero (ver o
 * guia, seção 31.6). Nomes e negócios são originais: nada de personagens ou
 * marcas conhecidas.
 */

export const PELES = ["clara", "media", "morena", "escura"] as const;
export const CABELOS = ["coque", "curto", "cacheado", "longo", "careca", "rabo"] as const;
export const CORES_CABELO = ["preto", "castanho", "ruivo", "loiro", "grisalho"] as const;
export const ROUPAS = ["avental", "camisa", "jaleco", "macacao"] as const;
export const CORES_ROUPA = ["azul", "vermelho", "verde", "amarelo", "roxo"] as const;
export const ACESSORIOS = ["oculos", "bigode", "touca", "brincos", "lenco", "bone"] as const;

export type Pele = (typeof PELES)[number];
export type Cabelo = (typeof CABELOS)[number];
export type CorCabelo = (typeof CORES_CABELO)[number];
export type Roupa = (typeof ROUPAS)[number];
export type CorRoupa = (typeof CORES_ROUPA)[number];
export type Acessorio = (typeof ACESSORIOS)[number];

/** A aparência de um cliente: as peças do kit (as cores vêm dos tokens --cor-cliente-*, nos três temas). */
export type AparenciaCliente = {
  pele: Pele;
  cabelo: Cabelo;
  corCabelo: CorCabelo;
  roupa: Roupa;
  corRoupa: CorRoupa;
  acessorios?: readonly Acessorio[];
};

export type Cliente = {
  id: string;
  /** Como ele se apresenta: "Dona Celeste". Até 24 letras. */
  nome: string;
  /** O negócio, curto: "Padaria Pão de Mel". Até 40 letras. */
  negocio: string;
  aparencia: AparenciaCliente;
};

export const CLIENTES = {
  "dona-celeste": {
    id: "dona-celeste",
    nome: "Dona Celeste",
    negocio: "Padaria Pão de Mel",
    aparencia: { pele: "morena", cabelo: "coque", corCabelo: "grisalho", roupa: "avental", corRoupa: "vermelho", acessorios: ["oculos", "touca"] },
  },
  "rafa-estudio": {
    id: "rafa-estudio",
    nome: "Rafa",
    negocio: "Estúdio de música no quarto",
    aparencia: { pele: "escura", cabelo: "cacheado", corCabelo: "preto", roupa: "camisa", corRoupa: "verde", acessorios: ["brincos"] },
  },
  "seu-tonho": {
    id: "seu-tonho",
    nome: "Seu Tonho",
    negocio: "Mercadinho Estrela",
    aparencia: { pele: "media", cabelo: "careca", corCabelo: "grisalho", roupa: "camisa", corRoupa: "azul", acessorios: ["bigode", "oculos"] },
  },
  "dona-zelia": {
    id: "dona-zelia",
    nome: "Dona Zélia",
    negocio: "Salão Girassol",
    aparencia: { pele: "clara", cabelo: "longo", corCabelo: "ruivo", roupa: "jaleco", corRoupa: "roxo", acessorios: ["brincos"] },
  },
} as const satisfies Record<string, Cliente>;

export type IdCliente = keyof typeof CLIENTES;

export function ehIdCliente(valor: unknown): valor is IdCliente {
  return typeof valor === "string" && Object.prototype.hasOwnProperty.call(CLIENTES, valor);
}

export function clienteDe(id: IdCliente): Cliente {
  return CLIENTES[id];
}

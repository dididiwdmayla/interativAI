/*
 * Os registros das tomadas (src/dados/takes/<id>.json, gerados pelo
 * scripts/montar-tomada.mjs): marcas, caixas e o caminho do cursor. O vídeo de
 * cada uma fica em public/takes/<id>.mp4 (fora do git).
 */
import type { Area, IdTomada, Instante } from "../roteiro";
import T01 from "../dados/takes/T01-sites-u1.json";
import T02 from "../dados/takes/T02-mundo-dia.json";
import T03 from "../dados/takes/T03-mundo-noite.json";
import T04 from "../dados/takes/T04-ilha-sites.json";
import T05 from "../dados/takes/T05-estilos-cor.json";
import T06 from "../dados/takes/T06-flexbox.json";
import T07 from "../dados/takes/T07-console.json";
import T08 from "../dados/takes/T08-padaria-vitrine.json";
import T09 from "../dados/takes/T09-contrato-cliente.json";
import T10 from "../dados/takes/T10-depurador.json";
import T11 from "../dados/takes/T11-museu-corredor.json";
import T12 from "../dados/takes/T12-comparador.json";
import T13 from "../dados/takes/T13-mesa-de-cores.json";
import T14 from "../dados/takes/T14-glossario.json";
import T15 from "../dados/takes/T15-profissoes.json";
import T16 from "../dados/takes/T16-lente-tema.json";
import T17 from "../dados/takes/T17-troca-tema.json";
import T18 from "../dados/takes/T18-em-construcao.json";
import V01 from "../dados/takes/V01-sites-u1-celular.json";
import V02 from "../dados/takes/V02-mundo-celular.json";
import V03 from "../dados/takes/V03-padaria-celular.json";
import V04 from "../dados/takes/V04-museu-celular.json";

export type CaixaDeIlha = { ilha: string; nome: string; x: number; y: number; l: number; a: number; arte: Area | null };
export type Evento = {
  t: number;
  tipo: "mover" | "clique" | "duplo-clique" | "tecla" | "toque" | "dedo-desce" | "dedo-move" | "dedo-sobe" | "marca" | "caixa" | "rolagem";
  nome?: string;
  x?: number;
  y?: number;
  l?: number;
  a?: number;
  letra?: string;
  dx?: number;
  dy?: number;
  ms?: number;
  caixas?: CaixaDeIlha[];
};
export type Take = {
  id: string;
  formato: "computador" | "perto" | "medio" | "celular";
  pagina: { largura: number; altura: number; escala: number };
  saida: { largura: number; altura: number };
  duracao: number;
  eventos: Evento[];
};

export const TAKES = {
  "T01-sites-u1": T01,
  "T02-mundo-dia": T02,
  "T03-mundo-noite": T03,
  "T04-ilha-sites": T04,
  "T05-estilos-cor": T05,
  "T06-flexbox": T06,
  "T07-console": T07,
  "T08-padaria-vitrine": T08,
  "T09-contrato-cliente": T09,
  "T10-depurador": T10,
  "T11-museu-corredor": T11,
  "T12-comparador": T12,
  "T13-mesa-de-cores": T13,
  "T14-glossario": T14,
  "T15-profissoes": T15,
  "T16-lente-tema": T16,
  "T17-troca-tema": T17,
  "T18-em-construcao": T18,
  "V01-sites-u1-celular": V01,
  "V02-mundo-celular": V02,
  "V03-padaria-celular": V03,
  "V04-museu-celular": V04,
} as unknown as Record<IdTomada, Take>;

export const takeDe = (id: IdTomada): Take => TAKES[id];

/** O instante (s) de uma marca da tomada. */
export function marca(take: Take, nome: string): number {
  const evento = take.eventos.find((item) => item.tipo === "marca" && item.nome === nome);
  if (!evento) throw new Error(`a tomada ${take.id} não tem a marca "${nome}"`);
  return evento.t;
}

/** Um instante do roteiro (número ou marca) em segundos da tomada. */
export function instante(take: Take, valor: Instante): number {
  return typeof valor === "number" ? valor : marca(take, valor.marca) + (valor.mais ?? 0);
}

/** Uma caixa registrada na tomada (por t.caixa ou por uma marca "caixa:nome"), em px da página. */
export function caixa(take: Take, nome: string): Area {
  const evento = take.eventos.find((item) => (item.tipo === "caixa" || item.tipo === "marca") && item.nome === nome && typeof item.l === "number");
  if (!evento) throw new Error(`a tomada ${take.id} não tem a caixa "${nome}"`);
  return { x: evento.x ?? 0, y: evento.y ?? 0, l: evento.l ?? 0, a: evento.a ?? 0 };
}

/** As etiquetas das ilhas registradas numa tomada do mundo. */
export function ilhasDa(take: Take): CaixaDeIlha[] {
  return take.eventos.find((item) => item.tipo === "marca" && item.nome === "ilhas")?.caixas ?? [];
}

/** Px da página gravada -> px do arquivo de vídeo da tomada. */
export const escalaDa = (take: Take): number => take.saida.largura / take.pagina.largura;

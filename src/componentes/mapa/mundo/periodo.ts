/*
 * O período do dia no mundo, pelo relógio do aparelho: amanhecer, dia,
 * entardecer ou noite. Puro (a hora entra de fora); o gancho que lê o
 * relógio mora em usePeriodoDoDia.ts.
 */
export type Periodo = "amanhecer" | "dia" | "entardecer" | "noite";

/** O período de uma hora do dia (0 a 23). */
export function periodoDaHora(hora: number): Periodo {
  const h = ((Math.floor(hora) % 24) + 24) % 24;
  if (h >= 6 && h < 8) return "amanhecer";
  if (h >= 8 && h < 17) return "dia";
  if (h >= 17 && h < 19) return "entardecer";
  return "noite";
}

/**
 * A hora pedida pelo endereço (`?hora=22`), para conferir o mundo de noite
 * sem esperar o relógio: os testes e quem quiser ver. Fora de 0 a 23, nada.
 */
export function horaDoEndereco(busca: string): number | null {
  const valor = new URLSearchParams(busca).get("hora");
  if (valor === null || !/^\d{1,2}$/.test(valor)) return null;
  const hora = Number(valor);
  return hora >= 0 && hora <= 23 ? hora : null;
}

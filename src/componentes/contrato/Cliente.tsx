"use client";

import { clienteDe, type IdCliente } from "@/motor/contrato/clientes";
import { DESCRICAO_EXPRESSAO_CLIENTE, type ExpressaoCliente } from "@/motor/contrato/expressoes";

type Props = {
  id: IdCliente;
  expressao?: ExpressaoCliente;
  /** Falando agora (a boca acompanha o texto). */
  falando?: boolean;
  /** A última letra que apareceu na fala (a boca abre nas vogais). */
  letraAtual?: string;
  tamanho?: number;
  className?: string;
};

/** O cliente de um contrato (retrato simples; o kit completo vem do desenho em kit/). */
export function Cliente({ id, expressao = "feliz", tamanho = 96, className }: Props) {
  const cliente = clienteDe(id);
  return (
    <svg viewBox="0 0 120 120" width={tamanho} height={tamanho} className={className} role="img" aria-label={`${cliente.nome}, ${DESCRICAO_EXPRESSAO_CLIENTE[expressao]}`}>
      <circle cx={60} cy={60} r={44} fill="var(--cor-cena-pele)" />
      <circle cx={46} cy={56} r={4} fill="var(--cor-texto)" />
      <circle cx={74} cy={56} r={4} fill="var(--cor-texto)" />
      <path d="M46 76 Q60 86 74 76" fill="none" stroke="var(--cor-texto)" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

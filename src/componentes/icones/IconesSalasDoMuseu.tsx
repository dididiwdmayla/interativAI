/*
 * Os ícones das ferramentas das salas 3 a 6 do museu (rodada 38): um por
 * estação. Traço com currentColor, como os outros ícones (viewBox 20).
 */
import type { ReactNode } from "react";
import type { PropsIcone } from "./tipos";

function Base({ className, tamanho = 18, children }: PropsIcone & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width={tamanho} height={tamanho} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/** Duas folhas de código lado a lado, com a mesma linha acesa nas duas. */
export function IconeComparador(props: PropsIcone) {
  return (
    <Base {...props}>
      <rect x="1.5" y="3" width="7.5" height="14" rx="1.2" />
      <rect x="11" y="3" width="7.5" height="14" rx="1.2" />
      <path d="M3.5 6.5h3.5M13 6.5h3.5M3.5 13.5h2.5M13 13.5h3" />
      <path d="M3 10h4.5M12.5 10h4.5" strokeWidth={2.6} strokeOpacity={0.45} />
    </Base>
  );
}

/** Um cartão com uma linha indo até o alvo. */
export function IconeCartoesLigar(props: PropsIcone) {
  return (
    <Base {...props}>
      <rect x="1.5" y="3.5" width="7" height="5" rx="1" fill="currentColor" fillOpacity={0.3} />
      <circle cx="15" cy="14" r="3.2" />
      <path d="M8.5 6c4 0 4.5 4.5 4.5 5.5" strokeDasharray="1.5 1.5" />
    </Base>
  );
}

/** Uma escada de três degraus. */
export function IconeOrdemCartoes(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2 17h5v-4h5V9h5V4" />
      <rect x="13" y="1.5" width="5" height="3" rx="0.8" fill="currentColor" fillOpacity={0.3} />
    </Base>
  );
}

/** Uma folha virando um bloco de bits, e uma setinha. */
export function IconeCompilarInterpretar(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2 3h6v8H2z" />
      <path d="M3.5 5.5h3M3.5 8h2" />
      <path d="M9 7h3" />
      <path d="M10.8 5.5 12.3 7l-1.5 1.5" />
      <rect x="13" y="3.5" width="5" height="7" rx="0.8" fill="currentColor" fillOpacity={0.3} />
      <path d="M2 15h16" strokeDasharray="1.6 1.6" />
    </Base>
  );
}

/** Uma fileira de caixas numeradas. */
export function IconeCaixasMemoria(props: PropsIcone) {
  return (
    <Base {...props}>
      <rect x="1.5" y="6" width="5" height="6" rx="0.8" />
      <rect x="7.5" y="6" width="5" height="6" rx="0.8" fill="currentColor" fillOpacity={0.3} />
      <rect x="13.5" y="6" width="5" height="6" rx="0.8" />
      <path d="M3 15h2M9 15h2M15 15h2" />
    </Base>
  );
}

/** Um chip com as três setinhas do ciclo. */
export function IconeProcessador(props: PropsIcone) {
  return (
    <Base {...props}>
      <rect x="5" y="5" width="10" height="10" rx="1.5" />
      <path d="M8 2v3M12 2v3M8 15v3M12 15v3M2 8h3M2 12h3M15 8h3M15 12h3" />
      <path d="M8 10a2 2 0 1 1 2 2" />
      <path d="M9.6 12.9 10 12l-.9-.4" />
    </Base>
  );
}

/** Um relógio dividido em fatias. */
export function IconeGerenteSistema(props: PropsIcone) {
  return (
    <Base {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 10V2.5M10 10l6.5 3.7M10 10l-6.5 3.7" />
      <path d="M10 2.5a7.5 7.5 0 0 1 6.5 11.2L10 10z" fill="currentColor" fillOpacity={0.3} />
    </Base>
  );
}

/** Uma pasta com dois galhos. */
export function IconeArvorePastas(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2 4h4l1.2 1.5H12v3.5H2z" fill="currentColor" fillOpacity={0.3} />
      <path d="M5 9v7h4M5 12.5h4" />
      <rect x="9.5" y="10.5" width="7" height="3.5" rx="0.8" />
      <rect x="9.5" y="14.5" width="7" height="3" rx="0.8" />
    </Base>
  );
}

/** Um cabo plugado num soquete. */
export function IconePainelCabos(props: PropsIcone) {
  return (
    <Base {...props}>
      <circle cx="4" cy="5" r="2" />
      <circle cx="16" cy="15" r="2" fill="currentColor" fillOpacity={0.3} />
      <path d="M5.5 6.3C9 9 7.5 13 14.5 14" />
      <circle cx="16" cy="5" r="2" />
      <circle cx="4" cy="15" r="2" />
    </Base>
  );
}

/** O ponteiro do mouse e um caminho pontilhado até um servidor. */
export function IconeCaminhoClique(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2.5 2.5 7 13l1.5-4 4-1.5z" fill="currentColor" fillOpacity={0.3} />
      <path d="M9.5 12c2 2.5 4 2 5.5 0" strokeDasharray="1.5 1.5" />
      <rect x="14" y="3" width="4.5" height="8" rx="0.8" />
      <path d="M15.3 5.5h2M15.3 7.5h2" />
    </Base>
  );
}

/** Duas ilhas e um cabo pelo fundo do mar. */
export function IconeMapaCabos(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M1.5 9c1.5-3 4-3 5.5 0z" fill="currentColor" fillOpacity={0.3} />
      <path d="M13 9c1.5-3 4-3 5.5 0z" fill="currentColor" fillOpacity={0.3} />
      <path d="M1 11.5c2 1 4-1 6 0s4-1 6 0 4-1 6 0" />
      <path d="M4.5 9.5c1 6 10 6 11 0" strokeDasharray="1.6 1.6" />
    </Base>
  );
}

/** As barras da cascata da aba Rede. */
export function IconeAbaRede(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2 4.5h7M4 8.5h9M8 12.5h5M10 16.5h8" strokeWidth={2.4} />
      <path d="M1.5 2v16" strokeOpacity={0.5} />
    </Base>
  );
}

/** Prédios com uma janelinha de código. */
export function IconeCidadeCodigo(props: PropsIcone) {
  return (
    <Base {...props}>
      <path d="M2 18V8h5v10M7 18V4h6v14M13 18v-8h5v8M1 18h18" />
      <path d="M8.8 7.5 8 8.5l.8 1M11.2 7.5l.8 1-.8 1" />
    </Base>
  );
}

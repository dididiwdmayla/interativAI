import type { ReactNode } from "react";
import type { IconeZona as IdIconeZona } from "@/curriculo/tipos";
import type { PropsIcone } from "./tipos";

/** Ícone de uma zona no mapa: a aba do DevTools (ou a ferramenta) relacionada. */
export function IconeZona({ icone, className, tamanho = 20 }: PropsIcone & { icone: IdIconeZona }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={tamanho}
      height={tamanho}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {DESENHOS[icone]}
    </svg>
  );
}

const DESENHOS: Record<IdIconeZona, ReactNode> = {
  // Colunas de museu.
  museu: (
    <>
      <path d="M2.5 7.5L10 3l7.5 4.5z" />
      <path d="M4.5 8.5v6M8 8.5v6M12 8.5v6M15.5 8.5v6M3 16.5h14" />
    </>
  ),
  // A aba Elements: sinais de tag.
  elementos: (
    <>
      <path d="M6.5 5.5L2.5 10l4 4.5M13.5 5.5l4 4.5-4 4.5" />
      <path d="M11.5 4.5l-3 11" />
    </>
  ),
  // A aba Styles: pincel.
  estilos: (
    <>
      <path d="M13 3.5l3.5 3.5-6.5 6.5-3.5-3.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M6.5 10l-2 2c-1.5 1.5-.5 3.5-2 4.5 2.5.5 4.5 0 5.5-1l2-2" />
    </>
  ),
  // Caixas lado a lado.
  layout: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M9 3.5v13M9 10h8.5" />
    </>
  ),
  // Celular e tela.
  responsivo: (
    <>
      <rect x="2.5" y="4" width="11" height="8" rx="1.5" />
      <rect x="12" y="8" width="5.5" height="9" rx="1.5" fill="currentColor" fillOpacity={0.15} />
      <path d="M5.5 15h4" />
    </>
  ),
  // Foguetinho de publicar.
  publicar: (
    <>
      <path d="M10 2.5c3 2 4 5.5 3 9.5H7C6 8 7 4.5 10 2.5z" fill="currentColor" fillOpacity={0.15} />
      <circle cx="10" cy="7.5" r="1.3" />
      <path d="M7 12l-2.5 3h3M13 12l2.5 3h-3M9 14.5v2.5M11 14.5v2.5" />
    </>
  ),
  // A aba Console: prompt.
  console: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M5.5 8l2.5 2-2.5 2M10 12.5h4" />
    </>
  ),
  // A aba Sources: arquivo com um ponto de parada.
  fontes: (
    <>
      <path d="M5 2.5h6.5l3.5 3.5v11.5H5z" />
      <path d="M11.5 2.5V6H15" />
      <circle cx="8.5" cy="12" r="1.8" fill="currentColor" />
    </>
  ),
  // A aba Network: barras de pedidos.
  rede: (
    <>
      <path d="M3 5h8M6 9h10M4 13h6M9 17h7" />
    </>
  ),
  // A aba Application: gavetas de dados.
  aplicacao: (
    <>
      <ellipse cx="10" cy="5" rx="6" ry="2.5" />
      <path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" />
    </>
  ),
  // Terminal.
  terminal: (
    <>
      <path d="M3 5l5 5-5 5M10 15.5h7" />
    </>
  ),
  // Ramos do git.
  git: (
    <>
      <circle cx="6" cy="4.5" r="1.8" />
      <circle cx="6" cy="15.5" r="1.8" />
      <circle cx="14" cy="8" r="1.8" />
      <path d="M6 6.3v7.4M14 9.8c0 3-8 2-8 3.9" />
    </>
  ),
  // Constelação: nós ligados, como a arte da ilha IA.
  ia: (
    <>
      <path d="M4.5 13.5L9 6.5l6.5 3-3 6z" strokeOpacity={0.6} />
      <circle cx="4.5" cy="13.5" r="1.8" fill="currentColor" />
      <circle cx="9" cy="6.5" r="1.8" fill="currentColor" />
      <circle cx="15.5" cy="9.5" r="1.8" fill="currentColor" />
      <circle cx="12.5" cy="15.5" r="1.8" fill="currentColor" />
    </>
  ),
  // Escudo com cadeado.
  seguranca: (
    <>
      <path d="M10 2.5l6 2.5v4.5c0 4-2.7 6.7-6 8-3.3-1.3-6-4-6-8V5z" fill="currentColor" fillOpacity={0.15} />
      <rect x="7.5" y="9.5" width="5" height="4" rx="1" />
      <path d="M8.5 9.5V8a1.5 1.5 0 0 1 3 0v1.5" />
    </>
  ),
  // Blocos montados.
  componentes: (
    <>
      <rect x="2.5" y="10" width="7" height="6.5" rx="1" />
      <rect x="10.5" y="10" width="7" height="6.5" rx="1" />
      <rect x="6.5" y="3.5" width="7" height="6.5" rx="1" fill="currentColor" fillOpacity={0.15} />
    </>
  ),
};

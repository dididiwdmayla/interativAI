import type { ReactNode } from "react";
import type { IdTema } from "@/curriculo/temas";

type Props = { tema: IdTema; tamanho?: number; className?: string };

/** O desenho de cada tema, em traço (20x20, currentColor). */
const DESENHOS: Record<IdTema, ReactNode> = {
  // Chip de processador.
  fundamentos: (
    <>
      <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" fill="currentColor" fillOpacity={0.15} />
      <path d="M8 2.5v3M12 2.5v3M8 14.5v3M12 14.5v3M2.5 8h3M2.5 12h3M14.5 8h3M14.5 12h3" />
    </>
  ),
  // Janela com um botão.
  interfaces: (
    <>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" fill="currentColor" fillOpacity={0.12} />
      <path d="M2.5 7h15" />
      <rect x="6" y="10" width="8" height="3.5" rx="1.75" />
    </>
  ),
  // Pessoa de braços abertos (o símbolo da acessibilidade).
  acessibilidade: (
    <>
      <circle cx="10" cy="4" r="1.6" fill="currentColor" />
      <path d="M4 7.5l6 1.2 6-1.2M10 8.7v3.8M10 12.5l-3 5M10 12.5l3 5" />
    </>
  ),
  // Seta que se divide: uma decisão.
  logica: (
    <>
      <path d="M10 17.5v-6M10 11.5L5 6.5M10 11.5l5-5" />
      <path d="M3.5 8.5v-3.5h3.5M16.5 8.5v-3.5H13" />
    </>
  ),
  // Pilha de discos: um banco de dados.
  dados: (
    <>
      <ellipse cx="10" cy="5" rx="6" ry="2.3" fill="currentColor" fillOpacity={0.15} />
      <path d="M4 5v10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3V5" />
      <path d="M4 10c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3" />
    </>
  ),
  // Duas setas trocando: pedido e resposta.
  apis: (
    <>
      <path d="M3 7h12.5M12.5 4l3 3-3 3" />
      <path d="M17 13H4.5M7.5 10l-3 3 3 3" />
    </>
  ),
  // Duas gavetas de servidor com luzinhas.
  servidores: (
    <>
      <rect x="3.5" y="3" width="13" height="6" rx="1.5" fill="currentColor" fillOpacity={0.12} />
      <rect x="3.5" y="11" width="13" height="6" rx="1.5" fill="currentColor" fillOpacity={0.12} />
      <path d="M6.5 6h.01M6.5 14h.01M10 6h4M10 14h4" />
    </>
  ),
  // Escudo com um visto.
  seguranca: (
    <>
      <path d="M10 2.5l6 2.3v4.6c0 3.8-2.6 6.6-6 8.1-3.4-1.5-6-4.3-6-8.1V4.8z" fill="currentColor" fillOpacity={0.12} />
      <path d="M7.2 10l2 2 3.8-4" />
    </>
  ),
  // Velocímetro.
  desempenho: (
    <>
      <path d="M3 14a7 7 0 1 1 14 0" />
      <path d="M10 14l3.5-4.5" />
      <circle cx="10" cy="14" r="1.2" fill="currentColor" />
    </>
  ),
  // Estrela de quatro pontas: a faísca da IA.
  ia: (
    <>
      <path d="M10 2.5c.6 3.8 1.7 4.9 5.5 5.5-3.8.6-4.9 1.7-5.5 5.5-.6-3.8-1.7-4.9-5.5-5.5 3.8-.6 4.9-1.7 5.5-5.5z" fill="currentColor" fillOpacity={0.15} />
      <path d="M15.5 13.5v4M13.5 15.5h4" />
    </>
  ),
  // Chave inglesa.
  ferramentas: (
    <path d="M12.5 3a4 4 0 0 0-3.6 5.7L3.5 14.1a1.8 1.8 0 0 0 2.5 2.5l5.4-5.4A4 4 0 0 0 17 7.5l-2.4 1-1.8-1.8 1-2.4A4 4 0 0 0 12.5 3z" fill="currentColor" fillOpacity={0.12} />
  ),
};

/** O ícone de um tema (SVG, sem cor própria: herda a do texto). */
export function IconeTema({ tema, tamanho = 18, className }: Props) {
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
      {DESENHOS[tema]}
    </svg>
  );
}

import { ChaoIlha } from "./ChaoIlha";

/** Sites: prédios em forma de < e > e blocos empilhados. */
export function ArteSites() {
  const janelas = (x: number, y: number) =>
    [0, 12].map((dy) => <rect key={dy} x={x} y={y + dy} width="7" height="6" rx="1.5" fill="var(--cor-superficie)" opacity="0.8" />);
  return (
    <g>
      <ChaoIlha />
      {/* Prédio "<" */}
      <path
        d="M-44-74L-92-32-44 10-26 10-68-32-26-74Z"
        fill="var(--cor-primaria)"
        stroke="var(--cor-mascote-moldura-sombra)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(-78, -38)}
      {/* Prédio ">" */}
      <path
        d="M44-74L92-32 44 10 26 10 68-32 26-74Z"
        fill="var(--cor-secundaria)"
        stroke="var(--cor-mascote-base)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {janelas(71, -38)}
      {/* Blocos empilhados no meio, como peças de uma página */}
      <rect x="-16" y="-6" width="32" height="16" rx="3" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.5" />
      <rect x="-11" y="-22" width="22" height="16" rx="3" fill="var(--cor-sucesso)" />
      <rect x="-7" y="-36" width="14" height="14" rx="2" fill="var(--cor-alerta)" />
    </g>
  );
}

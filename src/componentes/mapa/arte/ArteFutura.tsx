import { ChaoIlha } from "./ChaoIlha";

/**
 * Ilha de uma trilha em construção (Jogos, Automação industrial): chão
 * vazio com uma placa de madeira fincada e caixotes esperando a obra.
 */
export function ArteFutura() {
  return (
    <g>
      <ChaoIlha />
      <rect x="-54" y="-22" width="26" height="22" rx="2" fill="var(--cor-madeira)" stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M-54 -11h26M-41 -22v22" stroke="var(--cor-areia-sombra)" strokeWidth="1.5" />
      <rect x="-30" y="-14" width="18" height="14" rx="2" fill="var(--cor-madeira)" stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M14 0v-52" stroke="var(--cor-madeira)" strokeWidth="4" strokeLinecap="round" />
      <rect x="-4" y="-66" width="52" height="26" rx="4" fill="var(--cor-areia)" stroke="var(--cor-madeira)" strokeWidth="3" />
      <path d="M6 -53h32" stroke="var(--cor-madeira)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" />
    </g>
  );
}

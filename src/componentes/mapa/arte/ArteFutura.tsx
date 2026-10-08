import { ChaoIlha } from "./ChaoIlha";

/** O símbolo de cada ilha das trilhas em construção (Jogos e Automação industrial). */
export type SimboloFuturo = "controle" | "paleta" | "bola" | "chip" | "botoeira" | "engrenagem" | "ladder" | "placa";

/** O desenho do símbolo, num quadro de uns 50 x 40 em volta de (0, 0). */
function Simbolo({ simbolo }: { simbolo: SimboloFuturo }) {
  switch (simbolo) {
    case "controle":
      return (
        <g>
          <path d="M-22-8h44c8 0 12 18 4 22-6 3-10-6-14-6h-24c-4 0-8 9-14 6-8-4-4-22 4-22z" fill="var(--cor-secundaria)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.5" />
          <path d="M-15-1v8M-19 3h8" stroke="var(--cor-superficie)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="12" cy="0" r="3" fill="var(--cor-primaria)" />
          <circle cx="18" cy="5" r="3" fill="var(--cor-destaque)" />
        </g>
      );
    case "paleta":
      return (
        <g>
          <path d="M-20 4c-6-16 10-26 26-22 16 4 20 18 10 22-6 2-8-4-12 0-4 4 4 10-6 12-8 2-16-4-18-12z" fill="var(--cor-areia)" stroke="var(--cor-madeira)" strokeWidth="2" />
          <circle cx="-8" cy="-8" r="3.5" fill="var(--cor-primaria)" />
          <circle cx="3" cy="-12" r="3.5" fill="var(--cor-destaque)" />
          <circle cx="13" cy="-6" r="3.5" fill="var(--cor-secundaria)" />
          <circle cx="-12" cy="2" r="3.5" fill="var(--cor-sucesso)" />
        </g>
      );
    case "bola":
      return (
        <g>
          <path d="M-24 14q12-34 24 0q8-20 16 0" fill="none" stroke="var(--cor-texto-suave)" strokeWidth="1.6" strokeDasharray="3 4" />
          <circle cx="16" cy="6" r="8" fill="var(--cor-primaria)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.5" />
          <path d="M10 2q6 4 12 0" fill="none" stroke="var(--cor-superficie)" strokeWidth="1.5" opacity="0.7" />
        </g>
      );
    case "chip":
      return (
        <g>
          {[-12, -4, 4, 12].map((x) => (
            <path key={x} d={`M${x} -16v-5M${x} 16v5`} stroke="var(--cor-texto-suave)" strokeWidth="2" strokeLinecap="round" />
          ))}
          <rect x="-18" y="-16" width="36" height="32" rx="4" fill="var(--cor-terminal-fundo)" />
          <rect x="-8" y="-6" width="16" height="12" rx="2" fill="var(--cor-terminal-texto)" opacity="0.8" />
        </g>
      );
    case "botoeira":
      return (
        <g>
          <rect x="-16" y="-20" width="32" height="40" rx="5" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
          <circle cx="0" cy="-8" r="6" fill="var(--cor-sucesso)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.5" />
          <circle cx="0" cy="9" r="6" fill="var(--cor-erro)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.5" />
        </g>
      );
    case "engrenagem":
      return (
        <g>
          <circle r="13" fill="var(--cor-texto-suave)" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="-3.5" y="-18" width="7" height="7" rx="1.5" fill="var(--cor-texto-suave)" transform={`rotate(${i * 45})`} />
          ))}
          <circle r="5" fill="var(--cor-areia)" />
          <path d="M8 10l16 12" stroke="var(--cor-madeira)" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "ladder":
      return (
        <g>
          <rect x="-22" y="-18" width="44" height="36" rx="3" fill="var(--cor-superficie)" stroke="var(--cor-madeira)" strokeWidth="2" />
          <path d="M-18-14v28M18-14v28M-18-6h8M-6-6h8M8-6h10M-18 6h14M2 6h16" stroke="var(--cor-secundaria)" strokeWidth="2" strokeLinecap="round" />
          <path d="M-10-10v8M-6-10v8M2-10v8M6-10v8" stroke="var(--cor-primaria)" strokeWidth="1.5" />
        </g>
      );
    default:
      return <path d="M-16 0h32" stroke="var(--cor-madeira)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 5" />;
  }
}

/**
 * Ilha de uma trilha em construção (Jogos, Automação industrial): chão
 * vazio, caixotes esperando a obra e a placa de madeira com o símbolo do
 * que vai ser ensinado ali (um controle de videogame, uma paleta, um chip...).
 */
export function ArteFutura({ simbolo = "placa" }: { simbolo?: SimboloFuturo }) {
  return (
    <g data-simbolo-futuro={simbolo}>
      <ChaoIlha />
      <rect x="-54" y="-22" width="26" height="22" rx="2" fill="var(--cor-madeira)" stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M-54 -11h26M-41 -22v22" stroke="var(--cor-areia-sombra)" strokeWidth="1.5" />
      <rect x="-30" y="-14" width="18" height="14" rx="2" fill="var(--cor-madeira)" stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
      <path d="M22 4v-40" stroke="var(--cor-madeira)" strokeWidth="4" strokeLinecap="round" />
      <rect x="-8" y="-84" width="60" height="48" rx="6" fill="var(--cor-areia)" stroke="var(--cor-madeira)" strokeWidth="3" />
      <g transform="translate(22 -60) scale(0.9)">
        <Simbolo simbolo={simbolo} />
      </g>
    </g>
  );
}

export function ArteJogosPrimeiroJogo() {
  return <ArteFutura simbolo="controle" />;
}
export function ArteJogosGraficos() {
  return <ArteFutura simbolo="paleta" />;
}
export function ArteJogosFisica() {
  return <ArteFutura simbolo="bola" />;
}
export function ArteEletronica() {
  return <ArteFutura simbolo="chip" />;
}
export function ArteComandosEletricos() {
  return <ArteFutura simbolo="botoeira" />;
}
export function ArteMecanica() {
  return <ArteFutura simbolo="engrenagem" />;
}
export function ArteClpLadder() {
  return <ArteFutura simbolo="ladder" />;
}

import { ChaoIlha } from "./ChaoIlha";

/** Um bloco de montar com pininhos em cima. */
function Bloco({ x, y, largura, cor }: { x: number; y: number; largura: number; cor: string }) {
  const pinos = Math.max(2, Math.round(largura / 14));
  return (
    <g>
      {Array.from({ length: pinos }, (_, indice) => (
        <rect key={indice} x={x + 4 + (indice * (largura - 8)) / pinos} y={y - 5} width={(largura - 8) / pinos - 3} height="6" rx="2" fill={cor} />
      ))}
      <rect x={x} y={y} width={largura} height="16" rx="3" fill={cor} stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.5" />
    </g>
  );
}

/** Frameworks: blocos montados. */
export function ArteFrameworks() {
  return (
    <g>
      <ChaoIlha />
      <Bloco x={-52} y={-4} largura={56} cor="var(--cor-secundaria)" />
      <Bloco x={6} y={-4} largura={42} cor="var(--cor-primaria)" />
      <Bloco x={-36} y={-25} largura={56} cor="var(--cor-destaque)" />
      <Bloco x={-14} y={-46} largura={42} cor="var(--cor-sucesso)" />
      <Bloco x={-4} y={-67} largura={28} cor="var(--cor-alerta)" />
    </g>
  );
}

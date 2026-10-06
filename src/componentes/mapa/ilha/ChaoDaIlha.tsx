/*
 * O chão de uma ilha por dentro (SVG, parado): a sombra na água, a areia com
 * pedrinhas, a grama recortando as zonas (cada uma com o tom e a textura
 * dela), o relevo, a luz suave, as cercas vivas entre as zonas, o mato da
 * borda e os enfeites da ilha. Tudo o que se mexe fica fora daqui (camadas
 * de HTML do compositor), para este desenho grande nunca repintar.
 */
import type { ReactNode } from "react";
import type { Ponto } from "../geometria";
import type { DesenhoIlha, Enfeite } from "./desenhoIlha";
import { pecaDoEnfeite } from "./EnfeitesIlha";

/** O tom de cada zona (em ciclo). */
export const TONS_DAS_ZONAS = ["var(--cor-zona-1)", "var(--cor-zona-2)", "var(--cor-zona-3)", "var(--cor-zona-4)"] as const;

/** As texturas das zonas (em ciclo): pontinhos, listras, cruzinhas, ondinhas, grade e setinhas. */
const TEXTURAS: { tamanho: number; desenho: ReactNode }[] = [
  { tamanho: 18, desenho: <circle cx="9" cy="9" r="1.8" /> },
  { tamanho: 16, desenho: <path d="M-2 18L18-2M-2 2L2-2M14 18L18 14" strokeWidth="1.6" fill="none" /> },
  { tamanho: 22, desenho: <path d="M11 7v8M7 11h8" strokeWidth="1.8" strokeLinecap="round" fill="none" /> },
  { tamanho: 24, desenho: <path d="M2 14q5-6 10 0t10 0" strokeWidth="1.6" strokeLinecap="round" fill="none" /> },
  { tamanho: 20, desenho: <path d="M0 0.5H20M0.5 0V20" strokeWidth="1.2" fill="none" /> },
  { tamanho: 22, desenho: <path d="M5 14l6-6 6 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" /> },
];

/** O id de uma textura no desenho desta ilha (ids únicos por ilha). */
const idTextura = (ilhaId: string, indice: number) => `textura-${ilhaId}-${indice % TEXTURAS.length}`;

/** Uma moita de mato (três bolinhas e um brilho). */
function Moita({ x, y, escala }: Ponto & { escala: number }) {
  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${escala.toFixed(2)})`}>
      <circle cx="-6" cy="2" r="6" fill="var(--cor-mato)" />
      <circle cx="6" cy="2" r="6" fill="var(--cor-mato)" />
      <circle cx="0" cy="-3" r="7.5" fill="var(--cor-mato)" />
      <circle cx="-2" cy="-6" r="2.8" fill="var(--cor-mato-claro)" opacity="0.85" />
    </g>
  );
}

/** A cerca viva entre duas zonas: moitinhas ao longo da divisa, com a passagem do caminho aberta. */
function CercaViva({ de, ate, travessia }: { de: Ponto; ate: Ponto; travessia: Ponto }) {
  const comprimento = Math.hypot(ate.x - de.x, ate.y - de.y);
  const quantas = Math.max(2, Math.floor(comprimento / 17));
  const moitas = Array.from({ length: quantas + 1 }, (_, i) => ({ x: de.x + ((ate.x - de.x) * i) / quantas, y: de.y + ((ate.y - de.y) * i) / quantas })).filter(
    (moita) => Math.hypot(moita.x - travessia.x, moita.y - travessia.y) > 34,
  );
  return (
    <g data-cerca-viva>
      {moitas.map((moita, i) => (
        <g key={i} transform={`translate(${moita.x.toFixed(1)} ${moita.y.toFixed(1)})`}>
          <circle r={i % 2 ? 6.5 : 7.5} fill="var(--cor-mato)" />
          <circle cx="-2" cy="-2.5" r="2.4" fill="var(--cor-mato-claro)" opacity="0.8" />
        </g>
      ))}
    </g>
  );
}

/** Um enfeite parado (o que se mexe vai para uma camada própria, fora daqui). */
export function DesenhoDoEnfeite({ ilhaId, enfeite, tipoForcado }: { ilhaId: string; enfeite: Enfeite; tipoForcado?: () => ReactNode }) {
  const desenho = tipoForcado ?? pecaDoEnfeite(ilhaId, enfeite.tipo).desenho;
  return <g transform={`translate(${enfeite.x.toFixed(1)} ${enfeite.y.toFixed(1)}) scale(${enfeite.escala.toFixed(2)})`}>{desenho()}</g>;
}

type Props = {
  ilhaId: string;
  desenho: DesenhoIlha;
  /** Passa as coordenadas do desenho para a tela (deitado, a ilha encolhe para caber na altura). */
  px: (valor: number) => number;
  /** O enfeite que vai animado numa camada própria (não é desenhado aqui). */
  enfeiteAnimado: Enfeite | null;
};

export function ChaoDaIlha({ ilhaId, desenho, px, enfeiteAnimado }: Props) {
  const escala = px(1);
  const recorte = `grama-${ilhaId}`;
  const luz = `luz-${ilhaId}`;
  return (
    <g data-chao-ilha={ilhaId}>
      <defs>
        <clipPath id={recorte}>
          <path d={desenho.contorno.grama} />
        </clipPath>
        <radialGradient id={luz} cx="0.2" cy="0.08" r="0.9">
          <stop offset="0" stopColor="var(--cor-luz)" stopOpacity="0.42" />
          <stop offset="0.55" stopColor="var(--cor-luz)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--cor-luz)" stopOpacity="0" />
        </radialGradient>
        {TEXTURAS.map((textura, indice) => (
          <pattern key={indice} id={idTextura(ilhaId, indice)} width={textura.tamanho} height={textura.tamanho} patternUnits="userSpaceOnUse">
            <g fill="var(--cor-zona-textura)" stroke="var(--cor-zona-textura)">
              {textura.desenho}
            </g>
          </pattern>
        ))}
      </defs>
      {/* Tudo em coordenadas do desenho; a escala só muda deitado. */}
      <g transform={`scale(${escala})`}>
        <path d={desenho.contorno.sombra} fill="var(--cor-mar-fundo)" opacity="0.55" />
        <path d={desenho.contorno.areia} fill="var(--cor-areia)" stroke="var(--cor-areia-sombra)" strokeWidth="3" />
        {desenho.pedrinhas.map((pedra, i) => (
          <g key={i}>
            <ellipse cx={pedra.x} cy={pedra.y + 1} rx={pedra.raio} ry={pedra.raio * 0.7} fill="var(--cor-pedrinha-sombra)" />
            <ellipse cx={pedra.x} cy={pedra.y} rx={pedra.raio} ry={pedra.raio * 0.7} fill="var(--cor-pedrinha)" />
          </g>
        ))}
        <path d={desenho.contorno.grama} fill="var(--cor-grama)" />
        <g clipPath={`url(#${recorte})`}>
          {desenho.regioes.map((regiao) => (
            <g key={regiao.zona.id} data-regiao-zona={regiao.zona.id}>
              <rect x={regiao.x} y={regiao.y} width={regiao.largura} height={regiao.altura} fill={TONS_DAS_ZONAS[regiao.indice % TONS_DAS_ZONAS.length]} />
              <rect x={regiao.x} y={regiao.y} width={regiao.largura} height={regiao.altura} fill={`url(#${idTextura(ilhaId, regiao.indice)})`} opacity="0.17" />
            </g>
          ))}
          {desenho.relevos.map((relevo, i) => (
            <g key={i}>
              <ellipse cx={relevo.x + 6} cy={relevo.y + 8} rx={relevo.rx} ry={relevo.ry} fill="var(--cor-relevo-escuro)" opacity="0.35" />
              <ellipse cx={relevo.x} cy={relevo.y} rx={relevo.rx} ry={relevo.ry} fill="var(--cor-relevo-claro)" opacity="0.4" />
            </g>
          ))}
          <path d={desenho.contorno.grama} fill={`url(#${luz})`} />
          {desenho.fronteiras.map((fronteira, i) => (
            <CercaViva key={i} {...fronteira} />
          ))}
        </g>
        {/* A beirada da grama, um pouco mais escura. */}
        <path d={desenho.contorno.grama} fill="none" stroke="var(--cor-grama-sombra)" strokeWidth="3" opacity="0.8" />
        {desenho.matinhos.map((moita, i) => (
          <Moita key={i} {...moita} />
        ))}
        {desenho.enfeites
          .filter((enfeite) => enfeite !== enfeiteAnimado)
          .map((enfeite, i) => (
            <g key={i} data-enfeite={pecaDoEnfeite(ilhaId, enfeite.tipo).animacao ?? "parado"}>
              <DesenhoDoEnfeite ilhaId={ilhaId} enfeite={enfeite} />
            </g>
          ))}
      </g>
    </g>
  );
}

/*
 * Os enfeites do interior de cada ilha, casando com a arte dela no mundo:
 * na Sites, prédios em forma de < e > e blocos; na Lógica, engrenagens,
 * chips e trilhas de circuito; e assim por diante. Cada peça cabe numa caixa
 * de 48 x 48 em volta de (0, 0), com o chão em y = 18, e usa só tokens.
 *
 * Uma peça de cada ilha pode se mexer (`animacao`): ela vai para uma camada
 * própria (HTML) e anima só transform e opacity, pelo compositor. As outras
 * ficam paradas, dentro do desenho da ilha.
 */
import type { ReactNode } from "react";

export type AnimacaoEnfeite = "girar" | "pulsar" | "sinal";
type Peca = { desenho: () => ReactNode; animacao?: AnimacaoEnfeite };

/** A sombra no chão, embaixo de cada peça. */
function Sombra({ largura = 34 }: { largura?: number }) {
  return <ellipse cx="0" cy="19" rx={largura / 2} ry="4.5" fill="var(--cor-relevo-escuro)" opacity="0.55" />;
}

/** Caminho de uma engrenagem com `dentes` dentes, centro em (0, 0). */
export function caminhoDaEngrenagem(raio: number, dentes: number): string {
  const pontos: string[] = [];
  const passo = (Math.PI * 2) / dentes;
  for (let i = 0; i < dentes; i++) {
    const a = i * passo;
    const externo = raio * 1.28;
    const angulos = [a - passo * 0.28, a - passo * 0.14, a + passo * 0.14, a + passo * 0.28];
    const raios = [raio, externo, externo, raio];
    angulos.forEach((angulo, j) => pontos.push(`${(Math.cos(angulo) * raios[j]).toFixed(1)} ${(Math.sin(angulo) * raios[j]).toFixed(1)}`));
  }
  return `M${pontos.join("L")}Z`;
}

// ------------------------------------------------------------- peças comuns

const ARVORE: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={30} />
      <rect x="-3" y="2" width="6" height="17" rx="2" fill="var(--cor-madeira)" />
      <circle cx="0" cy="-6" r="14" fill="var(--cor-mato)" />
      <circle cx="-5" cy="-11" r="6" fill="var(--cor-mato-claro)" opacity="0.8" />
    </g>
  ),
};

const ARBUSTO: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={36} />
      <circle cx="-9" cy="10" r="9" fill="var(--cor-mato)" />
      <circle cx="9" cy="10" r="9" fill="var(--cor-mato)" />
      <circle cx="0" cy="4" r="11" fill="var(--cor-mato)" />
      <circle cx="-3" cy="0" r="4.5" fill="var(--cor-mato-claro)" opacity="0.8" />
    </g>
  ),
};

const PEDRA: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={34} />
      <path d="M-15 18C-17 8-10 0-2 1C8 0 16 8 15 18Z" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      <path d="M-6 6C-3 3 2 3 5 5" fill="none" stroke="var(--cor-pedra-sombra)" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  ),
};

// ------------------------------------------------------------- Sites

const janelinhas = (x: number, y: number) =>
  [0, 9].map((dy) => <rect key={dy} x={x} y={y + dy} width="5" height="4.5" rx="1" fill="var(--cor-superficie)" opacity="0.85" />);

const PREDIO_MENOR: Peca = {
  desenho: () => (
    <g>
      <Sombra />
      <path d="M2-22L-18-2 2 18 12 18-8-2 12-22Z" fill="var(--cor-primaria)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth="1.6" strokeLinejoin="round" />
      {janelinhas(-10, -6)}
    </g>
  ),
};

const PREDIO_MAIOR: Peca = {
  desenho: () => (
    <g>
      <Sombra />
      <path d="M-4-22L16-2-4 18-14 18 6-2-14-22Z" fill="var(--cor-secundaria)" stroke="var(--cor-mascote-base)" strokeWidth="1.6" strokeLinejoin="round" />
      {janelinhas(5, -6)}
    </g>
  ),
};

const BLOCOS: Peca = {
  desenho: () => (
    <g>
      <Sombra />
      <rect x="-15" y="6" width="30" height="12" rx="3" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.4" />
      <rect x="-10" y="-6" width="20" height="12" rx="3" fill="var(--cor-sucesso)" />
      <rect x="-6" y="-17" width="12" height="11" rx="2" fill="var(--cor-alerta)" />
    </g>
  ),
};

/** Uma placa de tag (< />), com o cursor piscando. */
const TAG: Peca = {
  animacao: "pulsar",
  desenho: () => (
    <g>
      <Sombra largura={26} />
      <rect x="-2" y="2" width="4" height="17" rx="1.5" fill="var(--cor-madeira)" />
      <rect x="-19" y="-20" width="38" height="24" rx="5" fill="var(--cor-superficie)" stroke="var(--cor-madeira)" strokeWidth="2" />
      <path d="M-9-13l-5 5 5 5M9-13l5 5-5 5M3-14l-6 12" fill="none" stroke="var(--cor-primaria)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

// ------------------------------------------------------------- Lógica

const ENGRENAGEM: Peca = {
  animacao: "girar",
  desenho: () => (
    <g>
      <path d={caminhoDaEngrenagem(15, 10)} fill="var(--cor-secundaria)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.6" />
      <circle r="5.5" fill="var(--cor-superficie)" />
    </g>
  ),
};

const ENGRENAGENS: Peca = {
  desenho: () => (
    <g>
      <Sombra />
      <g transform="translate(-7 2)">
        <path d={caminhoDaEngrenagem(10, 8)} fill="var(--cor-destaque)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.4" />
        <circle r="3.6" fill="var(--cor-superficie)" />
      </g>
      <g transform="translate(11 -9) rotate(20)">
        <path d={caminhoDaEngrenagem(7, 7)} fill="var(--cor-primaria)" stroke="var(--cor-texto)" strokeOpacity="0.25" strokeWidth="1.2" />
        <circle r="2.6" fill="var(--cor-superficie)" />
      </g>
    </g>
  ),
};

const CHIP: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={36} />
      {[-9, -3, 3, 9].map((d) => (
        <g key={d} stroke="var(--cor-pedra-sombra)" strokeWidth="2" strokeLinecap="round">
          <path d={`M${d}-16v-4M${d} 12v4M-16 ${d - 2}h-4M16 ${d - 2}h4`} />
        </g>
      ))}
      <rect x="-15" y="-17" width="30" height="30" rx="4" fill="var(--cor-terminal-fundo)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.6" />
      <circle cx="-7" cy="-9" r="2.2" fill="var(--cor-terminal-texto)" />
      <path d="M-4 3h10" stroke="var(--cor-terminal-texto)" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
};

/** Trilha de circuito deitada na grama, com os pontos de solda. */
const TRILHA_CIRCUITO: Peca = {
  desenho: () => (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M-22 10H-6L2 2H22M-14 10V-8H8L14-14" stroke="var(--cor-zona-textura)" strokeWidth="3" opacity="0.8" />
      {[
        [-22, 10],
        [22, 2],
        [14, -14],
        [-14, -8],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.2" />
      ))}
    </g>
  ),
};

// ------------------------------------------------------------- Páginas vivas

const JANELA: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={38} />
      <rect x="-20" y="-18" width="40" height="34" rx="4" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="2" />
      <path d="M-20-10h40" stroke="var(--cor-borda)" strokeWidth="2" />
      {[-15, -10, -5].map((x, i) => (
        <circle key={x} cx={x} cy="-14" r="1.7" fill={["var(--cor-primaria)", "var(--cor-destaque)", "var(--cor-sucesso)"][i]} />
      ))}
      <rect x="-14" y="-5" width="16" height="5" rx="2" fill="var(--cor-secundaria)" />
      <path d="M-14 5h26M-14 10h18" stroke="var(--cor-texto-suave)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </g>
  ),
};

const BOTAO: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={40} />
      <rect x="-21" y="-2" width="42" height="18" rx="9" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="2" />
      <rect x="-11" y="5" width="22" height="4" rx="2" fill="var(--cor-texto-sobre-destaque)" opacity="0.7" />
      <path d="M8-16l2 10 3-3 4 5" fill="var(--cor-superficie)" stroke="var(--cor-texto)" strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  ),
};

const CUBINHOS: Peca = {
  desenho: () => (
    <g>
      <Sombra />
      <rect x="-19" y="-2" width="13" height="13" rx="3" fill="var(--cor-primaria)" />
      <rect x="-5" y="-14" width="11" height="11" rx="5.5" fill="var(--cor-secundaria)" />
      <rect x="7" y="2" width="12" height="12" rx="2" fill="var(--cor-sucesso)" />
    </g>
  ),
};

const FAISCA: Peca = {
  animacao: "pulsar",
  desenho: () => <path d="M0-14L3-3 14 0 3 3 0 14-3 3-14 0-3-3Z" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1" />,
};

// ------------------------------------------------------------- Rede e Servidor

const ANTENA: Peca = {
  animacao: "sinal",
  desenho: () => (
    <g>
      <Sombra largura={26} />
      <path d="M0-12L-9 18M0-12L9 18M-6 6H6M-3-2H3" stroke="var(--cor-texto-suave)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="0" cy="-14" r="3.5" fill="var(--cor-primaria)" />
      <g data-sinal fill="none" stroke="var(--cor-secundaria)" strokeWidth="2.2" strokeLinecap="round">
        <path d="M-8-20a10 10 0 0 1 16 0" />
        <path d="M-13-24a16 16 0 0 1 26 0" />
      </g>
    </g>
  ),
};

const SERVIDOR: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={30} />
      <rect x="-12" y="-20" width="24" height="38" rx="4" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="2" />
      {[-14, -4, 6].map((y) => (
        <g key={y}>
          <rect x="-8" y={y} width="14" height="5" rx="2" fill="var(--cor-pedra-sombra)" />
          <circle cx="8" cy={y + 2.5} r="1.6" fill="var(--cor-sucesso)" />
        </g>
      ))}
    </g>
  ),
};

const POSTE: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={22} />
      <rect x="-2" y="-20" width="4" height="39" rx="1.5" fill="var(--cor-madeira)" />
      <path d="M-9-15h18" stroke="var(--cor-madeira)" strokeWidth="3" strokeLinecap="round" />
      <path d="M-9-15C-16-5-20 6-24 12M9-15C16-5 20 6 24 12" fill="none" stroke="var(--cor-texto-suave)" strokeWidth="1.4" opacity="0.7" />
    </g>
  ),
};

// ------------------------------------------------------------- Python

const GRAFICO: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={38} />
      <rect x="-20" y="-20" width="40" height="32" rx="3" fill="var(--cor-superficie)" stroke="var(--cor-madeira)" strokeWidth="2" />
      {[
        [-14, 8],
        [-6, 15],
        [2, 11],
        [10, 20],
      ].map(([x, h]) => (
        <rect key={x} x={x} y={8 - h} width="6" height={h} rx="1.2" fill={x === 10 ? "var(--cor-primaria)" : "var(--cor-secundaria)"} />
      ))}
      <path d="M-14 12v7M14 12v7" stroke="var(--cor-madeira)" strokeWidth="2.4" strokeLinecap="round" />
    </g>
  ),
};

const VARAL: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={40} />
      <path d="M-20 18V-12M20 18V-12" stroke="var(--cor-madeira)" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-20-10Q0-2 20-10" fill="none" stroke="var(--cor-texto-suave)" strokeWidth="1.2" />
      <rect x="-12" y="-8" width="16" height="13" rx="1.5" fill="var(--cor-superficie)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.2" />
      <path d="M-12-3.5h16M-12 0.5h16M-7-8v13M-2-8v13" stroke="var(--cor-pedra-sombra)" strokeWidth="0.9" />
      <rect x="7" y="-7" width="9" height="11" rx="1.5" fill="var(--cor-destaque)" />
    </g>
  ),
};

/** Uma cobrinha (o nome da linguagem), enrolada na grama. */
const COBRINHA: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={36} />
      <path d="M-18 14C-10 20-4 6 2 10S12 20 16 8" fill="none" stroke="var(--cor-sucesso)" strokeWidth="7" strokeLinecap="round" />
      <path d="M-18 14C-10 20-4 6 2 10S12 20 16 8" fill="none" stroke="var(--cor-destaque)" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 6" />
      <circle cx="17" cy="5" r="5" fill="var(--cor-sucesso)" />
      <circle cx="18.5" cy="4" r="1.3" fill="var(--cor-superficie)" />
    </g>
  ),
};

const OBSERVATORIO: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={30} />
      <rect x="-11" y="-6" width="22" height="24" rx="3" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.6" />
      <path d="M-13-6a13 13 0 0 1 26 0z" fill="var(--cor-secundaria)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.6" />
      <path d="M2-14l12-9" stroke="var(--cor-texto-suave)" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="-4" y="6" width="8" height="12" rx="2" fill="var(--cor-madeira)" />
    </g>
  ),
};

// ------------------------------------------------------------- IA

const CONSTELACAO: Peca = {
  desenho: () => {
    const nos = [
      [-16, 6],
      [-8, -12],
      [4, -2],
      [14, -16],
      [16, 8],
    ];
    const ligacoes = [
      [0, 1],
      [1, 2],
      [0, 2],
      [2, 3],
      [2, 4],
      [3, 4],
    ];
    return (
      <g>
        <Sombra largura={36} />
        {ligacoes.map(([a, b]) => (
          <path key={`${a}-${b}`} d={`M${nos[a][0]} ${nos[a][1]}L${nos[b][0]} ${nos[b][1]}`} stroke="var(--cor-secundaria)" strokeWidth="1.6" opacity="0.8" />
        ))}
        {nos.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 4.5 : 3.2} fill={i === 2 ? "var(--cor-primaria)" : "var(--cor-secundaria)"} stroke="var(--cor-superficie)" strokeWidth="1.2" />
        ))}
      </g>
    );
  },
};

const FAROL: Peca = {
  animacao: "sinal",
  desenho: () => (
    <g>
      <Sombra largura={26} />
      <path d="M-8 18L-5-10H5L8 18Z" fill="var(--cor-superficie)" stroke="var(--cor-borda)" strokeWidth="1.6" />
      <path d="M-7 6H7M-6-3H6" stroke="var(--cor-primaria)" strokeWidth="4" />
      <rect x="-6" y="-18" width="12" height="8" rx="2" fill="var(--cor-destaque)" />
      <path d="M-8-18L0-24 8-18Z" fill="var(--cor-primaria)" />
      <g data-sinal fill="none" stroke="var(--cor-destaque)" strokeWidth="2" strokeLinecap="round">
        <path d="M11-19a8 8 0 0 1 0 10" />
        <path d="M-11-19a8 8 0 0 0 0 10" />
      </g>
    </g>
  ),
};

const LAMPADA: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={22} />
      <circle cx="0" cy="-6" r="11" fill="var(--cor-destaque)" stroke="var(--cor-madeira)" strokeWidth="1.6" />
      <path d="M-4-6l2 3 2-5 2 5 2-3" fill="none" stroke="var(--cor-madeira)" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="-5" y="5" width="10" height="7" rx="2" fill="var(--cor-pedra)" stroke="var(--cor-pedra-sombra)" strokeWidth="1.2" />
      <rect x="-1.5" y="12" width="3" height="7" fill="var(--cor-pedra-sombra)" />
    </g>
  ),
};

// ------------------------------------------------------------- Ofício

const OFICINA: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={40} />
      <rect x="-17" y="-6" width="34" height="24" rx="2.5" fill="var(--cor-madeira)" />
      <path d="M-21-5L0-22 21-5Z" fill="var(--cor-primaria)" stroke="var(--cor-mascote-moldura-sombra)" strokeWidth="1.4" strokeLinejoin="round" />
      <rect x="-5" y="4" width="10" height="14" rx="1.5" fill="var(--cor-mar-fundo)" />
      <rect x="-14" y="-1" width="7" height="6" rx="1" fill="var(--cor-superficie)" opacity="0.85" />
    </g>
  ),
};

const FERRAMENTAS: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={32} />
      <g transform="translate(-4 0) rotate(35)">
        <rect x="-2.2" y="-6" width="4.4" height="24" rx="2" fill="var(--cor-texto-suave)" />
        <path d="M-7-12a7 7 0 1 0 14 0l-4 0 0 4-6 0 0-4z" fill="var(--cor-texto-suave)" />
      </g>
      <g transform="translate(8 2) rotate(-25)">
        <rect x="-2" y="-6" width="4" height="22" rx="1.6" fill="var(--cor-madeira)" />
        <rect x="-8" y="-11" width="16" height="7" rx="1.6" fill="var(--cor-texto-suave)" />
      </g>
    </g>
  ),
};

const CAIXOTE: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={32} />
      <rect x="-14" y="-10" width="28" height="28" rx="2" fill="var(--cor-madeira)" stroke="var(--cor-cena-madeira-sombra)" strokeWidth="1.6" />
      <path d="M-14-10L14 18M14-10L-14 18" stroke="var(--cor-cena-madeira-sombra)" strokeWidth="1.6" opacity="0.7" />
    </g>
  ),
};

// ------------------------------------------------------------- Frameworks

function bloco(x: number, y: number, largura: number, cor: string) {
  const pinos = Math.max(2, Math.round(largura / 9));
  return (
    <g key={`${x}-${y}`}>
      {Array.from({ length: pinos }, (_, i) => (
        <rect key={i} x={x + 2 + (i * (largura - 4)) / pinos} y={y - 3} width={(largura - 4) / pinos - 2} height="4" rx="1.4" fill={cor} />
      ))}
      <rect x={x} y={y} width={largura} height="10" rx="2" fill={cor} stroke="var(--cor-texto)" strokeOpacity="0.2" strokeWidth="1.2" />
    </g>
  );
}

const TORRE_DE_BLOCOS: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={36} />
      {bloco(-16, 8, 32, "var(--cor-secundaria)")}
      {bloco(-12, -4, 24, "var(--cor-destaque)")}
      {bloco(-6, -16, 14, "var(--cor-sucesso)")}
    </g>
  ),
};

const BLOCOS_SOLTOS: Peca = {
  desenho: () => (
    <g>
      <Sombra largura={40} />
      {bloco(-20, 8, 20, "var(--cor-primaria)")}
      {bloco(2, 8, 18, "var(--cor-alerta)")}
      {bloco(-8, -4, 18, "var(--cor-secundaria)")}
    </g>
  ),
};

/** O conjunto de peças de cada ilha (pelo id do currículo); as outras usam o padrão. */
const CONJUNTOS: Record<string, readonly Peca[]> = {
  sites: [PREDIO_MENOR, BLOCOS, PREDIO_MAIOR, TAG, ARVORE, BLOCOS, ARBUSTO],
  logica: [ENGRENAGEM, CHIP, TRILHA_CIRCUITO, ENGRENAGENS, ARVORE, TRILHA_CIRCUITO, CHIP],
  "paginas-vivas": [JANELA, BOTAO, CUBINHOS, FAISCA, ARVORE, JANELA],
  "rede-servidor": [ANTENA, SERVIDOR, POSTE, ARVORE, SERVIDOR],
  python: [GRAFICO, COBRINHA, VARAL, OBSERVATORIO, ARVORE],
  ia: [CONSTELACAO, FAROL, LAMPADA, ARVORE, CONSTELACAO],
  oficio: [OFICINA, FERRAMENTAS, CAIXOTE, ARVORE, ARBUSTO],
  frameworks: [TORRE_DE_BLOCOS, BLOCOS_SOLTOS, ARVORE, TORRE_DE_BLOCOS],
};
const PADRAO: readonly Peca[] = [ARVORE, ARBUSTO, PEDRA, ARVORE];

/** A peça de um enfeite: o tipo sorteado escolhe dentro do conjunto da ilha. */
export function pecaDoEnfeite(ilhaId: string, tipo: number): Peca {
  const conjunto = CONJUNTOS[ilhaId] ?? PADRAO;
  return conjunto[tipo % conjunto.length];
}

/** A peça da ilha que se mexe (a primeira com animação do conjunto), se houver. */
export function pecaAnimadaDaIlha(ilhaId: string): Peca | null {
  return (CONJUNTOS[ilhaId] ?? PADRAO).find((peca) => peca.animacao) ?? null;
}

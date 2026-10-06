"use client";

/*
 * A tecelã: o tear de Jacquard como uma avó. A cabeça é a caixa de cima do
 * tear (onde os cartões são lidos), com óculos redondos e um coque de
 * novelo espetado por duas agulhas; o corpo é a armação de madeira com os
 * fios esticados e o tecido nascendo embaixo; do lado, a corrente de
 * cartões perfurados desce em laço. Falando, a corrente anda e a lançadeira
 * cruza o tecido.
 */
import { motion } from "framer-motion";
import { Boca, Bochechas, CONTORNO, Olhos, type PropsCorpo } from "./partes";

/** Os furos de um cartão da corrente (cada um tem o seu desenho). */
const FUROS = ["10110", "01101", "11010", "00111", "10101", "01011"];

function CartaoDaCorrente({ y, furos }: { y: number; furos: string }) {
  return (
    <g transform={`translate(130 ${y})`}>
      <rect x="-9" y="0" width="18" height="11" rx="1.5" fill="var(--cor-ante-cartao)" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.2" />
      {[...furos].map((furo, i) =>
        furo === "1" ? <circle key={i} cx={-6 + i * 3} cy={3.5 + (i % 2) * 4} r="1.1" fill="var(--cor-ante-madeira-sombra)" /> : null,
      )}
    </g>
  );
}

export function Tecela({ expressao, piscando, boca, falando, animar }: PropsCorpo) {
  const andando = animar && falando;
  return (
    <g style={{ ["--palpebra" as string]: "var(--cor-ante-cartao)" }}>
      {/* A armação: duas colunas, a trave de baixo e os pés */}
      <rect x="30" y="74" width="10" height="84" rx="3" fill="var(--cor-ante-madeira)" {...CONTORNO} />
      <rect x="112" y="74" width="10" height="84" rx="3" fill="var(--cor-ante-madeira)" {...CONTORNO} />
      <rect x="24" y="152" width="104" height="9" rx="3" fill="var(--cor-ante-madeira-sombra)" {...CONTORNO} />
      {/* Os fios esticados (a urdidura) */}
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${46 + i * 5} 86V128`} stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.2" />
      ))}
      {/* O tecido nascendo: um desenho de losango, linha a linha */}
      <rect x="44" y="128" width="64" height="22" rx="2" fill="var(--cor-ante-cartao)" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.2" />
      {["..##..", ".####.", "######", ".####.", "..##.."].map((linha, l) =>
        [...linha].map((c, k) =>
          c === "#" ? <rect key={`${l}-${k}`} x={52 + k * 8} y={130 + l * 3.9} width="8" height="3.9" fill={l % 2 === 0 ? "var(--cor-ante-fio-a)" : "var(--cor-ante-fio-b)"} /> : null,
        ),
      )}
      {/* A lançadeira: cruza o tecido quando ela fala */}
      <motion.g animate={andando ? { x: [0, 52, 0] } : { x: 0 }} transition={andando ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}>
        <path d="M46 125q8-5 16 0q-8 5-16 0z" fill="var(--cor-ante-madeira-clara)" {...CONTORNO} strokeWidth={1.4} />
        <path d="M54 125h-6" stroke="var(--cor-ante-fio-c)" strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>
      {/* A corrente de cartões, descendo em laço do lado direito */}
      <path d="M124 58C150 64 150 120 132 142" fill="none" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.5" strokeDasharray="2 3" />
      <motion.g animate={andando ? { y: [0, 13] } : { y: 0 }} transition={andando ? { duration: 0.55, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}>
        {FUROS.map((furos, i) => (
          <CartaoDaCorrente key={i} y={58 + i * 13} furos={furos} />
        ))}
      </motion.g>
      {/* A cabeça: a caixa de leitura dos cartões, de madeira, com rendinha embaixo */}
      <rect x="34" y="26" width="84" height="56" rx="16" fill="var(--cor-ante-madeira)" {...CONTORNO} />
      <rect x="40" y="31" width="72" height="44" rx="12" fill="var(--cor-ante-cartao)" />
      <path d="M38 80q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0q4 5 8 0" fill="var(--cor-ante-branco)" stroke="var(--cor-ante-cartao-sombra)" strokeWidth="1.2" />
      {/* O coque de novelo, com as duas agulhas */}
      <path d="M58 20l40 -16M62 4l34 18" stroke="var(--cor-ante-madeira-sombra)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="76" cy="18" r="13" fill="var(--cor-ante-fio-a)" {...CONTORNO} />
      <path d="M66 12q10 6 20 0M64 19q12 7 24 0M67 26q9 4 18 0" fill="none" stroke="var(--cor-ante-branco)" strokeOpacity="0.55" strokeWidth="1.4" />
      {/* O rosto: óculos redondos, olhos, bochechas e a boca */}
      <Olhos x1={63} x2={89} y={51} raio={4.2} cor="var(--cor-ante-rosto)" expressao={expressao} piscando={piscando} />
      <g fill="none" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.8">
        <circle cx="63" cy="51" r="9" />
        <circle cx="89" cy="51" r="9" />
        <path d="M72 50q4-3 8 0" />
      </g>
      <Bochechas x1={55} x2={97} y={63} raio={5} />
      <Boca x={76} y={66} largura={13} cor="var(--cor-ante-rosto)" expressao={expressao} forma={boca} />
    </g>
  );
}

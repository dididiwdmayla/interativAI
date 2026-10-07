"use client";

/*
 * Onde a programação vive (sala 6): uma rua da cidade com código em todo
 * lugar. Cada lugar acende quando é tocado e abre o cartão "por dentro":
 * o pedacinho do programa, o que ele faz e quem programa aquilo, com o
 * caminho para a tela de Profissões. Os lugares já abertos ganham um
 * selinho de código.
 */
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EstacaoCidade as DadosCidade, EstadoCidade, FiguraCidade } from "@/motor/exposicao/simulacoes/cidade";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

/** Onde cada figura fica na rua (viewBox 0 0 320 160). */
const LUGAR: Record<FiguraCidade, { x: number; y: number }> = {
  padaria: { x: 40, y: 58 },
  "caixa-eletronico": { x: 104, y: 74 },
  semaforo: { x: 162, y: 54 },
  "ponto-onibus": { x: 214, y: 74 },
  carro: { x: 132, y: 128 },
  "app-banco": { x: 280, y: 100 },
};

function Figura({ figura, acesa }: { figura: FiguraCidade; acesa: boolean }) {
  const reduzir = useReducedMotion();
  const { x, y } = LUGAR[figura];
  const contorno = { stroke: "var(--cor-cena-contorno)", strokeWidth: 1.5 };
  switch (figura) {
    case "padaria":
      return (
        <g>
          <rect x={x - 28} y={y - 22} width="56" height="64" fill="var(--cor-cena-fachada)" {...contorno} />
          <path d={`M${x - 32} ${y - 22} h64 l-4 12 h-56z`} fill="var(--cor-cena-toldo)" {...contorno} />
          <rect x={x - 20} y={y + 2} width="18" height="20" fill="var(--cor-cena-vidro)" {...contorno} />
          <rect x={x + 4} y={y + 2} width="16" height="40" fill="var(--cor-cena-madeira)" {...contorno} />
          <text x={x} y={y - 26} textAnchor="middle" fontSize="8" fontWeight="900" fill="var(--cor-cena-letreiro)">PADARIA</text>
        </g>
      );
    case "caixa-eletronico":
      return (
        <g>
          <rect x={x - 12} y={y - 18} width="24" height="44" rx="3" fill="var(--cor-cena-metal)" {...contorno} />
          <rect x={x - 8} y={y - 13} width="16" height="11" rx="1" fill={acesa ? "var(--cor-cena-luz)" : "var(--cor-cena-vidro)"} {...contorno} />
          <path d={`M${x - 7} ${y + 4}h14M${x - 7} ${y + 9}h14`} stroke="var(--cor-cena-metal-sombra)" strokeWidth="2" />
          <rect x={x - 6} y={y + 15} width="12" height="3" fill="var(--cor-cena-escuro)" />
        </g>
      );
    case "semaforo":
      return (
        <g>
          <rect x={x - 1.5} y={y + 16} width="3" height="44" fill="var(--cor-cena-metal-sombra)" />
          <rect x={x - 8} y={y - 22} width="16" height="40" rx="3" fill="var(--cor-cena-escuro)" {...contorno} />
          {[
            ["var(--cor-cena-sinal-vermelho)", -14],
            ["var(--cor-cena-sinal-amarelo)", -2],
            ["var(--cor-cena-sinal-verde)", 10],
          ].map(([cor, dy], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y + Number(dy)}
              r="4.5"
              fill={String(cor)}
              initial={false}
              animate={reduzir ? { opacity: i === 2 ? 1 : 0.3 } : { opacity: [i === 0 ? 1 : 0.25, i === 2 ? 1 : 0.25, i === 1 ? 1 : 0.25, i === 0 ? 1 : 0.25] }}
              transition={reduzir ? undefined : { duration: 6, repeat: Infinity, times: [0, 0.33, 0.66, 1] }}
            />
          ))}
        </g>
      );
    case "ponto-onibus":
      return (
        <g>
          <rect x={x - 22} y={y - 22} width="44" height="4" fill="var(--cor-cena-metal)" {...contorno} />
          <rect x={x - 20} y={y - 18} width="2.5" height="44" fill="var(--cor-cena-metal-sombra)" />
          <rect x={x + 17.5} y={y - 18} width="2.5" height="44" fill="var(--cor-cena-metal-sombra)" />
          <rect x={x - 14} y={y - 12} width="28" height="12" rx="1" fill="var(--cor-cena-escuro)" {...contorno} />
          <text x={x} y={y - 3.5} textAnchor="middle" fontSize="6.5" fontWeight="900" fontFamily="monospace" fill="var(--cor-cena-led)">
            4 min
          </text>
        </g>
      );
    case "carro":
      return (
        <motion.g animate={reduzir ? undefined : { x: [-4, 4, -4] }} transition={reduzir ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <path d={`M${x - 26} ${y + 4} v-9 l8 -10 h28 l10 10 h6 v9z`} fill="var(--cor-cliente-roupa-vermelho)" {...contorno} />
          <rect x={x - 14} y={y - 13} width="10" height="8" fill="var(--cor-cena-vidro)" />
          <rect x={x - 1} y={y - 13} width="11" height="8" fill="var(--cor-cena-vidro)" />
          <circle cx={x - 16} cy={y + 5} r="5" fill="var(--cor-cena-escuro)" />
          <circle cx={x + 14} cy={y + 5} r="5" fill="var(--cor-cena-escuro)" />
        </motion.g>
      );
    case "app-banco":
      return (
        <g>
          {/* Uma pessoa no ponto, com o celular na mão. */}
          <circle cx={x - 10} cy={y - 26} r="6" fill="var(--cor-cena-pele)" {...contorno} />
          <rect x={x - 16} y={y - 19} width="12" height="22" rx="4" fill="var(--cor-cena-pessoa)" {...contorno} />
          <rect x={x - 3} y={y - 22} width="14" height="24" rx="2.5" fill="var(--cor-ante-celular)" {...contorno} />
          <rect x={x - 1} y={y - 19} width="10" height="17" rx="1" fill={acesa ? "var(--cor-cena-luz)" : "var(--cor-ante-celular-tela)"} />
          <path d={`M${x + 1} ${y - 14}h6M${x + 1} ${y - 10}h4`} stroke="var(--cor-cena-contorno)" strokeWidth="1" />
        </g>
      );
  }
}

export function EstacaoCidade({ estacao, estado, mexer, toque, destaque }: PropsEstacao<DadosCidade, EstadoCidade>) {
  const reduzir = useReducedMotion();
  const aberto = estacao.lugares.find((l) => l.id === estado.aberto);
  return (
    <div className="flex flex-col gap-2" data-estacao-cidade={estacao.id}>
      <NucleoDaEstacao tipo="cidade">
        <svg viewBox="0 0 320 160" className="h-auto w-full rounded-2xl border-2 border-borda" role="group" aria-label="A cidade: toque num lugar para ver o código de dentro" data-cena-cidade>
          <rect x="0" y="0" width="320" height="110" fill="var(--cor-cena-ceu-dia)" />
          <circle cx="292" cy="22" r="10" fill="var(--cor-cena-luz)" opacity="0.8" />
          {/* Prédios ao fundo. */}
          {[
            [70, 20, 34],
            [120, 8, 28],
            [190, 14, 40],
            [245, 28, 30],
          ].map(([x, y, l]) => (
            <rect key={x} x={x} y={y} width={l} height={110 - y} fill="var(--cor-cena-parede-sombra)" opacity="0.55" />
          ))}
          <rect x="0" y="98" width="320" height="12" fill="var(--cor-cena-calcada)" />
          <rect x="0" y="110" width="320" height="50" fill="var(--cor-cena-escuro)" />
          <path d="M0 135 H320" stroke="var(--cor-cena-claro)" strokeWidth="2" strokeDasharray="12 10" />
          {estacao.lugares.map((lugar) => {
            const visto = estado.abertos.includes(lugar.id);
            const ativo = estado.aberto === lugar.id;
            const { x, y } = LUGAR[lugar.figura];
            return (
              <g
                key={lugar.id}
                role="button"
                tabIndex={0}
                aria-label={`${lugar.nome}${visto ? " (já aberto)" : ""}`}
                className="cursor-pointer"
                onClick={() => mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: `abrir:${lugar.id}` })}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    mexer({ tipo: "comandoNaEstacao", estacao: estacao.id, comando: `abrir:${lugar.id}` });
                  }
                }}
                data-lugar-cidade={lugar.id}
                data-visto={visto ? "sim" : "nao"}
              >
                {(ativo || destaque?.peca === lugar.id) && <circle cx={x} cy={y} r="34" fill="var(--cor-destaque)" opacity="0.25" />}
                <Figura figura={lugar.figura} acesa={ativo} />
                {visto ? (
                  <g>
                    <rect x={x + 10} y={y - 38} width="20" height="12" rx="3" fill="var(--cor-primaria)" />
                    <text x={x + 20} y={y - 29.5} textAnchor="middle" fontSize="8" fontWeight="900" fontFamily="monospace" fill="var(--cor-texto-sobre-primaria)">
                      {"{ }"}
                    </text>
                  </g>
                ) : (
                  !reduzir && (
                    <motion.circle cx={x + 20} cy={y - 32} r="4" fill="var(--cor-destaque)" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
                  )
                )}
                {/* A área de toque, por cima de tudo e parada (a bolinha que pulsa e o carro andando não mudam ela). */}
                <rect x={x - 32} y={y - 34} width="64" height="72" fill="transparent" data-comando={`abrir:${lugar.id}`} />
              </g>
            );
          })}
        </svg>
      </NucleoDaEstacao>
      <p className="text-xs font-bold text-texto-suave">
        {estado.abertos.length} de {estacao.lugares.length} lugares abertos. {toque ? "Toque" : "Clique"} num lugar da cidade.
      </p>
      <AnimatePresence mode="wait">
        {aberto && (
          <motion.section
            key={aberto.id}
            initial={reduzir ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-1.5 rounded-2xl border-2 border-borda bg-superficie p-3"
            aria-label={`Por dentro: ${aberto.nome}`}
            data-por-dentro={aberto.id}
          >
            <p className="text-sm font-black text-texto">Por dentro: {aberto.nome}</p>
            <pre className="overflow-x-auto rounded-lg bg-codigo-fundo px-2 py-1.5 font-codigo text-[12px] leading-snug text-codigo-texto">{aberto.codigo.join("\n")}</pre>
            <p className="text-xs text-texto">{aberto.explica}</p>
            <p className="text-xs text-texto">
              <span className="font-black">Quem programa:</span> {aberto.quem}
            </p>
            {aberto.profissao && (
              <Link href="/profissoes" className="self-start text-xs font-black text-primaria underline underline-offset-2" data-link-profissoes>
                Ver essa profissão na tela de Profissões
              </Link>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

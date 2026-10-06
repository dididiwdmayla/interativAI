"use client";

/*
 * Um antepassado falando: o desenho dele e o balão no jeito da época.
 *
 * - A tecelã fala tecendo: o texto vira trama sobre o pano listrado, com a
 *   lançadeira correndo na ponta da linha.
 * - A sonhadora fala girando engrenagens no canto do balão de latão.
 * - O gigante fala palavra por palavra, e cada palavra acende uma válvula
 *   em cima do balão (e no corpo dele).
 * - O terminal fala em letras verdes maiúsculas, sem acento, com o cursor
 *   de bloco piscando no fim.
 * - O PC bege fala no quadro azul, com bipes de 8 bits.
 * - A internet fala depois do chiado: o texto chega embaralhado e vai se
 *   ajeitando, com a barra de "conectando".
 * - O celular fala em notificações, uma por frase.
 *
 * O leitor de tela ouve a fala inteira uma vez, com acentos (a encenação é
 * só visual). Tocar no balão completa a fala.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useRef } from "react";
import { tocarEfeito } from "@/audio/motor";
import type { IdEfeito } from "@/audio/efeitos";
import { FICHAS_ANTEPASSADOS, frasesDoTexto, type JeitoDeFalar, textoDeTerminal } from "@/motor/exposicao/antepassados";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import { Antepassado } from "./antepassados/Antepassado";
import type { ExpressaoAntepassado } from "./antepassados/partes";
import { type ModoFala, useFalaNoTempo } from "./useFalaNoTempo";

const MODO: Record<JeitoDeFalar, ModoFala> = {
  trama: "letra",
  engrenagens: "letra",
  valvulas: "palavra",
  terminal: "letra",
  "oito-bits": "letra",
  modem: "decodificar",
  notificacao: "frase",
  balao: "letra",
};

/** O som de cada pedaço e de quantos em quantos pedaços ele toca (letra a letra seria uma metralhadora). */
const SOM: Record<JeitoDeFalar, { id: IdEfeito; cada: number } | null> = {
  trama: { id: "fala-tear", cada: 5 },
  engrenagens: { id: "fala-engrenagem", cada: 3 },
  valvulas: { id: "fala-valvula", cada: 1 },
  terminal: { id: "fala-terminal", cada: 2 },
  "oito-bits": { id: "fala-8bit", cada: 2 },
  modem: { id: "fala-modem", cada: 4 },
  notificacao: { id: "fala-notificacao", cada: 1 },
  balao: null,
};

type Props = {
  id: IdAntepassado;
  texto: string;
  expressao?: ExpressaoAntepassado;
  /** Tamanho do desenho. */
  tamanho?: number;
  /** "lado": o desenho à esquerda e o balão à direita; "pilha": o desenho em cima. */
  arranjo?: "lado" | "pilha";
  /** Sem som (a fala que se repete, a miniatura). */
  mudo?: boolean;
  className?: string;
};

/** Uma engrenagem pequena para o canto do balão da sonhadora. */
function EngrenagemDoBalao({ girando }: { girando: boolean }) {
  const dentes = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 8;
    return `M${(10 + Math.cos(a) * 6).toFixed(2)} ${(10 + Math.sin(a) * 6).toFixed(2)}L${(10 + Math.cos(a) * 9).toFixed(2)} ${(10 + Math.sin(a) * 9).toFixed(2)}`;
  }).join("");
  return (
    <motion.svg viewBox="0 0 20 20" className="h-6 w-6 shrink-0" aria-hidden="true" animate={girando ? { rotate: 360 } : { rotate: 0 }} transition={girando ? { duration: 1.6, repeat: Infinity, ease: "linear" } : undefined}>
      <path d={dentes} stroke="var(--cor-ante-latao-sombra)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="10" cy="10" r="6" fill="var(--cor-ante-latao)" stroke="var(--cor-ante-latao-sombra)" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2" fill="var(--cor-ante-latao-sombra)" />
    </motion.svg>
  );
}

/** A lançadeira da tecelã, correndo na ponta da linha. */
function Lancadeira() {
  return (
    <svg viewBox="0 0 22 10" className="ml-0.5 inline-block h-2.5 w-5 align-middle" aria-hidden="true">
      <path d="M1 5q10-7 20 0q-10 7-20 0z" fill="var(--cor-ante-madeira-clara)" stroke="var(--cor-ante-madeira-sombra)" strokeWidth="1.2" />
      <path d="M6 5h-6" stroke="var(--cor-ante-fio-a)" strokeWidth="1.5" />
    </svg>
  );
}

export function FalaAntepassado({ id, texto, expressao = "feliz", tamanho = 96, arranjo = "lado", mudo = false, className = "" }: Props) {
  const ficha = FICHAS_ANTEPASSADOS[id];
  const jeito = ficha.jeito;
  const visivel = jeito === "terminal" ? textoDeTerminal(texto) : texto;
  const ultimoSom = useRef(0);
  const som = SOM[jeito];
  const aoAvancar = useCallback(
    (passo: number) => {
      if (mudo || !som || passo % som.cada !== 0) return;
      const agora = performance.now();
      if (agora - ultimoSom.current < 55) return;
      ultimoSom.current = agora;
      tocarEfeito(som.id);
    },
    [mudo, som],
  );
  const fala = useFalaNoTempo(visivel, MODO[jeito], aoAvancar);
  const falando = !fala.completo;

  const desenho = (
    <Antepassado id={id} expressao={expressao} falando={falando} letraAtual={fala.letraAtual} passos={fala.passos} tamanho={tamanho} className="h-auto shrink-0" />
  );

  /** O texto que aparece, reservando o espaço do texto inteiro (o balão não pula de tamanho). */
  const linhaReservada = (conteudo: React.ReactNode, classe = "") => (
    <p className={`relative ${classe}`} aria-hidden="true">
      <span className="invisible">{visivel}</span>
      <span className="absolute inset-0" data-texto-antepassado>
        {conteudo}
      </span>
    </p>
  );

  let balao: React.ReactNode;
  switch (jeito) {
    case "trama":
      balao = (
        <div className="rounded-2xl border-2 border-[var(--cor-ante-madeira)] bg-[var(--cor-ante-cartao)] px-4 py-3 text-[15px] font-bold leading-relaxed text-[var(--cor-ante-rosto)] [background-image:repeating-linear-gradient(90deg,transparent_0_7px,var(--cor-ante-cartao-sombra)_7px_8px)]">
          {linhaReservada(
            <>
              <span className="[text-decoration:underline_2px_var(--cor-ante-fio-a)] [text-underline-offset:5px]">{fala.mostrado}</span>
              {falando && <Lancadeira />}
            </>,
          )}
        </div>
      );
      break;
    case "engrenagens":
      balao = (
        <div className="flex items-start gap-2 rounded-2xl border-2 border-[var(--cor-ante-latao-sombra)] bg-[var(--cor-ante-latao-brilho)] px-3 py-3 text-[15px] font-bold leading-snug text-[var(--cor-ante-rosto)]">
          <EngrenagemDoBalao girando={falando} />
          <div className="min-w-0 flex-1">{linhaReservada(fala.mostrado)}</div>
        </div>
      );
      break;
    case "valvulas": {
      const palavras = Math.min(fala.total, 14);
      balao = (
        <div className="rounded-2xl border-2 border-[var(--cor-ante-gabinete-sombra)] bg-[var(--cor-ante-gabinete)] px-4 py-3 text-[15px] font-black leading-snug text-[var(--cor-ante-branco)]">
          <div className="mb-1.5 flex gap-1" aria-hidden="true">
            {Array.from({ length: palavras }, (_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2 rounded-t-full border border-[var(--cor-ante-contorno)] ${i < Math.min(fala.passos, palavras) ? "bg-[var(--cor-ante-valvula-brilho)] shadow-[0_0_6px_var(--cor-ante-valvula-brilho)]" : "bg-[var(--cor-ante-valvula-apagada)]"}`}
              />
            ))}
          </div>
          {linhaReservada(fala.mostrado)}
        </div>
      );
      break;
    }
    case "terminal":
      balao = (
        <div className="rounded-lg border-4 border-[var(--cor-ante-terminal-casca)] bg-[var(--cor-ante-terminal-tela)] px-3 py-2.5 font-codigo text-[14px] font-bold leading-snug tracking-wide text-[var(--cor-ante-terminal-fosforo)] [text-shadow:0_0_6px_var(--cor-ante-terminal-fosforo)]">
          {linhaReservada(
            <>
              {fala.mostrado}
              <span className="ml-0.5 inline-block h-[1em] w-[0.6em] translate-y-[2px] animate-pulse bg-[var(--cor-ante-terminal-fosforo)] motion-reduce:animate-none" />
            </>,
          )}
        </div>
      );
      break;
    case "oito-bits":
      balao = (
        <div className="rounded-md border-4 border-[var(--cor-ante-bege)] bg-[var(--cor-ante-pc-tela)] px-3 py-2.5 font-codigo text-[14px] font-bold leading-snug text-[var(--cor-ante-pc-texto)]">
          <p className="mb-1 text-[11px] opacity-70" aria-hidden="true">
            {fala.completo ? "PRONTO." : "CARREGANDO..."}
          </p>
          {linhaReservada(
            <>
              {fala.mostrado}
              {falando && <span className="ml-0.5">_</span>}
            </>,
          )}
        </div>
      );
      break;
    case "modem":
      balao = (
        <div className="rounded-2xl border-2 border-[var(--cor-ante-modem)] bg-[var(--cor-superficie)] px-4 py-3 text-[15px] font-bold leading-snug text-[var(--cor-texto)]">
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-black uppercase tracking-wide text-[var(--cor-texto-suave)]" aria-hidden="true">
            <span>{fala.completo ? "Conectada" : "Conectando"}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--cor-borda)]">
              <span className="block h-full rounded-full bg-[var(--cor-ante-led)]" style={{ width: `${Math.round((fala.passos / Math.max(1, fala.total)) * 100)}%` }} />
            </span>
          </div>
          {linhaReservada(<span className={falando ? "font-codigo" : ""}>{falando ? fala.embaralhado : visivel}</span>)}
        </div>
      );
      break;
    case "notificacao": {
      const frases = frasesDoTexto(visivel).slice(0, Math.max(1, fala.passos));
      balao = (
        <ul className="flex flex-col gap-1.5" aria-hidden="true">
          <AnimatePresence initial={false}>
            {frases.map((frase, i) => (
              <motion.li
                key={`${i}-${frase}`}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="flex items-start gap-2 rounded-2xl border-2 border-[var(--cor-borda)] bg-[var(--cor-superficie)] px-3 py-2 text-[14px] font-bold leading-snug text-[var(--cor-texto)] shadow-[0_4px_0_var(--cor-sombra)]"
              >
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-md bg-[var(--cor-ante-notificacao)]" />
                <span className="min-w-0 flex-1">{frase}</span>
                <span className="shrink-0 text-[10px] font-black uppercase text-[var(--cor-texto-suave)]">agora</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      );
      break;
    }
    case "balao":
      balao = (
        <div className="rounded-2xl border-2 border-borda bg-painel px-4 py-3 text-[15px] font-bold leading-snug text-texto">{linhaReservada(fala.mostrado)}</div>
      );
      break;
  }

  return (
    <div
      className={`flex ${arranjo === "lado" ? "items-end gap-3" : "flex-col items-center gap-2"} ${className}`}
      data-fala-antepassado={id}
      data-jeito={jeito}
      data-fala-completa={fala.completo ? "sim" : "nao"}
    >
      {desenho}
      {/* Tocar no balão completa a fala (atalho de quem lê rápido; o leitor de tela já ouve tudo). */}
      <div onClick={fala.completar} className={`min-w-0 ${arranjo === "lado" ? "flex-1" : "w-full"} text-left`}>
        <p className="sr-only" aria-live="polite">
          {texto}
        </p>
        <span className="mb-1 block text-[11px] font-black uppercase tracking-wide text-texto-suave" aria-hidden="true">
          {ficha.nome} <span className="font-bold normal-case tracking-normal">· {ficha.epoca}</span>
        </span>
        {balao}
      </div>
    </div>
  );
}

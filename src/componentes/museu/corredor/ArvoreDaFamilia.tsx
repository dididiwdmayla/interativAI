"use client";

/*
 * O fim do corredor: a árvore da família, das raízes (a tecelã) até o
 * computadorzinho e, no alto, o lugar da próxima geração, vazio, com a
 * placa. Quando a sala 2 termina, o lugar abre: o aluno monta o retrato e
 * entra para a família. O lugar acende, a família inteira dá as
 * boas-vindas, cada um no jeito da sua época, e a placa ganha o nome dele.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { tocarEfeito } from "@/audio/motor";
import { RetratoCliente } from "@/componentes/contrato/Cliente";
import { Antepassado } from "@/componentes/museu/antepassados/Antepassado";
import { Botao } from "@/componentes/ui/Botao";
import { FICHAS_ANTEPASSADOS, ORDEM_DO_CORREDOR, textoDeTerminal } from "@/motor/exposicao/antepassados";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import type { RetratoDoAluno } from "@/lib/progresso";

/** Quanto tempo cada parente leva para dar as boas-vindas, um depois do outro. */
const MS_POR_BOAS_VINDAS = 950;

/** Os confetes da entrada na família: posições fixas (iguais no servidor e no cliente). */
const CONFETES = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 41) % 100,
  atraso: ((i * 7) % 10) / 10,
  giro: (i % 2 ? 1 : -1) * (160 + ((i * 53) % 200)),
  cor: ["var(--cor-primaria)", "var(--cor-secundaria)", "var(--cor-destaque)", "var(--cor-sucesso)", "var(--cor-ante-fio-a)"][i % 5],
}));

/** O balãozinho de boas-vindas de um parente, no jeito da época dele. */
function BoasVindas({ id }: { id: IdAntepassado }) {
  const ficha = FICHAS_ANTEPASSADOS[id];
  const estilo: Record<typeof ficha.jeito, string> = {
    trama: "border-[var(--cor-ante-madeira)] bg-[var(--cor-ante-cartao)] text-[var(--cor-ante-rosto)] underline decoration-[var(--cor-ante-fio-a)] decoration-2 underline-offset-4",
    engrenagens: "border-[var(--cor-ante-latao-sombra)] bg-[var(--cor-ante-latao-brilho)] text-[var(--cor-ante-rosto)]",
    valvulas: "border-[var(--cor-ante-gabinete-sombra)] bg-[var(--cor-ante-gabinete)] font-black text-[var(--cor-ante-branco)]",
    terminal: "border-[var(--cor-ante-terminal-casca)] bg-[var(--cor-ante-terminal-tela)] font-codigo text-[var(--cor-ante-terminal-fosforo)]",
    "oito-bits": "border-[var(--cor-ante-bege)] bg-[var(--cor-ante-pc-tela)] font-codigo text-[var(--cor-ante-pc-texto)]",
    modem: "border-[var(--cor-ante-modem)] bg-superficie text-texto",
    notificacao: "border-borda bg-superficie text-texto shadow-[0_3px_0_var(--cor-sombra)]",
    balao: "border-primaria bg-painel text-texto",
  };
  return (
    <motion.p
      initial={{ opacity: 0, scale: 0.7, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 20 }}
      className={`max-w-[11rem] rounded-xl border-2 px-2 py-1 text-[11px] font-bold leading-snug ${estilo[ficha.jeito]}`}
      data-boas-vindas={id}
    >
      {ficha.jeito === "terminal" ? textoDeTerminal(ficha.boasVindas) : ficha.boasVindas}
    </motion.p>
  );
}

type Props = {
  /** A sala 2 terminou: o lugar está aberto. */
  aberta: boolean;
  retrato: RetratoDoAluno | null;
  /** Acabou de entrar (a festa toca agora). */
  festa: boolean;
  animar: boolean;
  aoOcupar: () => void;
  /** A família inteira já deu as boas-vindas (o fim da festa). */
  aoTerminarFesta?: () => void;
};

export function ArvoreDaFamilia({ aberta, retrato, festa, animar, aoOcupar, aoTerminarFesta }: Props) {
  // Da raiz para o alto: a tecelã embaixo, o computadorzinho em cima (a tela mostra de cima para baixo).
  const geracoes = [...ORDEM_DO_CORREDOR].reverse();
  const [falaram, setFalaram] = useState(festa ? 0 : geracoes.length);
  const [festaConhecida, setFestaConhecida] = useState(festa);
  if (festaConhecida !== festa) {
    setFestaConhecida(festa);
    if (festa) setFalaram(0);
  }
  // Na festa, um parente de cada vez dá as boas-vindas, das raízes até o computadorzinho.
  useEffect(() => {
    if (!festa || falaram >= geracoes.length) return;
    const proximo = setTimeout(() => setFalaram((atual) => atual + 1), falaram === 0 ? 1400 : animar ? MS_POR_BOAS_VINDAS : 120);
    return () => clearTimeout(proximo);
  }, [animar, falaram, festa, geracoes.length]);
  useEffect(() => {
    if (festa) tocarEfeito("proxima-geracao");
  }, [festa]);
  const terminou = festa && falaram >= geracoes.length;
  const avisar = useRef(aoTerminarFesta);
  useEffect(() => {
    avisar.current = aoTerminarFesta;
  }, [aoTerminarFesta]);
  useEffect(() => {
    if (terminou) avisar.current?.();
  }, [terminou]);
  // Os que já falaram (contando das raízes, que estão no fim da lista).
  const jaFalou = (id: IdAntepassado) => festa && geracoes.length - geracoes.indexOf(id) <= falaram;
  const estado = retrato ? "ocupada" : aberta ? "aberta" : "vazia";

  return (
    <section className="relative flex w-full flex-col items-center" aria-label="A árvore da família" data-arvore data-proxima-geracao={estado}>
      {festa && (
        <svg className="pointer-events-none absolute inset-0 z-20 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {CONFETES.map((confete, i) => (
            <motion.rect
              key={i}
              width={2}
              height={1.1}
              fill={confete.cor}
              initial={false}
              animate={animar ? { y: [-8, 108], rotate: [0, confete.giro] } : { y: 6 + ((i * 31) % 80) }}
              transition={animar ? { duration: 2.8 + confete.atraso, repeat: 2, delay: confete.atraso, ease: "linear" } : undefined}
              style={{ x: confete.x }}
            />
          ))}
        </svg>
      )}
      {/* O lugar da próxima geração, no alto */}
      <div className="relative flex flex-col items-center" data-lugar-proxima-geracao>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 h-48 w-48 rounded-full"
          style={{ background: "radial-gradient(circle, var(--cor-museu-luz) 0%, transparent 68%)" }}
          initial={false}
          animate={estado === "vazia" ? { opacity: 0.15 } : animar && estado === "aberta" ? { opacity: [0.4, 0.95, 0.4] } : { opacity: 0.9 }}
          transition={estado === "aberta" && animar ? { duration: 2.2, repeat: Infinity } : { duration: 0.6 }}
        />
        <div
          className={`relative grid h-32 w-32 place-items-center overflow-hidden rounded-full border-4 ${retrato ? "border-[var(--cor-ante-latao)] bg-[var(--cor-museu-placa)]" : "border-dashed border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-parede-sombra)]"}`}
        >
          <AnimatePresence mode="wait">
            {retrato ? (
              <motion.div
                key="retrato"
                initial={festa && animar ? { scale: 0.2, opacity: 0, y: 30 } : false}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 12, delay: festa ? 0.4 : 0 }}
                className="translate-y-3"
              >
                <RetratoCliente aparencia={retrato.aparencia} nome={retrato.nome || "Você"} expressao={festa ? "empolgado" : "feliz"} tamanho={104} />
              </motion.div>
            ) : (
              <motion.span key="vazio" className="text-4xl font-black text-[var(--cor-museu-placa-borda)]" aria-hidden="true">
                ?
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mt-2 rounded-xl border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-placa)] px-3 py-1.5 text-center" data-placa-proxima-geracao>
          <p className="text-[11px] font-black uppercase tracking-wide text-texto-suave">A próxima geração</p>
          {retrato ? (
            <p className="text-sm font-black text-texto">
              {retrato.nome || "Você"} <span className="font-bold text-texto-suave">· também programa</span>
            </p>
          ) : (
            <p className="text-xs font-bold text-texto-suave">{aberta ? "Este lugar está esperando por você." : "Termine a sala 2 para descobrir quem fica aqui."}</p>
          )}
        </div>
        {estado === "aberta" && (
          <Botao className="relative mt-2" onClick={aoOcupar} data-ocupar-lugar>
            Ocupar o lugar
          </Botao>
        )}
        {retrato && !festa && (
          <button type="button" onClick={aoOcupar} className="relative mt-1 min-h-11 text-xs font-black text-primaria underline" data-mudar-retrato>
            Mudar meu retrato
          </button>
        )}
      </div>
      {/* O tronco e as gerações, do computadorzinho (logo abaixo do lugar) até as raízes */}
      <ol className="relative mt-3 flex w-full max-w-sm flex-col gap-2 before:absolute before:bottom-0 before:left-1/2 before:top-0 before:w-2 before:-translate-x-1/2 before:rounded-full before:bg-[var(--cor-ante-madeira)]">
        {geracoes.map((id, i) => {
          const esquerda = i % 2 === 0;
          return (
            <li key={id} className={`relative flex items-center gap-2 ${esquerda ? "flex-row" : "flex-row-reverse"}`} data-geracao={id}>
              <div className={`flex w-1/2 items-center gap-2 ${esquerda ? "flex-row-reverse pr-3" : "pl-3"}`}>
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-[var(--cor-ante-madeira)] bg-[var(--cor-museu-parede)]">
                  <Antepassado id={id} expressao={jaFalou(id) || retrato ? "orgulhoso" : "feliz"} tamanho={id === "computadorzinho" ? 56 : 54} />
                </div>
                <AnimatePresence>{jaFalou(id) && <BoasVindas id={id} />}</AnimatePresence>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wide text-texto-suave">{FICHAS_ANTEPASSADOS[id].epoca}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

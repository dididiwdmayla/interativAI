"use client";

/*
 * O coral dos antepassados (sala 3): o mesmo programa roda em todas as
 * linguagens, e cada antepassado canta a sua versão na voz da sua época. O
 * cartão perfurado (a tecelã) canta o COBOL, o PC bege o BASIC, o terminal
 * verde o C, a internet dos anos 1990 o Java, e o computadorzinho fecha com
 * JavaScript e Python, rodando de verdade. No fim, todos juntos: é a mesma
 * coisa, dita de jeitos diferentes.
 */
import { motion, useReducedMotion } from "framer-motion";
import { FalaAntepassado } from "@/componentes/museu/FalaAntepassado";
import { Antepassado } from "@/componentes/museu/antepassados/Antepassado";
import type { CoralNoJogo } from "@/componentes/jogo/useExposicao";
import type { EstacaoComparador } from "@/motor/exposicao/comparador";
import type { IdAntepassado } from "@/motor/exposicao/modelo";
import { FICHAS_LINGUAGENS, type Linguagem, type ResultadoLinguagem, textosDaSaida } from "@/motor/linguagens/tipos";

/** Quem canta cada linguagem, e a frase de antes, no jeito dele. */
const CANTOR: Record<Linguagem, { id: IdAntepassado; frase: string }> = {
  cobol: { id: "tecela", frase: "Em COBOL, furadinho no cartão, meu bem:" },
  basic: { id: "pc", frase: "Em BASIC, direto do disquete! Bip:" },
  c: { id: "terminal", frase: "Em C. Compilado. Sem firula:" },
  java: { id: "internet", frase: "Em Java, conectando dos anos 1990:" },
  javascript: { id: "computadorzinho", frase: "Em JavaScript, aqui no navegador:" },
  python: { id: "computadorzinho", frase: "E em Python, rodando agora mesmo:" },
};

type Props = {
  estacao: EstacaoComparador;
  coral: CoralNoJogo;
  saidas: Partial<Record<Linguagem, ResultadoLinguagem | "rodando">>;
  aoFechar: () => void;
};

function oQueSaiu(resultado: ResultadoLinguagem | "rodando" | undefined): string {
  if (!resultado || resultado === "rodando") return "...";
  return textosDaSaida(resultado).join(" ") || "(nada)";
}

export function CoralDosAntepassados({ estacao, coral, saidas, aoFechar }: Props) {
  const reduzir = useReducedMotion();
  const linguagem = coral.linguagens[Math.min(coral.vez, coral.linguagens.length - 1)];
  const cantor = CANTOR[linguagem];
  const todos = [...new Map(coral.linguagens.map((l) => [CANTOR[l].id, l])).entries()];
  return (
    <section
      className="flex flex-col gap-2 rounded-2xl border-2 border-secundaria bg-[var(--cor-museu-placa)] p-3"
      aria-label="O coral dos antepassados"
      data-coral={estacao.id}
      data-coral-vez={coral.vez}
      data-coral-terminou={coral.terminou ? "sim" : "nao"}
    >
      {!coral.terminou ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-texto-suave">
            Coral: {coral.vez + 1} de {coral.linguagens.length} ({FICHAS_LINGUAGENS[linguagem].nome})
          </p>
          <FalaAntepassado key={`${linguagem}-${oQueSaiu(saidas[linguagem])}`} id={cantor.id} texto={`${cantor.frase} ${oQueSaiu(saidas[linguagem])}`} tamanho={72} arranjo="lado" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex flex-wrap items-end justify-center gap-1" aria-hidden="true">
            {todos.map(([id], i) => (
              <motion.div
                key={id}
                initial={reduzir ? false : { y: 0 }}
                animate={reduzir ? undefined : { y: [0, -6, 0] }}
                transition={reduzir ? undefined : { duration: 0.9, repeat: 2, delay: i * 0.08 }}
              >
                <Antepassado id={id} expressao="orgulhoso" falando={false} tamanho={48} className="h-auto" />
              </motion.div>
            ))}
          </div>
          <ul className="flex flex-wrap justify-center gap-1.5">
            {coral.linguagens.map((l) => (
              <li key={l} className="rounded-full bg-[var(--cor-terminal-fundo)] px-2 py-0.5 font-codigo text-[11px] text-[var(--cor-terminal-texto)]">
                {FICHAS_LINGUAGENS[l].nome}: {oQueSaiu(saidas[l])}
              </li>
            ))}
          </ul>
          <p className="text-sm font-black text-texto">Cada época com o seu jeito de escrever. Todos disseram a mesma coisa.</p>
          <button type="button" onClick={aoFechar} className="inline-flex min-h-11 items-center rounded-full border-2 border-borda bg-superficie px-4 text-sm font-black text-texto hover:bg-hover" data-fechar-coral>
            Voltar ao comparador
          </button>
        </div>
      )}
    </section>
  );
}

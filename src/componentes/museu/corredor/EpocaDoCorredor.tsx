"use client";

/*
 * Uma época do corredor: a parede com a faixa da época, o holofote, o
 * pedestal com o antepassado (silhueta dormindo até o aluno chegar perto) e,
 * embaixo, a porta da sala que ele recebe. Acordado, ele fala do jeito da
 * época dele.
 */
import { motion } from "framer-motion";
import Link from "next/link";
import { tocarEfeito } from "@/audio/motor";
import { IconeCadeado } from "@/componentes/icones/IconeCadeado";
import { Antepassado } from "@/componentes/museu/antepassados/Antepassado";
import { FalaAntepassado } from "@/componentes/museu/FalaAntepassado";
import type { EpocaNoCorredor } from "@/lib/museu";
import { rotaDaFase } from "@/lib/rotas";

type Props = {
  epoca: EpocaNoCorredor;
  acordado: boolean;
  /** Já pode falar (um tiquinho depois de acordar, para o som da época tocar antes). */
  falando: boolean;
  animar: boolean;
  vertical: boolean;
  /** Celular deitado: o antepassado à esquerda, a fala e a porta à direita. */
  deitado?: boolean;
};

function Estrelas({ quantas }: { quantas: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${quantas} de 3 estrelas`}>
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.8z" fill={i < quantas ? "var(--cor-destaque)" : "var(--cor-borda)"} stroke="var(--cor-ante-contorno)" strokeWidth="1" />
        </svg>
      ))}
    </span>
  );
}

export function EpocaDoCorredor({ epoca, acordado, falando, animar, vertical, deitado = false }: Props) {
  const { ficha, sala, fala } = epoca;
  const gigante = ficha.id === "valvulas";
  const tamanho = deitado ? (gigante ? 110 : 96) : vertical ? (gigante ? 150 : 124) : gigante ? 190 : 160;
  const largura = deitado ? "max-w-2xl" : "max-w-sm";
  return (
    <article
      className={`relative flex shrink-0 flex-col items-center ${vertical ? "w-full px-4 pb-6 pt-4" : "h-full w-[min(86vw,30rem)] px-5 pb-4 pt-3"}`}
      data-epoca={ficha.id}
      data-acordado={acordado ? "sim" : "nao"}
      aria-label={`${ficha.nome}, ${ficha.maquina}, ${ficha.epoca}`}
    >
      {/* A faixa da época, na parede */}
      <p className="relative z-10 rounded-full border-2 border-[var(--cor-museu-placa-borda)] bg-[var(--cor-museu-placa)] px-3 py-0.5 text-xs font-black uppercase tracking-wide text-texto">{ficha.epoca}</p>
      {/* O quadro na parede, com o nome da peça */}
      <div className="relative z-10 mt-2 rounded-md border-4 border-[var(--cor-ante-madeira)] bg-[var(--cor-museu-placa)] px-4 py-1.5 text-center shadow-[0_4px_0_var(--cor-sombra)]">
        <p className="text-sm font-black text-texto">{ficha.nome}</p>
        <p className="text-[11px] font-bold text-texto-suave">{ficha.maquina}</p>
      </div>
      {/* O holofote: acende quando ele acorda */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-6 h-[22rem] w-64 -translate-x-1/2"
        style={{ background: "radial-gradient(ellipse at 50% 0%, var(--cor-museu-luz) 0%, transparent 70%)" }}
        initial={false}
        animate={{ opacity: acordado ? 0.75 : 0.12 }}
        transition={{ duration: animar ? 0.8 : 0 }}
      />
      {/* O antepassado no pedestal (acordado, falando do jeito dele) */}
      <div className={`relative z-10 flex w-full flex-col items-center ${vertical ? "mt-2" : "mt-1 min-h-0 flex-1 justify-end"}`}>
        {acordado && falando ? (
          <FalaAntepassado id={ficha.id} texto={fala} tamanho={tamanho} arranjo={deitado ? "lado" : "pilha"} className={`w-full ${largura}`} />
        ) : (
          <>
            <Antepassado id={ficha.id} expressao={acordado ? "feliz" : "dormindo"} tamanho={tamanho} className="h-auto" />
            <p className="mt-1 h-10 text-center text-xs font-bold text-texto-suave">{acordado ? "" : "Chegue mais perto..."}</p>
          </>
        )}
        <div aria-hidden="true" className="-mt-1 h-5 w-40 rounded-[50%] bg-[var(--cor-museu-rodape)] shadow-[0_6px_0_var(--cor-sombra)]" />
      </div>
      {/* A porta da sala */}
      <div className={`relative z-10 mt-3 w-full ${largura} rounded-2xl border-2 border-[var(--cor-museu-placa-borda)] bg-superficie px-3 py-2`} data-porta-sala={sala?.id ?? "sem-sala"} data-estado-sala={sala?.estado ?? "nenhuma"}>
        {sala ? (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black uppercase tracking-wide text-texto-suave">Sala {sala.numero}</p>
              <p className="text-sm font-black leading-tight text-texto">{sala.titulo}</p>
              {sala.estado !== "planejada" && <Estrelas quantas={sala.estrelas} />}
            </div>
            {sala.estado === "planejada" ? (
              <span className="shrink-0 rounded-full bg-madeira px-2 py-0.5 text-[10px] font-black uppercase text-superficie">Em breve</span>
            ) : sala.acao ? (
              <Link
                href={rotaDaFase(sala.acao.faseId)}
                onClick={() => tocarEfeito("clique")}
                className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-primaria bg-primaria px-4 text-sm font-black text-sobre-primaria hover:brightness-110"
                data-entrar-sala={sala.id}
              >
                {sala.acao.rotulo === "Jogar" ? "Entrar" : sala.acao.rotulo}
              </Link>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-texto-suave">
                <IconeCadeado tamanho={14} /> Termine a sala anterior
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs font-bold text-texto-suave">{ficha.id === "valvulas" ? "Sem sala própria: aparece de visita nas salas 1 e 4." : "Hoje: o descendente da família, que guia você pelo jogo."}</p>
        )}
      </div>
    </article>
  );
}

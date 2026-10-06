"use client";

/*
 * O tear de cartões: cada cartão é uma linha do tecido. Tocar num lugar do
 * cartão fura (e tocar de novo tapa); o fio daquele lugar sobe e a cor
 * aparece no tecido, na mesma linha. Em cima, o desenho pedido. Com
 * `mostrarBinario`, cada cartão mostra os seus uns e zeros: a revelação.
 */
import { motion } from "framer-motion";
import { IconeCerto } from "@/componentes/icones/IconeCerto";
import { cartaoEmBits, diferencasDoTecido, type EstacaoTear as DadosTear, type EstadoTear } from "@/motor/exposicao/modelo";
import type { PropsEstacao } from "./tipos";

/** Uma grade de tecido (o pedido e o tecido do aluno), uma linha por cartão. */
function Tecido({ linhas, rotulo, pequeno = false }: { linhas: string[]; rotulo: string; pequeno?: boolean }) {
  return (
    <figure className="flex flex-col items-center gap-1" aria-label={rotulo}>
      <div className="rounded-lg border-2 border-[var(--cor-ante-madeira)] bg-[var(--cor-ante-cartao)] p-1">
        {linhas.map((linha, l) => (
          <div key={l} className="flex">
            {[...linha].map((c, k) => (
              <span
                key={k}
                className={`${pequeno ? "h-3 w-3" : "h-5 w-5"} ${c === "#" ? (l % 2 === 0 ? "bg-[var(--cor-ante-fio-a)]" : "bg-[var(--cor-ante-fio-b)]") : "bg-transparent"}`}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="text-[11px] font-black uppercase tracking-wide text-texto-suave">{rotulo}</figcaption>
    </figure>
  );
}

export function EstacaoTear({ estacao, estado, mexer, destaque }: PropsEstacao<DadosTear, EstadoTear>) {
  const pronto = diferencasDoTecido(estacao, estado) === 0;
  return (
    <div className="flex flex-col gap-3" data-estacao-tear={estacao.id}>
      <div className="flex flex-wrap items-start justify-center gap-4">
        <Tecido linhas={estacao.modelo} rotulo="O desenho pedido" pequeno />
        <div className="flex flex-col items-center">
          <Tecido linhas={estado.furos} rotulo="O seu tecido" />
          {pronto && (
            <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 inline-flex items-center gap-1 rounded-full bg-sucesso px-2 py-0.5 text-xs font-black text-superficie" data-tecido-pronto>
              <IconeCerto tamanho={12} /> Igual ao pedido
            </motion.p>
          )}
        </div>
      </div>
      <ol className="flex flex-col items-center gap-1.5" aria-label="Os cartões perfurados, um por linha do tecido">
        {estado.furos.map((cartao, linha) => (
          <li key={linha} className="flex items-center gap-2">
            <span className="w-5 text-right text-xs font-black text-texto-suave" aria-hidden="true">
              {linha + 1}
            </span>
            <div className="flex gap-1 rounded-md border-2 border-[var(--cor-ante-cartao-sombra)] bg-[var(--cor-ante-cartao)] px-1.5 py-1 shadow-[0_3px_0_var(--cor-ante-cartao-sombra)]">
              {[...cartao].map((c, coluna) => {
                const furado = c === "#";
                const pisca = destaque?.peca === `${linha}-${coluna}`;
                return (
                  <button
                    key={coluna}
                    type="button"
                    aria-pressed={furado}
                    aria-label={`Cartão ${linha + 1}, lugar ${coluna + 1}: ${furado ? "furado" : "sem furo"}`}
                    onClick={() => mexer({ tipo: "furarCartao", estacao: estacao.id, linha, coluna })}
                    className={`grid h-9 w-9 place-items-center rounded-full pointer-coarse:h-10 pointer-coarse:w-10 ${pisca ? "animate-pulse ring-4 ring-destaque" : ""}`}
                    data-furo={`${linha}-${coluna}`}
                    data-furado={furado ? "sim" : "nao"}
                  >
                    <span
                      className={`block rounded-full transition-all ${furado ? "h-5 w-5 bg-[var(--cor-ante-madeira-sombra)] shadow-[inset_0_2px_3px_var(--cor-ante-contorno)]" : "h-4 w-4 border-2 border-dashed border-[var(--cor-ante-cartao-sombra)]"}`}
                    />
                  </button>
                );
              })}
            </div>
            {estacao.mostrarBinario && (
              <span className="w-16 font-codigo text-sm font-black tracking-widest text-primaria" data-bits-do-cartao>
                {cartaoEmBits(cartao)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

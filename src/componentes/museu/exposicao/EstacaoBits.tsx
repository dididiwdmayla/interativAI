"use client";

/*
 * As lâmpadas de bits: cada uma acende ou apaga, e o número é a soma dos
 * pesos das acesas (8, 4, 2, 1). Com 8 bits e `letra`, o número também
 * vira a letra da tabela (65 é A). Na aparência "valvula", as lâmpadas são
 * válvulas dos anos 1940, que esquentam laranja.
 */
import { motion } from "framer-motion";
import { type EstacaoBits as DadosBits, type EstadoBits, letraDoNumero, pesosDosBits, valorDosBits } from "@/motor/exposicao/modelo";
import { NucleoDaEstacao } from "./NucleoDaEstacao";
import type { PropsEstacao } from "./tipos";

function Lampada({ acesa, valvula }: { acesa: boolean; valvula: boolean }) {
  if (valvula) {
    return (
      <svg viewBox="0 0 24 40" className="h-12 w-8" aria-hidden="true">
        {acesa && <ellipse cx="12" cy="14" rx="12" ry="14" fill="var(--cor-ante-valvula-brilho)" opacity="0.35" />}
        <path d="M5 30V10a7 7 0 0 1 14 0v20z" fill="var(--cor-ante-valvula-vidro)" stroke="var(--cor-ante-contorno)" strokeWidth="1.6" />
        {acesa && <path d="M5 30V10a7 7 0 0 1 14 0v20z" fill="var(--cor-ante-valvula-brilho)" opacity="0.45" />}
        <path
          d="M9 26V12M15 26V12M9 12h6"
          stroke={acesa ? "var(--cor-ante-valvula-brilho)" : "var(--cor-ante-valvula-apagada)"}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="4" y="30" width="16" height="7" rx="2" fill="var(--cor-ante-gabinete-sombra)" stroke="var(--cor-ante-contorno)" strokeWidth="1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 40" className="h-12 w-8" aria-hidden="true">
      {acesa && <circle cx="12" cy="13" r="12" fill="var(--cor-destaque)" opacity="0.35" />}
      <circle
        cx="12"
        cy="13"
        r="9"
        fill={acesa ? "var(--cor-destaque)" : "var(--cor-ante-valvula-vidro)"}
        stroke="var(--cor-ante-contorno)"
        strokeWidth="1.6"
      />
      <path d="M9 17l3-5 3 5" fill="none" stroke={acesa ? "var(--cor-ante-valvula-brilho)" : "var(--cor-ante-valvula-apagada)"} strokeWidth="1.6" />
      <rect x="7" y="22" width="10" height="12" rx="2" fill="var(--cor-ante-gabinete)" stroke="var(--cor-ante-contorno)" strokeWidth="1.4" />
    </svg>
  );
}

export function EstacaoBits({ estacao, estado, mexer, destaque }: PropsEstacao<DadosBits, EstadoBits>) {
  const pesos = pesosDosBits(estacao.quantos);
  const valor = valorDosBits(estado.bits);
  const acesas = pesos.filter((_, i) => estado.bits[i] === "1");
  const letra = estacao.letra ? letraDoNumero(valor) : null;
  return (
    <div className="flex flex-col items-center gap-3" data-estacao-bits={estacao.id}>
      <NucleoDaEstacao tipo="bits">
        <div
          className={`flex flex-wrap justify-center gap-1.5 rounded-2xl border-2 p-2 ${estacao.aparencia === "valvula" ? "border-[var(--cor-ante-gabinete-sombra)] bg-[var(--cor-ante-gabinete)]" : "border-borda bg-painel"}`}
        >
          {pesos.map((peso, indice) => {
            const acesa = estado.bits[indice] === "1";
            const pisca = destaque?.peca === String(indice);
            return (
              <button
                key={indice}
                type="button"
                aria-pressed={acesa}
                aria-label={`${estacao.aparencia === "valvula" ? "Válvula" : "Lâmpada"} que vale ${peso}: ${acesa ? "acesa" : "apagada"}`}
                onClick={() => mexer({ tipo: "alternarBit", estacao: estacao.id, indice })}
                className={`flex min-h-11 flex-col items-center rounded-xl px-1 pt-0.5 hover:bg-hover ${pisca ? "animate-pulse ring-4 ring-destaque" : ""}`}
                data-bit={indice}
                data-aceso={acesa ? "sim" : "nao"}
              >
                {estacao.pesos && (
                  <span className={`text-xs font-black ${estacao.aparencia === "valvula" ? "text-[var(--cor-ante-branco)]" : "text-texto-suave"}`}>{peso}</span>
                )}
                <Lampada acesa={acesa} valvula={estacao.aparencia === "valvula"} />
                <span className={`font-codigo text-sm font-black ${estacao.aparencia === "valvula" ? "text-[var(--cor-ante-branco)]" : "text-texto"}`}>
                  {acesa ? "1" : "0"}
                </span>
              </button>
            );
          })}
        </div>
      </NucleoDaEstacao>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center" aria-live="polite">
        <p className="text-sm font-bold text-texto-suave">{estacao.pesos ? (acesas.length ? `${acesas.join(" + ")} =` : "nada aceso =") : "Mostra o número"}</p>
        <motion.p key={valor} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="font-codigo text-4xl font-black text-primaria" data-valor-bits={valor}>
          {valor}
        </motion.p>
        {estacao.letra && (
          <p className="rounded-xl border-2 border-borda bg-superficie px-3 py-1 text-sm font-bold text-texto" data-letra-bits>
            Letra: <span className="font-codigo text-xl font-black text-secundaria">{letra ?? "nenhuma"}</span>
          </p>
        )}
      </div>
    </div>
  );
}
